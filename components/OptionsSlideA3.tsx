'use client';

import React, { useState } from 'react';
import A3SlideLayout, { A3Header, A3Footer, A3Column } from './A3SlideLayout';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

interface OptionsSlideA3Props {
  projectId?: string;
}

// パネルコンポーネント（外観オプション用）
const Panel: React.FC<{
  title: string;
  image?: string;
  items: OptionItem[];
  color: 'red' | 'blue';
  onItemChange: (id: string, checked: boolean) => void;
}> = ({ title, image, items, color, onItemChange }) => {
  const subtotal = items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="a3-panel">
      <h3 className={`a3-panel-title ${color}`}>{title}</h3>
      <div className="a3-image-box">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <span className="text-2xl font-bold text-gray-400">外観イメージ</span>
        )}
      </div>
      <Checklist items={items} onItemChange={onItemChange} />
      <div className={`a3-subtotal-tag ${color}`}>
        小計　¥{subtotal.toLocaleString()}
      </div>
    </div>
  );
};

// チェックリストコンポーネント
const Checklist: React.FC<{
  items: OptionItem[];
  onItemChange: (id: string, checked: boolean) => void;
}> = ({ items, onItemChange }) => {
  return (
    <div className="a3-checklist">
      {items.map((item) => (
        <div key={item.id} className="a3-checklist-item">
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => onItemChange(item.id, e.target.checked)}
          />
          <span className="label">{item.label}</span>
          <span className="price">¥{item.price.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

// 内装タブコンポーネント
const InteriorTabs: React.FC<{
  tabs: string[];
}> = ({ tabs }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {tabs.map((tab, index) => (
        <div key={index} className="a3-image-box" style={{ minHeight: '40mm' }}>
          <span className="text-sm font-semibold text-gray-600">{tab}</span>
        </div>
      ))}
    </div>
  );
};

// 合計パネルコンポーネント
const TotalPanels: React.FC<{
  pattern1: { total: number; monthly: number };
  pattern2: { total: number; monthly: number };
}> = ({ pattern1, pattern2 }) => {
  return (
    <div className="a3-total-row">
      <div className="a3-total-card pattern1">
        <h4 className="text-xl font-bold text-center text-red-600 mb-3">
          パターン①
        </h4>
        <p className="text-sm text-center text-gray-600 mb-4">
          外観パターン① ＋ 内装オプション
        </p>
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg">合計金額</span>
            <span className="text-2xl font-bold text-red-600">
              ¥{pattern1.total.toLocaleString()}
            </span>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span>月々</span>
              <span className="text-xl font-bold text-yellow-700">
                ¥{pattern1.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="a3-total-card pattern2">
        <h4 className="text-xl font-bold text-center text-blue-600 mb-3">
          パターン②
        </h4>
        <p className="text-sm text-center text-gray-600 mb-4">
          外観パターン② ＋ 内装オプション
        </p>
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg">合計金額</span>
            <span className="text-2xl font-bold text-blue-600">
              ¥{pattern2.total.toLocaleString()}
            </span>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span>月々</span>
              <span className="text-xl font-bold text-yellow-700">
                ¥{pattern2.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// メインコンポーネント
const OptionsSlideA3: React.FC<OptionsSlideA3Props> = ({ projectId }) => {
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
    <A3SlideLayout>
      {/* タイトル行 */}
      <A3Header
        title="オプション"
        subtitle={{ left: '外装オプション', right: '内装オプション' }}
      />

      {/* 外観パターン① */}
      <A3Column className="a3-card">
        <Panel
          title="外観パターン①"
          items={exterior1Items}
          color="red"
          onItemChange={handleExterior1Change}
        />
      </A3Column>

      {/* 外観パターン② */}
      <A3Column className="a3-card">
        <Panel
          title="外観パターン②"
          items={exterior2Items}
          color="blue"
          onItemChange={handleExterior2Change}
        />
      </A3Column>

      {/* 内装オプション */}
      <A3Column className="a3-card">
        <div className="h-full flex flex-col">
          <h3 className="a3-panel-title text-gray-800">内装オプション</h3>
          <InteriorTabs tabs={['リビング', 'ダイニング', 'キッチン', '和室']} />
          <div className="a3-scroll-y flex-1">
            <Checklist items={interiorItems} onItemChange={handleInteriorChange} />
          </div>
          <div className="a3-subtotal-tag bg-gray-100 text-gray-800">
            内装オプション合計　¥{interiorItems.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0).toLocaleString()}
          </div>
        </div>
      </A3Column>

      {/* 合計金額セクション */}
      <A3Footer>
        <h3 className="text-2xl font-bold text-center mb-6">
          <span className="border-b-2 border-red-600 pb-1 px-6">オプション合計金額</span>
        </h3>
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
      </A3Footer>
    </A3SlideLayout>
  );
};

export default OptionsSlideA3;