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
  
  // Check if discharge type may limit GI Bill eligibility
  const hasDischargeWarning = data.dischargeType && ['general', 'other-than-honorable', 'bad-conduct', 'dishonorable'].includes(data.dischargeType);

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

        {/* VocRehab Priority Notice */}
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div className="space-y-2">
              <h3 className="font-bold text-blue-900">Important: Check VocRehab First!</h3>
              <p className="text-sm text-blue-800">
                <strong>VR&E (Vocational Rehabilitation & Employment)</strong> provides up to 48 months of education benefits with MORE support than GI Bill:
              </p>
              <ul className="text-sm text-blue-800 list-disc ml-5 space-y-1">
                <li>Covers tuition, books, supplies, AND living expenses</li>
                <li>Provides career counseling and job placement assistance</li>
                <li><strong>Does NOT use your GI Bill months</strong></li>
                <li>Can be used BEFORE GI Bill to preserve your benefits</li>
              </ul>
              <p className="text-sm text-blue-900 font-semibold mt-2">
                ✅ If you have a service-connected disability rating (even 10%), apply for VocRehab BEFORE using GI Bill!
              </p>
            </div>
          </div>
        </div>

        {/* Discharge Type Warning */}
        {hasDischargeWarning && (
          <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>
              <div className="space-y-2">
                <h3 className="font-bold text-yellow-900">GI Bill Eligibility May Be Limited</h3>
                <p className="text-sm text-yellow-800">
                  With a <strong>{data.dischargeType}</strong> discharge, your GI Bill eligibility may be restricted or denied. However, you may still qualify for:
                </p>
                <ul className="text-sm text-yellow-800 list-disc ml-5 space-y-1">
                  <li><strong>VR&E (VocRehab)</strong> - Often available with service-connected disability</li>
                  <li><strong>Pell Grants</strong> - Federal student aid based on financial need</li>
                  <li><strong>Federal Student Loans</strong> - FAFSA-based financial aid</li>
                  <li><strong>State/Local Veteran Programs</strong> - Some states offer education benefits</li>
                  <li><strong>Employer Tuition Assistance</strong> - Many veteran-friendly employers</li>
                </ul>
                <p className="text-sm text-yellow-900 font-semibold mt-2">
                  Consider a <strong>discharge upgrade</strong> to gain full GI Bill access.
                </p>
              </div>
            </div>
          </div>
        )}

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
