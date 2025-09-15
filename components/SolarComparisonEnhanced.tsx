'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp, Download, Check, Car, Home as HomeIcon, Briefcase, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface SolarComparisonEnhancedProps {
  projectId: string;
}

const SCENARIO_COLORS = {
  normal: '#6B7280',
  highPerf: '#059669',
  highPerfPV: '#1E40AF',
  highPerfPVBatt: '#7C3AED'
};

const REGIONAL_YIELDS: Record<string, number> = {
  osaka: 1200,
  tokyo: 1150,
  nagoya: 1180,
  sapporo: 1050
};

export default function SolarComparisonEnhanced({ projectId }: SolarComparisonEnhancedProps) {
  const [panelCount, setPanelCount] = useState(15);
  const [buyPrice, setBuyPrice] = useState(27);
  const [consumptionRatePV, setConsumptionRatePV] = useState(35);
  const [consumptionRateBatt, setConsumptionRateBatt] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'cumulative' | 'annual' | 'comparison'>('comparison');
  const [includeLoan, setIncludeLoan] = useState(false);
  const [loanRate, setLoanRate] = useState(1.0);
  const [loanYears, setLoanYears] = useState(35);
  const [lifestyle, setLifestyle] = useState<'away' | 'normal' | 'ev'>('normal');

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
  const [inflationRate, setInflationRate] = useState(2);

  const adjustedConsumptionPV = useMemo(() => {
    if (lifestyle === 'away') return Math.max(consumptionRatePV - 10, 20);
    if (lifestyle === 'ev') return Math.min(consumptionRatePV + 15, 80);
    return consumptionRatePV;
  }, [consumptionRatePV, lifestyle]);

  const adjustedConsumptionBatt = useMemo(() => {
    if (lifestyle === 'away') return Math.max(consumptionRateBatt - 10, 40);
    if (lifestyle === 'ev') return Math.min(consumptionRateBatt + 15, 95);
    return consumptionRateBatt;
  }, [consumptionRateBatt, lifestyle]);

  const yieldPerKw = REGIONAL_YIELDS[region] || 1200;
  const capacityKw = (panelCount * panelWatt) / 1000;

  const calculations = useMemo(() => {
    const years = [];

    for (let year = 1; year <= 30; year++) {
      const annualGeneration = capacityKw * yieldPerKw * Math.pow(1 - degradeRate / 100, year - 1);
      const sellPrice = year <= 4 ? sellPrice1_4 : year <= 10 ? sellPrice5_10 : sellPriceAfter11;
      const adjustedBuyPrice = buyPrice * Math.pow(1 + inflationRate / 100, year - 1);
      const adjustedNormalMonthly = normalMonthly * Math.pow(1 + inflationRate / 100, year - 1);
      const adjustedHighPerfMonthly = highPerfMonthly * Math.pow(1 + inflationRate / 100, year - 1);

      const selfConsumePV = annualGeneration * (adjustedConsumptionPV / 100);
      const selfConsumeBatt = annualGeneration * (adjustedConsumptionBatt / 100);
      const sellPV = annualGeneration * (1 - adjustedConsumptionPV / 100);
      const sellBatt = annualGeneration * (1 - adjustedConsumptionBatt / 100);

      const pcMaintenance = year % pcCycle === 0 ? pcCost : 0;
      const battMaintenance = year === 15 ? batteryReplaceCost : 0;

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

    let cumulativeNormal = 0;
    let cumulativeHighPerf = 0;
    let cumulativeHighPerfPV = panelCount * panelPrice;
    let cumulativeHighPerfPVBatt = panelCount * panelPrice + batteryPrice;

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
      batteryPrice, batteryReplaceCost, normalMonthly, highPerfMonthly, inflationRate, panelPrice]);

  const year30 = calculations[29];
  const year10 = calculations[9];
  const year20 = calculations[19];

  const minCost30 = Math.min(year30.highPerf, year30.highPerfPV, year30.highPerfPVBatt);
  const bestScenario = minCost30 === year30.highPerf ? '②高性能住宅' :
                       minCost30 === year30.highPerfPV ? '③高性能住宅＋太陽光' : '④高性能住宅＋太陽光＋蓄電池';
  const bestScenarioId = minCost30 === year30.highPerf ? 2 :
                         minCost30 === year30.highPerfPV ? 3 : 4;

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

  const year1 = calculations[0];
  const currentYearBenefit = bestScenarioId === 4 ?
    (year1.normal - year1.highPerfPVBatt) :
    bestScenarioId === 3 ?
    (year1.normal - year1.highPerfPV) :
    (year1.normal - year1.highPerf);

  const pvPayback = calculations.findIndex(y =>
    (y.normal - y.highPerfPV) * y.year > pvInvestment
  ) + 1;
  const pvBattPayback = calculations.findIndex(y =>
    (y.normal - y.highPerfPVBatt) * y.year > pvBattInvestment
  ) + 1;

  const getRecommendationScore = () => {
    const scores = {
      highPerf: 0,
      highPerfPV: 0,
      highPerfPVBatt: 0
    };

    if (inflationRate >= 2) {
      scores.highPerfPV += 2;
      scores.highPerfPVBatt += 1;
    }

    if (lifestyle === 'ev') {
      scores.highPerfPVBatt += 3;
      scores.highPerfPV += 1;
    } else if (lifestyle === 'normal') {
      scores.highPerfPV += 2;
      scores.highPerfPVBatt += 1;
    } else {
      scores.highPerfPV += 1;
    }

    if (year30.savings > 3000000) {
      scores.highPerfPV += 2;
      scores.highPerfPVBatt += 2;
    }

    if (pvPayback <= 10) scores.highPerfPV += 2;
    if (pvBattPayback <= 15) scores.highPerfPVBatt += 1;

    return scores;
  };

  const recommendationScores = getRecommendationScore();
  const maxScore = Math.max(recommendationScores.highPerf, recommendationScores.highPerfPV, recommendationScores.highPerfPVBatt);
  const recommendedScenario = maxScore === recommendationScores.highPerfPVBatt ? 4 :
                              maxScore === recommendationScores.highPerfPV ? 3 : 2;

  const exportCSV = () => {
    const headers = ['年', '通常住宅', '高性能住宅', '高性能住宅＋太陽光', '高性能住宅＋太陽光＋蓄電池', '通常比差額', '月換算'];
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
    <main className="w-screen min-h-screen bg-white text-gray-900 print:p-0">
      <div className="h-[100svh] max-w-[1600px] mx-auto px-4 py-3 grid gap-4
                      grid-rows-[auto_1fr_auto]
                      grid-cols-[320px_1fr_340px]
                      print:grid-cols-[280px_1fr_280px]">

        {/* Header with Conclusion */}
        <div className="col-span-3 bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-6 items-start">

            {/* Main Savings Display */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">30年間の光熱費シミュレーション結果</h1>
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 border-2 border-emerald-400">
                <div className="text-4xl font-bold text-emerald-700 tabular-nums">
                  最大 ¥{year30.savings.toLocaleString()} お得
                </div>
                <div className="text-xl font-semibold text-emerald-600 mt-1">
                  月々 ¥{year30.monthlySavings.toLocaleString()} の節約
                </div>
              </div>
            </div>

            {/* Scenario Comparison */}
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">30年間の累計光熱費</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS.normal }} />
                  <span className="text-sm text-gray-700 w-28">①通常住宅</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    ¥{year30.normal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS.highPerf }} />
                  <span className="text-sm text-gray-700 w-28">②高性能住宅</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    ¥{year30.highPerf.toLocaleString()}
                  </span>
                </div>
                <div className={`flex items-center gap-3 ${recommendedScenario === 3 ? 'bg-blue-50 p-1 rounded' : ''}`}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS.highPerfPV }} />
                  <span className="text-sm text-gray-700 w-28">③高性能＋太陽光</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    ¥{year30.highPerfPV.toLocaleString()}
                  </span>
                </div>
                <div className={`flex items-center gap-3 ${recommendedScenario === 4 ? 'bg-purple-50 p-1 rounded' : ''}`}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: SCENARIO_COLORS.highPerfPVBatt }} />
                  <span className="text-sm text-gray-700 w-28">④高性能＋太陽光＋蓄電池</span>
                  <span className="text-sm font-bold text-gray-900 tabular-nums">
                    ¥{year30.highPerfPVBatt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation & Actions */}
            <div className="space-y-3">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  <span className="font-bold text-gray-900">Gハウスのおすすめ</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {recommendedScenario === 4 ? '④高性能＋太陽光＋蓄電池' :
                   recommendedScenario === 3 ? '③高性能＋太陽光' : '②高性能住宅'}
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  onClick={() => console.log('Create estimate for scenario 3')}
                >
                  ③で見積作成
                </Button>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  onClick={() => console.log('Create estimate for scenario 4')}
                >
                  ④で見積作成
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="row-span-1 bg-white">
          <Card className="h-full border-gray-200">
            <CardContent className="p-3">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">シミュレーション設定</h3>

              {/* Lifestyle Buttons */}
              <div className="mb-3">
                <Label className="text-xs text-gray-700">生活スタイル</Label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  <Button
                    variant={lifestyle === 'away' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('away')}
                    className={`text-xs h-8 ${lifestyle === 'away' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    日中外出
                  </Button>
                  <Button
                    variant={lifestyle === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('normal')}
                    className={`text-xs h-8 ${lifestyle === 'normal' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                  >
                    <HomeIcon className="h-3 w-3 mr-1" />
                    在宅勤務
                  </Button>
                  <Button
                    variant={lifestyle === 'ev' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLifestyle('ev')}
                    className={`text-xs h-8 ${lifestyle === 'ev' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
                  >
                    <Car className="h-3 w-3 mr-1" />
                    EV所有
                  </Button>
                </div>
              </div>

              {/* Basic Settings */}
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-700">太陽光パネル容量</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={panelCount}
                      onChange={(e) => setPanelCount(Number(e.target.value))}
                      className="w-16 h-7 text-xs"
                    />
                    <span className="text-xs text-gray-600">枚</span>
                    <span className="text-xs font-medium text-gray-900 ml-auto">{capacityKw.toFixed(1)}kW</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700">電気料金単価</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(Number(e.target.value))}
                      className="w-16 h-7 text-xs"
                    />
                    <span className="text-xs text-gray-600">円/kWh</span>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-700">自家消費率（調整後）</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">太陽光のみ</span>
                      <span className="font-medium text-gray-900">{adjustedConsumptionPV}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">蓄電池あり</span>
                      <span className="font-medium text-gray-900">{adjustedConsumptionBatt}%</span>
                    </div>
                  </div>
                </div>

                {/* Loan Integration */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs text-gray-700">住宅ローン組込</Label>
                    <Switch
                      checked={includeLoan}
                      onCheckedChange={setIncludeLoan}
                      className="scale-75"
                    />
                  </div>

                  {includeLoan && (
                    <div className="bg-gray-50 rounded p-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-600 w-12">金利</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={loanRate}
                          onChange={(e) => setLoanRate(Number(e.target.value))}
                          className="w-14 h-6 text-xs"
                        />
                        <span className="text-xs text-gray-600">%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-600 w-12">期間</Label>
                        <Input
                          type="number"
                          value={loanYears}
                          onChange={(e) => setLoanYears(Number(e.target.value))}
                          className="w-14 h-6 text-xs"
                        />
                        <span className="text-xs text-gray-600">年</span>
                      </div>
                      <div className="text-xs text-gray-900 font-medium pt-1 border-t">
                        <div>③月々増額: +¥{pvLoanMonthly.toLocaleString()}</div>
                        <div>④月々増額: +¥{pvBattLoanMonthly.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced Settings */}
                <div className="border-t pt-2">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center justify-between w-full text-xs font-medium text-gray-700 hover:text-blue-600"
                  >
                    詳細設定
                    {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {showAdvanced && (
                    <div className="mt-2 space-y-2">
                      <div>
                        <Label className="text-xs text-gray-600">地域</Label>
                        <Select value={region} onValueChange={setRegion}>
                          <SelectTrigger className="h-6 text-xs">
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
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            step="0.5"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(Number(e.target.value))}
                            className="w-14 h-6 text-xs"
                          />
                          <span className="text-xs text-gray-600">%/年</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3 text-xs h-7"
                onClick={exportCSV}
              >
                <Download className="h-3 w-3 mr-1" />
                CSV出力
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Area */}
        <div className="row-span-1 bg-white">
          <Card className="h-full border-gray-200">
            <CardContent className="p-3 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-sm">光熱費推移グラフ</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('comparison')}
                    className={`px-2 py-1 text-xs rounded ${
                      activeTab === 'comparison' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    比較
                  </button>
                  <button
                    onClick={() => setActiveTab('cumulative')}
                    className={`px-2 py-1 text-xs rounded ${
                      activeTab === 'cumulative' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    累積
                  </button>
                  <button
                    onClick={() => setActiveTab('annual')}
                    className={`px-2 py-1 text-xs rounded ${
                      activeTab === 'annual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    年間
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                {activeTab === 'comparison' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calculations} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: '#374151' }}
                        ticks={[5, 10, 15, 20, 25, 30]}
                        label={{ value: '年', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#374151' }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 10, fill: '#374151' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #d1d5db', fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="normal" stackId="1" stroke={SCENARIO_COLORS.normal} fill={SCENARIO_COLORS.normal} fillOpacity={0.3} />
                      <Area type="monotone" dataKey="highPerf" stackId="2" stroke={SCENARIO_COLORS.highPerf} fill={SCENARIO_COLORS.highPerf} fillOpacity={0.3} />
                      <Area type="monotone" dataKey="highPerfPV" stackId="3" stroke={SCENARIO_COLORS.highPerfPV} fill={SCENARIO_COLORS.highPerfPV} fillOpacity={0.3} />
                      <Area type="monotone" dataKey="highPerfPVBatt" stackId="4" stroke={SCENARIO_COLORS.highPerfPVBatt} fill={SCENARIO_COLORS.highPerfPVBatt} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {activeTab === 'cumulative' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={calculations} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: '#374151' }}
                        ticks={[5, 10, 15, 20, 25, 30]}
                        label={{ value: '年', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#374151' }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 10, fill: '#374151' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #d1d5db', fontSize: 11 }}
                      />
                      <Line type="monotone" dataKey="normal" stroke={SCENARIO_COLORS.normal} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="highPerf" stroke={SCENARIO_COLORS.highPerf} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="highPerfPV" stroke={SCENARIO_COLORS.highPerfPV} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="highPerfPVBatt" stroke={SCENARIO_COLORS.highPerfPVBatt} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {activeTab === 'annual' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calculations} margin={{ top: 5, right: 5, left: 5, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 10, fill: '#374151' }}
                        ticks={[5, 10, 15, 20, 25, 30]}
                        label={{ value: '年', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#374151' }}
                      />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 10, fill: '#374151' }}
                      />
                      <Tooltip
                        formatter={(value: number) => `¥${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label}年目`}
                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid #d1d5db', fontSize: 11 }}
                      />
                      <Bar dataKey="annualDiffHighPerf" fill={SCENARIO_COLORS.highPerf} />
                      <Bar dataKey="annualDiffHighPerfPV" fill={SCENARIO_COLORS.highPerfPV} />
                      <Bar dataKey="annualDiffHighPerfPVBatt" fill={SCENARIO_COLORS.highPerfPVBatt} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Legend */}
              <div className="mt-2 flex justify-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: SCENARIO_COLORS.normal }} />
                  <span className="text-gray-700">通常</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerf }} />
                  <span className="text-gray-700">高性能</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPV }} />
                  <span className="text-gray-700">高性能+PV</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded" style={{ backgroundColor: SCENARIO_COLORS.highPerfPVBatt }} />
                  <span className="text-gray-700">高性能+PV+蓄電池</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendation Analysis */}
        <div className="row-span-1 bg-white">
          <Card className="h-full border-gray-200">
            <CardContent className="p-3 h-full overflow-y-auto">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">診断結果と根拠</h3>

              {/* Recommendation Score */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-gray-900 text-sm">AI診断スコア</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">②高性能住宅</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-green-500 rounded"
                          style={{ width: `${(recommendationScores.highPerf / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{recommendationScores.highPerf}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">③高性能＋太陽光</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{ width: `${(recommendationScores.highPerfPV / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{recommendationScores.highPerfPV}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-700">④高性能＋太陽光＋蓄電池</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-purple-500 rounded"
                          style={{ width: `${(recommendationScores.highPerfPVBatt / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{recommendationScores.highPerfPVBatt}/10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 text-xs mb-2">おすすめの理由</h4>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">
                        {inflationRate >= 2 ? '電気料金の上昇リスクに対する備え' : '安定した電気料金での計算'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">
                        {lifestyle === 'ev' ? 'EV充電による電力需要増に対応' :
                         lifestyle === 'normal' ? '在宅時間での自家消費を最大化' :
                         '日中の売電収入を活用'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">
                        投資回収年数: {recommendedScenario === 4 ? `${pvBattPayback || 30}年` : `${pvPayback || 30}年`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-900 text-xs mb-2">重要指標</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">10年目節約額</span>
                      <div className="font-bold text-gray-900">¥{year10.savings.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">20年目節約額</span>
                      <div className="font-bold text-gray-900">¥{year20.savings.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">初年度メリット</span>
                      <div className="font-bold text-gray-900">¥{currentYearBenefit.toLocaleString()}/年</div>
                    </div>
                    <div>
                      <span className="text-gray-600">月平均節約</span>
                      <div className="font-bold text-gray-900">¥{year30.monthlySavings.toLocaleString()}/月</div>
                    </div>
                  </div>
                </div>

                {/* Simulation Conditions */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-900 text-xs mb-2">シミュレーション条件</h4>
                  <div className="space-y-1 text-xs text-gray-700">
                    <div>太陽光: {capacityKw.toFixed(1)}kW ({panelCount}枚×{panelWatt}W)</div>
                    <div>地域: {region === 'osaka' ? '大阪' : region === 'tokyo' ? '東京' : region === 'nagoya' ? '名古屋' : '札幌'}</div>
                    <div>売電: 1-4年{sellPrice1_4}円→5-10年{sellPrice5_10}円→11年〜{sellPriceAfter11}円</div>
                    <div>インフレ率: {inflationRate}%/年</div>
                    <div>パワコン交換: {pcCycle}年ごと</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <div className="col-span-3 bg-white">
          <Card className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900 text-sm">期間別サマリー</h3>
                <span className="text-xs text-green-600 font-semibold">
                  最もお得: {bestScenario}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-1 px-2 text-gray-700 font-semibold">期間</th>
                      <th className="text-right py-1 px-2 text-gray-700 font-semibold">①通常</th>
                      <th className="text-right py-1 px-2 text-gray-700 font-semibold">②高性能</th>
                      <th className="text-right py-1 px-2 text-gray-700 font-semibold">③高性能+PV</th>
                      <th className="text-right py-1 px-2 text-gray-700 font-semibold">④高性能+PV+蓄電池</th>
                      <th className="text-right py-1 px-2 text-blue-600 font-bold">最大節約額</th>
                      <th className="text-right py-1 px-2 text-blue-600 font-bold">月換算</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 5, 10, 15, 20, 25, 30].map(year => {
                      const data = calculations[year - 1];
                      const minCost = Math.min(data.highPerf, data.highPerfPV, data.highPerfPVBatt);
                      const savings = data.normal - minCost;
                      const monthlySavings = savings / (year * 12);

                      return (
                        <tr key={year} className="border-b border-gray-100">
                          <td className="py-1 px-2 font-medium text-gray-900">{year}年目</td>
                          <td className="text-right py-1 px-2 tabular-nums text-gray-700">
                            ¥{data.normal.toLocaleString()}
                          </td>
                          <td className="text-right py-1 px-2 tabular-nums text-gray-700">
                            ¥{data.highPerf.toLocaleString()}
                          </td>
                          <td className="text-right py-1 px-2 tabular-nums text-gray-700">
                            ¥{data.highPerfPV.toLocaleString()}
                          </td>
                          <td className="text-right py-1 px-2 tabular-nums text-gray-700">
                            ¥{data.highPerfPVBatt.toLocaleString()}
                          </td>
                          <td className="text-right py-1 px-2 tabular-nums font-semibold text-blue-600">
                            ¥{savings.toLocaleString()}
                          </td>
                          <td className="text-right py-1 px-2 tabular-nums text-blue-600">
                            ¥{Math.round(monthlySavings).toLocaleString()}
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