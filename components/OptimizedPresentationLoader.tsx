'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// 最適化された動的インポート
const PresentationComponents = {
  Presentation1View: lazy(() =>
    import('./Presentation1View').then(mod => ({ default: mod.Presentation1View }))
  ),
  Presentation2Standard: lazy(() =>
    import('./Presentation2Standard')
  ),
  Presentation3Interactive: lazy(() =>
    import('./Presentation3Interactive')
  ),
  Presentation4View: lazy(() =>
    import('./Presentation4View').then(mod => ({ default: mod.Presentation4View }))
  ),
  Presentation5UtilityCostSimulation: lazy(() =>
    import('./Presentation5UtilityCostSimulation')
  ),
  Presentation6MaintenanceView: lazy(() =>
    import('./Presentation6MaintenanceView').then(mod => ({ default: mod.Presentation6MaintenanceView }))
  )
};

// ローディングコンポーネント
const LoadingFallback = ({ message = 'コンポーネントを読み込み中...' }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-white">
    <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
    <p className="text-gray-600 text-lg">{message}</p>
    <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-red-600 rounded-full animate-pulse" style={{ width: '60%' }} />
    </div>
  </div>
);

// エラー境界コンポーネント
class PresentationErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('プレゼンテーションコンポーネントエラー:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// デフォルトのエラー表示
const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8">
    <div className="max-w-md text-center">
      <div className="mb-6">
        <svg
          className="w-20 h-20 text-red-500 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        プレゼンテーションの読み込みエラー
      </h2>
      <p className="text-gray-600 mb-4">
        申し訳ございません。プレゼンテーションの読み込み中にエラーが発生しました。
      </p>
      <details className="text-left bg-white rounded-lg p-4 border border-red-200">
        <summary className="cursor-pointer text-red-600 font-medium">
          エラー詳細
        </summary>
        <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
          {error.message}
        </pre>
      </details>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        ページを再読み込み
      </button>
    </div>
  </div>
);

// プリロード管理
const usePreloadComponents = (currentIndex: number, totalSlides: number) => {
  useEffect(() => {
    // 次のスライドを事前読み込み
    const preloadNext = async () => {
      const nextIndex = (currentIndex + 1) % totalSlides;
      const componentNames = Object.keys(PresentationComponents);

      if (nextIndex < componentNames.length) {
        const componentName = componentNames[nextIndex] as keyof typeof PresentationComponents;
        try {
          // @ts-ignore
          await PresentationComponents[componentName]._payload?._result;
        } catch (e) {
          // プリロード失敗は無視
        }
      }
    };

    const timer = setTimeout(preloadNext, 1000);
    return () => clearTimeout(timer);
  }, [currentIndex, totalSlides]);
};

interface OptimizedPresentationLoaderProps {
  presentationType: keyof typeof PresentationComponents;
  projectId: string;
  slideIndex?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function OptimizedPresentationLoader({
  presentationType,
  projectId,
  slideIndex = 0,
  onLoad,
  onError
}: OptimizedPresentationLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const Component = PresentationComponents[presentationType];

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  // コンポーネントの事前読み込み
  usePreloadComponents(slideIndex, Object.keys(PresentationComponents).length);

  return (
    <PresentationErrorBoundary
      fallback={({ error }) => {
        onError?.(error);
        return <DefaultErrorFallback error={error} />;
      }}
    >
      <Suspense fallback={<LoadingFallback message={`${presentationType}を読み込み中...`} />}>
        <div onLoad={() => setIsLoaded(true)} className="w-full h-full">
          <Component projectId={projectId} />
        </div>
      </Suspense>
    </PresentationErrorBoundary>
  );
}

// パフォーマンス監視フック
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // パフォーマンス測定
    const measurePerformance = () => {
      if (performance && performance.memory) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

        setMetrics({
          loadTime: navigation.loadEventEnd - navigation.fetchStart,
          renderTime: navigation.domComplete - navigation.domInteractive,
          memoryUsage: (performance as any).memory.usedJSHeapSize / 1048576 // MB単位
        });
      }
    };

    const timer = setTimeout(measurePerformance, 1000);
    return () => clearTimeout(timer);
  }, []);

  return metrics;
};