import { z } from 'zod';

export const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  etsDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  }, 'ETS date must be in the future'),
  branch: z.enum(['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force']),
  mos: z.string().min(1, 'MOS/AFSC/NEC is required'),
  goal: z.enum(['career', 'education', 'housing', 'finance', 'wellness']),
  secondaryGoals: z.array(z.enum(['career', 'education', 'housing', 'finance', 'wellness'])).optional(),
  goalDetails: z.object({
    careerPath: z.enum(['job-search', 'start-business', 'certifications', 'not-sure']).optional(),
    educationPath: z.enum(['college-degree', 'vocational-training', 'certifications', 'gi-bill-info']).optional(),
    housingPath: z.enum(['rent-lease', 'buy-home', 'va-loan', 'temporary-housing']).optional(),
    financePath: z.array(z.enum(['tsp-rollover', 'budgeting', 'va-benefits', 'debt-management', 'investment'])).optional(),
    wellnessPath: z.array(z.enum(['mental-health', 'physical-fitness', 'va-healthcare', 'substance-support', 'family-counseling'])).optional(),
  }).optional(),
  location: z.string().optional(),
  disabilityClaim: z.boolean(),
  giBill: z.boolean(),
  dischargeType: z.enum(['honorable', 'general', 'other-than-honorable', 'bad-conduct', 'dishonorable']).optional().nullable(),
  hasAwards: z.boolean(),
  awards: z.array(z.string()).default([]),
  otherAwards: z.string().optional(),
});

export const missionTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(['admin', 'healthcare', 'career', 'education', 'housing', 'finance', 'wellness']),
  deadline: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  completed: z.boolean(),
  steps: z.array(z.string()).optional(),
  notes: z.string().optional(),
  core: z.boolean().optional(),
});

export const missionPlanSchema = z.object({
  veteranName: z.string(),
  etsDate: z.string(),
  overview: z.string(),
  tasks: z.array(missionTaskSchema),
  generatedAt: z.string(),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
export type MissionTaskSchema = z.infer<typeof missionTaskSchema>;
export type MissionPlanSchema = z.infer<typeof missionPlanSchema>;
