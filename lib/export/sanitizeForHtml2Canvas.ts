import { replaceAdvancedColors, toRgbString } from './normalizeColors';

const COLOR_PROPS = [
  'color', 'backgroundColor',
  'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
  'outlineColor', 'textDecorationColor', 'columnRuleColor'
];

function normalizeStyle(el: HTMLElement, cs: CSSStyleDeclaration) {
  // 単色系
  for (const p of COLOR_PROPS) {
    const v = cs.getPropertyValue(p as any) || (cs as any)[p];
    if (v && /oklch|oklab|lch|lab|color\(/i.test(v)) {
      (el.style as any)[p] = toRgbString(v);
    }
  }
  // 影など複合（複数色を含みうる）
  const shadow = cs.getPropertyValue('box-shadow');
  if (shadow && /oklch|oklab|lch|lab|color\(/i.test(shadow)) {
    el.style.boxShadow = replaceAdvancedColors(shadow);
  }
  // SVG fill/stroke
  const fill = cs.getPropertyValue('fill');
  if (fill && /oklch|oklab|lch|lab|color\(/i.test(fill)) {
    (el as any).style.fill = toRgbString(fill);
  }
  const stroke = cs.getPropertyValue('stroke');
  if (stroke && /oklch|oklab|lch|lab|color\(/i.test(stroke)) {
    (el as any).style.stroke = toRgbString(stroke);
  }
}

export function sanitizeTreeForExport(root: HTMLElement) {
  // 計算値で正規化（oklch が rgb に解決されるブラウザでも安全に反映）
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  do {
    const el = walker.currentNode as HTMLElement;
    if (!el) break;
    const cs = getComputedStyle(el);
    normalizeStyle(el, cs);
  } while (walker.nextNode());
}