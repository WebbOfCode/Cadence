# Enriched Features Guide - Housing Resources & Awards

## Overview

This document describes two major enhancements to the Cadence veteran transition tool:

1. **Enriched Task Steps with Real Resources** - Housing and veteran support tasks now include specific, actionable steps with real-world tools and organizations
2. **Awards & Decorations Onboarding Section** - New orientation step to collect military awards and decorations for resume tailoring

---

## Part A: Enriched Task Steps with Real Resources

### Housing Tasks with Specific Tools

#### Task 1: Research VA Home Loan Lenders in Orlando, FL

**Description:** Identify and contact VA-approved home loan lenders in Orlando to get pre-qualified for a VA home loan.

**Steps with Real Resources:**
```
1. Visit the VA.gov website and use the VA Home Loan Calculator 
   (https://www.va.gov/housing-assistance/home-loans/loan-calculator/) 
   to determine your estimated loan amount and monthly payment.

2. Search for VA-approved lenders in Orlando using the VA Lender Search tool 
   on VA.gov or by searching 'VA-approved mortgage lenders Orlando, FL'.

3. Contact 3-5 VA-approved lenders and request pre-qualification or 
   pre-approval letters (this is free and doesn't affect your credit score).

4. Compare interest rates, fees, and terms offered by different lenders.

5. Ask each lender about VA-specific benefits, such as no down payment, 
   no PMI (private mortgage insurance), and funding fees.

6. Save the pre-qualification letters and lender contact information 
   for future reference.
```

**Real Resources Referenced:**
- VA Home Loan Calculator: https://www.va.gov/housing-assistance/home-loans/loan-calculator/
- VA Lender Search tool on VA.gov

---

#### Task 2: Start Housing Search in Orlando, FL

**Description:** Begin the search for suitable housing options in Orlando, using real estate websites and veteran-friendly agents.

**Steps with Real Tools:**
```
1. Create a list of 3-5 neighborhoods in Orlando that interest you 
   (consider proximity to your job, VA medical center, schools, and veteran community).

2. Visit housing search platforms: Zillow.com, Apartments.com, Rent.com, 
   and Realtor.com to browse available properties.

3. Filter searches by your pre-approved VA loan amount or rental budget.

4. Compare estimated rent/mortgage + utilities costs for each neighborhood 
   using cost-of-living calculators.

5. Save listings of 10-15 properties that match your criteria and budget.

6. Contact local real estate agents who specialize in working with veterans 
   or have VA loan experience.

7. Schedule virtual or in-person tours of your top 5 properties.
```

**Real Resources Referenced:**
- Zillow.com - Home search and pricing
- Apartments.com - Rental listings
- Rent.com - Rental search
- Realtor.com - Real estate listings

---

#### Task 3: Plan Relocation to Orlando, FL

**Description:** Organize logistics for relocating to Orlando, including packing, transportation, and utilities setup.

**Steps with Practical Logistics:**
```
1. Obtain moving quotes from 3-5 professional moving companies or research 
   DIY moving options (U-Haul, Penske, Home Depot rentals).

2. Decide between hiring professional movers or DIY moving based on cost 
   and timeline.

3. Plan your driving route from your current location to Orlando using 
   Google Maps or similar tools.

4. Schedule your move date and confirm with your moving company or 
   reserve your rental truck.

5. Contact utility providers (electricity, water, gas, internet) in Orlando 
   and schedule setup for your move-in date.

6. Create a moving checklist including items to pack, forward address with USPS, 
   and notify important contacts (VA, employer, banks).

7. Arrange temporary housing if needed between your current location and Orlando 
   (hotels, Airbnb, or staying with friends/family).
```

**Real Resources Referenced:**
- U-Haul - DIY moving trucks
- Penske - Moving truck rentals
- Home Depot - Equipment rentals
- Google Maps - Route planning
- USPS - Address forwarding

---

### Veteran Support Tasks with Specific Organizations

#### Task: Connect with Local Veteran Resources in Orlando

**Description:** Reach out to veteran support organizations in Orlando to establish a network and access community resources.

**Steps with Specific Organizations:**
```
1. Search online for the Orlando VA Medical Center and save its main phone number 
   (407-646-1500) and address to your contacts.

2. Visit the VA.gov facility locator (https://www.va.gov/find-locations/) 
   to find VA clinics and Vet Centers near Orlando.

3. Search for local VFW (Veterans of Foreign Wars) posts in Orlando using 
   the VFW post locator on vfw.org.

4. Search for local American Legion chapters in Orlando using the American Legion 
   website (legion.org).

5. Research other veteran support organizations such as Team RWB (Team Red White & Blue), 
   Wounded Warrior Project, and local veteran nonprofits in Orlando.

6. Save contact information (phone numbers, addresses, websites) for at least 
   5-7 veteran organizations in a document or phone contacts.

7. Attend at least one meeting or event at a VFW post or American Legion chapter 
   to meet other veterans and learn about available resources.
```

**Real Organizations Referenced:**
- **Orlando VA Medical Center** - Primary VA healthcare facility (407-646-1500)
- **VA.gov Facility Locator** - Find local VA clinics and Vet Centers
- **VFW (Veterans of Foreign Wars)** - Local posts and community support (vfw.org)
- **The American Legion** - Local chapters and veteran services (legion.org)
- **Team RWB (Team Red White & Blue)** - Veteran fitness and community
- **Wounded Warrior Project** - Mental health and wellness support
- Local veteran nonprofits and support groups

---

## Part B: Awards & Decorations Onboarding Section

### New Onboarding Step: Awards & Decorations

**Purpose:** Collect information about military awards and decorations to tailor resume recommendations and highlight service achievements.

**Step Position:** Step 9 (before final summary)

**Total Onboarding Steps:** Now 11 steps (was 10)

### Data Model

**Updated `OnboardingData` Interface:**
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

### UI Flow

#### Step 1: Has Awards Question
User sees a simple Yes/No question:
```
"Have you received any awards or decorations?"
- Yes (radio button)
- No (radio button)
```

#### Step 2: Award Selection (Conditional - shows only if "Yes")
If user selects "Yes", a checkbox list appears with common Army awards:

**Predefined Awards List:**
- Army Achievement Medal (AAM)
- Army Commendation Medal (ARCOM)
- Meritorious Service Medal (MSM)
- Army Good Conduct Medal (AGCM)
- Combat Action Badge (CAB)
- Combat Infantryman Badge (CIB)
- NCO Professional Development Ribbon
- Army Service Ribbon

#### Step 3: Other Awards Text Input (Conditional - shows if "Yes")
A text area for additional awards:
```
"Other awards or decorations (optional):"
Placeholder: "e.g., Joint Service Achievement Medal, Foreign Military Decoration, 
Meritorious Unit Commendation"
```

### Component Implementation

**File:** `app/onboarding/components/StepAwards.tsx`

**Key Features:**
- Uses `react-hook-form` with Zod validation
- Conditional rendering based on `hasAwards` boolean
- Checkbox group for predefined awards
- Optional textarea for other awards
- Smooth animations using Framer Motion
- Informational banner explaining the purpose
- Fully optional - doesn't block completion

**State Management:**
```typescript
const [hasAwards, setHasAwards] = useState(data.hasAwards ?? false);
const [selectedAwards, setSelectedAwards] = useState(data.awards ?? []);
const [otherAwards, setOtherAwards] = useState(data.otherAwards ?? '');
```

### Summary Display

**File:** `app/onboarding/components/Summary.tsx`

Awards are displayed in the final review screen:

```
AWARDS & DECORATIONS

Selected Awards:
• Army Achievement Medal (AAM)
• Combat Infantryman Badge (CIB)

Other Awards:
Joint Service Achievement Medal, Foreign Military Decoration
```

### Data Persistence

Awards data is:
- Stored in Zustand store with localStorage persistence
- Included in the API request to generate the mission plan
- Used by AI to tailor resume recommendations
- Exported with the mission plan JSON

### Validation

**Zod Schema:**
```typescript
const awardsSchema = z.object({
  hasAwards: z.boolean(),
  awards: z.array(z.string()).default([]),
  otherAwards: z.string().optional(),
});
```

**Rules:**
- `hasAwards` is required (boolean)
- `awards` is an array of strings (can be empty)
- `otherAwards` is optional free text

---

## Files Modified/Created

### Modified Files

| File | Changes |
|------|---------|
| `lib/types.ts` | Added `hasAwards`, `awards`, `otherAwards` to `OnboardingData` |
| `lib/schemas.ts` | Added awards validation to `onboardingSchema` |
| `app/onboarding/page.tsx` | Added `StepAwards` import, increased `TOTAL_STEPS` to 11, added case 9 for awards |
| `app/onboarding/components/Summary.tsx` | Added awards display, updated data cleaning to include awards |
| `mock-mission-plan.json` | Updated housing tasks with real resources, added veteran support task |

### Created Files

| File | Purpose |
|------|---------|
| `app/onboarding/components/StepAwards.tsx` | New awards/decorations onboarding step |

---

## Usage Examples

### Housing Task Steps in Action

When a veteran clicks "View Steps" on "Research VA Home Loan Lenders in Orlando, FL":

```
▼ Hide Steps

How to complete this task:

1. Visit the VA.gov website and use the VA Home Loan Calculator 
   (https://www.va.gov/housing-assistance/home-loans/loan-calculator/) 
   to determine your estimated loan amount and monthly payment.

2. Search for VA-approved lenders in Orlando using the VA Lender Search tool 
   on VA.gov or by searching 'VA-approved mortgage lenders Orlando, FL'.

3. Contact 3-5 VA-approved lenders and request pre-qualification or 
   pre-approval letters (this is free and doesn't affect your credit score).

4. Compare interest rates, fees, and terms offered by different lenders.

5. Ask each lender about VA-specific benefits, such as no down payment, 
   no PMI (private mortgage insurance), and funding fees.

6. Save the pre-qualification letters and lender contact information 
   for future reference.
```

### Awards Onboarding Flow

**Screen 1: Question**
```
Awards & Decorations

This helps us tailor your resume and highlight your achievements

Have you received any awards or decorations?
○ Yes
○ No

[Back] [Next]
```

**Screen 2: Selection (if Yes)**
```
Awards & Decorations

Select your awards (check all that apply):

☑ Army Achievement Medal (AAM)
☐ Army Commendation Medal (ARCOM)
☑ Meritorious Service Medal (MSM)
☐ Army Good Conduct Medal (AGCM)
☑ Combat Action Badge (CAB)
☐ Combat Infantryman Badge (CIB)
☐ NCO Professional Development Ribbon
☐ Army Service Ribbon

Other awards or decorations (optional):
[Joint Service Achievement Medal, Foreign Military Decoration]

[Back] [Next]
```

**Screen 3: Summary Review**
```
AWARDS & DECORATIONS

Selected Awards:
• Army Achievement Medal (AAM)
• Meritorious Service Medal (MSM)
• Combat Action Badge (CAB)

Other Awards:
Joint Service Achievement Medal, Foreign Military Decoration
```

---

## Future Enhancement Ideas

### Housing Tasks
- Add VA home loan comparison tools
- Integration with Zillow API for live listings
- Neighborhood safety and veteran community ratings
- Moving company reviews and ratings
- Utility setup checklist generator

### Awards Section
- Award significance explanations
- Resume bullet point suggestions based on awards
- Award-specific career path recommendations
- Military to civilian translation of awards
- Award verification tools

---

## Testing Checklist

### Housing Tasks
- [ ] Steps display with real URLs and tool names
- [ ] Links to VA.gov, Zillow, Apartments.com, etc. are accurate
- [ ] Steps are specific and actionable
- [ ] No generic or vague language
- [ ] Mobile formatting works well

### Awards Section
- [ ] Awards step appears as step 9 in onboarding
- [ ] Yes/No toggle works correctly
- [ ] Award checkboxes appear only when "Yes" selected
- [ ] Other awards textarea appears only when "Yes" selected
- [ ] Multiple awards can be selected
- [ ] Awards display correctly in summary
- [ ] Awards are persisted in localStorage
- [ ] Awards are included in API request
- [ ] Form submits cleanly with awards data
- [ ] Optional fields don't block completion

---

## Code Quality Notes

### Task Steps
- ✅ Steps are stored in `Task.steps` array (single source of truth)
- ✅ No hard-coded steps in JSX
- ✅ Real-world tools and organizations referenced
- ✅ Specific, actionable language
- ✅ Includes URLs and phone numbers where relevant
- ✅ Comments explain resource references

### Awards Component
- ✅ Full TypeScript type safety
- ✅ Zod validation for all fields
- ✅ Proper form state management with react-hook-form
- ✅ Conditional rendering with Framer Motion animations
- ✅ Consistent with existing design system
- ✅ Optional fields don't block completion
- ✅ Clear comments explaining purpose and usage

---

## Deployment Checklist

- [ ] All files compiled successfully
- [ ] Dev server running without errors
- [ ] Test onboarding flow with awards
- [ ] Test housing task steps display
- [ ] Test veteran support task steps
- [ ] Verify awards persist in localStorage
- [ ] Verify awards included in API request
- [ ] Test on mobile devices
- [ ] Verify all external links work
- [ ] Check for console errors
- [ ] Test with different award combinations

---

**Status:** ✅ Implementation complete and ready for testing
**Last Updated:** December 6, 2025
