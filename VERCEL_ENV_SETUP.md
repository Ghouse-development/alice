# Vercel環境変数設定ガイド

## 必要な環境変数

Vercelプロジェクトに以下の環境変数を設定してください：

### Supabase設定（オプション）

```
NEXT_PUBLIC_SUPABASE_URL=https://xthbnvaqlxonbnlpisbn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aGJudmFxbHhvbmJubHBpc2JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjEwMjYsImV4cCI6MjA3NDUzNzAyNn0.3LuoABMxm5-zfrPeUfFguYFbfiLLIxtfA4M4yA-gF2k
```

## 設定方法

1. [Vercelダッシュボード](https://vercel.com) にアクセス
2. 対象のプロジェクトを選択
3. 「Settings」タブをクリック
4. 左メニューから「Environment Variables」を選択
5. 各変数を追加：
   - Key: 環境変数名
   - Value: 値
   - Environment: Production, Preview, Development すべてにチェック
6. 「Save」をクリック

## 注意事項

- **Supabaseは現在オプション**: 環境変数が設定されていない場合、モックデータで動作します
- データベース機能を使用する場合は、Supabase環境変数の設定が必要です
- 設定後は再デプロイが必要です

## モックデータモード

環境変数が設定されていない場合：
- `/cases` ページはモック顧客データを表示
- `/education` ページはモック評価データを使用
- データの保存機能は無効化されます

## トラブルシューティング

ビルドエラーが発生した場合：
1. 環境変数が正しく設定されているか確認
2. Vercelダッシュボードで再デプロイを実行
3. ビルドログを確認してエラーの詳細を調査