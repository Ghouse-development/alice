'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation3 } from '@/types';
import A3Page from './A3Page';

interface Presentation3ViewProps {
  projectId: string;
}

export function Presentation3View({}: Presentation3ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation3 | null>(null);

  useEffect(() => {
    if (currentProject?.presentation3) {
      setPresentation(currentProject.presentation3);
    }
  }, [currentProject]);

  if (!presentation || !presentation.selectedOptions) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">プレゼンテーション3のデータがありません</p>
      </div>
    );
  }

  const selectedOptions = presentation.selectedOptions.filter((opt) => opt.selected);
  const groupedOptions = selectedOptions.reduce(
    (acc, option) => {
      const category = option.option.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(option);
      return acc;
    },
    {} as Record<string, typeof selectedOptions>
  );

  return (
    <A3Page
      title="仕様のご提案"
      subtitle="お客様のご要望に合わせて、オプション仕様をご提案いたします"
    >
      <div className="relative overflow-hidden">
        {Object.entries(groupedOptions).length > 0 ? (
          <>
            <div className="space-y-6">
              {Object.entries(groupedOptions).map(([category, options]) => (
                <div
                  key={category}
                  className="bg-white text-gray-900 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-3">
                    <h3 className="text-lg font-semibold">{category}</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between p-4 bg-gray-50 text-gray-900 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                              <Check className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium text-lg">{option.option.name}</p>
                              <p className="text-sm text-gray-600">
                                {option.quantity}
                                {option.option.unit === 'fixed'
                                  ? '式'
                                  : option.option.unit === 'area'
                                    ? '㎡'
                                    : '個'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ¥{option.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              単価: ¥{option.option.unitPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">オプション費用サマリー</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">オプション総額</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ¥{presentation.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">月額増加分（目安）</p>
                  <p className="text-3xl font-bold text-primary">
                    ¥{(presentation.monthlyPayment || 0).toLocaleString()}/月
                  </p>
                  <p className="text-xs text-gray-500 mt-1">※35年ローン、金利1.0%で計算</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>ご注意：</strong>
                表示価格は税込みです。実際の金額は、現場状況や詳細仕様により変動する場合があります。
              </p>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">選択されたオプションはありません</p>
            <p className="text-sm text-gray-500 mt-2">標準仕様でのご提案となります</p>
          </div>
        )}
      </div>
    </A3Page>
  );
}
