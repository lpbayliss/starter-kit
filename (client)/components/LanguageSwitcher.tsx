import { useIntl } from "react-intl";
import { useLocale } from "./LocaleProvider";

export function LanguageSwitcher() {
	const { locale, setLocale, availableLocales } = useLocale();
	const intl = useIntl();

	return (
		<select
			value={locale}
			onChange={(e) => setLocale(e.target.value)}
			aria-label={intl.formatMessage({ id: "language.switcher.label" })}
			className="px-3 py-1 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
		>
			{availableLocales.map((loc) => (
				<option key={loc} value={loc}>
					{intl.formatMessage({ id: `language.${loc}` })}
				</option>
			))}
		</select>
	);
}
