// すべての色表記を sRGB の rgba() に変換して返す
import { parse, converter } from 'culori';

const toRgb = converter('rgb');
const COLOR_FUNC_RE = /\b(oklch|oklab|lch|lab|color)\s*\([^)]*\)/gi;

export function toRgbString(input: string): string {
  try {
    const c = toRgb(parse(input));
    if (!c) return input;
    const a = c.alpha == null ? 1 : c.alpha;
    const r = Math.round((c.r ?? 0) * 255);
    const g = Math.round((c.g ?? 0) * 255);
    const b = Math.round((c.b ?? 0) * 255);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } catch {
    return input;
  }
}

export function replaceAdvancedColors(s: string): string {
  return s.replace(COLOR_FUNC_RE, (m) => toRgbString(m));
}