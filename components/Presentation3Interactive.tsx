'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';

interface OptionItem {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const Presentation3Interactive: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  // 状態管理
  const [editMode, setEditMode] = useState(false);
  const [rateE, setRateE] = useState(0.8);
  const [yearsE, setYearsE] = useState(35);
  const [rateF, setRateF] = useState(0.8);
  const [yearsF, setYearsF] = useState(35);

  // 外観パターン①
  const [exteriorOption1, setExteriorOption1] = useState<OptionItem[]>([
    { id: 'e1-1', name: '屋根材グレードアップ', price: 50000, checked: false },
    { id: 'e1-2', name: '外壁タイル仕上げ', price: 80000, checked: false },
    { id: 'e1-3', name: '玄関ドアグレードアップ', price: 30000, checked: false },
    { id: 'e1-4', name: '窓サッシカラー変更', price: 40000, checked: false },
  ]);

  // 外観パターン②
  const [exteriorOption2, setExteriorOption2] = useState<OptionItem[]>([
    { id: 'e2-1', name: '屋根材プレミアム', price: 60000, checked: false },
    { id: 'e2-2', name: '外壁石材仕上げ', price: 100000, checked: false },
    { id: 'e2-3', name: '玄関ドアスマートキー', price: 45000, checked: false },
    { id: 'e2-4', name: 'バルコニー拡張', price: 35000, checked: false },
  ]);

  // 内装オプション
  const [interiorOptions, setInteriorOptions] = useState<OptionItem[]>([
    { id: 'i1', name: 'フローリング変更', price: 25000, checked: false },
    { id: 'i2', name: '壁紙グレードアップ', price: 15000, checked: false },
    { id: 'i3', name: 'キッチン収納追加', price: 30000, checked: false },
    { id: 'i4', name: '照明器具変更', price: 20000, checked: false },
    { id: 'i5', name: 'カーテンレール', price: 35000, checked: false },
    { id: 'i6', name: 'エコカラット', price: 40000, checked: false },
    { id: 'i7', name: '室内物干し', price: 18000, checked: false },
    { id: 'i8', name: 'トイレ手洗い追加', price: 22000, checked: false },
    { id: 'i9', name: '洗面台グレードアップ', price: 28000, checked: false },
    { id: 'i10', name: '浴室暖房乾燥機', price: 45000, checked: false },
    { id: 'i11', name: 'コンセント追加', price: 12000, checked: false },
    { id: 'i12', name: '床暖房（リビング）', price: 38000, checked: false },
    { id: 'i13', name: 'ニッチ棚追加', price: 16000, checked: false },
    { id: 'i14', name: '玄関収納追加', price: 24000, checked: false },
    { id: 'i15', name: 'バルコニー屋根', price: 32000, checked: false },
  ]);

  // 小計計算
  const subtotalA = exteriorOption1.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);
  const subtotalB = exteriorOption2.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);
  const interiorTotal = interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0);

  // 合計計算
  const totalE = subtotalA + interiorTotal;
  const totalF = subtotalB + interiorTotal;

  // 月額計算
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    if (principal === 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) {
      return Math.round(principal / months);
    }
    const monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                  (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthly);
  };

  const monthlyE = calculateMonthlyPayment(totalE, rateE, yearsE);
  const monthlyF = calculateMonthlyPayment(totalF, rateF, yearsF);

  return (
    <A3Page title="オプション選択" subtitle="資金計画のオプション予算取りを行います">
      <div className="w-full h-full bg-gray-50 relative">

        {/* メインコンテンツ */}
        <div className="h-full">
          <div className="h-full flex flex-col gap-3">
            {/* 上段：A, B, C セクション */}
            <div className="flex gap-3" style={{ height: '460px' }}>
              {/* A: 外観パターン① */}
              <div className="w-[375px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-red-50 text-red-600 text-base font-bold px-3 py-2 rounded mb-2.5 flex justify-between items-center">
                  <span>A: 外観パターン①</span>
                </div>
                <div className="w-[351px] h-[200px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-black text-xs relative">
                  {editMode ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="exterior1-upload"
                      />
                      <label
                        htmlFor="exterior1-upload"
                        className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 border border-blue-600 px-2 py-1 rounded"
                      >
                        画像をアップロード
                      </label>
                      <span className="text-[10px]">外観イメージ①</span>
                    </div>
                  ) : (
                    '外観イメージ①'
                  )}
                </div>
                <div className="flex-1 space-y-0.5 overflow-y-auto">
                  {exteriorOption1.map((option) => (
                    <label key={option.id} className="flex items-center p-0.5 text-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setExteriorOption1(prev =>
                            prev.map(o => o.id === option.id ? { ...o, checked: e.target.checked } : o)
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                  <span className="text-black">小計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{subtotalA.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* B: 外観パターン② */}
              <div className="w-[375px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-blue-50 text-blue-700 text-base font-bold px-3 py-2 rounded mb-2.5">
                  <span>B: 外観パターン②</span>
                </div>
                <div className="w-[351px] h-[200px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-black text-xs">
                  外観イメージ②
                </div>
                <div className="flex-1 space-y-0.5 overflow-y-auto">
                  {exteriorOption2.map((option) => (
                    <label key={option.id} className="flex items-center p-0.5 text-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setExteriorOption2(prev =>
                            prev.map(o => o.id === option.id ? { ...o, checked: e.target.checked } : o)
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                  <span className="text-black">小計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{subtotalB.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* C: 内観イメージ */}
              <div className="w-[705px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-green-50 text-green-700 text-base font-bold px-3 py-2 rounded mb-2.5">
                  <span>C: 内観イメージ</span>
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-3 w-[681px] h-[413px] mx-auto">
                  {['内観①', '内観②', '内観③', '内観④'].map((label, index) => (
                    <div key={index} className="w-[333px] h-[200px] bg-gray-100 rounded flex items-center justify-center text-black text-xs">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 下段：D, E, F セクション */}
            <div className="flex-1 flex gap-3">
              {/* D: 内装オプション */}
              <div className="w-[909px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-purple-50 text-purple-700 text-base font-bold px-3 py-2 rounded mb-2">
                  <span>D: 内装オプション</span>
                </div>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1 flex-1 mt-2">
                  {interiorOptions.map((option) => (
                    <label key={option.id} className="flex items-center p-0.5 text-sm hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setInteriorOptions(prev =>
                            prev.map(o => o.id === option.id ? { ...o, checked: e.target.checked } : o)
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-2 border-t border-gray-200 text-sm">
                  <span className="text-black">内装合計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{interiorTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* E, F: 合計 */}
              <div className="flex gap-3">
                {/* E: 外観①＋内装 */}
                <div className="w-[267px] bg-white rounded-lg p-3 shadow flex flex-col">
                  <div className="bg-amber-50 text-orange-600 text-base font-bold px-3 py-2 rounded mb-4">
                    E: 外観①＋内装オプション
                  </div>
                  <div className="mb-4">
                    <div className="text-black text-base mb-1">合計額</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{totalE.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-black text-base mb-1">月額(目安)</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{monthlyE.toLocaleString()}
                    </div>
                    <div className="text-black text-sm mt-1 text-right">
                      {editMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={rateE}
                            onChange={(e) => setRateE(parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm border rounded px-1"
                            step="0.1"
                            min="0"
                            max="20"
                          />%/
                          <input
                            type="number"
                            value={yearsE}
                            onChange={(e) => setYearsE(parseInt(e.target.value) || 0)}
                            className="w-12 text-sm border rounded px-1"
                            min="1"
                            max="50"
                          />年
                        </div>
                      ) : (
                        `${rateE}%/${yearsE}年`
                      )}
                    </div>
                  </div>
                </div>

                {/* F: 外観②＋内装 */}
                <div className="w-[267px] bg-white rounded-lg p-3 shadow flex flex-col">
                  <div className="bg-cyan-50 text-cyan-600 text-base font-bold px-3 py-2 rounded mb-4">
                    F: 外観②＋内装オプション
                  </div>
                  <div className="mb-4">
                    <div className="text-black text-base mb-1">合計額</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{totalF.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-black text-base mb-1">月額(目安)</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{monthlyF.toLocaleString()}
                    </div>
                    <div className="text-black text-sm mt-1 text-right">
                      {editMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={rateF}
                            onChange={(e) => setRateF(parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm border rounded px-1"
                            step="0.1"
                            min="0"
                            max="20"
                          />%/
                          <input
                            type="number"
                            value={yearsF}
                            onChange={(e) => setYearsF(parseInt(e.target.value) || 0)}
                            className="w-12 text-sm border rounded px-1"
                            min="1"
                            max="50"
                          />年
                        </div>
                      ) : (
                        `${rateF}%/${yearsF}年`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 編集ボタン */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`fixed bottom-5 right-5 w-[50px] h-[50px] rounded-full bg-white shadow-lg border-none cursor-pointer text-xl hover:shadow-xl hover:scale-110 transition-all ${editMode ? '' : 'grayscale'}`}
        >
          ✏️
        </button>
      </div>
    </A3Page>
  );
};

export default Presentation3Interactive;