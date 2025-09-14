'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import type { HearingSheet } from '@/types';

interface HearingSheetEditorProps {
  projectId: string;
}

const priorityItems = [
  { key: 'design', label: 'デザイン性', description: '外観・内観のデザイン重視度' },
  { key: 'earthquake', label: '耐震性', description: '地震に対する強度・安全性' },
  { key: 'insulation', label: '断熱性', description: '夏涼しく冬暖かい住環境' },
  { key: 'airQuality', label: '空気環境', description: '換気・空気清浄性能' },
  { key: 'durability', label: '耐久性', description: '長期的な建物の耐久性' },
  { key: 'construction', label: '施工品質', description: '施工の丁寧さ・品質管理' },
  { key: 'energySaving', label: '省エネ性', description: 'エネルギー効率・光熱費削減' },
  { key: 'technology', label: '最新技術', description: 'スマートホーム・IoT設備' },
] as const;

export function HearingSheetEditor({ projectId }: HearingSheetEditorProps) {
  const { currentProject, updateHearingSheet } = useStore();
  const [priorities, setPriorities] = useState<HearingSheet['priorities']>({
    design: 5,
    earthquake: 5,
    insulation: 5,
    airQuality: 5,
    durability: 5,
    construction: 5,
    energySaving: 5,
    technology: 5,
  });

  useEffect(() => {
    if (currentProject?.hearingSheet) {
      setPriorities(currentProject.hearingSheet.priorities);
    }
  }, [currentProject]);

  const handlePriorityChange = (key: keyof HearingSheet['priorities'], value: number[]) => {
    const newPriorities = { ...priorities, [key]: value[0] };
    setPriorities(newPriorities);

    const hearingSheet: HearingSheet = {
      id: currentProject?.hearingSheet?.id || `hearing-${Date.now()}`,
      projectId,
      priorities: newPriorities,
    };

    updateHearingSheet(projectId, hearingSheet);
  };

  const getSortedPriorities = () => {
    return priorityItems
      .map((item) => ({
        ...item,
        value: priorities[item.key],
      }))
      .sort((a, b) => b.value - a.value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ヒアリングシート</CardTitle>
          <CardDescription>
            お客様の優先順位を1〜10の段階で設定してください（10が最重要）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {priorityItems.map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={item.key} className="text-base font-medium">
                  {item.label}
                </Label>
                <span className="text-2xl font-bold text-primary">
                  {priorities[item.key]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <Slider
                id={item.key}
                min={1}
                max={10}
                step={1}
                value={[priorities[item.key]]}
                onValueChange={(value) => handlePriorityChange(item.key, value)}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>優先順位サマリー</CardTitle>
          <CardDescription>
            設定された優先順位の高い順に表示
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getSortedPriorities().map((item, index) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.value * 10}%` }}
                    />
                  </div>
                  <span className="font-bold text-primary min-w-[2rem] text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}