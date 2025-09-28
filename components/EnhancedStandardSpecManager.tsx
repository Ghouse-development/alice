'use client';

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
  Search,
  Download,
  Share2,
  Star,
  BarChart3,
  Clock,
  CheckSquare,
  Square,
  ArrowUpDown,
  Calendar,
  Users,
  MessageSquare,
  History,
  Shield,
  Smartphone,
  Layout,
  PlayCircle,
  PauseCircle,
  SkipForward,
  SkipBack,
  Maximize,
  QrCode,
  TrendingUp,
  FileDown,
  FileUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

// ファイル情報の拡張型
interface EnhancedFile {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  size: number;
  fileType?: 'pdf' | 'ppt' | 'pptx';
  category?: string;
  globalOrder?: number;
  tags?: string[];
  favorite?: boolean;
  viewCount?: number;
  lastViewed?: Date;
  notes?: string;
  sharedWith?: string[];
  version?: number;
  thumbnail?: string;
}

// テンプレート型
interface Template {
  id: string;
  name: string;
  description: string;
  files: string[]; // ファイルIDの配列
  category: 'standard' | 'custom' | 'industry';
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

// コメント型
interface Comment {
  id: string;
  fileId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  resolved?: boolean;
}

// 分析データ型
interface Analytics {
  fileId: string;
  views: number;
  shares: number;
  conversions: number;
  averageViewTime: number;
  lastAccessed: Date;
}

// カテゴリー定義（拡張版）
const ENHANCED_CATEGORIES = [
  { value: 'exterior', label: '外壁', color: 'bg-blue-100 text-blue-700', icon: '🏠' },
  { value: 'roof', label: '屋根', color: 'bg-green-100 text-green-700', icon: '🏗️' },
  { value: 'kitchen', label: 'キッチン', color: 'bg-orange-100 text-orange-700', icon: '🍳' },
  { value: 'bathroom', label: '浴室', color: 'bg-purple-100 text-purple-700', icon: '🚿' },
  { value: 'toilet', label: 'トイレ', color: 'bg-pink-100 text-pink-700', icon: '🚽' },
  { value: 'washroom', label: '洗面所', color: 'bg-indigo-100 text-indigo-700', icon: '🚰' },
  { value: 'floor', label: '床材', color: 'bg-yellow-100 text-yellow-700', icon: '🪵' },
  { value: 'door', label: 'ドア・建具', color: 'bg-red-100 text-red-700', icon: '🚪' },
  { value: 'window', label: '窓・サッシ', color: 'bg-cyan-100 text-cyan-700', icon: '🪟' },
  { value: 'insulation', label: '断熱材', color: 'bg-gray-100 text-gray-700', icon: '🔥' },
  { value: 'equipment', label: '設備', color: 'bg-teal-100 text-teal-700', icon: '⚙️' },
  { value: 'smart', label: 'スマートホーム', color: 'bg-emerald-100 text-emerald-700', icon: '📱' },
  { value: 'security', label: 'セキュリティ', color: 'bg-amber-100 text-amber-700', icon: '🔒' },
  { value: 'other', label: 'その他', color: 'bg-gray-100 text-gray-600', icon: '📁' },
];

// ソート可能なアイテムコンポーネント
function SortableItem({ file, children }: { file: EnhancedFile; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <div {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        {children}
      </div>
    </div>
  );
}

interface EnhancedStandardSpecManagerProps {
  projectId?: string;
  onAnalytics?: (data: Analytics[]) => void;
}

export default function EnhancedStandardSpecManager({
  projectId,
  onAnalytics,
}: EnhancedStandardSpecManagerProps) {
  // 状態管理（基本）
  const [globalFiles, setGlobalFiles] = useState<EnhancedFile[]>([]);
  const [projectOrder, setProjectOrder] = useState<{ [fileId: string]: number }>({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<EnhancedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // フィルター・検索関連
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'views'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  // UI状態
  const [activeTab, setActiveTab] = useState<'manage' | 'order' | 'templates' | 'analytics'>(
    'order'
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showComments, setShowComments] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // テンプレート・分析関連
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // プレゼンテーション関連
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationTimer, setPresentationTimer] = useState(0);
  const [presentationNotes, setPresentationNotes] = useState<{ [fileId: string]: string }>({});

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const presentationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ドラッグ&ドロップセンサー
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 初期化とデータ読み込み
  useEffect(() => {
    loadGlobalFiles();
    loadTemplates();
    if (projectId) {
      loadProjectOrder();
      loadAnalytics();
    }
  }, [projectId]);

  // プレゼンテーションタイマー
  useEffect(() => {
    if (presentationMode) {
      presentationIntervalRef.current = setInterval(() => {
        setPresentationTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (presentationIntervalRef.current) {
        clearInterval(presentationIntervalRef.current);
      }
      setPresentationTimer(0);
    }
    return () => {
      if (presentationIntervalRef.current) {
        clearInterval(presentationIntervalRef.current);
      }
    };
  }, [presentationMode]);

  // データ読み込み関数
  const loadGlobalFiles = async () => {
    setLoading(true);
    try {
      const storageKey = 'enhanced-global-standard-specs';
      const localFiles = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const sortedFiles = localFiles.sort(
        (a: EnhancedFile, b: EnhancedFile) => (a.globalOrder || 0) - (b.globalOrder || 0)
      );
      setGlobalFiles(sortedFiles);
    } catch (err) {
      console.error('Error loading global files:', err);
      setError('ファイルの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectOrder = () => {
    if (!projectId) return;
    const orderKey = `enhanced-project-spec-order-${projectId}`;
    const savedOrder = JSON.parse(localStorage.getItem(orderKey) || '{}');
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

  const loadTemplates = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('presentation-templates') || '[]');
    setTemplates(savedTemplates);
  };

  const loadAnalytics = () => {
    const savedAnalytics = JSON.parse(localStorage.getItem(`analytics-${projectId}`) || '[]');
    setAnalytics(savedAnalytics);
  };

  // ファイル選択とアップロード
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
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('ファイルサイズが10MBを超えています');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // プログレス表示のシミュレーション
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const reader = new FileReader();
      reader.onload = async (e) => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        const base64 = e.target?.result as string;
        const newFile: EnhancedFile = {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
          tags: [],
          favorite: false,
          viewCount: 0,
          version: 1,
        };

        const updatedFiles = [...globalFiles, newFile];
        setGlobalFiles(updatedFiles);
        saveGlobalFiles(updatedFiles);

        if (projectId) {
          const newOrder = { ...projectOrder, [newFile.id]: globalFiles.length };
          setProjectOrder(newOrder);
          saveProjectOrder(newOrder);
        }

        // 分析データの初期化
        trackFileUpload(newFile.id);
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
      setUploadProgress(0);
    }
  };

  // ドラッグ&ドロップハンドラー
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = globalFiles.findIndex((file) => file.id === active.id);
      const newIndex = globalFiles.findIndex((file) => file.id === over?.id);

      const newFiles = arrayMove(globalFiles, oldIndex, newIndex);

      // グローバル順番を更新
      newFiles.forEach((file, index) => {
        file.globalOrder = index;
      });

      setGlobalFiles(newFiles);
      saveGlobalFiles(newFiles);

      if (projectId) {
        const newOrder: { [fileId: string]: number } = {};
        newFiles.forEach((file, index) => {
          newOrder[file.id] = index;
        });
        setProjectOrder(newOrder);
        saveProjectOrder(newOrder);
      }
    }
  };

  // 保存関数
  const saveGlobalFiles = (files: EnhancedFile[]) => {
    const storageKey = 'enhanced-global-standard-specs';
    localStorage.setItem(storageKey, JSON.stringify(files));
  };

  const saveProjectOrder = (order: { [fileId: string]: number }) => {
    if (!projectId) return;
    const orderKey = `enhanced-project-spec-order-${projectId}`;
    localStorage.setItem(orderKey, JSON.stringify(order));
  };

  // ファイル操作関数
  const toggleFavorite = (fileId: string) => {
    const updatedFiles = globalFiles.map((file) =>
      file.id === fileId ? { ...file, favorite: !file.favorite } : file
    );
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
  };

  const updateFileTags = (fileId: string, tags: string[]) => {
    const updatedFiles = globalFiles.map((file) => (file.id === fileId ? { ...file, tags } : file));
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
  };

  const updateFileNotes = (fileId: string, notes: string) => {
    const updatedFiles = globalFiles.map((file) =>
      file.id === fileId ? { ...file, notes } : file
    );
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
  };

  const deleteFiles = (fileIds: string[]) => {
    const updatedFiles = globalFiles.filter((f) => !fileIds.includes(f.id));
    updatedFiles.forEach((file, index) => {
      file.globalOrder = index;
    });
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
    setSelectedFiles(new Set());
  };

  // 一括操作
  const bulkUpdateCategory = (fileIds: string[], category: string) => {
    const updatedFiles = globalFiles.map((file) =>
      fileIds.includes(file.id) ? { ...file, category } : file
    );
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
  };

  const bulkAddTags = (fileIds: string[], tags: string[]) => {
    const updatedFiles = globalFiles.map((file) =>
      fileIds.includes(file.id)
        ? { ...file, tags: [...new Set([...(file.tags || []), ...tags])] }
        : file
    );
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);
  };

  // テンプレート関数
  const saveAsTemplate = (name: string, description: string, fileIds: string[]) => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name,
      description,
      files: fileIds,
      category: 'custom',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem('presentation-templates', JSON.stringify(updatedTemplates));
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    const templateFiles = globalFiles.filter((f) => template.files.includes(f.id));
    if (projectId) {
      const newOrder: { [fileId: string]: number } = {};
      templateFiles.forEach((file, index) => {
        newOrder[file.id] = index;
      });
      setProjectOrder(newOrder);
      saveProjectOrder(newOrder);
    }

    // 使用回数を更新
    const updatedTemplates = templates.map((t) =>
      t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    setTemplates(updatedTemplates);
    localStorage.setItem('presentation-templates', JSON.stringify(updatedTemplates));
  };

  // 分析トラッキング
  const trackFileView = (fileId: string) => {
    const updatedFiles = globalFiles.map((file) =>
      file.id === fileId
        ? {
            ...file,
            viewCount: (file.viewCount || 0) + 1,
            lastViewed: new Date(),
          }
        : file
    );
    setGlobalFiles(updatedFiles);
    saveGlobalFiles(updatedFiles);

    // 分析データ更新
    const analyticsData = analytics.find((a) => a.fileId === fileId) || {
      fileId,
      views: 0,
      shares: 0,
      conversions: 0,
      averageViewTime: 0,
      lastAccessed: new Date(),
    };
    analyticsData.views++;
    analyticsData.lastAccessed = new Date();

    const updatedAnalytics = analytics.filter((a) => a.fileId !== fileId);
    updatedAnalytics.push(analyticsData);
    setAnalytics(updatedAnalytics);

    if (projectId) {
      localStorage.setItem(`analytics-${projectId}`, JSON.stringify(updatedAnalytics));
    }
  };

  const trackFileUpload = (fileId: string) => {
    const analyticsData: Analytics = {
      fileId,
      views: 0,
      shares: 0,
      conversions: 0,
      averageViewTime: 0,
      lastAccessed: new Date(),
    };
    setAnalytics([...analytics, analyticsData]);
    if (projectId) {
      localStorage.setItem(`analytics-${projectId}`, JSON.stringify([...analytics, analyticsData]));
    }
  };

  // CSV エクスポート/インポート
  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'ファイル名', 'カテゴリー', 'サイズ', 'アップロード日', 'お気に入り', '閲覧数'],
      ...globalFiles.map((file) => [
        file.id,
        file.name,
        file.category || '',
        file.size.toString(),
        file.uploadedAt.toISOString(),
        file.favorite ? 'Yes' : 'No',
        (file.viewCount || 0).toString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `standard-specs-${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').slice(1); // ヘッダーをスキップ

      const importedFiles: EnhancedFile[] = rows
        .filter((row) => row.trim())
        .map((row) => {
          const [id, name, category, size, uploadedAt, favorite, viewCount] = row.split(',');
          return {
            id: id || `imported-${Date.now()}-${Math.random()}`,
            name: name || 'Unknown',
            url: '', // CSVからはURLを復元できない
            uploadedAt: new Date(uploadedAt || Date.now()),
            size: parseInt(size || '0'),
            category: category || 'other',
            favorite: favorite === 'Yes',
            viewCount: parseInt(viewCount || '0'),
            tags: [],
          };
        });

      const updatedFiles = [...globalFiles, ...importedFiles];
      setGlobalFiles(updatedFiles);
      saveGlobalFiles(updatedFiles);
    };
    reader.readAsText(file);
  };

  // QRコード生成
  const generateQRCode = async (fileId: string) => {
    const file = globalFiles.find((f) => f.id === fileId);
    if (!file) return;

    const shareUrl = `${window.location.origin}/shared/${fileId}`;
    try {
      const qrCode = await QRCode.toDataURL(shareUrl);
      setQrCodeUrl(qrCode);
      setShowQRCode(true);
    } catch (err) {
      console.error('QR code generation failed:', err);
      setError('QRコードの生成に失敗しました');
    }
  };

  // プレゼンテーション制御
  const startPresentation = () => {
    setPresentationMode(true);
    setCurrentSlideIndex(0);
    document.documentElement.requestFullscreen();
  };

  const exitPresentation = () => {
    setPresentationMode(false);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const nextSlide = () => {
    const sortedFiles = getSortedFilesForProject();
    if (currentSlideIndex < sortedFiles.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      trackFileView(sortedFiles[currentSlideIndex + 1].id);
    }
  };

  const previousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // フィルタリングとソート
  const getSortedFilesForProject = () => {
    if (!projectId) return globalFiles;

    return [...globalFiles].sort((a, b) => {
      const orderA = projectOrder[a.id] ?? a.globalOrder ?? 999;
      const orderB = projectOrder[b.id] ?? b.globalOrder ?? 999;
      return orderA - orderB;
    });
  };

  const getFilteredAndSortedFiles = useMemo(() => {
    let filteredFiles = [...globalFiles];

    // カテゴリーフィルター
    if (filterCategory !== 'all') {
      filteredFiles = filteredFiles.filter((file) => file.category === filterCategory);
    }

    // 検索フィルター
    if (searchQuery) {
      filteredFiles = filteredFiles.filter(
        (file) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // お気に入りフィルター
    if (showFavoritesOnly) {
      filteredFiles = filteredFiles.filter((file) => file.favorite);
    }

    // 日付範囲フィルター
    if (dateRange.start && dateRange.end) {
      filteredFiles = filteredFiles.filter((file) => {
        const fileDate = new Date(file.uploadedAt);
        return fileDate >= dateRange.start! && fileDate <= dateRange.end!;
      });
    }

    // ソート
    filteredFiles.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
          break;
        case 'size':
          comparison = b.size - a.size;
          break;
        case 'views':
          comparison = (b.viewCount || 0) - (a.viewCount || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filteredFiles;
  }, [globalFiles, filterCategory, searchQuery, showFavoritesOnly, dateRange, sortBy, sortOrder]);

  // 分析データの集計
  const getAnalyticsChartData = () => {
    const categoryStats = ENHANCED_CATEGORIES.map((cat) => {
      const files = globalFiles.filter((f) => f.category === cat.value);
      const totalViews = files.reduce((sum, f) => sum + (f.viewCount || 0), 0);
      return {
        name: cat.label,
        files: files.length,
        views: totalViews,
      };
    });

    return categoryStats.filter((stat) => stat.files > 0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getCategoryInfo = (category?: string) => {
    return (
      ENHANCED_CATEGORIES.find((c) => c.value === category) ||
      ENHANCED_CATEGORIES.find((c) => c.value === 'other')!
    );
  };

  if (presentationMode) {
    const sortedFiles = getSortedFilesForProject();
    const currentFile = sortedFiles[currentSlideIndex];

    return (
      <div className="fixed inset-0 bg-black z-50">
        <div className="h-full flex flex-col">
          {/* プレゼンテーションヘッダー */}
          <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousSlide}
                disabled={currentSlideIndex === 0}
                className="text-white hover:bg-gray-800"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {currentSlideIndex + 1} / {sortedFiles.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlideIndex === sortedFiles.length - 1}
                className="text-white hover:bg-gray-800"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">{formatTime(presentationTimer)}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={exitPresentation}
                className="text-white hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                終了
              </Button>
            </div>
          </div>

          {/* プレゼンテーション本体 */}
          <div className="flex-1 flex items-center justify-center p-8">
            {currentFile && (
              <motion.div
                key={currentFile.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full max-w-7xl"
              >
                {currentFile.fileType === 'pdf' ? (
                  <iframe
                    src={currentFile.url}
                    className="w-full h-full bg-white rounded-lg"
                    title={currentFile.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white rounded-lg">
                    <div className="text-center">
                      <FileType className="h-32 w-32 mx-auto mb-4 text-orange-500" />
                      <h2 className="text-2xl font-bold mb-2">{currentFile.name}</h2>
                      <p className="text-gray-600">PPTファイルのプレビューは利用できません</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* プレゼンターノート（表示切り替え可能） */}
          {presentationNotes[currentFile?.id || ''] && (
            <div className="bg-gray-800 text-white px-4 py-2 border-t border-gray-700">
              <p className="text-sm">{presentationNotes[currentFile.id]}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">標準仕様スライド管理 Pro</CardTitle>
              <CardDescription>
                {projectId
                  ? `プロジェクト専用の高度な管理機能`
                  : '全プロジェクト共通の標準仕様を管理'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={startPresentation}
                disabled={getFilteredAndSortedFiles.length === 0}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                プレゼンテーション
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="order">ファイル管理</TabsTrigger>
          <TabsTrigger value="manage">詳細設定</TabsTrigger>
          <TabsTrigger value="templates">テンプレート</TabsTrigger>
          <TabsTrigger value="analytics">分析</TabsTrigger>
        </TabsList>

        {/* ファイル管理タブ */}
        <TabsContent value="order" className="space-y-4">
          {/* 検索・フィルターバー */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="ファイル名やタグで検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="カテゴリー" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {ENHANCED_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger className="w-[150px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="並び替え" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">名前</SelectItem>
                    <SelectItem value="date">日付</SelectItem>
                    <SelectItem value="size">サイズ</SelectItem>
                    <SelectItem value="views">閲覧数</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '昇順' : '降順'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={showFavoritesOnly ? 'bg-yellow-100' : ''}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* アップロードエリア */}
          <Card>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const files = Array.from(e.dataTransfer.files);
                  files.forEach((file) => handleUpload(file));
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  ファイルをドラッグ＆ドロップ、またはクリックして選択
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF、PPT、PPTX対応（最大10MB）</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploading && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-xs text-gray-500 mt-2">
                      アップロード中... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 一括操作バー */}
          {selectedFiles.size > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedFiles.size}個のファイルを選択中
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        bulkUpdateCategory(Array.from(selectedFiles), 'other');
                        setSelectedFiles(new Set());
                      }}
                    >
                      カテゴリー変更
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        bulkAddTags(Array.from(selectedFiles), ['bulk-updated']);
                        setSelectedFiles(new Set());
                      }}
                    >
                      タグ追加
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`${selectedFiles.size}個のファイルを削除しますか？`)) {
                          deleteFiles(Array.from(selectedFiles));
                        }
                      }}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ファイルリスト */}
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
              </CardContent>
            </Card>
          ) : getFilteredAndSortedFiles.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                {viewMode === 'list' ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={getFilteredAndSortedFiles}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {getFilteredAndSortedFiles.map((file, index) => {
                          const categoryInfo = getCategoryInfo(file.category);
                          return (
                            <SortableItem key={file.id} file={file}>
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`flex-1 flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
                                  selectedFile?.id === file.id ? 'border-blue-500 bg-blue-50' : ''
                                } ${selectedFiles.has(file.id) ? 'bg-blue-100' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Checkbox
                                    checked={selectedFiles.has(file.id)}
                                    onCheckedChange={(checked) => {
                                      const newSelected = new Set(selectedFiles);
                                      if (checked) {
                                        newSelected.add(file.id);
                                      } else {
                                        newSelected.delete(file.id);
                                      }
                                      setSelectedFiles(newSelected);
                                    }}
                                  />
                                  <span className="text-sm font-medium text-gray-500 w-8">
                                    #{index + 1}
                                  </span>
                                  {file.fileType === 'ppt' || file.fileType === 'pptx' ? (
                                    <FileType className="h-8 w-8 text-orange-500" />
                                  ) : (
                                    <FileText className="h-8 w-8 text-red-500" />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className={`${categoryInfo.color} text-xs`}>
                                        {categoryInfo.icon} {categoryInfo.label}
                                      </Badge>
                                      {file.tags?.map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                      <span className="text-xs text-gray-500">
                                        {formatFileSize(file.size)} •{' '}
                                        {new Date(file.uploadedAt).toLocaleDateString('ja-JP')}
                                      </span>
                                      {file.viewCount && file.viewCount > 0 && (
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                          <Eye className="h-3 w-3" />
                                          {file.viewCount}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleFavorite(file.id)}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        file.favorite ? 'fill-yellow-400 text-yellow-400' : ''
                                      }`}
                                    />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        •••
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem
                                        onClick={() => {
                                          window.open(file.url, '_blank');
                                          trackFileView(file.id);
                                        }}
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        プレビュー
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => generateQRCode(file.id)}>
                                        <QrCode className="h-4 w-4 mr-2" />
                                        QRコード生成
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        編集
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => deleteFiles([file.id])}
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        削除
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </motion.div>
                            </SortableItem>
                          );
                        })}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {getFilteredAndSortedFiles.map((file, index) => {
                      const categoryInfo = getCategoryInfo(file.category);
                      return (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${
                            selectedFile?.id === file.id ? 'border-blue-500' : ''
                          }`}
                          onClick={() => setSelectedFile(file)}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <Badge className={`${categoryInfo.color} text-xs`}>
                              {categoryInfo.icon} {categoryInfo.label}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(file.id);
                              }}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  file.favorite ? 'fill-yellow-400 text-yellow-400' : ''
                                }`}
                              />
                            </Button>
                          </div>
                          <div className="flex justify-center mb-3">
                            {file.fileType === 'ppt' || file.fileType === 'pptx' ? (
                              <FileType className="h-16 w-16 text-orange-500" />
                            ) : (
                              <FileText className="h-16 w-16 text-red-500" />
                            )}
                          </div>
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(file.uploadedAt).toLocaleDateString('ja-JP')}
                            </span>
                            {file.viewCount && file.viewCount > 0 && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {file.viewCount}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">ファイルがありません</p>
                <p className="text-xs text-gray-400 mt-1">
                  上記のエリアからファイルをアップロードしてください
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* テンプレートタブ */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>プレゼンテーションテンプレート</CardTitle>
              <CardDescription>
                よく使う組み合わせをテンプレートとして保存・適用できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 新規テンプレート作成 */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const name = prompt('テンプレート名を入力してください');
                      if (name) {
                        saveAsTemplate(
                          name,
                          'カスタムテンプレート',
                          getFilteredAndSortedFiles.map((f) => f.id)
                        );
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    現在の構成をテンプレートとして保存
                  </Button>
                </div>

                {/* テンプレートリスト */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            使用回数: {template.usageCount}
                          </span>
                          <Button size="sm" onClick={() => applyTemplate(template.id)}>
                            適用
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {templates.length === 0 && (
                  <div className="text-center py-8">
                    <Layout className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">テンプレートがありません</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 分析タブ */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>利用状況分析</CardTitle>
              <CardDescription>ファイルの使用状況と効果を分析します</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* カテゴリー別統計 */}
                <div>
                  <h3 className="text-sm font-medium mb-4">カテゴリー別統計</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getAnalyticsChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="files" fill="#8884d8" name="ファイル数" />
                      <Bar dataKey="views" fill="#82ca9d" name="閲覧数" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 人気ファイルランキング */}
                <div>
                  <h3 className="text-sm font-medium mb-4">人気ファイル TOP5</h3>
                  <div className="space-y-2">
                    {globalFiles
                      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
                      .slice(0, 5)
                      .map((file, index) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{file.viewCount || 0}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* エクスポートボタン */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={exportToCSV}>
                  <FileDown className="h-4 w-4 mr-2" />
                  CSVエクスポート
                </Button>
                <Button variant="outline" onClick={() => csvInputRef.current?.click()}>
                  <FileUp className="h-4 w-4 mr-2" />
                  CSVインポート
                </Button>
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  onChange={importFromCSV}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 詳細設定タブ */}
        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>詳細設定</CardTitle>
              <CardDescription>高度な機能と設定オプション</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* オフライン設定 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>オフラインモード</Label>
                  <p className="text-xs text-gray-500">
                    ファイルをローカルに保存してオフラインでも利用可能にします
                  </p>
                </div>
                <Switch />
              </div>

              {/* 自動バックアップ */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>自動バックアップ</Label>
                  <p className="text-xs text-gray-500">ファイルを定期的にバックアップします</p>
                </div>
                <Switch />
              </div>

              {/* セキュリティ設定 */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>二要素認証</Label>
                  <p className="text-xs text-gray-500">重要な操作時に追加認証を要求します</p>
                </div>
                <Switch />
              </div>

              {/* データ管理 */}
              <Separator />
              <div className="space-y-2">
                <Label>データ管理</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('すべてのデータをクリアしますか？')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    すべてのデータをクリア
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const data = {
                        files: globalFiles,
                        templates,
                        analytics,
                      };
                      const blob = new Blob([JSON.stringify(data, null, 2)], {
                        type: 'application/json',
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `backup-${Date.now()}.json`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    バックアップをダウンロード
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QRコードダイアログ */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>共有用QRコード</DialogTitle>
            <DialogDescription>このQRコードをスキャンしてファイルを共有できます</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowQRCode(false)}>閉じる</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ファイル編集ダイアログ */}
      {selectedFile && (
        <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>ファイル詳細</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>ファイル名</Label>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
              </div>
              <div>
                <Label>カテゴリー</Label>
                <Select
                  value={selectedFile.category}
                  onValueChange={(value) => {
                    const updated = { ...selectedFile, category: value };
                    const updatedFiles = globalFiles.map((f) =>
                      f.id === selectedFile.id ? updated : f
                    );
                    setGlobalFiles(updatedFiles);
                    saveGlobalFiles(updatedFiles);
                    setSelectedFile(updated);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENHANCED_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>タグ</Label>
                <Input
                  placeholder="カンマ区切りでタグを入力"
                  value={selectedFile.tags?.join(', ') || ''}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean);
                    updateFileTags(selectedFile.id, tags);
                    setSelectedFile({ ...selectedFile, tags });
                  }}
                />
              </div>
              <div>
                <Label>メモ</Label>
                <Textarea
                  placeholder="メモを入力..."
                  value={selectedFile.notes || ''}
                  onChange={(e) => {
                    updateFileNotes(selectedFile.id, e.target.value);
                    setSelectedFile({ ...selectedFile, notes: e.target.value });
                  }}
                  rows={4}
                />
              </div>
              <div>
                <Label>プレゼンターノート</Label>
                <Textarea
                  placeholder="プレゼンテーション時に表示するノート..."
                  value={presentationNotes[selectedFile.id] || ''}
                  onChange={(e) => {
                    setPresentationNotes({
                      ...presentationNotes,
                      [selectedFile.id]: e.target.value,
                    });
                  }}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                キャンセル
              </Button>
              <Button onClick={() => setSelectedFile(null)}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
