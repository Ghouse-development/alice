'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { A3SlideTemplate } from './A3SlideTemplate';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  category: 'exterior1' | 'exterior2' | 'interior';
}

const optionsData: OptionItem[] = [
  // 外装1（パターン1）
  { id: 'ext1-1', label: '外壁タイル張り', price: 680000, category: 'exterior1' },
  { id: 'ext1-2', label: '玄関電子錠', price: 120000, category: 'exterior1' },
  { id: 'ext1-3', label: '宅配ボックス', price: 85000, category: 'exterior1' },
  { id: 'ext1-4', label: 'カーポート（2台用）', price: 450000, category: 'exterior1' },
  { id: 'ext1-5', label: '門扉・フェンス', price: 320000, category: 'exterior1' },
  { id: 'ext1-6', label: '外構照明', price: 180000, category: 'exterior1' },
  { id: 'ext1-7', label: 'ウッドデッキ', price: 280000, category: 'exterior1' },
  { id: 'ext1-8', label: '物置（大型）', price: 150000, category: 'exterior1' },

  // 外装2（パターン2）
  { id: 'ext2-1', label: '太陽光パネル（6kW）', price: 1200000, category: 'exterior2' },
  { id: 'ext2-2', label: '蓄電池システム', price: 1650000, category: 'exterior2' },
  { id: 'ext2-3', label: '防犯カメラ（4台）', price: 220000, category: 'exterior2' },
  { id: 'ext2-4', label: 'シャッター雨戸', price: 380000, category: 'exterior2' },
  { id: 'ext2-5', label: '断熱玄関ドア', price: 250000, category: 'exterior2' },
  { id: 'ext2-6', label: 'バルコニー屋根', price: 180000, category: 'exterior2' },
  { id: 'ext2-7', label: '樹脂サッシ', price: 420000, category: 'exterior2' },
  { id: 'ext2-8', label: '外断熱工法', price: 850000, category: 'exterior2' },

  // 内装
  { id: 'int-1', label: '床暖房（LDK）', price: 450000, category: 'interior' },
  { id: 'int-2', label: '無垢フローリング', price: 380000, category: 'interior' },
  { id: 'int-3', label: 'システムキッチン（グレードアップ）', price: 650000, category: 'interior' },
  { id: 'int-4', label: '食器洗い乾燥機', price: 180000, category: 'interior' },
  { id: 'int-5', label: 'タンクレストイレ', price: 220000, category: 'interior' },
  { id: 'int-6', label: '浴室乾燥機', price: 120000, category: 'interior' },
  { id: 'int-7', label: '造作家具（リビング）', price: 450000, category: 'interior' },
  { id: 'int-8', label: 'ウォークインクローゼット', price: 280000, category: 'interior' },
  { id: 'int-9', label: '室内物干し', price: 85000, category: 'interior' },
  { id: 'int-10', label: '全館空調システム', price: 980000, category: 'interior' },
  { id: 'int-11', label: '調湿建材（エコカラット）', price: 320000, category: 'interior' },
  { id: 'int-12', label: '造作洗面台', price: 280000, category: 'interior' },
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
  const isDark = true; // 暗いテーマを使用
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());

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

  const totalAmount = subtotals.exterior1 + subtotals.exterior2 + subtotals.interior;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ローン計算（簡易版）
  const loanCalculation = useMemo(() => {
    const principal = totalAmount;
    const rate = 0.01 / 12; // 年利1%の月利
    const years = 35;
    const months = years * 12;

    if (principal === 0) return { monthly: 0, total: 0 };

    const monthly = Math.round((principal * rate) / (1 - Math.pow(1 + rate, -months)));
    const total = monthly * months;

    return { monthly, total };
  }, [totalAmount]);

  return (
    <A3SlideTemplate title="オプション選択" subtitle={`${customerName}様 プロジェクト`}>
      <div className="h-full flex flex-col">
        {/* ヘッダー - Presentation2と統一 */}
        <div
          className={`relative border-b ${isDark ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30' : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'}`}
        >
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">
                    G-HOUSE
                  </span>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <span
                  className={`text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-red-600 pb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  オプション選択
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* カテゴリヘッダー */}
          <div className="flex justify-center gap-12 max-w-6xl mx-auto mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-red-600"></div>
              <span className="text-red-400 font-medium tracking-wider">外装オプション</span>
              <div className="w-12 h-[2px] bg-red-600"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-[2px] bg-blue-600"></div>
              <span className="text-blue-400 font-medium tracking-wider">内装・設備オプション</span>
              <div className="w-12 h-[2px] bg-blue-600"></div>
            </div>
          </div>

          {/* 4カラムグリッド */}
          <div className="grid grid-cols-4 gap-4">
            {/* 外装オプション1 */}
            <Card className="h-full flex flex-col overflow-hidden bg-black/40 backdrop-blur-sm border border-gray-800">
              <CardHeader className="pb-2 px-3 flex-shrink-0 bg-gradient-to-r from-red-900/20 to-transparent border-b border-red-900/30">
                <CardTitle className="text-sm text-red-400 font-bold tracking-wider">
                  外装パターン①
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 flex flex-col flex-1 min-h-0">
                {/* 画像プレースホルダー */}
                <div className="aspect-[4/3] bg-gray-900/50 rounded flex items-center justify-center border border-gray-700 mb-2 flex-shrink-0">
                  <span className="text-gray-500 text-xs">外観イメージ1</span>
                </div>

                {/* オプションリスト */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  <div className="space-y-1">
                    {exterior1Options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-0.5 border-b border-gray-700/30"
                      >
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Checkbox
                            id={option.id}
                            checked={selectedOptions.has(option.id)}
                            onCheckedChange={() => toggleOption(option.id)}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <Label
                            htmlFor={option.id}
                            className="text-xs cursor-pointer truncate text-gray-300"
                            title={option.label}
                          >
                            {option.label}
                          </Label>
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-1 tabular-nums flex-shrink-0">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 小計 */}
                <div className="bg-red-900/20 border border-red-900/30 p-2 rounded mt-2 flex-shrink-0">
                  <div className="text-xs text-red-400 font-bold text-center">
                    小計: {formatPrice(subtotals.exterior1)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 外装オプション2 */}
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-2 px-3 flex-shrink-0">
                <CardTitle className="text-sm text-red-600 font-bold">外装パターン②</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 flex flex-col flex-1 min-h-0">
                {/* 画像プレースホルダー */}
                <div className="aspect-[4/3] bg-gray-100 rounded flex items-center justify-center border border-gray-200 mb-2 flex-shrink-0">
                  <span className="text-gray-400 text-xs">外観イメージ2</span>
                </div>

                {/* オプションリスト */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  <div className="space-y-1">
                    {exterior2Options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-0.5 border-b border-gray-700/30"
                      >
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Checkbox
                            id={option.id}
                            checked={selectedOptions.has(option.id)}
                            onCheckedChange={() => toggleOption(option.id)}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <Label
                            htmlFor={option.id}
                            className="text-xs cursor-pointer truncate text-gray-300"
                            title={option.label}
                          >
                            {option.label}
                          </Label>
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-1 tabular-nums flex-shrink-0">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 小計 */}
                <div className="bg-red-50 p-2 rounded mt-2 flex-shrink-0">
                  <div className="text-xs text-red-600 font-bold text-center">
                    小計: {formatPrice(subtotals.exterior2)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 内装オプション - 2カラム分の幅 */}
            <Card className="col-span-2 h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-2 px-3 flex-shrink-0">
                <CardTitle className="text-sm text-blue-600 font-bold">
                  内装・設備オプション
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 flex flex-col flex-1 min-h-0">
                {/* 画像プレースホルダー */}
                <div className="h-24 bg-gray-100 rounded flex items-center justify-center border border-gray-200 mb-2 flex-shrink-0">
                  <span className="text-gray-400 text-xs">内装イメージ</span>
                </div>

                {/* オプションリスト - 2列グリッド */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {interiorOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between py-0.5 border-b border-gray-700/30"
                      >
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <Checkbox
                            id={option.id}
                            checked={selectedOptions.has(option.id)}
                            onCheckedChange={() => toggleOption(option.id)}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <Label
                            htmlFor={option.id}
                            className="text-xs cursor-pointer truncate text-gray-300"
                            title={option.label}
                          >
                            {option.label}
                          </Label>
                        </div>
                        <span className="text-xs font-medium text-gray-400 ml-1 tabular-nums flex-shrink-0">
                          {formatPrice(option.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 小計 */}
                <div className="bg-blue-50 p-2 rounded mt-2 flex-shrink-0">
                  <div className="text-xs text-blue-600 font-bold text-center">
                    小計: {formatPrice(subtotals.interior)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 合計セクション */}
          <div className="flex-shrink-0 mt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* オプション合計 */}
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-400">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">オプション合計</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">外装オプション計</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(subtotals.exterior1 + subtotals.exterior2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">内装オプション計</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(subtotals.interior)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">合計金額</span>
                        <span className="text-lg font-bold text-amber-600">
                          {formatPrice(totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ローン試算 */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400">
                <CardContent className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-3">住宅ローン組込み試算</h3>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">金利1.0%、35年返済の場合</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">借入増加額</span>
                      <span className="font-medium text-gray-900">{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">返済総額</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(loanCalculation.total)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">月々の増加額</span>
                        <span className="text-lg font-bold text-green-600">
                          +{formatPrice(loanCalculation.monthly)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </A3SlideTemplate>
  );
}
