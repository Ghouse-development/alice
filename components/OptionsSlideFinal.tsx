'use client';

import React, { useState, useMemo } from 'react';

interface OptionItem {
  id: string;
  label: string;
  price: number;
  checked: boolean;
}

// ローン計算
function calculateMonthlyPayment(principal: number, years: number, annualRate: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  const monthly = principal * r / (1 - Math.pow(1 + r, -n));
  return Math.round(monthly);
}

export default function OptionsSlideFinal({ projectId }: { projectId?: string }) {
  // ローン条件
  const [loanYears, setLoanYears] = useState(35);
  const [loanRate, setLoanRate] = useState(1.0);

  // 外観①基本4項目
  const [exterior1Basic, setExterior1Basic] = useState<OptionItem[]>([
    { id: 'e1b1', label: '外観Aタイル', price: 120000, checked: false },
    { id: 'e1b2', label: 'ルーフライン強化', price: 180000, checked: false },
    { id: 'e1b3', label: 'フェンスアップグレード', price: 95000, checked: false },
    { id: 'e1b4', label: 'ポーチ拡張', price: 60000, checked: false },
  ]);

  // 外観①追加20項目
  const [exterior1Extra, setExterior1Extra] = useState<OptionItem[]>([
    { id: 'e1x1', label: '外壁塗装アップ', price: 280000, checked: false },
    { id: 'e1x2', label: 'サッシ色変更', price: 150000, checked: false },
    { id: 'e1x3', label: '玄関庇拡張', price: 120000, checked: false },
    { id: 'e1x4', label: '雨樋デザイン', price: 85000, checked: false },
    { id: 'e1x5', label: '袖壁追加', price: 95000, checked: false },
    { id: 'e1x6', label: 'ルーバー追加', price: 180000, checked: false },
    { id: 'e1x7', label: '門柱デザイン', price: 220000, checked: false },
    { id: 'e1x8', label: '表札LED', price: 45000, checked: false },
    { id: 'e1x9', label: '宅配BOX', price: 65000, checked: false },
    { id: 'e1x10', label: 'アプローチ石張り', price: 350000, checked: false },
    { id: 'e1x11', label: 'カーポート標準', price: 280000, checked: false },
    { id: 'e1x12', label: 'カーポート延長', price: 150000, checked: false },
    { id: 'e1x13', label: 'サイクルポート', price: 120000, checked: false },
    { id: 'e1x14', label: '庭照明3点', price: 85000, checked: false },
    { id: 'e1x15', label: '外部水栓2口', price: 55000, checked: false },
    { id: 'e1x16', label: '立水栓デザイン', price: 95000, checked: false },
    { id: 'e1x17', label: '外構ベースコンクリ', price: 280000, checked: false },
    { id: 'e1x18', label: '芝張り一式', price: 180000, checked: false },
    { id: 'e1x19', label: 'シンボルツリー', price: 85000, checked: false },
    { id: 'e1x20', label: '化粧ブロック', price: 220000, checked: false },
  ]);

  // 外観②基本4項目
  const [exterior2Basic, setExterior2Basic] = useState<OptionItem[]>([
    { id: 'e2b1', label: 'タイル外壁全面', price: 450000, checked: false },
    { id: 'e2b2', label: '瓦屋根グレードアップ', price: 320000, checked: false },
    { id: 'e2b3', label: '玄関ドア電子錠', price: 180000, checked: false },
    { id: 'e2b4', label: 'バルコニー拡張', price: 280000, checked: false },
  ]);

  // 外観②追加20項目
  const [exterior2Extra, setExterior2Extra] = useState<OptionItem[]>([
    { id: 'e2x1', label: '外壁総タイル張り', price: 580000, checked: false },
    { id: 'e2x2', label: '樹脂サッシ全窓', price: 380000, checked: false },
    { id: 'e2x3', label: 'オーバーハング', price: 280000, checked: false },
    { id: 'e2x4', label: '軒天木目調', price: 150000, checked: false },
    { id: 'e2x5', label: 'パラペット立上げ', price: 220000, checked: false },
    { id: 'e2x6', label: '格子デザイン', price: 185000, checked: false },
    { id: 'e2x7', label: '機能門柱一体型', price: 320000, checked: false },
    { id: 'e2x8', label: 'インターホンカメラ付', price: 85000, checked: false },
    { id: 'e2x9', label: '宅配BOXビルトイン', price: 125000, checked: false },
    { id: 'e2x10', label: '外構フル仕上げ', price: 680000, checked: false },
    { id: 'e2x11', label: 'カーポート2台用', price: 480000, checked: false },
    { id: 'e2x12', label: '電動シャッター', price: 350000, checked: false },
    { id: 'e2x13', label: 'ウッドデッキ', price: 380000, checked: false },
    { id: 'e2x14', label: 'ガーデンライト5点', price: 150000, checked: false },
    { id: 'e2x15', label: '散水栓3箇所', price: 95000, checked: false },
    { id: 'e2x16', label: 'デザイン立水栓2本', price: 180000, checked: false },
    { id: 'e2x17', label: '土間コン全面', price: 450000, checked: false },
    { id: 'e2x18', label: '人工芝全面', price: 280000, checked: false },
    { id: 'e2x19', label: '植栽セット', price: 220000, checked: false },
    { id: 'e2x20', label: 'エクステリア照明', price: 380000, checked: false },
  ]);

  // 内装15項目
  const [interior, setInterior] = useState<OptionItem[]>([
    { id: 'i1', label: 'リビング照明アップグレード', price: 120000, checked: false },
    { id: 'i2', label: 'キッチン吊戸増設', price: 150000, checked: false },
    { id: 'i3', label: '食洗機ハイグレード', price: 250000, checked: false },
    { id: 'i4', label: '床材オーク変更（LDK）', price: 180000, checked: false },
    { id: 'i5', label: '造作テレビボード', price: 200000, checked: false },
    { id: 'i6', label: '室内窓（リビング）', price: 120000, checked: false },
    { id: 'i7', label: '玄関土間拡張', price: 90000, checked: false },
    { id: 'i8', label: 'パントリー棚増設', price: 80000, checked: false },
    { id: 'i9', label: '造作洗面（W=900）', price: 180000, checked: false },
    { id: 'i10', label: 'トイレ手洗い器', price: 120000, checked: false },
    { id: 'i11', label: 'ハイドア化（LDK）', price: 250000, checked: false },
    { id: 'i12', label: '収納内部棚一式', price: 150000, checked: false },
    { id: 'i13', label: '室内干し金物2本', price: 50000, checked: false },
    { id: 'i14', label: 'ワークスペース造作', price: 220000, checked: false },
    { id: 'i15', label: '玄関収納ミラー扉', price: 60000, checked: false },
  ]);

  // 合計計算
  const exterior1Total = useMemo(() => {
    const basic = exterior1Basic.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0);
    const extra = exterior1Extra.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0);
    return basic + extra;
  }, [exterior1Basic, exterior1Extra]);

  const exterior2Total = useMemo(() => {
    const basic = exterior2Basic.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0);
    const extra = exterior2Extra.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0);
    return basic + extra;
  }, [exterior2Basic, exterior2Extra]);

  const interiorTotal = useMemo(() =>
    interior.filter(i => i.checked).reduce((sum, i) => sum + i.price, 0),
    [interior]
  );

  const pattern1Total = exterior1Total + interiorTotal;
  const pattern2Total = exterior2Total + interiorTotal;

  const pattern1Monthly = calculateMonthlyPayment(pattern1Total, loanYears, loanRate);
  const pattern2Monthly = calculateMonthlyPayment(pattern2Total, loanYears, loanRate);

  // ハンドラー
  const updateItem = (items: OptionItem[], setItems: any, id: string, checked: boolean) => {
    setItems(items.map(item => item.id === id ? { ...item, checked } : item));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white p-6">
      {/* ヘッダー */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">オプション選択</h1>
      </div>

      {/* メインコンテンツ - 2段グリッド */}
      <div className="grid grid-rows-[1fr_auto] gap-4 h-[calc(100%-60px)]">

        {/* 上段: 3カラム */}
        <div className="grid grid-cols-3 gap-4">

          {/* 外観パターン① */}
          <div className="bg-white rounded-xl shadow-sm p-4 min-h-[360px] flex flex-col">
            <h2 className="text-lg font-bold text-red-600 border-b-2 border-red-200 pb-1 mb-3">
              外観パターン①
            </h2>

            {/* 画像 4:3 */}
            <div className="aspect-[4/3] bg-gradient-to-br from-red-50 to-red-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">外観①イメージ</span>
            </div>

            {/* 基本4項目 */}
            <div className="space-y-1 mb-2">
              {exterior1Basic.map(item => (
                <label key={item.id} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={e => updateItem(exterior1Basic, setExterior1Basic, item.id, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            {/* 基本合計 */}
            <div className="bg-red-50 rounded p-2 mb-3">
              <div className="text-sm font-bold text-red-700 text-center">
                合計額: ¥{exterior1Total.toLocaleString()}
              </div>
            </div>

            {/* 追加20項目（スクロール可能） */}
            <div className="text-xs text-gray-600 mb-1">追加オプション（20項目）</div>
            <div className="flex-1 overflow-y-auto border rounded p-2 max-h-[200px]">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {exterior1Extra.map(item => (
                  <label key={item.id} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={e => updateItem(exterior1Extra, setExterior1Extra, item.id, e.target.checked)}
                      className="mr-1 scale-90"
                    />
                    <span className="flex-1 truncate" title={item.label}>{item.label}</span>
                    <span className="text-gray-500 text-xs ml-1">¥{(item.price/1000).toFixed(0)}k</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 外観パターン② */}
          <div className="bg-white rounded-xl shadow-sm p-4 min-h-[360px] flex flex-col">
            <h2 className="text-lg font-bold text-blue-600 border-b-2 border-blue-200 pb-1 mb-3">
              外観パターン②
            </h2>

            {/* 画像 4:3 */}
            <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">外観②イメージ</span>
            </div>

            {/* 基本4項目 */}
            <div className="space-y-1 mb-2">
              {exterior2Basic.map(item => (
                <label key={item.id} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={e => updateItem(exterior2Basic, setExterior2Basic, item.id, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            {/* 基本合計 */}
            <div className="bg-blue-50 rounded p-2 mb-3">
              <div className="text-sm font-bold text-blue-700 text-center">
                合計額: ¥{exterior2Total.toLocaleString()}
              </div>
            </div>

            {/* 追加20項目（スクロール可能） */}
            <div className="text-xs text-gray-600 mb-1">追加オプション（20項目）</div>
            <div className="flex-1 overflow-y-auto border rounded p-2 max-h-[200px]">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {exterior2Extra.map(item => (
                  <label key={item.id} className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={e => updateItem(exterior2Extra, setExterior2Extra, item.id, e.target.checked)}
                      className="mr-1 scale-90"
                    />
                    <span className="flex-1 truncate" title={item.label}>{item.label}</span>
                    <span className="text-gray-500 text-xs ml-1">¥{(item.price/1000).toFixed(0)}k</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 内装オプション */}
          <div className="bg-white rounded-xl shadow-sm p-4 min-h-[360px] flex flex-col">
            <h2 className="text-lg font-bold text-green-600 border-b-2 border-green-200 pb-1 mb-3">
              内装オプション
            </h2>

            {/* 4枚の内装画像 2x2グリッド */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {['内観①', '内観②', '内観③', '内観④'].map((label, i) => (
                <div key={i} className="aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* 15項目（スクロール可能） */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-2 max-h-[180px]">
              {interior.map(item => (
                <label key={item.id} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={e => updateItem(interior, setInterior, item.id, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="flex-1">{item.label}</span>
                  <span className="text-gray-600">¥{item.price.toLocaleString()}</span>
                </label>
              ))}
            </div>

            {/* 合計 */}
            <div className="bg-green-50 rounded p-2 mt-2">
              <div className="text-sm font-bold text-green-700 text-center">
                合計額: ¥{interiorTotal.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 下段: 2カラム + ローン条件 */}
        <div>
          {/* ローン条件入力 */}
          <div className="flex justify-center gap-4 mb-3">
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600">ローン期間:</label>
              <input
                type="number"
                value={loanYears}
                onChange={e => setLoanYears(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
                min="1"
                max="50"
              />
              <span className="text-gray-600">年</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600">金利:</label>
              <input
                type="number"
                value={loanRate}
                onChange={e => setLoanRate(Number(e.target.value))}
                className="w-16 px-2 py-1 border rounded text-center"
                min="0"
                max="10"
                step="0.1"
              />
              <span className="text-gray-600">%</span>
            </div>
          </div>

          {/* パターン合計 */}
          <div className="grid grid-cols-2 gap-4">
            {/* パターン① */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-300 p-4">
              <h3 className="text-lg font-bold text-red-600 text-center mb-2">
                パターン① 合計
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                外観パターン① ＋ 内装オプション
              </p>
              <div className="bg-white rounded-lg p-3">
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-red-600">
                    ¥{pattern1Total.toLocaleString()}
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">月々のお支払い</div>
                    <div className="text-xl font-bold text-orange-600">
                      ¥{pattern1Monthly.toLocaleString()}/月
                    </div>
                    <div className="text-xs text-gray-500">
                      ({loanYears}年・{loanRate}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* パターン② */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-300 p-4">
              <h3 className="text-lg font-bold text-blue-600 text-center mb-2">
                パターン② 合計
              </h3>
              <p className="text-xs text-gray-600 text-center mb-3">
                外観パターン② ＋ 内装オプション
              </p>
              <div className="bg-white rounded-lg p-3">
                <div className="text-center mb-2">
                  <div className="text-2xl font-bold text-blue-600">
                    ¥{pattern2Total.toLocaleString()}
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="text-center">
                    <div className="text-xs text-gray-600">月々のお支払い</div>
                    <div className="text-xl font-bold text-cyan-600">
                      ¥{pattern2Monthly.toLocaleString()}/月
                    </div>
                    <div className="text-xs text-gray-500">
                      ({loanYears}年・{loanRate}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}