'use client';

import { useEffect, useState } from 'react';
import {
  Shield,
  Home,
  Snowflake,
  Wind,
  Clock,
  Palette,
  Hammer,
  Award,
  Zap,
  Wifi,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation2 } from '@/types';
import A3Page from './A3Page';
import { A3Grid, A3Card } from './A3ViewportContainer';

interface Presentation2CrownUnifiedProps {
  projectId: string;
  fixedSlide?: number;
  performanceItems?: any[];
}

const categoryIcons: { [key: string]: any } = {
  耐震: Shield,
  '断熱・気密': Snowflake,
  空気質: Wind,
  空調計画: Wind,
  耐久性: Clock,
  デザイン性: Palette,
  施工品質: Hammer,
  '保証・アフターサービス': Award,
  省エネ性: Zap,
  '最新テクノロジー（IoT）': Wifi,
};

export default function Presentation2CrownUnified({
  projectId,
  fixedSlide,
  performanceItems: externalItems,
}: Presentation2CrownUnifiedProps) {
  const { currentProject } = useStore();
  const [performanceItems, setPerformanceItems] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(fixedSlide ?? 0);

  useEffect(() => {
    if (fixedSlide !== undefined) {
      setCurrentSlide(fixedSlide);
    }
  }, [fixedSlide]);

  useEffect(() => {
    if (externalItems && externalItems.length > 0) {
      setPerformanceItems(externalItems);
      return;
    }

    const savedContents = localStorage.getItem('presentation2Contents');
    let defaultItems = [];

    if (savedContents) {
      try {
        const contents = JSON.parse(savedContents);
        defaultItems = contents.map((content: any, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
        }));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }

    if (
      currentProject?.presentation2?.performanceItems &&
      currentProject.presentation2.performanceItems.length > 0
    ) {
      setPerformanceItems(currentProject.presentation2.performanceItems);
    } else {
      const items =
        defaultItems.length > 0
          ? defaultItems
          : [
              {
                id: '1',
                category: '耐震',
                title: '最高等級の耐震性能×evoltz制震システム',
                description: '地震の揺れを最大45%低減',
                priority: 1,
              },
              {
                id: '2',
                category: '断熱・気密',
                title: 'HEAT20 G2グレードの高断熱・高気密設計',
                description: 'UA値0.46以下、C値0.5以下を実現',
                priority: 2,
              },
              {
                id: '3',
                category: '空気質',
                title: '清潔空気システム',
                description: 'PM2.5、花粉を99.8%カット',
                priority: 3,
              },
              {
                id: '4',
                category: '空調計画',
                title: '24時間全熱交換換気システム',
                description: '熱ロスを最小限に抑え省エネと快適性を両立',
                priority: 4,
              },
              {
                id: '5',
                category: '耐久性',
                title: '長期優良住宅認定・100年住宅',
                description: '劣化対策等級3、維持管理対策等級3',
                priority: 5,
              },
              {
                id: '6',
                category: 'デザイン性',
                title: '洗練された外観と機能美の融合',
                description: '街並みに調和しながらも個性的な外観デザイン',
                priority: 6,
              },
              {
                id: '7',
                category: '施工品質',
                title: '自社大工による匠の技術',
                description: '第三者機関による10回検査',
                priority: 7,
              },
              {
                id: '8',
                category: '保証・アフターサービス',
                title: '業界最長クラスの安心保証',
                description: '構造躯体35年保証、防水20年保証',
                priority: 8,
              },
              {
                id: '9',
                category: '省エネ性',
                title: 'ZEH基準を超える省エネ性能',
                description: '太陽光発電5.5kW標準搭載',
                priority: 9,
              },
              {
                id: '10',
                category: '最新テクノロジー（IoT）',
                title: 'スマートホーム標準装備',
                description: 'Google Home/Alexa対応',
                priority: 10,
              },
            ];
      setPerformanceItems(items);
    }
  }, [currentProject, projectId, externalItems]);

  const renderSlide = () => {
    if (!performanceItems || !performanceItems[currentSlide]) return null;
    const item = performanceItems[currentSlide];
    const Icon = categoryIcons[item.category] || Shield;

    return (
      <A3Page title={item.category} subtitle={item.title}>
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '8mm' }}>
          {/* 左側：メインビジュアル＆タイトル */}
          <div
            style={{
              flex: '0 0 30%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '6mm',
            }}
          >
            {/* アイコン */}
            <div className="text-center">
              <div
                style={{
                  display: 'inline-flex',
                  width: '30mm',
                  height: '30mm',
                  backgroundColor: 'white',
                  border: '2px solid #c41e3a',
                  borderRadius: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 8px rgba(196,30,58,0.2)',
                }}
              >
                <Icon className="text-primary" style={{ width: '15mm', height: '15mm' }} />
              </div>
            </div>

            {/* 説明 */}
            <div className="content-card" style={{ borderLeft: '3mm solid #c41e3a' }}>
              <p className="text-normal">{item.description}</p>
            </div>
          </div>

          {/* 右側：詳細情報 */}
          <div style={{ flex: '1', overflow: 'auto' }}>
            <A3Grid columns={2}>
              {getDetailCards(item.category).map((card, index) => (
                <A3Card key={index}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '4mm' }}>
                    <div
                      style={{
                        flexShrink: 0,
                        width: '10mm',
                        height: '10mm',
                        backgroundColor: '#fee',
                        color: '#c41e3a',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12pt',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3
                        className="text-normal"
                        style={{ fontWeight: 'bold', marginBottom: '2mm' }}
                      >
                        {card.title}
                      </h3>
                      <p className="text-small text-secondary" style={{ marginBottom: '3mm' }}>
                        {card.description}
                      </p>
                      {card.value && (
                        <div style={{ paddingTop: '3mm', borderTop: '1px solid #f0f0f0' }}>
                          <span className="text-large text-primary" style={{ fontWeight: 'bold' }}>
                            {card.value}
                          </span>
                          {card.unit && (
                            <span
                              className="text-small text-secondary"
                              style={{ marginLeft: '2mm' }}
                            >
                              {card.unit}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </A3Card>
              ))}
            </A3Grid>
          </div>
        </div>
      </A3Page>
    );
  };

  // カテゴリごとの詳細カード情報
  const getDetailCards = (category: string) => {
    const cards: {
      [key: string]: Array<{ title: string; description: string; value?: string; unit?: string }>;
    } = {
      耐震: [
        {
          title: 'evoltz制震ダンパー',
          description: 'ビルシュタイン社と共同開発',
          value: '45%',
          unit: '揺れ低減',
        },
        {
          title: '耐震等級3',
          description: '建築基準法の1.5倍の地震力に耐える',
          value: '等級3',
          unit: '最高等級',
        },
        {
          title: '基礎構造',
          description: 'ベタ基礎工法で建物全体を支える',
          value: '150mm',
          unit: '基礎厚',
        },
        { title: '構造計算', description: '全棟構造計算を実施', value: '100%', unit: '実施率' },
      ],
      '断熱・気密': [
        { title: '断熱性能', description: 'HEAT20 G2グレード', value: '0.46', unit: 'UA値' },
        { title: '気密性能', description: '全棟気密測定実施', value: '0.5', unit: 'C値' },
        { title: '窓性能', description: 'トリプルガラス樹脂サッシ', value: '1.0', unit: 'U値' },
        { title: '断熱材', description: '高性能グラスウール', value: '210mm', unit: '厚さ' },
      ],
      空気質: [
        {
          title: '換気システム',
          description: '第一種熱交換換気',
          value: '24時間',
          unit: '連続換気',
        },
        { title: 'フィルター', description: 'PM2.5・花粉除去', value: '99.8%', unit: 'カット率' },
        { title: '湿度管理', description: '全熱交換で適切制御', value: '40-60%', unit: '快適湿度' },
        { title: 'VOC対策', description: 'F☆☆☆☆建材使用', value: 'F☆☆☆☆', unit: '最高等級' },
      ],
      空調計画: [
        { title: '全館空調', description: '家中快適温度', value: '±2℃', unit: '温度差' },
        { title: '省エネ性', description: '高効率エアコン', value: '40%', unit: '削減率' },
        { title: 'ゾーニング', description: '部屋ごと温度調整', value: '各室', unit: '個別制御' },
        { title: '床暖房', description: '輻射熱で快適', value: '全室', unit: '対応可' },
      ],
      耐久性: [
        { title: '構造躯体', description: '劣化対策等級3', value: '100年', unit: '耐用年数' },
        { title: '防腐防蟻', description: '加圧注入材使用', value: '20年', unit: '保証' },
        { title: '外壁材', description: '高耐久サイディング', value: '30年', unit: 'メンテ' },
        { title: '屋根材', description: 'ガルバリウム鋼板', value: '50年', unit: '耐用' },
      ],
      デザイン性: [
        { title: '外観デザイン', description: '建築家監修', value: '10種', unit: 'パターン' },
        { title: '内装仕上げ', description: '自然素材使用', value: '無垢材', unit: '標準' },
        { title: '照明計画', description: '間接照明演出', value: 'LED', unit: '全室' },
        { title: 'カラー', description: 'コーディネート提案', value: '3案', unit: '無料' },
      ],
      施工品質: [
        { title: '自社大工', description: '経験豊富な職人', value: '15年', unit: '平均経験' },
        { title: '検査体制', description: '第三者機関検査', value: '10回', unit: '検査数' },
        { title: '施工管理', description: '専任監督制', value: '専任', unit: '担当' },
        { title: '施工記録', description: 'クラウド共有', value: '500枚', unit: '写真' },
      ],
      '保証・アフターサービス': [
        { title: '構造保証', description: '業界最長クラス', value: '35年', unit: '保証' },
        { title: '防水保証', description: '屋根・外壁', value: '20年', unit: '保証' },
        { title: '定期点検', description: '専門スタッフ', value: '50年', unit: 'プログラム' },
        { title: '24時間対応', description: '緊急コールセンター', value: '365日', unit: '対応' },
      ],
      省エネ性: [
        { title: '太陽光発電', description: '高効率パネル', value: '5.5kW', unit: '標準' },
        { title: 'HEMS', description: 'エネルギー見える化', value: '標準', unit: '装備' },
        { title: 'ZEH基準', description: 'ゼロエネルギー', value: '120%', unit: '削減率' },
        { title: '光熱費', description: '年間削減額', value: '50%', unit: '削減' },
      ],
      '最新テクノロジー（IoT）': [
        { title: 'スマートホーム', description: 'AI音声操作', value: '音声', unit: '対応' },
        { title: 'スマートロック', description: 'スマホ解錠', value: '顔認証', unit: '対応' },
        { title: '見守りカメラ', description: '外出先確認', value: 'クラウド', unit: '録画' },
        { title: '家電制御', description: '遠隔操作', value: 'WiFi', unit: '全室' },
      ],
    };

    return cards[category] || cards['耐震'];
  };

  if (!performanceItems || performanceItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <p className="text-gray-500">データを読み込んでいます...</p>
      </div>
    );
  }

  return renderSlide();
}

export { Presentation2CrownUnified };
