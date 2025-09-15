// スライドデータの定義と取得関数

export interface Slide {
  id: number;
  label: string;
  component: 1 | 2 | 3 | 4 | 5;
}

// 14枚の全スライドデータ
// プレゼン1: 7枚（デザイン）
// プレゼン2: 3枚（標準装備の詳細）
// プレゼン3: 1枚（オプション）
// プレゼン4: 1枚（資金計画）
// プレゼン5: 2枚（光熱費・シミュレーション）
const allSlides: Slide[] = [
  // プレゼン1: デザイン（7枚）
  { id: 1, label: 'デザイン1', component: 1 },
  { id: 2, label: 'デザイン2', component: 1 },
  { id: 3, label: 'デザイン3', component: 1 },
  { id: 4, label: 'デザイン4', component: 1 },
  { id: 5, label: 'デザイン5', component: 1 },
  { id: 6, label: 'デザイン6', component: 1 },
  { id: 7, label: 'デザイン7', component: 1 },

  // プレゼン2: 標準装備（3枚）
  { id: 8, label: '標準装備1', component: 2 },
  { id: 9, label: '標準装備2', component: 2 },
  { id: 10, label: '標準装備3', component: 2 },

  // プレゼン3: オプション（1枚）
  { id: 11, label: 'オプション', component: 3 },

  // プレゼン4: 資金計画（1枚）
  { id: 12, label: '資金計画', component: 4 },

  // プレゼン5: 光熱費（2枚）
  { id: 13, label: '光熱費', component: 5 },
  { id: 14, label: 'シミュレーション', component: 5 },
];

// 全スライドを取得する関数（サーバーサイド用）
export async function getSlides(): Promise<Slide[]> {
  // 実際のアプリではここでDBやAPIから取得
  // 今回は固定データを返す
  console.log('[getSlides] 全14枚のスライドデータを返します');

  // エラーハンドリング（必要に応じて）
  if (!allSlides || allSlides.length === 0) {
    throw new Error('スライドデータの取得に失敗しました');
  }

  return allSlides;
}

// 特定のプレゼンテーションのスライドを取得
export async function getSlidesByPresentation(presentationId: number): Promise<Slide[]> {
  const slides = await getSlides();
  return slides.filter(slide => slide.component === presentationId);
}

// スライド数を取得
export async function getSlideCount(): Promise<number> {
  const slides = await getSlides();
  return slides.length;
}