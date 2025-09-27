// モックデータ（Supabaseが設定されていない場合のフォールバック）

import type { Customer, PVConfig, PerformanceActual, SalesScript } from '@/types/domain';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    customer_id: 'CASE001',
    case_name: '田中様邸',
    site_area_tsubo: 45,
    floor_area_m2: 105,
    floors: 2,
    family_adults: 2,
    family_kids: 2,
    dual_income: true,
    age_band: '30s',
    lifestyle_notes: '共働き、子供2人（5歳・8歳）、在宅勤務あり',
    climate_region: 6,
    ua: 0.46,
    c_value: 0.2,
  },
  {
    customer_id: 'CASE002',
    case_name: '佐藤様邸',
    site_area_tsubo: 38,
    floor_area_m2: 92,
    floors: 2,
    family_adults: 2,
    family_kids: 1,
    dual_income: false,
    age_band: '40s',
    lifestyle_notes: '専業主婦、子供1人（12歳）',
    climate_region: 5,
    ua: 0.42,
    c_value: 0.15,
  },
];

export const MOCK_PV_CONFIGS: PVConfig[] = [
  {
    manufacturer: 'パナソニック',
    panel_model: 'VBHN120WJ01',
    panel_W: 120,
    panel_size_mm: '1048x1598',
    efficiency: 21.7,
    temp_coeff_pct_perC: -0.258,
    inverter_model: 'VBPC255GM',
    inverter_efficiency: 97.5,
    degradation_pct_per_year: 0.5,
  },
  {
    manufacturer: '京セラ',
    panel_model: 'KJ270P-3CRCE',
    panel_W: 270,
    panel_size_mm: '1662x990',
    efficiency: 16.4,
    temp_coeff_pct_perC: -0.41,
    inverter_model: 'PVN-404',
    inverter_efficiency: 96.0,
    degradation_pct_per_year: 0.7,
  },
];

export const MOCK_PERFORMANCE_ACTUALS: PerformanceActual[] = [
  {
    house_id: 'H2023001',
    handover_ym: '2023-03',
    ua: 0.45,
    c_value: 0.2,
    monthly_energy_kWh: 850,
    occupants: 4,
    climate_region: 6,
    note: '共働き家庭、在宅勤務あり',
  },
  {
    house_id: 'H2023002',
    handover_ym: '2023-04',
    ua: 0.42,
    c_value: 0.15,
    monthly_energy_kWh: 720,
    occupants: 3,
    climate_region: 5,
    note: '専業主婦家庭',
  },
];

export const MOCK_SALES_SCRIPTS: SalesScript[] = [
  {
    section: 'WHY',
    script_md: `# なぜG-HOUSEなのか

## 数値は目的ではなく手段

お客様、今日は貴重なお時間をいただき、ありがとうございます。

**G-HOUSEでは、数値（UA値・C値）は目的ではなく、あくまで手段だと考えています。**`,
  },
  {
    section: '性能',
    script_md: `# 性能・実績について

## 昨年度の実績

昨年度、G-HOUSEでは**30棟**のお客様にお引き渡しをさせていただきました。`,
  },
];
