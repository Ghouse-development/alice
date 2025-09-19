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
  // 累積支出（マイナス表示）
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

  // 累積支出の初期値
  let generalCumulative = 0;
  let gHouseCumulative = 0;
  let gHousePvCumulative = -pvCapex; // 初期投資
  let gHousePvBattCumulative = -(pvCapex + batteryCapex); // 初期投資

  for (let year = 1; year <= settings.years; year++) {
    // インフレを考慮した年間光熱費
    const generalCost = settings.generalAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);
    const gHouseCost = settings.gHouseAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);

    // 累積支出（マイナス表示）
    generalCumulative -= generalCost;
    gHouseCumulative -= gHouseCost;

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

    // インフレを考慮した電力単価
    const gridPrice = settings.gridPrice * Math.pow(1 + settings.inflationRate, year - 1);

    // 売電収入
    const sellRevenuePvBatt = exportPvBatt * sellPrice;

    // 自家消費による節約額
    const savingPvBatt = selfConsumptionPvBatt * gridPrice;

    // PVのみの場合の計算
    const selfConsumptionPv = generation * settings.selfUseRatePv;
    const exportPv = generation - selfConsumptionPv;
    const sellRevenuePv = exportPv * sellPrice;
    const savingPv = selfConsumptionPv * gridPrice;

    // メンテナンスコスト（イベント年のみ）
    const pvMaintenance = settings.pvMaintenanceEvents
      .filter((e) => e.year === year)
      .reduce((sum, e) => sum + e.amount, 0);
    const batteryMaintenance = settings.batteryMaintenanceEvents
      .filter((e) => e.year === year)
      .reduce((sum, e) => sum + e.amount, 0);

    // 年次キャッシュフロー
    const annualCfPv = savingPv + sellRevenuePv - pvMaintenance;
    const annualCfPvBatt = savingPvBatt + sellRevenuePvBatt - pvMaintenance - batteryMaintenance;

    // 累積（支出とメリットの合算）
    gHousePvCumulative = gHousePvCumulative - gHouseCost + annualCfPv;
    gHousePvBattCumulative = gHousePvBattCumulative - gHouseCost + annualCfPvBatt;

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
      maintenancePvBatt: pvMaintenance + batteryMaintenance,
      annualCfPvBatt,
    });
  }

  return timeline;
}

// メインコンポーネント
export default function SolarSimulatorConclusionFirst({ projectId }: { projectId?: string }) {
  const { theme } = useStore();

  const [settings, setSettings] = useState<Settings>(getDefaultSettings());
  const [userModified, setUserModified] = useState({
    generalAnnualCost: false,
    gHouseAnnualCost: false,
  });

  // タイムライン計算
  const timeline = useMemo(() => calculateTimeline(settings), [settings]);

  // 設定更新
  const updateSetting = useCallback((key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === 'generalAnnualCost' || key === 'gHouseAnnualCost') {
      setUserModified((prev) => ({ ...prev, [key]: true }));
    }
  }, []);

  // 家族人数・共働き変更時の自動計算
  const handleFamilyChange = (familySize: 1 | 2 | 3 | 4 | 5) => {
    const costs = calculateInitialCosts(familySize, settings.dualIncome, settings.gridPrice);
    setSettings((prev) => ({
      ...prev,
      familySize,
      generalAnnualCost: userModified.generalAnnualCost ? prev.generalAnnualCost : costs.general,
      gHouseAnnualCost: userModified.gHouseAnnualCost
        ? prev.gHouseAnnualCost
        : settings.gHouseSpec === 'G2'
          ? costs.g2
          : costs.g3,
    }));
  };

  const handleDualIncomeChange = (dualIncome: boolean) => {
    const costs = calculateInitialCosts(settings.familySize, dualIncome, settings.gridPrice);
    setSettings((prev) => ({
      ...prev,
      dualIncome,
      generalAnnualCost: userModified.generalAnnualCost ? prev.generalAnnualCost : costs.general,
      gHouseAnnualCost: userModified.gHouseAnnualCost
        ? prev.gHouseAnnualCost
        : settings.gHouseSpec === 'G2'
          ? costs.g2
          : costs.g3,
    }));
  };

  // G2/G3切り替え
  const handleSpecChange = (spec: 'G2' | 'G3') => {
    const costs = calculateInitialCosts(
      settings.familySize,
      settings.dualIncome,
      settings.gridPrice
    );
    setSettings((prev) => ({
      ...prev,
      gHouseSpec: spec,
      gHouseAnnualCost: userModified.gHouseAnnualCost
        ? prev.gHouseAnnualCost
        : spec === 'G2'
          ? costs.g2
          : costs.g3,
    }));
  };

  // メンテナンスイベント管理
  const addMaintenanceEvent = (type: 'pv' | 'battery') => {
    const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
    setSettings((prev) => ({
      ...prev,
      [key]: [...prev[key], { year: 15, amount: 50000 }],
    }));
  };

  const removeMaintenanceEvent = (type: 'pv' | 'battery', index: number) => {
    const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const updateMaintenanceEvent = (
    type: 'pv' | 'battery',
    index: number,
    field: 'year' | 'amount',
    value: number
  ) => {
    const key = type === 'pv' ? 'pvMaintenanceEvents' : 'batteryMaintenanceEvents';
    setSettings((prev) => ({
      ...prev,
      [key]: prev[key].map((event, i) => (i === index ? { ...event, [field]: value } : event)),
    }));
  };

  // kW計算
  const totalKw = settings.panels * settings.panelWattPerUnit;

  // 初期費用計算
  const pvInitialCost = (settings.pvBaseCost + settings.pvPerKwCost * totalKw) * 1.1;
  const batteryInitialCost = settings.batteryCost * 1.1;

  // 30年値
  const lastYear = timeline[timeline.length - 1] || {};

  // 30年累計総コスト（支出）
  const totalCosts = {
    general: Math.abs(lastYear.generalCumulative || 0),
    gHouse: Math.abs(lastYear.gHouseCumulative || 0),
    gHousePv: Math.abs(lastYear.gHousePvCumulative || 0),
    gHousePvBatt: Math.abs(lastYear.gHousePvBattCumulative || 0),
  };

  // 最もお得なシナリオを判定（総コストが最小）
  const bestScenario = Object.entries(totalCosts).reduce(
    (best, [key, cost]) => (cost < best.cost ? { key, cost } : best),
    { key: 'general', cost: totalCosts.general }
  );

  const bestScenarioLabel = {
    general: '一般的な家',
    gHouse: `Gハウスの家（${settings.gHouseSpec}仕様）`,
    gHousePv: 'Gハウスの家＋太陽光発電',
    gHousePvBatt: 'Gハウスの家＋太陽光発電＋蓄電池',
  }[bestScenario.key];

  // 選択年の表示データ
  const displayYears = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30];
  const tableData = timeline.filter((row) => displayYears.includes(row.year));

  return (
    <A3Page title="光熱費シミュレーション" subtitle="太陽光発電・蓄電池導入効果">
      <div className="h-full flex flex-col bg-white p-4 text-gray-900">
        {/* 上段：4仕様比較カード */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {/* 一般的な家 */}
          <div
            className={`border rounded-lg p-3 bg-gray-50 relative ${bestScenario.key === 'general' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'general' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <h3 className="font-bold text-sm mb-2 text-gray-900">一般的な家</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.generalAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計光熱費</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalCosts.general)}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">¥0</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">※光熱費は年2%で上昇</div>
            </div>
          </div>

          {/* Gハウスの家（設備なし） */}
          <div
            className={`border rounded-lg p-3 bg-green-50 relative ${bestScenario.key === 'gHouse' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHouse' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-gray-900">
                Gハウスの家
                <br />（{settings.gHouseSpec}仕様）
              </h3>
              <Select value={settings.gHouseSpec} onValueChange={handleSpecChange}>
                <SelectTrigger className="w-14 h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G2">G2</SelectItem>
                  <SelectItem value="G3">G3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.gHouseAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計光熱費</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalCosts.gHouse)}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">¥0</div>
              </div>
              <div className="text-xs text-green-600 font-bold mt-2">
                一般比：年間{formatCurrency(settings.generalAnnualCost - settings.gHouseAnnualCost)}
                削減
              </div>
              <div className="text-xs text-gray-500">※高断熱による省エネ</div>
            </div>
          </div>

          {/* Gハウスの家 + 太陽光発電 */}
          <div
            className={`border rounded-lg p-3 bg-blue-50 relative ${bestScenario.key === 'gHousePv' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHousePv' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <h3 className="font-bold text-sm mb-2 text-gray-900">
              Gハウスの家
              <br />
              ＋太陽光発電
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.gHouseAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計総コスト</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalCosts.gHousePv)}</div>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">{formatCurrency(pvInitialCost)}</div>
                <div className="text-xs text-gray-500">PV {totalKw.toFixed(1)}kW（税込）</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ※PV劣化率{settings.pvDegradation * 100}%/年
              </div>
            </div>
          </div>

          {/* Gハウスの家 + 太陽光 + 蓄電池 */}
          <div
            className={`border rounded-lg p-3 bg-purple-50 relative ${bestScenario.key === 'gHousePvBatt' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHousePvBatt' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <h3 className="font-bold text-sm mb-2 text-gray-900">
              Gハウスの家＋太陽光
              <br />
              ＋蓄電池
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.gHouseAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計総コスト</span>
                <div className="font-bold text-gray-900">
                  {formatCurrency(totalCosts.gHousePvBatt)}
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">
                  {formatCurrency(pvInitialCost + batteryInitialCost)}
                </div>
                <div className="text-xs text-gray-500">
                  PV {totalKw.toFixed(1)}kW + 蓄電池（税込）
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                ※蓄電池劣化{settings.batteryDegradation * 100}%/年
              </div>
            </div>
          </div>
        </div>

        {/* 下段：3カラムレイアウト */}
        <div className="grid grid-cols-12 gap-3 flex-1">
          {/* 左：30年累積CFグラフ - 5列 */}
          <div className="col-span-5 border rounded-lg p-3">
            <h3 className="font-bold text-sm mb-2 text-gray-900">30年累積支出（4系列比較）</h3>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="year" tick={{ fill: '#374151', fontSize: 10 }} stroke="#9ca3af" />
                <YAxis
                  tickFormatter={(value) => `${Math.abs(value / 10000).toFixed(0)}万`}
                  tick={{ fill: '#374151', fontSize: 10 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(Math.abs(value))}
                  labelFormatter={(label) => `${label}年目`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    fontSize: 11,
                  }}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="generalCumulative"
                  stroke="#9CA3AF"
                  name="一般的な家"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gHouseCumulative"
                  stroke="#10B981"
                  name="Gハウスの家"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gHousePvCumulative"
                  stroke="#2563EB"
                  name="Gハウス+太陽光"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="gHousePvBattCumulative"
                  stroke="#7C3AED"
                  name="Gハウス+太陽光+蓄電池"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 中：30年年次表（間引き表示）- 4列 */}
          <div className="col-span-4 border rounded-lg overflow-hidden">
            <div className="px-3 pt-3 pb-2 bg-white">
              <h3 className="font-bold text-sm text-gray-900">30年年次表（抜粋）</h3>
            </div>
            <div className="px-2 pb-2">
              <table className="w-full text-[10px] table-fixed">
                <thead>
                  <tr className="border-b text-gray-700">
                    <th className="text-left px-1 py-1 w-8">年</th>
                    <th className="text-right px-1 py-1">発電量</th>
                    <th className="text-right px-1 py-1">
                      自家
                      <br />
                      消費
                    </th>
                    <th className="text-right px-1 py-1">売電</th>
                    <th className="text-right px-1 py-1">
                      買取
                      <br />
                      金額
                    </th>
                    <th className="text-right px-1 py-1">節約額</th>
                    <th className="text-right px-1 py-1">メンテ</th>
                    <th className="text-right px-1 py-1">年次CF</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row) => (
                    <tr key={row.year} className="border-b hover:bg-gray-50">
                      <td className="px-1 py-0.5 text-gray-900">{row.year}</td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {Math.round(row.generation)}
                      </td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {Math.round(row.selfConsumptionPvBatt)}
                      </td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {Math.round(row.exportPvBatt)}
                      </td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {formatNumber(Math.round(row.sellRevenuePvBatt))}
                      </td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {formatNumber(Math.round(row.savingPvBatt))}
                      </td>
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {row.maintenancePvBatt > 0 ? formatNumber(row.maintenancePvBatt) : '-'}
                      </td>
                      <td className="text-right px-1 py-0.5 font-bold text-gray-900 truncate">
                        {formatNumber(Math.round(row.annualCfPvBatt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 右：前提条件パネル - 3列 */}
          <div className="col-span-3 border rounded-lg bg-gray-50 flex flex-col">
            <div className="px-3 pt-3 pb-2">
              <h3 className="font-bold text-sm text-gray-900">前提条件</h3>
            </div>

            <div className="flex-1 px-3 overflow-auto">
              <div className="grid grid-cols-1 gap-2 text-xs">
                {/* 家族構成 */}
                <div>
                  <div className="flex gap-2 items-center">
                    <label className="text-gray-700">家族人数</label>
                    <Select
                      value={String(settings.familySize)}
                      onValueChange={(v) => handleFamilyChange(Number(v) as 1 | 2 | 3 | 4 | 5)}
                    >
                      <SelectTrigger className="w-16 h-6 text-xs">
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
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    <label className="text-gray-700">共働き</label>
                    <button
                      onClick={() => handleDualIncomeChange(!settings.dualIncome)}
                      className={`px-2 py-0.5 rounded text-xs ${
                        settings.dualIncome ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {settings.dualIncome ? 'あり' : 'なし'}
                    </button>
                  </div>
                </div>

                {/* 年間光熱費 */}
                <div className="border-t pt-2">
                  <label className="text-gray-700 mb-1 block">年間光熱費（今年）</label>
                  <div className="grid grid-cols-2 gap-1">
                    <div>
                      <span className="text-xs text-gray-600">一般</span>
                      <input
                        type="number"
                        value={settings.generalAnnualCost}
                        onChange={(e) => updateSetting('generalAnnualCost', Number(e.target.value))}
                        className="w-full px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-600">{settings.gHouseSpec}</span>
                      <input
                        type="number"
                        value={settings.gHouseAnnualCost}
                        onChange={(e) => updateSetting('gHouseAnnualCost', Number(e.target.value))}
                        className="w-full px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* パネル設定 */}
                <div className="border-t pt-2">
                  <label className="text-gray-700 mb-1 block">パネル枚数</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={settings.panels}
                      onChange={(e) => updateSetting('panels', Number(e.target.value))}
                      className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                    />
                    <span className="text-xs text-gray-700">枚 = {totalKw.toFixed(1)}kW</span>
                  </div>
                </div>

                {/* 自家消費率 */}
                <div className="border-t pt-2">
                  <label className="text-gray-700 mb-1 block">自家消費率</label>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">PV</span>
                      <input
                        type="number"
                        value={settings.selfUseRatePv * 100}
                        onChange={(e) =>
                          updateSetting('selfUseRatePv', Number(e.target.value) / 100)
                        }
                        className="w-10 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                      <span className="text-xs text-gray-700">%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600">PV+蓄電</span>
                      <input
                        type="number"
                        value={settings.selfUseRatePvBatt * 100}
                        onChange={(e) =>
                          updateSetting('selfUseRatePvBatt', Number(e.target.value) / 100)
                        }
                        className="w-10 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                      <span className="text-xs text-gray-700">%</span>
                    </div>
                  </div>
                </div>

                {/* メンテナンス */}
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700">PVメンテ</label>
                    <button
                      onClick={() => addMaintenanceEvent('pv')}
                      className="p-0.5 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-3 w-3 text-gray-700" />
                    </button>
                  </div>
                  <div className="space-y-0.5 max-h-16 overflow-y-auto">
                    {settings.pvMaintenanceEvents.map((event, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <input
                          type="number"
                          value={event.year}
                          onChange={(e) =>
                            updateMaintenanceEvent('pv', i, 'year', Number(e.target.value))
                          }
                          className="w-8 px-0.5 py-0 border rounded text-xs text-gray-900"
                          min="1"
                          max="30"
                        />
                        <span className="text-xs text-gray-700">年</span>
                        <input
                          type="number"
                          value={event.amount}
                          onChange={(e) =>
                            updateMaintenanceEvent('pv', i, 'amount', Number(e.target.value))
                          }
                          className="w-14 px-0.5 py-0 border rounded text-xs text-gray-900"
                        />
                        <span className="text-xs text-gray-700">円</span>
                        <button
                          onClick={() => removeMaintenanceEvent('pv', i)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-2.5 w-2.5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* その他設定 */}
                <div className="border-t pt-2 text-xs text-gray-500">
                  <div>電力: {settings.gridPrice}円/kWh</div>
                  <div>インフレ: {settings.inflationRate * 100}%固定</div>
                  <div>劣化: PV{settings.pvDegradation * 100}%/年</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最下段：結論帯 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-3">
          <div className="text-center font-bold text-gray-900 text-sm">
            最もお得：{bestScenarioLabel}（30年総コスト最小：{formatCurrency(bestScenario.cost)}
            ／月あたり平均：{formatCurrency(Math.round(bestScenario.cost / 30 / 12))}）
          </div>
          <div className="text-center text-xs text-gray-600 mt-1">
            家族{settings.familySize}人・共働き{settings.dualIncome ? 'あり' : 'なし'}・パネル
            {settings.panels}枚での試算
          </div>
        </div>

        <style jsx global>{`
          @media print {
            body {
              font-size: 10px;
            }
            .text-xs {
              font-size: 9px;
            }
            .text-sm {
              font-size: 10px;
            }
            .text-base {
              font-size: 11px;
            }
            .text-lg {
              font-size: 12px;
            }
            @page {
              size: A3 landscape;
              margin: 10mm;
            }
          }
        `}</style>
      </div>
    </A3Page>
  );
}
