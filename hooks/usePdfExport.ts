'use client';

import { useState } from 'react';
import { exportNodeToPdf } from '@/lib/export/exportToPdf';

interface UsePdfExportOptions {
  filename?: string;
  page?: { widthMm: number; heightMm: number };
  scale?: number;
}

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPdf = async (
    elementId: string,
    options: UsePdfExportOptions = {}
  ) => {
    setIsExporting(true);
    setError(null);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
      }

      const blob = await exportNodeToPdf(element as HTMLElement, {
        filename: options.filename || 'presentation.pdf',
        page: options.page || { widthMm: 420, heightMm: 297 }, // A3横
        scale: options.scale || 2,
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename || 'presentation.pdf';
      a.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PDF export failed';
      setError(message);
      console.error('PDF export failed:', err);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting,
    error,
  };
}