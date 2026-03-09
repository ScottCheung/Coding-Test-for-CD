<!-- @format -->

# AFL Fixture Dashboard Coding Test

A high-performance AFL (Australian Football League) match dashboard built with Next.js, focused on visualizing match data and comprehensive statistics.

Live Demo: https://coding-test-for-cd.vercel.app/

## Quick Start

```bash
# Install dependencies
npm install
# or
pnpm install

# Development mode
npm run dev

# Build for production
npm run build

```

Then, navigate to `http://localhost:3000` to view the application.

## Tech Stack

Key libraries and frameworks utilized:

- **Next.js 16 (App Router)** - Core framework for robust routing and SSR/SSG.
- **TanStack Query** - Efficient data fetching, state synchronization, and caching.
- **Framer Motion** - High-quality declarative animations.
- **Tailwind CSS 4** - Modern utility-first styling.
- **Zustand** - Lightweight state management with optimized re-rendering.
- **React Table** - Powerful, headless table engine for complex data sets.
- **Recharts** - Composable charting library for data visualization.
- **dayjs** - Lightweight date and time manipulation.

## Project Structure

```text
src/
├── app/                  # Next.js App Router (File-based routing)
│   ├── (dashboard)/      # Authenticated/Main dashboard routes
│   │   ├── afl-fixture/  # Match schedules & fixtures
│   │   ├── afl-teams/    # Team management & profiles
│   │   └── dashboard/    # Data visualization overview
├── components/           # Component library
│   ├── custom/           # Business-specific logic components
│   ├── UI/               # Generic, reusable UI atoms
│   ├── layout/           # Structural layout components
│   └── animation/        # Framer Motion wrappers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, API clients, and Store
└── types/                # Centralized TypeScript definitions

```

## Optimizations

### Performance

- **Granular Memoization**: Implemented `useCallback` for stable function references, `useMemo` for expensive computations, and `React.memo` for component-level caching to eliminate redundant re-renders.
- **Virtualized Waterfall Layout**: Developed a custom `WaterfallLayout` component. By implementing virtualization (rendering only items within the viewport), it maintains 60FPS even with large datasets, solving the layout shift and lag issues found in early versions.
- **Data Caching**: Leveraged TanStack Query to prevent duplicate network requests and ensure instant "stale-while-revalidate" experiences.
- **Debounced Interactions**: Applied debouncing to search and filter inputs to minimize unnecessary computational load during rapid user input.
- **Fine-tuned Loading Strategy**: Optimized Image delivery using `lazy` loading for off-screen assets and `eager` loading for LCP (Largest Contentful Paint) elements.
- **Hardware-Accelerated Animations**: Utilized `IntersectionObserver` to trigger animations only when elements enter the viewport, preventing background CPU overhead.

### User Experience (UX)

- **Skeleton Screens**: Used meaningful skeleton states during data fetching to eliminate "blank page" flickers.
- **Resilient Error Handling**: Integrated `ErrorBoundary` and specific error states to ensure a graceful fallback when APIs fail.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Advanced Filtering**: Real-time filtering by team, venue, and match status.
- **Multi-view Support**: Users can toggle between List and Grid views based on preference.
- **Theme & Color Customization**: Supports Dark/Light modes with 5 distinct color schemes, offering 10 unique visual combinations.

## Architectural Details

- **Type Safety**: Full TypeScript implementation to catch bugs during development and improve IDE intellisense.
- **Component Promotion Strategy**: Components follow a "Local-First" approach. New components start in page-specific folders; if a component is needed elsewhere, it is "promoted" to the global `components/UI` or `custom` folders. This prevents "folder bloat" and keeps the architecture scalable as the project grows.
- **State Management**: Zustand is used for global UI state to ensure high performance and avoid the boilerplate/re-render pitfalls of Redux or Context API.
- **Unified API Layer**: All data interactions are encapsulated in `src/lib/afl-api.ts` for better maintainability.
