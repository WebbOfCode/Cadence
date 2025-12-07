'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { ranksByBranch } from '@/lib/rankData';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  dischargeRank: z.string().min(1, 'Please select a rank'),
});

type FormData = z.infer<typeof schema>;

interface StepDischargeRankProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepDischargeRank({ onNext, onBack }: StepDischargeRankProps) {
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
      dischargeRank: data.dischargeRank || '',
    },
  });

  const selectedRank = watch('dischargeRank');
  const branch = data.branch;

  // Get ranks for the selected branch
  const availableRanks = branch ? ranksByBranch[branch] : [];

  const onSubmit = (formData: FormData) => {
    updateData({ dischargeRank: formData.dischargeRank });
    onNext();
  };

  if (!branch) {
    return (
      <StepWrapper>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Error: Branch not selected
          </h1>
          <p className="text-lg text-gray-600">
            Please go back and select your branch first.
          </p>
          <button
            onClick={onBack}
            className="py-4 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </StepWrapper>
    );
  }

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            What was your discharge rank?
          </h1>
          <p className="text-xl text-gray-600">
            Select your rank at separation ({branch})
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <select
              {...register('dischargeRank')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors appearance-none bg-white cursor-pointer text-base"
            >
              <option value="">Select your rank...</option>
              {availableRanks.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>

          {selectedRank && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Selected rank:</span> {selectedRank}
              </p>
            </div>
          )}
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
