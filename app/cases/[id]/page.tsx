'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, Calculator, Zap, Users, FileText, BookOpen } from 'lucide-react';
import {
  getCustomerById,
  getSalesScripts,
  getPerformanceActuals,
  getPVConfigs,
} from '@/lib/sheets';
import { estimateHVACCapacity } from '@/lib/hvac';
import { simulatePV } from '@/lib/pv';
import type { Customer, SalesScript, PerformanceActual, PVConfig } from '@/types/domain';

// タブコンポーネント（簡易版 - 後で分離）
const WHYTab = ({ scripts }: { scripts: SalesScript[] }) => {
  const whyScript = scripts.find((s) => s.section === 'WHY');

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-600 p-4">
        <h3 className="text-lg font-bold text-red-800 mb-2">WHY - なぜG-HOUSEなのか</h3>
        <p className="text-red-700">数値は目的ではなく手段。真の目的は「省エネ×快適」です。</p>
      </div>

      {whyScript && (
        <Card>
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{ __html: whyScript.script_md.replace(/\n/g, '<br>') }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const PerformanceTab = ({
  customer,
  actuals,
}: {
  customer: Customer;
  actuals: PerformanceActual[];
}) => {
  const regionActuals = actuals.filter((a) => a.climate_region === customer.climate_region);
  const avgUA = regionActuals.reduce((sum, a) => sum + a.ua, 0) / regionActuals.length;
  const avgCValue = regionActuals.reduce((sum, a) => sum + a.c_value, 0) / regionActuals.length;
  const avgEnergy =
    regionActuals.reduce((sum, a) => sum + a.monthly_energy_kWh, 0) / regionActuals.length;

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-600 p-4">
        <h3 className="text-lg font-bold text-green-800 mb-2">昨年度引き渡し実績</h3>
        <p className="text-green-700">
          G-HOUSEでは昨年度<span className="font-bold">{actuals.length}棟</span>
          のお客様にお引き渡しをいたしました。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(avgUA * 100) / 100}</div>
            <div className="text-sm text-gray-600">{customer.climate_region}地域 平均UA値</div>
            <div className="text-xs text-gray-500 mt-1">
              お客様: <span className="font-mono">{customer.ua}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(avgCValue * 100) / 100}
            </div>
            <div className="text-sm text-gray-600">{customer.climate_region}地域 平均C値</div>
            <div className="text-xs text-gray-500 mt-1">
              お客様: <span className="font-mono">{customer.c_value}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(avgEnergy)}</div>
            <div className="text-sm text-gray-600">kWh/月 平均エネルギー</div>
            <div className="text-xs text-gray-500 mt-1">同地域実績</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>お客様の性能評価</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>断熱性能（UA値）</span>
              <Badge
                className={
                  customer.ua <= 0.46
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {customer.ua <= 0.46 ? '優秀' : '標準'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>気密性能（C値）</span>
              <Badge
                className={
                  customer.c_value <= 0.5
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              >
                {customer.c_value <= 0.5 ? '優秀' : '標準'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HVACTab = ({ customer }: { customer: Customer }) => {
  const hvacResult = estimateHVACCapacity({
    floor_area_m2: customer.floor_area_m2,
    ua: customer.ua,
    c_value: customer.c_value,
    climate_region: customer.climate_region,
    ventilation_rate_m3h: customer.floor_area_m2 * 0.5,
    layout_confirmed: true,
  });

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
        <h3 className="text-lg font-bold text-purple-800 mb-2">目的は台数の少なさではありません</h3>
        <p className="text-purple-700">最も重要なのは、負荷に見合った適正容量の選定です。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>負荷計算結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(hvacResult.peak_W_winter)}W
                </div>
                <div className="text-sm text-gray-600">冬季ピーク負荷</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(hvacResult.peak_W_summer)}W
                </div>
                <div className="text-sm text-gray-600">夏季ピーク負荷</div>
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {hvacResult.recommended_kW}kW
              </div>
              <div className="text-lg font-medium text-green-800">推奨容量</div>
              <div className="text-sm text-green-600 mt-2">
                {hvacResult.recommended_kW <= 2.8
                  ? '6畳用エアコン1台で対応可能'
                  : hvacResult.recommended_kW <= 4.0
                    ? '10畳用エアコン1台で対応可能'
                    : hvacResult.recommended_kW <= 5.6
                      ? '14畳用エアコン1台で対応可能'
                      : '複数台または大容量機が必要'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>計算条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">床面積</span>
              <span className="font-mono">{customer.floor_area_m2}㎡</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">UA値</span>
              <span className="font-mono">{customer.ua}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">C値</span>
              <span className="font-mono">{customer.c_value}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地域区分</span>
              <span className="font-mono">{customer.climate_region}地域</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">換気量</span>
              <span className="font-mono">{customer.floor_area_m2 * 0.5}m³/h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PVTab = ({ customer, pvConfigs }: { customer: Customer; pvConfigs: PVConfig[] }) => {
  const [selectedConfig, setSelectedConfig] = useState(pvConfigs[0]);
  const [pvInput] = useState({
    roof_useable_m2: 40,
    tilt_deg: 30,
    azimuth_deg: 180,
    self_consumption_rate_pct: 30,
    day_tariff_JPY_kWh: 27,
    night_tariff_JPY_kWh: 17,
    sell_price_JPY_kWh: 17,
    capex_JPY: 1500000,
    power_cond_replacement_JPY: 200000,
  });

  const pvResult = selectedConfig
    ? simulatePV(pvInput, selectedConfig, customer.climate_region)
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">容量が利益を決める</h3>
        <p className="text-yellow-700">メーカーやパネルサイズの違いによる最適化が重要です。</p>
      </div>

      {pvResult && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{pvResult.num_panels}</div>
              <div className="text-sm text-gray-600">設置枚数</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{pvResult.capacity_kW}kW</div>
              <div className="text-sm text-gray-600">発電容量</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(pvResult.npv_15y_JPY / 10000)}万円
              </div>
              <div className="text-sm text-gray-600">15年NPV</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pvResult.simple_payback_y}年
              </div>
              <div className="text-sm text-gray-600">回収年数</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>メーカー・パネル選択</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pvConfigs.map((config, index) => (
              <div
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedConfig === config
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedConfig(config)}
              >
                <div className="font-medium">{config.manufacturer}</div>
                <div className="text-sm text-gray-600">{config.panel_model}</div>
                <div className="text-sm">
                  {config.panel_W}W / {config.efficiency}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CustomerTab = ({ customer }: { customer: Customer }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">年代</label>
              <div className="mt-1 text-lg">{customer.age_band}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">働き方</label>
              <div className="mt-1 text-lg">{customer.dual_income ? '共働き' : '専業'}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">家族構成</label>
              <div className="mt-1 text-lg">
                大人{customer.family_adults}人・子供{customer.family_kids}人
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">住所地域</label>
              <div className="mt-1 text-lg">{customer.climate_region}地域</div>
            </div>
          </div>

          {customer.lifestyle_notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">ライフスタイル</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">{customer.lifestyle_notes}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>自分ごと化のための提案テンプレート</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              「{customer.age_band}・{customer.dual_income ? '共働き' : '専業'}・ お子様
              {customer.family_kids}人のご家庭でしたら、 床面積{customer.floor_area_m2}
              ㎡のこちらのプランがおすすめです。 UA値{customer.ua}・C値{customer.c_value}
              の高性能住宅で、 快適で省エネな暮らしを実現できます。」
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ScriptTab = ({ customer, scripts }: { customer: Customer; scripts: SalesScript[] }) => {
  const [selectedSection, setSelectedSection] = useState<SalesScript['section']>('WHY');
  const script = scripts.find((s) => s.section === selectedSection);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>セクション選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['WHY', '性能', '空調', '太陽光', 'コスト', 'メンテ'].map((section) => (
                <button
                  key={section}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedSection === section
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section as SalesScript['section'])}
                >
                  {section}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>トーク・カンペ: {selectedSection}</CardTitle>
          </CardHeader>
          <CardContent>
            {script && (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: script.script_md.replace(/\n/g, '<br>') }}
                />
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">案件の数値差し込み例</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• 床面積: {customer.floor_area_m2}㎡</p>
                <p>
                  • UA値: {customer.ua}、C値: {customer.c_value}
                </p>
                <p>• 地域: {customer.climate_region}地域</p>
                <p>
                  • 家族構成: {customer.age_band}・{customer.dual_income ? '共働き' : '専業'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [scripts, setScripts] = useState<SalesScript[]>([]);
  const [actuals, setActuals] = useState<PerformanceActual[]>([]);
  const [pvConfigs, setPvConfigs] = useState<PVConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customerData, scriptsData, actualsData, pvConfigsData] = await Promise.all([
          getCustomerById(customerId),
          getSalesScripts(),
          getPerformanceActuals(),
          getPVConfigs(),
        ]);

        setCustomer(customerData);
        setScripts(scriptsData);
        setActuals(actualsData);
        setPvConfigs(pvConfigsData);
      } catch (error) {
        console.error('Failed to load case data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      loadData();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">案件データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">案件が見つかりません</p>
          <Button onClick={() => router.push('/cases')} className="mt-4">
            案件一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/cases')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{customer.case_name}</h1>
                <p className="text-gray-600">{customer.customer_id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6タブ構成 */}
        <Tabs defaultValue="why" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="why" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>WHY</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>性能・実績</span>
            </TabsTrigger>
            <TabsTrigger value="hvac" className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>空調計画</span>
            </TabsTrigger>
            <TabsTrigger value="pv" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>太陽光</span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>顧客属性</span>
            </TabsTrigger>
            <TabsTrigger value="script" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>トーク・カンペ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="why">
            <WHYTab scripts={scripts} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceTab customer={customer} actuals={actuals} />
          </TabsContent>

          <TabsContent value="hvac">
            <HVACTab customer={customer} />
          </TabsContent>

          <TabsContent value="pv">
            <PVTab customer={customer} pvConfigs={pvConfigs} />
          </TabsContent>

          <TabsContent value="customer">
            <CustomerTab customer={customer} />
          </TabsContent>

          <TabsContent value="script">
            <ScriptTab customer={customer} scripts={scripts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
