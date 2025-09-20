'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import OptionSelectionSlide from '@/components/slides/OptionSelectionSlide';
import EnergyCostSimulation from '@/components/slides/EnergyCostSimulation';
import A3Guard from '@/components/dev/A3Guard';

// 既存のコンポーネントを動的インポート（エラー回避）
const OptionsSlideFixed = dynamic(() => import('@/components/OptionsSlideFixed').catch(() => ({ default: () => <div className="text-center p-10">スライドが見つかりません</div> })), { ssr: false });
const SolarSimulatorConclusionFirst = dynamic(() => import('@/components/SolarSimulatorConclusionFirst').catch(() => ({ default: () => <div className="text-center p-10">スライドが見つかりません</div> })), { ssr: false });
const OptionSelectionEnglish = dynamic(() => import('@/components/OptionSelectionEnglish').catch(() => ({ default: () => <div className="text-center p-10">スライドが見つかりません</div> })), { ssr: false });
const EnergyCostSimulationEnglish = dynamic(() => import('@/components/EnergyCostSimulationEnglish').catch(() => ({ default: () => <div className="text-center p-10">スライドが見つかりません</div> })), { ssr: false });

export default function FullPresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides = [
    { title: '【新】オプション選択', component: <OptionSelectionSlide />, useA3Guard: true },
    { title: '【新】光熱費シミュレーション', component: <EnergyCostSimulation />, useA3Guard: true },
    { title: 'オプション選択（既存）', component: <OptionsSlideFixed />, useA3Guard: false },
    { title: '光熱費シミュレーション（既存）', component: <SolarSimulatorConclusionFirst />, useA3Guard: false },
    { title: 'Option Selection (English)', component: <OptionSelectionEnglish />, useA3Guard: false },
    { title: 'Energy Cost Simulation (English)', component: <EnergyCostSimulationEnglish />, useA3Guard: false },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key >= '1' && e.key <= '9') {
        const slideIndex = parseInt(e.key) - 1;
        if (slideIndex < slides.length) {
          setCurrentSlide(slideIndex);
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* ナビゲーションバー（フルスクリーン時は非表示） */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Gハウス 統合プレゼンテーション</h1>
              <span className="text-sm text-gray-400">
                {currentSlide + 1} / {slides.length} - {currentSlideData.title}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                {isFullscreen ? '通常表示' : 'フルスクリーン'}
              </button>
              <select
                value={currentSlide}
                onChange={(e) => setCurrentSlide(Number(e.target.value))}
                className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                {slides.map((slide, index) => (
                  <option key={index} value={index}>
                    {index + 1}. {slide.title}
                  </option>
                ))}
              </select>
              <button
                onClick={prevSlide}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                disabled={currentSlide === 0}
              >
                ← 前へ
              </button>
              <button
                onClick={nextSlide}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                disabled={currentSlide === slides.length - 1}
              >
                次へ →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* スライド表示エリア */}
      <div className={`${!isFullscreen ? 'mt-20 mb-8' : ''} flex items-center justify-center`}>
        {currentSlideData.useA3Guard ? (
          <A3Guard key={currentSlide}>
            {currentSlideData.component}
          </A3Guard>
        ) : (
          <div key={currentSlide} className="bg-white rounded-lg shadow-xl">
            {currentSlideData.component}
          </div>
        )}
      </div>

      {/* スライドインジケーター */}
      {!isFullscreen && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`スライド ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* 操作説明（フルスクリーン時は簡略表示） */}
      <div className={`fixed ${isFullscreen ? 'bottom-2 right-2 text-xs bg-opacity-50' : 'bottom-4 right-4 text-sm bg-opacity-75'} text-white bg-gray-800 p-3 rounded`}>
        <p className="font-semibold mb-1">操作:</p>
        <div className="space-y-0.5">
          <p>→/Space: 次へ | ←: 前へ</p>
          <p>1-{slides.length}: 直接移動 | F: フルスクリーン</p>
        </div>
      </div>

      {/* フルスクリーン時のスライド番号表示 */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 text-white bg-gray-800 bg-opacity-50 px-3 py-1 rounded">
          {currentSlide + 1} / {slides.length}
        </div>
      )}
    </div>
  );
}