import { trpcServer } from "@hono/trpc-server";
import type { Hono } from "hono";
import { appRouter } from "../routers/_app";
import { createTRPCContext } from "../../trpc/context";

export const withTRPC = (app: Hono) => {
	app.use(
		"/api/trpc/*",
		trpcServer({
			endpoint: "/api/trpc",
			router: appRouter,
			createContext: createTRPCContext,
		}),
	);
};
