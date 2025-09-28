'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  X,
  Save,
  Eye,
  Trash2,
  Plus,
  Loader2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  FileType,
  Edit2,
  Check,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

interface PDFFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  size: number;
  fileType?: 'pdf' | 'ppt' | 'pptx';
  category?: string;
  globalOrder?: number; // グローバルな順番
}

interface ProjectSpecOrder {
  projectId: string;
  fileOrders: { [fileId: string]: number }; // ファイルIDと順番のマッピング
}

// 標準仕様のカテゴリー一覧
const STANDARD_SPEC_CATEGORIES = [
  { value: 'exterior', label: '外壁', color: 'bg-blue-100 text-blue-700' },
  { value: 'roof', label: '屋根', color: 'bg-green-100 text-green-700' },
  { value: 'kitchen', label: 'キッチン', color: 'bg-orange-100 text-orange-700' },
  { value: 'bathroom', label: '浴室', color: 'bg-purple-100 text-purple-700' },
  { value: 'toilet', label: 'トイレ', color: 'bg-pink-100 text-pink-700' },
  { value: 'washroom', label: '洗面所', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'floor', label: '床材', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'door', label: 'ドア・建具', color: 'bg-red-100 text-red-700' },
  { value: 'window', label: '窓・サッシ', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'insulation', label: '断熱材', color: 'bg-gray-100 text-gray-700' },
  { value: 'equipment', label: '設備', color: 'bg-teal-100 text-teal-700' },
  { value: 'other', label: 'その他', color: 'bg-gray-100 text-gray-600' },
];

interface StandardSpecPDFManagerProps {
  projectId?: string;
  fixedSlide?: number;
}

export default function StandardSpecPDFManager({ projectId }: StandardSpecPDFManagerProps) {
  const [globalFiles, setGlobalFiles] = useState<PDFFile[]>([]); // グローバルな標準仕様
  const [projectOrder, setProjectOrder] = useState<{ [fileId: string]: number }>({}); // 物件ごとの順番
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'manage' | 'order'>('order');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // グローバルな標準仕様ファイルを取得
  useEffect(() => {
    loadGlobalFiles();
    if (projectId) {
      loadProjectOrder();
    }
  }, [projectId]);

  const loadGlobalFiles = async () => {
    setLoading(true);
    try {
      // グローバルな標準仕様はプロジェクトIDなしで保存
      const storageKey = 'global-standard-specs';
      const localFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');

      // グローバル順番でソート
      const sortedFiles = localFiles.sort(
        (a: PDFFile, b: PDFFile) => (a.globalOrder || 0) - (b.globalOrder || 0)
      );

      setGlobalFiles(sortedFiles);
    } catch (err) {
      console.error('Error loading global files:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectOrder = () => {
    if (!projectId) return;

    // 物件ごとの順番を取得
    const orderKey = `project-spec-order-${projectId}`;
    const savedOrder = JSON.parse(localStorage.getItem(orderKey) || '{}');

    // 初期順番がない場合はグローバル順番を使用
    if (Object.keys(savedOrder).length === 0) {
      const initialOrder: { [fileId: string]: number } = {};
      globalFiles.forEach((file, index) => {
        initialOrder[file.id] = index;
      });
      setProjectOrder(initialOrder);
    } else {
      setProjectOrder(savedOrder);
    }
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = event.target.files;
      if (!selectedFiles) return;

      const validFiles = Array.from(selectedFiles).filter(
        (file) =>
          file.type === 'application/pdf' ||
          file.type === 'application/vnd.ms-powerpoint' ||
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      );

      if (validFiles.length === 0) {
        setError('PDFまたはPPTファイルを選択してください');
        return;
      }

      validFiles.forEach((file) => {
        handleUpload(file);
      });
    },
    [globalFiles]
  );

  const handleUpload = async (file: File) => {
    // ファイルサイズ制限（10MB）
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('ファイルサイズが10MBを超えています');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        const newFile: PDFFile = {
          id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: base64,
          uploadedAt: new Date(),
          size: file.size,
          globalOrder: globalFiles.length,
          fileType: file.name.endsWith('.ppt')
            ? 'ppt'
            : file.name.endsWith('.pptx')
              ? 'pptx'
              : 'pdf',
          category: 'other',
        };

        // グローバルファイルに追加
        const updatedFiles = [...globalFiles, newFile];
        setGlobalFiles(updatedFiles);

        // グローバルストレージに保存
        const storageKey = 'global-standard-specs';
        localStorage.setItem(storageKey, JSON.stringify(updatedFiles));

        // 新しいファイルを全プロジェクトの順番に追加
        if (projectId) {
          const newOrder = { ...projectOrder, [newFile.id]: globalFiles.length };
          setProjectOrder(newOrder);

          const orderKey = `project-spec-order-${projectId}`;
          localStorage.setItem(orderKey, JSON.stringify(newOrder));
        }
      };

      reader.onerror = () => {
        setError('ファイルの読み込みに失敗しました');
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      setError('アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) =>
          file.type === 'application/pdf' ||
          file.type === 'application/vnd.ms-powerpoint' ||
          file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      );

      if (droppedFiles.length === 0) {
        setError('PDFまたはPPTファイルをドロップしてください');
        return;
      }

      droppedFiles.forEach((file) => {
        handleUpload(file);
      });
    },
    [globalFiles]
  );

  const deleteGlobalFile = async (fileId: string) => {
    const updatedFiles = globalFiles.filter((f) => f.id !== fileId);

    // グローバル順番を再調整
    updatedFiles.forEach((file, index) => {
      file.globalOrder = index;
    });

    setGlobalFiles(updatedFiles);

    // グローバルストレージを更新
    const storageKey = 'global-standard-specs';
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles));

    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const moveProjectFile = (fileId: string, direction: 'up' | 'down') => {
    if (!projectId) return;

    // 物件の順番でソートされたファイル
    const sortedFiles = getSortedFilesForProject();
    const currentIndex = sortedFiles.findIndex((f) => f.id === fileId);

    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sortedFiles.length) return;

    // 順番を入れ替え
    const newOrder = { ...projectOrder };
    const tempOrder = newOrder[sortedFiles[currentIndex].id];
    newOrder[sortedFiles[currentIndex].id] = newOrder[sortedFiles[newIndex].id];
    newOrder[sortedFiles[newIndex].id] = tempOrder;

    setProjectOrder(newOrder);

    // ローカルストレージに保存
    const orderKey = `project-spec-order-${projectId}`;
    localStorage.setItem(orderKey, JSON.stringify(newOrder));
  };

  const resetProjectOrder = () => {
    if (!projectId) return;

    // グローバル順番にリセット
    const initialOrder: { [fileId: string]: number } = {};
    globalFiles.forEach((file, index) => {
      initialOrder[file.id] = index;
    });

    setProjectOrder(initialOrder);

    const orderKey = `project-spec-order-${projectId}`;
    localStorage.setItem(orderKey, JSON.stringify(initialOrder));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType?: string) => {
    if (fileType === 'ppt' || fileType === 'pptx') {
      return <FileType className="h-8 w-8 text-orange-500" />;
    }
    return <FileText className="h-8 w-8 text-red-500" />;
  };

  const updateFileCategory = (fileId: string, category: string) => {
    const updatedFiles = globalFiles.map((file) =>
      file.id === fileId ? { ...file, category } : file
    );
    setGlobalFiles(updatedFiles);
    setEditingCategory(null);

    // グローバルストレージに保存
    const storageKey = 'global-standard-specs';
    localStorage.setItem(storageKey, JSON.stringify(updatedFiles));
  };

  const getCategoryInfo = (category?: string) => {
    return (
      STANDARD_SPEC_CATEGORIES.find((c) => c.value === category) ||
      STANDARD_SPEC_CATEGORIES.find((c) => c.value === 'other')!
    );
  };

  // 物件の順番でソート
  const getSortedFilesForProject = () => {
    if (!projectId) return globalFiles;

    return [...globalFiles].sort((a, b) => {
      const orderA = projectOrder[a.id] ?? a.globalOrder ?? 999;
      const orderB = projectOrder[b.id] ?? b.globalOrder ?? 999;
      return orderA - orderB;
    });
  };

  // フィルタリング
  const filteredFiles =
    filterCategory === 'all'
      ? globalFiles
      : globalFiles.filter((file) => file.category === filterCategory);

  const projectSortedFiles = getSortedFilesForProject();
  const filteredProjectFiles =
    filterCategory === 'all'
      ? projectSortedFiles
      : projectSortedFiles.filter((file) => file.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* タイトル */}
      <Card>
        <CardHeader>
          <CardTitle>標準仕様スライド管理</CardTitle>
          <CardDescription>
            {projectId
              ? '物件ごとにスライドの順番をカスタマイズできます。'
              : '全物件共通の標準仕様スライドを管理します。'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* タブ切り替え */}
      {projectId && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'manage' | 'order')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="order">物件の順番設定</TabsTrigger>
            <TabsTrigger value="manage">グローバル管理（管理者用）</TabsTrigger>
          </TabsList>

          {/* 物件の順番設定タブ */}
          <TabsContent value="order">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>この物件のスライド順番</CardTitle>
                    <CardDescription>ドラッグまたは矢印ボタンで順番を変更できます</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetProjectOrder}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      初期順番に戻す
                    </Button>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="カテゴリーで絞り込み" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて表示</SelectItem>
                        {STANDARD_SPEC_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">ファイルを読み込み中...</span>
                  </div>
                ) : filteredProjectFiles.length > 0 ? (
                  <div className="space-y-2">
                    {filteredProjectFiles.map((file, index) => {
                      const categoryInfo = getCategoryInfo(file.category);
                      return (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveProjectFile(file.id, 'up')}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveProjectFile(file.id, 'down')}
                                  disabled={index === filteredProjectFiles.length - 1}
                                >
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </div>
                              <span className="text-sm font-medium text-gray-500 w-8">
                                #{index + 1}
                              </span>
                              {getFileIcon(file.fileType)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{file.name}</p>
                                <Badge className={`${categoryInfo.color} text-xs`}>
                                  {categoryInfo.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    グローバル管理タブで標準仕様スライドを追加してください
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* グローバル管理タブ */}
          <TabsContent value="manage">
            <GlobalManageContent />
          </TabsContent>
        </Tabs>
      )}

      {/* プロジェクトIDがない場合は直接グローバル管理を表示 */}
      {!projectId && <GlobalManageContent />}
    </div>
  );

  // グローバル管理のコンテンツ
  function GlobalManageContent() {
    return (
      <>
        {/* アップロードエリア */}
        <Card>
          <CardHeader>
            <CardTitle>新規スライド追加</CardTitle>
            <CardDescription>全物件共通の標準仕様スライドを追加します</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                PDFまたはPPTファイルをドラッグ＆ドロップ、またはクリックして選択
              </p>
              <p className="text-xs text-gray-500 mt-1">
                複数のファイルを選択できます（PDF、PPT、PPTX対応）
              </p>
              <p className="text-xs text-gray-400 mt-1">最大ファイルサイズ: 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pdf,.ppt,.pptx"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                disabled={uploading}
              >
                <Plus className="h-4 w-4 mr-2" />
                ファイルを選択
              </Button>
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* グローバルファイルリスト */}
        {filteredFiles.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>グローバル標準仕様スライド</CardTitle>
                  <CardDescription>
                    {globalFiles.length}個のファイルが登録されています
                  </CardDescription>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="カテゴリーで絞り込み" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて表示</SelectItem>
                    {STANDARD_SPEC_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFiles.map((file, index) => {
                  const categoryInfo = getCategoryInfo(file.category);
                  return (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer ${
                        selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-500 w-8">
                            #{index + 1}
                          </span>
                          {getFileIcon(file.fileType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{file.name}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {editingCategory === file.id ? (
                              <Select
                                value={file.category || 'other'}
                                onValueChange={(value) => updateFileCategory(file.id, value)}
                              >
                                <SelectTrigger className="h-6 text-xs w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STANDARD_SPEC_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge
                                className={`${categoryInfo.color} text-xs cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCategory(file.id);
                                }}
                              >
                                {categoryInfo.label}
                                <Edit2 className="h-3 w-3 ml-1" />
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatFileSize(file.size)} •{' '}
                              {file.uploadedAt.toLocaleDateString('ja-JP')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.url, '_blank');
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGlobalFile(file.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* プレビューエリア */}
        {selectedFile && (
          <Card>
            <CardHeader>
              <CardTitle>スライドプレビュー</CardTitle>
              <CardDescription>{selectedFile.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                {selectedFile.fileType === 'pdf' ? (
                  <iframe
                    src={selectedFile.url}
                    className="w-full h-full"
                    title={selectedFile.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileType className="h-16 w-16 mx-auto mb-4 text-orange-500" />
                      <p className="text-gray-600">PPTファイルのプレビューは利用できません</p>
                      <p className="text-sm text-gray-500 mt-2">ダウンロードして確認してください</p>
                      <Button
                        className="mt-4"
                        onClick={() => window.open(selectedFile.url, '_blank')}
                      >
                        ダウンロード
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </>
    );
  }
}
