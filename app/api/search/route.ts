import { NextRequest, NextResponse } from 'next/server';

// 画像データベース（実際の画像に応じて調整）
const imageDatabase = [
  // モダンスタイル画像
  {
    id: 'modern-1',
    filename: 'modern-living-1.jpg',
    tags: ['modern', 'minimalist', 'monochrome', 'geometric'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'modern-2',
    filename: 'modern-living-2.jpg',
    tags: ['modern', 'sleek', 'glass', 'steel'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'modern-3',
    filename: 'modern-kitchen-1.jpg',
    tags: ['modern', 'kitchen', 'white', 'clean'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'modern-4',
    filename: 'modern-exterior-1.jpg',
    tags: ['modern', 'exterior', 'cubic', 'flat'],
    style: 0,
    similarity: 0,
  },

  // ナチュラルスタイル画像
  {
    id: 'natural-1',
    filename: 'natural-living-1.jpg',
    tags: ['natural', 'wood', 'warm', 'organic'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'natural-2',
    filename: 'natural-living-2.jpg',
    tags: ['natural', 'plants', 'green', 'eco'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'natural-3',
    filename: 'natural-kitchen-1.jpg',
    tags: ['natural', 'kitchen', 'wood', 'country'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'natural-4',
    filename: 'natural-exterior-1.jpg',
    tags: ['natural', 'exterior', 'garden', 'traditional'],
    style: 1,
    similarity: 0,
  },

  // クラシックスタイル画像
  {
    id: 'classic-1',
    filename: 'classic-living-1.jpg',
    tags: ['classic', 'elegant', 'traditional', 'luxury'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'classic-2',
    filename: 'classic-living-2.jpg',
    tags: ['classic', 'antique', 'ornate', 'formal'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'classic-3',
    filename: 'classic-kitchen-1.jpg',
    tags: ['classic', 'kitchen', 'traditional', 'detailed'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'classic-4',
    filename: 'classic-exterior-1.jpg',
    tags: ['classic', 'exterior', 'european', 'stone'],
    style: 2,
    similarity: 0,
  },

  // インダストリアルスタイル画像
  {
    id: 'industrial-1',
    filename: 'industrial-living-1.jpg',
    tags: ['industrial', 'raw', 'concrete', 'metal'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'industrial-2',
    filename: 'industrial-living-2.jpg',
    tags: ['industrial', 'loft', 'exposed', 'urban'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'industrial-3',
    filename: 'industrial-kitchen-1.jpg',
    tags: ['industrial', 'kitchen', 'steel', 'professional'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'industrial-4',
    filename: 'industrial-exterior-1.jpg',
    tags: ['industrial', 'exterior', 'warehouse', 'modern'],
    style: 3,
    similarity: 0,
  },
];

// 質問の重み付け（各質問の重要度）
const questionWeights = [
  1.5, // リビングのイメージ（最重要）
  1.2, // 照明のイメージ
  1.0, // ソファ・椅子
  0.9, // フローリング
  0.7, // 時計
  1.3, // キッチン（重要）
  0.8, // バスルーム
  0.6, // 壁紙
  1.0, // カラーテーマ
  1.1, // 外構・お庭
];

// スタイルマッピング（各質問の選択肢がどのスタイルに対応するか）
const styleMapping: number[][] = [
  [0, 1, 2, 3], // Q1: モダン、ナチュラル、クラシック、インダストリアル
  [0, 3, 2, 1], // Q2: 照明 - スポット→モダン、ペンダント→インダストリアル、シャンデリア→クラシック、間接→ナチュラル
  [0, 1, 2, 3], // Q3: ソファ
  [0, 1, 2, 3], // Q4: フローリング
  [0, 3, 2, 1], // Q5: 時計
  [0, 3, 1, 2], // Q6: キッチン
  [0, 1, 2, 3], // Q7: バスルーム
  [0, 1, 2, 3], // Q8: 壁紙
  [0, 1, 2, 3], // Q9: カラー
  [0, 1, 2, 3], // Q10: 外構
];

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // 各スタイルのスコアを計算
    const styleScores = [0, 0, 0, 0]; // モダン、ナチュラル、クラシック、インダストリアル

    answers.forEach((answer, questionIndex) => {
      if (answer >= 0 && answer < 4) {
        const selectedStyle = styleMapping[questionIndex][answer];
        const weight = questionWeights[questionIndex];
        styleScores[selectedStyle] += weight;
      }
    });

    // スタイルスコアを正規化（0-1の範囲に）
    const maxScore = Math.max(...styleScores);
    const normalizedScores = styleScores.map((score) => score / maxScore);

    // 画像の類似度を計算
    const scoredImages = imageDatabase.map((image) => {
      // 基本スコア：選択されたスタイルとの一致度
      let similarity = normalizedScores[image.style];

      // 質問に基づいた追加のスコアリング
      // リビングを重視した場合、リビング画像を優先
      if (answers[0] === image.style && image.tags.includes('living')) {
        similarity += 0.2;
      }

      // キッチンを重視した場合、キッチン画像を優先
      if (answers[5] === image.style && image.tags.includes('kitchen')) {
        similarity += 0.15;
      }

      // 外構の選択と外観画像のマッチング
      if (answers[9] === image.style && image.tags.includes('exterior')) {
        similarity += 0.1;
      }

      // ランダム性を少し加える（同じ答えでも少し変化を持たせる）
      similarity += Math.random() * 0.05;

      return {
        ...image,
        similarity: Math.min(similarity, 1), // 最大値を1に制限
      };
    });

    // スコアの高い順にソート
    scoredImages.sort((a, b) => b.similarity - a.similarity);

    // 上位4つの画像を選択（多様性を確保）
    const recommendations = [];
    const usedStyles = new Set();

    for (const image of scoredImages) {
      if (recommendations.length >= 4) break;

      // 同じスタイルから2つまでに制限（多様性確保）
      const styleCount = recommendations.filter((r) => r.style === image.style).length;
      if (styleCount < 2) {
        recommendations.push({
          filename: image.filename,
          similarity: Math.round(image.similarity * 100) / 100,
          style: image.style,
          tags: image.tags,
        });
      }
    }

    // 不足分がある場合は異なるスタイルから補完
    if (recommendations.length < 4) {
      for (const image of scoredImages) {
        if (recommendations.length >= 4) break;
        if (!recommendations.find((r) => r.filename === image.filename)) {
          recommendations.push({
            filename: image.filename,
            similarity: Math.round(image.similarity * 100) / 100,
            style: image.style,
            tags: image.tags,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, 4),
      styleScores: normalizedScores,
      dominantStyle: styleScores.indexOf(Math.max(...styleScores)),
    });
  } catch (error) {
    console.error('Error in image search:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
