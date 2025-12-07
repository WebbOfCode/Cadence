'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  timeInService: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '10', '12', '15', '20', '20+']),
});

type FormData = z.infer<typeof schema>;

interface StepTimeInServiceProps {
  onNext: () => void;
  onBack: () => void;
}

const timeOptions = [
  { value: '1', label: '1 year' },
  { value: '2', label: '2 years' },
  { value: '3', label: '3 years' },
  { value: '4', label: '4 years' },
  { value: '5', label: '5 years' },
  { value: '6', label: '6 years' },
  { value: '7', label: '7 years' },
  { value: '8', label: '8 years' },
  { value: '10', label: '10 years' },
  { value: '12', label: '12 years' },
  { value: '15', label: '15 years' },
  { value: '20', label: '20 years' },
  { value: '20+', label: '20+ years' },
];

export function StepTimeInService({ onNext, onBack }: StepTimeInServiceProps) {
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
      timeInService: data.timeInService as any,
    },
  });

  const selectedTime = watch('timeInService');

  const onSubmit = (formData: FormData) => {
    updateData({ timeInService: formData.timeInService });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            How long did you serve?
          </h1>
          <p className="text-xl text-gray-600">
            Select your total time in service
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeOptions.map((option) => (
            <label
              key={option.value}
              className={`
                relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedTime === option.value
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                value={option.value}
                {...register('timeInService')}
                className="sr-only"
              />
              <span className="text-base font-medium">{option.label}</span>
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
