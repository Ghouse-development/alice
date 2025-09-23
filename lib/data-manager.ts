import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Project,
  Customer,
  HearingSheet,
  OptionMaster,
  Presentation1,
  Presentation2,
  Presentation3,
  Presentation4,
  Presentation5,
  Presentation6
} from '@/types';

// Excel data structure for import/export
export interface ExcelData {
  // 工事費
  本体: number;
  付帯A: number;
  付帯B: number;
  オプション費用: number;
  付帯C: number;
  消費税: number;
  合計: number;
  // その他費用
  外構工事: number;
  土地費用: number;
  諸費用: number;
  総額: number;
  // 資金計画
  自己資金: number;
  借入金額: number;
  金利: number;
  借入年数: number;
  // 基本情報
  商品名?: string;
  坪数?: number;
  階数?: string;
  お客様名?: string;
  営業担当者?: string;
}

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cached items
}

interface CachedData<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// Data validation schemas
interface ValidationRule<T> {
  field: keyof T;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Data sync configuration
interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // milliseconds
  conflictResolution: 'local' | 'remote' | 'manual';
}

// Data transformation utilities
interface DataTransformer<TSource, TTarget> {
  transform: (source: TSource) => TTarget;
  reverse: (target: TTarget) => TSource;
  validate?: (data: TSource | TTarget) => ValidationResult;
}

// Main data manager interface
interface DataManagerState {
  // Cache management
  cache: Map<string, CachedData<any>>;
  cacheConfig: CacheConfig;

  // Data validation
  validationRules: Map<string, ValidationRule<any>[]>;

  // Sync configuration
  syncConfig: SyncConfig;
  syncStatus: 'idle' | 'syncing' | 'error';
  lastSyncTime: number | null;

  // Excel data integration
  excelData: Map<string, ExcelData>;
  excelImportHistory: Array<{
    timestamp: number;
    filename: string;
    recordCount: number;
    projectId?: string;
  }>;

  // Data transformers
  transformers: Map<string, DataTransformer<any, any>>;

  // Actions
  // Cache operations
  setCacheItem: <T>(key: string, data: T, customTtl?: number) => void;
  getCacheItem: <T>(key: string) => T | null;
  clearCache: (pattern?: string) => void;
  getCacheStats: () => { size: number; hitRate: number; memoryUsage: number };

  // Data validation
  validateData: <T>(data: T, entityType: string) => ValidationResult;
  addValidationRule: <T>(entityType: string, rule: ValidationRule<T>) => void;
  removeValidationRule: (entityType: string, field: string) => void;

  // Excel integration
  importExcelData: (data: ExcelData[], projectId?: string) => Promise<void>;
  exportToExcel: (projectIds: string[]) => ExcelData[];
  transformExcelToProject: (excelData: ExcelData) => Partial<Project>;
  transformProjectToExcel: (project: Project) => ExcelData;

  // Data synchronization
  syncData: () => Promise<void>;
  setSyncConfig: (config: Partial<SyncConfig>) => void;
  resolveConflict: (localData: any, remoteData: any, resolution: 'local' | 'remote') => any;

  // Data normalization
  normalizeData: <T>(data: T, entityType: string) => T;
  denormalizeData: <T>(data: T, entityType: string) => T;

  // Backup and recovery
  createBackup: () => string;
  restoreFromBackup: (backupData: string) => void;

  // Data integrity
  checkDataIntegrity: () => Promise<ValidationResult>;
  repairData: () => Promise<void>;

  // Performance monitoring
  getPerformanceMetrics: () => {
    cacheHitRate: number;
    averageQueryTime: number;
    memoryUsage: number;
    syncLatency: number;
  };
}

// Excel to Project data transformer
const excelToProjectTransformer: DataTransformer<ExcelData, Partial<Project>> = {
  transform: (excelData: ExcelData): Partial<Project> => {
    const now = new Date();

    return {
      projectName: excelData.商品名 || 'インポートプロジェクト',
      customerName: excelData.お客様名 || '未設定',
      salesPerson: excelData.営業担当者 || '未設定',
      status: 'draft',
      updatedAt: now,
      presentation4: {
        id: `p4-${Date.now()}`,
        projectId: '', // Will be set by caller
        buildingCost: excelData.本体 || 0,
        constructionCost: (excelData.付帯A || 0) + (excelData.付帯B || 0) + (excelData.付帯C || 0),
        otherCosts: (excelData.外構工事 || 0) + (excelData.諸費用 || 0),
        landCost: excelData.土地費用 || 0,
        totalCost: excelData.総額 || 0,
        loanAmount: excelData.借入金額 || 0,
        downPayment: excelData.自己資金 || 0,
        interestRate: excelData.金利 || 0,
        loanPeriod: excelData.借入年数 || 0,
        monthlyPayment: 0, // Will be calculated
        costBreakdown: [
          { id: '1', category: '建物', item: '本体工事', amount: excelData.本体 || 0 },
          { id: '2', category: '建物', item: '付帯工事A', amount: excelData.付帯A || 0 },
          { id: '3', category: '建物', item: '付帯工事B', amount: excelData.付帯B || 0 },
          { id: '4', category: '建物', item: 'オプション', amount: excelData.オプション費用 || 0 },
          { id: '5', category: '建物', item: '付帯工事C', amount: excelData.付帯C || 0 },
          { id: '6', category: '税金', item: '消費税', amount: excelData.消費税 || 0 },
          { id: '7', category: 'その他', item: '外構工事', amount: excelData.外構工事 || 0 },
          { id: '8', category: 'その他', item: '諸費用', amount: excelData.諸費用 || 0 },
        ].filter(item => item.amount > 0),
        excelData: excelData,
      },
    };
  },

  reverse: (project: Partial<Project>): ExcelData => {
    const p4 = project.presentation4;
    return {
      本体: p4?.excelData?.本体 || p4?.buildingCost || 0,
      付帯A: p4?.excelData?.付帯A || 0,
      付帯B: p4?.excelData?.付帯B || 0,
      オプション費用: p4?.excelData?.オプション費用 || 0,
      付帯C: p4?.excelData?.付帯C || 0,
      消費税: p4?.excelData?.消費税 || 0,
      合計: p4?.excelData?.合計 || 0,
      外構工事: p4?.excelData?.外構工事 || 0,
      土地費用: p4?.excelData?.土地費用 || p4?.landCost || 0,
      諸費用: p4?.excelData?.諸費用 || 0,
      総額: p4?.excelData?.総額 || p4?.totalCost || 0,
      自己資金: p4?.excelData?.自己資金 || p4?.downPayment || 0,
      借入金額: p4?.excelData?.借入金額 || p4?.loanAmount || 0,
      金利: p4?.excelData?.金利 || p4?.interestRate || 0,
      借入年数: p4?.excelData?.借入年数 || p4?.loanPeriod || 0,
      商品名: p4?.excelData?.商品名 || project.projectName,
      坪数: p4?.excelData?.坪数,
      階数: p4?.excelData?.階数,
      お客様名: project.customerName,
      営業担当者: project.salesPerson,
    };
  },

  validate: (data: ExcelData | Partial<Project>): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if ('本体' in data) {
      // Excel data validation
      if (!data.本体 || data.本体 <= 0) errors.push('本体工事費が設定されていません');
      if (!data.総額 || data.総額 <= 0) errors.push('総額が設定されていません');
      if (data.金利 && (data.金利 < 0 || data.金利 > 10)) warnings.push('金利が一般的な範囲外です');
    } else {
      // Project data validation
      if (!data.projectName) errors.push('プロジェクト名が設定されていません');
      if (!data.customerName) errors.push('お客様名が設定されていません');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
};

// Validation rules for different entities
const defaultValidationRules = {
  project: [
    { field: 'projectName' as keyof Project, required: true },
    { field: 'customerName' as keyof Project, required: true },
    { field: 'salesPerson' as keyof Project, required: true },
  ],
  customer: [
    { field: 'name' as keyof Customer, required: true },
    { field: 'email' as keyof Customer, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    { field: 'phone' as keyof Customer, required: true },
  ],
  optionMaster: [
    { field: 'name' as keyof OptionMaster, required: true },
    { field: 'unitPrice' as keyof OptionMaster, required: true, min: 0 },
  ],
};

// Create the data manager store
export const useDataManager = create<DataManagerState>()(
  persist(
    (set, get) => ({
      // Initial state
      cache: new Map(),
      cacheConfig: {
        ttl: 5 * 60 * 1000, // 5 minutes
        maxSize: 1000,
      },
      validationRules: new Map(Object.entries(defaultValidationRules)),
      syncConfig: {
        autoSync: false,
        syncInterval: 30 * 1000, // 30 seconds
        conflictResolution: 'local',
      },
      syncStatus: 'idle',
      lastSyncTime: null,
      excelData: new Map(),
      excelImportHistory: [],
      transformers: new Map([
        ['excelToProject', excelToProjectTransformer],
      ]),

      // Cache operations
      setCacheItem: <T>(key: string, data: T, customTtl?: number) => {
        set((state) => {
          const newCache = new Map(state.cache);
          const now = Date.now();
          const ttl = customTtl || state.cacheConfig.ttl;

          // Remove expired items if cache is full
          if (newCache.size >= state.cacheConfig.maxSize) {
            const sortedEntries = Array.from(newCache.entries())
              .sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);

            for (let i = 0; i < Math.floor(state.cacheConfig.maxSize * 0.1); i++) {
              newCache.delete(sortedEntries[i][0]);
            }
          }

          newCache.set(key, {
            data,
            timestamp: now,
            accessCount: 1,
            lastAccessed: now,
          });

          return { cache: newCache };
        });
      },

      getCacheItem: <T>(key: string): T | null => {
        const state = get();
        const cached = state.cache.get(key);

        if (!cached) return null;

        const now = Date.now();
        const isExpired = now - cached.timestamp > state.cacheConfig.ttl;

        if (isExpired) {
          set((state) => {
            const newCache = new Map(state.cache);
            newCache.delete(key);
            return { cache: newCache };
          });
          return null;
        }

        // Update access statistics
        set((state) => {
          const newCache = new Map(state.cache);
          newCache.set(key, {
            ...cached,
            accessCount: cached.accessCount + 1,
            lastAccessed: now,
          });
          return { cache: newCache };
        });

        return cached.data as T;
      },

      clearCache: (pattern?: string) => {
        set((state) => {
          if (!pattern) {
            return { cache: new Map() };
          }

          const regex = new RegExp(pattern);
          const newCache = new Map(state.cache);

          for (const key of newCache.keys()) {
            if (regex.test(key)) {
              newCache.delete(key);
            }
          }

          return { cache: newCache };
        });
      },

      getCacheStats: () => {
        const state = get();
        const cache = state.cache;
        const totalAccess = Array.from(cache.values()).reduce((sum, item) => sum + item.accessCount, 0);
        const hitRate = totalAccess > 0 ? cache.size / totalAccess : 0;
        const memoryUsage = JSON.stringify(Array.from(cache.entries())).length;

        return {
          size: cache.size,
          hitRate,
          memoryUsage,
        };
      },

      // Data validation
      validateData: <T>(data: T, entityType: string): ValidationResult => {
        const state = get();
        const rules = state.validationRules.get(entityType) || [];
        const errors: string[] = [];
        const warnings: string[] = [];

        for (const rule of rules) {
          const value = (data as any)[rule.field];

          if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`${String(rule.field)} is required`);
            continue;
          }

          if (value !== undefined && value !== null) {
            if (rule.min !== undefined && value < rule.min) {
              errors.push(`${String(rule.field)} must be at least ${rule.min}`);
            }

            if (rule.max !== undefined && value > rule.max) {
              errors.push(`${String(rule.field)} must be at most ${rule.max}`);
            }

            if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
              errors.push(`${String(rule.field)} format is invalid`);
            }

            if (rule.custom && !rule.custom(value)) {
              errors.push(`${String(rule.field)} failed custom validation`);
            }
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
        };
      },

      addValidationRule: <T>(entityType: string, rule: ValidationRule<T>) => {
        set((state) => {
          const newRules = new Map(state.validationRules);
          const existingRules = newRules.get(entityType) || [];
          newRules.set(entityType, [...existingRules.filter(r => r.field !== rule.field), rule]);
          return { validationRules: newRules };
        });
      },

      removeValidationRule: (entityType: string, field: string) => {
        set((state) => {
          const newRules = new Map(state.validationRules);
          const existingRules = newRules.get(entityType) || [];
          newRules.set(entityType, existingRules.filter(r => r.field !== field));
          return { validationRules: newRules };
        });
      },

      // Excel integration
      importExcelData: async (data: ExcelData[], projectId?: string) => {
        const state = get();

        try {
          set({ syncStatus: 'syncing' });

          const importTimestamp = Date.now();
          const transformer = state.transformers.get('excelToProject') as DataTransformer<ExcelData, Partial<Project>>;

          if (!transformer) {
            throw new Error('Excel transformer not found');
          }

          // Validate and transform data
          const processedData: ExcelData[] = [];

          for (const item of data) {
            const validation = transformer.validate?.(item);
            if (validation && !validation.isValid) {
              console.warn('Excel data validation failed:', validation.errors);
              continue;
            }

            processedData.push(item);

            // Store in excel data map
            const key = projectId || `excel-${importTimestamp}-${processedData.length}`;
            set((state) => {
              const newExcelData = new Map(state.excelData);
              newExcelData.set(key, item);
              return { excelData: newExcelData };
            });
          }

          // Add to import history
          set((state) => ({
            excelImportHistory: [
              ...state.excelImportHistory,
              {
                timestamp: importTimestamp,
                filename: 'imported-data.xlsx',
                recordCount: processedData.length,
                projectId,
              },
            ],
          }));

          set({ syncStatus: 'idle', lastSyncTime: Date.now() });
        } catch (error) {
          console.error('Excel import failed:', error);
          set({ syncStatus: 'error' });
          throw error;
        }
      },

      exportToExcel: (projectIds: string[]): ExcelData[] => {
        const state = get();
        const transformer = state.transformers.get('excelToProject') as DataTransformer<ExcelData, Partial<Project>>;

        if (!transformer) {
          throw new Error('Excel transformer not found');
        }

        const results: ExcelData[] = [];

        for (const projectId of projectIds) {
          const excelData = state.excelData.get(projectId);
          if (excelData) {
            results.push(excelData);
          }
        }

        return results;
      },

      transformExcelToProject: (excelData: ExcelData): Partial<Project> => {
        const state = get();
        const transformer = state.transformers.get('excelToProject') as DataTransformer<ExcelData, Partial<Project>>;

        if (!transformer) {
          throw new Error('Excel transformer not found');
        }

        return transformer.transform(excelData);
      },

      transformProjectToExcel: (project: Project): ExcelData => {
        const state = get();
        const transformer = state.transformers.get('excelToProject') as DataTransformer<ExcelData, Partial<Project>>;

        if (!transformer) {
          throw new Error('Excel transformer not found');
        }

        return transformer.reverse(project);
      },

      // Data synchronization
      syncData: async () => {
        // Placeholder for future sync implementation
        set({ syncStatus: 'syncing' });

        try {
          // Simulate sync operation
          await new Promise(resolve => setTimeout(resolve, 1000));

          set({
            syncStatus: 'idle',
            lastSyncTime: Date.now()
          });
        } catch (error) {
          set({ syncStatus: 'error' });
          throw error;
        }
      },

      setSyncConfig: (config: Partial<SyncConfig>) => {
        set((state) => ({
          syncConfig: { ...state.syncConfig, ...config },
        }));
      },

      resolveConflict: (localData: any, remoteData: any, resolution: 'local' | 'remote') => {
        return resolution === 'local' ? localData : remoteData;
      },

      // Data normalization
      normalizeData: <T>(data: T, entityType: string): T => {
        // Implement normalization logic based on entity type
        if (entityType === 'project' && data && typeof data === 'object') {
          const normalized = { ...data } as any;

          // Normalize dates
          if (normalized.createdAt && typeof normalized.createdAt === 'string') {
            normalized.createdAt = new Date(normalized.createdAt);
          }
          if (normalized.updatedAt && typeof normalized.updatedAt === 'string') {
            normalized.updatedAt = new Date(normalized.updatedAt);
          }

          // Normalize currency values
          if (normalized.presentation4) {
            const p4 = normalized.presentation4;
            ['buildingCost', 'constructionCost', 'otherCosts', 'landCost', 'totalCost', 'loanAmount', 'downPayment'].forEach(field => {
              if (p4[field] && typeof p4[field] === 'string') {
                p4[field] = parseFloat(p4[field].replace(/[^0-9.-]/g, ''));
              }
            });
          }

          return normalized as T;
        }

        return data;
      },

      denormalizeData: <T>(data: T, entityType: string): T => {
        // Implement denormalization logic for storage/export
        return data;
      },

      // Backup and recovery
      createBackup: (): string => {
        const state = get();
        const backupData = {
          timestamp: Date.now(),
          version: '1.0',
          cache: Array.from(state.cache.entries()),
          excelData: Array.from(state.excelData.entries()),
          excelImportHistory: state.excelImportHistory,
          syncConfig: state.syncConfig,
        };

        return JSON.stringify(backupData);
      },

      restoreFromBackup: (backupData: string) => {
        try {
          const data = JSON.parse(backupData);

          set({
            cache: new Map(data.cache || []),
            excelData: new Map(data.excelData || []),
            excelImportHistory: data.excelImportHistory || [],
            syncConfig: data.syncConfig || get().syncConfig,
          });
        } catch (error) {
          console.error('Backup restoration failed:', error);
          throw error;
        }
      },

      // Data integrity
      checkDataIntegrity: async (): Promise<ValidationResult> => {
        const state = get();
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check cache integrity
        let corruptedCacheItems = 0;
        for (const [key, cached] of state.cache.entries()) {
          try {
            JSON.stringify(cached.data);
          } catch {
            errors.push(`Corrupted cache item: ${key}`);
            corruptedCacheItems++;
          }
        }

        // Check excel data integrity
        for (const [key, excelData] of state.excelData.entries()) {
          const validation = excelToProjectTransformer.validate?.(excelData);
          if (validation && !validation.isValid) {
            warnings.push(`Excel data validation issues for ${key}: ${validation.errors.join(', ')}`);
          }
        }

        if (corruptedCacheItems > state.cache.size * 0.1) {
          warnings.push('High number of corrupted cache items detected');
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
        };
      },

      repairData: async () => {
        const state = get();

        // Remove corrupted cache items
        const newCache = new Map(state.cache);
        for (const [key, cached] of newCache.entries()) {
          try {
            JSON.stringify(cached.data);
          } catch {
            newCache.delete(key);
          }
        }

        set({ cache: newCache });
      },

      // Performance monitoring
      getPerformanceMetrics: () => {
        const state = get();
        const cacheStats = get().getCacheStats();

        return {
          cacheHitRate: cacheStats.hitRate,
          averageQueryTime: 0, // Placeholder for future implementation
          memoryUsage: cacheStats.memoryUsage,
          syncLatency: state.lastSyncTime ? Date.now() - state.lastSyncTime : 0,
        };
      },
    }),
    {
      name: 'data-manager-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        // Only persist configuration and non-sensitive data
        cacheConfig: state.cacheConfig,
        syncConfig: state.syncConfig,
        excelImportHistory: state.excelImportHistory,
        validationRules: Array.from(state.validationRules.entries()),
      }),
    }
  )
);

// Utility functions for external use
export const dataManagerUtils = {
  // Create a project from Excel data
  createProjectFromExcel: (excelData: ExcelData): Partial<Project> => {
    return excelToProjectTransformer.transform(excelData);
  },

  // Validate Excel data before import
  validateExcelData: (data: ExcelData[]): ValidationResult[] => {
    return data.map(item => excelToProjectTransformer.validate?.(item) || { isValid: true, errors: [], warnings: [] });
  },

  // Calculate monthly payment from Excel data
  calculateMonthlyPayment: (loanAmount: number, interestRate: number, loanPeriod: number): number => {
    if (loanAmount <= 0 || interestRate <= 0 || loanPeriod <= 0) return 0;

    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanPeriod * 12;

    return Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)
    );
  },

  // Format currency for display
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Data migration helper
  migrateData: (oldVersion: string, newVersion: string, data: any): any => {
    // Implement version-specific migration logic
    return data;
  },
};

export default useDataManager;