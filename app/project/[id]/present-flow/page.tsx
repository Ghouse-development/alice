'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Home, ChevronLeft, ChevronRight, Play, Pause, Maximize, Minimize } from 'lucide-react';
import type { PerformanceItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Presentation1View } from '@/components/Presentation1View';
import Presentation2CrownUnified from '@/components/Presentation2CrownUnified';
import OptionsSlideFixed from '@/components/OptionsSlideFixed';
import { Presentation4View } from '@/components/Presentation4View';
import SolarSimulatorConclusionFirst from '@/components/SolarSimulatorConclusionFirst';
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
  const { projects, currentProject, setCurrentProject } = useStore();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentation2Items, setPresentation2Items] = useState<PerformanceItem[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(true); // プレゼンモード状態を追加

  // 全画面時にボディのスタイルを制御
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
    } else {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    }
  }, [isFullscreen]);

  // プレゼン1のスライド数を動的に決定（ファイルがある場合はその数、ない場合は1枚）
  const presentation1Files = currentProject?.presentation1?.uploadedFiles || [];
  const presentation1SlideCount = presentation1Files.length > 0 ? presentation1Files.length : 1;

  // 全スライドの構成を定義
  const slides: SlideInfo[] = [
    // プレゼン1（デザイン）: ファイル数に応じて可変（デフォルト7枚）
    ...Array.from({ length: presentation1SlideCount }, (_, i) => ({
      presentation: 1,
      slideIndex: i,
      title: `デザイン (${i + 1}/${presentation1SlideCount})`,
      totalSlides: presentation1SlideCount
    })),
    // プレゼン2（標準仕様）: 10枚
    ...Array.from({ length: 10 }, (_, i) => ({
      presentation: 2,
      slideIndex: i,
      title: `標準仕様 (${i + 1}/10)`,
      totalSlides: 10
    })),
    // プレゼン3（オプション）: 1枚
    { presentation: 3, title: 'オプション', totalSlides: 1 },
    // プレゼン4（資金計画）: 1枚
    { presentation: 4, title: '資金計画', totalSlides: 1 },
    // プレゼン5（光熱費）: 1枚
    { presentation: 5, title: '光熱費', totalSlides: 1 },
  ];

  const totalSlides = slides.length;
  const currentSlide = slides[currentSlideIndex];

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlideIndex(index);
    }
  };

  // 全スライドを印刷用に出力（全画面で全ページA3横印刷）
  const handlePrintAllSlides = async () => {
    try {
      // 1) フルスクリーン（ユーザー操作起点なのでawait可能）
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {
          /* ブラウザが拒否しても続行 */
        }
      }

      // 2) 全スライドのDOMを取得
      const allSlides = await getAllSlides();

      if (!allSlides?.length) return;

      // 3) 印刷ホストを作成し、全ページをクローンして突っ込む
      const host = document.createElement('div');
      host.id = 'print-host';
      document.body.appendChild(host);

      allSlides.forEach((node, i) => {
        const clone = node.cloneNode(true) as HTMLElement;
        clone.classList.add('print-slide');
        // スライド内のツールバーや余計なUIは除去
        clone.querySelectorAll('.toolbar, .present-controls, .no-print').forEach(el => el.remove());
        host.appendChild(clone);
      });

      // 4) 画像とフォントのロード待ち
      await Promise.all([
        waitForImages(host),
        (document as any).fonts?.ready?.catch(() => {})
      ]);

      // 5) 印刷
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      window.print();

    } finally {
      // 6) 後片付け
      document.getElementById('print-host')?.remove();
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {}
      }
    }
  };

  // 画像のロード待機処理
  const waitForImages = (root: HTMLElement) => {
    const imgs = Array.from(root.querySelectorAll('img'));
    return Promise.all(imgs.map(img => {
      if (img.complete) return Promise.resolve(null);
      return new Promise<void>(res => {
        img.addEventListener('load', () => res(), { once: true });
        img.addEventListener('error', () => res(), { once: true });
        // 遅延読み込みを無効化
        img.loading = 'eager';
        (img as any).decoding = 'sync';
      });
    }));
  };

  // 全スライドのDOMを取得（仮想化対応）
  const getAllSlides = async (): Promise<HTMLElement[]> => {
    const slideElements: HTMLElement[] = [];

    // 各スライドをレンダリングしてDOMを取得
    for (let i = 0; i < slides.length; i++) {
      const slideData = slides[i];
      const slideWrapper = document.createElement('div');
      slideWrapper.className = 'presentation-wrapper';
      slideWrapper.style.width = '420mm';
      slideWrapper.style.height = '297mm';
      slideWrapper.style.background = 'white';

      // スライドのレンダリング用のコンテナ
      const renderContainer = document.createElement('div');
      renderContainer.id = `slide-render-${i}`;
      renderContainer.style.width = '100%';
      renderContainer.style.height = '100%';
      renderContainer.style.position = 'relative';

      // 各プレゼンテーションタイプに応じたコンテンツを生成
      let content = '';
      switch (slideData.presentation) {
        case 1:
          content = `<div class="slide-placeholder">デザイン ${slideData.slideIndex !== undefined ? slideData.slideIndex + 1 : ''}</div>`;
          break;
        case 2:
          content = `<div class="slide-placeholder">標準仕様 ${slideData.slideIndex !== undefined ? slideData.slideIndex + 1 : ''}</div>`;
          break;
        case 3:
          content = `<div class="slide-placeholder">オプション</div>`;
          break;
        case 4:
          content = `<div class="slide-placeholder">資金計画</div>`;
          break;
        case 5:
          content = `<div class="slide-placeholder">光熱費</div>`;
          break;
      }

      renderContainer.innerHTML = content;
      slideWrapper.appendChild(renderContainer);
      slideElements.push(slideWrapper);
    }

    return slideElements;
  };

  // ナビゲーション関数を定義（useEffectで使用するため先に定義）
  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  // キーボードナビゲーション対応
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // スペースキー
          event.preventDefault();
          nextSlide();
          break;
        case 'Escape':
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
        case 'Home':
          event.preventDefault();
          setCurrentSlideIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentSlideIndex(totalSlides - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFullscreen, nextSlide, prevSlide, totalSlides]);

  // デバッグログは削除（本番環境では不要）

  useEffect(() => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  }, [projectId, projects, setCurrentProject]);

  // プレゼンテーション2のアイテムを取得
  useEffect(() => {
    const savedContents = localStorage.getItem('presentation2Contents');
    let items = [];

    if (savedContents) {
      try {
        const contents = JSON.parse(savedContents);
        items = contents.map((content: PerformanceItem, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
          contentType: (content as any).contentType,
          customComponent: (content as any).customComponent,
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

    setPresentation2Items(items);
  }, []);

  // オートプレイ機能 - 全画面時は間隔を調整
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(prev =>
          prev < totalSlides - 1 ? prev + 1 : 0
        );
      }, isFullscreen ? 15000 : 10000); // 全画面時は15秒、通常時は10秒
      setAutoPlayInterval(interval);
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }

    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [autoPlay, totalSlides, autoPlayInterval, isFullscreen]);

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
      } else if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        handlePrintAllSlides();
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
            <Presentation1View
              projectId={projectId}
              currentFileIndex={currentSlide.slideIndex}
            />
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
            <OptionsSlideFixed projectId={projectId} />
          </PresentationContainer>
        );
      case 4:
        return (
          <PresentationContainer fullscreen>
            <Presentation4View projectId={projectId} />
          </PresentationContainer>
        );
      case 5:
        return <SolarSimulatorConclusionFirst projectId={projectId} />;
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
    <div className={`${isFullscreen ? 'fixed inset-0 bg-black z-[9999]' : 'min-h-screen bg-gray-900'} text-white relative overflow-hidden`} style={isFullscreen ? {
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      border: 'none',
      outline: 'none',
      top: 0,
      left: 0,
      position: 'fixed'
    } : {}}>
      {/* ヘッダー */}
      <div className={`${isFullscreen ? 'hidden' : 'fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur border-b border-gray-700'}`}>
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  router.push(`/project/${projectId}/edit`);
                }}
                className="text-white hover:bg-white/20"
              >
                <Home className="h-4 w-4 mr-2" />
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
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    setIsFullscreen(true);
                  } else {
                    document.exitFullscreen();
                    setIsFullscreen(false);
                  }
                }}
                className="text-white hover:bg-white/20"
                title={isPresentationMode ? '全画面表示' : '全画面'}
                aria-label={isPresentationMode ? '全画面表示' : '全画面'}
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                {isPresentationMode ? '全画面表示' : '全画面'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ナビゲーションボタン - 非全画面時のみ表示 */}
      {!isFullscreen && (
        <div className="fixed top-16 left-0 right-0 z-50 bg-black/90 backdrop-blur border-b border-gray-700">
          <div className="px-6 py-3">
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0}
                  className="bg-white/90 hover:bg-white text-black px-10 py-3 font-bold text-lg disabled:opacity-30 shadow-lg transition-all"
                >
                  <ChevronLeft className="h-5 w-5 mr-2" />
                  前へ
                </Button>

                <div className="bg-black/70 rounded-full px-6 py-2">
                  <span className="text-white font-bold text-xl">
                    {currentSlideIndex + 1} / {totalSlides}
                  </span>
                </div>

                <Button
                  variant="default"
                  size="lg"
                  onClick={nextSlide}
                  disabled={currentSlideIndex === totalSlides - 1}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 font-bold text-lg disabled:opacity-30 shadow-lg transition-all"
                >
                  次へ
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全画面時の終了ボタン - 右上に配置 */}
      {isFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            }
            setIsFullscreen(false);
            router.push(`/project/${projectId}/edit`);
          }}
          className="fixed top-4 right-4 z-50 bg-gray-800/80 hover:bg-gray-700/90 text-white px-4 py-2 font-bold text-sm shadow-lg transition-all backdrop-blur border border-gray-600"
        >
          <Minimize className="h-4 w-4 mr-2" />
          終了
        </Button>
      )}

      {/* メインコンテンツ */}
      <div id="current-slide-content" className={`${isFullscreen ? 'fixed inset-0' : 'pt-32 pb-24'} slide-container`} style={isFullscreen ? {
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } : {}}>
        <div className={`${isFullscreen ? '' : 'container mx-auto px-4'}`} style={isFullscreen ? {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0,
          padding: 0
        } : {}}>
          {/* スライドタイトル - プレゼン時は非表示 */}

          {/* スライドコンテンツ - A3横サイズ (420mm × 297mm = 1.414:1) */}
          <div className="relative w-full" style={isFullscreen ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          } : {
            maxWidth: '1190px',
            margin: '0 auto'
          }}>
            {/* 全画面時のナビゲーション矢印 - 左 */}
            {isFullscreen && (
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-30 bg-black/10 hover:bg-black/30 text-white p-4 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {/* 全画面時のナビゲーション矢印 - 右 */}
            {isFullscreen && (
              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-30 bg-black/10 hover:bg-black/30 text-white p-4 rounded-full transition-all duration-300 opacity-30 hover:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}

            {/* プレゼンテーションコンテンツ */}
            <div className={`${isFullscreen ? 'bg-transparent' : 'bg-white rounded-lg shadow-2xl'} relative`} style={isFullscreen ? {
              width: 'auto',
              height: 'auto'
            } : {
              width: '100%',
              aspectRatio: '1.414 / 1',
              margin: '0 auto'
            }}>
              {renderCurrentSlide()}
            </div>
          </div>
        </div>
      </div>


      {/* フッター情報バー */}
      <div className={`${isFullscreen ? 'hidden' : 'fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur px-6 py-3'}`}>
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