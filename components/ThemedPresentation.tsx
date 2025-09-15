'use client';

import { useStore } from '@/lib/store';
import { useEffect } from 'react';

interface ThemedPresentationProps {
  children: React.ReactNode;
}

export function ThemedPresentation({ children }: ThemedPresentationProps) {
  const { theme } = useStore();

  useEffect(() => {
    // ルート要素にテーマクラスを適用
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // テーマに応じた背景色を設定
  const bgClass = theme === 'dark'
    ? 'bg-black'
    : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {children}
    </div>
  );
}