// @ts-expect-error html2canvas types
import html2canvas from 'html2canvas';
// @ts-expect-error jsPDF types
import jsPDF from 'jspdf';

export interface PDFExportOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a3' | 'a4';
  quality?: number;
  scale?: number;
}

export async function exportToPDF(
  element: HTMLElement,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'document.pdf',
    orientation = 'landscape',
    format = 'a3',
    quality = 0.95,
    scale = 2,
  } = options;

  try {
    // 印刷用クラスを一時的に追加
    element.classList.add('printing');

    // html2canvasでキャプチャ
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // 印刷用クラスを削除
    element.classList.remove('printing');

    // PDFのサイズ設定
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // A3サイズの寸法（mm）
    const pageWidth = orientation === 'landscape' ? 420 : 297;
    const pageHeight = orientation === 'landscape' ? 297 : 420;

    // キャンバスのサイズ
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // アスペクト比を保持しながらPDFに収める
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const imgX = (pageWidth - imgWidth * ratio) / 2;
    const imgY = (pageHeight - imgHeight * ratio) / 2;

    // 画像をPDFに追加
    const imgData = canvas.toDataURL('image/jpeg', quality);
    pdf.addImage(
      imgData,
      'JPEG',
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    // PDFを保存
    pdf.save(filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

// A3横向き専用のエクスポート関数
export async function exportA3LandscapePDF(
  element: HTMLElement,
  filename: string = 'a3-document.pdf'
): Promise<void> {
  return exportToPDF(element, {
    filename,
    orientation: 'landscape',
    format: 'a3',
    quality: 0.95,
    scale: 2,
  });
}

// 複数ページのPDFエクスポート
export async function exportMultiPagePDF(
  elements: HTMLElement[],
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = 'document.pdf',
    orientation = 'landscape',
    format = 'a3',
    quality = 0.95,
    scale = 2,
  } = options;

  if (elements.length === 0) {
    throw new Error('No elements to export');
  }

  try {
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    const pageWidth = orientation === 'landscape' ? 420 : 297;
    const pageHeight = orientation === 'landscape' ? 297 : 420;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.classList.add('printing');

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      element.classList.remove('printing');

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgX = (pageWidth - imgWidth * ratio) / 2;
      const imgY = (pageHeight - imgHeight * ratio) / 2;

      if (i > 0) {
        pdf.addPage();
      }

      const imgData = canvas.toDataURL('image/jpeg', quality);
      pdf.addImage(
        imgData,
        'JPEG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Multi-page PDF export failed:', error);
    throw error;
  }
}