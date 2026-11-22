# CLAUDE.md

Agentic-harness instructions for this repository. AI coding agents (Claude Code,
OpenCode, Cursor, and similar) should read this file before making changes.
`AGENTS.md` is the canonical project brief; this file adds agent-specific rules.

## Project

Static single-page "Creator Hub" link landing page. Vite 8 + React 19 +
TypeScript 7 + Tailwind CSS v4, installed with npm. No backend and no router.
UI copy is Indonesian and uppercase; `<html lang="id">`.

## Commands

- `npm run dev` — dev server.
- `npm run preview` — preview `dist/`.
- `npm run lint` / `npm run lint:fix` — Oxlint (no ESLint, no Prettier).
- `npm run build` — `tsc -b && vite build`. This is the only typecheck path.
- `npm run test:e2e` — full Playwright suite (`tests/e2e`).
- `npm run test:e2e:ui` — Playwright UI mode.
- `npm run test:smoke` — fast Playwright smoke suite (`tests/smoke`).

## Verification order

Run every check that applies to the change, in this order:

1. `npm run lint`
2. `npm run build`
3. `npm run test:smoke`
4. `npm run test:e2e` (when interaction or UI behavior changed)

Do not claim success without the command output to back it up.

## Style

- No semicolons, single quotes, 2-space indent. No formatter enforces this.
- `verbatimModuleSyntax`: use `import type` for type-only imports.
- `erasableSyntaxOnly`: no enums, namespaces, or parameter properties.
- `.tsx`/`.ts` extensions in relative imports are intentional.
- Reuse theme tokens from `@theme` in `src/index.css` rather than new palette
  values. Keep the neubrutalist look: thick borders, hard shadows, uppercase
  mono type, neon blue/amber.

## Testing rules

- E2E and smoke tests live in `tests/e2e` and `tests/smoke` respectively.
- Both configs boot the app with the Vite dev server on their own port.
- Use Playwright locators and web-first assertions; avoid fixed sleeps.
- Never commit Playwright reports, traces, or `test-results/` (see `.gitignore`).
- Install a browser once with `npx playwright install chromium` if tests cannot
  find one.

## Dark mode

Class-based via `@custom-variant dark` in `src/index.css`, toggled with the
`creator-ui-theme` localStorage key by both `index.html` (pre-paint script) and
`src/hooks/useTheme.ts`. Keep the two in sync.

## Do not

- Do not add ESLint, Prettier, Jest, or Cypress configs; Oxlint and Playwright
  are the chosen tools.
- Do not call `navigator.clipboard` directly; use `src/utils/copyText.ts`.
- Do not "fix" the `SocialLinkCard` anchor or the kept-mounted fade-out in
  `LinkActionModal`; both are deliberate.
- Do not edit git config or run destructive git commands without asking.
- Never commit secrets (`.env`, keys, credentials) — see `.gitignore`.
