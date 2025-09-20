'use client';

import { useState } from 'react';
import OptionSelectionSlide from '@/components/slides/OptionSelectionSlide';
import EnergyCostSimulation from '@/components/slides/EnergyCostSimulation';
import A3Guard from '@/components/dev/A3Guard';

export default function PresentationNewPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: 'オプション選択', component: <OptionSelectionSlide /> },
    { title: '光熱費シミュレーション', component: <EnergyCostSimulation /> },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key >= '1' && e.key <= '9') {
      const slideIndex = parseInt(e.key) - 1;
      if (slideIndex < slides.length) {
        setCurrentSlide(slideIndex);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      {/* ナビゲーションバー */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Gハウス プレゼンテーション</h1>
            <span className="text-sm text-gray-400">
              スライド {currentSlide + 1} / {slides.length} - {slides[currentSlide].title}
            </span>
          </div>
          <div className="flex gap-2">
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

      {/* スライド表示エリア */}
      <div className="mt-20 mb-8">
        <A3Guard key={currentSlide}>
          {slides[currentSlide].component}
        </A3Guard>
      </div>

      {/* スライドインジケーター */}
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

      {/* 操作説明 */}
      <div className="fixed bottom-4 right-4 text-white text-sm bg-gray-800 bg-opacity-75 p-3 rounded">
        <p className="font-semibold mb-1">操作方法:</p>
        <p>→ / Space: 次へ</p>
        <p>←: 前へ</p>
        <p>1-{slides.length}: 直接移動</p>
      </div>
    </div>
  );
}