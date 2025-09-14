'use client';

import { useEffect, useState } from 'react';
import { Shield, Clock, Phone, Home, Wrench, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation5 } from '@/types';

interface Presentation5ViewProps {
  projectId: string;
}

export function Presentation5View({ projectId }: Presentation5ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation5 | null>(null);

  useEffect(() => {
    if (currentProject?.presentation5) {
      setPresentation(currentProject.presentation5);
    }
  }, [currentProject]);

  if (!presentation || !presentation.afterServiceItems) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">プレゼンテーション5のデータがありません</p>
      </div>
    );
  }

  const getIcon = (title: string) => {
    if (title.includes('点検')) return Clock;
    if (title.includes('緊急') || title.includes('24時間')) return Phone;
    if (title.includes('保証')) return Shield;
    if (title.includes('コンシェルジュ')) return Wrench;
    if (title.includes('イベント')) return Home;
    return CheckCircle;
  };

  return (
    <div
      className="relative bg-black text-white overflow-hidden"
      style={{
        width: '1190px', // A3横の基準幅(px) - PresentationContainerと統一
        height: '842px', // A3横の基準高さ(px) - PresentationContainerと統一
        maxWidth: '100%',
        maxHeight: '100%',
        margin: '0 auto',
        aspectRatio: '1.414 / 1', // A3横比率を明示
        transformOrigin: 'center center'
      }}
    >
      {/* 背景パターン */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(196,30,58,0.03) 50px, rgba(196,30,58,0.03) 51px),
              repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(184,134,11,0.02) 50px, rgba(184,134,11,0.02) 51px)
            `,
          }} />
        </div>
      </div>

      <div className="relative p-8 space-y-8 overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">光熱費・ランニングコスト</h2>
        <p className="text-gray-300 mb-4">
          お引き渡し後も安心してお住まいいただけるよう、充実したサポート体制をご用意しています
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {presentation.afterServiceItems.map((item, index) => {
          const Icon = getIcon(item.title);
          return (
            <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                    {item.period && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                        {item.period}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
                {item.images && item.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {item.images.map((image, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={image}
                        alt={`${item.title}-${imgIndex + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">
          <Shield className="inline-block mr-2 h-6 w-6" />
          保証期間一覧
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {presentation.afterServiceItems
            .filter((item) => item.period && item.period !== '永年')
            .sort((a, b) => {
              const getYears = (period: string) => {
                const match = period.match(/(\d+)/);
                return match ? parseInt(match[1]) : 0;
              };
              return getYears(b.period) - getYears(a.period);
            })
            .map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-700">{item.title}</span>
                <span className="text-lg font-bold text-green-600">{item.period}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Gハウスの約束</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">お客様の大切な住まいを長期にわたってサポートします</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">定期的な点検とメンテナンスで、住まいの価値を維持します</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">困った時はいつでもご相談いただける体制を整えています</span>
          </li>
        </ul>
      </div>

      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">安心の住まいづくり</h3>
        <p className="text-gray-600">
          Gハウスは、お客様との末永いお付き合いをお約束します
        </p>
      </div>
    </div>
  );
}