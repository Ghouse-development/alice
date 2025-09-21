'use client';

import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import PresentationPDF from '@/components/PresentationPDF';
import PresentationPDFSlides from '@/components/PresentationPDFSlides';
import ComprehensivePresentationPDF from '@/components/ComprehensivePresentationPDF';
import { ensurePdfFont } from '@/lib/pdf-font';

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
  id?: string;
}

export default function SaveButton({ data, className = '', id }: SaveButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (busy) return;

    try {
      setBusy(true);

      // データチェック
      if (!data || (Array.isArray(data) && data.length === 0)) {
        alert('保存できるプレゼン資料がありません。');
        return;
      }

      // フォント事前登録（必須）
      try {
        console.log('Starting font registration...');
        await ensurePdfFont();
        console.log('日本語フォント登録成功');
      } catch (fontError: any) {
        console.error('[Font Registration Error]', fontError);

        // フォントエラーは既にensurePdfFont内でユーザーにアラート済み
        // ここでは開発者向けの詳細ログのみ
        console.error('Font registration failed with details:', {
          error: fontError,
          stack: fontError?.stack,
          currentUrl: typeof window !== 'undefined' ? window.location.href : 'unknown'
        });

        setBusy(false);
        return;
      }

      // PDF生成（30秒タイムアウト付き）
      // present-flowの場合は包括的PDFを使用
      console.log('Generating PDF...');
      const isSlideMode = window.location.pathname.includes('present-flow');
      const PDFComponent = isSlideMode ? <ComprehensivePresentationPDF /> : <PresentationPDF data={data} />;
      const blob = await withTimeout(pdf(PDFComponent).toBlob(), 30000);

      // ダウンロード実行
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `g-house-presentation-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      console.log('PDF download started successfully');
    } catch (e: any) {
      console.error('[PDF SAVE ERROR]', e);
      console.error('PDF generation error details:', {
        error: e,
        stack: e?.stack,
        data: typeof data === 'object' ? JSON.stringify(data, null, 2).substring(0, 1000) + '...' : String(data),
        timestamp: new Date().toISOString()
      });

      let errorMessage = 'PDFの保存に失敗しました。\n\n';

      if (e.message?.includes('タイムアウト')) {
        errorMessage += e.message + '\n\nデータ量を減らして再度お試しください。';
      } else if (e.message?.includes('font') || e.message?.includes('Font')) {
        errorMessage += 'フォント関連のエラーが発生しました。\n\n';
        errorMessage += '考えられる原因：\n';
        errorMessage += '• フォントファイルが見つからない\n';
        errorMessage += '• フォントファイルの形式が対応していない\n';
        errorMessage += '• サーバーへのアクセスに失敗\n\n';
        errorMessage += `詳細: ${e.message}`;
      } else if (e.message?.includes('network') || e.message?.includes('fetch')) {
        errorMessage += 'ネットワークエラーが発生しました。\n\n';
        errorMessage += 'インターネット接続を確認して再度お試しください。\n\n';
        errorMessage += `詳細: ${e.message}`;
      } else {
        errorMessage += `エラーの詳細: ${e?.message || String(e)}`;
      }

      alert(errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      id={id}
      onClick={handleSave}
      disabled={busy}
      className={
        className ||
        `px-4 py-2 rounded-md text-white shadow transition-colors ${
          busy ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`
      }
      title={busy ? 'PDF生成中です。しばらくお待ちください...' : 'プレゼンテーションをPDFで保存'}
    >
      {busy ? 'PDFを生成中…' : '保存'}
    </button>
  );
}
