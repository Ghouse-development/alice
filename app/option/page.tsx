'use client';

import { useState, useEffect } from 'react';

export default function OptionPage() {
  const [rateE, setRateE] = useState(0.8);
  const [yearsE, setYearsE] = useState(35);
  const [rateF, setRateF] = useState(0.8);
  const [yearsF, setYearsF] = useState(35);
  const [editMode, setEditMode] = useState(false);

  const initialData = {
    'option-list-a': [
      { name: '屋根材グレードアップ', price: 50000, checked: false },
      { name: '外壁タイル仕上げ', price: 80000, checked: false },
      { name: '玄関ドアグレードアップ', price: 30000, checked: false },
      { name: '窓サッシカラー変更', price: 40000, checked: false },
      { name: '雨樋グレードアップ', price: 25000, checked: false }
    ],
    'option-list-b': [
      { name: '屋根材プレミアム', price: 60000, checked: false },
      { name: '外壁石材仕上げ', price: 100000, checked: false },
      { name: '玄関ドアスマートキー', price: 45000, checked: false },
      { name: 'バルコニー拡張', price: 35000, checked: false },
      { name: '外構照明追加', price: 28000, checked: false }
    ],
    'option-list-d': [
      { name: 'フローリング変更', price: 25000, checked: false },
      { name: '壁紙グレードアップ', price: 15000, checked: false },
      { name: 'キッチン収納追加', price: 30000, checked: false },
      { name: '照明器具変更', price: 20000, checked: false },
      { name: 'カーテンレール', price: 35000, checked: false },
      { name: 'エコカラット', price: 40000, checked: false },
      { name: '室内物干し', price: 18000, checked: false },
      { name: 'トイレ手洗い追加', price: 22000, checked: false },
      { name: '洗面台グレードアップ', price: 28000, checked: false },
      { name: '浴室暖房乾燥機', price: 45000, checked: false },
      { name: 'コンセント追加', price: 12000, checked: false },
      { name: '床暖房（リビング）', price: 38000, checked: false },
      { name: 'ニッチ棚追加', price: 16000, checked: false },
      { name: '玄関収納追加', price: 24000, checked: false },
      { name: 'バルコニー屋根', price: 32000, checked: false }
    ]
  };

  const [optionsA, setOptionsA] = useState(initialData['option-list-a']);
  const [optionsB, setOptionsB] = useState(initialData['option-list-b']);
  const [optionsD, setOptionsD] = useState(initialData['option-list-d']);

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

  const subtotalA = optionsA.reduce((sum, opt) => sum + (opt.checked ? opt.price : 0), 0);
  const subtotalB = optionsB.reduce((sum, opt) => sum + (opt.checked ? opt.price : 0), 0);
  const interiorTotal = optionsD.reduce((sum, opt) => sum + (opt.checked ? opt.price : 0), 0);

  const totalE = subtotalA + interiorTotal;
  const totalF = subtotalB + interiorTotal;
  const monthlyE = calculateMonthlyPayment(totalE, rateE, yearsE);
  const monthlyF = calculateMonthlyPayment(totalF, rateF, yearsF);

  const toggleOption = (category: string, index: number) => {
    if (category === 'A') {
      const newOptions = [...optionsA];
      newOptions[index].checked = !newOptions[index].checked;
      setOptionsA(newOptions);
    } else if (category === 'B') {
      const newOptions = [...optionsB];
      newOptions[index].checked = !newOptions[index].checked;
      setOptionsB(newOptions);
    } else if (category === 'D') {
      const newOptions = [...optionsD];
      newOptions[index].checked = !newOptions[index].checked;
      setOptionsD(newOptions);
    }
  };

  return (
    <div className="w-[1190px] h-[842px] bg-gray-50 overflow-hidden mx-auto">
      {/* ヘッダー */}
      <div className="h-20 bg-white flex items-center px-10 border-b-2 border-gray-200">
        <span className="text-red-600 text-xl font-bold">G-HOUSE</span>
        <span className="text-gray-600 text-sm ml-4">プレゼンテーション</span>
        <h1 className="text-3xl font-bold ml-10">オプション選択</h1>
      </div>

      <div className="p-2.5 h-[762px] flex flex-col gap-2.5">
        {/* 上段 */}
        <div className="flex gap-2.5 h-[420px]">
          <div className="flex gap-2.5">
            {/* A: 外観パターン① */}
            <div className="w-[280px] bg-white rounded-lg p-2.5 shadow flex flex-col">
              <div className="bg-red-50 text-red-600 text-base font-bold px-3 py-2 rounded mb-2.5">
                A: 外観パターン①
              </div>
              <div className="w-[260px] h-[173px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-gray-400 text-xs">
                外観イメージ①
              </div>
              <div className="flex-1 overflow-y-auto">
                {optionsA.map((option, index) => (
                  <div key={index} className="flex items-center p-0.5 text-xs">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => toggleOption('A', index)}
                      className="mr-1.5"
                    />
                    <span className="flex-1">{option.name}</span>
                    <span className="text-gray-600 text-[10px] font-medium">
                      ¥{option.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                <span className="text-gray-600">小計:</span>
                <span className="font-bold text-gray-800 min-w-[80px] text-right">
                  ¥{subtotalA.toLocaleString()}
                </span>
              </div>
            </div>

            {/* B: 外観パターン② */}
            <div className="w-[280px] bg-white rounded-lg p-2.5 shadow flex flex-col">
              <div className="bg-blue-50 text-blue-700 text-base font-bold px-3 py-2 rounded mb-2.5">
                B: 外観パターン②
              </div>
              <div className="w-[260px] h-[173px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-gray-400 text-xs">
                外観イメージ②
              </div>
              <div className="flex-1 overflow-y-auto">
                {optionsB.map((option, index) => (
                  <div key={index} className="flex items-center p-0.5 text-xs">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => toggleOption('B', index)}
                      className="mr-1.5"
                    />
                    <span className="flex-1">{option.name}</span>
                    <span className="text-gray-600 text-[10px] font-medium">
                      ¥{option.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                <span className="text-gray-600">小計:</span>
                <span className="font-bold text-gray-800 min-w-[80px] text-right">
                  ¥{subtotalB.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* C: 内観イメージ */}
          <div className="flex-1 bg-white rounded-lg p-2.5 shadow">
            <div className="bg-green-50 text-green-700 text-base font-bold px-3 py-2 rounded mb-2.5">
              C: 内観イメージ
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-[530px] h-[357px] mx-auto">
              {['内観①', '内観②', '内観③', '内観④'].map((label, index) => (
                <div key={index} className="w-[260px] h-[173px] bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 下段 */}
        <div className="flex-1 flex gap-2.5 h-[322px]">
          {/* D: 内装オプション */}
          <div className="w-[720px] bg-white rounded-lg p-2.5 shadow flex flex-col">
            <div className="bg-purple-50 text-purple-700 text-base font-bold px-3 py-2 rounded mb-2">
              D: 内装オプション
            </div>
            <div className="grid grid-cols-3 gap-x-3 gap-y-1 flex-1 mt-2">
              {optionsD.map((option, index) => (
                <div key={index} className="flex items-center p-0.5 text-xs">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={() => toggleOption('D', index)}
                    className="mr-1.5"
                  />
                  <span className="flex-1">{option.name}</span>
                  <span className="text-gray-600 text-[10px] font-medium">
                    ¥{option.price.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-end items-center gap-2.5 pt-2 mt-2 border-t border-gray-200 text-sm">
              <span className="text-gray-600">内装合計:</span>
              <span className="font-bold text-gray-800 min-w-[80px] text-right">
                ¥{interiorTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* E, F: 合計 */}
          <div className="flex gap-2.5 flex-1">
            {/* E: 外観①＋内装 */}
            <div className="flex-1 bg-white rounded-lg p-3 shadow flex flex-col">
              <div className="bg-amber-50 text-orange-600 text-sm font-bold px-2.5 py-1.5 rounded mb-4">
                E: 外観①＋内装
              </div>
              <div className="mb-4">
                <div className="text-gray-600 text-xs mb-1">合計額</div>
                <div className="text-xl font-bold text-gray-800 text-right">
                  ¥{totalE.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">月額(目安)</div>
                <div className="text-xl font-bold text-gray-800 text-right">
                  ¥{monthlyE.toLocaleString()}
                </div>
                <div className="text-gray-400 text-[9px] mt-1 text-right">
                  {rateE}%/{yearsE}年
                </div>
              </div>
            </div>

            {/* F: 外観②＋内装 */}
            <div className="flex-1 bg-white rounded-lg p-3 shadow flex flex-col">
              <div className="bg-cyan-50 text-cyan-600 text-sm font-bold px-2.5 py-1.5 rounded mb-4">
                F: 外観②＋内装
              </div>
              <div className="mb-4">
                <div className="text-gray-600 text-xs mb-1">合計額</div>
                <div className="text-xl font-bold text-gray-800 text-right">
                  ¥{totalF.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-xs mb-1">月額(目安)</div>
                <div className="text-xl font-bold text-gray-800 text-right">
                  ¥{monthlyF.toLocaleString()}
                </div>
                <div className="text-gray-400 text-[9px] mt-1 text-right">
                  {rateF}%/{yearsF}年
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 編集ボタン */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="fixed bottom-5 right-5 w-[50px] h-[50px] rounded-full bg-white shadow-lg border-none cursor-pointer text-xl grayscale hover:shadow-xl hover:scale-110 transition-all"
        style={{ filter: editMode ? 'none' : 'grayscale(100%)' }}
      >
        ✏️
      </button>
    </div>
  );
}