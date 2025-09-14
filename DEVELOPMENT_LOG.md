# G-HOUSE プレゼンテーションシステム 開発ログ

## プロジェクト概要
- **開発日**: 2025年1月14日
- **開発者**: Claude Code Assistant + nishinocat
- **リポジトリ**: https://github.com/nishinocat/alice

## 主要機能
1. **プレゼンテーションモード**
   - 編集モードとプレゼンモードの切り替え
   - プレゼンテーションフローモード（スライドショー形式）

2. **5つのプレゼンテーション**
   - プレゼン1: デザイン（PDF/PowerPointアップロード）
   - プレゼン2: 標準装備（10項目）
   - プレゼン3: オプション（インタラクティブ選択）
   - プレゼン4: 資金計画（ローンシミュレーション）
   - プレゼン5: 光熱費（30年シミュレーション）

## デザインシステム
### CROWNカタログデザイン
- トヨタCROWNカタログのデザインシステムを採用
- 黒背景、青アクセント、グラデーション
- 高級感のあるタイポグラフィ

### A3横サイズ統一
- サイズ: 420mm × 297mm（1190px × 842px）
- アスペクト比: 1.414:1
- 印刷対応レイアウト

## 技術スタック
- **フレームワーク**: Next.js 15.5.3
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: shadcn/ui
- **状態管理**: Zustand

## 主要な開発ポイント

### 1. プレゼンテーションフローモード
```typescript
// 10項目の標準装備を個別スライドとして表示
const slides: SlideInfo[] = [
  { presentation: 1, title: 'デザイン', totalSlides: 1 },
  ...Array.from({ length: 10 }, (_, i) => ({
    presentation: 2,
    slideIndex: i,
    title: `標準装備 (${i + 1}/10)`,
    totalSlides: 10
  })),
  { presentation: 3, title: 'オプション', totalSlides: 1 },
  { presentation: 4, title: '資金計画', totalSlides: 1 },
  { presentation: 5, title: '光熱費', totalSlides: 1 },
];
```

### 2. ナビゲーションボタン配置
- ユーザー要望により、プレゼンテーションコンテンツの直上に配置
- ヘッダー部分との重複を避ける設計

### 3. CROWNデザインシステムの実装
```typescript
const CROWN_DESIGN = {
  colors: {
    primary: '#000000',
    accent: '#0066cc',
    gold: '#d4af37'
  },
  typography: {
    heading: 'font-bold tracking-wider',
    subheading: 'font-light tracking-wide'
  }
};
```

## 開発中の課題と解決

### 課題1: プレゼン2の項目が表示されない
**解決**: performanceItemsの参照を修正し、externalItemsを正しく使用

### 課題2: A3サイズの余白が多い
**解決**: パディングを px-12 → px-8、py-6 → py-4 に削減

### 課題3: ナビゲーションボタンの位置
**解決**: ヘッダーから分離し、プレゼンコンテンツの直上に配置

## ローカル環境での実行
```bash
cd g-house-presentation
npm install
npm run dev
# http://localhost:3000 でアクセス
```

## プロジェクト構造
```
g-house-presentation/
├── app/
│   ├── dashboard/         # ダッシュボード
│   ├── project/[id]/      # プロジェクト詳細
│   │   ├── edit/         # 編集モード
│   │   ├── present/      # プレゼンモード
│   │   └── present-flow/ # フローモード
│   └── admin/            # 管理画面
├── components/
│   ├── Presentation*View.tsx    # 表示用コンポーネント
│   ├── Presentation*Editor.tsx  # 編集用コンポーネント
│   └── ui/                     # UIコンポーネント
├── lib/
│   └── store.ts          # 状態管理
└── types/
    └── index.ts          # 型定義
```

## 今後の改善案
1. PDFエクスポート機能の実装
2. アニメーション効果の追加
3. モバイル対応の強化
4. データベース連携
5. ユーザー認証機能

## 参考資料
- トヨタCROWNカタログデザイン
- G-HOUSE公式資料
- evoltz制震システム仕様書

---
開発完了: 2025年1月14日