'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

const Presentation5UtilityCostSimulation: React.FC = () => {
  const { theme } = useStore();

  // State for simulation parameters
  const [editMode, setEditMode] = useState(false);
  const [familySize, setFamilySize] = useState(4);
  const [lifestyle, setLifestyle] = useState('共働き');
  const [gHouseSpec, setGHouseSpec] = useState<'G2' | 'G3'>('G2');
  const [panels, setPanels] = useState(15);
  const [panelOutput, setPanelOutput] = useState(0.46);
  const [batteryCapacity, setBatteryCapacity] = useState(9.8);
  const [solarMaintCycle, setSolarMaintCycle] = useState(15);
  const [batteryMaintCycle, setBatteryMaintCycle] = useState(15);
  const [fit1Price, setFit1Price] = useState(24);
  const [fit2Price, setFit2Price] = useState(8.3);
  const [fit3Price, setFit3Price] = useState(7);
  const [inflationRate, setInflationRate] = useState(2);
  const [generationRate, setGenerationRate] = useState(1200);
  const [selfConsumptionSolar, setSelfConsumptionSolar] = useState(35);
  const [selfConsumptionBattery, setSelfConsumptionBattery] = useState(60);
  const [taxRate, setTaxRate] = useState(10);
  const [annualGeneral, setAnnualGeneral] = useState(240000);
  const [annualG2, setAnnualG2] = useState(200000);
  const [annualG3, setAnnualG3] = useState(140000); // G3 specification: ¥60,000 less than G2
  const [baseCharge, setBaseCharge] = useState(2200);
  const [maintSolar, setMaintSolar] = useState(50000);
  const [maintBattery, setMaintBattery] = useState(100000);

  // Calculate solar capacity
  const solarCapacity = panels * panelOutput;

  // Calculate costs based on current parameters
  const simulationData = useMemo(() => {
    const years = Array.from({ length: 31 }, (_, i) => i);

    // Additional costs for G3
    const g3AdditionalCost = gHouseSpec === 'G3' ? 3000000 : 0;

    // Solar generation calculation
    const annualGeneration = solarCapacity * generationRate;

    // Initial costs calculation
    const solarBase = 1000000 + 90000 * solarCapacity;
    const batteryBase = 1500000;
    const initialSolar = Math.round(solarBase * (1 + taxRate / 100)) + g3AdditionalCost;
    const initialBattery =
      Math.round((solarBase + batteryBase) * (1 + taxRate / 100)) + g3AdditionalCost;

    // Self consumption calculations
    const selfConsumedPowerSolar = annualGeneration * (selfConsumptionSolar / 100);
    const selfConsumedPowerBattery = annualGeneration * (selfConsumptionBattery / 100);
    const electricityPrice = 27;

    const solarSaving = Math.round(selfConsumedPowerSolar * electricityPrice);
    const batterySaving = Math.round(selfConsumedPowerBattery * electricityPrice);

    // Use G3 cost if G3 is selected, otherwise use G2
    const baseAnnualCost = gHouseSpec === 'G3' ? annualG3 : annualG2;
    const annualSolar = Math.max(0, baseAnnualCost - solarSaving);
    const annualBattery = Math.max(0, baseAnnualCost - batterySaving);

    // Calculate cumulative costs for each pattern
    const pattern1: number[] = [];
    const pattern2: number[] = [];
    const pattern3: number[] = [];
    const pattern4: number[] = [];

    let cumulative1 = 0;
    let cumulative2 = g3AdditionalCost;
    let cumulative3 = initialSolar;
    let cumulative4 = initialBattery;

    years.forEach((year) => {
      if (year === 0) {
        pattern1.push(0);
        pattern2.push(cumulative2);
        pattern3.push(cumulative3);
        pattern4.push(cumulative4);
      } else {
        const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
        const yearCostGeneral = annualGeneral * inflationMultiplier;
        const yearCostG2 = baseAnnualCost * inflationMultiplier;
        const yearCostSolar = annualSolar * inflationMultiplier;
        const yearCostBattery = annualBattery * inflationMultiplier;

        // Calculate sell income based on FIT periods
        let fitPrice = fit1Price;
        if (year > 4) fitPrice = fit2Price;
        if (year > 10) fitPrice = fit3Price;

        const surplusPowerSolar = annualGeneration * (1 - selfConsumptionSolar / 100);
        const surplusPowerBattery = annualGeneration * (1 - selfConsumptionBattery / 100);
        const sellIncomeSolar = surplusPowerSolar * fitPrice;
        const sellIncomeBattery = surplusPowerBattery * fitPrice;

        cumulative1 += yearCostGeneral;
        cumulative2 += yearCostG2;
        cumulative3 += yearCostSolar - sellIncomeSolar;
        cumulative4 += yearCostBattery - sellIncomeBattery;

        // Maintenance costs
        if (year === 15) {
          cumulative3 += maintSolar;
          cumulative4 += maintSolar + maintBattery;
        }

        pattern1.push(Math.round(cumulative1));
        pattern2.push(Math.round(cumulative2));
        pattern3.push(Math.round(cumulative3));
        pattern4.push(Math.round(cumulative4));
      }
    });

    return {
      years,
      pattern1,
      pattern2,
      pattern3,
      pattern4,
      initialG2: g3AdditionalCost,
      initialSolar,
      initialBattery,
      annualSolar,
      annualBattery,
      totalMaintSolar: maintSolar * 1, // Once at 15 years
      totalMaintBattery: (maintSolar + maintBattery) * 1, // Once at 15 years
    };
  }, [
    gHouseSpec,
    solarCapacity,
    generationRate,
    selfConsumptionSolar,
    selfConsumptionBattery,
    taxRate,
    annualGeneral,
    annualG2,
    annualG3,
    inflationRate,
    fit1Price,
    fit2Price,
    fit3Price,
    maintSolar,
    maintBattery,
  ]);

  // Get final year values
  const finalYear = 30;
  const finalCost1 = simulationData.pattern1[finalYear];
  const finalCost2 = simulationData.pattern2[finalYear];
  const finalCost3 = simulationData.pattern3[finalYear];
  const finalCost4 = simulationData.pattern4[finalYear];

  // Chart configuration
  const chartData: ChartData<'line'> = {
    labels: simulationData.years.map((y) => `${y}年`),
    datasets: [
      {
        label: '①一般的な家',
        data: simulationData.pattern1,
        borderColor: '#666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        tension: 0,
      },
      {
        label: `②Gハウス（${gHouseSpec}仕様）`,
        data: simulationData.pattern2,
        borderColor: '#388e3c',
        backgroundColor: 'rgba(56, 142, 60, 0.1)',
        tension: 0,
      },
      {
        label: '③Gハウス＋太陽光',
        data: simulationData.pattern3,
        borderColor: '#f57c00',
        backgroundColor: 'rgba(245, 124, 0, 0.1)',
        tension: 0,
        stepped: 'before',
      },
      {
        label: '④Gハウス＋太陽光＋蓄電池',
        data: simulationData.pattern4,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0,
        stepped: 'before',
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 8,
          font: {
            size: 13,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
          },
          callback: function (value) {
            return '¥' + (Number(value) / 10000).toFixed(0) + '万';
          },
        },
        title: {
          display: true,
          text: '累計コスト',
          font: {
            size: 13,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: true,
          text: '経過年数',
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <A3Page title="光熱費シミュレーション" subtitle="太陽光発電・蓄電池導入効果">
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Noto Sans JP', sans-serif",
          overflow: 'hidden',
        }}
      >
        {/* カードセクション */}
        <div
          style={{
            display: 'flex',
            height: '350px',
            background: 'white',
            flexShrink: 0,
          }}
        >
          {/* ①一般的な家 */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#f0f0f0',
                color: '#666',
              }}
            >
              ①一般的な家
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>年間光熱費：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{annualGeneral.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>初期費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>¥0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>メンテナンス費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>¥0</span>
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '6px',
                  textAlign: 'center',
                }}
              >
                30年累計コスト
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  textAlign: 'center',
                }}
              >
                ¥{finalCost1.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#2e7d32',
                  textAlign: 'center',
                  marginTop: '6px',
                  fontWeight: 'bold',
                }}
              >
                基準
              </div>
            </div>
          </div>

          {/* ②Gハウスの家 */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#e8f5e9',
                color: '#388e3c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              ②Gハウスの家
              <select
                value={gHouseSpec}
                onChange={(e) => setGHouseSpec(e.target.value as 'G2' | 'G3')}
                style={{
                  marginLeft: '8px',
                  padding: '2px 4px',
                  fontSize: '14px',
                  borderRadius: '3px',
                  border: '1px solid #388e3c',
                }}
              >
                <option value="G2">G2仕様</option>
                <option value="G3">G3仕様</option>
              </select>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>年間光熱費：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>¥{(gHouseSpec === 'G3' ? annualG3 : annualG2).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>初期費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.initialG2.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>メンテナンス費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>¥0</span>
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '6px',
                  textAlign: 'center',
                }}
              >
                30年累計コスト
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  textAlign: 'center',
                }}
              >
                ¥{finalCost2.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#2e7d32',
                  textAlign: 'center',
                  marginTop: '6px',
                  fontWeight: 'bold',
                }}
              >
                {finalCost2 - finalCost1 > 0 ? '+' : '-'}¥
                {Math.abs(finalCost2 - finalCost1).toLocaleString()}
              </div>
            </div>
          </div>

          {/* ③Gハウスの家＋太陽光発電 */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #e0e0e0',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#fff8e1',
                color: '#f57c00',
              }}
            >
              ③Gハウスの家＋太陽光発電
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>年間光熱費：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.annualSolar.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>初期費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.initialSolar.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>メンテナンス費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.totalMaintSolar.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>太陽光容量：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{solarCapacity.toFixed(1)}kW</span>
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '6px',
                  textAlign: 'center',
                }}
              >
                30年累計コスト
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  textAlign: 'center',
                }}
              >
                ¥{finalCost3.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#2e7d32',
                  textAlign: 'center',
                  marginTop: '6px',
                  fontWeight: 'bold',
                }}
              >
                {finalCost3 - finalCost1 > 0 ? '+' : '-'}¥
                {Math.abs(finalCost3 - finalCost1).toLocaleString()}
              </div>
            </div>
          </div>

          {/* ④Gハウスの家＋太陽光＋蓄電池 */}
          <div
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#e3f2fd',
                color: '#1976d2',
              }}
            >
              ④Gハウスの家＋太陽光＋蓄電池
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>年間光熱費：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.annualBattery.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>初期費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.initialBattery.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>メンテナンス費用：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  ¥{simulationData.totalMaintBattery.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ color: '#666' }}>太陽光＋蓄電池容量：</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  {solarCapacity.toFixed(1)}kW + {batteryCapacity}kWh
                </span>
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '6px',
                  textAlign: 'center',
                }}
              >
                30年累計コスト
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#d32f2f',
                  textAlign: 'center',
                }}
              >
                ¥{finalCost4.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#2e7d32',
                  textAlign: 'center',
                  marginTop: '6px',
                  fontWeight: 'bold',
                }}
              >
                {finalCost4 - finalCost1 > 0 ? '+' : '-'}¥
                {Math.abs(finalCost4 - finalCost1).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* グラフセクション */}
        <div
          style={{
            flex: 1,
            background: 'white',
            padding: '15px',
            display: 'flex',
            gap: '20px',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: 'calc(100% - 400px)',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', flexShrink: 0 }}>
              30年累計コスト推移
            </div>
            <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* シミュレーション条件パネル */}
          <div
            style={{
              width: '380px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '20px',
              fontSize: '16px',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
              flexShrink: 0,
              gap: '15px',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                paddingBottom: '6px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                シミュレーション条件
              </span>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: editMode ? '#333' : '#999',
                  cursor: 'pointer',
                  fontSize: '15px',
                  filter: editMode ? 'none' : 'grayscale(100%)',
                }}
                title="詳細設定"
              >
                ✏️
              </button>
            </div>

            {/* 再エネ設備サマリー */}
            <div style={{ marginBottom: '15px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '3px',
                  background: '#f0f0f0',
                  padding: '2px 4px',
                  borderRadius: '2px',
                }}
              >
                再エネ設備
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#333',
                  padding: '1px 2px',
                  marginBottom: '2px',
                }}
              >
                <span style={{ color: '#555' }}>太陽光パネル：</span>
                <span style={{ color: '#333', fontWeight: 600 }}>
                  {solarCapacity.toFixed(1)}kW（{panels}枚）
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#333',
                  padding: '1px 2px',
                }}
              >
                <span style={{ color: '#555' }}>蓄電池：</span>
                <span style={{ color: '#333', fontWeight: 600 }}>{batteryCapacity}kWh</span>
              </div>
            </div>

            {/* 家族構成 */}
            <div style={{ marginBottom: '15px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '3px',
                  background: '#f0f0f0',
                  padding: '2px 4px',
                  borderRadius: '2px',
                }}
              >
                家族構成
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>家族人数：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {familySize}人
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>生活スタイル：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {lifestyle}
                </span>
              </div>
            </div>

            {/* 設備仕様 */}
            <div style={{ marginBottom: '18px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '3px',
                  background: '#f0f0f0',
                  padding: '2px 4px',
                  borderRadius: '2px',
                }}
              >
                設備仕様
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>太陽光パネル枚数：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>{panels}枚</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>パネル出力（1枚）：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {panelOutput}kW
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>蓄電池容量：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {batteryCapacity}kWh
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>太陽光メンテ周期：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {solarMaintCycle}年
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>蓄電池メンテ周期：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  {batteryMaintCycle}年
                </span>
              </div>
            </div>

            {/* 売電価格 */}
            <div style={{ marginBottom: '10px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '3px',
                  background: '#f0f0f0',
                  padding: '2px 4px',
                  borderRadius: '2px',
                }}
              >
                売電価格
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>売電価格（1-4年）：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  ¥{fit1Price}/kWh
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>売電価格（5-10年）：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  ¥{fit2Price}/kWh
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1.2,
                }}
              >
                <span style={{ color: '#555', fontSize: '12px' }}>売電価格（11年〜）：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '12px' }}>
                  ¥{fit3Price}/kWh
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1px 2px',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: '#555', fontSize: '11px' }}>光熱費上昇率：</span>
                <span style={{ color: '#333', fontWeight: 600, fontSize: '11px' }}>
                  {inflationRate}%/年
                </span>
              </div>
            </div>

            {/* 詳細設定（編集モード時のみ） */}
            {editMode && (
              <div style={{ marginBottom: '8px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#333',
                    marginBottom: '4px',
                    background: '#f0f0f0',
                    padding: '3px 5px',
                    borderRadius: '3px',
                  }}
                >
                  詳細設定
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>年間発電量/kW：</span>
                  <input
                    type="number"
                    value={generationRate}
                    onChange={(e) => setGenerationRate(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>自家消費率（太陽光）：</span>
                  <input
                    type="number"
                    value={selfConsumptionSolar}
                    onChange={(e) => setSelfConsumptionSolar(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>自家消費率（蓄電池）：</span>
                  <input
                    type="number"
                    value={selfConsumptionBattery}
                    onChange={(e) => setSelfConsumptionBattery(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>消費税率：</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>①年間光熱費：</span>
                  <input
                    type="number"
                    value={annualGeneral}
                    onChange={(e) => setAnnualGeneral(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>②年間光熱費：</span>
                  <input
                    type="number"
                    value={annualG2}
                    onChange={(e) => setAnnualG2(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>基本料金：</span>
                  <input
                    type="number"
                    value={baseCharge}
                    onChange={(e) => setBaseCharge(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>メンテ（太陽光）：</span>
                  <input
                    type="number"
                    value={maintSolar}
                    onChange={(e) => setMaintSolar(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 3px',
                    lineHeight: 1.3,
                  }}
                >
                  <span style={{ color: '#555', fontSize: '9px' }}>メンテ（蓄電池）：</span>
                  <input
                    type="number"
                    value={maintBattery}
                    onChange={(e) => setMaintBattery(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '13px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </A3Page>
  );
};

export default Presentation5UtilityCostSimulation;
