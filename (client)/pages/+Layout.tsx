import type { ReactNode } from "react";
import { authClient } from "../../auth/client";

import "./style.css";
import "./tailwind.css";

export default function Layout({ children }: { children: ReactNode }) {
	const { data: session } = authClient.useSession();

	const handleSignIn = async () => {
		await authClient.signIn.social({
			provider: "github",
			callbackURL: window.location.href,
		});
	};

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					alert("You have been signed out");
				},
			},
		});
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-gray-900">Community News Chat</h1>
						<div>
							{session?.user ? (
								<div className="flex items-center space-x-4">
									<span className="text-sm text-gray-700">
										Welcome, {session.user.name}
									</span>
									<button
										onClick={handleSignOut}
										className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
									>
										Sign Out
									</button>
								</div>
							) : (
								<button
									onClick={handleSignIn}
									className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
								>
									Sign in with GitHub
								</button>
							)}
						</div>
					</div>
				</div>
			</header>
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>
		</div>
	);
}
