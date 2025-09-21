'use client';

import React, { useState } from 'react';
import { captureAllSlidesAndExportPDF } from '@/lib/visual-pdf-export';

interface VisualSaveButtonProps {
  className?: string;
  id?: string;
}

export default function VisualSaveButton({ className = '', id }: VisualSaveButtonProps) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleSave = async () => {
    if (busy) return;

    try {
      setBusy(true);
      setProgress({ current: 0, total: 0 });

      // 全スライドをキャプチャしてPDF生成
      await captureAllSlidesAndExportPDF((current, total) => {
        setProgress({ current, total });
      });

      console.log('Visual PDF saved successfully');
    } catch (error) {
      console.error('Visual PDF save error:', error);
      alert('PDFの保存に失敗しました。もう一度お試しください。');
    } finally {
      setBusy(false);
      setProgress({ current: 0, total: 0 });
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
      title={busy ? 'PDF生成中です...' : 'スライドをPDFで保存'}
    >
      {busy ? (
        <>
          PDFを生成中...
          {progress.total > 0 && (
            <span className="ml-2">
              ({progress.current}/{progress.total})
            </span>
          )}
        </>
      ) : (
        '保存'
      )}
    </button>
  );
}