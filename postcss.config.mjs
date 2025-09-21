import * as culori from 'culori';

// Custom PostCSS plugin to convert oklch/oklab to rgb
const oklchToRgbPlugin = {
  postcssPlugin: 'oklch-to-rgb',
  Declaration(decl) {
    if (!/\boklch\(|\boklab\(|\bcolor\(/i.test(decl.value)) return;

    const toRgb = culori.converter('rgb');
    decl.value = decl.value.replace(/\b(oklch|oklab|color)\s*\([^)]*\)/gi, (m) => {
      try {
        const c = toRgb(culori.parse(m));
        if (!c) return m;
        const a = c.alpha == null ? 1 : c.alpha;
        const r = Math.round((c.r ?? 0) * 255);
        const g = Math.round((c.g ?? 0) * 255);
        const b = Math.round((c.b ?? 0) * 255);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      } catch {
        return m;
      }
    });
  }
};
oklchToRgbPlugin.postcss = true;

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    ...(process.env.NODE_ENV === 'production' ? { 'oklch-to-rgb': oklchToRgbPlugin } : {})
  },
};

export default config;
