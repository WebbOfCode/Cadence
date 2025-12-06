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
  | 'bad-conduct'
  | 'dishonorable';

export interface OnboardingData {
  name: string;
  etsDate: string;
  branch: MilitaryBranch;
  mos: string;
  goal: TransitionGoal;
  location?: string;
  disabilityClaim: boolean;
  giBill: boolean;
  dischargeType?: DischargeType;
  // Awards and decorations - used for tailoring recommendations and resume prompts
  hasAwards: boolean;
  awards: string[]; // Selected awards from predefined list
  otherAwards?: string; // Free-text field for additional awards not in the list
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
}

export interface MissionPlan {
  veteranName: string;
  etsDate: string;
  overview: string;
  tasks: MissionTask[];
  generatedAt: string;
}
