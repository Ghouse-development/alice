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
  const [gHouseSpec, setGHouseSpec] = useState<'G2' | 'G3'>('G2');
  const [solarCapacity, setSolarCapacity] = useState(8.3);
  const [hasBattery, setHasBattery] = useState(true);
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533);
  const [monthlyGas, setMonthlyGas] = useState(8500);
  const [inflationRate, setInflationRate] = useState(2);
  const [electricityUnitPrice, setElectricityUnitPrice] = useState(35);
  const [gasUnitPrice, setGasUnitPrice] = useState(120);
  const [fitPrice, setFitPrice] = useState(16);
  const [postFitPrice, setPostFitPrice] = useState(7);

  // Calculate 30-year simulation data
  const simulationData = useMemo(() => {
    const years = Array.from({ length: 31 }, (_, i) => i);

    // Initial costs (建築時の追加費用)
    const solarCost = solarCapacity * 250000; // 太陽光発電システム
    const batteryCost = hasBattery ? 1500000 : 0; // 蓄電池システム
    const g2AdditionalCost = 500000; // G2仕様の追加費用
    const g3AdditionalCost = 800000; // G3仕様の追加費用

    // Monthly utility costs
    const baseMonthlyUtility = monthlyElectricity + monthlyGas;
    const gHouseMonthlyUtility =
      gHouseSpec === 'G3' ? baseMonthlyUtility * 0.5 : baseMonthlyUtility * 0.65;

    // Solar generation calculation
    const yearlySolarGeneration = solarCapacity * 1000 * 1.2; // 年間発電量 kWh
    const selfConsumptionRate = hasBattery ? 0.6 : 0.3; // 自家消費率
    const yearlySelfConsumption = yearlySolarGeneration * selfConsumptionRate;
    const yearlySoldElectricity = yearlySolarGeneration * (1 - selfConsumptionRate);

    // Calculate cumulative costs for each pattern
    const pattern1: number[] = []; // 一般的な家
    const pattern2: number[] = []; // Gハウスの家
    const pattern3: number[] = []; // Gハウスの家＋太陽光発電
    const pattern4: number[] = []; // Gハウスの家＋太陽光＋蓄電池

    let cumulative1 = 0;
    let cumulative2 = gHouseSpec === 'G3' ? g3AdditionalCost : g2AdditionalCost;
    let cumulative3 = cumulative2 + solarCost;
    let cumulative4 = cumulative2 + solarCost + batteryCost;

    years.forEach((year) => {
      if (year === 0) {
        pattern1.push(0);
        pattern2.push(cumulative2 / 10000);
        pattern3.push(cumulative3 / 10000);
        pattern4.push(cumulative4 / 10000);
      } else {
        const inflationMultiplier = Math.pow(1 + inflationRate / 100, year - 1);
        const yearlyUtility1 = baseMonthlyUtility * 12 * inflationMultiplier;
        const yearlyUtility2 = gHouseMonthlyUtility * 12 * inflationMultiplier;

        // 売電収入の計算（FIT期間とその後）
        let yearlySellIncome = 0;
        if (year <= 10) {
          // FIT期間（10年間）
          yearlySellIncome = yearlySoldElectricity * fitPrice;
        } else {
          // FIT期間終了後
          yearlySellIncome = yearlySoldElectricity * postFitPrice;
        }

        // 自家消費による削減額
        const yearlySelfConsumptionSavings =
          yearlySelfConsumption * electricityUnitPrice * inflationMultiplier;

        // メンテナンス費用の追加
        if (year === 10) {
          cumulative3 += 200000; // パワコン点検・メンテナンス
          cumulative4 += 200000;
        }
        if (year === 15 && hasBattery) {
          cumulative4 += 800000; // 蓄電池交換
        }
        if (year === 20) {
          cumulative3 += 300000; // パワコン交換
          cumulative4 += 300000;
        }

        // 累計コストの計算
        cumulative1 += yearlyUtility1;
        cumulative2 += yearlyUtility2;
        cumulative3 += Math.max(
          0,
          yearlyUtility2 - yearlySelfConsumptionSavings - yearlySellIncome
        );
        cumulative4 += Math.max(
          0,
          yearlyUtility2 - yearlySelfConsumptionSavings * 1.5 - yearlySellIncome
        );

        pattern1.push(Math.round(cumulative1 / 10000));
        pattern2.push(Math.round(cumulative2 / 10000));
        pattern3.push(Math.round(cumulative3 / 10000));
        pattern4.push(Math.round(cumulative4 / 10000));
      }
    });

    return {
      years,
      pattern1,
      pattern2,
      pattern3,
      pattern4,
    };
  }, [
    familySize,
    gHouseSpec,
    solarCapacity,
    hasBattery,
    monthlyElectricity,
    monthlyGas,
    inflationRate,
    electricityUnitPrice,
    gasUnitPrice,
    fitPrice,
    postFitPrice,
  ]);

  // Chart configuration
  const chartData: ChartData<'line'> = {
    labels: simulationData.years,
    datasets: [
      {
        label: '①一般的な家',
        data: simulationData.pattern1,
        borderColor: '#666',
        backgroundColor: 'rgba(102, 102, 102, 0.1)',
        borderWidth: 2,
      },
      {
        label: `②Gハウスの家（${gHouseSpec}仕様）`,
        data: simulationData.pattern2,
        borderColor: '#388e3c',
        backgroundColor: 'rgba(56, 142, 60, 0.1)',
        borderWidth: 2,
      },
      {
        label: '③Gハウス＋太陽光',
        data: simulationData.pattern3,
        borderColor: '#f57c00',
        backgroundColor: 'rgba(245, 124, 0, 0.1)',
        borderWidth: 2,
      },
      {
        label: '④Gハウス＋太陽光＋蓄電池',
        data: simulationData.pattern4,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
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
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}万円`;
          },
        },
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 1000,
            yMax: 1000,
            borderColor: 'rgba(255, 0, 0, 0.5)',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: '1000万円ライン',
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: 'red',
              font: {
                weight: 'bold',
                size: 11,
              },
            },
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '経過年数',
          font: {
            size: 12,
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: '累計コスト（万円）',
          font: {
            size: 12,
          },
        },
        min: 0,
        max: 2500,
        ticks: {
          stepSize: 500,
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        grid: {
          display: true,
          color: function (context) {
            if (context.tick.value === 1000) {
              return 'rgba(255, 0, 0, 0.2)';
            }
            return 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: function (context) {
            if (context.tick.value === 1000) {
              return 2;
            }
            return 1;
          },
        },
      },
    },
  };

  // Calculate final values for display
  const finalYear = 30;
  const finalCost1 = simulationData.pattern1[finalYear];
  const finalCost2 = simulationData.pattern2[finalYear];
  const finalCost3 = simulationData.pattern3[finalYear];
  const finalCost4 = simulationData.pattern4[finalYear];

  return (
    <A3Page title="光熱費シミュレーション" subtitle="30年間の累計コスト比較分析">
      <div
        className="main-container"
        style={{
          width: '1190px',
          height: '762px',
          display: 'flex',
          flexDirection: 'column',
          background: '#f5f5f5',
          fontFamily: "'Noto Sans JP', sans-serif",
        }}
      >
        {/* 4つの比較カード */}
        <div
          className="cards-section"
          style={{
            display: 'flex',
            height: '280px',
            background: 'white',
          }}
        >
          {/* カード1：一般的な家 */}
          <div
            className="cost-card"
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRight: '1px solid #e0e0e0',
              height: '280px',
            }}
          >
            <div
              className="card-header card-general"
              style={{
                fontSize: '14px',
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
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>断熱性能</span>
                <span style={{ fontWeight: 500, color: '#333' }}>標準</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>光熱費</span>
                <span style={{ fontWeight: 500, color: '#333' }}>標準</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>太陽光</span>
                <span style={{ fontWeight: 500, color: '#333' }}>なし</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>蓄電池</span>
                <span style={{ fontWeight: 500, color: '#333' }}>なし</span>
              </div>
            </div>
            <div className="total-cost" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', textAlign: 'center' }}>30年累計</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d32f2f', textAlign: 'center' }}>
                {finalCost1.toLocaleString()}万円
              </div>
            </div>
          </div>

          {/* カード2：Gハウスの家 */}
          <div
            className="cost-card"
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRight: '1px solid #e0e0e0',
              height: '280px',
            }}
          >
            <div
              className="card-header card-g2"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#e8f5e9',
                color: '#388e3c',
              }}
            >
              ②Gハウスの家
            </div>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>断熱性能</span>
                <span style={{ fontWeight: 500, color: '#333' }}>
                  {editMode ? (
                    <select
                      value={gHouseSpec}
                      onChange={(e) => setGHouseSpec(e.target.value as 'G2' | 'G3')}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        padding: '1px 3px',
                        fontSize: '13px',
                      }}
                    >
                      <option value="G2">G2仕様</option>
                      <option value="G3">G3仕様</option>
                    </select>
                  ) : (
                    `${gHouseSpec}仕様`
                  )}
                </span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>光熱費</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{gHouseSpec === 'G3' ? '50%削減' : '35%削減'}</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>太陽光</span>
                <span style={{ fontWeight: 500, color: '#333' }}>なし</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>蓄電池</span>
                <span style={{ fontWeight: 500, color: '#333' }}>なし</span>
              </div>
            </div>
            <div className="total-cost" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', textAlign: 'center' }}>30年累計</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d32f2f', textAlign: 'center' }}>
                {finalCost2.toLocaleString()}万円
              </div>
              <div style={{ fontSize: '14px', color: '#2e7d32', textAlign: 'center', marginTop: '6px', fontWeight: 'bold' }}>
                ▼{(finalCost1 - finalCost2).toLocaleString()}万円
              </div>
            </div>
          </div>

          {/* カード3：Gハウスの家＋太陽光発電 */}
          <div
            className="cost-card"
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              borderRight: '1px solid #e0e0e0',
              height: '280px',
            }}
          >
            <div
              className="card-header card-solar"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#fff8e1',
                color: '#f57c00',
              }}
            >
              ③Gハウス＋太陽光
            </div>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>断熱性能</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{gHouseSpec}仕様</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>太陽光</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{solarCapacity}kW</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>売電収入</span>
                <span style={{ fontWeight: 500, color: '#333' }}>あり</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>蓄電池</span>
                <span style={{ fontWeight: 500, color: '#333' }}>なし</span>
              </div>
            </div>
            <div className="total-cost" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', textAlign: 'center' }}>30年累計</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d32f2f', textAlign: 'center' }}>
                {finalCost3.toLocaleString()}万円
              </div>
              <div style={{ fontSize: '14px', color: '#2e7d32', textAlign: 'center', marginTop: '6px', fontWeight: 'bold' }}>
                ▼{(finalCost1 - finalCost3).toLocaleString()}万円
              </div>
            </div>
          </div>

          {/* カード4：Gハウスの家＋太陽光＋蓄電池 */}
          <div
            className="cost-card"
            style={{
              flex: 1,
              padding: '15px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              height: '280px',
            }}
          >
            <div
              className="card-header card-battery"
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '15px',
                textAlign: 'center',
                background: '#e3f2fd',
                color: '#1976d2',
              }}
            >
              ④Gハウス＋太陽光＋蓄電池
            </div>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>断熱性能</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{gHouseSpec}仕様</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>太陽光</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{solarCapacity}kW</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>蓄電池</span>
                <span style={{ fontWeight: 500, color: '#333' }}>{hasBattery ? '9.8kWh' : 'なし'}</span>
              </div>
              <div className="cost-item" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>自家消費</span>
                <span style={{ fontWeight: 500, color: '#333' }}>最大化</span>
              </div>
            </div>
            <div className="total-cost" style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px', textAlign: 'center' }}>30年累計</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#d32f2f', textAlign: 'center' }}>
                {finalCost4.toLocaleString()}万円
              </div>
              <div style={{ fontSize: '14px', color: '#2e7d32', textAlign: 'center', marginTop: '6px', fontWeight: 'bold' }}>
                ▼{(finalCost1 - finalCost4).toLocaleString()}万円
              </div>
            </div>
          </div>
        </div>

        {/* グラフセクション */}
        <div
          className="chart-section"
          style={{
            flex: 1,
            background: 'white',
            padding: '15px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
            30年間累計コスト推移
          </div>
          <div
            className="chart-container"
            style={{
              flex: 1,
              width: 'calc(100% - 360px)',
              position: 'relative',
              marginRight: '360px',
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* シミュレーション条件パネル */}
          <div
            className={`conditions-panel ${editMode ? 'edit-mode' : ''}`}
            style={{
              position: 'absolute',
              top: '55px',
              right: '15px',
              bottom: '15px',
              width: '340px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #ddd',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '10px',
              maxHeight: 'calc(100% - 70px)',
              overflowY: 'auto',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
              paddingBottom: '6px',
              borderBottom: '1px solid #ddd',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>シミュレーション条件</div>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: editMode ? '#333' : '#999',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                {editMode ? '✏️' : '✏️'}
              </button>
            </div>

            {/* サマリー */}
            <div style={{
              background: '#fff8e1',
              padding: '6px',
              borderRadius: '4px',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                <span>家族構成</span>
                <span>{familySize}人</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                <span>月間光熱費</span>
                <span>¥{(monthlyElectricity + monthlyGas).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
                <span>インフレ率</span>
                <span>{inflationRate}%/年</span>
              </div>
            </div>

            {/* 基本設定 */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '4px',
                background: '#f0f0f0',
                padding: '3px 5px',
                borderRadius: '3px',
              }}>
                基本設定
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                <span style={{ color: '#555', fontSize: '9px' }}>家族構成</span>
                {editMode ? (
                  <select
                    value={familySize}
                    onChange={(e) => setFamilySize(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      height: '16px',
                    }}
                  >
                    <option value={2}>2人</option>
                    <option value={3}>3人</option>
                    <option value={4}>4人</option>
                    <option value={5}>5人</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{familySize}人</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                <span style={{ color: '#555', fontSize: '9px' }}>月間電気代</span>
                {editMode ? (
                  <input
                    type="number"
                    value={monthlyElectricity}
                    onChange={(e) => setMonthlyElectricity(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>¥{monthlyElectricity.toLocaleString()}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                <span style={{ color: '#555', fontSize: '9px' }}>月間ガス代</span>
                {editMode ? (
                  <input
                    type="number"
                    value={monthlyGas}
                    onChange={(e) => setMonthlyGas(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>¥{monthlyGas.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* 設備仕様 */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '4px',
                background: '#f0f0f0',
                padding: '3px 5px',
                borderRadius: '3px',
              }}>
                設備仕様
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                <span style={{ color: '#555', fontSize: '9px' }}>太陽光発電容量</span>
                {editMode ? (
                  <input
                    type="number"
                    value={solarCapacity}
                    onChange={(e) => setSolarCapacity(Number(e.target.value))}
                    step="0.1"
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{solarCapacity}kW</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                <span style={{ color: '#555', fontSize: '9px' }}>蓄電池システム</span>
                {editMode ? (
                  <select
                    value={hasBattery ? 'yes' : 'no'}
                    onChange={(e) => setHasBattery(e.target.value === 'yes')}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      height: '16px',
                    }}
                  >
                    <option value="no">なし</option>
                    <option value="yes">9.8kWh</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>{hasBattery ? '9.8kWh' : 'なし'}</span>
                )}
              </div>
            </div>

            {/* 電気料金設定（編集モード時のみ） */}
            {editMode && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px',
                  background: '#f0f0f0',
                  padding: '3px 5px',
                  borderRadius: '3px',
                }}>
                  電気料金設定
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                  <span style={{ color: '#555', fontSize: '9px' }}>インフレ率</span>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    step="0.1"
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                  <span style={{ color: '#555', fontSize: '9px' }}>FIT価格</span>
                  <input
                    type="number"
                    value={fitPrice}
                    onChange={(e) => setFitPrice(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 3px' }}>
                  <span style={{ color: '#555', fontSize: '9px' }}>FIT後価格</span>
                  <input
                    type="number"
                    value={postFitPrice}
                    onChange={(e) => setPostFitPrice(Number(e.target.value))}
                    style={{
                      width: '60px',
                      padding: '1px 3px',
                      border: '1px solid #ddd',
                      borderRadius: '3px',
                      fontSize: '9px',
                      textAlign: 'right',
                      height: '16px',
                    }}
                  />
                </div>
              </div>
            )}

            {/* 備考 */}
            <div style={{
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid #ddd',
              fontSize: '9px',
              color: '#999',
            }}>
              <div>※ FIT期間：10年間</div>
              <div>※ メンテナンス費用込み</div>
              <div>※ 蓄電池交換：15年目</div>
            </div>
          </div>

          {/* フッター */}
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '10px',
            color: '#999',
          }}>
            <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>G-HOUSE</span>
            <span>光熱費シミュレーション v2.0</span>
          </div>
        </div>
      </div>
    </A3Page>
  );
};

export default Presentation5UtilityCostSimulation;