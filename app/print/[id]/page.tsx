'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Presentation1View } from '@/components/Presentation1View';
import { Presentation2Wrapper, Presentation3Wrapper, Presentation5Wrapper } from '@/components/PresentationWrappers';
import { Presentation4View } from '@/components/Presentation4View';
import { A3PrintSheet } from '@/components/A3AutoScaler';
import '../../../styles/a3-print-pure.css';

// 自動スケーリング関数
const mmToPx = (mm: number) => (mm / 25.4) * 96; // 96dpi換算

const slides = [
  { id: 1, label: 'デザイン', component: Presentation1View },
  { id: 2, label: '標準装備', component: Presentation2Wrapper },
  { id: 3, label: 'オプション', component: Presentation3Wrapper },
  { id: 4, label: '資金計画', component: Presentation4View },
  { id: 5, label: '光熱費', component: Presentation5Wrapper },
];

export default function PrintPage() {
  const params = useParams();
  const { projects, setCurrentProject } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const project = projects.find((p) => p.id === params.id);
    if (project) {
      setCurrentProject(project);
      setIsReady(true);
    }
  }, [params.id, projects, setCurrentProject]);

  useEffect(() => {
    if (!isReady) return;

    // 自動スケーリング処理
    const autoScale = () => {
      const A3W = mmToPx(420); // 420mm
      const A3H = mmToPx(297); // 297mm

      document.querySelectorAll('.slide-content').forEach((el) => {
        const element = el as HTMLElement;
        const rect = element.getBoundingClientRect();
        const scaleX = A3W / rect.width;
        const scaleY = A3H / rect.height;
        const scale = Math.min(scaleX, scaleY, 1);

        if (scale < 1) {
          element.style.transform = `scale(${scale})`;
          element.style.transformOrigin = 'center center';
        }
      });
    };

    // DOM更新後にスケーリング実行
    const timer = setTimeout(autoScale, 100);
    return () => clearTimeout(timer);
  }, [isReady]);

  const handlePrint = () => {
    console.log('🖨️ 印刷ボタンがクリックされました - 全スライドを印刷します');

    // 印刷前に全スライドが準備されているかチェック
    const sheets = document.querySelectorAll('.sheet.a3.landscape');
    console.log(`📄 印刷準備: ${sheets.length}スライドが見つかりました`);

    if (sheets.length !== 5) {
      console.warn('⚠️ 警告: 期待される5スライドと異なります');
    }

    // 各スライドの内容チェック
    sheets.forEach((sheet, index) => {
      const content = sheet.querySelector('.slide-content, [style*="width: 1190px"]');
      if (content) {
        console.log(`✅ スライド${index + 1}: コンテンツ準備完了`);
      } else {
        console.warn(`⚠️ スライド${index + 1}: コンテンツが見つかりません`);
      }
    });

    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!isReady) {
    return (
      <div className="loading-container">
        <p>プロジェクトを読み込み中...</p>
      </div>
    );
  }

  return (
    <>
      {/* 印刷プレビュー用コントロール（画面表示時のみ） */}
      <div className="print-controls no-print">
        <button onClick={handleBack}>
          ← 戻る
        </button>
        <button onClick={handlePrint} className="primary">
          🖨️ 全スライドを印刷 (Ctrl+P)
        </button>
      </div>

      {/* 印刷専用コンテナ */}
      <div className="print-preview-container">
        {slides.map((slide) => {
          const SlideComponent = slide.component;

          return (
            <A3PrintSheet
              key={slide.id}
              title={`スライド${slide.id}: ${slide.label}`}
              debug={false} // 本番時はfalse、デバッグ時はtrueに変更
            >
              <SlideComponent projectId={params.id as string} />
            </A3PrintSheet>
          );
        })}
      </div>

      {/* 印刷用JavaScript */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // キーボードショートカット
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
              }
              if (e.key === 'Escape') {
                window.history.back();
              }
            });

            // 印刷前の準備
            window.addEventListener('beforeprint', function() {
              console.log('🖨️ 印刷準備中: 全スライドを準備します');

              // すべてのビューアUIを確実に非表示
              const uiElements = document.querySelectorAll(
                '.viewer-ui, .hotkeys, .page-indicator, .controls, .nav, .help, .footer, ' +
                '.navigation, .pagination, .slide-counter, .progress-bar, .toolbar, ' +
                '.sidebar, .menu, .overlay, .modal, .toast, .tooltip, .no-print, ' +
                '[data-role="viewer-ui"], [data-role="navigation"], [data-role="controls"]'
              );

              uiElements.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
              });

              // 全スライドシートが表示されていることを確認
              const sheets = document.querySelectorAll('.sheet.a3.landscape');
              console.log('📄 印刷対象スライド数:', sheets.length);

              sheets.forEach((sheet, index) => {
                sheet.style.display = 'flex';
                sheet.style.pageBreakAfter = index === sheets.length - 1 ? 'avoid' : 'always';
                sheet.style.pageBreakInside = 'avoid';
                console.log('✅ スライド' + (index + 1) + '準備完了');
              });

              // 印刷コンテナを表示
              const printContainer = document.querySelector('.print-preview-container');
              if (printContainer) {
                printContainer.style.display = 'block';
                printContainer.style.margin = '0';
                printContainer.style.padding = '0';
              }
            });

            // 印刷後の処理
            window.addEventListener('afterprint', function() {
              console.log('🖨️ 印刷完了');
            });

            // ページ読み込み時の確認
            window.addEventListener('load', function() {
              const sheets = document.querySelectorAll('.sheet.a3.landscape');
              console.log('📊 A3印刷ページ読み込み完了:', sheets.length + 'スライド');
              console.log('💡 Ctrl+P で印刷開始、Escape で戻る');
            });
          `,
        }}
      />
    </>
  );
}