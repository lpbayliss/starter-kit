import { createTRPCContext } from "@trpc/tanstack-react-query";

import type { AppRouter } from "./server.js";

export const { TRPCProvider, useTRPC, useTRPCClient } =
	createTRPCContext<AppRouter>();
