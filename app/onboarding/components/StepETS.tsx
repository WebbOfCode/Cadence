'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  etsDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  }, 'ETS date must be in the future'),
});

type FormData = z.infer<typeof schema>;

interface StepETSProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepETS({ onNext, onBack }: StepETSProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      etsDate: data.etsDate || '',
    },
  });

  const onSubmit = (formData: FormData) => {
    updateData({ etsDate: formData.etsDate });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            When's your ETS?
          </h1>
          <p className="text-xl text-gray-600">
            Your estimated time of separation
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="etsDate" className="block text-sm font-medium uppercase tracking-wide">
            ETS Date
          </label>
          <input
            id="etsDate"
            type="date"
            {...register('etsDate')}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            autoFocus
          />
          {errors.etsDate && (
            <p className="text-sm text-red-600">{errors.etsDate.message}</p>
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
