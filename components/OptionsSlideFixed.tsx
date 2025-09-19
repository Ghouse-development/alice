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
  category: 'exterior1' | 'exterior2' | 'interior' | 'exterior1_add' | 'exterior2_add';
  checked?: boolean;
}

interface InteriorItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// 初期データ - 外装オプション（既存）
const initialExteriorOptions: OptionItem[] = [
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

// 追加外観オプション用の空データ（4つ固定）
const createEmptyAdditionalOptions = (
  category: 'exterior1_add' | 'exterior2_add'
): OptionItem[] => {
  return Array.from({ length: 4 }, (_, i) => ({
    id: `${category}-${i + 1}`,
    label: '',
    price: 0,
    category,
    checked: false,
  }));
};

// 金額フォーマット
const formatJPY = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

// 追加オプション行コンポーネント
function AdditionalOptionRow({
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
      <div className="flex items-center gap-2">
        <Checkbox
          checked={item.checked || false}
          onCheckedChange={() => onToggle(item.id)}
          className="h-4 w-4"
          disabled={!item.label}
        />
        <input
          value={item.label}
          onChange={(e) => onLabelChange(item.id, e.target.value)}
          placeholder="オプション名"
          className="border rounded px-2 py-1 text-xs w-full"
        />
      </div>
      <input
        type="number"
        value={item.price || ''}
        onChange={(e) => onPriceChange(item.id, parseInt(e.target.value) || 0)}
        placeholder="0"
        className="border rounded px-2 py-1 text-xs w-16 text-right tabular-nums"
        disabled={!item.label}
      />
    </div>
  );
}

// 内装オプション行コンポーネント
function InteriorOptionRow({
  item,
  isEditing,
  onToggle,
  onLabelChange,
}: {
  item: InteriorItem;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onLabelChange: (id: string, label: string) => void;
}) {
  const [tempLabel, setTempLabel] = useState(item.label);

  useEffect(() => {
    setTempLabel(item.label);
  }, [item.label]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempLabel(e.target.value);
  };

  const handleLabelBlur = () => {
    if (tempLabel.trim()) {
      onLabelChange(item.id, tempLabel.trim());
    } else {
      setTempLabel(item.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelBlur();
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      setTempLabel(item.label);
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1.5">
      <label className="flex items-center gap-2 cursor-pointer min-h-[28px]">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => onToggle(item.id)}
          className="h-4 w-4"
        />
        {isEditing ? (
          <input
            value={tempLabel}
            onChange={handleLabelChange}
            onBlur={handleLabelBlur}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-0.5 text-xs"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-xs">{item.label}</span>
        )}
      </label>
      <span className="text-xs tabular-nums text-right">+{(item.price / 10000).toFixed(0)}万</span>
    </div>
  );
}

interface OptionsSlideFixedProps {
  projectId?: string;
}

export default function OptionsSlideFixed({ projectId }: OptionsSlideFixedProps) {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [exteriorOptions, setExteriorOptions] = useState<OptionItem[]>(initialExteriorOptions);
  const [additionalExt1Options, setAdditionalExt1Options] = useState<OptionItem[]>(
    createEmptyAdditionalOptions('exterior1_add')
  );
  const [additionalExt2Options, setAdditionalExt2Options] = useState<OptionItem[]>(
    createEmptyAdditionalOptions('exterior2_add')
  );
  const [interiorOptions, setInteriorOptions] = useState<InteriorItem[]>(initialInteriorOptions);
  const [editingInterior, setEditingInterior] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const loanSettings = {
    annualRatePercent: 0.8,
    years: 35,
  };

  // Load saved data
  useEffect(() => {
    if (typeof window !== 'undefined' && projectId) {
      const savedData = localStorage.getItem(`optionsSlide_${projectId}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.selectedOptions) setSelectedOptions(new Set(data.selectedOptions));
          if (data.exteriorOptions) setExteriorOptions(data.exteriorOptions);
          if (data.additionalExt1Options) setAdditionalExt1Options(data.additionalExt1Options);
          if (data.additionalExt2Options) setAdditionalExt2Options(data.additionalExt2Options);
          if (data.interiorOptions) setInteriorOptions(data.interiorOptions);
          if (data.customerName) setCustomerName(data.customerName);
        } catch (e) {
          console.error('Failed to load saved data:', e);
        }
      }
    }
  }, [projectId]);

  // Save data
  const saveData = () => {
    if (typeof window !== 'undefined' && projectId) {
      const dataToSave = {
        selectedOptions: Array.from(selectedOptions),
        exteriorOptions,
        additionalExt1Options,
        additionalExt2Options,
        interiorOptions,
        customerName,
      };
      localStorage.setItem(`optionsSlide_${projectId}`, JSON.stringify(dataToSave));
    }
  };

  // Save whenever data changes
  useEffect(() => {
    saveData();
  }, [
    selectedOptions,
    exteriorOptions,
    additionalExt1Options,
    additionalExt2Options,
    interiorOptions,
  ]);

  const toggleOption = (id: string) => {
    const newSelected = new Set(selectedOptions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedOptions(newSelected);
  };

  const toggleInteriorOption = (id: string) => {
    setInteriorOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
    );
  };

  const updateInteriorLabel = (id: string, newLabel: string) => {
    setInteriorOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, label: newLabel } : opt))
    );
  };

  const updateAdditionalOptionLabel = (
    category: 'exterior1_add' | 'exterior2_add',
    id: string,
    label: string
  ) => {
    if (category === 'exterior1_add') {
      setAdditionalExt1Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, label } : opt))
      );
    } else {
      setAdditionalExt2Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, label } : opt))
      );
    }
  };

  const updateAdditionalOptionPrice = (
    category: 'exterior1_add' | 'exterior2_add',
    id: string,
    price: number
  ) => {
    if (category === 'exterior1_add') {
      setAdditionalExt1Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, price } : opt))
      );
    } else {
      setAdditionalExt2Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, price } : opt))
      );
    }
  };

  const toggleAdditionalOption = (category: 'exterior1_add' | 'exterior2_add', id: string) => {
    if (category === 'exterior1_add') {
      setAdditionalExt1Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
      );
    } else {
      setAdditionalExt2Options((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked: !opt.checked } : opt))
      );
    }
  };

  // Calculate subtotals
  const subtotals = useMemo(() => {
    const exterior1Base = exteriorOptions
      .filter((opt) => opt.category === 'exterior1' && selectedOptions.has(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
    const exterior1Add = additionalExt1Options
      .filter((opt) => opt.checked && opt.label)
      .reduce((sum, opt) => sum + opt.price, 0);

    const exterior2Base = exteriorOptions
      .filter((opt) => opt.category === 'exterior2' && selectedOptions.has(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);
    const exterior2Add = additionalExt2Options
      .filter((opt) => opt.checked && opt.label)
      .reduce((sum, opt) => sum + opt.price, 0);

    const interior = interiorOptions
      .filter((opt) => opt.checked)
      .reduce((sum, opt) => sum + opt.price, 0);

    return {
      exterior1: exterior1Base + exterior1Add,
      exterior2: exterior2Base + exterior2Add,
      interior,
    };
  }, [
    selectedOptions,
    exteriorOptions,
    additionalExt1Options,
    additionalExt2Options,
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
      subtitle={customerName ? `${customerName}様` : ''}
      showFooter={false}
    >
      <div className="grid grid-cols-12 grid-rows-6 gap-3 h-full p-4">
        {/* A: 外観パターン① - 4 columns, 3 rows */}
        <Card className="col-span-4 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-red-50 px-4 py-2">
            <h3 className="text-base font-bold text-red-700">A: 外観パターン①</h3>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col px-4 py-2 overflow-hidden min-h-0">
            {/* 画像 - 4:3 */}
            <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 mb-2 flex items-center justify-center text-gray-500 text-sm shrink-0 object-cover">
              外観イメージ①
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-2 shrink-0">
              {exteriorOptions
                .filter((opt) => opt.category === 'exterior1')
                .map((opt) => (
                  <div key={opt.id} className="grid grid-cols-[1fr_auto] items-center gap-x-2 py-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <Checkbox
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
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

            {/* 追加入力行 */}
            <div className="border-t pt-1 space-y-1 flex-1 overflow-auto min-h-0">
              <div className="text-xs font-semibold text-gray-600">追加オプション</div>
              {additionalExt1Options.map((opt) => (
                <AdditionalOptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={(id) => toggleAdditionalOption('exterior1_add', id)}
                  onLabelChange={(id, label) =>
                    updateAdditionalOptionLabel('exterior1_add', id, label)
                  }
                  onPriceChange={(id, price) =>
                    updateAdditionalOptionPrice('exterior1_add', id, price)
                  }
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-base font-semibold text-red-700 text-right tabular-nums">
              小計: {formatJPY(subtotals.exterior1)}
            </div>
          </div>
        </Card>

        {/* B: 外観パターン② - 4 columns, 3 rows */}
        <Card className="col-span-4 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-blue-50 px-4 py-2">
            <h3 className="text-base font-bold text-blue-700">B: 外観パターン②</h3>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col px-4 py-2 overflow-hidden min-h-0">
            {/* 画像 - 4:3 */}
            <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 mb-2 flex items-center justify-center text-gray-500 text-sm shrink-0 object-cover">
              外観イメージ②
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-2 shrink-0">
              {exteriorOptions
                .filter((opt) => opt.category === 'exterior2')
                .map((opt) => (
                  <div key={opt.id} className="grid grid-cols-[1fr_auto] items-center gap-x-2 py-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <Checkbox
                        checked={selectedOptions.has(opt.id)}
                        onCheckedChange={() => toggleOption(opt.id)}
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

            {/* 追加入力行 */}
            <div className="border-t pt-1 space-y-1 flex-1 overflow-auto min-h-0">
              <div className="text-xs font-semibold text-gray-600">追加オプション</div>
              {additionalExt2Options.map((opt) => (
                <AdditionalOptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={(id) => toggleAdditionalOption('exterior2_add', id)}
                  onLabelChange={(id, label) =>
                    updateAdditionalOptionLabel('exterior2_add', id, label)
                  }
                  onPriceChange={(id, price) =>
                    updateAdditionalOptionPrice('exterior2_add', id, price)
                  }
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-base font-semibold text-blue-700 text-right tabular-nums">
              小計: {formatJPY(subtotals.exterior2)}
            </div>
          </div>
        </Card>

        {/* C: 内観イメージ - 4 columns, 3 rows (拡大) */}
        <Card className="col-span-4 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-green-50 px-4 py-2">
            <h3 className="text-base font-bold text-green-700">C: 内観イメージ</h3>
          </CardHeader>
          <CardContent className="flex-1 px-4 py-2 overflow-hidden">
            {/* 画像を外観と同じサイズ（1枚分）で表示 - グリッドを調整 */}
            <div className="h-full flex flex-col">
              {/* メイン画像 - 外観と同じサイズ */}
              <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 mb-2 flex items-center justify-center text-gray-500 text-sm shrink-0 object-cover">
                内観イメージ①
              </div>
              {/* 残りのスペースに3つの小画像を横並び */}
              <div className="flex-1 grid grid-cols-3 gap-2">
                <div className="w-full h-full rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  内観②
                </div>
                <div className="w-full h-full rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  内観③
                </div>
                <div className="w-full h-full rounded bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                  内観④
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* D: 内装オプション - 6 columns, 3 rows (最も大きく) */}
        <Card className="col-span-6 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border">
          <CardHeader className="shrink-0 bg-purple-50 px-4 py-2 flex flex-row items-center justify-between">
            <h3 className="text-base font-bold text-purple-700">D: 内装オプション</h3>
            <button
              onClick={() => setEditingInterior(!editingInterior)}
              className="p-1 hover:bg-purple-100 rounded transition-colors"
              title="項目名を編集"
            >
              <Pencil
                className={`h-3.5 w-3.5 ${editingInterior ? 'text-purple-600' : 'text-gray-500'}`}
              />
            </button>
          </CardHeader>
          <CardContent className="flex-1 px-4 py-2 overflow-auto min-h-0">
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
              {interiorOptions.map((opt) => (
                <InteriorOptionRow
                  key={opt.id}
                  item={opt}
                  isEditing={editingInterior}
                  onToggle={toggleInteriorOption}
                  onLabelChange={updateInteriorLabel}
                />
              ))}
            </div>
          </CardContent>
          <div className="shrink-0 border-t px-4 py-2 bg-gray-50">
            <div className="text-base font-semibold text-purple-700 text-right tabular-nums">
              内装合計: {formatJPY(subtotals.interior)}
            </div>
          </div>
        </Card>

        {/* E: 外観パターン① ＋ 内装 - 2 columns, 3 rows (縮小) */}
        <Card className="col-span-2 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border border-amber-400">
          <CardHeader className="shrink-0 bg-amber-100 px-4 py-2">
            <h3 className="text-sm font-bold text-amber-700">E: 外観①＋内装</h3>
          </CardHeader>
          <CardContent className="flex-1 px-4 py-2 flex flex-col justify-center">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-xl font-bold text-amber-700 tabular-nums">
                  {formatJPY(pattern1Total)}
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="text-xs text-gray-600">月額(目安)</div>
                <div className="text-lg font-bold text-amber-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern1Total))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  金利{loanSettings.annualRatePercent}%／{loanSettings.years}年
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* F: 外観パターン② ＋ 内装 - 2 columns, 3 rows (縮小) */}
        <Card className="col-span-2 row-span-3 flex flex-col min-h-0 overflow-hidden rounded-lg border border-cyan-400">
          <CardHeader className="shrink-0 bg-cyan-100 px-4 py-2">
            <h3 className="text-sm font-bold text-cyan-700">F: 外観②＋内装</h3>
          </CardHeader>
          <CardContent className="flex-1 px-4 py-2 flex flex-col justify-center">
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-xl font-bold text-cyan-700 tabular-nums">
                  {formatJPY(pattern2Total)}
                </div>
              </div>
              <div className="border-t pt-2">
                <div className="text-xs text-gray-600">月額(目安)</div>
                <div className="text-lg font-bold text-cyan-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern2Total))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
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
