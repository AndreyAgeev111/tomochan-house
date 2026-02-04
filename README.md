# ともちゃん家（Tomochan House）

🐱 池袋の隠れ家居酒屋 | カラオケ＆手作り料理

## 📋 概要

ともちゃん家は、Astro + Tailwind CSS + React で構築された、モダンで軽量な単一ページ webサイトです。GitHub Pages にホストされており、完全にスタティック（サーバーレス）です。

### 特徴

- 🚀 **超軽量**: Astro 静的生成、最小限の React
- 📱 **モバイルファースト**: レスポンシブデザイン
- ♿ **アクセシブル**: セマンティック HTML、ARIA ラベル
- 🎨 **美しい**: Tailwind CSS + Framer Motion のアニメーション
- 🌍 **日本語対応**: 完全日本語 UI
- 🐱 **猫テーマ**: ともちゃんをテーマにした愛らしいデザイン

---

## 🛠️ 技術スタック

| 技術 | バージョン | 用途 |
| --- | --- | --- |
| Astro | 4.0+ | 静的サイトジェネレータ |
| React | 18.2+ | インタラクティブ機能（島） |
| Tailwind CSS | 3.4+ | スタイリング |
| TypeScript | 5.3+ | 型安全性 |
| Framer Motion | 11.0+ | アニメーション |
| lucide-react | 最新 | アイコン |

---

## 📁 ファイル構成

```
tomochan-house/
├── src/
│   ├── components/
│   │   ├── layout/              # ヘッダー・フッター等
│   │   ├── sections/            # 各セクション（Hero, About等）
│   │   └── common/              # 共通コンポーネント
│   ├── pages/
│   │   └── index.astro          # メインページ
│   ├── content/
│   │   └── siteContent.ts       # 📝 コンテンツ管理ファイル
│   ├── styles/
│   │   └── global.css           # グローバルスタイル
│   └── utils/
│       └── animation.ts         # アニメーション設定
├── public/
│   └── images/                  # 画像アセット
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages デプロイ
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 クイックスタート

### 1. 環境構築

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/tomochan-house.git
cd tomochan-house

# pnpm をインストール（未インストール時）
npm install -g pnpm

# 依存関係をインストール
pnpm install
```

### 2. ローカル開発

```bash
# 開発サーバーを起動（http://localhost:3000）
pnpm dev

# ビルド（本番用）
pnpm build

# プレビュー
pnpm preview
```

### 3. コンテンツ編集

すべてのコンテンツは **`src/content/siteContent.ts`** に集約されています。

```typescript
export const siteContent = {
  business: {
    name: "ともちゃん家",
    address: "東京都豊島区池袋2-5-4",
    // ... その他の情報
  },
  menu: {
    items: [
      {
        category: "料理",
        name: "から揚げ",
        description: "...",
        price: "¥780",
      },
      // ...
    ],
  },
  // ...
};
```

**編集方法:**

- **営業時間** → `siteContent.business.hours`
- **メニュー** → `siteContent.menu.items`
- **お知らせ** → `siteContent.news`
- **FAQ** → `siteContent.contact.faq`
- **イベント** → `siteContent.events.monthlyEvents`

編集後、ファイルを保存すれば、開発サーバーで自動的にリロードされます。

### 4. 画像の置き換え

```
public/images/
├── gallery-1.jpg ~ gallery-12.jpg   # ギャラリー画像（12枚）
└── （その他の画像）
```

現在、プレースホルダーグラデーションが使用されています。実際の画像に置き換えるだけで、自動的に表示されます。

---

## 🌐 GitHub Pages へのデプロイ

### 1. リポジトリ設定

1. GitHub でリポジトリを作成: `tomochan-house`
2. ローカルリポジトリにリモートを追加:

```bash
git remote add origin https://github.com/yourusername/tomochan-house.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages 設定

1. リポジトリの **Settings** → **Pages** へ移動
2. **Source** を "GitHub Actions" に設定
3. 完了！

### 3. 自動デプロイ

`.github/workflows/deploy.yml` により、`main` ブランチにプッシュすると自動的にビルド・デプロイされます。

```bash
git add .
git commit -m "Update content"
git push origin main
```

デプロイステータスは GitHub リポジトリの **Actions** タブで確認できます。

---

## 🎨 デザインカスタマイズ

### カラーパレット

`tailwind.config.mjs` の `colors` セクションで調整:

```javascript
colors: {
  warm: {
    50: "#faf8f3",  // 明るい背景
    900: "#5d4a42", // 濃いテキスト
  },
  accent: {
    light: "#fef3c7",  // ボタンハイライト
    DEFAULT: "#fcd34d",
    dark: "#f59e0b",   // ホバー状態
  },
}
```

### フォント

`tailwind.config.mjs` の `fontFamily` で変更:

```javascript
fontFamily: {
  sans: ["Hiragino Maru Gothic ProN", "system-ui", "sans-serif"],
}
```

### アニメーション

`src/utils/animation.ts` でアニメーション設定を変更できます。

---

## 📱 レスポンシブデザイン

| デバイス | ブレークポイント | 対応 |
| --- | --- | --- |
| モバイル | < 640px | ✅ 最適化 |
| タブレット | 640px - 1024px | ✅ 対応 |
| デスクトップ | > 1024px | ✅ フル対応 |

すべてのセクションがモバイル優先で設計されています。

---

## ♿ アクセシビリティ

- **セマンティック HTML**: 見出し、リスト、ランドマーク
- **ARIA ラベル**: ボタン、フォーム要素
- **キーボードナビゲーション**: すべてのインタラクティブ要素に対応
- **フォーカス状態**: 明確な視覚フィードバック
- **prefers-reduced-motion**: アニメーション削減ユーザーに対応

---

## 📊 SEO

- **OG タグ**: Facebook、Twitter のシェア対応
- **メタディスクリプション**: 検索結果に表示
- **構造化データ**: schema.org マークアップ対応
- **Sitemap**: 自動生成（`@astrojs/sitemap`）
- **ファビコン**: ブラウザタブに表示

---

## ⚡ パフォーマンス

- **Lighthouse スコア**: 95+（目標）
- **バンドルサイズ**: 最小限（React 島のみ使用）
- **キャッシング**: GitHub Pages の CDN キャッシュ
- **画像最適化**: CSS グラデーション + アスペクト比制御

---

## 🐛 トラブルシューティング

### 開発サーバーが起動しない

```bash
pnpm clean  # キャッシュ削除
pnpm install
pnpm dev
```

### ビルドエラー

```bash
# TypeScript エラー確認
pnpm check

# 完全クリーンビルド
rm -rf node_modules dist
pnpm install
pnpm build
```

### GitHub Pages に表示されない

1. リポジトリが **public** か確認
2. `.github/workflows/deploy.yml` が正しいか確認
3. **Settings** → **Pages** で "GitHub Actions" が選択されているか確認
4. `astro.config.mjs` の `base` パスが正しいか確認 (`/tomochan-house`)

---

## 📧 コンテンツ更新ガイド

### 営業時間を変更

```typescript
// src/content/siteContent.ts
business: {
  hours: [
    { day: "月〜金", time: "19:00〜4:00" },
    { day: "土日祝", time: "18:00〜5:00" },
  ],
}
```

### メニューを追加

```typescript
menu: {
  items: [
    {
      category: "料理",
      name: "新しい料理の名前",
      description: "説明文",
      price: "¥1,000",
      icon: "🍲",
    },
    // ...
  ],
}
```

### FAQ を追加

```typescript
contact: {
  faq: [
    {
      q: "新しい質問",
      a: "回答文",
    },
    // ...
  ],
}
```

### お知らせを追加

```typescript
news: [
  {
    id: 4,
    date: "2024-02-01",
    title: "新しいお知らせ",
    content: "内容",
    icon: "📱",
  },
  // ...
],
```

---

## 🔐 セキュリティ

- ✅ XSS 対策: Astro の自動エスケープ
- ✅ CSRF 対策: フォームなし（静的サイト）
- ✅ HTTP ヘッダー: GitHub Pages のセキュリティ設定
- ✅ 依存関係管理: 定期的に `pnpm update` で更新

---

## 📄 ライセンス

MIT License

---

## 👨‍💻 開発者向け

### プロジェクト構造

- **Astro**: 静的 HTML 生成
- **React**: インタラクティブな UI（メニュー、FAQ、ギャラリー等）
- **Tailwind**: ユーティリティベースの CSS
- **TypeScript**: 型安全な開発

### 新しいコンポーネントを追加

```astro
---
// src/components/sections/YourSection.astro
import SectionTitle from "../common/SectionTitle.astro";
import ScrollReveal from "../common/ScrollReveal";
import { siteContent } from "../../content/siteContent";

const { yourData } = siteContent;
---

<section id="your-section" class="py-20 bg-white">
  <SectionTitle title="セクションタイトル" />
  {/* コンテンツ */}
</section>
```

### React 島を使用

```tsx
// src/components/YourInteractiveComponent.tsx
import React, { useState } from "react";

export default function YourComponent() {
  const [state, setState] = useState("");
  return <div>{state}</div>;
}
```

### Astro ページで使用

```astro
import YourComponent from "../components/YourInteractiveComponent";

<YourComponent client:load />
```

---

## 🎯 今後の改善案

- [ ] 多言語対応（英語）
- [ ] 予約システムの統合（Stripe 等）
- [ ] Headless CMS 連携（Contentful）
- [ ] Cloudinary への画像アップロード
- [ ] ダークモード対応
- [ ] PWA 化

---

## 📞 サポート

問題が発生した場合:

1. GitHub Issues を確認
2. 詳細を記載して新しい Issue を作成

---

## 🎯 最近の更新

- ✨ **ゴルフセクション** - 新しいゴルフイベント情報を追加
- 📝 **レビューシステム** - ユーザーレビューの表示機能
- 📅 **カレンダーと地図** - 営業日程と店舗位置を表示
- 🍽️ **メニュー改善** - UI/UXを改善しました

---

**最終更新**: 2026年2月
**ステータス**: 🟢 本番対応

---

---

---

# Tomochan House

🐱 Hidden Gem Izakaya in Ikebukuro | Karaoke & Homemade Cuisine

## 📋 Overview

Tomochan House is a modern, lightweight single-page website built with Astro + Tailwind CSS + React. It's hosted on GitHub Pages and completely static (serverless).

### Features

- 🚀 **Ultra-lightweight**: Astro static generation, minimal React
- 📱 **Mobile-first**: Responsive design
- ♿ **Accessible**: Semantic HTML, ARIA labels
- 🎨 **Beautiful**: Tailwind CSS + Framer Motion animations
- 🌍 **Full Japanese Support**: Complete Japanese UI
- 🐱 **Cat-themed**: Adorable design featuring Tomochan

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
| --- | --- | --- |
| Astro | 4.0+ | Static Site Generator |
| React | 18.2+ | Interactive Features (Islands) |
| Tailwind CSS | 3.4+ | Styling |
| TypeScript | 5.3+ | Type Safety |
| Framer Motion | 11.0+ | Animations |
| lucide-react | Latest | Icons |

---

## 📁 File Structure

```
tomochan-house/
├── src/
│   ├── components/
│   │   ├── layout/              # Header, Footer, etc.
│   │   ├── sections/            # Page Sections (Hero, About, etc.)
│   │   └── common/              # Shared Components
│   ├── pages/
│   │   └── index.astro          # Main Page
│   ├── content/
│   │   └── siteContent.ts       # 📝 Content Management File
│   ├── styles/
│   │   └── global.css           # Global Styles
│   └── utils/
│       └── animation.ts         # Animation Config
├── public/
│   └── images/                  # Image Assets
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages Deployment
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Setup

```bash
# Clone repository
git clone https://github.com/yourusername/tomochan-house.git
cd tomochan-house

# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install
```

### 2. Local Development

```bash
# Start dev server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview
```

### 3. Edit Content

All content is centralized in **`src/content/siteContent.ts`**.

```typescript
export const siteContent = {
  business: {
    name: "Tomochan House",
    address: "2-5-4 Ikebukuro, Toshima-ku, Tokyo",
    // ... other info
  },
  menu: {
    items: [
      {
        category: "Dishes",
        name: "Karaage",
        description: "...",
        price: "¥780",
      },
      // ...
    ],
  },
  // ...
};
```

**How to Edit:**

- **Business Hours** → `siteContent.business.hours`
- **Menu** → `siteContent.menu.items`
- **News** → `siteContent.news`
- **FAQ** → `siteContent.contact.faq`
- **Events** → `siteContent.events.monthlyEvents`

After saving, the dev server automatically reloads.

### 4. Replace Images

```
public/images/
├── gallery-1.jpg ~ gallery-12.jpg   # Gallery Images (12 images)
└── (Other images)
```

Currently using placeholder gradients. Just replace with actual images and they'll display automatically.

---

## 🌐 Deploy to GitHub Pages

### 1. Repository Setup

1. Create repository on GitHub: `tomochan-house`
2. Add remote to your local repository:

```bash
git remote add origin https://github.com/yourusername/tomochan-house.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages Configuration

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Done!

### 3. Auto-Deploy

With `.github/workflows/deploy.yml`, pushing to `main` automatically builds and deploys.

```bash
git add .
git commit -m "Update content"
git push origin main
```

Check deployment status in your repository's **Actions** tab.

---

## 🎨 Design Customization

### Color Palette

Adjust colors in `tailwind.config.mjs` `colors` section:

```javascript
colors: {
  warm: {
    50: "#faf8f3",  // Light background
    900: "#5d4a42", // Dark text
  },
  accent: {
    light: "#fef3c7",  // Button highlight
    DEFAULT: "#fcd34d",
    dark: "#f59e0b",   // Hover state
  },
}
```

### Font

Change in `tailwind.config.mjs` `fontFamily`:

```javascript
fontFamily: {
  sans: ["Hiragino Maru Gothic ProN", "system-ui", "sans-serif"],
}
```

### Animations

Modify animation settings in `src/utils/animation.ts`.

---

## 📱 Responsive Design

| Device | Breakpoint | Support |
| --- | --- | --- |
| Mobile | < 640px | ✅ Optimized |
| Tablet | 640px - 1024px | ✅ Supported |
| Desktop | > 1024px | ✅ Full Support |

All sections are designed mobile-first.

---

## ♿ Accessibility

- **Semantic HTML**: Headings, lists, landmarks
- **ARIA Labels**: Buttons, form elements
- **Keyboard Navigation**: All interactive elements supported
- **Focus States**: Clear visual feedback
- **prefers-reduced-motion**: Support for users with motion preferences

---

## 📊 SEO

- **OG Tags**: Facebook, Twitter sharing support
- **Meta Descriptions**: Display in search results
- **Structured Data**: schema.org markup support
- **Sitemap**: Auto-generated (`@astrojs/sitemap`)
- **Favicon**: Display in browser tab

---

## ⚡ Performance

- **Lighthouse Score**: 95+ (target)
- **Bundle Size**: Minimal (React islands only)
- **Caching**: GitHub Pages CDN caching
- **Image Optimization**: CSS gradients + aspect ratio control

---

## 🐛 Troubleshooting

### Dev server won't start

```bash
pnpm clean  # Clear cache
pnpm install
pnpm dev
```

### Build errors

```bash
# Check TypeScript errors
pnpm check

# Full clean rebuild
rm -rf node_modules dist
pnpm install
pnpm build
```

### Not showing on GitHub Pages

1. Verify repository is **public**
2. Check `.github/workflows/deploy.yml` exists
3. Verify **Settings** → **Pages** has "GitHub Actions" selected
4. Check `astro.config.mjs` `base` path is correct (`/tomochan-house`)

---

## 📧 Content Update Guide

### Change business hours

```typescript
// src/content/siteContent.ts
business: {
  hours: [
    { day: "Mon-Fri", time: "19:00-04:00" },
    { day: "Sat-Sun/Holidays", time: "18:00-05:00" },
  ],
}
```

### Add menu item

```typescript
menu: {
  items: [
    {
      category: "Dishes",
      name: "New Dish Name",
      description: "Description",
      price: "¥1,000",
      icon: "🍲",
    },
    // ...
  ],
}
```

### Add FAQ

```typescript
contact: {
  faq: [
    {
      q: "New question",
      a: "Answer text",
    },
    // ...
  ],
}
```

### Add news

```typescript
news: [
  {
    id: 4,
    date: "2024-02-01",
    title: "News Title",
    content: "Content",
    icon: "📱",
  },
  // ...
],
```

---

## 🔐 Security

- ✅ XSS Protection: Astro auto-escaping
- ✅ CSRF Protection: No forms (static site)
- ✅ HTTP Headers: GitHub Pages security settings
- ✅ Dependency Management: Regular `pnpm update`

---

## 📄 License

MIT License

---

## 👨‍💻 For Developers

### Project Structure

- **Astro**: Static HTML generation
- **React**: Interactive UI (menu, FAQ, gallery, etc.)
- **Tailwind**: Utility-based CSS
- **TypeScript**: Type-safe development

### Add new component

```astro
---
// src/components/sections/YourSection.astro
import SectionTitle from "../common/SectionTitle.astro";
import ScrollReveal from "../common/ScrollReveal";
import { siteContent } from "../../content/siteContent";

const { yourData } = siteContent;
---

<section id="your-section" class="py-20 bg-white">
  <SectionTitle title="Section Title" />
  {/* Content */}
</section>
```

### Use React islands

```tsx
// src/components/YourInteractiveComponent.tsx
import React, { useState } from "react";

export default function YourComponent() {
  const [state, setState] = useState("");
  return <div>{state}</div>;
}
```

### Use in Astro page

```astro
import YourComponent from "../components/YourInteractiveComponent";

<YourComponent client:load />
```

---

## 🎯 Future Improvements

- [ ] Multi-language support (English)
- [ ] Reservation system integration (Stripe, etc.)
- [ ] Headless CMS integration (Contentful)
- [ ] Cloudinary image uploads
- [ ] Dark mode support
- [ ] PWA conversion

---

## 📞 Support

If you encounter issues:

1. Check GitHub Issues
2. Create a new Issue with details

---

## 🎯 Recent Updates

- ✨ **Golf Section** - New golf event information added
- 📝 **Review System** - User review display functionality
- 📅 **Calendar & Map** - Business schedule and store location display
- 🍽️ **Menu Improvements** - Enhanced UI/UX

---

**Last Updated**: February 2026
**Status**: 🟢 Production Ready