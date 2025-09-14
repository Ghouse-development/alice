'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Sun, Home, Calculator, Settings, Zap, DollarSign, Battery, BarChart3 } from 'lucide-react';

const Presentation5RunningCost: React.FC = () => {
  const [solarCapacity, setSolarCapacity] = useState(8.3);
  const [hasBattery, setHasBattery] = useState(false);
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533);
  const [inflationRate, setInflationRate] = useState(2);
  const [showSettings, setShowSettings] = useState(false);

  // 実績データに基づく売電・買電計算
  const calculateMonthlyBalance = useMemo(() => {
    const capacityFactor = solarCapacity / 8.3;
    const baseBuyElectricity = 58435 / 8;
    const baseSellElectricity = 85548 / 8;

    const buyElectricity = baseBuyElectricity * (1 - capacityFactor * 0.3);
    const sellElectricity = baseSellElectricity * capacityFactor * (hasBattery ? 1.2 : 1);

    return {
      buy: Math.round(buyElectricity),
      sell: Math.round(sellElectricity),
      net: Math.round(sellElectricity - buyElectricity)
    };
  }, [solarCapacity, hasBattery]);

  // 30年間のシミュレーション
  const lifetimeSimulation = useMemo(() => {
    const years = 30;
    const data = [];
    const solarCost = solarCapacity * 250000;
    const batteryCost = hasBattery ? 1500000 : 0;
    const initialInvestment = solarCost + batteryCost;

    let cumulativeSavings = -initialInvestment;
    let cumulativeWithoutSolar = 0;

    for (let year = 1; year <= years; year++) {
      const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
      const yearlyElectricity = monthlyElectricity * 12 * inflationMultiplier;

      const yearlySolarBenefit = calculateMonthlyBalance.net * 12 * (year <= 20 ? 1 : 0.8);

      cumulativeSavings += yearlySolarBenefit;
      cumulativeWithoutSolar += yearlyElectricity;

      data.push({
        year,
        withoutSolar: Math.round(cumulativeWithoutSolar),
        withSolar: Math.round(Math.max(0, cumulativeWithoutSolar - cumulativeSavings - initialInvestment)),
        savings: Math.round(cumulativeSavings),
        yearlyCost: Math.round(yearlyElectricity)
      });
    }

    return { data, initialInvestment };
  }, [solarCapacity, hasBattery, monthlyElectricity, inflationRate, calculateMonthlyBalance]);

  const totalSavings = lifetimeSimulation.data[lifetimeSimulation.data.length - 1].savings;
  const paybackPeriod = lifetimeSimulation.data.findIndex(d => d.savings > 0) + 1;

  return (
    <div className="w-full h-full bg-black text-white overflow-hidden">
      {/* Header - CROWN Style */}
      <div className="bg-gradient-to-r from-black to-gray-900 px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">FEATURES</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-blue-500 pb-1">RUNNING COST</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">SIMULATION</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">05</span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 p-6 h-[calc(100%-4rem)]">
        {/* Left Section - Key Metrics */}
        <div className="col-span-4 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              人生の光熱費シミュレーション
            </h1>
            <p className="text-gray-400 text-sm">30年間の経済効果を完全可視化</p>
          </div>

          {/* Current Settings Display */}
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-400">
              <Sun className="h-5 w-5" />
              <span className="text-sm font-medium">太陽光発電</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">容量</span>
                <span className="text-xl font-bold">{solarCapacity}kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">蓄電池</span>
                <span className="text-xl font-bold">{hasBattery ? 'あり' : 'なし'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">インフレ率</span>
                <span className="text-xl font-bold">{inflationRate}%/年</span>
              </div>
            </div>
          </div>

          {/* Monthly Balance */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-6 border border-blue-700/50">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              月間収支予測
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">買電コスト</span>
                <span className="text-red-400 font-bold">-¥{calculateMonthlyBalance.buy.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">売電収入</span>
                <span className="text-green-400 font-bold">+¥{calculateMonthlyBalance.sell.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">実質負担</span>
                  <span className={`text-2xl font-bold ${calculateMonthlyBalance.net > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {calculateMonthlyBalance.net > 0 ? '+' : ''}¥{calculateMonthlyBalance.net.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">投資回収</span>
              </div>
              <p className="text-2xl font-bold">{paybackPeriod > 0 ? `${paybackPeriod}年` : '---'}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-gray-400">30年利益</span>
              </div>
              <p className="text-2xl font-bold text-green-400">
                ¥{(totalSavings / 10000).toFixed(0)}万
              </p>
            </div>
          </div>
        </div>

        {/* Center - Graph */}
        <div className="col-span-8 bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              30年間の光熱費累積比較
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-400">太陽光なし</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">太陽光あり</span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative h-[400px] bg-black/50 rounded-lg p-4">
            <svg className="w-full h-full" viewBox="0 0 800 350">
              {/* Grid Lines */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i}>
                  <line
                    x1="50"
                    y1={50 + i * 50}
                    x2="750"
                    y2={50 + i * 50}
                    stroke="#374151"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x="35"
                    y={55 + i * 50}
                    fill="#9CA3AF"
                    fontSize="12"
                    textAnchor="end"
                  >
                    {((5 - i) * 2000).toLocaleString()}万
                  </text>
                </g>
              ))}

              {/* X-axis labels */}
              {[0, 5, 10, 15, 20, 25, 30].map((year) => (
                <text
                  key={year}
                  x={50 + (year * 700) / 30}
                  y={320}
                  fill="#9CA3AF"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {year}年
                </text>
              ))}

              {/* Without Solar Line */}
              <polyline
                points={lifetimeSimulation.data
                  .map((d, i) => `${50 + (i * 700) / 30},${300 - (d.withoutSolar / 100000) * 250}`)
                  .join(' ')}
                fill="none"
                stroke="#EF4444"
                strokeWidth="3"
              />

              {/* With Solar Line */}
              <polyline
                points={lifetimeSimulation.data
                  .map((d, i) => `${50 + (i * 700) / 30},${300 - (d.withSolar / 100000) * 250}`)
                  .join(' ')}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />

              {/* Savings Area */}
              <polygon
                points={`50,300 ${lifetimeSimulation.data
                  .map((d, i) => `${50 + (i * 700) / 30},${300 - (d.withoutSolar / 100000) * 250}`)
                  .join(' ')} ${50 + 700},300`}
                fill="url(#savingsGradient)"
                opacity="0.2"
              />

              <defs>
                <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">初期投資</p>
              <p className="text-xl font-bold">¥{(lifetimeSimulation.initialInvestment / 10000).toFixed(0)}万</p>
            </div>
            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">30年間削減額</p>
              <p className="text-xl font-bold text-green-400">
                ¥{((lifetimeSimulation.data[29].withoutSolar - lifetimeSimulation.data[29].withSolar) / 10000).toFixed(0)}万
              </p>
            </div>
            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
              <p className="text-gray-400 text-sm mb-1">実質利回り</p>
              <p className="text-xl font-bold text-blue-400">
                {((totalSavings / lifetimeSimulation.initialInvestment) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-8 w-96 bg-gray-900 rounded-lg shadow-2xl border border-gray-800 p-6 z-50">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            シミュレーション設定
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">太陽光発電容量 (kW)</label>
              <input
                type="range"
                min="3"
                max="15"
                step="0.1"
                value={solarCapacity}
                onChange={(e) => setSolarCapacity(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3kW</span>
                <span className="font-bold text-white">{solarCapacity}kW</span>
                <span>15kW</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">蓄電池</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setHasBattery(false)}
                  className={`flex-1 py-2 rounded-lg ${!hasBattery ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                  なし
                </button>
                <button
                  onClick={() => setHasBattery(true)}
                  className={`flex-1 py-2 rounded-lg ${hasBattery ? 'bg-blue-600' : 'bg-gray-800'}`}
                >
                  あり
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">月額電気代 (円)</label>
              <input
                type="number"
                value={monthlyElectricity}
                onChange={(e) => setMonthlyElectricity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">年間インフレ率 (%)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-bold text-white">{inflationRate}%</span>
                <span>5%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Presentation5RunningCost;