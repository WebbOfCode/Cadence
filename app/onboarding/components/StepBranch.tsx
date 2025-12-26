'use client';

import { useEffect } from 'react';
import Image from 'next/image';
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

const branchCards: { name: MilitaryBranch; logo: string; tagline: string }[] = [
  { name: 'Army', logo: '/branch-logos/army.svg', tagline: 'Soldiers & Warrant Officers' },
  { name: 'Navy', logo: '/branch-logos/navy.svg', tagline: 'Sailors & Chiefs' },
  { name: 'Air Force', logo: '/branch-logos/air-force.svg', tagline: 'Airmen & Guardians-to-be' },
  { name: 'Marine Corps', logo: '/branch-logos/marine-corps.svg', tagline: 'Marines & Veterans' },
  { name: 'Coast Guard', logo: '/branch-logos/coast-guard.svg', tagline: 'Coasties & Reservists' },
  { name: 'Space Force', logo: '/branch-logos/space-force.svg', tagline: 'Guardians' },
];

export function StepBranch({ onNext, onBack }: StepBranchProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      branch: data.branch,
    },
  });

  const selectedBranch = watch('branch');

  // Hydrate from remembered selection on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('cadence-preferred-branch') as MilitaryBranch | null;
    if (!data.branch && stored) {
      setValue('branch', stored, { shouldValidate: true });
      updateData({ branch: stored });
    }
  }, [data.branch, setValue, updateData]);

  // Persist new selections
  useEffect(() => {
    if (!selectedBranch) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cadence-preferred-branch', selectedBranch);
    }
    updateData({ branch: selectedBranch });
  }, [selectedBranch, updateData]);

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
            Select your service branch. We remember it on this device so you do not have to pick twice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branchCards.map((branch) => (
            <label
              key={branch.name}
              className={`
                relative flex flex-col items-center gap-3 p-6 border-2 rounded-xl cursor-pointer transition-all text-center
                ${selectedBranch === branch.name
                  ? 'border-black bg-black text-white shadow-lg'
                  : 'border-gray-200 hover:border-gray-400 bg-white'
                }
              `}
            >
              <input
                type="radio"
                value={branch.name}
                {...register('branch')}
                className="sr-only"
              />
              <div className="h-16 w-16 relative">
                <Image
                  src={branch.logo}
                  alt={`${branch.name} seal`}
                  fill
                  sizes="64px"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">{branch.name}</p>
                <p className={`text-sm ${selectedBranch === branch.name ? 'text-gray-100' : 'text-gray-600'}`}>{branch.tagline}</p>
              </div>
              {selectedBranch === branch.name && (
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-white text-black">
                  Selected
                </span>
              )}
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
