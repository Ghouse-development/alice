'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Wind,
  Home,
  Thermometer,
  Clock,
  Palette,
  CheckCircle,
  Award,
  Zap,
  Cpu,
  Maximize2,
  Minimize2,
  Building2,
  Heart,
  Calculator,
  Droplets,
  Sun,
  Wrench,
  DollarSign,
  PhoneCall,
  Wifi,
  Image,
  Star,
  Users,
  Target,
} from 'lucide-react';
import { useStore } from '@/lib/store';

interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

interface GHousePresentationSlidesProps {
  initialSlide?: number;
  projectId?: string;
}

export default function GHousePresentationSlides({
  initialSlide = 0,
  projectId,
}: GHousePresentationSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { getSlideOrder } = useStore();

  useEffect(() => {
    setCurrentSlide(initialSlide);
  }, [initialSlide]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const allSlides: SlideData[] = [
    // ①商品ラインナップ
    {
      id: 'product',
      title: '商品ラインナップ',
      subtitle: 'あなたのライフスタイルに最適な住まいを',
      icon: <Star className="w-10 h-10" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-xs text-gray-500">商品画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">LIFE</h4>
              <p className="text-lg font-bold text-red-600 mb-2">1,650万円〜</p>
              <p className="text-sm text-gray-600">
                豊かな暮らしを
                <br />
                リーズナブルな価格で
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-xs text-gray-500">商品画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">LIFE+</h4>
              <p className="text-lg font-bold text-red-600 mb-2">1,890万円〜</p>
              <p className="text-sm text-gray-600">
                洗練された暮らしを
                <br />
                デザイン
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-xs text-gray-500">商品画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">HOURS</h4>
              <p className="text-lg font-bold text-red-600 mb-2">お問い合わせ</p>
              <p className="text-sm text-gray-600">
                家族の豊かな時間と
                <br />
                心を育てる家
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-xs text-gray-500">商品画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">LACIE</h4>
              <p className="text-lg font-bold text-red-600 mb-2">お問い合わせ</p>
              <p className="text-sm text-gray-600">
                空間美と機能美で
                <br />
                &quot;上質&quot;を彩る家
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-gray-200">
              <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-xs text-gray-500">商品画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">LIFE X</h4>
              <p className="text-lg font-bold text-red-600 mb-2">お問い合わせ</p>
              <p className="text-sm text-gray-600">
                規格住宅の常識を変える
                <br />
                究極のデザイン
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-xl text-gray-800 mb-4 text-center">
              全商品共通の高性能仕様
            </h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">耐震等級3</div>
                <div className="text-sm text-gray-600">最高等級</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">Ua値0.46</div>
                <div className="text-sm text-gray-600">HEAT20 G2</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">C値0.2</div>
                <div className="text-sm text-gray-600">高気密</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">60年保証</div>
                <div className="text-sm text-gray-600">最長保証</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // ②耐震性能
    {
      id: 'earthquake',
      title: '耐震性能',
      subtitle: '最先端技術で実現する究極の安全性',
      icon: <Shield className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">構造解析画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">
                <Calculator className="w-5 h-5 inline mr-2 text-red-600" />
                許容応力度計算
              </h4>
              <p className="text-base text-gray-700">A4用紙200枚以上の詳細構造計算を全棟実施</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">evoltz画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-2">
                <Shield className="w-5 h-5 inline mr-2 text-orange-600" />
                evoltz制振システム
              </h4>
              <p className="text-base text-gray-700">
                ドイツBILSTEIN社製・地震エネルギーを40-50%吸収
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-xl text-gray-800 mb-4">
              <Building2 className="w-6 h-6 inline mr-2 text-red-700" />
              WALLSTAT倒壊シミュレーション
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
                <span className="text-sm text-gray-500">シミュレーション画像</span>
              </div>
              <div>
                <p className="text-base text-gray-700 mb-3">
                  京大生研開発の最先端解析システムで個別にシミュレーション検証
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-base">阪神淡路大震災クラス対応</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-base">熊本地震（震度7×2回）無被害</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-red-600">耐震等級3</div>
              <div className="text-base text-gray-600">建築基準法の1.5倍</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-600">40-50%</div>
              <div className="text-base text-gray-600">地震エネルギー減衰</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-red-700">震度7連続</div>
              <div className="text-base text-gray-600">実大実験クリア</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-700">1mm〜</div>
              <div className="text-base text-gray-600">制振作動開始</div>
            </div>
          </div>
        </div>
      ),
    },
    // ③断熱・気密性能
    {
      id: 'insulation',
      title: '断熱・気密性能',
      subtitle: '世界トップクラスの性能で実現する快適空間',
      icon: <Home className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Thermometer className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-2">断熱性能</h4>
              <div className="text-4xl font-bold text-blue-700 mb-2">Ua値 0.46</div>
              <p className="text-base text-gray-600">W/㎡·K以下</p>
              <p className="text-sm font-semibold text-blue-600 mt-2">HEAT20 G2グレード</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Wind className="w-8 h-8 text-cyan-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-2">気密性能</h4>
              <div className="text-4xl font-bold text-cyan-700 mb-2">C値 0.2</div>
              <p className="text-base text-gray-600">cm²/m² 平均</p>
              <p className="text-sm font-semibold text-cyan-600 mt-2">パッシブハウス基準</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Heart className="w-8 h-8 text-red-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-2">健康効果</h4>
              <div className="text-4xl font-bold text-red-700 mb-2">+4歳</div>
              <p className="text-base text-gray-600">健康寿命延伸</p>
              <p className="text-sm font-semibold text-red-600 mt-2">近畿大学研究結果</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="font-bold text-xl text-gray-800 mb-4">最先端断熱材と施工技術</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">断熱施工画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 吹付硬質ウレタンフォーム（隙間ゼロ施工）</li>
                <li>• オール樹脂サッシ（熱伝導率アルミの1/1000）</li>
                <li>• トリプルガラス＋アルゴンガス充填</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h4 className="font-bold text-xl text-gray-800 mb-4">光熱費削減効果</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-3xl font-bold text-orange-600">約1/3</p>
                  <p className="text-sm">冷暖房費削減</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-3xl font-bold text-green-600">年12万円</p>
                  <p className="text-sm">節約効果</p>
                </div>
              </div>
              <div className="bg-white rounded p-3">
                <p className="text-base font-semibold text-gray-800">全棟気密測定実施</p>
                <p className="text-sm text-gray-600">第三者機関による性能保証</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // ④空気質管理
    {
      id: 'air',
      title: '空気質管理',
      subtitle: '最新テクノロジーで実現するクリーンエア',
      icon: <Wind className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">全熱交換型第一種換気システム</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-green-700">93%</p>
                <p className="text-base">熱回収率</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-emerald-700">2時間/1回</p>
                <p className="text-base">完全換気</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-teal-700">24時間365日</p>
                <p className="text-base">自動制御</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">換気システム画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-3">HEPAフィルター搭載</h4>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• PM2.5を99.97%除去</li>
                <li>• 花粉99.8%ブロック</li>
                <li>• ウイルス・細菌対策</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">IAQ制御画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-3">IAQ制御システム</h4>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• CO2センサー自動制御</li>
                <li>• 温湿度最適化</li>
                <li>• 室内正圧環境維持</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h4 className="font-bold text-xl text-gray-800 mb-4">健康効果の実証データ</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">73%</p>
                <p className="text-base">アレルギー改善</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">89%</p>
                <p className="text-base">睡眠質向上</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-teal-600">92%</p>
                <p className="text-base">風邪予防効果</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-600">0件</p>
                <p className="text-base">カビ発生率</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // ⑤空調計画
    {
      id: 'hvac',
      title: '空調計画',
      subtitle: '科学的設計で実現する理想の温熱環境',
      icon: <Thermometer className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">革新的エアコン計画設計</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-purple-700">1フロア1台</p>
                <p className="text-base">エアコン台数</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-pink-700">22-26℃</p>
                <p className="text-base">年間快適温度</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-3xl font-bold text-indigo-700">50%削減</p>
                <p className="text-base">電気代削減率</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">パッシブデザイン</h4>
              <div className="h-36 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">パッシブデザイン画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 日射取得・遮蔽計算</li>
                <li>• 通風シミュレーション</li>
                <li>• 自然エネルギー最大活用</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">気流設計</h4>
              <div className="h-36 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">気流シミュレーション画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• CFD流体解析実施</li>
                <li>• 温度ムラ解消設計</li>
                <li>• 階間温度差±2℃以内</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-lg font-bold text-gray-800 mb-2">
              エアコン1台で家中快適は本当に実現可能！
            </p>
            <p className="text-base text-gray-600">
              高気密高断熱＋適切な換気計画＋科学的な気流設計により、最小限の設備で最大の快適性を実現
            </p>
          </div>
        </div>
      ),
    },
    // ⑥耐久性
    {
      id: 'durability',
      title: '耐久性',
      subtitle: '100年住み継げる家づくり',
      icon: <Clock className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Shield className="w-8 h-8 text-amber-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-3">防蟻処理</h4>
              <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-base text-gray-700">ホウ酸系エコボロン</p>
              <p className="text-sm text-amber-600 font-semibold">効果永続・人体無害</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Droplets className="w-8 h-8 text-blue-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-3">防湿対策</h4>
              <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-base text-gray-700">壁内結露完全防止</p>
              <p className="text-sm text-blue-600 font-semibold">防湿シート＋通気層</p>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <Building2 className="w-8 h-8 text-orange-600 mb-3" />
              <h4 className="font-bold text-xl text-gray-800 mb-3">構造材</h4>
              <div className="h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                <Image className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-base text-gray-700">JAS規格材使用</p>
              <p className="text-sm text-orange-600 font-semibold">含水率15%以下</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-xl text-gray-800 mb-4">高耐久部材の標準採用</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-lg font-semibold mb-3">屋根・外壁</p>
                <ul className="text-base text-gray-700 space-y-2">
                  <li>• ガルバリウム鋼板（耐用年数50年）</li>
                  <li>• 光触媒コーティング</li>
                  <li>• セルフクリーニング機能</li>
                </ul>
              </div>
              <div>
                <p className="text-lg font-semibold mb-3">基礎・土台</p>
                <ul className="text-base text-gray-700 space-y-2">
                  <li>• ベタ基礎（厚さ150mm以上）</li>
                  <li>• 基礎パッキン工法</li>
                  <li>• 防湿コンクリート</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-amber-600">100年</div>
              <div className="text-base text-gray-600">構造躯体</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-yellow-600">50年</div>
              <div className="text-base text-gray-600">屋根・外壁</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-orange-600">30年</div>
              <div className="text-base text-gray-600">設備機器</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
              <div className="text-3xl font-bold text-green-600">認定取得</div>
              <div className="text-base text-gray-600">長期優良住宅</div>
            </div>
          </div>
        </div>
      ),
    },
    // ⑦デザイン性
    {
      id: 'design',
      title: 'デザイン性',
      subtitle: '性能美と機能美の完璧な融合',
      icon: <Palette className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">完全自由設計×高性能の両立</h4>
            <p className="text-lg text-gray-700">
              性能を一切妥協せず、お客様の理想を100%実現。建築家とエンジニアの共同設計により、デザインと性能の完璧な調和を実現。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">空間設計</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">空間デザイン画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• ハイドア2400mm標準</li>
                <li>• 大開口窓実現可能</li>
                <li>• 吹き抜け対応</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">素材選定</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">素材サンプル画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 無垢フローリング</li>
                <li>• 自然素材壁紙</li>
                <li>• 造作家具対応</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">照明計画</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">照明デザイン画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 間接照明設計</li>
                <li>• 調光・調色対応</li>
                <li>• 省エネLED標準</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-lg font-bold text-gray-800 mb-2">
              建築家×エンジニアのダブルチェック体制
            </p>
            <p className="text-base text-gray-600">
              デザイン性を追求しながら、耐震性・断熱性・気密性すべての性能を維持
            </p>
          </div>
        </div>
      ),
    },
    // ⑧施工品質
    {
      id: 'quality',
      title: '施工品質',
      subtitle: '職人の技術力と最新技術の融合',
      icon: <CheckCircle className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">全棟性能測定による品質保証</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-2xl font-bold text-teal-700">気密測定</p>
                <p className="text-base">全棟実施</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-2xl font-bold text-cyan-700">構造計算</p>
                <p className="text-base">全棟実施</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-2xl font-bold text-blue-700">断熱検査</p>
                <p className="text-base">サーモ撮影</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-2xl font-bold text-indigo-700">VOC測定</p>
                <p className="text-base">化学物質検査</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">品質管理体制</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">検査風景画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 自社検査10回以上</li>
                <li>• 第三者機関検査6回</li>
                <li>• 施工写真全工程記録</li>
                <li>• デジタル管理システム</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">職人教育</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">職人作業画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• マイスター認定制度</li>
                <li>• 気密施工専門職人</li>
                <li>• 平均経験年数15年以上</li>
                <li>• 自社専属大工チーム</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-xl font-bold text-gray-800 mb-2">施工不良率0.1%以下の実績</p>
            <p className="text-lg text-gray-600">
              業界平均の1/10以下。徹底した品質管理と職人教育により、極めて高い施工精度を実現
            </p>
          </div>
        </div>
      ),
    },
    // ⑨保証・アフターサービス
    {
      id: 'warranty',
      title: '保証・アフターサービス',
      subtitle: '業界最長60年保証で生涯安心',
      icon: <Award className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">業界最長クラスの保証体系</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded p-5 text-center shadow">
                <p className="text-4xl font-bold text-emerald-700">初期20年</p>
                <p className="text-lg">無償保証期間</p>
              </div>
              <div className="bg-white rounded p-5 text-center shadow">
                <p className="text-4xl font-bold text-green-700">最長60年</p>
                <p className="text-lg">延長保証可能</p>
              </div>
              <div className="bg-white rounded p-5 text-center shadow">
                <p className="text-3xl font-bold text-teal-700">24時間365日</p>
                <p className="text-lg">緊急対応</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">構造・防水保証</h4>
              <ul className="text-lg text-gray-700 space-y-3">
                <li>• 構造躯体：初期20年→最長60年</li>
                <li>• 防水：初期20年→最長30年</li>
                <li>• 防蟻：初期20年→最長30年</li>
                <li>• 地盤：20年（最大5,000万円）</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">設備保証</h4>
              <ul className="text-lg text-gray-700 space-y-3">
                <li>• 住宅設備：10年保証</li>
                <li>• 給湯器：10年保証</li>
                <li>• エアコン：10年保証</li>
                <li>• 太陽光発電：25年出力保証</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h4 className="font-bold text-xl text-gray-800 mb-4">定期点検スケジュール</h4>
            <div className="grid grid-cols-6 gap-2">
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">1年</p>
                <p className="text-sm text-green-600 font-semibold">無償</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">2年</p>
                <p className="text-sm text-green-600 font-semibold">無償</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">5年</p>
                <p className="text-sm text-green-600 font-semibold">無償</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">10年</p>
                <p className="text-sm text-green-600 font-semibold">無償</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">20年</p>
                <p className="text-sm text-green-600 font-semibold">無償</p>
              </div>
              <div className="bg-gray-100 rounded p-3 text-center">
                <p className="text-lg font-bold">30年</p>
                <p className="text-sm text-blue-600 font-semibold">有償</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // ⑩省エネ性
    {
      id: 'energy',
      title: '省エネ性',
      subtitle: 'エネルギー自給自足の実現',
      icon: <Zap className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">次世代ZEH+相当の超省エネ住宅</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-lg font-bold text-yellow-700">BELS</p>
                <p className="text-3xl font-bold">★★★★★</p>
                <p className="text-base">最高評価</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-lg font-bold text-orange-700">省エネ率</p>
                <p className="text-3xl font-bold">75%</p>
                <p className="text-base">基準比削減</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-lg font-bold text-red-700">創エネ</p>
                <p className="text-3xl font-bold">6.5kW</p>
                <p className="text-base">太陽光発電</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <p className="text-lg font-bold text-amber-700">蓄電池</p>
                <p className="text-3xl font-bold">12.8kWh</p>
                <p className="text-base">大容量</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <div className="h-36 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">太陽光パネル画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-3">創エネシステム</h4>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• 高効率単結晶パネル</li>
                <li>• 発電効率22%以上</li>
                <li>• 25年出力保証</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <div className="h-36 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">省エネ設備画像</span>
              </div>
              <h4 className="font-bold text-xl text-gray-800 mb-3">省エネ設備</h4>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• エコキュート（COP4.0以上）</li>
                <li>• LED照明100%</li>
                <li>• 高効率エアコン</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <h4 className="font-bold text-xl text-gray-800 mb-4">
              光熱費シミュレーション（4人家族）
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded p-4 text-center">
                <p className="text-base">一般住宅</p>
                <p className="text-3xl font-bold text-red-600">25万円/年</p>
              </div>
              <div className="bg-gray-100 rounded p-4 text-center">
                <p className="text-base">Gハウス</p>
                <p className="text-3xl font-bold text-green-600">実質0円</p>
              </div>
              <div className="bg-gray-100 rounded p-4 text-center">
                <p className="text-base">35年総額</p>
                <p className="text-3xl font-bold text-blue-600">875万円削減</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // ⑪最新テクノロジー（IoT）
    {
      id: 'tech',
      title: '最新テクノロジー',
      subtitle: 'IoT×AIで実現する未来の暮らし',
      icon: <Cpu className="w-10 h-10" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-bold text-2xl text-gray-800 mb-4">スマートホーム完全対応</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded p-4 text-center shadow">
                <Wifi className="w-10 h-10 text-violet-600 mx-auto mb-2" />
                <p className="text-lg font-bold">HEMS</p>
                <p className="text-base">AI制御</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <Cpu className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold">V2H</p>
                <p className="text-base">EV連携</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <Shield className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                <p className="text-lg font-bold">セキュリティ</p>
                <p className="text-base">顔認証</p>
              </div>
              <div className="bg-white rounded p-4 text-center shadow">
                <Heart className="w-10 h-10 text-pink-600 mx-auto mb-2" />
                <p className="text-lg font-bold">健康管理</p>
                <p className="text-base">見守り</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">HEMS機能</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">HEMS画面画像</span>
              </div>
              <ul className="text-base text-gray-700 space-y-2">
                <li>• エネルギー見える化</li>
                <li>• AI最適制御</li>
                <li>• スマホ遠隔操作</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-lg">
              <h4 className="font-bold text-xl text-gray-800 mb-4">V2Hシステム</h4>
              <div className="h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                <Image className="w-20 h-20 text-gray-400" />
                <span className="text-sm text-gray-500">V2Hシステム画像</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">40kWh</p>
                  <p className="text-sm">EV活用時容量</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">4日間</p>
                  <p className="text-sm">停電時運転</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow">
            <p className="text-xl font-bold text-gray-800 mb-2">未来の暮らしを今すぐ実現</p>
            <p className="text-lg text-gray-600">
              電気代実質ゼロ、家事時間50%削減、災害時も安心の自立型住宅
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Filter and sort slides based on saved order
  const slides = React.useMemo(() => {
    if (!projectId) return allSlides;

    const slideOrder = getSlideOrder(projectId);
    if (!slideOrder || slideOrder.length === 0) return allSlides;

    // Filter enabled slides and sort by saved order
    const enabledSlides = slideOrder.filter((s) => s.enabled);
    const orderedSlides: SlideData[] = [];

    enabledSlides.forEach((orderItem) => {
      const slide = allSlides.find((s) => s.id === orderItem.id);
      if (slide) {
        orderedSlides.push(slide);
      }
    });

    return orderedSlides.length > 0 ? orderedSlides : allSlides;
  }, [projectId, getSlideOrder]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Slide Header */}
          <div className="flex items-center gap-6 mb-6 pb-4 border-b-2 border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center text-red-600">
              {currentSlideData.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{currentSlideData.title}</h2>
              <p className="text-xl text-gray-600">{currentSlideData.subtitle}</p>
            </div>
          </div>

          {/* Slide Content - Flexible */}
          <div className="flex-1 overflow-auto">{currentSlideData.content}</div>
        </div>

        {/* Navigation - Fixed at Bottom */}
        <div className="flex-none flex justify-between items-center mt-6">
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 font-medium border border-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
            前のスライド
          </button>

          {/* Slide Indicators */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'w-10 bg-red-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all font-medium"
          >
            次のスライド
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
