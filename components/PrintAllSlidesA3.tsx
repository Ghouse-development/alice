'use client';

import React from 'react';
import { Presentation1View } from './Presentation1View';
import Presentation2CrownUnified from './Presentation2CrownUnified';
import Presentation3Interactive from './Presentation3Interactive';
import { Presentation4View } from './Presentation4View';
import Presentation5RunningCost from './Presentation5RunningCost';

interface PrintAllSlidesA3Props {
  projectId: string;
}

export default function PrintAllSlidesA3({ projectId }: PrintAllSlidesA3Props) {
  return (
    <>
      {/* A3横向き印刷用スタイル */}
      <style jsx global>{`
        @media print {
          @page {
            size: 420mm 297mm;
            margin: 0;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
          }

          /* 印刷時に非表示にする要素 */
          .no-print,
          button,
          input[type="checkbox"],
          .print-hide,
          nav,
          header,
          footer {
            display: none !important;
          }

          /* 印刷用コンテナを表示 */
          .print-container {
            display: block !important;
          }

          /* 各スライドページ設定 */
          .a3-print-page {
            width: 420mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            position: relative !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }

          .a3-print-page:last-child {
            page-break-after: auto !important;
          }

          /* スライドコンテンツの設定 */
          .a3-slide-content {
            width: 1190px !important;
            height: 842px !important;
            max-width: none !important;
            max-height: none !important;
            transform: scale(1.385) !important; /* 1190px → 420mm のスケール調整 */
            transform-origin: center center !important;
            position: relative !important;
            overflow: hidden !important;
          }

          /* 各プレゼンテーションコンポーネントのサイズ固定 */
          .a3-slide-content > div {
            width: 1190px !important;
            height: 842px !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            position: relative !important;
          }

          /* 背景色とグラデーションを確実に印刷 */
          div[class*="bg-"],
          div[class*="gradient"],
          div[class*="border"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* テキストカラーを保持 */
          span[class*="text-"],
          p[class*="text-"],
          h1[class*="text-"],
          h2[class*="text-"],
          h3[class*="text-"],
          h4[class*="text-"],
          div[class*="text-"] {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* インタラクティブ要素を非表示 */
          input[type="checkbox"],
          button {
            display: none !important;
          }

          /* チェックボックスの状態を表示用に変換 */
          input[type="checkbox"]:checked + span::before {
            content: "✓ " !important;
            color: #22c55e !important;
            font-weight: bold !important;
          }

          /* オーバーフローを防ぐ */
          * {
            overflow: visible !important;
          }

          /* フォントサイズの最小値を保証 */
          body {
            font-size: 12pt !important;
          }

          /* 影を除去（印刷品質向上のため） */
          [class*="shadow"] {
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* 印刷用コンテナ（画面では非表示） */}
      <div className="print-container hidden print:block">

        {/* スライド1: デザイン資料 */}
        <div className="a3-print-page">
          <div className="a3-slide-content">
            <Presentation1View currentFileIndex={0} />
          </div>
        </div>

        {/* スライド2: 性能・仕様（各カテゴリ） */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((slideIndex) => (
          <div key={`slide2-${slideIndex}`} className="a3-print-page">
            <div className="a3-slide-content">
              <Presentation2CrownUnified
                projectId={projectId}
                fixedSlide={slideIndex}
              />
            </div>
          </div>
        ))}

        {/* スライド3: オプション */}
        <div className="a3-print-page">
          <div className="a3-slide-content">
            <Presentation3Interactive />
          </div>
        </div>

        {/* スライド4: 資金計画 */}
        <div className="a3-print-page">
          <div className="a3-slide-content">
            <Presentation4View projectId={projectId} />
          </div>
        </div>

        {/* スライド5: ランニングコスト */}
        <div className="a3-print-page">
          <div className="a3-slide-content">
            <Presentation5RunningCost />
          </div>
        </div>
      </div>
    </>
  );
}