'use client';

import React, { useState, useEffect } from 'react';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
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
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  icon: string;
}

const defaultSlides: SlideItem[] = [
  { id: 'product', title: '商品ラインナップ', subtitle: 'あなたのライフスタイルに最適な住まいを', enabled: true, icon: 'Star' },
  { id: 'earthquake', title: '耐震性能', subtitle: '最先端技術で実現する究極の安全性', enabled: true, icon: 'Shield' },
  { id: 'insulation', title: '断熱・気密性能', subtitle: '世界トップクラスの性能で実現する快適空間', enabled: true, icon: 'Home' },
  { id: 'air', title: '空気質管理', subtitle: '最新テクノロジーで実現するクリーンエア', enabled: true, icon: 'Wind' },
  { id: 'hvac', title: '空調計画', subtitle: '科学的設計で実現する理想の温熱環境', enabled: true, icon: 'Thermometer' },
  { id: 'durability', title: '耐久性', subtitle: '100年住み継げる家づくり', enabled: true, icon: 'Clock' },
  { id: 'design', title: 'デザイン性', subtitle: '性能美と機能美の完璧な融合', enabled: true, icon: 'Palette' },
  { id: 'quality', title: '施工品質', subtitle: '職人の技術力と最新技術の融合', enabled: true, icon: 'CheckCircle' },
  { id: 'warranty', title: '保証・アフターサービス', subtitle: '業界最長60年保証で生涯安心', enabled: true, icon: 'Award' },
  { id: 'energy', title: '省エネ性', subtitle: 'エネルギー自給自足の実現', enabled: true, icon: 'Zap' },
  { id: 'tech', title: '最新テクノロジー', subtitle: 'IoT×AIで実現する未来の暮らし', enabled: true, icon: 'Cpu' },
];

interface SortableItemProps {
  item: SlideItem;
  onToggle: (id: string) => void;
}

function SortableItem({ item, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="cursor-grab hover:cursor-grabbing"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-5 w-5 text-gray-400" />
              </button>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.enabled ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
              <Switch
                checked={item.enabled}
                onCheckedChange={() => onToggle(item.id)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SlideOrderEditorProps {
  projectId: string;
}

export function SlideOrderEditor({ projectId }: SlideOrderEditorProps) {
  const { getSlideOrder, updateSlideOrder } = useStore();
  const [slides, setSlides] = useState<SlideItem[]>(defaultSlides);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedOrder = getSlideOrder(projectId);
    if (savedOrder && savedOrder.length > 0) {
      setSlides(savedOrder);
    }
  }, [projectId, getSlideOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const handleToggle = (id: string) => {
    setSlides((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSlideOrder(projectId, slides);
    setHasChanges(false);
    alert('スライド順番を保存しました');
  };

  const handleReset = () => {
    setSlides(defaultSlides);
    setHasChanges(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>スライド順番設定</CardTitle>
            <CardDescription>
              ドラッグ＆ドロップでスライドの順番を変更できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={slides.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {slides.map((slide) => (
                  <SortableItem
                    key={slide.id}
                    item={slide}
                    onToggle={handleToggle}
                  />
                ))}
              </SortableContext>
            </DndContext>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSave}
                disabled={!hasChanges}
                className="flex-1"
              >
                変更を保存
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={!hasChanges}
              >
                リセット
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>プレビュー</CardTitle>
            <CardDescription>
              有効なスライドのみが表示されます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slides
                .filter((slide) => slide.enabled)
                .map((slide, index) => (
                  <div
                    key={slide.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-semibold text-gray-500">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{slide.title}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>有効スライド数:</strong> {slides.filter((s) => s.enabled).length} / {slides.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}