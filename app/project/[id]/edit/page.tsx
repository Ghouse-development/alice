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
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStore } from '@/lib/store';
import { HearingSheetEditor } from '@/components/HearingSheetEditor';
import { Presentation1Editor } from '@/components/Presentation1Editor';
import { Presentation2Editor } from '@/components/Presentation2Editor';
import { Presentation3Editor } from '@/components/Presentation3Editor';
import { Presentation4Editor } from '@/components/Presentation4Editor';
import { Presentation5Editor } from '@/components/Presentation5Editor';
import { Presentation1View } from '@/components/Presentation1View';
import Presentation2CrownUnified from '@/components/Presentation2CrownUnified';
import OptionsSlideRevised from '@/components/OptionsSlideRevised';
import { Presentation4View } from '@/components/Presentation4View';
import SolarSimulatorConclusionFirst from '@/components/SolarSimulatorConclusionFirst';
import { PresentationContainer } from '@/components/PresentationContainer';

const tabs = [
  { id: 'basic', label: '基本情報', icon: FileText },
  { id: 'hearing', label: 'ヒアリング', icon: FileText },
  { id: 'pres1', label: 'デザイン', icon: Home },
  { id: 'pres2', label: '標準仕様', icon: Building },
  { id: 'pres3', label: 'オプション', icon: Wrench },
  { id: 'pres4', label: '資金計画', icon: DollarSign },
  { id: 'pres5', label: '光熱費', icon: TrendingUp },
];

const presentationComponents = {
  pres1: Presentation1View,
  pres2: Presentation2CrownUnified,
  pres3: OptionsSlideRevised,
  pres4: Presentation4View,
  pres5: SolarSimulatorConclusionFirst,
};

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, currentProject, setCurrentProject, updateProject } = useStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(true);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [formData, setFormData] = useState<{
    projectName: string;
    customerName: string;
    salesPerson: string;
    status: 'draft' | 'presented' | 'contracted' | 'archived';
  }>({
    projectName: '',
    customerName: '',
    salesPerson: '',
    status: 'draft',
  });

  useEffect(() => {
    const project = projects.find((p) => p.id === params.id);
    if (project) {
      setCurrentProject(project);
      setFormData({
        projectName: project.projectName,
        customerName: project.customerName,
        salesPerson: project.salesPerson,
        status: project.status,
      });
    } else {
      router.push('/dashboard');
    }
  }, [params.id, projects, setCurrentProject, router]);

  const handleSave = () => {
    if (currentProject) {
      updateProject(currentProject.id, formData);
      alert('保存しました');
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        <div className="container-fluid mx-auto py-4 px-4">
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-xl font-bold">{currentProject.projectName}</h1>
              <span className="text-sm text-gray-500">顧客: {currentProject.customerName}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="default" size="sm">
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              {activeTab.startsWith('pres') && (
                <Button onClick={togglePreview} variant="outline" size="sm">
                  {showPreview ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      プレビューを隠す
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      プレビュー表示
                    </>
                  )}
                </Button>
              )}
              <Link href={`/project/${currentProject.id}/present-flow`}>
                <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="mr-2 h-4 w-4" />
                  プレゼンモード
                </Button>
              </Link>
            </div>
          </div>

          <div className={showPreview && activeTab.startsWith('pres') ? 'grid grid-cols-2 gap-4' : ''}>
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 w-full mb-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1 text-xs">
                        <Icon className="h-3 w-3" />
                        <span>{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <TabsContent value="basic">
                  <Card>
                    <CardHeader>
                      <CardTitle>基本情報</CardTitle>
                      <CardDescription>案件の基本情報を入力してください</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectName">案件名</Label>
                          <Input
                            id="projectName"
                            value={formData.projectName}
                            onChange={(e) => handleInputChange('projectName', e.target.value)}
                            placeholder="例: 〇〇様邸新築工事"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customerName">顧客名</Label>
                          <Input
                            id="customerName"
                            value={formData.customerName}
                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                            placeholder="例: 山田太郎"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salesPerson">営業担当者</Label>
                          <Input
                            id="salesPerson"
                            value={formData.salesPerson}
                            onChange={(e) => handleInputChange('salesPerson', e.target.value)}
                            placeholder="例: 佐藤花子"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">ステータス</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) => handleInputChange('status', value)}
                          >
                            <SelectTrigger id="status">
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

                <TabsContent value="hearing">
                  <HearingSheetEditor projectId={currentProject.id} />
                </TabsContent>

                <TabsContent value="pres1">
                  <Presentation1Editor projectId={currentProject.id} />
                </TabsContent>

                <TabsContent value="pres2">
                  <Presentation2Editor projectId={currentProject.id} />
                </TabsContent>

                <TabsContent value="pres3">
                  <Presentation3Editor projectId={currentProject.id} />
                </TabsContent>

                <TabsContent value="pres4">
                  <Presentation4Editor projectId={currentProject.id} />
                </TabsContent>

                <TabsContent value="pres5">
                  <Presentation5Editor projectId={currentProject.id} />
                </TabsContent>
              </Tabs>
            </div>

            {showPreview && activeTab.startsWith('pres') && CurrentPreviewComponent && (
              <div className="sticky top-4">
                <Card className="overflow-hidden shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">プレゼンテーションプレビュー</CardTitle>
                        <CardDescription className="text-gray-300">実際の表示を確認</CardDescription>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={toggleFullscreenPreview}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 bg-black">
                    {activeTab === 'pres5' ? (
                      // Solar simulator conclusion-first layout
                      <div className="bg-white" style={{ aspectRatio: '1.414 / 1', overflow: 'auto' }}>
                        <SolarSimulatorConclusionFirst projectId={currentProject.id} />
                      </div>
                    ) : (
                      <div style={{ aspectRatio: '1.414 / 1' }}>
                        <PresentationContainer>
                          {activeTab === 'pres2' ? (
                            <Presentation2CrownUnified projectId={currentProject.id} />
                          ) : (
                            <CurrentPreviewComponent projectId={currentProject.id} />
                          )}
                        </PresentationContainer>
                      </div>
                    )}
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
            <div className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex justify-between items-center">
              <div className="text-white">
                <h2 className="text-lg font-semibold">プレビューモード</h2>
                <p className="text-sm text-gray-400">プレゼンテーション表示を確認</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreenPreview}
              >
                <Minimize2 className="mr-2 h-4 w-4" />
                閉じる
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              {activeTab === 'pres5' ? (
                // Solar simulator conclusion-first layout
                <SolarSimulatorConclusionFirst projectId={currentProject.id} />
              ) : (
                <PresentationContainer fullscreen>
                  <CurrentPreviewComponent projectId={currentProject.id} />
                </PresentationContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}