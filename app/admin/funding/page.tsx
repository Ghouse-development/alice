'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FundingAdminPage() {
  const [funding, setFunding] = useState({
    buildingCost: 25000000,
    constructionCost: 5000000,
    otherCosts: 2000000,
    landCost: 15000000,
    loanAmount: 40000000,
    downPayment: 7000000,
    interestRate: 0.5,
    loanPeriod: 35,
  });

  const totalCost = funding.buildingCost + funding.constructionCost + funding.otherCosts + funding.landCost;
  const monthlyPayment = calculateMonthlyPayment(funding.loanAmount, funding.interestRate, funding.loanPeriod);

  function calculateMonthlyPayment(principal: number, rate: number, years: number) {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    if (monthlyRate === 0) return principal / numPayments;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    return Math.round(payment);
  }

  const handleSave = () => {
    localStorage.setItem('fundingSettings', JSON.stringify(funding));
    alert('資金計画設定を保存しました');
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
            <Calculator className="h-6 w-6" />
            資金計画管理
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
            <CardTitle>建築費用</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="buildingCost">建物本体工事費</Label>
              <Input
                id="buildingCost"
                type="number"
                value={funding.buildingCost}
                onChange={(e) => setFunding({...funding, buildingCost: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="constructionCost">付帯工事費</Label>
              <Input
                id="constructionCost"
                type="number"
                value={funding.constructionCost}
                onChange={(e) => setFunding({...funding, constructionCost: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="otherCosts">諸費用</Label>
              <Input
                id="otherCosts"
                type="number"
                value={funding.otherCosts}
                onChange={(e) => setFunding({...funding, otherCosts: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="landCost">土地費用</Label>
              <Input
                id="landCost"
                type="number"
                value={funding.landCost}
                onChange={(e) => setFunding({...funding, landCost: Number(e.target.value)})}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">総費用</span>
                <span className="text-2xl font-bold">¥{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ローンシミュレーション</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="loanAmount">借入金額</Label>
              <Input
                id="loanAmount"
                type="number"
                value={funding.loanAmount}
                onChange={(e) => setFunding({...funding, loanAmount: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="downPayment">頭金</Label>
              <Input
                id="downPayment"
                type="number"
                value={funding.downPayment}
                onChange={(e) => setFunding({...funding, downPayment: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="interestRate">金利 (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={funding.interestRate}
                onChange={(e) => setFunding({...funding, interestRate: Number(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="loanPeriod">返済期間 (年)</Label>
              <Input
                id="loanPeriod"
                type="number"
                value={funding.loanPeriod}
                onChange={(e) => setFunding({...funding, loanPeriod: Number(e.target.value)})}
              />
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">月々の支払い</span>
                <span className="text-2xl font-bold">¥{monthlyPayment.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}