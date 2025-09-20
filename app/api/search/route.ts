import { NextRequest, NextResponse } from 'next/server';
// import { pipeline } from '@xenova/transformers';
// import fs from 'fs';
// import path from 'path';

// TODO: AI機能実装時に有効化
// グローバル変数でモデルとembeddingsをキャッシュ
// let featureExtractor: any = null;
// let imageEmbeddings: any = null;

// // モデルの初期化
// async function initializeModel() {
//   if (!featureExtractor) {
//     try {
//       featureExtractor = await pipeline('feature-extraction', 'Xenova/clip-vit-base-patch32', {
//         quantized: false,
//       });
//       console.log('Feature extractor initialized');
//     } catch (error) {
//       console.error('Error initializing feature extractor:', error);
//       throw error;
//     }
//   }
// }

// // embeddingsの読み込み
// function loadEmbeddings() {
//   if (!imageEmbeddings) {
//     try {
//       const embeddingsPath = path.join(process.cwd(), 'embeddings.json');
//       const data = fs.readFileSync(embeddingsPath, 'utf8');
//       imageEmbeddings = JSON.parse(data);
//       console.log(`Loaded ${Object.keys(imageEmbeddings).length} image embeddings`);
//     } catch (error) {
//       console.error('Error loading embeddings:', error);
//       throw error;
//     }
//   }
//   return imageEmbeddings;
// }

// // コサイン類似度の計算
// function cosineSimilarity(vecA: number[], vecB: number[]): number {
//   const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dotProduct / (magA * magB);
// }

// 10の質問データ
const questions = [
  {
    id: 1,
    text: "理想の住まいの雰囲気は？",
    options: [
      { text: "モダンでスタイリッシュ", keywords: ["modern", "stylish", "contemporary", "minimalist"] },
      { text: "温かみのある自然素材", keywords: ["natural", "wooden", "warm", "cozy", "organic"] },
      { text: "クラシックで上品", keywords: ["classic", "elegant", "traditional", "refined"] },
      { text: "個性的でユニーク", keywords: ["unique", "creative", "artistic", "unconventional"] }
    ]
  },
  {
    id: 2,
    text: "好みの色合いは？",
    options: [
      { text: "白・グレーのモノトーン", keywords: ["white", "grey", "monochrome", "neutral"] },
      { text: "ベージュ・ブラウンの自然色", keywords: ["beige", "brown", "earth", "natural"] },
      { text: "ダークカラーで落ち着いた色", keywords: ["dark", "black", "deep", "sophisticated"] },
      { text: "カラフルで明るい色", keywords: ["colorful", "bright", "vibrant", "cheerful"] }
    ]
  },
  {
    id: 3,
    text: "リビングはどんな空間にしたい？",
    options: [
      { text: "広々としたオープンスペース", keywords: ["open", "spacious", "large", "expansive"] },
      { text: "家族が集まる温かい空間", keywords: ["family", "cozy", "gathering", "warm"] },
      { text: "くつろげる落ち着いた空間", keywords: ["relaxing", "calm", "peaceful", "comfortable"] },
      { text: "ゲストを招ける華やかな空間", keywords: ["entertaining", "elegant", "social", "impressive"] }
    ]
  },
  {
    id: 4,
    text: "キッチンに求める機能は？",
    options: [
      { text: "効率的で使いやすい", keywords: ["efficient", "functional", "practical", "organized"] },
      { text: "家族とのコミュニケーション重視", keywords: ["open", "family", "social", "interactive"] },
      { text: "本格的な料理を楽しむ", keywords: ["cooking", "gourmet", "professional", "culinary"] },
      { text: "デザイン性を重視", keywords: ["stylish", "beautiful", "designer", "aesthetic"] }
    ]
  },
  {
    id: 5,
    text: "寝室の理想は？",
    options: [
      { text: "シンプルで清潔感のある", keywords: ["simple", "clean", "minimal", "fresh"] },
      { text: "リラックスできる癒しの空間", keywords: ["relaxing", "peaceful", "serene", "calm"] },
      { text: "ホテルライクな高級感", keywords: ["luxury", "hotel", "elegant", "sophisticated"] },
      { text: "個性を表現する自分らしい空間", keywords: ["personal", "unique", "individual", "creative"] }
    ]
  },
  {
    id: 6,
    text: "外観のスタイルは？",
    options: [
      { text: "シンプルモダン", keywords: ["modern", "simple", "geometric", "clean"] },
      { text: "ナチュラル・自然素材", keywords: ["natural", "wood", "stone", "organic"] },
      { text: "クラシック・伝統的", keywords: ["classic", "traditional", "timeless", "formal"] },
      { text: "個性的・デザイナーズ", keywords: ["unique", "designer", "architectural", "striking"] }
    ]
  },
  {
    id: 7,
    text: "重視する住まいの価値は？",
    options: [
      { text: "機能性・使いやすさ", keywords: ["functional", "practical", "efficient", "convenient"] },
      { text: "快適性・居心地の良さ", keywords: ["comfortable", "cozy", "livable", "pleasant"] },
      { text: "デザイン性・美しさ", keywords: ["beautiful", "stylish", "aesthetic", "artistic"] },
      { text: "個性・独自性", keywords: ["unique", "individual", "distinctive", "personal"] }
    ]
  },
  {
    id: 8,
    text: "理想のライフスタイルは？",
    options: [
      { text: "効率的でスマートな生活", keywords: ["smart", "efficient", "organized", "streamlined"] },
      { text: "自然と調和した暮らし", keywords: ["natural", "harmony", "sustainable", "organic"] },
      { text: "上質で洗練された生活", keywords: ["luxury", "refined", "sophisticated", "quality"] },
      { text: "自由で創造的な生活", keywords: ["creative", "free", "artistic", "flexible"] }
    ]
  },
  {
    id: 9,
    text: "好みのインテリア素材は？",
    options: [
      { text: "ガラス・金属・コンクリート", keywords: ["glass", "metal", "concrete", "industrial"] },
      { text: "木材・石材・自然素材", keywords: ["wood", "stone", "natural", "organic"] },
      { text: "布・革・温かみのある素材", keywords: ["fabric", "leather", "soft", "warm"] },
      { text: "特殊素材・新しい技術", keywords: ["innovative", "modern", "technology", "advanced"] }
    ]
  },
  {
    id: 10,
    text: "住まいに求める最も大切なことは？",
    options: [
      { text: "安心・安全", keywords: ["safe", "secure", "protected", "stable"] },
      { text: "家族の絆・コミュニケーション", keywords: ["family", "communication", "togetherness", "connection"] },
      { text: "自分らしさの表現", keywords: ["personal", "expression", "individual", "identity"] },
      { text: "日々の快適さ", keywords: ["comfort", "convenient", "pleasant", "easy"] }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid answers format. Expected array of 10 answers.' },
        { status: 400 }
      );
    }

    // 回答からキーワードを抽出
    const allKeywords: string[] = [];
    answers.forEach((answerIndex: number, questionIndex: number) => {
      const question = questions[questionIndex];
      if (question && question.options[answerIndex]) {
        allKeywords.push(...question.options[answerIndex].keywords);
      }
    });

    // キーワードからクエリテキストを生成
    const queryText = allKeywords.join(' ');
    console.log('Query text:', queryText);

    // TODO: 本来はAI処理を行うが、今回はモック画像を返す
    // 模擬的な画像推奨結果（実際の画像が存在するかチェック）
    const mockImages = [
      'gallery-100.jpg',
      'gallery-101.jpg',
      'gallery-102.jpg',
      'gallery-103.jpg'
    ];

    const recommendations = mockImages.map((filename, index) => ({
      filename,
      similarity: 0.85 - (index * 0.1), // 模擬類似度スコア
      url: `/images/${filename}`
    }));

    console.log('Mock recommendations:', recommendations);

    // 結果を返す
    return NextResponse.json({
      success: true,
      query: queryText,
      recommendations
    });

  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Image search API is running',
    endpoint: '/api/search',
    method: 'POST',
    expectedPayload: {
      answers: 'Array of 10 integers (0-3) representing selected options for each question'
    }
  });
}