'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { Presentation4 } from '@/types';
import ExcelDropzone from './ExcelDropzone';
import CurrentResidenceInput from './CurrentResidenceInput';

interface Presentation4EditorProps {
  projectId: string;
}

export function Presentation4Editor({ projectId }: Presentation4EditorProps) {
  const { currentProject, updatePresentation4 } = useStore();
  const [excelData, setExcelData] = useState<Presentation4['excelData'] | undefined>(undefined);
  const [currentResidence, setCurrentResidence] = useState<Presentation4['currentResidence']>(
    currentProject?.presentation4?.currentResidence || {}
  );

  useEffect(() => {
    if (currentProject?.presentation4) {
      setExcelData(currentProject.presentation4.excelData);
      setCurrentResidence(currentProject.presentation4.currentResidence || {});
    }
  }, [currentProject]);

  const handleExcelDataExtracted = (data: NonNullable<Presentation4['excelData']>) => {
    setExcelData(data);

    // Save to store
    const presentation4: Partial<Presentation4> = {
      id: currentProject?.presentation4?.id || `pres4-${Date.now()}`,
      projectId,
      buildingCost: data.本体,
      constructionCost: data.付帯A + data.付帯B + data.付帯C,
      otherCosts: data.諸費用,
      landCost: data.土地費用,
      totalCost: data.総額,
      loanAmount: data.借入金額,
      downPayment: data.自己資金,
      interestRate: data.金利,
      loanPeriod: data.借入年数,
      monthlyPayment: calculateMonthlyPayment(data.借入金額, data.金利, data.借入年数),
      costBreakdown: [],
      excelData: data,
      currentResidence: currentProject?.presentation4?.currentResidence || currentResidence,
    };
    updatePresentation4(projectId, presentation4);
  };

  const handleCurrentResidenceChange = (data: Presentation4['currentResidence']) => {
    setCurrentResidence(data);

    // Save to store
    const presentation4: Partial<Presentation4> = {
      ...currentProject?.presentation4,
      id: currentProject?.presentation4?.id || `pres4-${Date.now()}`,
      projectId,
      currentResidence: data,
    };
    updatePresentation4(projectId, presentation4);
  };

  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number): number => {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    if (monthlyRate === 0) {
      return Math.round(principal / months);
    }
    const monthly = principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
                  (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(monthly);
  };

  return (
    <div className="space-y-6">
      <CurrentResidenceInput
        onDataChange={handleCurrentResidenceChange}
        initialData={currentResidence}
      />
      <ExcelDropzone onDataExtracted={handleExcelDataExtracted} />
    </div>
  );
}