import { useTRPC, useTRPCClient } from "../../trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type ChatMessage = {
  content: string;
  userId: string;
  timestamp: string;
};

export const useChat = () => {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Subscribe to new messages
  useEffect(() => {
    console.log("Setting up chat subscription");
    const subscription = trpcClient.chat.onNewMessage.subscribe(undefined, {
      onData: (message: ChatMessage) => {
        console.log("Received new message:", message);
        // Ensure the message has all required fields
        if (!message.content || !message.userId || !message.timestamp) {
          console.error("Invalid message format:", message);
          return;
        }
        setMessages((prev) => [...prev, message]);
      },
      onError: (error) => {
        console.error("Subscription error:", error);
      },
    });

    return () => {
      console.log("Cleaning up chat subscription");
      subscription.unsubscribe();
    };
  }, [trpcClient]);

  // Send message mutation
  const sendMessage = useMutation(
    trpc.chat.sendMessage.mutationOptions({
      onMutate: (variables) => {
        console.log("Sending message:", variables);
      },
      onSuccess: (data) => {
        console.log("Message sent successfully:", data);
      },
      onError: (error) => {
        console.error("Error sending message:", error);
      },
    })
  );

  return {
    messages,
    sendMessage: (content: string) => {
      if (!content.trim()) {
        console.warn("Attempted to send empty message");
        return;
      }
      console.log("Attempting to send message:", content);
      sendMessage.mutate({ content });
    },
  };
}; 