import type { Locale } from "./config";
import type { Messages } from "./types";

const messageCache = new Map<string, Messages>();

export async function loadMessages(
	locale: Locale,
): Promise<Messages> {
	if (messageCache.has(locale)) {
		return messageCache.get(locale);
	}

	try {
		// Dynamic import for client-side code splitting
		const messages = await import(`../../compiled-locales/${locale}.json`);
		messageCache.set(locale, messages.default);
		return messages.default;
	} catch (error) {
		console.warn(`Failed to load locale ${locale}, falling back to English`);
		const fallback = await import("../../compiled-locales/en.json");
		return fallback.default;
	}
}
