'use client';

import { useEffect, useRef, PropsWithChildren } from 'react';

export default function A3Guard({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const checkOverflow = () => {
      const pass =
        el.scrollHeight <= el.clientHeight &&
        el.scrollWidth <= el.clientWidth;

      console.log('[A3Guard] Size Check:', {
        expected: { width: 1587, height: 1123 },
        actual: { width: el.offsetWidth, height: el.offsetHeight },
        scroll: { scrollH: el.scrollHeight, scrollW: el.scrollWidth },
        client: { clientH: el.clientHeight, clientW: el.clientWidth },
      });

      if (!pass) {
        console.error('[A3Guard] ❌ FAIL - Content overflows container!', {
          scrollH: el.scrollHeight, clientH: el.clientHeight,
          scrollW: el.scrollWidth, clientW: el.clientWidth,
          overflowH: el.scrollHeight - el.clientHeight,
          overflowW: el.scrollWidth - el.clientWidth,
        });
        el.style.outline = '4px solid red';
      } else {
        console.info('[A3Guard] ✅ PASS - No overflow detected');
        el.style.outline = '2px solid lime';
      }
    };

    // 初回チェック
    setTimeout(checkOverflow, 100);
    // 遅延チェック（コンテンツ読み込み後）
    setTimeout(checkOverflow, 500);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width: '1587px',
        height: '1123px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: '80px 1fr',
        backgroundColor: 'white'
      }}
    >
      {children}
    </div>
  );
}