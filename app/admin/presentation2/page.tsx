'use client';

import { useState } from 'react';
import { Save, ArrowLeft, Eye, Image, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Presentation2CrownUnified from '@/components/Presentation2CrownUnified';

interface PerformanceContent {
  id: string;
  category: string;
  title: string;
  description: string;
  contentType: 'default' | 'custom' | 'upload';
  customComponent?: string;
  images?: string[];
}

const defaultContents: PerformanceContent[] = [
  {
    id: '1',
    category: '耐震',
    title: '最高等級の耐震性能 × evoltz制震システム',
    description: 'ビルシュタイン社と共同開発したevoltz制震ダンパーにより、地震の揺れを最大45%低減。耐震等級3と制震技術の組み合わせで、大地震後も住み続けられる安心を提供します。',
    contentType: 'custom',
    customComponent: 'EarthquakeResistanceSlide',
  },
  {
    id: '2',
    category: '断熱・気密',
    title: 'HEAT20 G2グレードの高断熱・高気密設計',
    description: 'UA値0.46以下、C値0.5以下を実現。北海道基準の断熱性能により、夏涼しく冬暖かい快適な住環境を一年中提供します。',
    contentType: 'default',
  },
  {
    id: '3',
    category: '空気質',
    title: '清潔空気システム',
    description: '高性能フィルターでPM2.5、花粉を99.8%カット。常に新鮮で清潔な空気を供給し、アレルギー対策にも効果的です。',
    contentType: 'default',
  },
  {
    id: '4',
    category: '空調計画',
    title: '24時間全熱交換換気システム',
    description: '第一種換気システムで熱ロスを最小限に抑え、省エネと快適性を両立。湿度調整機能で結露も防止します。',
    contentType: 'default',
  },
  {
    id: '5',
    category: '耐久性',
    title: '長期優良住宅認定・100年住宅',
    description: '劣化対策等級3、維持管理対策等級3を取得。構造躯体は100年以上の耐久性を実現し、メンテナンスコストも大幅削減。',
    contentType: 'default',
  },
  {
    id: '6',
    category: 'デザイン性',
    title: '洗練された外観と機能美の融合',
    description: '建築家とのコラボレーションにより、街並みに調和しながらも個性的な外観デザインを実現。採光と通風を考慮した美しく機能的な設計。',
    contentType: 'default',
  },
  {
    id: '7',
    category: '施工品質',
    title: '自社大工による匠の技術',
    description: '経験豊富な自社大工による丁寧な施工。第三者機関による10回検査と、施工中の見える化により、最高品質を保証します。',
    contentType: 'default',
  },
  {
    id: '8',
    category: '保証・アフターサービス',
    title: '業界最長クラスの安心保証',
    description: '構造躯体35年保証、防水20年保証、シロアリ10年保証。24時間365日の緊急対応と、50年間の定期点検プログラムで末永く安心。',
    contentType: 'default',
  },
  {
    id: '9',
    category: '省エネ性',
    title: 'ZEH基準を超える省エネ性能',
    description: '太陽光発電5.5kW標準搭載、HEMS導入により光熱費を50%以上削減。売電収入と合わせて実質光熱費ゼロも実現可能です。',
    contentType: 'default',
  },
  {
    id: '10',
    category: '最新テクノロジー（IoT）',
    title: 'スマートホーム標準装備',
    description: 'Google Home/Alexa対応、スマートロック、見守りカメラ、遠隔家電操作など、最新のIoT技術で快適で安全な暮らしをサポート。',
    contentType: 'default',
  },
];

export default function AdminPresentation2Page() {
  const [contents, setContents] = useState<PerformanceContent[]>(defaultContents);
  const [selectedCategory, setSelectedCategory] = useState<string>('耐震');
  const [showPreview, setShowPreview] = useState(false);

  const selectedContent = contents.find(c => c.category === selectedCategory);

  const updateContent = (category: string, field: keyof PerformanceContent, value: string) => {
    setContents(contents.map(content =>
      content.category === category
        ? { ...content, [field]: value }
        : content
    ));
  };

  const handleSave = () => {
    // 実際のアプリケーションではここでバックエンドに保存
    localStorage.setItem('presentation2Contents', JSON.stringify(contents));
    alert('保存しました');
  };

  const moveContent = (index: number, direction: 'up' | 'down') => {
    const newContents = [...contents];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newContents.length) return;

    [newContents[index], newContents[newIndex]] = [newContents[newIndex], newContents[index]];
    setContents(newContents);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/master">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  マスタ管理に戻る
                </Button>
              </Link>
              <h1 className="text-xl font-bold">プレゼンテーション2 コンテンツ管理</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'エディタ' : 'プレビュー'}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {showPreview ? (
          // プレビューモード
          <Card>
            <CardHeader>
              <CardTitle>{selectedContent?.category} - プレビュー</CardTitle>
              <CardDescription>A3横サイズ（420mm × 297mm）での表示イメージ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden" style={{ aspectRatio: '1.414 / 1' }}>
                <Presentation2CrownUnified
                  projectId="admin-preview"
                  fixedSlide={contents.findIndex(c => c.category === selectedCategory)}
                  performanceItems={contents}
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          // 編集モード
          <div className="grid grid-cols-3 gap-6">
            {/* 左側：カテゴリリスト */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>カテゴリ一覧</CardTitle>
                  <CardDescription>表示順序の管理</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contents.map((content, index) => (
                    <div
                      key={content.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedCategory === content.category
                          ? 'bg-primary/10 border-primary'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(content.category)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium">{content.category}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveContent(index, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveContent(index, 'down');
                          }}
                          disabled={index === contents.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 右側：コンテンツ編集 */}
            <div className="col-span-2">
              {selectedContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedContent.category} の編集</CardTitle>
                    <CardDescription>スライド内容の設定</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>タイトル</Label>
                      <Input
                        value={selectedContent.title}
                        onChange={(e) => updateContent(selectedCategory, 'title', e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>説明文</Label>
                      <Textarea
                        value={selectedContent.description}
                        onChange={(e) => updateContent(selectedCategory, 'description', e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>コンテンツタイプ</Label>
                      <Select
                        value={selectedContent.contentType}
                        onValueChange={(value) => updateContent(selectedCategory, 'contentType', value)}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">標準レイアウト</SelectItem>
                          <SelectItem value="custom">カスタムコンポーネント</SelectItem>
                          <SelectItem value="upload">画像アップロード</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedContent.contentType === 'custom' && (
                      <div>
                        <Label>カスタムコンポーネント</Label>
                        <Select
                          value={selectedContent.customComponent || ''}
                          onValueChange={(value) => updateContent(selectedCategory, 'customComponent', value)}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EarthquakeResistanceSlide">耐震性能スライド（evoltz）</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedContent.contentType === 'upload' && (
                      <div>
                        <Label>スライド画像</Label>
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">画像をアップロード</p>
                          <p className="text-sm text-gray-500 mt-1">A3横（420mm × 297mm）推奨</p>
                          <Button variant="outline" className="mt-4">
                            ファイルを選択
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-900 font-medium mb-2">💡 コンテンツ設定のヒント</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• 標準レイアウト：自動でレイアウトされます</li>
                          <li>• カスタムコンポーネント：専用デザインを使用</li>
                          <li>• 画像アップロード：PDFや画像を直接表示</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}