import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "../../trpc/client";

const useFetchTodos = () => {
	const trpc = useTRPC();
	const { data } = useSuspenseQuery(trpc.allTodos.queryOptions());
	return data;
};

export default useFetchTodos;
