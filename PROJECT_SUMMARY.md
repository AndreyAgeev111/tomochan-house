# Project summary

Repository snapshot reviewed on **2026-09-20**. This is a current overview, not a historical launch report.

Tomochan House is a Japanese-language, statically generated restaurant website with three routes: the homepage, golf
championship results and golf rules. Hosting is GitHub Pages at <https://tomochan-house.jp>.

## Implemented

- Restaurant introduction, categorized food/drink menu, manually maintained event calendar and announcements.
- Three gallery photos configured in source, with a lightbox and mobile horizontal browsing.
- YouTube embeds, Google Maps embed, Instagram and telephone links.
- FAQ, curated testimonials, external Google review link and a winking mascot.
- Golf podium, standings, player details, rank/points charts and optional forecasts for eligible players.
- Cream/yellow homepage theme, olive golf palette, frosted navigation, full-height welcome area and noren curtain.
- Responsive navigation and grids, keyboard/focus support in interactive components, and reduced-motion handling in
  motion components.
- Astro static output, selective React hydration, lazy images and optimized WebP assets.

## Content ownership

| Source                                                    | Responsibility                                                                   |
|-----------------------------------------------------------|----------------------------------------------------------------------------------|
| `src/content/siteContent.ts`                              | Restaurant content, menu, events, gallery, contact, testimonials and media links |
| `src/content/golfChampionship.ts`                         | Players, stages, results, bonus actions, rewards and point constants             |
| `src/utils/golfChampionshipUtils.ts`                      | Derived standings, ties, histories and forecasts                                 |
| `src/pages/golf-rules.astro`                              | Human-readable scoring explanation                                               |
| `src/layouts/MainLayout.astro` and `StructuredData.astro` | Metadata and analytics, including hardcoded values                               |

## Deliberate boundaries and remaining work

There is no CMS, database, reservation backend, live review synchronization, payment integration, dark-mode toggle or
offline service worker. Contact actions leave the site or open the phone dialer. Accessibility features are implemented,
but no comprehensive conformance audit is claimed.

Lighthouse results are laboratory snapshots, not guaranteed scores; see [performance](docs/PERFORMANCE.md). Real-device
scroll FPS and interaction latency still require measurement. Social metadata currently references missing logo/OG image
files, documented in [development](DEVELOPMENT.md).

The v2.0 release description was prepared separately; package.json still reports 1.0.0. Do not infer that a release was
published from this document. See [release checklist](docs/RELEASING.md).

## Maintenance map

- [README](README.md): entry point and stack.
- [Setup](SETUP_GUIDE.md): installation, deployment and troubleshooting.
- [Development](DEVELOPMENT.md): code structure, motion, hydration and validation.
- [Content guide](docs/CONTENT_GUIDE.md): restaurant and tournament updates.
- [Git guide](GIT_INSTRUCTIONS.md): safe contribution workflow.
