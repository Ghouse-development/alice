'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const Presentation5UtilityCostSimulation: React.FC = () => {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  // State for simulation parameters
  const [editMode, setEditMode] = useState(false);
  const [familySize, setFamilySize] = useState(4);
  const [gHouseSpec, setGHouseSpec] = useState<'G2' | 'G3'>('G2');
  const [solarCapacity, setSolarCapacity] = useState(8.3);
  const [hasBattery, setHasBattery] = useState(true);
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533);
  const [monthlyGas, setMonthlyGas] = useState(8500);
  const [inflationRate, setInflationRate] = useState(2);
  const [electricityUnitPrice, setElectricityUnitPrice] = useState(35);
  const [gasUnitPrice, setGasUnitPrice] = useState(120);
  const [fitPrice, setFitPrice] = useState(16);
  const [postFitPrice, setPostFitPrice] = useState(7);

  // Calculate 30-year simulation data
  const simulationData = useMemo(() => {
    const years = Array.from({ length: 31 }, (_, i) => i);

    // Initial costs (建築時の追加費用)
    const solarCost = solarCapacity * 250000; // 太陽光発電システム
    const batteryCost = hasBattery ? 1500000 : 0; // 蓄電池システム
    const g2AdditionalCost = 500000; // G2仕様の追加費用
    const g3AdditionalCost = 800000; // G3仕様の追加費用

    // Monthly utility costs
    const baseMonthlyUtility = monthlyElectricity + monthlyGas;
    const gHouseMonthlyUtility =
      gHouseSpec === 'G3' ? baseMonthlyUtility * 0.5 : baseMonthlyUtility * 0.65;

    // Solar generation calculation
    const yearlySolarGeneration = solarCapacity * 1000 * 1.2; // 年間発電量 kWh
    const selfConsumptionRate = hasBattery ? 0.6 : 0.3; // 自家消費率
    const yearlySelfConsumption = yearlySolarGeneration * selfConsumptionRate;
    const yearlySoldElectricity = yearlySolarGeneration * (1 - selfConsumptionRate);

    // Calculate cumulative costs for each pattern
    const pattern1: number[] = []; // 一般的な家
    const pattern2: number[] = []; // Gハウスの家
    const pattern3: number[] = []; // Gハウスの家＋太陽光発電
    const pattern4: number[] = []; // Gハウスの家＋太陽光＋蓄電池

    let cumulative1 = 0;
    let cumulative2 = gHouseSpec === 'G3' ? g3AdditionalCost : g2AdditionalCost;
    let cumulative3 = cumulative2 + solarCost;
    let cumulative4 = cumulative2 + solarCost + batteryCost;

    years.forEach((year) => {
      if (year === 0) {
        pattern1.push(0);
        pattern2.push(cumulative2 / 10000);
        pattern3.push(cumulative3 / 10000);
        pattern4.push(cumulative4 / 10000);
      } else {
        const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
        const yearlyUtility1 = baseMonthlyUtility * 12 * inflationMultiplier;
        const yearlyUtility2 = gHouseMonthlyUtility * 12 * inflationMultiplier;

        // 売電収入の計算（FIT期間とその後）
        let yearlySellIncome = 0;
        if (year <= 10) {
          // FIT期間（10年間）
          yearlySellIncome = yearlySoldElectricity * fitPrice;
        } else {
          // FIT期間終了後
          yearlySellIncome = yearlySoldElectricity * postFitPrice;
        }

        // 自家消費による削減額
        const yearlySelfConsumptionSavings =
          yearlySelfConsumption * electricityUnitPrice * inflationMultiplier;

        // メンテナンス費用の追加
        if (year === 10) {
          cumulative3 += 200000; // パワコン点検・メンテナンス
          cumulative4 += 200000;
        }
        if (year === 15 && hasBattery) {
          cumulative4 += 800000; // 蓄電池交換
        }
        if (year === 20) {
          cumulative3 += 300000; // パワコン交換
          cumulative4 += 300000;
        }

        // 累計コストの計算
        cumulative1 += yearlyUtility1;
        cumulative2 += yearlyUtility2;
        cumulative3 += Math.max(
          0,
          yearlyUtility2 - yearlySelfConsumptionSavings - yearlySellIncome
        );
        cumulative4 += Math.max(
          0,
          yearlyUtility2 - yearlySelfConsumptionSavings * 1.5 - yearlySellIncome
        );

        pattern1.push(Math.round(cumulative1 / 10000));
        pattern2.push(Math.round(cumulative2 / 10000));
        pattern3.push(Math.round(cumulative3 / 10000));
        pattern4.push(Math.round(cumulative4 / 10000));
      }
    });

    return {
      years,
      pattern1,
      pattern2,
      pattern3,
      pattern4,
    };
  }, [
    familySize,
    gHouseSpec,
    solarCapacity,
    hasBattery,
    monthlyElectricity,
    monthlyGas,
    inflationRate,
    electricityUnitPrice,
    gasUnitPrice,
    fitPrice,
    postFitPrice,
  ]);

  // Chart configuration
  const chartData: ChartData<'line'> = {
    labels: simulationData.years,
    datasets: [
      {
        label: '一般的な家',
        data: simulationData.pattern1,
        borderColor: '#666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        borderWidth: 2,
      },
      {
        label: `Gハウスの家（${gHouseSpec}仕様）`,
        data: simulationData.pattern2,
        borderColor: '#388e3c',
        backgroundColor: 'rgba(56, 142, 60, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Gハウスの家＋太陽光発電',
        data: simulationData.pattern3,
        borderColor: '#f57c00',
        backgroundColor: 'rgba(245, 124, 0, 0.1)',
        borderWidth: 2,
      },
      {
        label: 'Gハウスの家＋太陽光＋蓄電池',
        data: simulationData.pattern4,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}万円`;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 1000,
            yMax: 1000,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: '1000万円ライン',
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'red',
              font: {
                weight: 'bold',
              },
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '経過年数',
          font: {
            size: 14,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: '累計コスト（万円）',
          font: {
            size: 14,
          },
        },
        min: 0,
        max: 2500,
        ticks: {
          stepSize: 500,
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        grid: {
          display: true,
          color: function (context) {
            if (context.tick.value === 1000) {
              return 'rgba(255, 0, 0, 0.2)';
            }
            return 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: function (context) {
            if (context.tick.value === 1000) {
              return 2;
            }
            return 1;
          },
        },
      },
    },
  };

  // Calculate final values for display
  const finalYear = 30;
  const finalCost1 = simulationData.pattern1[finalYear];
  const finalCost2 = simulationData.pattern2[finalYear];
  const finalCost3 = simulationData.pattern3[finalYear];
  const finalCost4 = simulationData.pattern4[finalYear];

  return (
    <A3Page title="光熱費シミュレーション" subtitle="30年間の累計コスト比較分析">
      <div className="w-full h-full bg-gray-50 relative">
        {/* メインコンテンツ */}
        <div className="h-full flex flex-col gap-4 p-4">
          {/* 上段：4つの比較カード */}
          <div className="flex gap-3" style={{ height: '200px' }}>
            {/* カード1：一般的な家 */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                <h3 className="text-base font-bold text-gray-800">①一般的な家</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div>断熱性能：標準</div>
                  <div>光熱費：標準</div>
                  <div>太陽光：なし</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">30年累計</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {finalCost1.toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>

            {/* カード2：Gハウスの家 */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-green-600"></div>
                <h3 className="text-base font-bold text-gray-800">②Gハウスの家</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>断熱性能：</span>
                    {editMode ? (
                      <select
                        value={gHouseSpec}
                        onChange={(e) => setGHouseSpec(e.target.value as 'G2' | 'G3')}
                        className="border rounded px-1 py-0.5 text-sm"
                      >
                        <option value="G2">G2</option>
                        <option value="G3">G3</option>
                      </select>
                    ) : (
                      <span>{gHouseSpec}仕様</span>
                    )}
                  </div>
                  <div>光熱費：{gHouseSpec === 'G3' ? '50%削減' : '35%削減'}</div>
                  <div>太陽光：なし</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">30年累計</div>
                  <div className="text-2xl font-bold text-green-600">
                    {finalCost2.toLocaleString()}万円
                  </div>
                  <div className="text-xs text-green-600">
                    ▼{(finalCost1 - finalCost2).toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>

            {/* カード3：Gハウスの家＋太陽光発電 */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                <h3 className="text-base font-bold text-gray-800">③Gハウス＋太陽光</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div>断熱性能：{gHouseSpec}仕様</div>
                  <div>太陽光：{solarCapacity}kW</div>
                  <div>売電収入：あり</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">30年累計</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {finalCost3.toLocaleString()}万円
                  </div>
                  <div className="text-xs text-orange-600">
                    ▼{(finalCost1 - finalCost3).toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>

            {/* カード4：Gハウスの家＋太陽光＋蓄電池 */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                <h3 className="text-base font-bold text-gray-800">④Gハウス＋太陽光＋蓄電池</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <div>断熱性能：{gHouseSpec}仕様</div>
                  <div>太陽光：{solarCapacity}kW</div>
                  <div>蓄電池：{hasBattery ? '搭載' : 'なし'}</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-gray-500">30年累計</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {finalCost4.toLocaleString()}万円
                  </div>
                  <div className="text-xs text-blue-600">
                    ▼{(finalCost1 - finalCost4).toLocaleString()}万円
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 下段：グラフとシミュレーション条件 */}
          <div className="flex-1 flex gap-4">
            {/* 左側：グラフ */}
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-bold mb-4 text-gray-800">30年間累計コスト推移</h3>
              <div style={{ height: 'calc(100% - 40px)' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* 右側：シミュレーション条件 */}
            <div
              className="w-80 bg-white rounded-lg shadow-md p-4"
              style={{ position: 'relative', top: '55px' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">シミュレーション条件</h3>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`px-3 py-1 rounded text-sm ${
                    editMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {editMode ? '完了' : '編集'}
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* 家族構成 */}
                <div>
                  <label className="block text-gray-600 mb-1">家族構成</label>
                  {editMode ? (
                    <select
                      value={familySize}
                      onChange={(e) => setFamilySize(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value={2}>2人</option>
                      <option value={3}>3人</option>
                      <option value={4}>4人</option>
                      <option value={5}>5人</option>
                    </select>
                  ) : (
                    <div className="text-gray-800">{familySize}人家族</div>
                  )}
                </div>

                {/* 月間電気代 */}
                <div>
                  <label className="block text-gray-600 mb-1">月間電気代</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={monthlyElectricity}
                      onChange={(e) => setMonthlyElectricity(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">¥{monthlyElectricity.toLocaleString()}</div>
                  )}
                </div>

                {/* 月間ガス代 */}
                <div>
                  <label className="block text-gray-600 mb-1">月間ガス代</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={monthlyGas}
                      onChange={(e) => setMonthlyGas(Number(e.target.value))}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">¥{monthlyGas.toLocaleString()}</div>
                  )}
                </div>

                {/* 太陽光発電容量 */}
                <div>
                  <label className="block text-gray-600 mb-1">太陽光発電容量</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={solarCapacity}
                      onChange={(e) => setSolarCapacity(Number(e.target.value))}
                      step="0.1"
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">{solarCapacity}kW</div>
                  )}
                </div>

                {/* 蓄電池 */}
                <div>
                  <label className="block text-gray-600 mb-1">蓄電池システム</label>
                  {editMode ? (
                    <select
                      value={hasBattery ? 'yes' : 'no'}
                      onChange={(e) => setHasBattery(e.target.value === 'yes')}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="no">なし</option>
                      <option value="yes">あり（9.8kWh）</option>
                    </select>
                  ) : (
                    <div className="text-gray-800">{hasBattery ? 'あり（9.8kWh）' : 'なし'}</div>
                  )}
                </div>

                {/* インフレ率 */}
                <div>
                  <label className="block text-gray-600 mb-1">光熱費上昇率（年）</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      step="0.1"
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">{inflationRate}%</div>
                  )}
                </div>

                {/* FIT価格 */}
                <div>
                  <label className="block text-gray-600 mb-1">売電価格（FIT期間）</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={fitPrice}
                      onChange={(e) => setFitPrice(Number(e.target.value))}
                      step="1"
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">¥{fitPrice}/kWh</div>
                  )}
                </div>

                {/* FIT後価格 */}
                <div>
                  <label className="block text-gray-600 mb-1">売電価格（FIT終了後）</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={postFitPrice}
                      onChange={(e) => setPostFitPrice(Number(e.target.value))}
                      step="1"
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    <div className="text-gray-800">¥{postFitPrice}/kWh</div>
                  )}
                </div>

                {/* 備考 */}
                <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                  <div>※ FIT期間：10年間</div>
                  <div>※ メンテナンス費用込み</div>
                  <div>※ 蓄電池交換：15年目</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </A3Page>
  );
};

export default Presentation5UtilityCostSimulation;
