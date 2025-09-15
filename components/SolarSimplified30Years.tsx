'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, TrendingDown, Zap, Battery, Home } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SolarSimplified30YearsProps {
  projectId: string;
}

// 4シナリオの色定義（印刷対応）
const SCENARIO_COLORS = {
  normal: '#6B7280',           // ①通常：グレー
  highPerf: '#059669',         // ②高性能：緑（濃い目）
  highPerfPV: '#1E40AF',       // ③高性能+PV：青（濃い目）
  highPerfPVBatt: '#6B21A8'    // ④高性能+PV+蓄電池：紫（濃い目）
};

export default function SolarSimplified30Years({ projectId }: SolarSimplified30YearsProps) {
  // シンプルな前提値（月額ベース）
  const scenarios = {
    normal: {
      monthly: 18000,
      yearly: 216000,
      label: '①通常',
      description: '今のまま',
      icon: Home,
      color: SCENARIO_COLORS.normal
    },
    highPerf: {
      monthly: 12000,
      yearly: 144000,
      label: '②高性能',
      description: '断熱性能UP',
      icon: Home,
      color: SCENARIO_COLORS.highPerf
    },
    highPerfPV: {
      monthly: 6000,
      yearly: 72000,
      label: '③高性能+PV',
      description: '太陽光発電付き',
      icon: Zap,
      color: SCENARIO_COLORS.highPerfPV
    },
    highPerfPVBatt: {
      monthly: 3000,
      yearly: 36000,
      label: '④高性能+PV+蓄電池',
      description: '完全自給自足',
      icon: Battery,
      color: SCENARIO_COLORS.highPerfPVBatt
    },
  };

  // 30年間の累計計算
  const calculations = useMemo(() => {
    const data = [];
    for (let year = 1; year <= 30; year++) {
      data.push({
        year,
        normal: scenarios.normal.yearly * year,
        highPerf: scenarios.highPerf.yearly * year,
        highPerfPV: scenarios.highPerfPV.yearly * year,
        highPerfPVBatt: scenarios.highPerfPVBatt.yearly * year,
      });
    }
    return data;
  }, []);

  // 主要年の計算
  const keyYears = {
    year10: calculations[9],
    year20: calculations[19],
    year30: calculations[29]
  };

  const totalSavings = keyYears.year30.normal - keyYears.year30.highPerfPVBatt;
  const monthlySavings = Math.round(totalSavings / 360);

  // 比較用データ
  const comparisonData = [
    { name: '①通常', value: keyYears.year30.normal, color: SCENARIO_COLORS.normal },
    { name: '②高性能', value: keyYears.year30.highPerf, color: SCENARIO_COLORS.highPerf },
    { name: '③高性能+PV', value: keyYears.year30.highPerfPV, color: SCENARIO_COLORS.highPerfPV },
    { name: '④PV+蓄電池', value: keyYears.year30.highPerfPVBatt, color: SCENARIO_COLORS.highPerfPVBatt },
  ];

  return (
    <div className="h-screen w-full bg-white p-0 overflow-hidden">
      {/* A3横フルレイアウト：420mm×297mm = 1.414:1 */}
      <div className="h-full w-full flex flex-col">

        {/* ヘッダー：極薄 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3">
          <h1 className="text-2xl font-bold">光熱費30年比較 - どれを選ぶと、いくら変わる？</h1>
        </div>

        {/* メインコンテンツ：3列レイアウト */}
        <div className="flex-1 grid grid-cols-[1fr_2fr_1fr] gap-0">

          {/* 左列：結論カード */}
          <div className="bg-gray-50 p-6 border-r border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">30年間の差額</h2>

            {/* 最大節約額 */}
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-purple-600">
              <div className="text-sm text-gray-600">通常と比べて</div>
              <div className="text-4xl font-bold text-purple-700">{(totalSavings / 10000).toFixed(0)}万円</div>
              <div className="text-lg font-bold text-purple-600">お得！</div>
            </div>

            {/* 月額換算 */}
            <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-600">
              <div className="text-sm text-gray-600">毎月の光熱費</div>
              <div className="text-4xl font-bold text-blue-700">{monthlySavings.toLocaleString()}円</div>
              <div className="text-lg font-bold text-blue-600">安くなる！</div>
            </div>

            {/* 削減率 */}
            <div className="bg-white rounded-lg p-4 border-2 border-green-600">
              <div className="text-sm text-gray-600 mb-2">削減率</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">②高性能</span>
                  <span className="font-bold text-green-700">33%削減</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">③高性能+PV</span>
                  <span className="font-bold text-blue-700">67%削減</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">④PV+蓄電池</span>
                  <span className="font-bold text-purple-700">83%削減</span>
                </div>
              </div>
            </div>
          </div>

          {/* 中央列：メイン比較 */}
          <div className="bg-white p-6">
            {/* 4シナリオカード */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Object.entries(scenarios).map(([key, scenario]) => {
                const Icon = scenario.icon;
                return (
                  <div
                    key={key}
                    className="bg-gray-50 rounded-lg p-4 border-2"
                    style={{ borderColor: scenario.color }}
                  >
                    <Icon className="h-8 w-8 mb-2" style={{ color: scenario.color }} />
                    <div className="text-sm font-bold" style={{ color: scenario.color }}>
                      {scenario.label}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
                    <div className="text-2xl font-bold" style={{ color: scenario.color }}>
                      月{(scenario.monthly / 1000).toFixed(0)}千円
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 30年総額比較表 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">30年間の光熱費総額</h3>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 text-gray-700">期間</th>
                    <th className="text-right py-2" style={{ color: SCENARIO_COLORS.normal }}>①通常</th>
                    <th className="text-right py-2" style={{ color: SCENARIO_COLORS.highPerf }}>②高性能</th>
                    <th className="text-right py-2" style={{ color: SCENARIO_COLORS.highPerfPV }}>③高性能+PV</th>
                    <th className="text-right py-2" style={{ color: SCENARIO_COLORS.highPerfPVBatt }}>④PV+蓄電池</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">10年</td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.normal }}>
                      {(keyYears.year10.normal / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerf }}>
                      {(keyYears.year10.highPerf / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerfPV }}>
                      {(keyYears.year10.highPerfPV / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerfPVBatt }}>
                      {(keyYears.year10.highPerfPVBatt / 10000).toFixed(0)}万円
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">20年</td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.normal }}>
                      {(keyYears.year20.normal / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerf }}>
                      {(keyYears.year20.highPerf / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerfPV }}>
                      {(keyYears.year20.highPerfPV / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 font-bold" style={{ color: SCENARIO_COLORS.highPerfPVBatt }}>
                      {(keyYears.year20.highPerfPVBatt / 10000).toFixed(0)}万円
                    </td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="py-2 font-bold">30年</td>
                    <td className="text-right py-2 text-xl font-bold" style={{ color: SCENARIO_COLORS.normal }}>
                      {(keyYears.year30.normal / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 text-xl font-bold" style={{ color: SCENARIO_COLORS.highPerf }}>
                      {(keyYears.year30.highPerf / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 text-xl font-bold" style={{ color: SCENARIO_COLORS.highPerfPV }}>
                      {(keyYears.year30.highPerfPV / 10000).toFixed(0)}万円
                    </td>
                    <td className="text-right py-2 text-xl font-bold" style={{ color: SCENARIO_COLORS.highPerfPVBatt }}>
                      {(keyYears.year30.highPerfPVBatt / 10000).toFixed(0)}万円
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* グラフエリア（小さめ） */}
            <div className="grid grid-cols-2 gap-4">
              {/* 棒グラフ */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">30年総額比較</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#374151' }}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                      tick={{ fontSize: 10, fill: '#374151' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 線グラフ */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-sm font-bold text-gray-700 mb-2">累積推移</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={calculations} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 9, fill: '#374151' }}
                    />
                    <YAxis
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                      tick={{ fontSize: 9, fill: '#374151' }}
                    />
                    <Line type="monotone" dataKey="normal" stroke={SCENARIO_COLORS.normal} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="highPerf" stroke={SCENARIO_COLORS.highPerf} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="highPerfPV" stroke={SCENARIO_COLORS.highPerfPV} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="highPerfPVBatt" stroke={SCENARIO_COLORS.highPerfPVBatt} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 右列：詳細情報 */}
          <div className="bg-gray-50 p-6 border-l border-gray-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">シナリオ詳細</h2>

            {/* 年間光熱費 */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">年間光熱費</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">①通常</span>
                  <span className="font-bold" style={{ color: SCENARIO_COLORS.normal }}>
                    {(scenarios.normal.yearly / 10000).toFixed(1)}万円/年
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">②高性能</span>
                  <span className="font-bold" style={{ color: SCENARIO_COLORS.highPerf }}>
                    {(scenarios.highPerf.yearly / 10000).toFixed(1)}万円/年
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">③高性能+PV</span>
                  <span className="font-bold" style={{ color: SCENARIO_COLORS.highPerfPV }}>
                    {(scenarios.highPerfPV.yearly / 10000).toFixed(1)}万円/年
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">④PV+蓄電池</span>
                  <span className="font-bold" style={{ color: SCENARIO_COLORS.highPerfPVBatt }}>
                    {(scenarios.highPerfPVBatt.yearly / 10000).toFixed(1)}万円/年
                  </span>
                </div>
              </div>
            </div>

            {/* 差額計算 */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3">通常比の節約額（30年）</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">②高性能</span>
                  <span className="font-bold text-green-700">
                    {((keyYears.year30.normal - keyYears.year30.highPerf) / 10000).toFixed(0)}万円
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">③高性能+PV</span>
                  <span className="font-bold text-blue-700">
                    {((keyYears.year30.normal - keyYears.year30.highPerfPV) / 10000).toFixed(0)}万円
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">④PV+蓄電池</span>
                  <span className="font-bold text-purple-700">
                    {((keyYears.year30.normal - keyYears.year30.highPerfPVBatt) / 10000).toFixed(0)}万円
                  </span>
                </div>
              </div>
            </div>

            {/* まとめ */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-4 border-2 border-purple-400">
              <h3 className="text-base font-bold text-purple-800 mb-2">結論</h3>
              <p className="text-sm text-gray-700 mb-2">
                高性能住宅＋太陽光＋蓄電池なら
              </p>
              <div className="text-2xl font-bold text-purple-700 mb-1">
                30年で{(totalSavings / 10000).toFixed(0)}万円
              </div>
              <div className="text-lg font-bold text-purple-600">
                月々{monthlySavings.toLocaleString()}円
              </div>
              <p className="text-sm font-bold text-purple-700 mt-2">
                もお得に！
              </p>
            </div>
          </div>
        </div>

        {/* フッター：極薄 */}
        <div className="bg-gray-100 border-t border-gray-300 px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <span>※電気料金27円/kWh、太陽光6.9kW想定</span>
            <span>※メンテナンス費用込み</span>
            <span>※2025年シミュレーション</span>
          </div>
          <div className="text-xs text-gray-500">
            G-House 太陽光発電システム提案書
          </div>
        </div>
      </div>
    </div>
  );
}