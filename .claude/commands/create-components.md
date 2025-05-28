# Create React Component

## Task Overview
Create production-ready React components following these specifications. Requirements are categorized by importance using MUST (mandatory), SHOULD (strongly recommended), and MAY (optional).

## Component Description

$ARGUMENTS

### Component Structure
- **MUST** use functional components with arrow function syntax
  ```tsx
  const ComponentName = () => { ... }
  ```
- **MUST** export default the component at the bottom of the file
  ```tsx
  export default ComponentName
  ```
- **MUST** use TitleCase for all component names (e.g., `UserProfile`, `DataTable`)
- **MUST** create three files for every component:
  1. `ComponentName.tsx` - Main component implementation
  2. `ComponentName.test.tsx` - Unit/integration tests
  3. `ComponentName.stories.tsx` - Storybook stories

### Styling & Data Management
- **MUST** use Tailwind CSS for all styling (no inline styles or CSS modules)
- **MUST** use `classnames` utility for combining CSS classes conditionally, imported as `cn`
- **MUST** use React Query wth tRPC for all data operations
  - Use `useQuery` for GET requests
  - Use `useMutation` for POST/PUT/DELETE requests
  - Use `useSubscription` for SSE and WebSocket requests
- **MUST** wrap all data operations in a custom hook; do not use react-query directly in components

### Code Organization
- **SHOULD** wrap complex logic in custom hooks when it reduces component complexity
  - **SHOULD** run `/project:create-hook` to create a hook
- **SHOULD** decompose components larger than 100 lines into smaller sub-components
- **SHOULD** define TypeScript types for all props
- **SHOULD** place used hooks at the top of the component function
- **SHOULD** group related state variables together

### File Structure
- **MUST** create component under `/(client)/components`
- **MUST** co-locate prop types with the components
  - **SHOULD** use `type` over `interface` when possible
  - **MUST** use `ComponentNameProps`
  - **SHOULD** use `PropsWithChildren<ComponentNameProps>` is children are required
  - **SHOULD** not explain props with comments unless ambiguous
- **SHOULD** organize components in a folder structure:
  ```
  /ComponentName
    ├── ComponentName.tsx
    ├── ComponentName.test.tsx
    ├── ComponentName.stories.tsx
    └── /SubComponentFolder         (if decomposed)
  ```

### Additional Patterns
- **MAY** use compound component pattern for complex UI compositions
- **MAY** implement error boundaries for components that fetch data
- **MAY** memoize expensive computations with `useMemo`
- **MAY** optimize re-renders with `React.memo` for pure components

## Execution

1. Planning Phase
  - **MUST** identify all data requirements
  - **SHOULD** sketch component hierarchy
  - **SHOULD** define the props interface
  - **MAY** create a simple wireframe
2. Implementation Phase
3. Testing Phase
  - **MUST** test all user interactions
  - **MUST** mock React Query providers
  - **SHOULD** test loading, error, and success states
  - **SHOULD** aim for >80% coverage
4. Documentation Phase
  - **MUST** create Storybook stories for:
    - Default state
    - Loading state
    - Error state
    - Empty state
  - **SHOULD** add JSDoc comments for complex props
  - **MAY** include usage examples in stories

## Example Component Template

```tsx
// UserProfile.tsx
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query'
import { useUserProfileLogic } from './useUserProfileLogic'
import UserAvatar from './UserAvatar'

type UserProfileProps = {
  userId: string;
  onUpdate?: (user: User) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const UserProfile = ({ userId, onUpdate, className, variant = 'default' }: UserProfileProps) => {
  // MUST: Data fetching with React Query
  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId)
  })

  // SHOULD: Extract complex logic
  const { isEditing, handleEdit } = useUserProfileLogic()

  // MUST: Handle loading states
  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>
  }

  // MUST: Use classnames for conditional styling
  return (
    <div className={classNames(
      'bg-white rounded-lg shadow-md',
      {
        'p-6': variant === 'default',
        'p-3': variant === 'compact',
        'border-2 border-blue-500': isEditing,
      },
      className
    )}>
      <UserAvatar user={user} />
      {/* Additional content */}
    </div>
  )
}

// MUST: Export default
export default UserProfile
```
