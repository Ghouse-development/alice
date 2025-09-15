'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Upload, X, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/lib/store';
import type { Presentation2, PerformanceItem, HearingSheet } from '@/types';

interface Presentation2EditorProps {
  projectId: string;
}

const defaultPerformanceItems: PerformanceItem[] = [
  {
    id: '1',
    category: '耐震',
    title: '最高等級の耐震性能',
    description: '耐震等級3を標準とし、大地震にも安心な構造体を実現。制震ダンパーも選択可能です。',
    priority: 1,
  },
  {
    id: '2',
    category: '断熱・気密',
    title: '高断熱・高気密設計',
    description: 'UA値0.46以下、C値0.5以下を実現し、夏涼しく冬暖かい快適な住環境を提供します。',
    priority: 2,
  },
  {
    id: '3',
    category: '空気質・空調',
    title: '24時間換気システム',
    description: '第一種換気システムにより、常に新鮮な空気を供給。花粉やPM2.5もフィルタリングします。',
    priority: 3,
  },
  {
    id: '4',
    category: '耐久性',
    title: '長期優良住宅認定',
    description: '100年住宅を目指した高耐久設計。メンテナンスしやすい構造で長期的なコスト削減も実現。',
    priority: 4,
  },
  {
    id: '5',
    category: 'デザイン性',
    title: '洗練された外観デザイン',
    description: '現代的でスタイリッシュな外観デザインを実現。街並みに調和しながらも個性的な住まいを提案します。',
    priority: 5,
  },
  {
    id: '6',
    category: '施工品質',
    title: '自社施工による品質管理',
    description: '熟練の自社大工による丁寧な施工。第三者機関による検査も実施し、品質を保証します。',
    priority: 6,
  },
  {
    id: '7',
    category: '保証・アフターサービス',
    title: '充実の長期保証',
    description: '構造躯体20年保証、防水10年保証など充実した保証体制。24時間緊急対応も可能です。',
    priority: 7,
  },
  {
    id: '8',
    category: '省エネ性',
    title: 'ZEH基準クリア',
    description: '太陽光発電システムと高効率設備により、エネルギー収支ゼロを実現可能です。',
    priority: 8,
  },
  {
    id: '9',
    category: '最新テクノロジー（IoT）',
    title: 'スマートホーム対応',
    description: 'スマートフォンで家電や照明をコントロール。防犯・見守り機能も充実しています。',
    priority: 9,
  },
];

export function Presentation2Editor({ projectId }: Presentation2EditorProps) {
  const { currentProject, updatePresentation2 } = useStore();
  const [performanceItems, setPerformanceItems] = useState<PerformanceItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    // ローカルストレージから管理者が設定したコンテンツを取得
    const savedContents = localStorage.getItem('presentation2Contents');
    let baseItems = defaultPerformanceItems;

    if (savedContents) {
      try {
        const contents = JSON.parse(savedContents);
        baseItems = contents.map((content: any, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
          contentType: content.contentType,
          customComponent: content.customComponent,
        }));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }

    if (currentProject?.presentation2?.performanceItems) {
      // 既存の並び順を保持
      const existingOrder = currentProject.presentation2.performanceItems;
      setPerformanceItems(existingOrder);
    } else if (currentProject?.hearingSheet) {
      // ヒアリングシートの優先順位に基づいて並び替え
      const sortedItems = sortItemsByPriority(currentProject.hearingSheet.priorities, baseItems);
      setPerformanceItems(sortedItems);
      savePresentation(sortedItems);
    } else {
      setPerformanceItems(baseItems);
    }
  }, [currentProject]);

  const sortItemsByPriority = (priorities: HearingSheet['priorities'], items: PerformanceItem[] = defaultPerformanceItems) => {
    const priorityMap: { [key: string]: string } = {
      earthquake: '耐震',
      insulation: '断熱・気密',
      airQuality: '空気質・空調',
      durability: '耐久性',
      design: 'デザイン性',
      construction: '施工品質',
      technology: '最新テクノロジー（IoT）',
      energySaving: '省エネ性',
    };

    const sortedKeys = Object.entries(priorities)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([key]) => priorityMap[key])
      .filter(Boolean);

    // 保証・アフターサービスを追加（ヒアリングシートにない項目）
    if (!sortedKeys.includes('保証・アフターサービス')) {
      sortedKeys.push('保証・アフターサービス');
    }

    return items.sort((a, b) => {
      const aIndex = sortedKeys.indexOf(a.category);
      const bIndex = sortedKeys.indexOf(b.category);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const draggedItemContent = performanceItems[draggedItem];
    const newItems = [...performanceItems];
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedItemContent);

    // 優先順位を更新
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setPerformanceItems(updatedItems);
    setDraggedItem(null);
    savePresentation(updatedItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...performanceItems];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newItems.length) return;

    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    // 優先順位を更新
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setPerformanceItems(updatedItems);
    savePresentation(updatedItems);
  };

  // 営業担当者は並び順の変更のみ可能（内容編集は不可）

  const savePresentation = (items: PerformanceItem[]) => {
    const presentation2: Partial<Presentation2> = {
      id: currentProject?.presentation2?.id || `pres2-${Date.now()}`,
      projectId,
      performanceItems: items,
      sortedOrder: items.map((item) => item.id),
    };
    updatePresentation2(projectId, presentation2);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>住宅性能説明項目の表示順序</CardTitle>
          <CardDescription>
            お客様の優先順位に合わせて項目の順序を変更できます。内容の編集は管理者画面から行ってください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {performanceItems.map((item, index) => (
            <Card
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="cursor-move border-2 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="w-px h-8 bg-gray-300" />
                      <span className="text-lg font-semibold">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === performanceItems.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                {item.images && item.images.length > 0 && (
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    カスタムスライド設定済み
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>項目順序について</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            • ヒアリングシートで設定した優先順位が自動的に反映されます
          </p>
          <p className="text-sm text-gray-600">
            • ドラッグ&ドロップまたは矢印ボタンで順序を自由に変更できます
          </p>
          <p className="text-sm text-gray-600">
            • 各項目はA3横サイズ（420mm × 297mm）のスライドとして設計してください
          </p>
          <p className="text-sm text-gray-600">
            • プレゼンモードでは設定した順序で表示されます
          </p>
        </CardContent>
      </Card>
    </div>
  );
}