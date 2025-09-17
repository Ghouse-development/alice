'use client';

import React from 'react';
import { A3ViewportContainer } from './A3ViewportContainer';

interface A3SlideTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// 統一されたA3スライドテンプレート
export const A3SlideTemplate: React.FC<A3SlideTemplateProps> = ({ title, subtitle, children }) => {
  return (
    <A3ViewportContainer title={title} subtitle={subtitle}>
      {children}
    </A3ViewportContainer>
  );
};

export default A3SlideTemplate;
