'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import type { Presentation6, MaintenanceItem } from '@/types';
import { Home, CheckCircle } from 'lucide-react';

interface Presentation6MaintenanceViewProps {
  projectId: string;
}

export function Presentation6MaintenanceView({ projectId }: Presentation6MaintenanceViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation6 | null>(null);

  // デフォルトのメンテナンス項目
  const defaultMaintenanceItems: MaintenanceItem[] = [
    {
      id: 'fire-insurance',
      name: '火災保険',
      generalHouse: {
        year5: 500000,   // 年10万円×5年
        year10: 500000,  // 年10万円×5年（6-10年目）
        year15: 500000,  // 年10万円×5年（11-15年目）
        year20: 500000,  // 年10万円×5年（16-20年目）
        year25: 500000,  // 年10万円×5年（21-25年目）
        year30: 500000   // 年10万円×5年（26-30年目）
      },
      gHouse: {
        // 省令準耐火構造により保険料が約半額
        year5: 250000,   // 年5万円×5年
        year10: 250000,  // 年5万円×5年（6-10年目）
        year15: 250000,  // 年5万円×5年（11-15年目）
        year20: 250000,  // 年5万円×5年（16-20年目）
        year25: 250000,  // 年5万円×5年（21-25年目）
        year30: 250000   // 年5万円×5年（26-30年目）
      }
    },
    {
      id: 'exterior-wall',
      name: '外壁塗装',
      generalHouse: { year10: 1200000, year20: 1200000, year30: 1200000 },
      gHouse: { year15: 800000, year30: 800000 }
    },
    {
      id: 'roof',
      name: '屋根塗装・葺き替え',
      generalHouse: { year10: 800000, year20: 800000, year30: 1500000 },
      gHouse: { year15: 600000, year30: 1000000 }
    },
    {
      id: 'waterproof',
      name: '防水工事',
      generalHouse: { year10: 300000, year20: 300000, year30: 300000 },
      gHouse: { year15: 200000, year30: 200000 }
    },
    {
      id: 'termite',
      name: 'シロアリ防除',
      generalHouse: { year5: 150000, year10: 150000, year15: 150000, year20: 150000, year25: 150000, year30: 150000 },
      gHouse: { year10: 100000, year20: 100000, year30: 100000 }
    },
    {
      id: 'water-heater',
      name: '給湯器交換',
      generalHouse: { year10: 400000, year20: 400000, year30: 400000 },
      gHouse: { year15: 350000, year30: 350000 }
    },
    {
      id: 'air-conditioner',
      name: 'エアコン買い替え（4台）',
      generalHouse: { year10: 600000, year20: 600000, year30: 600000 },
      gHouse: { year15: 500000, year30: 500000 }
    },
    {
      id: 'bathroom',
      name: 'お風呂リフォーム',
      generalHouse: { year20: 1500000 },
      gHouse: { year25: 1200000 }
    },
    {
      id: 'kitchen',
      name: 'キッチンリフォーム',
      generalHouse: { year20: 1800000 },
      gHouse: { year25: 1500000 }
    },
    {
      id: 'toilet',
      name: 'トイレリフォーム',
      generalHouse: { year15: 400000, year30: 400000 },
      gHouse: { year20: 350000 }
    },
    {
      id: 'flooring',
      name: 'フローリング補修',
      generalHouse: { year15: 500000, year30: 500000 },
      gHouse: { year20: 300000 }
    },
    {
      id: 'wallpaper',
      name: '壁紙・クロス張替え',
      generalHouse: { year10: 400000, year20: 400000, year30: 400000 },
      gHouse: { year15: 300000, year30: 300000 }
    },
    {
      id: 'window',
      name: 'サッシ・建具メンテナンス',
      generalHouse: { year15: 300000, year30: 500000 },
      gHouse: { year20: 200000 }
    }
  ];

  useEffect(() => {
    if (currentProject?.presentation6) {
      setPresentation(currentProject.presentation6);
    } else {
      // デフォルトデータ
      const defaultPresentation: Presentation6 = {
        id: `pres6-${Date.now()}`,
        projectId,
        maintenanceItems: defaultMaintenanceItems,
        simulationYears: 30
      };
      setPresentation(defaultPresentation);
    }
  }, [currentProject, projectId]);

  if (!presentation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">メンテナンスシミュレーションを読み込み中...</p>
      </div>
    );
  }

  const items = presentation.maintenanceItems || defaultMaintenanceItems;
  const years = [5, 10, 15, 20, 25, 30];

  // 合計金額を計算
  const calculateTotal = (house: 'general' | 'g') => {
    let total = 0;
    items.forEach(item => {
      const costs = house === 'general' ? item.generalHouse : item.gHouse;
      years.forEach(year => {
        const yearKey = `year${year}` as keyof typeof costs;
        total += costs[yearKey] || 0;
      });
    });
    return total;
  };

  const generalTotal = calculateTotal('general');
  const gHouseTotal = calculateTotal('g');
  const savings = generalTotal - gHouseTotal;

  // 年ごとの合計を計算
  const getYearTotal = (year: number, house: 'general' | 'g') => {
    let total = 0;
    items.forEach(item => {
      const costs = house === 'general' ? item.generalHouse : item.gHouse;
      const yearKey = `year${year}` as keyof typeof costs;
      total += costs[yearKey] || 0;
    });
    return total;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '2px solid #e0e0e0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              G-HOUSE
            </div>
            <div style={{ color: '#999', fontSize: '10px' }}>プレゼンテーション</div>
          </div>
          <div
            style={{
              width: '1px',
              height: '32px',
              background: 'linear-gradient(to bottom, transparent, #c41e3a, transparent)',
            }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
            }}>
              30年間のメンテナンスシミュレーション
            </h1>
            <p style={{
              margin: '2px 0 0',
              fontSize: '14px',
              color: '#666',
            }}>
              一般的な住宅とGハウスのメンテナンスコストを比較
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* 左側：メンテナンス項目詳細 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-auto">
            <div className="text-sm font-semibold text-slate-700 mb-3">メンテナンス項目と実施時期</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">項目</th>
                    {years.map(year => (
                      <th key={year} className="text-center px-2 font-semibold text-gray-700">{year}年</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {/* 一般的な家 */}
                      <tr className={index > 0 ? 'border-t border-gray-100' : ''}>
                        <td className="py-2 px-2" rowSpan={2}>
                          <div className="font-medium text-gray-700">{item.name}</div>
                        </td>
                        {years.map(year => {
                          const yearKey = `year${year}` as keyof typeof item.generalHouse;
                          const cost = item.generalHouse[yearKey];
                          return (
                            <td key={year} className="text-center px-2 py-1">
                              {cost ? (
                                <div className="text-orange-600 font-medium">
                                  ¥{(cost / 10000).toFixed(0)}万
                                </div>
                              ) : (
                                <div className="text-gray-300">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {/* Gハウス */}
                      <tr className="bg-emerald-50">
                        {years.map(year => {
                          const yearKey = `year${year}` as keyof typeof item.gHouse;
                          const cost = item.gHouse[yearKey];
                          return (
                            <td key={year} className="text-center px-2 py-1">
                              {cost ? (
                                <div className="text-emerald-600 font-medium">
                                  ¥{(cost / 10000).toFixed(0)}万
                                </div>
                              ) : (
                                <div className="text-gray-300">-</div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                  {/* 合計行 */}
                  <tr className="border-t-2 border-gray-300 font-bold">
                    <td className="py-2 px-2 text-gray-700">一般的な家 合計</td>
                    {years.map(year => {
                      const total = getYearTotal(year, 'general');
                      return (
                        <td key={year} className="text-center px-2 text-orange-700">
                          {total > 0 ? `¥${(total / 10000).toFixed(0)}万` : '-'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="font-bold bg-emerald-100">
                    <td className="py-2 px-2 text-gray-700">Gハウス 合計</td>
                    {years.map(year => {
                      const total = getYearTotal(year, 'g');
                      return (
                        <td key={year} className="text-center px-2 text-emerald-700">
                          {total > 0 ? `¥${(total / 10000).toFixed(0)}万` : '-'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>※上段（オレンジ）：一般的な家、下段（緑）：Gハウス</p>
              <p>※Gハウスは省令準耐火構造のため、火災保険料が約半額になります。</p>
              <p>※金額は目安です。実際の費用は建物の規模や状況により異なります。</p>
            </div>
          </div>

          {/* 右側：比較サマリー */}
          <div className="flex flex-col h-full gap-3">
            {/* 上部：Gハウスのメリット */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex-1">
              <div className="text-sm font-semibold text-slate-700 mb-2">Gハウスが長持ちする理由</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">高耐久外壁材</div>
                    <div className="text-xs text-gray-600">
                      塗り替え周期が長くコスト削減
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">省エネ設備</div>
                    <div className="text-xs text-gray-600">
                      交換頻度が少なく長期間使用可能
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">防蟻・防腐処理</div>
                    <div className="text-xs text-gray-600">
                      シロアリ防除の頻度を大幅削減
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-gray-700">高品質な建材</div>
                    <div className="text-xs text-gray-600">
                      リフォーム時期を延長
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 中部：年別グラフ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-sm font-semibold text-slate-700 mb-2">メンテナンス時期の比較</div>
              <div className="space-y-1">
                {years.map(year => {
                  const generalCost = getYearTotal(year, 'general');
                  const gCost = getYearTotal(year, 'g');
                  const maxCost = Math.max(generalCost, gCost, 1);
                  return (
                    <div key={year} className="flex items-center gap-2 text-xs">
                      <div className="w-10 text-right font-medium text-gray-600">{year}年</div>
                      <div className="flex-1 grid grid-cols-2 gap-1">
                        <div className="relative h-5">
                          {generalCost > 0 && (
                            <div
                              className="absolute left-0 top-0 h-full bg-orange-400 rounded-r flex items-center px-1"
                              style={{ width: `${Math.min((generalCost / maxCost) * 100, 100)}%` }}
                            >
                              <span className="text-white text-xs font-medium">
                                {(generalCost / 10000).toFixed(0)}万
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="relative h-5">
                          {gCost > 0 && (
                            <div
                              className="absolute left-0 top-0 h-full bg-emerald-500 rounded-r flex items-center px-1"
                              style={{ width: `${Math.min((gCost / maxCost) * 100, 100)}%` }}
                            >
                              <span className="text-white text-xs font-medium">
                                {(gCost / 10000).toFixed(0)}万
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 下部：30年間の総額比較 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="text-sm font-semibold text-slate-700 mb-2">30年間のメンテナンス費用総額</div>

              <div className="grid grid-cols-2 gap-3">
                {/* 一般的な家 */}
                <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-semibold text-gray-700">一般的な家</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    ¥{generalTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    30年間の総額
                  </div>
                </div>

                {/* Gハウス */}
                <div className="border-2 border-emerald-500 rounded-lg p-3 bg-emerald-50">
                  <div className="flex items-center gap-2 mb-1">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">Gハウスの家</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    ¥{gHouseTotal.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    30年間の総額
                  </div>
                </div>
              </div>

              {/* 削減額 */}
              <div className="mt-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-3 text-white text-center">
                <div className="text-xs opacity-90 mb-1">Gハウスなら30年間で</div>
                <div className="text-xl font-bold">
                  ¥{savings.toLocaleString()} 削減！
                </div>
                <div className="text-xs opacity-80 mt-1">
                  （約{Math.round(savings / 10000)}万円の節約）
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}