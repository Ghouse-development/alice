export interface Project {
  id: string;
  projectName: string;
  customerName: string;
  salesPerson: string;
  status: 'draft' | 'presented' | 'contracted' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  hearingSheet?: HearingSheet;
  customer?: Customer;
  presentation1?: Presentation1;
  presentation2?: Presentation2;
  presentation3?: Presentation3;
  presentation4?: Presentation4;
  presentation5?: Presentation5;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  projectIds: string[];
}

export interface HearingSheet {
  id: string;
  projectId: string;
  priorities: {
    design: number;        // 1-10
    earthquake: number;    // 1-10
    insulation: number;    // 1-10
    airQuality: number;    // 1-10
    durability: number;    // 1-10
    construction: number;  // 1-10
    energySaving: number;  // 1-10
    technology: number;    // 1-10
  };
  idealLiving?: {
    answers: number[];  // 10個の質問に対する回答（各0-3の選択肢）
    recommendedImages?: {
      filename: string;
      similarity: number;
      url: string;
    }[];
  };
}

export interface OptionMaster {
  id: string;
  category: string;
  name: string;
  unit: 'fixed' | 'area' | 'quantity';
  unitPrice: number;
  defaultQuantity?: number;
}

export interface Presentation1 {
  id: string;
  projectId: string;
  exteriorImages: string[];
  interiorImages: string[];
  floorPlans: string[];
  specifications: Specification[];
  notes?: string;
  uploadedFiles?: FileUpload[];
}

export interface Specification {
  id: string;
  category: string;
  item: string;
  standard: string;
  selected?: string;
  notes?: string;
}

export interface Presentation2 {
  id: string;
  projectId: string;
  performanceItems: PerformanceItem[];
  sortedOrder?: string[];
}

export interface PerformanceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  images?: string[];
  priority?: number;
}

export interface Presentation3 {
  id: string;
  projectId: string;
  selectedOptions: SelectedOption[];
  totalAmount: number;
  monthlyPayment?: number;
}

export interface SelectedOption {
  id: string;
  optionId: string;
  option: OptionMaster;
  quantity: number;
  amount: number;
  selected: boolean;
}

export interface Presentation4 {
  id: string;
  projectId: string;
  buildingCost: number;
  constructionCost: number;
  otherCosts: number;
  landCost: number;
  totalCost: number;
  loanAmount: number;
  downPayment: number;
  interestRate: number;
  loanPeriod: number;
  monthlyPayment: number;
  costBreakdown: CostItem[];
  // 追加フィールド
  bonusPayment?: number;
  bonusMonth?: number;
  otherIncome?: number;
  currentRent?: number;
  savingsAmount?: number;
  subsidyAmount?: number;
  giftAmount?: number;
}

export interface CostItem {
  id: string;
  category: string;
  item: string;
  amount: number;
  notes?: string;
}

export interface Presentation5 {
  id: string;
  projectId: string;
  afterServiceItems: AfterServiceItem[];
  // 光熱費シミュレーション関連
  solarCapacity?: number;
  hasBattery?: boolean;
  batteryCapacity?: number;
  monthlyElectricity?: number;
  electricityUnitPrice?: number;
  sellElectricityPrice?: number;
  inflationRate?: number;
  simulationYears?: number;
  solarCostPerKw?: number;
  batteryCost?: number;
  monthlyGas?: number;
  hasAllElectric?: boolean;
  initialInvestment?: number;
  monthlyGeneration?: number;
  monthlySavings?: number;
}

export interface AfterServiceItem {
  id: string;
  title: string;
  description: string;
  period: string;
  images?: string[];
}

export type PresentationStep = 1 | 2 | 3 | 4 | 5;

export interface FileUpload {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | '3d';
  size: number;
  uploadedAt: Date;
}