# Create React Hook

## Task Overview
Create production-ready React hooks following these specifications. Requirements are categorized by importance using MUST (mandatory), SHOULD (strongly recommended), and MAY (optional).

## Hook Description

$ARGUMENTS

## Rules
- **MUST** use the `use` prefix for all hook names (e.g., `useAuth`, `useDataFetch`)
- **MUST** use camelCase after the `use` prefix
- **MUST** export the hook as a named export
  ```tsx
  export const useHookName = () => { ... }
  ```
- **MUST** create two files for every hook:
  1. `useHookName.ts` - Main hook implementation
  2. `useHookName.test.ts` - Unit tests
- **MUST** use React Query with tRPC for all data operations
  - Use `useQuery` for GET requests
  - Use `useMutation` for POST/PUT/DELETE requests
  - Use `useSubscription` for SSE and WebSocket requests
- **MUST** encapsulate all React Query operations within custom hooks
- **MUST** never expose React Query directly to components
- **MUST** define TypeScript types for all hook parameters and return values
- **MUST** define explicit return types for all hooks
- **MUST** name parameter types as `UseHookNameParams` (if applicable)
- **MUST** name return types as `UseHookNameReturn`
- **MUST** create hooks under `/(client)/hooks`
- **MUST** handle loading, error, and success states for async operations
- **SHOULD** return an object instead of an array for hooks with multiple return values
- **SHOULD** memoize complex calculations with `useMemo`
- **SHOULD** memoize callbacks with `useCallback` when passed as dependencies
- **SHOULD** document hook dependencies clearly
- **SHOULD** use `type` over `interface` when possible
- **SHOULD** export types that consumers might need
- **SHOULD** organize related hooks in subdirectories:
  ```
  /hooks
    ├── /auth
    │   ├── useAuth.ts
    │   ├── useAuth.test.ts
    │   ├── usePermissions.ts
    │   └── usePermissions.test.ts
    ├── /data
    │   ├── useUserData.ts
    │   └── useUserData.test.ts
    └── /ui
        ├── useDebounce.ts
        └── useDebounce.test.ts
  ```
- **SHOULD** provide sensible defaults for optional parameters
- **SHOULD** validate inputs and throw clear error messages
- **MAY** expose imperative handlers when necessary
- **MAY** support cancellation for async operations

## Execution

1. Planning Phase
  - **MUST** identify the hook's purpose and responsibility
  - **MUST** define input parameters and return values
  - **SHOULD** consider error cases and edge conditions
  - **SHOULD** plan for testability

2. Implementation Phase
  - **MUST** follow React Rules of Hooks
  - **MUST** manage dependencies correctly
  - **SHOULD** optimize for performance
  - **SHOULD** handle cleanup in useEffect

3. Testing Phase
  - **MUST** test all hook behaviors
  - **MUST** test with different parameter combinations
  - **MUST** mock external dependencies (React Query, APIs)
  - **SHOULD** test error scenarios
  - **SHOULD** test cleanup and unmounting
  - **SHOULD** aim for >90% coverage

4. Documentation Phase
  - **MUST** add JSDoc comments describing:
    - Purpose of the hook
    - Parameters
    - Return values
    - Usage example
  - **SHOULD** document any side effects
  - **MAY** include advanced usage examples

## Example Hook

```tsx
// useUserData.ts
import { api } from '@/utils/api';

type UseUserDataParams = {
  userId: string;
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  };
};

type UseUserDataReturn = {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

/**
 * Hook to fetch and manage user data
 * @param params - Hook parameters
 * @returns User data and query states
 *
 * @example
 * const { user, isLoading } = useUserData({ userId: '123' });
 */
export const useUserData = ({ userId, options }: UseUserDataParams): UseUserDataReturn => {
  const query = api.user.getById.useQuery(
    { id: userId },
    {
      enabled: options?.enabled ?? true,
      refetchInterval: options?.refetchInterval,
    }
  );

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
```
