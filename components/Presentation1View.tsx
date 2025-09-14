'use client';

import { useEffect, useState } from 'react';
import { FileText, File, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { Presentation1 } from '@/types';

interface Presentation1ViewProps {
  projectId: string;
}

export function Presentation1View({ projectId }: Presentation1ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation1 | null>(null);

  useEffect(() => {
    if (currentProject?.presentation1) {
      setPresentation(currentProject.presentation1);
    }
  }, [currentProject]);

  if (!presentation || !presentation.uploadedFiles || presentation.uploadedFiles.length === 0) {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <div className="h-[20%] bg-gradient-to-r from-blue-600 to-blue-700 px-16 flex items-center">
          <div>
            <h2 className="text-5xl font-bold text-white mb-2">デザイン</h2>
            <p className="text-xl text-blue-100">住宅の外観・内装デザイン資料</p>
          </div>
        </div>
        <div className="h-[60%] flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <p className="text-gray-600 text-2xl font-medium">プレゼンテーション資料が</p>
            <p className="text-gray-600 text-2xl font-medium">アップロードされていません</p>
            <p className="text-gray-400 text-lg mt-4">
              編集モードでPDFまたはPowerPointファイルを
            </p>
            <p className="text-gray-400 text-lg">
              アップロードしてください
            </p>
          </div>
        </div>
        <div className="h-[20%] bg-gray-100 px-16 py-6 flex items-center justify-between">
          <div className="text-gray-600">
            <p className="text-lg">資料をアップロードしてください</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">G-HOUSE</p>
            <p className="text-lg text-gray-600">プレゼンテーション資料</p>
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
      return <FileText className="h-12 w-12 text-red-500" />;
    }
    return <File className="h-12 w-12 text-blue-500" />;
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* ヘッダー部分 - A3の上部20% */}
      <div className="h-[20%] bg-gradient-to-r from-blue-600 to-blue-700 px-16 flex items-center">
        <div>
          <h2 className="text-5xl font-bold text-white mb-2">デザイン</h2>
          <p className="text-xl text-blue-100">
            住宅の外観・内装デザインをご確認いただける資料です
          </p>
        </div>
      </div>

      {/* コンテンツ部分 - A3の中央60% */}
      <div className="h-[60%] px-16 py-8 overflow-auto">
        <div className="grid gap-6">
          {presentation.uploadedFiles.map((file: any) => (
            <div
              key={file.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="scale-150">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{file.name}</h3>
                    <p className="text-lg text-gray-500 mt-2">
                      {formatFileSize(file.size)} • アップロード日: {new Date(file.uploadedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  {file.type === 'application/pdf' && (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => window.open(file.url, '_blank')}
                      className="px-8 py-4 text-lg"
                    >
                      <Eye className="h-6 w-6 mr-3" />
                      資料を表示
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = file.url;
                      a.download = file.name;
                      a.click();
                    }}
                    className="px-8 py-4 text-lg"
                  >
                    <Download className="h-6 w-6 mr-3" />
                    ダウンロード
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* フッター部分 - A3の下部20% */}
      <div className="h-[20%] bg-gray-100 px-16 py-6 flex items-center justify-between">
        <div className="text-gray-600">
          <p className="text-lg">
            <strong>ご注意：</strong>
            PowerPointファイルはダウンロード後にご確認ください
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">G-HOUSE</p>
          <p className="text-lg text-gray-600">プレゼンテーション資料</p>
        </div>
      </div>
    </div>
  );
}