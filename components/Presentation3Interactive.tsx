'use client';

import React, { useState } from 'react';
import { Home, ChevronRight } from 'lucide-react';

// デザインシステム定数 - A3横(420mm x 297mm)対応
const CROWN_DESIGN = {
  // A3横サイズ設定
  dimensions: {
    width: '1190px',
    height: '842px',
    aspectRatio: '1.414',
  },
  // CROWN カラーパレット
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
    }
  },
  // タイポグラフィ
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
  name: string;
  price: number;
  checked: boolean;
}

const Presentation3Interactive: React.FC = () => {
  // 外装オプション
  const [exteriorOption1, setExteriorOption1] = useState<OptionItem[]>([
    { id: 'e1-1', name: 'てすとてすと', price: 100000, checked: false },
    { id: 'e1-2', name: 'てすとてすと', price: 150000, checked: false },
    { id: 'e1-3', name: 'てすとてすと', price: 200000, checked: false },
    { id: 'e1-4', name: 'てすとてすと', price: 250000, checked: false },
  ]);

  const [exteriorOption2, setExteriorOption2] = useState<OptionItem[]>([
    { id: 'e2-1', name: 'てすとてすと', price: 120000, checked: false },
    { id: 'e2-2', name: 'てすとてすと', price: 180000, checked: false },
    { id: 'e2-3', name: 'てすとてすと', price: 220000, checked: false },
    { id: 'e2-4', name: 'てすとてすと', price: 280000, checked: false },
  ]);

  // 内装オプション
  const [interiorOptions, setInteriorOptions] = useState<OptionItem[]>([
    { id: 'i1', name: 'てすとてすと', price: 80000, checked: false },
    { id: 'i2', name: 'てすとてすと', price: 120000, checked: false },
    { id: 'i3', name: 'てすとてすと', price: 150000, checked: false },
    { id: 'i4', name: 'てすとてすと', price: 100000, checked: false },
    { id: 'i5', name: 'てすとてすと', price: 90000, checked: false },
    { id: 'i6', name: 'てすとてすと', price: 110000, checked: false },
    { id: 'i7', name: 'てすとてすと', price: 130000, checked: false },
    { id: 'i8', name: 'てすとてすと', price: 140000, checked: false },
    { id: 'i9', name: 'てすとてすと', price: 160000, checked: false },
    { id: 'i10', name: 'てすとてすと', price: 170000, checked: false },
    { id: 'i11', name: 'てすとてすと', price: 180000, checked: false },
    { id: 'i12', name: 'てすとてすと', price: 190000, checked: false },
    { id: 'i13', name: 'てすとてすと', price: 200000, checked: false },
  ]);

  const [selectedExterior, setSelectedExterior] = useState<1 | 2>(1);

  // 合計金額計算
  const calculateTotal = (pattern: 1 | 2) => {
    const exteriorTotal = pattern === 1
      ? exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0)
      : exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);

    const interiorTotal = interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);

    return exteriorTotal + interiorTotal;
  };

  // ローン換算（月額）
  const calculateMonthlyLoan = (total: number) => {
    // 35年ローン、金利0.5%で計算
    const months = 35 * 12;
    const rate = 0.005 / 12;
    const monthlyPayment = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return Math.round(monthlyPayment);
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
                オプション
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - PDFレイアウト準拠 */}
      <div className="relative h-[calc(100%-100px)] p-3">
        <div className="h-full grid grid-cols-12 gap-3">

          {/* 左側：外装・内装セクション */}
          <div className="col-span-4">
            {/* 外装セクション */}
            <div className="mb-3">
              <h3 className="text-sm font-bold mb-2 text-white border-b border-gray-700 pb-1">外装</h3>
              <div className="grid grid-cols-2 gap-2">
                {/* 外観① */}
                <div>
                  <div className="bg-gray-800 rounded p-2 mb-2 aspect-[4/3]">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">外観①</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {exteriorOption1.map(option => (
                      <label key={option.id} className="flex items-center gap-1 text-[10px] cursor-pointer hover:bg-gray-800/50 p-0.5 rounded">
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={(e) => {
                            setExteriorOption1(prev => prev.map(o =>
                              o.id === option.id ? { ...o, checked: e.target.checked } : o
                            ));
                          }}
                          className="w-3 h-3"
                        />
                        <span className="text-gray-300">{option.name}</span>
                        <span className="ml-auto text-gray-400">¥{option.price.toLocaleString()}</span>
                      </label>
                    ))}
                    <div className="border-t border-gray-700 pt-1 mt-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">合計</span>
                        <span className="text-white">
                          ¥{exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 外観② */}
                <div>
                  <div className="bg-gray-800 rounded p-2 mb-2 aspect-[4/3]">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">外観②</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {exteriorOption2.map(option => (
                      <label key={option.id} className="flex items-center gap-1 text-[10px] cursor-pointer hover:bg-gray-800/50 p-0.5 rounded">
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={(e) => {
                            setExteriorOption2(prev => prev.map(o =>
                              o.id === option.id ? { ...o, checked: e.target.checked } : o
                            ));
                          }}
                          className="w-3 h-3"
                        />
                        <span className="text-gray-300">{option.name}</span>
                        <span className="ml-auto text-gray-400">¥{option.price.toLocaleString()}</span>
                      </label>
                    ))}
                    <div className="border-t border-gray-700 pt-1 mt-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400">合計</span>
                        <span className="text-white">
                          ¥{exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 内装セクション */}
            <div>
              <h3 className="text-sm font-bold mb-2 text-white border-b border-gray-700 pb-1">内装</h3>
              <div className="grid grid-cols-2 gap-2">
                {['LDK①', 'LDK②', 'LDK③', 'LDK④'].map((name, index) => (
                  <div key={index} className="bg-gray-800 rounded p-2">
                    <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">{name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 中央：内装オプションリスト */}
          <div className="col-span-5 bg-gray-900/50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {interiorOptions.map(option => (
                <label key={option.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-800/50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(e) => {
                      setInteriorOptions(prev => prev.map(o =>
                        o.id === option.id ? { ...o, checked: e.target.checked } : o
                      ));
                    }}
                    className="w-3 h-3"
                  />
                  <span className="text-gray-300">{option.name}</span>
                  <span className="ml-auto text-gray-400">¥{option.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
            <div className="border-t border-gray-700 mt-3 pt-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-400">内装オプション合計</span>
                <span className="text-white">
                  ¥{interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 右側：オプション金額 */}
          <div className="col-span-3">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 rounded-lg p-3 h-full">
              <h3 className="text-sm font-bold mb-3 text-center text-white border-b border-gray-700 pb-2">
                オプション金額
              </h3>

              {/* パターン① */}
              <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-xs font-bold mb-2 text-red-400">パターン①</h4>
                <p className="text-[10px] text-gray-400 mb-2">外装①＋内装</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">合計金額：</span>
                    <span className="font-bold text-white">¥{calculateTotal(1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">ローン換算：</span>
                    <span className="font-bold text-yellow-400">¥{calculateMonthlyLoan(calculateTotal(1)).toLocaleString()}/月</span>
                  </div>
                </div>
              </div>

              {/* パターン② */}
              <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-xs font-bold mb-2 text-blue-400">パターン②</h4>
                <p className="text-[10px] text-gray-400 mb-2">外装②＋内装</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">合計金額：</span>
                    <span className="font-bold text-white">¥{calculateTotal(2).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">ローン換算：</span>
                    <span className="font-bold text-yellow-400">¥{calculateMonthlyLoan(calculateTotal(2)).toLocaleString()}/月</span>
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
            </div>
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presentation3Interactive;