'use client';

import { useEffect, useRef, useState } from 'react';
import { Presentation1View } from '@/components/Presentation1View';
import { Presentation2Wrapper, Presentation3Wrapper, Presentation5Wrapper } from '@/components/PresentationWrappers';
import { Presentation4View } from '@/components/Presentation4View';

// スライドコンポーネントマッピング
const slideComponents = {
  1: Presentation1View,
  2: Presentation2Wrapper,
  3: Presentation3Wrapper,
  4: Presentation4View,
  5: Presentation5Wrapper,
};

interface PrintClientProps {
  initialSlides: Array<{
    id: number;
    label: string;
    component: keyof typeof slideComponents;
  }>;
  projectId: string;
}

// ページカウントバナー（デバッグ用）
function PageCountBanner() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const updateCount = () => setCount(document.querySelectorAll('.a3-sheet').length);
    updateCount();
    // DOMの変更を監視
    const observer = new MutationObserver(updateCount);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (!count) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 8,
      left: 8,
      padding: '8px 16px',
      background: count === 14 ? '#10b981' : '#ef4444',
      color: '#fff',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: 'bold',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }} className="no-print">
      合計ページ数: {count} / 14
    </div>
  );
}

// 自動印刷ガード（全描画完了待機）
function AutoPrintGuard({ enabled, expectedPages = 14 }: { enabled: boolean; expectedPages?: number }) {
  useEffect(() => {
    if (!enabled) {
      console.warn('[AutoPrintGuard] 印刷が無効化されています');
      return;
    }

    const waitFonts = 'fonts' in document
      ? (document as any).fonts.ready.catch(() => {})
      : Promise.resolve();

    const waitImages = () => Promise.all(
      Array.from(document.images).map(img =>
        img.complete
          ? Promise.resolve(true)
          : new Promise(res => {
              img.onload = img.onerror = () => res(true);
            })
      )
    );

    const waitNextFrame = () => new Promise(r =>
      requestAnimationFrame(() => requestAnimationFrame(r))
    );

    const applyMaxScale = () => {
      const mmToPx = (mm: number) => (mm / 25.4) * 96;
      const A3W = mmToPx(420);
      const A3H = mmToPx(297);
      const SAFE = 0.995;

      document.querySelectorAll<HTMLElement>('.a3-sheet .slide-canvas').forEach((el, idx) => {
        const w = el.scrollWidth || el.offsetWidth;
        const h = el.scrollHeight || el.offsetHeight;

        if (w > 0 && h > 0) {
          const scale = Math.min(A3W / w, A3H / h) * SAFE;
          el.style.transform = `scale(${scale})`;
          el.style.transformOrigin = 'center center';
          el.style.margin = '0 auto';
          console.log(`[AutoPrintGuard] スライド${idx + 1}: ${w}x${h} → scale(${scale.toFixed(3)})`);
        }
      });
    };

    (async () => {
      console.log('[AutoPrintGuard] 印刷準備開始...');

      // フォント読み込み待機
      await waitFonts;
      console.log('[AutoPrintGuard] フォント読み込み完了');

      // 画像読み込み待機
      await waitImages();
      console.log('[AutoPrintGuard] 画像読み込み完了');

      // レンダリング完了待機（2フレーム）
      await waitNextFrame();
      console.log('[AutoPrintGuard] レンダリング完了');

      // スケーリング適用
      applyMaxScale();

      // ページ数確認
      const pages = document.querySelectorAll('.a3-sheet').length;
      console.log(`[AutoPrintGuard] レンダリング済みページ数: ${pages}`);

      if (pages < expectedPages) {
        alert(`印刷対象のページが${pages}枚しかレンダリングされていません。\n期待値は${expectedPages}枚です。\nデータ取得や認証を確認してください。`);
        return;
      }

      // 描画完了バッファ後に印刷
      setTimeout(() => {
        console.log('[AutoPrintGuard] 印刷開始');
        window.print();
      }, 400);
    })();
  }, [enabled, expectedPages]);

  return null;
}

export default function PrintClient({ initialSlides, projectId }: PrintClientProps) {
  const [slides] = useState(initialSlides ?? []);
  const rootRef = useRef<HTMLDivElement>(null);

  // スライド数ログ出力
  useEffect(() => {
    console.log('[PrintClient] slides count:', slides?.length);
    if (!slides || slides.length === 0) {
      console.error('[PrintClient] スライドデータが取得できませんでした');
    }
  }, [slides]);

  // スライドがない場合のエラー表示
  if (!slides || slides.length === 0) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1>エラー：スライドデータが取得できません</h1>
        <p>データの取得に失敗しました。ページを再読み込みしてください。</p>
      </div>
    );
  }

  return (
    <>
      <PageCountBanner />
      <div id="print-root" ref={rootRef} className="a3-print-container">
        {slides.map((slide, index) => {
          const SlideComponent = slideComponents[slide.component];

          if (!SlideComponent) {
            console.error(`[PrintClient] Unknown component: ${slide.component}`);
            return null;
          }

          return (
            <section key={slide.id ?? index} className="a3-sheet">
              <div className="slide-canvas">
                <SlideComponent projectId={projectId} />
              </div>
            </section>
          );
        })}
      </div>
      <AutoPrintGuard enabled={slides.length > 0} expectedPages={14} />

      {/* 印刷後のクリーンアップ */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('beforeprint', function() {
              console.log('[印刷前] A3全ページ印刷準備完了');
              const sheets = document.querySelectorAll('.a3-sheet');
              console.log('[印刷前] 印刷対象:', sheets.length + 'ページ');
            });

            window.addEventListener('afterprint', function() {
              console.log('[印刷後] A3全ページ印刷完了');
              setTimeout(() => window.close(), 1000);
            });

            document.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') {
                window.close();
              }
            });
          `,
        }}
      />
    </>
  );
}