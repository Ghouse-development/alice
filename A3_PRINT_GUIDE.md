# A3印刷専用レイアウト実装ガイド

## 🎯 実装目的
スライドをA3横（420×297mm）に100%スケールで収め、ビューアUI（ページ番号、ナビゲーション等）を完全に除外した印刷専用レイアウトを提供。

## 📋 実装内容

### 1. 印刷専用ルート
**URL**: `/print/[projectId]`

**機能**:
- プレゼンテーション本体のみ描画
- UIナビゲーション・ページ番号・ホットキー表示は完全非表示
- 1スライド=1ページでの印刷・PDF出力

### 2. A3固定サイズ + 印刷CSS
**ファイル**: `styles/a3-print-pure.css`

**仕様**:
- `@page { size: A3 landscape; margin: 0; }`
- 420mm × 297mm の固定サイズ
- ビューアUI要素の強制非表示
- 印刷時の改ページ制御

### 3. 自動スケーリング機能
**コンポーネント**: `components/A3AutoScaler.tsx`

**機能**:
- レイアウト収まりチェック
- A3サイズを超過した場合の自動縮小
- 中央配置の保証

## 🖥️ 使用方法

### 印刷専用ページへのアクセス

1. **プレゼンテーション画面から**
   - プロジェクト → プレゼンテーション
   - 「🖨️ A3印刷専用」ボタンをクリック

2. **フロー表示画面から**
   - プロジェクト → フロー表示
   - ヘッダーの「🖨️ A3印刷専用」ボタンをクリック

3. **直接URL**
   ```
   http://localhost:3003/print/[プロジェクトID]
   ```

### 印刷手順（Chrome推奨）

1. 印刷専用ページを開く
2. `Ctrl/Cmd + P` で印刷メニューを開く
3. 設定を確認・調整:
   - **送信先**: PDF に保存 or プリンター
   - **用紙サイズ**: A3
   - **方向**: 横
   - **余白**: なし
   - **ヘッダー/フッター**: オフ
   - **背景グラフィック**: オン
   - **スケール**: 100%

4. プレビューで確認後、「保存」または「印刷」

## 🔧 技術仕様

### A3サイズ定数（96dpi基準）
```typescript
const A3_DIMENSIONS = {
  WIDTH_MM: 420,
  HEIGHT_MM: 297,
  WIDTH_PX: 1587, // 420mm * 96dpi / 25.4
  HEIGHT_PX: 1123, // 297mm * 96dpi / 25.4
};
```

### 自動スケーリングロジック
```typescript
const scaleX = A3_WIDTH / contentWidth;
const scaleY = A3_HEIGHT / contentHeight;
const scale = Math.min(scaleX, scaleY, 1); // 1を超えない
```

### 除外される要素
```css
.viewer-ui, .hotkeys, .page-indicator, .controls, .nav, .help, .footer,
.navigation, .pagination, .slide-counter, .progress-bar, .toolbar,
.sidebar, .menu, .overlay, .modal, .toast, .tooltip, .no-print {
  display: none !important;
  visibility: hidden !important;
}
```

## 📁 関連ファイル

### 新規作成ファイル
- `app/print/[id]/page.tsx` - 印刷専用ページ
- `styles/a3-print-pure.css` - A3印刷専用CSS
- `components/A3AutoScaler.tsx` - 自動スケーリングコンポーネント

### 修正ファイル
- `app/project/[id]/present/page.tsx` - A3印刷ボタン追加
- `app/project/[id]/present-flow/page.tsx` - A3印刷ボタン追加

## ✅ 受け入れ基準

### 印刷品質
- ✅ A3横に全ページ収まり
- ✅ 中央配置
- ✅ ビューアUIや「1/14」「← → キー案内」などの不要要素ゼロ
- ✅ 余白は均等（3〜10mm目安）
- ✅ 全スライドのPDF化可能

### 機能
- ✅ 印刷専用ルートの動作
- ✅ 自動スケーリング機能
- ✅ 印刷プレビュー
- ✅ キーボードショートカット（Ctrl+P, Escape）

## 🐛 トラブルシューティング

### 要素がはみ出す場合
1. `debug={true}` に設定してコンソールログを確認
2. コンテンツサイズがA3を超過していないか確認
3. 自動スケーリングが正しく動作しているか確認

### ビューアUIが残る場合
1. `a3-print-pure.css` の読み込みを確認
2. 要素に `no-print` クラスを追加
3. 印刷前イベントでの非表示処理を確認

### 印刷設定
- 必ずスケール100%で印刷
- A3用紙サイズを選択
- 余白なしに設定

## 🔄 開発・デバッグ

### デバッグモードの有効化
```typescript
<A3PrintSheet debug={true}>
  <SlideComponent />
</A3PrintSheet>
```

### ログ出力の確認
```typescript
console.log('A3AutoScaler Debug:', {
  'A3 Target Size': `${A3_DIMENSIONS.WIDTH_PX}x${A3_DIMENSIONS.HEIGHT_PX}`,
  'Content Actual Size': `${actualWidth}x${actualHeight}`,
  'Final Scale': scale,
});
```

## 📊 パフォーマンス

### 最適化ポイント
- ResizeObserver による効率的なサイズ監視
- MutationObserver による DOM 変更検知
- 動的インポートによる遅延読み込み

### 推奨環境
- **ブラウザ**: Chrome 90+ (印刷機能が最も安定)
- **Node.js**: 20.x LTS
- **メモリ**: 最低 4GB (複数ページ印刷時)

---

## 🎯 結論

A3印刷専用レイアウトにより、営業用資料として適切な品質でのPDF出力が可能になりました。ビューアUIが完全に除去され、自動スケーリングによってコンテンツは確実にA3サイズに収まります。