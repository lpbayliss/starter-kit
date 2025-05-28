import * as todos from "../../../drizzle/schema/todos";
import type { dbPostgres } from "../db";

export function insertTodo(db: ReturnType<typeof dbPostgres>, text: string) {
	return db.insert(todos.todoTable).values({ text });
}

export function getAllTodos(db: ReturnType<typeof dbPostgres>) {
	return db.select().from(todos.todoTable);
}
