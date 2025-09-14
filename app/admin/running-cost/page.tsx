'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, TrendingUp, Sun, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function RunningCostAdminPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    // 基本設定
    electricityBase: 15000,
    gasBase: 8000,
    waterBase: 5000,
    // 太陽光発電
    solarCapacity: 5.5,
    solarGeneration: 6000,
    sellPrice: 16,
    // 蓄電池
    hasBattery: true,
    batteryCapacity: 7.5,
    // インフレ率
    inflationRate: 2,
    // シミュレーション期間
    simulationYears: 30,
  });

  const handleSave = () => {
    localStorage.setItem('runningCostSettings', JSON.stringify(settings));
    alert('光熱費設定を保存しました');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/master/index">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              マスタ管理に戻る
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            光熱費・ランニングコスト管理
          </h1>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          保存
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>基本光熱費設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="electricityBase">月間電気代 (円)</Label>
              <Input
                id="electricityBase"
                type="number"
                value={settings.electricityBase}
                onChange={(e) => setSettings({...settings, electricityBase: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="gasBase">月間ガス代 (円)</Label>
              <Input
                id="gasBase"
                type="number"
                value={settings.gasBase}
                onChange={(e) => setSettings({...settings, gasBase: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="waterBase">月間水道代 (円)</Label>
              <Input
                id="waterBase"
                type="number"
                value={settings.waterBase}
                onChange={(e) => setSettings({...settings, waterBase: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="inflationRate">年間インフレ率 (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                step="0.1"
                value={settings.inflationRate}
                onChange={(e) => setSettings({...settings, inflationRate: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="simulationYears">シミュレーション期間 (年)</Label>
              <Input
                id="simulationYears"
                type="number"
                value={settings.simulationYears}
                onChange={(e) => setSettings({...settings, simulationYears: Number(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              太陽光発電システム
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="solarCapacity">発電容量 (kW)</Label>
              <Input
                id="solarCapacity"
                type="number"
                step="0.1"
                value={settings.solarCapacity}
                onChange={(e) => setSettings({...settings, solarCapacity: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="solarGeneration">年間発電量 (kWh)</Label>
              <Input
                id="solarGeneration"
                type="number"
                value={settings.solarGeneration}
                onChange={(e) => setSettings({...settings, solarGeneration: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="sellPrice">売電価格 (円/kWh)</Label>
              <Input
                id="sellPrice"
                type="number"
                value={settings.sellPrice}
                onChange={(e) => setSettings({...settings, sellPrice: Number(e.target.value)})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              蓄電池システム
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="hasBattery">蓄電池システム</Label>
              <Switch
                id="hasBattery"
                checked={settings.hasBattery}
                onCheckedChange={(checked) => setSettings({...settings, hasBattery: checked})}
              />
            </div>
            {settings.hasBattery && (
              <div>
                <Label htmlFor="batteryCapacity">蓄電容量 (kWh)</Label>
                <Input
                  id="batteryCapacity"
                  type="number"
                  step="0.1"
                  value={settings.batteryCapacity}
                  onChange={(e) => setSettings({...settings, batteryCapacity: Number(e.target.value)})}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>月間収支予測</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>基本光熱費</span>
                <span className="text-red-500">
                  -¥{(settings.electricityBase + settings.gasBase + settings.waterBase).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>売電収入（予測）</span>
                <span className="text-green-500">
                  +¥{Math.round(settings.solarGeneration * settings.sellPrice / 12).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t flex justify-between font-semibold">
                <span>実質負担</span>
                <span className={`text-xl ${
                  (settings.electricityBase + settings.gasBase + settings.waterBase) - (settings.solarGeneration * settings.sellPrice / 12) > 0
                    ? 'text-red-500' : 'text-green-500'
                }`}>
                  ¥{Math.round((settings.electricityBase + settings.gasBase + settings.waterBase) - (settings.solarGeneration * settings.sellPrice / 12)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}