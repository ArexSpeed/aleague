<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Project conventions (aleague)

### Stack

- Next.js (App Router), TypeScript strict, Tailwind, shadcn/ui on **Base UI** (not Radix).
- Do not add `@radix-ui/*` packages. Composition uses the `render` prop, not `asChild`.
- `cn` comes from the `cn` package (re-exported in `lib/utils.ts`). Do not replace it with `clsx` + `tailwind-merge`.
- Data: Zod (schemas in `types/`), TanStack Query. Zustand only for UI state.

### Structure (no `src/`)

- `app/`: routing only, thin files, logic lives in `features/`.
- `components/ui/`: shadcn components, do not edit unless necessary.
- `components/layout/`: TopBar, SideNav, MasterDetailLayout.
- `features/<name>/`: components and hooks for one area (competitions, teams, riders, match).
- `lib/`, `types/`, `stores/`, `mocks/`.
- `docs/screens/`: screen specifications.

### Rules

- All data comes from `mocks/` through an API layer (functions returning Promises), so swapping in the real API later does not change components.
- Define data types as Zod schemas and derive TS types from them.
- Styling: tokens in `app/globals.css` (CSS variables), no hardcoded colors in components.
- Before finishing work, run `pnpm typecheck && pnpm lint && pnpm build`.
- A new screen means a new file under `features/`, not extending existing generic components.

<!-- END:nextjs-agent-rules -->
