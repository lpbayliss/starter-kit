import { createContext, useContext, type ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { SUPPORTED_LOCALES } from "../i18n/config";
import { getClientLocale } from "../i18n/client-locale-detector";

interface LocaleContextType {
	locale: string;
	setLocale: (locale: string) => void;
	availableLocales: readonly string[];
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
	const pageContext = usePageContext();
	// Fallback to client-side detection if pageContext.locale is not available
	const locale = pageContext.locale || getClientLocale();

	const setLocale = (newLocale: string) => {
		// Set cookie and reload to trigger SSR with new locale
		document.cookie = `locale=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}`; // 1 year
		window.location.reload(); // Reload to trigger SSR with new locale
	};

	return (
		<LocaleContext.Provider
			value={{
				locale,
				setLocale,
				availableLocales: SUPPORTED_LOCALES,
			}}
		>
			{children}
		</LocaleContext.Provider>
	);
}

export const useLocale = () => {
	const context = useContext(LocaleContext);
	if (!context) {
		throw new Error("useLocale must be used within LocaleProvider");
	}
	return context;
};
