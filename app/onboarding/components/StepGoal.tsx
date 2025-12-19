'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import type { TransitionGoal } from '@/lib/types';

const schema = z.object({
  goal: z.enum(['career', 'education', 'housing', 'finance', 'wellness']),
  careerPath: z.enum(['job-search', 'start-business', 'certifications', 'not-sure']).optional(),
  educationPath: z.enum(['college-degree', 'vocational-training', 'certifications', 'gi-bill-info']).optional(),
  housingPath: z.enum(['rent-lease', 'buy-home', 'va-loan', 'temporary-housing']).optional(),
  financePath: z.array(z.enum(['tsp-rollover', 'budgeting', 'va-benefits', 'debt-management', 'investment'])).optional(),
  wellnessPath: z.array(z.enum(['mental-health', 'physical-fitness', 'va-healthcare', 'substance-support', 'family-counseling'])).optional(),
});

type FormData = z.infer<typeof schema>;

interface StepGoalProps {
  onNext: () => void;
  onBack: () => void;
}

const goals: { value: TransitionGoal; label: string; description: string }[] = [
  {
    value: 'career',
    label: 'Career Transition',
    description: 'Find a job or start a business',
  },
  {
    value: 'education',
    label: 'Education & Training',
    description: 'Go to school or learn new skills',
  },
  {
    value: 'housing',
    label: 'Housing & Relocation',
    description: 'Find a place to live',
  },
  {
    value: 'finance',
    label: 'Financial Planning',
    description: 'Manage money and benefits',
  },
  {
    value: 'wellness',
    label: 'Health & Wellness',
    description: 'Focus on physical and mental health',
  },
];

const subGoals = {
  career: [
    { value: 'job-search', label: 'Job Search', description: 'Find civilian employment' },
    { value: 'start-business', label: 'Start a Business', description: 'Entrepreneurship path' },
    { value: 'certifications', label: 'Get Certifications', description: 'Industry certifications' },
    { value: 'not-sure', label: 'Not Sure Yet', description: 'Explore options' },
  ],
  education: [
    { value: 'college-degree', label: 'College Degree', description: '2-year or 4-year program' },
    { value: 'vocational-training', label: 'Vocational Training', description: 'Trade school or apprenticeship' },
    { value: 'certifications', label: 'Professional Certifications', description: 'Industry credentials' },
    { value: 'gi-bill-info', label: 'Learn About Education Benefits', description: 'Post-9/11 GI Bill and VocRehab info' },
  ],
  housing: [
    { value: 'rent-lease', label: 'Rent/Lease', description: 'Find rental housing' },
    { value: 'buy-home', label: 'Buy a Home', description: 'Purchase property' },
    { value: 'va-loan', label: 'VA Home Loan', description: 'Use VA loan benefits' },
    { value: 'temporary-housing', label: 'Temporary Housing', description: 'Short-term solutions' },
  ],
  finance: [
    { value: 'tsp-rollover', label: 'TSP/Retirement Accounts', description: 'Manage military savings' },
    { value: 'budgeting', label: 'Budget & Planning', description: 'Create financial plan' },
    { value: 'va-benefits', label: 'Maximize VA Benefits', description: 'Understand all benefits' },
    { value: 'debt-management', label: 'Debt Management', description: 'Pay off or manage debt' },
    { value: 'investment', label: 'Investing', description: 'Long-term wealth building' },
  ],
  wellness: [
    { value: 'mental-health', label: 'Mental Health', description: 'Counseling and support' },
    { value: 'physical-fitness', label: 'Physical Fitness', description: 'Exercise and nutrition' },
    { value: 'va-healthcare', label: 'VA Healthcare', description: 'Medical benefits' },
    { value: 'substance-support', label: 'Substance Support', description: 'Recovery programs' },
    { value: 'family-counseling', label: 'Family Counseling', description: 'Family support services' },
  ],
};

export function StepGoal({ onNext, onBack }: StepGoalProps) {
  const { data, updateData } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isValid, errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      goal: data.goal,
      careerPath: data.goalDetails?.careerPath,
      educationPath: data.goalDetails?.educationPath,
      housingPath: data.goalDetails?.housingPath,
      financePath: data.goalDetails?.financePath || [],
      wellnessPath: data.goalDetails?.wellnessPath || [],
    },
  });

  const selectedGoal = watch('goal');
  const selectedFinance = watch('financePath') || [];
  const selectedWellness = watch('wellnessPath') || [];

  // Enable button if goal is selected (subcategories are optional)
  const canContinue = !!selectedGoal;

  const onSubmit = (formData: FormData) => {
    updateData({ 
      goal: formData.goal,
      goalDetails: {
        careerPath: formData.careerPath,
        educationPath: formData.educationPath,
        housingPath: formData.housingPath,
        financePath: formData.financePath,
        wellnessPath: formData.wellnessPath,
      },
    });
    onNext();
  };

  const isMultiSelect = selectedGoal === 'finance' || selectedGoal === 'wellness';

  return (
    <StepWrapper>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Primary goal?
          </h1>
          <p className="text-xl text-gray-600">
            What matters most right now
          </p>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <label
              key={goal.value}
              className={`
                flex flex-col p-4 md:p-6 border-2 rounded-lg cursor-pointer transition-all
                ${selectedGoal === goal.value 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
            >
              <input
                type="radio"
                value={goal.value}
                {...register('goal')}
                className="sr-only"
              />
              <span className="text-base md:text-lg font-medium">{goal.label}</span>
              <span className={`text-xs md:text-sm mt-1 ${selectedGoal === goal.value ? 'text-gray-200' : 'text-gray-600'}`}>
                {goal.description}
              </span>
            </label>
          ))}
        </div>

        {/* Subcategory selection */}
        <AnimatePresence mode="wait">
          {selectedGoal && subGoals[selectedGoal] && (
            <motion.div
              key={selectedGoal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">
                What specifically? {isMultiSelect && <span className="text-base text-gray-600">(Select all that apply)</span>}
              </h2>
              
              {selectedGoal === 'career' && (
                <div className="space-y-3">
                  {subGoals.career.map((sub) => (
                    <label
                      key={sub.value}
                      className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        value={sub.value}
                        {...register('careerPath')}
                        className="w-5 h-5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm md:text-base">{sub.label}</div>
                        <div className="text-xs md:text-sm text-gray-600">{sub.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedGoal === 'education' && (
                <div className="space-y-3">
                  {subGoals.education.map((sub) => (
                    <label
                      key={sub.value}
                      className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        value={sub.value}
                        {...register('educationPath')}
                        className="w-5 h-5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm md:text-base">{sub.label}</div>
                        <div className="text-xs md:text-sm text-gray-600">{sub.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedGoal === 'housing' && (
                <div className="space-y-3">
                  {subGoals.housing.map((sub) => (
                    <label
                      key={sub.value}
                      className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        value={sub.value}
                        {...register('housingPath')}
                        className="w-5 h-5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm md:text-base">{sub.label}</div>
                        <div className="text-xs md:text-sm text-gray-600">{sub.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedGoal === 'finance' && (
                <Controller
                  name="financePath"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      {subGoals.finance.map((sub) => (
                        <label
                          key={sub.value}
                          className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={field.value?.includes(sub.value as any) || false}
                            onChange={(e) => {
                              const current = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...current, sub.value]);
                              } else {
                                field.onChange(current.filter(v => v !== sub.value));
                              }
                            }}
                            className="w-5 h-5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm md:text-base">{sub.label}</div>
                            <div className="text-xs md:text-sm text-gray-600">{sub.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                />
              )}

              {selectedGoal === 'wellness' && (
                <Controller
                  name="wellnessPath"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      {subGoals.wellness.map((sub) => (
                        <label
                          key={sub.value}
                          className="flex items-center gap-3 p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={field.value?.includes(sub.value as any) || false}
                            onChange={(e) => {
                              const current = field.value || [];
                              if (e.target.checked) {
                                field.onChange([...current, sub.value]);
                              } else {
                                field.onChange(current.filter(v => v !== sub.value));
                              }
                            }}
                            className="w-5 h-5 md:w-4 md:h-4 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm md:text-base">{sub.label}</div>
                            <div className="text-xs md:text-sm text-gray-600">{sub.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
            disabled={!canContinue}
            className="flex-1 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
    </StepWrapper>
  );
}
