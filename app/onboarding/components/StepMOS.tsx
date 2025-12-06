'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';

const schema = z.object({
  mos: z.string().min(1, 'MOS/AFSC/NEC is required'),
});

type FormData = z.infer<typeof schema>;

interface StepMOSProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepMOS({ onNext, onBack }: StepMOSProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      mos: data.mos || '',
    },
  });

  const getPlaceholder = () => {
    switch (data.branch) {
      case 'Army':
      case 'Marine Corps':
        return '11B, 0311, etc.';
      case 'Navy':
      case 'Coast Guard':
        return 'BM, YN, etc.';
      case 'Air Force':
      case 'Space Force':
        return '1N0X1, 3D0X2, etc.';
      default:
        return 'Enter your MOS/AFSC/NEC';
    }
  };

  const onSubmit = (formData: FormData) => {
    updateData({ mos: formData.mos });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            What's your MOS?
          </h1>
          <p className="text-xl text-gray-600">
            {data.branch === 'Army' || data.branch === 'Marine Corps' 
              ? 'Military Occupational Specialty'
              : data.branch === 'Air Force' || data.branch === 'Space Force'
              ? 'Air Force Specialty Code'
              : 'Navy Enlisted Classification'}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="mos" className="block text-sm font-medium uppercase tracking-wide">
            MOS/AFSC/NEC
          </label>
          <input
            id="mos"
            type="text"
            {...register('mos')}
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            placeholder={getPlaceholder()}
            autoFocus
          />
          {errors.mos && (
            <p className="text-sm text-red-600">{errors.mos.message}</p>
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
