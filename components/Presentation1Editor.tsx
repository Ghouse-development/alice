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

  // uploadedFilesの変更を監視して保存
  useEffect(() => {
    const presentation1: Partial<Presentation1> = {
      id: currentProject?.presentation1?.id || `pres1-${Date.now()}`,
      projectId,
      uploadedFiles: uploadedFiles,
      exteriorImages: [],
      interiorImages: [],
      floorPlans: [],
      specifications: [],
      notes: '',
    };
    updatePresentation1(projectId, presentation1);
  }, [uploadedFiles, currentProject?.presentation1?.id, projectId, updatePresentation1]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      return validTypes.includes(file.type) || file.type.startsWith('image/');
    });

    if (validFiles.length === 0) {
      alert('PDF、PowerPoint、または画像ファイルのみアップロード可能です');
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

        setUploadedFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
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
    if (type.startsWith('image/')) {
      return <File className="h-8 w-8 text-green-500" />;
    }
    return <File className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>プレゼンテーション資料アップロード</CardTitle>
          <CardDescription>
            PDF、PowerPoint、または画像ファイルをドラッグ&ドロップ、またはクリックして選択してください
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
              multiple
              accept=".pdf,.ppt,.pptx,image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-sm text-gray-500">
                または<span className="text-primary">クリックして選択</span>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                対応形式: PDF, PPT, PPTX, 画像ファイル
              </p>
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">アップロード済みファイル</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.type.startsWith('image/') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
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
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プレゼンテーション設定</CardTitle>
          <CardDescription>
            プレゼンテーションで使用する画像やテキストの設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">タイトル</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                placeholder="プレゼンテーションのタイトル"
              />
            </div>
            <div>
              <label className="text-sm font-medium">説明</label>
              <textarea
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                rows={3}
                placeholder="プレゼンテーションの説明"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}