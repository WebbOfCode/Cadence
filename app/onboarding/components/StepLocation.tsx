'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface StepLocationProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepLocation({ onNext, onBack }: StepLocationProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      location: data.location || '',
    },
  });

  const onSubmit = (formData: FormData) => {
    updateData({ location: formData.location || undefined });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Where to?
          </h1>
          <p className="text-xl text-gray-600">
            Where are you planning to settle (optional)
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium uppercase tracking-wide">
            City, State
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder="Austin, TX"
            autoFocus
          />
          <p className="text-sm text-gray-500">
            We'll find local resources and opportunities for you
          </p>
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
            className="flex-1 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </StepWrapper>
  );
}
