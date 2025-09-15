'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Types
interface Settings {
  monthly_normal: number;
  monthly_high: number;
  panel_watt: number;
  panel_price: number;
  panel_count: number;
  yield_per_kw: number;
  self_use_rate_pv: number;
  self_use_rate_batt: number;
  buy_price: number;
  sell_y1_4: number;
  sell_y5_10: number;
  sell_after11: number;
  degrade: number;
  pc_cycle: number;
  pc_cost: number;
  batt_init: number;
  batt_cycle: number;
  batt_cost: number;
  years: number;
}

interface YearData {
  year: number;
  scenario1: number; // 通常
  scenario2: number; // 高性能
  scenario3: number; // 高性能+PV
  scenario4: number; // 高性能+PV+蓄電池
  generation: number;
  selfConsumptionPv: number;
  selfConsumptionBatt: number;
  sellPv: number;
  sellBatt: number;
  savingPv: number;
  savingBatt: number;
  sellIncomePv: number;
  sellIncomeBatt: number;
  maintenancePv: number;
  maintenanceBatt: number;
  cfPv: number;
  cfBatt: number;
  cumulativeCfPv: number;
  cumulativeCfBatt: number;
}

// Regional yields
const REGIONAL_YIELDS: Record<string, number> = {
  osaka: 1200,
  tokyo: 1150,
  nagoya: 1180,
  sapporo: 1050,
};

// Scenario colors (統一配色)
const SCENARIO_COLORS = {
  scenario1: '#9CA3AF', // Gray 400
  scenario2: '#16A34A', // Green 600
  scenario3: '#2563EB', // Blue 600
  scenario4: '#7C3AED', // Violet 600
};

// Format number with 3-digit separator
const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString('ja-JP');
};

// Calculate timeline
function calculateTimeline(settings: Settings): YearData[] {
  const timeline: YearData[] = [];
  const kW = settings.panel_count * settings.panel_watt / 1000;
  const pvInitCost = settings.panel_count * settings.panel_price;

  let cumulativeCfPv = -pvInitCost;
  let cumulativeCfBatt = -(pvInitCost + settings.batt_init);

  for (let year = 1; year <= settings.years; year++) {
    // Base costs
    const scenario1 = settings.monthly_normal * 12;
    const scenario2 = settings.monthly_high * 12;

    // Generation with degradation
    const degradeFactor = Math.pow(1 - settings.degrade, year - 1);
    const generation = kW * settings.yield_per_kw * degradeFactor;

    // PV scenario
    const selfConsumptionPv = generation * settings.self_use_rate_pv;
    const sellPv = generation - selfConsumptionPv;
    const sellPrice = year <= 4 ? settings.sell_y1_4 :
                     year <= 10 ? settings.sell_y5_10 :
                     settings.sell_after11;
    const savingPv = selfConsumptionPv * settings.buy_price;
    const sellIncomePv = sellPv * sellPrice;

    // Battery scenario
    const selfConsumptionBatt = generation * settings.self_use_rate_batt;
    const sellBatt = generation - selfConsumptionBatt;
    const savingBatt = selfConsumptionBatt * settings.buy_price;
    const sellIncomeBatt = sellBatt * sellPrice;

    // Maintenance
    const maintenancePv = (year % settings.pc_cycle === 0) ? settings.pc_cost : 0;
    const maintenanceBatt = maintenancePv +
      ((year % settings.batt_cycle === 0 && year > 0) ? settings.batt_cost : 0);

    // Cash flows
    const cfPv = savingPv + sellIncomePv - maintenancePv;
    const cfBatt = savingBatt + sellIncomeBatt - maintenanceBatt;

    cumulativeCfPv += cfPv;
    cumulativeCfBatt += cfBatt;

    // Scenario costs (after savings)
    const scenario3 = Math.max(scenario2 - savingPv - sellIncomePv + maintenancePv, 0);
    const scenario4 = Math.max(scenario2 - savingBatt - sellIncomeBatt + maintenanceBatt, 0);

    timeline.push({
      year,
      scenario1,
      scenario2,
      scenario3,
      scenario4,
      generation,
      selfConsumptionPv,
      selfConsumptionBatt,
      sellPv,
      sellBatt,
      savingPv,
      savingBatt,
      sellIncomePv,
      sellIncomeBatt,
      maintenancePv,
      maintenanceBatt,
      cfPv,
      cfBatt,
      cumulativeCfPv,
      cumulativeCfBatt,
    });
  }

  return timeline;
}

// Main component
export default function SolarSimulatorA3({ projectId }: { projectId?: string }) {
  const [settings, setSettings] = useState<Settings>({
    monthly_normal: 18000,
    monthly_high: 12000,
    panel_watt: 460,
    panel_price: 70000,
    panel_count: 15,
    yield_per_kw: 1200,
    self_use_rate_pv: 0.35,
    self_use_rate_batt: 0.60,
    buy_price: 27,
    sell_y1_4: 24,
    sell_y5_10: 8.3,
    sell_after11: 8,
    degrade: 0.005,
    pc_cycle: 15,
    pc_cost: 300000,
    batt_init: 1650000,
    batt_cycle: 15,
    batt_cost: 1000000,
    years: 30,
  });

  const [region, setRegion] = useState('osaka');

  // Calculate data
  const timeline = useMemo(() => calculateTimeline(settings), [settings]);
  const totalKw = settings.panel_count * settings.panel_watt / 1000;

  // Key metrics
  const metrics = useMemo(() => {
    const pvInitCost = settings.panel_count * settings.panel_price;
    const year1 = timeline[0];
    const year10 = timeline[9];
    const year15 = timeline[14];
    const year20 = timeline[19];

    const paybackPv = timeline.findIndex(d => d.cumulativeCfPv > 0) + 1;
    const paybackBatt = timeline.findIndex(d => d.cumulativeCfBatt > 0) + 1;

    return {
      firstYearBenefit: year1?.cfPv || 0,
      cumulative10: year10?.cumulativeCfPv || 0,
      cumulative15: year15?.cumulativeCfPv || 0,
      cumulative20: year20?.cumulativeCfPv || 0,
      paybackPv: paybackPv > 0 ? paybackPv : null,
      paybackBatt: paybackBatt > 0 ? paybackBatt : null,
    };
  }, [timeline, settings]);

  // Summary rows (1, 10, 15, 20, 30)
  const summaryRows = useMemo(() => {
    return [0, 9, 14, 19, 29]
      .map(i => timeline[i])
      .filter(Boolean);
  }, [timeline]);

  // Update functions
  const updateSetting = useCallback((key: keyof Settings, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleRegionChange = useCallback((newRegion: string) => {
    setRegion(newRegion);
    updateSetting('yield_per_kw', REGIONAL_YIELDS[newRegion] || 1200);
  }, [updateSetting]);

  // Export to PDF
  const exportToPDF = useCallback(async () => {
    const element = document.getElementById('solar-simulator-a3');
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#fff',
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3',
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 420, 297);

    const date = new Date();
    const filename = `PV_sim_A3_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}.pdf`;
    pdf.save(filename);
  }, []);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['年', '発電量(kWh)', '自家消費(kWh)', '売電(kWh)', '節約額', '売電収入', 'メンテ費', '年CF', '累積CF'];
    const rows = timeline.map(d => [
      d.year,
      Math.round(d.generation),
      Math.round(d.selfConsumptionPv),
      Math.round(d.sellPv),
      Math.round(d.savingPv),
      Math.round(d.sellIncomePv),
      d.maintenancePv,
      Math.round(d.cfPv),
      Math.round(d.cumulativeCfPv),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `solar_simulation_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [timeline]);

  return (
    <div
      id="solar-simulator-a3"
      className="w-[1280px] h-[905px] bg-white p-6"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div className="grid grid-cols-[420px_1fr_420px] grid-rows-[380px_1fr_260px] gap-4 h-full">

        {/* A: Settings Panel */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">設定パネル</h2>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 住宅前提 */}
            <div className="col-span-2 font-medium text-gray-700 mt-2">住宅前提</div>

            <div>
              <label className="text-gray-500">通常住宅(円/月)</label>
              <input
                type="number"
                value={settings.monthly_normal}
                onChange={(e) => updateSetting('monthly_normal', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500">高性能住宅(円/月)</label>
              <input
                type="number"
                value={settings.monthly_high}
                onChange={(e) => updateSetting('monthly_high', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            {/* パネル関連 */}
            <div className="col-span-2 font-medium text-gray-700 mt-2">パネル関連</div>

            <div>
              <label className="text-gray-500">W/枚</label>
              <input
                type="number"
                value={settings.panel_watt}
                onChange={(e) => updateSetting('panel_watt', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500">単価/枚(円)</label>
              <input
                type="number"
                value={settings.panel_price}
                onChange={(e) => updateSetting('panel_price', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div className="relative">
              <label className="text-gray-500">枚数</label>
              <input
                type="number"
                value={settings.panel_count}
                onChange={(e) => updateSetting('panel_count', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                計 {totalKw.toFixed(1)}kW
              </span>
            </div>

            {/* 地域選択 */}
            <div>
              <label className="text-gray-500">地域</label>
              <select
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="osaka">大阪(1200)</option>
                <option value="tokyo">東京(1150)</option>
                <option value="nagoya">名古屋(1180)</option>
                <option value="sapporo">札幌(1050)</option>
              </select>
            </div>

            {/* 発電・売買電 */}
            <div className="col-span-2 font-medium text-gray-700 mt-2">発電・売買電</div>

            <div>
              <label className="text-gray-500">自家消費率PV(%)</label>
              <input
                type="number"
                value={settings.self_use_rate_pv * 100}
                onChange={(e) => updateSetting('self_use_rate_pv', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-sm"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="text-gray-500">自家消費率蓄電池(%)</label>
              <input
                type="number"
                value={settings.self_use_rate_batt * 100}
                onChange={(e) => updateSetting('self_use_rate_batt', Number(e.target.value) / 100)}
                className="w-full px-2 py-1 border rounded text-sm"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="text-gray-500">買電単価(円/kWh)</label>
              <input
                type="number"
                value={settings.buy_price}
                onChange={(e) => updateSetting('buy_price', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500">売電1-4年(円)</label>
              <input
                type="number"
                value={settings.sell_y1_4}
                onChange={(e) => updateSetting('sell_y1_4', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500">売電5-10年(円)</label>
              <input
                type="number"
                value={settings.sell_y5_10}
                onChange={(e) => updateSetting('sell_y5_10', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            <div>
              <label className="text-gray-500">売電11年〜(円)</label>
              <input
                type="number"
                value={settings.sell_after11}
                onChange={(e) => updateSetting('sell_after11', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>

            {/* ボタン */}
            <div className="col-span-2 flex gap-2 mt-3">
              <button
                onClick={exportToPDF}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700"
              >
                PDF出力(A3横)
              </button>
              <button
                onClick={exportToCSV}
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700"
              >
                CSV出力
              </button>
            </div>
          </div>
        </div>

        {/* B: Comparison Charts */}
        <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">30年間比較グラフ</h2>

          <div className="grid grid-cols-2 gap-4 h-[280px]">
            {/* Bar Chart - Annual CF */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">年間キャッシュフロー</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="year"
                    fontSize={10}
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={(v) => `${(v/10000).toFixed(0)}万`}
                  />
                  <Tooltip
                    formatter={(v: number) => `¥${formatNumber(v)}`}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Bar dataKey="cfPv" fill={SCENARIO_COLORS.scenario3} name="PV" />
                  <Bar dataKey="cfBatt" fill={SCENARIO_COLORS.scenario4} name="PV+蓄電池" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart - Cumulative CF */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">累積キャッシュフロー</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="year"
                    fontSize={10}
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis
                    fontSize={10}
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={(v) => `${(v/100000).toFixed(0)}十万`}
                  />
                  <Tooltip
                    formatter={(v: number) => `¥${formatNumber(v)}`}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCfPv"
                    stroke={SCENARIO_COLORS.scenario3}
                    name="PV"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCfBatt"
                    stroke={SCENARIO_COLORS.scenario4}
                    name="PV+蓄電池"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Legend
                    wrapperStyle={{
                      position: 'absolute',
                      bottom: 0,
                      right: 10,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: 11,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* C: Key Metrics */}
        <div className="space-y-4">
          {/* Card 1: First Year Benefit */}
          <div className="bg-white rounded-2xl p-4 shadow-sm h-[116px] flex flex-col justify-center">
            <div className="text-xs text-gray-500 mb-1">初年度メリット</div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: SCENARIO_COLORS.scenario3 }}>
              ¥{formatNumber(metrics.firstYearBenefit)}
              <span className="text-xs font-normal text-gray-500 ml-1">/年</span>
            </div>
          </div>

          {/* Card 2: Cumulative */}
          <div className="bg-white rounded-2xl p-4 shadow-sm h-[116px] flex flex-col justify-center">
            <div className="text-xs text-gray-500 mb-2">累積メリット</div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 rounded px-2 py-1 text-center">
                <div className="text-xs text-gray-600">10年</div>
                <div className="text-sm font-bold">¥{formatNumber(metrics.cumulative10)}</div>
              </div>
              <div className="flex-1 bg-gray-50 rounded px-2 py-1 text-center">
                <div className="text-xs text-gray-600">15年</div>
                <div className="text-sm font-bold">¥{formatNumber(metrics.cumulative15)}</div>
              </div>
              <div className="flex-1 bg-gray-50 rounded px-2 py-1 text-center">
                <div className="text-xs text-gray-600">20年</div>
                <div className="text-sm font-bold">¥{formatNumber(metrics.cumulative20)}</div>
              </div>
            </div>
          </div>

          {/* Card 3: Payback */}
          <div className="bg-white rounded-2xl p-4 shadow-sm h-[116px] flex flex-col justify-center">
            <div className="text-xs text-gray-500 mb-2">単純回収年</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PV</span>
                <span className="text-xl font-bold" style={{ color: SCENARIO_COLORS.scenario3 }}>
                  {metrics.paybackPv ? `${metrics.paybackPv}年` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">PV+蓄電池</span>
                <span className="text-xl font-bold" style={{ color: SCENARIO_COLORS.scenario4 }}>
                  {metrics.paybackBatt ? `${metrics.paybackBatt}年` : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* D: Annual Summary Table */}
        <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">年次サマリ（主要年のみ）</h2>
            <span className="text-xs text-gray-500">詳細はCSV出力で確認</span>
          </div>

          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-gray-600">
                  <th className="py-2 text-left">年</th>
                  <th className="py-2 text-right">発電量(kWh)</th>
                  <th className="py-2 text-right">自家消費(kWh)</th>
                  <th className="py-2 text-right">売電(kWh)</th>
                  <th className="py-2 text-right">節約額</th>
                  <th className="py-2 text-right">売電収入</th>
                  <th className="py-2 text-right">メンテ費</th>
                  <th className="py-2 text-right">年CF</th>
                  <th className="py-2 text-right">累積CF</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row) => (
                  <tr key={row.year} className="border-b">
                    <td className="py-2">{row.year}</td>
                    <td className="py-2 text-right tabular-nums">{formatNumber(row.generation)}</td>
                    <td className="py-2 text-right tabular-nums">{formatNumber(row.selfConsumptionPv)}</td>
                    <td className="py-2 text-right tabular-nums">{formatNumber(row.sellPv)}</td>
                    <td className="py-2 text-right tabular-nums">¥{formatNumber(row.savingPv)}</td>
                    <td className="py-2 text-right tabular-nums">¥{formatNumber(row.sellIncomePv)}</td>
                    <td className="py-2 text-right tabular-nums text-red-600">
                      {row.maintenancePv > 0 ? `¥${formatNumber(row.maintenancePv)}` : '—'}
                    </td>
                    <td className="py-2 text-right tabular-nums font-medium" style={{ color: SCENARIO_COLORS.scenario3 }}>
                      ¥{formatNumber(row.cfPv)}
                    </td>
                    <td className="py-2 text-right tabular-nums font-bold" style={{ color: SCENARIO_COLORS.scenario3 }}>
                      ¥{formatNumber(row.cumulativeCfPv)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E: Notes */}
        <div className="bg-gray-50 rounded-2xl p-4 shadow-sm text-xs text-gray-600 leading-relaxed">
          <h3 className="font-semibold text-gray-700 mb-2">注記</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>売電：1-4年={settings.sell_y1_4}円、5-10年={settings.sell_y5_10}円、11年〜={settings.sell_after11}円</li>
            <li>比発電量は地域係数に基づく概算</li>
            <li>実発電は設置条件により変動</li>
            <li>価格は税込概算</li>
            <li>買電単価は燃料費調整等で変動</li>
          </ul>

          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="font-semibold text-gray-700 mb-1">凡例</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.scenario1 }}></div>
                <span>①通常(なし)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.scenario2 }}></div>
                <span>②高性能</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.scenario3 }}></div>
                <span>③高性能+PV</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.scenario4 }}></div>
                <span>④高性能+PV+蓄電池</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}