// lib/pdf-font.ts
import { Font } from '@react-pdf/renderer';

let registered = false;

/**
 * フォント形式を判定する（TTF/OTFのみ許可）
 */
function detectFontFormat(ab: ArrayBuffer): 'ttf' | 'otf' | 'unknown' {
  const bytes = new Uint8Array(ab).subarray(0, 4);
  const sig = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);

  // TrueType
  if (bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00)
    return 'ttf';
  // OpenType (CFF/Type1)
  if (sig === 'OTTO') return 'otf';

  // WOFF/WOFF2/TTCは使用不可
  return 'unknown';
}

/**
 * 日本語フォントを登録する（一度だけ実行）
 * 必須：public/fonts/NotoSansJP-Regular.ttf, NotoSansJP-Bold.ttf
 */
export async function ensurePdfFont() {
  if (registered) return;

  try {
    // Regular フォントを登録
    const regularRes = await fetch('/fonts/NotoSansJP-Regular.ttf');
    if (!regularRes.ok) {
      throw new Error(
        `Font not found: /fonts/NotoSansJP-Regular.ttf (status: ${regularRes.status})`
      );
    }
    const regularBytes = await regularRes.arrayBuffer();

    // フォーマット確認
    const regularFormat = detectFontFormat(regularBytes);
    if (regularFormat === 'unknown') {
      throw new Error(
        'Unsupported font format "unknown". Use static TTF/OTF. (/fonts/NotoSansJP-Regular.ttf)'
      );
    }

    Font.register({
      family: 'NotoSansJP',
      src: new Uint8Array(regularBytes),
      fontWeight: 'normal',
    });

    // Bold フォントを登録
    const boldRes = await fetch('/fonts/NotoSansJP-Bold.ttf');
    if (boldRes.ok) {
      const boldBytes = await boldRes.arrayBuffer();
      const boldFormat = detectFontFormat(boldBytes);

      if (boldFormat !== 'unknown') {
        Font.register({
          family: 'NotoSansJP',
          src: new Uint8Array(boldBytes),
          fontWeight: 'bold',
        });
        console.log('Japanese fonts registered successfully (Regular + Bold)');
      } else {
        console.warn('Bold font format not supported, using Regular only');
      }
    } else {
      console.log('Japanese font registered successfully (Regular only)');
    }

    registered = true;
  } catch (error) {
    console.error('Failed to register Japanese font:', error);
    // エラーメッセージをユーザーに表示
    if (typeof window !== 'undefined') {
      alert(
        `PDF生成用フォントの読み込みに失敗しました。\n\n${error}\n\n/fonts/NotoSansJP-Regular.ttf が見つかりません。`
      );
    }
    throw error;
  }
}
