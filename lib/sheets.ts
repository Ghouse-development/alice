// Supabase連携

import { supabase } from './supabase';
import type {
  Customer,
  HVACLoad,
  PVConfig,
  PVSimulation,
  PerformanceActual,
  SalesScript,
  RolePlayEvaluation,
} from '@/types/domain';

// Supabase API関数
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data || [];
}

export async function getCustomerById(customerId: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_id', customerId)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    return null;
  }

  return data;
}

export async function getHVACLoads(): Promise<HVACLoad[]> {
  // HVACLoadsテーブルが必要な場合は後で追加
  return [];
}

export async function getPVConfigs(): Promise<PVConfig[]> {
  const { data, error } = await supabase
    .from('pv_configs')
    .select('*')
    .order('manufacturer', { ascending: true });

  if (error) {
    console.error('Error fetching PV configs:', error);
    return [];
  }

  return data || [];
}

export async function getPVSimulations(): Promise<PVSimulation[]> {
  // PVSimulationsテーブルが必要な場合は後で追加
  return [];
}

export async function getPerformanceActuals(): Promise<PerformanceActual[]> {
  const { data, error } = await supabase
    .from('performance_actuals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching performance actuals:', error);
    return [];
  }

  return data || [];
}

export async function getSalesScripts(): Promise<SalesScript[]> {
  const { data, error } = await supabase
    .from('sales_scripts')
    .select('*')
    .order('section', { ascending: true });

  if (error) {
    console.error('Error fetching sales scripts:', error);
    return [];
  }

  return data || [];
}

export async function getRolePlayEvaluations(): Promise<RolePlayEvaluation[]> {
  const { data, error } = await supabase
    .from('role_play_evaluations')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching role play evaluations:', error);
    return [];
  }

  return data || [];
}

// 検索とフィルタリング
export async function searchCustomers(filter: {
  case_name?: string;
  customer_id?: string;
  age_band?: Customer['age_band'];
  dual_income?: boolean;
  climate_region?: Customer['climate_region'];
}): Promise<Customer[]> {
  let query = supabase.from('customers').select('*');

  if (filter.case_name) {
    query = query.ilike('case_name', `%${filter.case_name}%`);
  }
  if (filter.customer_id) {
    query = query.ilike('customer_id', `%${filter.customer_id}%`);
  }
  if (filter.age_band) {
    query = query.eq('age_band', filter.age_band);
  }
  if (filter.dual_income !== undefined) {
    query = query.eq('dual_income', filter.dual_income);
  }
  if (filter.climate_region) {
    query = query.eq('climate_region', filter.climate_region);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching customers:', error);
    return [];
  }

  return data || [];
}

// 統計情報
export async function getPerformanceStats() {
  const { data, error } = await supabase
    .from('performance_actuals')
    .select('ua, c_value, monthly_energy_kWh');

  if (error) {
    console.error('Error fetching performance stats:', error);
    return {
      totalHouses: 0,
      avgUA: 0,
      avgCValue: 0,
      avgEnergy: 0,
    };
  }

  if (!data || data.length === 0) {
    return {
      totalHouses: 0,
      avgUA: 0,
      avgCValue: 0,
      avgEnergy: 0,
    };
  }

  const totalHouses = data.length;
  const avgUA = data.reduce((sum, a) => sum + a.ua, 0) / totalHouses;
  const avgCValue = data.reduce((sum, a) => sum + a.c_value, 0) / totalHouses;
  const avgEnergy = data.reduce((sum, a) => sum + a.monthly_energy_kWh, 0) / totalHouses;

  return {
    totalHouses,
    avgUA: Math.round(avgUA * 100) / 100,
    avgCValue: Math.round(avgCValue * 100) / 100,
    avgEnergy: Math.round(avgEnergy),
  };
}

// 保存関数
export async function saveCustomer(
  customer: Omit<Customer, 'created_at' | 'updated_at'>
): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .upsert(customer, { onConflict: 'customer_id' });

  if (error) {
    console.error('Error saving customer:', error);
    throw error;
  }
}

export async function saveRolePlayEvaluation(
  evaluation: Omit<RolePlayEvaluation, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase.from('role_play_evaluations').insert(evaluation);

  if (error) {
    console.error('Error saving role play evaluation:', error);
    throw error;
  }
}

// 初期データ投入用関数（開発用）
export async function seedDatabase() {
  // モックデータをSupabaseに投入する場合に使用
  const mockCustomers = [
    {
      customer_id: 'CASE001',
      case_name: '田中様邸',
      site_area_tsubo: 45,
      floor_area_m2: 105,
      floors: 2,
      family_adults: 2,
      family_kids: 2,
      dual_income: true,
      age_band: '30s' as const,
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
      age_band: '40s' as const,
      lifestyle_notes: '専業主婦、子供1人（12歳）',
      climate_region: 5,
      ua: 0.42,
      c_value: 0.15,
    },
  ];

  const mockPVConfigs = [
    {
      manufacturer: 'パナソニック',
      panel_model: 'VBHN120WJ01',
      panel_W: 120,
      efficiency: 21.7,
      unit_price_JPY: 45000,
    },
    {
      manufacturer: '京セラ',
      panel_model: 'KJ270P-3CRCE',
      panel_W: 270,
      efficiency: 16.4,
      unit_price_JPY: 55000,
    },
  ];

  const mockSalesScripts = [
    {
      section: 'WHY',
      script_md: `# なぜG-HOUSEなのか

## 数値は目的ではなく手段

お客様、今日は貴重なお時間をいただき、ありがとうございます。

**G-HOUSEでは、数値（UA値・C値）は目的ではなく、あくまで手段だと考えています。**

真の目的は：
- **省エネ** - 光熱費を抑えて家計に優しい暮らし
- **快適性** - 一年中心地よく過ごせる住環境`,
    },
    {
      section: '性能',
      script_md: `# 性能・実績について

## 昨年度の実績

昨年度、G-HOUSEでは**30棟**のお客様にお引き渡しをさせていただきました。`,
    },
  ];

  // 顧客データ投入
  for (const customer of mockCustomers) {
    await saveCustomer(customer);
  }

  // PV設定データ投入
  for (const config of mockPVConfigs) {
    const { error } = await supabase.from('pv_configs').insert(config);
    if (error) console.error('Error seeding PV config:', error);
  }

  // セールススクリプト投入
  for (const script of mockSalesScripts) {
    const { error } = await supabase.from('sales_scripts').insert(script);
    if (error) console.error('Error seeding sales script:', error);
  }

  console.log('Database seeded successfully');
}
