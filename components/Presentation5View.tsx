'use client';

import { useEffect, useState } from 'react';
import { Shield, CheckCircle, Clock, Phone, Wrench, Home } from 'lucide-react';
import { useStore } from '@/lib/store';
import A3Page from './A3Page';
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
    } else {
      // デフォルトデータ
      setPresentation({
        afterServiceItems: [
          {
            id: '1',
            title: '定期点検プログラム',
            description:
              '専門スタッフによる定期的な点検で、住まいの状態を詳しくチェック。早期発見・早期対応で長く快適にお住まいいただけます。',
            schedule: ['3ヶ月点検', '1年点検', '2年点検', '5年点検', '10年点検'],
          },
          {
            id: '2',
            title: '24時間緊急対応',
            description: '水漏れや設備の故障など、緊急時には24時間365日対応いたします。',
            schedule: ['緊急コールセンター', '専門スタッフ派遣', '即日対応可能'],
          },
          {
            id: '3',
            title: '長期保証制度',
            description: '構造躯体は35年、防水は20年など、充実の保証制度で安心をお約束。',
            schedule: ['構造躯体：35年保証', '防水：20年保証', '設備：最大10年保証'],
          },
          {
            id: '4',
            title: '住まいのコンシェルジュ',
            description:
              'メンテナンスや増改築のご相談など、お住まいに関することは何でもご相談ください。',
            schedule: ['リフォーム相談', 'メンテナンスアドバイス', 'ライフスタイル提案'],
          },
          {
            id: '5',
            title: 'オーナー様限定イベント',
            description: '定期的なイベントや情報交換会で、オーナー様同士の交流の場をご提供。',
            schedule: ['季節のイベント', '住まいのセミナー', 'キッズワークショップ'],
          },
        ],
      });
    }
  }, [currentProject, projectId]);

  if (!presentation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">データを読み込んでいます...</p>
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
    <A3Page
      title="アフターサービス"
      subtitle="お引き渡し後も安心してお住まいいただける充実のサポート"
      showFooter={false}
    >
      <div className="w-full h-full p-8 space-y-8 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {presentation.afterServiceItems.map((item) => {
            const Icon = getIcon(item.title);
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    {item.schedule && (
                      <ul className="space-y-1">
                        {item.schedule.map((schedule, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{schedule}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Gハウスの5つの約束</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span className="text-white/90">定期的な点検で住まいの健康を守ります</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span className="text-white/90">緊急時には24時間365日対応いたします</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span className="text-white/90">長期保証で大切な資産を守ります</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span className="text-white/90">ライフスタイルの変化にも柔軟に対応します</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                5
              </span>
              <span className="text-white/90">オーナー様との絆を大切にします</span>
            </li>
          </ul>
        </div>

        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">安心の住まいづくり</h3>
          <p className="text-gray-600">Gハウスは、お客様との末永いお付き合いをお約束します</p>
        </div>
      </div>
    </A3Page>
  );
}
