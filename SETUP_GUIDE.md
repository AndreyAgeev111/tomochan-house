# セットアップ・公開 / Setup and deployment

更新日 / Reviewed: 2026-09-20.

## ローカル開発 / Local setup

CI と同じ Node.js 22、pnpm 9 を使用してください。Use Node.js 22 and pnpm 9 to match the workflow.

```sh
node --version
# Only if pnpm 9 is not installed:
npm install --global pnpm@9
pnpm --version
git clone https://github.com/AndreyAgeev111/tomochan-house.git
cd tomochan-house
pnpm install --frozen-lockfile
pnpm dev
```

ブラウザで <http://localhost:4321> を開きます。ポートが使用中の場合はターミナルに表示された URL を使います。 Open the URL
printed by Astro; the default port is 4321.

No environment variables or API keys are required for the current static build. Maps, YouTube and analytics contact
external services in the browser.

## 編集と確認 / Editing and checking

店舗情報は `src/content/siteContent.ts`、ゴルフ結果は `src/content/golfChampionship.ts` です。コンポーネント内に直接書かれた文言もあります。
See the [content guide](docs/CONTENT_GUIDE.md) for exact fields and editing precautions.

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm preview
```

`preview` serves `dist/`; rebuild after edits. For a phone on the same trusted LAN, use `pnpm dev --host 0.0.0.0` and
open the computer's LAN IP with the printed port. This makes the development server reachable on that network. For
production-like checks use `pnpm preview --host 0.0.0.0` after building.

## GitHub Pages

公開先 / Production URL: <https://tomochan-house.jp>.

- Workflow: [`.github/workflows/astro.yml`](.github/workflows/astro.yml).
- Automatic trigger: push to **master**. Manual trigger: **workflow_dispatch**.
- CI installs pnpm 9 and Node 22, then uses `pnpm install --frozen-lockfile`.
- Types, lint, source formatting and tests must pass before building.
- Build uses `actions/configure-pages` outputs to override Astro's `site` and `base`.
- `dist/` is uploaded and deployed through the `github-pages` environment.

既存リポジトリで `git init` やブランチの改名は不要です。日常の操作は [Git ガイド](GIT_INSTRUCTIONS.md)を参照してください。
Do not reinitialize this repository or rename master to main as part of setup.

For repository administrators: Settings → Pages must use GitHub Actions and the intended custom domain, with matching
DNS and HTTPS settings. `astro.config.mjs` defaults to `site: "https://tomochan-house.jp"` and `base: "/"`; the root
`CNAME` records that domain. Since the CNAME is outside `public/`, do not assume Astro copies it into `dist/`; verify
the Pages domain setting. Do not change base to `/tomochan-house` for this custom-domain deployment.

A version tag or GitHub release does not itself trigger the current workflow.
See [release checklist](docs/RELEASING.md).

## トラブルシューティング / Troubleshooting

| Symptom                            | Check                                                                                                                                                           |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Install fails with frozen lockfile | Match Node/pnpm versions. If dependencies intentionally changed, run `pnpm install` and review/commit the lockfile with package.json. Do not bypass this in CI. |
| Port is occupied                   | Use Astro's printed URL or `pnpm dev --port 4322`.                                                                                                              |
| Type checks pass, CI still fails   | Run lint, format:check and tests separately; they check different things.                                                                                       |
| Prettier reports one file          | Run `pnpm exec prettier --write src/pages/golf-rules.astro` (substitute the reported path), then repeat format:check.                                           |
| Phone shows desktop layout         | Disable the browser's “Desktop site / サイトのPC版” option, reload, then check viewport and CSS if it persists.                                                 |
| Images are missing                 | Check filename case and references relative to public; inspect network 404s.                                                                                    |
| Changes are absent online          | Check the deployed master commit and Actions result, then refresh the page.                                                                                     |
| Build/deployment fails             | Inspect the first failing step in Actions. Publishing does not happen if build checks fail.                                                                     |

`pnpm clean` is not defined. Avoid deleting the lockfile to fix an unrelated build error.
