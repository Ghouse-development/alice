'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { Grid3Columns, ScrollableArea, Card, SectionContainer } from '@/components/PageShell';

interface OptionItem {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const Presentation3Optimized: React.FC = () => {
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

  // 月々の支払い計算
  const calculateMonthlyLoan = (total: number) => {
    const months = 35 * 12;
    const rate = 0.005 / 12;
    const payment = total * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1);
    return Math.round(payment);
  };

  return (
    <div className={`page-container ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className={`border-b ${isDark ? 'border-red-900/30' : 'border-gray-200'} pb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <span className="text-xs font-bold tracking-[0.4em] text-red-600 uppercase">G-HOUSE</span>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
              <span className={`text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-red-600 pb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                オプション
              </span>
            </div>
          </div>
        </div>

        {/* 上段：外装と内装オプション */}
        <SectionContainer>
          <Grid3Columns gap="md">
            {/* 外観① */}
            <Card className={`h-full ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-red-600/30' : 'bg-white border-red-500/30'}`}>
              <h4 className={`text-lg font-bold mb-3 text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                外観パターン①
              </h4>
              <div className={`rounded-lg p-2 mb-4 aspect-[16/9] ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className={`w-full h-full rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                  <span className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>外観イメージ①</span>
                </div>
              </div>
              <div className="space-y-2">
                {exteriorOption1.map(option => (
                  <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={(e) => setExteriorOption1(prev => prev.map(o =>
                        o.id === option.id ? { ...o, checked: e.target.checked } : o
                      ))}
                      className="w-3 h-3"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{option.name}</span>
                    <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ¥{option.price.toLocaleString()}
                    </span>
                  </label>
                ))}
                <div className={`border-t-2 pt-3 mt-3 ${isDark ? 'border-red-600/50 bg-red-900/20' : 'border-red-500/50 bg-red-50'} p-3 rounded`}>
                  <div className="flex justify-between text-base font-bold">
                    <span>小計</span>
                    <span className={`text-lg ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                      ¥{exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 外観② */}
            <Card className={`h-full ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-blue-600/30' : 'bg-white border-blue-500/30'}`}>
              <h4 className={`text-lg font-bold mb-3 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                外観パターン②
              </h4>
              <div className={`rounded-lg p-2 mb-4 aspect-[16/9] ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div className={`w-full h-full rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                  <span className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>外観イメージ②</span>
                </div>
              </div>
              <div className="space-y-2">
                {exteriorOption2.map(option => (
                  <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={(e) => setExteriorOption2(prev => prev.map(o =>
                        o.id === option.id ? { ...o, checked: e.target.checked } : o
                      ))}
                      className="w-3 h-3"
                    />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{option.name}</span>
                    <span className={`ml-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ¥{option.price.toLocaleString()}
                    </span>
                  </label>
                ))}
                <div className={`border-t-2 pt-3 mt-3 ${isDark ? 'border-blue-600/50 bg-blue-900/20' : 'border-blue-500/50 bg-blue-50'} p-3 rounded`}>
                  <div className="flex justify-between text-base font-bold">
                    <span>小計</span>
                    <span className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                      ¥{exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* 内装（右カラム） */}
            <div className="h-full flex flex-col">
              <h3 className={`text-xl font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className="border-b-2 border-red-600 pb-1 px-4">内装オプション</span>
              </h3>

              {/* 内装イメージ */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['リビング', 'ダイニング', 'キッチン', '和室'].map((name, index) => (
                  <div key={index} className={`rounded-lg p-2 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className={`w-full aspect-[4/3] rounded flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-200'}`}>
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 内装オプションリスト */}
              <Card className={`flex-1 ${isDark ? 'bg-gradient-to-br from-gray-900/70 to-gray-800/50 border-gray-600/30' : 'bg-white border-gray-300'}`}>
                <ScrollableArea maxHeight="clamp(320px, 50vh, 400px)">
                  <div className="space-y-1">
                    {interiorOptions.map(option => (
                      <label key={option.id} className={`flex items-center gap-2 text-sm cursor-pointer p-2 rounded ${isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          checked={option.checked}
                          onChange={(e) => setInteriorOptions(prev => prev.map(o =>
                            o.id === option.id ? { ...o, checked: e.target.checked } : o
                          ))}
                          className="w-3 h-3 flex-shrink-0"
                        />
                        <span className={`flex-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{option.name}</span>
                        <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          ¥{option.price.toLocaleString()}
                        </span>
                      </label>
                    ))}
                  </div>
                </ScrollableArea>
                <div className={`border-t-2 mt-4 pt-3 ${isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'} p-3 rounded`}>
                  <div className="flex justify-between text-base font-bold">
                    <span>内装合計</span>
                    <span className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ¥{interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </Grid3Columns>
        </SectionContainer>

        {/* 下段：合計金額セクション */}
        <SectionContainer title="オプション合計金額">
          <div className="grid-2">
            {/* パターン① */}
            <Card className={`${isDark ? 'bg-gradient-to-br from-red-900/30 to-gray-900/50 border-red-600/50' : 'bg-gradient-to-br from-red-50 to-white border-red-400'}`}>
              <h4 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                パターン①
              </h4>
              <p className={`text-sm mb-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                外観パターン① ＋ 内装オプション
              </p>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span>合計金額</span>
                  <span className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    ¥{calculateTotal(1).toLocaleString()}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                  <span>月々</span>
                  <span className={`text-xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    ¥{calculateMonthlyLoan(calculateTotal(1)).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* パターン② */}
            <Card className={`${isDark ? 'bg-gradient-to-br from-blue-900/30 to-gray-900/50 border-blue-600/50' : 'bg-gradient-to-br from-blue-50 to-white border-blue-400'}`}>
              <h4 className={`text-xl font-bold mb-2 text-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                パターン②
              </h4>
              <p className={`text-sm mb-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                外観パターン② ＋ 内装オプション
              </p>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-black/30' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span>合計金額</span>
                  <span className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                    ¥{calculateTotal(2).toLocaleString()}
                  </span>
                </div>
                <div className={`flex justify-between items-center p-3 rounded ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                  <span>月々</span>
                  <span className={`text-xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    ¥{calculateMonthlyLoan(calculateTotal(2)).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </SectionContainer>
      </div>
    </div>
  );
};

export default Presentation3Optimized;