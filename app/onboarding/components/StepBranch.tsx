'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import type { MilitaryBranch } from '@/lib/types';

const schema = z.object({
  branch: z.enum(['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force']),
});

type FormData = z.infer<typeof schema>;

interface StepBranchProps {
  onNext: () => void;
  onBack: () => void;
}

const branches: MilitaryBranch[] = [
  'Army',
  'Navy',
  'Air Force',
  'Marine Corps',
  'Coast Guard',
  'Space Force',
];

export function StepBranch({ onNext, onBack }: StepBranchProps) {
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
      branch: data.branch,
    },
  });

  const selectedBranch = watch('branch');

  const onSubmit = (formData: FormData) => {
    updateData({ branch: formData.branch });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Which branch?
          </h1>
          <p className="text-xl text-gray-600">
            Select your service branch
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <label
              key={branch}
              className={`
                relative flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all
                ${selectedBranch === branch 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                value={branch}
                {...register('branch')}
                className="sr-only"
              />
              <span className="text-lg font-medium">{branch}</span>
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
