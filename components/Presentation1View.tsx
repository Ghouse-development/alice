'use client';

import { useEffect, useState } from 'react';
import { FileText, File, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { Presentation1 } from '@/types';
import { A3PrintContainer, A3Section } from './A3PrintContainer';

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定 - 96dpi基準
  dimensions: {
    width: '1587px', // 420mm at 96dpi
    height: '1123px', // 297mm at 96dpi
    aspectRatio: '1.414',
  },
  // CROWN カラーパレット
  colors: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#c41e3a',  // CROWN レッド
    gold: '#b8860b',    // CROWN ゴールド
    platinum: '#e5e4e2', // プラチナシルバー
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      accent: '#c41e3a'
    },
    gradients: {
      black: 'bg-gradient-to-b from-gray-900 via-black to-gray-900',
      premium: 'bg-gradient-to-r from-black via-gray-900 to-black',
      accent: 'bg-gradient-to-br from-red-900/10 to-red-800/5'
    }
  },
  // CROWN タイポグラフィ
  typography: {
    heading: 'font-bold tracking-[0.15em] uppercase',
    subheading: 'font-light tracking-[0.1em]',
    body: 'font-light tracking-wide',
    accent: 'font-medium tracking-[0.2em] uppercase',
    japanese: 'font-medium'
  }
};

interface Presentation1ViewProps {
  projectId?: string;
  currentFileIndex?: number;
}

export function Presentation1View({ currentFileIndex }: Presentation1ViewProps) {
  const { currentProject, theme } = useStore();
  const [presentation, setPresentation] = useState<Presentation1 | null>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (currentProject?.presentation1) {
      setPresentation(currentProject.presentation1);
    }
  }, [currentProject]);

  if (!presentation || !presentation.uploadedFiles || presentation.uploadedFiles.length === 0) {
    return (
      <A3PrintContainer
        title="G-HOUSE デザイン"
        subtitle="プレゼンテーション資料"
        footer="G-HOUSE PRESENTATION SYSTEM"
        className={isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}
      >
        <A3Section className="a3-flex-center">
          <div className="text-center">
            <FileText className={`h-24 w-24 mx-auto mb-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`a3-text-large ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>プレゼンテーション資料が</p>
            <p className={`a3-text-large ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>アップロードされていません</p>
            <p className={`a3-text-normal mt-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              編集モードでPDFまたはPowerPointファイルを
            </p>
            <p className={`a3-text-normal ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              アップロードしてください
            </p>
          </div>
        </A3Section>
      </A3PrintContainer>
    );
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="h-12 w-12" style={{ color: CROWN_DESIGN.colors.accent }} />;
    }
    return <File className="h-12 w-12" style={{ color: CROWN_DESIGN.colors.gold }} />;
  };

  return (
    <A3PrintContainer
      title="G-HOUSE デザイン"
      subtitle="プレゼンテーション資料"
      footer="G-HOUSE PRESENTATION SYSTEM"
      className="bg-black text-white"
    >
      <div className="a3-constrain">
        {/* currentFileIndexが指定されている場合は、そのファイルのみを表示 */}
        {(currentFileIndex !== undefined
          ? [presentation.uploadedFiles[currentFileIndex]].filter(Boolean)
          : presentation.uploadedFiles
        ).map((file) => (
          <A3Section
            key={file.id}
            title={file.name}
            className={`a3-card ${isDark ? 'bg-gradient-to-b from-gray-900/80 to-gray-900/40' : 'bg-white/90'}`}
          >
            <div className="a3-flex-between">
              <div className="a3-flex" style={{ gap: '24px', alignItems: 'center' }}>
                <div style={{ transform: 'scale(1.5)' }}>
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className={`a3-text-normal mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatFileSize(file.size)} • {(file as any).type === 'application/pdf' ? 'PDF' : 'PowerPoint'}
                    {file.uploadedAt && ` • アップロード日: ${new Date(file.uploadedAt).toLocaleDateString('ja-JP')}`}
                  </p>
                </div>
              </div>
              <div className="a3-flex" style={{ gap: '16px' }}>
                {(file as any).type === 'application/pdf' && (
                  <Button
                    variant="outline"
                    size="lg"
                    className={`no-print px-6 py-4 a3-text-normal ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    閲覧
                  </Button>
                )}
                <Button
                  variant="default"
                  size="lg"
                  className="no-print px-6 py-4 a3-text-normal bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = file.url;
                    a.download = file.name;
                    a.click();
                  }}
                >
                  <Download className="mr-2 h-5 w-5" />
                  ダウンロード
                </Button>
              </div>
            </div>
          </A3Section>
        ))}
      </div>
    </A3PrintContainer>
  );
}