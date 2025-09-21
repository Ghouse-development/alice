import { NextRequest, NextResponse } from 'next/server';

// Gハウス施工事例画像データベース
const imageDatabase = [
  // モダンスタイル画像（スッキリ、シンプル、直線的）
  {
    id: 'g-100',
    filename: 'gallery-100.jpg',
    tags: ['modern', 'living', 'white', 'minimal'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-101',
    filename: 'gallery-101.jpg',
    tags: ['modern', 'kitchen', 'sleek'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-110',
    filename: 'gallery-110.jpg',
    tags: ['modern', 'exterior', 'cubic'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-120',
    filename: 'gallery-120.jpg',
    tags: ['modern', 'interior', 'monochrome'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-130',
    filename: 'gallery-130.jpg',
    tags: ['modern', 'living', 'geometric'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-140',
    filename: 'gallery-140.jpg',
    tags: ['modern', 'bedroom', 'simple'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-150',
    filename: 'gallery-150.jpg',
    tags: ['modern', 'bath', 'clean'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-160',
    filename: 'gallery-160.jpg',
    tags: ['modern', 'entrance', 'stylish'],
    style: 0,
    similarity: 0,
  },

  // ナチュラルスタイル画像（木目、温かみ、自然素材）
  {
    id: 'g-105',
    filename: 'gallery-105.jpg',
    tags: ['natural', 'living', 'wood', 'warm'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-115',
    filename: 'gallery-115.jpg',
    tags: ['natural', 'kitchen', 'wooden'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-125',
    filename: 'gallery-125.jpg',
    tags: ['natural', 'exterior', 'garden'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-135',
    filename: 'gallery-135.jpg',
    tags: ['natural', 'interior', 'organic'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-145',
    filename: 'gallery-145.jpg',
    tags: ['natural', 'dining', 'cozy'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-155',
    filename: 'gallery-155.jpg',
    tags: ['natural', 'bedroom', 'wood'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-165',
    filename: 'gallery-165.jpg',
    tags: ['natural', 'living', 'plants'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-175',
    filename: 'gallery-175.jpg',
    tags: ['natural', 'terrace', 'green'],
    style: 1,
    similarity: 0,
  },

  // ラグジュアリー/クラシックスタイル画像（高級感、装飾的）
  {
    id: 'g-108',
    filename: 'gallery-108.jpg',
    tags: ['luxury', 'living', 'elegant'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-118',
    filename: 'gallery-118.jpg',
    tags: ['luxury', 'kitchen', 'premium'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-128',
    filename: 'gallery-128.jpg',
    tags: ['luxury', 'exterior', 'grand'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-138',
    filename: 'gallery-138.jpg',
    tags: ['luxury', 'interior', 'formal'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-148',
    filename: 'gallery-148.jpg',
    tags: ['luxury', 'dining', 'chandelier'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-158',
    filename: 'gallery-158.jpg',
    tags: ['luxury', 'bedroom', 'hotel-like'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-168',
    filename: 'gallery-168.jpg',
    tags: ['luxury', 'bath', 'spa'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-178',
    filename: 'gallery-178.jpg',
    tags: ['luxury', 'entrance', 'impressive'],
    style: 2,
    similarity: 0,
  },

  // カジュアル/インダストリアルスタイル画像（リラックス、ラフ）
  {
    id: 'g-103',
    filename: 'gallery-103.jpg',
    tags: ['casual', 'living', 'relaxed'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-113',
    filename: 'gallery-113.jpg',
    tags: ['casual', 'kitchen', 'open'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-123',
    filename: 'gallery-123.jpg',
    tags: ['casual', 'exterior', 'friendly'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-133',
    filename: 'gallery-133.jpg',
    tags: ['casual', 'interior', 'comfortable'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-143',
    filename: 'gallery-143.jpg',
    tags: ['casual', 'dining', 'family'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-153',
    filename: 'gallery-153.jpg',
    tags: ['casual', 'bedroom', 'cozy'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-163',
    filename: 'gallery-163.jpg',
    tags: ['industrial', 'living', 'loft'],
    style: 3,
    similarity: 0,
  },
  {
    id: 'g-173',
    filename: 'gallery-173.jpg',
    tags: ['industrial', 'kitchen', 'steel'],
    style: 3,
    similarity: 0,
  },

  // 追加のバリエーション画像
  {
    id: 'g-180',
    filename: 'gallery-180.jpg',
    tags: ['modern', 'living', 'bright'],
    style: 0,
    similarity: 0,
  },
  {
    id: 'g-190',
    filename: 'gallery-190.jpg',
    tags: ['natural', 'kitchen', 'country'],
    style: 1,
    similarity: 0,
  },
  {
    id: 'g-200',
    filename: 'gallery-200.jpg',
    tags: ['luxury', 'living', 'sophisticated'],
    style: 2,
    similarity: 0,
  },
  {
    id: 'g-210',
    filename: 'gallery-210.jpg',
    tags: ['casual', 'exterior', 'welcoming'],
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

    // Gハウス施工事例画像のURLを追加
    const recommendationsWithUrls = recommendations.slice(0, 4).map((rec) => ({
      ...rec,
      url: `/images/${rec.filename}`, // Gハウスの実際の施工事例画像を使用
    }));

    return NextResponse.json({
      success: true,
      recommendations: recommendationsWithUrls,
      styleScores: normalizedScores,
      dominantStyle: styleScores.indexOf(Math.max(...styleScores)),
    });
  } catch (error) {
    console.error('Error in image search:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
