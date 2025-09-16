'use client';

import React, { useMemo, useState } from 'react';

type Item = { id: string; label: string; price: number };
type Category = {
  id: string;
  no: number;
  title: string;
  subtitle?: string;
  tags?: string[];
  items: Item[]
};

interface OptionsIoTStyleProps {
  projectId: string;
  customerName?: string;
  projectDate?: string;
}

// カテゴリーデータ定義
const categoriesData: Category[] = [
  {
    id: 'exterior',
    no: 1,
    title: '外装',
    subtitle: '外観・エクステリア',
    tags: ['タイル', '電子錠', 'カーポート'],
    items: [
      { id: 'tile', label: '外壁タイル張り', price: 680000 },
      { id: 'lock', label: '玄関電子錠', price: 120000 },
      { id: 'delivery', label: '宅配ボックス', price: 85000 },
      { id: 'carport', label: 'カーポート（2台用）', price: 450000 },
      { id: 'gate', label: '門扉・フェンス', price: 320000 },
      { id: 'light', label: '外構照明', price: 180000 },
      { id: 'deck', label: 'ウッドデッキ', price: 280000 },
    ]
  },
  {
    id: 'solar',
    no: 2,
    title: 'エコ・創エネ',
    subtitle: '太陽光・蓄電池',
    tags: ['太陽光', '蓄電池', '省エネ'],
    items: [
      { id: 'solar6', label: '太陽光パネル（6kW）', price: 1200000 },
      { id: 'battery', label: '蓄電池システム', price: 1650000 },
      { id: 'hems', label: 'HEMSシステム', price: 150000 },
      { id: 'insulation', label: '外断熱工法', price: 850000 },
      { id: 'sash', label: '樹脂サッシ', price: 420000 },
    ]
  },
  {
    id: 'kitchen',
    no: 3,
    title: 'キッチン',
    subtitle: '調理・水まわり',
    tags: ['食洗機', 'IH', 'システム'],
    items: [
      { id: 'kitchen_up', label: 'システムキッチン（グレードアップ）', price: 650000 },
      { id: 'dishwasher', label: '食器洗い乾燥機', price: 180000 },
      { id: 'ih', label: 'IHクッキングヒーター', price: 120000 },
      { id: 'water', label: '浄水器（ビルトイン）', price: 85000 },
      { id: 'disposal', label: 'ディスポーザー', price: 150000 },
    ]
  },
  {
    id: 'living',
    no: 4,
    title: 'リビング・居室',
    subtitle: '快適空間',
    tags: ['床暖房', '空調', '造作'],
    items: [
      { id: 'floor_heat', label: '床暖房（LDK）', price: 450000 },
      { id: 'floor_wood', label: '無垢フローリング', price: 380000 },
      { id: 'ac_all', label: '全館空調システム', price: 980000 },
      { id: 'furniture', label: '造作家具（リビング）', price: 450000 },
      { id: 'ecocarat', label: '調湿建材（エコカラット）', price: 320000 },
      { id: 'closet', label: 'ウォークインクローゼット', price: 280000 },
    ]
  },
  {
    id: 'bathroom',
    no: 5,
    title: '浴室・洗面',
    subtitle: 'バスルーム',
    tags: ['浴室乾燥', 'ミストサウナ'],
    items: [
      { id: 'bath_dry', label: '浴室乾燥機', price: 120000 },
      { id: 'mist', label: 'ミストサウナ', price: 280000 },
      { id: 'jetbath', label: 'ジェットバス', price: 350000 },
      { id: 'vanity', label: '造作洗面台', price: 280000 },
      { id: 'towel', label: 'タオルウォーマー', price: 85000 },
    ]
  },
  {
    id: 'toilet',
    no: 6,
    title: 'トイレ・水まわり',
    subtitle: 'サニタリー',
    tags: ['タンクレス', '手洗い'],
    items: [
      { id: 'tankless', label: 'タンクレストイレ', price: 220000 },
      { id: 'wash', label: '独立手洗い器', price: 120000 },
      { id: 'bidet', label: '温水洗浄便座（上位モデル）', price: 85000 },
      { id: 'dry', label: '室内物干し', price: 85000 },
    ]
  }
];

export default function OptionsIoTStyle({
  projectId,
  customerName = 'お客様',
  projectDate = new Date().toLocaleDateString('ja-JP')
}: OptionsIoTStyleProps) {
  const [pattern, setPattern] = useState<'eco' | 'comfort'>('eco');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const { total, monthly } = useMemo(() => {
    const sum = Object.entries(checked).reduce((acc, [id, isChecked]) => {
      if (!isChecked) return acc;
      const [catId, itemId] = id.split(':');
      const cat = categoriesData.find(c => c.id === catId);
      const item = cat?.items.find(i => i.id === itemId);
      return acc + (item?.price ?? 0);
    }, 0);

    // 月々計算（簡易版）
    const rate = 0.01 / 12; // 年利1%の月利
    const years = 35;
    const months = years * 12;

    if (sum === 0) return { total: 0, monthly: 0 };

    const monthlyPayment = Math.round(sum * rate / (1 - Math.pow(1 + rate, -months)));

    return { total: sum, monthly: monthlyPayment };
  }, [checked]);

  return (
    <div className="a3-sheet-iot">
      <div className="a3-canvas-iot">
        {/* タイトル */}
        <header className="a3-header-iot">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="a3-title-iot">住まいのオプション選択</h1>
              <p className="a3-subtitle-iot">お客様のライフスタイルに合わせてカスタマイズ</p>
            </div>
            <div className="text-sm text-gray-600">
              <div>{customerName} 様</div>
              <div>{projectDate}</div>
              <div>ID: {projectId}</div>
            </div>
          </div>
        </header>

        {/* ピル（外観パターン切替） */}
        <div className="flex justify-end">
          <div className="pattern-pills">
            <button
              onClick={() => setPattern('eco')}
              className={`pill-button ${pattern === 'eco' ? 'active' : ''}`}
            >
              パターン① エコ重視
            </button>
            <button
              onClick={() => setPattern('comfort')}
              className={`pill-button ${pattern === 'comfort' ? 'active' : ''}`}
            >
              パターン② 快適重視
            </button>
          </div>
        </div>

        {/* 本体：ヒーロー＋カテゴリカード */}
        <section className="a3-main-iot">
          {/* 左：IoT風ヒーロー */}
          <div className="hero-section">
            <div className="hero-header">
              <div className="hero-icon">
                <div className="icon-circle" />
              </div>
              <div className="hero-text">
                <div className="hero-title">外観パターン イメージ</div>
                <div className="hero-desc">
                  {pattern === 'eco'
                    ? 'エコ重視：太陽光発電と高断熱で省エネルギー住宅'
                    : '快適重視：全館空調と高機能設備で快適な住まい'}
                </div>
              </div>
            </div>
            <div className="hero-image">
              <span className="text-gray-400">
                {pattern === 'eco' ? '外観イメージ（エコ）' : '外観イメージ（快適）'}
              </span>
            </div>
          </div>

          {/* 右：カテゴリカードグリッド */}
          <div className="category-grid">
            {categoriesData.map((cat) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                checked={checked}
                toggle={toggle}
              />
            ))}
          </div>
        </section>

        {/* 下段サマリー */}
        <footer className="a3-footer-iot">
          <div className="summary-card total-card">
            <div className="summary-label">オプション合計</div>
            <div className="summary-value">¥{total.toLocaleString()}</div>
          </div>
          <div className="summary-card monthly-card">
            <div className="summary-label">オプション分の月々支払い（概算）</div>
            <div className="summary-value">¥{monthly.toLocaleString()}</div>
            <div className="summary-note">期間 35年 / 金利 1.0%</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CategoryCard({
  cat,
  checked,
  toggle
}: {
  cat: Category;
  checked: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  return (
    <div className="category-card">
      {/* ヘッダー */}
      <div className="card-header">
        <div className="card-number">{String(cat.no).padStart(2, '0')}</div>
        <div className="card-title">{cat.title}</div>
        {cat.subtitle && <div className="card-subtitle">{cat.subtitle}</div>}
        {cat.tags && (
          <div className="card-tags">
            {cat.tags.map((tag, i) => (
              <span key={i} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* 本文：チェック群 */}
      <div className="card-body scroll-y-iot">
        {cat.items.map(item => {
          const id = `${cat.id}:${item.id}`;
          return (
            <label key={id} className="check-item">
              <input
                type="checkbox"
                checked={!!checked[id]}
                onChange={() => toggle(id)}
                className="check-input"
              />
              <span className="check-label">{item.label}</span>
              <span className="check-price">¥{item.price.toLocaleString()}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}