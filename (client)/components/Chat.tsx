import { useChat } from "../hooks/useChat";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const Chat = () => {
	const { messages, sendMessage } = useChat();
	const [input, setInput] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			sendMessage(input);
			setInput("");
		}
	};

	return (
		<div className="flex flex-col h-[500px] w-full max-w-2xl mx-auto border rounded-lg shadow-lg">
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				<AnimatePresence initial={false}>
					{messages.map((message, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 30,
								mass: 1,
							}}
							className="flex flex-col space-y-1"
						>
							<div className="flex items-center space-x-2">
								<span className="text-sm font-medium text-gray-500">
									{message.userId}
								</span>
								<span className="text-xs text-gray-400">
									{new Date(message.timestamp).toLocaleTimeString()}
								</span>
							</div>
							<motion.div
								className="bg-gray-100 rounded-lg p-3"
								initial={{ scale: 0.95 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
							>
								{message.content}
							</motion.div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
			<form onSubmit={handleSubmit} className="border-t p-4">
				<div className="flex space-x-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<motion.button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Send
					</motion.button>
				</div>
			</form>
		</div>
	);
};
