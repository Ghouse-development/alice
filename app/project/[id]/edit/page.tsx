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
  Shield,
  EyeOff,
  Maximize2,
  Minimize2
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
import { Presentation2View } from '@/components/Presentation2View';
import { Presentation3View } from '@/components/Presentation3View';
import { Presentation4View } from '@/components/Presentation4View';
import { Presentation5View } from '@/components/Presentation5View';

const tabs = [
  { id: 'basic', label: '基本情報', icon: FileText },
  { id: 'hearing', label: 'ヒアリング', icon: FileText },
  { id: 'pres1', label: 'プレゼン1', icon: Home },
  { id: 'pres2', label: 'プレゼン2', icon: Building },
  { id: 'pres3', label: 'プレゼン3', icon: Wrench },
  { id: 'pres4', label: 'プレゼン4', icon: DollarSign },
  { id: 'pres5', label: 'プレゼン5', icon: Shield },
];

const presentationComponents = {
  pres1: Presentation1View,
  pres2: Presentation2View,
  pres3: Presentation3View,
  pres4: Presentation4View,
  pres5: Presentation5View,
};

export default function ProjectEditPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, currentProject, setCurrentProject, updateProject } = useStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    customerName: '',
    salesPerson: '',
    status: 'draft' as const,
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
    <div className="min-h-screen">
      <div className={`${previewFullscreen ? 'hidden' : ''}`}>
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">案件編集: {currentProject.projectName}</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="default">
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              {activeTab.startsWith('pres') && (
                <Button onClick={togglePreview} variant="outline">
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
              <Link href={`/project/${currentProject.id}/present`}>
                <Button variant="outline">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  プレゼンモード
                </Button>
              </Link>
            </div>
          </div>

          <div className={showPreview ? 'grid grid-cols-2 gap-6' : ''}>
            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 w-full mb-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                        <Icon className="h-4 w-4" />
                        <span className="hidden lg:inline">{tab.label}</span>
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

            {showPreview && CurrentPreviewComponent && (
              <div className="sticky top-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gray-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>プレビュー</CardTitle>
                      <CardDescription>お客様に表示される画面</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleFullscreenPreview}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 max-h-[calc(100vh-200px)] overflow-auto">
                    <CurrentPreviewComponent projectId={currentProject.id} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* フルスクリーンプレビュー */}
      {previewFullscreen && CurrentPreviewComponent && (
        <div className="fixed inset-0 bg-white z-50">
          <div className="h-full flex flex-col">
            <div className="bg-gray-50 border-b px-6 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">プレビューモード</h2>
                <p className="text-sm text-gray-600">お客様向けの表示を確認</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreenPreview}
              >
                <Minimize2 className="mr-2 h-4 w-4" />
                閉じる
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-8">
              <div className="max-w-6xl mx-auto">
                <CurrentPreviewComponent projectId={currentProject.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}