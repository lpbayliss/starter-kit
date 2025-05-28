import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as todos from "../../drizzle/schema/todos";
import * as auth from "../../drizzle/schema/auth";
import { Logger } from "../utils/logger";

const logger = Logger.instance.child("db");

const schema = {
	...todos,
	...auth,
};

let drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function dbPostgres() {
	if (!drizzleInstance) {
		try {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const connectionString = process.env.DATABASE_URL!;
			logger.info("Connecting to database...");
			const client = postgres(connectionString);
			drizzleInstance = drizzle(client, { schema });
			logger.info("Successfully connected to database");
		} catch (error) {
			logger.error("Failed to connect to database", { error });
			throw new Error("Database connection failed. Please ensure the database is running and accessible.");
		}
	}

	return drizzleInstance;
}
