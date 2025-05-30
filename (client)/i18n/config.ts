// Supported locales configuration
export const SUPPORTED_LOCALES = ["en", "fr"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Locale display names
export const LOCALE_NAMES: Record<Locale, string> = {
	en: "English",
	fr: "Français",
};

// Validate if a locale is supported
export function isValidLocale(locale: string): locale is Locale {
	return SUPPORTED_LOCALES.includes(locale as Locale);
}
