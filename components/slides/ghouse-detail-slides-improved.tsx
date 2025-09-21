'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Wind, Home, Thermometer, Clock, Palette, CheckCircle, Award, Zap, Cpu, Maximize2, Minimize2, AlertTriangle, Building2, TreePine, Heart, Activity, Calculator, Droplets, Sun, Wrench, DollarSign, PhoneCall, Wifi } from 'lucide-react';

interface SlideData {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  bgGradient: string;
}

export default function GHouseDetailSlidesImproved() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const slides: SlideData[] = [
    // ①耐震
    {
      title: "耐震性能",
      subtitle: "最先端技術で実現する究極の安全性",
      icon: <Shield className="w-8 h-8" />,
      bgGradient: "from-red-50 to-orange-50",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-600">許容応力度計算</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">A4用紙200枚以上の詳細構造計算</p>
              <div className="bg-red-50 rounded p-2">
                <p className="text-xs font-semibold">全棟実施</p>
                <p className="text-xs">2階建てでも義務化されていない許容応力度計算を標準実施</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-orange-600">evoltz制振システム</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">ドイツBILSTEIN社製・世界最高品質</p>
              <div className="bg-orange-50 rounded p-2">
                <p className="text-xs font-semibold">超バイリニア特性（特許）</p>
                <p className="text-xs">・変位1mmから作動開始<br/>・小さな余震から建物を守る<br/>・地震エネルギーを40-50%吸収</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-red-700" />
                <h4 className="font-bold text-red-700">WALLSTAT解析</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">京大生研開発の倒壊シミュレーション</p>
              <div className="bg-red-50 rounded p-2">
                <p className="text-xs font-semibold">動画で可視化</p>
                <p className="text-xs">阪神淡路・熊本地震クラスでも倒壊しないことを個別にシミュレーション検証</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ハイブリッド構造で実現する最強の耐震性
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold mb-1">モノコック構造（6面体構造）</p>
                <p className="text-xs text-gray-700">航空機と同じ原理で外力を面全体で分散。在来工法と2×4工法の長所を融合</p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">evoltzの効果実証</p>
                <p className="text-xs text-gray-700">石膏ボード強度低下（15mm変位）前に制振。構造用合板の強度維持（25mm変位前）を実現</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-xl font-bold text-red-600">耐震等級3</div>
              <div className="text-xs text-gray-600">建築基準法の1.5倍</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-xl font-bold text-orange-600">耐風等級2</div>
              <div className="text-xs text-gray-600">500年暴風×1.2倍</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-xl font-bold text-red-700">震度7連続</div>
              <div className="text-xs text-gray-600">実大実験クリア</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-xl font-bold text-orange-700">40-50%減</div>
              <div className="text-xs text-gray-600">地震エネルギー</div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
            <p className="text-xs font-bold text-gray-800">熊本地震（震度7×2回）でも「耐震等級3」の住宅は無被害</p>
            <p className="text-xs text-gray-600 mt-1">建築学会の調査で耐震等級3住宅は大地震でも継続使用可能と実証済み</p>
          </div>
        </div>
      )
    },
    // ②断熱・気密
    {
      title: "断熱・気密性能",
      subtitle: "世界トップクラスの性能で実現する快適空間",
      icon: <Home className="w-8 h-8" />,
      bgGradient: "from-blue-50 to-cyan-50",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-blue-600 mb-2 flex items-center gap-1">
                <Thermometer className="w-4 h-4" />
                断熱性能 Ua値
              </h4>
              <div className="text-2xl font-bold text-blue-700 mb-1">0.46</div>
              <p className="text-xs text-gray-600">W/㎡·K以下</p>
              <div className="bg-blue-50 rounded p-2 mt-2">
                <p className="text-xs font-semibold">HEAT20 G2グレード</p>
                <p className="text-xs">断熱等級6・省エネ基準の約2倍の性能</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-cyan-600 mb-2 flex items-center gap-1">
                <Wind className="w-4 h-4" />
                気密性能 C値
              </h4>
              <div className="text-2xl font-bold text-cyan-700 mb-1">0.2</div>
              <p className="text-xs text-gray-600">cm²/m² 平均</p>
              <div className="bg-cyan-50 rounded p-2 mt-2">
                <p className="text-xs font-semibold">パッシブハウス基準</p>
                <p className="text-xs">ドイツ基準同等・日本トップクラス</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                健康効果
              </h4>
              <div className="text-lg font-bold text-indigo-700 mb-1">健康寿命+4歳</div>
              <p className="text-xs text-gray-600">近畿大学研究結果</p>
              <div className="bg-indigo-50 rounded p-2 mt-2">
                <p className="text-xs font-semibold">ヒートショックゼロ</p>
                <p className="text-xs">全室温度差±2℃以内</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">最先端断熱材と施工技術</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold mb-1">吹付硬質ウレタンフォーム</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 隙間ゼロの完璧施工</li>
                  <li>• 経年劣化ほぼゼロ</li>
                  <li>• 防湿気密シートで二重防御</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">オール樹脂サッシ・トリプルガラス</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• 熱伝導率アルミの1/1000</li>
                  <li>• Low-Eガラス+アルゴンガス</li>
                  <li>• 結露完全防止</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-800 mb-2">光熱費削減効果</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-600">約1/3</p>
                  <p className="text-xs">冷暖房費</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-600">年間12万</p>
                  <p className="text-xs">節約額</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
              <h4 className="text-xs font-bold text-gray-800 mb-2">快適温度環境</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">22℃</p>
                  <p className="text-xs">冬の平均室温</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">26℃</p>
                  <p className="text-xs">夏の平均室温</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-800">全棟気密測定実施</h4>
              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">性能保証</span>
            </div>
            <p className="text-xs text-gray-700">第三者機関による測定で、確実な性能を数値で証明。「隙間相当面積」はハガキ1枚分以下。</p>
          </div>
        </div>
      )
    },
    // ③空気質
    {
      title: "空気質管理",
      subtitle: "最新テクノロジーで実現するクリーンエア",
      icon: <Wind className="w-8 h-8" />,
      bgGradient: "from-green-50 to-emerald-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">全熱交換型第一種換気システム</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-green-700">熱回収率93%</p>
                <p className="text-xs">世界最高水準</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-emerald-700">2時間/1回</p>
                <p className="text-xs">完全換気</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-teal-700">24時間365日</p>
                <p className="text-xs">自動制御</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-green-600" />
                <h4 className="font-bold text-green-600">IAQ制御</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">室内空気質自動管理</p>
              <div className="bg-green-50 rounded p-2">
                <p className="text-xs">・CO2センサー制御<br/>・温湿度最適化<br/>・自動風量調整</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-emerald-600">HEPAフィルター</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">医療グレード空気清浄</p>
              <div className="bg-emerald-50 rounded p-2">
                <p className="text-xs">・PM2.5を99.97%除去<br/>・花粉99.8%ブロック<br/>・ウイルス対策済</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-teal-600">正圧環境</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">外気侵入完全防御</p>
              <div className="bg-teal-50 rounded p-2">
                <p className="text-xs">・隙間風ゼロ<br/>・黄砂・花粉防御<br/>・給気＞排気設計</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow">
            <h4 className="font-bold text-gray-800 mb-2">健康効果の実証データ</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">73%</p>
                <p className="text-xs">アレルギー改善</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">89%</p>
                <p className="text-xs">睡眠質向上</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-teal-600">92%</p>
                <p className="text-xs">風邪予防</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-cyan-600">0件</p>
                <p className="text-xs">カビ発生</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
            <h4 className="text-xs font-bold text-gray-800 mb-2">ランニングコスト比較</h4>
            <p className="text-xs text-gray-700">一般的な第三種換気と比較して電気代は月額+500円程度。健康被害リスク低減効果を考慮すると圧倒的にコストパフォーマンスが高い。</p>
          </div>
        </div>
      )
    },
    // ④空調計画
    {
      title: "空調計画",
      subtitle: "科学的設計で実現する理想の温熱環境",
      icon: <Thermometer className="w-8 h-8" />,
      bgGradient: "from-purple-50 to-pink-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">革新的エアコン計画設計</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-purple-700">1フロア1台</p>
                <p className="text-xs">エアコン台数最小化</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-pink-700">全室22-26℃</p>
                <p className="text-xs">年間快適温度</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold text-indigo-700">電気代50%削減</p>
                <p className="text-xs">省エネ実現</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">パッシブデザイン</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 日射取得・遮蔽計算</li>
                <li>• 通風シミュレーション</li>
                <li>• 自然エネルギー最大活用</li>
                <li>• 窓配置最適化設計</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-pink-600 mb-2">気流設計</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• CFD流体解析実施</li>
                <li>• 温度ムラ解消設計</li>
                <li>• 回遊動線活用</li>
                <li>• 階間温度差±2℃以内</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">実測データに基づく快適性</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center">
                <p className="text-sm font-bold text-blue-600">夏26℃</p>
                <p className="text-xs">設定温度</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-indigo-600">冬22℃</p>
                <p className="text-xs">設定温度</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-purple-600">湿度50%</p>
                <p className="text-xs">年間平均</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-pink-600">0回</p>
                <p className="text-xs">ヒートショック</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3">
            <p className="text-xs font-bold text-gray-800">エアコン1台で家中快適は本当に実現可能！</p>
            <p className="text-xs text-gray-600 mt-1">高気密高断熱＋適切な換気計画＋科学的な気流設計により、最小限の設備で最大の快適性を実現。初期費用も維持費も大幅削減。</p>
          </div>
        </div>
      )
    },
    // ⑤耐久性
    {
      title: "耐久性",
      subtitle: "100年住み継げる家づくり",
      icon: <Clock className="w-8 h-8" />,
      bgGradient: "from-amber-50 to-yellow-50",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-amber-600">防蟻処理</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">ホウ酸系エコボロン</p>
              <div className="bg-amber-50 rounded p-2">
                <p className="text-xs">・効果永続型<br/>・人体無害<br/>・揮発しない</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-yellow-600">防湿対策</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">壁内結露完全防止</p>
              <div className="bg-yellow-50 rounded p-2">
                <p className="text-xs">・防湿シート施工<br/>・通気層確保<br/>・透湿抵抗計算</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-orange-600">構造材</h4>
              </div>
              <p className="text-xs text-gray-700 mb-2">集成材・無垢材併用</p>
              <div className="bg-orange-50 rounded p-2">
                <p className="text-xs">・含水率15%以下<br/>・JAS規格材使用<br/>・強度等級E120</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">高耐久部材の標準採用</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-semibold mb-1">屋根・外壁</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• ガルバリウム鋼板（耐用年数50年）</li>
                  <li>• 光触媒コーティング</li>
                  <li>• セルフクリーニング機能</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">基礎・土台</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• ベタ基礎（厚さ150mm以上）</li>
                  <li>• 基礎パッキン工法</li>
                  <li>• 防湿コンクリート</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-lg font-bold text-amber-600">100年</div>
              <div className="text-xs text-gray-600">構造躯体</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-lg font-bold text-yellow-600">50年</div>
              <div className="text-xs text-gray-600">屋根・外壁</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-lg font-bold text-orange-600">30年</div>
              <div className="text-xs text-gray-600">設備機器</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center shadow">
              <div className="text-lg font-bold text-red-600">永続</div>
              <div className="text-xs text-gray-600">防蟻効果</div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-3">
            <p className="text-xs font-bold text-gray-800">長期優良住宅認定取得</p>
            <p className="text-xs text-gray-600 mt-1">国土交通省が定める厳格な基準をクリア。税制優遇、金利優遇、資産価値維持のトリプルメリット。</p>
          </div>
        </div>
      )
    },
    // ⑥デザイン性
    {
      title: "デザイン性",
      subtitle: "性能美と機能美の完璧な融合",
      icon: <Palette className="w-8 h-8" />,
      bgGradient: "from-indigo-50 to-blue-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">完全自由設計×高性能の両立</h4>
            <p className="text-xs text-gray-700">性能を一切妥協せず、お客様の理想を100%実現。建築家とエンジニアの共同設計により、デザインと性能の完璧な調和を実現。</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-indigo-600 mb-2">空間設計</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• ハイドア2400mm標準</li>
                <li>• 大開口窓実現可能</li>
                <li>• 吹き抜け対応</li>
                <li>• スキップフロア対応</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-blue-600 mb-2">素材選定</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 無垢フローリング</li>
                <li>• 自然素材壁紙</li>
                <li>• 造作家具対応</li>
                <li>• 輸入建材使用可</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">照明計画</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 間接照明設計</li>
                <li>• 調光・調色対応</li>
                <li>• スマート照明</li>
                <li>• 省エネLED標準</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow">
            <h4 className="font-bold text-gray-800 mb-2">商品ラインナップ</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded p-2">
                <p className="text-xs font-bold text-indigo-700">LACIE</p>
                <p className="text-xs">洗練された都市型住宅</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded p-2">
                <p className="text-xs font-bold text-blue-700">LIFE+</p>
                <p className="text-xs">自由度重視の注文住宅</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded p-2">
                <p className="text-xs font-bold text-purple-700">HOURS</p>
                <p className="text-xs">家族の時間を育む家</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border-l-4 border-gray-500 p-3">
            <p className="text-xs font-bold text-gray-800">建築家×エンジニアのダブルチェック体制</p>
            <p className="text-xs text-gray-600 mt-1">デザイン性を追求しながら、耐震性・断熱性・気密性すべての性能を維持。美しさと住み心地の完璧な両立。</p>
          </div>
        </div>
      )
    },
    // ⑦施工品質
    {
      title: "施工品質",
      subtitle: "職人の技術力と最新技術の融合",
      icon: <CheckCircle className="w-8 h-8" />,
      bgGradient: "from-teal-50 to-cyan-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">全棟性能測定による品質保証</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-semibold text-teal-700">気密測定</p>
                <p className="text-xs">全棟実施</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-semibold text-cyan-700">構造計算</p>
                <p className="text-xs">全棟実施</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-semibold text-blue-700">断熱検査</p>
                <p className="text-xs">サーモ撮影</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-semibold text-indigo-700">VOC測定</p>
                <p className="text-xs">化学物質検査</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-teal-600 mb-2">品質管理体制</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 自社検査10回以上</li>
                <li>• 第三者機関検査6回</li>
                <li>• 施工写真全工程記録</li>
                <li>• デジタル管理システム</li>
                <li>• 現場監督週3回以上巡回</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-cyan-600 mb-2">職人教育</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 定期技術研修実施</li>
                <li>• マイスター認定制度</li>
                <li>• 気密施工専門職人</li>
                <li>• 平均経験年数15年以上</li>
                <li>• 自社専属大工チーム</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">最新技術導入</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <Wrench className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-semibold">3D-CAD</p>
                <p className="text-xs text-gray-600">設計精度向上</p>
              </div>
              <div className="text-center">
                <Building2 className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs font-semibold">BIM活用</p>
                <p className="text-xs text-gray-600">施工シミュレーション</p>
              </div>
              <div className="text-center">
                <Activity className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-semibold">IoT管理</p>
                <p className="text-xs text-gray-600">リアルタイム品質監視</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-3">
            <p className="text-xs font-bold text-gray-800">施工不良率0.1%以下の実績</p>
            <p className="text-xs text-gray-600 mt-1">業界平均の1/10以下。徹底した品質管理と職人教育により、極めて高い施工精度を実現。</p>
          </div>
        </div>
      )
    },
    // ⑧保証・アフターサービス
    {
      title: "保証・アフターサービス",
      subtitle: "業界最長60年保証で生涯安心",
      icon: <Award className="w-8 h-8" />,
      bgGradient: "from-emerald-50 to-green-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">業界最長クラスの保証体系</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded p-2">
                <p className="text-lg font-bold text-emerald-700">初期20年</p>
                <p className="text-xs">無償保証期間</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-lg font-bold text-green-700">最長60年</p>
                <p className="text-xs">延長保証可能</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-lg font-bold text-teal-700">24時間365日</p>
                <p className="text-xs">緊急対応</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-emerald-600 mb-2">構造・防水保証</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 構造躯体：初期20年→最長60年</li>
                <li>• 防水：初期20年→最長30年</li>
                <li>• 防蟻：初期20年→最長30年</li>
                <li>• 地盤：20年（最大5,000万円）</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-green-600 mb-2">設備保証</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 住宅設備：10年保証</li>
                <li>• 給湯器：10年保証</li>
                <li>• エアコン：10年保証</li>
                <li>• 太陽光発電：25年出力保証</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">定期点検スケジュール</h4>
            <div className="grid grid-cols-6 gap-1">
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">1年</p>
                <p className="text-xs text-green-600">無償</p>
              </div>
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">2年</p>
                <p className="text-xs text-green-600">無償</p>
              </div>
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">5年</p>
                <p className="text-xs text-green-600">無償</p>
              </div>
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">10年</p>
                <p className="text-xs text-green-600">無償</p>
              </div>
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">20年</p>
                <p className="text-xs text-green-600">無償</p>
              </div>
              <div className="bg-white rounded p-1 text-center">
                <p className="text-xs font-bold">30年</p>
                <p className="text-xs text-blue-600">有償</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <PhoneCall className="w-5 h-5 text-orange-600" />
                <h4 className="text-xs font-bold text-gray-800">緊急対応体制</h4>
              </div>
              <p className="text-xs text-gray-700">水漏れ、設備故障など緊急時は24時間365日対応。専門スタッフが即日訪問。</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <h4 className="text-xs font-bold text-gray-800">住まいのカルテ</h4>
              </div>
              <p className="text-xs text-gray-700">建築データ、点検履歴、メンテナンス記録をデジタル管理。世代を超えて引き継ぎ可能。</p>
            </div>
          </div>
        </div>
      )
    },
    // ⑨省エネ性
    {
      title: "省エネ性",
      subtitle: "エネルギー自給自足の実現",
      icon: <Zap className="w-8 h-8" />,
      bgGradient: "from-yellow-50 to-orange-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">次世代ZEH+相当の超省エネ住宅</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-bold text-yellow-700">BELS</p>
                <p className="text-lg font-bold">★★★★★</p>
                <p className="text-xs">最高評価</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-bold text-orange-700">省エネ率</p>
                <p className="text-lg font-bold">75%</p>
                <p className="text-xs">基準比削減</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-bold text-red-700">創エネ</p>
                <p className="text-lg font-bold">6.5kW</p>
                <p className="text-xs">太陽光発電</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <p className="text-xs font-bold text-amber-700">蓄電池</p>
                <p className="text-lg font-bold">12.8kWh</p>
                <p className="text-xs">大容量</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-yellow-600" />
                <h4 className="font-bold text-yellow-600">創エネシステム</h4>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 高効率単結晶パネル</li>
                <li>• 発電効率22%以上</li>
                <li>• 25年出力保証</li>
                <li>• 年間発電量7,000kWh</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <h4 className="font-bold text-orange-600">省エネ設備</h4>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• エコキュート（COP4.0以上）</li>
                <li>• LED照明100%</li>
                <li>• 節水型設備標準</li>
                <li>• 高効率エアコン</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">光熱費シミュレーション（4人家族）</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold">一般住宅</p>
                <p className="text-lg font-bold text-red-600">25万円/年</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold">Gハウス</p>
                <p className="text-lg font-bold text-green-600">実質0円</p>
              </div>
              <div className="bg-white rounded p-2">
                <p className="text-xs font-semibold">35年総額</p>
                <p className="text-lg font-bold text-blue-600">875万円削減</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h4 className="text-xs font-bold text-gray-800">経済メリット</h4>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• FIT売電収入：年15万円</li>
                <li>• 自家消費削減：年10万円</li>
                <li>• 補助金最大200万円</li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="w-5 h-5 text-green-600" />
                <h4 className="text-xs font-bold text-gray-800">環境貢献</h4>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• CO2削減：年3.5トン</li>
                <li>• 杉の木250本分の効果</li>
                <li>• カーボンニュートラル達成</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    // ⑩最新テクノロジー（IoT）
    {
      title: "最新テクノロジー",
      subtitle: "IoT×AIで実現する未来の暮らし",
      icon: <Cpu className="w-8 h-8" />,
      bgGradient: "from-violet-50 to-purple-50",
      content: (
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">スマートホーム完全対応</h4>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded p-2 text-center">
                <Wifi className="w-6 h-6 text-violet-600 mx-auto mb-1" />
                <p className="text-xs font-bold">HEMS</p>
                <p className="text-xs">AI制御</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <Cpu className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-bold">V2H</p>
                <p className="text-xs">EV連携</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <Shield className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                <p className="text-xs font-bold">セキュリティ</p>
                <p className="text-xs">顔認証</p>
              </div>
              <div className="bg-white rounded p-2 text-center">
                <Activity className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                <p className="text-xs font-bold">健康管理</p>
                <p className="text-xs">見守り</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-violet-600 mb-2">HEMS機能</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• エネルギー見える化</li>
                <li>• AI最適制御</li>
                <li>• 天気予報連動</li>
                <li>• 電力ピークカット</li>
                <li>• スマホ遠隔操作</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">家事自動化</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• ロボット掃除機対応</li>
                <li>• 食洗機標準装備</li>
                <li>• 洗濯乾燥機スペース</li>
                <li>• スマート家電連携</li>
                <li>• 音声アシスタント対応</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">V2H（Vehicle to Home）システム</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-xs font-semibold">蓄電容量</p>
                <p className="text-lg font-bold text-blue-600">40kWh</p>
                <p className="text-xs">EV活用時</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold">停電時</p>
                <p className="text-lg font-bold text-indigo-600">4日間</p>
                <p className="text-xs">自立運転</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold">充電時間</p>
                <p className="text-lg font-bold text-purple-600">6時間</p>
                <p className="text-xs">急速充電</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3">
            <h4 className="font-bold text-gray-800 mb-2">未来の暮らしを今すぐ実現</h4>
            <p className="text-xs text-gray-700">電気代実質ゼロ、家事時間50%削減、災害時も安心の自立型住宅。テクノロジーと住環境の完璧な融合により、これまでにない快適で便利な暮らしを実現します。</p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full h-screen max-w-[1920px] mx-auto flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header - Fixed Height */}
      <div className="flex-none h-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">G HOUSE 高性能住宅</h1>
            <p className="text-xs text-gray-300">世界基準の住まいづくり</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="全画面表示"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <div className="text-sm">
            <span className="text-gray-400">スライド</span>
            <span className="text-xl font-bold ml-2">{currentSlide + 1}</span>
            <span className="text-gray-400"> / {slides.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible Height */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className={`flex-1 bg-gradient-to-br ${currentSlideData.bgGradient} rounded-2xl shadow-xl p-6 flex flex-col`}>
          {/* Slide Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md text-gray-700">
              {currentSlideData.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentSlideData.title}</h2>
              <p className="text-base text-gray-600">{currentSlideData.subtitle}</p>
            </div>
          </div>

          {/* Slide Content - Flexible */}
          <div className="flex-1 overflow-auto">
            {currentSlideData.content}
          </div>
        </div>

        {/* Navigation - Fixed at Bottom */}
        <div className="flex-none flex justify-between items-center mt-4">
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? 'w-8 bg-gray-800'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
          >
            次のスライド
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}