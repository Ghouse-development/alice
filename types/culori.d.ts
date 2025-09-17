declare module 'culori' {
  export function parse(color: string): any;
  export function converter(mode: string): (color: any) => any;
  export const formatHex: (color: any) => string;
  export const formatRgb: (color: any) => string;
}
