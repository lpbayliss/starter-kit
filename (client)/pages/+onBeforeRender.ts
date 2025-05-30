import type { PageContextServer } from "vike/types";
import { loadMessages } from "../i18n/message-loader";
import { isValidLocale, DEFAULT_LOCALE } from "../i18n/config";
import type { Locale } from "../i18n/config";

export async function onBeforeRender(pageContext: PageContextServer) {
	const { locale } = pageContext;
	const validLocale: Locale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
	const messages = await loadMessages(validLocale);

	return {
		pageContext: {
			messages,
			locale: validLocale,
		},
	};
}
