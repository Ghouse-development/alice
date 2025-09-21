'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Shield, Wind, Home, Thermometer, Clock, Palette, CheckCircle, Award, Zap, Cpu, Maximize2, Minimize2, AlertTriangle, Building2, TreePine, Heart, Activity, Calculator } from 'lucide-react';

interface SlideData {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  bgGradient: string;
}

export default function GHouseDetailSlides() {
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
        <div className="space-y-4">
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
      subtitle: "世界最高峰の気密性と快適な温度環境",
      icon: <Home className="w-8 h-8" />,
      bgGradient: "from-blue-50 to-cyan-50",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-blue-600 mb-2">断熱性能 Ua値</h4>
              <p className="text-sm text-gray-700 mb-2">0.46W/㎡·K以下</p>
              <p className="text-xs text-gray-600">HEAT20 G2グレード・断熱等級6</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-blue-600 mb-2">気密性能 C値</h4>
              <p className="text-sm text-gray-700 mb-2">平均0.2cm²/m²</p>
              <p className="text-xs text-gray-600">パッシブハウス基準と同等</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">施工技術のポイント</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 吹付硬質ウレタンフォーム＋防湿気密シート</li>
              <li>• オール樹脂サッシ（熱伝導率はアルミの約1/1000）</li>
              <li>• Low-Eガラス＋アルゴンガス充填</li>
            </ul>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">全棟で気密測定を実施し、性能を保証</p>
          </div>
        </div>
      )
    },
    // ③空気質
    {
      title: "空気質管理",
      subtitle: "健康を第一に考えた換気システム",
      icon: <Wind className="w-8 h-8" />,
      bgGradient: "from-green-50 to-emerald-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">全熱交換型第一種換気システム</h4>
            <p className="text-sm text-gray-700">2時間に1回、家中の空気を完全入れ替え。熱交換により冷暖房エネルギーを回収</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-green-600 mb-2">IAQ制御システム</h4>
              <p className="text-sm text-gray-700">温度・湿度センサーが自動で給排気量を調整</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-green-600 mb-2">正圧環境の実現</h4>
              <p className="text-sm text-gray-700">花粉やPM2.5の侵入を防ぐ室内正圧を維持</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">健康への効果</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• ハウスダスト・アレルゲンを効率的に排除</li>
              <li>• カビ・ダニの繁殖を防止</li>
              <li>• 室内干しでもカラッと乾く清潔な環境</li>
            </ul>
          </div>
        </div>
      )
    },
    // ④空調計画
    {
      title: "空調計画",
      subtitle: "ワンフロア1台で実現する快適空間",
      icon: <Thermometer className="w-8 h-8" />,
      bgGradient: "from-purple-50 to-pink-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">エアコン計画設計</h4>
            <p className="text-sm text-gray-700">間取りと気流を計算し、最適なエアコン配置を設計。ワンフロア1台で家中を快適温度に</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">ヒートショック対策</h4>
              <p className="text-sm text-gray-700">全室温度差±2℃以内を実現。浴室・脱衣室も快適</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-purple-600 mb-2">省エネ効果</h4>
              <p className="text-sm text-gray-700">高気密高断熱により冷暖房費を大幅削減</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">科学的アプローチ</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 専用計算システムによる換気経路の最適化</li>
              <li>• 回遊動線を活用した空気循環設計</li>
              <li>• パッシブデザインによる自然エネルギー活用</li>
            </ul>
          </div>
        </div>
      )
    },
    // ⑤耐久性
    {
      title: "耐久性",
      subtitle: "長く快適に暮らせる高耐久仕様",
      icon: <Clock className="w-8 h-8" />,
      bgGradient: "from-amber-50 to-yellow-50",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-amber-600 mb-2">ホウ酸系防蟻剤</h4>
              <p className="text-sm text-gray-700">エコボロン採用。揮発せず効果が長期間持続</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-amber-600 mb-2">壁内結露対策</h4>
              <p className="text-sm text-gray-700">防湿気密シート＋通気層で湿気を完全制御</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">高耐久部材の採用</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• ガルバリウム鋼板屋根（軽量・高耐久）</li>
              <li>• ベタ基礎（面で支える高強度構造）</li>
              <li>• 樹脂サッシ（結露防止・メンテナンス性向上）</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">長期優良住宅認定</h4>
            <p className="text-sm text-gray-700">国が定める厳格な基準をクリア。資産価値の維持にも貢献</p>
          </div>
        </div>
      )
    },
    // ⑥デザイン性
    {
      title: "デザイン性",
      subtitle: "性能と美しさの両立",
      icon: <Palette className="w-8 h-8" />,
      bgGradient: "from-indigo-50 to-blue-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">完全自由設計</h4>
            <p className="text-sm text-gray-700">お客様のライフスタイルに合わせた間取りをゼロから設計。性能を損なわずデザイン性を追求</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-indigo-600 mb-2">ハイドア仕様</h4>
              <p className="text-sm text-gray-700">H2400mmの開放感。空間の広がりを演出</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-indigo-600 mb-2">厳選された素材</h4>
              <p className="text-sm text-gray-700">高級感と機能性を兼ね備えた建材を採用</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">商品ラインナップ</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• LACIE：空間美と機能美で上質を彩る</li>
              <li>• LIFE+：高性能×自由度が魅力</li>
              <li>• HOURS：家族の豊かな時間を育てる</li>
            </ul>
          </div>
        </div>
      )
    },
    // ⑦施工品質
    {
      title: "施工品質",
      subtitle: "確かな技術と丁寧な施工",
      icon: <CheckCircle className="w-8 h-8" />,
      bgGradient: "from-teal-50 to-cyan-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">全棟性能測定</h4>
            <p className="text-sm text-gray-700">気密測定・構造計算を全棟実施。数値で品質を保証</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-teal-600 mb-2">現場管理体制</h4>
              <p className="text-sm text-gray-700">知識豊富な現場監督による徹底した品質管理</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-teal-600 mb-2">職人の技術力</h4>
              <p className="text-sm text-gray-700">経験豊富な専門職人による精密な施工</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">品質保証のポイント</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 定期的な社内検査と第三者検査</li>
              <li>• 施工記録の詳細な管理</li>
              <li>• 継続的な技術研修の実施</li>
            </ul>
          </div>
        </div>
      )
    },
    // ⑧保証・アフターサービス
    {
      title: "保証・アフターサービス",
      subtitle: "最長60年の長期保証で安心",
      icon: <Award className="w-8 h-8" />,
      bgGradient: "from-emerald-50 to-green-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">業界最長クラスの保証</h4>
            <p className="text-sm text-gray-700">初期20年保証＋メンテナンスで最長60年保証を実現</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-emerald-600 mb-2">構造・防水・防蟻</h4>
              <p className="text-sm text-gray-700">主要構造部を長期にわたり保証</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-emerald-600 mb-2">住宅設備10年保証</h4>
              <p className="text-sm text-gray-700">給湯器・キッチン・浴室など日常設備も安心</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">定期点検スケジュール</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 1年・2年・10年・20年・30年の無償点検</li>
              <li>• 地盤20年保証（最大5,000万円）</li>
              <li>• 24時間365日の緊急対応体制</li>
            </ul>
          </div>
        </div>
      )
    },
    // ⑨省エネ性
    {
      title: "省エネ性",
      subtitle: "次世代ZEH+相当の高性能",
      icon: <Zap className="w-8 h-8" />,
      bgGradient: "from-yellow-50 to-orange-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">BELS評価書 最高評価レベル6</h4>
            <p className="text-sm text-gray-700">第三者機関による省エネ性能の証明。国の基準を50%以上削減</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-yellow-600 mb-2">太陽光発電</h4>
              <p className="text-sm text-gray-700">最大6.525kW搭載。自家消費で電気代削減</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-yellow-600 mb-2">蓄電池システム</h4>
              <p className="text-sm text-gray-700">12.8kWh大容量。停電時も安心</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">省エネ設備の標準採用</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• LED照明・節水型設備</li>
              <li>• エコキュート（ヒートポンプ給湯）</li>
              <li>• 全熱交換型換気による熱回収</li>
            </ul>
          </div>
        </div>
      )
    },
    // ⑩最新テクノロジー（IoT）
    {
      title: "最新テクノロジー",
      subtitle: "IoTとAIで実現する未来の暮らし",
      icon: <Cpu className="w-8 h-8" />,
      bgGradient: "from-violet-50 to-purple-50",
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">HEMS（次世代エネルギー管理）</h4>
            <p className="text-sm text-gray-700">AI制御で電力使用を最適化。エネルギーの見える化でスマートな暮らし</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-violet-600 mb-2">V2H対応</h4>
              <p className="text-sm text-gray-700">EV車との連携。車を蓄電池として活用</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-violet-600 mb-2">スマートキー</h4>
              <p className="text-sm text-gray-700">AC100V式電子錠で快適・安全な暮らし</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-bold text-gray-800 mb-2">家事自動化の実現</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• お掃除ロボット・食洗機標準対応</li>
              <li>• 洗濯乾燥機設置を考慮した間取り設計</li>
              <li>• 電気代実質ゼロで便利家電をフル活用</li>
            </ul>
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
      <div className="flex-none h-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-xl">G</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">G HOUSE</h1>
            <p className="text-sm text-gray-300">高性能住宅の詳細仕様</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-sm">
            <span className="text-gray-400">スライド</span>
            <span className="text-xl font-bold ml-2">{currentSlide + 1}</span>
            <span className="text-gray-400"> / {slides.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible Height */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <div className={`flex-1 bg-gradient-to-br ${currentSlideData.bgGradient} rounded-2xl shadow-xl p-8 flex flex-col`}>
          {/* Slide Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md text-gray-700">
              {currentSlideData.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{currentSlideData.title}</h2>
              <p className="text-lg text-gray-600">{currentSlideData.subtitle}</p>
            </div>
          </div>

          {/* Slide Content - Flexible */}
          <div className="flex-1 overflow-auto">
            {currentSlideData.content}
          </div>
        </div>

        {/* Navigation - Fixed at Bottom */}
        <div className="flex-none flex justify-between items-center mt-6">
          <button
            onClick={prevSlide}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
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
                  index === currentSlide
                    ? 'w-8 bg-gray-800'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
          >
            次のスライド
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}