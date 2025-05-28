import "dotenv/config";

import { Hono } from "hono";
import { withAppContext } from "./server/loaders/with-app-context";
import { withAuth } from "./server/loaders/with-auth";
import { withTRPC } from "./server/loaders/with-trpc";
import { withVike } from "./server/loaders/with-vike";

const app = new Hono();

withAppContext(app);
withAuth(app);
withTRPC(app);
withVike(app);

export default app;
