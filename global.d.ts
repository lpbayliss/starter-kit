import type { Messages } from "./(client)/i18n/types";

declare global {
	namespace Vike {
		interface PageContext {
			locale: string;
			messages: Messages;
		}
	}
}
