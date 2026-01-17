# 🚀 ともちゃん家 - セットアップガイド

## ステップ 1: ファイル準備

すべてのファイルがすでに配置されています！

```
tomochan-house/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/
├── .github/workflows/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## ステップ 2: 依存関係をインストール

```bash
# Node.jsがインストールされているか確認
node --version

# pnpm をインストール（未インストール時）
npm install -g pnpm

# プロジェクトディレクトリに移動
cd tomochan-house

# 依存関係をインストール
pnpm install
```

## ステップ 3: ローカルで実行

```bash
pnpm dev
```

ブラウザで `http://localhost:3000` にアクセスすると、サイトが表示されます。

## ステップ 4: コンテンツをカスタマイズ

すべてのコンテンツは `src/content/siteContent.ts` に集約されています。

### 基本情報を編集

```typescript
// src/content/siteContent.ts
business: {
  name: "ともちゃん家",           // 店名
  phone: "03-XXXX-XXXX",          // 電話番号
  address: "東京都豊島区池袋2-5-4", // 住所
  instagramHandle: "tomochan_house", // Instagram
}
```

### メニューを追加

```typescript
menu: {
  items: [
    {
      category: "料理",
      name: "料理の名前",
      description: "説明文",
      price: "¥1,000",
      icon: "🍲",
    },
  ],
}
```

### 画像を置き換え

`public/images/` に以下を配置:

- `gallery-1.jpg` ~ `gallery-12.jpg` (正方形画像推奨)

## ステップ 5: GitHub Pages にデプロイ

### 5.1 GitHub にプッシュ

```bash
# Git を初期化
git init
git add .
git commit -m "Initial commit - Tomochan House website"

# GitHub にプッシュ
git remote add origin https://github.com/yourusername/tomochan-house.git
git branch -M main
git push -u origin main
```

### 5.2 GitHub Pages を設定

1. GitHub リポジトリを開く
2. **Settings** → **Pages** へ移動
3. **Source** を "GitHub Actions" に設定
4. 保存

### 5.3 自動デプロイ

`.github/workflows/deploy.yml` により、`main` ブランチにプッシュすると自動的にデプロイされます。

デプロイ完了後、以下の URL でサイトが公開されます:

```
https://yourusername.github.io/tomochan-house
```

## トラブルシューティング

### Q: 開発サーバーが起動しない

**A:** 以下を実行:

```bash
pnpm clean
pnpm install
pnpm dev
```

### Q: GitHub Pages にデプロイできない

**A:** 以下を確認:

1. リポジトリが **public** か確認
2. `.github/workflows/deploy.yml` が存在するか確認
3. `astro.config.mjs` の `base` が `/tomochan-house` か確認
4. リポジトリ Settings → Pages で確認

### Q: 画像が表示されない

**A:** `public/images/` にファイルを配置し、ファイル名を確認してください。

### Q: 自動デプロイが失敗した

**A:** GitHub Actions ログを確認:

1. リポジトリの **Actions** タブを開く
2. 失敗したワークフローをクリック
3. ログを確認

## よくある変更

### 営業時間を変更

```typescript
hours: [
  { day: "月〜金", time: "19:00〜4:00" },
  { day: "土日祝", time: "18:00〜5:00" },
]
```

### Instagram ハンドルを変更

```typescript
instagramHandle: "your_instagram_handle"
```

### FAQ を追加

```typescript
faq: [
  {
    q: "新しい質問",
    a: "回答文",
  },
]
```

### お知らせを追加

```typescript
news: [
  {
    id: 4,
    date: "2024-01-25",
    title: "タイトル",
    content: "内容",
    icon: "📱",
  },
]
```

---

## 💡 ヒント

- ローカルで編集 → ファイルを保存すると自動リロード
- デプロイ前に `pnpm build` で本番ビルドをテスト
- GitHub Actions で自動デプロイ中は Actions タブで確認可能
- SEO 最適化済み（タイトル、メタディスクリプション等）

---

✅ これでセットアップは完了です！楽しいサイト構築を！🐱

---

---

---

# 🚀 Tomochan House - Setup Guide

## Step 1: File Preparation

All files are already in place!

```
tomochan-house/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/
├── .github/workflows/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

## Step 2: Install Dependencies

```bash
# Check if Node.js is installed
node --version

# Install pnpm (if not already installed)
npm install -g pnpm

# Navigate to project directory
cd tomochan-house

# Install dependencies
pnpm install
```

## Step 3: Run Locally

```bash
pnpm dev
```

Open `http://localhost:3000` in your browser to see the site.

## Step 4: Customize Content

All content is centralized in `src/content/siteContent.ts`.

### Edit Business Information

```typescript
// src/content/siteContent.ts
business: {
  name: "Tomochan House",           // Store name
  phone: "03-XXXX-XXXX",            // Phone number
  address: "2-5-4 Ikebukuro, Toshima-ku, Tokyo", // Address
  instagramHandle: "tomochan_house", // Instagram
}
```

### Add Menu Items

```typescript
menu: {
  items: [
    {
      category: "Dishes",
      name: "Dish Name",
      description: "Description",
      price: "¥1,000",
      icon: "🍲",
    },
  ],
}
```

### Replace Images

Place images in `public/images/`:

- `gallery-1.jpg` ~ `gallery-12.jpg` (square images recommended)

## Step 5: Deploy to GitHub Pages

### 5.1 Push to GitHub

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit - Tomochan House website"

# Push to GitHub
git remote add origin https://github.com/yourusername/tomochan-house.git
git branch -M main
git push -u origin main
```

### 5.2 Configure GitHub Pages

1. Open your GitHub repository
2. Go to **Settings** → **Pages**
3. Set **Source** to "GitHub Actions"
4. Save

### 5.3 Auto-Deploy

With `.github/workflows/deploy.yml`, pushing to `main` automatically deploys.

After deployment completes, your site will be available at:

```
https://yourusername.github.io/tomochan-house
```

## Troubleshooting

### Q: Dev server won't start

**A:** Run:

```bash
pnpm clean
pnpm install
pnpm dev
```

### Q: Can't deploy to GitHub Pages

**A:** Check:

1. Repository is **public**
2. `.github/workflows/deploy.yml` exists
3. `astro.config.mjs` `base` is `/tomochan-house`
4. Repository Settings → Pages

### Q: Images not displaying

**A:** Verify files are in `public/images/` and filenames are correct.

### Q: Auto-deploy failed

**A:** Check GitHub Actions logs:

1. Open your repository's **Actions** tab
2. Click the failed workflow
3. Review the logs

## Common Changes

### Change business hours

```typescript
hours: [
  { day: "Mon-Fri", time: "19:00-04:00" },
  { day: "Sat-Sun/Holidays", time: "18:00-05:00" },
]
```

### Change Instagram handle

```typescript
instagramHandle: "your_instagram_handle"
```

### Add FAQ

```typescript
faq: [
  {
    q: "New question",
    a: "Answer text",
  },
]
```

### Add news

```typescript
news: [
  {
    id: 4,
    date: "2024-01-25",
    title: "Title",
    content: "Content",
    icon: "📱",
  },
]
```

---

## 💡 Tips

- Edit locally → save and auto-reloads
- Test production build with `pnpm build` before deploying
- Monitor auto-deployment in Actions tab
- SEO optimized (title, meta descriptions, etc.)

---

✅ Setup complete! Enjoy building your site! 🐱