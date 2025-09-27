# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 重要な開発ガイドライン

Claude Codeは以下のガイドラインを常に遵守してください：

### 1. タスク管理と整理
- ユーザーからの命令を受けたら、まずTodoWriteツールを使用してタスクリストを作成し、整理する
- 複雑なタスクは小さなステップに分解して管理する
- 各タスクの進捗状況を明確に記録する

### 2. テスト実施
- 実装した機能は必ずテストを実施する
- `npm run build` でビルドエラーがないか確認
- `npm run typecheck` で型エラーがないか確認
- `npm run lint` でコード品質をチェック
- 開発サーバーで実際の動作を確認

### 3. エラー対応
- エラーが発生したら、即座に原因を特定して修正
- エラーメッセージを詳細に分析
- 修正後は再度テストを実施して、エラーが完全に解消されたことを確認

### 4. 評価と改善
- 実装結果を評価：
  - ✅ 完全に動作し、要件を満たしている
  - ❌ 動作しない、または要件を満たしていない
- ❌の場合は、問題を修正して✅になるまで改善を続ける
- 各タスクの完了時に成功/失敗を明確に報告

### 5. 開発記録
- すべての重要な変更をコミットメッセージに記録
- DEVELOPMENT_LOG.mdに重要な決定事項や実装内容を記録
- エラーとその解決方法を文書化

### 6. コードベースの整理
- 不要なファイルの削除：
  - 未使用のコンポーネント
  - デッドコード
  - 一時ファイル
  - 重複したコード
- ただし、以下は削除しない：
  - 設定ファイル
  - ドキュメント
  - テストファイル
  - 環境設定ファイル

### 7. ユーザー入力が必要な場合
- ユーザーの判断や追加情報が必要な場合は、明確に通知
- 🔔 **「ユーザーの入力が必要です」** と明示
- 具体的に何が必要かを説明
- 選択肢がある場合は、すべての選択肢を提示

## Project Overview
G-House Presentation System - A sales support application for housing presentations with A3 format print-optimized slides, HVAC/solar PV calculations, and Supabase database integration.

## Commands

### Development
```bash
npm run dev              # Start development server (default port 3000)
npm run dev:turbo        # Start with Turbopack for faster HMR
PORT=3010 npm run dev    # Run on specific port
```

### Build & Production
```bash
npm run build            # Production build
npm run build:turbo      # Production build with Turbopack
npm run build:dry        # Build without linting (faster for testing)
npm run start            # Start production server
```

### Code Quality
```bash
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking (tsc --noEmit)
```

### Testing Commands
```bash
# ビルドとコード品質の完全チェック
npm run lint && npm run typecheck && npm run build

# 開発サーバーでの動作確認
npm run dev
# ブラウザで http://localhost:3000 を開いて確認
```

## Architecture Overview

### Core Stack
- **Next.js 14.2.18** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS 4** with dark mode support
- **Zustand** for state management
- **Supabase** for database operations

### Key Directories
- `app/` - Next.js app router pages
  - `cases/` - Customer case management with HVAC/PV simulations
  - `education/` - Training and role-play evaluation features
  - `print/` - A3 print-optimized layouts
  - `api/` - PDF export and search endpoints
- `components/` - Reusable components with A3-specific utilities
- `lib/` - Core business logic
  - `hvac.ts` - HVAC capacity calculations
  - `pv.ts` - Solar PV simulations and ROI calculations
  - `sheets.ts` - Supabase data operations
  - `supabase.ts` - Database client configuration

### A3 Print System
The entire application is optimized for A3 landscape format (420mm × 297mm / 1190px × 842px):
- Use `<A3Container>` component for print layouts
- `<A3AutoScaler>` handles responsive scaling
- Print-specific CSS in `styles/print.css`
- PDF export via `api/export-pdf` using html2canvas + jsPDF

### Database Schema (Supabase)
Key tables:
- `customers` - Customer profiles with building specifications
- `sales_scripts` - Section-based sales scripts
- `performance_actuals` - Historical performance data
- `pv_configs` - Solar panel configurations
- `role_play_evaluations` - Training evaluation records

### Environment Variables
Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

### Git Workflow
- Pre-commit hooks run Prettier and ESLint via Husky
- Changes are automatically formatted and linted before commit
- Remote repository: https://github.com/Ghouse-development/alice
- Always test before committing: `npm run lint && npm run typecheck`

## Development Notes

### HVAC Calculations
The `lib/hvac.ts` module calculates heating/cooling capacity based on:
- UA value (thermal transmittance)
- C value (air tightness)
- Climate region (1-8 Japan regions)
- Floor area and ventilation rates

### Solar PV Simulations
The `lib/pv.ts` module provides:
- Panel layout calculations based on roof area
- 15-year NPV and ROI calculations
- Self-consumption vs grid feed-in modeling
- Multiple manufacturer configurations

### State Management
Zustand store (`lib/store.ts`) manages:
- Dashboard configuration
- Project data persistence
- Print settings
- User preferences

### Known Considerations
- Build may require increased memory allocation (4GB recommended)
- PDF export API route has 60-second timeout
- Turbopack can be used for faster development builds
- Node.js 20.x required (specified in package.json engines)

## Development Checklist
実装時は以下のチェックリストを使用：
- [ ] タスクをTodoWriteで管理
- [ ] コードを実装
- [ ] `npm run lint` でリントチェック
- [ ] `npm run typecheck` で型チェック
- [ ] `npm run build` でビルド確認
- [ ] 開発サーバーで動作確認
- [ ] エラーがあれば修正
- [ ] 結果を評価（✅/❌）
- [ ] コミットして記録