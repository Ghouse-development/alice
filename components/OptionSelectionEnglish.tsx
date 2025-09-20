'use client';

import React, { useState, useMemo } from 'react';

// Option item type
interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// Format currency
const formatJPY = (n: number) => `¥${n.toLocaleString()}`;

// Convert mm to pixels (96dpi)
const MM_TO_PX = 3.7795275591;

export default function OptionSelectionEnglish() {
  // Exterior Pattern 1 options (4 items)
  const [exterior1Options] = useState<OptionItem[]>([
    { id: 'e1-1', label: 'Tile Cladding', price: 680000, checked: true },
    { id: 'e1-2', label: 'Electronic Lock', price: 120000, checked: true },
    { id: 'e1-3', label: 'Delivery Box', price: 85000, checked: false },
    { id: 'e1-4', label: 'Carport', price: 450000, checked: false },
  ]);

  // Exterior Pattern 2 options (4 items)
  const [exterior2Options] = useState<OptionItem[]>([
    { id: 'e2-1', label: 'Solar Panels', price: 1200000, checked: true },
    { id: 'e2-2', label: 'Battery System', price: 1650000, checked: false },
    { id: 'e2-3', label: 'Security Camera', price: 220000, checked: true },
    { id: 'e2-4', label: 'Storm Shutters', price: 380000, checked: false },
  ]);

  // Interior options (4 items)
  const [interiorOptions] = useState<OptionItem[]>([
    { id: 'i-1', label: 'Floor Heating', price: 450000, checked: true },
    { id: 'i-2', label: 'System Kitchen', price: 650000, checked: true },
    { id: 'i-3', label: 'Bathroom Dryer', price: 120000, checked: false },
    { id: 'i-4', label: 'Walk-in Closet', price: 280000, checked: true },
  ]);

  // Calculate totals
  const exterior1Total = useMemo(
    () => exterior1Options.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [exterior1Options]
  );

  const exterior2Total = useMemo(
    () => exterior2Options.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [exterior2Options]
  );

  const interiorTotal = useMemo(
    () => interiorOptions.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [interiorOptions]
  );

  // A3 landscape dimensions
  const A3_WIDTH = 420 * MM_TO_PX; // 1587px
  const A3_HEIGHT = 297 * MM_TO_PX; // 1123px
  const TITLE_HEIGHT = 50 * MM_TO_PX; // 189px
  const IMAGE_WIDTH = 100 * MM_TO_PX; // 378px
  const IMAGE_HEIGHT = 70 * MM_TO_PX; // 265px

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
          Option Selection
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
        {/* Left Half - Exterior Options */}
        <div
          style={{
            width: '50%',
            borderRight: '1px solid #ddd',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Exterior Options
          </h2>

          {/* Exterior Pattern 1 */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Exterior Pattern ①</h3>
            <div
              style={{
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#666',
              }}
            >
              Exterior Image 1
            </div>

            {/* Price Items - Horizontal Layout */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px' }}>
              {exterior1Options.map((option) => (
                <div
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    opacity: option.checked ? 1 : 0.5,
                  }}
                >
                  <span>{option.label}:</span>
                  <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                    {formatJPY(option.price)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  color: '#c41e3a',
                }}
              >
                Total: {formatJPY(exterior1Total)}
              </div>
            </div>
          </div>

          {/* Exterior Pattern 2 */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Exterior Pattern ②</h3>
            <div
              style={{
                width: `${IMAGE_WIDTH}px`,
                height: `${IMAGE_HEIGHT}px`,
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#666',
              }}
            >
              Exterior Image 2
            </div>

            {/* Price Items - Horizontal Layout */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', fontSize: '14px' }}>
              {exterior2Options.map((option) => (
                <div
                  key={option.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    opacity: option.checked ? 1 : 0.5,
                  }}
                >
                  <span>{option.label}:</span>
                  <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>
                    {formatJPY(option.price)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  color: '#c41e3a',
                }}
              >
                Total: {formatJPY(exterior2Total)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Half - Interior Options */}
        <div
          style={{
            width: '50%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Interior Options
          </h2>

          {/* Interior Image - Larger than exterior images */}
          <div
            style={{
              width: '100%',
              height: `${IMAGE_HEIGHT * 1.8}px`, // Much larger
              backgroundColor: '#e0e0e0',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#666',
            }}
          >
            Interior Image
          </div>

          {/* Interior Options Table */}
          <div style={{ flex: 1 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '16px',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '2px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Option Item</th>
                  <th style={{ textAlign: 'right', padding: '10px' }}>Price</th>
                  <th style={{ textAlign: 'center', padding: '10px' }}>Selected</th>
                </tr>
              </thead>
              <tbody>
                {interiorOptions.map((option) => (
                  <tr key={option.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{option.label}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      {formatJPY(option.price)}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      {option.checked ? '✓' : '-'}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid #333' }}>
                  <td
                    style={{
                      padding: '10px',
                      fontWeight: 'bold',
                      fontSize: '18px',
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      color: '#c41e3a',
                    }}
                  >
                    {formatJPY(interiorTotal)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Repayment for Options */}
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f0f8ff',
              borderRadius: '8px',
              border: '2px solid #0066cc',
            }}
          >
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              Monthly Repayment (Options Only)
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0066cc' }}>
              ¥{Math.round(interiorTotal / 420).toLocaleString()}/month
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              (35 years @ 0.8% interest)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}