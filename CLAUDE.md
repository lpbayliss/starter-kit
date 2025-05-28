# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript application starter-kit built with:

- **Frontend**: React 19 + Vike (SSR framework) + TailwindCSS v4
- **Backend**: Hono (web framework) + tRPC (type-safe APIs)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Better-Auth with GitHub OAuth
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: Biome (linting/formatting)
- **Documentation**: Storybook

## Common Development Commands

### Setup & Development
```bash
pnpm install                # Install dependencies
pnpm docker:db:start        # Start PostgreSQL container
pnpm drizzle:migrate        # Run database migrations
pnpm dev                    # Start development server
```

### Database Operations
```bash
pnpm drizzle:generate       # Generate new migrations
pnpm drizzle:migrate        # Apply migrations
pnpm drizzle:studio         # Open Drizzle Studio (database GUI)
```

### Code Quality & Testing
```bash
pnpm lint                   # Lint with Biome
pnpm format                 # Format with Biome
pnpm test                   # Run tests with Vitest
```

### Build & Deploy
```bash
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Documentation
```bash
pnpm storybook              # Start Storybook dev server
pnpm build-storybook        # Build Storybook
```

## Architecture & Directory Structure

- `(client)/` - React frontend with Vike pages
  - `components/` - React components
  - `hooks/` - React hooks
  - `pages/` - Route components using Vike
- `server/` - Backend logic
  - `db/` - Database connection and queries
  - `routers/` - tRPC routers
  - `utils/` - Server utilities
- `trpc/` - tRPC setup and type definitions
- `drizzle/` - Database schema and migrations
- `auth/` - Better-Auth configuration
- `stories/` - Storybook documentation

## Key Patterns

1. **tRPC for API**: Type-safe APIs between client and server
2. **Vike for SSR**: Server-side rendering with React
3. **Drizzle Relations**: Use relational queries for optimal performance
4. **Better-Auth Integration**: Handle authentication state across client/server
5. **Repository Pattern**: Encapsulate database queries in `server/db/queries/`

## Development Guidelines

### Code Organization (LIFT Principles)
- **MUST** organize code by feature/domain rather than technical role
- **MUST** use descriptive, consistent file naming conventions
- **MUST** use kebab-case for file/directory names
- **SHOULD** keep directory nesting to 3-4 levels maximum
- **SHOULD** extract common functionality to avoid duplication
- **MUST** locate related files close to each other

### Code Style & Standards
- **MUST** use explicit TypeScript types, avoid `any`
- **MUST** define return types for all functions
- **MUST** use PascalCase for classes, camelCase for variables/functions
- **MUST** start functions with verbs, use `isX/hasX/canX` for booleans
- **MUST** keep functions short (<20 instructions) with single purpose
- **MUST** use JSDoc for public classes and methods
- **MUST** have one export per file
- **MUST** use `node:` protocol for built-in Node.js modules (`import { createServer } from 'node:http'`)
- **SHOULD** enable strict TypeScript compiler options

### Database (Drizzle ORM)
- **MUST** organize schema by domain in `drizzle/schema/`
- **MUST** use plural table names (`users`, `posts`)
- **MUST** use snake_case for column names, camelCase for TypeScript
- **MUST** define explicit relations for all table relationships
- **MUST** use transactions for related operations
- **MUST** validate input with zod before database operations
- **MUST** use ORM/Drizzle for all database queries (no raw SQL with user input)

### Error Handling
- **MUST** use async/await over callbacks
- **MUST** create app-specific error classes extending built-in Error
- **MUST** handle errors centrally through middleware
- **MUST** distinguish operational errors from programmer errors
- **SHOULD** implement graceful shutdown on unhandled errors

### Security Requirements
- **MUST** store secrets in environment variables, never in code
- **MUST** validate and sanitize all user inputs
- **MUST** validate all API inputs using zod schemas
- **SHOULD** implement rate limiting on API endpoints
- **MUST** use bcrypt/scrypt for password hashing
- **SHOULD** set security headers using helmet or similar

### Authentication
- **MUST** use Better-Auth with GitHub OAuth configuration
- **MUST** implement session management with 7-day expiry
- **MUST** protect tRPC procedures for authenticated routes

### Testing Requirements
- **MUST** follow Arrange-Act-Assert pattern for tests
- **MUST** test error flows, not just happy paths
- **MUST** use unit/component tests with Vitest
- **MUST** use E2E tests with Playwright
- **MUST** follow `.test.tsx` naming convention for component tests
- **SHOULD** use isolated test data per test
- **MUST** test middlewares in isolation
- **SHOULD** prioritize API/component level tests

### Performance & Production
- **MUST** avoid blocking the event loop with CPU-intensive tasks
- **SHOULD** prefer native JavaScript methods over utility libraries
- **MUST** set NODE_ENV=production in production
- **MUST** use `pnpm ci` for CI installations
- **SHOULD** implement monitoring for uptime, metrics, and errors

### Code Quality Enforcement
- **MUST** run `pnpm lint` and `pnpm format` before committing changes
- **MUST** ensure all tests pass before merging
- **SHOULD** use structured logging with correlation IDs
- **MAY** use Storybook for component documentation

## Data Fetching & Mutations
- **MUST** use React Query wth tRPC for all data operations
  - Use `useQuery` for GET requests
  - Use `useMutation` for POST/PUT/DELETE requests
  - Use `useSubscription` for SSE and WebSocket requests
- **MUST** wrap all data operations in a custom hook; do not use react-query directly in components

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials
