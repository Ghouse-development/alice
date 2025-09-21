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
  PresentationStep
} from '@/types';

interface SlideOrder {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
  icon: string;
}

interface AppState {
  // Projects
  projects: Project[];
  currentProject: Project | null;

  // Customer
  customers: Customer[];

  // Option Masters
  optionMasters: OptionMaster[];

  // Presentation Mode
  isPresentationMode: boolean;
  currentStep: PresentationStep;

  // Theme Settings
  theme: 'light' | 'dark';

  // Slide Order
  slideOrders: { [projectId: string]: SlideOrder[] };

  // Actions
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;

  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;

  addOptionMaster: (option: OptionMaster) => void;
  updateOptionMaster: (id: string, option: Partial<OptionMaster>) => void;
  deleteOptionMaster: (id: string) => void;

  updateHearingSheet: (projectId: string, hearingSheet: HearingSheet) => void;

  updatePresentation1: (projectId: string, data: Partial<Presentation1>) => void;
  updatePresentation2: (projectId: string, data: Partial<Presentation2>) => void;
  updatePresentation3: (projectId: string, data: Partial<Presentation3>) => void;
  updatePresentation4: (projectId: string, data: Partial<Presentation4>) => void;
  updatePresentation5: (projectId: string, data: Partial<Presentation5>) => void;

  setPresentationMode: (mode: boolean) => void;
  setCurrentStep: (step: PresentationStep) => void;

  // Theme Actions
  setTheme: (theme: 'light' | 'dark') => void;

  // Slide Order Actions
  updateSlideOrder: (projectId: string, slides: SlideOrder[]) => void;
  getSlideOrder: (projectId: string) => SlideOrder[] | undefined;

  // Initialize with sample data
  initializeSampleData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      customers: [],
      optionMasters: [],
      isPresentationMode: false,
      currentStep: 1,
      theme: 'light' as const,
      slideOrders: {},

      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project, updatedAt: new Date() } : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...project, updatedAt: new Date() }
              : state.currentProject,
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
        })),

      setCurrentProject: (project) =>
        set({ currentProject: project }),

      addCustomer: (customer) =>
        set((state) => ({
          customers: [...state.customers, customer],
        })),

      updateCustomer: (id, customer) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...customer } : c
          ),
        })),

      addOptionMaster: (option) =>
        set((state) => ({
          optionMasters: [...state.optionMasters, option],
        })),

      updateOptionMaster: (id, option) =>
        set((state) => ({
          optionMasters: state.optionMasters.map((o) =>
            o.id === id ? { ...o, ...option } : o
          ),
        })),

      deleteOptionMaster: (id) =>
        set((state) => ({
          optionMasters: state.optionMasters.filter((o) => o.id !== id),
        })),

      updateHearingSheet: (projectId, hearingSheet) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, hearingSheet, updatedAt: new Date() }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? { ...state.currentProject, hearingSheet, updatedAt: new Date() }
              : state.currentProject,
        })),

      updatePresentation1: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  presentation1: { ...p.presentation1, ...data } as Presentation1,
                  updatedAt: new Date()
                }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? {
                  ...state.currentProject,
                  presentation1: { ...state.currentProject.presentation1, ...data } as Presentation1,
                  updatedAt: new Date()
                }
              : state.currentProject,
        })),

      updatePresentation2: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  presentation2: { ...p.presentation2, ...data } as Presentation2,
                  updatedAt: new Date()
                }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? {
                  ...state.currentProject,
                  presentation2: { ...state.currentProject.presentation2, ...data } as Presentation2,
                  updatedAt: new Date()
                }
              : state.currentProject,
        })),

      updatePresentation3: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  presentation3: { ...p.presentation3, ...data } as Presentation3,
                  updatedAt: new Date()
                }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? {
                  ...state.currentProject,
                  presentation3: { ...state.currentProject.presentation3, ...data } as Presentation3,
                  updatedAt: new Date()
                }
              : state.currentProject,
        })),

      updatePresentation4: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  presentation4: { ...p.presentation4, ...data } as Presentation4,
                  updatedAt: new Date()
                }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? {
                  ...state.currentProject,
                  presentation4: { ...state.currentProject.presentation4, ...data } as Presentation4,
                  updatedAt: new Date()
                }
              : state.currentProject,
        })),

      updatePresentation5: (projectId, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  presentation5: { ...p.presentation5, ...data } as Presentation5,
                  updatedAt: new Date()
                }
              : p
          ),
          currentProject:
            state.currentProject?.id === projectId
              ? {
                  ...state.currentProject,
                  presentation5: { ...state.currentProject.presentation5, ...data } as Presentation5,
                  updatedAt: new Date()
                }
              : state.currentProject,
        })),

      setPresentationMode: (mode) =>
        set({ isPresentationMode: mode }),

      setCurrentStep: (step) =>
        set({ currentStep: step }),

      setTheme: (theme) =>
        set({ theme }),

      updateSlideOrder: (projectId, slides) =>
        set((state) => ({
          slideOrders: {
            ...state.slideOrders,
            [projectId]: slides,
          },
        })),

      getSlideOrder: (projectId) => get().slideOrders[projectId],

      initializeSampleData: () =>
        set({
          optionMasters: [
            {
              id: '1',
              category: '外装',
              name: 'タイル外壁',
              unit: 'area',
              unitPrice: 5000,
              defaultQuantity: 100,
            },
            {
              id: '2',
              category: '内装',
              name: '無垢フローリング',
              unit: 'area',
              unitPrice: 8000,
              defaultQuantity: 30,
            },
            {
              id: '3',
              category: '設備',
              name: '食器洗い乾燥機',
              unit: 'fixed',
              unitPrice: 150000,
              defaultQuantity: 1,
            },
            {
              id: '4',
              category: '設備',
              name: '床暖房',
              unit: 'area',
              unitPrice: 10000,
              defaultQuantity: 20,
            },
            {
              id: '5',
              category: '外構',
              name: 'カーポート',
              unit: 'fixed',
              unitPrice: 300000,
              defaultQuantity: 1,
            },
          ],
        }),
    }),
    {
      name: 'g-house-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);