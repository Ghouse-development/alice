'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import { Sun, Battery, Home, TrendingUp } from 'lucide-react';
import A3Page from './A3Page';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// メンテナンスイベント型
interface MaintenanceEvent {
  year: number;
  cost: number;
}

// 前提条件型
interface Prerequisites {
  familySize: number;
  isDualIncome: boolean;
  electricityUsage: number;
  standardAnnualCost: number;
  gHouseAnnualCost: number;
  isG3: boolean;
  panelCount: number;
  panelCapacity: number;
  selfConsumptionRatePV: number;
  selfConsumptionRateBattery: number;
  gridPrice: number;
  sellPriceYear1to4: number;
  sellPriceYear5to10: number;
  sellPriceYear11plus: number;
  inflationRate: number;
  pvDegradationRate: number;
  batteryDegradationRate: number;
  maintenancePV: MaintenanceEvent[];
  maintenanceBattery: MaintenanceEvent[];
}

// フォーマッタ
const formatJPY = (value: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function SolarSimulatorConclusionFirst() {
  // 前提条件の状態管理
  const [prerequisites, setPrerequisites] = useState<Prerequisites>({
    familySize: 4,
    isDualIncome: false,
    electricityUsage: 4500,
    standardAnnualCost: 121500,
    gHouseAnnualCost: 81500,
    isG3: false,
    panelCount: 20,
    panelCapacity: 9.2,
    selfConsumptionRatePV: 35,
    selfConsumptionRateBattery: 60,
    gridPrice: 27,
    sellPriceYear1to4: 24,
    sellPriceYear5to10: 8.3,
    sellPriceYear11plus: 7,
    inflationRate: 2,
    pvDegradationRate: 0.5,
    batteryDegradationRate: 1.5,
    maintenancePV: [
      { year: 10, cost: 50000 },
      { year: 15, cost: 200000 },
      { year: 25, cost: 200000 },
    ],
    maintenanceBattery: [
      { year: 10, cost: 100000 },
      { year: 20, cost: 100000 },
    ],
  });

  // 家族人数による初期値設定
  useEffect(() => {
    const usageMap: { [key: number]: number } = {
      1: 2000,
      2: 3000,
      3: 4000,
      4: 4500,
      5: 5000,
    };
    const baseUsage = usageMap[prerequisites.familySize] || 4500;
    const usage = prerequisites.isDualIncome ? baseUsage * 0.9 : baseUsage;
    const standardCost = Math.round(usage * prerequisites.gridPrice);
    const gCost = Math.round(standardCost - 40000);
    const g3Cost = prerequisites.isG3 ? gCost - 20000 : gCost;

    setPrerequisites((prev) => ({
      ...prev,
      electricityUsage: usage,
      standardAnnualCost: standardCost,
      gHouseAnnualCost: g3Cost,
    }));
  }, [prerequisites.familySize, prerequisites.isDualIncome, prerequisites.isG3]);

  // パネル枚数変更時の容量自動計算
  const updatePanelCount = useCallback((count: number) => {
    setPrerequisites((prev) => ({
      ...prev,
      panelCount: count,
      panelCapacity: count * 0.46,
    }));
  }, []);

  // 初期費用の計算
  const initialCosts = useMemo(() => {
    const pvCost = Math.round((1000000 + 90000 * prerequisites.panelCapacity) * 1.1);
    const batteryCost = Math.round(1500000 * 1.1);
    return {
      pv: pvCost,
      battery: batteryCost,
    };
  }, [prerequisites.panelCapacity]);

  // 30年間のシミュレーション計算
  const simulation = useMemo(() => {
    const years = 30;
    const results = {
      standard: [] as number[],
      gHouse: [] as number[],
      gHousePV: [] as number[],
      gHousePVBattery: [] as number[],
      yearlyData: [] as any[],
    };

    // 累積総コストの配列を初期化
    let cumulativeStandard = 0;
    let cumulativeGHouse = 0;
    let cumulativeGHousePV = initialCosts.pv;
    let cumulativeGHousePVBattery = initialCosts.pv + initialCosts.battery;

    for (let year = 1; year <= years; year++) {
      // 電力価格（インフレ考慮）
      const gridPrice =
        prerequisites.gridPrice * Math.pow(1 + prerequisites.inflationRate / 100, year - 1);

      // 売電価格
      let sellPrice = 0;
      if (year <= 4) sellPrice = prerequisites.sellPriceYear1to4;
      else if (year <= 10) sellPrice = prerequisites.sellPriceYear5to10;
      else sellPrice = prerequisites.sellPriceYear11plus;

      // 年間発電量（劣化考慮）
      const annualGeneration =
        prerequisites.panelCapacity *
        1200 *
        Math.pow(1 - prerequisites.pvDegradationRate / 100, year - 1);

      // 自家消費と売電の計算（PVのみ）
      const selfConsumptionPV = annualGeneration * (prerequisites.selfConsumptionRatePV / 100);
      const exportPV = annualGeneration - selfConsumptionPV;
      const savingsPV = selfConsumptionPV * gridPrice;
      const sellIncomePV = exportPV * sellPrice;

      // 自家消費と売電の計算（PV+蓄電池）
      const selfConsumptionBattery =
        annualGeneration *
        (prerequisites.selfConsumptionRateBattery / 100) *
        Math.pow(1 - prerequisites.batteryDegradationRate / 100, year - 1);
      const exportBattery = annualGeneration - selfConsumptionBattery;
      const savingsBattery = selfConsumptionBattery * gridPrice;
      const sellIncomeBattery = exportBattery * sellPrice;

      // メンテナンス費用
      const pvMaintenance = prerequisites.maintenancePV
        .filter((m) => m.year === year)
        .reduce((sum, m) => sum + m.cost, 0);
      const batteryMaintenance = prerequisites.maintenanceBattery
        .filter((m) => m.year === year)
        .reduce((sum, m) => sum + m.cost, 0);

      // 年間光熱費（基準）
      const standardAnnual =
        prerequisites.standardAnnualCost *
        Math.pow(1 + prerequisites.inflationRate / 100, year - 1);
      const gHouseAnnual =
        prerequisites.gHouseAnnualCost * Math.pow(1 + prerequisites.inflationRate / 100, year - 1);

      // 年次コスト計算
      const standardYearlyCost = standardAnnual;
      const gHouseYearlyCost = gHouseAnnual;
      const gHousePVYearlyCost = gHouseAnnual - savingsPV - sellIncomePV + pvMaintenance;
      const gHousePVBatteryYearlyCost =
        gHouseAnnual - savingsBattery - sellIncomeBattery + pvMaintenance + batteryMaintenance;

      // 累積総コスト更新
      cumulativeStandard += standardYearlyCost;
      cumulativeGHouse += gHouseYearlyCost;
      cumulativeGHousePV += gHousePVYearlyCost;
      cumulativeGHousePVBattery += gHousePVBatteryYearlyCost;

      // 結果を保存
      results.standard.push(cumulativeStandard);
      results.gHouse.push(cumulativeGHouse);
      results.gHousePV.push(cumulativeGHousePV);
      results.gHousePVBattery.push(cumulativeGHousePVBattery);

      // 年次表用データ（表示対象年のみ）
      if (year <= 10 || year === 15 || year === 20 || year === 25 || year === 30) {
        results.yearlyData.push({
          year,
          generation: Math.round(annualGeneration),
          selfConsumption: Math.round(selfConsumptionBattery),
          export: Math.round(exportBattery),
          sellIncome: Math.round(sellIncomeBattery),
          savings: Math.round(savingsBattery),
          maintenance: pvMaintenance + batteryMaintenance,
          yearlyCost: Math.round(gHousePVBatteryYearlyCost),
          cumulativeCost: Math.round(cumulativeGHousePVBattery),
        });
      }
    }

    return results;
  }, [prerequisites, initialCosts]);

  // 最もお得なオプションの判定
  const bestOption = useMemo(() => {
    const finalCosts = {
      standard: simulation.standard[29] || 0,
      gHouse: simulation.gHouse[29] || 0,
      gHousePV: simulation.gHousePV[29] || 0,
      gHousePVBattery: simulation.gHousePVBattery[29] || 0,
    };

    const minCost = Math.min(...Object.values(finalCosts));
    const options = [
      { name: '一般的な家', cost: finalCosts.standard },
      {
        name: prerequisites.isG3 ? 'Gハウスの家（G3仕様）' : 'Gハウスの家（G2仕様）',
        cost: finalCosts.gHouse,
      },
      { name: 'Gハウスの家＋太陽光発電', cost: finalCosts.gHousePV },
      { name: 'Gハウスの家＋太陽光＋蓄電池', cost: finalCosts.gHousePVBattery },
    ];

    const best = options.find((opt) => opt.cost === minCost);
    return {
      name: best?.name || '',
      totalCost: minCost,
      monthlyAverage: Math.round(minCost / 30 / 12),
    };
  }, [simulation, prerequisites.isG3]);

  // グラフ設定
  const chartData = {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}年目`),
    datasets: [
      {
        label: '一般的な家',
        data: simulation.standard,
        borderColor: '#EF4444',
        backgroundColor: '#EF4444',
        tension: 0.1,
      },
      {
        label: prerequisites.isG3 ? 'Gハウスの家（G3仕様）' : 'Gハウスの家（G2仕様）',
        data: simulation.gHouse,
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.1,
      },
      {
        label: 'Gハウスの家＋太陽光発電',
        data: simulation.gHousePV,
        borderColor: '#F59E0B',
        backgroundColor: '#F59E0B',
        tension: 0.1,
      },
      {
        label: 'Gハウスの家＋太陽光＋蓄電池',
        data: simulation.gHousePVBattery,
        borderColor: '#10B981',
        backgroundColor: '#10B981',
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#111827',
          font: { size: 11 },
        },
      },
      title: {
        display: true,
        text: '30年間累計総コスト比較',
        color: '#111827',
        font: { size: 14, weight: 'bold' },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${formatJPY(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6B7280',
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        title: {
          display: true,
          text: '30年間累計総コスト（万円）',
          color: '#111827',
          font: { size: 12 },
        },
        ticks: {
          color: '#111827',
          font: { size: 11 },
          callback: function (value) {
            return (Number(value) / 10000).toFixed(0);
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // カード用の年間光熱費（今年）を計算
  const currentYearCosts = {
    standard: prerequisites.standardAnnualCost,
    gHouse: prerequisites.gHouseAnnualCost,
    gHousePV: Math.round(
      prerequisites.gHouseAnnualCost -
        ((prerequisites.panelCapacity * 1200 * prerequisites.selfConsumptionRatePV) / 100) *
          prerequisites.gridPrice -
        ((prerequisites.panelCapacity * 1200 * (100 - prerequisites.selfConsumptionRatePV)) / 100) *
          prerequisites.sellPriceYear1to4
    ),
    gHousePVBattery: Math.round(
      prerequisites.gHouseAnnualCost -
        ((prerequisites.panelCapacity * 1200 * prerequisites.selfConsumptionRateBattery) / 100) *
          prerequisites.gridPrice -
        ((prerequisites.panelCapacity * 1200 * (100 - prerequisites.selfConsumptionRateBattery)) /
          100) *
          prerequisites.sellPriceYear1to4
    ),
  };

  return (
    <A3Page title="光熱費シミュレーション" subtitle="30年間の総コストで比較する最適な選択">
      <div className="h-full flex flex-col" style={{ padding: '20px 40px' }}>
        {/* 上段：4カード */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* カード1: 一般的な家 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h3 className="whitespace-nowrap truncate text-base font-semibold leading-6 text-gray-900 mb-3">
              一般的な家
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">年間光熱費（今年）</p>
                <p className="text-[18px] font-bold text-gray-900 tabular-nums">
                  {formatJPY(currentYearCosts.standard)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">30年間累計総コスト</p>
                <p className="text-[28px] font-extrabold text-red-600 tabular-nums">
                  {formatJPY(simulation.standard[29] || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">初期費用</p>
                <p className="text-sm font-medium text-gray-900 tabular-nums">¥0</p>
              </div>
            </div>
          </div>

          {/* カード2: Gハウスの家 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="whitespace-nowrap truncate text-base font-semibold leading-6 text-gray-900">
                Gハウスの家（{prerequisites.isG3 ? 'G3' : 'G2'}仕様）
              </h3>
              <select
                className="text-xs border border-gray-300 rounded px-2 py-1"
                value={prerequisites.isG3 ? 'G3' : 'G2'}
                onChange={(e) => {
                  setPrerequisites((prev) => ({
                    ...prev,
                    isG3: e.target.value === 'G3',
                  }));
                }}
              >
                <option value="G2">G2</option>
                <option value="G3">G3</option>
              </select>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">年間光熱費（今年）</p>
                <p className="text-[18px] font-bold text-gray-900 tabular-nums">
                  {formatJPY(currentYearCosts.gHouse)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">30年間累計総コスト</p>
                <p className="text-[28px] font-extrabold text-blue-600 tabular-nums">
                  {formatJPY(simulation.gHouse[29] || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">初期費用</p>
                <p className="text-sm font-medium text-gray-900 tabular-nums">¥0</p>
              </div>
            </div>
          </div>

          {/* カード3: Gハウス＋太陽光 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h3 className="whitespace-nowrap truncate text-base font-semibold leading-6 text-gray-900 mb-3 flex items-center gap-2">
              Gハウスの家＋太陽光発電
              <Sun className="h-4 w-4 text-yellow-500" />
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">年間光熱費（今年）</p>
                <p className="text-[18px] font-bold text-gray-900 tabular-nums">
                  {formatJPY(currentYearCosts.gHousePV)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">30年間累計総コスト</p>
                <p className="text-[28px] font-extrabold text-orange-600 tabular-nums">
                  {formatJPY(simulation.gHousePV[29] || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">初期費用</p>
                <p className="text-sm font-medium text-gray-900 tabular-nums">
                  PV: {formatJPY(initialCosts.pv)}
                </p>
              </div>
            </div>
          </div>

          {/* カード4: Gハウス＋太陽光＋蓄電池 */}
          <div className="bg-white rounded-lg border border-gray-300 p-4">
            <h3 className="whitespace-nowrap truncate text-base font-semibold leading-6 text-gray-900 mb-3 flex items-center gap-2">
              Gハウスの家＋太陽光＋蓄電池
              <Battery className="h-4 w-4 text-green-500" />
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600">年間光熱費（今年）</p>
                <p className="text-[18px] font-bold text-gray-900 tabular-nums">
                  {formatJPY(currentYearCosts.gHousePVBattery)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">30年間累計総コスト</p>
                <p className="text-[28px] font-extrabold text-green-600 tabular-nums">
                  {formatJPY(simulation.gHousePVBattery[29] || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">初期費用</p>
                <div className="text-sm font-medium text-gray-900 tabular-nums">
                  <div>PV: {formatJPY(initialCosts.pv)}</div>
                  <div>蓄電池: {formatJPY(initialCosts.battery)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中段：グラフと前提条件 */}
        <div className="grid grid-cols-3 gap-4 mb-4" style={{ height: '300px' }}>
          {/* グラフ（左2/3） */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-300 p-4">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* 前提条件（右1/3） */}
          <div className="bg-white rounded-lg border border-gray-300 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">前提条件</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {/* 家族人数 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">家族人数</label>
                <select
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2"
                  value={prerequisites.familySize}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({ ...prev, familySize: Number(e.target.value) }))
                  }
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}人
                    </option>
                  ))}
                </select>
              </div>

              {/* 共働き */}
              <div>
                <label className="text-xs leading-5 text-gray-600">共働き</label>
                <select
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2"
                  value={prerequisites.isDualIncome ? 'yes' : 'no'}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({
                      ...prev,
                      isDualIncome: e.target.value === 'yes',
                    }))
                  }
                >
                  <option value="no">なし</option>
                  <option value="yes">あり</option>
                </select>
              </div>

              {/* 年間光熱費（一般） */}
              <div>
                <label className="text-xs leading-5 text-gray-600">年間光熱費（一般）</label>
                <input
                  type="number"
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2 tabular-nums"
                  value={prerequisites.standardAnnualCost}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({
                      ...prev,
                      standardAnnualCost: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* 年間光熱費（G） */}
              <div>
                <label className="text-xs leading-5 text-gray-600">年間光熱費（G）</label>
                <input
                  type="number"
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2 tabular-nums"
                  value={prerequisites.gHouseAnnualCost}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({
                      ...prev,
                      gHouseAnnualCost: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* パネル枚数 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">パネル枚数</label>
                <input
                  type="number"
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2 tabular-nums"
                  value={prerequisites.panelCount}
                  onChange={(e) => updatePanelCount(Number(e.target.value))}
                />
              </div>

              {/* パネル容量 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">容量</label>
                <div className="h-8 text-sm bg-gray-100 rounded px-2 flex items-center tabular-nums">
                  {prerequisites.panelCapacity.toFixed(2)}kW
                </div>
              </div>

              {/* 自家消費率PV */}
              <div>
                <label className="text-xs leading-5 text-gray-600">自家消費率(PV)</label>
                <input
                  type="number"
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2 tabular-nums"
                  value={prerequisites.selfConsumptionRatePV}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({
                      ...prev,
                      selfConsumptionRatePV: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* 自家消費率蓄電池 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">自家消費率(蓄電)</label>
                <input
                  type="number"
                  className="w-full h-8 text-sm border border-gray-300 rounded px-2 tabular-nums"
                  value={prerequisites.selfConsumptionRateBattery}
                  onChange={(e) =>
                    setPrerequisites((prev) => ({
                      ...prev,
                      selfConsumptionRateBattery: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* 電力単価 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">電力単価</label>
                <div className="h-8 text-sm bg-gray-100 rounded px-2 flex items-center tabular-nums">
                  {prerequisites.gridPrice}円/kWh
                </div>
              </div>

              {/* インフレ率 */}
              <div>
                <label className="text-xs leading-5 text-gray-600">インフレ率</label>
                <div className="h-8 text-sm bg-gray-100 rounded px-2 flex items-center tabular-nums">
                  {prerequisites.inflationRate}%/年
                </div>
              </div>

              {/* メンテナンス情報 */}
              <div className="col-span-2">
                <p className="text-xs text-gray-600 mt-1">
                  メンテ：PV 10年¥50k/15年¥200k/25年¥200k
                </p>
                <p className="text-xs text-gray-600">蓄電池 10年¥100k/20年¥100k</p>
              </div>
            </div>
          </div>
        </div>

        {/* 下段：年次表 */}
        <div className="bg-white rounded-lg border border-gray-300 p-3 mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            30年間年次シミュレーション（抜粋）
          </h3>
          <div className="overflow-x-auto">
            <table className="table-fixed w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-1 text-left text-gray-700">年</th>
                  <th className="py-1 text-right text-gray-700">発電量</th>
                  <th className="py-1 text-right text-gray-700">自家消費</th>
                  <th className="py-1 text-right text-gray-700">売電</th>
                  <th className="py-1 text-right text-gray-700">売電収入</th>
                  <th className="py-1 text-right text-gray-700">節約額</th>
                  <th className="py-1 text-right text-gray-700">メンテ</th>
                  <th className="py-1 text-right text-gray-700">年次コスト</th>
                  <th className="py-1 text-right text-gray-700">累計総コスト</th>
                </tr>
              </thead>
              <tbody>
                {simulation.yearlyData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-0.5 text-gray-900">{row.year}</td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {row.generation}kWh
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {row.selfConsumption}kWh
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {row.export}kWh
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {formatJPY(row.sellIncome)}
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {formatJPY(row.savings)}
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {row.maintenance > 0 ? formatJPY(row.maintenance) : '-'}
                    </td>
                    <td className="py-0.5 text-right tabular-nums text-gray-900">
                      {formatJPY(row.yearlyCost)}
                    </td>
                    <td className="py-0.5 text-right tabular-nums font-bold text-gray-900">
                      {formatJPY(row.cumulativeCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 結論帯 */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8" />
              <div>
                <p className="text-lg font-bold">最もお得：{bestOption.name}</p>
                <p className="text-sm">
                  30年総コスト最小：{formatJPY(bestOption.totalCost)} / 月あたり平均：
                  {formatJPY(bestOption.monthlyAverage)}
                </p>
              </div>
            </div>
            <button className="text-sm underline hover:no-underline">根拠を見る</button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A3 landscape;
            margin: 0;
          }
          .table {
            font-size: 10px;
          }
        }
      `}</style>
    </A3Page>
  );
}
