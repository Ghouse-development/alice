'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAccessibility } from '@/hooks/useAccessibility';
import { Play, Pause, RotateCcw, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

// Transition effect types
export type TransitionEffect =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-horizontal'
  | 'flip-vertical'
  | 'cube-left'
  | 'cube-right'
  | 'dissolve'
  | 'wipe-left'
  | 'wipe-right'
  | 'circle-expand'
  | 'circle-contract';

// Easing function types
export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'anticipate'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut';

// Transition configuration
export interface TransitionConfig {
  effect: TransitionEffect;
  duration: number;
  easing: EasingFunction;
  stagger: number;
  parallax: boolean;
  blur: boolean;
  scale: boolean;
  opacity: boolean;
}

// Auto-play configuration
export interface AutoPlayConfig {
  enabled: boolean;
  interval: number;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  resumeOnLeave: boolean;
  stopOnLastSlide: boolean;
  direction: 'forward' | 'backward' | 'pingpong';
}

// Progress indicator configuration
export interface ProgressConfig {
  type: 'linear' | 'circular' | 'dots' | 'thumbnails' | 'none';
  position: 'top' | 'bottom' | 'left' | 'right';
  showNumbers: boolean;
  showTime: boolean;
  animated: boolean;
  clickable: boolean;
}

// Performance optimization settings
export interface PerformanceConfig {
  enableGPU: boolean;
  preloadNext: boolean;
  preloadPrevious: boolean;
  optimizeImages: boolean;
  reducedMotionFallback: TransitionEffect;
  lowPerformanceMode: boolean;
}

// Main component props
export interface SlideTransitionsProps {
  children: React.ReactNode[];
  transitionConfig?: Partial<TransitionConfig>;
  autoPlayConfig?: Partial<AutoPlayConfig>;
  progressConfig?: Partial<ProgressConfig>;
  performanceConfig?: Partial<PerformanceConfig>;
  onSlideChange?: (fromIndex: number, toIndex: number) => void;
  onTransitionStart?: (index: number) => void;
  onTransitionEnd?: (index: number) => void;
  className?: string;
}

// Default configurations
const defaultTransitionConfig: TransitionConfig = {
  effect: 'fade',
  duration: 0.5,
  easing: 'easeInOut',
  stagger: 0.1,
  parallax: false,
  blur: false,
  scale: false,
  opacity: true,
};

const defaultAutoPlayConfig: AutoPlayConfig = {
  enabled: false,
  interval: 5000,
  pauseOnHover: true,
  pauseOnFocus: true,
  resumeOnLeave: true,
  stopOnLastSlide: false,
  direction: 'forward',
};

const defaultProgressConfig: ProgressConfig = {
  type: 'linear',
  position: 'bottom',
  showNumbers: true,
  showTime: false,
  animated: true,
  clickable: true,
};

const defaultPerformanceConfig: PerformanceConfig = {
  enableGPU: true,
  preloadNext: true,
  preloadPrevious: true,
  optimizeImages: true,
  reducedMotionFallback: 'fade',
  lowPerformanceMode: false,
};

// Transition variants for different effects
const createTransitionVariants = (
  config: TransitionConfig,
  direction: 'enter' | 'exit',
  slideIndex: number
) => {
  const { effect, duration, easing, parallax, blur, scale, opacity } = config;

  const easingMap: Record<EasingFunction, number[]> = {
    linear: [0, 0, 1, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    anticipate: [0.2, 1, 0.3, 1],
    backIn: [0.6, -0.05, 0.01, 0.99],
    backOut: [0.99, 0.01, 0.05, 0.6],
    backInOut: [0.6, -0.05, 0.01, 0.99],
    circIn: [0.6, 0.04, 0.98, 0.335],
    circOut: [0.075, 0.82, 0.165, 1],
    circInOut: [0.785, 0.135, 0.15, 0.86],
  };

  const getTransform = () => {
    switch (effect) {
      case 'slide-left':
        return direction === 'enter' ? { x: '100%' } : { x: '-100%' };
      case 'slide-right':
        return direction === 'enter' ? { x: '-100%' } : { x: '100%' };
      case 'slide-up':
        return direction === 'enter' ? { y: '100%' } : { y: '-100%' };
      case 'slide-down':
        return direction === 'enter' ? { y: '-100%' } : { y: '100%' };
      case 'zoom-in':
        return direction === 'enter' ? { scale: 0.8 } : { scale: 1.2 };
      case 'zoom-out':
        return direction === 'enter' ? { scale: 1.2 } : { scale: 0.8 };
      case 'flip-horizontal':
        return direction === 'enter' ? { rotateY: -90 } : { rotateY: 90 };
      case 'flip-vertical':
        return direction === 'enter' ? { rotateX: -90 } : { rotateX: 90 };
      case 'cube-left':
        return direction === 'enter'
          ? { rotateY: 90, x: '100%' }
          : { rotateY: -90, x: '-100%' };
      case 'cube-right':
        return direction === 'enter'
          ? { rotateY: -90, x: '-100%' }
          : { rotateY: 90, x: '100%' };
      case 'circle-expand':
        return direction === 'enter'
          ? { scale: 0, borderRadius: '50%' }
          : { scale: 1.5, borderRadius: '50%' };
      case 'circle-contract':
        return direction === 'enter'
          ? { scale: 1.5, borderRadius: '50%' }
          : { scale: 0, borderRadius: '50%' };
      default:
        return {};
    }
  };

  const baseVariant = {
    ...getTransform(),
    opacity: opacity ? (direction === 'enter' ? 0 : 1) : 1,
    scale: scale ? (direction === 'enter' ? 0.95 : 1.05) : undefined,
    filter: blur ? (direction === 'enter' ? 'blur(5px)' : 'blur(0px)') : undefined,
  };

  const animatedVariant = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    borderRadius: '0%',
    filter: 'blur(0px)',
  };

  return {
    initial: direction === 'enter' ? baseVariant : animatedVariant,
    animate: direction === 'enter' ? animatedVariant : baseVariant,
    exit: direction === 'exit' ? baseVariant : animatedVariant,
    transition: {
      duration,
      ease: easingMap[easing],
      type: 'tween',
    },
  };
};

export const SlideTransitions: React.FC<SlideTransitionsProps> = ({
  children,
  transitionConfig = {},
  autoPlayConfig = {},
  progressConfig = {},
  performanceConfig = {},
  onSlideChange,
  onTransitionStart,
  onTransitionEnd,
  className,
}) => {
  // Merge configurations with defaults
  const finalTransitionConfig = { ...defaultTransitionConfig, ...transitionConfig };
  const finalAutoPlayConfig = { ...defaultAutoPlayConfig, ...autoPlayConfig };
  const finalProgressConfig = { ...defaultProgressConfig, ...progressConfig };
  const finalPerformanceConfig = { ...defaultPerformanceConfig, ...performanceConfig };

  // Hooks
  const { currentStep, setCurrentStep } = useStore();
  const { state: accessibilityState, utils } = useAccessibility();
  const controls = useAnimation();

  // State
  const [isAutoPlaying, setIsAutoPlaying] = useState(finalAutoPlayConfig.enabled);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playbackDirection, setPlaybackDirection] = useState<'forward' | 'backward'>('forward');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto');

  // Refs
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Current slide index (0-based for internal use)
  const currentIndex = currentStep - 1;
  const totalSlides = children.length;

  // Performance detection
  const detectPerformance = useCallback(() => {
    if (typeof window === 'undefined') return 'high';

    const connection = (navigator as any).connection;
    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;

    let score = 0;

    // Check connection
    if (connection) {
      if (connection.effectiveType === '4g') score += 2;
      else if (connection.effectiveType === '3g') score += 1;
    } else {
      score += 2; // Assume good connection if unknown
    }

    // Check memory
    if (deviceMemory >= 4) score += 2;
    else if (deviceMemory >= 2) score += 1;

    // Check CPU cores
    if (hardwareConcurrency >= 4) score += 2;
    else if (hardwareConcurrency >= 2) score += 1;

    return score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
  }, []);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (!finalAutoPlayConfig.enabled || isTransitioning) return;

    clearAutoPlayTimer();
    autoPlayTimerRef.current = setTimeout(() => {
      if (finalAutoPlayConfig.direction === 'forward' || playbackDirection === 'forward') {
        if (currentIndex < totalSlides - 1) {
          setCurrentStep((currentStep + 1) as any);
        } else if (finalAutoPlayConfig.direction === 'pingpong') {
          setPlaybackDirection('backward');
          setCurrentStep((currentStep - 1) as any);
        } else if (!finalAutoPlayConfig.stopOnLastSlide) {
          setCurrentStep(1 as any);
        } else {
          setIsAutoPlaying(false);
        }
      } else {
        if (currentIndex > 0) {
          setCurrentStep((currentStep - 1) as any);
        } else {
          setPlaybackDirection('forward');
          setCurrentStep((currentStep + 1) as any);
        }
      }
    }, finalAutoPlayConfig.interval);
  }, [
    finalAutoPlayConfig,
    isTransitioning,
    playbackDirection,
    currentIndex,
    totalSlides,
    currentStep,
    setCurrentStep
  ]);

  const clearAutoPlayTimer = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const pauseAutoPlay = useCallback(() => {
    clearAutoPlayTimer();
  }, [clearAutoPlayTimer]);

  const resumeAutoPlay = useCallback(() => {
    if (isAutoPlaying && finalAutoPlayConfig.resumeOnLeave) {
      startAutoPlay();
    }
  }, [isAutoPlaying, finalAutoPlayConfig.resumeOnLeave, startAutoPlay]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides || index === currentIndex || isTransitioning) return;

    const fromIndex = currentIndex;
    setIsTransitioning(true);

    onTransitionStart?.(index);
    onSlideChange?.(fromIndex, index);

    setCurrentStep((index + 1) as any);
  }, [currentIndex, totalSlides, isTransitioning, onTransitionStart, onSlideChange, setCurrentStep]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Handle transition end
  const handleTransitionEnd = useCallback(() => {
    setIsTransitioning(false);
    onTransitionEnd?.(currentIndex);
  }, [currentIndex, onTransitionEnd]);

  // Get appropriate transition effect based on accessibility and performance
  const getEffectiveTransitionConfig = useMemo(() => {
    const effectiveConfig = { ...finalTransitionConfig };

    // Check for reduced motion preference
    if (utils.shouldDisableAnimations()) {
      effectiveConfig.effect = finalPerformanceConfig.reducedMotionFallback;
      effectiveConfig.duration = 0.2;
    }

    // Adjust for performance mode
    if (performanceMode === 'low' || finalPerformanceConfig.lowPerformanceMode) {
      effectiveConfig.effect = 'fade';
      effectiveConfig.duration = Math.min(effectiveConfig.duration, 0.3);
      effectiveConfig.blur = false;
      effectiveConfig.parallax = false;
    }

    return effectiveConfig;
  }, [finalTransitionConfig, finalPerformanceConfig, performanceMode, utils]);

  // Auto-play effect
  useEffect(() => {
    if (isAutoPlaying && !accessibilityState.isReducedMotion) {
      startAutoPlay();
    } else {
      clearAutoPlayTimer();
    }

    return clearAutoPlayTimer;
  }, [isAutoPlaying, accessibilityState.isReducedMotion, startAutoPlay, clearAutoPlayTimer]);

  // Performance detection effect
  useEffect(() => {
    if (performanceMode === 'auto') {
      const detectedPerformance = detectPerformance();
      if (detectedPerformance === 'low') {
        setPerformanceMode('low');
      }
    }
  }, [performanceMode, detectPerformance]);

  // Pause on hover/focus
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      if (finalAutoPlayConfig.pauseOnHover) pauseAutoPlay();
    };

    const handleMouseLeave = () => {
      if (finalAutoPlayConfig.pauseOnHover) resumeAutoPlay();
    };

    const handleFocus = () => {
      if (finalAutoPlayConfig.pauseOnFocus) pauseAutoPlay();
    };

    const handleBlur = () => {
      if (finalAutoPlayConfig.pauseOnFocus) resumeAutoPlay();
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('focus', handleFocus, true);
    container.addEventListener('blur', handleBlur, true);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('focus', handleFocus, true);
      container.removeEventListener('blur', handleBlur, true);
    };
  }, [finalAutoPlayConfig.pauseOnHover, finalAutoPlayConfig.pauseOnFocus, pauseAutoPlay, resumeAutoPlay]);

  // Progress indicator component
  const ProgressIndicator = () => {
    if (finalProgressConfig.type === 'none') return null;

    const progress = ((currentIndex + 1) / totalSlides) * 100;

    const baseClasses = `transition-all duration-300 ${
      finalProgressConfig.clickable ? 'cursor-pointer' : ''
    }`;

    switch (finalProgressConfig.type) {
      case 'linear':
        return (
          <div className={`progress-container ${finalProgressConfig.position}`}>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: finalProgressConfig.animated ? 0.3 : 0 }}
              />
            </div>
            {finalProgressConfig.showNumbers && (
              <span className="text-sm text-gray-600 ml-2">
                {currentStep} / {totalSlides}
              </span>
            )}
          </div>
        );

      case 'circular':
        return (
          <div className="progress-circular">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-gray-200"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={175.93}
                strokeDashoffset={175.93 - (175.93 * progress) / 100}
                className="text-blue-600"
                transition={{ duration: finalProgressConfig.animated ? 0.3 : 0 }}
              />
            </svg>
            {finalProgressConfig.showNumbers && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{currentStep}</span>
              </div>
            )}
          </div>
        );

      case 'dots':
        return (
          <div className="progress-dots flex space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                } ${baseClasses}`}
                onClick={() => finalProgressConfig.clickable && goToSlide(index)}
                aria-label={`スライド ${index + 1} に移動`}
              />
            ))}
          </div>
        );

      case 'thumbnails':
        return (
          <div className="progress-thumbnails flex space-x-2 overflow-x-auto">
            {children.map((child, index) => (
              <button
                key={index}
                className={`flex-shrink-0 w-16 h-12 border-2 rounded transition-all duration-200 ${
                  index === currentIndex ? 'border-blue-600' : 'border-gray-300'
                } ${baseClasses}`}
                onClick={() => finalProgressConfig.clickable && goToSlide(index)}
                aria-label={`スライド ${index + 1} に移動`}
              >
                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-xs">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Control panel component
  const ControlPanel = () => (
    <div className="control-panel flex items-center space-x-2 p-2 bg-white/90 backdrop-blur rounded-lg shadow-lg">
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="前のスライド"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="p-2 rounded hover:bg-gray-100"
        aria-label={isAutoPlaying ? '自動再生を停止' : '自動再生を開始'}
      >
        {isAutoPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      <button
        onClick={() => goToSlide(0)}
        className="p-2 rounded hover:bg-gray-100"
        aria-label="最初のスライドに戻る"
      >
        <RotateCcw size={20} />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentIndex === totalSlides - 1}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="次のスライド"
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="p-2 rounded hover:bg-gray-100"
        aria-label="設定を開く"
      >
        <Settings size={20} />
      </button>

      {finalProgressConfig.showTime && (
        <div className="text-sm text-gray-600 px-2">
          {Math.floor(currentIndex * finalAutoPlayConfig.interval / 1000)}s
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`slide-transitions-container relative overflow-hidden ${className || ''}`}
      role="region"
      aria-label="スライドプレゼンテーション"
      aria-live="polite"
      tabIndex={0}
    >
      <div className="relative w-full h-full">
        <AnimatePresence
          mode="wait"
          onExitComplete={handleTransitionEnd}
        >
          <motion.div
            key={currentIndex}
            {...createTransitionVariants(getEffectiveTransitionConfig, 'enter', currentIndex)}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: finalPerformanceConfig.enableGPU ? 'transform, opacity' : 'auto',
            }}
          >
            {children[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      <div className={`progress-wrapper absolute ${
        finalProgressConfig.position === 'top' ? 'top-4' :
        finalProgressConfig.position === 'bottom' ? 'bottom-4' :
        finalProgressConfig.position === 'left' ? 'left-4 top-1/2 -translate-y-1/2' :
        'right-4 top-1/2 -translate-y-1/2'
      } ${
        finalProgressConfig.position === 'left' || finalProgressConfig.position === 'right'
          ? '' : 'left-1/2 -translate-x-1/2'
      }`}>
        <ProgressIndicator />
      </div>

      {/* Control panel */}
      <div className="absolute bottom-4 right-4">
        <ControlPanel />
      </div>

      {/* Settings panel */}
      {settingsOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50"
        >
          <h3 className="font-medium mb-3">設定</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAutoPlaying}
                onChange={(e) => setIsAutoPlaying(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">自動再生</span>
            </label>
            <label className="block text-sm">
              パフォーマンス:
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                className="mt-1 block w-full rounded border-gray-300"
              >
                <option value="auto">自動</option>
                <option value="high">高品質</option>
                <option value="low">軽量</option>
              </select>
            </label>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SlideTransitions;