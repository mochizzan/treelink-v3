# AGENTS.md

Static single-page "Creator Hub" link landing page. Vite 8 + React 19 + TypeScript 7 + Tailwind CSS v4, installed with npm. No backend, router, test suite, or codegen.

## Commands

- `npm run dev` — dev server. `npm run preview` — preview `dist/`.
- `npm run build` runs `tsc -b && vite build`. This is the **only** typecheck path; there is no `typecheck` script. Use `npx tsc -b` to typecheck without a build.
- `npm run lint` / `npm run lint:fix` use **Oxlint**. There is no ESLint or Prettier — don't add configs expecting them to run.
- Verification order: `npm run lint` → `npm run build`.

## TypeScript / style

- `verbatimModuleSyntax`: type-only imports must use `import type` (done throughout the repo).
- `erasableSyntaxOnly`: no enums, namespaces, or parameter properties.
- `allowImportingTsExtensions`: `.tsx`/`.ts` in import paths (e.g. `./App.tsx`) is intentional.
- `tsconfig.json` is a solution file: `tsconfig.app.json` covers `src/`, `tsconfig.node.json` covers only `vite.config.ts`. Files outside these `include`s are not typechecked.
- House style: no semicolons, single quotes, 2-space indent. No formatter enforces this — match surrounding code.

## Dark mode — two places must stay in sync

- Class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *))` in `src/index.css`.
- `index.html` has an inline pre-paint script that reads localStorage key `creator-ui-theme` and adds `.dark` to `<html>`.
- `src/hooks/useTheme.ts` toggles that class and persists the same key. Update both if the key or mechanism changes.

## Styling / copy conventions

- Theme tokens are in the `@theme` block of `src/index.css`: `font-display` (Chakra Petch), `font-mono` (IBM Plex Mono), `brand-blue`/`brand-sky`/`brand-amber`, and `shadow-rigid-*`. Reuse these rather than inventing palette values.
- `bg-grid-light` and `outer-accent-frame` are plain CSS classes in that file, not Tailwind utilities.
- Deliberate neubrutalist look: thick borders, hard offset shadows, uppercase mono type, neon blue/amber. UI strings are Indonesian and uppercase, `<html lang="id">`. Keep new copy consistent.

## Architecture landmarks

- `src/main.tsx` (StrictMode) → `src/App.tsx`, which owns `activeLink` and composes `TopBanner`, `ProfileHeader`, the `SocialLinkCard` list, `MoreMenu`, `LinkActionModal`, and `Toast`.
- Shared primitives live in `src/components/ui/`. Icons are inline SVG React components in `src/components/ui/icons.tsx` — no icon library is installed; `src/assets/*` and `public/icons.svg` are mostly unused template leftovers.
- Editable content: `src/data/socialLinks.ts` (`socialLinks`, `TIP_URL`). Hooks: `src/hooks/` (`useTheme`, `useToast`, `useTemporaryState`).
- `src/utils/copyText.ts` wraps the Clipboard API with a legacy fallback — use it for every copy action instead of calling `navigator.clipboard` directly.

## Interaction quirks

- `SocialLinkCard` renders an `<a>` but calls `preventDefault()` to open `LinkActionModal`; the modal's DIRECT button performs the real navigation. Don't "fix" the anchor.
- `LinkActionModal` stays mounted and toggles `inert`/opacity, retaining the last link during fade-out. Preserve this when changing its transitions.
- Toasts are driven by `showToast` passed down from `App` (via `useToast`), not global state.
