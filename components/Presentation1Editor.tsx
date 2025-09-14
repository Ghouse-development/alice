'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, X, FileText, File, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import type { Presentation1 } from '@/types';

interface Presentation1EditorProps {
  projectId: string;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export function Presentation1Editor({ projectId }: Presentation1EditorProps) {
  const { currentProject, updatePresentation1 } = useStore();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (currentProject?.presentation1) {
      // 既存のファイル情報を復元
      const files = currentProject.presentation1.uploadedFiles || [];
      setUploadedFiles(files);
    }
  }, [currentProject]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const savePresentation = useCallback((files: UploadedFile[]) => {
    const presentation1: Partial<Presentation1> = {
      id: currentProject?.presentation1?.id || `pres1-${Date.now()}`,
      projectId,
      uploadedFiles: files,
      exteriorImages: [],
      interiorImages: [],
      floorPlans: [],
      specifications: [],
      notes: '',
    };
    updatePresentation1(projectId, presentation1);
  }, [currentProject?.presentation1?.id, projectId, updatePresentation1]);

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length === 0) {
      alert('PDFまたはPowerPointファイルのみアップロード可能です');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: event.target?.result as string,
          uploadedAt: new Date(),
        };

        setUploadedFiles(prev => {
          const updated = [...prev, newFile];
          savePresentation(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  }, [savePresentation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      savePresentation(updated);
      return updated;
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <File className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>プレゼンテーション資料アップロード</CardTitle>
          <CardDescription>
            PDFまたはPowerPointファイルをドラッグ&ドロップ、またはクリックして選択してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.ppt,.pptx"
              multiple
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-sm text-gray-500 mb-4">
                または
              </p>
              <Button variant="outline" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                ファイルを選択
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                対応形式: PDF, PowerPoint (.ppt, .pptx)
              </p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">アップロード済みファイル</h3>
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.type === 'application/pdf' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        表示
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = file.url;
                        a.download = file.name;
                        a.click();
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>使用方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">プレゼン資料を準備</p>
              <p className="text-sm text-gray-600">
                仕様確認用のPDFまたはPowerPointファイルを準備してください
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">ファイルをアップロード</p>
              <p className="text-sm text-gray-600">
                ドラッグ&ドロップまたはファイル選択ボタンでアップロード
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">プレゼンモードで表示</p>
              <p className="text-sm text-gray-600">
                プレゼンモードではアップロードしたファイルを顧客に表示できます
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}