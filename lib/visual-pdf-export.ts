// 実際のスライド表示を視覚的にキャプチャしてPDF化

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface SlideCapture {
  canvas: HTMLCanvasElement;
  slideNumber: number;
  title: string;
}

export async function captureSlideAsImage(element: HTMLElement): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(element, {
    scale: 2, // 高解像度でキャプチャ
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  return canvas;
}

export async function captureAllSlidesAndExportPDF(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  try {
    // 全スライド数を取得
    const slideButtons = document.querySelectorAll('[title*="デザイン"], [title*="標準仕様"], [title*="オプション"], [title*="資金計画"], [title*="光熱費"], [title*="メンテナンス"]');
    const totalSlides = slideButtons.length;

    if (totalSlides === 0) {
      throw new Error('スライドが見つかりません');
    }

    const captures: SlideCapture[] = [];

    // 各スライドをキャプチャ
    for (let i = 0; i < totalSlides; i++) {
      if (onProgress) {
        onProgress(i + 1, totalSlides);
      }

      // スライドボタンをクリックして移動
      const button = slideButtons[i] as HTMLElement;
      button.click();

      // レンダリングを待つ
      await new Promise(resolve => setTimeout(resolve, 500));

      // スライドコンテンツを取得
      const slideContent = document.querySelector('#current-slide-content');
      if (!slideContent) continue;

      // キャプチャ
      const canvas = await captureSlideAsImage(slideContent as HTMLElement);
      captures.push({
        canvas,
        slideNumber: i + 1,
        title: button.getAttribute('title') || `スライド ${i + 1}`
      });
    }

    // PDF生成（A3横向き）
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });

    captures.forEach((capture, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      // A3サイズ（420mm x 297mm）
      const pageWidth = 420;
      const pageHeight = 297;

      // キャンバスの縦横比を維持しながらページに収める
      const imgData = capture.canvas.toDataURL('image/png');
      const imgWidth = capture.canvas.width;
      const imgHeight = capture.canvas.height;
      const imgRatio = imgWidth / imgHeight;
      const pageRatio = pageWidth / pageHeight;

      let finalWidth = pageWidth;
      let finalHeight = pageHeight;
      let x = 0;
      let y = 0;

      if (imgRatio > pageRatio) {
        // 画像が横に長い
        finalHeight = pageWidth / imgRatio;
        y = (pageHeight - finalHeight) / 2;
      } else {
        // 画像が縦に長い
        finalWidth = pageHeight * imgRatio;
        x = (pageWidth - finalWidth) / 2;
      }

      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

      // ページ番号
      pdf.setFontSize(10);
      pdf.text(
        `${capture.slideNumber} / ${totalSlides}`,
        pageWidth - 20,
        pageHeight - 10,
        { align: 'right' }
      );
    });

    // ダウンロード
    pdf.save(`g-house-presentation-${Date.now()}.pdf`);

  } catch (error) {
    console.error('PDF生成エラー:', error);
    throw error;
  }
}

// 現在表示中のスライドのみをPDF化
export async function captureCurrentSlideAsPDF(): Promise<void> {
  try {
    const slideContent = document.querySelector('#current-slide-content');
    if (!slideContent) {
      throw new Error('スライドコンテンツが見つかりません');
    }

    // キャプチャ
    const canvas = await captureSlideAsImage(slideContent as HTMLElement);

    // PDF生成（A3横向き）
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3'
    });

    const pageWidth = 420;
    const pageHeight = 297;
    const imgData = canvas.toDataURL('image/png');

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save(`g-house-slide-${Date.now()}.pdf`);

  } catch (error) {
    console.error('PDF生成エラー:', error);
    throw error;
  }
}