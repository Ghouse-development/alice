'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

// Types
interface Settings {
  years: number;
  inflation: number;
  panelW: number;
  panelPriceIncl: number;
  panels: number;
  kWhPerkWYear: number;
  region: 'osaka' | 'tokyo' | 'nagoya' | 'sapporo';

  selfPv: number;
  selfBat: number;
  buyUnit: number;
  sell1_4: number;
  sell5_10: number;
  sell11_: number;

  degrade: number;
  pcsCycle: number;
  pcsCost: number;
  batInit: number;
  batCycle: number;
  batRenew: number;

  costModel: 'legacy' | 'perPanel';
  legacyBase: number;
  legacyPerKw: number;
  tax: number;

  // Base monthly costs
  normalMonthly: number;
  highPerfMonthly: number;
}

interface YearData {
  year: number;
  normal: number;
  highPerf: number;
  highPerfPv: number;
  highPerfPvBat: number;
  generation: number;
  selfConsumption: number;
  sellKwh: number;
  saving: number;
  sellIncome: number;
  maintenance: number;
  yearlyBenefit: number;
  cumulativeBenefit: number;
  cfPv: number;
  cfPvBat: number;
  cumulativeCfPv: number;
  cumulativeCfPvBat: number;
}

// Regional power generation data
const REGIONAL_GENERATION: Record<string, number> = {
  osaka: 1200,
  tokyo: 1150,
  nagoya: 1250,
  sapporo: 1050,
};

// Calculation Functions
function calculateTimeline(settings: Settings): YearData[] {
  const timeline: YearData[] = [];
  const kW = settings.panels * (settings.panelW / 1000);

  // Initial costs
  const pvInitCost = settings.costModel === 'legacy'
    ? (settings.legacyBase + kW * settings.legacyPerKw) * (1 + settings.tax)
    : settings.panels * settings.panelPriceIncl;

  let prevGeneration = kW * settings.kWhPerkWYear;
  let cumulativeBenefitPv = -pvInitCost;
  let cumulativeBenefitPvBat = -(pvInitCost + settings.batInit);
  let cumulativeCfPv = 0;
  let cumulativeCfPvBat = 0;

  for (let t = 0; t < settings.years; t++) {
    // Base electricity costs with inflation
    const inflationFactor = Math.pow(1 + settings.inflation, t);
    const normalYearly = Math.round(settings.normalMonthly * 12 * inflationFactor);
    const highPerfYearly = Math.round(settings.highPerfMonthly * 12 * inflationFactor);

    // Generation with degradation
    const generation = t === 0 ? prevGeneration : prevGeneration * (1 - settings.degrade);
    prevGeneration = generation;

    // PV scenario (③)
    const selfConsumptionPv = generation * settings.selfPv;
    const sellKwhPv = Math.max(generation - selfConsumptionPv, 0);
    const sellUnit = t <= 3 ? settings.sell1_4 : t <= 9 ? settings.sell5_10 : settings.sell11_;
    const savingPv = selfConsumptionPv * settings.buyUnit * inflationFactor;
    const sellIncomePv = sellKwhPv * sellUnit;

    // PV+Battery scenario (④)
    const selfConsumptionBat = generation * settings.selfBat;
    const sellKwhBat = Math.max(generation - selfConsumptionBat, 0);
    const savingBat = selfConsumptionBat * settings.buyUnit * inflationFactor;
    const sellIncomeBat = sellKwhBat * sellUnit;

    // Maintenance costs
    let maintenancePv = 0;
    let maintenancePvBat = 0;

    // PCS replacement
    if (t === settings.pcsCycle - 1) {
      maintenancePv += settings.pcsCost;
      maintenancePvBat += settings.pcsCost;
    }

    // Fixed 15-year cost for PV
    if (t === 14) {
      maintenancePv += 200000;
    }

    // Battery replacement
    if (t === settings.batCycle - 1) {
      maintenancePvBat += settings.batRenew;
    }

    // Annual electricity bills
    const billPv = Math.max(highPerfYearly - savingPv - sellIncomePv, 0);
    const billPvBat = Math.max(highPerfYearly - savingBat - sellIncomeBat, 0);

    // Total costs including equipment
    const totalPv = billPv + maintenancePv;
    const totalPvBat = billPvBat + maintenancePvBat;

    // Annual benefits
    const yearlyBenefitPv = savingPv + sellIncomePv - maintenancePv;
    const yearlyBenefitPvBat = savingBat + sellIncomeBat - maintenancePvBat;

    // Cash flows
    const cfPv = yearlyBenefitPv;
    const cfPvBat = yearlyBenefitPvBat;

    // Update cumulative values
    cumulativeBenefitPv += yearlyBenefitPv;
    cumulativeBenefitPvBat += yearlyBenefitPvBat;
    cumulativeCfPv += cfPv;
    cumulativeCfPvBat += cfPvBat;

    timeline.push({
      year: t + 1,
      normal: normalYearly,
      highPerf: highPerfYearly,
      highPerfPv: totalPv,
      highPerfPvBat: totalPvBat,
      generation: Math.round(generation),
      selfConsumption: Math.round(selfConsumptionPv),
      sellKwh: Math.round(sellKwhPv),
      saving: Math.round(savingPv),
      sellIncome: Math.round(sellIncomePv),
      maintenance: maintenancePv,
      yearlyBenefit: Math.round(yearlyBenefitPv),
      cumulativeBenefit: Math.round(cumulativeBenefitPv),
      cfPv: Math.round(cfPv),
      cfPvBat: Math.round(cfPvBat),
      cumulativeCfPv: Math.round(cumulativeCfPv),
      cumulativeCfPvBat: Math.round(cumulativeCfPvBat),
    });
  }

  return timeline;
}

function calculateMetrics(timeline: YearData[], settings: Settings) {
  const kW = settings.panels * (settings.panelW / 1000);
  const pvInitCost = settings.costModel === 'legacy'
    ? (settings.legacyBase + kW * settings.legacyPerKw) * (1 + settings.tax)
    : settings.panels * settings.panelPriceIncl;

  // Total costs over 30 years
  const total1 = timeline.reduce((sum, d) => sum + d.normal, 0);
  const total2 = timeline.reduce((sum, d) => sum + d.highPerf, 0);
  const total3 = timeline.reduce((sum, d) => sum + d.highPerfPv, 0) + pvInitCost;
  const total4 = timeline.reduce((sum, d) => sum + d.highPerfPvBat, 0) + pvInitCost + settings.batInit;

  // Benefits compared to normal
  const benefit2 = total1 - total2;
  const benefit3 = total1 - total3;
  const benefit4 = total1 - total4;

  // Monthly averages
  const monthly2 = Math.round(benefit2 / 360);
  const monthly3 = Math.round(benefit3 / 360);
  const monthly4 = Math.round(benefit4 / 360);

  // Payback years
  const paybackPv = timeline.findIndex(d => d.cumulativeBenefit > 0) + 1;
  const paybackPvBat = timeline.findIndex(d => d.cumulativeCfPvBat > -settings.batInit) + 1;

  // Key year metrics
  const year1 = timeline[0];
  const year10 = timeline[9];
  const year15 = timeline[14];
  const year20 = timeline[19];

  return {
    total1,
    total2,
    total3,
    total4,
    benefit2,
    benefit3,
    benefit4,
    monthly2,
    monthly3,
    monthly4,
    paybackPv: paybackPv > 0 ? paybackPv : null,
    paybackPvBat: paybackPvBat > 0 ? paybackPvBat : null,
    year1Benefit: year1?.yearlyBenefit || 0,
    cumulative10: year10?.cumulativeBenefit || 0,
    cumulative15: year15?.cumulativeBenefit || 0,
    cumulative20: year20?.cumulativeBenefit || 0,
  };
}

// Main Component
export default function Presentation5RunningCostV2({ projectId }: { projectId?: string }) {
  // Initial settings
  const [settings, setSettings] = useState<Settings>({
    years: 30,
    inflation: 0.02,
    panelW: 460,
    panelPriceIncl: 70000,
    panels: 15,
    kWhPerkWYear: 1200,
    region: 'osaka',
    selfPv: 0.35,
    selfBat: 0.60,
    buyUnit: 27,
    sell1_4: 24,
    sell5_10: 8.3,
    sell11_: 8,
    degrade: 0.005,
    pcsCycle: 15,
    pcsCost: 300000,
    batInit: 1650000,
    batCycle: 15,
    batRenew: 1000000,
    costModel: 'legacy',
    legacyBase: 1000000,
    legacyPerKw: 90000,
    tax: 0.10,
    normalMonthly: 18000,
    highPerfMonthly: 12000,
  });

  // Calculate data
  const timeline = useMemo(() => calculateTimeline(settings), [settings]);
  const metrics = useMemo(() => calculateMetrics(timeline, settings), [timeline, settings]);
  const totalKw = settings.panels * (settings.panelW / 1000);

  // Update functions
  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleRegionChange = (region: string) => {
    updateSetting('region', region as Settings['region']);
    updateSetting('kWhPerkWYear', REGIONAL_GENERATION[region] || 1200);
  };

  return (
    <div className="a3-sheet bg-gray-50">
      <div className="a3-canvas">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">光熱費・ランニングコスト（30年比較）</h1>
          <div className="flex justify-center gap-8 text-sm">
            <span className="text-blue-600">①通常住宅</span>
            <span className="text-green-600">②高性能住宅</span>
            <span className="text-orange-600">③高性能＋太陽光</span>
            <span className="text-purple-600">④高性能＋太陽光＋蓄電池</span>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h2 className="text-lg font-semibold mb-3">設定パネル</h2>
          <div className="grid grid-cols-6 gap-3 text-sm">
            {/* Region */}
            <div>
              <label className="block text-xs font-medium mb-1">地域</label>
              <select
                value={settings.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs"
              >
                <option value="osaka">大阪</option>
                <option value="tokyo">東京</option>
                <option value="nagoya">名古屋</option>
                <option value="sapporo">札幌</option>
              </select>
            </div>

            {/* Panel Settings */}
            <div>
              <label className="block text-xs font-medium mb-1">パネル枚数</label>
              <input
                type="number"
                value={settings.panels}
                onChange={(e) => updateSetting('panels', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
                min="0"
                max="50"
              />
              <div className="text-xs text-gray-500 mt-1">計 {totalKw.toFixed(1)} kW</div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">1枚出力(W)</label>
              <input
                type="number"
                value={settings.panelW}
                onChange={(e) => updateSetting('panelW', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">1枚単価(円)</label>
              <input
                type="number"
                value={settings.panelPriceIncl}
                onChange={(e) => updateSetting('panelPriceIncl', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            {/* Cost Model */}
            <div>
              <label className="block text-xs font-medium mb-1">原価モデル</label>
              <select
                value={settings.costModel}
                onChange={(e) => updateSetting('costModel', e.target.value)}
                className="w-full px-2 py-1 border rounded text-xs"
              >
                <option value="legacy">旧式</option>
                <option value="perPanel">枚数式</option>
              </select>
            </div>

            {/* Generation */}
            <div>
              <label className="block text-xs font-medium mb-1">年間発電量(kWh/kW)</label>
              <input
                type="number"
                value={settings.kWhPerkWYear}
                onChange={(e) => updateSetting('kWhPerkWYear', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            {/* Self consumption */}
            <div>
              <label className="block text-xs font-medium mb-1">自家消費率(PV)</label>
              <input
                type="number"
                value={settings.selfPv * 100}
                onChange={(e) => updateSetting('selfPv', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-xs"
                min="0"
                max="100"
              />
              <span className="text-xs">%</span>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">自家消費率(蓄電池)</label>
              <input
                type="number"
                value={settings.selfBat * 100}
                onChange={(e) => updateSetting('selfBat', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-xs"
                min="0"
                max="100"
              />
              <span className="text-xs">%</span>
            </div>

            {/* Electricity prices */}
            <div>
              <label className="block text-xs font-medium mb-1">買電単価(円/kWh)</label>
              <input
                type="number"
                value={settings.buyUnit}
                onChange={(e) => updateSetting('buyUnit', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
                min="20"
                max="40"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">売電1-4年(円)</label>
              <input
                type="number"
                value={settings.sell1_4}
                onChange={(e) => updateSetting('sell1_4', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">売電5-10年(円)</label>
              <input
                type="number"
                value={settings.sell5_10}
                onChange={(e) => updateSetting('sell5_10', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">売電11年〜(円)</label>
              <input
                type="number"
                value={settings.sell11_}
                onChange={(e) => updateSetting('sell11_', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            {/* Degradation & Maintenance */}
            <div>
              <label className="block text-xs font-medium mb-1">劣化率(%/年)</label>
              <input
                type="number"
                value={settings.degrade * 100}
                onChange={(e) => updateSetting('degrade', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-xs"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">パワコン交換(年)</label>
              <input
                type="number"
                value={settings.pcsCycle}
                onChange={(e) => updateSetting('pcsCycle', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">パワコン費(万円)</label>
              <input
                type="number"
                value={settings.pcsCost / 10000}
                onChange={(e) => updateSetting('pcsCost', Number(e.target.value) * 10000)}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">蓄電池初期(万円)</label>
              <input
                type="number"
                value={settings.batInit / 10000}
                onChange={(e) => updateSetting('batInit', Number(e.target.value) * 10000)}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">蓄電池更新(年)</label>
              <input
                type="number"
                value={settings.batCycle}
                onChange={(e) => updateSetting('batCycle', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">蓄電池更新費(万円)</label>
              <input
                type="number"
                value={settings.batRenew / 10000}
                onChange={(e) => updateSetting('batRenew', Number(e.target.value) * 10000)}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </div>

            {/* Inflation */}
            <div>
              <label className="block text-xs font-medium mb-1">電気代インフレ(%)</label>
              <input
                type="number"
                value={settings.inflation * 100}
                onChange={(e) => updateSetting('inflation', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-xs"
                min="0"
                max="5"
                step="0.5"
              />
            </div>

            {/* Base costs display */}
            <div className="col-span-2 border-l pl-3">
              <div className="text-xs text-gray-600">
                <div>①通常住宅: {settings.normalMonthly.toLocaleString()}円/月</div>
                <div>②高性能住宅: {settings.highPerfMonthly.toLocaleString()}円/月</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          {/* Annual Costs Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold mb-2">年間光熱費推移（30年）</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={10} />
                <YAxis fontSize={10} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                <Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
                <Legend fontSize={10} />
                <Line type="monotone" dataKey="normal" stroke="#3B82F6" name="①通常" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="highPerf" stroke="#10B981" name="②高性能" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="highPerfPv" stroke="#F97316" name="③高性能+PV" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="highPerfPvBat" stroke="#8B5CF6" name="④高性能+PV+蓄電池" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold mb-2">年間CF・累積CF（メリット）</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={10} />
                <YAxis fontSize={10} tickFormatter={(v) => `${(v/10000).toFixed(0)}万`} />
                <Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
                <Legend fontSize={10} />
                <Bar dataKey="cfPv" fill="#F97316" name="年間CF(PV)" />
                <Bar dataKey="cfPvBat" fill="#8B5CF6" name="年間CF(PV+蓄電池)" />
                <Line type="monotone" dataKey="cumulativeCfPv" stroke="#DC2626" name="累積CF(PV)" strokeWidth={2} />
                <Line type="monotone" dataKey="cumulativeCfPvBat" stroke="#7C3AED" name="累積CF(PV+蓄電池)" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Data Table */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <h3 className="text-sm font-semibold mb-2">年次データ（主要10年分）</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left">年</th>
                  <th className="px-2 py-1 text-right">発電量(kWh)</th>
                  <th className="px-2 py-1 text-right">自家消費(kWh)</th>
                  <th className="px-2 py-1 text-right">売電(kWh)</th>
                  <th className="px-2 py-1 text-right">節約額</th>
                  <th className="px-2 py-1 text-right">売電収入</th>
                  <th className="px-2 py-1 text-right">メンテ費</th>
                  <th className="px-2 py-1 text-right">年メリット</th>
                  <th className="px-2 py-1 text-right">累積メリット</th>
                </tr>
              </thead>
              <tbody>
                {timeline.slice(0, 10).map((row) => (
                  <tr key={row.year} className={row.maintenance > 0 ? 'bg-red-50' : ''}>
                    <td className="px-2 py-1">{row.year}</td>
                    <td className="px-2 py-1 text-right">{row.generation.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right">{row.selfConsumption.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right">{row.sellKwh.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right">¥{row.saving.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right">¥{row.sellIncome.toLocaleString()}</td>
                    <td className="px-2 py-1 text-right text-red-600">
                      {row.maintenance > 0 ? `¥${row.maintenance.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-2 py-1 text-right font-semibold text-green-600">
                      ¥{row.yearlyBenefit.toLocaleString()}
                    </td>
                    <td className="px-2 py-1 text-right font-semibold">
                      ¥{row.cumulativeBenefit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-6 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">初年度メリット</div>
            <div className="text-lg font-bold text-green-600">
              ¥{metrics.year1Benefit.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">10年累積</div>
            <div className="text-lg font-bold text-blue-600">
              ¥{metrics.cumulative10.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">15年累積</div>
            <div className="text-lg font-bold text-blue-600">
              ¥{metrics.cumulative15.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">20年累積</div>
            <div className="text-lg font-bold text-blue-600">
              ¥{metrics.cumulative20.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">単純回収年</div>
            <div className="text-lg font-bold text-purple-600">
              PV: {metrics.paybackPv || '—'}年
            </div>
            <div className="text-sm text-purple-600">
              +蓄電池: {metrics.paybackPvBat || '—'}年
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600">30年総メリット(①比)</div>
            <div className="text-sm font-bold text-orange-600">
              ③PV: ¥{metrics.benefit3.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              月々: ¥{metrics.monthly3.toLocaleString()}
            </div>
            <div className="text-sm font-bold text-purple-600 mt-1">
              ④PV+蓄電池: ¥{metrics.benefit4.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              月々: ¥{metrics.monthly4.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}