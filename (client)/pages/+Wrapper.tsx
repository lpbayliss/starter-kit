import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createTRPCClient,
	httpBatchLink,
	splitLink,
	httpSubscriptionLink,
} from "@trpc/client";
import { type ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { TRPCProvider } from "../../trpc/client";
import type { AppRouter } from "../../trpc/server";

const getUrl = () => {
	const base = (() => {
		if (typeof window !== "undefined") return window.location.origin;
		if (process.env.APP_URL) return process.env.APP_URL;
		return `http://localhost:${process.env.PORT ?? 3000}`;
	})();

	return `${base}/api/trpc`;
};

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (typeof window === "undefined") return makeQueryClient();
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export default function Wrapper({ children }: { children: ReactNode }) {
	const queryClient = getQueryClient();
	const [trpcClient] = useState(() =>
		createTRPCClient<AppRouter>({
			links: [
				splitLink({
					// uses the httpSubscriptionLink for subscriptions
					condition: (op) => op.type === "subscription",
					true: httpSubscriptionLink({
						url: "http://localhost:3000/api/trpc",
					}),
					false: httpBatchLink({
						url: "http://localhost:3000/api/trpc",
					}),
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</TRPCProvider>
		</QueryClientProvider>
	);
}
