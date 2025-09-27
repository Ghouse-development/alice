import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseの設定がない場合はダミークライアントを返す（ビルド時のエラー回避）
const isDevelopment = process.env.NODE_ENV === 'development';
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey;

if (!hasSupabaseConfig && isDevelopment) {
  console.warn(
    '⚠️ Supabase environment variables are not set. Database features will not work.\n' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
  );
}

// ダミーのSupabaseクライアント（環境変数がない場合）
const createDummyClient = () => {
  return {
    from: (table: string) => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      upsert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      eq: () => ({
        single: () =>
          Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      }),
      ilike: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
      }),
      order: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  };
};

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : (createDummyClient() as any);

// Database Types
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          customer_id: string;
          case_name: string;
          age_band: string;
          dual_income: boolean;
          family_adults: number;
          family_kids: number;
          lifestyle_notes: string | null;
          floor_area_m2: number;
          floors: number;
          ua: number;
          c_value: number;
          climate_region: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      sales_scripts: {
        Row: {
          id: string;
          section: string;
          script_md: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['sales_scripts']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['sales_scripts']['Insert']>;
      };
      performance_actuals: {
        Row: {
          id: string;
          climate_region: number;
          ua: number;
          c_value: number;
          monthly_energy_kWh: number;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['performance_actuals']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['performance_actuals']['Insert']>;
      };
      pv_configs: {
        Row: {
          id: string;
          manufacturer: string;
          panel_model: string;
          panel_W: number;
          efficiency: number;
          unit_price_JPY: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pv_configs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pv_configs']['Insert']>;
      };
      role_play_evaluations: {
        Row: {
          id: string;
          evaluator_id: string;
          trainee_id: string;
          case_id: string;
          date: string;
          sections: any; // JSONB
          overall_notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['role_play_evaluations']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['role_play_evaluations']['Insert']>;
      };
    };
  };
}
