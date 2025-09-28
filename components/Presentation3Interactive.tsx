'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';

interface OptionItem {
  id: string;
  name: string;
  price: number;
  checked: boolean;
}

const Presentation3Interactive: React.FC = () => {
  const { theme, currentProject } = useStore();
  const isDark = theme === 'dark';

  // 状態管理
  const [editMode, setEditMode] = useState(false);
  const [rateE, setRateE] = useState(0.8);
  const [yearsE, setYearsE] = useState(35);
  const [rateF, setRateF] = useState(0.8);
  const [yearsF, setYearsF] = useState(35);

  // ヒアリングシートからの推奨画像を使用
  const savedImages = currentProject?.hearingSheet?.idealLiving?.recommendedImages || [];
  const hasHearingImages = savedImages.length > 0;

  // 外観パターン①
  const [exteriorOption1, setExteriorOption1] = useState<OptionItem[]>([
    { id: 'e1-1', name: '一部塗り壁に変更', price: 1000000, checked: false },
    { id: 'e1-2', name: '軒天を木目仕上げに変更', price: 100000, checked: false },
    { id: 'e1-3', name: 'トリプルガラスに変更', price: 600000, checked: false },
    { id: 'e1-4', name: 'ガレージシャッターを追加', price: 1500000, checked: false },
  ]);

  // 外観パターン②
  const [exteriorOption2, setExteriorOption2] = useState<OptionItem[]>([
    { id: 'e2-1', name: '一部塗り壁に変更', price: 1000000, checked: false },
    { id: 'e2-2', name: '軒天を木目仕上げに変更', price: 100000, checked: false },
    { id: 'e2-3', name: 'トリプルガラスに変更', price: 600000, checked: false },
    { id: 'e2-4', name: 'ガレージシャッターを追加', price: 1500000, checked: false },
  ]);

  // 内装オプション
  const [interiorOptions, setInteriorOptions] = useState<OptionItem[]>([
    { id: 'i1', name: 'キッチンカップボード', price: 500000, checked: false },
    { id: 'i2', name: 'トイレ収納TS', price: 53000, checked: false },
    { id: 'i3', name: 'アクセントタイル', price: 200000, checked: false },
    { id: 'i4', name: 'タイル（キッチン・洗面）', price: 200000, checked: false },
    { id: 'i5', name: '枕棚＋パイプハンガー', price: 33000, checked: false },
    { id: 'i6', name: 'アドバンス（スイッチ類）へ変更', price: 72000, checked: false },
    { id: 'i7', name: 'ニッチ', price: 30000, checked: false },
    { id: 'i8', name: '2階給排水管工事＋トイレ', price: 175000, checked: false },
    { id: 'i9', name: '2階給排水管工事＋手洗い', price: 200000, checked: false },
    { id: 'i10', name: 'コーブ照明（キッチン上）', price: 150000, checked: false },
    { id: 'i11', name: '寝室アッパー照明', price: 130000, checked: false },
    { id: 'i12', name: '引き戸建具追加', price: 71000, checked: false },
    { id: 'i13', name: '下がり天井', price: 50000, checked: false },
    { id: 'i14', name: 'アイアン手摺', price: 150000, checked: false },
    { id: 'i15', name: 'ウルトラ高圧エコキュート370L', price: 100000, checked: false },
    { id: 'i16', name: '挽板フローリングへ変更', price: 500000, checked: false },
  ]);

  // 小計計算
  const subtotalA = exteriorOption1.filter((o) => o.checked).reduce((sum, o) => sum + o.price, 0);
  const subtotalB = exteriorOption2.filter((o) => o.checked).reduce((sum, o) => sum + o.price, 0);
  const interiorTotal = interiorOptions
    .filter((o) => o.checked)
    .reduce((sum, o) => sum + o.price, 0);

  // 合計計算
  const totalE = subtotalA + interiorTotal;
  const totalF = subtotalB + interiorTotal;

  // 月額計算
  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    if (principal === 0) return 0;
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) {
      return Math.round(principal / months);
    }
    const monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthly);
  };

  const monthlyE = calculateMonthlyPayment(totalE, rateE, yearsE);
  const monthlyF = calculateMonthlyPayment(totalF, rateF, yearsF);

  return (
    <A3Page title="オプション選択" subtitle="資金計画のオプション予算取りを行います">
      <div className="w-full h-full bg-gray-50 relative">
        {/* メインコンテンツ */}
        <div className="h-full">
          <div className="h-full flex flex-col gap-3">
            {/* 上段：A, B, C セクション */}
            <div className="flex gap-3" style={{ height: '460px' }}>
              {/* A: 外観パターン① */}
              <div className="w-[375px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-red-50 text-red-600 text-base font-bold px-3 py-2 rounded mb-2.5 flex justify-between items-center">
                  <span>A: 外観パターン①</span>
                  {editMode && (
                    <button className="text-sm text-red-600 hover:text-red-800">✏️</button>
                  )}
                </div>
                <div className="w-[351px] h-[200px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-black text-xs relative">
                  {editMode ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="exterior1-upload"
                      />
                      <label
                        htmlFor="exterior1-upload"
                        className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 border border-blue-600 px-2 py-1 rounded"
                      >
                        画像をアップロード
                      </label>
                      <span className="text-[10px]">外観イメージ①</span>
                    </div>
                  ) : (
                    '外観イメージ①'
                  )}
                </div>
                <div className="flex-1 space-y-0.5 overflow-y-auto">
                  {exteriorOption1.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center p-0.5 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setExteriorOption1((prev) =>
                            prev.map((o) =>
                              o.id === option.id ? { ...o, checked: e.target.checked } : o
                            )
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                  <span className="text-black">小計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{subtotalA.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* B: 外観パターン② */}
              <div className="w-[375px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-blue-50 text-blue-700 text-base font-bold px-3 py-2 rounded mb-2.5 flex justify-between items-center">
                  <span>B: 外観パターン②</span>
                  {editMode && (
                    <button className="text-sm text-blue-700 hover:text-blue-900">✏️</button>
                  )}
                </div>
                <div className="w-[351px] h-[200px] bg-gray-100 rounded mx-auto mb-2.5 flex items-center justify-center text-black text-xs">
                  外観イメージ②
                </div>
                <div className="flex-1 space-y-0.5 overflow-y-auto">
                  {exteriorOption2.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center p-0.5 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setExteriorOption2((prev) =>
                            prev.map((o) =>
                              o.id === option.id ? { ...o, checked: e.target.checked } : o
                            )
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-auto border-t border-gray-200 text-sm">
                  <span className="text-black">小計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{subtotalB.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* C: 理想の暮らしシート */}
              <div
                className="w-[705px] bg-white rounded-lg p-3 shadow flex flex-col"
                style={{ height: '460px' }}
              >
                <div className="bg-green-50 text-black text-base font-bold px-3 py-2 rounded mb-2.5 flex justify-between items-center">
                  <span>C: 内装イメージ</span>
                  {editMode && (
                    <button className="text-sm text-gray-700 hover:text-gray-900">✏️</button>
                  )}
                </div>

                {/* 診断結果表示 */}
                <div
                  className="flex-1 text-black overflow-hidden"
                  style={{ height: 'calc(100% - 60px)' }}
                >
                  {hasHearingImages ? (
                    /* ヒアリングシートの結果表示 */
                    <div className="h-full p-1">
                      <div className="grid grid-cols-2 gap-2 h-full">
                        {savedImages.slice(0, 4).map((image, index) => (
                          <div key={index} className="rounded-lg overflow-hidden relative">
                            <img
                              src={image.url}
                              alt={`推奨画像 ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuOCpOODoeODvOOCuOOBjOiqreOBv+i+vOOBvuOBvuOBm+OCkyA8L3RleHQ+Cjwvc3ZnPgo=';
                              }}
                            />
                            <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* 開始画面（ヒアリングシートがない場合） */
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-500 mb-4">
                          <svg
                            className="w-24 h-24 mx-auto mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-base font-medium text-gray-700">
                            理想の暮らしシートの結果
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            編集画面のヒアリングタブで
                            <br />
                            診断を実行してください
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 下段：D, E, F セクション */}
            <div className="flex-1 flex gap-3">
              {/* D: 内装オプション */}
              <div className="w-[909px] bg-white rounded-lg p-3 shadow flex flex-col">
                <div className="bg-purple-50 text-purple-700 text-base font-bold px-3 py-2 rounded mb-2 flex justify-between items-center">
                  <span>D: 内装・設備オプション</span>
                  {editMode && (
                    <button className="text-sm text-purple-700 hover:text-purple-900">✏️</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-3 -gap-y-1 flex-1 mt-1">
                  {interiorOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center py-0 px-1 text-sm hover:bg-gray-50 cursor-pointer leading-tight h-4"
                    >
                      <input
                        type="checkbox"
                        checked={option.checked}
                        onChange={(e) => {
                          setInteriorOptions((prev) =>
                            prev.map((o) =>
                              o.id === option.id ? { ...o, checked: e.target.checked } : o
                            )
                          );
                        }}
                        className="mr-1.5"
                      />
                      <span className="flex-1 text-black">{option.name}</span>
                      <span className="text-black text-sm font-medium">
                        ¥{option.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end items-center gap-2.5 pt-2 mt-2 border-t border-gray-200 text-sm">
                  <span className="text-black">内装合計:</span>
                  <span className="font-bold text-black min-w-[80px] text-right">
                    ¥{interiorTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* E, F: 合計 */}
              <div className="flex gap-3">
                {/* E: 外観①＋内装 */}
                <div className="w-[267px] bg-white rounded-lg p-3 shadow flex flex-col">
                  <div className="bg-amber-50 text-orange-600 text-base font-bold px-3 py-2 rounded mb-4">
                    E: 外観①＋内装オプション
                  </div>
                  <div className="mb-4">
                    <div className="text-black text-base mb-1">合計額</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{totalE.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-black text-base mb-1">月額(目安)</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{monthlyE.toLocaleString()}
                    </div>
                    <div className="text-black text-sm mt-1 text-right">
                      {editMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={rateE}
                            onChange={(e) => setRateE(parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm border rounded px-1"
                            step="0.1"
                            min="0"
                            max="20"
                          />
                          %/
                          <input
                            type="number"
                            value={yearsE}
                            onChange={(e) => setYearsE(parseInt(e.target.value) || 0)}
                            className="w-12 text-sm border rounded px-1"
                            min="1"
                            max="50"
                          />
                          年
                        </div>
                      ) : (
                        `${rateE}%/${yearsE}年`
                      )}
                    </div>
                  </div>
                </div>

                {/* F: 外観②＋内装 */}
                <div className="w-[267px] bg-white rounded-lg p-3 shadow flex flex-col">
                  <div className="bg-cyan-50 text-cyan-600 text-base font-bold px-3 py-2 rounded mb-4">
                    F: 外観②＋内装オプション
                  </div>
                  <div className="mb-4">
                    <div className="text-black text-base mb-1">合計額</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{totalF.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-black text-base mb-1">月額(目安)</div>
                    <div className="text-3xl font-bold text-black text-right">
                      ¥{monthlyF.toLocaleString()}
                    </div>
                    <div className="text-black text-sm mt-1 text-right">
                      {editMode ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={rateF}
                            onChange={(e) => setRateF(parseFloat(e.target.value) || 0)}
                            className="w-16 text-sm border rounded px-1"
                            step="0.1"
                            min="0"
                            max="20"
                          />
                          %/
                          <input
                            type="number"
                            value={yearsF}
                            onChange={(e) => setYearsF(parseInt(e.target.value) || 0)}
                            className="w-12 text-sm border rounded px-1"
                            min="1"
                            max="50"
                          />
                          年
                        </div>
                      ) : (
                        `${rateF}%/${yearsF}年`
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 編集ボタン */}
        <button
          onClick={() => setEditMode(!editMode)}
          className={`fixed bottom-5 right-5 w-[50px] h-[50px] rounded-full bg-white shadow-lg border-none cursor-pointer text-xl hover:shadow-xl hover:scale-110 transition-all ${editMode ? '' : 'grayscale'}`}
          style={{ zIndex: 9999 }}
        >
          ✏️
        </button>
      </div>
    </A3Page>
  );
};

export default Presentation3Interactive;
