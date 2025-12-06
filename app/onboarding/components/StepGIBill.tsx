'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  giBill: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface StepGIBillProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepGIBill({ onNext, onBack }: StepGIBillProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    setValue,
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      giBill: data.giBill ?? false,
    },
  });

  const selectedValue = watch('giBill');

  const handleSelection = (value: boolean) => {
    setValue('giBill', value, { shouldValidate: true });
  };

  const onSubmit = (formData: FormData) => {
    updateData({ giBill: formData.giBill });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Using GI Bill?
          </h1>
          <p className="text-xl text-gray-600">
            Planning to use education benefits
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => handleSelection(true)}
            className={`
              w-full flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all
              ${selectedValue === true 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
          >
            <span className="text-lg font-medium">Yes, I'll use GI Bill</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelection(false)}
            className={`
              w-full flex items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all
              ${selectedValue === false 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-400'
              }
            `}
          >
            <span className="text-lg font-medium">No or not applicable</span>
          </button>
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
