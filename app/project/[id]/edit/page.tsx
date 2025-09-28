'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Home,
  Building,
  Wrench,
  DollarSign,
  TrendingUp,
  EyeOff,
  Maximize2,
  Minimize2,
  Play,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  List,
  GripVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/lib/store';
import Presentation3Interactive from '@/components/Presentation3Interactive';
import { Presentation1View } from '@/components/Presentation1View';
import EnhancedStandardSpecManager from '@/components/EnhancedStandardSpecManager';
import { Presentation4View } from '@/components/Presentation4View';
import { Presentation4Editor } from '@/components/Presentation4Editor';
import Presentation5UtilityCostSimulation from '@/components/Presentation5UtilityCostSimulation';
import { Presentation6MaintenanceView } from '@/components/Presentation6MaintenanceView';
import { PresentationContainer } from '@/components/PresentationContainer';
import { HearingSheetEditor } from '@/components/HearingSheetEditor';
import { SlideOrderEditor } from '@/components/SlideOrderEditor';

// シンプル化したタブ構成
const tabs = [
  { id: 'basic', label: '基本情報', icon: FileText },
  { id: 'hearing', label: 'ヒアリング', icon: User },
  { id: 'pres1', label: 'デザイン', icon: Home },
  { id: 'pres2', label: '標準仕様', icon: Building },
  { id: 'pres3', label: 'オプション', icon: Wrench },
  { id: 'pres5', label: '光熱費', icon: TrendingUp },
  { id: 'pres6', label: 'メンテナンス', icon: Wrench },
  { id: 'pres4', label: '資金計画', icon: DollarSign },
  { id: 'order', label: '順番', icon: List },
];

const presentationComponents = {
  pres1: Presentation1View,
  pres2: EnhancedStandardSpecManager,
  pres3: Presentation3Interactive,
  pres4: Presentation4View,
  pres5: Presentation5UtilityCostSimulation,
  pres6: Presentation6MaintenanceView,
};

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, currentProject, setCurrentProject, updateProject } = useStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    customerName: '',
    salesPerson: '',
    status: 'draft' as 'draft' | 'presented' | 'contracted' | 'archived',
    // ヒアリング情報
    phone: '',
    email: '',
    address: '',
    preferredContact: '',
    budget: '',
    timeline: '',
    requirements: '',
    notes: '',
  });

  useEffect(() => {
    if (!params.id || !projects.length) return;

    const project = projects.find((p) => p.id === params.id);
    if (project) {
      setCurrentProject(project);
      setFormData((prev) => ({
        ...prev,
        projectName: project.projectName,
        customerName: project.customerName,
        salesPerson: project.salesPerson,
        status: project.status,
      }));
    } else {
      // 存在しないIDは404でフォールバック
      router.replace('/dashboard');
    }
  }, [params.id, projects, setCurrentProject, router]);

  const handleSave = () => {
    if (currentProject) {
      try {
        // 案件名と顧客名を同じにする
        const updatedData = {
          ...formData,
          projectName: formData.customerName
            ? `${formData.customerName}様邸`
            : formData.projectName,
        };
        updateProject(currentProject.id, updatedData);
        alert('保存しました');
      } catch (error) {
        console.error('Save error:', error);
        alert('保存中にエラーが発生しました');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // 顧客名が変更されたら案件名も自動更新
      if (field === 'customerName' && value) {
        updated.projectName = `${value}様邸`;
      }
      return updated;
    });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleFullscreenPreview = () => {
    setPreviewFullscreen(!previewFullscreen);
  };

  if (!currentProject) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-gray-500">プロジェクトが見つかりません</p>
          <Link href="/dashboard">
            <Button className="mt-4">ダッシュボードに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const CurrentPreviewComponent = activeTab.startsWith('pres')
    ? presentationComponents[activeTab as keyof typeof presentationComponents]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${previewFullscreen ? 'hidden' : ''}`}>
        <div className="container-fluid mx-auto py-2 sm:py-4 px-2 sm:px-4">
          {/* ヘッダー：レスポンシブ対応 */}
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="h-10 px-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">戻る</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  {formData.projectName || currentProject.projectName}
                </h1>
                <span className="text-xs sm:text-sm text-gray-500">
                  顧客: {formData.customerName || currentProject.customerName}
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleSave}
                variant="default"
                size="sm"
                className="flex-1 sm:flex-none h-10 px-4"
              >
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              {activeTab.startsWith('pres') && (
                <Button
                  onClick={togglePreview}
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 hidden lg:flex"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      <span className="hidden xl:inline">プレビューを隠す</span>
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      <span className="hidden xl:inline">プレビュー表示</span>
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                className="h-10 px-4 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  router.push(`/project/${currentProject.id}/present-flow?fullscreen=true`);
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">プレゼン</span>
              </Button>
            </div>
          </div>

          <div
            className={
              showPreview && activeTab.startsWith('pres') ? 'grid lg:grid-cols-2 gap-4' : ''
            }
          >
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {/* タブリスト：レスポンシブ対応 */}
                <TabsList className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 w-full mb-4 h-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex flex-col sm:flex-row items-center gap-1 py-2 sm:py-1.5 text-xs sm:text-sm h-auto min-h-[48px] sm:min-h-[40px]"
                      >
                        <Icon className="h-4 w-4 sm:h-3 sm:w-3" />
                        <span className="text-[10px] sm:text-xs">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* 基本情報タブ */}
                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本情報</CardTitle>
                      <CardDescription>案件の基本情報を入力してください</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customerName">
                            <User className="inline h-3 w-3 mr-1" />
                            顧客名
                          </Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                            placeholder="例: 山田太郎"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectName">
                            <Briefcase className="inline h-3 w-3 mr-1" />
                            案件名（自動設定）
                          </Label>
                          <Input
                            id="projectName"
                            value={formData.projectName}
                            onChange={(e) => handleInputChange('projectName', e.target.value)}
                            placeholder="顧客名を入力すると自動設定"
                            className="h-12 bg-gray-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salesPerson">
                            <User className="inline h-3 w-3 mr-1" />
                            営業担当者
                          </Label>
                          <Input
                            id="salesPerson"
                            value={formData.salesPerson}
                            onChange={(e) => handleInputChange('salesPerson', e.target.value)}
                            placeholder="例: 佐藤花子"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">ステータス</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                          >
                            <SelectTrigger id="status" className="h-12">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">作成中</SelectItem>
                              <SelectItem value="presented">提案済</SelectItem>
                              <SelectItem value="contracted">契約済</SelectItem>
                              <SelectItem value="archived">アーカイブ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ヒアリングタブ */}
                <TabsContent value="hearing">
                  <HearingSheetEditor projectId={currentProject.id} />
                </TabsContent>

                {/* プレゼンテーションタブ（デザイン、標準仕様、オプション、資金計画、光熱費） */}
                {tabs
                  .filter((tab) => tab.id.startsWith('pres'))
                  .map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                      {tab.id === 'pres4' ? (
                        <Presentation4Editor projectId={currentProject.id} />
                      ) : (
                        <Card>
                          <CardHeader>
                            <CardTitle>{tab.label}プレゼンテーション</CardTitle>
                            <CardDescription>
                              {tab.id === 'pres3'
                                ? 'お客様に最適なオプションをご提案'
                                : `${tab.label}の内容を確認・編集`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                              <tab.icon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                              <p className="text-lg font-medium mb-2">
                                {tab.label}プレゼンテーション
                              </p>
                              <p className="text-sm">右側のプレビューで実際の表示を確認できます</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  ))}

                {/* 順番タブ */}
                <TabsContent value="order">
                  <SlideOrderEditor projectId={currentProject.id} />
                </TabsContent>
              </Tabs>
            </div>

            {/* プレビューエリア */}
            {showPreview &&
              activeTab.startsWith('pres') &&
              CurrentPreviewComponent &&
              currentProject && (
                <div className="hidden lg:block sticky top-4">
                  <Card className="overflow-hidden shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">プレゼンテーションプレビュー</CardTitle>
                          <CardDescription className="text-gray-300">
                            実際の表示を確認
                          </CardDescription>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={toggleFullscreenPreview}
                          className="h-9 px-3"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-black">
                      <div style={{ aspectRatio: '1.414 / 1' }}>
                        <PresentationContainer>
                          <CurrentPreviewComponent projectId={currentProject.id} />
                        </PresentationContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* フルスクリーンプレビュー */}
      {previewFullscreen && CurrentPreviewComponent && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="h-full flex flex-col">
            <div className="bg-gray-900 border-b border-gray-700 px-4 sm:px-6 py-3 flex justify-between items-center">
              <div className="text-white">
                <h2 className="text-base sm:text-lg font-semibold">プレビューモード</h2>
                <p className="text-xs sm:text-sm text-gray-400">プレゼンテーション表示を確認</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreenPreview}
                className="h-9 px-4"
              >
                <Minimize2 className="mr-2 h-4 w-4" />
                閉じる
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <PresentationContainer fullscreen>
                <CurrentPreviewComponent projectId={currentProject.id} />
              </PresentationContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
