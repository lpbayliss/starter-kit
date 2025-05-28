import { useEffect, useRef } from "react";
import {
	getPanelElement,
	getPanelGroupElement,
	getResizeHandleElement,
	Panel,
	PanelGroup,
	PanelResizeHandle,
} from "react-resizable-panels";
import { Chat } from "../../components/Chat";
import { authClient } from "../../../auth/client";

export default function Page() {
	const { data: session } = authClient.useSession();
	const refs = useRef({});

	useEffect(() => {
		const groupElement = getPanelGroupElement("group");
		const leftPanelElement = getPanelElement("left-panel");
		const centerPanelElement = getPanelElement("center-panel");
		const rightPanelElement = getPanelElement("right-panel");
		const leftResizeHandleElement =
			getResizeHandleElement("left-resize-handle");
		const rightResizeHandleElement = getResizeHandleElement(
			"right-resize-handle",
		);

		// If you want to, you can store them in a ref to pass around
		refs.current = {
			groupElement,
			leftPanelElement,
			centerPanelElement,
			rightPanelElement,
			leftResizeHandleElement,
			rightResizeHandleElement,
		};
	}, []);

	if (!session?.user) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl text-gray-600">
					Please sign in to access the chat
				</h2>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-8 text-center">
				Community News Chat
			</h1>
			<Chat />
		</div>
	);
}
