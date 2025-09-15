export const themes = {
  light: {
    // 背景色
    background: {
      primary: 'bg-gray-50',
      secondary: 'bg-white',
      accent: 'bg-gray-100',
      overlay: 'bg-white/95',
      gradient: 'bg-gradient-to-br from-gray-50 via-white to-gray-50',
      pattern: 'from-gray-100 via-white to-gray-100'
    },
    // テキスト色
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
      accent: 'text-red-600',
      inverse: 'text-white'
    },
    // ボーダー色
    border: {
      primary: 'border-gray-300',
      secondary: 'border-gray-200',
      accent: 'border-red-600'
    },
    // ヘッダー背景
    header: {
      background: 'bg-gradient-to-r from-white via-gray-50 to-white',
      border: 'border-gray-200'
    },
    // カード背景
    card: {
      background: 'bg-white',
      hover: 'hover:bg-gray-50',
      shadow: 'shadow-md'
    },
    // グラフ色
    chart: {
      colors: ['#EF4444', '#3B82F6', '#10B981'], // 赤、青、緑
      grid: 'stroke-gray-200'
    }
  },
  dark: {
    // 背景色
    background: {
      primary: 'bg-black',
      secondary: 'bg-gray-900',
      accent: 'bg-gray-800',
      overlay: 'bg-gray-900/95',
      gradient: 'bg-gradient-to-br from-black via-gray-950 to-black',
      pattern: 'from-gray-900 via-black to-gray-900'
    },
    // テキスト色
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-500',
      accent: 'text-red-500',
      inverse: 'text-black'
    },
    // ボーダー色
    border: {
      primary: 'border-gray-700',
      secondary: 'border-gray-800',
      accent: 'border-red-600'
    },
    // ヘッダー背景
    header: {
      background: 'bg-gradient-to-r from-black via-gray-900 to-black',
      border: 'border-red-900/30'
    },
    // カード背景
    card: {
      background: 'bg-gray-900/50',
      hover: 'hover:bg-gray-800/50',
      shadow: 'shadow-2xl'
    },
    // グラフ色
    chart: {
      colors: ['#EF4444', '#60A5FA', '#34D399'], // 明るめの赤、青、緑
      grid: 'stroke-gray-700'
    }
  }
};

export const getTheme = (theme: 'light' | 'dark') => themes[theme];