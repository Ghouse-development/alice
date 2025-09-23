// 正確なスライド表示をPDF化する新しい実装

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SlideNavigationButton {
  element: HTMLElement;
  title: string;
  index: number;
}

// スライドナビゲーションボタンを取得
function getSlideNavigationButtons(): SlideNavigationButton[] {
  const buttons: SlideNavigationButton[] = [];

  // 各プレゼンテーションタイプのボタンを探す
  const selectors = [
    'button[title*="デザイン"]',
    'button[title*="標準仕様"]',
    'button[title*="オプション"]',
    'button[title*="資金計画"]',
    'button[title*="光熱費"]',
    'button[title*="メンテナンス"]'
  ];

  selectors.forEach((selector, index) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (el instanceof HTMLElement) {
        buttons.push({
          element: el,
          title: el.getAttribute('title') || `スライド ${index + 1}`,
          index: buttons.length
        });
      }
    });
  });

  return buttons;
}

// 単一スライドをキャプチャ
async function captureSlide(contentElement: HTMLElement): Promise<HTMLCanvasElement> {
  // 一時的にスタイルを調整してキャプチャ品質を向上
  const originalStyles = {
    transform: contentElement.style.transform,
    position: contentElement.style.position,
  };

  // キャプチャのための最適化
  contentElement.style.transform = 'none';
  contentElement.style.position = 'relative';

  try {
    const canvas = await html2canvas(contentElement, {
      scale: 2, // 高解像度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1587, // A3横向きの幅
      windowHeight: 1123, // A3横向きの高さ
      onclone: (clonedDoc) => {
        // クローンされたドキュメント内で追加の調整
        const clonedElement = clonedDoc.getElementById(contentElement.id);
        if (clonedElement) {
          // 不要な要素を非表示
          const hideElements = clonedElement.querySelectorAll(
            'button, .fixed, nav, [class*="hover"], [class*="transition"]'
          );
          hideElements.forEach((el: any) => {
            el.style.display = 'none';
          });
        }
      }
    });

    return canvas;
  } finally {
    // スタイルを復元
    contentElement.style.transform = originalStyles.transform;
    contentElement.style.position = originalStyles.position;
  }
}

// スライド切り替えを待つ
async function waitForSlideTransition(): Promise<void> {
  return new Promise(resolve => {
    // スライドの遷移アニメーションを待つ
    setTimeout(resolve, 800);
  });
}

// 正確なPDFエクスポート
export async function exportAccuratePDF(
  onProgress?: (current: number, total: number, message: string) => void
): Promise<void> {
  try {
    // 現在のスライドコンテンツ要素を取得
    const slideContent = document.querySelector('#current-slide-content') as HTMLElement;
    if (!slideContent) {
      throw new Error('スライドコンテンツが見つかりません');
    }

    // スライドナビゲーションボタンを取得
    const navigationButtons = getSlideNavigationButtons();

    if (navigationButtons.length === 0) {
      // ナビゲーションボタンがない場合は現在のスライドのみをキャプチャ
      onProgress?.(1, 1, '現在のスライドをキャプチャ中...');

      const canvas = await captureSlide(slideContent);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a3'
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 420, 297);
      pdf.save(`g-house-presentation-${Date.now()}.pdf`);
      return;
    }

    // 複数スライドのキャプチャ
    const captures: { canvas: HTMLCanvasElement; title: string }[] = [];

    // 現在のスライド位置を保存
    const activeButton = document.querySelector('button.bg-red-600');
    let originalIndex = 0;
    if (activeButton) {
      navigationButtons.forEach((btn, idx) => {
        if (btn.element === activeButton) {
          originalIndex = idx;
        }
      });
    }

    // 各スライドをキャプチャ
    for (let i = 0; i < navigationButtons.length; i++) {
      const button = navigationButtons[i];
      onProgress?.(i + 1, navigationButtons.length, `${button.title}をキャプチャ中...`);

      // スライドに移動
      button.element.click();
      await waitForSlideTransition();

      // キャプチャ
      const canvas = await captureSlide(slideContent);
      captures.push({
        canvas,
        title: button.title
      });
    }

    // PDFを生成
    onProgress?.(navigationButtons.length, navigationButtons.length, 'PDFを生成中...');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });

    captures.forEach((capture, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      const imgData = capture.canvas.toDataURL('image/png');

      // A3横向き（420mm x 297mm）にフィット
      pdf.addImage(imgData, 'PNG', 0, 0, 420, 297);

      // ページ番号とタイトル
      pdf.setFontSize(10);
      pdf.setTextColor(100);

      // ページ番号（右下）
      pdf.text(
        `${index + 1} / ${captures.length}`,
        410,
        292
      );

      // スライドタイトル（左下）
      pdf.text(
        capture.title,
        10,
        292
      );
    });

    // 元のスライドに戻る
    if (navigationButtons[originalIndex]) {
      navigationButtons[originalIndex].element.click();
      await waitForSlideTransition();
    }

    // PDFを保存
    const fileName = `g-house-presentation-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    onProgress?.(captures.length, captures.length, 'PDFの保存が完了しました');

  } catch (error) {
    console.error('PDF生成エラー:', error);
    throw new Error(`PDFの生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
  }
}

// ブラウザの印刷機能を使用した高品質PDF
export function exportPrintPDF(): void {
  // 印刷用CSSが適用された状態で印刷ダイアログを開く
  window.print();
}