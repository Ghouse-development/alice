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
  generation: number;
  selfConsumptionPv: number;
  selfConsumptionPvBatt: number;
  exportPv: number;
  exportPvBatt: number;
  sellRevenuePv: number;
  sellRevenuePvBatt: number;
  savingPv: number;
  savingPvBatt: number;
  maintenancePv: number;
  maintenancePvBatt: number;
  annualCfPv: number;
  annualCfPvBatt: number;
  cumulativeCfPv: number;
  cumulativeCfPvBatt: number;
  gridPrice: number;
  generalCost: number;
  gHouseCost: number;
  gHouseOnlyCost: number;
  gHousePvCost: number;
  gHousePvBattCost: number;
}

// G2/G3の基準値
const specBaseValues = {
  G2: 200000,
  G3: 180000,
};

// デフォルト設定
const defaultSettings: Settings = {
  panels: 15,
  panelWattPerUnit: 0.46,
  yieldPerKw: 1200,
  selfUseRatePv: 0.35,
  selfUseRatePvBatt: 0.6,
  sellY1_4: 24,
  sellY5_10: 8.3,
  sellAfter11: 7,
  generalAnnualCost: 240000,
  gHouseSpec: 'G2',
  gHouseAnnualCost: specBaseValues.G2,
  gridPrice: 27,
  inflationRate: 0.02,
  pvDegradation: 0.005,
  batteryDegradation: 0.015,
  pvMaintenanceEvents: [{ year: 10, amount: 50000 }],
  batteryMaintenanceEvents: [
    { year: 10, amount: 100000 },
    { year: 20, amount: 100000 },
  ],
  pvBaseCost: 1000000,
  pvPerKwCost: 90000,
  batteryCost: 1500000,
  years: 30,
};

// 金額フォーマット
const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString('ja-JP');
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

  let cumulativeCfPv = -pvCapex;
  let cumulativeCfPvBatt = -(pvCapex + batteryCapex);

  for (let year = 1; year <= settings.years; year++) {
    // PV劣化を考慮した発電量
    const pvDegradeFactor = Math.pow(1 - settings.pvDegradation, year - 1);
    const generation = kW * settings.yieldPerKw * pvDegradeFactor;

    // 自家消費と売電（PVのみ）
    const selfConsumptionPv = generation * settings.selfUseRatePv;
    const exportPv = generation - selfConsumptionPv;

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
    const sellRevenuePv = exportPv * sellPrice;
    const sellRevenuePvBatt = exportPvBatt * sellPrice;

    // 自家消費による節約額
    const savingPv = selfConsumptionPv * gridPrice;
    const savingPvBatt = selfConsumptionPvBatt * gridPrice;

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

    // 累積キャッシュフロー
    cumulativeCfPv += annualCfPv;
    cumulativeCfPvBatt += annualCfPvBatt;

    // インフレを考慮した基準光熱費
    const generalCost = settings.generalAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);
    const gHouseCost = settings.gHouseAnnualCost * Math.pow(1 + settings.inflationRate, year - 1);

    // 各シナリオの実質年間光熱費
    const gHouseOnlyCost = gHouseCost;
    const gHousePvCost = gHouseCost - savingPv - sellRevenuePv + pvMaintenance;
    const gHousePvBattCost =
      gHouseCost - savingPvBatt - sellRevenuePvBatt + pvMaintenance + batteryMaintenance;

    timeline.push({
      year,
      generation,
      selfConsumptionPv,
      selfConsumptionPvBatt,
      exportPv,
      exportPvBatt,
      sellRevenuePv,
      sellRevenuePvBatt,
      savingPv,
      savingPvBatt,
      maintenancePv: pvMaintenance,
      maintenancePvBatt: pvMaintenance + batteryMaintenance,
      annualCfPv,
      annualCfPvBatt,
      cumulativeCfPv,
      cumulativeCfPvBatt,
      gridPrice,
      generalCost,
      gHouseCost,
      gHouseOnlyCost,
      gHousePvCost,
      gHousePvBattCost,
    });
  }

  return timeline;
}

// メインコンポーネント
export default function SolarSimulatorConclusionFirst({ projectId }: { projectId?: string }) {
  const { theme } = useStore();

  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // タイムライン計算
  const timeline = useMemo(() => calculateTimeline(settings), [settings]);

  // 設定更新
  const updateSetting = useCallback((key: keyof Settings, value: number | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  // G2/G3切り替え
  const handleSpecChange = (spec: 'G2' | 'G3') => {
    setSettings((prev) => ({
      ...prev,
      gHouseSpec: spec,
      gHouseAnnualCost: specBaseValues[spec],
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

  // 30年累計値
  const lastYear = timeline[timeline.length - 1] || {};

  // 30年累計光熱費
  const totalGeneralCost = timeline.reduce((sum, year) => sum + year.generalCost, 0);
  const totalGHouseOnlyCost = timeline.reduce((sum, year) => sum + year.gHouseOnlyCost, 0);
  const totalGHousePvCost =
    timeline.reduce((sum, year) => sum + year.gHousePvCost, 0) + pvInitialCost;
  const totalGHousePvBattCost =
    timeline.reduce((sum, year) => sum + year.gHousePvBattCost, 0) +
    pvInitialCost +
    batteryInitialCost;

  // 基準（Gハウスの家設備なし）に対するメリット計算
  const benefitPv = totalGHouseOnlyCost - totalGHousePvCost;
  const benefitPvBatt = totalGHouseOnlyCost - totalGHousePvBattCost;

  // 最もお得なシナリオを判定
  const scenarios = [
    { key: 'gHouseOnly', label: 'Gハウスの家（設備なし）', benefit: 0, total: totalGHouseOnlyCost },
    {
      key: 'gHousePv',
      label: 'Gハウスの家＋太陽光発電',
      benefit: benefitPv,
      total: totalGHousePvCost,
    },
    {
      key: 'gHousePvBatt',
      label: 'Gハウスの家＋太陽光発電＋蓄電池',
      benefit: benefitPvBatt,
      total: totalGHousePvBattCost,
    },
  ];

  const bestScenario = scenarios.reduce((best, current) =>
    current.benefit > best.benefit ? current : best
  );

  return (
    <A3Page title="光熱費シミュレーション" subtitle="太陽光発電・蓄電池導入効果">
      <div id="solar-simulator-main" className="h-full flex flex-col bg-white p-4 text-gray-900">
        {/* 上段：4仕様比較カード */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* 一般的な家 */}
          <div className="border rounded-lg p-4 bg-gray-50 relative">
            <h3 className="font-bold text-base mb-3 text-gray-900">一般的な家</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.generalAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計光熱費</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalGeneralCost)}</div>
              </div>
              <div className="border-t pt-2 mt-4">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">¥0</div>
              </div>
              <div className="text-xs text-gray-500 mt-4">※光熱費は年2%で上昇想定</div>
            </div>
          </div>

          {/* Gハウスの家（設備なし） */}
          <div
            className={`border rounded-lg p-4 bg-green-50 relative ${bestScenario.key === 'gHouseOnly' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHouseOnly' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-gray-900">
                Gハウスの家
                <br />（{settings.gHouseSpec}仕様）
              </h3>
              <Select value={settings.gHouseSpec} onValueChange={handleSpecChange}>
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G2">G2</SelectItem>
                  <SelectItem value="G3">G3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-700">年間光熱費（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(settings.gHouseAnnualCost)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">30年累計光熱費</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalGHouseOnlyCost)}</div>
              </div>
              <div className="border-t pt-2 mt-4">
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">¥0</div>
              </div>
              <div className="text-sm font-bold text-green-600 mt-3">
                一般比：年間{formatCurrency(settings.generalAnnualCost - settings.gHouseAnnualCost)}
                削減
              </div>
              <div className="text-xs text-gray-500">※高断熱による省エネ効果</div>
            </div>
          </div>

          {/* Gハウスの家 + 太陽光発電 */}
          <div
            className={`border rounded-lg p-4 bg-blue-50 relative ${bestScenario.key === 'gHousePv' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHousePv' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <h3 className="font-bold text-base mb-3 text-gray-900">
              Gハウスの家
              <br />
              ＋太陽光発電
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-700">年間メリット（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(timeline[0]?.annualCfPv || 0)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">{formatCurrency(pvInitialCost)}</div>
                <div className="text-xs text-gray-500">PV {totalKw.toFixed(1)}kW（消費税込）</div>
              </div>
              <div>
                <span className="text-gray-700">メンテナンス</span>
                {settings.pvMaintenanceEvents.map((event, i) => (
                  <div key={i} className="text-xs text-gray-700">
                    {event.year}年目に{formatCurrency(event.amount)} → 月々
                    {formatCurrency(Math.round(event.amount / 12))}
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-3">
                <span className="text-gray-700">30年累計費用</span>
                <div className="font-bold text-gray-900">{formatCurrency(totalGHousePvCost)}</div>
              </div>
              <div className="text-xs text-gray-500">
                ※PV劣化率{settings.pvDegradation * 100}%/年
              </div>
            </div>
          </div>

          {/* Gハウスの家 + 太陽光 + 蓄電池 */}
          <div
            className={`border rounded-lg p-4 bg-purple-50 relative ${bestScenario.key === 'gHousePvBatt' ? 'ring-2 ring-amber-300' : ''}`}
          >
            {bestScenario.key === 'gHousePvBatt' && (
              <div className="absolute -top-2 -right-2 bg-amber-400 rounded-full p-1">
                <Crown className="h-4 w-4 text-white" />
              </div>
            )}
            <h3 className="font-bold text-base mb-3 text-gray-900">
              Gハウスの家＋太陽光
              <br />
              ＋蓄電池
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-700">年間メリット（今年）</span>
                <div className="font-bold text-lg text-gray-900">
                  {formatCurrency(timeline[0]?.annualCfPvBatt || 0)}
                </div>
              </div>
              <div>
                <span className="text-gray-700">初期費用</span>
                <div className="font-bold text-gray-900">
                  {formatCurrency(pvInitialCost + batteryInitialCost)}
                </div>
                <div className="text-xs text-gray-500">
                  PV {totalKw.toFixed(1)}kW + 蓄電池（消費税込）
                </div>
              </div>
              <div>
                <span className="text-gray-700">メンテナンス</span>
                {[...settings.pvMaintenanceEvents, ...settings.batteryMaintenanceEvents]
                  .sort((a, b) => a.year - b.year)
                  .map((event, i) => (
                    <div key={i} className="text-xs text-gray-700">
                      {event.year}年目に{formatCurrency(event.amount)} → 月々
                      {formatCurrency(Math.round(event.amount / 12))}
                    </div>
                  ))}
              </div>
              <div className="border-t pt-2 mt-3">
                <span className="text-gray-700">30年累計費用</span>
                <div className="font-bold text-gray-900">
                  {formatCurrency(totalGHousePvBattCost)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                ※蓄電池劣化率{settings.batteryDegradation * 100}%/年
              </div>
            </div>
          </div>
        </div>

        {/* 比較サマリー帯 */}
        {bestScenario.benefit > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
            <div className="text-center font-bold text-gray-900">
              最もお得：{bestScenario.label}（30年累計メリット：
              {formatCurrency(bestScenario.benefit)}／月あたり平均：
              {formatCurrency(Math.round(bestScenario.benefit / 30 / 12))}）
            </div>
          </div>
        )}

        {/* 下段：3カラムレイアウト */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          {/* 左：前提条件パネル */}
          <div className="border rounded-lg bg-gray-50 flex flex-col">
            <div className="px-4 pt-4 pb-2">
              <h3 className="font-bold text-base text-gray-900">前提条件</h3>
            </div>

            <div className="flex-1 px-4 overflow-hidden">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {/* パネル設定 */}
                <div className="min-w-0">
                  <label className="block text-gray-700 mb-1">パネル枚数</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.panels}
                      onChange={(e) => updateSetting('panels', Number(e.target.value))}
                      className="w-16 px-2 py-1 border rounded text-gray-900"
                    />
                    <span className="text-gray-700 text-xs">= {totalKw.toFixed(1)}kW</span>
                  </div>
                </div>

                {/* 買取単価 */}
                <div className="min-w-0">
                  <label className="block text-gray-700 mb-1">買取単価(円/kWh)</label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-12">1-4年:</span>
                      <input
                        type="number"
                        value={settings.sellY1_4}
                        onChange={(e) => updateSetting('sellY1_4', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-12">5-10年:</span>
                      <input
                        type="number"
                        value={settings.sellY5_10}
                        onChange={(e) => updateSetting('sellY5_10', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-12">11年~:</span>
                      <input
                        type="number"
                        value={settings.sellAfter11}
                        onChange={(e) => updateSetting('sellAfter11', Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 自家消費率 */}
                <div className="min-w-0">
                  <label className="block text-gray-700 mb-1">自家消費率(%)</label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-16">PVのみ:</span>
                      <input
                        type="number"
                        value={settings.selfUseRatePv * 100}
                        onChange={(e) =>
                          updateSetting('selfUseRatePv', Number(e.target.value) / 100)
                        }
                        className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                      <span className="text-xs text-gray-700">%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-16">PV+蓄電:</span>
                      <input
                        type="number"
                        value={settings.selfUseRatePvBatt * 100}
                        onChange={(e) =>
                          updateSetting('selfUseRatePvBatt', Number(e.target.value) / 100)
                        }
                        className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                      <span className="text-xs text-gray-700">%</span>
                    </div>
                  </div>
                </div>

                {/* 基準光熱費 */}
                <div className="min-w-0">
                  <label className="block text-gray-700 mb-1">年間光熱費</label>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-12">一般:</span>
                      <input
                        type="number"
                        value={settings.generalAnnualCost}
                        onChange={(e) => updateSetting('generalAnnualCost', Number(e.target.value))}
                        className="w-20 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700 w-12">{settings.gHouseSpec}:</span>
                      <input
                        type="number"
                        value={settings.gHouseAnnualCost}
                        onChange={(e) => updateSetting('gHouseAnnualCost', Number(e.target.value))}
                        className="w-20 px-1 py-0.5 border rounded text-xs text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* PVメンテナンス */}
                <div className="col-span-2 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700">PVメンテナンス</label>
                    <button
                      onClick={() => addMaintenanceEvent('pv')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-3 w-3 text-gray-700" />
                    </button>
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {settings.pvMaintenanceEvents.map((event, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <input
                          type="number"
                          value={event.year}
                          onChange={(e) =>
                            updateMaintenanceEvent('pv', i, 'year', Number(e.target.value))
                          }
                          className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                          min="1"
                          max="30"
                        />
                        <span className="text-xs text-gray-700">年目</span>
                        <input
                          type="number"
                          value={event.amount}
                          onChange={(e) =>
                            updateMaintenanceEvent('pv', i, 'amount', Number(e.target.value))
                          }
                          className="w-16 px-1 py-0.5 border rounded text-xs text-gray-900"
                        />
                        <span className="text-xs text-gray-700">円</span>
                        <button
                          onClick={() => removeMaintenanceEvent('pv', i)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 蓄電池メンテナンス */}
                <div className="col-span-2 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700">蓄電池メンテナンス</label>
                    <button
                      onClick={() => addMaintenanceEvent('battery')}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Plus className="h-3 w-3 text-gray-700" />
                    </button>
                  </div>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {settings.batteryMaintenanceEvents.map((event, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <input
                          type="number"
                          value={event.year}
                          onChange={(e) =>
                            updateMaintenanceEvent('battery', i, 'year', Number(e.target.value))
                          }
                          className="w-12 px-1 py-0.5 border rounded text-xs text-gray-900"
                          min="1"
                          max="30"
                        />
                        <span className="text-xs text-gray-700">年目</span>
                        <input
                          type="number"
                          value={event.amount}
                          onChange={(e) =>
                            updateMaintenanceEvent('battery', i, 'amount', Number(e.target.value))
                          }
                          className="w-16 px-1 py-0.5 border rounded text-xs text-gray-900"
                        />
                        <span className="text-xs text-gray-700">円</span>
                        <button
                          onClick={() => removeMaintenanceEvent('battery', i)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 pb-3 pt-2 border-t">
              <div className="text-xs text-gray-500">
                <div>電力単価: {settings.gridPrice}円/kWh</div>
                <div>インフレ率: {settings.inflationRate * 100}%（固定）</div>
                <div>
                  PV劣化: {settings.pvDegradation * 100}%/年, 蓄電池劣化:{' '}
                  {settings.batteryDegradation * 100}%/年
                </div>
              </div>
            </div>
          </div>

          {/* 中：30年累積CFグラフ */}
          <div className="border rounded-lg p-4">
            <h3 className="font-bold text-base mb-3 text-gray-900">30年累積キャッシュフロー</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="year" tick={{ fill: '#374151' }} stroke="#9ca3af" />
                <YAxis
                  tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                  tick={{ fill: '#374151' }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => `${label}年目`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Line
                  type="monotone"
                  dataKey="cumulativeCfPv"
                  stroke="#2563EB"
                  name="Gハウスの家+太陽光"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeCfPvBatt"
                  stroke="#7C3AED"
                  name="Gハウスの家+太陽光+蓄電池"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 右：30年年次表 */}
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 pt-4 pb-2 bg-white">
              <h3 className="font-bold text-base text-gray-900">30年年次表</h3>
            </div>
            <div className="px-2 pb-2">
              <table className="w-full text-[11px] table-fixed">
                <thead>
                  <tr className="border-b text-gray-700">
                    <th className="text-left px-1 py-1 w-8">年</th>
                    <th className="text-right px-1 py-1 w-12">発電量</th>
                    <th className="text-right px-1 py-1 w-12">
                      自家
                      <br />
                      消費
                    </th>
                    <th className="text-right px-1 py-1 w-10">売電</th>
                    <th className="text-right px-1 py-1 w-12">
                      買取
                      <br />
                      金額
                    </th>
                    <th className="text-right px-1 py-1 w-12">節約額</th>
                    <th className="text-right px-1 py-1 w-12">メンテ</th>
                    <th className="text-right px-1 py-1 w-12">年次CF</th>
                    <th className="text-right px-1 py-1 w-14">累積</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((row) => (
                    <tr key={row.year} className="border-b hover:bg-gray-50 leading-tight">
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
                      <td className="text-right px-1 py-0.5 text-gray-900 truncate">
                        {formatNumber(Math.round(row.annualCfPvBatt))}
                      </td>
                      <td className="text-right px-1 py-0.5 font-bold text-gray-900 truncate">
                        {formatNumber(Math.round(row.cumulativeCfPvBatt))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
