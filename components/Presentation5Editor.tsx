'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import type { Presentation5 } from '@/types';
import { Sun, TrendingUp, DollarSign, Zap } from 'lucide-react';

interface Presentation5EditorProps {
  projectId: string;
}

export function Presentation5Editor({ projectId }: Presentation5EditorProps) {
  const { currentProject, updatePresentation5 } = useStore();

  // 太陽光発電設定
  const [solarCapacity, setSolarCapacity] = useState(8.3); // kW
  const [hasBattery, setHasBattery] = useState(false);
  const [batteryCapacity, setBatteryCapacity] = useState(7.0); // kWh

  // 電気代設定
  const [monthlyElectricity, setMonthlyElectricity] = useState(16533); // 円/月
  const [electricityUnitPrice, setElectricityUnitPrice] = useState(30); // 円/kWh
  const [sellElectricityPrice, setSellElectricityPrice] = useState(17); // 円/kWh (売電単価)

  // インフレ率・シミュレーション設定
  const [inflationRate, setInflationRate] = useState(2.0); // %/年
  const [simulationYears, setSimulationYears] = useState(30); // 年

  // 初期投資設定
  const [solarCostPerKw, setSolarCostPerKw] = useState(250000); // 円/kW
  const [batteryCost, setBatteryCost] = useState(1500000); // 円

  // ガス代設定
  const [monthlyGas, setMonthlyGas] = useState(5000); // 円/月
  const [hasAllElectric, setHasAllElectric] = useState(false); // オール電化

  useEffect(() => {
    if (currentProject?.presentation5) {
      const pres = currentProject.presentation5;
      // Load saved values if they exist
      setSolarCapacity(pres.solarCapacity || 8.3);
      setHasBattery(pres.hasBattery || false);
      setBatteryCapacity(pres.batteryCapacity || 7.0);
      setMonthlyElectricity(pres.monthlyElectricity || 16533);
      setElectricityUnitPrice(pres.electricityUnitPrice || 30);
      setSellElectricityPrice(pres.sellElectricityPrice || 17);
      setInflationRate(pres.inflationRate || 2.0);
      setSimulationYears(pres.simulationYears || 30);
      setSolarCostPerKw(pres.solarCostPerKw || 250000);
      setBatteryCost(pres.batteryCost || 1500000);
      setMonthlyGas(pres.monthlyGas || 5000);
      setHasAllElectric(pres.hasAllElectric || false);
    }
  }, [currentProject]);

  const calculateInitialInvestment = () => {
    const solarCost = solarCapacity * solarCostPerKw;
    const batteryTotalCost = hasBattery ? batteryCost : 0;
    return solarCost + batteryTotalCost;
  };

  const calculateMonthlyGeneration = () => {
    // 平均的な太陽光発電量の計算（1kWあたり月100kWh程度）
    return solarCapacity * 100;
  };

  const calculateMonthlySavings = () => {
    const generation = calculateMonthlyGeneration();
    const selfConsumptionRate = hasBattery ? 0.7 : 0.3; // 自家消費率
    const selfConsumption = generation * selfConsumptionRate;
    const sellElectricity = generation * (1 - selfConsumptionRate);

    const savingsFromSelfConsumption = selfConsumption * electricityUnitPrice;
    const incomeFromSelling = sellElectricity * sellElectricityPrice;

    return savingsFromSelfConsumption + incomeFromSelling;
  };

  const savePresentation = () => {
    const presentation5: Presentation5 = {
      id: currentProject?.presentation5?.id || `pres5-${Date.now()}`,
      projectId,
      afterServiceItems: currentProject?.presentation5?.afterServiceItems || [],
      solarCapacity,
      hasBattery,
      batteryCapacity,
      monthlyElectricity,
      electricityUnitPrice,
      sellElectricityPrice,
      inflationRate,
      simulationYears,
      solarCostPerKw,
      batteryCost,
      monthlyGas,
      hasAllElectric,
      initialInvestment: calculateInitialInvestment(),
      monthlyGeneration: calculateMonthlyGeneration(),
      monthlySavings: calculateMonthlySavings(),
    };
    updatePresentation5(projectId, presentation5);
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            太陽光発電システム設定
          </CardTitle>
          <CardDescription>
            太陽光発電システムの容量と蓄電池の有無を設定します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>発電容量</Label>
              <span className="text-lg font-semibold">{solarCapacity.toFixed(1)} kW</span>
            </div>
            <Slider
              min={3}
              max={15}
              step={0.1}
              value={[solarCapacity]}
              onValueChange={(value) => {
                setSolarCapacity(value[0]);
                savePresentation();
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>3kW</span>
              <span>15kW</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="battery">蓄電池システム</Label>
              <p className="text-sm text-muted-foreground">
                蓄電池を設置すると自家消費率が向上します
              </p>
            </div>
            <Switch
              id="battery"
              checked={hasBattery}
              onCheckedChange={(checked) => {
                setHasBattery(checked);
                savePresentation();
              }}
            />
          </div>

          {hasBattery && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>蓄電池容量</Label>
                <span className="text-lg font-semibold">{batteryCapacity.toFixed(1)} kWh</span>
              </div>
              <Slider
                min={3}
                max={15}
                step={0.5}
                value={[batteryCapacity]}
                onValueChange={(value) => {
                  setBatteryCapacity(value[0]);
                  savePresentation();
                }}
                className="w-full"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="solarCost">太陽光パネル単価（円/kW）</Label>
              <Input
                id="solarCost"
                type="number"
                value={solarCostPerKw}
                onChange={(e) => {
                  setSolarCostPerKw(parseInt(e.target.value) || 0);
                  savePresentation();
                }}
              />
            </div>
            {hasBattery && (
              <div>
                <Label htmlFor="batteryCostInput">蓄電池価格（円）</Label>
                <Input
                  id="batteryCostInput"
                  type="number"
                  value={batteryCost}
                  onChange={(e) => {
                    setBatteryCost(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            電気・ガス料金設定
          </CardTitle>
          <CardDescription>
            現在の電気・ガス料金を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthlyElec">月額電気代（円）</Label>
              <Input
                id="monthlyElec"
                type="number"
                value={monthlyElectricity}
                onChange={(e) => {
                  setMonthlyElectricity(parseInt(e.target.value) || 0);
                  savePresentation();
                }}
              />
            </div>
            <div>
              <Label htmlFor="elecUnit">電気単価（円/kWh）</Label>
              <Input
                id="elecUnit"
                type="number"
                value={electricityUnitPrice}
                onChange={(e) => {
                  setElectricityUnitPrice(parseInt(e.target.value) || 0);
                  savePresentation();
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allElectric">オール電化</Label>
              <p className="text-sm text-muted-foreground">
                オール電化の場合はガス代が0円になります
              </p>
            </div>
            <Switch
              id="allElectric"
              checked={hasAllElectric}
              onCheckedChange={(checked) => {
                setHasAllElectric(checked);
                savePresentation();
              }}
            />
          </div>

          {!hasAllElectric && (
            <div>
              <Label htmlFor="monthlyGasInput">月額ガス代（円）</Label>
              <Input
                id="monthlyGasInput"
                type="number"
                value={monthlyGas}
                onChange={(e) => {
                  setMonthlyGas(parseInt(e.target.value) || 0);
                  savePresentation();
                }}
              />
            </div>
          )}

          <div>
            <Label htmlFor="sellPrice">売電単価（円/kWh）</Label>
            <Input
              id="sellPrice"
              type="number"
              value={sellElectricityPrice}
              onChange={(e) => {
                setSellElectricityPrice(parseInt(e.target.value) || 0);
                savePresentation();
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              FIT制度による固定買取価格
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            シミュレーション設定
          </CardTitle>
          <CardDescription>
            長期シミュレーションのパラメータを設定します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>年間インフレ率</Label>
              <span className="text-lg font-semibold">{inflationRate.toFixed(1)}%</span>
            </div>
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[inflationRate]}
              onValueChange={(value) => {
                setInflationRate(value[0]);
                savePresentation();
              }}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              電気料金の年間上昇率の想定値
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>シミュレーション期間</Label>
              <span className="text-lg font-semibold">{simulationYears}年</span>
            </div>
            <Slider
              min={10}
              max={40}
              step={5}
              value={[simulationYears]}
              onValueChange={(value) => {
                setSimulationYears(value[0]);
                savePresentation();
              }}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-purple-500" />
            シミュレーション結果
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm text-gray-600">初期投資額</Label>
              <p className="text-2xl font-bold text-gray-900">
                ¥{calculateInitialInvestment().toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Label className="text-sm text-gray-600">月間予想発電量</Label>
              <p className="text-2xl font-bold text-green-600">
                {calculateMonthlyGeneration().toFixed(0)} kWh
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label className="text-sm text-gray-600">月間削減額（目安）</Label>
              <p className="text-2xl font-bold text-blue-600">
                ¥{calculateMonthlySavings().toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Label className="text-sm text-gray-600">投資回収期間（目安）</Label>
              <p className="text-2xl font-bold text-purple-600">
                {(calculateInitialInvestment() / (calculateMonthlySavings() * 12)).toFixed(1)}年
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            ※ 上記はあくまで目安です。実際の発電量や削減額は天候や使用状況により変動します。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}