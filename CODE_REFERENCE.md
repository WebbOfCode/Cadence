# Code Reference - Updated Types, Tasks, and Components

## 1. Updated Task Type

**File:** `lib/types.ts`

```typescript
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
  // Housing tasks now reference real-world search tools (Zillow, Apartments.com, etc.)
  // Veteran support tasks include example orgs and encourage saving contacts
  steps?: string[];
}
```

---

## 2. Updated OnboardingData Type

**File:** `lib/types.ts`

```typescript
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
```

---

## 3. Example Housing Task with Real Resources

**File:** `mock-mission-plan.json`

```json
{
  "id": "task-10",
  "title": "Research VA Home Loan Lenders in Orlando, FL",
  "description": "Identify and contact VA-approved home loan lenders in Orlando to get pre-qualified for a VA home loan. This will help in understanding your budget for home purchases.",
  "category": "housing",
  "deadline": "2025-05-19",
  "priority": "high",
  "completed": false,
  "steps": [
    "Visit the VA.gov website and use the VA Home Loan Calculator (https://www.va.gov/housing-assistance/home-loans/loan-calculator/) to determine your estimated loan amount and monthly payment.",
    "Search for VA-approved lenders in Orlando using the VA Lender Search tool on VA.gov or by searching 'VA-approved mortgage lenders Orlando, FL'.",
    "Contact 3-5 VA-approved lenders and request pre-qualification or pre-approval letters (this is free and doesn't affect your credit score).",
    "Compare interest rates, fees, and terms offered by different lenders.",
    "Ask each lender about VA-specific benefits, such as no down payment, no PMI (private mortgage insurance), and funding fees.",
    "Save the pre-qualification letters and lender contact information for future reference."
  ]
}
```

---

## 4. Example Housing Search Task

**File:** `mock-mission-plan.json`

```json
{
  "id": "task-10b",
  "title": "Start Housing Search in Orlando, FL",
  "description": "Begin the search for suitable housing options in Orlando, using real estate websites, VA housing assistance programs, and local agents familiar with veteran needs.",
  "category": "housing",
  "deadline": "2026-01-04",
  "priority": "medium",
  "completed": false,
  "steps": [
    "Create a list of 3-5 neighborhoods in Orlando that interest you (consider proximity to your job, VA medical center, schools, and veteran community).",
    "Visit housing search platforms: Zillow.com, Apartments.com, Rent.com, and Realtor.com to browse available properties.",
    "Filter searches by your pre-approved VA loan amount or rental budget.",
    "Compare estimated rent/mortgage + utilities costs for each neighborhood using cost-of-living calculators.",
    "Save listings of 10-15 properties that match your criteria and budget.",
    "Contact local real estate agents who specialize in working with veterans or have VA loan experience.",
    "Schedule virtual or in-person tours of your top 5 properties."
  ]
}
```

---

## 5. Example Veteran Support Task with Organizations

**File:** `mock-mission-plan.json`

```json
{
  "id": "task-13",
  "title": "Connect with Local Veteran Resources in Orlando",
  "description": "Reach out to veteran support organizations in Orlando, such as the Orlando VA Medical Center and local VFW posts, to establish a network and access community resources.",
  "category": "wellness",
  "deadline": "2026-01-14",
  "priority": "medium",
  "completed": false,
  "steps": [
    "Search online for the Orlando VA Medical Center and save its main phone number (407-646-1500) and address to your contacts.",
    "Visit the VA.gov facility locator (https://www.va.gov/find-locations/) to find VA clinics and Vet Centers near Orlando.",
    "Search for local VFW (Veterans of Foreign Wars) posts in Orlando using the VFW post locator on vfw.org.",
    "Search for local American Legion chapters in Orlando using the American Legion website (legion.org).",
    "Research other veteran support organizations such as Team RWB (Team Red White & Blue), Wounded Warrior Project, and local veteran nonprofits in Orlando.",
    "Save contact information (phone numbers, addresses, websites) for at least 5-7 veteran organizations in a document or phone contacts.",
    "Attend at least one meeting or event at a VFW post or American Legion chapter to meet other veterans and learn about available resources."
  ]
}
```

---

## 6. Awards Onboarding Component

**File:** `app/onboarding/components/StepAwards.tsx`

```typescript
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import { Info } from 'lucide-react';

const awardsSchema = z.object({
  hasAwards: z.boolean(),
  awards: z.array(z.string()).default([]),
  otherAwards: z.string().optional(),
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
  const { control, handleSubmit, watch } = useForm<AwardsFormData>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      hasAwards: data.hasAwards ?? false,
      awards: data.awards ?? [],
      otherAwards: data.otherAwards ?? '',
    },
  });

  const hasAwards = watch('hasAwards');

  const onSubmit = (formData: AwardsFormData) => {
    updateData({
      hasAwards: formData.hasAwards,
      awards: formData.awards,
      otherAwards: formData.otherAwards,
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
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Yes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="w-5 h-5"
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
```

---

## 7. Updated Onboarding Page

**File:** `app/onboarding/page.tsx` (key changes)

```typescript
import { StepAwards } from './components/StepAwards';

const TOTAL_STEPS = 11; // Increased from 10

const renderStep = () => {
  switch (currentStep) {
    // ... previous cases ...
    case 8:
      return <StepDischargeType onNext={handleNext} onBack={handleBack} />;
    case 9:
      return <StepAwards onNext={handleNext} onBack={handleBack} />;
    case 10:
      return <Summary onBack={handleBack} />;
    default:
      return <StepName onNext={handleNext} />;
  }
};
```

---

## 8. Updated Summary Component

**File:** `app/onboarding/components/Summary.tsx` (key sections)

```typescript
// Data cleaning - includes awards
const cleanData = {
  name: data.name,
  etsDate: data.etsDate,
  branch: data.branch,
  mos: data.mos,
  goal: data.goal,
  disabilityClaim: data.disabilityClaim,
  giBill: data.giBill,
  hasAwards: data.hasAwards,
  awards: data.awards ?? [],
  ...(data.location && { location: data.location }),
  ...(data.dischargeType && { dischargeType: data.dischargeType }),
  ...(data.otherAwards && { otherAwards: data.otherAwards }),
};

// Display awards in summary
{data.hasAwards && (
  <div>
    <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Awards & Decorations</p>
    <div className="mt-2 space-y-1">
      {data.awards && data.awards.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700">Selected Awards:</p>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {data.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>
      )}
      {data.otherAwards && (
        <div>
          <p className="text-sm font-medium text-gray-700">Other Awards:</p>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.otherAwards}</p>
        </div>
      )}
    </div>
  </div>
)}
```

---

## 9. Updated Validation Schema

**File:** `lib/schemas.ts`

```typescript
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
  location: z.string().optional(),
  disabilityClaim: z.boolean(),
  giBill: z.boolean(),
  dischargeType: z.enum(['honorable', 'general', 'other-than-honorable', 'bad-conduct', 'dishonorable']).optional().nullable(),
  hasAwards: z.boolean(),
  awards: z.array(z.string()).default([]),
  otherAwards: z.string().optional(),
});
```

---

## Summary of Changes

### Types
- ✅ Added `steps` field to `MissionTask` (optional, for "How to complete" feature)
- ✅ Added `hasAwards`, `awards`, `otherAwards` to `OnboardingData`

### Tasks
- ✅ Updated housing tasks with real tools (Zillow, Apartments.com, Rent.com, VA.gov)
- ✅ Added veteran support task with specific organizations (VFW, American Legion, Team RWB, etc.)
- ✅ All steps are specific and actionable with real URLs and phone numbers

### Onboarding
- ✅ Created new `StepAwards` component
- ✅ Increased total steps from 10 to 11
- ✅ Awards step appears before final summary
- ✅ Conditional rendering based on hasAwards boolean
- ✅ Optional fields don't block completion

### Data Flow
- ✅ Awards data flows through Zustand store
- ✅ Data is persisted in localStorage
- ✅ Awards included in API request to generate mission plan
- ✅ Awards displayed in summary review

---

**Status:** ✅ All code implemented and compiled successfully
