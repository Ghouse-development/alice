'use client';

import { useEffect, useState } from 'react';
import { FileText, File, Download, Eye, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { Presentation1 } from '@/types';

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定 - PresentationContainerと統一
  dimensions: {
    width: '1190px', // A3横の基準幅(px)
    height: '842px',  // A3横の基準高さ(px)
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
  projectId: string;
  currentFileIndex?: number;
}

export function Presentation1View({ projectId, currentFileIndex }: Presentation1ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation1 | null>(null);

  useEffect(() => {
    if (currentProject?.presentation1) {
      setPresentation(currentProject.presentation1);
    }
  }, [currentProject]);

  if (!presentation || !presentation.uploadedFiles || presentation.uploadedFiles.length === 0) {
    return (
      <div
        className="relative bg-black text-white overflow-hidden"
        style={{
          width: '1190px',
          height: '842px',
          maxWidth: '100%',
          maxHeight: '100%',
          margin: '0 auto',
          aspectRatio: '1.414 / 1',
          transformOrigin: 'center center'
        }}
      >
        {/* 背景パターン */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
                repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
              `,
            }} />
          </div>
        </div>

        {/* ヘッダー */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-900/30">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase border-b-2 border-red-600 pb-1">
                  デザイン
                </span>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase block">Feature</span>
                  <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                    01
                  </span>
                </div>
                <div className="text-5xl font-thin text-red-900/50">/</div>
                <span className="text-2xl font-light text-gray-600">05</span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="relative flex items-center justify-center h-[calc(100%-168px)]">
          <div className="text-center">
            <FileText className="h-24 w-24 text-gray-600 mx-auto mb-6" />
            <p className="text-2xl font-medium text-gray-300">プレゼンテーション資料が</p>
            <p className="text-2xl font-medium text-gray-300">アップロードされていません</p>
            <p className="text-lg text-gray-500 mt-4">
              編集モードでPDFまたはPowerPointファイルを
            </p>
            <p className="text-lg text-gray-500">
              アップロードしてください
            </p>
          </div>
        </div>

        {/* CROWN フッター */}
        <div className="absolute bottom-6 left-12 right-12">
          <div className="flex items-center justify-between pt-4 border-t border-red-900/30">
            <div className="flex items-center gap-8">
              <div className="h-4 w-px bg-gray-700" />
            </div>
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </div>
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
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{
        width: '1190px',
        height: '842px',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0 auto',
        aspectRatio: '1.414 / 1',
        transformOrigin: 'center center'
      }}
    >
      {/* CROWN プレミアム背景パターン */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
            `,
          }} />
        </div>
      </div>

      {/* TOYOTA CROWN ヘッダー */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-900/30">
        <div className="px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase border-b-2 border-red-600 pb-1">
                デザイン
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <span className="text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase block">Feature</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                  01
                </span>
              </div>
              <div className="text-5xl font-thin text-red-900/50">/</div>
              <span className="text-2xl font-light text-gray-600">05</span>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト */}
      <div className="relative px-12 py-8 h-[calc(100%-168px)] overflow-auto">
        <div className="grid gap-6">
          {/* currentFileIndexが指定されている場合は、そのファイルのみを表示 */}
          {(currentFileIndex !== undefined
            ? [presentation.uploadedFiles[currentFileIndex]].filter(Boolean)
            : presentation.uploadedFiles
          ).map((file: any) => (
            <div
              key={file.id}
              className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-lg p-8 hover:border-red-600/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="scale-150">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">{file.name}</h3>
                    <p className="text-lg text-gray-400 mt-2">
                      {formatFileSize(file.size)} • {file.type === 'application/pdf' ? 'PDF' : 'PowerPoint'}
                      {file.uploadedAt && ` • アップロード日: ${new Date(file.uploadedAt).toLocaleDateString('ja-JP')}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {file.type === 'application/pdf' && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-6 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      <Eye className="mr-3 h-6 w-6" />
                      閲覧
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="lg"
                    className="px-8 py-6 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = file.url;
                      a.download = file.name;
                      a.click();
                    }}
                  >
                    <Download className="mr-3 h-6 w-6" />
                    ダウンロード
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CROWN フッター */}
      <div className="absolute bottom-6 left-12 right-12">
        <div className="flex items-center justify-between pt-4 border-t border-red-900/30">
          <div className="flex items-center gap-8">
            <div className="h-4 w-px bg-gray-700" />
          </div>
          <div className="flex items-center gap-3">
          </div>
        </div>
      </div>
    </div>
  );
}