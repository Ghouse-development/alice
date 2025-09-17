'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useStore } from '@/lib/store';
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
} from 'recharts';
import { ChevronDown, ChevronUp, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { A3PrintContainer } from './A3PrintContainer';

// Types
interface Settings {
  panel_count: number;
  panel_watt: number;
  panel_price: number;
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
  monthly_normal: number;
  monthly_high: number;
  years: number;
}

interface YearData {
  year: number;
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

// Scenario colors (統一配色)
const SCENARIO_COLORS = {
  normal: '#9CA3AF', // Gray 400
  highPerf: '#16A34A', // Green 600
  pv: '#2563EB', // Blue 600
  pvBatt: '#7C3AED', // Violet 600
};

// Regional yields
const REGIONAL_YIELDS: Record<string, number> = {
  osaka: 1200,
  tokyo: 1150,
  nagoya: 1180,
  sapporo: 1050,
};

// Format number with 3-digit separator
const formatNumber = (num: number): string => {
  return Math.round(num).toLocaleString('ja-JP');
};

// Calculate timeline
function calculateTimeline(settings: Settings): YearData[] {
  const timeline: YearData[] = [];
  const kW = (settings.panel_count * settings.panel_watt) / 1000;
  const pvInitCost = settings.panel_count * settings.panel_price;

  let cumulativeCfPv = -pvInitCost;
  let cumulativeCfBatt = -(pvInitCost + settings.batt_init);

  for (let year = 1; year <= settings.years; year++) {
    // Generation with degradation
    const degradeFactor = Math.pow(1 - settings.degrade, year - 1);
    const generation = kW * settings.yield_per_kw * degradeFactor;

    // PV scenario
    const selfConsumptionPv = generation * settings.self_use_rate_pv;
    const sellPv = generation - selfConsumptionPv;
    const sellPrice =
      year <= 4 ? settings.sell_y1_4 : year <= 10 ? settings.sell_y5_10 : settings.sell_after11;
    const savingPv = selfConsumptionPv * settings.buy_price;
    const sellIncomePv = sellPv * sellPrice;

    // Battery scenario
    const selfConsumptionBatt = generation * settings.self_use_rate_batt;
    const sellBatt = generation - selfConsumptionBatt;
    const savingBatt = selfConsumptionBatt * settings.buy_price;
    const sellIncomeBatt = sellBatt * sellPrice;

    // Maintenance
    const maintenancePv = year % settings.pc_cycle === 0 ? settings.pc_cost : 0;
    const maintenanceBatt =
      maintenancePv + (year % settings.batt_cycle === 0 && year > 0 ? settings.batt_cost : 0);

    // Cash flows
    const cfPv = savingPv + sellIncomePv - maintenancePv;
    const cfBatt = savingBatt + sellIncomeBatt - maintenanceBatt;

    cumulativeCfPv += cfPv;
    cumulativeCfBatt += cfBatt;

    timeline.push({
      year,
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
export default function SolarSimulatorConclusionFirst({ projectId }: { projectId?: string }) {
  const { theme } = useStore();
  const isDark = theme === 'dark';

  // Settings state
  const [settings, setSettings] = useState<Settings>({
    panel_count: 15,
    panel_watt: 460,
    panel_price: 70000,
    yield_per_kw: 1200,
    self_use_rate_pv: 0.35,
    self_use_rate_batt: 0.6,
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
    monthly_normal: 18000,
    monthly_high: 12000,
    years: 30,
  });

  const [region, setRegion] = useState('osaka');
  const [chartTab, setChartTab] = useState<'annual' | 'cumulative'>('cumulative');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [useBattery, setUseBattery] = useState(false);

  // Calculate data
  const timeline = useMemo(() => calculateTimeline(settings), [settings]);
  const totalKw = (settings.panel_count * settings.panel_watt) / 1000;

  // Key metrics
  const metrics = useMemo(() => {
    const year1 = timeline[0];
    const year10 = timeline[9];
    const year15 = timeline[14];
    const year20 = timeline[19];

    const paybackPv = timeline.findIndex((d) => d.cumulativeCfPv > 0) + 1;
    const paybackBatt = timeline.findIndex((d) => d.cumulativeCfBatt > 0) + 1;

    return {
      firstYearBenefit: year1?.cfPv || 0,
      firstYearBenefitBatt: year1?.cfBatt || 0,
      cumulative10: year10?.cumulativeCfPv || 0,
      cumulative15: year15?.cumulativeCfPv || 0,
      cumulative20: year20?.cumulativeCfPv || 0,
      cumulative10Batt: year10?.cumulativeCfBatt || 0,
      cumulative15Batt: year15?.cumulativeCfBatt || 0,
      cumulative20Batt: year20?.cumulativeCfBatt || 0,
      paybackPv: paybackPv > 0 ? paybackPv : null,
      paybackBatt: paybackBatt > 0 ? paybackBatt : null,
    };
  }, [timeline]);

  // Summary rows
  const summaryRows = useMemo(() => {
    return [0, 9, 14, 19, 29].map((i) => timeline[i]).filter(Boolean);
  }, [timeline]);

  // Update functions
  const updateSetting = useCallback((key: keyof Settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleRegionChange = useCallback(
    (newRegion: string) => {
      setRegion(newRegion);
      updateSetting('yield_per_kw', REGIONAL_YIELDS[newRegion] || 1200);
    },
    [updateSetting]
  );

  // Export functions
  const exportToPDF = useCallback(async () => {
    const element = document.getElementById('solar-simulator-main');
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
    const filename = `PV_A3_${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}.pdf`;
    pdf.save(filename);
  }, []);

  const exportToCSV = useCallback(() => {
    const headers = [
      '年',
      '発電量(kWh)',
      '自家消費(kWh)',
      '売電(kWh)',
      '節約額',
      '売電収入',
      'メンテ費',
      '年CF',
      '累積CF',
    ];
    const rows = timeline.map((d) => [
      d.year,
      Math.round(d.generation),
      Math.round(useBattery ? d.selfConsumptionBatt : d.selfConsumptionPv),
      Math.round(useBattery ? d.sellBatt : d.sellPv),
      Math.round(useBattery ? d.savingBatt : d.savingPv),
      Math.round(useBattery ? d.sellIncomeBatt : d.sellIncomePv),
      useBattery ? d.maintenanceBatt : d.maintenancePv,
      Math.round(useBattery ? d.cfBatt : d.cfPv),
      Math.round(useBattery ? d.cumulativeCfBatt : d.cumulativeCfPv),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `solar_simulation_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [timeline, useBattery]);

  return (
    <A3PrintContainer
      title="光熱費シミュレーション"
      subtitle="太陽光発電・蓄電池導入効果"
      className="bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white"
      autoScale={true}
    >
      <div className="h-full flex flex-col">
        {/* ヘッダー - Presentation2と統一 */}
        <div
          className={`relative border-b ${isDark ? 'bg-gradient-to-r from-black via-gray-900 to-black border-red-900/30' : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'}`}
        >
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">
                    G-HOUSE
                  </span>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <span
                  className={`text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-red-600 pb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  光熱費シミュレーション
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <main id="solar-simulator-main" className="flex-1 bg-white overflow-auto">
          <div className="h-full max-w-[1600px] mx-auto px-6 py-5 grid gap-6">
            {/* Layout Grid */}
            <div className="grid grid-cols-[minmax(280px,360px)_1fr_minmax(280px,360px)] grid-rows-[auto_1fr] gap-6">
              {/* A: Conclusion Header (3-column span) */}
              <div className="col-span-3">
                <div className="grid grid-cols-3 gap-4">
                  {/* Card 1: First Year Benefit */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">今年のメリット</div>
                    <div
                      className="text-4xl font-bold tabular-nums"
                      style={{ color: useBattery ? SCENARIO_COLORS.pvBatt : SCENARIO_COLORS.pv }}
                    >
                      ¥
                      {formatNumber(
                        useBattery ? metrics.firstYearBenefitBatt : metrics.firstYearBenefit
                      )}
                      <span className="text-base font-normal text-gray-500">/年</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">節約 + 売電 − メンテ</div>
                  </div>

                  {/* Card 2: Cumulative */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">累計メリット</div>
                    <div className="flex gap-3 justify-center">
                      {[
                        {
                          label: '10年',
                          value: useBattery ? metrics.cumulative10Batt : metrics.cumulative10,
                        },
                        {
                          label: '15年',
                          value: useBattery ? metrics.cumulative15Batt : metrics.cumulative15,
                        },
                        {
                          label: '20年',
                          value: useBattery ? metrics.cumulative20Batt : metrics.cumulative20,
                        },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600 mb-1">
                            {item.label}
                          </div>
                          <div className="text-lg font-bold">¥{formatNumber(item.value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Payback */}
                  <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
                    <div className="text-sm text-gray-600 mb-2">単純回収年</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">PV</span>
                        <span className="text-2xl font-bold" style={{ color: SCENARIO_COLORS.pv }}>
                          {metrics.paybackPv ? `${metrics.paybackPv}年` : '—'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">PV+蓄電池</span>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: SCENARIO_COLORS.pvBatt }}
                        >
                          {metrics.paybackBatt ? `${metrics.paybackBatt}年` : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-right">
                      条件：{region} / {totalKw.toFixed(1)}kW
                    </div>
                  </div>
                </div>
              </div>

              {/* D: Settings Panel (left column) */}
              <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
                <h2 className="text-base font-semibold mb-4">設定パネル</h2>

                {/* Main Settings (Always Visible) */}
                <div className="space-y-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-600">パネル枚数</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.panel_count}
                        onChange={(e) => updateSetting('panel_count', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-lg"
                        min="1"
                        max="50"
                        inputMode="numeric"
                      />
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        計 {totalKw.toFixed(1)}kW
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">買電単価 (円/kWh)</label>
                    <input
                      type="number"
                      value={settings.buy_price}
                      onChange={(e) => updateSetting('buy_price', Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="20"
                      max="40"
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">自家消費率</label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setUseBattery(false)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          !useBattery
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        PV (35%)
                      </button>
                      <button
                        onClick={() => setUseBattery(true)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          useBattery
                            ? 'bg-violet-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-700'
                        }`}
                      >
                        PV+蓄電池 (60%)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detailed Settings (Collapsible) */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setDetailsOpen(!detailsOpen)}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    <span>詳細設定</span>
                    {detailsOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {detailsOpen && (
                    <div className="mt-4 space-y-3 text-sm">
                      <div>
                        <label className="text-xs text-gray-600">地域</label>
                        <select
                          value={region}
                          onChange={(e) => handleRegionChange(e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="osaka">大阪 (1200)</option>
                          <option value="tokyo">東京 (1150)</option>
                          <option value="nagoya">名古屋 (1180)</option>
                          <option value="sapporo">札幌 (1050)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-600">W/枚</label>
                          <input
                            type="number"
                            value={settings.panel_watt}
                            onChange={(e) => updateSetting('panel_watt', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            inputMode="numeric"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">単価/枚</label>
                          <input
                            type="number"
                            value={settings.panel_price}
                            onChange={(e) => updateSetting('panel_price', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            inputMode="numeric"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs text-gray-600">売電1-4年</label>
                          <input
                            type="number"
                            value={settings.sell_y1_4}
                            onChange={(e) => updateSetting('sell_y1_4', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            inputMode="numeric"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">5-10年</label>
                          <input
                            type="number"
                            value={settings.sell_y5_10}
                            onChange={(e) => updateSetting('sell_y5_10', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            inputMode="numeric"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">11年〜</label>
                          <input
                            type="number"
                            value={settings.sell_after11}
                            onChange={(e) => updateSetting('sell_after11', Number(e.target.value))}
                            className="w-full px-2 py-1 border rounded text-sm"
                            inputMode="numeric"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-600">劣化率 (%/年)</label>
                        <input
                          type="number"
                          value={settings.degrade * 100}
                          onChange={(e) => updateSetting('degrade', Number(e.target.value) / 100)}
                          className="w-full px-2 py-1 border rounded text-sm"
                          min="0"
                          max="2"
                          step="0.1"
                          inputMode="decimal"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={exportToPDF}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </div>
              </div>

              {/* B: Comparison Charts (center) */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">比較グラフ</h2>
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartTab('annual')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        chartTab === 'annual'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      年間CF
                    </button>
                    <button
                      onClick={() => setChartTab('cumulative')}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        chartTab === 'cumulative'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      累積CF
                    </button>
                  </div>
                </div>

                <div className="h-[calc(100%-60px)]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartTab === 'annual' ? (
                      <BarChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="year" fontSize={11} tick={{ fill: '#6B7280' }} />
                        <YAxis
                          fontSize={11}
                          tick={{ fill: '#6B7280' }}
                          tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                        />
                        <Tooltip
                          formatter={(v: number) => `¥${formatNumber(v)}`}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Bar
                          dataKey={useBattery ? 'cfBatt' : 'cfPv'}
                          fill={useBattery ? SCENARIO_COLORS.pvBatt : SCENARIO_COLORS.pv}
                          name={useBattery ? 'PV+蓄電池' : 'PV'}
                        />
                      </BarChart>
                    ) : (
                      <LineChart data={timeline} margin={{ top: 5, right: 5, left: 5, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="year" fontSize={11} tick={{ fill: '#6B7280' }} />
                        <YAxis
                          fontSize={11}
                          tick={{ fill: '#6B7280' }}
                          tickFormatter={(v) => `${(v / 100000).toFixed(0)}十万`}
                        />
                        <Tooltip
                          formatter={(v: number) => `¥${formatNumber(v)}`}
                          contentStyle={{ fontSize: 12 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulativeCfPv"
                          stroke={SCENARIO_COLORS.pv}
                          name="PV"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulativeCfBatt"
                          stroke={SCENARIO_COLORS.pvBatt}
                          name="PV+蓄電池"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Legend
                          wrapperStyle={{
                            position: 'relative',
                            marginTop: '10px',
                            fontSize: 12,
                          }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* C: Annual Summary Table (right column) */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold">年次サマリ</h2>
                  <button
                    onClick={exportToCSV}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    全30年CSV
                  </button>
                </div>

                <div className="overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b text-gray-600">
                        <th className="py-2 text-left">年</th>
                        <th className="py-2 text-right">発電量</th>
                        <th className="py-2 text-right">節約額</th>
                        <th className="py-2 text-right">売電</th>
                        <th className="py-2 text-right">メンテ</th>
                        <th className="py-2 text-right">年CF</th>
                        <th className="py-2 text-right">累積</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryRows.map((row) => {
                        const data = useBattery
                          ? {
                              saving: row.savingBatt,
                              sellIncome: row.sellIncomeBatt,
                              maintenance: row.maintenanceBatt,
                              cf: row.cfBatt,
                              cumulative: row.cumulativeCfBatt,
                            }
                          : {
                              saving: row.savingPv,
                              sellIncome: row.sellIncomePv,
                              maintenance: row.maintenancePv,
                              cf: row.cfPv,
                              cumulative: row.cumulativeCfPv,
                            };

                        return (
                          <tr key={row.year} className="border-b">
                            <td className="py-2">{row.year}</td>
                            <td className="py-2 text-right tabular-nums">
                              {formatNumber(row.generation)}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              ¥{formatNumber(data.saving)}
                            </td>
                            <td className="py-2 text-right tabular-nums">
                              ¥{formatNumber(data.sellIncome)}
                            </td>
                            <td className="py-2 text-right tabular-nums text-red-600">
                              {data.maintenance > 0 ? `▲¥${formatNumber(data.maintenance)}` : '—'}
                            </td>
                            <td className="py-2 text-right tabular-nums font-medium">
                              ¥{formatNumber(data.cf)}
                            </td>
                            <td className="py-2 text-right tabular-nums font-bold">
                              ¥{formatNumber(data.cumulative)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t text-xs text-gray-600">
                  <div className="space-y-1">
                    <div>
                      売電: 1-4年={settings.sell_y1_4}円 5-10年={settings.sell_y5_10}円 11年〜=
                      {settings.sell_after11}円
                    </div>
                    <div>劣化率: {(settings.degrade * 100).toFixed(1)}%/年</div>
                    <div>
                      パワコン: {settings.pc_cycle}年毎 {formatNumber(settings.pc_cost)}円
                    </div>
                    {useBattery && (
                      <div>
                        蓄電池: 初期{formatNumber(settings.batt_init)}円 更新{settings.batt_cycle}
                        年毎
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </A3PrintContainer>
  );
}
