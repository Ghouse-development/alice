'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import type { Presentation5, AfterServiceItem } from '@/types';

interface Presentation5EditorProps {
  projectId: string;
}

const defaultAfterServiceItems: AfterServiceItem[] = [
  {
    id: '1',
    title: '定期点検サービス',
    description: '3ヶ月、6ヶ月、1年、2年、5年、10年の定期点検を実施。専門スタッフが建物の状態を詳しくチェックし、必要なメンテナンスをご提案します。',
    period: '10年間',
  },
  {
    id: '2',
    title: '24時間緊急対応',
    description: '水漏れ、電気系統のトラブル、鍵の紛失など、緊急時には24時間365日対応。専用ダイヤルで迅速に対応いたします。',
    period: '永年',
  },
  {
    id: '3',
    title: '住宅設備10年保証',
    description: 'キッチン、浴室、トイレなどの住宅設備機器は10年間の長期保証。故障時の修理・交換を保証します。',
    period: '10年間',
  },
  {
    id: '4',
    title: '構造躯体20年保証',
    description: '基礎、柱、梁、屋根などの構造躯体部分は20年間の長期保証。構造的な欠陥による不具合を保証します。',
    period: '20年間',
  },
  {
    id: '5',
    title: '防水10年保証',
    description: '屋根、外壁、ベランダなどの防水部分は10年間保証。雨漏りなどのトラブルに対応します。',
    period: '10年間',
  },
  {
    id: '6',
    title: 'シロアリ10年保証',
    description: '防蟻処理を施工し、10年間のシロアリ被害を保証。定期的な点検も実施します。',
    period: '10年間',
  },
  {
    id: '7',
    title: '住まいのコンシェルジュサービス',
    description: 'リフォーム、メンテナンス、住宅ローンの借り換えなど、住まいに関するあらゆるご相談に専門スタッフが対応します。',
    period: '永年',
  },
  {
    id: '8',
    title: 'オーナー様限定イベント',
    description: '年2回のオーナー様感謝祭、住まいのメンテナンス講習会など、オーナー様限定のイベントを開催します。',
    period: '永年',
  },
];

export function Presentation5Editor({ projectId }: Presentation5EditorProps) {
  const { currentProject, updatePresentation5 } = useStore();
  const [afterServiceItems, setAfterServiceItems] = useState<AfterServiceItem[]>(defaultAfterServiceItems);

  useEffect(() => {
    if (currentProject?.presentation5?.afterServiceItems) {
      setAfterServiceItems(currentProject.presentation5.afterServiceItems);
    }
  }, [currentProject]);

  const updateItem = (id: string, field: keyof AfterServiceItem, value: any) => {
    const newItems = afterServiceItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setAfterServiceItems(newItems);
    savePresentation(newItems);
  };

  const addItem = () => {
    const newItem: AfterServiceItem = {
      id: `service-${Date.now()}`,
      title: '新規サービス',
      description: '',
      period: '',
    };
    const newItems = [...afterServiceItems, newItem];
    setAfterServiceItems(newItems);
    savePresentation(newItems);
  };

  const removeItem = (id: string) => {
    const newItems = afterServiceItems.filter((item) => item.id !== id);
    setAfterServiceItems(newItems);
    savePresentation(newItems);
  };

  const savePresentation = (items: AfterServiceItem[]) => {
    const presentation5: Partial<Presentation5> = {
      id: currentProject?.presentation5?.id || `pres5-${Date.now()}`,
      projectId,
      afterServiceItems: items,
    };
    updatePresentation5(projectId, presentation5);
  };

  const handleImageUpload = (itemId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const images: string[] = [];
        let loadedCount = 0;

        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            images.push(event.target?.result as string);
            loadedCount++;

            if (loadedCount === files.length) {
              const item = afterServiceItems.find((i) => i.id === itemId);
              if (item) {
                updateItem(itemId, 'images', [...(item.images || []), ...images]);
              }
            }
          };
          reader.readAsDataURL(file);
        });
      }
    };

    input.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>アフターサービス・保証内容</CardTitle>
          <CardDescription>
            お引き渡し後のサポート体制と保証内容を設定します
          </CardDescription>
          <div className="flex justify-end">
            <Button onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              サービスを追加
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {afterServiceItems.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>サービス名</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                    placeholder="サービス名を入力"
                  />
                </div>
                <div>
                  <Label>説明</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="サービスの詳細説明を入力"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>保証期間</Label>
                  <Input
                    value={item.period}
                    onChange={(e) => updateItem(item.id, 'period', e.target.value)}
                    placeholder="例: 10年間、永年"
                  />
                </div>
                <div>
                  <Label>画像</Label>
                  <div className="flex gap-2 mt-2">
                    {item.images?.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${item.title}-${imgIndex}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageUpload(item.id)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>保証内容サマリー</CardTitle>
          <CardDescription>
            主要な保証期間の一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {afterServiceItems
              .filter((item) => item.period)
              .map((item) => (
                <div key={item.id} className="flex justify-between p-3 rounded-lg bg-gray-50">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-primary font-bold">{item.period}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}