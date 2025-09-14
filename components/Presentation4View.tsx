'use client';

import { useEffect, useState } from 'react';
import { Calculator, Home, Hammer, FileText, Landmark } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation4 } from '@/types';

interface Presentation4ViewProps {
  projectId: string;
}

const categoryIcons = {
  '建物本体工事費': Home,
  '付帯工事費': Hammer,
  '諸費用': FileText,
  '土地費用': Landmark,
};

export function Presentation4View({ projectId }: Presentation4ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation4 | null>(null);

  useEffect(() => {
    if (currentProject?.presentation4) {
      setPresentation(currentProject.presentation4);
    } else {
      // デフォルトデータを設定
      const defaultPresentation: Presentation4 = {
        id: `pres4-${Date.now()}`,
        projectId,
        buildingCost: 25000000,
        constructionCost: 5000000,
        otherCosts: 2000000,
        landCost: 15000000,
        totalCost: 47000000,
        costBreakdown: [
          { id: '1', item: '建物本体工事', amount: 25000000 },
          { id: '2', item: '外構工事', amount: 3000000 },
          { id: '3', item: '設備工事', amount: 2000000 },
          { id: '4', item: '登記費用', amount: 500000 },
          { id: '5', item: '税金・保険', amount: 1500000 },
        ],
        loanAmount: 40000000,
        downPayment: 7000000,
        interestRate: 0.5,
        loanPeriod: 35,
        monthlyPayment: 103834,
      };
      setPresentation(defaultPresentation);
    }
  }, [currentProject, projectId]);

  if (!presentation) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl text-gray-500">資金計画データを読み込み中...</p>
      </div>
    );
  }

  const categories = [
    { key: 'buildingCost', label: '建物本体工事費', value: presentation.buildingCost },
    { key: 'constructionCost', label: '付帯工事費', value: presentation.constructionCost },
    { key: 'otherCosts', label: '諸費用', value: presentation.otherCosts },
    { key: 'landCost', label: '土地費用', value: presentation.landCost },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* ヘッダー部分 - A3の上部15% */}
      <div className="h-[15%] bg-gradient-to-r from-orange-600 to-orange-700 px-8 flex items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">資金計画</h2>
          <p className="text-lg text-orange-100">
            建築にかかる費用の詳細と、資金計画をご説明いたします
          </p>
        </div>
      </div>

      {/* コンテンツ部分 - A3の中央70% */}
      <div className="h-[70%] px-8 py-4 overflow-auto">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {categories.map((category) => {
            const Icon = categoryIcons[category.label as keyof typeof categoryIcons] || FileText;
            return (
              <div key={category.key} className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-700 text-lg">{category.label}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  ¥{category.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-8 rounded-xl text-white mb-6">
          <h3 className="text-2xl font-bold mb-3">総費用</h3>
          <p className="text-5xl font-bold">
            ¥{presentation.totalCost.toLocaleString()}
          </p>
        </div>

        {presentation.costBreakdown && presentation.costBreakdown.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 px-8 py-4">
              <h3 className="text-xl font-semibold">費用内訳詳細</h3>
            </div>
            <div className="p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 text-lg font-medium text-gray-700">項目</th>
                    <th className="text-right py-3 text-lg font-medium text-gray-700">金額</th>
                  </tr>
                </thead>
                <tbody>
                  {presentation.costBreakdown.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 text-lg">{item.item}</td>
                      <td className="py-3 text-lg text-right font-bold">
                        ¥{item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Calculator className="mr-3 h-8 w-8" />
            ローンシミュレーション
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg text-gray-600 mb-2">借入金額</p>
              <p className="text-2xl font-bold">¥{presentation.loanAmount.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg text-gray-600 mb-2">頭金</p>
              <p className="text-2xl font-bold">¥{presentation.downPayment.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg text-gray-600 mb-2">金利</p>
              <p className="text-2xl font-bold">{presentation.interestRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-lg text-gray-600 mb-2">返済期間</p>
              <p className="text-2xl font-bold">{presentation.loanPeriod}年</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 rounded-lg text-center text-white">
            <p className="text-xl mb-3">月々のお支払い</p>
            <p className="text-6xl font-bold">
              ¥{presentation.monthlyPayment.toLocaleString()}
            </p>
            <p className="text-lg mt-3 text-green-100">
              ※ボーナス払いなし、元利均等返済の場合
            </p>
          </div>
        </div>
      </div>

      {/* フッター部分 - A3の下部15% */}
      <div className="h-[15%] bg-gray-100 px-8 py-3 flex items-center justify-between">
        <div>
          <p className="text-lg text-gray-700">
            <strong>ご注意：</strong>
            上記の金額は概算です。実際の金額は金融機関の審査結果により異なる場合があります。
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">G-HOUSE</p>
          <p className="text-lg text-gray-600">資金計画シミュレーション</p>
        </div>
      </div>
    </div>
  );
}