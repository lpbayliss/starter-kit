import { protectedProcedure, publicProcedure, router } from "../../trpc/server";
import { Context } from "../utils/context";
import { Logger } from "../utils/logger";
import * as drizzleQueries from "../db/queries/todos";
import EventEmitter, { on } from "node:events";
import { z } from "zod";
import { chatRouter } from "./chat";

const logger = Logger.instance.child("trpc");

const ee = new EventEmitter();

export const appRouter = router({
	demo: publicProcedure.query(async () => {
		return { demo: true };
	}),
	allTodos: publicProcedure.query(async (opts) => {
		logger.info("Getting all todos");
		return await drizzleQueries.getAllTodos(opts.ctx.db);
	}),
	onNewTodo: protectedProcedure.input(z.string()).mutation(async (opts) => {
		Context.set("procedureName", "onNewTodo");
		Context.set("procedureType", "mutation");
		Context.set("todo", opts.input);
		logger.info("Informative");
		logger.debug("Debugging?");
		logger.warn("Warning! Warning!");
		logger.error("Error!?!?");
		logger.error("Error!?!?", new Error("Error!"));
		await drizzleQueries.insertTodo(opts.ctx.db, opts.input);
	}),
	testSubscription: protectedProcedure.subscription(async function* (opts) {
		while (true) {
			yield Math.random();
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}),
	chat: chatRouter,
});
