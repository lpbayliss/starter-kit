import type { PageContextServer } from "vike/types";
import { isValidLocale, DEFAULT_LOCALE } from "../i18n/config";

export function onBeforeRoute(pageContext: PageContextServer) {
	const cookieLocale = parseCookieLocale(pageContext.headers?.cookie);
	const browserLocale = parseAcceptLanguage(
		pageContext.headers?.["accept-language"],
	);

	return {
		pageContext: {
			locale: cookieLocale || browserLocale || DEFAULT_LOCALE,
			urlLogical: pageContext.urlParsed.pathname,
		},
	};
}

function parseCookieLocale(cookieHeader?: string): string | null {
	if (!cookieHeader) return null;
	const match = cookieHeader.match(/locale=([^;]+)/);
	const locale = match?.[1];
	return locale && isValidLocale(locale) ? locale : null;
}

function parseAcceptLanguage(acceptLanguage?: string): string | null {
	if (!acceptLanguage) return null;
	// Parse "en-US,en;q=0.9,fr;q=0.8" format
	const languages = acceptLanguage
		.split(",")
		.map((lang) => lang.split(";")[0].split("-")[0]);
	return languages.find((lang) => isValidLocale(lang)) || null;
}
