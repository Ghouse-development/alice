// 営業支援システムのドメイン型定義

export type Customer = {
  customer_id: string;
  case_name: string;
  site_area_tsubo?: number;
  floor_area_m2: number;
  family_adults: number;
  family_kids: number;
  dual_income: boolean;
  age_band: '20s' | '30s' | '40s' | '50s';
  lifestyle_notes?: string;
  climate_region: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  ua: number;
  c_value: number;
};

export type HVACLoad = {
  customer_id: string;
  shell_area_m2: number;
  q_spec_W_m2K: number;
  ventilation_rate_m3h: number;
  infiltration_c_value: number;
  summer_peak_W: number;
  winter_peak_W: number;
  recommended_capacity_kW: number;
  note?: string;
};

export type PVConfig = {
  manufacturer: string;
  panel_model: string;
  panel_W: number;
  panel_size_mm: string;
  efficiency: number;
  temp_coeff_pct_perC: number;
  inverter_model: string;
  inverter_efficiency: number;
  degradation_pct_per_year: number;
};

export type PVSimulation = {
  customer_id: string;
  roof_useable_m2: number;
  tilt_deg: number;
  azimuth_deg: number;
  target_capacity_kW: number;
  num_panels: number;
  annual_gen_kWh: number;
  self_consumption_rate_pct: number;
  night_tariff_JPY_kWh: number;
  day_tariff_JPY_kWh: number;
  sell_price_JPY_kWh: number;
  capex_JPY: number;
  power_cond_replacement_JPY: number;
  npv_15y_JPY: number;
  simple_payback_y: number;
  comment?: string;
};

export type PerformanceActual = {
  house_id: string;
  handover_ym: string;
  ua: number;
  c_value: number;
  monthly_energy_kWh: number;
  occupants: number;
  climate_region: number;
  note?: string;
};

export type SalesScript = {
  section: 'WHY' | '性能' | '空調' | '太陽光' | 'コスト' | 'メンテ';
  script_md: string;
};

// 案件進捗タグ
export type ProgressTag = '根拠準備' | '実績提示' | '負荷計算' | '太陽光試算' | 'スクリプトOK';

// 案件ダッシュボード用の統合型
export type CaseOverview = {
  customer: Customer;
  hvac_load?: HVACLoad;
  pv_simulation?: PVSimulation;
  progress_tags: ProgressTag[];
  updated_at: string;
};

// 検索フィルター
export type CaseSearchFilter = {
  case_name?: string;
  customer_id?: string;
  age_band?: Customer['age_band'];
  dual_income?: boolean;
  climate_region?: Customer['climate_region'];
};

// ロールプレイ評価
export type RolePlayEvaluation = {
  evaluator_id: string;
  trainee_id: string;
  case_id: string;
  date: string;
  sections: {
    section: SalesScript['section'];
    score: '◎' | '○' | '△' | '×';
    notes?: string;
  }[];
  overall_notes?: string;
};

// 空調負荷計算入力パラメータ
export type HVACCalculationInput = {
  floor_area_m2: number;
  ua: number;
  c_value: number;
  climate_region: number;
  ventilation_rate_m3h: number;
  shell_area_m2?: number;
  layout_confirmed: boolean;
};

// 太陽光シミュレーション入力パラメータ
export type PVSimulationInput = {
  manufacturer: string;
  panel_model: string;
  roof_useable_m2: number;
  tilt_deg: number;
  azimuth_deg: number;
  self_consumption_rate_pct: number;
  day_tariff_JPY_kWh: number;
  night_tariff_JPY_kWh: number;
  sell_price_JPY_kWh: number;
  capex_JPY: number;
  power_cond_replacement_JPY: number;
};

// 計算結果
export type HVACCalculationResult = {
  peak_W_summer: number;
  peak_W_winter: number;
  recommended_kW: number;
  message: string;
};

export type PVSimulationResult = {
  num_panels: number;
  capacity_kW: number;
  annual_gen_kWh: number;
  npv_15y_JPY: number;
  simple_payback_y: number;
  message: string;
};
