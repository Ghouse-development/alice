// 太陽光発電シミュレーション（容量中心）

import type { PVConfig, PVSimulationInput, PVSimulationResult } from '@/types/domain';

// 地域別年間日射量係数（kWh/kW・年）- 後で気象データと連携
const REGIONAL_IRRADIATION = {
  1: 1000, // 北海道
  2: 1050, // 東北
  3: 1100, // 関東甲信越
  4: 1200, // 東海・北陸
  5: 1150, // 関西・中国・四国・北九州
  6: 1180, // 南九州
  7: 1200, // 鹿児島
  8: 1300, // 沖縄
} as const;

// 方位・傾斜による補正係数
const ORIENTATION_FACTORS = {
  south: { 30: 1.0, 20: 0.99, 40: 0.98, 0: 0.93 },
  southeast: { 30: 0.96, 20: 0.95, 40: 0.94 },
  southwest: { 30: 0.96, 20: 0.95, 40: 0.94 },
  east: { 30: 0.85, 20: 0.84, 40: 0.83 },
  west: { 30: 0.85, 20: 0.84, 40: 0.83 },
} as const;

// パネルサイズ（mm）から面積（㎡）を計算
function getPanelArea(size_mm: string): number {
  const [width, height] = size_mm.split('x').map((s) => parseInt(s.trim()));
  return (width * height) / 1000000; // ㎡に変換
}

// 方位から補正係数を取得
function getOrientationFactor(azimuth_deg: number, tilt_deg: number): number {
  let orientation: keyof typeof ORIENTATION_FACTORS;

  if (azimuth_deg >= 157.5 && azimuth_deg <= 202.5) {
    orientation = 'south';
  } else if (azimuth_deg >= 112.5 && azimuth_deg < 157.5) {
    orientation = 'southeast';
  } else if (azimuth_deg > 202.5 && azimuth_deg <= 247.5) {
    orientation = 'southwest';
  } else if (azimuth_deg >= 67.5 && azimuth_deg < 112.5) {
    orientation = 'east';
  } else if (azimuth_deg > 247.5 && azimuth_deg <= 292.5) {
    orientation = 'west';
  } else {
    orientation = 'south'; // デフォルト
  }

  const tiltFactors = ORIENTATION_FACTORS[orientation];
  const closestTilt = Object.keys(tiltFactors)
    .map(Number)
    .reduce((prev, curr) => (Math.abs(curr - tilt_deg) < Math.abs(prev - tilt_deg) ? curr : prev));

  return tiltFactors[closestTilt as keyof typeof tiltFactors] || 1.0;
}

/**
 * 太陽光発電容量中心シミュレーション
 */
export function simulatePV(
  input: PVSimulationInput,
  panelConfig: PVConfig,
  climate_region: number = 4
): PVSimulationResult {
  const {
    roof_useable_m2,
    tilt_deg,
    azimuth_deg,
    self_consumption_rate_pct,
    day_tariff_JPY_kWh,
    sell_price_JPY_kWh,
    capex_JPY,
    power_cond_replacement_JPY,
  } = input;

  // パネル面積を計算
  const panel_area_m2 = getPanelArea(panelConfig.panel_size_mm);

  // 設置可能枚数（容量が利益を決める重要な要素）
  const num_panels = Math.floor(roof_useable_m2 / panel_area_m2);

  // 発電容量（kW）
  const capacity_kW = (num_panels * panelConfig.panel_W) / 1000;

  // 年間発電量計算
  const base_kWh_per_kW =
    REGIONAL_IRRADIATION[climate_region as keyof typeof REGIONAL_IRRADIATION] || 1200;
  const orientation_factor = getOrientationFactor(azimuth_deg, tilt_deg);
  const inverter_eff = panelConfig.inverter_efficiency / 100;

  const annual_gen_kWh = capacity_kW * base_kWh_per_kW * orientation_factor * inverter_eff;

  // 自己消費と売電の分離
  const self_consumption_kWh = annual_gen_kWh * (self_consumption_rate_pct / 100);
  const sell_kWh = annual_gen_kWh - self_consumption_kWh;

  // 年間収益
  const annual_benefit =
    self_consumption_kWh * day_tariff_JPY_kWh + // 自己消費分は買電削減
    sell_kWh * sell_price_JPY_kWh; // 売電分

  // 劣化率
  const degradation_rate = 1 - panelConfig.degradation_pct_per_year / 100;

  // 15年NPV計算（簡易版）
  const discount_rate = 0.03; // 3%割引率
  let npv = -capex_JPY - power_cond_replacement_JPY; // 初期投資（10年目にパワコン交換）

  let annual_cash = annual_benefit;
  for (let year = 1; year <= 15; year++) {
    const discount_factor = 1 / Math.pow(1 + discount_rate, year);

    // 10年目にパワコン交換コスト
    if (year === 10) {
      npv -= power_cond_replacement_JPY * discount_factor;
    }

    npv += annual_cash * discount_factor;
    annual_cash *= degradation_rate; // 毎年劣化
  }

  // 単純回収年数
  const simple_payback_y = capex_JPY / annual_benefit;

  // メッセージ生成
  let message = `${panelConfig.manufacturer} ${panelConfig.panel_model}`;
  message += ` → ${num_panels}枚設置可能、容量${capacity_kW}kW`;

  if (capacity_kW < 3.0) {
    message += '（容量不足のリスクあり）';
  } else if (capacity_kW >= 5.0) {
    message += '（十分な容量確保）';
  }

  return {
    num_panels,
    capacity_kW: Math.round(capacity_kW * 10) / 10,
    annual_gen_kWh: Math.round(annual_gen_kWh),
    npv_15y_JPY: Math.round(npv),
    simple_payback_y: Math.round(simple_payback_y * 10) / 10,
    message,
  };
}

/**
 * メーカー・パネル比較
 */
export function comparePVConfigs(
  input: PVSimulationInput,
  configs: PVConfig[],
  climate_region: number = 4
) {
  return configs
    .map((config) => ({
      config,
      simulation: simulatePV(input, config, climate_region),
    }))
    .sort((a, b) => b.simulation.npv_15y_JPY - a.simulation.npv_15y_JPY); // NPV順でソート
}

/**
 * 容量による収益分析
 */
export function analyzeCapacityImpact(
  baseInput: PVSimulationInput,
  panelConfig: PVConfig,
  climate_region: number = 4
) {
  const results = [];

  // 屋根面積を変化させて容量の影響を分析
  for (let ratio = 0.5; ratio <= 1.2; ratio += 0.1) {
    const modifiedInput = {
      ...baseInput,
      roof_useable_m2: baseInput.roof_useable_m2 * ratio,
    };

    const result = simulatePV(modifiedInput, panelConfig, climate_region);
    results.push({
      roof_ratio: ratio,
      capacity_kW: result.capacity_kW,
      npv_15y_JPY: result.npv_15y_JPY,
      payback_y: result.simple_payback_y,
    });
  }

  return results;
}

/**
 * 自己消費率の最適化分析
 */
export function optimizeSelfConsumption(
  input: PVSimulationInput,
  panelConfig: PVConfig,
  climate_region: number = 4
) {
  const results = [];

  // 自己消費率を変化させて最適解を探る
  for (let rate = 20; rate <= 80; rate += 10) {
    const modifiedInput = {
      ...input,
      self_consumption_rate_pct: rate,
    };

    const result = simulatePV(modifiedInput, panelConfig, climate_region);
    results.push({
      self_consumption_rate: rate,
      annual_benefit:
        ((result.annual_gen_kWh * rate) / 100) * input.day_tariff_JPY_kWh +
        ((result.annual_gen_kWh * (100 - rate)) / 100) * input.sell_price_JPY_kWh,
      npv_15y_JPY: result.npv_15y_JPY,
    });
  }

  return results.sort((a, b) => b.npv_15y_JPY - a.npv_15y_JPY);
}

/**
 * 投資回収シミュレーション（詳細版）
 */
export function detailedPaybackAnalysis(
  input: PVSimulationInput,
  panelConfig: PVConfig,
  climate_region: number = 4
) {
  const simulation = simulatePV(input, panelConfig, climate_region);
  const annual_benefit_initial =
    ((simulation.annual_gen_kWh * input.self_consumption_rate_pct) / 100) *
      input.day_tariff_JPY_kWh +
    ((simulation.annual_gen_kWh * (100 - input.self_consumption_rate_pct)) / 100) *
      input.sell_price_JPY_kWh;

  const degradation_rate = 1 - panelConfig.degradation_pct_per_year / 100;

  const yearlyData = [];
  let cumulative_benefit = 0;
  let annual_benefit = annual_benefit_initial;

  for (let year = 1; year <= 20; year++) {
    cumulative_benefit += annual_benefit;

    // 10年目にパワコン交換
    let year_cost = 0;
    if (year === 10) {
      year_cost = input.power_cond_replacement_JPY;
    }

    const net_cumulative = cumulative_benefit - input.capex_JPY - year_cost;

    yearlyData.push({
      year,
      annual_benefit: Math.round(annual_benefit),
      cumulative_benefit: Math.round(cumulative_benefit),
      net_cumulative: Math.round(net_cumulative),
      is_payback_achieved: net_cumulative > 0,
    });

    annual_benefit *= degradation_rate; // 次年度は劣化
  }

  return yearlyData;
}

/**
 * 設置可能性の評価
 */
export function evaluateInstallationFeasibility(input: PVSimulationInput, panelConfig: PVConfig) {
  const panel_area_m2 = getPanelArea(panelConfig.panel_size_mm);
  const num_panels = Math.floor(input.roof_useable_m2 / panel_area_m2);
  const capacity_kW = (num_panels * panelConfig.panel_W) / 1000;

  const issues = [];
  const recommendations = [];

  // 容量チェック
  if (capacity_kW < 3.0) {
    issues.push('発電容量が3kW未満です。投資効果が限定的な可能性があります。');
    recommendations.push('屋根面積の見直しまたは高効率パネルの検討をお勧めします。');
  }

  // 方位チェック
  if (input.azimuth_deg < 135 || input.azimuth_deg > 225) {
    issues.push('屋根の方位が南向きから大きく外れています。');
    recommendations.push(
      '発電効率が低下する可能性があります。他の屋根面の活用も検討してください。'
    );
  }

  // 傾斜チェック
  if (input.tilt_deg < 10 || input.tilt_deg > 50) {
    issues.push('屋根の傾斜が最適範囲（10-50度）を外れています。');
  }

  // 投資回収チェック
  const payback = input.capex_JPY / (capacity_kW * 1200 * 25); // 簡易計算
  if (payback > 12) {
    issues.push('投資回収期間が12年を超える可能性があります。');
    recommendations.push('設備コストの見直しまたは補助金の活用を検討してください。');
  }

  return {
    feasible: issues.length === 0,
    capacity_kW,
    num_panels,
    issues,
    recommendations,
  };
}
