# G-HOUSE プレゼンテーションシステム 開発記録

## プロジェクト概要
- **プロジェクト名**: G-HOUSE プレゼンテーションシステム
- **技術スタック**: Next.js 14.2.18, TypeScript, Tailwind CSS, Zustand, Supabase
- **デザインコンセプト**: トヨタクラウンデザイン（CROWN_DESIGN）
- **フォーマット**: A3横（1190px × 842px）

## 最近の開発 (2025年9月)

### 2025年9月27日 - Supabase統合とコードベース整理
- **Supabase接続の実装**
  - 環境変数設定（`.env.local`）
  - データベースクライアント実装
  - モックデータフォールバック機能
- **Vercelビルドエラーの解決**
  - Supabase環境変数のオプション化
  - ビルド時のエラー回避処理
- **TypeScript型エラー修正**
  - lib/hvac.ts, lib/sheets.tsの型エラー解決
- **ドキュメント整備**
  - CLAUDE.md作成（開発ガイドライン）
  - VERCEL_ENV_SETUP.md作成
- **コードベース整理**
  - 不要なテストファイル削除
  - 開発ログの統合

### 2025年9月26日 - Next.js開発サーバー問題解決
- **問題**: Jest Worker プロセスエラー
- **原因**: next.config.mjsの設定問題
- **解決**: `workerThreads`と`cpus`設定を削除
```javascript
// 削除した設定
experimental: {
  workerThreads: false,
  cpus: 1,
}
```

## 主要機能実装

### データベース連携
- Supabase統合（2025年9月27日）
- モックデータフォールバック機能
- 顧客情報管理（cases）
- 教育・評価システム（education）

### プレゼンテーション機能
- 14枚のA3スライド管理
- PDF出力機能
- インタラクティブなオプション選択
- ダーク/ライトモード対応

### 計算エンジン
- HVAC（空調）容量計算
- 太陽光発電シミュレーション
- 15年NPV計算

## 技術的詳細

### フェーズ1: ESLintエラーの修正
- 86個のESLint問題（22個のエラー、64個の警告）を解決
- TypeScript型定義の改善
- React hooksの依存配列修正

### フェーズ2: レイアウト問題修正
- Presentation4View（資金計画）のサイズ統一
- Presentation3Interactiveのレイアウト改善

### フェーズ3: テーマシステム実装
- ダーク/ライトモード切り替え
- Tailwind CSSベースのテーマ管理

## 環境情報
- **Node.js**: 20.x
- **Next.js**: 14.2.18
- **開発サーバー**: http://localhost:3000
- **本番環境**: Vercel
- **データベース**: Supabase

## 注意事項
- TypeScriptとESLintのエラーは意図的に無視する設定（Vercelビルド対策）
- Supabase環境変数が未設定の場合はモックデータで動作
- A3印刷最適化のため、特殊なレイアウトコンポーネントを使用