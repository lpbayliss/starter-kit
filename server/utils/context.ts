import { AsyncLocalStorage } from 'node:async_hooks';

// Define the type for our context
type ContextData = Record<string, unknown>;

// Create the async storage instance
const asyncLocalStorage = new AsyncLocalStorage<ContextData>();

/**
 * Get the current context or return an empty object if none exists
 */
const getCurrentContext = (): ContextData => {
  return asyncLocalStorage.getStore() || {};
};

/**
 * Set a key-value pair in the current context
 * @param key - The metadata key
 * @param value - The metadata value
 */
const set = <T>(key: string, value: T): void => {
  const context = getCurrentContext();
  if (context) {
    // Create a new context object to ensure immutability
    const updatedContext = { ...context, [key]: value };
    // Replace the store with the updated context
    // This is a workaround as AsyncLocalStorage doesn't provide a direct way to update values
    asyncLocalStorage.enterWith(updatedContext);
  }
};

/**
 * Get a value from the current context
 * @param key - The metadata key
 * @returns The value for the key, or undefined if not found
 */
const get = <T>(key: string): T | undefined => {
  const context = getCurrentContext();
  return context[key] as T | undefined;
};

/**
 * Get all values from the current context
 * @returns The entire context object
 */
const getAll = (): ContextData => {
  return { ...getCurrentContext() };
};

/**
 * Runs the provided function within a new context
 * @param fn - The function to run
 * @param initialData - Optional initial context data
 * @returns The result of the function
 */
export const runWithContext = async <T>(
  fn: () => Promise<T> | T,
  initialData: ContextData = {}
): Promise<T> => {
  return asyncLocalStorage.run(initialData, fn);
};

// Export the Context module
export const Context = {
  set,
  get,
  getAll,
};
