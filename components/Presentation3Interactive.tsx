'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Home, Package, CreditCard, Check, Plus, Minus, ChevronRight } from 'lucide-react';

interface OptionItem {
  id: string;
  category: string;
  name: string;
  price: number;
  description?: string;
}

interface RoomOption {
  room: string;
  selectedOptions: string[];
}

const Presentation3Interactive: React.FC = () => {
  // 外装オプション
  const exteriorOptions: OptionItem[] = [
    { id: 'ext1', category: '外装', name: '外装①', price: 150000, description: 'タイル外壁（標準グレード）' },
    { id: 'ext2', category: '外装', name: '外装②', price: 280000, description: 'タイル外壁（ハイグレード）' },
  ];

  // 内装オプション
  const interiorOptions: OptionItem[] = [
    { id: 'int1', category: 'LDK', name: 'LDK①', price: 60000, description: 'フローリング（標準）' },
    { id: 'int2', category: 'LDK', name: 'LDK②', price: 85000, description: 'フローリング（無垢材）' },
    { id: 'int3', category: 'LDK', name: 'LDK③', price: 120000, description: 'フローリング（高級無垢材）' },
    { id: 'int4', category: 'LDK', name: 'LDK④', price: 95000, description: 'フローリング（防音仕様）' },
  ];

  // 追加オプション（グリッド表示用）
  const additionalOptions = [
    { id: 'add1', name: 'キッチンアップグレード', price: 180000 },
    { id: 'add2', name: '浴室グレードアップ', price: 120000 },
    { id: 'add3', name: '太陽光発電システム', price: 1500000 },
    { id: 'add4', name: '蓄電池システム', price: 1200000 },
    { id: 'add5', name: 'スマートホーム', price: 250000 },
    { id: 'add6', name: '床暖房', price: 450000 },
    { id: 'add7', name: '全館空調', price: 850000 },
    { id: 'add8', name: 'セキュリティシステム', price: 180000 },
  ];

  const [selectedExterior, setSelectedExterior] = useState('ext1');
  const [selectedInteriors, setSelectedInteriors] = useState<string[]>(['int1']);
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [activePattern, setActivePattern] = useState<1 | 2>(1);

  // パターン設定
  const patterns = {
    1: {
      exterior: 'ext1',
      interiors: ['int1', 'int2'],
      additional: ['add1', 'add3']
    },
    2: {
      exterior: 'ext2',
      interiors: ['int2', 'int3', 'int4'],
      additional: ['add3', 'add5', 'add6']
    }
  };

  // パターン切り替え
  const applyPattern = (pattern: 1 | 2) => {
    setActivePattern(pattern);
    const p = patterns[pattern];
    setSelectedExterior(p.exterior);
    setSelectedInteriors(p.interiors);
    setSelectedAdditional(p.additional);
  };

  // 価格計算
  const totalPrice = useMemo(() => {
    let total = 0;

    // 外装
    const ext = exteriorOptions.find(e => e.id === selectedExterior);
    if (ext) total += ext.price;

    // 内装
    selectedInteriors.forEach(id => {
      const int = interiorOptions.find(i => i.id === id);
      if (int) total += int.price;
    });

    // 追加オプション
    selectedAdditional.forEach(id => {
      const add = additionalOptions.find(a => a.id === id);
      if (add) total += add.price;
    });

    return total;
  }, [selectedExterior, selectedInteriors, selectedAdditional]);

  // ローン計算（簡易版）
  const monthlyPayment = useMemo(() => {
    const rate = 0.01 / 12; // 年利1%の月利
    const months = 35 * 12; // 35年ローン
    const principal = totalPrice;

    if (principal === 0) return 0;

    const payment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  }, [totalPrice]);

  const toggleInterior = (id: string) => {
    setSelectedInteriors(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const toggleAdditional = (id: string) => {
    setSelectedAdditional(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="w-full h-full bg-black text-white overflow-hidden">
      {/* Header - CROWN Style */}
      <div className="bg-gradient-to-r from-black to-gray-900 px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">FEATURES</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">OPTIONS</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-blue-500 pb-1">OPTIONS</span>
          </div>
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">03</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100%-4rem)]">
        {/* Left Panel - Options Selection */}
        <div className="w-3/5 p-8 border-r border-gray-800 overflow-y-auto">
          <div className="space-y-8">
            {/* Pattern Selection */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-400" />
                おすすめパターン
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => applyPattern(1)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activePattern === 1
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold mb-1">パターン①</p>
                    <p className="text-sm text-gray-400">スタンダード</p>
                    <p className="text-xl font-bold text-blue-400 mt-2">¥2,100,000</p>
                  </div>
                </button>
                <button
                  onClick={() => applyPattern(2)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    activePattern === 2
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-bold mb-1">パターン②</p>
                    <p className="text-sm text-gray-400">ハイグレード</p>
                    <p className="text-xl font-bold text-blue-400 mt-2">¥3,400,000</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Exterior Options */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-green-400" />
                外装
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {exteriorOptions.map(option => (
                  <label
                    key={option.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedExterior === option.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="exterior"
                      value={option.id}
                      checked={selectedExterior === option.id}
                      onChange={(e) => setSelectedExterior(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{option.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                      </div>
                      {selectedExterior === option.id && (
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-gray-300 mt-2">
                      ¥{option.price.toLocaleString()}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Interior Options */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-400" />
                内装
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {interiorOptions.map(option => (
                  <label
                    key={option.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedInteriors.includes(option.id)
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.id}
                      checked={selectedInteriors.includes(option.id)}
                      onChange={() => toggleInterior(option.id)}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{option.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                      </div>
                      {selectedInteriors.includes(option.id) && (
                        <Check className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-lg font-bold text-gray-300 mt-2">
                      ¥{option.price.toLocaleString()}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Options Grid */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-400" />
                追加オプション
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {additionalOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleAdditional(option.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedAdditional.includes(option.id)
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full border-2 flex items-center justify-center ${
                        selectedAdditional.includes(option.id)
                          ? 'border-orange-400 bg-orange-400'
                          : 'border-gray-600'
                      }`}>
                        {selectedAdditional.includes(option.id) && (
                          <Check className="h-4 w-4 text-black" />
                        )}
                      </div>
                      <p className="text-xs font-medium">{option.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        ¥{(option.price / 10000).toFixed(0)}万
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary */}
        <div className="w-2/5 p-8 bg-gradient-to-br from-gray-900 to-black">
          <div className="sticky top-0 space-y-6">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                オプション金額
              </h2>
            </div>

            {/* Selected Items Summary */}
            <div className="bg-black/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-4">選択中のオプション</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {/* 外装 */}
                {exteriorOptions.filter(e => e.id === selectedExterior).map(option => (
                  <div key={option.id} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">{option.name}</span>
                    </div>
                    <span className="text-sm font-bold">¥{option.price.toLocaleString()}</span>
                  </div>
                ))}

                {/* 内装 */}
                {interiorOptions.filter(i => selectedInteriors.includes(i.id)).map(option => (
                  <div key={option.id} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm">{option.name}</span>
                    </div>
                    <span className="text-sm font-bold">¥{option.price.toLocaleString()}</span>
                  </div>
                ))}

                {/* 追加 */}
                {additionalOptions.filter(a => selectedAdditional.includes(a.id)).map(option => (
                  <div key={option.id} className="flex justify-between items-center py-2 border-b border-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-sm">{option.name}</span>
                    </div>
                    <span className="text-sm font-bold">¥{option.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/30 rounded-lg p-6 border border-blue-700/50">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">合計</p>
                <p className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  ¥{totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Loan Calculation */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-yellow-400" />
                <h3 className="font-bold">ローン返済</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-black/50 rounded-lg">
                  <span className="text-gray-400">月々</span>
                  <span className="text-2xl font-bold text-yellow-400">
                    ¥{monthlyPayment.toLocaleString()}
                  </span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>※ 35年ローン、金利1.0%で計算</p>
                  <p>※ ボーナス払いなし</p>
                  <p>※ 実際の返済額は金融機関により異なります</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium">
                リセット
              </button>
              <button className="py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                保存
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation3Interactive;