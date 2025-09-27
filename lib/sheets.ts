// Google Sheets連携（現状はモックデータ、後でAPIキー差し替え）

import type {
  Customer,
  HVACLoad,
  PVConfig,
  PVSimulation,
  PerformanceActual,
  SalesScript,
  RolePlayEvaluation,
} from '@/types/domain';

// モックデータ（後でGoogle Sheets APIに差し替え）
const MOCK_CUSTOMERS: Customer[] = [
  {
    customer_id: 'CASE001',
    case_name: '田中様邸',
    site_area_tsubo: 45,
    floor_area_m2: 105,
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
    family_adults: 2,
    family_kids: 1,
    dual_income: false,
    age_band: '40s',
    lifestyle_notes: '専業主婦、子供1人（12歳）',
    climate_region: 5,
    ua: 0.42,
    c_value: 0.15,
  },
  {
    customer_id: 'CASE003',
    case_name: '山田様邸',
    site_area_tsubo: 52,
    floor_area_m2: 118,
    family_adults: 2,
    family_kids: 3,
    dual_income: true,
    age_band: '30s',
    lifestyle_notes: '共働き、子供3人（3歳・6歳・9歳）',
    climate_region: 7,
    ua: 0.48,
    c_value: 0.25,
  },
  {
    customer_id: 'CASE004',
    case_name: '鈴木様邸',
    site_area_tsubo: 41,
    floor_area_m2: 98,
    family_adults: 2,
    family_kids: 1,
    dual_income: true,
    age_band: '20s',
    lifestyle_notes: '新婚、子供1人（1歳）',
    climate_region: 4,
    ua: 0.44,
    c_value: 0.18,
  },
  {
    customer_id: 'CASE005',
    case_name: '高橋様邸',
    site_area_tsubo: 48,
    floor_area_m2: 112,
    family_adults: 2,
    family_kids: 0,
    dual_income: true,
    age_band: '50s',
    lifestyle_notes: '子供独立、夫婦二人暮らし',
    climate_region: 3,
    ua: 0.4,
    c_value: 0.12,
  },
  {
    customer_id: 'CASE006',
    case_name: '渡辺様邸',
    site_area_tsubo: 35,
    floor_area_m2: 85,
    family_adults: 3,
    family_kids: 1,
    dual_income: false,
    age_band: '40s',
    lifestyle_notes: '三世代同居、おばあちゃん・夫婦・子供1人（10歳）',
    climate_region: 6,
    ua: 0.45,
    c_value: 0.22,
  },
];

const MOCK_PV_CONFIGS: PVConfig[] = [
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
  {
    manufacturer: 'シャープ',
    panel_model: 'NU-375AH',
    panel_W: 375,
    panel_size_mm: '1956x992',
    efficiency: 19.3,
    temp_coeff_pct_perC: -0.35,
    inverter_model: 'JH-40K3P',
    inverter_efficiency: 97.5,
    degradation_pct_per_year: 0.5,
  },
];

const MOCK_PERFORMANCE_ACTUALS: PerformanceActual[] = [
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
  {
    house_id: 'H2023003',
    handover_ym: '2023-05',
    ua: 0.48,
    c_value: 0.25,
    monthly_energy_kWh: 920,
    occupants: 5,
    climate_region: 7,
    note: '5人家族、子供3人',
  },
  // 他の実績データ（30件程度）
  ...Array.from({ length: 27 }, (_, i) => ({
    house_id: `H2023${(i + 4).toString().padStart(3, '0')}`,
    handover_ym: `2023-${(Math.floor(i / 3) + 6).toString().padStart(2, '0')}`,
    ua: 0.4 + Math.random() * 0.15,
    c_value: 0.1 + Math.random() * 0.2,
    monthly_energy_kWh: 650 + Math.random() * 400,
    occupants: Math.floor(Math.random() * 4) + 2,
    climate_region: Math.floor(Math.random() * 8) + 1,
    note: '実績データ',
  })),
];

const MOCK_SALES_SCRIPTS: SalesScript[] = [
  {
    section: 'WHY',
    script_md: `# なぜG-HOUSEなのか

## 数値は目的ではなく手段

お客様、今日は貴重なお時間をいただき、ありがとうございます。

**G-HOUSEでは、数値（UA値・C値）は目的ではなく、あくまで手段だと考えています。**

真の目的は：
- **省エネ** - 光熱費を抑えて家計に優しい暮らし
- **快適性** - 一年中心地よく過ごせる住環境

## 根拠に基づいたご提案

本日は、以下の2つの根拠をもとに、お客様に最適なプランをご提案いたします：

1. **実績データ** - 昨年度引き渡した実際のお客様のデータ
2. **お客様の暮らし** - ご家族構成や生活スタイルに合わせた計算

数値だけでなく、お客様の実際の暮らしに寄り添ったご提案をお約束いたします。`,
  },
  {
    section: '性能',
    script_md: `# 性能・実績について

## 昨年度の実績

昨年度、G-HOUSEでは**{引渡し棟数}棟**のお客様にお引き渡しをさせていただきました。

その実績データから、地域・UA値・C値別の実際のエネルギー消費量をお見せいたします。

## お客様の地域での実績

- **地域区分**: {気候区分}地域
- **UA値平均**: {UA平均値}
- **C値平均**: {C値平均値}
- **月平均エネルギー使用量**: {月平均エネルギー}kWh

これらの実績データを踏まえ、お客様のご家族構成に最適な性能をご提案いたします。`,
  },
  {
    section: '空調',
    script_md: `# 空調計画について

## 目的は台数の少なさではありません

**空調で最も重要なのは、負荷に見合った適正容量の選定です。**

台数を減らすことが目的ではなく、お客様の住まいに必要な能力を、最も効率的に配置することが重要です。

## お客様の住まいでの計算結果

間取りが確定した時点で、以下の計算を行います：

- **冬季ピーク負荷**: {冬季ピーク}W
- **夏季ピーク負荷**: {夏季ピーク}W
- **推奨容量**: {推奨容量}kW

この計算により、過不足のない最適な空調プランをご提案いたします。`,
  },
  {
    section: '太陽光',
    script_md: `# 太陽光発電について

## 容量が利益を決める

**太陽光発電の損益を決めるのは"容量"です。**

メーカーやパネルサイズの違いによる最適化が重要です。

## 容量中心の検討ポイント

1. **屋根の有効面積**: {有効面積}㎡
2. **パネル選択**: メーカー・サイズによる枚数の違い
3. **発電容量**: {発電容量}kW
4. **15年NPV**: {NPV}万円

## 投資回収

- **設備投資**: {設備投資}万円
- **回収年数**: {回収年数}年

お客様の屋根条件に最適化した、収益性の高いプランをご提案いたします。`,
  },
  {
    section: 'コスト',
    script_md: `# 総合コストについて

## 初期投資と15年トータルコスト

建築費だけでなく、15年間のトータルコストで検討いただくことが重要です。

## 内訳

- **建築費**: {建築費}万円
- **太陽光設備**: {太陽光設備}万円
- **15年光熱費削減**: {光熱費削減}万円
- **15年太陽光収益**: {太陽光収益}万円

## 実質負担額

15年トータルでの実質負担額: **{実質負担額}万円**

月割りにすると: **{月額負担}円/月**`,
  },
  {
    section: 'メンテ',
    script_md: `# メンテナンスについて

## 30年間の安心をお約束

G-HOUSEでは、30年間にわたる計画的なメンテナンスプログラムをご用意しています。

## メンテナンス費用比較

**一般的な住宅**: 30年間で約{一般メンテ費用}万円
**G-HOUSE**: 30年間で約{Gハウスメンテ費用}万円

**削減額**: {メンテ削減額}万円

## 主な違い

- 高耐久外壁材による塗装頻度の削減
- 高性能サッシによる建具交換の削減
- 計画的メンテナンスによる突発修繕の回避

長期的な安心と、トータルコストの削減を実現いたします。`,
  },
];

// Google Sheets API関数（現状はモック、後でAPI実装）
export async function getCustomers(): Promise<Customer[]> {
  // TODO: Google Sheets APIの実装
  // 現状はモックデータを返却
  await new Promise((resolve) => setTimeout(resolve, 100)); // API呼び出しのシミュレート
  return MOCK_CUSTOMERS;
}

export async function getCustomerById(customerId: string): Promise<Customer | null> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return MOCK_CUSTOMERS.find((c) => c.customer_id === customerId) || null;
}

export async function getHVACLoads(): Promise<HVACLoad[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  // モックデータ - 実際のシートから取得する場合の形
  return [];
}

export async function getPVConfigs(): Promise<PVConfig[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PV_CONFIGS;
}

export async function getPVSimulations(): Promise<PVSimulation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [];
}

export async function getPerformanceActuals(): Promise<PerformanceActual[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_PERFORMANCE_ACTUALS;
}

export async function getSalesScripts(): Promise<SalesScript[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_SALES_SCRIPTS;
}

export async function getRolePlayEvaluations(): Promise<RolePlayEvaluation[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return [];
}

// 検索とフィルタリング
export async function searchCustomers(filter: {
  case_name?: string;
  customer_id?: string;
  age_band?: Customer['age_band'];
  dual_income?: boolean;
  climate_region?: Customer['climate_region'];
}): Promise<Customer[]> {
  const customers = await getCustomers();

  return customers.filter((customer) => {
    if (filter.case_name && !customer.case_name.includes(filter.case_name)) return false;
    if (filter.customer_id && !customer.customer_id.includes(filter.customer_id)) return false;
    if (filter.age_band && customer.age_band !== filter.age_band) return false;
    if (filter.dual_income !== undefined && customer.dual_income !== filter.dual_income)
      return false;
    if (filter.climate_region && customer.climate_region !== filter.climate_region) return false;
    return true;
  });
}

// 統計情報
export async function getPerformanceStats() {
  const actuals = await getPerformanceActuals();

  const totalHouses = actuals.length;
  const avgUA = actuals.reduce((sum, a) => sum + a.ua, 0) / totalHouses;
  const avgCValue = actuals.reduce((sum, a) => sum + a.c_value, 0) / totalHouses;
  const avgEnergy = actuals.reduce((sum, a) => sum + a.monthly_energy_kWh, 0) / totalHouses;

  return {
    totalHouses,
    avgUA: Math.round(avgUA * 100) / 100,
    avgCValue: Math.round(avgCValue * 100) / 100,
    avgEnergy: Math.round(avgEnergy),
  };
}

// 保存関数（将来的にSheets書き戻し用）
export async function saveCustomer(customer: Customer): Promise<void> {
  // TODO: Google Sheets API書き戻し実装
  console.log('Customer saved (mock):', customer);
}

export async function saveRolePlayEvaluation(evaluation: RolePlayEvaluation): Promise<void> {
  // TODO: Google Sheets API書き戻し実装
  console.log('RolePlay evaluation saved (mock):', evaluation);
}
