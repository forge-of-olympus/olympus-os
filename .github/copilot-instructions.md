# Copilot Instructions for Olympus OS

## Project Overview
Olympus OS is a modular React + TypeScript application structured for extensibility and clear separation of concerns. The codebase is organized by feature, with services, hooks, contexts, and UI components grouped logically.

## Architecture & Major Components
- **src/**: Main source directory. Contains:
  - **components/**: Reusable UI elements, grouped by feature and UI type.
  - **contexts/**: React context providers (e.g., `AIContext.tsx` for AI state management).
  - **hooks/**: Custom React hooks (e.g., `use-mobile.tsx`).
  - **lib/**: Utilities, mock data, and service integrations. Includes `indexedDB` and `services` subfolders.
  - **pages/**: Route-level components, organized by domain (e.g., `account/`, `brain/`, `lab/`, `ops/`).
  - **layout/**: Layout and navigation components.
- **public/**: Static assets (e.g., icons).
- **supabase/**: Database migrations.

## Data Flow & Service Boundaries
- **Service Layer**: All business logic and API calls are handled in `src/lib/services/`.
- **Context Providers**: State is shared via React contexts (see `src/contexts/`).
- **IndexedDB**: Local storage is abstracted in `src/lib/indexedDB/`.
- **Pages**: Route components orchestrate data fetching and UI composition.

## Developer Workflows
- **Build**: Use Vite (`vite.config.ts`).
  - Run: `npm run dev` for development, `npm run build` for production.
- **Styling**: Tailwind CSS (`tailwind.config.js`, `postcss.config.js`).
- **Type Checking**: TypeScript (`tsconfig.json`).
- **No explicit test or lint scripts found** (add if needed).

## Project-Specific Patterns
- **Feature-first organization**: Pages and components are grouped by domain.
- **Service abstraction**: All external API and business logic in `lib/services/`.
- **Context-driven state**: Use React context for cross-component state.
- **UI primitives**: `components/ui/` contains atomic UI elements (e.g., `Button.tsx`, `Card.tsx`).

## Integration Points
- **Supabase**: Database migrations in `supabase/migrations/`.
- **IndexedDB**: Local storage for client-side persistence.
- **External APIs**: Abstracted via service files.

## Examples
- To add a new feature, create a folder in `src/pages/` and corresponding components/services.
- To extend AI functionality, update `src/contexts/AIContext.tsx` and `src/lib/services/ai-service.ts`.

## Key Files
- `src/App.tsx`: App entry point.
- `src/main.tsx`: React root render.
- `src/contexts/AIContext.tsx`: AI state management.
- `src/lib/services/ai-service.ts`: AI service abstraction.
- `vite.config.ts`: Build config.

---

**For AI agents:**
- Prefer feature-first structure when adding new code.
- Abstract business logic in service files.
- Use context for shared state.
- Reference UI primitives for consistent design.

_Ask for feedback if any section is unclear or missing._
