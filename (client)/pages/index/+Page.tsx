import { useIntl } from "react-intl";
import { authClient } from "../../../auth/client";
import { LocaleProvider } from "../../components/LocaleProvider";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export default function Page() {
	const { data: session } = authClient.useSession();
	const intl = useIntl();

	if (!session?.user) {
		return (
			<LocaleProvider>
				<div className="text-center py-12">
					<div className="absolute top-4 right-4">
						<LanguageSwitcher />
					</div>
					<h2 className="text-xl text-gray-600">{intl.formatMessage({ id: "signin.plead" })}</h2>
				</div>
			</LocaleProvider>
		);
	}

	return (
		<LocaleProvider>
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold">{intl.formatMessage({ id: "home.title" })}</h1>
					<LanguageSwitcher />
				</div>
				<p className="text-lg text-gray-600">{intl.formatMessage({ id: "home.description" })}</p>
			</div>
		</LocaleProvider>
	);
}
