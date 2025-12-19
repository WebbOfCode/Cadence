export type MilitaryBranch = 
  | 'Army'
  | 'Navy'
  | 'Air Force'
  | 'Marine Corps'
  | 'Coast Guard'
  | 'Space Force';

export type TransitionGoal = 
  | 'career'
  | 'education'
  | 'housing'
  | 'finance'
  | 'wellness';

export type DischargeType = 
  | 'honorable'
  | 'general'
  | 'other-than-honorable'
  | 'entry-level'
  | 'bad-conduct'
  | 'dishonorable';

export interface OnboardingData {
  name: string;
  etsDate: string;
  branch: MilitaryBranch;
  mos: string;
  goal: TransitionGoal;
  secondaryGoals?: TransitionGoal[];
  goalDetails?: {
    careerPath?: 'job-search' | 'start-business' | 'certifications' | 'not-sure';
    educationPath?: 'college-degree' | 'vocational-training' | 'certifications' | 'gi-bill-info';
    housingPath?: 'rent-lease' | 'buy-home' | 'va-loan' | 'temporary-housing';
    financePath?: ('tsp-rollover' | 'budgeting' | 'va-benefits' | 'debt-management' | 'investment')[];
    wellnessPath?: ('mental-health' | 'physical-fitness' | 'va-healthcare' | 'substance-support' | 'family-counseling')[];
  };
  location?: string;
  disabilityClaim: boolean;
  giBill: boolean;
  dischargeType?: DischargeType;
  dischargeCode?: string; // Optional discharge code (RE-3, JKA, etc.) for non-honorable discharges
  // Behavioral UX flags
  dischargeUpgradeNudge?: boolean; // Persist recommendation to file a discharge upgrade
  dischargeUpgradeBannerDismissed?: boolean; // User dismissed the dashboard banner (task remains)
  // Generalized NCO banners dismiss list
  ncoBannerDismissedKeys?: string[]; // e.g., ['disability-claim','va-healthcare','gi-bill','va-loan-coe','tsp-rollover']
  // Additional nudges
  vaHealthcareNudge?: boolean;
  disabilityClaimNudge?: boolean;
  giBillNudge?: boolean;
  vaLoanNudge?: boolean;
  tspRolloverNudge?: boolean;
  // Awards and decorations - used for tailoring recommendations and resume prompts
  hasAwards: boolean;
  awards: string[]; // Selected awards from predefined list
  otherAwards?: string; // Free-text field for additional awards not in the list
  timeInService?: string; // Years of service (e.g., "4", "8", "20+")
  dischargeRank?: string; // Rank at discharge (branch-specific)
}

export interface MissionTask {
  id: string;
  title: string;
  description: string;
  category: 'admin' | 'healthcare' | 'career' | 'education' | 'housing' | 'finance' | 'wellness';
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notes?: string;
  // Steps array for "How to complete" feature - provides actionable steps for task completion
  steps?: string[];
  // Track which steps have been completed (array of step indices)
  stepsCompleted?: number[];
  // Core/universal tasks that apply to everyone
  core?: boolean;
}

export interface MissionPlan {
  veteranName: string;
  etsDate: string;
  overview: string;
  tasks: MissionTask[];
  generatedAt: string;
}
