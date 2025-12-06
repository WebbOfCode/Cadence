'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import { Info } from 'lucide-react';

const dischargeSchema = z.object({
  dischargeType: z.enum(['honorable', 'general', 'other-than-honorable', 'bad-conduct', 'dishonorable'], {
    errorMap: () => ({ message: 'Please select your discharge type' }),
  }),
});

type DischargeFormData = z.infer<typeof dischargeSchema>;

interface StepDischargeTypeProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepDischargeType({ onNext, onBack }: StepDischargeTypeProps) {
  const { data, updateData } = useOnboardingStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<DischargeFormData>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      dischargeType: (data.dischargeType as any) || undefined,
    },
  });

  const selectedType = watch('dischargeType');

  const dischargeInfo: Record<string, { title: string; description: string; color: string }> = {
    honorable: {
      title: 'Honorable Discharge',
      description: 'Highest level of discharge. Full access to VA benefits.',
      color: 'border-green-300 bg-green-50',
    },
    general: {
      title: 'General Discharge (Under Honorable Conditions)',
      description: 'Satisfactory service. Most VA benefits available, some restrictions may apply.',
      color: 'border-blue-300 bg-blue-50',
    },
    'other-than-honorable': {
      title: 'Other Than Honorable (OTH) Discharge',
      description: 'Significant service issues. Limited VA benefits. Upgrade options available.',
      color: 'border-yellow-300 bg-yellow-50',
    },
    'bad-conduct': {
      title: 'Bad Conduct Discharge (BCD)',
      description: 'Serious misconduct. Very limited VA benefits. Legal upgrade assistance available.',
      color: 'border-orange-300 bg-orange-50',
    },
    dishonorable: {
      title: 'Dishonorable Discharge',
      description: 'Most severe discharge. Minimal VA benefits. Legal assistance strongly recommended.',
      color: 'border-red-300 bg-red-50',
    },
  };

  const onSubmit = (formData: DischargeFormData) => {
    updateData({
      dischargeType: formData.dischargeType,
    });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Discharge Type
          </h1>
          <p className="text-xl text-gray-600">
            This helps us provide relevant resources and recommendations
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Your discharge type affects VA benefits eligibility and available support resources. We'll provide tailored guidance based on your status.
          </p>
        </div>

        {/* Discharge Type Options */}
        <div className="space-y-3">
          {Object.entries(dischargeInfo).map(([value, info]) => (
            <motion.label
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedType === value 
                  ? `${info.color} border-current` 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                value={value}
                {...register('dischargeType')}
                className="w-5 h-5 mt-1 cursor-pointer"
              />
              <div className="flex-1">
                <p className="font-bold text-lg">{info.title}</p>
                <p className="text-sm text-gray-600 mt-1">{info.description}</p>
              </div>
            </motion.label>
          ))}
        </div>

        {errors.dischargeType && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.dischargeType.message}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-4">
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
            Next
          </button>
        </div>
      </form>
    </StepWrapper>
  );
}
