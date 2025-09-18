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
import { EarthquakeResistanceSlide } from './EarthquakeResistanceSlide';
import type { Presentation2, PerformanceItem } from '@/types';

interface Presentation2ViewProps {
  projectId: string;
  fixedSlide?: number;
  performanceItems?: PerformanceItem[];
}

const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
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

export function Presentation2View({
  projectId,
  fixedSlide,
  performanceItems: externalItems,
}: Presentation2ViewProps) {
  const { currentProject } = useStore();
  const [presentation, setPresentation] = useState<Presentation2 | null>(null);
  const [currentSlide, setCurrentSlide] = useState(fixedSlide ?? 0);

  useEffect(() => {
    if (fixedSlide !== undefined) {
      setCurrentSlide(fixedSlide);
    }
  }, [fixedSlide]);

  useEffect(() => {
    // 管理者が設定したコンテンツを取得
    const savedContents = localStorage.getItem('presentation2Contents');
    let defaultItems = [];

    if (savedContents) {
      try {
        const contents = JSON.parse(savedContents);
        defaultItems = contents.map((content: PerformanceItem, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
          contentType: (content as any).contentType,
          customComponent: (content as any).customComponent,
        }));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }

    if (
      currentProject?.presentation2?.performanceItems &&
      currentProject.presentation2.performanceItems.length > 0
    ) {
      setPresentation(currentProject.presentation2);
    } else {
      // デフォルトデータで初期化
      const defaultPresentation: Presentation2 = {
        id: `pres2-${Date.now()}`,
        projectId,
        performanceItems:
          defaultItems.length > 0
            ? defaultItems
            : [
                {
                  id: '1',
                  category: '耐震',
                  title: '最高等級の耐震性能×evoltz制震システム',
                  description:
                    'ビルシュタイン社と共同開発したevoltz制震ダンパーにより、地震の揺れを最大45%低減。耐震等級3と制震技術の組み合わせで、大地震後も住み続けられる安心を提供します。',
                  priority: 1,
                },
                {
                  id: '2',
                  category: '断熱・気密',
                  title: 'HEAT20 G2グレードの高断熱・高気密設計',
                  description:
                    'UA値0.46以下、C値0.5以下を実現。北海道基準の断熱性能により、夏涼しく冬暖かい快適な住環境を一年中提供します。',
                  priority: 2,
                },
                {
                  id: '3',
                  category: '空気質',
                  title: '清潔空気システム',
                  description:
                    '高性能フィルターでPM2.5、花粉を99.8%カット。常に新鮮で清潔な空気を供給し、アレルギー対策にも効果的です。',
                  priority: 3,
                },
                {
                  id: '4',
                  category: '空調計画',
                  title: '24時間全熱交換換気システム',
                  description:
                    '第一種換気システムで熱ロスを最小限に抑え、省エネと快適性を両立。湿度調整機能で結露も防止します。',
                  priority: 4,
                },
                {
                  id: '5',
                  category: '耐久性',
                  title: '長期優良住宅認定・100年住宅',
                  description:
                    '劣化対策等級3、維持管理対策等級3を取得。構造踯体は100年以上の耐久性を実現し、メンテナンスコストも大幅削減。',
                  priority: 5,
                },
                {
                  id: '6',
                  category: 'デザイン性',
                  title: '洗練された外観と機能美の融合',
                  description:
                    '建築家とのコラボレーションにより、街並みに調和しながらも個性的な外観デザインを実現。採光と通風を考慮した美しく機能的な設計。',
                  priority: 6,
                },
                {
                  id: '7',
                  category: '施工品質',
                  title: '自社大工による匠の技術',
                  description:
                    '経験豊富な自社大工による丁寧な施工。第三者機関による10回検査と、施工中の見える化により、最高品質を保証します。',
                  priority: 7,
                },
                {
                  id: '8',
                  category: '保証・アフターサービス',
                  title: '業界最長クラスの安心保証',
                  description:
                    '構造踯体35年保証、防水20年保証、シロアリ10年保証。24時間365日の緊急対応と、50年間の定期点検プログラムで末長く安心。',
                  priority: 8,
                },
                {
                  id: '9',
                  category: '省エネ性',
                  title: 'ZEH基準を超える省エネ性能',
                  description:
                    '太陽光発電5.5kW標準搭載、HEMS導入により光熱費。50%以上削減。売電収入と合わせて実質光熱費ゼロも実現可能です。',
                  priority: 9,
                },
                {
                  id: '10',
                  category: '最新テクノロジー（IoT）',
                  title: 'スマートホーム標準装備',
                  description:
                    'Google Home/Alexa対応、スマートロック、見守りカメラ、遠隔家電操作など、最新のIoT技術で快適で安全な暮らしをサポート。',
                  priority: 10,
                },
              ],
        sortedOrder:
          defaultItems.length > 0
            ? defaultItems.map((item: PerformanceItem) => item.id)
            : undefined,
      };
      setPresentation(defaultPresentation);
    }

    // 外部から渡されたアイテムを使用
    if (externalItems && externalItems.length > 0) {
      setPresentation({
        id: `pres2-external-${Date.now()}`,
        projectId,
        performanceItems: externalItems,
      });
    }
  }, [currentProject, projectId, externalItems]);

  if (
    !presentation ||
    !presentation.performanceItems ||
    presentation.performanceItems.length === 0
  ) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">プレゼンテーション2のデータを読み込み中...</p>
      </div>
    );
  }

  const currentItem = presentation.performanceItems[currentSlide];
  const Icon = categoryIcons[currentItem.category] || Home;

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
        transformOrigin: 'center center',
      }}
    >
      {/* スライドナビゲーション - フロー表示の場合は非表示 */}
      {fixedSlide === undefined && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">住宅性能のご説明</h2>
            <span className="text-lg text-gray-600">
              {currentSlide + 1} / {presentation.performanceItems.length}
            </span>
          </div>

          {/* スライドインジケーター */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {presentation.performanceItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentSlide(index)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  index === currentSlide
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {String(index + 1).padStart(2, '0')}. {item.category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* メインスライド - A3横サイズを意識したレイアウト */}
      <div
        className={`${fixedSlide !== undefined ? 'w-full h-full' : 'flex-1'} bg-white ${fixedSlide === undefined ? 'rounded-lg border-2 border-gray-200' : ''} overflow-hidden`}
        style={
          fixedSlide !== undefined
            ? { width: '100%', height: '100%' }
            : { aspectRatio: '1.414 / 1' }
        }
      >
        {currentItem.category === '耐震' && !currentItem.images?.length ? (
          // 耐震カテゴリの専用スライド
          <EarthquakeResistanceSlide />
        ) : currentItem.images && currentItem.images.length > 0 ? (
          // スライド画像がある場合は画像を表示
          <div className="w-full h-full">
            {currentItem.images[0].includes('pdf') ? (
              <iframe
                src={currentItem.images[0]}
                className="w-full h-full"
                title={currentItem.title}
              />
            ) : (
              <img
                src={currentItem.images[0]}
                alt={currentItem.title}
                className="img-responsive block"
              />
            )}
          </div>
        ) : (
          // スライド画像がない場合はデフォルトレイアウト
          <div className="h-full flex flex-col">
            {/* ヘッダー */}
            <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl font-bold">
                      {String(currentSlide + 1).padStart(2, '0')}
                    </span>
                    <div className="w-1 h-12 bg-white/30" />
                    <span className="text-2xl font-medium">{currentItem.category}</span>
                  </div>
                  <h3 className="text-3xl font-bold">{currentItem.title}</h3>
                </div>
              </div>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 p-12 flex items-center">
              <div className="max-w-4xl">
                <p className="text-xl leading-relaxed text-gray-700">{currentItem.description}</p>

                {/* 断熱・気密性能詳細レイアウト */}
                {currentItem.category === '断熱・気密' && (
                  <div className="mt-6 -mx-12">
                    {/* メインビジュアル */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-600 to-cyan-500 overflow-hidden">
                      <div className="absolute inset-0 bg-white/10" />
                      <div className="relative z-10 h-full flex items-center justify-between px-12">
                        <div className="text-white max-w-lg">
                          <div className="text-sm font-medium mb-2 tracking-wider">
                            THERMAL INSULATION
                          </div>
                          <h2 className="text-4xl font-bold mb-3">HEAT20 G2グレード</h2>
                          <p className="text-lg opacity-90">北海道基準の高断熱・高気密性能</p>
                        </div>
                        <div className="flex gap-6">
                          <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg text-center">
                            <div className="text-4xl font-bold text-white">UA値</div>
                            <div className="text-3xl font-bold text-white mt-1">0.46</div>
                            <div className="text-xs text-white/80 mt-1">W/㎡・K</div>
                          </div>
                          <div className="bg-white/20 backdrop-blur px-6 py-4 rounded-lg text-center">
                            <div className="text-4xl font-bold text-white">C値</div>
                            <div className="text-3xl font-bold text-white mt-1">0.5</div>
                            <div className="text-xs text-white/80 mt-1">㎠/㎡</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 詳細情報グリッド */}
                    <div className="grid grid-cols-3 gap-0">
                      <div className="bg-gray-50 p-6 border-r border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">断熱材仕様</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex justify-between">
                            <span>天井</span>
                            <span className="font-medium">300mm</span>
                          </li>
                          <li className="flex justify-between">
                            <span>外壁</span>
                            <span className="font-medium">120mm</span>
                          </li>
                          <li className="flex justify-between">
                            <span>床下</span>
                            <span className="font-medium">100mm</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-white p-6 border-r border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">窓性能</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">樹脂サッシ</p>
                            <p className="text-xs text-gray-600">Low-E複層ガラス</p>
                          </div>
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-sm font-bold text-blue-600">U値 1.3W/㎡・K</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-white p-6">
                        <h4 className="font-bold text-gray-900 mb-3">快適性能</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">●</span>
                            <span>室温差±2℃以内</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">●</span>
                            <span>結露防止</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">●</span>
                            <span>防音性能向上</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 省エネ性能詳細レイアウト */}
                {currentItem.category === '省エネ性' && (
                  <div className="mt-6 -mx-12">
                    {/* メインビジュアル */}
                    <div className="relative h-56 bg-gradient-to-br from-green-600 to-emerald-500 overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        }}
                      />
                      <div className="relative z-10 h-full flex items-center justify-between px-12">
                        <div className="text-white max-w-lg">
                          <div className="text-sm font-medium mb-2 tracking-wider">
                            ZERO ENERGY HOUSE
                          </div>
                          <h2 className="text-4xl font-bold mb-3">ZEH基準適合住宅</h2>
                          <p className="text-lg opacity-90">創エネと省エネでエネルギー収支ゼロ</p>
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 backdrop-blur px-8 py-6 rounded-lg">
                            <div className="text-6xl font-bold text-white">50%</div>
                            <div className="text-sm text-white/90 mt-2">年間光熱費削減</div>
                            <div className="text-2xl font-bold text-yellow-300 mt-3">★★★★★</div>
                            <div className="text-xs text-white/80">BELS最高ランク</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 詳細情報グリッド */}
                    <div className="grid grid-cols-4 gap-0">
                      <div className="bg-gray-50 p-6 border-r border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">太陽光発電</h4>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-gray-900">5.5kW</div>
                          <p className="text-sm text-gray-600">搭載容量</p>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500">年間発電量</p>
                            <p className="text-lg font-bold">6,600kWh</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white p-6 border-r border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">高効率設備</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>エコキュート</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>LED照明</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>高効率エアコン</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span>節水設備</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-white p-6 border-r border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-3">経済メリット</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-600">年間光熱費</p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-green-600">12万円</span>
                              <span className="text-sm text-gray-500 line-through">24万円</span>
                            </div>
                          </div>
                          <div className="bg-green-100 rounded p-2">
                            <p className="text-xs font-medium text-green-800">売電収入</p>
                            <p className="text-lg font-bold text-green-700">+8万円/年</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-900 text-white p-6">
                        <h4 className="font-bold mb-3">HEMS</h4>
                        <p className="text-xs opacity-80 mb-3">エネルギー管理システム</p>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <span className="text-yellow-400 mr-2">✓</span>
                            <span className="text-xs">リアルタイム監視</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-yellow-400 mr-2">✓</span>
                            <span className="text-xs">自動最適制御</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-yellow-400 mr-2">✓</span>
                            <span className="text-xs">スマホ連携</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* フッター */}
            <div className="border-t bg-gray-50 px-12 py-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">Gハウス 住宅性能説明資料</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    前へ
                  </button>
                  <button
                    onClick={() =>
                      setCurrentSlide(
                        Math.min(presentation.performanceItems.length - 1, currentSlide + 1)
                      )
                    }
                    disabled={currentSlide === presentation.performanceItems.length - 1}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    次へ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 補足情報 */}
      <div className="mt-6 text-center text-sm text-gray-600">
        ※ 上記の性能値は標準仕様での数値です。プランや仕様により変動する場合があります。
      </div>
    </div>
  );
}
