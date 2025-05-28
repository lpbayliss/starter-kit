import { randomUUID } from "node:crypto";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dbPostgres } from "../server/db/db";

export const auth = betterAuth({
	database: drizzleAdapter(dbPostgres(), {
		provider: "pg",
	}),
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false,
			},
		},
	},
	socialProviders: {
		github: {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			clientId: process.env.GITHUB_CLIENT_ID!,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	advanced: {
		generateId() {
			return randomUUID();
		},
	},
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
