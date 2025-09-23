import { useEffect, useRef, useCallback, useState } from 'react';
import { useStore } from '@/lib/store';

// Keyboard navigation configuration
export interface KeyboardConfig {
  enableArrowKeys: boolean;
  enableTabNavigation: boolean;
  enableEscapeKey: boolean;
  enableSpaceKey: boolean;
  enableEnterKey: boolean;
  customKeyBindings: Record<string, () => void>;
}

// Focus management configuration
export interface FocusConfig {
  autoFocus: boolean;
  focusOnMount: boolean;
  restoreFocusOnUnmount: boolean;
  focusTrapEnabled: boolean;
  skipElements: string[]; // CSS selectors to skip
}

// Screen reader configuration
export interface ScreenReaderConfig {
  announceChanges: boolean;
  announceProgress: boolean;
  announceErrors: boolean;
  liveRegionPolite: boolean;
  customAnnouncements: Record<string, string>;
}

// High contrast mode configuration
export interface ContrastConfig {
  enableToggle: boolean;
  autoDetect: boolean;
  customColors: {
    background: string;
    foreground: string;
    accent: string;
    border: string;
  };
}

// Animation preferences
export interface AnimationConfig {
  respectReducedMotion: boolean;
  allowCustomSpeed: boolean;
  disableAutoPlay: boolean;
  pauseOnFocus: boolean;
}

// Main accessibility configuration
export interface AccessibilityConfig {
  keyboard: KeyboardConfig;
  focus: FocusConfig;
  screenReader: ScreenReaderConfig;
  contrast: ContrastConfig;
  animation: AnimationConfig;
}

// Accessibility state
export interface AccessibilityState {
  isHighContrast: boolean;
  isReducedMotion: boolean;
  isFocusVisible: boolean;
  isScreenReaderActive: boolean;
  currentFocusedElement: HTMLElement | null;
  announcements: string[];
  keyboardMode: boolean;
}

// Default configuration
const defaultConfig: AccessibilityConfig = {
  keyboard: {
    enableArrowKeys: true,
    enableTabNavigation: true,
    enableEscapeKey: true,
    enableSpaceKey: true,
    enableEnterKey: true,
    customKeyBindings: {},
  },
  focus: {
    autoFocus: false,
    focusOnMount: false,
    restoreFocusOnUnmount: true,
    focusTrapEnabled: false,
    skipElements: ['[data-skip-focus]', '.sr-only'],
  },
  screenReader: {
    announceChanges: true,
    announceProgress: true,
    announceErrors: true,
    liveRegionPolite: true,
    customAnnouncements: {},
  },
  contrast: {
    enableToggle: true,
    autoDetect: true,
    customColors: {
      background: '#000000',
      foreground: '#ffffff',
      accent: '#ffff00',
      border: '#ffffff',
    },
  },
  animation: {
    respectReducedMotion: true,
    allowCustomSpeed: false,
    disableAutoPlay: false,
    pauseOnFocus: true,
  },
};

export const useAccessibility = (config: Partial<AccessibilityConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const { currentStep, setCurrentStep, isPresentationMode } = useStore();

  // State management
  const [state, setState] = useState<AccessibilityState>({
    isHighContrast: false,
    isReducedMotion: false,
    isFocusVisible: false,
    isScreenReaderActive: false,
    currentFocusedElement: null,
    announcements: [],
    keyboardMode: false,
  });

  // Refs for focus management
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusTrapRef = useRef<HTMLElement | null>(null);
  const liveRegionRef = useRef<HTMLElement | null>(null);

  // Detect system preferences
  const detectSystemPreferences = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check for high contrast preference
    const prefersHighContrast =
      window.matchMedia('(prefers-contrast: high)').matches ||
      window.matchMedia('(-ms-high-contrast: active)').matches;

    // Detect screen reader (heuristic)
    const isScreenReaderActive =
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      'speechSynthesis' in window;

    setState(prev => ({
      ...prev,
      isReducedMotion: prefersReducedMotion,
      isHighContrast: prefersHighContrast,
      isScreenReaderActive,
    }));
  }, []);

  // Create live region for announcements
  const createLiveRegion = useCallback(() => {
    if (typeof document === 'undefined') return;

    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', finalConfig.screenReader.liveRegionPolite ? 'polite' : 'assertive');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(liveRegion);
    }
    liveRegionRef.current = liveRegion;
  }, [finalConfig.screenReader.liveRegionPolite]);

  // Announce to screen readers
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!finalConfig.screenReader.announceChanges || !liveRegionRef.current) return;

    // Use custom announcement if available
    const customMessage = finalConfig.screenReader.customAnnouncements[message] || message;

    setState(prev => ({
      ...prev,
      announcements: [...prev.announcements.slice(-4), customMessage], // Keep last 5 announcements
    }));

    // Update live region
    liveRegionRef.current.setAttribute('aria-live', priority);
    liveRegionRef.current.textContent = customMessage;

    // Clear after a delay to allow for new announcements
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = '';
      }
    }, 1000);
  }, [finalConfig.screenReader.announceChanges, finalConfig.screenReader.customAnnouncements]);

  // Focus management
  const focusElement = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    setState(prev => ({ ...prev, currentFocusedElement: element }));
    element.focus();

    if (finalConfig.screenReader.announceChanges) {
      const label = element.getAttribute('aria-label') ||
                   element.getAttribute('title') ||
                   element.textContent ||
                   'フォーカスが移動しました';
      announce(label);
    }
  }, [announce, finalConfig.screenReader.announceChanges]);

  // Get focusable elements
  const getFocusableElements = useCallback((container: HTMLElement = document.body): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ];

    const skipSelectors = finalConfig.focus.skipElements.join(', ');
    const elements = container.querySelectorAll(focusableSelectors.join(', '));

    return Array.from(elements).filter((el): el is HTMLElement => {
      if (skipSelectors && el.matches(skipSelectors)) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }, [finalConfig.focus.skipElements]);

  // Navigate to next/previous focusable element
  const navigateFocus = useCallback((direction: 'next' | 'previous') => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    let nextIndex: number;

    if (direction === 'next') {
      nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
    }

    focusElement(focusableElements[nextIndex]);
  }, [getFocusableElements, focusElement]);

  // Slide navigation functions
  const navigateToSlide = useCallback((slideNumber: number) => {
    if (slideNumber >= 1 && slideNumber <= 6) {
      setCurrentStep(slideNumber as any);
      announce(`スライド ${slideNumber} に移動しました`);
    }
  }, [setCurrentStep, announce]);

  const nextSlide = useCallback(() => {
    if (currentStep < 6) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep as any);
      announce(`次のスライド: スライド ${nextStep}`);
    } else {
      announce('最後のスライドです');
    }
  }, [currentStep, setCurrentStep, announce]);

  const previousSlide = useCallback(() => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep as any);
      announce(`前のスライド: スライド ${prevStep}`);
    } else {
      announce('最初のスライドです');
    }
  }, [currentStep, setCurrentStep, announce]);

  // Keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, altKey, shiftKey } = event;

    // Mark as keyboard mode
    setState(prev => ({ ...prev, keyboardMode: true }));

    // Handle escape key
    if (key === 'Escape' && finalConfig.keyboard.enableEscapeKey) {
      if (isPresentationMode) {
        // Exit presentation mode or close modals
        announce('プレゼンテーションモードを終了');
      }
      return;
    }

    // Handle custom key bindings
    const binding = finalConfig.keyboard.customKeyBindings[key];
    if (binding) {
      event.preventDefault();
      binding();
      return;
    }

    // Handle arrow keys for slide navigation
    if (finalConfig.keyboard.enableArrowKeys && isPresentationMode) {
      switch (key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          previousSlide();
          break;
      }
    }

    // Handle number keys for direct slide navigation
    if (isPresentationMode && /^[1-6]$/.test(key)) {
      event.preventDefault();
      navigateToSlide(parseInt(key));
    }

    // Handle space and enter for interactions
    if ((key === ' ' && finalConfig.keyboard.enableSpaceKey) ||
        (key === 'Enter' && finalConfig.keyboard.enableEnterKey)) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
        // Let the default behavior handle it
        return;
      }
      if (isPresentationMode) {
        event.preventDefault();
        nextSlide();
      }
    }

    // Handle Tab navigation with custom logic
    if (key === 'Tab' && finalConfig.keyboard.enableTabNavigation) {
      // Custom tab handling can be implemented here
      if (finalConfig.focus.focusTrapEnabled && focusTrapRef.current) {
        const focusableElements = getFocusableElements(focusTrapRef.current);
        if (focusableElements.length > 0) {
          event.preventDefault();
          navigateFocus(shiftKey ? 'previous' : 'next');
        }
      }
    }
  }, [
    finalConfig.keyboard,
    finalConfig.focus.focusTrapEnabled,
    isPresentationMode,
    nextSlide,
    previousSlide,
    navigateToSlide,
    announce,
    getFocusableElements,
    navigateFocus
  ]);

  // Mouse event handler to detect non-keyboard interaction
  const handleMouseDown = useCallback(() => {
    setState(prev => ({ ...prev, keyboardMode: false }));
  }, []);

  // Focus event handler
  const handleFocus = useCallback((event: FocusEvent) => {
    setState(prev => ({
      ...prev,
      currentFocusedElement: event.target as HTMLElement,
      isFocusVisible: prev.keyboardMode,
    }));
  }, []);

  // High contrast toggle
  const toggleHighContrast = useCallback(() => {
    setState(prev => ({ ...prev, isHighContrast: !prev.isHighContrast }));
    announce(state.isHighContrast ? 'ハイコントラストモードを無効にしました' : 'ハイコントラストモードを有効にしました');
  }, [state.isHighContrast, announce]);

  // Apply high contrast styles
  const applyHighContrastStyles = useCallback(() => {
    if (typeof document === 'undefined') return;

    const styleId = 'accessibility-high-contrast';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (state.isHighContrast) {
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      const { background, foreground, accent, border } = finalConfig.contrast.customColors;
      styleElement.textContent = `
        .high-contrast,
        .high-contrast * {
          background: ${background} !important;
          color: ${foreground} !important;
          border-color: ${border} !important;
        }
        .high-contrast a,
        .high-contrast button,
        .high-contrast [role="button"] {
          color: ${accent} !important;
          text-decoration: underline !important;
        }
        .high-contrast img {
          filter: contrast(150%) brightness(150%) !important;
        }
      `;

      document.body.classList.add('high-contrast');
    } else {
      if (styleElement) {
        styleElement.remove();
      }
      document.body.classList.remove('high-contrast');
    }
  }, [state.isHighContrast, finalConfig.contrast.customColors]);

  // Setup event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    detectSystemPreferences();
    createLiveRegion();

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('focus', handleFocus, true);

    // Media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isReducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      if (finalConfig.contrast.autoDetect) {
        setState(prev => ({ ...prev, isHighContrast: e.matches }));
      }
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Store previous focus if configured
    if (finalConfig.focus.restoreFocusOnUnmount) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('focus', handleFocus, true);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);

      // Restore focus if configured
      if (finalConfig.focus.restoreFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [
    detectSystemPreferences,
    createLiveRegion,
    handleKeyDown,
    handleMouseDown,
    handleFocus,
    finalConfig.focus.restoreFocusOnUnmount,
    finalConfig.contrast.autoDetect
  ]);

  // Apply high contrast styles when state changes
  useEffect(() => {
    applyHighContrastStyles();
  }, [applyHighContrastStyles]);

  // Focus on mount if configured
  useEffect(() => {
    if (finalConfig.focus.focusOnMount && finalConfig.focus.autoFocus) {
      const firstFocusableElement = getFocusableElements()[0];
      if (firstFocusableElement) {
        focusElement(firstFocusableElement);
      }
    }
  }, [finalConfig.focus.focusOnMount, finalConfig.focus.autoFocus, getFocusableElements, focusElement]);

  // ARIA attributes helper
  const getAriaAttributes = useCallback((elementType: 'slide' | 'button' | 'navigation' | 'content') => {
    const baseAttributes: Record<string, string> = {};

    switch (elementType) {
      case 'slide':
        return {
          ...baseAttributes,
          'aria-label': `スライド ${currentStep} / 6`,
          role: 'region',
          'aria-live': 'polite',
        };
      case 'button':
        return {
          ...baseAttributes,
          'aria-describedby': state.keyboardMode ? 'keyboard-hint' : undefined,
        };
      case 'navigation':
        return {
          ...baseAttributes,
          role: 'navigation',
          'aria-label': 'スライドナビゲーション',
        };
      case 'content':
        return {
          ...baseAttributes,
          role: 'main',
          'aria-label': 'プレゼンテーション内容',
        };
      default:
        return baseAttributes;
    }
  }, [currentStep, state.keyboardMode]);

  // Return the hook interface
  return {
    // State
    state,

    // Navigation functions
    nextSlide,
    previousSlide,
    navigateToSlide,

    // Focus management
    focusElement,
    navigateFocus,
    getFocusableElements,

    // Accessibility features
    announce,
    toggleHighContrast,

    // ARIA helpers
    getAriaAttributes,

    // Refs for advanced usage
    focusTrapRef,
    liveRegionRef,

    // Configuration
    config: finalConfig,

    // Utility functions
    utils: {
      isReducedMotionPreferred: () => state.isReducedMotion,
      shouldDisableAnimations: () => state.isReducedMotion && finalConfig.animation.respectReducedMotion,
      isScreenReaderActive: () => state.isScreenReaderActive,
      isKeyboardUser: () => state.keyboardMode,
      getCurrentSlideInfo: () => ({
        current: currentStep,
        total: 6,
        isFirst: currentStep === 1,
        isLast: currentStep === 6,
      }),
    },
  };
};

export default useAccessibility;