'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import A3Page from '@/components/A3Page';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  category: 'exterior1' | 'exterior2' | 'interior';
}

const optionsData: OptionItem[] = [
  // 外装1（パターン1）- 4項目
  { id: 'ext1-1', label: '外壁タイル張り', price: 680000, category: 'exterior1' },
  { id: 'ext1-2', label: '玄関電子錠', price: 120000, category: 'exterior1' },
  { id: 'ext1-3', label: '宅配ボックス', price: 85000, category: 'exterior1' },
  { id: 'ext1-4', label: 'カーポート', price: 450000, category: 'exterior1' },

  // 外装2（パターン2）- 4項目
  { id: 'ext2-1', label: '太陽光パネル', price: 1200000, category: 'exterior2' },
  { id: 'ext2-2', label: '蓄電池システム', price: 1650000, category: 'exterior2' },
  { id: 'ext2-3', label: '防犯カメラ', price: 220000, category: 'exterior2' },
  { id: 'ext2-4', label: 'シャッター雨戸', price: 380000, category: 'exterior2' },

  // 内装 - 20項目
  { id: 'int-1', label: '床暖房（LDK）', price: 450000, category: 'interior' },
  { id: 'int-2', label: '無垢フローリング', price: 380000, category: 'interior' },
  { id: 'int-3', label: 'システムキッチン', price: 650000, category: 'interior' },
  { id: 'int-4', label: '食器洗い乾燥機', price: 180000, category: 'interior' },
  { id: 'int-5', label: 'タンクレストイレ', price: 220000, category: 'interior' },
  { id: 'int-6', label: '浴室乾燥機', price: 120000, category: 'interior' },
  { id: 'int-7', label: '造作家具（リビング）', price: 450000, category: 'interior' },
  { id: 'int-8', label: 'ウォークインクローゼット', price: 280000, category: 'interior' },
  { id: 'int-9', label: '室内物干し', price: 85000, category: 'interior' },
  { id: 'int-10', label: '全館空調システム', price: 980000, category: 'interior' },
  { id: 'int-11', label: '調湿建材', price: 320000, category: 'interior' },
  { id: 'int-12', label: '造作洗面台', price: 280000, category: 'interior' },
  { id: 'int-13', label: 'パントリー', price: 150000, category: 'interior' },
  { id: 'int-14', label: 'ホームシアター', price: 350000, category: 'interior' },
  { id: 'int-15', label: '天窓・トップライト', price: 180000, category: 'interior' },
  { id: 'int-16', label: '間接照明', price: 240000, category: 'interior' },
  { id: 'int-17', label: '防音室', price: 580000, category: 'interior' },
  { id: 'int-18', label: 'ホームエレベーター', price: 2800000, category: 'interior' },
  { id: 'int-19', label: '床下収納', price: 95000, category: 'interior' },
  { id: 'int-20', label: 'オートシャッター', price: 280000, category: 'interior' },
];

interface OptionsSlideFixedProps {
  projectId: string;
  customerName?: string;
  projectDate?: string;
}

export default function OptionsSlideFixed({
  projectId,
  customerName = 'お客様',
  projectDate = new Date().toLocaleDateString('ja-JP'),
}: OptionsSlideFixedProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isInsideContainer, setIsInsideContainer] = useState(false);

  useEffect(() => {
    // PresentationContainer内にいるかチェック
    const container = document.querySelector('.presentation-wrapper');
    setIsInsideContainer(!!container);
  }, []);

  const toggleOption = (optionId: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    setSelectedOptions(newSelected);
  };

  const { exterior1Options, exterior2Options, interiorOptions } = useMemo(
    () => ({
      exterior1Options: optionsData.filter((opt) => opt.category === 'exterior1'),
      exterior2Options: optionsData.filter((opt) => opt.category === 'exterior2'),
      interiorOptions: optionsData.filter((opt) => opt.category === 'interior'),
    }),
    []
  );

  const calculateSubtotal = (category: 'exterior1' | 'exterior2' | 'interior') => {
    return optionsData
      .filter((opt) => opt.category === category && selectedOptions.has(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
  };

  const subtotals = {
    exterior1: calculateSubtotal('exterior1'),
    exterior2: calculateSubtotal('exterior2'),
    interior: calculateSubtotal('interior'),
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // パターン①とパターン②の合計
  const pattern1Total = subtotals.exterior1 + subtotals.interior;
  const pattern2Total = subtotals.exterior2 + subtotals.interior;

  // ローン計算（簡易版）
  const calculateMonthlyPayment = (total: number) => {
    const rate = 0.01 / 12; // 年利1%の月利
    const months = 35 * 12; // 35年
    if (total === 0) return 0;
    return Math.round((total * rate) / (1 - Math.pow(1 + rate, -months)));
  };

  // 全ての場合で同じレイアウトを使用（A3Pageを使わない）
  return (
    <A3Page title="オプション選択" subtitle={`${customerName}様 プロジェクト`} showFooter={false}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '10px',
          width: '100%',
          height: 'calc(100% - 20px)',
          padding: '10px 0',
          margin: 0,
        }}
      >
        {/* A: 外観パターン① */}
        <div>
          <Card className="h-full flex flex-col border-gray-300">
            <CardHeader className="p-2 bg-red-50">
              <CardTitle className="text-sm font-bold text-red-700">A: 外観パターン①</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col flex-1">
              {/* 画像スペース */}
              <div
                className="bg-gray-100 rounded flex items-center justify-center text-[9px] text-gray-500 mb-2"
                style={{ height: '90px' }}
              >
                外観イメージ①
              </div>
              {/* オプション項目 */}
              <div className="space-y-0.5 flex-1">
                {exterior1Options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-0.5">
                      <Checkbox
                        id={opt.id}
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
                        className="w-2.5 h-2.5"
                      />
                      <Label htmlFor={opt.id} className="text-[10px] cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                    <span className="text-[10px] text-gray-600">{opt.price / 10000}万</span>
                  </div>
                ))}
              </div>
              {/* 小計 */}
              <div className="border-t pt-1 mt-1">
                <div className="text-[10px] font-bold text-red-700">
                  小計: {formatPrice(subtotals.exterior1)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* B: 外観パターン② */}
        <div>
          <Card className="h-full flex flex-col border-gray-300">
            <CardHeader className="p-2 bg-blue-50">
              <CardTitle className="text-sm font-bold text-blue-700">B: 外観パターン②</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col flex-1">
              {/* 画像スペース */}
              <div
                className="bg-gray-100 rounded flex items-center justify-center text-[9px] text-gray-500 mb-2"
                style={{ height: '90px' }}
              >
                外観イメージ②
              </div>
              {/* オプション項目 */}
              <div className="space-y-0.5 flex-1">
                {exterior2Options.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between py-0.5">
                    <div className="flex items-center gap-0.5">
                      <Checkbox
                        id={opt.id}
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
                        className="w-2.5 h-2.5"
                      />
                      <Label htmlFor={opt.id} className="text-[10px] cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                    <span className="text-[10px] text-gray-600">{opt.price / 10000}万</span>
                  </div>
                ))}
              </div>
              {/* 小計 */}
              <div className="border-t pt-1 mt-1">
                <div className="text-[10px] font-bold text-blue-700">
                  小計: {formatPrice(subtotals.exterior2)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* C: 内観イメージ */}
        <div>
          <Card className="h-full flex flex-col border-gray-300">
            <CardHeader className="p-2 bg-green-50">
              <CardTitle className="text-sm font-bold text-green-700">C: 内観イメージ</CardTitle>
            </CardHeader>
            <CardContent className="p-1.5 flex-1">
              <div className="grid grid-cols-2 gap-1 h-full">
                <div className="bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-500">
                  リビング
                </div>
                <div className="bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-500">
                  キッチン
                </div>
                <div className="bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-500">
                  浴室
                </div>
                <div className="bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-500">
                  寝室
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* D: 内装オプション - 上半分 */}
        <div>
          <Card className="h-full flex flex-col border-gray-300">
            <CardHeader className="p-2 bg-purple-50">
              <CardTitle className="text-sm font-bold text-purple-700">D: 内装オプション</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col flex-1">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  flex: 1,
                  overflowY: 'auto',
                  maxHeight: '200px',
                  fontSize: '6px',
                }}
              >
                {interiorOptions.slice(0, 10).map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between py-0">
                    <div className="flex items-center gap-0.5">
                      <Checkbox
                        id={opt.id}
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
                        className="w-2 h-2"
                      />
                      <Label
                        htmlFor={opt.id}
                        className="text-[6px] cursor-pointer truncate"
                        title={opt.label}
                        style={{ maxWidth: '70px' }}
                      >
                        {opt.label}
                      </Label>
                    </div>
                    <span className="text-[6px] text-gray-600 ml-0.5">{opt.price / 10000}万</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* D2: 内装オプション - 下半分 */}
        <div>
          <Card className="h-full flex flex-col border-gray-300">
            <CardHeader className="p-2 bg-purple-50">
              <CardTitle className="text-sm font-bold text-purple-700">
                D2: 内装オプション続き
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex flex-col flex-1">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  flex: 1,
                  overflowY: 'auto',
                  maxHeight: '200px',
                  fontSize: '6px',
                }}
              >
                {interiorOptions.slice(10, 20).map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between py-0">
                    <div className="flex items-center gap-0.5">
                      <Checkbox
                        id={opt.id}
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
                        className="w-2 h-2"
                      />
                      <Label
                        htmlFor={opt.id}
                        className="text-[6px] cursor-pointer truncate"
                        title={opt.label}
                        style={{ maxWidth: '70px' }}
                      >
                        {opt.label}
                      </Label>
                    </div>
                    <span className="text-[6px] text-gray-600 ml-0.5">{opt.price / 10000}万</span>
                  </div>
                ))}
              </div>
              {/* 小計 */}
              <div className="border-t pt-1 mt-1">
                <div className="text-[10px] font-bold text-purple-700">
                  内装合計: {formatPrice(subtotals.interior)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* E: 見積パターン①（A＋D） */}
        <div>
          <Card className="h-full flex flex-col bg-amber-50 border-amber-400">
            <CardHeader className="p-2 bg-amber-50">
              <CardTitle className="text-sm font-bold text-amber-700">E: パターン①</CardTitle>
            </CardHeader>
            <CardContent className="p-1.5 flex flex-col flex-1 justify-center">
              <div className="text-[7px] text-gray-600 mb-0.5">A + D</div>
              <div className="text-[8px] font-bold text-amber-700 mb-0.5">
                合計: {formatPrice(pattern1Total)}
              </div>
              <div className="border-t pt-0.5">
                <div className="text-[7px] text-gray-600">月々</div>
                <div className="text-[10px] font-bold text-amber-700">
                  {formatPrice(calculateMonthlyPayment(pattern1Total))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* F: 見積パターン②（B＋D） */}
        <div>
          <Card className="h-full flex flex-col bg-cyan-50 border-cyan-400">
            <CardHeader className="p-2 bg-cyan-50">
              <CardTitle className="text-sm font-bold text-cyan-700">F: パターン②</CardTitle>
            </CardHeader>
            <CardContent className="p-1.5 flex flex-col flex-1 justify-center">
              <div className="text-[7px] text-gray-600 mb-0.5">B + D</div>
              <div className="text-[8px] font-bold text-cyan-700 mb-0.5">
                合計: {formatPrice(pattern2Total)}
              </div>
              <div className="border-t pt-0.5">
                <div className="text-[7px] text-gray-600">月々</div>
                <div className="text-[10px] font-bold text-cyan-700">
                  {formatPrice(calculateMonthlyPayment(pattern2Total))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </A3Page>
  );
}
