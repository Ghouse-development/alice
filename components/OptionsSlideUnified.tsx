'use client';

import React, { useState, useMemo } from 'react';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

interface OptionsSlideUnifiedProps {
  projectId?: string;
}

// ローン計算関数
function calculateMonthlyPayment(principal: number, years: number, annualRate: number): number {
  if (principal <= 0 || years <= 0 || annualRate < 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return principal / months;
  }

  const payment = principal * monthlyRate * Math.pow(1 + monthlyRate, months)
    / (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(payment);
}

export default function OptionsSlideUnified({ projectId }: OptionsSlideUnifiedProps) {
  // ローン条件
  const [loanYears, setLoanYears] = useState(35);
  const [loanRate, setLoanRate] = useState(0.5);

  // 外観オプション①
  const [exterior1Items, setExterior1Items] = useState<OptionItem[]>([
    { id: 'e1-1', label: '外壁グレードアップ', price: 250000, checked: false },
    { id: 'e1-2', label: '屋根材グレードアップ', price: 180000, checked: false },
    { id: 'e1-3', label: '玄関ドアグレードアップ', price: 150000, checked: false },
    { id: 'e1-4', label: 'バルコニー拡張', price: 200000, checked: false },
  ]);

  // 外観オプション②
  const [exterior2Items, setExterior2Items] = useState<OptionItem[]>([
    { id: 'e2-1', label: 'タイル外壁', price: 450000, checked: false },
    { id: 'e2-2', label: '太陽光パネル増設', price: 380000, checked: false },
    { id: 'e2-3', label: 'カーポート設置', price: 320000, checked: false },
    { id: 'e2-4', label: '外構工事', price: 280000, checked: false },
  ]);

  // 内装オプション
  const [interiorItems, setInteriorItems] = useState<OptionItem[]>([
    { id: 'i1', label: 'フローリンググレードアップ', price: 120000, checked: false },
    { id: 'i2', label: 'キッチングレードアップ', price: 350000, checked: false },
    { id: 'i3', label: '食洗機', price: 150000, checked: false },
    { id: 'i4', label: 'IHクッキングヒーター', price: 180000, checked: false },
    { id: 'i5', label: 'システムバス1.25坪', price: 200000, checked: false },
    { id: 'i6', label: '浴室乾燥機', price: 80000, checked: false },
    { id: 'i7', label: 'トイレグレードアップ', price: 120000, checked: false },
    { id: 'i8', label: '2階トイレ追加', price: 250000, checked: false },
    { id: 'i9', label: '洗面台グレードアップ', price: 150000, checked: false },
    { id: 'i10', label: 'エコカラット', price: 180000, checked: false },
    { id: 'i11', label: '床暖房（LDK）', price: 280000, checked: false },
    { id: 'i12', label: '全館空調システム', price: 850000, checked: false },
    { id: 'i13', label: '造作家具', price: 320000, checked: false },
    { id: 'i14', label: 'ウォークインクローゼット', price: 180000, checked: false },
    { id: 'i15', label: '書斎スペース', price: 220000, checked: false },
  ]);

  // 合計計算
  const exterior1Total = useMemo(() =>
    exterior1Items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0),
    [exterior1Items]
  );

  const exterior2Total = useMemo(() =>
    exterior2Items.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0),
    [exterior2Items]
  );

  const interiorTotal = useMemo(() =>
    interiorItems.filter(item => item.checked).reduce((sum, item) => sum + item.price, 0),
    [interiorItems]
  );

  const pattern1Total = exterior1Total + interiorTotal;
  const pattern2Total = exterior2Total + interiorTotal;

  const pattern1Monthly = calculateMonthlyPayment(pattern1Total, loanYears, loanRate);
  const pattern2Monthly = calculateMonthlyPayment(pattern2Total, loanYears, loanRate);

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

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">オプション選択</h1>
        <p className="text-sm text-gray-600 mt-1">お好みのオプションをお選びください</p>
      </div>

      {/* メインコンテンツ - 3カラムグリッド */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-200px)]">

        {/* 外観パターン① */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold text-red-600 border-b-2 border-red-600 pb-2 mb-3">
            外観パターン①
          </h2>

          {/* 外観イメージ */}
          <div className="h-32 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-gray-500 text-sm">外観イメージ①</span>
          </div>

          {/* オプションリスト */}
          <div className="flex-1 space-y-2">
            {exterior1Items.map((item) => (
              <label key={item.id} className="flex items-center text-sm hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleExterior1Change(item.id, e.target.checked)}
                  className="mr-2 text-red-600 focus:ring-red-500"
                />
                <span className="flex-1">{item.label}</span>
                <span className="font-mono text-gray-600">¥{item.price.toLocaleString()}</span>
              </label>
            ))}
          </div>

          {/* 合計額 */}
          <div className="mt-3 pt-3 border-t-2 border-gray-200">
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <span className="text-sm text-gray-600">合計額</span>
              <div className="text-xl font-bold text-red-600">
                ¥{exterior1Total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 外観パターン② */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3">
            外観パターン②
          </h2>

          {/* 外観イメージ */}
          <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-3">
            <span className="text-gray-500 text-sm">外観イメージ②</span>
          </div>

          {/* オプションリスト */}
          <div className="flex-1 space-y-2">
            {exterior2Items.map((item) => (
              <label key={item.id} className="flex items-center text-sm hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleExterior2Change(item.id, e.target.checked)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="flex-1">{item.label}</span>
                <span className="font-mono text-gray-600">¥{item.price.toLocaleString()}</span>
              </label>
            ))}
          </div>

          {/* 合計額 */}
          <div className="mt-3 pt-3 border-t-2 border-gray-200">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <span className="text-sm text-gray-600">合計額</span>
              <div className="text-xl font-bold text-blue-600">
                ¥{exterior2Total.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 内装オプション */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold text-green-600 border-b-2 border-green-600 pb-2 mb-3">
            内装オプション
          </h2>

          {/* 内装イメージグリッド */}
          <div className="grid grid-cols-2 gap-1 h-32 mb-3">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">リビング</span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">キッチン</span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">バスルーム</span>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">ベッドルーム</span>
            </div>
          </div>

          {/* オプションリスト（スクロール可能） */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {interiorItems.map((item) => (
              <label key={item.id} className="flex items-center text-xs hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => handleInteriorChange(item.id, e.target.checked)}
                  className="mr-2 text-green-600 focus:ring-green-500 scale-90"
                />
                <span className="flex-1">{item.label}</span>
                <span className="font-mono text-gray-600">¥{item.price.toLocaleString()}</span>
              </label>
            ))}
          </div>

          {/* 合計額 */}
          <div className="mt-3 pt-3 border-t-2 border-gray-200">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <span className="text-sm text-gray-600">合計額</span>
              <div className="text-xl font-bold text-green-600">
                ¥{interiorTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下段：オプション合計金額 */}
      <div className="mt-4">
        {/* ローン条件入力 */}
        <div className="flex justify-center gap-4 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600">ローン期間:</label>
            <input
              type="number"
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
              max="50"
            />
            <span className="text-gray-600">年</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600">金利:</label>
            <input
              type="number"
              value={loanRate}
              onChange={(e) => setLoanRate(Number(e.target.value))}
              className="w-16 px-2 py-1 border rounded text-center"
              min="0"
              max="10"
              step="0.1"
            />
            <span className="text-gray-600">%</span>
          </div>
        </div>

        {/* パターン別合計 */}
        <div className="grid grid-cols-2 gap-4">
          {/* パターン① */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-400 p-4">
            <h3 className="text-lg font-bold text-red-600 text-center mb-2">
              パターン① オプション合計金額
            </h3>
            <p className="text-xs text-gray-600 text-center mb-3">
              外観パターン① ＋ 内装オプション
            </p>
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">オプション合計額</span>
                <span className="text-2xl font-bold text-red-600">
                  ¥{pattern1Total.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">月々のお支払い</span>
                  <span className="text-lg font-bold text-orange-600">
                    ¥{pattern1Monthly.toLocaleString()}/月
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  ({loanYears}年ローン・金利{loanRate}%)
                </p>
              </div>
            </div>
          </div>

          {/* パターン② */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-400 p-4">
            <h3 className="text-lg font-bold text-blue-600 text-center mb-2">
              パターン② オプション合計金額
            </h3>
            <p className="text-xs text-gray-600 text-center mb-3">
              外観パターン② ＋ 内装オプション
            </p>
            <div className="bg-white rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">オプション合計額</span>
                <span className="text-2xl font-bold text-blue-600">
                  ¥{pattern2Total.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">月々のお支払い</span>
                  <span className="text-lg font-bold text-cyan-600">
                    ¥{pattern2Monthly.toLocaleString()}/月
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  ({loanYears}年ローン・金利{loanRate}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}