import { z } from "zod";
import { protectedProcedure, router } from "../../trpc/server";
import { Logger } from "../utils/logger";
import { TRPCError } from "@trpc/server";

const logger = Logger.instance.child({
  router: "chat",
});

const messageSchema = z.object({
  content: z.string().min(1),
  userId: z.string(),
  timestamp: z.date(),
});

type ChatMessage = z.infer<typeof messageSchema>;

export const chatRouter = router({
  sendMessage: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const message: ChatMessage = {
          content: input.content,
          userId: ctx.session.user.id,
          timestamp: new Date(),
        };
        
        logger.info("Message sent", { 
          content: message.content,
          userId: message.userId 
        });
        
        ctx.chatEmitter.emit("newMessage", message);
        return message;
      } catch (error) {
        logger.error("Failed to send message", { error });
        throw error instanceof TRPCError ? error : new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
        });
      }
    }),

  onNewMessage: protectedProcedure
    .subscription(async function* ({ ctx }) {
      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      logger.info("New client subscribed", { 
        userId: ctx.session.user.id 
      });

      try {
        while (true) {
          const message = await new Promise<ChatMessage>((resolve) => {
            ctx.chatEmitter.once("newMessage", resolve);
          });
          
          logger.info("Message received", { 
            content: message.content,
            userId: message.userId 
          });
          
          yield message;
        }
      } catch (error) {
        logger.error("Subscription failed", { error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Subscription failed",
        });
      }
    }),
}); 