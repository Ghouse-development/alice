'use client';

import React from 'react';
import { Presentation1View } from './Presentation1View';
import Presentation2CrownUnified from './Presentation2CrownUnified';
import Presentation3Interactive from './Presentation3Interactive';
import { Presentation4View } from './Presentation4View';
import Presentation5RunningCost from './Presentation5RunningCost';

interface PrintAllSlidesProps {
  projectId: string;
}

export default function PrintAllSlides({ projectId }: PrintAllSlidesProps) {
  return (
    <div className="print:block hidden">
      {/* 印刷時のスタイル */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }

          .print-page {
            page-break-after: always;
            page-break-inside: avoid;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: relative;
          }

          .print-page:last-child {
            page-break-after: auto;
          }

          /* スライド内のインタラクティブ要素を非表示 */
          button, input[type="checkbox"] {
            display: none !important;
          }

          /* 背景とボーダーの調整 */
          .dark {
            filter: none !important;
          }

          /* スケール調整 */
          .slide-content {
            transform: scale(1);
            transform-origin: top left;
          }
        }

        @page {
          size: A3 landscape;
          margin: 0;
        }
      `}</style>

      {/* スライド1: デザイン資料 */}
      <div className="print-page">
        <div className="slide-content">
          <Presentation1View currentFileIndex={0} />
        </div>
      </div>

      {/* スライド2: 性能・仕様（各カテゴリごとにページ分割） */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((slideIndex) => (
        <div key={`slide2-${slideIndex}`} className="print-page">
          <div className="slide-content">
            <Presentation2CrownUnified
              projectId={projectId}
              fixedSlide={slideIndex}
            />
          </div>
        </div>
      ))}

      {/* スライド3: オプション */}
      <div className="print-page">
        <div className="slide-content">
          <Presentation3Interactive />
        </div>
      </div>

      {/* スライド4: 資金計画 */}
      <div className="print-page">
        <div className="slide-content">
          <Presentation4View projectId={projectId} />
        </div>
      </div>

      {/* スライド5: ランニングコスト */}
      <div className="print-page">
        <div className="slide-content">
          <Presentation5RunningCost />
        </div>
      </div>
    </div>
  );
}