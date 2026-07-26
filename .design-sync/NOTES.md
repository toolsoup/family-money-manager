# design-sync notes — Family Money Manager (Midnight Gold)

## Shape / setup
- This repo is a **Next.js app**, not a component library. The "design system" is the
  hand-authored CSS in `src/app/globals.css` (the Midnight Gold theme: tokens + component
  classes `.btn/.card/.tag/.table/.meter/.input/.dialog/.sheet/.badge/.seg/.field`).
- We sync a **thin-wrapper React library** at `.design-sync/ds-lib/` that applies those
  classes/tokens. The CSS ships verbatim (Tailwind `@import` stripped) — no redesign.
- Build the wrapper lib before the converter: `npx tsc -p .design-sync/ds-lib/tsconfig.json`
  (emits `dist/*.js` + `*.d.ts`). Converter `--entry .design-sync/ds-lib/dist/index.js`,
  `--node-modules <repo>/node_modules`, `cssEntry` is **package-relative** = `styles/globals.css`.
- `.design-sync/ds-lib/styles/globals.css` is generated from `src/app/globals.css`:
  strip `@import "tailwindcss";`, prepend a Google Fonts `@import` for Space Grotesk +
  Plus Jakarta Sans so the theme renders standalone. **Re-generate it if globals.css changes.**

## Theme rendering
- The theme sets `body { color: near-white }` for the dark canvas. The preview harness forces
  `body{background:#fff}`, so default-colored text renders white-on-white (invisible). Fixed by
  `cfg.provider = Canvas` (props `{padded:false}`) — the harness wraps every cell in the dark
  `Canvas` backdrop. If you add components and previews look blank, that's the cause.
- `Canvas` is a real DS component (the branded page backdrop, in-app on `body`) AND the provider.

## Known render warns (triaged — not new)
- `[RENDER_THIN] Dialog` — measured height 0px because `.dialog-backdrop` is `position:fixed`.
  The screenshot renders the dialog correctly (Add-account form + actions). **Benign.**
- `[FONT_REMOTE]` Space Grotesk / Plus Jakarta Sans — brand fonts load via the Google Fonts
  `@import` at runtime. Expected; not shipped as `@font-face`.

## Re-sync risks
- `styles/globals.css` is a generated copy of the app's `globals.css` — it silently goes stale
  if the app theme changes. Re-run the strip+prepend generation on any re-sync.
- The wrapper components in `.design-sync/ds-lib/src/` are hand-written adapters; if the app adds
  new `globals.css` classes/tokens, add matching wrappers so the DS stays complete.

## Grouping + per-component docs
- Components are grouped via `cfg.docsDir: "docs"` → `.design-sync/ds-lib/docs/<Name>.md`. Each doc's
  frontmatter `category:` sets the group (Actions/Forms/Data/Content/Layout/Overlays; the converter
  lowercases them to the folder/`@dsCard` slug) AND its body becomes the component's `.prompt.md`.
- A NEW component needs a matching `docs/<Name>.md` (frontmatter category + real usage body), or it
  falls back to group `general` with a synthesized prompt. Keep the doc body accurate to the API.
