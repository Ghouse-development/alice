import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { sanitizeTreeForExport } from './sanitizeForHtml2Canvas';

type Opt = {
  filename?: string;
  scale?: number;
  page?: { widthMm: number; heightMm: number }
};

export async function exportNodeToPdf(node: HTMLElement, opt: Opt = {}) {
  const page = opt.page ?? { widthMm: 297, heightMm: 210 }; // A4横: 例。A3横なら {420, 297}
  const file = opt.filename ?? 'export.pdf';
  const scale = opt.scale ?? 2;

  // 1) クローンして画面に影響させない
  const clone = node.cloneNode(true) as HTMLElement;
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-10000px';
  sandbox.style.top = '0';
  sandbox.style.width = `${node.clientWidth}px`;
  sandbox.style.height = `${node.clientHeight}px`;
  sandbox.style.background = getComputedStyle(document.body).backgroundColor || '#fff';
  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  // 2) ここで色を sRGB に正規化（oklch 等を完全排除）
  sanitizeTreeForExport(clone);

  // 3) レンダリング
  const canvas = await html2canvas(clone, {
    backgroundColor: '#fff',
    scale,
    logging: false,
    useCORS: true,
  });

  // 4) PDF へ（mm→pt 変換）
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [page.widthMm, page.heightMm],
    putOnlyUsedFonts: true,
    compress: true,
  });

  const img = canvas.toDataURL('image/jpeg', 0.95);
  const pw = page.widthMm;
  const ph = page.heightMm;

  // キャンバスの縦横比を保って最大化（余白最小）
  const ratio = canvas.width / canvas.height;
  let w = pw, h = w / ratio;
  if (h > ph) {
    h = ph;
    w = h * ratio;
  }
  const x = (pw - w) / 2;
  const y = (ph - h) / 2;

  pdf.addImage(img, 'JPEG', x, y, w, h, '', 'FAST');
  const blob = pdf.output('blob');

  // 5) クリーンアップ
  sandbox.remove();

  return blob;
}