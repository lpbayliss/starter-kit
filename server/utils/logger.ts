import winston from "winston";
import chalk, { type ChalkInstance } from "chalk";
import { Context } from "./context";

/**
 * Returns a ChalkInstance with appropriate background color based on log level
 * @param level - The logging level
 * @returns A configured ChalkInstance for the specified level
 */
const colorise = (level: string): ChalkInstance => {
	switch (level) {
		case "error":
			return chalk.bgRed;
		case "warn":
			return chalk.bgYellow;
		case "info":
			return chalk.bgBlue;
		case "http":
			return chalk.bgMagenta;
		case "verbose":
			return chalk.bgCyan;
		case "debug":
			return chalk.bgGreen;
		case "silly":
			return chalk.bgGray;
		default:
			return chalk.bgWhite;
	}
};

/**
 * Supported logging levels for the application
 */
export type LogLevels =
	| "error"
	| "warn"
	| "info"
	| "http"
	| "verbose"
	| "debug"
	| "silly";

/**
 * Base winston logger configuration
 */
const winstonLogger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	format: winston.format.combine(
		winston.format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		winston.format.printf(
			({
				level,
				message,
				timestamp,
				context, // map legacy context to scope
				error,
				verbose = false,
				...meta
			}) => {
				let logStr = "";
				logStr += colorise(level)(` ${level}`.toUpperCase().padEnd(9, " "));
				logStr += ` ${chalk.gray(timestamp)}`;
				logStr += ` : ${message}`;
				if (
					(process.env.LOG_LEVEL === "verbose" || verbose) &&
					Object.keys(meta).length
				)
					logStr += ` ${JSON.stringify(meta)}`;

				if (error && error instanceof Error) {
					logStr += chalk.red(`\n ${error.stack}`);
				} else if (error) {
					logStr += chalk.red(`\n ${error}`);
				}

				return logStr;
			},
		),
	),
	defaultMeta: {
		environment: process.env.NODE_ENV || "development",
	},
	transports: [new winston.transports.Console()],
});

/**
 * Get context metadata and merge it with provided metadata
 * @param meta - Additional metadata to include in the log
 * @returns Combined metadata
 */
const getEnhancedMetadata = (
	meta: Record<string, unknown> = {},
): Record<string, unknown> => {
	try {
		// Get context values, safely handling if context is not available
		const contextValues = Context.getAll();
		return { ...meta, ...contextValues };
	} catch (error) {
		// If context is not available, just return the provided metadata
		return meta;
	}
};

type LogMeta = Record<string, unknown>;
type LogOptions = { verose: boolean };

/**
 * Generic logging function that enhances metadata with context information
 * @param level - The log level to use
 * @param message - The message to log
 * @param meta - Optional metadata to include with the log
 */
const log = (
	level: LogLevels,
	message: string,
	meta: LogMeta = {},
	options?: LogOptions,
): void => {
	const enhancedMeta = getEnhancedMetadata(meta);
	const logInfo = {
		level,
		message,
		...enhancedMeta,
		...options,
	};

	// Log with winston
	winstonLogger.log(logInfo);
};

/**
 * Logs an error message
 * @param message - The error message to log
 * @param meta - Optional metadata to include with the log
 */
const error = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("error", message, meta, options);

/**
 * Logs a warning message
 * @param message - The warning message to log
 * @param meta - Optional metadata to include with the log
 */
const warn = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("warn", message, meta, options);

/**
 * Logs an informational message
 * @param message - The info message to log
 * @param meta - Optional metadata to include with the log
 */
const info = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("info", message, meta, options);

/**
 * Logs an HTTP-related message
 * @param message - The HTTP message to log
 * @param meta - Optional metadata to include with the log
 */
const http = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("http", message, meta, options);

/**
 * Logs a verbose message
 * @param message - The verbose message to log
 * @param meta - Optional metadata to include with the log
 */
const verbose = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("verbose", message, meta, options);

/**
 * Logs a debug message
 * @param message - The debug message to log
 * @param meta - Optional metadata to include with the log
 */
const debug = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("debug", message, meta, options);

/**
 * Logs a silly message (lowest priority)
 * @param message - The silly message to log
 * @param meta - Optional metadata to include with the log
 */
const silly = (
	message: string,
	meta: Record<string, unknown> = {},
	options?: LogOptions,
): void => log("silly", message, meta, options);

/**
 * Logs a trace message (lowest priority), an alias for silly
 * @param message - The trace message to log
 * @param meta - Optional metadata to include with the log
 */
const trace = silly;

/**
 * Logger module providing methods for different log levels
 * with context-aware metadata enhancement
 */
export const Logger = {
	log,
	error,
	warn,
	info,
	http,
	verbose,
	debug,
	silly,
	trace,
	instance: winstonLogger,
};
