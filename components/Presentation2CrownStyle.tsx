'use client';

import { useEffect, useState } from 'react';
import { Shield, Home, Snowflake, Wind, Clock, Palette, Hammer, Award, Zap, Wifi, Check, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { Presentation2, PerformanceItem } from '@/types';

interface Presentation2CrownStyleProps {
  projectId: string;
  fixedSlide?: number;
  performanceItems?: PerformanceItem[];
}

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

export function Presentation2CrownStyle({ projectId, fixedSlide, performanceItems: externalItems }: Presentation2CrownStyleProps) {
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
        defaultItems = contents.map((content: any, index: number) => ({
          id: content.id,
          category: content.category,
          title: content.title,
          description: content.description,
          priority: index + 1,
          contentType: content.contentType,
          customComponent: content.customComponent,
        }));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }

    if (currentProject?.presentation2?.performanceItems && currentProject.presentation2.performanceItems.length > 0) {
      setPresentation(currentProject.presentation2);
    } else {
      // デフォルトデータで初期化
      const defaultPresentation: Presentation2 = {
        id: `pres2-${Date.now()}`,
        projectId,
        performanceItems: defaultItems.length > 0 ? defaultItems : [
          {
            id: '1',
            category: '耐震',
            title: '最高等級の耐震性能',
            description: 'evoltz制震ダンパーと耐震等級3の組み合わせで、大地震後も住み続けられる安心を提供',
            priority: 1,
          },
          {
            id: '2',
            category: '断熱・気密',
            title: 'HEAT20 G2グレード',
            description: 'UA値0.26以下、C値0.3以下を実現。北海道基準を超える高性能',
            priority: 2,
          },
          {
            id: '3',
            category: '空気質',
            title: '第一種熱交換換気システム',
            description: '熱交換効率85%以上、PM2.5を99.97%除去する高性能フィルター搭載',
            priority: 3,
          },
          {
            id: '4',
            category: '空調計画',
            title: '全館空調システム',
            description: '家中どこでも快適温度。エアコン1〜2台で全館快適を実現',
            priority: 4,
          },
          {
            id: '5',
            category: '耐久性',
            title: '長期優良住宅認定',
            description: '構造躯体75年以上の耐久性。メンテナンスコストを大幅削減',
            priority: 5,
          },
          {
            id: '6',
            category: 'デザイン性',
            title: '洗練された外観デザイン',
            description: 'グッドデザイン賞受賞実績。機能美と意匠性の融合',
            priority: 6,
          },
          {
            id: '7',
            category: '施工品質',
            title: '10段階検査システム',
            description: '第三者機関による検査を含む、徹底した品質管理体制',
            priority: 7,
          },
          {
            id: '8',
            category: '保証・アフターサービス',
            title: '最長60年保証システム',
            description: '初期保証20年、定期点検で最長60年まで延長可能',
            priority: 8,
          },
          {
            id: '9',
            category: '省エネ性',
            title: 'ZEH+基準クリア',
            description: '太陽光発電10kW+蓄電池7kWh標準装備。年間光熱費実質ゼロ',
            priority: 9,
          },
          {
            id: '10',
            category: '最新テクノロジー（IoT）',
            title: '完全IoT住宅',
            description: 'Google Home/Alexa対応。スマートロック、見守りカメラ標準装備',
            priority: 10,
          }
        ],
        sortedOrder: defaultItems.length > 0 ? defaultItems.map((item: PerformanceItem) => item.id) : undefined
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

  if (!presentation || !presentation.performanceItems || presentation.performanceItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">プレゼンテーション2のデータを読み込み中...</p>
      </div>
    );
  }

  const currentItem = presentation.performanceItems[currentSlide];
  const Icon = categoryIcons[currentItem.category] || Home;

  // CROWNカタログ風のスライドコンポーネント
  const renderSlide = () => {
    switch (currentItem.category) {
      case '耐震':
        return <EarthquakeResistanceSlide item={currentItem} />;
      case '断熱・気密':
        return <InsulationSlide item={currentItem} />;
      case '空気質':
        return <AirQualitySlide item={currentItem} />;
      case '空調計画':
        return <AirConditioningSlide item={currentItem} />;
      case '耐久性':
        return <DurabilitySlide item={currentItem} />;
      case 'デザイン性':
        return <DesignSlide item={currentItem} />;
      case '施工品質':
        return <ConstructionQualitySlide item={currentItem} />;
      case '保証・アフターサービス':
        return <WarrantySlide item={currentItem} />;
      case '省エネ性':
        return <EnergySavingSlide item={currentItem} />;
      case '最新テクノロジー（IoT）':
        return <SmartHomeSlide item={currentItem} />;
      default:
        return <DefaultSlide item={currentItem} Icon={Icon} />;
    }
  };

  return (
    <div className="min-h-[600px] flex flex-col bg-gray-50">
      {/* ナビゲーションタブ（CROWN風） */}
      {fixedSlide === undefined && (
        <div className="bg-black text-white">
          <div className="flex items-center">
            <div className="px-6 py-3 bg-gray-900 font-bold text-sm tracking-wider">
              TOP
            </div>
            <div className="flex-1 flex">
              {presentation.performanceItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`px-4 py-3 text-xs font-medium tracking-wider border-r border-gray-800 hover:bg-gray-800 transition-colors ${
                    index === currentSlide ? 'bg-gray-800' : ''
                  }`}
                >
                  {item.category.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="px-6 py-3 text-sm">
              {currentSlide + 1}
            </div>
          </div>
        </div>
      )}

      {/* メインスライド */}
      <div className={`${fixedSlide !== undefined ? 'w-full h-full' : 'flex-1'} bg-white overflow-hidden`}>
        {renderSlide()}
      </div>
    </div>
  );
}

// 耐震性能スライド（CROWN SAFETY風）
function EarthquakeResistanceSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-black text-white">
      {/* ヘッダー */}
      <div className="bg-black px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">FEATURES</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">SAFETY</span>
          </div>
          <span className="text-4xl font-bold">01</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">EARTHQUAKE RESISTANCE</h1>
        <p className="text-xl text-gray-300 mb-12 font-light">先進の守り、最新の運転支援。</p>

        <div className="grid grid-cols-2 gap-12">
          {/* 左側：evoltz制震ダンパー */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl font-bold text-blue-400">POINT</div>
                <div className="text-6xl font-bold">01</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">evoltz制震ダンパー</h3>
              <p className="text-gray-300 mb-6">
                ビルシュタイン社と共同開発した制震ダンパー。地震エネルギーを最大45%吸収し、
                建物の変形を抑制。繰り返しの地震にも効果を発揮し続けます。
              </p>
              <div className="flex items-center gap-2 text-blue-400">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium">100年相当の耐久試験クリア</span>
              </div>
            </div>

            {/* 性能データ */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-sm font-bold text-gray-400 mb-4">PERFORMANCE DATA</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">揺れ低減率</span>
                  <span className="text-2xl font-bold text-white">最大45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">繰り返し耐久回数</span>
                  <span className="text-2xl font-bold text-white">2000回以上</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：耐震等級3 */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl font-bold text-blue-400">POINT</div>
                <div className="text-6xl font-bold">02</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">耐震等級3（最高等級）</h3>
              <p className="text-gray-300 mb-6">
                建築基準法の1.5倍の地震力に耐える構造。消防署や警察署と同等の耐震性能で、
                大地震後も住み続けられる安心を提供します。
              </p>
              <div className="flex items-center gap-2 text-blue-400">
                <ChevronRight className="w-4 h-4" />
                <span className="text-sm font-medium">全棟構造計算実施</span>
              </div>
            </div>

            {/* 技術仕様 */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h4 className="text-sm font-bold text-gray-400 mb-4">TECHNICAL SPECS</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">基礎工法</span>
                  <span className="text-lg font-medium text-white">ベタ基礎</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">構造材</span>
                  <span className="text-lg font-medium text-white">集成材+金物工法</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 断熱・気密性能スライド（CROWN PERFORMANCE風）
function InsulationSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-white">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">PERFORMANCE</span>
          </div>
          <span className="text-4xl font-bold">02</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">INSULATION & AIRTIGHTNESS</h1>
        <p className="text-xl text-gray-600 mb-12">優雅で心地良い走り。</p>

        <div className="grid grid-cols-3 gap-8">
          {/* UA値 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-8 rounded-lg">
            <div className="text-sm font-medium mb-2 opacity-80">断熱性能</div>
            <div className="text-5xl font-bold mb-2">0.26</div>
            <div className="text-sm opacity-80">W/㎡・K</div>
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="text-xs opacity-80 mb-2">HEAT20 G2グレード</div>
              <div className="text-sm font-medium">北海道基準クリア</div>
            </div>
          </div>

          {/* C値 */}
          <div className="bg-gradient-to-br from-green-600 to-green-500 text-white p-8 rounded-lg">
            <div className="text-sm font-medium mb-2 opacity-80">気密性能</div>
            <div className="text-5xl font-bold mb-2">0.3</div>
            <div className="text-sm opacity-80">㎠/㎡</div>
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="text-xs opacity-80 mb-2">全棟気密測定</div>
              <div className="text-sm font-medium">業界トップクラス</div>
            </div>
          </div>

          {/* 断熱等級 */}
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white p-8 rounded-lg">
            <div className="text-sm font-medium mb-2 opacity-80">断熱等級</div>
            <div className="text-5xl font-bold mb-2">7</div>
            <div className="text-sm opacity-80">最高等級</div>
            <div className="mt-6 pt-6 border-t border-white/30">
              <div className="text-xs opacity-80 mb-2">2025年基準</div>
              <div className="text-sm font-medium">最高ランク達成</div>
            </div>
          </div>
        </div>

        {/* 詳細仕様 */}
        <div className="mt-12 bg-gray-100 p-8 rounded-lg">
          <h3 className="text-lg font-bold mb-6">断熱材仕様</h3>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">天井</div>
              <div className="text-2xl font-bold">300mm</div>
              <div className="text-xs text-gray-500">高性能グラスウール</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">外壁</div>
              <div className="text-2xl font-bold">120mm</div>
              <div className="text-xs text-gray-500">発泡ウレタン</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">床下</div>
              <div className="text-2xl font-bold">100mm</div>
              <div className="text-xs text-gray-500">押出法ポリスチレン</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">窓</div>
              <div className="text-2xl font-bold">U値1.3</div>
              <div className="text-xs text-gray-500">樹脂サッシ+Low-E複層</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 空気質スライド
function AirQualitySlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-white to-gray-50">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-medium tracking-widest text-gray-400">FEATURES</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">USABILITY</span>
          </div>
          <span className="text-4xl font-bold">03</span>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">AIR QUALITY SYSTEM</h1>
        <p className="text-xl text-gray-600 mb-12">移動を、日々の癒しへ。</p>

        <div className="grid grid-cols-2 gap-12">
          {/* 第一種換気システム */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Wind className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">第一種熱交換換気</h3>
                <p className="text-sm text-gray-600">24時間クリーンな空気環境</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">熱交換効率85%以上</p>
                  <p className="text-sm text-gray-600">外気温の影響を最小限に抑制</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">計画換気で結露防止</p>
                  <p className="text-sm text-gray-600">湿度コントロールで快適性向上</p>
                </div>
              </div>
            </div>
          </div>

          {/* 高性能フィルター */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">高性能フィルター</h3>
                <p className="text-sm text-gray-600">医療施設レベルの空気清浄</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">PM2.5を99.97%除去</p>
                  <p className="text-sm text-gray-600">花粉・ホコリも徹底ブロック</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">アレルギー対策万全</p>
                  <p className="text-sm text-gray-600">お子様も安心の室内環境</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 追加機能 */}
        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <h3 className="text-lg font-bold mb-4">自然素材の活用</h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">無垢材</div>
              <p className="text-sm text-gray-600">調湿効果で快適</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">珪藻土</div>
              <p className="text-sm text-gray-600">消臭・調湿機能</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">F☆☆☆☆</div>
              <p className="text-sm text-gray-600">低VOC建材使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 空調計画スライド
function AirConditioningSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-white">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">COMFORT</span>
          </div>
          <span className="text-4xl font-bold">04</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">AIR CONDITIONING</h1>
        <p className="text-xl text-gray-600 mb-12">全館快適空調システム</p>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-12 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">全館空調システム</h2>
              <p className="text-lg mb-8">
                家中どこでも快適温度。廊下・脱衣所・トイレまで温度差のない快適空間を実現。
                ヒートショック対策も万全です。
              </p>
              <div className="bg-white/20 backdrop-blur p-6 rounded-lg">
                <div className="text-2xl font-bold mb-2">エアコン1〜2台</div>
                <p className="text-sm">で全館快適を実現</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">±2℃</div>
                  <p className="text-lg">室内温度差</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* コスト比較 */}
        <div className="bg-gray-100 p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">年間ランニングコスト比較</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-4 text-green-600">Gハウス全館空調</h4>
              <div className="text-3xl font-bold mb-2">約6万円/年</div>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>高断熱・高気密による省エネ</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>メンテナンス年2回のみ</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-4">一般エアコン（各室）</h4>
              <div className="text-3xl font-bold mb-2 text-gray-600">約10万円/年</div>
              <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-300" />
                  <span>各室ごとの電気代</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-300" />
                  <span>各室メンテナンス必要</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 耐久性スライド
function DurabilitySlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* ヘッダー */}
      <div className="bg-black px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">DURABILITY</span>
          </div>
          <span className="text-4xl font-bold">05</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">DURABILITY</h1>
        <p className="text-xl text-gray-300 mb-12">長期優良住宅認定</p>

        {/* メインビジュアル */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-orange-400 mb-4">75年</div>
            <p className="text-lg">構造躯体耐久性</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-blue-400 mb-4">30年</div>
            <p className="text-lg">外壁メンテナンスフリー</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-green-400 mb-4">50年</div>
            <p className="text-lg">屋根材耐久性</p>
          </div>
        </div>

        {/* 詳細仕様 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-orange-400">外壁材</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="font-medium">高耐候塗装サイディング</p>
                  <p className="text-sm text-gray-400">セルフクリーニング機能付き</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="font-medium">タイル外壁オプション</p>
                  <p className="text-sm text-gray-400">メンテナンスフリー60年</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-400">防水・防腐対策</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium">通気工法採用</p>
                  <p className="text-sm text-gray-400">壁内結露を徹底防止</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium">防腐・防蟻処理</p>
                  <p className="text-sm text-gray-400">薬剤不要のホウ酸処理</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// デザイン性スライド
function DesignSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-white">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">DESIGN</span>
          </div>
          <span className="text-4xl font-bold">06</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">DESIGN</h1>
        <p className="text-xl text-gray-600 mb-12">新時代のニューフォーマルセダン。</p>

        <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-12 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-6">洗練された外観デザイン</h2>
              <p className="text-lg mb-8">
                シンプルモダン、ナチュラル、和モダンなど多彩なスタイル。
                立体的なファサードデザインで個性を演出。街並みに調和しながらも、
                ひときわ目を引く美しさ。
              </p>
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8 text-yellow-400" />
                <span className="text-xl font-medium">グッドデザイン賞受賞実績</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">デザインバリエーション</h3>
              <ul className="space-y-3 text-white/90">
                <li>・シンプルモダン</li>
                <li>・ナチュラル</li>
                <li>・和モダン</li>
                <li>・北欧スタイル</li>
                <li>・インダストリアル</li>
              </ul>
            </div>
          </div>
        </div>

        {/* カスタマイズオプション */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Palette className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="font-bold mb-2">外壁カラー</h3>
            <p className="text-3xl font-bold text-blue-600">100+</p>
            <p className="text-sm text-gray-600">バリエーション</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Home className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="font-bold mb-2">屋根材</h3>
            <p className="text-3xl font-bold text-green-600">15種</p>
            <p className="text-sm text-gray-600">選択可能</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <h3 className="font-bold mb-2">収納率</h3>
            <p className="text-3xl font-bold text-orange-600">15%</p>
            <p className="text-sm text-gray-600">以上確保</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 施工品質スライド
function ConstructionQualitySlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-white to-gray-50">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">QUALITY</span>
          </div>
          <span className="text-4xl font-bold">07</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">CONSTRUCTION QUALITY</h1>
        <p className="text-xl text-gray-600 mb-12">10段階検査システム</p>

        {/* 検査フロー */}
        <div className="bg-gray-100 p-8 rounded-lg mb-8">
          <h3 className="text-2xl font-bold mb-6">品質管理フロー</h3>
          <div className="flex items-center justify-between">
            {[
              { step: '1', name: '地盤調査' },
              { step: '2', name: '基礎配筋' },
              { step: '3', name: '基礎完成' },
              { step: '4', name: '構造躯体' },
              { step: '5', name: '防水工事' },
              { step: '6', name: '断熱工事' },
              { step: '7', name: '気密測定' },
              { step: '8', name: '内装工事' },
              { step: '9', name: '設備検査' },
              { step: '10', name: '完了検査' },
            ].map((item, index) => (
              <div key={item.step} className="flex-1 text-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
                    {item.step}
                  </div>
                  {index < 9 && (
                    <div className="absolute top-6 left-full w-full h-0.5 bg-blue-600 -ml-6" />
                  )}
                </div>
                <p className="text-xs mt-2">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Hammer className="w-6 h-6 text-blue-600" />
              認定施工技術者
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">専属の認定職人による施工</p>
                  <p className="text-sm text-gray-600">定期的な技術研修実施</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">職人満足度95%以上</p>
                  <p className="text-sm text-gray-600">高いモチベーションで高品質施工</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              第三者機関検査
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">JIO（日本住宅保証検査機構）</p>
                  <p className="text-sm text-gray-600">構造・防水の重点検査</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">全工程写真記録</p>
                  <p className="text-sm text-gray-600">施工の透明性を確保</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 保証・アフターサービススライド
function WarrantySlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      {/* ヘッダー */}
      <div className="bg-black px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">WARRANTY</span>
          </div>
          <span className="text-4xl font-bold">08</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">WARRANTY & SUPPORT</h1>
        <p className="text-xl text-blue-200 mb-12">最長60年保証システム</p>

        {/* 保証期間 */}
        <div className="bg-white/10 backdrop-blur p-8 rounded-lg mb-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400 mb-2">20年</div>
              <p className="text-lg">初期保証</p>
              <p className="text-sm text-blue-200 mt-2">構造・防水・シロアリ</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-orange-400 mb-2">60年</div>
              <p className="text-lg">最長保証</p>
              <p className="text-sm text-blue-200 mt-2">定期点検で延長可能</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-400 mb-2">24/365</div>
              <p className="text-lg">緊急対応</p>
              <p className="text-sm text-blue-200 mt-2">コールセンター</p>
            </div>
          </div>
        </div>

        {/* サービス内容 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-white/20 backdrop-blur p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">定期点検プログラム</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/30 pb-2">
                <span>6ヶ月点検</span>
                <span className="text-green-400">無料</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/30 pb-2">
                <span>2年点検</span>
                <span className="text-green-400">無料</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/30 pb-2">
                <span>5年点検</span>
                <span className="text-green-400">無料</span>
              </div>
              <div className="flex justify-between items-center">
                <span>10年点検</span>
                <span className="text-green-400">無料</span>
              </div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">設備保証</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium">住宅設備10年保証</p>
                  <p className="text-sm text-blue-200">給湯器・キッチン・バス</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium">アプリ管理</p>
                  <p className="text-sm text-blue-200">メンテナンス履歴・予約</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 省エネ性スライド（CONNECTED風）
function EnergySavingSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-green-50 to-white">
      {/* ヘッダー */}
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">CONNECTED</span>
          </div>
          <span className="text-4xl font-bold">09</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">ENERGY SAVING</h1>
        <p className="text-xl text-gray-600 mb-12">つながる、通じあえる歓び。</p>

        {/* ZEH+ */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-12 rounded-lg mb-8">
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">ZEH+基準達成</h2>
              <p className="text-lg mb-8">
                太陽光発電10kW＋蓄電池7kWhを標準装備。
                年間光熱費実質ゼロを実現し、売電収入も期待可能。
                災害時も3日間の電力確保。
              </p>
              <div className="flex gap-4">
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded">
                  <span className="text-sm">補助金最大</span>
                  <div className="text-2xl font-bold">125万円</div>
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded">
                  <span className="text-sm">年間売電収入</span>
                  <div className="text-2xl font-bold">約8万円</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur p-8 rounded-full">
                <Zap className="w-32 h-32" />
              </div>
            </div>
          </div>
        </div>

        {/* エネルギー設備 */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">10kW</div>
            <p className="font-medium">太陽光発電</p>
            <p className="text-sm text-gray-600 mt-2">高効率パネル</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">7kWh</div>
            <p className="font-medium">蓄電池</p>
            <p className="text-sm text-gray-600 mt-2">リチウムイオン</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">460L</div>
            <p className="font-medium">エコキュート</p>
            <p className="text-sm text-gray-600 mt-2">省エネ基準110%</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">HEMS</div>
            <p className="font-medium">エネルギー管理</p>
            <p className="text-sm text-gray-600 mt-2">AI最適制御</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// スマートホームスライド
function SmartHomeSlide({ item }: { item: PerformanceItem }) {
  return (
    <div className="h-full bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white">
      {/* ヘッダー */}
      <div className="bg-black px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">TECHNOLOGY</span>
          </div>
          <span className="text-4xl font-bold">10</span>
        </div>
      </div>

      <div className="p-12">
        <h1 className="text-5xl font-bold mb-4 tracking-wider">SMART HOME TECHNOLOGY</h1>
        <p className="text-xl text-gray-300 mb-12">完全IoT住宅</p>

        <div className="grid grid-cols-2 gap-12">
          {/* IoTシステム */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Wifi className="w-8 h-8 text-blue-400" />
                <h3 className="text-xl font-bold">音声操作・スマホ連携</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Google Home / Alexa対応</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>外出先から家電操作</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>生活パターン学習AI</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Shield className="w-8 h-8 text-green-400" />
                <h3 className="text-xl font-bold">スマートセキュリティ</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>顔認証・指紋認証ドアロック</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>防犯カメラ・センサー連動</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>ALSOK連携緊急駆けつけ</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 設備一覧 */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">標準装備IoT機器</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded">
                <p className="font-medium">スマートミラー</p>
                <p className="text-sm text-gray-400">浴室・洗面所</p>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <p className="font-medium">宅配ボックス</p>
                <p className="text-sm text-gray-400">IoT連携・遠隔解錠</p>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <p className="font-medium">見守りカメラ</p>
                <p className="text-sm text-gray-400">AI異常検知機能</p>
              </div>
              <div className="bg-white/10 p-4 rounded">
                <p className="font-medium">スマート照明</p>
                <p className="text-sm text-gray-400">自動調光・調色</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// デフォルトスライド
function DefaultSlide({ item, Icon }: { item: PerformanceItem; Icon: any }) {
  return (
    <div className="h-full bg-white">
      <div className="bg-black text-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xs font-medium tracking-widest text-gray-400">TOP</span>
            <span className="text-xs font-bold tracking-widest text-white border-b-2 border-white pb-1">FEATURES</span>
          </div>
          <span className="text-4xl font-bold">{String(item.priority).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="p-12">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="h-10 w-10 text-gray-700" />
          </div>
          <div>
            <h2 className="text-4xl font-bold">{item.category}</h2>
            <h3 className="text-2xl text-gray-600 mt-2">{item.title}</h3>
          </div>
        </div>
        <p className="text-xl leading-relaxed text-gray-700">{item.description}</p>
      </div>
    </div>
  );
}

export default Presentation2CrownStyle;