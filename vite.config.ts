/// <reference types="vitest" />

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";
import vike from "vike/plugin";

export default defineConfig({
	plugins: [
		vike({}),
		devServer({
			entry: "hono-entry.ts",
			exclude: [
				/^\/@.+$/,
				/.*\.(ts|tsx|vue)($|\?)/,
				/.*\.(s?css|less)($|\?)/,
				/^\/favicon\.ico$/,
				/.*\.(svg|png)($|\?)/,
				/^\/(public|assets|static)\/.+/,
				/^\/node_modules\/.*/,
			],
			injectClientScript: false,
		}),
		react({}),
		tailwindcss(),
	],
	build: {
		target: "es2022",
	},
	test: {
		workspace: [
			{
				plugins: [react({})],
				test: {
					globals: true,
					environment: "jsdom",
					name: "component",
					include: ["components/**/*.test.{ts,tsx}"],
					setupFiles: "./tests/setup.client.js",
				},
			},
		],
	},
});
