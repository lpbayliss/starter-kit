import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "../../trpc/client";

type UseAddTodoProps = { onSettled?: () => void };
const useAddTodo = (props: UseAddTodoProps) => {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const queryOptions = trpc.allTodos.queryOptions();

	const mutator = useMutation(
		trpc.onNewTodo.mutationOptions({
			async onMutate(newTodo) {
				const newTodoObj = {
					id: new Date().toISOString(),
					text: newTodo,
				};
				await queryClient.cancelQueries(queryOptions);
				const previousTodos = queryClient.getQueryData(queryOptions.queryKey);
				queryClient.setQueryData(queryOptions.queryKey, (oldTodos) => [
					...(oldTodos ? oldTodos : []),
					newTodoObj,
				]);
				return { previousTodos };
			},
			onError(_err, _newTodo, ctx) {
				ctx &&
					queryClient.setQueryData(
						trpc.allTodos.queryOptions().queryKey,
						ctx.previousTodos,
					);
			},
			onSettled() {
				queryClient.invalidateQueries(trpc.allTodos.queryOptions());
				props.onSettled?.();
			},
		}),
	);

	return mutator.mutate;
};

export default useAddTodo;
