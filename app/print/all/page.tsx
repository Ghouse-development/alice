import { getSlides } from '@/lib/slides';
import PrintClient from './PrintClient';

// Server Component - サーバーサイドで全スライドを取得
export default async function PrintAllPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  // サーバーサイドで確実に14枚のスライドを取得
  const slides = await getSlides();
  const projectId = searchParams.projectId || '';

  // スライド数の検証
  if (!slides || slides.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ef4444' }}>エラー：スライドデータが取得できません</h1>
        <p>サーバーからスライドデータを取得できませんでした。</p>
        <p>システム管理者にお問い合わせください。</p>
      </div>
    );
  }

  console.log(`[PrintAllPage] サーバーサイドで${slides.length}枚のスライドを取得しました`);

  // Client Componentに渡して印刷処理
  return <PrintClient initialSlides={slides} projectId={projectId} />;
}