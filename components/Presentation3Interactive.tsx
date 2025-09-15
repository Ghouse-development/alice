'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';

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
  const { theme } = useStore();
  const isDark = theme === 'dark';

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
    { id: 'i1', name: 'てすとてすと', price: 50000, checked: false },
    { id: 'i2', name: 'てすとてすと', price: 80000, checked: false },
    { id: 'i3', name: 'てすとてすと', price: 100000, checked: false },
    { id: 'i4', name: 'てすとてすと', price: 120000, checked: false },
    { id: 'i5', name: 'てすとてすと', price: 150000, checked: false },
    { id: 'i6', name: 'てすとてすと', price: 180000, checked: false },
    { id: 'i7', name: 'てすとてすと', price: 200000, checked: false },
    { id: 'i8', name: 'てすとてすと', price: 220000, checked: false },
    { id: 'i9', name: 'てすとてすと', price: 250000, checked: false },
    { id: 'i10', name: 'てすとてすと', price: 280000, checked: false },
    { id: 'i11', name: 'てすとてすと', price: 300000, checked: false },
    { id: 'i12', name: 'てすとてすと', price: 350000, checked: false },
    { id: 'i13', name: 'てすとてすと', price: 400000, checked: false },
    { id: 'i14', name: 'てすとてすと', price: 450000, checked: false },
    { id: 'i15', name: 'てすとてすと', price: 500000, checked: false },
    { id: 'i16', name: 'てすとてすと', price: 550000, checked: false },
  ]);

  // 合計金額計算
  const calculateTotal = (pattern: number) => {
    const exteriorTotal = pattern === 1
      ? exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0)
      : exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);
    const interiorTotal = interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);
    return exteriorTotal + interiorTotal;
  };

  // 月々の支払い計算（35年ローン、金利0.5%想定）
  const calculateMonthlyLoan = (total: number) => {
    const months = 35 * 12; // 35年
    const rate = 0.005 / 12; // 月利
    const payment = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  return (
    <div
      className={`page-container relative ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}
      style={{
        width: '1190px',
        height: '842px',
        maxWidth: 'min(1190px, 95vw)',
        maxHeight: '100%',
        margin: '0 auto',
        padding: '0 16px',
        aspectRatio: '1.414 / 1',
        transformOrigin: 'center center',
        boxSizing: 'border-box'
      }}
    >
      {/* 背景パターン */}
      <div className="absolute inset-0 overflow-visible print:overflow-visible">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-black via-gray-950 to-black' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'}`} />
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
      <div className={`relative border-b ${isDark ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30' : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'}`}>
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
              </div>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span className={`text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-red-600 pb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                オプション
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ - グリッドレイアウト */}
      <div className="relative h-[calc(100%-80px)] p-4">
        <div className="h-full flex flex-col">

          {/* 上段：3カラムグリッド（外観①、外観②、内装） */}
          <div className="options-grid flex-1 mb-4" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '24px',
            alignItems: 'start'
          }}>

            {/* 外観① */}
            <div className="options-exterior-a" style={{ minWidth: 0, minHeight: 0, boxSizing: 'border-box' }}>
              <div className={`h-full rounded-xl p-4 shadow-xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-red-600/30' : 'bg-white border-red-500/30'}`}>
                <h4 className={`text-lg font-bold mb-3 text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>外観パターン①</h4>
                <div className={`rounded-lg p-2 mb-4 aspect-[16/9] shadow-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className={`w-full h-full rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                    <span className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>外観イメージ①</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {exteriorOption1.map(option => (
                    <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
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
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{option.name}</span>
                      <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>¥{option.price.toLocaleString()}</span>
                    </label>
                  ))}
                  <div className={`border-t-2 pt-3 mt-3 ${isDark ? 'border-red-600/50 bg-red-900/20' : 'border-red-500/50 bg-red-50'} p-3 rounded`}>
                    <div className="flex justify-between text-base font-bold">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>小計</span>
                      <span className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                        ¥{exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 外観② */}
            <div className="options-exterior-b" style={{ minWidth: 0, minHeight: 0, boxSizing: 'border-box' }}>
              <div className={`h-full rounded-xl p-4 shadow-xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-blue-600/30' : 'bg-white border-blue-500/30'}`}>
                <h4 className={`text-lg font-bold mb-3 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>外観パターン②</h4>
                <div className={`rounded-lg p-2 mb-4 aspect-[16/9] shadow-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className={`w-full h-full rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                    <span className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>外観イメージ②</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {exteriorOption2.map(option => (
                    <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded transition-colors ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
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
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{option.name}</span>
                      <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>¥{option.price.toLocaleString()}</span>
                    </label>
                  ))}
                  <div className={`border-t-2 pt-3 mt-3 ${isDark ? 'border-blue-600/50 bg-blue-900/20' : 'border-blue-500/50 bg-blue-50'} p-3 rounded`}>
                    <div className="flex justify-between text-base font-bold">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>小計</span>
                      <span className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        ¥{exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 内装（右カラム・縦長） */}
            <div className="options-interior" style={{ minWidth: 0, minHeight: 0, boxSizing: 'border-box' }}>
              <div className="flex flex-col h-full">
                <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="border-b-2 border-red-600 pb-1 px-4">内装オプション</span>
                </h3>

                {/* 内装イメージ */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['リビング', 'ダイニング', 'キッチン', '和室'].map((name, index) => (
                    <div key={index} className={`rounded-lg p-2 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div className={`w-full aspect-[4/3] rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 内装オプションリスト */}
                <div className={`flex-1 rounded-xl p-4 shadow-xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-gray-600/30' : 'bg-white border-gray-300'}`}>
                  <div className="interior-scroll print:max-h-none print:overflow-visible" style={{
                    maxHeight: 'clamp(320px, 50vh, 400px)',
                    overflowY: 'auto'
                  }}>
                    <div className="space-y-1">
                      {interiorOptions.map(option => (
                        <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                          <input
                            type="checkbox"
                            checked={option.checked}
                            onChange={(e) => {
                              setInteriorOptions(prev => prev.map(o =>
                                o.id === option.id ? { ...o, checked: e.target.checked } : o
                              ));
                            }}
                            className="w-3 h-3 flex-shrink-0"
                          />
                          <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{option.name}</span>
                          <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>¥{option.price.toLocaleString()}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className={`border-t-2 mt-4 pt-3 ${isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'} p-3 rounded`}>
                    <div className="flex justify-between text-base font-bold">
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>内装合計</span>
                      <span className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ¥{interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 下段：合計金額セクション */}
          <section className="options-total" style={{ marginTop: '24px' }}>
            <div className={`rounded-xl p-6 shadow-2xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-gray-900/90 to-black/80 border-red-600/50' : 'bg-gradient-to-br from-gray-50 to-white border-red-500/30'}`}>
              <h3 className={`text-2xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="border-b-2 border-red-600 pb-1 px-6">オプション合計金額</span>
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* パターン① */}
                <div className={`rounded-xl p-5 shadow-xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-red-900/30 to-gray-900/50 border-red-600/50' : 'bg-gradient-to-br from-red-50 to-white border-red-400'}`}>
                  <h4 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>パターン①</h4>
                  <p className={`text-sm mb-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>外観パターン① ＋ 内装オプション</p>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>合計金額</span>
                      <span className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>¥{calculateTotal(1).toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>月々</span>
                      <span className={`text-xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>¥{calculateMonthlyLoan(calculateTotal(1)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* パターン② */}
                <div className={`rounded-xl p-5 shadow-xl border-2 print:overflow-visible ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-gray-900/50 border-blue-600/50' : 'bg-gradient-to-br from-blue-50 to-white border-blue-400'}`}>
                  <h4 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>パターン②</h4>
                  <p className={`text-sm mb-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>外観パターン② ＋ 内装オプション</p>
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>合計金額</span>
                      <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>¥{calculateTotal(2).toLocaleString()}</span>
                    </div>
                    <div className={`flex justify-between items-center p-3 rounded ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>月々</span>
                      <span className={`text-xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>¥{calculateMonthlyLoan(calculateTotal(2)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 印刷用スタイル */}
      <style jsx>{`
        @media print {
          .interior-scroll {
            max-height: none !important;
            overflow: visible !important;
          }

          .card, .panel, .section, .options-grid, .options-total,
          .options-exterior-a, .options-exterior-b, .options-interior {
            overflow: visible !important;
          }

          .shadow, .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
          }

          .page-container {
            padding: 10mm !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Presentation3Interactive;