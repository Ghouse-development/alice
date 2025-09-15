'use client';

import React, { useState } from 'react';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

interface OptionsSlideA3v2Props {
  projectId?: string;
}

// パネルコンポーネント（外観オプション用）
const OptionPanel: React.FC<{
  title: string;
  accent: 'red' | 'blue';
  image?: string;
  items: OptionItem[];
  onItemChange: (id: string, checked: boolean) => void;
}> = ({ title, accent, image, items, onItemChange }) => {
  const subtotal = items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0);
  const accentColor = accent === 'red' ? 'red-600' : 'blue-600';
  const bgColor = accent === 'red' ? 'red-50' : 'blue-50';

  return (
    <>
      <h2 className={`text-[18px] font-semibold text-${accentColor} border-b-2 border-${accentColor} pb-2 mb-4`}>
        {title}
      </h2>

      {/* 画像領域（55%以上） */}
      <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-500 text-xl font-medium">外観イメージ{accent === 'red' ? '①' : '②'}</span>
        )}
      </div>

      {/* チェックリスト */}
      <div className="flex-1 space-y-2 text-[12.5px] leading-tight">
        {items.map((item) => (
          <label key={item.id} className="flex items-start">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => onItemChange(item.id, e.target.checked)}
              className="mt-0.5 mr-2"
            />
            <span className="flex-1">{item.label}</span>
            <span className="font-mono ml-2">¥{item.price.toLocaleString()}</span>
          </label>
        ))}
      </div>

      {/* 小計 */}
      <div className={`mt-4 p-3 bg-${bgColor} rounded-lg text-center`}>
        <span className={`text-[14px] font-semibold text-${accentColor}`}>
          小計 ¥{subtotal.toLocaleString()}
        </span>
      </div>
    </>
  );
};

// 内装パネルコンポーネント
const InteriorPanel: React.FC<{
  tabs: string[];
  image?: string;
  items: OptionItem[];
  onItemChange: (id: string, checked: boolean) => void;
}> = ({ tabs, image, items, onItemChange }) => {
  const subtotal = items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <h2 className="text-[18px] font-semibold text-gray-700 border-b-2 border-gray-400 pb-2 mb-4">
        内装オプション
      </h2>

      {/* タブ */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tabs.map((tab, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded text-center text-[11px]">
            {tab}
          </div>
        ))}
      </div>

      {/* 画像領域（最大） */}
      <div className="h-[320px] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        {image ? (
          <img src={image} alt="内装イメージ" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-gray-500 text-xl font-medium">内装イメージ</span>
        )}
      </div>

      {/* チェックリスト（スクロール可能） */}
      <div className="flex-1 overflow-y-auto max-h-[120px] space-y-1 text-[11px] leading-tight pr-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-start">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => onItemChange(item.id, e.target.checked)}
              className="mt-0.5 mr-2 scale-75"
            />
            <span className="flex-1">{item.label}</span>
            <span className="font-mono ml-2">¥{item.price.toLocaleString()}</span>
          </label>
        ))}
      </div>

      {/* 小計 */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
        <span className="text-[14px] font-semibold text-gray-700">
          内装オプション合計 ¥{subtotal.toLocaleString()}
        </span>
      </div>
    </>
  );
};


// 合計パネルコンポーネント
const TotalPanels: React.FC<{
  pattern1: { total: number; monthly: number };
  pattern2: { total: number; monthly: number };
}> = ({ pattern1, pattern2 }) => {
  return (
    <>
      {/* パターン① */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-red-500 p-6 min-h-[220px]">
        <h4 className="text-[20px] font-bold text-center text-red-600 mb-3">パターン①</h4>
        <p className="text-[14px] text-center text-gray-600 mb-4">
          外観パターン① ＋ 内装オプション
        </p>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[16px]">合計金額</span>
            <span className="text-[24px] font-bold text-red-600 font-mono">
              ¥{pattern1.total.toLocaleString()}
            </span>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px]">月々</span>
              <span className="text-[20px] font-bold text-yellow-700 font-mono">
                ¥{pattern1.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* パターン② */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-500 p-6 min-h-[220px]">
        <h4 className="text-[20px] font-bold text-center text-blue-600 mb-3">パターン②</h4>
        <p className="text-[14px] text-center text-gray-600 mb-4">
          外観パターン② ＋ 内装オプション
        </p>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[16px]">合計金額</span>
            <span className="text-[24px] font-bold text-blue-600 font-mono">
              ¥{pattern2.total.toLocaleString()}
            </span>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px]">月々</span>
              <span className="text-[20px] font-bold text-blue-700 font-mono">
                ¥{pattern2.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// メインコンポーネント
const OptionsSlideA3v2: React.FC<OptionsSlideA3v2Props> = ({ projectId }) => {
  // 外装オプション1
  const [exterior1Items, setExterior1Items] = useState<OptionItem[]>([
    { id: 'e1-1', label: 'てすとてすと', price: 100000, checked: false },
    { id: 'e1-2', label: 'てすとてすと', price: 150000, checked: false },
    { id: 'e1-3', label: 'てすとてすと', price: 200000, checked: false },
    { id: 'e1-4', label: 'てすとてすと', price: 250000, checked: false },
  ]);

  // 外装オプション2
  const [exterior2Items, setExterior2Items] = useState<OptionItem[]>([
    { id: 'e2-1', label: 'てすとてすと', price: 120000, checked: false },
    { id: 'e2-2', label: 'てすとてすと', price: 180000, checked: false },
    { id: 'e2-3', label: 'てすとてすと', price: 220000, checked: false },
    { id: 'e2-4', label: 'てすとてすと', price: 280000, checked: false },
  ]);

  // 内装オプション
  const [interiorItems, setInteriorItems] = useState<OptionItem[]>([
    { id: 'i1', label: 'てすとてすと', price: 50000, checked: false },
    { id: 'i2', label: 'てすとてすと', price: 80000, checked: false },
    { id: 'i3', label: 'てすとてすと', price: 100000, checked: false },
    { id: 'i4', label: 'てすとてすと', price: 120000, checked: false },
    { id: 'i5', label: 'てすとてすと', price: 150000, checked: false },
    { id: 'i6', label: 'てすとてすと', price: 180000, checked: false },
    { id: 'i7', label: 'てすとてすと', price: 200000, checked: false },
    { id: 'i8', label: 'てすとてすと', price: 220000, checked: false },
    { id: 'i9', label: 'てすとてすと', price: 250000, checked: false },
    { id: 'i10', label: 'てすとてすと', price: 280000, checked: false },
    { id: 'i11', label: 'てすとてすと', price: 300000, checked: false },
    { id: 'i12', label: 'てすとてすと', price: 350000, checked: false },
    { id: 'i13', label: 'てすとてすと', price: 400000, checked: false },
    { id: 'i14', label: 'てすとてすと', price: 450000, checked: false },
    { id: 'i15', label: 'てすとてすと', price: 500000, checked: false },
    { id: 'i16', label: 'てすとてすと', price: 550000, checked: false },
  ]);

  // ハンドラー
  const handleExterior1Change = (id: string, checked: boolean) => {
    setExterior1Items(prev => prev.map(item =>
      item.id === id ? { ...item, checked } : item
    ));
  };

  const handleExterior2Change = (id: string, checked: boolean) => {
    setExterior2Items(prev => prev.map(item =>
      item.id === id ? { ...item, checked } : item
    ));
  };

  const handleInteriorChange = (id: string, checked: boolean) => {
    setInteriorItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked } : item
    ));
  };

  // 合計計算
  const calculateTotal = (pattern: 1 | 2) => {
    const exteriorTotal = pattern === 1
      ? exterior1Items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0)
      : exterior2Items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0);
    const interiorTotal = interiorItems.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0);
    return exteriorTotal + interiorTotal;
  };

  // 月々の支払い計算（35年ローン、金利0.5%想定）
  const calculateMonthlyLoan = (total: number) => {
    const months = 35 * 12;
    const rate = 0.005 / 12;
    const payment = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  return (
    <div className="w-[1400px] mx-auto p-6 bg-gray-50 a3-no-overlap">
      {/* ヘッダー */}
      <header className="mb-6">
        <h1 className="text-[28px] font-bold text-center mb-3">オプション</h1>
        <div className="flex justify-between items-center">
          <div className="text-[18px] font-semibold text-gray-700 border-b-2 border-red-500 pb-1">外装オプション</div>
          <div className="text-[18px] font-semibold text-gray-700 border-b-2 border-red-500 pb-1">内装オプション</div>
        </div>
      </header>

      {/* 上段グリッド（3カラム） */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 外観パターン① */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[520px] flex flex-col">
          <OptionPanel
            title="外観パターン①"
            accent="red"
            items={exterior1Items}
            onItemChange={handleExterior1Change}
          />
        </div>

        {/* 外観パターン② */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[520px] flex flex-col">
          <OptionPanel
            title="外観パターン②"
            accent="blue"
            items={exterior2Items}
            onItemChange={handleExterior2Change}
          />
        </div>

        {/* 内装オプション */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 min-h-[520px] flex flex-col">
          <InteriorPanel
            tabs={['リビング', 'ダイニング', 'キッチン', '和室']}
            items={interiorItems}
            onItemChange={handleInteriorChange}
          />
        </div>
      </div>

      {/* 下段：合計金額セクション */}
      <div className="border-t-2 border-gray-300 pt-6">
        <h3 className="text-[22px] font-bold text-center mb-6">
          <span className="border-b-2 border-red-600 pb-1 px-8">オプション合計金額</span>
        </h3>

        {/* 下段グリッド（2カラム） */}
        <div className="grid grid-cols-2 gap-4">
          <TotalPanels
            pattern1={{
              total: calculateTotal(1),
              monthly: calculateMonthlyLoan(calculateTotal(1))
            }}
            pattern2={{
              total: calculateTotal(2),
              monthly: calculateMonthlyLoan(calculateTotal(2))
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default OptionsSlideA3v2;