'use client';

import { useEffect, useRef, useCallback } from 'react';

interface A3AutoScalerProps {
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
}

// A3サイズの定数（96dpi基準）
const A3_DIMENSIONS = {
  WIDTH_MM: 420,
  HEIGHT_MM: 297,
  WIDTH_PX: (420 / 25.4) * 96, // 1587px
  HEIGHT_PX: (297 / 25.4) * 96, // 1123px
} as const;

export const A3AutoScaler: React.FC<A3AutoScalerProps> = ({
  children,
  className = '',
  debug = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const applyAutoScale = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // コンテンツの実際のサイズを取得
    const contentRect = content.getBoundingClientRect();
    const scrollWidth = content.scrollWidth;
    const scrollHeight = content.scrollHeight;

    // 実際のコンテンツサイズ（スクロール領域含む）
    const actualWidth = Math.max(contentRect.width, scrollWidth);
    const actualHeight = Math.max(contentRect.height, scrollHeight);

    if (debug) {
      console.log('A3AutoScaler Debug:', {
        'A3 Target Size': `${A3_DIMENSIONS.WIDTH_PX}x${A3_DIMENSIONS.HEIGHT_PX}`,
        'Content Actual Size': `${actualWidth}x${actualHeight}`,
        'Content Rect Size': `${contentRect.width}x${contentRect.height}`,
        'Content Scroll Size': `${scrollWidth}x${scrollHeight}`,
      });
    }

    // スケール計算
    const scaleX = A3_DIMENSIONS.WIDTH_PX / actualWidth;
    const scaleY = A3_DIMENSIONS.HEIGHT_PX / actualHeight;
    const scale = Math.min(scaleX, scaleY, 1); // 1を超えないように制限

    if (debug) {
      console.log('A3AutoScaler Scale:', {
        'Scale X': scaleX,
        'Scale Y': scaleY,
        'Final Scale': scale,
        'Will Scale': scale < 1,
      });
    }

    // スケールを適用
    if (scale < 1) {
      content.style.transform = `scale(${scale})`;
      content.style.transformOrigin = 'center center';

      // コンテナサイズをスケール後に調整
      const scaledWidth = actualWidth * scale;
      const scaledHeight = actualHeight * scale;

      container.style.width = `${scaledWidth}px`;
      container.style.height = `${scaledHeight}px`;
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
    } else {
      // スケールが不要な場合はリセット
      content.style.transform = 'none';
      container.style.width = 'auto';
      container.style.height = 'auto';
    }

    // A3サイズ枠の設定（デバッグ時）
    if (debug) {
      container.style.border = '2px solid red';
      container.style.boxSizing = 'border-box';
      content.style.border = '1px solid blue';
    }
  }, [debug]);

  useEffect(() => {
    // 初回実行
    const timer = setTimeout(applyAutoScale, 100);

    // ResizeObserverでコンテンツサイズ変更を監視
    const resizeObserver = new ResizeObserver(() => {
      applyAutoScale();
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // MutationObserverでDOM変更を監視
    const mutationObserver = new MutationObserver(() => {
      setTimeout(applyAutoScale, 50);
    });

    if (contentRef.current) {
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [applyAutoScale]);

  return (
    <div
      ref={containerRef}
      className={`a3-auto-scaler ${className}`}
      style={{
        maxWidth: `${A3_DIMENSIONS.WIDTH_PX}px`,
        maxHeight: `${A3_DIMENSIONS.HEIGHT_PX}px`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        ref={contentRef}
        className="a3-auto-scaler-content"
        style={{
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// A3印刷用のラッパーコンポーネント
export const A3PrintSheet: React.FC<{
  children: React.ReactNode;
  title?: string;
  debug?: boolean;
}> = ({ children, title, debug = false }) => {
  return (
    <div className="sheet a3 landscape">
      {debug && title && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'yellow',
          padding: '5px',
          fontSize: '12px',
          zIndex: 1000,
          color: 'black',
        }}>
          {title} - A3: {A3_DIMENSIONS.WIDTH_MM}×{A3_DIMENSIONS.HEIGHT_MM}mm
        </div>
      )}
      <div className="slide-wrapper">
        <A3AutoScaler debug={debug}>
          {children}
        </A3AutoScaler>
      </div>
    </div>
  );
};

export default A3AutoScaler;