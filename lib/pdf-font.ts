// lib/pdf-font.ts
import { Font } from "@react-pdf/renderer";

let registered = false;

function detectFontFormat(ab: ArrayBuffer): "ttf" | "otf" | "woff" | "woff2" | "ttc" | "unknown" {
  const bytes = new Uint8Array(ab).subarray(0, 4);
  const sig = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
  if (bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00) return "ttf"; // TrueType
  if (sig === "OTTO") return "otf";   // CFF/Type1 (静的OTF)
  if (sig === "wOFF") return "woff";
  if (sig === "wOF2") return "woff2";
  if (sig === "ttcf") return "ttc";   // TrueType Collection
  return "unknown";
}

/**
 * public/fonts/NotoSansJP-Regular.ttf を ArrayBuffer で取得して
 * @react-pdf/renderer に1回だけ登録する。
 */
export async function ensurePdfFont(opts?: {
  url?: string;           // 既定: "/fonts/NotoSansJP-Regular.ttf"
  family?: string;        // 既定: "NotoSansJP"
}) {
  if (registered) return;
  const url = opts?.url ?? "/fonts/NotoSansJP-Regular.ttf";
  const family = opts?.family ?? "NotoSansJP";

  try {
    // HEAD で存在チェック
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (!head.ok) throw new Error(`Font not found: ${url} -> ${head.status}`);

    // 本体取得
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Font fetch failed: ${url} -> ${res.status}`);
    const ab = await res.arrayBuffer();

    // フォーマット判定（TTF/OTF 以外は拒否）
    const fmt = detectFontFormat(ab);
    if (fmt !== "ttf" && fmt !== "otf") {
      throw new Error(`Unsupported font format "${fmt}". Use static TTF/OTF. (${url})`);
    }

    console.log(`Font format detected: ${fmt} for ${url}`);

    // バッファ登録（Uint8Array を渡す）
    Font.register({
      family,
      src: new Uint8Array(ab),
    });

    registered = true;
    console.log(`Font "${family}" successfully registered from ${url}`);
  } catch (error) {
    console.error(`Failed to register font: ${error}`);
    throw error;
  }
}