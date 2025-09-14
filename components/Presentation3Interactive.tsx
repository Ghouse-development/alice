'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, Home, Package, CreditCard, Check, Plus, Minus, ChevronRight } from 'lucide-react';

// デザインシステム定数
const CROWN_DESIGN = {
  dimensions: {
    width: '1190px', // A3横の基準幅(px) - PresentationContainerと統一
    height: '842px',  // A3横の基準高さ(px) - PresentationContainerと統一
    aspectRatio: '1.414',
  },
  colors: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    accent: '#c41e3a',
    gold: '#b8860b',
    platinum: '#e5e4e2',
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      accent: '#c41e3a'
    },
    gradients: {
      black: 'bg-gradient-to-b from-gray-900 via-black to-gray-900',
      premium: 'bg-gradient-to-r from-black via-gray-900 to-black',
      accent: 'bg-gradient-to-br from-red-900/10 to-red-800/5'
    }
  },
  typography: {
    heading: 'font-bold tracking-[0.15em] uppercase',
    subheading: 'font-light tracking-[0.1em]',
    body: 'font-light tracking-wide',
    accent: 'font-medium tracking-[0.2em] uppercase',
    japanese: 'font-medium'
  }
};

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
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{
        width: '1190px',
        height: '842px',
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0 auto',
        aspectRatio: '1.414 / 1',
        transformOrigin: 'center center'
      }}
    >
      {/* 背景パターン */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
            `,
          }} />
        </div>
      </div>

      {/* ヘッダー */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-900/30">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white uppercase border-b-2 border-red-600 pb-1">
                オプション選択
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - A3横レイアウト - PDFレイアウトに従って3行構造 */}
      <div className="relative h-[calc(100%-60px)] p-6">
        <div className="h-full grid grid-rows-2 gap-6">
          {/* 上段：外装 (Exterior) セクション */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 tracking-wider">
                  <Home className="h-6 w-6 text-gold" style={{ color: CROWN_DESIGN.colors.gold }} />
                  <span className={CROWN_DESIGN.typography.accent}>外装</span>
                </h3>

                {/* 外観①と外観②のボックス */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {exteriorOptions.map(option => (
                    <label
                      key={option.id}
                      className={`relative block cursor-pointer transition-all ${
                        selectedExterior === option.id
                          ? 'ring-2 ring-red-600'
                          : 'hover:ring-1 hover:ring-gray-600'
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
                      <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
                        {/* 画像プレースホルダー */}
                        <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-3 flex items-center justify-center">
                          <Home className="h-12 w-12 text-gray-500" />
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white">{option.name}</p>
                            <p className="text-xs text-gray-400">{option.description}</p>
                            <p className="text-sm text-red-400 font-medium">¥{option.price.toLocaleString()}</p>
                          </div>
                          {selectedExterior === option.id && (
                            <Check className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* 外装チェックボックスオプション */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400 tracking-wider">外装オプション</h4>
                  {['外壁塗装グレードアップ', '屋根材変更', '外構工事', '玄関ドアアップグレード'].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                      <span className="text-sm text-gray-300">{item}</span>
                      <span className="text-sm text-red-400 ml-auto">¥{(50000 + index * 20000).toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* オプション金額セクション - 右側 */}
            <div className="col-span-4">
              <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-lg p-4 border border-red-900/30 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 tracking-wider">
                  <Calculator className="h-6 w-6 text-red-500" />
                  <span className={CROWN_DESIGN.typography.accent}>オプション金額</span>
                </h3>

                {/* パターン選択 */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={() => applyPattern(1)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        activePattern === 1
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold mb-1 text-sm">パターン①</p>
                        <p className="text-xs text-gray-400">STANDARD</p>
                        <p className="text-lg font-bold text-red-500 mt-1">¥210万</p>
                      </div>
                    </button>
                    <button
                      onClick={() => applyPattern(2)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        activePattern === 2
                          ? 'border-red-600 bg-red-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <p className="font-bold mb-1 text-sm">パターン②</p>
                        <p className="text-xs text-gray-400">PREMIUM</p>
                        <p className="text-lg font-bold text-red-500 mt-1">¥340万</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 合計金額表示 */}
                <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 rounded-lg p-4 border border-red-700/50">
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2 tracking-wider">総額</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                      ¥{totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 下段：内装 (Interior) セクション */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8">
              <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-800/50 h-full">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3 tracking-wider">
                  <Home className="h-6 w-6 text-platinum" style={{ color: CROWN_DESIGN.colors.platinum }} />
                  <span className={CROWN_DESIGN.typography.accent}>内装</span>
                </h3>

                {/* LDK①, LDK②, LDK③, LDK④のボックス */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {interiorOptions.map(option => (
                    <label
                      key={option.id}
                      className={`relative block cursor-pointer transition-all ${
                        selectedInteriors.includes(option.id)
                          ? 'ring-2 ring-red-600'
                          : 'hover:ring-1 hover:ring-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={option.id}
                        checked={selectedInteriors.includes(option.id)}
                        onChange={() => toggleInterior(option.id)}
                        className="sr-only"
                      />
                      <div className="bg-gray-800 rounded-lg p-3 border-2 border-gray-700">
                        {/* 小さな画像プレースホルダー */}
                        <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded mb-2 flex items-center justify-center">
                          <Home className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-xs text-white">{option.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                          <p className="text-xs text-red-400 font-medium mt-1">¥{option.price.toLocaleString()}</p>
                          {selectedInteriors.includes(option.id) && (
                            <Check className="h-4 w-4 text-red-500 mx-auto mt-2" />
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* 内装チェックボックスオプション */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400 tracking-wider">内装オプション</h4>
                  {['キッチンアップグレード', '浴室グレードアップ', '床暖房', 'クロス変更'].map((item, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500" />
                      <span className="text-sm text-gray-300">{item}</span>
                      <span className="text-sm text-red-400 ml-auto">¥{(30000 + index * 15000).toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ローンシミュレーション - 右下 */}
            <div className="col-span-4">
              <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 rounded-lg p-4 border border-gray-800/50 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gold" style={{ color: CROWN_DESIGN.colors.gold }} />
                  <h4 className="font-bold text-lg tracking-wider">月額ローン</h4>
                </div>

                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-gold" style={{ color: CROWN_DESIGN.colors.gold }}>
                    ¥{monthlyPayment.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">※35年ローン、金利1.0%</p>
                </div>

                {/* 追加オプション */}
                <div className="bg-black/50 rounded-lg p-4 border border-red-900/30">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 tracking-wider">追加オプション</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {additionalOptions.slice(0, 4).map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleAdditional(option.id)}
                        className={`p-2 rounded border text-xs transition-all ${
                          selectedAdditional.includes(option.id)
                            ? 'border-red-600 bg-red-600/10 text-white'
                            : 'border-gray-700 hover:border-gray-600 text-gray-400'
                        }`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-900/30 px-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-500" />
                <span className="text-xs text-gray-400 tracking-wider"></span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-red-400 tracking-wider">詳細仕様</span>
              <ChevronRight className="w-3 h-3 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation3Interactive;