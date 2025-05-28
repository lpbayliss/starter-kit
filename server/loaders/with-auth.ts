import type { Hono } from "hono";
import { auth } from "../../auth/server";

export const withAuth = (app: Hono) => {
	app.on(["POST", "GET"], "/api/auth/*", (c) => {
		return auth.handler(c.req.raw);
	});
};
