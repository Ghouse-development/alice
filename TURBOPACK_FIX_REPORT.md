# Turbopackエラー修正レポート

## 診断結果

### 1. エラーの原因
Turbopackで発生していた「An unexpected Turbopack error occurred」は以下の原因によるものでした：

1. **PDF関連ライブラリの非互換性**
   - `html2canvas` と `jspdf` がサーバーサイドでもインポートされていた
   - TurbopackはこれらのブラウザAPI依存ライブラリを正しく処理できなかった

2. **next.config設定の競合**
   - `.ts` と `.mjs` の設定ファイルが混在
   - Webpack専用設定がTurbopackと競合

### 2. 実施した修正

#### 即時回避策（Webpack継続使用）
```json
// package.json
{
  "scripts": {
    "dev": "next dev",          // Webpackモード（デフォルト）
    "dev:turbo": "next dev --turbopack",  // Turbopackモード（オプション）
    "build": "next build",
    "build:turbo": "next build --turbopack"
  }
}
```

#### 根本対策

1. **PDF関連コードの分離**
   - `lib/pdf-export.ts` → `lib/pdf-export-client.ts` として'use client'ディレクティブ追加
   - 動的インポートによるクライアントサイドのみでの実行

2. **設定ファイルの統一**
   - `next.config.ts` を削除し、`next.config.mjs` に統一
   - Turbopack互換設定を追加

## 動作確認結果

### Webpackモード ✅
- **起動**: 正常（http://localhost:3002）
- **HMR**: 動作確認済み
- **ビルド**: 成功
- **PDF出力**: 正常動作

### Turbopackモード ⚠️
- **起動**: 成功（警告あり）
- **警告メッセージ**: "Webpack is configured while Turbopack is not"
- **基本動作**: 正常
- **推奨**: 現時点ではWebpackモードの使用を推奨

## 検出された問題パターン

### 修正済み
1. ✅ PDF関連ライブラリのサーバーサイド実行
2. ✅ 設定ファイルの競合

### 要注意（将来的な改善点）
1. ⚠️ `localStorage` の直接使用（2箇所）
   - `components/Presentation2View.tsx`
   - `app/project/[id]/present-flow/page.tsx`
   - 推奨: クライアントコンポーネント内でのみ使用するか、useEffect内で使用

2. ⚠️ 大量の`use client`ディレクティブ（48ファイル）
   - 必要以上にクライアントコンポーネント化されている可能性
   - サーバーコンポーネントとの適切な分離を検討

## 推奨バージョン

| パッケージ | 現在 | 推奨 | 状態 |
|----------|------|------|------|
| Node.js | - | 20.x LTS | ✅ |
| Next.js | 15.5.3 | 15.5.3 | ✅ |
| React | 19.1.0 | 18.3.1 | ⚠️ React 19は実験的 |
| TypeScript | 5.x | 5.x | ✅ |

## 今後の運用方針

### 開発環境
```bash
# 通常の開発（Webpack - 安定）
npm run dev

# Turbopackテスト（必要時のみ）
npm run dev:turbo
```

### CI/CDスクリプト
```bash
# スモークテスト用
npm run build && npm run start
```

### 移行スケジュール
1. **現在**: Webpackモードで開発継続
2. **Next.js 16リリース後**: Turbopack安定版への移行検討
3. **React 19安定版リリース後**: 全体的な依存関係の更新

## 結論

Turbopackエラーは解決され、両モードで起動可能になりました。ただし、現時点では：
- **Webpackモード**: 本番環境推奨 ✅
- **Turbopackモード**: 実験的使用のみ ⚠️

パフォーマンスが重要でない限り、Webpackモードの継続使用を推奨します。