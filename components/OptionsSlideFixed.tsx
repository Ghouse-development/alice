'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import A3Page from '@/components/A3Page';

// Types
interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// 項目数を保証する関数（必達）
function ensureLength(list: OptionItem[] | undefined, n: number): OptionItem[] {
  const a = [...(list ?? [])];
  while (a.length < n) {
    a.push({
      id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label: '',
      price: 0,
      checked: false,
    });
  }
  return a.slice(0, n);
}

// 金額フォーマット
const formatJPY = (n: number) =>
  n.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

// 統一画像コンポーネント（A/B/Cで必ず共通使用）
const ImgFrame = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-full aspect-[4/3] rounded-lg bg-gray-100 overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-gray-400">{alt}</div>
    )}
  </div>
);

// オプション行コンポーネント（A/B/Dで共通使用）
function OptionRow({
  item,
  onToggle,
  onLabel,
  onPrice,
}: {
  item: OptionItem;
  onToggle: (id: string) => void;
  onLabel: (id: string, v: string) => void;
  onPrice: (id: string, v: number) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1.5 min-h-[44px]">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="h-5 w-5"
          checked={item.checked}
          onChange={() => onToggle(item.id)}
        />
        <input
          value={item.label}
          onChange={(e) => onLabel(item.id, e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
          placeholder="オプション名"
        />
      </label>
      <input
        type="number"
        value={item.price || ''}
        onChange={(e) => onPrice(item.id, Number(e.target.value) || 0)}
        className="w-24 text-right border rounded px-2 py-1 text-sm tabular-nums"
        placeholder="0"
      />
    </div>
  );
}

// 初期データ - 既存外観オプション
const initialExteriorBase = [
  { id: 'ext1-1', label: '外壁タイル張り', price: 680000, checked: false },
  { id: 'ext1-2', label: '玄関電子錠', price: 120000, checked: false },
  { id: 'ext1-3', label: '宅配ボックス', price: 85000, checked: false },
  { id: 'ext1-4', label: 'カーポート', price: 450000, checked: false },
];

const initialExterior2Base = [
  { id: 'ext2-1', label: '太陽光パネル', price: 1200000, checked: false },
  { id: 'ext2-2', label: '蓄電池システム', price: 1650000, checked: false },
  { id: 'ext2-3', label: '防犯カメラ', price: 220000, checked: false },
  { id: 'ext2-4', label: 'シャッター雨戸', price: 380000, checked: false },
];

// 初期データ - 内装オプション（15項目）
const initialInteriorBase = [
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

function OptionsSlideFixed({ projectId }: { projectId: string }) {
  // 外観パターン① - 既存オプション
  const [exteriorBase, setExteriorBase] = useState<OptionItem[]>(initialExteriorBase);
  // 外観パターン① - 追加4項目（必達）
  const [exteriorExtra, setExteriorExtra] = useState<OptionItem[]>(() =>
    ensureLength(undefined, 4)
  );

  // 外観パターン② - 既存オプション
  const [exterior2Base, setExterior2Base] = useState<OptionItem[]>(initialExterior2Base);
  // 外観パターン② - 追加4項目（必達）
  const [exterior2Extra, setExterior2Extra] = useState<OptionItem[]>(() =>
    ensureLength(undefined, 4)
  );

  // 内装オプション - 15項目（必達）
  const [interiorItems, setInteriorItems] = useState<OptionItem[]>(() =>
    ensureLength(initialInteriorBase, 15)
  );

  // ローン設定
  const loanSettings = {
    annualRatePercent: 0.8,
    years: 35,
  };

  // 初期化時に項目数を保証
  useEffect(() => {
    setExteriorExtra(ensureLength(exteriorExtra, 4));
    setExterior2Extra(ensureLength(exterior2Extra, 4));
    setInteriorItems(ensureLength(interiorItems, 15));
  }, []);

  // トグル関数
  const toggleItem = (
    items: OptionItem[],
    setItems: React.Dispatch<React.SetStateAction<OptionItem[]>>,
    id: string
  ) => {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // ラベル更新関数
  const updateLabel = (
    items: OptionItem[],
    setItems: React.Dispatch<React.SetStateAction<OptionItem[]>>,
    id: string,
    label: string
  ) => {
    setItems(items.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  // 価格更新関数
  const updatePrice = (
    items: OptionItem[],
    setItems: React.Dispatch<React.SetStateAction<OptionItem[]>>,
    id: string,
    price: number
  ) => {
    setItems(items.map((item) => (item.id === id ? { ...item, price } : item)));
  };

  // 小計計算
  const subtotals = useMemo(() => {
    const exterior1 =
      exteriorBase.filter((opt) => opt.checked).reduce((sum, opt) => sum + opt.price, 0) +
      exteriorExtra
        .filter((opt) => opt.checked && opt.label)
        .reduce((sum, opt) => sum + opt.price, 0);

    const exterior2 =
      exterior2Base.filter((opt) => opt.checked).reduce((sum, opt) => sum + opt.price, 0) +
      exterior2Extra
        .filter((opt) => opt.checked && opt.label)
        .reduce((sum, opt) => sum + opt.price, 0);

    const interior = interiorItems
      .filter((opt) => opt.checked && opt.label)
      .reduce((sum, opt) => sum + opt.price, 0);

    return { exterior1, exterior2, interior };
  }, [exteriorBase, exteriorExtra, exterior2Base, exterior2Extra, interiorItems]);

  const pattern1Total = subtotals.exterior1 + subtotals.interior;
  const pattern2Total = subtotals.exterior2 + subtotals.interior;

  // 月額計算
  const calculateMonthlyPayment = (total: number): number => {
    if (total === 0) return 0;
    const r = loanSettings.annualRatePercent / 100 / 12;
    const n = loanSettings.years * 12;
    return Math.round((total * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  return (
    <A3Page
      title="オプション選択"
      subtitle="オプション金額を設定し、予算取りを行います"
      showFooter={false}
    >
      {/* 2段レイアウト：grid grid-cols-12 gap-4 */}
      <div className="grid grid-cols-12 gap-4 h-full p-4 grid-rows-2">
        {/* 1段目（上段）：A/B/C */}
        {/* A: 外観パターン① - 4列 */}
        <Card className="col-span-4 flex flex-col h-full min-h-0 rounded-2xl border p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-red-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-red-700">A: 外観パターン①</h3>
          </CardHeader>
          <div className="flex-1 min-h-0 overflow-auto">
            {/* 画像 */}
            <div className="mb-4">
              <ImgFrame alt="外観イメージ①" />
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-3">
              {exteriorBase.map((opt) => (
                <div
                  key={opt.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1 min-h-[32px]"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={opt.checked}
                      onChange={() => toggleItem(exteriorBase, setExteriorBase, opt.id)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                  <span className="text-sm tabular-nums text-right">
                    +{(opt.price / 10000).toFixed(0)}万
                  </span>
                </div>
              ))}
            </div>

            {/* 追加4項目（必達） */}
            <div className="border-t pt-3">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                追加オプション（4項目）
              </div>
              {exteriorExtra.map((opt) => (
                <OptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={(id) => toggleItem(exteriorExtra, setExteriorExtra, id)}
                  onLabel={(id, v) => updateLabel(exteriorExtra, setExteriorExtra, id, v)}
                  onPrice={(id, v) => updatePrice(exteriorExtra, setExteriorExtra, id, v)}
                />
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">小計</span>
              <span className="text-sm font-semibold tabular-nums text-right">
                {formatJPY(subtotals.exterior1)}
              </span>
            </div>
          </div>
        </Card>

        {/* B: 外観パターン② - 4列 */}
        <Card className="col-span-4 flex flex-col h-full min-h-0 rounded-2xl border p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-blue-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-blue-700">B: 外観パターン②</h3>
          </CardHeader>
          <div className="flex-1 min-h-0 overflow-auto">
            {/* 画像 */}
            <div className="mb-4">
              <ImgFrame alt="外観イメージ②" />
            </div>

            {/* 既存オプション */}
            <div className="space-y-1 mb-3">
              {exterior2Base.map((opt) => (
                <div
                  key={opt.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 py-1 min-h-[32px]"
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={opt.checked}
                      onChange={() => toggleItem(exterior2Base, setExterior2Base, opt.id)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                  <span className="text-sm tabular-nums text-right">
                    +{(opt.price / 10000).toFixed(0)}万
                  </span>
                </div>
              ))}
            </div>

            {/* 追加4項目（必達） */}
            <div className="border-t pt-3">
              <div className="text-xs font-semibold text-gray-600 mb-2">
                追加オプション（4項目）
              </div>
              {exterior2Extra.map((opt) => (
                <OptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={(id) => toggleItem(exterior2Extra, setExterior2Extra, id)}
                  onLabel={(id, v) => updateLabel(exterior2Extra, setExterior2Extra, id, v)}
                  onPrice={(id, v) => updatePrice(exterior2Extra, setExterior2Extra, id, v)}
                />
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">小計</span>
              <span className="text-sm font-semibold tabular-nums text-right">
                {formatJPY(subtotals.exterior2)}
              </span>
            </div>
          </div>
        </Card>

        {/* C: 内観イメージ - 4列 */}
        <Card className="col-span-4 flex flex-col h-full min-h-0 rounded-2xl border p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-green-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-green-700">C: 内観イメージ</h3>
          </CardHeader>
          <div className="flex-1 min-h-0 p-2">
            {/* 2×2グリッドで4枚、各枚がA/Bと同サイズ */}
            <div className="grid grid-cols-2 gap-3 h-full">
              <ImgFrame alt="リビング" />
              <ImgFrame alt="キッチン" />
              <ImgFrame alt="浴室" />
              <ImgFrame alt="寝室" />
            </div>
          </div>
        </Card>

        {/* 2段目（下段）：D/E/F */}
        {/* D: 内装オプション - 8列（最も広い） */}
        <Card className="col-span-8 flex flex-col h-full min-h-0 rounded-2xl border p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-purple-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-purple-700">D: 内装オプション</h3>
          </CardHeader>
          <div className="flex-1 min-h-0 overflow-auto">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {interiorItems.map((opt) => (
                <OptionRow
                  key={opt.id}
                  item={opt}
                  onToggle={(id) => toggleItem(interiorItems, setInteriorItems, id)}
                  onLabel={(id, v) => updateLabel(interiorItems, setInteriorItems, id, v)}
                  onPrice={(id, v) => updatePrice(interiorItems, setInteriorItems, id, v)}
                />
              ))}
            </div>
          </div>
          <div className="shrink-0 border-t pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">内装合計</span>
              <span className="text-sm font-semibold tabular-nums text-right">
                {formatJPY(subtotals.interior)}
              </span>
            </div>
          </div>
        </Card>

        {/* E: 外観①＋内装 - 2列（狭幅） */}
        <Card className="col-span-2 flex flex-col h-full min-h-0 rounded-2xl border border-amber-400 p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-amber-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-amber-700">E: 外観①＋内装</h3>
          </CardHeader>
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">
                  {formatJPY(pattern1Total)}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-xs text-gray-600">月額（目安）</div>
                <div className="text-xl font-bold text-amber-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern1Total))}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  金利{loanSettings.annualRatePercent}%・{loanSettings.years}年返済
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* F: 外観②＋内装 - 2列（狭幅） */}
        <Card className="col-span-2 flex flex-col h-full min-h-0 rounded-2xl border border-cyan-400 p-4">
          <CardHeader className="shrink-0 px-4 py-2 -m-4 mb-4 bg-cyan-50 rounded-t-2xl">
            <h3 className="text-sm font-semibold text-cyan-700">F: 外観②＋内装</h3>
          </CardHeader>
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-600">合計額</div>
                <div className="text-2xl font-bold text-cyan-700 tabular-nums">
                  {formatJPY(pattern2Total)}
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-xs text-gray-600">月額（目安）</div>
                <div className="text-xl font-bold text-cyan-700 tabular-nums">
                  {formatJPY(calculateMonthlyPayment(pattern2Total))}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  金利{loanSettings.annualRatePercent}%・{loanSettings.years}年返済
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <style jsx global>{`
        @media print {
          .overflow-auto {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
        }
      `}</style>
    </A3Page>
  );
}

export default OptionsSlideFixed;
