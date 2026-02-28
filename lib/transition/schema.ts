import { z } from 'zod';

export const TransitionPlanSchema = z.object({
  nextCriticalAction: z.object({
    title: z.string(),
    why: z.string(),
    impact: z.string(),
    timeEstimateMinutes: z.number().int().min(1).max(480),
    deadline: z.string().optional(), // ISO date string if known
    steps: z.array(z.string()).min(2).max(8),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
  }),
  riskScore: z.object({
    overall: z.number().min(0).max(100),
    buckets: z.object({
      employment: z.number().min(0).max(100),
      financial: z.number().min(0).max(100),
      housing: z.number().min(0).max(100),
      benefits: z.number().min(0).max(100),
    }),
    notes: z.array(z.string()).min(1).max(8),
  }),
  timeline: z
    .array(
      z.object({
        windowLabel: z.string(), // e.g. "180–90 days before separation"
        priorities: z.array(z.string()).min(1).max(6),
      })
    )
    .min(2)
    .max(6),
  recommendedTasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
        reason: z.string(),
        estimatedMinutes: z.number().int().min(5).max(600),
      })
    )
    .min(3)
    .max(12),
});

export type TransitionPlan = z.infer<typeof TransitionPlanSchema>;
