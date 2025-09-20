'use client';

import React, { useState, useMemo } from 'react';
import { SlideHeader } from '../common/SlideHeader';

export default function EnergyCostSimulation() {
  const [familySize, setFamilySize] = useState(4);
  const [isDualIncome, setIsDualIncome] = useState(false);
  const [panelCount, setPanelCount] = useState(20);
  const [pvDegradation, setPvDegradation] = useState(0.5);
  const [batteryDegradation, setBatteryDegradation] = useState(1.0);
  const [maintenanceSchedule] = useState([
    { year: 10, amount: 300000 },
    { year: 20, amount: 500000 }
  ]);

  const baseConsumption = useMemo(() => {
    const base = [0, 2000, 3000, 4000, 4500, 5000][familySize] || 4000;
    return isDualIncome ? base * 0.9 : base;
  }, [familySize, isDualIncome]);

  const panelCapacity = panelCount * 0.46;
  const annualGeneration = panelCapacity * 1200;
  const inflation = 0.02;

  const calculateCosts = (hasPV: boolean, hasBattery: boolean, isGHouse: boolean) => {
    let totalCost = 0;
    const yearlyData = [];

    const initialCost = (hasPV ? 1200000 : 0) + (hasBattery ? 1650000 : 0);
    totalCost = initialCost;

    for (let year = 1; year <= 30; year++) {
      let annualCost = baseConsumption * 30 * Math.pow(1 + inflation, year - 1);

      if (isGHouse) {
        annualCost *= 0.7;
      }

      if (hasPV) {
        const degradation = Math.pow(1 - pvDegradation / 100, year - 1);
        const generation = annualGeneration * degradation;
        const selfConsumption = generation * 0.35;
        const exportAmount = generation * 0.65;
        const sellPrice = year <= 10 ? 16 : 8;
        annualCost -= selfConsumption * 30 + exportAmount * sellPrice;
      }

      const maintenance = maintenanceSchedule.find(m => m.year === year);
      if (maintenance && (hasPV || hasBattery)) {
        annualCost += maintenance.amount;
      }

      totalCost += Math.max(0, annualCost);

      if ([1,2,3,4,5,6,7,8,9,10,15,20,25,30].includes(year)) {
        yearlyData.push({
          year,
          cost: Math.round(annualCost),
          cumulative: Math.round(totalCost)
        });
      }
    }

    return {
      initial: initialCost,
      annual: Math.round(baseConsumption * 30),
      total30: Math.round(totalCost),
      yearlyData
    };
  };

  const normal = calculateCosts(false, false, false);
  const ghouse = calculateCosts(false, false, true);
  const ghousePV = calculateCosts(true, false, true);
  const ghousePVBattery = calculateCosts(true, true, true);

  const minCost = Math.min(normal.total30, ghouse.total30, ghousePV.total30, ghousePVBattery.total30);
  let bestOption = '一般的な家';
  if (minCost === ghouse.total30) bestOption = 'Gハウスの家';
  if (minCost === ghousePV.total30) bestOption = 'Gハウスの家＋太陽光';
  if (minCost === ghousePVBattery.total30) bestOption = 'Gハウスの家＋太陽光＋蓄電池';

  return (
    <div
      style={{
        width: '1587px',
        height: '1123px',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'grid',
        gridTemplateRows: '80px 1fr',
        backgroundColor: 'white'
      }}
    >
      <div className="px-4">
        <SlideHeader title="光熱費シミュレーション" />
      </div>
      <div className="px-4 pb-4" style={{ height: 'calc(100% - 80px)' }}>
        {/* 4 Cards */}
        <div className="grid grid-cols-4 gap-3 mb-3" style={{ height: '25%' }}>
          {/* Normal House */}
          <div className="border rounded-lg p-2">
            <h3 className="text-sm font-semibold whitespace-nowrap truncate">一般的な家</h3>
            <div className="text-xs mt-1">年間光熱費: ¥{normal.annual.toLocaleString()}</div>
            <div className="text-lg font-bold tabular-nums">30年間累計総コスト</div>
            <div className="text-xl font-bold tabular-nums">¥{normal.total30.toLocaleString()}</div>
          </div>

          {/* G-House */}
          <div className="border rounded-lg p-2">
            <h3 className="text-sm font-semibold whitespace-nowrap truncate">Gハウスの家（G2仕様）</h3>
            <div className="text-xs mt-1">年間光熱費: ¥{ghouse.annual.toLocaleString()}</div>
            <div className="text-lg font-bold tabular-nums">30年間累計総コスト</div>
            <div className="text-xl font-bold tabular-nums">¥{ghouse.total30.toLocaleString()}</div>
          </div>

          {/* G-House + PV */}
          <div className="border rounded-lg p-2">
            <h3 className="text-sm font-semibold whitespace-nowrap truncate">Gハウスの家＋太陽光発電</h3>
            <div className="text-xs mt-1">年間光熱費: ¥{ghousePV.annual.toLocaleString()}</div>
            <div className="text-lg font-bold tabular-nums">30年間累計総コスト</div>
            <div className="text-xl font-bold tabular-nums">¥{ghousePV.total30.toLocaleString()}</div>
            <div className="text-xs">初期: PV ¥1,200,000</div>
          </div>

          {/* G-House + PV + Battery */}
          <div className="border rounded-lg p-2">
            <h3 className="text-sm font-semibold whitespace-nowrap truncate">Gハウスの家＋太陽光＋蓄電池</h3>
            <div className="text-xs mt-1">年間光熱費: ¥{ghousePVBattery.annual.toLocaleString()}</div>
            <div className="text-lg font-bold tabular-nums">30年間累計総コスト</div>
            <div className="text-xl font-bold tabular-nums">¥{ghousePVBattery.total30.toLocaleString()}</div>
            <div className="text-xs">初期: PV+蓄電 ¥2,850,000</div>
          </div>
        </div>

        {/* Graph */}
        <div className="border rounded-lg p-2 mb-3" style={{ height: '30%' }}>
          <h3 className="text-sm font-semibold mb-2">30年間累計総コスト推移</h3>
          <div className="relative h-full">
            <svg viewBox="0 0 800 300" className="w-full h-full">
              <text x="10" y="20" fontSize="12">30年間累計総コスト（円）</text>
              <line x1="50" y1="250" x2="750" y2="250" stroke="black" />
              <line x1="50" y1="250" x2="50" y2="30" stroke="black" />

              {[0, 10, 20, 30].map((year, i) => (
                <text key={i} x={50 + i * 233} y="265" fontSize="10" textAnchor="middle">
                  {year}年
                </text>
              ))}

              {[0, 2000, 4000, 6000].map((cost, i) => (
                <text key={i} x="5" y={250 - i * 55} fontSize="10">
                  {cost}万
                </text>
              ))}

              <polyline
                points={normal.yearlyData.slice(0, 10).map((d) =>
                  `${50 + (d.year / 30) * 700},${250 - (d.cumulative / 60000000) * 220}`
                ).join(' ')}
                fill="none"
                stroke="red"
                strokeWidth="2"
              />

              <polyline
                points={ghouse.yearlyData.slice(0, 10).map((d) =>
                  `${50 + (d.year / 30) * 700},${250 - (d.cumulative / 60000000) * 220}`
                ).join(' ')}
                fill="none"
                stroke="blue"
                strokeWidth="2"
              />

              <polyline
                points={ghousePV.yearlyData.slice(0, 10).map((d) =>
                  `${50 + (d.year / 30) * 700},${250 - (d.cumulative / 60000000) * 220}`
                ).join(' ')}
                fill="none"
                stroke="green"
                strokeWidth="2"
              />

              <polyline
                points={ghousePVBattery.yearlyData.slice(0, 10).map((d) =>
                  `${50 + (d.year / 30) * 700},${250 - (d.cumulative / 60000000) * 220}`
                ).join(' ')}
                fill="none"
                stroke="purple"
                strokeWidth="2"
              />

              <g fontSize="10">
                <rect x="600" y="40" width="10" height="10" fill="red" />
                <text x="615" y="49">一般</text>
                <rect x="600" y="55" width="10" height="10" fill="blue" />
                <text x="615" y="64">Gハウス</text>
                <rect x="600" y="70" width="10" height="10" fill="green" />
                <text x="615" y="79">G+太陽光</text>
                <rect x="600" y="85" width="10" height="10" fill="purple" />
                <text x="615" y="94">G+太陽光+蓄電</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Table and Assumptions */}
        <div className="grid grid-cols-3 gap-3" style={{ height: '35%' }}>
          {/* Yearly Table */}
          <div className="col-span-2 border rounded-lg p-2 overflow-hidden">
            <h3 className="text-xs font-semibold mb-1">年次表</h3>
            <table className="w-full table-fixed text-[10px]">
              <thead>
                <tr className="border-b">
                  <th className="px-1 py-0.5 text-left">年</th>
                  <th className="px-1 py-0.5 text-right tabular-nums">一般</th>
                  <th className="px-1 py-0.5 text-right tabular-nums">Gハウス</th>
                  <th className="px-1 py-0.5 text-right tabular-nums">G+PV</th>
                  <th className="px-1 py-0.5 text-right tabular-nums">G+PV+蓄電</th>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6,7,8,9,10,15,20,25,30].map(year => {
                  const normalRow = normal.yearlyData.find(d => d.year === year);
                  const ghouseRow = ghouse.yearlyData.find(d => d.year === year);
                  const ghousePVRow = ghousePV.yearlyData.find(d => d.year === year);
                  const ghousePVBatteryRow = ghousePVBattery.yearlyData.find(d => d.year === year);

                  return (
                    <tr key={year} className="leading-tight">
                      <td className="px-1 py-0.5">{year}</td>
                      <td className="px-1 py-0.5 text-right tabular-nums">
                        {normalRow ? Math.round(normalRow.cumulative / 10000) : 0}万
                      </td>
                      <td className="px-1 py-0.5 text-right tabular-nums">
                        {ghouseRow ? Math.round(ghouseRow.cumulative / 10000) : 0}万
                      </td>
                      <td className="px-1 py-0.5 text-right tabular-nums">
                        {ghousePVRow ? Math.round(ghousePVRow.cumulative / 10000) : 0}万
                      </td>
                      <td className="px-1 py-0.5 text-right tabular-nums">
                        {ghousePVBatteryRow ? Math.round(ghousePVBatteryRow.cumulative / 10000) : 0}万
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Assumptions Panel */}
          <div className="border rounded-lg p-2 overflow-hidden">
            <h3 className="text-xs font-semibold mb-1">前提条件</h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
              <label className="flex items-center gap-1">
                <span>家族人数:</span>
                <select value={familySize} onChange={e => setFamilySize(Number(e.target.value))}
                  className="h-5 text-[10px] border rounded px-1">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}人</option>)}
                </select>
              </label>

              <label className="flex items-center gap-1">
                <input type="checkbox" checked={isDualIncome}
                  onChange={e => setIsDualIncome(e.target.checked)}
                  className="h-3 w-3" />
                <span>共働き</span>
              </label>

              <label className="flex items-center gap-1">
                <span>パネル:</span>
                <input type="number" value={panelCount}
                  onChange={e => setPanelCount(Number(e.target.value))}
                  className="w-12 h-5 text-[10px] border rounded px-1 tabular-nums" />
                <span>枚</span>
              </label>

              <div>{panelCapacity.toFixed(1)}kW</div>

              <label className="flex items-center gap-1">
                <span>PV劣化:</span>
                <input type="number" value={pvDegradation} step="0.1"
                  onChange={e => setPvDegradation(Number(e.target.value))}
                  className="w-12 h-5 text-[10px] border rounded px-1 tabular-nums" />
                <span>%/年</span>
              </label>

              <label className="flex items-center gap-1">
                <span>蓄電劣化:</span>
                <input type="number" value={batteryDegradation} step="0.1"
                  onChange={e => setBatteryDegradation(Number(e.target.value))}
                  className="w-12 h-5 text-[10px] border rounded px-1 tabular-nums" />
                <span>%/年</span>
              </label>
            </div>

            <div className="mt-1 pt-1 border-t text-[10px]">
              <div>基準消費: {baseConsumption}kWh/年</div>
              <div>発電量: 1kW=1200kWh/年</div>
              <div>インフレ: 2%/年</div>
            </div>

            <div className="mt-1 pt-1 border-t text-[10px]">
              <div className="font-semibold">メンテナンス:</div>
              {maintenanceSchedule.map((m, i) => (
                <div key={i}>
                  {m.year}年目: ¥{m.amount.toLocaleString()}
                  → 月々約¥{Math.round(m.amount/12).toLocaleString()}（{m.year}年目）
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conclusion Bar */}
        <div className="bg-green-100 border-2 border-green-500 rounded-lg p-2 mt-3">
          <div className="text-center font-bold">
            最もお得：{bestOption}（30年総コスト最小：¥{minCost.toLocaleString()} ／ 月平均：¥{Math.round(minCost / 360).toLocaleString()}）
          </div>
        </div>
      </div>
    </div>
  );
}