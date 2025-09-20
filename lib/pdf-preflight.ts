// lib/pdf-preflight.ts

/**
 * PDFアセットの事前チェックとプリロード
 */

// フォントの存在確認
export async function checkFontExists(fontPath: string): Promise<boolean> {
  try {
    const response = await fetch(fontPath, { method: 'HEAD' });
    if (!response.ok) {
      console.error(`Font not found: ${fontPath} (${response.status})`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Failed to check font: ${fontPath}`, error);
    return false;
  }
}

// 画像をdataURLに変換
export async function imageToDataURL(imagePath: string): Promise<string | null> {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) {
      console.error(`Image not found: ${imagePath} (${response.status})`);
      return null;
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to convert image: ${imagePath}`, error);
    return null;
  }
}

// 30秒タイムアウト付きPromise
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// アセットのプリロード
export async function preloadAssets(assets: {
  fonts?: string[];
  images?: string[];
}): Promise<{
  success: boolean;
  errors: string[];
  dataURLs: Record<string, string>;
}> {
  const errors: string[] = [];
  const dataURLs: Record<string, string> = {};

  // フォントチェック
  if (assets.fonts) {
    for (const font of assets.fonts) {
      const exists = await checkFontExists(font);
      if (!exists) {
        errors.push(`Font not found: ${font}`);
      }
    }
  }

  // 画像をdataURL化
  if (assets.images) {
    for (const image of assets.images) {
      const dataURL = await imageToDataURL(image);
      if (dataURL) {
        dataURLs[image] = dataURL;
      } else {
        errors.push(`Image not found: ${image}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    errors,
    dataURLs,
  };
}