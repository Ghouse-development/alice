// 現在表示されているスライドの内容をキャプチャして構造化データに変換

export interface CapturedSlide {
  title: string;
  subtitle?: string;
  content: string;
  type: 'design' | 'standard' | 'option' | 'funding' | 'utility' | 'maintenance';
}

export function captureCurrentSlide(): CapturedSlide | null {
  // 現在のスライドコンテンツを取得
  const slideContainer = document.querySelector('#current-slide-content');
  if (!slideContainer) return null;

  // タイトルとサブタイトルを取得
  const titleElement = slideContainer.querySelector('h1, h2, [class*="text-4xl"], [class*="text-3xl"]');
  const subtitleElement = slideContainer.querySelector('h3, [class*="text-xl"], [class*="text-lg"]');

  // コンテンツを取得（テキストのみ）
  const contentElements = slideContainer.querySelectorAll('p, span, div');
  let content = '';
  contentElements.forEach(el => {
    const text = el.textContent?.trim();
    if (text && text.length > 0) {
      content += text + '\n';
    }
  });

  // URLからタイプを推定
  const url = window.location.pathname;
  let type: CapturedSlide['type'] = 'standard';
  if (url.includes('presentation1')) type = 'design';
  else if (url.includes('presentation3')) type = 'option';
  else if (url.includes('presentation4')) type = 'funding';
  else if (url.includes('presentation5')) type = 'utility';
  else if (url.includes('presentation6')) type = 'maintenance';

  return {
    title: titleElement?.textContent?.trim() || 'スライド',
    subtitle: subtitleElement?.textContent?.trim(),
    content: content.trim(),
    type
  };
}

export function captureAllSlides(): CapturedSlide[] {
  // これは実際には各スライドをナビゲートしてキャプチャする必要があります
  // 現在は仮のデータを返します
  return [];
}