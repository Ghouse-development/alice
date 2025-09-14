'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Home, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Presentation1View } from '@/components/Presentation1View';
import Presentation2CrownUnified from '@/components/Presentation2CrownUnified';
import Presentation3Interactive from '@/components/Presentation3Interactive';
import { Presentation4View } from '@/components/Presentation4View';
import Presentation5RunningCost from '@/components/Presentation5RunningCost';
import { PresentationContainer } from '@/components/PresentationContainer';

interface SlideInfo {
  presentation: number;
  slideIndex?: number;
  title: string;
  totalSlides: number;
}

export default function PresentationFlowPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { currentProject, setCurrentProject } = useStore();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentation2Items, setPresentation2Items] = useState<any[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);

  // 全スライドの構成を定義
  const slides: SlideInfo[] = [
    { presentation: 1, title: 'デザイン', totalSlides: 1 },
    ...Array.from({ length: 10 }, (_, i) => ({
      presentation: 2,
      slideIndex: i,
      title: `標準装備 (${i + 1}/10)`,
      totalSlides: 10
    })),
    { presentation: 3, title: 'オプション', totalSlides: 1 },
    { presentation: 4, title: '資金計画', totalSlides: 1 },
    { presentation: 5, title: '光熱費', totalSlides: 1 },
  ];

  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    setCurrentProject(projectId);
  }, [projectId, setCurrentProject]);

  // プレゼンテーション2のアイテムを取得
  useEffect(() => {
    const savedContents = localStorage.getItem('presentation2Contents');
    let items = [];

    if (savedContents) {
      try {
        const contents = JSON.parse(savedContents);
        items = contents.map((content: any, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
          contentType: content.contentType,
          customComponent: content.customComponent,
        }));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }

    if (items.length === 0) {
      // デフォルトアイテム
      items = [
        { id: '1', category: '耐震', title: '最高等級の耐震性能×evoltz制震システム', description: 'ビルシュタイン社と共同開発したevoltz制震ダンパーにより、地震の揺れを最大45%低減。', priority: 1 },
        { id: '2', category: '断熱・気密', title: 'HEAT20 G2グレードの高断熱・高気密設計', description: 'UA値0.46以下、C値0.5以下を実現。北海道基準の断熱性能により、夏涼しく冬暖かい快適な住環境を一年中提供します。', priority: 2 },
        { id: '3', category: '空気質', title: '清潔空気システム', description: '高性能フィルターでPM2.5、花粉を99.8%カット。常に新鮮で清潔な空気を供給し、アレルギー対策にも効果的です。', priority: 3 },
        { id: '4', category: '空調計画', title: '24時間全熱交換換気システム', description: '第一種換気システムで熱ロスを最小限に抑え、省エネと快適性を両立。湿度調整機能で結露も防止します。', priority: 4 },
        { id: '5', category: '耐久性', title: '長期優良住宅認定・100年住宅', description: '劣化対策等級3、維持管理対策等級3を取得。構造躯体は100年以上の耐久性を実現し、メンテナンスコストも大幅削減。', priority: 5 },
        { id: '6', category: 'デザイン性', title: '洗練された外観と機能美の融合', description: '建築家とのコラボレーションにより、街並みに調和しながらも個性的な外観デザインを実現。', priority: 6 },
        { id: '7', category: '施工品質', title: '自社大工による匠の技術', description: '経験豊富な自社大工による丁寧な施工。第三者機関による10回検査と、施工中の見える化により、最高品質を保証します。', priority: 7 },
        { id: '8', category: '保証・アフターサービス', title: '業界最長クラスの安心保証', description: '構造躯体35年保証、防水20年保証、シロアリ10年保証。24時間365日の緊急対応と、50年間の定期点検プログラム。', priority: 8 },
        { id: '9', category: '省エネ性', title: 'ZEH基準を超える省エネ性能', description: '太陽光発電5.5kW標準搭載、HEMS導入により光熱費を50%以上削減。売電収入と合わせて実質光熱費ゼロも実現可能です。', priority: 9 },
        { id: '10', category: '最新テクノロジー（IoT）', title: 'スマートホーム標準装備', description: 'Google Home/Alexa対応、スマートロック、見守りカメラ、遠隔家電操作など、最新のIoT技術で快適で安全な暮らしをサポート。', priority: 10 },
      ];
    }

    console.log('Loaded presentation2Items:', items.length, 'items');
    setPresentation2Items(items);
  }, []);

  // オートプレイ機能
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(prev =>
          prev < totalSlides - 1 ? prev + 1 : 0
        );
      }, 10000); // 10秒間隔
      setAutoPlayInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }

    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [autoPlay, totalSlides, autoPlayInterval]);

  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // キーボードナビゲーション
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        router.push(`/project/${projectId}/edit`);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlideIndex, projectId, router]);

  const renderCurrentSlide = () => {
    switch (currentSlide.presentation) {
      case 1:
        return (
          <PresentationContainer fullscreen>
            <Presentation1View projectId={projectId} />
          </PresentationContainer>
        );
      case 2:
        return (
          <PresentationContainer fullscreen>
            <Presentation2CrownUnified
              projectId={projectId}
              fixedSlide={currentSlide.slideIndex}
              performanceItems={presentation2Items}
            />
          </PresentationContainer>
        );
      case 3:
        return (
          <PresentationContainer fullscreen>
            <Presentation3Interactive />
          </PresentationContainer>
        );
      case 4:
        return (
          <PresentationContainer fullscreen>
            <Presentation4View projectId={projectId} />
          </PresentationContainer>
        );
      case 5:
        return (
          <PresentationContainer fullscreen>
            <Presentation5RunningCost />
          </PresentationContainer>
        );
      default:
        return <div>Invalid presentation</div>;
    }
  };

  const getPresentationColor = (presentation: number) => {
    const colors = {
      1: 'bg-blue-500',
      2: 'bg-green-500',
      3: 'bg-purple-500',
      4: 'bg-orange-500',
      5: 'bg-red-500'
    };
    return colors[presentation as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* ヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-b border-gray-700">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/project/${projectId}/edit`)}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                編集に戻る
              </Button>
              <div className="text-lg font-semibold">
                {currentProject?.projectName || 'プロジェクト'}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoPlay(!autoPlay)}
                className="text-white hover:bg-white/20"
              >
                {autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {autoPlay ? 'ストップ' : 'オート'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="pt-20 pb-24">
        <div className="container mx-auto px-4">
          {/* スライドタイトル */}
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">{currentSlide.title}</h1>
            <div className="text-gray-400">
              {currentSlide.presentation === 2 && presentation2Items[currentSlide.slideIndex!] &&
                presentation2Items[currentSlide.slideIndex!].category
              }
            </div>
          </div>

          {/* ナビゲーションボタン - プレゼンの直上 */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              disabled={currentSlideIndex === 0}
              className="bg-white hover:bg-gray-100 text-black px-10 py-4 font-bold text-xl disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6 mr-2" />
              前へ
            </Button>

            <div className="bg-black/50 rounded-full px-6 py-3">
              <span className="text-white font-bold text-xl">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={nextSlide}
              disabled={currentSlideIndex === totalSlides - 1}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 font-bold text-xl disabled:opacity-30"
            >
              次へ
              <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          </div>

          {/* スライドコンテンツ - A3横サイズ (420mm × 297mm = 1.414:1) */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden mx-auto" style={{
            width: 'min(90vw, 1190px)',
            height: 'min(90vw / 1.414, 842px)',
            aspectRatio: '1.414 / 1'
          }}>
            {renderCurrentSlide()}
          </div>
        </div>
      </div>


      {/* フッター情報バー */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur px-6 py-3">
        {/* スライドインジケーター */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${
                index === currentSlideIndex
                  ? getPresentationColor(slide.presentation) + ' scale-150'
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              title={slide.title}
            />
          ))}
        </div>

        {/* プレゼンテーション別プログレスバー */}
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5].map(presNum => {
            const presSlides = slides.filter(s => s.presentation === presNum);
            const presStartIndex = slides.findIndex(s => s.presentation === presNum);
            const presEndIndex = presStartIndex + presSlides.length - 1;
            const isActive = currentSlideIndex >= presStartIndex && currentSlideIndex <= presEndIndex;
            const progress = isActive
              ? ((currentSlideIndex - presStartIndex + 1) / presSlides.length) * 100
              : currentSlideIndex > presEndIndex ? 100 : 0;

            return (
              <div key={presNum} className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPresentationColor(presNum)}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* ショートカットキーヒント */}
        <div className="mt-2 text-xs text-gray-400 text-center">
          ← → キー: スライド移動 | スペースキー: 次へ | Escキー: 編集に戻る
        </div>
      </div>
    </div>
  );
}