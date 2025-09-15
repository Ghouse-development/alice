'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/lib/store';

interface OptionsSlideRevisedProps {
  projectId: string;
}

function calculateMonthlyPayment(principal: number, years: number, annualRate: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return Math.round(principal / n);
  const monthly = principal * r / (1 - Math.pow(1 + r, -n));
  return Math.round(monthly);
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}

export default function OptionsSlideRevised({ projectId }: OptionsSlideRevisedProps) {
  const { projects } = useStore();
  const project = projects.find((p) => p.id === projectId);

  const [selectedExterior1, setSelectedExterior1] = useState<string[]>([]);
  const [selectedExterior2, setSelectedExterior2] = useState<string[]>([]);
  const [selectedInterior, setSelectedInterior] = useState<string[]>([]);
  const [exteriorPattern, setExteriorPattern] = useState<'pattern1' | 'pattern2'>('pattern1');
  const [loanYears, setLoanYears] = useState(35);
  const [interestRate, setInterestRate] = useState(0.7);

  // 外観オプション（各パターン4項目のみ）
  const exteriorOptions1 = [
    { id: 'ex1-1', name: '太陽光発電システム', price: 1500000 },
    { id: 'ex1-2', name: 'エコキュート', price: 450000 },
    { id: 'ex1-3', name: '外壁タイル貼り', price: 800000 },
    { id: 'ex1-4', name: 'カーポート', price: 350000 },
  ];

  const exteriorOptions2 = [
    { id: 'ex2-1', name: '蓄電池システム', price: 1200000 },
    { id: 'ex2-2', name: 'ガーデンルーム', price: 1500000 },
    { id: 'ex2-3', name: 'ウッドデッキ', price: 450000 },
    { id: 'ex2-4', name: '外構工事', price: 800000 },
  ];

  // 内装オプション（15項目）
  const interiorOptions = [
    { id: 'in-1', name: 'キッチンアップグレード', price: 350000 },
    { id: 'in-2', name: '食器洗い乾燥機', price: 180000 },
    { id: 'in-3', name: 'IHクッキングヒーター', price: 250000 },
    { id: 'in-4', name: 'タンクレストイレ', price: 150000 },
    { id: 'in-5', name: '浴室暖房乾燥機', price: 120000 },
    { id: 'in-6', name: '床暖房（LDK）', price: 450000 },
    { id: 'in-7', name: '無垢フローリング', price: 280000 },
    { id: 'in-8', name: 'エコカラット', price: 180000 },
    { id: 'in-9', name: '造作洗面台', price: 350000 },
    { id: 'in-10', name: 'パントリー', price: 150000 },
    { id: 'in-11', name: 'シューズクローク', price: 180000 },
    { id: 'in-12', name: 'ロフト', price: 250000 },
    { id: 'in-13', name: '吹き抜け', price: 380000 },
    { id: 'in-14', name: 'スタディカウンター', price: 120000 },
    { id: 'in-15', name: 'ニッチ棚', price: 80000 },
  ];

  // 内装の代表画像（2×2グリッド）
  const interiorImages = [
    { id: 'img1', title: 'キッチン', image: '/api/placeholder/200/150' },
    { id: 'img2', title: 'リビング', image: '/api/placeholder/200/150' },
    { id: 'img3', title: '浴室', image: '/api/placeholder/200/150' },
    { id: 'img4', title: '洗面', image: '/api/placeholder/200/150' },
  ];

  const exterior1Total = selectedExterior1.reduce((sum, id) => {
    const option = exteriorOptions1.find(o => o.id === id);
    return sum + (option?.price || 0);
  }, 0);

  const exterior2Total = selectedExterior2.reduce((sum, id) => {
    const option = exteriorOptions2.find(o => o.id === id);
    return sum + (option?.price || 0);
  }, 0);

  const interiorTotal = selectedInterior.reduce((sum, id) => {
    const option = interiorOptions.find(o => o.id === id);
    return sum + (option?.price || 0);
  }, 0);

  const currentExteriorTotal = exteriorPattern === 'pattern1' ? exterior1Total : exterior2Total;
  const optionTotal = currentExteriorTotal + interiorTotal;
  const monthlyPayment = calculateMonthlyPayment(optionTotal, loanYears, interestRate);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4 overflow-hidden">
      {/* ヘッダー */}
      <div className="mb-3">
        <h1 className="text-[clamp(20px,2vw,28px)] font-bold text-gray-800">住まいのオプション選択</h1>
        <p className="text-[clamp(12px,1vw,14px)] text-gray-600">お客様のライフスタイルに合わせてカスタマイズ</p>
      </div>

      <div className="grid grid-cols-[300px_1fr_340px] gap-4 h-[calc(100vh-90px)]">
        {/* 左カラム：外観オプション（縦配置） */}
        <div className="space-y-3">
          {/* 外観パターン① */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="p-3">
              {/* 画像枠追加 */}
              <div className="w-full rounded-lg bg-neutral-100 overflow-hidden mb-3">
                <img
                  src="/api/placeholder/280/210"
                  alt="外観パターン①イメージ"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>

              <h3 className="text-[clamp(13px,1.1vw,15px)] font-bold text-blue-900 mb-2">
                外観パターン① エコ重視
              </h3>
              <div className="space-y-1.5">
                {exteriorOptions1.map((option) => (
                  <div key={option.id} className="grid grid-cols-[1fr_auto] items-start gap-x-2 bg-white/80 rounded p-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Checkbox
                        id={option.id}
                        checked={selectedExterior1.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExterior1([...selectedExterior1, option.id]);
                          } else {
                            setSelectedExterior1(selectedExterior1.filter(id => id !== option.id));
                          }
                        }}
                        className="w-3 h-3 shrink-0"
                      />
                      <Label
                        htmlFor={option.id}
                        className="whitespace-normal break-words leading-tight text-[clamp(11px,0.9vw,13px)] cursor-pointer"
                      >
                        <span className="line-clamp-2">{option.name}</span>
                      </Label>
                    </div>
                    <span className="w-20 text-right text-[clamp(11px,0.9vw,13px)] font-medium text-blue-700 tabular-nums shrink-0">
                      {formatPrice(option.price)}
                    </span>
                  </div>
                ))}
                <div className="bg-blue-600 text-white rounded p-2 flex justify-between items-center">
                  <span className="text-[clamp(12px,1vw,14px)] font-semibold">合計</span>
                  <span className="text-[clamp(13px,1.1vw,15px)] font-bold tabular-nums">{formatPrice(exterior1Total)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 外観パターン② */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="p-3">
              {/* 画像枠追加 */}
              <div className="w-full rounded-lg bg-neutral-100 overflow-hidden mb-3">
                <img
                  src="/api/placeholder/280/210"
                  alt="外観パターン②イメージ"
                  className="w-full h-auto aspect-[4/3] object-cover"
                />
              </div>

              <h3 className="text-[clamp(13px,1.1vw,15px)] font-bold text-emerald-900 mb-2">
                外観パターン② 快適重視
              </h3>
              <div className="space-y-1.5">
                {exteriorOptions2.map((option) => (
                  <div key={option.id} className="grid grid-cols-[1fr_auto] items-start gap-x-2 bg-white/80 rounded p-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Checkbox
                        id={option.id}
                        checked={selectedExterior2.includes(option.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedExterior2([...selectedExterior2, option.id]);
                          } else {
                            setSelectedExterior2(selectedExterior2.filter(id => id !== option.id));
                          }
                        }}
                        className="w-3 h-3 shrink-0"
                      />
                      <Label
                        htmlFor={option.id}
                        className="whitespace-normal break-words leading-tight text-[clamp(11px,0.9vw,13px)] cursor-pointer"
                      >
                        <span className="line-clamp-2">{option.name}</span>
                      </Label>
                    </div>
                    <span className="w-20 text-right text-[clamp(11px,0.9vw,13px)] font-medium text-emerald-700 tabular-nums shrink-0">
                      {formatPrice(option.price)}
                    </span>
                  </div>
                ))}
                <div className="bg-emerald-600 text-white rounded p-2 flex justify-between items-center">
                  <span className="text-[clamp(12px,1vw,14px)] font-semibold">合計</span>
                  <span className="text-[clamp(13px,1.1vw,15px)] font-bold tabular-nums">{formatPrice(exterior2Total)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 中央カラム：内装オプション（メイン） */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-[clamp(16px,1.3vw,20px)] font-bold text-teal-900 mb-3">内装・設備オプション</h3>

            {/* 画像グリッド（大きめ） */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {interiorImages.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image} alt={img.title} className="w-full aspect-[4/3] object-cover rounded-lg shadow-md" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                    <p className="text-white text-[clamp(12px,1vw,14px)] font-semibold">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* オプションリスト */}
            <div className="flex-1 bg-white/60 rounded-lg p-3 overflow-hidden">
              <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                {interiorOptions.map((option) => (
                  <div key={option.id} className="flex items-start gap-1">
                    <Checkbox
                      id={option.id}
                      checked={selectedInterior.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedInterior([...selectedInterior, option.id]);
                        } else {
                          setSelectedInterior(selectedInterior.filter(id => id !== option.id));
                        }
                      }}
                      className="w-3 h-3 mt-0.5 shrink-0"
                    />
                    <Label
                      htmlFor={option.id}
                      className="whitespace-normal break-words leading-tight text-[clamp(10px,0.85vw,12px)] cursor-pointer flex-1"
                    >
                      <span className="line-clamp-2">{option.name}</span>
                    </Label>
                    <span className="text-[clamp(10px,0.85vw,12px)] font-medium text-teal-700 text-right tabular-nums" style={{ minWidth: '55px' }}>
                      {formatPrice(option.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 内装合計 */}
            <div className="mt-3 bg-teal-600 text-white rounded-lg p-2 flex justify-between items-center">
              <span className="text-[clamp(14px,1.2vw,16px)] font-bold">内装・設備合計</span>
              <span className="text-[clamp(18px,1.5vw,22px)] font-bold tabular-nums">{formatPrice(interiorTotal)}</span>
            </div>
          </div>
        </Card>

        {/* 右カラム：オプション合計とローン計算のみ */}
        <div className="space-y-3">
          {/* 外観パターン選択 */}
          <Card className="bg-white border-gray-300">
            <CardContent className="p-4">
              <h3 className="text-[clamp(13px,1.1vw,15px)] font-bold text-gray-800 mb-3">外観パターン選択</h3>
              <RadioGroup value={exteriorPattern} onValueChange={(value) => setExteriorPattern(value as 'pattern1' | 'pattern2')}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pattern1" id="pattern1" />
                    <Label htmlFor="pattern1" className="text-[clamp(12px,1vw,14px)] cursor-pointer">
                      パターン① エコ重視
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pattern2" id="pattern2" />
                    <Label htmlFor="pattern2" className="text-[clamp(12px,1vw,14px)] cursor-pointer">
                      パターン② 快適重視
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* オプション合計 */}
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300">
            <CardContent className="p-4">
              <h3 className="text-[clamp(14px,1.2vw,16px)] font-bold text-purple-900 mb-3">オプション合計</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[clamp(12px,1vw,14px)]">
                  <span className="text-gray-700">
                    {exteriorPattern === 'pattern1' ? '外観パターン①' : '外観パターン②'}
                  </span>
                  <span className={`font-medium ${exteriorPattern === 'pattern1' ? 'text-blue-600' : 'text-emerald-600'} tabular-nums`}>
                    {formatPrice(currentExteriorTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[clamp(12px,1vw,14px)]">
                  <span className="text-gray-700">内装・設備</span>
                  <span className="font-medium text-teal-600 tabular-nums">{formatPrice(interiorTotal)}</span>
                </div>
                <div className="pt-3 mt-3 border-t-2 border-purple-300">
                  <div className="flex justify-between items-center">
                    <span className="text-[clamp(16px,1.3vw,20px)] font-bold text-purple-900">合計</span>
                    <span className="text-[clamp(22px,1.8vw,28px)] font-bold text-purple-700 tabular-nums">
                      {formatPrice(optionTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 月々の支払い目安（オプションのみ） */}
          <Card className="bg-gradient-to-br from-indigo-100 to-blue-100 border-indigo-300">
            <CardContent className="p-4">
              <h3 className="text-[clamp(14px,1.2vw,16px)] font-bold text-indigo-900 mb-3">
                月々のお支払い目安
                <span className="text-[clamp(10px,0.85vw,12px)] font-normal text-gray-600 ml-2">
                  （オプション分のみ）
                </span>
              </h3>

              {/* ローン条件入力 */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2">
                  <Label className="text-[clamp(11px,0.9vw,13px)] text-gray-600 w-16">借入額</Label>
                  <div className="flex-1 text-[clamp(12px,1vw,14px)] font-medium tabular-nums">
                    {formatPrice(optionTotal)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-[clamp(11px,0.9vw,13px)] text-gray-600 w-16">返済期間</Label>
                  <Input
                    type="number"
                    value={loanYears}
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="h-7 text-[clamp(11px,0.9vw,13px)] w-16"
                  />
                  <span className="text-[clamp(11px,0.9vw,13px)] text-gray-600">年</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-[clamp(11px,0.9vw,13px)] text-gray-600 w-16">金利</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="h-7 text-[clamp(11px,0.9vw,13px)] w-16"
                  />
                  <span className="text-[clamp(11px,0.9vw,13px)] text-gray-600">%</span>
                </div>
              </div>

              {/* 月々の支払い額 */}
              <div className="bg-indigo-600 text-white rounded-lg p-4 text-center">
                <div className="text-[clamp(12px,1vw,14px)] mb-1">オプション分の月々支払い</div>
                <div className="text-[clamp(26px,2.2vw,32px)] font-bold tabular-nums">
                  {formatPrice(monthlyPayment)}
                </div>
                <div className="text-[clamp(10px,0.85vw,12px)] mt-1 opacity-90">ボーナス払いなし</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}