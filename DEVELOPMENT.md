# Development guide

Reviewed: 2026-09-20. Start with [setup](SETUP_GUIDE.md); use Node.js 22 and pnpm 9 as in CI.

## Commands

| Command             | Purpose                                       |
|---------------------|-----------------------------------------------|
| `pnpm dev`          | Astro development server, normally port 4321  |
| `pnpm build`        | Static production build in `dist/`            |
| `pnpm preview`      | Serve the existing production build locally   |
| `pnpm check`        | Astro and TypeScript diagnostics              |
| `pnpm lint`         | ESLint over JS, JSX, TS, TSX and Astro source |
| `pnpm lint:fix`     | Apply ESLint automatic fixes; review the diff |
| `pnpm format`       | Format matching files under `src/`            |
| `pnpm format:check` | Check formatting under `src/`                 |
| `pnpm test`         | Node test runner for `tests/*.test.mjs`       |

There is no `clean` script. Root documentation is outside the `format:check` glob; check it separately with
`pnpm exec prettier --check "*.md" "docs/**/*.md"`.

## Architecture

```text
src/
  pages/                 index.astro, golf-results.astro, golf-rules.astro
  layouts/               MainLayout.astro: metadata, shared navigation, analytics
  components/
    common/astro/        ScrollReveal, WinkingCat, SectionTitle, StructuredData, PawPrints
    layout/astro/        Header, Footer
    layout/react/        StickyNav
    sections/astro/      Homepage sections
    sections/react/      MenuFilter, Calendar, GalleryLightbox, FAQ, MapWithMarker
    golf/astro/          GolfPageHero, GolfRewards, JapaneseText
    golf/react/          GolfChampionship, JapaneseText
  content/               siteContent.ts, golfChampionship.ts
  styles/                global.css
  utils/                 scrollReveal.ts, golfChampionshipUtils.ts, animation.ts
  config/                animation.config.ts
public/                  Static assets copied unchanged to the output
tests/                   Scoring and scroll-reveal regression tests
```

Astro renders content at build time. There is no application server or database. JSX does not automatically imply client
JavaScript: MapWithMarker renders static markup without a hydration directive.

### Hydration

- StickyNav and GolfChampionship use `client:load`.
- MenuFilter, Calendar, GalleryLightbox and FAQ use `client:visible` with a 300 px root margin. Server-rendered HTML is
  available before hydration.
- The map iframe loads lazily; the surrounding React component is not hydrated.
- Test anchor jumps and immediate interactions on a slow connection when changing hydration timing.

### Motion

- `ScrollReveal.astro` creates a stable observed wrapper and a moving inner wrapper.
- `src/utils/scrollReveal.ts` uses one IntersectionObserver, Web Animations, transform and opacity. It avoids restarting
  a running reveal and handles reduced motion and focus.
- Curtain, floating hero cat and scroll cue live in `global.css` and `Hero.astro`.
- `WinkingCat.astro` blends the eye region of `public/cat-wink.webp` over `public/cat-face.webp`. Its six-second CSS
  cycle runs only while observed and the document is visible; reduced motion disables it.
- FAQ and golf components also use Framer Motion.
- `animation.ts` and `animation.config.ts` are existing helper definitions, currently not imported by components. They
  are not the source of truth for all animation timings.

Prefer transform/opacity to animated layout properties. Do not make readable content depend on JavaScript completing an
entrance animation. Keep mobile effects modest and verify them on actual devices;
see [performance](docs/PERFORMANCE.md).

### Styling and responsive behavior

Colors, fonts and utilities: `tailwind.config.mjs`. Shared theme overrides and animations: `src/styles/global.css`.
Tailwind breakpoints retain their defaults: sm 640, md 768, lg 1024 px. StickyNav switches at 768 px, while the header's
full navigation uses lg. There is no single universal mobile breakpoint.

The hero uses `min-height: 100svh` so tall screens are not capped at 900 px. Preserve content overflow on short screens.
Test widths 360, 390, 412, 768 and 1280 px, landscape, keyboard focus and reduced motion.

## Validation

Run the same sequence as the deployment workflow:

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

`tests/golfChampionship.test.mjs` covers scoring/standings/chart logic; `tests/scrollReveal.test.mjs` covers reveal
lifecycle behavior. These are not browser, accessibility or real-device performance tests.

ESLint configuration is in `.eslintrc.json`; Prettier uses `.prettierrc.json` and the Astro plugin. Astro type checking
can pass while ESLint rejects TypeScript syntax inside a script block. Keep simple inline scripts compatible with the
configured parser or move typed logic to a `.ts` module; run both checks.

Optional Python `pre-commit` hooks are configured in `.pre-commit-config.yaml`: whitespace, final newline, YAML, files
over 1000 KB and formatting. Install the pre-commit tool separately, then run `pre-commit install` or
`pre-commit run --all-files`. Hooks do not replace the full validation sequence.

## Assets and metadata

Use existing WebP files in `public/`; imported Astro image assets may be processed during build. Public assets are not
automatically resized. Keep explicit dimensions/aspect ratios and use lazy loading below the fold. Gallery metadata and
filenames must agree.

MainLayout defines canonical/Open Graph tags, viewport and Google Analytics. StructuredData has additional business
metadata. Some values are hardcoded, so editing `siteContent.ts` alone may not update all metadata. Current references
to `/og-image.png` and `/logo.png` have no corresponding public files; add approved assets or update references in a
separate code change before claiming complete social previews.

A web manifest exists, but there is no service worker/offline implementation. `vercel.json` contains Vercel-specific
configuration; it does not configure headers on GitHub Pages.

## Scope of changes

For content fields, use [CONTENT_GUIDE](docs/CONTENT_GUIDE.md). For release/version coordination,
use [RELEASING](docs/RELEASING.md). Update these documents whenever scripts, hydration strategy, routes, scoring or
deployment behavior changes.
