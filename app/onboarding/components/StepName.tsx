'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof schema>;

interface StepNameProps {
  onNext: () => void;
}

export function StepName({ onNext }: StepNameProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: data.name || '',
    },
  });

  const onSubmit = (formData: FormData) => {
    updateData({ name: formData.name });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Cadence
          </h1>
          <p className="text-xl text-gray-600">
            Let's build your transition plan
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium uppercase tracking-wide">
            What's your name?
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder="John Smith"
            autoFocus
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          Continue
        </button>
      </form>
    </StepWrapper>
  );
}
