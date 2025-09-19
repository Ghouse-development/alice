'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/lib/store';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Crown, Plus, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import A3Page from './A3Page';

// Types
interface MaintenanceEvent {
  year: number;
  amount: number;
}

interface Settings {
  // 家族構成
  familySize: 1 | 2 | 3 | 4 | 5;
  dualIncome: boolean;

  // パネル設定
  panels: number;
  panelWattPerUnit: number;
  yieldPerKw: number;

  // 自家消費率
  selfUseRatePv: number;
  selfUseRatePvBatt: number;

  // 買取単価設定
  sellY1_4: number;
  sellY5_10: number;
  sellAfter11: number;

  // 基準光熱費（年額）
  generalAnnualCost: number;
  gHouseSpec: 'G2' | 'G3';
  gHouseAnnualCost: number;

  // 電力単価
  gridPrice: number;
  inflationRate: number;

  // 劣化率
  pvDegradation: number;
  batteryDegradation: number;

  // メンテナンスイベント
  pvMaintenanceEvents: MaintenanceEvent[];
  batteryMaintenanceEvents: MaintenanceEvent[];

  // 初期費用設定
  pvBaseCost: number;
  pvPerKwCost: number;
  batteryCost: number;

  years: number;
}

interface YearData {
  year: number;
  // 累積総コスト（プラス表示）
  generalCumulative: number;
  gHouseCumulative: number;
  gHousePvCumulative: number;
  gHousePvBattCumulative: number;

  // 詳細データ
  generation: number;
  selfConsumptionPvBatt: number;
  exportPvBatt: number;
  sellRevenuePvBatt: number;
  savingPvBatt: number;
  maintenancePvBatt: number;
  annualCfPvBatt: number;
}

// 家族人数による年間電力使用量（kWh）
const familyElectricUsage = {
  1: 2000,
  2: 3000,
  3: 4000,
  4: 4500,
  5: 5000,
};

// 初期光熱費を計算
const calculateInitialCosts = (
  familySize: 1 | 2 | 3 | 4 | 5,
  dualIncome: boolean,
  gridPrice: number
) => {
  let usage = familyElectricUsage[familySize];
  if (dualIncome) {
    usage *= 0.9; // 共働きで10%削減
  }

  const general = Math.round(usage * gridPrice);
  const g2 = Math.max(general - 40000, 100000); // G2は4万円削減
  const g3 = Math.max(g2 - 20000, 80000); // G3はさらに2万円削減

  return { general, g2, g3 };
};

// デフォルト設定
const getDefaultSettings = (): Settings => {
  const initialCosts = calculateInitialCosts(4, false, 30);
  return {
    familySize: 4,
    dualIncome: false,
    panels: 15,
    panelWattPerUnit: 0.46,
    yieldPerKw: 1200,
    selfUseRatePv: 0.35,
    selfUseRatePvBatt: 0.6,
    sellY1_4: 24,
    sellY5_10: 8.3,
    sellAfter11: 7,
    generalAnnualCost: initialCosts.general,
    gHouseSpec: 'G2',
    gHouseAnnualCost: initialCosts.g2,
    gridPrice: 30,
    inflationRate: 0.02,
    pvDegradation: 0.005,
    batteryDegradation: 0.015,
    pvMaintenanceEvents: [
      { year: 10, amount: 50000 }, // 点検・清掃
      { year: 15, amount: 200000 }, // パワコン交換
      { year: 25, amount: 200000 }, // パワコン交換
    ],
    batteryMaintenanceEvents: [
      { year: 10, amount: 100000 }, // 点検・容量劣化対策
      { year: 20, amount: 100000 }, // 点検・容量劣化対策
    ],
    pvBaseCost: 1000000,
    pvPerKwCost: 90000,
    batteryCost: 1500000,
    years: 30,
  };
};

// 金額フォーマット
const formatNumber = (num: number): string => {
  return Math.round(Math.abs(num)).toLocaleString('ja-JP');
};

const formatCurrency = (num: number): string => {
  return `¥${formatNumber(num)}`;
};

// 計算ロジック
function calculateTimeline(settings: Settings): YearData[] {
  const timeline: YearData[] = [];
  const kW = settings.panels * settings.panelWattPerUnit;

  // 初期費用（消費税込み）
  const pvCapex = (settings.pvBaseCost + settings.pvPerKwCost * kW) * 1.1;
  const batteryCapex = settings.batteryCost * 1.1;

  // 累積総コストの初期値（プラス表示）
  let generalCumulative = 0;
  let gHouseCumulative = 0;
  let gHousePvCumulative = pvCapex; // 初期投資
  let gHousePvBattCumulative = pvCapex + batteryCapex; // 初期投資

  for (let year = 1; year <= settings.years; year++) {
    // インフレを考慮した年間光熱費
    const generalCost = settings.generalAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);
    const gHouseCost = settings.gHouseAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);

    // 累積総コスト（プラス表示）
    generalCumulative += generalCost;
    gHouseCumulative += gHouseCost;

    // PV劣化を考慮した発電量
    const pvDegradeFactor = Math.pow(1 - settings.pvDegradation, year - 1);
    const generation = kW * settings.yieldPerKw * pvDegradeFactor;

    // 自家消費と売電（PV+蓄電池）
    const batteryEfficiencyFactor = Math.pow(1 - settings.batteryDegradation, year - 1);
    const selfConsumptionPvBatt = generation * settings.selfUseRatePvBatt * batteryEfficiencyFactor;
    const exportPvBatt = generation - selfConsumptionPvBatt;

    // 売電単価
    const sellPrice =
      year <= 4 ? settings.sellY1_4 : year <= 10 ? settings.sellY5_10 : settings.sellAfter11;

    const sellRevenuePvBatt = exportPvBatt * sellPrice;
    const savingPvBatt = selfConsumptionPvBatt * settings.gridPrice;

    // メンテナンス費用
    const pvMaintenance = settings.pvMaintenanceEvents
      .filter((e) => e.year === year)
      .reduce((sum, e) => sum + e.amount, 0);
    const batteryMaintenance = settings.batteryMaintenanceEvents
      .filter((e) => e.year === year)
      .reduce((sum, e) => sum + e.amount, 0);
    const maintenancePvBatt = pvMaintenance + batteryMaintenance;

    // 年間CF（基準光熱費 - 節約額 - 売電収入 + メンテ）
    const annualCfPvBatt = gHouseCost - savingPvBatt - sellRevenuePvBatt + maintenancePvBatt;

    // 累積総コストに加算
    gHousePvCumulative += gHouseCost - savingPvBatt - sellRevenuePvBatt + pvMaintenance;
    gHousePvBattCumulative += annualCfPvBatt;

    timeline.push({
      year,
      generalCumulative,
      gHouseCumulative,
      gHousePvCumulative,
      gHousePvBattCumulative,
      generation,
      selfConsumptionPvBatt,
      exportPvBatt,
      sellRevenuePvBatt,
      savingPvBatt,
      maintenancePvBatt,
      annualCfPvBatt,
    });
  }

  return timeline;
}

export function SolarSimulatorConclusionFirst({ projectId }: { projectId: string }) {
  const { currentProject, theme } = useStore();
  const [settings, setSettings] = useState<Settings>(getDefaultSettings());

  // 家族構成が変更されたら光熱費を自動更新
  const handleFamilySizeChange = (size: 1 | 2 | 3 | 4 | 5) => {
    const costs = calculateInitialCosts(size, settings.dualIncome, settings.gridPrice);
    setSettings({
      ...settings,
      familySize: size,
      generalAnnualCost: costs.general,
      gHouseAnnualCost: settings.gHouseSpec === 'G2' ? costs.g2 : costs.g3,
    });
  };

  const handleDualIncomeChange = (dualIncome: boolean) => {
    const costs = calculateInitialCosts(settings.familySize, dualIncome, settings.gridPrice);
    setSettings({
      ...settings,
      dualIncome,
      generalAnnualCost: costs.general,
      gHouseAnnualCost: settings.gHouseSpec === 'G2' ? costs.g2 : costs.g3,
    });
  };

  const handleGHouseSpecChange = (spec: 'G2' | 'G3') => {
    const costs = calculateInitialCosts(
      settings.familySize,
      settings.dualIncome,
      settings.gridPrice
    );
    setSettings({
      ...settings,
      gHouseSpec: spec,
      gHouseAnnualCost: spec === 'G2' ? costs.g2 : costs.g3,
    });
  };

  // メンテナンスイベントの操作
  const addMaintenanceEvent = useCallback(
    (type: 'pv' | 'battery') => {
      const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
      const current = settings[key];
      const newEvent: MaintenanceEvent = {
        year: current.length > 0 ? current[current.length - 1].year + 5 : 10,
        amount: 100000,
      };
      setSettings({ ...settings, [key]: [...current, newEvent] });
    },
    [settings]
  );

  const removeMaintenanceEvent = useCallback(
    (type: 'pv' | 'battery', index: number) => {
      const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
      const current = settings[key];
      setSettings({ ...settings, [key]: current.filter((_, i) => i !== index) });
    },
    [settings]
  );

  const updateMaintenanceEvent = useCallback(
    (type: 'pv' | 'battery', index: number, field: 'year' | 'amount', value: number) => {
      const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
      const current = [...settings[key]];
      current[index] = { ...current[index], [field]: value };
      setSettings({ ...settings, [key]: current });
    },
    [settings]
  );

  const timeline = useMemo(() => calculateTimeline(settings), [settings]);

  const yearlyData = timeline[29] || timeline[timeline.length - 1];
  const kW = settings.panels * settings.panelWattPerUnit;
  const pvCapex = (settings.pvBaseCost + settings.pvPerKwCost * kW) * 1.1;
  const batteryCapex = settings.batteryCost * 1.1;

  // グラフデータ（万円単位）
  const chartData = useMemo(() => {
    return timeline.map((d) => ({
      year: d.year,
      一般的な家: Math.round(d.generalCumulative / 10000),
      Gハウスの家: Math.round(d.gHouseCumulative / 10000),
      'Gハウスの家＋太陽光発電': Math.round(d.gHousePvCumulative / 10000),
      'Gハウスの家＋太陽光＋蓄電池': Math.round(d.gHousePvBattCumulative / 10000),
    }));
  }, [timeline]);

  // 表示する年次を選択（1-10年は毎年、それ以降は5年ごと）
  const displayYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];
  const tableData = timeline.filter((d) => displayYears.includes(d.year));

  const isDark = theme === 'dark';

  return (
    <A3Page title="光熱費シミュレーション" subtitle="30年間の総コストシミュレーション">
      <div className="h-full flex flex-col" style={{ padding: '20px 40px' }}>
        {/* 上段：4つの比較カード */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* カード1: 一般的な家 */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="pb-2 px-4 pt-4">
              <h3 className="whitespace-nowrap truncate text-base font-semibold text-gray-900 leading-6">
                一般的な家
              </h3>
            </div>
            <div className="space-y-2 px-4 pb-4">
              <div className="text-sm text-gray-600">年間光熱費（今年）</div>
              <div className="text-[22px] font-bold tabular-nums">
                {formatCurrency(settings.generalAnnualCost)}
              </div>

              <div className="text-sm text-gray-600 mt-2">30年間累計総コスト</div>
              <div className="text-[28px] font-extrabold tabular-nums text-gray-900">
                {formatCurrency(yearlyData?.generalCumulative || 0)}
              </div>

              <div className="text-sm text-gray-600 mt-2">初期費用</div>
              <div className="text-sm text-gray-800">¥0</div>
            </div>
          </div>

          {/* カード2: Gハウスの家 */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="pb-2 px-4 pt-4">
              <h3 className="whitespace-nowrap truncate text-base font-semibold text-gray-900 leading-6">
                Gハウスの家（{settings.gHouseSpec}仕様）
              </h3>
            </div>
            <div className="space-y-2 px-4 pb-4">
              <div className="text-sm text-gray-600">年間光熱費（今年）</div>
              <div className="text-[22px] font-bold tabular-nums">
                {formatCurrency(settings.gHouseAnnualCost)}
              </div>

              <div className="text-sm text-gray-600 mt-2">30年間累計総コスト</div>
              <div className="text-[28px] font-extrabold tabular-nums text-gray-900">
                {formatCurrency(yearlyData?.gHouseCumulative || 0)}
              </div>

              <div className="text-sm text-gray-600 mt-2">初期費用</div>
              <div className="text-sm text-gray-800">¥0</div>
            </div>
          </div>

          {/* カード3: Gハウス＋太陽光発電 */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="pb-2 px-4 pt-4">
              <h3 className="whitespace-nowrap truncate text-base font-semibold text-gray-900 leading-6">
                Gハウスの家＋太陽光発電
              </h3>
            </div>
            <div className="space-y-2 px-4 pb-4">
              <div className="text-sm text-gray-600">年間光熱費（今年）</div>
              <div className="text-[22px] font-bold tabular-nums">
                {formatCurrency(
                  Math.max(0, settings.gHouseAnnualCost - timeline[0]?.savingPvBatt || 0)
                )}
              </div>

              <div className="text-sm text-gray-600 mt-2">30年間累計総コスト</div>
              <div className="text-[28px] font-extrabold tabular-nums text-gray-900">
                {formatCurrency(yearlyData?.gHousePvCumulative || 0)}
              </div>

              <div className="text-sm text-gray-600 mt-2">初期費用</div>
              <div className="text-sm text-gray-800">
                PV {kW.toFixed(1)}kW（税込） … {formatCurrency(pvCapex)}
              </div>
            </div>
          </div>

          {/* カード4: Gハウス＋太陽光＋蓄電池 */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="pb-2 px-4 pt-4">
              <h3 className="whitespace-nowrap truncate text-base font-semibold text-gray-900 leading-6">
                Gハウスの家＋太陽光＋蓄電池
              </h3>
            </div>
            <div className="space-y-2 px-4 pb-4">
              <div className="text-sm text-gray-600">年間光熱費（今年）</div>
              <div className="text-[22px] font-bold tabular-nums">
                {formatCurrency(
                  Math.max(0, settings.gHouseAnnualCost - timeline[0]?.savingPvBatt || 0)
                )}
              </div>

              <div className="text-sm text-gray-600 mt-2">30年間累計総コスト</div>
              <div className="text-[28px] font-extrabold tabular-nums text-gray-900">
                {formatCurrency(yearlyData?.gHousePvBattCumulative || 0)}
              </div>

              <div className="text-sm text-gray-600 mt-2">初期費用</div>
              <div className="text-sm text-gray-800">
                <div>
                  PV {kW.toFixed(1)}kW … {formatCurrency(pvCapex)}
                </div>
                <div>蓄電池 … {formatCurrency(batteryCapex)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 中段：グラフと前提条件 */}
        <div className="flex gap-4 mb-4 flex-1">
          {/* 左：グラフ */}
          <div className="flex-1 bg-white border rounded-lg p-4">
            <h3 className="text-base font-bold mb-2">30年間累計総コスト推移</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: '年', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis
                  label={{
                    value: '30年間累計総コスト（万円）',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  domain={[0, 'dataMax']}
                />
                <Tooltip formatter={(value) => `${value}万円`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="一般的な家"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Gハウスの家"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Gハウスの家＋太陽光発電"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="Gハウスの家＋太陽光＋蓄電池"
                  stroke="#ff7c7c"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 右：前提条件パネル */}
          <div className="w-80 bg-gray-50 border rounded-lg p-4">
            <h3 className="text-base font-bold mb-3">前提条件</h3>

            {/* 家族構成 */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <label className="text-xs leading-5">家族人数</label>
              <Select
                value={settings.familySize.toString()}
                onValueChange={(v) => handleFamilySizeChange(parseInt(v) as 1 | 2 | 3 | 4 | 5)}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1人</SelectItem>
                  <SelectItem value="2">2人</SelectItem>
                  <SelectItem value="3">3人</SelectItem>
                  <SelectItem value="4">4人</SelectItem>
                  <SelectItem value="5">5人</SelectItem>
                </SelectContent>
              </Select>

              <label className="text-xs leading-5">共働き</label>
              <Select
                value={settings.dualIncome ? 'yes' : 'no'}
                onValueChange={(v) => handleDualIncomeChange(v === 'yes')}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">いいえ</SelectItem>
                  <SelectItem value="yes">はい（-10%）</SelectItem>
                </SelectContent>
              </Select>

              <label className="text-xs leading-5">Gハウス仕様</label>
              <Select
                value={settings.gHouseSpec}
                onValueChange={(v) => handleGHouseSpecChange(v as 'G2' | 'G3')}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G2">G2</SelectItem>
                  <SelectItem value="G3">G3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 太陽光パネル */}
            <div className="mt-2 text-xs font-semibold">太陽光パネル</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <label className="text-xs leading-5">パネル枚数</label>
              <input
                type="number"
                value={settings.panels}
                onChange={(e) =>
                  setSettings({ ...settings, panels: parseInt(e.target.value) || 0 })
                }
                className="h-8 text-sm px-2 border rounded"
              />

              <label className="text-xs leading-5">1枚あたり(kW)</label>
              <input
                type="number"
                step="0.01"
                value={settings.panelWattPerUnit}
                onChange={(e) =>
                  setSettings({ ...settings, panelWattPerUnit: parseFloat(e.target.value) || 0 })
                }
                className="h-8 text-sm px-2 border rounded"
              />
            </div>

            {/* メンテナンス */}
            <div className="mt-2 text-xs font-semibold">メンテナンス（PV）</div>
            <div className="space-y-1">
              {settings.pvMaintenanceEvents.map((event, idx) => (
                <div key={idx} className="flex gap-1 items-center">
                  <input
                    type="number"
                    value={event.year}
                    onChange={(e) =>
                      updateMaintenanceEvent('pv', idx, 'year', parseInt(e.target.value) || 0)
                    }
                    className="w-12 h-6 text-xs px-1 border rounded"
                  />
                  <span className="text-xs">年目</span>
                  <input
                    type="number"
                    value={event.amount}
                    onChange={(e) =>
                      updateMaintenanceEvent('pv', idx, 'amount', parseInt(e.target.value) || 0)
                    }
                    className="w-20 h-6 text-xs px-1 border rounded"
                  />
                  <button onClick={() => removeMaintenanceEvent('pv', idx)} className="p-1">
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addMaintenanceEvent('pv')}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-3 w-3" />
                追加
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-500 break-words">
              ※インフレ率2%/年、発電量1kW=1200kWh/年、劣化率0.5%/年
            </div>
          </div>
        </div>

        {/* 下段：30年年次表（圧縮版） */}
        <div className="bg-white border rounded-lg p-3 overflow-auto">
          <h3 className="text-sm font-bold mb-2">年次詳細（選択年のみ表示）</h3>
          <table className="table-fixed w-full text-[12px]">
            <thead>
              <tr className="border-b">
                <th className="text-left px-2 py-1">年</th>
                <th className="text-right px-2 py-1">発電量(kWh)</th>
                <th className="text-right px-2 py-1">自家消費</th>
                <th className="text-right px-2 py-1">売電量</th>
                <th className="text-right px-2 py-1">売電収入</th>
                <th className="text-right px-2 py-1">節約額</th>
                <th className="text-right px-2 py-1">メンテ費</th>
                <th className="text-right px-2 py-1">年間CF</th>
                <th className="text-right px-2 py-1">累計総コスト</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.year} className="border-b leading-tight">
                  <td className="px-2 py-0.5">{row.year}</td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {Math.round(row.generation)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {Math.round(row.selfConsumptionPvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {Math.round(row.exportPvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {formatCurrency(row.sellRevenuePvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {formatCurrency(row.savingPvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {formatCurrency(row.maintenancePvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums">
                    {formatCurrency(row.annualCfPvBatt)}
                  </td>
                  <td className="text-right px-2 py-0.5 tabular-nums font-semibold">
                    {formatCurrency(row.gHousePvBattCumulative)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </A3Page>
  );
}
