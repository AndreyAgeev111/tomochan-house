# Development guide

Reviewed: 2026-09-20. Start with [setup](SETUP_GUIDE.md); use Node.js 22 and pnpm 9 as in CI.

## Commands

| Command             | Purpose                                       |
| ------------------- | --------------------------------------------- |
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
  pages/                 index.astro, golf-results.astro, golf-results/2027.astro, golf-rules.astro
  layouts/               MainLayout.astro: metadata, shared navigation, analytics
  components/
    common/astro/        ScrollReveal, WinkingCat, SectionTitle, StructuredData, PawPrints
    layout/astro/        Header, Footer
    layout/react/        StickyNav
    sections/astro/      Homepage sections
    sections/react/      MenuFilter, Calendar, GalleryLightbox, FAQ, MapWithMarker
    golf/astro/          GolfPageHero, GolfRewards, JapaneseText
    golf/react/          GolfChampionship, JapaneseText
  content/               siteContent.ts, golfChampionship.ts, golfTournament.ts, seasonalAnnouncements.ts
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
- The 2027 season without results renders without GolfChampionship hydration; its route enables `client:load` when results exist.
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
- `BirthdayEvent.astro` uses `birthdayCelebration.ts` for a four-second confetti, fanfare and balloon animation when
  the birthday copy becomes visible, with an optional replay button. Reduced motion keeps the static decoration.
- `SeasonChampion.astro` appears on golf season pages only and renders for a completed season with actual results. `championCelebration.ts` runs a
  four-second silent confetti/fireworks celebration when visible; sound requires the fanfare button. Reduced motion
  disables visual effects, and leaving or hiding the page stops effects and audio.
- `NewYearDecor.astro` adds the shared garland and homepage-only CSS snowfall (42 flakes on desktop, 22 on mobile).
  `winterWeather.ts` pauses snow when the document is hidden or reduced motion is enabled. The Japanese pause button
  stores the visitor's choice locally. Snowfall and its control appear only after scrolling beyond the hero, and
  disappear when returning to it. Without JavaScript, the snowfall stays hidden.
- `WinterJourney.astro` starts after the homepage hero. Its opaque section panels reserve side gutters and ten
  separate winter corridors between sections. `winterJourney.ts` draws one continuous smooth zigzag diagonally across
  each whole section, reversing direction in the gaps. Opaque panel surfaces cover the trail underneath the content;
  the exposed bends remain visible in the gutters and gaps. Trees and presents occupy only corridor space, with their
  whole bounds fitted beside the trail, including both sides of each bend. Resize observation updates the geometry.
  Winter content keeps full opacity during entrance motion. Snow and the trail do not render on golf pages.
  All winter decorations ignore pointer input, are hidden from assistive technology and print, and respect reduced motion.
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
lifecycle behavior. `tests/championCelebration.test.mjs` and `tests/winterWeather.test.mjs` check celebration and snow
controls, motion preferences and page lifecycle. `tests/winterJourney.test.mjs` checks trail continuity and clearing
separation across responsive widths. These are not browser, accessibility or real-device performance tests.

ESLint configuration is in `.eslintrc.json`; Prettier uses `.prettierrc.json` and the Astro plugin. Astro type checking
can pass while ESLint rejects TypeScript syntax inside a script block. Keep simple inline scripts compatible with the
configured parser or move typed logic to a `.ts` module; run both checks.

Optional Python `pre-commit` hooks are configured in `.pre-commit-config.yaml`: whitespace, final newline, YAML, files
over 1000 KB and formatting. Install the pre-commit tool separately, then run `pre-commit install` or
`pre-commit run --all-files`. Hooks do not replace the full validation sequence.

## Assets and metadata

### Golf seasons and seasonal announcements

`golfChampionship` retains the 2026 results at `/golf-results/`; `golfChampionship2027` is the separate upcoming season
at `/golf-results/2027/`. `status` is `upcoming`, `active` or `completed`. An upcoming season may have `totalStages: 0`
until the schedule is known. It cannot contain results or completed stages. To close a season, record every actual
round, set both stage counts to the actual number held, then set `status: "completed"`. Validation requires results
for every round before closure. The final banner uses the existing points and tie-break calculation; completed
seasons have final ranking labels and no forecasts.

The owner confirmed that 2026 scoring includes May 12, July 29, September 22 and November 17. The earlier March event
is excluded from this championship. Internal round numbers therefore differ from the poster's all-event numbering;
the table includes round dates to make the distinction clear. Original score sheets and correspondence screenshots
must stay out of public assets; display approved nicknames or existing initials and retain opaque player IDs.
The November runner-up uses English initials `AY`, as requested by the owner. Its opaque ID remains separate because
the supplied identity does not match the earlier `AY` player's identity; do not merge histories
based only on matching initials. The final podium is よっぴー (80 pt), かわいちゃん (65 pt) and ともちゃん (55 pt).

`seasonalAnnouncements.ts` contains the confirmed second-anniversary event on December 11–13, 2026 and year-end party
reservations. Their original posters are available as WebP files under `public/images/events/`; bookings use Instagram
or the existing telephone number. The year-end poster confirms consultation on food and drinks without fixed dates
or prices. It does not announce a separate January party. `golfTournament.ts` contains the January 20, 2027 opening
golf announcement from the owner's corrected poster: Prestige Country Club, assembly 7:25, start 7:56 (four groups),
play fee ¥10,900 and separate participation fee ¥8,000. `GolfTournamentAnnouncement.astro` displays the poster and
details on the homepage only, as requested by the owner. The 2027 season page shows that the season starts soon;
its schedule, participants and results remain empty. The poster's 第5回 event number is independent of the season's
scoring round numbers. The November business calendar remains unchanged because the owner
has not supplied December closing dates.

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
