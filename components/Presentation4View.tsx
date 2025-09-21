'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import type { Presentation4 } from '@/types';
import { Edit2 } from 'lucide-react';

interface Presentation4ViewProps {
  projectId: string;
}

export function Presentation4View({ projectId }: Presentation4ViewProps) {
  const { currentProject, theme } = useStore();
  const [presentation, setPresentation] = useState<Presentation4 | null>(null);
  const [currentArea, setCurrentArea] = useState<number>(100); // 現在のお住まい
  const isDark = theme === 'dark';
  const hasExcelData = presentation?.excelData != null;

  // 編集可能な値の状態
  const [currentRent, setCurrentRent] = useState<number>(100000);
  const [currentElectricity, setCurrentElectricity] = useState<number>(18000);
  const [currentGas, setCurrentGas] = useState<number>(18000);
  const [currentParking, setCurrentParking] = useState<number>(15000);
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    if (currentProject?.presentation4) {
      setPresentation(currentProject.presentation4);
      if (currentProject.presentation4.currentResidence?.area) {
        setCurrentArea(currentProject.presentation4.currentResidence.area);
      }
      if (currentProject.presentation4.currentResidence?.rent) {
        setCurrentRent(currentProject.presentation4.currentResidence.rent);
      }
      if (currentProject.presentation4.currentResidence?.electricity) {
        setCurrentElectricity(currentProject.presentation4.currentResidence.electricity);
      }
      if (currentProject.presentation4.currentResidence?.gas) {
        setCurrentGas(currentProject.presentation4.currentResidence.gas);
      }
      if (currentProject.presentation4.currentResidence?.parking) {
        setCurrentParking(currentProject.presentation4.currentResidence.parking);
      }
    }
  }, [currentProject]);

  if (!presentation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">資金計画データを読み込み中...</p>
      </div>
    );
  }

  // Use Excel data if available
  const displayData = hasExcelData && presentation.excelData ? {
    buildingCost: presentation.excelData.本体,
    constructionCost: presentation.excelData.付帯A + presentation.excelData.付帯B + presentation.excelData.付帯C,
    otherCosts: presentation.excelData.諸費用,
    landCost: presentation.excelData.土地費用,
    totalCost: presentation.excelData.総額,
    loanAmount: presentation.excelData.借入金額,
    downPayment: presentation.excelData.自己資金,
    interestRate: presentation.excelData.金利,
    loanPeriod: presentation.excelData.借入年数,
    monthlyPayment: calculateMonthlyPayment(
      presentation.excelData.借入金額,
      presentation.excelData.金利,
      presentation.excelData.借入年数
    ),
    productName: presentation.excelData.商品名,
    area: presentation.excelData.坪数 || 0,
    floors: presentation.excelData.階数,
  } : {
    buildingCost: presentation.buildingCost,
    constructionCost: presentation.constructionCost,
    otherCosts: presentation.otherCosts,
    landCost: presentation.landCost,
    totalCost: presentation.totalCost,
    loanAmount: presentation.loanAmount,
    downPayment: presentation.downPayment,
    interestRate: presentation.interestRate,
    loanPeriod: presentation.loanPeriod,
    monthlyPayment: presentation.monthlyPayment,
    productName: '',
    area: 32, // デフォルト32坪
    floors: '',
  };

  // displayData.areaは坪数なので、㎡数を計算（坪数 ÷ 0.3025 = ㎡）
  const generalArea = displayData.area > 0 ? displayData.area / 0.3025 : 100;
  const gHouseArea = displayData.area > 0 ? displayData.area / 0.3025 : 100;

  // 坪数計算（㎡ × 0.3025 = 坪）
  const currentTsubo = (currentArea * 0.3025).toFixed(1);
  const generalTsubo = displayData.area > 0 ? displayData.area.toFixed(1) : '32.0';
  const gHouseTsubo = displayData.area > 0 ? displayData.area.toFixed(1) : '32.0';

  // 月額比較データ
  const currentTotal = currentRent + currentElectricity + currentGas + currentParking;
  const generalHousePayment = displayData.monthlyPayment + 13000; // 一般的な家は光熱費が高い
  const gHousePayment = displayData.monthlyPayment + 5000; // Gハウスは光熱費が安い
  const gHouseSolarBenefit = 15000; // 太陽光による削減額
  const netGHousePayment = gHousePayment - gHouseSolarBenefit;

  function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) {
      return Math.round(principal / months);
    }
    const monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                  (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthly);
  }

  // 建物費用の詳細
  const buildingDetails = hasExcelData && presentation.excelData ? {
    本体工事費用: presentation.excelData.本体,
    付帯工事費用A: presentation.excelData.付帯A,
    付帯工事費用B: presentation.excelData.付帯B + (presentation.excelData.オプション費用 || 0),
    付帯工事費用C: presentation.excelData.付帯C,
    消費税: presentation.excelData.消費税,
    建物費用合計: presentation.excelData.合計,
  } : presentation ? {
    本体工事費用: presentation.buildingCost || 0,
    付帯工事費用A: Math.round((presentation.constructionCost || 0) * 0.3),
    付帯工事費用B: Math.round((presentation.constructionCost || 0) * 0.4),
    付帯工事費用C: Math.round((presentation.constructionCost || 0) * 0.3),
    消費税: Math.round(((presentation.buildingCost || 0) + (presentation.constructionCost || 0)) * 0.1),
    建物費用合計: Math.round(((presentation.buildingCost || 0) + (presentation.constructionCost || 0)) * 1.1),
  } : {
    本体工事費用: 0,
    付帯工事費用A: 0,
    付帯工事費用B: 0,
    付帯工事費用C: 0,
    消費税: 0,
    建物費用合計: 0,
  };

  // カテゴリ設定
  const mainCategories = [
    { key: 'building', label: '建物費用', value: buildingDetails.建物費用合計 },
    { key: 'exterior', label: '外構工事', value: hasExcelData && presentation.excelData ? presentation.excelData.外構工事 : 2000000 },
    { key: 'land', label: '土地費用', value: displayData.landCost },
    { key: 'other', label: '諸費用', value: displayData.otherCosts },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div style={{
        padding: '40px 60px 20px',
        borderBottom: '2px solid #e0e0e0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '18px' }}>
              G-HOUSE
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>プレゼンテーション</div>
          </div>
          <div
            style={{
              width: '2px',
              height: '40px',
              background: 'linear-gradient(to bottom, transparent, #c41e3a, transparent)',
            }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              資金計画書
            </h1>
            <p style={{
              margin: '5px 0 0',
              fontSize: '16px',
              color: '#666',
            }}>
              毎月のお支払額のシミュレーションをします
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1" style={{ padding: '16px' }}>
        {/* 商品情報 */}
        {(displayData.productName || displayData.area > 0 || displayData.floors) && (
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '8px 16px',
            marginBottom: '12px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '24px',
          }}>
            {displayData.productName && (
              <span style={{ fontSize: '14px', color: '#333' }}>
                商品名: <span style={{ fontWeight: '600' }}>{displayData.productName}</span>
              </span>
            )}
            {displayData.area > 0 && (
              <span style={{ fontSize: '14px', color: '#333' }}>
                延床面積: <span style={{ fontWeight: '600' }}>{displayData.area}坪</span>
              </span>
            )}
            {displayData.floors && (
              <span style={{ fontSize: '14px', color: '#333' }}>
                階数: <span style={{ fontWeight: '600' }}>{displayData.floors}</span>
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 h-[calc(100%-48px)]">
          {/* 左側：費用内訳とローン */}
          <div className="grid grid-rows-2 gap-3">
            {/* 費用内訳 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 建物費用 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-2">建物費用内訳</div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">本体工事費用</span>
                    <span className="font-medium text-gray-900">¥{buildingDetails.本体工事費用.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">付帯工事費用A（電気・給排水・ガス工事）</span>
                    <span className="font-medium text-gray-900">¥{buildingDetails.付帯工事費用A.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">付帯工事費用B（間取変更・オプション工事）</span>
                    <span className="font-medium text-gray-900">¥{buildingDetails.付帯工事費用B.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">付帯工事費用C（地盤改良・解体工事）</span>
                    <span className="font-medium text-gray-900">¥{buildingDetails.付帯工事費用C.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">消費税（10%）</span>
                    <span className="font-medium text-gray-900">¥{buildingDetails.消費税.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1.5 mt-1.5 border-t border-gray-200">
                    <span className="text-gray-900">建物費用総額</span>
                    <span className="text-gray-900">¥{buildingDetails.建物費用合計.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* その他費用 */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="text-sm font-semibold text-slate-700 mb-2">その他費用</div>
                <div className="space-y-1.5">
                  {mainCategories.slice(1).map((category) => (
                    <div key={category.key} className="flex justify-between text-xs">
                      <span className="text-gray-600">{category.label}</span>
                      <span className="font-medium text-gray-900">¥{category.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-bold pt-1.5 mt-1.5 border-t-2 border-slate-300">
                    <span className="text-gray-900">総額</span>
                    <span className="text-lg text-gray-900">¥{displayData.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ローンシミュレーション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-sm font-semibold text-slate-700 mb-2">ローンシミュレーション</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="bg-gray-50 rounded-lg p-2.5 mb-2">
                    <div className="text-xs text-gray-600 mb-1">借入金額</div>
                    <div className="text-lg font-bold text-gray-900">
                      ¥{displayData.loanAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <div className="text-xs text-gray-600 mb-1">自己資金（頭金）</div>
                    <div className="text-lg font-bold text-gray-900">
                      ¥{displayData.downPayment.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <div className="text-xs text-gray-600 mb-1">借入金利</div>
                      <div className="text-base font-bold text-gray-900">
                        {displayData.interestRate.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <div className="text-xs text-gray-600 mb-1">返済期間</div>
                      <div className="text-base font-bold text-gray-900">
                        {displayData.loanPeriod}年
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-2.5 text-white">
                    <div className="text-xs opacity-90 mb-1">月々のローン返済額</div>
                    <div className="text-xl font-bold">
                      ¥{displayData.monthlyPayment.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：月々のお支払い比較 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
            <div className="text-sm font-semibold text-slate-700 mb-3">月々のお支払い比較</div>

            <div className="grid grid-cols-3 gap-2 h-[calc(100%-32px)]">
              {/* 現在のお住まい */}
              <div className="border border-gray-200 rounded-lg p-2 flex flex-col">
                <div className="text-xs font-bold text-gray-700 mb-2 text-center">現在のお住まい</div>
                <div className="mb-2 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">床面積:</span>
                    <input
                      type="number"
                      value={currentArea}
                      onChange={(e) => setCurrentArea(Number(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 text-xs border border-gray-300 rounded"
                    />
                    <span className="text-xs text-gray-600">㎡</span>
                    <span className="text-xs text-gray-500">({currentTsubo}坪)</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">家賃</span>
                    <div className="flex items-center gap-1">
                      {editingField === 'rent' ? (
                        <input
                          type="number"
                          value={currentRent}
                          onChange={(e) => setCurrentRent(Number(e.target.value) || 0)}
                          onBlur={() => setEditingField(null)}
                          className="w-20 px-1 py-0.5 text-xs border border-gray-300 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">¥{currentRent.toLocaleString()}</span>
                      )}
                      <Edit2
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setEditingField('rent')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">電気代</span>
                    <div className="flex items-center gap-1">
                      {editingField === 'electricity' ? (
                        <input
                          type="number"
                          value={currentElectricity}
                          onChange={(e) => setCurrentElectricity(Number(e.target.value) || 0)}
                          onBlur={() => setEditingField(null)}
                          className="w-20 px-1 py-0.5 text-xs border border-gray-300 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">¥{currentElectricity.toLocaleString()}</span>
                      )}
                      <Edit2
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setEditingField('electricity')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ガス代</span>
                    <div className="flex items-center gap-1">
                      {editingField === 'gas' ? (
                        <input
                          type="number"
                          value={currentGas}
                          onChange={(e) => setCurrentGas(Number(e.target.value) || 0)}
                          onBlur={() => setEditingField(null)}
                          className="w-20 px-1 py-0.5 text-xs border border-gray-300 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">¥{currentGas.toLocaleString()}</span>
                      )}
                      <Edit2
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setEditingField('gas')}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">駐車場代</span>
                    <div className="flex items-center gap-1">
                      {editingField === 'parking' ? (
                        <input
                          type="number"
                          value={currentParking}
                          onChange={(e) => setCurrentParking(Number(e.target.value) || 0)}
                          onBlur={() => setEditingField(null)}
                          className="w-20 px-1 py-0.5 text-xs border border-gray-300 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-gray-900">¥{currentParking.toLocaleString()}</span>
                      )}
                      <Edit2
                        className="w-3 h-3 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setEditingField('parking')}
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 mt-auto">
                  <div className="text-xs text-gray-600 mb-0.5">月々の支払い合計</div>
                  <div className="text-lg font-bold text-gray-900">
                    ¥{currentTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* 一般的な家 */}
              <div className="border border-gray-200 rounded-lg p-2 flex flex-col">
                <div className="text-xs font-bold text-gray-700 mb-2 text-center">一般的な家</div>
                <div className="mb-2 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">延床面積:</span>
                    <span className="text-xs font-medium text-gray-900">{generalTsubo}坪</span>
                    <span className="text-xs text-gray-500">({generalArea.toFixed(0)}㎡)</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">住宅ローン返済</span>
                    <span className="font-medium text-gray-900">¥{displayData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">電気代</span>
                    <span className="font-medium text-gray-900">¥8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ガス代</span>
                    <span className="font-medium text-gray-900">¥5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">駐車場代</span>
                    <span className="font-medium text-gray-900">¥0</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-2 mt-auto">
                  <div className="text-xs text-gray-600 mb-0.5">月々の支払い合計</div>
                  <div className="text-lg font-bold text-gray-900">
                    ¥{generalHousePayment.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Gハウスの家 */}
              <div className="border-2 border-emerald-500 rounded-lg p-2 flex flex-col bg-emerald-50">
                <div className="text-xs font-bold text-emerald-700 mb-2 text-center">Gハウスの家</div>
                <div className="mb-2 pb-2 border-b border-emerald-300">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600">延床面積:</span>
                    <span className="text-xs font-medium text-gray-900">{gHouseTsubo}坪</span>
                    <span className="text-xs text-gray-500">({gHouseArea.toFixed(0)}㎡)</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">住宅ローン返済</span>
                    <span className="font-medium text-gray-900">¥{displayData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">電気代（高断熱・省エネ）</span>
                    <span className="font-medium text-gray-900">¥3,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ガス代（高効率給湯器）</span>
                    <span className="font-medium text-gray-900">¥2,000</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>太陽光発電売電収入</span>
                    <span className="font-medium">-¥15,000</span>
                  </div>
                </div>
                <div className="bg-emerald-100 rounded-lg p-2 mt-auto">
                  <div className="text-xs text-emerald-600 mb-0.5">実質月々のお支払い</div>
                  <div className="text-lg font-bold text-emerald-700">
                    ¥{netGHousePayment.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}