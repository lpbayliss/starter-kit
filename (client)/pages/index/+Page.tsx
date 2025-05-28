import { authClient } from "../../../auth/client";

export default function Page() {
  const { data: session } = authClient.useSession();

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">Please sign in</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Starter Kit</h1>
    </div>
  );
}
