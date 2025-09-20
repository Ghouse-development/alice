'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import A3Guard from '@/components/dev/A3Guard';

// 新規作成のスライド
import OptionSelectionSlide from '@/components/slides/OptionSelectionSlide';
import EnergyCostSimulation from '@/components/slides/EnergyCostSimulation';

// 既存のスライドを動的インポート - 正しいdefault export構文
const DesignSlide = dynamic(
  () => import('@/components/OptionsSlideFixed').then(mod => mod.default || mod),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-2xl">デザインスライド読み込み中...</div>
  }
);

const FundingPlanSlide = dynamic(
  () => import('@/components/SolarSimulatorConclusionFirst').then(mod => mod.default || mod),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-2xl">資金計画スライド読み込み中...</div>
  }
);

export default function IntegratedPresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideScale, setSlideScale] = useState(1);

  // 必要な4つのスライドのみ
  const slides = [
    {
      title: 'デザイン',
      component: <DesignSlide />,
      useA3Guard: false,
      category: 'プレゼンテーション'
    },
    {
      title: 'オプション選択',
      component: <OptionSelectionSlide />,
      useA3Guard: true,
      category: 'プレゼンテーション'
    },
    {
      title: '資金計画',
      component: <FundingPlanSlide />,
      useA3Guard: false,
      category: 'プレゼンテーション'
    },
    {
      title: '光熱費シミュレーション',
      component: <EnergyCostSimulation />,
      useA3Guard: true,
      category: 'プレゼンテーション'
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // ズーム調整
  const adjustZoom = (delta: number) => {
    setSlideScale(prev => Math.max(0.5, Math.min(1.5, prev + delta)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case '+':
        case '=':
          e.preventDefault();
          adjustZoom(0.1);
          break;
        case '-':
        case '_':
          e.preventDefault();
          adjustZoom(-0.1);
          break;
        case '0':
          e.preventDefault();
          setSlideScale(1);
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1);
          break;
        default:
          if (e.key >= '1' && e.key <= '9') {
            const slideIndex = parseInt(e.key) - 1;
            if (slideIndex < slides.length) {
              goToSlide(slideIndex);
            }
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];
  if (!currentSlideData) return <div>スライドが見つかりません</div>;

  // シンプルな表示

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* ヘッダー */}
      {!isFullscreen && (
        <header className="bg-gray-900 text-white shadow-lg z-20">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold text-red-500">
                  Gハウス プレゼンテーション
                </h1>
                <div className="text-sm">
                  <span className="text-gray-400">現在のスライド: </span>
                  <span className="font-semibold">{currentSlideData.title}</span>
                  <span className="text-gray-500 ml-2">
                    ({currentSlide + 1} / {slides.length})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* ズーム調整 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustZoom(-0.1)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    −
                  </button>
                  <span className="text-sm w-12 text-center">
                    {Math.round(slideScale * 100)}%
                  </span>
                  <button
                    onClick={() => adjustZoom(0.1)}
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    +
                  </button>
                </div>

                {/* スライド選択 */}
                <select
                  value={currentSlide}
                  onChange={(e) => goToSlide(Number(e.target.value))}
                  className="px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {slides.map((slide, index) => (
                    <option key={index} value={index}>
                      {index + 1}. {slide.title}
                    </option>
                  ))}
                </select>

                {/* ナビゲーションボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                    disabled={currentSlide === 0}
                  >
                    ← 前へ
                  </button>
                  <button
                    onClick={nextSlide}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
                    disabled={currentSlide === slides.length - 1}
                  >
                    次へ →
                  </button>
                </div>

                {/* フルスクリーンボタン */}
                <button
                  onClick={toggleFullscreen}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors font-semibold"
                >
                  {isFullscreen ? '通常表示' : 'フルスクリーン'}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div
          style={{
            transform: `scale(${slideScale})`,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          {currentSlideData.useA3Guard ? (
            <A3Guard key={currentSlide}>
              {currentSlideData.component}
            </A3Guard>
          ) : (
            <div key={currentSlide} className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {currentSlideData.component}
            </div>
          )}
        </div>
      </main>

      {/* フッター（スライドインジケーター） */}
      {!isFullscreen && (
        <footer className="bg-gray-900 py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center gap-3">
              {/* プログレスバー */}
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 transition-all rounded-full ${
                      index === currentSlide
                        ? 'bg-red-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500 w-2'
                    }`}
                    aria-label={`スライド ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* 操作ガイド */}
      <div className={`fixed ${isFullscreen ? 'bottom-4 right-4' : 'bottom-20 right-4'} bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs`}>
        <div className="font-bold mb-1">キーボード操作</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>→/Space: 次へ</div>
          <div>←: 前へ</div>
          <div>1-9: 直接移動</div>
          <div>F: フルスクリーン</div>
          <div>+/-: 拡大縮小</div>
          <div>0: リセット</div>
        </div>
      </div>

      {/* フルスクリーン時のミニマルUI */}
      {isFullscreen && (
        <>
          <div className="fixed top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
            {currentSlide + 1} / {slides.length}
          </div>
          <button
            onClick={() => setIsFullscreen(false)}
            className="fixed top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-75"
          >
            ESC
          </button>
        </>
      )}
    </div>
  );
}