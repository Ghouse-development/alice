'use client';

import React, { useState, useMemo } from 'react';
import { SlideHeader } from '../common/SlideHeader';
import { ImgFrame } from './_parts/ImgFrame';
import { OptionRow, type OptionItem } from './_parts/OptionRow';

const uid = () => Math.random().toString(36).slice(2);

function ensureLen<T>(a: T[] | undefined, n: number, seed: () => T): T[] {
  const x = [...(a ?? [])];
  while (x.length < n) x.push(seed());
  return x.slice(0, n);
}

export default function OptionSelectionSlide() {
  const [exteriorA, setExteriorA] = useState<OptionItem[]>(() =>
    ensureLen(undefined, 4, () => ({ id: uid(), label: '', price: 0, checked: false }))
  );
  const [exteriorB, setExteriorB] = useState<OptionItem[]>(() =>
    ensureLen(undefined, 4, () => ({ id: uid(), label: '', price: 0, checked: false }))
  );
  const [interior, setInterior] = useState<OptionItem[]>(() =>
    ensureLen(undefined, 15, () => ({ id: uid(), label: '', price: 0, checked: false }))
  );

  const baseExteriorA = 680000 + 120000;
  const baseExteriorB = 1200000 + 220000;
  const baseInterior = 450000 + 650000 + 280000;

  const exteriorATotal = useMemo(() =>
    baseExteriorA + exteriorA.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [exteriorA]
  );

  const exteriorBTotal = useMemo(() =>
    baseExteriorB + exteriorB.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [exteriorB]
  );

  const interiorTotal = useMemo(() =>
    baseInterior + interior.filter(o => o.checked).reduce((sum, o) => sum + o.price, 0),
    [interior]
  );

  const grandTotal = exteriorATotal + exteriorBTotal + interiorTotal;
  const monthlyPayment = Math.round(grandTotal / 420); // Simplified amortization

  const updateItem = (
    items: OptionItem[],
    setItems: React.Dispatch<React.SetStateAction<OptionItem[]>>,
    id: string,
    field: string,
    value: any
  ) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

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
        <SlideHeader title="オプション選択" />
      </div>
      <div className="grid grid-cols-12 gap-3 px-4 pb-4" style={{ height: 'calc(100% - 80px)' }}>
        {/* Row 1 */}
        {/* A: Exterior Pattern 1 */}
        <div className="col-span-4 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">外観パターン①</h3>
          <ImgFrame alt="外観パターン1" />
          <div className="mt-2 space-y-1">
            <div className="text-xs">タイル外装: ¥680,000</div>
            <div className="text-xs">電子錠: ¥120,000</div>
            {exteriorA.map((item) => (
              <OptionRow
                key={item.id}
                item={item}
                onToggle={(id) => updateItem(exteriorA, setExteriorA, id, 'checked', !item.checked)}
                onLabel={(id, v) => updateItem(exteriorA, setExteriorA, id, 'label', v)}
                onPrice={(id, v) => updateItem(exteriorA, setExteriorA, id, 'price', v)}
              />
            ))}
            <div className="text-right text-sm font-semibold text-gray-700 tabular-nums pt-2 border-t">
              小計: ¥{exteriorATotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* B: Exterior Pattern 2 */}
        <div className="col-span-4 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">外観パターン②</h3>
          <ImgFrame alt="外観パターン2" />
          <div className="mt-2 space-y-1">
            <div className="text-xs">太陽光パネル: ¥1,200,000</div>
            <div className="text-xs">防犯カメラ: ¥220,000</div>
            {exteriorB.map((item) => (
              <OptionRow
                key={item.id}
                item={item}
                onToggle={(id) => updateItem(exteriorB, setExteriorB, id, 'checked', !item.checked)}
                onLabel={(id, v) => updateItem(exteriorB, setExteriorB, id, 'label', v)}
                onPrice={(id, v) => updateItem(exteriorB, setExteriorB, id, 'price', v)}
              />
            ))}
            <div className="text-right text-sm font-semibold text-gray-700 tabular-nums pt-2 border-t">
              小計: ¥{exteriorBTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* C: Interior Images - row-span-2 */}
        <div className="col-span-4 row-span-2 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">内装イメージ</h3>
          <div className="grid grid-cols-2 gap-3">
            <ImgFrame alt="内装1" />
            <ImgFrame alt="内装2" />
            <ImgFrame alt="内装3" />
            <ImgFrame alt="内装4" />
          </div>
        </div>

        {/* Row 2 */}
        {/* D: Interior Options - widest */}
        <div className="col-span-8 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">内装オプション</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-xs">床暖房: ¥450,000</div>
            <div className="text-xs">システムキッチン: ¥650,000</div>
            <div className="text-xs">ウォークインクローゼット: ¥280,000</div>
            <div></div>
            {interior.map((item) => (
              <OptionRow
                key={item.id}
                item={item}
                onToggle={(id) => updateItem(interior, setInterior, id, 'checked', !item.checked)}
                onLabel={(id, v) => updateItem(interior, setInterior, id, 'label', v)}
                onPrice={(id, v) => updateItem(interior, setInterior, id, 'price', v)}
              />
            ))}
          </div>
          <div className="text-right text-sm font-semibold text-gray-700 tabular-nums pt-2 border-t mt-2">
            内装合計: ¥{interiorTotal.toLocaleString()}
          </div>
        </div>

        {/* E: Grand Total */}
        <div className="col-span-2 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">合計</h3>
          <div className="text-lg font-bold tabular-nums text-right">
            ¥{grandTotal.toLocaleString()}
          </div>
        </div>

        {/* F: Monthly Payment */}
        <div className="col-span-2 border rounded-lg p-3">
          <h3 className="text-sm font-semibold mb-2">月々支払</h3>
          <div className="text-lg font-bold tabular-nums text-right">
            ¥{monthlyPayment.toLocaleString()}/月
          </div>
          <div className="text-xs text-gray-500 mt-1">35年@0.8%</div>
        </div>
      </div>
    </div>
  );
}