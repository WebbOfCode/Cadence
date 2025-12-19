import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OnboardingData, MissionPlan, MissionTask } from './types';

interface OnboardingStore {
  currentStep: number;
  data: Partial<OnboardingData>;
  missionPlan: MissionPlan | null;
  
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  updateData: (data: Partial<OnboardingData>) => void;
  setMissionPlan: (plan: MissionPlan) => void;
  addTask: (task: MissionTask) => void;
  updateTaskCompletion: (taskId: string, completed: boolean) => void;
  updateTask: (taskId: string, updates: Partial<MissionTask>) => void;
  toggleStepCompletion: (taskId: string, stepIndex: number) => void;
  
  reset: () => void;
}

const initialState = {
  currentStep: 0,
  data: {},
  missionPlan: null,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 12) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 0) 
      })),
      
      updateData: (newData) => set((state) => ({
        data: { ...state.data, ...newData },
      })),
      
      setMissionPlan: (plan) => set({ missionPlan: plan }),

      addTask: (task) => set((state) => ({
        missionPlan: state.missionPlan ? {
          ...state.missionPlan,
          tasks: state.missionPlan.tasks.some(t => t.id === task.id)
            ? state.missionPlan.tasks
            : [...state.missionPlan.tasks, task],
        } : state.missionPlan,
      })),
      
      updateTaskCompletion: (taskId, completed) => set((state) => ({
        missionPlan: state.missionPlan ? {
          ...state.missionPlan,
          tasks: state.missionPlan.tasks.map((task) =>
            task.id === taskId ? { ...task, completed } : task
          ),
        } : null,
      })),
      
      updateTask: (taskId, updates) => set((state) => ({
        missionPlan: state.missionPlan ? {
          ...state.missionPlan,
          tasks: state.missionPlan.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        } : null,
      })),
      
      toggleStepCompletion: (taskId, stepIndex) => set((state) => ({
        missionPlan: state.missionPlan ? {
          ...state.missionPlan,
          tasks: state.missionPlan.tasks.map((task) => {
            if (task.id === taskId) {
              const stepsCompleted = task.stepsCompleted || [];
              const newStepsCompleted = stepsCompleted.includes(stepIndex)
                ? stepsCompleted.filter(i => i !== stepIndex)
                : [...stepsCompleted, stepIndex];
              return { ...task, stepsCompleted: newStepsCompleted };
            }
            return task;
          }),
        } : null,
      })),
      
      reset: () => set(initialState),
    }),
    {
      name: 'cadence-onboarding',
    }
  )
);
