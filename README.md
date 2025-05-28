# Full-Stack TypeScript Starter Kit

A production-ready starter project for building modern web applications with React 19, Vike SSR, and a complete backend infrastructure.

## Tech Stack

- **Frontend**: React 19 + Vike (SSR framework) + TailwindCSS v4
- **Backend**: Hono (web framework) + tRPC (type-safe APIs)
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Better-Auth with GitHub OAuth
- **Testing**: Vitest + Testing Library + Playwright
- **Code Quality**: Biome (linting/formatting)
- **Documentation**: Storybook

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for PostgreSQL)

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure required variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - GitHub OAuth credentials

3. **Start PostgreSQL database**
   ```bash
   pnpm docker:db:start
   ```

4. **Run database migrations**
   ```bash
   pnpm drizzle:migrate
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

## Development Commands

### Core Development
```bash
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm preview                # Preview production build
```

### Database Operations
```bash
pnpm drizzle:generate       # Generate new migrations
pnpm drizzle:migrate        # Apply migrations
pnpm drizzle:studio         # Open Drizzle Studio (database GUI)
pnpm docker:db:start        # Start PostgreSQL container
```

### Code Quality & Testing
```bash
pnpm lint                   # Lint with Biome
pnpm format                 # Format with Biome
pnpm test                   # Run tests with Vitest
```

### Documentation
```bash
pnpm storybook              # Start Storybook dev server
pnpm build-storybook        # Build Storybook
```

## Project Structure

```
├── (client)/               # React frontend with Vike pages
│   ├── components/         # React components
│   ├── hooks/             # React hooks
│   └── pages/             # Route components using Vike
├── server/                # Backend logic
│   ├── db/                # Database connection and queries
│   ├── routers/           # tRPC routers
│   └── utils/             # Server utilities
├── trpc/                  # tRPC setup and type definitions
├── drizzle/               # Database schema and migrations
├── auth/                  # Better-Auth configuration
└── stories/               # Storybook documentation
```

## Key Features

### Vike SSR Framework
- Server-side rendering with React 19
- Filesystem-based routing
- Page transition animations
- HTML streaming support
- Error boundaries

### tRPC Integration
- End-to-end type safety
- Auto-generated TypeScript types
- React Query integration
- Real-time subscriptions

### Database & ORM
- PostgreSQL with Drizzle ORM
- Type-safe database queries
- Automatic migrations
- Database studio GUI

### Authentication
- Better-Auth with GitHub OAuth
- Session management
- Protected routes
- Server-side auth state

### Testing Suite
- Unit/component tests with Vitest
- End-to-end tests with Playwright
- Testing Library utilities
- Coverage reporting

## Configuration Files

- [`/pages/+config.ts`](#pagesconfigts) - Vike configuration defining layout, title, and head tags
- [`biome.json`](./biome.json) - Code formatting and linting rules
- [`drizzle.config.ts`](./drizzle.config.ts) - Database ORM configuration
- [`vite.config.ts`](./vite.config.ts) - Build tool configuration

### `/pages/+config.ts`

Such `+` files are [the interface](https://vike.dev/config) between Vike and your code. It defines:

* A default [`<Layout>` component](https://vike.dev/Layout) (that wraps your [`<Page>` components](https://vike.dev/Page))
* A default [`title`](https://vike.dev/title)
* Global [`<head>` tags](https://vike.dev/head-tags)

## Routing

[Vike's built-in router](https://vike.dev/routing) supports:

* [Filesystem Routing](https://vike.dev/filesystem-routing) - URL determined by `+Page.tsx` file location
* [Route Strings](https://vike.dev/route-string) - Custom route patterns
* [Route Functions](https://vike.dev/route-function) - Programmatic routing

## Error Handling

The [`/pages/_error/+Page.tsx`](./pages/_error/+Page.tsx) file renders when errors occur, providing a user-friendly error experience.

## Page Transitions

The [`onPageTransitionStart()`](https://vike.dev/onPageTransitionStart) and [`onPageTransitionEnd()`](https://vike.dev/onPageTransitionEnd) hooks enable smooth page transition animations.

## Customization

This starter kit follows the [LIFT principles](./rules/lift.mdc) for code organization and includes comprehensive development guidelines in [`CLAUDE.md`](./CLAUDE.md).

### SSR Configuration

SSR is enabled by default. You can [disable it](https://vike.dev/ssr) for all pages or selectively for specific routes.

### HTML Streaming

[HTML streaming](https://vike.dev/stream) can be enabled/disabled globally or per-page for optimal performance.

## Learn More

- [Vike Documentation](https://vike.dev) - SSR framework
- [Hono Documentation](https://hono.dev) - Web framework
- [tRPC Documentation](https://trpc.io) - Type-safe APIs
- [Drizzle ORM Documentation](https://orm.drizzle.team) - Database ORM
- [Better-Auth Documentation](https://better-auth.com) - Authentication
