import type { PageContextBuiltInServer } from "vike/types";
import { loadMessages } from "../i18n/message-loader";

export async function onBeforeRender(pageContext: PageContextBuiltInServer) {
	const { locale } = pageContext;
	const messages = await loadMessages(locale);

	return {
		pageContext: {
			messages,
			locale,
		},
	};
}
