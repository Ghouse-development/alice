'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Pencil } from 'lucide-react';
import A3Page from '@/components/A3Page';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

interface InteriorItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// ユニークIDを生成
const generateId = () => `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 配列の長さを保証する関数
function ensureLength<T extends { id: string; label: string; price: number; checked: boolean }>(
  arr: T[],
  len: number,
  createDefault: () => T
): T[] {
  const result = [...arr];
  while (result.length < len) {
    result.push(createDefault());
  }
  return result.slice(0, len);
}

// 初期データ - 外装オプション（既存）
const initialExteriorOptions: OptionItem[] = [
  { id: 'ext1-1', label: '外壁タイル張り', price: 680000, checked: false },
  { id: 'ext1-2', label: '玄関電子錠', price: 120000, checked: false },
  { id: 'ext1-3', label: '宅配ボックス', price: 85000, checked: false },
  { id: 'ext1-4', label: 'カーポート', price: 450000, checked: false },
];

const initialExterior2Options: OptionItem[] = [
  { id: 'ext2-1', label: '太陽光パネル', price: 1200000, checked: false },
  { id: 'ext2-2', label: '蓄電池システム', price: 1650000, checked: false },
  { id: 'ext2-3', label: '防犯カメラ', price: 220000, checked: false },
  { id: 'ext2-4', label: 'シャッター雨戸', price: 380000, checked: false },
];

// 初期データ - 内装オプション（15項目）
const initialInteriorOptions: InteriorItem[] = [
  { id: 'int-1', label: '床暖房（LDK）', price: 450000, checked: false },
  { id: 'int-2', label: '無垢フローリング', price: 380000, checked: false },
  { id: 'int-3', label: 'システムキッチン', price: 650000, checked: false },
  { id: 'int-4', label: '食器洗い乾燥機', price: 180000, checked: false },
  { id: 'int-5', label: 'タンクレストイレ', price: 220000, checked: false },
  { id: 'int-6', label: '浴室乾燥機', price: 120000, checked: false },
  { id: 'int-7', label: '造作家具（リビング）', price: 450000, checked: false },
  { id: 'int-8', label: 'ウォークインクローゼット', price: 280000, checked: false },
  { id: 'int-9', label: '室内物干し', price: 85000, checked: false },
  { id: 'int-10', label: '全館空調システム', price: 980000, checked: false },
  { id: 'int-11', label: '調湿建材', price: 320000, checked: false },
  { id: 'int-12', label: '造作洗面台', price: 280000, checked: false },
  { id: 'int-13', label: 'パントリー', price: 150000, checked: false },
  { id: 'int-14', label: 'ホームシアター', price: 350000, checked: false },
  { id: 'int-15', label: '間接照明', price: 240000, checked: false },
];

// 金額フォーマット
const formatJPY = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

// 統一画像コンポーネント
const ImgFrame = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <span className="text-gray-500 text-sm">{alt}</span>
    )}
  </div>
);

// 追加オプション行コンポーネント
function ExtraOptionRow({
  item,
  onToggle,
  onLabelChange,
  onPriceChange,
}: {
  item: OptionItem;
  onToggle: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onPriceChange: (id: string, price: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1.5">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />
        <input
          value={item.label}
          onChange={(e) => onLabelChange(item.id, e.target.value)}
          placeholder="オプション名"
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </label>
      <input
        type="number"
        value={item.price || ''}
        onChange={(e) => onPriceChange(item.id, parseInt(e.target.value) || 0)}
        placeholder="0"
        className="w-24 text-right border rounded px-2 py-1 text-sm tabular-nums"
      />
    </div>
  );
}

// 内装オプション行コンポーネント
function InteriorOptionRow({
  item,
  onToggle,
  onLabelChange,
  onPriceChange,
}: {
  item: InteriorItem;
  onToggle: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
  onPriceChange: (id: string, price: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-2 py-1">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />
        <input
          value={item.label}
          onChange={(e) => onLabelChange(item.id, e.target.value)}
          placeholder="オプション名"
          className="w-full border rounded px-2 py-0.5 text-xs"
        />
      </label>
      <input
        type="number"
        value={item.price || ''}
        onChange={(e) => onPriceChange(item.id, parseInt(e.target.value) || 0)}
        placeholder="0"
        className="w-20 text-right border rounded px-1 py-0.5 text-xs tabular-nums"
      />
    </div>
  );
}

export default function OptionsSlideFixed({ projectId }: { projectId: string }) {
  // 基本オプション
  const [exteriorOptions, setExteriorOptions] = useState<OptionItem[]>(initialExteriorOptions);
  const [exterior2Options, setExterior2Options] = useState<OptionItem[]>(initialExterior2Options);

  // 追加オプション（必ず4行）
  const [exteriorExtraOptions, setExteriorExtraOptions] = useState<OptionItem[]>(() =>
    ensureLength([], 4, () => ({ id: generateId(), label: '', price: 0, checked: false }))
  );
  const [exterior2ExtraOptions, setExterior2ExtraOptions] = useState<OptionItem[]>(() =>
    ensureLength([], 4, () => ({ id: generateId(), label: '', price: 0, checked: false }))
  );

  // 内装オプション（必ず15行）
  const [interiorOptions, setInteriorOptions] = useState<InteriorItem[]>(() =>
    ensureLength(initialInteriorOptions, 15, () => ({
      id: generateId(),
      label: '',
      price: 0,
      checked: false,
    }))
  );

  const loanSettings = {
    annualRatePercent: 0.8,
    years: 35,
  };

  // トグル関数
  const toggleExteriorOption = (id: string) => {
    setExteriorOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const toggleExterior2Option = (id: string) => {
    setExterior2Options((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const toggleExteriorExtraOption = (id: string) => {
    setExteriorExtraOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const toggleExterior2ExtraOption = (id: string) => {
    setExterior2ExtraOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const toggleInteriorOption = (id: string) => {
    setInteriorOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  // ラベル更新関数
  const updateExteriorExtraLabel = (id: string, label: string) => {
    setExteriorExtraOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, label } : opt)));
  };

  const updateExterior2ExtraLabel = (id: string, label: string) => {
    setExterior2ExtraOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, label } : opt))
    );
  };

  const updateInteriorLabel = (id: string, label: string) => {
    setInteriorOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, label } : opt)));
  };

  // 価格更新関数
  const updateExteriorExtraPrice = (id: string, price: number) => {
    setExteriorExtraOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, price } : opt)));
  };

  const updateExterior2ExtraPrice = (id: string, price: number) => {
    setExterior2ExtraOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, price } : opt))
    );
  };

  const updateInteriorPrice = (id: string, price: number) => {
    setInteriorOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, price } : opt)));
  };

  // 小計計算
  const subtotals = useMemo(() => {
    const exterior1Base = exteriorOptions
      .filter((opt) => opt.checked)
      .reduce((sum, opt) => sum + opt.price, 0);
    const exterior1Extra = exteriorExtraOptions
      .filter((opt) => opt.checked && opt.label)
      .reduce((sum, opt) => sum + opt.price, 0);

    const exterior2Base = exterior2Options
      .filter((opt) => opt.checked)
      .reduce((sum, opt) => sum + opt.price, 0);
    const exterior2Extra = exterior2ExtraOptions
      .filter((opt) => opt.checked && opt.label)
      .reduce((sum, opt) => sum + opt.price, 0);

    const interior = interiorOptions
      .filter((opt) => opt.checked)
      .reduce((sum, opt) => sum + opt.price, 0);

    return {
      exterior1: exterior1Base + exterior1Extra,
      exterior2: exterior2Base + exterior2Extra,
      interior,
    };
  }, [
    exteriorOptions,
    exteriorExtraOptions,
    exterior2Options,
    exterior2ExtraOptions,
    interiorOptions,
  ]);

  const pattern1Total = subtotals.exterior1 + subtotals.interior;
  const pattern2Total = subtotals.exterior2 + subtotals.interior;

  const calculateMonthlyPayment = (total: number): number => {
    const rate = loanSettings.annualRatePercent / 100 / 12;
    const months = loanSettings.years * 12;
    if (total === 0) return 0;
    return Math.round(
      (total * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1)
    );
  };

  return (
    <A3Page
      title="オプション選択"
      subtitle="オプション金額を設定し、予算取りを行います"
      showFooter={false}
    >
      {/* 12列グリッドレイアウト */}
      <div className="grid grid-cols-12 gap-4 h-full p-4">
        {/* 1段目 */}
        {/* A: 外観パターン① - 4列 */}
        <Card className="col-span-4 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-red-50 px-4 py-2">
            <h3 className="text-sm font-semibold text-red-700">A: 外観パターン①</h3>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
            {/* 画像 */}
            <div className="shrink-0 mb-3">
              <ImgFrame alt="外観イメージ①" />
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-2 shrink-0">
              {exteriorOptions.map((opt) => (
                <div key={opt.id} className="grid grid-cols-[1fr_auto] items-center gap-x-2 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <Checkbox
                      checked={opt.checked}
                      onCheckedChange={() => toggleExteriorOption(opt.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="truncate">{opt.label}</span>
                  </label>
                  <span className="text-xs tabular-nums text-right">
                    +{(opt.price / 10000).toFixed(0)}万
                  </span>
                </div>
              ))}
            </div>

            {/* 追加入力行（必ず4行） */}
            <div className="border-t pt-2 space-y-1 flex-1 overflow-auto min-h-0">
              <div className="text-xs font-semibold text-gray-600">追加オプション（4項目）</div>
              {exteriorExtraOptions.map((opt) => (
                <ExtraOptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={toggleExteriorExtraOption}
                  onLabelChange={updateExteriorExtraLabel}
                  onPriceChange={updateExteriorExtraPrice}
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-sm font-semibold text-gray-700 text-right tabular-nums">
              小計: {formatJPY(subtotals.exterior1)}
            </div>
          </div>
        </Card>

        {/* B: 外観パターン② - 4列 */}
        <Card className="col-span-4 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-blue-50 px-4 py-2">
            <h3 className="text-sm font-semibold text-blue-700">B: 外観パターン②</h3>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden min-h-0">
            {/* 画像 */}
            <div className="shrink-0 mb-3">
              <ImgFrame alt="外観イメージ②" />
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-2 shrink-0">
              {exterior2Options.map((opt) => (
                <div key={opt.id} className="grid grid-cols-[1fr_auto] items-center gap-x-2 py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <Checkbox
                      checked={opt.checked}
                      onCheckedChange={() => toggleExterior2Option(opt.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="truncate">{opt.label}</span>
                  </label>
                  <span className="text-xs tabular-nums text-right">
                    +{(opt.price / 10000).toFixed(0)}万
                  </span>
                </div>
              ))}
            </div>

            {/* 追加入力行（必ず4行） */}
            <div className="border-t pt-2 space-y-1 flex-1 overflow-auto min-h-0">
              <div className="text-xs font-semibold text-gray-600">追加オプション（4項目）</div>
              {exterior2ExtraOptions.map((opt) => (
                <ExtraOptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={toggleExterior2ExtraOption}
                  onLabelChange={updateExterior2ExtraLabel}
                  onPriceChange={updateExterior2ExtraPrice}
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-sm font-semibold text-gray-700 text-right tabular-nums">
              小計: {formatJPY(subtotals.exterior2)}
            </div>
          </div>
        </Card>

        {/* C: 内観イメージ - 4列、2行分（大型化） */}
        <Card className="col-span-4 row-span-2 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-green-50 px-4 py-2">
            <h3 className="text-sm font-semibold text-green-700">C: 内観イメージ</h3>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            {/* 4つの画像をA/Bと同じImgFrameで表示 */}
            <div className="grid grid-cols-2 gap-3 h-full">
              <ImgFrame alt="内観イメージ①" />
              <ImgFrame alt="内観イメージ②" />
              <ImgFrame alt="内観イメージ③" />
              <ImgFrame alt="内観イメージ④" />
            </div>
          </CardContent>
        </Card>

        {/* 2段目 */}
        {/* D: 内装オプション - 8列 */}
        <Card className="col-span-8 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-purple-50 px-4 py-2">
            <h3 className="text-sm font-semibold text-purple-700">D: 内装オプション（15項目）</h3>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-auto min-h-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {interiorOptions.map((opt) => (
                <InteriorOptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={toggleInteriorOption}
                  onLabelChange={updateInteriorLabel}
                  onPriceChange={updateInteriorPrice}
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-sm font-semibold text-gray-700 text-right tabular-nums">
              内装合計: {formatJPY(subtotals.interior)}
            </div>
          </div>
        </Card>

        {/* E: 外観パターン①＋内装 - 2列 */}
        <Card className="col-span-2 flex flex-col min-h-0 overflow-hidden rounded-lg border border-amber-400">
          <CardHeader className="shrink-0 bg-amber-100 px-4 py-2">
            <h3 className="text-xs font-bold text-amber-700">E: 外観①＋内装</h3>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col justify-center">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-lg font-bold text-amber-700 tabular-nums">
                  {formatJPY(pattern1Total)}
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="text-xs text-gray-600">月額(目安)</div>
                <div className="text-base font-bold text-amber-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern1Total))}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  金利{loanSettings.annualRatePercent}%／{loanSettings.years}年
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* F: 外観パターン②＋内装 - 2列 */}
        <Card className="col-span-2 flex flex-col min-h-0 overflow-hidden rounded-lg border border-cyan-400">
          <CardHeader className="shrink-0 bg-cyan-100 px-4 py-2">
            <h3 className="text-xs font-bold text-cyan-700">F: 外観②＋内装</h3>
          </CardHeader>
          <CardContent className="flex-1 p-4 flex flex-col justify-center">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-lg font-bold text-cyan-700 tabular-nums">
                  {formatJPY(pattern2Total)}
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="text-xs text-gray-600">月額(目安)</div>
                <div className="text-base font-bold text-cyan-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern2Total))}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  金利{loanSettings.annualRatePercent}%／{loanSettings.years}年
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </A3Page>
  );
}
