'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import type { Presentation3, SelectedOption } from '@/types';

interface Presentation3EditorProps {
  projectId: string;
}

export function Presentation3Editor({ projectId }: Presentation3EditorProps) {
  const { currentProject, optionMasters, updatePresentation3 } = useStore();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);

  useEffect(() => {
    if (currentProject?.presentation3?.selectedOptions) {
      setSelectedOptions(currentProject.presentation3.selectedOptions);
    } else if (optionMasters.length > 0) {
      const initialOptions: SelectedOption[] = optionMasters.map((option) => ({
        id: `selected-${option.id}`,
        optionId: option.id,
        option: option,
        quantity: option.defaultQuantity || 1,
        amount: option.unitPrice * (option.defaultQuantity || 1),
        selected: false,
      }));
      setSelectedOptions(initialOptions);
    }
  }, [currentProject, optionMasters]);

  const handleOptionToggle = (id: string) => {
    const newOptions = selectedOptions.map((opt) =>
      opt.id === id ? { ...opt, selected: !opt.selected } : opt
    );
    setSelectedOptions(newOptions);
    savePresentation(newOptions);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const newOptions = selectedOptions.map((opt) => {
      if (opt.id === id) {
        const newQuantity = Math.max(0, quantity);
        const amount = opt.option.unitPrice * newQuantity;
        return { ...opt, quantity: newQuantity, amount };
      }
      return opt;
    });
    setSelectedOptions(newOptions);
    savePresentation(newOptions);
  };

  const calculateTotal = () => {
    return selectedOptions
      .filter((opt) => opt.selected)
      .reduce((sum, opt) => sum + opt.amount, 0);
  };

  const calculateMonthlyPayment = (total: number) => {
    const interestRate = 0.01 / 12;
    const months = 35 * 12;

    if (total === 0) return 0;

    const monthlyPayment = total * (interestRate * Math.pow(1 + interestRate, months)) /
                          (Math.pow(1 + interestRate, months) - 1);

    return Math.round(monthlyPayment);
  };

  const savePresentation = (options: SelectedOption[]) => {
    const total = options
      .filter((opt) => opt.selected)
      .reduce((sum, opt) => sum + opt.amount, 0);

    const presentation3: Partial<Presentation3> = {
      id: currentProject?.presentation3?.id || `pres3-${Date.now()}`,
      projectId,
      selectedOptions: options,
      totalAmount: total,
      monthlyPayment: calculateMonthlyPayment(total),
    };
    updatePresentation3(projectId, presentation3);
  };

  const groupedOptions = selectedOptions.reduce((acc, option) => {
    const category = option.option.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(option);
    return acc;
  }, {} as Record<string, SelectedOption[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>オプション選択</CardTitle>
          <CardDescription>
            お客様のご要望に合わせてオプションをお選びください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">選択</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead>オプション名</TableHead>
                <TableHead>単価</TableHead>
                <TableHead>数量</TableHead>
                <TableHead className="text-right">金額</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedOptions).map(([category, options]) => (
                <React.Fragment key={`category-group-${category}`}>
                  <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50 font-semibold">
                      {category}
                    </TableCell>
                  </TableRow>
                  {options.map((option) => (
                    <TableRow key={option.id}>
                      <TableCell>
                        <Checkbox
                          checked={option.selected}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                        />
                      </TableCell>
                      <TableCell>{option.option.category}</TableCell>
                      <TableCell>{option.option.name}</TableCell>
                      <TableCell>
                        {option.option.unit === 'fixed' ? '一式' :
                         option.option.unit === 'area' ? '㎡' : '個'}
                        {' '}
                        ¥{option.option.unitPrice.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={option.quantity}
                          onChange={(e) => handleQuantityChange(option.id, parseInt(e.target.value) || 0)}
                          className="w-20"
                          disabled={!option.selected}
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ¥{option.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-right font-semibold">
                  オプション合計
                </TableCell>
                <TableCell className="text-right font-bold text-lg">
                  ¥{calculateTotal().toLocaleString()}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>月額換算</CardTitle>
          <CardDescription>
            35年ローン、金利1.0%で計算した場合の目安
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>オプション総額</Label>
              <div className="text-2xl font-bold">
                ¥{calculateTotal().toLocaleString()}
              </div>
            </div>
            <div>
              <Label>月額増加分（目安）</Label>
              <div className="text-2xl font-bold text-primary">
                ¥{calculateMonthlyPayment(calculateTotal()).toLocaleString()}/月
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}