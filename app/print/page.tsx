'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Presentation1View } from '@/components/Presentation1View';
import Presentation2CrownUnified from '@/components/Presentation2CrownUnified';
import Presentation3Interactive from '@/components/Presentation3Interactive';
import { Presentation4View } from '@/components/Presentation4View';
import { Presentation5View } from '@/components/Presentation5View';
import SolarSimulatorConclusionFirst from '@/components/SolarSimulatorConclusionFirst';
import SolarComparison30YearsFinal from '@/components/SolarComparison30YearsFinal';

export default function PrintPage() {
  const { currentProject } = useStore();

  useEffect(() => {
    // 印刷用のクラスを追加
    document.body.classList.add('print-mode');

    // 画像とフォントの読み込み完了を待つ
    const printAll = () => {
      const images = document.querySelectorAll('img');
      const promises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      });

      // フォント読み込み完了待機
      if (document.fonts?.ready) {
        promises.push(document.fonts.ready);
      }

      Promise.all(promises).then(() => {
        // 全リソース読み込み完了後、印刷準備完了をコンソールに出力
        console.log('Print ready: All resources loaded');
        window.dispatchEvent(new Event('print-ready'));
      });
    };

    // DOMContentLoaded後に実行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', printAll);
    } else {
      printAll();
    }

    return () => {
      document.body.classList.remove('print-mode');
    };
  }, []);

  // 14枚のスライドを定義
  const slides = [
    // スライド1: プレゼン1（資料）
    <Presentation1View key="slide1" />,

    // スライド2-7: プレゼン2（各カテゴリ）
    <Presentation2CrownUnified key="slide2" projectId="" fixedSlide={0} />,
    <Presentation2CrownUnified key="slide3" projectId="" fixedSlide={1} />,
    <Presentation2CrownUnified key="slide4" projectId="" fixedSlide={2} />,
    <Presentation2CrownUnified key="slide5" projectId="" fixedSlide={3} />,
    <Presentation2CrownUnified key="slide6" projectId="" fixedSlide={4} />,
    <Presentation2CrownUnified key="slide7" projectId="" fixedSlide={5} />,

    // スライド8: プレゼン3（インタラクティブ）
    <Presentation3Interactive key="slide8" />,

    // スライド9-10: プレゼン4（設備仕様）
    <Presentation4View key="slide9" projectId="" />,
    <Presentation4View key="slide10" projectId="" />,

    // スライド11: プレゼン5（アフターサービス）
    <Presentation5View key="slide11" projectId="" />,

    // スライド12-14: 太陽光シミュレーター
    <SolarSimulatorConclusionFirst key="slide12" />,
    <SolarComparison30YearsFinal key="slide13" />,
    <SolarSimulatorConclusionFirst key="slide14" />,
  ];

  return (
    <div className="viewport print-viewport">
      {slides.map((slide, index) => (
        <div key={`wrap-${index}`} className="zoom-wrap print-zoom-wrap">
          <section className="page-a3 print-page" data-page={index + 1}>
            <div className="safe">{slide}</div>
          </section>
        </div>
      ))}
    </div>
  );
}
