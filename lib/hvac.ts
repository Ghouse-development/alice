// 空調負荷計算ロジック（まずは近似計算、後で精緻化）

import type { HVACCalculationInput, HVACCalculationResult } from '@/types/domain';

// 地域別係数（後で気象データと連携）
const REGION_FACTORS = {
  1: 1.35, // 北海道
  2: 1.3, // 青森、岩手、秋田
  3: 1.25, // 宮城、山形、福島、栃木、新潟、長野
  4: 1.2, // 茨城、群馬、埼玉、千葉、東京、神奈川、富山、石川、福井、山梨、岐阜、静岡、愛知、三重
  5: 1.15, // 滋賀、京都、大阪、兵庫、奈良、和歌山、鳥取、島根、岡山、広島、山口、徳島、香川、愛媛、高知、福岡、佐賀、長崎、大分
  6: 1.1, // 熊本、宮崎
  7: 1.05, // 鹿児島
  8: 1.0, // 沖縄
} as const;

// 換気による熱負荷係数（Wh/m3K）
const VENTILATION_HEAT_FACTOR = 0.33;

// 最低推奨容量（kW）
const MIN_CAPACITY_KW = 2.2;

/**
 * 空調負荷→容量の推定計算
 */
export function estimateHVACCapacity(opts: HVACCalculationInput): HVACCalculationResult {
  const {
    floor_area_m2,
    ua,
    c_value,
    climate_region,
    ventilation_rate_m3h,
    shell_area_m2 = floor_area_m2 * 3.5, // 外皮面積の近似（床面積 × 3.5）
    layout_confirmed,
  } = opts;

  // 基本熱損失（W）- 外皮経由
  const deltaT_winter = 20; // 設計温度差（℃）
  const baseHeatLoss_W = ua * shell_area_m2 * deltaT_winter * 1.2; // 安全係数1.2

  // 気密性による補正（C値が小さいほど隙間風による負荷が減る）
  const infiltrationFactor = Math.max(0.8, 1.2 - c_value * 0.1);

  // 換気による熱負荷（W）
  const ventilation_W = ventilation_rate_m3h * VENTILATION_HEAT_FACTOR * deltaT_winter;

  // 地域係数
  const regionFactor = REGION_FACTORS[climate_region] ?? 1.15;

  // 冬季ピーク負荷（W）
  const peak_W_winter = (baseHeatLoss_W * infiltrationFactor + ventilation_W) * regionFactor;

  // 夏季ピーク負荷（W）- 冬季の0.9倍として近似（内部発熱・日射取得を考慮）
  const peak_W_summer = peak_W_winter * 0.9;

  // 推奨容量（kW）
  const recommended_kW = Math.max(MIN_CAPACITY_KW, Math.round((peak_W_winter / 1000) * 10) / 10);

  // メッセージ生成
  let message = `床面積${floor_area_m2}㎡、UA値${ua}、C値${c_value}`;
  if (!layout_confirmed) {
    message += '（間取り確定後に再計算が必要）';
  }

  // 容量による推奨メッセージ
  if (recommended_kW <= 2.8) {
    message += ' → 6畳用エアコン1台で対応可能';
  } else if (recommended_kW <= 4.0) {
    message += ' → 10畳用エアコン1台で対応可能';
  } else if (recommended_kW <= 5.6) {
    message += ' → 14畳用エアコン1台で対応可能';
  } else {
    message += ' → 複数台または大容量機が必要';
  }

  return {
    peak_W_summer: Math.round(peak_W_summer),
    peak_W_winter: Math.round(peak_W_winter),
    recommended_kW,
    message,
  };
}

/**
 * 容量からエアコン仕様の推奨
 */
export function getACRecommendation(capacity_kW: number) {
  if (capacity_kW <= 2.8) {
    return {
      size: '6畳用',
      typical_model: '2.2kW',
      units: 1,
      note: '全館1台でカバー可能',
    };
  } else if (capacity_kW <= 4.0) {
    return {
      size: '10畳用',
      typical_model: '2.8kW',
      units: 1,
      note: '全館1台でカバー可能',
    };
  } else if (capacity_kW <= 5.6) {
    return {
      size: '14畳用',
      typical_model: '4.0kW',
      units: 1,
      note: '全館1台でカバー可能',
    };
  } else if (capacity_kW <= 8.0) {
    return {
      size: '20畳用',
      typical_model: '5.6kW',
      units: 1,
      note: '大容量機1台または中容量機2台',
    };
  } else {
    return {
      size: '複数台構成',
      typical_model: '4.0kW × 2台',
      units: 2,
      note: '複数台での分散配置を推奨',
    };
  }
}

/**
 * 年間エネルギー消費量の推定
 */
export function estimateAnnualEnergyConsumption(opts: {
  capacity_kW: number;
  ua: number;
  c_value: number;
  floor_area_m2: number;
  climate_region: number;
  occupants: number;
}): number {
  const { ua, c_value, floor_area_m2, climate_region, occupants } = opts;

  // 基本消費量（kWh/年）
  const baseConsumption = floor_area_m2 * 60; // 60kWh/㎡・年を基準

  // 性能補正
  const performanceFactor = (ua / 0.87) * (c_value / 5.0); // 次世代省エネ基準との比較

  // 地域補正
  const regionFactor = REGION_FACTORS[climate_region] ?? 1.15;

  // 人数補正
  const occupantFactor = 0.8 + occupants * 0.1; // 人数による補正

  // 年間消費量
  const annualConsumption = baseConsumption * performanceFactor * regionFactor * occupantFactor;

  return Math.round(annualConsumption);
}

/**
 * 他社比較用の参考データ
 */
export function getComparisonData(capacity_kW: number) {
  return {
    ghouse: {
      capacity_kW,
      units: capacity_kW <= 5.6 ? 1 : 2,
      concept: '適正容量・全館空調',
    },
    typical_house: {
      capacity_kW: capacity_kW * 1.5, // 一般的な住宅は過剰設備
      units: Math.ceil(capacity_kW / 2.8), // 部屋別エアコン
      concept: '部屋別・過剰容量',
    },
  };
}

/**
 * 設計値の妥当性チェック
 */
export function validateHVACDesign(opts: HVACCalculationInput): {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // UA値のチェック
  if (opts.ua > 0.6) {
    warnings.push('UA値が0.6を超えています。断熱性能の向上を検討してください。');
  }

  // C値のチェック
  if (opts.c_value > 1.0) {
    warnings.push('C値が1.0を超えています。気密性能の向上を検討してください。');
  }

  // 換気量のチェック
  const minVentilation = opts.floor_area_m2 * 0.5; // 0.5回/時の最低基準
  if (opts.ventilation_rate_m3h < minVentilation) {
    warnings.push(
      `換気量が不足している可能性があります。最低${Math.round(minVentilation)}m³/hを推奨します。`
    );
  }

  // 間取り確定チェック
  if (!opts.layout_confirmed) {
    recommendations.push('間取り確定後に再計算を行い、より正確な容量を算出してください。');
  }

  // パフォーマンス評価
  if (opts.ua <= 0.46 && opts.c_value <= 0.5) {
    recommendations.push('優秀な断熱・気密性能です。小容量エアコンでの全館空調が可能です。');
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    recommendations,
  };
}
