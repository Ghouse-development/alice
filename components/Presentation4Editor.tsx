'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStore } from '@/lib/store';
import type { Presentation4, CostItem } from '@/types';

interface Presentation4EditorProps {
  projectId: string;
}

const defaultCostItems: CostItem[] = [
  // 建物本体工事費
  { id: '1', category: '建物本体工事費', item: '基本本体工事', amount: 18000000, notes: '標準仕様' },
  { id: '2', category: '建物本体工事費', item: '付帯工事込み', amount: 2000000, notes: '' },

  // 付帯工事費
  { id: '3', category: '付帯工事費', item: '仮設工事', amount: 300000, notes: '足場・養生等' },
  { id: '4', category: '付帯工事費', item: '屋外給排水工事', amount: 800000, notes: '' },
  { id: '5', category: '付帯工事費', item: '外構工事', amount: 1500000, notes: 'カーポート含む' },
  { id: '6', category: '付帯工事費', item: '照明器具工事', amount: 300000, notes: '' },
  { id: '7', category: '付帯工事費', item: 'カーテン工事', amount: 200000, notes: '' },
  { id: '8', category: '付帯工事費', item: '地盤調査費', amount: 50000, notes: '' },
  { id: '9', category: '付帯工事費', item: '地盤改良工事', amount: 0, notes: '必要に応じて' },
  { id: '10', category: '付帯工事費', item: '解体工事', amount: 0, notes: '既存建物がある場合' },

  // 諸費用
  { id: '11', category: '諸費用', item: '建築確認申請費', amount: 150000, notes: '' },
  { id: '12', category: '諸費用', item: '登記費用', amount: 400000, notes: '表示・保存・抵当権設定' },
  { id: '13', category: '諸費用', item: '印紙代', amount: 20000, notes: '契約書用' },
  { id: '14', category: '諸費用', item: '火災保険料', amount: 250000, notes: '10年一括' },
  { id: '15', category: '諸費用', item: '融資手数料', amount: 33000, notes: '' },
  { id: '16', category: '諸費用', item: '保証料', amount: 700000, notes: '35年ローンの場合' },
  { id: '17', category: '諸費用', item: 'つなぎ融資費用', amount: 100000, notes: '' },
  { id: '18', category: '諸費用', item: '引越し費用', amount: 200000, notes: '' },
  { id: '19', category: '諸費用', item: '仮住まい費用', amount: 0, notes: '必要に応じて' },
  { id: '20', category: '諸費用', item: '家具・家電', amount: 500000, notes: '新規購入分' },

  // 土地費用
  { id: '21', category: '土地費用', item: '土地購入費', amount: 15000000, notes: '' },
  { id: '22', category: '土地費用', item: '仲介手数料', amount: 510000, notes: '3%+6万円' },
  { id: '23', category: '土地費用', item: '固定資産税清算金', amount: 50000, notes: '' },
];

export function Presentation4Editor({ projectId }: Presentation4EditorProps) {
  const { currentProject, updatePresentation4 } = useStore();
  const [costBreakdown, setCostBreakdown] = useState<CostItem[]>(defaultCostItems);
  const [activeTab, setActiveTab] = useState('breakdown');

  // ローン関連
  const [loanAmount, setLoanAmount] = useState(35000000);
  const [downPayment, setDownPayment] = useState(5000000);
  const [interestRate, setInterestRate] = useState(0.75);
  const [loanPeriod, setLoanPeriod] = useState(35);
  const [bonusPayment, setBonusPayment] = useState(0);
  const [bonusMonth, setBonusMonth] = useState(2);

  // 資金関連
  const [savingsAmount, setSavingsAmount] = useState(3000000);
  const [giftAmount, setGiftAmount] = useState(0);
  const [subsidyAmount, setSubsidyAmount] = useState(0);
  const [currentRent, setCurrentRent] = useState(80000);
  const [otherIncome, setOtherIncome] = useState(0);

  useEffect(() => {
    if (currentProject?.presentation4) {
      const pres = currentProject.presentation4;
      setCostBreakdown(pres.costBreakdown || defaultCostItems);
      setLoanAmount(pres.loanAmount);
      setDownPayment(pres.downPayment);
      setInterestRate(pres.interestRate);
      setLoanPeriod(pres.loanPeriod);
      setBonusPayment(pres.bonusPayment || 0);
      setBonusMonth(pres.bonusMonth || 2);
      setSavingsAmount(pres.savingsAmount || 3000000);
      setGiftAmount(pres.giftAmount || 0);
      setSubsidyAmount(pres.subsidyAmount || 0);
      setCurrentRent(pres.currentRent || 80000);
      setOtherIncome(pres.otherIncome || 0);
    }
  }, [currentProject]);

  const addCostItem = (category: string) => {
    const newItem: CostItem = {
      id: `item-${Date.now()}`,
      category,
      item: '新規項目',
      amount: 0,
      notes: '',
    };
    setCostBreakdown([...costBreakdown, newItem]);
  };

  const removeCostItem = (id: string) => {
    setCostBreakdown(costBreakdown.filter((item) => item.id !== id));
  };

  const updateCostItem = (id: string, field: keyof CostItem, value: string | number) => {
    const newItems = costBreakdown.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setCostBreakdown(newItems);
    savePresentation(newItems);
  };

  const calculateCategoryTotal = (category: string) => {
    return costBreakdown
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotal = () => {
    return costBreakdown.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateMonthlyPayment = () => {
    const principal = loanAmount - bonusPayment * bonusMonth * loanPeriod;
    const monthlyRate = interestRate / 100 / 12;
    const months = loanPeriod * 12;

    if (principal === 0 || monthlyRate === 0) {
      return Math.round(principal / months);
    }

    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                          (Math.pow(1 + monthlyRate, months) - 1);

    return Math.round(monthlyPayment);
  };

  const calculateBonusPayment = () => {
    if (bonusPayment === 0) return 0;

    const bonusTotal = bonusPayment * bonusMonth * loanPeriod;
    const monthlyRate = interestRate / 100 / 12;
    const bonusCount = loanPeriod * bonusMonth;

    if (monthlyRate === 0) {
      return Math.round(bonusTotal / bonusCount);
    }

    const bonusRate = Math.pow(1 + monthlyRate, 6) - 1;
    const bonusPaymentAmount = bonusTotal * (bonusRate * Math.pow(1 + bonusRate, bonusCount / bonusMonth)) /
                               (Math.pow(1 + bonusRate, bonusCount / bonusMonth) - 1);

    return Math.round(bonusPaymentAmount);
  };

  const calculateTotalFunds = () => {
    return savingsAmount + giftAmount + subsidyAmount;
  };

  const savePresentation = (items?: CostItem[]) => {
    const buildingCost = calculateCategoryTotal('建物本体工事費');
    const constructionCost = calculateCategoryTotal('付帯工事費');
    const otherCosts = calculateCategoryTotal('諸費用');
    const landCost = calculateCategoryTotal('土地費用');
    const totalCost = calculateTotal();

    const presentation4: Partial<Presentation4> = {
      id: currentProject?.presentation4?.id || `pres4-${Date.now()}`,
      projectId,
      buildingCost,
      constructionCost,
      otherCosts,
      landCost,
      totalCost,
      loanAmount,
      downPayment,
      interestRate,
      loanPeriod,
      monthlyPayment: calculateMonthlyPayment(),
      costBreakdown: items || costBreakdown,
      bonusPayment,
      bonusMonth,
      savingsAmount,
      giftAmount,
      subsidyAmount,
      currentRent,
      otherIncome,
    };
    updatePresentation4(projectId, presentation4);
  };

  const categories = ['建物本体工事費', '付帯工事費', '諸費用', '土地費用'];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="breakdown">費用内訳</TabsTrigger>
        <TabsTrigger value="funding">資金計画</TabsTrigger>
        <TabsTrigger value="simulation">返済シミュレーション</TabsTrigger>
      </TabsList>

      <TabsContent value="breakdown" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>建築費用内訳</CardTitle>
            <CardDescription>
              各項目の金額を入力してください（税込）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">カテゴリ</TableHead>
                  <TableHead>項目</TableHead>
                  <TableHead className="w-[150px]">金額</TableHead>
                  <TableHead>備考</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={`category-group-${category}`}>
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={2} className="font-semibold">
                        {category}
                      </TableCell>
                      <TableCell className="font-semibold text-right">
                        ¥{calculateCategoryTotal(category).toLocaleString()}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addCostItem(category)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    {costBreakdown
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell></TableCell>
                          <TableCell>
                            <Input
                              value={item.item}
                              onChange={(e) => updateCostItem(item.id, 'item', e.target.value)}
                              className="border-0 p-0"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.amount}
                              onChange={(e) => updateCostItem(item.id, 'amount', parseInt(e.target.value) || 0)}
                              className="w-full text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.notes || ''}
                              onChange={(e) => updateCostItem(item.id, 'notes', e.target.value)}
                              placeholder="備考"
                              className="border-0 p-0"
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCostItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-bold">
                    総計
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    ¥{calculateTotal().toLocaleString()}
                  </TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="funding" className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>必要資金</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>建物本体工事費</Label>
                <div className="text-xl font-semibold">
                  ¥{calculateCategoryTotal('建物本体工事費').toLocaleString()}
                </div>
              </div>
              <div>
                <Label>付帯工事費</Label>
                <div className="text-xl font-semibold">
                  ¥{calculateCategoryTotal('付帯工事費').toLocaleString()}
                </div>
              </div>
              <div>
                <Label>諸費用</Label>
                <div className="text-xl font-semibold">
                  ¥{calculateCategoryTotal('諸費用').toLocaleString()}
                </div>
              </div>
              <div>
                <Label>土地費用</Label>
                <div className="text-xl font-semibold">
                  ¥{calculateCategoryTotal('土地費用').toLocaleString()}
                </div>
              </div>
              <div className="border-t pt-4">
                <Label>必要資金合計</Label>
                <div className="text-2xl font-bold text-primary">
                  ¥{calculateTotal().toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>資金調達</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="savings">自己資金（貯蓄）</Label>
                <Input
                  id="savings"
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => {
                    setSavingsAmount(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
              <div>
                <Label htmlFor="gift">贈与資金</Label>
                <Input
                  id="gift"
                  type="number"
                  value={giftAmount}
                  onChange={(e) => {
                    setGiftAmount(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
              <div>
                <Label htmlFor="subsidy">補助金・助成金</Label>
                <Input
                  id="subsidy"
                  type="number"
                  value={subsidyAmount}
                  onChange={(e) => {
                    setSubsidyAmount(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
              <div className="border-t pt-4">
                <Label>自己資金合計</Label>
                <div className="text-xl font-semibold">
                  ¥{calculateTotalFunds().toLocaleString()}
                </div>
              </div>
              <div>
                <Label>住宅ローン借入額</Label>
                <div className="text-2xl font-bold text-primary">
                  ¥{(calculateTotal() - calculateTotalFunds()).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>現在の住居費との比較</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentRent">現在の家賃・住居費</Label>
                <Input
                  id="currentRent"
                  type="number"
                  value={currentRent}
                  onChange={(e) => {
                    setCurrentRent(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                  placeholder="月額"
                />
              </div>
              <div>
                <Label htmlFor="otherIncome">その他収入（月額）</Label>
                <Input
                  id="otherIncome"
                  type="number"
                  value={otherIncome}
                  onChange={(e) => {
                    setOtherIncome(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                  placeholder="賃貸収入など"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="simulation" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>住宅ローン条件設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">借入金額</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => {
                    setLoanAmount(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downPayment">頭金</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => {
                    setDownPayment(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>金利（年率）</Label>
                <span className="text-lg font-semibold">{interestRate.toFixed(2)}%</span>
              </div>
              <Slider
                min={0.1}
                max={3.0}
                step={0.05}
                value={[interestRate]}
                onValueChange={(value) => {
                  setInterestRate(value[0]);
                  savePresentation();
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>返済期間</Label>
                <span className="text-lg font-semibold">{loanPeriod}年</span>
              </div>
              <Slider
                min={10}
                max={35}
                step={1}
                value={[loanPeriod]}
                onValueChange={(value) => {
                  setLoanPeriod(value[0]);
                  savePresentation();
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bonusPayment">ボーナス払い（1回あたり）</Label>
                <Input
                  id="bonusPayment"
                  type="number"
                  value={bonusPayment}
                  onChange={(e) => {
                    setBonusPayment(parseInt(e.target.value) || 0);
                    savePresentation();
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonusMonth">ボーナス回数（年間）</Label>
                <Select
                  value={bonusMonth.toString()}
                  onValueChange={(value) => {
                    setBonusMonth(parseInt(value));
                    savePresentation();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">なし</SelectItem>
                    <SelectItem value="1">年1回</SelectItem>
                    <SelectItem value="2">年2回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>返済シミュレーション結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>月々の返済額</Label>
                  <div className="text-3xl font-bold text-primary">
                    ¥{calculateMonthlyPayment().toLocaleString()}
                  </div>
                </div>
                {bonusPayment > 0 && (
                  <div>
                    <Label>ボーナス時加算</Label>
                    <div className="text-2xl font-semibold">
                      ¥{calculateBonusPayment().toLocaleString()}
                    </div>
                  </div>
                )}
                <div>
                  <Label>年間返済額</Label>
                  <div className="text-xl font-semibold">
                    ¥{((calculateMonthlyPayment() * 12) + (calculateBonusPayment() * bonusMonth)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>総返済額</Label>
                  <div className="text-2xl font-semibold">
                    ¥{(((calculateMonthlyPayment() * 12) + (calculateBonusPayment() * bonusMonth)) * loanPeriod).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>総利息額</Label>
                  <div className="text-xl text-gray-600">
                    ¥{((((calculateMonthlyPayment() * 12) + (calculateBonusPayment() * bonusMonth)) * loanPeriod) - loanAmount).toLocaleString()}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <Label>現在家賃との差額</Label>
                  <div className={`text-2xl font-bold ${calculateMonthlyPayment() - currentRent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {calculateMonthlyPayment() - currentRent > 0 ? '+' : ''}
                    ¥{(calculateMonthlyPayment() - currentRent).toLocaleString()}/月
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>ご注意：</strong>
                上記シミュレーションは概算です。実際の返済額は金融機関の審査結果により異なる場合があります。
                また、固定資産税、修繕費用などの維持費は含まれておりません。
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}