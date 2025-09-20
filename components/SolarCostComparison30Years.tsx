'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Download, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface SolarCostComparison30YearsProps {
  projectId: string;
}

// シナリオ色定義
const SCENARIO_COLORS = {
  normal: '#9CA3AF',      // Gray
  highPerf: '#16A34A',    // Green
  highPerfPV: '#2563EB',  // Blue
  highPerfPVBatt: '#7C3AED' // Violet
};

export default function SolarCostComparison30Years({ projectId }: SolarCostComparison30YearsProps) {
  // 設定値
  const [panelCount, setPanelCount] = useState(15);
  const [buyPrice, setBuyPrice] = useState(27);
  const [consumptionRatePV, setConsumptionRatePV] = useState(35);
  const [consumptionRateBatt, setConsumptionRateBatt] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'cumulative' | 'annual'>('cumulative');

  // 詳細設定
  const [panelWatt, setPanelWatt] = useState(460);
  const [panelPrice, setPanelPrice] = useState(70000);
  const [region, setRegion] = useState('osaka');
  const [sellPrice1_4, setSellPrice1_4] = useState(24);
  const [sellPrice5_10, setSellPrice5_10] = useState(8.3);
  const [sellPriceAfter11, setSellPriceAfter11] = useState(8);
  const [degradeRate, setDegradeRate] = useState(0.5);
  const [pcCycle, setPcCycle] = useState(15);
  const [pcCost, setPcCost] = useState(300000);
  const [batteryPrice, setBatteryPrice] = useState(1650000);
  const [batteryReplaceCost, setBatteryReplaceCost] = useState(1000000);
  const [normalMonthly, setNormalMonthly] = useState(18000);
  const [highPerfMonthly, setHighPerfMonthly] = useState(12000);

  // 地域別年間比発電量
  const yieldPerKw = {
    osaka: 1200,
    tokyo: 1150,
    nagoya: 1180,
    sapporo: 1050
  }[region] || 1200;

  const capacityKw = (panelCount * panelWatt) / 1000;

  // 30年間の計算
  const calculations = useMemo(() => {
    const years = [];

    for (let year = 1; year <= 30; year++) {
      // 年間発電量
      const annualGeneration = capacityKw * yieldPerKw * Math.pow(1 - degradeRate / 100, year - 1);

      // 売電単価
      const sellPrice = year <= 4 ? sellPrice1_4 : year <= 10 ? sellPrice5_10 : sellPriceAfter11;

      // 自家消費と売電の計算
      const selfConsumePV = annualGeneration * (consumptionRatePV / 100);
      const selfConsumeBatt = annualGeneration * (consumptionRateBatt / 100);
      const sellPV = annualGeneration * (1 - consumptionRatePV / 100);
      const sellBatt = annualGeneration * (1 - consumptionRateBatt / 100);

      // メンテナンス費
      const pcMaintenance = year % pcCycle === 0 ? pcCost : 0;
      const battMaintenance = year % pcCycle === 0 ? batteryReplaceCost : 0;

      // 年間コスト
      const normalCost = normalMonthly * 12;
      const highPerfCost = highPerfMonthly * 12;
      const highPerfPVCost = highPerfMonthly * 12 - selfConsumePV * buyPrice - sellPV * sellPrice + pcMaintenance;
      const highPerfPVBattCost = highPerfMonthly * 12 - selfConsumeBatt * buyPrice - sellBatt * sellPrice + pcMaintenance + battMaintenance;

      years.push({
        year,
        normal: normalCost,
        highPerf: highPerfCost,
        highPerfPV: highPerfPVCost,
        highPerfPVBatt: highPerfPVBattCost,
        generation: Math.round(annualGeneration),
        selfConsumePV: Math.round(selfConsumePV),
        selfConsumeBatt: Math.round(selfConsumeBatt),
        sellPV: Math.round(sellPV),
        sellBatt: Math.round(sellBatt)
      });
    }

    // 累積計算
    let cumulativeNormal = 0;
    let cumulativeHighPerf = 0;
    let cumulativeHighPerfPV = 0;
    let cumulativeHighPerfPVBatt = 0;

    const cumulativeData = years.map(y => {
      cumulativeNormal += y.normal;
      cumulativeHighPerf += y.highPerf;
      cumulativeHighPerfPV += y.highPerfPV;
      cumulativeHighPerfPVBatt += y.highPerfPVBatt;

      const minCost = Math.min(cumulativeHighPerf, cumulativeHighPerfPV, cumulativeHighPerfPVBatt);
      const savings = cumulativeNormal - minCost;
      const monthlySavings = savings / (y.year * 12);

      return {
        year: y.year,
        normal: Math.round(cumulativeNormal),
        highPerf: Math.round(cumulativeHighPerf),
        highPerfPV: Math.round(cumulativeHighPerfPV),
        highPerfPVBatt: Math.round(cumulativeHighPerfPVBatt),
        savings: Math.round(savings),
        monthlySavings: Math.round(monthlySavings),
        annualDiffHighPerf: Math.round(y.normal - y.highPerf),
        annualDiffHighPerfPV: Math.round(y.normal - y.highPerfPV),
        annualDiffHighPerfPVBatt: Math.round(y.normal - y.highPerfPVBatt)
      };
    });

    return cumulativeData;
  }, [panelCount, panelWatt, buyPrice, consumptionRatePV, consumptionRateBatt, region,
      sellPrice1_4, sellPrice5_10, sellPriceAfter11, degradeRate, pcCycle, pcCost,
      batteryPrice, batteryReplaceCost, normalMonthly, highPerfMonthly]);

  // 最終年（30年）のデータ
  const year30 = calculations[29];
  const minCost30 = Math.min(year30.highPerf, year30.highPerfPV, year30.highPerfPVBatt);
  const bestScenario = minCost30 === year30.highPerf ? '高性能' :
                       minCost30 === year30.highPerfPV ? '高性能+PV' : '高性能+PV+蓄電池';

  // 今年のメリット
  const year1 = calculations[0];
  const currentYearBenefit = consumptionRateBatt > consumptionRatePV ?
    (normalMonthly - highPerfMonthly) * 12 + (year1.normal - year1.highPerfPVBatt) :
    (normalMonthly - highPerfMonthly) * 12 + (year1.normal - year1.highPerfPV);

  // 単純回収年計算
  const pvInvestment = panelCount * panelPrice;
  const pvBattInvestment = pvInvestment + batteryPrice;

  const pvPayback = calculations.findIndex(y => (y.normal - y.highPerfPV) > pvInvestment) + 1;
  const pvBattPayback = calculations.findIndex(y => (y.normal - y.highPerfPVBatt) > pvBattInvestment) + 1;

  // サマリーテーブル用データ
  const summaryYears = [1, 10, 15, 20, 30];
  const summaryData = summaryYears.map(y => calculations[y - 1]);

  // CSV出力
  const exportCSV = () => {
    const headers = ['年', '通常', '高性能', '高性能+PV', '高性能+PV+蓄電池', '通常比差額', '月換算'];
    const rows = calculations.map(row => [
      row.year,
      row.normal,
      row.highPerf,
      row.highPerfPV,
      row.highPerfPVBatt,
      row.savings,
      row.monthlySavings
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar_comparison_30years_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <main className="min-h-screen w-screen bg-white text-gray-900">
      <div className="h-[100svh] max-w-[1600px] mx-auto px-6 py-5 grid gap-6
                      grid-rows-[auto_1fr_auto]
                      grid-cols-[minmax(300px,360px)_1fr_minmax(320px,360px)]">

        {/* A: 結論ヘッダー */}
        <div className="col-span-3">
          <h1 className="text-2xl font-bold mb-4">30年で、いくら変わる？</h1>
          <div className="grid grid-cols-4 gap-4">
            {/* 30年トータル（最安） */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600">30年トータル光熱費（最安）</Label>
                <div className="text-5xl font-bold text-blue-700 tabular-nums">
                  ¥{minCost30.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">{bestScenario}</div>
              </CardContent>
            </Card>

            {/* 30年の差額 */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600">30年の差額（通常比）</Label>
                <div className="text-4xl font-bold text-green-700 tabular-nums">
                  −¥{year30.savings.toLocaleString()}
                </div>
                <div className="text-2xl font-semibold text-green-600 mt-1">
                  = 月 −¥{year30.monthlySavings.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            {/* 今年のメリット */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600">今年のメリット</Label>
                <div className="text-4xl font-bold text-purple-700 tabular-nums">
                  ¥{currentYearBenefit.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">節約＋売電−メンテ</div>
              </CardContent>
            </Card>

            {/* 単純回収年 */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <Label className="text-sm text-gray-600">単純回収年</Label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">{pvPayback || 30}年</span>
                    <span className="text-sm text-gray-600">PV</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-violet-600">{pvBattPayback || 30}年</span>
                    <span className="text-sm text-gray-600">PV+蓄電池</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-xs text-gray-500 text-right mt-2">
            条件：{region === 'osaka' ? '大阪' : region === 'tokyo' ? '東京' : region === 'nagoya' ? '名古屋' : '札幌'} / {capacityKw.toFixed(1)}kW / 2025下期スキーム
          </div>
        </div>

        {/* B: 設定サイド */}
        <div className="row-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">設定</h3>

              {/* 常時表示設定 */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">パネル枚数</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={panelCount}
                      onChange={(e) => setPanelCount(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">枚</span>
                    <span className="text-sm font-medium ml-auto">計 {capacityKw.toFixed(1)}kW</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">買電単価</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-600">円/kWh</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm">自家消費率</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PV</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={consumptionRatePV}
                          onChange={(e) => setConsumptionRatePV(Number(e.target.value))}
                          className="w-16"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">PV+蓄電池</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={consumptionRateBatt}
                          onChange={(e) => setConsumptionRateBatt(Number(e.target.value))}
                          className="w-16"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 詳細設定 */}
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-medium hover:text-blue-600"
                >
                  詳細設定
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <Label className="text-xs">パネル出力/単価</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={panelWatt}
                          onChange={(e) => setPanelWatt(Number(e.target.value))}
                          className="w-16 h-7"
                        />
                        <span className="text-xs">W</span>
                        <Input
                          type="number"
                          value={panelPrice}
                          onChange={(e) => setPanelPrice(Number(e.target.value))}
                          className="w-20 h-7"
                        />
                        <span className="text-xs">円</span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">地域</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="h-7">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="osaka">大阪</SelectItem>
                          <SelectItem value="tokyo">東京</SelectItem>
                          <SelectItem value="nagoya">名古屋</SelectItem>
                          <SelectItem value="sapporo">札幌</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">売電単価</Label>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs w-16">1-4年</span>
                          <Input
                            type="number"
                            step="0.1"
                            value={sellPrice1_4}
                            onChange={(e) => setSellPrice1_4(Number(e.target.value))}
                            className="w-16 h-6"
                          />
                          <span className="text-xs">円</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs w-16">5-10年</span>
                          <Input
                            type="number"
                            step="0.1"
                            value={sellPrice5_10}
                            onChange={(e) => setSellPrice5_10(Number(e.target.value))}
                            className="w-16 h-6"
                          />
                          <span className="text-xs">円</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs w-16">11年〜</span>
                          <Input
                            type="number"
                            step="0.1"
                            value={sellPriceAfter11}
                            onChange={(e) => setSellPriceAfter11(Number(e.target.value))}
                            className="w-16 h-6"
                          />
                          <span className="text-xs">円</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">月光熱費前提</Label>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs w-16">通常</span>
                          <Input
                            type="number"
                            value={normalMonthly}
                            onChange={(e) => setNormalMonthly(Number(e.target.value))}
                            className="w-20 h-6"
                          />
                          <span className="text-xs">円/月</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs w-16">高性能</span>
                          <Input
                            type="number"
                            value={highPerfMonthly}
                            onChange={(e) => setHighPerfMonthly(Number(e.target.value))}
                            className="w-20 h-6"
                          />
                          <span className="text-xs">円/月</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* エクスポート */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full" onClick={exportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV出力
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* C: 比較グラフ */}
        <div className="row-span-1">
          <Card className="h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">30年でどれくらい差が出る？</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('cumulative')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'cumulative' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    累積コスト
                  </button>
                  <button
                    onClick={() => setActiveTab('annual')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    年間差額
                  </button>
                </div>
              </div>

              <div className="flex-1">
                {activeTab === 'cumulative' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={calculations} margin={{ top: 10, right: 60, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="year"
                        label={{ value: '年', position: 'insideBottomRight', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                      />
                      <Line
                        type="monotone"
                        dataKey="normal"
                        stroke={SCENARIO_COLORS.normal}
                        strokeWidth={2}
                        dot={false}
                        name="①通常"
                      />
                      <Line
                        type="monotone"
                        dataKey="highPerf"
                        stroke={SCENARIO_COLORS.highPerf}
                        strokeWidth={2}
                        dot={false}
                        name="②高性能"
                      />
                      <Line
                        type="monotone"
                        dataKey="highPerfPV"
                        stroke={SCENARIO_COLORS.highPerfPV}
                        strokeWidth={2}
                        dot={false}
                        name="③高性能+PV"
                      />
                      <Line
                        type="monotone"
                        dataKey="highPerfPVBatt"
                        stroke={SCENARIO_COLORS.highPerfPVBatt}
                        strokeWidth={2}
                        dot={false}
                        name="④高性能+PV+蓄電池"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculations} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="year"
                        label={{ value: '年', position: 'insideBottomRight', offset: -5 }}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                      />
                      <Bar dataKey="annualDiffHighPerf" fill={SCENARIO_COLORS.highPerf} name="②高性能" />
                      <Bar dataKey="annualDiffHighPerfPV" fill={SCENARIO_COLORS.highPerfPV} name="③高性能+PV" />
                      <Bar dataKey="annualDiffHighPerfPVBatt" fill={SCENARIO_COLORS.highPerfPVBatt} name="④高性能+PV+蓄電池" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* 凡例 */}
              <div className="mt-4 bg-white/90 rounded p-2">
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.normal }} />
                    <span>①通常</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerf }} />
                    <span>②高性能</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPV }} />
                    <span>③高性能+PV</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPVBatt }} />
                    <span>④高性能+PV+蓄電池</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* D: 注記＆凡例 */}
        <div className="row-span-1">
          <Card className="h-full">
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">シミュレーション条件</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <Label className="text-xs text-gray-600">システム容量</Label>
                  <div className="font-medium">{capacityKw.toFixed(1)}kW ({panelCount}枚 × {panelWatt}W)</div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">年間予想発電量</Label>
                  <div className="font-medium">{Math.round(capacityKw * yieldPerKw).toLocaleString()}kWh</div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">自家消費率</Label>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PV</span>
                      <span className="font-medium">{consumptionRatePV}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PV+蓄電池</span>
                      <span className="font-medium">{consumptionRateBatt}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-600">売電単価</Label>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">1-4年</span>
                      <span className="font-medium">{sellPrice1_4}円/kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">5-10年</span>
                      <span className="font-medium">{sellPrice5_10}円/kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">11年〜</span>
                      <span className="font-medium">{sellPriceAfter11}円/kWh</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    ※劣化率{degradeRate}%/年、パワコン交換{pcCycle}年周期
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ※「性能×太陽光×蓄電池」で光熱費の実質負担を最小化
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* E: サマリ表 */}
        <div className="col-span-3">
          <Card>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">年</th>
                      <th className="text-right py-2">①通常の累計</th>
                      <th className="text-right py-2">②高性能の累計</th>
                      <th className="text-right py-2">③高性能+PVの累計</th>
                      <th className="text-right py-2">④高性能+PV+蓄電池の累計</th>
                      <th className="text-right py-2">通常比の差額（最安）</th>
                      <th className="text-right py-2">月換算</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((row) => {
                      const minCost = Math.min(row.highPerf, row.highPerfPV, row.highPerfPVBatt);
                      const savings = row.normal - minCost;
                      const monthlySavings = savings / (row.year * 12);

                      return (
                        <tr key={row.year} className="border-b">
                          <td className="py-2 font-medium">{row.year}年目</td>
                          <td className="text-right py-2 tabular-nums">¥{row.normal.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums">¥{row.highPerf.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums">¥{row.highPerfPV.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums">¥{row.highPerfPVBatt.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums font-medium text-blue-600">
                            −¥{savings.toLocaleString()}
                          </td>
                          <td className="text-right py-2 tabular-nums text-blue-600">
                            −¥{Math.round(monthlySavings).toLocaleString()}/月
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}