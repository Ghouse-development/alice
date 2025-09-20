'use client';

import React, { useMemo } from 'react';

// Convert mm to pixels (96dpi)
const MM_TO_PX = 3.7795275591;

// Format currency
const formatJPY = (n: number) => `¥${n.toLocaleString()}`;

export default function EnergyCostSimulationEnglish() {
  // Panel specifications
  const panelSpecs = {
    wattPerPanel: 460,
    panels15: { count: 15, capacity: 6.9 },
    panels20: { count: 20, capacity: 9.2 },
    generationPerKw: 1200,
  };

  // Selling scheme prices
  const sellingScheme = [
    { period: 'Year 1-4', price: 24 },
    { period: 'Year 5-10', price: 8.3 },
    { period: 'Year 11+', price: 7 },
  ];

  // Simulation data (using 20 panels example)
  const simulationData = useMemo(() => {
    const years = 10; // Limited to 10 rows
    const data = [];
    const capacity = panelSpecs.panels20.capacity;
    const annualGeneration = capacity * panelSpecs.generationPerKw;

    for (let year = 1; year <= years; year++) {
      const degradation = Math.pow(0.995, year - 1);
      const generation = annualGeneration * degradation;
      const selfConsumption = generation * 0.35;
      const exportAmount = generation - selfConsumption;

      let sellPrice = year <= 4 ? 24 : year <= 10 ? 8.3 : 7;
      const sellIncome = exportAmount * sellPrice;
      const savings = selfConsumption * 27;
      const totalSavings = sellIncome + savings;

      data.push({
        year,
        generation: Math.round(generation),
        selfConsumption: Math.round(selfConsumption),
        export: Math.round(exportAmount),
        sellIncome: Math.round(sellIncome),
        savings: Math.round(savings),
        totalSavings: Math.round(totalSavings),
      });
    }

    return data;
  }, []);

  // Calculate totals
  const totals = useMemo(() => {
    const total30Years = simulationData.reduce((sum, row) => sum + row.totalSavings, 0) * 3;
    const monthlyAverage = Math.round(total30Years / 30 / 12);
    const firstYearMonthly = Math.round(simulationData[0].totalSavings / 12);

    return {
      total30Years,
      monthlyAverage,
      firstYearMonthly,
      firstYearAnnual: simulationData[0].totalSavings,
    };
  }, [simulationData]);

  // A3 landscape dimensions
  const A3_WIDTH = 420 * MM_TO_PX; // 1587px
  const A3_HEIGHT = 297 * MM_TO_PX; // 1123px
  const TITLE_HEIGHT = 50 * MM_TO_PX; // 189px

  return (
    <div
      style={{
        width: `${A3_WIDTH}px`,
        height: `${A3_HEIGHT}px`,
        backgroundColor: 'white',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Title Area - 50mm height */}
      <div
        style={{
          height: `${TITLE_HEIGHT}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '2px solid #333',
          backgroundColor: '#f8f9fa',
        }}
      >
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1a1a1a',
            margin: 0,
          }}
        >
          Energy Cost Simulation
        </h1>
      </div>

      {/* Main Content Area - Split into two halves */}
      <div
        style={{
          display: 'flex',
          height: `${A3_HEIGHT - TITLE_HEIGHT}px`,
          width: '100%',
        }}
      >
        {/* Left Half - Conditions and Input */}
        <div
          style={{
            width: '50%',
            borderRight: '1px solid #ddd',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Conditions</h2>

          {/* Panel Conditions Box */}
          <div
            style={{
              border: '2px solid #0066cc',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f0f8ff',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#0066cc' }}>
              Panel Conditions
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div>
                <strong>Next Energy {panelSpecs.wattPerPanel}W/module</strong>
              </div>
              <div>
                → {panelSpecs.panels15.count} modules = {panelSpecs.panels15.capacity}kW
              </div>
              <div>
                → {panelSpecs.panels20.count} modules = {panelSpecs.panels20.capacity}kW
              </div>
            </div>
          </div>

          {/* Annual Generation Box */}
          <div
            style={{
              border: '2px solid #28a745',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f0fff4',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#28a745' }}>
              Annual Generation
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div>About {panelSpecs.generationPerKw} kWh per kW</div>
              <div>
                {panelSpecs.panels20.capacity}kW system generates:
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                {(panelSpecs.panels20.capacity * panelSpecs.generationPerKw).toLocaleString()} kWh/year
              </div>
            </div>
          </div>

          {/* Selling Scheme Box */}
          <div
            style={{
              border: '2px solid #ffc107',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#fffef0',
            }}
          >
            <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#f39c12' }}>
              Selling Scheme (Yearly Price Transition)
            </h3>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Period</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Price (¥/kWh)</th>
                </tr>
              </thead>
              <tbody>
                {sellingScheme.map((scheme, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{scheme.period}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      ¥{scheme.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Half - Results */}
        <div
          style={{
            width: '50%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Results</h2>

          {/* Annual Energy Cost Simulation Table */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>
              Annual Energy Cost Simulation
            </h3>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Year</th>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Generation</th>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Self Use</th>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Export</th>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Sell Income</th>
                  <th style={{ padding: '5px', border: '1px solid #ddd' }}>Savings</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((row) => (
                  <tr key={row.year}>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'center' }}>
                      {row.year}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {row.generation.toLocaleString()}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {row.selfConsumption.toLocaleString()}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {row.export.toLocaleString()}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {formatJPY(row.sellIncome)}
                    </td>
                    <td style={{ padding: '5px', border: '1px solid #ddd', textAlign: 'right' }}>
                      {formatJPY(row.savings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Monthly Savings Table */}
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Monthly Savings</h3>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>First Year Monthly Savings</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                    {formatJPY(totals.firstYearMonthly)}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>Average Monthly (30 years)</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                    {formatJPY(totals.monthlyAverage)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Savings Emphasis - Bottom Right */}
          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#28a745',
              borderRadius: '12px',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>
              Total Savings (30 Years)
            </div>
            <div style={{ fontSize: '42px', fontWeight: 'bold' }}>
              {formatJPY(totals.total30Years)}
            </div>
            <div
              style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '5px' }}>Monthly Savings</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {formatJPY(totals.monthlyAverage)}/month
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}