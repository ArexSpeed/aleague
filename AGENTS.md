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

Full description: `docs/folder-structure.md`.

- `app/`: routing only, thin files. Routes are generic: `app/(app)/[sport]/...`.
- `sports/<sport>/`: config, api, mocks, types and `views/` of one sport. Registered in `sports/registry.ts`.
- `components/`: shared bricks (`ui`, `layout`, `table`, `toggle`, `tabs`, `data`). No sport knowledge; they take data, hrefs and labels as props.
- `lib/`, `stores/`.
- `docs/screens/`: screen specifications.

### Rules

- Dependencies go one way: `app -> sports/<sport> -> components, lib`. Sports never import each other (ESLint enforces it).
- A new screen of a sport is a new folder under `sports/<sport>/views/`, composed from `components/` bricks. If two sports need the same view, extract the shared part into `components/`.
- All data comes from `sports/<sport>/mocks/` through `sports/<sport>/api/` (functions returning Promises).
- Define data types as Zod schemas and derive TS types from them.
- State that can be linked (tab, filter, selected team) lives in the URL, not in Zustand.
- Styling: no hardcoded colours. Use semantic classes (`bg-surface`, `text-fg`, `text-fg-muted`, `border-line`, `text-win`, `bg-brand`...). Values live only in `app/styles/themes/*.css`; never check the active theme in a component.
- Before finishing work, run `pnpm typecheck && pnpm lint && pnpm build`.

<!-- END:nextjs-agent-rules -->
