'use client';

import React, { useState } from 'react';

interface SimpleSaveButtonProps {
  className?: string;
  id?: string;
}

export default function SimpleSaveButton({ className = '', id }: SimpleSaveButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleSave = async () => {
    if (busy) return;

    try {
      setBusy(true);

      // ブラウザの印刷機能を使用（PDFとして保存可能）
      window.print();

    } catch (error) {
      console.error('保存エラー:', error);
      alert('保存に失敗しました');
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
      title="印刷画面を開きます（PDFとして保存可能）"
    >
      {busy ? '処理中...' : '保存'}
    </button>
  );
}