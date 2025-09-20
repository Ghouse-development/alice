'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Home } from 'lucide-react';

interface CurrentResidenceData {
  area?: number;  // ㎡数
  rent?: number;  // 家賃
  electricity?: number;  // 電気代
  gas?: number;  // ガス代
  parking?: number;  // 駐車場代
}

interface CurrentResidenceInputProps {
  onDataChange: (data: CurrentResidenceData) => void;
  initialData?: CurrentResidenceData;
}

export default function CurrentResidenceInput({ onDataChange, initialData }: CurrentResidenceInputProps) {
  const [data, setData] = useState<CurrentResidenceData>(initialData || {
    area: 0,
    rent: 0,
    electricity: 8000,  // デフォルト値
    gas: 5000,  // デフォルト値
    parking: 0,
  });

  useEffect(() => {
    onDataChange(data);
  }, [data]);

  const handleChange = (field: keyof CurrentResidenceData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // 坪数を計算
  const tsubo = data.area ? (data.area * 0.3025).toFixed(1) : '0';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          現在のお住まい情報
        </CardTitle>
        <CardDescription>
          現在の住居費用を入力してください（月額支払いの比較に使用されます）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="area">
              床面積（㎡）
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="area"
                type="number"
                value={data.area || ''}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="100"
                className="flex-1"
              />
              <span className="text-sm text-gray-500 min-w-[60px]">
                {tsubo}坪
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">家賃（円/月）</Label>
            <Input
              id="rent"
              type="number"
              value={data.rent || ''}
              onChange={(e) => handleChange('rent', e.target.value)}
              placeholder="80000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricity">電気代（円/月）</Label>
            <Input
              id="electricity"
              type="number"
              value={data.electricity || ''}
              onChange={(e) => handleChange('electricity', e.target.value)}
              placeholder="8000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gas">ガス代（円/月）</Label>
            <Input
              id="gas"
              type="number"
              value={data.gas || ''}
              onChange={(e) => handleChange('gas', e.target.value)}
              placeholder="5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parking">駐車場代（円/月）</Label>
            <Input
              id="parking"
              type="number"
              value={data.parking || ''}
              onChange={(e) => handleChange('parking', e.target.value)}
              placeholder="10000"
            />
          </div>

          <div className="space-y-2">
            <Label>月額合計</Label>
            <div className="text-2xl font-bold text-gray-900">
              ¥{((data.rent || 0) + (data.electricity || 0) + (data.gas || 0) + (data.parking || 0)).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}