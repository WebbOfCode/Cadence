'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import { Info } from 'lucide-react';

const awardsSchema = z.object({
  hasAwards: z.boolean().default(false),
  awards: z.array(z.string()).default([]),
  otherAwards: z.string().optional().default(''),
});

type AwardsFormData = z.infer<typeof awardsSchema>;

interface StepAwardsProps {
  onNext: () => void;
  onBack: () => void;
}

// Common Army awards and decorations
const COMMON_AWARDS = [
  'Army Achievement Medal (AAM)',
  'Army Commendation Medal (ARCOM)',
  'Meritorious Service Medal (MSM)',
  'Army Good Conduct Medal (AGCM)',
  'Combat Action Badge (CAB)',
  'Combat Infantryman Badge (CIB)',
  'NCO Professional Development Ribbon',
  'Army Service Ribbon',
];

export function StepAwards({ onNext, onBack }: StepAwardsProps) {
  const { data, updateData } = useOnboardingStore();
  const { control, handleSubmit, watch, formState: { errors }, setValue } = useForm<AwardsFormData>({
    resolver: zodResolver(awardsSchema),
    mode: 'onChange',
    defaultValues: {
      hasAwards: data.hasAwards !== undefined ? data.hasAwards : false,
      awards: data.awards && data.awards.length > 0 ? data.awards : [],
      otherAwards: data.otherAwards ?? '',
    },
  });

  const hasAwards = watch('hasAwards');
  const selectedAwards = watch('awards');

  const onSubmit = (formData: AwardsFormData) => {
    console.log('Awards form submitted:', formData);
    updateData({
      hasAwards: formData.hasAwards,
      awards: formData.awards || [],
      otherAwards: formData.otherAwards || '',
    });
    onNext();
  };

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Awards & Decorations
          </h1>
          <p className="text-xl text-gray-600">
            This helps us tailor your resume and highlight your achievements
          </p>
        </div>

        {/* Info Banner */}
        <div className="flex gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Awards and decorations demonstrate your service excellence and can strengthen your civilian resume. This section is optional—you can skip it if you don't remember all your awards.
          </p>
        </div>

        {/* Have Awards Question */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-800">
            Have you received any awards or decorations?
          </label>
          <div className="flex gap-4">
            <Controller
              name="hasAwards"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors" style={{ borderColor: field.value === true ? '#000' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      {...field}
                      value="true"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors" style={{ borderColor: field.value === false ? '#000' : '#e5e7eb' }}>
                    <input
                      type="radio"
                      {...field}
                      value="false"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="font-medium">No</span>
                  </label>
                </>
              )}
            />
          </div>
        </div>

        {/* Awards Selection - shows only if hasAwards is true */}
        {hasAwards && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <label className="text-lg font-semibold text-gray-800">
              Select your awards (check all that apply):
            </label>
            <div className="space-y-3">
              <Controller
                name="awards"
                control={control}
                render={({ field }) => (
                  <>
                    {COMMON_AWARDS.map((award) => (
                      <label
                        key={award}
                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={field.value?.includes(award) ?? false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value ?? []), award]);
                            } else {
                              field.onChange(
                                field.value?.filter((a) => a !== award) ?? []
                              );
                            }
                          }}
                          className="w-5 h-5"
                        />
                        <span className="font-medium text-gray-800">{award}</span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>

            {/* Other Awards Text Input */}
            <div className="space-y-3 mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <label className="text-lg font-semibold text-gray-800">
                Other awards or decorations (optional):
              </label>
              <p className="text-sm text-gray-600">
                Enter any additional awards not listed above, such as joint awards, foreign awards, or unit citations.
              </p>
              <Controller
                name="otherAwards"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="e.g., Joint Service Achievement Medal, Foreign Military Decoration, Meritorious Unit Commendation"
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                    rows={3}
                  />
                )}
              />
            </div>
          </motion.div>
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
