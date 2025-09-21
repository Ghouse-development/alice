'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import A3Page from './A3Page';

const GHousePresentationSlides = dynamic(
  () => import('./slides/ghouse-presentation-slides'),
  { ssr: false }
);

interface Presentation2StandardProps {
  projectId?: string;
  fixedSlide?: number;
  performanceItems?: any[];
}

export default function Presentation2Standard({ projectId, fixedSlide }: Presentation2StandardProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(fixedSlide || 0);

  useEffect(() => {
    if (fixedSlide !== undefined) {
      setCurrentSlideIndex(fixedSlide);
    }
  }, [fixedSlide]);

  // プレゼンテーションモードで個別スライド表示
  if (fixedSlide !== undefined) {
    return <GHousePresentationSlides initialSlide={fixedSlide} projectId={projectId} />;
  }

  // 編集モードでA3Page内に表示
  return (
    <A3Page title="G HOUSE 標準仕様" subtitle="世界基準の高性能住宅をご提案いたします">
      <GHousePresentationSlides projectId={projectId} />
    </A3Page>
  );
}