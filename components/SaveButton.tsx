"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import PresentationPDF from "@/components/PresentationPDF";
import { ensurePdfFont } from "@/lib/pdf-font";

// タイムアウトラッパ
function withTimeout<T>(p: Promise<T>, ms = 30000) {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`PDF生成が${ms / 1000}秒でタイムアウトしました`)), ms)
    ),
  ]) as Promise<T>;
}

interface SaveButtonProps {
  data: any;
  className?: string;
}

export default function SaveButton({ data, className = "" }: SaveButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (busy) return;

    try {
      setBusy(true);

      // データチェック
      if (!data || (Array.isArray(data) && data.length === 0)) {
        alert("保存できるプレゼン資料がありません。");
        return;
      }

      // フォント事前登録（エラーでも継続）
      try {
        await ensurePdfFont();
        console.log("Font registered successfully");
      } catch (fontError: any) {
        console.error("[Font Registration Error]", fontError);
        // フォント登録失敗でも英字のみでPDF生成を試みる
        const proceed = confirm(
          "日本語フォントの読み込みに失敗しました。\n" +
          "英字のみでPDFを生成しますか？\n\n" +
          `エラー: ${fontError?.message || fontError}`
        );
        if (!proceed) {
          setBusy(false);
          return;
        }
      }

      // PDF生成（30秒タイムアウト付き）
      console.log("Generating PDF...");
      const blob = await withTimeout(
        pdf(<PresentationPDF data={data} />).toBlob(),
        30000
      );

      // ダウンロード実行
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `g-house-presentation-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      console.log("PDF download started successfully");

    } catch (e: any) {
      console.error("[PDF SAVE ERROR]", e);

      let errorMessage = "PDFの保存に失敗しました。\n";

      if (e.message?.includes("タイムアウト")) {
        errorMessage += e.message + "\nデータ量を減らして再度お試しください。";
      } else if (e.message?.includes("font")) {
        errorMessage += "フォント関連のエラーが発生しました。\n" + e.message;
      } else {
        errorMessage += `理由: ${e?.message || String(e)}`;
      }

      alert(errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={busy}
      className={
        className ||
        `px-4 py-2 rounded-md text-white shadow transition-colors ${
          busy ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`
      }
    >
      {busy ? "PDFを生成中…" : "保存"}
    </button>
  );
}