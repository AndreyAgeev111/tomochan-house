# Git 操作ガイド / Git workflow

更新日: 2026-09-20。公開ブランチは **master** です。master に push すると、検証に成功した後で本番サイトが更新されます。 The
deployment branch is master; pushes can publish changes after CI succeeds.

## 1. 作業前 / Before editing

```sh
git status
git branch --show-current
git fetch origin
```

未コミットの変更がある場合は、先に内容を確認して保存・コミットしてください。他の人の変更を上書きしないでください。 If the
working tree is clean, update master and start a work branch:

```sh
git switch master
git pull --ff-only origin master
git switch -c codex/update-site-content
```

ブランチ名は作業に合わせて変更してください。`--ff-only` が失敗したら履歴が分岐しています。強制 push や reset
をせず、差分を確認して相談してください。 Use a descriptive branch name. A failed fast-forward means histories diverged;
inspect the history rather than forcing a reset or push.

## 2. 編集・確認 / Edit and validate

[コンテンツ更新ガイド](docs/CONTENT_GUIDE.md)に従って編集し、ブラウザで確認します。

```sh
pnpm check
pnpm lint
pnpm format:check
pnpm test
pnpm build
git diff
```

## 3. コミット / Commit selected changes

```sh
# Example: stage only the file you intended to change.
git add src/content/siteContent.ts
git diff --cached
git commit -m "Update restaurant menu and calendar"
git push -u origin codex/update-site-content
```

上のブランチ名は自分の作業ブランチに置き換えてください。`git add .` の前に必ず全変更を確認してください。 Open a pull
request targeting master and review the changes. The current Pages workflow runs on master pushes or manual dispatch,
not on pull requests; local checks are still necessary before merging. Verify Actions after merge.

## 4. 公開確認 / Verify publication

GitHub の Actions で Build と Deploy が成功したことを確認し、<https://tomochan-house.jp> を開きます。スマートフォン表示と変更した箇所を確認してください。
A successful push alone does not prove that deployment succeeded.

## 困ったとき / Troubleshooting

- **Push rejected:** `git fetch origin` で確認し、相手側の変更と自分の変更を比較します。安易に force push しないでください。
- **Conflict:** ファイルごとに双方の意図を確認して統合します。一括で “ours” / “theirs” を選ばないでください。
- **Accidental edit:** `git diff -- path/to/file` で確認します。`git restore` は未コミットの変更を失うため、必要な内容を保存してから使います。
- **Published regression:** 問題のコミットを特定し、レビューした修正または revert
  コミットを作成して通常の検証・公開手順を実施します。共有履歴を書き換えないでください。
- **CI formatting error:** 報告されたファイルに Prettier を実行し、再度 `pnpm format:check` を実行します。

VS Code の Source Control では変更の確認、ファイル単位のステージング、コミット、push が可能です。エディタの Undo と Git
履歴の取り消しは別の操作です。
