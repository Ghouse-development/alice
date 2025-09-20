'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/lib/store';
import type { HearingSheet } from '@/types';

interface HearingSheetEditorProps {
  projectId: string;
}

const priorityItems = [
  { key: 'design', label: 'デザイン性', description: '外観・内観のデザイン重視度' },
  { key: 'earthquake', label: '耐震性', description: '地震に対する強度・安全性' },
  { key: 'insulation', label: '断熱性', description: '夏涼しく冬暖かい住環境' },
  { key: 'airQuality', label: '空気環境', description: '換気・空気清浄性能' },
  { key: 'durability', label: '耐久性', description: '長期的な建物の耐久性' },
  { key: 'construction', label: '施工品質', description: '施工の丁寧さ・品質管理' },
  { key: 'energySaving', label: '省エネ性', description: 'エネルギー効率・光熱費削減' },
  { key: 'technology', label: '最新技術', description: 'スマートホーム・IoT設備' },
] as const;

// 理想の暮らしシートの質問
const idealLivingQuestions = [
  {
    id: 1,
    text: "ご家族構成（必須）",
    options: [
      "大人のみ",
      "夫婦＋子ども",
      "夫婦＋親世帯",
      "その他"
    ]
  },
  {
    id: 2,
    text: "マイホームを建てるきっかけ",
    options: [
      "子どもが生まれた／成長した",
      "今の家が手狭",
      "理想の立地に土地がある",
      "家賃がもったいない"
    ]
  },
  {
    id: 3,
    text: "お家づくりのコンセプト",
    options: [
      "家族が集まる家",
      "ペットと暮らす家",
      "趣味を楽しむ家",
      "ゆったりくつろげる家"
    ]
  },
  {
    id: 4,
    text: "外観イメージ",
    options: [
      "ナチュラル（白系）",
      "スタイリッシュ（黒系）",
      "シック（グレー・ベージュ）",
      "その他"
    ]
  },
  {
    id: 5,
    text: "内観イメージ",
    options: [
      "シンプルモダン",
      "ナチュラル",
      "ホテルライク",
      "和モダン"
    ]
  },
  {
    id: 6,
    text: "お庭の使い方",
    options: [
      "BBQ",
      "家庭菜園",
      "子どもやペットの遊び場",
      "プール／水遊び"
    ]
  },
  {
    id: 7,
    text: "キッチンタイプ",
    options: [
      "アイランド",
      "対面型",
      "壁付け",
      "L型／Ⅱ型"
    ]
  },
  {
    id: 8,
    text: "ご夫婦のライフスタイル",
    options: [
      "在宅ワークが多い",
      "家事を効率的にしたい",
      "来客が多い",
      "趣味を楽しむ"
    ]
  },
  {
    id: 9,
    text: "ご夫婦の趣味",
    options: [
      "料理",
      "映画／音楽",
      "読書",
      "DIY"
    ]
  },
  {
    id: 10,
    text: "新居に持ち込む予定の家具・家電",
    options: [
      "ベッド",
      "ソファ",
      "ダイニングセット",
      "大型家電（冷蔵庫・洗濯機など）"
    ]
  }
];

export function HearingSheetEditor({ projectId }: HearingSheetEditorProps) {
  const { currentProject, updateHearingSheet } = useStore();
  const [priorities, setPriorities] = useState<HearingSheet['priorities']>({
    design: 5,
    earthquake: 5,
    insulation: 5,
    airQuality: 5,
    durability: 5,
    construction: 5,
    energySaving: 5,
    technology: 5,
  });
  const [idealLivingAnswers, setIdealLivingAnswers] = useState<number[]>(new Array(10).fill(-1));
  const [recommendedImages, setRecommendedImages] = useState<HearingSheet['idealLiving']['recommendedImages']>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentProject?.hearingSheet) {
      setPriorities(currentProject.hearingSheet.priorities);
      if (currentProject.hearingSheet.idealLiving) {
        setIdealLivingAnswers(currentProject.hearingSheet.idealLiving.answers || new Array(10).fill(-1));
        setRecommendedImages(currentProject.hearingSheet.idealLiving.recommendedImages || []);
      }
    }
  }, [currentProject]);

  const handlePriorityChange = (key: keyof HearingSheet['priorities'], value: number[]) => {
    const newPriorities = { ...priorities, [key]: value[0] };
    setPriorities(newPriorities);

    const hearingSheet: HearingSheet = {
      id: currentProject?.hearingSheet?.id || `hearing-${Date.now()}`,
      projectId,
      priorities: newPriorities,
      idealLiving: {
        answers: idealLivingAnswers,
        recommendedImages: recommendedImages,
      },
    };

    updateHearingSheet(projectId, hearingSheet);
  };

  const handleIdealLivingAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...idealLivingAnswers];
    newAnswers[questionIndex] = answerIndex;
    setIdealLivingAnswers(newAnswers);

    const hearingSheet: HearingSheet = {
      id: currentProject?.hearingSheet?.id || `hearing-${Date.now()}`,
      projectId,
      priorities,
      idealLiving: {
        answers: newAnswers,
        recommendedImages: recommendedImages,
      },
    };

    updateHearingSheet(projectId, hearingSheet);
  };

  const handleDiagnosis = async () => {
    // すべての質問に回答されているかチェック
    if (idealLivingAnswers.some(answer => answer === -1)) {
      alert('すべての質問にお答えください');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers: idealLivingAnswers }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRecommendedImages(data.recommendations);

        const hearingSheet: HearingSheet = {
          id: currentProject?.hearingSheet?.id || `hearing-${Date.now()}`,
          projectId,
          priorities,
          idealLiving: {
            answers: idealLivingAnswers,
            recommendedImages: data.recommendations,
          },
        };

        updateHearingSheet(projectId, hearingSheet);
      } else {
        alert('診断に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Error during diagnosis:', error);
      alert('診断中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedPriorities = () => {
    return priorityItems
      .map((item) => ({
        ...item,
        value: priorities[item.key],
      }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>理想の暮らしシート</CardTitle>
          <CardDescription>
            お客様の理想の暮らし方について質問にお答えください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {idealLivingQuestions.map((question, questionIndex) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                  {question.id}
                </div>
                <Label className="text-base font-semibold text-gray-800 pt-1">
                  {question.text}
                </Label>
              </div>
              <RadioGroup
                value={idealLivingAnswers[questionIndex]?.toString() || ''}
                onValueChange={(value) => handleIdealLivingAnswer(questionIndex, parseInt(value))}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = idealLivingAnswers[questionIndex] === optionIndex;
                    return (
                      <div
                        key={optionIndex}
                        className={`
                          relative flex items-center p-4 rounded-xl border-2 cursor-pointer
                          transition-all duration-200 hover:shadow-md
                          ${isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                          }
                        `}
                        onClick={() => handleIdealLivingAnswer(questionIndex, optionIndex)}
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`q${questionIndex}-o${optionIndex}`}
                          className="mr-3"
                        />
                        <Label
                          htmlFor={`q${questionIndex}-o${optionIndex}`}
                          className={`cursor-pointer flex-1 ${isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}`}
                        >
                          {option}
                        </Label>
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>
          ))}

          <div className="pt-8 border-t border-gray-200">
            {/* 進捗バー */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">回答済み</span>
                <span className="text-sm font-medium text-gray-700">
                  {idealLivingAnswers.filter(answer => answer !== -1).length} / {idealLivingQuestions.length} 問
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(idealLivingAnswers.filter(answer => answer !== -1).length / idealLivingQuestions.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* 診断ボタン */}
            <Button
              onClick={handleDiagnosis}
              disabled={isLoading || idealLivingAnswers.some(answer => answer === -1)}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  診断中...
                </div>
              ) : idealLivingAnswers.some(answer => answer === -1) ? (
                `すべての質問にお答えください（残り ${idealLivingAnswers.filter(answer => answer === -1).length} 問）`
              ) : (
                '理想の住まいを診断する'
              )}
            </Button>

            {idealLivingAnswers.some(answer => answer === -1) && (
              <p className="text-xs text-gray-500 text-center mt-2">
                ※すべての質問に回答すると診断が可能になります
              </p>
            )}
          </div>

          {recommendedImages && recommendedImages.length > 0 && (
            <div className="pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">診断結果</h3>
                    <p className="text-sm text-gray-600">お客様の理想に合った住まいのイメージです</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                {recommendedImages.map((image, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={image.url}
                        alt={`推奨画像 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDIwMCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuOCpOODoeODvOOCuOOBjuiqreOBv+i+vOOBvuOBvuOBm+OCkyA8L3RleHQ+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                        #{index + 1}
                      </div>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-white">
                      <div className="text-sm font-semibold text-gray-800 truncate">{image.filename}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full"
                            style={{ width: `${image.similarity * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {(image.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-white/80 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    これらの画像はオプション選択画面に自動的に表示されます
                  </span>
                </p>
              </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}