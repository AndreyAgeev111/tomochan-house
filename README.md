# ともちゃん家 · Tomochan House

池袋のカラオケ居酒屋「ともちゃん家」の公式サイト。店舗案内・メニュー・営業カレンダーに加え、ゴルフチャンピオンシップの結果とルールを掲載しています。

Official Japanese-language website for a cozy izakaya in Ikebukuro, Tokyo. Built as three static pages with Astro, React
islands, and Tailwind CSS.

**Website:** <https://tomochan-house.jp>

**Repository:** <https://github.com/AndreyAgeev111/tomochan-house>

## Pages / ページ

| Route            | Contents                                                                                                                                               |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/`              | Welcome curtain, restaurant introduction, menu filters, event calendar, gallery/lightbox, YouTube, map, contact links, FAQ, reviews and winking mascot |
| `/golf-results/` | Championship podium, standings, player details, points/rank charts and optional forecasts                                                              |
| `/golf-rules/`   | Ranking points, bonus rules and mascot-guided explanation                                                                                              |

Reservations and inquiries use telephone and Instagram links. There is no booking backend, contact submission form,
payment system or live review API. Reviews and championship data are maintained in source files.

## Quick start / ローカル起動

Use **Node.js 22** and **pnpm 9**, matching CI. Install Node first; if pnpm is missing, run
`npm install --global pnpm@9`.

```sh
git clone https://github.com/AndreyAgeev111/tomochan-house.git
cd tomochan-house
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:4321> (or the URL printed by Astro if the port is occupied).

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm preview
```

## Documentation / ドキュメント

- [Setup and deployment / セットアップ・公開](SETUP_GUIDE.md)
- [Development, architecture and checks](DEVELOPMENT.md)
- [Content and golf updates / コンテンツ更新](docs/CONTENT_GUIDE.md)
- [Current project summary](PROJECT_SUMMARY.md)
- [Git workflow / Git 操作ガイド](GIT_INSTRUCTIONS.md)
- [Performance measurements and mobile checks](docs/PERFORMANCE.md)
- [Release checklist](docs/RELEASING.md)

## Stack and design

Dependency ranges are defined in [package.json](package.json); resolved versions are recorded
in [pnpm-lock.yaml](pnpm-lock.yaml).

| Tool                       | Declared range  | Role                          |
|----------------------------|-----------------|-------------------------------|
| Astro                      | `^6.1.3`        | Static HTML and asset build   |
| React / React DOM          | `^18.2.0`       | Interactive islands           |
| Tailwind CSS               | `^3.4.0`        | Responsive styles and palette |
| TypeScript                 | `^5.3.0 <5.4.0` | Type checks                   |
| Framer Motion              | `^11.0.0`       | FAQ and golf interactions     |
| yet-another-react-lightbox | `^3.29.1`       | Gallery viewer                |
| Sharp                      | `^0.35.4`       | Image processing              |

The homepage uses cream, warm brown and yellow; golf uses warm olive accents. Navigation has a frosted surface. Scroll
reveals use IntersectionObserver and the Web Animations API; the curtain and mascot effects use CSS. This is a light
theme, not a dark-mode implementation.

## Publishing

[`.github/workflows/astro.yml`](.github/workflows/astro.yml) validates and publishes pushes to **`master`** through
GitHub Pages. It also supports manual dispatch. A GitHub release tag alone does not trigger this workflow.

## Scope and status

Documentation reviewed against the repository on **2026-09-20**, for the v2.0 feature set. The package metadata still
says `1.0.0`; see the [release checklist](docs/RELEASING.md) before changing it. The package declares MIT, but this
checkout has no standalone LICENSE file; confirm licensing text and media permissions before redistribution.
