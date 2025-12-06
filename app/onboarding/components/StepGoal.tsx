'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import type { TransitionGoal } from '@/lib/types';

const schema = z.object({
  goal: z.enum(['career', 'education', 'housing', 'finance', 'wellness']),
});

type FormData = z.infer<typeof schema>;

interface StepGoalProps {
  onNext: () => void;
  onBack: () => void;
}

const goals: { value: TransitionGoal; label: string; description: string }[] = [
  {
    value: 'career',
    label: 'Career Transition',
    description: 'Find a job or start a business',
  },
  {
    value: 'education',
    label: 'Education & Training',
    description: 'Go to school or learn new skills',
  },
  {
    value: 'housing',
    label: 'Housing & Relocation',
    description: 'Find a place to live',
  },
  {
    value: 'finance',
    label: 'Financial Planning',
    description: 'Manage money and benefits',
  },
  {
    value: 'wellness',
    label: 'Health & Wellness',
    description: 'Focus on physical and mental health',
  },
];

export function StepGoal({ onNext, onBack }: StepGoalProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      goal: data.goal,
    },
  });

  const selectedGoal = watch('goal');

  const onSubmit = (formData: FormData) => {
    updateData({ goal: formData.goal });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Primary goal?
          </h1>
          <p className="text-xl text-gray-600">
            What matters most right now
          </p>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <label
              key={goal.value}
              className={`
                flex flex-col p-6 border-2 rounded-lg cursor-pointer transition-all
                ${selectedGoal === goal.value 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                value={goal.value}
                {...register('goal')}
                className="sr-only"
              />
              <span className="text-lg font-medium">{goal.label}</span>
              <span className={`text-sm mt-1 ${selectedGoal === goal.value ? 'text-gray-200' : 'text-gray-600'}`}>
                {goal.description}
              </span>
            </label>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 border-2 border-black text-black font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </StepWrapper>
  );
}
