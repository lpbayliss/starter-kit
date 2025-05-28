import type { Context, Hono, Next } from "hono";
import {
	runWithContext,
	Context as AppContext,
} from "../utils/context";

export const withAppContext = (app: Hono) => {
	app.use(async (c: Context, next: Next) => {
		await runWithContext(async () => {
			const requestId = crypto.randomUUID();

			// Set initial context values
			AppContext.set("requestId", requestId)
			AppContext.set("requestPath", c.req.path)
			AppContext.set("method", c.req.method)
			AppContext.set("startTime", Date.now())

			// Add request ID to response headers
			c.header("X-Request-ID", requestId);

			try {
				await next();
			} finally {
				AppContext.set("statusCode", c.res.status);
			}
		});
	});
};
