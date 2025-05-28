import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context as HonoContext } from "hono";
import { dbPostgres } from "../server/db/db";
import { auth } from "../auth/server";
import { EventEmitter } from "node:events";
import { Logger } from "../server/utils/logger";

const logger = Logger.instance.child("trpc-context");

// Create a singleton event emitter for chat events
const chatEmitter = new EventEmitter();

export const createTRPCContext = async (
	_opts: FetchCreateContextFnOptions,
	c: HonoContext,
) => {
	try {
		const session = await auth.api.getSession(c.req.raw);
		const db = dbPostgres();

		return {
			session,
			db,
			chatEmitter,
		};
	} catch (error) {
		logger.error("Failed to create tRPC context", { error });
		throw error;
	}
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
