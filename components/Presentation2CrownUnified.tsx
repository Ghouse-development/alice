'use client';

import { useEffect, useState } from 'react';
import { Shield, Home, Snowflake, Wind, Clock, Palette, Hammer, Award, Zap, Wifi, ChevronRight, Check } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation2 } from '@/types';

interface Presentation2CrownUnifiedProps {
  projectId: string;
  fixedSlide?: number;
  performanceItems?: any[];
}

// CROWNデザインシステム定数
const CROWN_DESIGN = {
  colors: {
    primary: '#000000',
    secondary: '#1a1a1a',
    accent: '#0066cc',
    gold: '#d4af37',
    text: {
      primary: '#ffffff',
      secondary: '#999999',
      accent: '#0099ff'
    },
    gradients: {
      black: 'bg-gradient-to-b from-black to-gray-900',
      blue: 'bg-gradient-to-br from-blue-900/20 to-blue-800/10',
      dark: 'bg-gradient-to-r from-gray-900 to-black'
    }
  },
  typography: {
    heading: 'font-bold tracking-wider',
    subheading: 'font-light tracking-wide',
    body: 'font-light',
    accent: 'font-medium tracking-widest'
  }
};

const categoryIcons: { [key: string]: any } = {
  '耐震': Shield,
  '断熱・気密': Snowflake,
  '空気質': Wind,
  '空調計画': Wind,
  '耐久性': Clock,
  'デザイン性': Palette,
  '施工品質': Hammer,
  '保証・アフターサービス': Award,
  '省エネ性': Zap,
  '最新テクノロジー（IoT）': Wifi,
};

export default function Presentation2CrownUnified({ projectId, fixedSlide, performanceItems: externalItems }: Presentation2CrownUnifiedProps) {
  const { currentProject } = useStore();
  const [performanceItems, setPerformanceItems] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(fixedSlide ?? 0);

  useEffect(() => {
    if (fixedSlide !== undefined) {
      setCurrentSlide(fixedSlide);
    }
  }, [fixedSlide]);

  useEffect(() => {
    // Use external items if provided (from present-flow)
    if (externalItems && externalItems.length > 0) {
      setPerformanceItems(externalItems);
      return;
    }

    // Otherwise load from localStorage or use defaults
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

    if (currentProject?.presentation2?.performanceItems && currentProject.presentation2.performanceItems.length > 0) {
      setPerformanceItems(currentProject.presentation2.performanceItems);
    } else {
      const items = defaultItems.length > 0 ? defaultItems : [
        { id: '1', category: '耐震', title: '最高等級の耐震性能×evoltz制震システム', description: '地震の揺れを最大45%低減', priority: 1 },
        { id: '2', category: '断熱・気密', title: 'HEAT20 G2グレードの高断熱・高気密設計', description: 'UA値0.46以下、C値0.5以下を実現', priority: 2 },
        { id: '3', category: '空気質', title: '清潔空気システム', description: 'PM2.5、花粉を99.8%カット', priority: 3 },
        { id: '4', category: '空調計画', title: '24時間全熱交換換気システム', description: '熱ロスを最小限に抑え省エネと快適性を両立', priority: 4 },
        { id: '5', category: '耐久性', title: '長期優良住宅認定・100年住宅', description: '劣化対策等級3、維持管理対策等級3', priority: 5 },
        { id: '6', category: 'デザイン性', title: '洗練された外観と機能美の融合', description: '街並みに調和しながらも個性的な外観デザイン', priority: 6 },
        { id: '7', category: '施工品質', title: '自社大工による匠の技術', description: '第三者機関による10回検査', priority: 7 },
        { id: '8', category: '保証・アフターサービス', title: '業界最長クラスの安心保証', description: '構造躯体35年保証、防水20年保証', priority: 8 },
        { id: '9', category: '省エネ性', title: 'ZEH基準を超える省エネ性能', description: '太陽光発電5.5kW標準搭載', priority: 9 },
        { id: '10', category: '最新テクノロジー（IoT）', title: 'スマートホーム標準装備', description: 'Google Home/Alexa対応', priority: 10 },
      ];
      setPerformanceItems(items);
    }
  }, [currentProject, projectId, externalItems]);

  const renderSlide = () => {
    if (!performanceItems || !performanceItems[currentSlide]) return null;
    const item = performanceItems[currentSlide];
    const Icon = categoryIcons[item.category] || Shield;

    // CROWNカタログ統一デザインテンプレート
    return (
      <div className="h-full bg-black text-white relative overflow-hidden">
        {/* 背景パターン */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.03) 100px, rgba(255,255,255,0.03) 101px)`,
          }} />
        </div>

        {/* ヘッダー - CROWN共通スタイル */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <span className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase">Excellence</span>
                <span className="text-xs font-bold tracking-[0.3em] text-white uppercase border-b-2 border-blue-500 pb-1">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-6xl font-thin text-gray-700">/</span>
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  {String(item.priority).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツ - CROWN共通レイアウト */}
        <div className="relative px-8 py-6 h-[calc(100%-80px)]">
          <div className="grid grid-cols-5 gap-8 h-full">
            {/* 左側：メインビジュアル＆タイトル */}
            <div className="col-span-2 flex flex-col justify-center">
              <div className="space-y-8">
                {/* アイコン */}
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Icon className="w-16 h-16 text-blue-400" />
                  </div>
                </div>

                {/* タイトル */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-wide leading-tight">
                    {item.category}
                  </h1>
                  <p className="text-lg text-gray-400 font-light">
                    {item.title}
                  </p>
                </div>

                {/* サブテキスト */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* 右側：詳細情報 - CROWN POINTカード風 */}
            <div className="col-span-3 grid grid-cols-2 gap-6 content-center">
              {getDetailCards(item.category).map((card, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                  <div className="relative bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="text-blue-500 text-3xl font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium mb-2 text-white">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {card.description}
                        </p>
                        {card.value && (
                          <div className="mt-3 pt-3 border-t border-gray-800">
                            <span className="text-2xl font-bold text-blue-400">
                              {card.value}
                            </span>
                            {card.unit && (
                              <span className="text-sm text-gray-500 ml-1">
                                {card.unit}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* フッター情報 */}
          <div className="absolute bottom-8 left-12 right-12">
            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <div className="flex items-center gap-6">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-sm text-gray-400">G-HOUSE PREMIUM STANDARD</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-sm">詳細を見る</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // カテゴリごとの詳細カード情報
  const getDetailCards = (category: string) => {
    const cards: { [key: string]: Array<{ title: string; description: string; value?: string; unit?: string }> } = {
      '耐震': [
        { title: 'evoltz制震ダンパー', description: 'ビルシュタイン社と共同開発。地震エネルギーを吸収', value: '45%', unit: '揺れ低減' },
        { title: '耐震等級3', description: '建築基準法の1.5倍の地震力に耐える最高等級', value: '等級3', unit: '最高等級' },
        { title: '基礎構造', description: 'ベタ基礎工法で建物全体を面で支える', value: '150mm', unit: '基礎厚' },
        { title: '構造計算', description: '全棟構造計算を実施し安全性を確認', value: '100%', unit: '実施率' },
      ],
      '断熱・気密': [
        { title: '断熱性能 UA値', description: 'HEAT20 G2グレード、北海道基準をクリア', value: '0.46', unit: 'W/㎡K' },
        { title: '気密性能 C値', description: '全棟気密測定実施、業界トップクラス', value: '0.5', unit: '㎠/㎡' },
        { title: '窓性能', description: 'トリプルガラス樹脂サッシ標準採用', value: 'U値1.0', unit: 'W/㎡K' },
        { title: '断熱材', description: '高性能グラスウール＋付加断熱', value: '210mm', unit: '断熱厚' },
      ],
      '空気質': [
        { title: '換気システム', description: '第一種熱交換換気で常に新鮮な空気を供給', value: '24時間', unit: '連続換気' },
        { title: 'フィルター性能', description: 'PM2.5、花粉、ウイルスを高効率除去', value: '99.8%', unit: 'カット率' },
        { title: '湿度管理', description: '全熱交換で湿度も適切にコントロール', value: '40-60%', unit: '快適湿度' },
        { title: 'VOC対策', description: 'F☆☆☆☆建材使用で化学物質を最小限に', value: 'F☆☆☆☆', unit: '最高等級' },
      ],
      '空調計画': [
        { title: '全館空調', description: '家中どこでも快適な温度を実現', value: '±2℃', unit: '温度差' },
        { title: '省エネ性', description: '高効率エアコンで電気代を削減', value: '40%', unit: '削減率' },
        { title: 'ゾーニング', description: '部屋ごとの温度調整が可能', value: '各室', unit: '個別制御' },
        { title: '床暖房対応', description: '輻射熱で足元から暖かく', value: '全室', unit: '対応可能' },
      ],
      '耐久性': [
        { title: '構造躯体', description: '劣化対策等級3で100年以上の耐久性', value: '100年', unit: '耐用年数' },
        { title: '防腐防蟻', description: '加圧注入材使用で腐朽菌・シロアリ対策', value: '20年', unit: '保証期間' },
        { title: '外壁材', description: '高耐久サイディングで美観を長期維持', value: '30年', unit: 'メンテナンス' },
        { title: '屋根材', description: '陶器瓦またはガルバリウム鋼板', value: '50年', unit: '耐用年数' },
      ],
      'デザイン性': [
        { title: '外観デザイン', description: '建築家監修による洗練されたファサード', value: '10種', unit: 'バリエーション' },
        { title: '内装仕上げ', description: '自然素材を活かした上質な空間', value: '無垢材', unit: '標準仕様' },
        { title: '照明計画', description: '間接照明で演出する落ち着いた雰囲気', value: 'LED', unit: '全室標準' },
        { title: 'カラーコーディネート', description: 'インテリアコーディネーター提案', value: '3案', unit: '無料提案' },
      ],
      '施工品質': [
        { title: '自社大工', description: '経験豊富な専属大工による丁寧な施工', value: '平均15年', unit: '経験年数' },
        { title: '検査体制', description: '第三者機関による厳格な品質検査', value: '10回', unit: '検査回数' },
        { title: '施工管理', description: '専任監督による工程・品質管理', value: '専任', unit: '担当制' },
        { title: '施工記録', description: 'クラウドで施工写真を共有', value: '500枚', unit: '記録写真' },
      ],
      '保証・アフターサービス': [
        { title: '構造躯体保証', description: '業界最長クラスの長期保証', value: '35年', unit: '保証期間' },
        { title: '防水保証', description: '屋根・外壁の防水性能を長期保証', value: '20年', unit: '保証期間' },
        { title: '定期点検', description: '専門スタッフによる定期メンテナンス', value: '50年', unit: '点検プログラム' },
        { title: '24時間対応', description: '緊急時のコールセンター対応', value: '365日', unit: '24時間' },
      ],
      '省エネ性': [
        { title: '太陽光発電', description: '高効率パネルで電気代を大幅削減', value: '5.5kW', unit: '標準搭載' },
        { title: 'HEMS', description: 'エネルギー使用量の見える化', value: '標準', unit: '装備' },
        { title: 'ZEH基準', description: 'ネット・ゼロ・エネルギー・ハウス', value: '120%', unit: '削減率' },
        { title: '光熱費削減', description: '年間光熱費を大幅に削減', value: '50%', unit: '削減可能' },
      ],
      '最新テクノロジー（IoT）': [
        { title: 'スマートホーム', description: 'Google Home/Alexa完全対応', value: '音声', unit: '操作対応' },
        { title: 'スマートロック', description: 'スマホで玄関の施錠・解錠', value: '顔認証', unit: '対応' },
        { title: '見守りカメラ', description: '外出先から自宅の様子を確認', value: 'クラウド', unit: '録画' },
        { title: '家電制御', description: 'エアコン・照明を遠隔操作', value: 'WiFi', unit: '全室対応' },
      ],
    };

    return cards[category] || cards['耐震'];
  };

  if (!performanceItems || performanceItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-black text-white">
        <p className="text-gray-500">データを読み込んでいます...</p>
      </div>
    );
  }

  return renderSlide();
}

export { Presentation2CrownUnified };