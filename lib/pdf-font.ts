// lib/pdf-font.ts
import { Font } from '@react-pdf/renderer';

let registered = false;

// デバッグ用：ページリロード時にリセット
if (typeof window !== 'undefined') {
  registered = false;
}

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
 * basePathやassetPrefixを考慮したフォントURLを構築
 */
function buildFontUrl(fontPath: string): string {
  // 環境変数からbasePathとassetPrefixを取得
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

  // Next.jsの設定から動的に取得（開発時）
  if (typeof window !== 'undefined') {
    const nextConfig = (window as any).__NEXT_DATA__?.buildId ?
      (window as any).__NEXT_DATA__ : null;

    // basePathやassetPrefixが設定されている場合は優先
    if (nextConfig?.assetPrefix) {
      return `${nextConfig.assetPrefix}${fontPath}`;
    }
    if (nextConfig?.basePath) {
      return `${nextConfig.basePath}${fontPath}`;
    }
  }

  // 環境変数ベースの構築
  if (assetPrefix) {
    return `${assetPrefix}${fontPath}`;
  }
  if (basePath) {
    return `${basePath}${fontPath}`;
  }

  // デフォルト（相対パス）
  return fontPath;
}

/**
 * フェッチ操作を再試行機能付きで実行
 */
async function fetchWithRetry(url: string, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetching ${url} (attempt ${attempt}/${maxRetries})`);
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Fetch attempt ${attempt} failed:`, lastError.message);

      if (attempt < maxRetries) {
        // 指数バックオフ（1秒、2秒、4秒）
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('All fetch attempts failed');
}

/**
 * 日本語フォントを登録する（一度だけ実行）
 * 必須：public/fonts/NotoSansJP-Regular.ttf, NotoSansJP-Bold.ttf
 */
export async function ensurePdfFont() {
  if (registered) {
    console.log('Font already registered, skipping...');
    return;
  }

  console.log('Starting Japanese font registration...');

  try {
    // Regular フォントを登録
    const regularFontUrl = buildFontUrl('/fonts/NotoSansJP-Regular.ttf');
    console.log(`Loading font from: ${regularFontUrl}`);

    const regularRes = await fetchWithRetry(regularFontUrl);
    if (!regularRes.ok) {
      throw new Error(
        `Font not found: ${regularFontUrl} (status: ${regularRes.status} ${regularRes.statusText})\n` +
        `Response headers: ${JSON.stringify(Object.fromEntries(regularRes.headers.entries()))}\n` +
        `Please ensure the font file exists at public/fonts/NotoSansJP-Regular.ttf`
      );
    }
    const regularBytes = await regularRes.arrayBuffer();

    // フォーマット確認
    const regularFormat = detectFontFormat(regularBytes);
    if (regularFormat === 'unknown') {
      throw new Error(
        `Unsupported font format "unknown" for ${regularFontUrl}. ` +
        'Use static TTF/OTF format. File may be corrupted or in unsupported format (WOFF/WOFF2/TTC).'
      );
    }

    console.log(`Font format detected: ${regularFormat}`);

    // ArrayBufferをbase64に変換（効率的な方法）
    const regularUint8Array = new Uint8Array(regularBytes);
    let regularBase64 = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < regularUint8Array.length; i += chunkSize) {
      regularBase64 += String.fromCharCode.apply(
        null,
        Array.from(regularUint8Array.slice(i, i + chunkSize))
      );
    }
    regularBase64 = btoa(regularBase64);
    const regularDataUrl = `data:font/truetype;base64,${regularBase64}`;

    Font.register({
      family: 'NotoSansJP',
      src: regularDataUrl,
      fontWeight: 'normal',
    });

    // Bold フォントを登録
    const boldFontUrl = buildFontUrl('/fonts/NotoSansJP-Bold.ttf');
    console.log(`Loading bold font from: ${boldFontUrl}`);

    const boldRes = await fetchWithRetry(boldFontUrl);
    if (boldRes.ok) {
      const boldBytes = await boldRes.arrayBuffer();
      const boldFormat = detectFontFormat(boldBytes);

      if (boldFormat !== 'unknown') {
        console.log(`Bold font format detected: ${boldFormat}`);
        // ArrayBufferをbase64に変換（効率的な方法）
        const boldUint8Array = new Uint8Array(boldBytes);
        let boldBase64 = '';
        const chunkSize = 0x8000; // 32KB chunks
        for (let i = 0; i < boldUint8Array.length; i += chunkSize) {
          boldBase64 += String.fromCharCode.apply(
            null,
            Array.from(boldUint8Array.slice(i, i + chunkSize))
          );
        }
        boldBase64 = btoa(boldBase64);
        const boldDataUrl = `data:font/truetype;base64,${boldBase64}`;

        Font.register({
          family: 'NotoSansJP',
          src: boldDataUrl,
          fontWeight: 'bold',
        });
        console.log('Japanese fonts registered successfully (Regular + Bold)');
      } else {
        console.warn(`Bold font format not supported (${boldFormat}), using Regular only`);
      }
    } else {
      console.warn(`Bold font not available at ${boldFontUrl} (status: ${boldRes.status}), using Regular only`);
    }

    registered = true;
    console.log('Font registration completed successfully');
  } catch (error) {
    console.error('Failed to register Japanese font:', error);

    // デバッグ情報を収集
    const debugInfo = {
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'unknown',
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || 'not set',
      assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || 'not set',
      buildFontUrlResult: {
        regular: buildFontUrl('/fonts/NotoSansJP-Regular.ttf'),
        bold: buildFontUrl('/fonts/NotoSansJP-Bold.ttf')
      }
    };
    console.error('Font registration debug info:', debugInfo);

    // より詳細なエラーメッセージを生成
    let userMessage = 'PDF生成用フォントの読み込みに失敗しました。\n\n';

    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        userMessage += 'フォントファイルが見つかりません。\n';
        userMessage += '以下を確認してください：\n';
        userMessage += '1. public/fonts/NotoSansJP-Regular.ttf が存在するか\n';
        userMessage += '2. 開発サーバーが正常に起動しているか\n';
        userMessage += '3. ファイルパスが正しいか\n\n';
        userMessage += `詳細: ${error.message}`;
      } else if (error.message.includes('unknown')) {
        userMessage += 'フォントファイルの形式が対応していません。\n';
        userMessage += 'TTFまたはOTF形式のフォントファイルを使用してください。\n\n';
        userMessage += `詳細: ${error.message}`;
      } else {
        userMessage += `エラー詳細: ${error.message}`;
      }
    } else {
      userMessage += `予期しないエラーが発生しました: ${String(error)}`;
    }

    // エラーメッセージをユーザーに表示
    if (typeof window !== 'undefined') {
      alert(userMessage);
    }
    throw error;
  }
}

/**
 * フォント登録状態をリセット（テスト用）
 */
export function resetFontRegistration() {
  registered = false;
  console.log('Font registration state reset');
}
