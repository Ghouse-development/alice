'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Download, FileText, Check, Car, Home as HomeIcon, Briefcase } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SolarComparison30YearsFinalProps {
  projectId: string;
}

// シナリオ色定義
const SCENARIO_COLORS = {
  normal: '#9CA3AF',      // Gray
  highPerf: '#16A34A',    // Green
  highPerfPV: '#2563EB',  // Blue
  highPerfPVBatt: '#7C3AED' // Violet
};

// 地域別年間比発電量
const REGIONAL_YIELDS: Record<string, number> = {
  osaka: 1200,
  tokyo: 1150,
  nagoya: 1180,
  sapporo: 1050
};

export default function SolarComparison30YearsFinal({ projectId }: SolarComparison30YearsFinalProps) {
  // 設定値
  const [panelCount, setPanelCount] = useState(15);
  const [buyPrice, setBuyPrice] = useState(27);
  const [consumptionRatePV, setConsumptionRatePV] = useState(35);
  const [consumptionRateBatt, setConsumptionRateBatt] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'cumulative' | 'annual'>('cumulative');
  const [includeLoan, setIncludeLoan] = useState(false);
  const [loanRate, setLoanRate] = useState(1.0);
  const [loanYears, setLoanYears] = useState(35);
  const [lifestyle, setLifestyle] = useState<'away' | 'normal' | 'ev'>('normal');

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
  const [inflationRate, setInflationRate] = useState(0);

  // ライフスタイルによる自家消費率調整
  const adjustedConsumptionPV = useMemo(() => {
    if (lifestyle === 'away') return Math.max(consumptionRatePV - 5, 0);
    if (lifestyle === 'ev') return Math.min(consumptionRatePV + 10, 100);
    return consumptionRatePV;
  }, [consumptionRatePV, lifestyle]);

  const adjustedConsumptionBatt = useMemo(() => {
    if (lifestyle === 'away') return Math.max(consumptionRateBatt - 5, 0);
    if (lifestyle === 'ev') return Math.min(consumptionRateBatt + 10, 100);
    return consumptionRateBatt;
  }, [consumptionRateBatt, lifestyle]);

  const yieldPerKw = REGIONAL_YIELDS[region] || 1200;
  const capacityKw = (panelCount * panelWatt) / 1000;

  // 30年間の計算
  const calculations = useMemo(() => {
    const years = [];

    for (let year = 1; year <= 30; year++) {
      // 年間発電量
      const annualGeneration = capacityKw * yieldPerKw * Math.pow(1 - degradeRate / 100, year - 1);

      // 売電単価
      const sellPrice = year <= 4 ? sellPrice1_4 : year <= 10 ? sellPrice5_10 : sellPriceAfter11;

      // インフレ調整後の買電単価と基礎使用料
      const adjustedBuyPrice = buyPrice * Math.pow(1 + inflationRate / 100, year - 1);
      const adjustedNormalMonthly = normalMonthly * Math.pow(1 + inflationRate / 100, year - 1);
      const adjustedHighPerfMonthly = highPerfMonthly * Math.pow(1 + inflationRate / 100, year - 1);

      // 自家消費と売電の計算
      const selfConsumePV = annualGeneration * (adjustedConsumptionPV / 100);
      const selfConsumeBatt = annualGeneration * (adjustedConsumptionBatt / 100);
      const sellPV = annualGeneration * (1 - adjustedConsumptionPV / 100);
      const sellBatt = annualGeneration * (1 - adjustedConsumptionBatt / 100);

      // メンテナンス費
      const pcMaintenance = year % pcCycle === 0 ? pcCost : 0;
      const battMaintenance = year % pcCycle === 0 ? batteryReplaceCost : 0;

      // 年間コスト
      const normalCost = adjustedNormalMonthly * 12;
      const highPerfCost = adjustedHighPerfMonthly * 12;
      const highPerfPVCost = adjustedHighPerfMonthly * 12 - selfConsumePV * adjustedBuyPrice - sellPV * sellPrice + pcMaintenance;
      const highPerfPVBattCost = adjustedHighPerfMonthly * 12 - selfConsumeBatt * adjustedBuyPrice - sellBatt * sellPrice + pcMaintenance + battMaintenance;

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
  }, [panelCount, panelWatt, buyPrice, adjustedConsumptionPV, adjustedConsumptionBatt, region,
      sellPrice1_4, sellPrice5_10, sellPriceAfter11, degradeRate, pcCycle, pcCost,
      batteryPrice, batteryReplaceCost, normalMonthly, highPerfMonthly, inflationRate]);

  // 最終年（30年）のデータ
  const year30 = calculations[29];
  const minCost30 = Math.min(year30.highPerf, year30.highPerfPV, year30.highPerfPVBatt);
  const bestScenario = minCost30 === year30.highPerf ? '②高性能' :
                       minCost30 === year30.highPerfPV ? '③高性能+PV' : '④高性能+PV+蓄電池';
  const bestScenarioId = minCost30 === year30.highPerf ? 2 :
                         minCost30 === year30.highPerfPV ? 3 : 4;

  // ローン計算
  const pvInvestment = panelCount * panelPrice;
  const pvBattInvestment = pvInvestment + batteryPrice;

  const calculateLoanPayment = (principal: number) => {
    const r = loanRate / 100 / 12;
    const n = loanYears * 12;
    if (r === 0) return principal / n;
    return principal * r / (1 - Math.pow(1 + r, -n));
  };

  const pvLoanMonthly = Math.round(calculateLoanPayment(pvInvestment));
  const pvBattLoanMonthly = Math.round(calculateLoanPayment(pvBattInvestment));

  // 今年のメリット
  const year1 = calculations[0];
  const currentYearBenefit = bestScenarioId === 4 ?
    (year1.normal - year1.highPerfPVBatt) :
    bestScenarioId === 3 ?
    (year1.normal - year1.highPerfPV) :
    (year1.normal - year1.highPerf);

  // 単純回収年計算
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
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar_comparison_30years_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <main className="w-screen min-h-screen bg-white text-gray-900">
      <div className="h-[100svh] max-w-[1600px] mx-auto px-6 py-5 grid gap-6
                      grid-rows-[auto_1fr_auto]
                      grid-cols-[minmax(300px,360px)_1fr_minmax(320px,360px)]">

        {/* A: 結論ヘッダー */}
        <div className="col-span-3">
          <div className="flex justify-between items-start">
            {/* 左：差額強調 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">30年で、ここまで安くなります</h1>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
                <div className="text-5xl font-bold text-blue-600 tabular-nums">
                  −¥{year30.savings.toLocaleString()}
                </div>
                <div className="text-2xl font-semibold text-blue-500 mt-2">
                  = 月 −¥{year30.monthlySavings.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 中央：各シナリオの30年合計 */}
            <div className="flex gap-3">
              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: SCENARIO_COLORS.normal }} />
                <div className="text-xs text-gray-600">①通常</div>
                <div className="text-lg font-bold text-gray-700 tabular-nums">
                  ¥{year30.normal.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: SCENARIO_COLORS.highPerf }} />
                <div className="text-xs text-gray-600">②高性能</div>
                <div className="text-lg font-bold text-gray-700 tabular-nums">
                  ¥{year30.highPerf.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: SCENARIO_COLORS.highPerfPV }} />
                <div className="text-xs text-gray-600">③高性能+PV</div>
                <div className="text-lg font-bold text-gray-700 tabular-nums">
                  ¥{year30.highPerfPV.toLocaleString()}
                </div>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: SCENARIO_COLORS.highPerfPVBatt }} />
                <div className="text-xs text-gray-600">④PV+蓄電池</div>
                <div className="text-lg font-bold text-gray-700 tabular-nums">
                  ¥{year30.highPerfPVBatt.toLocaleString()}
                </div>
              </div>
            </div>

            {/* 右：おすすめと見積ボタン */}
            <div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold text-sm mb-3">
                Gハウスのおすすめ：{bestScenario}
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => console.log('③で見積作成')}
                >
                  ③で見積を作成
                </Button>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => console.log('④で見積作成')}
                >
                  ④で見積を作成
                </Button>
              </div>
            </div>
          </div>

          {/* 前提表示 */}
          <div className="text-xs text-gray-500 mt-3 text-right">
            {region === 'osaka' ? '大阪' : region === 'tokyo' ? '東京' : region === 'nagoya' ? '名古屋' : '札幌'} / {capacityKw.toFixed(1)}kW / 2025下期スキーム
          </div>
        </div>

        {/* B: 設定サイド */}
        <div className="row-span-1">
          <Card className="h-full bg-white">
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-4">設定</h3>

              {/* くらし方ボタン */}
              <div className="mb-4">
                <Label className="text-sm text-gray-700">くらし方</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Button
                    variant={lifestyle === 'away' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('away')}
                    className="text-xs"
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    昼外出多め
                  </Button>
                  <Button
                    variant={lifestyle === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('normal')}
                    className="text-xs"
                  >
                    <HomeIcon className="h-3 w-3 mr-1" />
                    在宅/共働き
                  </Button>
                  <Button
                    variant={lifestyle === 'ev' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('ev')}
                    className="text-xs"
                  >
                    <Car className="h-3 w-3 mr-1" />
                    EV・電化
                  </Button>
                </div>
              </div>

              {/* 常時表示設定 */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-700">パネル枚数</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={panelCount}
                      onChange={(e) => setPanelCount(Number(e.target.value))}
                      className="w-20 text-sm"
                    />
                    <span className="text-sm text-gray-600">枚</span>
                    <span className="text-sm font-medium text-gray-700 ml-auto">計 {capacityKw.toFixed(1)}kW</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-700">買電単価</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      className="w-20 text-sm"
                    />
                    <span className="text-sm text-gray-600">円/kWh</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-700">自家消費率</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PV</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{adjustedConsumptionPV}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PV+蓄電池</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{adjustedConsumptionBatt}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ローン組込みトグル */}
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-700">住宅ローンに含める</Label>
                  <Switch checked={includeLoan} onCheckedChange={setIncludeLoan} />
                </div>

                {includeLoan && (
                  <div className="space-y-2 p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">金利</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={loanRate}
                        onChange={(e) => setLoanRate(Number(e.target.value))}
                        className="w-16 h-7 text-xs"
                      />
                      <span className="text-xs text-gray-600">%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">期間</Label>
                      <Input
                        type="number"
                        value={loanYears}
                        onChange={(e) => setLoanYears(Number(e.target.value))}
                        className="w-16 h-7 text-xs"
                      />
                      <span className="text-xs text-gray-600">年</span>
                    </div>
                    <div className="text-xs text-gray-700 mt-2">
                      <div>③ローン増額: +¥{pvLoanMonthly.toLocaleString()}/月</div>
                      <div>④ローン増額: +¥{pvBattLoanMonthly.toLocaleString()}/月</div>
                    </div>
                  </div>
                )}
              </div>

              {/* 詳細設定 */}
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  詳細設定
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <Label className="text-xs text-gray-600">地域</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="h-7 text-xs">
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
                      <Label className="text-xs text-gray-600">インフレ率</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.5"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-16 h-6 text-xs"
                        />
                        <span className="text-xs text-gray-600">%/年</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* エクスポート */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={exportCSV}>
                  <Download className="h-3 w-3 mr-2" />
                  CSV出力（全30年）
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* C: 比較グラフ */}
        <div className="row-span-1">
          <Card className="h-full bg-white">
            <CardContent className="p-4 h-full flex flex-col">
              {/* 帯ウィジェット */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">30年トータル（光熱費の累計）</span>
                  <span className="text-sm font-bold text-blue-600">
                    通常 vs 最安 = 月々¥{year30.monthlySavings.toLocaleString()}お得
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">
                  {activeTab === 'cumulative' ? '30年で、どれくらい変わる？' : '毎年どのくらい差が出る？'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('cumulative')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'cumulative' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    累積コスト
                  </button>
                  <button
                    onClick={() => setActiveTab('annual')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    年間差額
                  </button>
                </div>
              </div>

              <div className="flex-1">
                {activeTab === 'cumulative' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={calculations} margin={{ top: 10, right: 80, left: 10, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="year"
                        label={{ value: '年', position: 'insideBottomRight', offset: -5, fill: '#374151' }}
                        tick={{ fontSize: 12, fill: '#374151' }}
                        ticks={[5, 10, 15, 20, 25, 30]}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12, fill: '#374151' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
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
                        label={{ value: '年', position: 'insideBottomRight', offset: -5, fill: '#374151' }}
                        tick={{ fontSize: 12, fill: '#374151' }}
                        ticks={[5, 10, 15, 20, 25, 30]}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12, fill: '#374151' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                      />
                      <Bar dataKey="annualDiffHighPerf" fill={SCENARIO_COLORS.highPerf} name="②高性能" />
                      <Bar dataKey="annualDiffHighPerfPV" fill={SCENARIO_COLORS.highPerfPV} name="③高性能+PV" />
                      <Bar dataKey="annualDiffHighPerfPVBatt" fill={SCENARIO_COLORS.highPerfPVBatt} name="④高性能+PV+蓄電池" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* 凡例 */}
              <div className="mt-4 bg-white/80 backdrop-blur rounded p-2">
                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.normal }} />
                    <span className="text-gray-700">①通常</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerf }} />
                    <span className="text-gray-700">②高性能</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPV }} />
                    <span className="text-gray-700">③高性能+PV</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPVBatt }} />
                    <span className="text-gray-700">④PV+蓄電池</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* D: 注記＆凡例 */}
        <div className="row-span-1">
          <Card className="h-full bg-white">
            <CardContent className="p-4">
              {/* おすすめの理由 */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-3">おすすめの理由</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">買う電気＞売る電気：自家消費で買電を回避</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">2025下期：前半4年が高単価で初期効果大</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">高性能×太陽光：基礎消費が少ないほど売電増</span>
                  </div>
                </div>
              </div>

              {/* シミュレーション条件 */}
              <div className="pt-4 border-t">
                <h3 className="font-bold text-gray-900 mb-3">シミュレーション条件</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">パネル：</span>
                    <span className="text-gray-700">460W×{panelCount}枚={capacityKw.toFixed(1)}kW</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">売電：</span>
                    <span className="text-gray-700">1-4年{sellPrice1_4}円/5-10年{sellPrice5_10}円/11年〜{sellPriceAfter11}円</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">PC：</span>
                    <span className="text-gray-700">15年ごと30万円</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">蓄電池：</span>
                    <span className="text-gray-700">初期165万円+15年ごと100万円</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">劣化：</span>
                    <span className="text-gray-700">年0.5%</span>
                  </div>
                </div>

                <button className="text-xs text-blue-600 hover:underline mt-3">
                  前提と注意事項を表示
                </button>
              </div>

              {/* 数値サマリー */}
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">今年のメリット</span>
                    <span className="text-sm font-bold text-gray-700">¥{currentYearBenefit.toLocaleString()}/年</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">単純回収年</span>
                    <div className="text-sm font-bold text-gray-700">
                      <span className="text-blue-600">{pvPayback || 30}年</span> /
                      <span className="text-purple-600 ml-1">{pvBattPayback || 30}年</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* E: サマリ表 */}
        <div className="col-span-3">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900">累計光熱費の推移</h3>
                <span className="text-sm text-green-600 font-bold">おすすめ：{bestScenario}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 text-gray-700">年</th>
                      <th className="text-right py-2 text-gray-700">①通常の累計</th>
                      <th className="text-right py-2 text-gray-700">②高性能の累計</th>
                      <th className="text-right py-2 text-gray-700">③高性能+PVの累計</th>
                      <th className="text-right py-2 text-gray-700">④PV+蓄電池の累計</th>
                      <th className="text-right py-2 font-bold text-blue-600">通常比の差額（最安）</th>
                      <th className="text-right py-2 font-bold text-blue-600">月換算</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((row) => {
                      const minCost = Math.min(row.highPerf, row.highPerfPV, row.highPerfPVBatt);
                      const savings = row.normal - minCost;
                      const monthlySavings = savings / (row.year * 12);

                      return (
                        <tr key={row.year} className="border-b border-gray-200">
                          <td className="py-2 font-medium text-gray-700">{row.year}年目</td>
                          <td className="text-right py-2 tabular-nums text-gray-700">¥{row.normal.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums text-gray-700">¥{row.highPerf.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums text-gray-700">¥{row.highPerfPV.toLocaleString()}</td>
                          <td className="text-right py-2 tabular-nums text-gray-700">¥{row.highPerfPVBatt.toLocaleString()}</td>
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