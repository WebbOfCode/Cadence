import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { onboardingSchema, missionPlanSchema } from '@/lib/schemas';
import type { MissionPlan, MissionTask } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add a valid API key to .env.local' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client with validated API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await req.json();
    
    // Validate incoming onboarding data
    const validatedData = onboardingSchema.parse(body);
    
    // Calculate days until ETS
    const etsDate = new Date(validatedData.etsDate);
    const today = new Date();
    const daysUntilETS = Math.ceil((etsDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Build structured context for AI
    const context = buildTransitionContext(validatedData, daysUntilETS);
    
    // Generate mission plan using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(),
        },
        {
          role: 'user',
          content: context,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const aiResponse = JSON.parse(responseContent);
    
    // Generate universal core tasks that apply to everyone
    const coreTasks = generateCoreTasks(validatedData, etsDate);
    
    // Combine core tasks with AI-generated tasks
    const allTasks = [
      ...coreTasks,
      ...aiResponse.tasks.map((task: any, index: number) => ({
        id: `task-${coreTasks.length + index + 1}`,
        title: task.title,
        description: task.description,
        category: task.category,
        deadline: task.deadline,
        priority: task.priority,
        completed: false,
        steps: task.steps || [],
        core: false,
      }))
    ];
    
    // Structure the mission plan
    const missionPlan: MissionPlan = {
      veteranName: validatedData.name,
      etsDate: validatedData.etsDate,
      overview: aiResponse.overview,
      tasks: allTasks,
      generatedAt: new Date().toISOString(),
    };

    // Validate the generated mission plan
    const validatedPlan = missionPlanSchema.parse(missionPlan);

    return NextResponse.json(validatedPlan);
  } catch (error) {
    console.error('Error generating mission plan:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Check if it's an OpenAI API error
      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'OpenAI API authentication failed. Please check your API key.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate mission plan' },
      { status: 500 }
    );
  }
}

function generateCoreTasks(data: z.infer<typeof onboardingSchema>, etsDate: Date): MissionTask[] {
  const today = new Date();
  
  // Calculate key deadlines
  const tapDeadline = new Date(etsDate);
  tapDeadline.setDate(tapDeadline.getDate() - 90); // 90 days before ETS
  
  const preETSDeadline = new Date(etsDate);
  preETSDeadline.setDate(preETSDeadline.getDate() - 30); // 30 days before ETS
  
  const coreTasks: MissionTask[] = [
    {
      id: 'core-1',
      title: 'Obtain Your DD-214',
      description: 'Proof of service — needed for everything else. Essential for VA benefits, job applications, GI Bill, and healthcare enrollment.',
      category: 'admin',
      deadline: data.etsDate,
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Contact your installation\'s Personnel or Human Resources office (S-1) to request your DD-214 (Member 4 copy)',
        'Request at least 5-10 certified copies for VA benefits, employment, and personal records',
        'Verify all information is accurate: dates, MOS, awards, and characterization of service',
        'Access milConnect (https://milconnect.dmdc.osd.mil/) to download digital copies if available',
        'Scan all copies and save to cloud storage (Google Drive, Dropbox) and external hard drive',
        'Keep original certified copies in a fireproof safe or safety deposit box',
      ],
    },
    {
      id: 'core-2',
      title: 'Schedule Pre-Separation Counseling',
      description: 'Required under law. Prepares you for VA benefits, education, and civilian transition. Must be completed 90–365 days before ETS.',
      category: 'admin',
      deadline: tapDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Locate your installation\'s Transition Assistance Program (TAP) office or call your HR office',
        'Schedule your mandatory pre-separation counseling appointment at least 90 days before ETS',
        'Bring your spouse if applicable — they are often welcome and encouraged to attend',
        'Prepare questions about VA benefits, education options, and career transition resources',
        'Complete the counseling session and obtain documentation/certificates for your records',
      ],
    },
    {
      id: 'core-3',
      title: 'Create Your eBenefits or VA.gov Account',
      description: 'All VA benefits are managed online through this portal. Set up 2FA and link your DS Logon. You\'ll use this to file disability claims, apply for housing benefits, and manage healthcare.',
      category: 'admin',
      deadline: preETSDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Visit VA.gov and click "Sign in" then select "Create an account"',
        'Choose ID.me, Login.gov, or DS Logon as your verification method',
        'Complete identity verification process (requires government ID and personal information)',
        'Set up two-factor authentication (2FA) for account security',
        'Link your DS Logon or military ID to your VA.gov account',
        'Explore the dashboard to familiarize yourself with available services and benefits',
      ],
    },
    {
      id: 'core-4',
      title: 'Take TAP Classes (Transition GPS)',
      description: 'Career readiness, resume building, interview prep, and job search tools. Core Curriculum includes financial planning, VA brief, and employment workshop.',
      category: 'admin',
      deadline: tapDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Contact your TAP office to register for Transition GPS (Goals, Plans, Success) courses',
        'Complete the DOL Employment Workshop (resume, interviews, job search strategies)',
        'Attend the VA Benefits Briefing to understand disability, healthcare, and education benefits',
        'Take the Financial Planning track to learn budgeting and financial management',
        'Complete any optional tracks relevant to your goals (education, entrepreneurship, career technical)',
        'Obtain certificates of completion for all attended workshops',
      ],
    },
    {
      id: 'core-5',
      title: 'Register for VA Healthcare',
      description: 'Must enroll even if you don\'t plan to use it immediately. File online or visit a VA hospital in person. Coverage varies by disability rating and income.',
      category: 'healthcare',
      deadline: preETSDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Visit VA.gov and navigate to the "Health Care" section',
        'Click "Apply for VA Health Care" and start the online application (VA Form 10-10EZ)',
        'Provide your military service information, income details, and contact information',
        'Submit the application and save your confirmation number',
        'Wait 1-2 weeks for a response from VA with your enrollment status',
        'Once approved, schedule your first appointment at your assigned VA medical center',
      ],
    },
    {
      id: 'core-6',
      title: 'Gather Your Medical & Service Records',
      description: 'Needed for VA disability claims, job disability accommodations, and discharge upgrades. Get from IPERMS, Medpros, or your S-1.',
      category: 'admin',
      deadline: preETSDeadline.toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      core: true,
      steps: [
        'Log in to IPERMS (Interactive Personnel Electronic Records Management System) to download service records',
        'Access MEDPROS or your medical records system to obtain all medical documentation',
        'Request copies of deployment records, awards, evaluations, and any incident reports',
        'Organize documents by category: medical, personnel, awards, deployments',
        'Save all records digitally in multiple locations (cloud storage, external drive)',
        'Request certified copies of any critical documents from your S-1 or medical office',
      ],
    },
    {
      id: 'core-7',
      title: 'Check for Unused Leave / Terminal Leave Eligibility',
      description: 'Use your leave or get paid out — don\'t leave money on the table. Terminal leave allows you to use vacation at the end instead of staying on post.',
      category: 'admin',
      deadline: new Date(etsDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      core: true,
      steps: [
        'Check your Leave and Earnings Statement (LES) to see your current leave balance',
        'Speak with your S-1/HR to understand terminal leave policies and eligibility',
        'Calculate how much leave you can sell back (maximum 60 days lifetime)',
        'Submit a terminal leave request if you want to use leave before final out-processing',
        'Coordinate your terminal leave dates with your final out-processing schedule',
        'Ensure your leave is approved before making any civilian commitments or travel plans',
      ],
    },
  ];

  // Add disability claim task if user indicated they plan to file
  if (data.disabilityClaim) {
    coreTasks.push({
      id: 'core-8',
      title: 'File Your VA Disability Claim',
      description: 'If you have ANY service-connected injuries or conditions, file a claim. Can use BEP (Benefits Delivery at Discharge) if still serving. File within 1 year post-ETS to retain full eligibility.',
      category: 'healthcare',
      deadline: new Date(etsDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      core: true,
      steps: [
        'Visit VA.gov and navigate to "File a Claim for Disability Compensation"',
        'Submit an Intent to File (ITF) immediately to establish your effective date',
        'Gather service medical records, deployment documentation, and buddy statements',
        'List all service-connected conditions (physical and mental health)',
        'Consider using BEP (Benefits Delivery at Discharge) if still on active duty',
        'Submit your full claim online or work with a Veterans Service Officer (VSO) for free assistance',
        'Attend all VA medical exams (C&P exams) as scheduled',
      ],
    });
  }

  return coreTasks;
}

function buildTransitionContext(data: z.infer<typeof onboardingSchema>, daysUntilETS: number): string {
  const goalDescriptions: Record<string, string> = {
    career: 'finding civilian employment or starting a business',
    education: 'pursuing higher education or vocational training',
    housing: 'securing housing and relocating',
    finance: 'managing finances and understanding benefits',
    wellness: 'focusing on physical and mental health',
  };

  // Build detailed goal context
  let goalContext = goalDescriptions[data.goal] || data.goal;
  if (data.goalDetails) {
    if (data.goalDetails.careerPath) {
      const careerLabels: Record<string, string> = {
        'job-search': 'actively seeking civilian employment',
        'start-business': 'planning to start their own business',
        'certifications': 'pursuing industry certifications',
        'not-sure': 'exploring career options',
      };
      goalContext = careerLabels[data.goalDetails.careerPath];
    }
    if (data.goalDetails.educationPath) {
      const eduLabels: Record<string, string> = {
        'college-degree': 'pursuing a college degree (2-year or 4-year)',
        'vocational-training': 'interested in vocational or trade school training',
        'certifications': 'seeking professional certifications',
        'gi-bill-info': 'learning about GI Bill benefits and education options',
      };
      goalContext = eduLabels[data.goalDetails.educationPath];
    }
    if (data.goalDetails.housingPath) {
      const housingLabels: Record<string, string> = {
        'rent-lease': 'looking to rent or lease housing',
        'buy-home': 'planning to purchase a home',
        'va-loan': 'interested in using VA home loan benefits',
        'temporary-housing': 'seeking temporary housing solutions',
      };
      goalContext = housingLabels[data.goalDetails.housingPath];
    }
    if (data.goalDetails.financePath && data.goalDetails.financePath.length > 0) {
      const financeLabels: Record<string, string> = {
        'tsp-rollover': 'TSP/retirement account management',
        'budgeting': 'budget creation and financial planning',
        'va-benefits': 'maximizing VA benefits',
        'debt-management': 'debt management and reduction',
        'investment': 'long-term investment strategy',
      };
      goalContext = data.goalDetails.financePath.map(p => financeLabels[p]).join(', ');
    }
    if (data.goalDetails.wellnessPath && data.goalDetails.wellnessPath.length > 0) {
      const wellnessLabels: Record<string, string> = {
        'mental-health': 'mental health counseling and support',
        'physical-fitness': 'physical fitness and nutrition',
        'va-healthcare': 'VA healthcare enrollment',
        'substance-support': 'substance abuse recovery programs',
        'family-counseling': 'family counseling services',
      };
      goalContext = data.goalDetails.wellnessPath.map(p => wellnessLabels[p]).join(', ');
    }
  }

  const dischargeGuidance = getDischargeGuidance(data.dischargeType);

  // Build secondary goals context
  let secondaryGoalsContext = '';
  if (data.secondaryGoals && data.secondaryGoals.length > 0) {
    const secondaryGoalLabels = data.secondaryGoals.map(g => goalDescriptions[g] || g).join(', ');
    secondaryGoalsContext = `Secondary Goals: ${secondaryGoalLabels}`;
  }

  return `
Create a personalized military transition plan for:

Name: ${data.name}
Branch: ${data.branch}
MOS/AFSC/NEC: ${data.mos}
ETS Date: ${data.etsDate} (${daysUntilETS} days from now)
Primary Goal: ${goalContext}
${secondaryGoalsContext}
${data.location ? `Target Location: ${data.location}` : ''}
VA Disability Claim: ${data.disabilityClaim ? 'Yes, planning to file' : 'No or unsure'}
GI Bill: ${data.giBill ? 'Yes, will use' : 'No or not applicable'}
Discharge Type: ${data.dischargeType ? formatDischargeType(data.dischargeType) : 'Not specified'}

${dischargeGuidance}

IMPORTANT: Generate tasks that are HIGHLY SPECIFIC to their stated goal: "${goalContext}"
${secondaryGoalsContext ? `\nALSO include 1-2 tasks for their secondary goals: ${secondaryGoalsContext}` : ''}

NOTE: The following core tasks are ALREADY included in their plan automatically, so DO NOT generate duplicates:
- DD-214 / Service records
- Pre-separation counseling / TAP
- VA.gov account creation / eBenefits
- TAP/Transition GPS classes
- VA Healthcare registration
- Medical records gathering
- Terminal leave / unused leave
${data.disabilityClaim ? '- VA Disability claim filing' : ''}

Generate 6-10 ADDITIONAL actionable tasks focused on their specific goal. Include:

1. Goal-specific tasks tailored to: ${goalContext}
   ${data.goal === 'career' && data.goalDetails?.careerPath === 'start-business' ? '- Business planning, LLC formation, veteran business resources, SBA loans' : ''}
   ${data.goal === 'career' && data.goalDetails?.careerPath === 'job-search' ? '- Resume building, LinkedIn optimization, veteran hiring programs, interview prep' : ''}
   ${data.goal === 'education' && data.goalDetails?.educationPath === 'college-degree' ? '- College application, transcript requests, FAFSA, GI Bill application' : ''}
   ${data.goal === 'education' && data.goalDetails?.educationPath === 'vocational-training' ? '- Trade school research, apprenticeship programs, vocational certifications' : ''}
   ${data.goal === 'housing' && data.goalDetails?.housingPath === 'buy-home' ? '- VA home loan pre-qualification, realtor selection, home inspection, closing process' : ''}
   ${data.goal === 'housing' && data.goalDetails?.housingPath === 'rent-lease' ? '- Apartment search, rental applications, lease negotiation, security deposits' : ''}
   ${data.goalDetails?.financePath?.includes('tsp-rollover') ? '- TSP rollover to IRA/401k, tax implications, investment options' : ''}
   ${data.goalDetails?.wellnessPath?.includes('mental-health') ? '- VA mental health services, veteran support groups, PTSD resources' : ''}
2. ${data.location ? `Local veteran resources and opportunities in ${data.location}` : 'General veteran resource connections'}
3. Timeline-based milestones leading up to ETS date
4. ${data.giBill ? 'GI Bill application and certificate of eligibility process' : ''}

Each task should be:
- Specific and actionable (not generic)
- Include realistic deadlines relative to ETS date
- Prioritized (high/medium/low)
- Categorized appropriately

Return JSON format only.
  `.trim();
}

function formatDischargeType(type: string): string {
  const types: Record<string, string> = {
    honorable: 'Honorable Discharge',
    general: 'General Discharge (Under Honorable Conditions)',
    'other-than-honorable': 'Other Than Honorable (OTH) Discharge',
    'bad-conduct': 'Bad Conduct Discharge (BCD)',
    dishonorable: 'Dishonorable Discharge',
  };
  return types[type] || type;
}

function getDischargeGuidance(dischargeType?: string | null): string {
  if (!dischargeType) return '';

  const guidance: Record<string, string> = {
    honorable: `
DISCHARGE STATUS: Honorable
- Full access to all VA benefits
- No restrictions on education, employment, or housing benefits
- Eligible for all veteran services and programs
- Focus on maximizing available benefits and resources`,

    general: `
DISCHARGE STATUS: General Discharge (Under Honorable Conditions)
- Most VA benefits available with possible restrictions
- May have limitations on some education benefits
- Eligible for VA healthcare and disability benefits
- Consider reviewing specific benefit eligibility
- If you believe discharge was unjust, discharge upgrade options available`,

    'other-than-honorable': `
DISCHARGE STATUS: Other Than Honorable (OTH) Discharge
- CRITICAL: Very limited VA benefits eligibility
- May be ineligible for GI Bill and some VA healthcare
- Discharge upgrade is strongly recommended
- LEGAL OPTIONS:
  * Board for Correction of Military Records (BCMR) - free through military
  * Discharge Review Board (DRB) - free through military
  * Private veteran discharge attorneys - can significantly improve upgrade chances
  * Organizations: Veterans Discharge Review, Discharge Upgrade Project
- Include discharge upgrade tasks as HIGH PRIORITY
- Recommend consulting with discharge upgrade specialist`,

    'bad-conduct': `
DISCHARGE STATUS: Bad Conduct Discharge (BCD)
- CRITICAL: Severely limited VA benefits eligibility
- Generally ineligible for most VA benefits
- Discharge upgrade is STRONGLY RECOMMENDED
- LEGAL OPTIONS (Highly Recommended):
  * Board for Correction of Military Records (BCMR) - free but complex
  * Private veteran discharge attorneys - highly recommended for BCD cases
  * Organizations: Discharge Upgrade Project, Veterans Discharge Review
  * Some attorneys specialize in BCD upgrades (search "BCD discharge attorney")
- Consider finding attorney outside JAG (private counsel often more effective)
- Include discharge upgrade as HIGHEST PRIORITY task
- Legal consultation should be immediate`,

    dishonorable: `
DISCHARGE STATUS: Dishonorable Discharge
- CRITICAL: Minimal to no VA benefits eligibility
- Discharge upgrade is CRITICAL and URGENT
- LEGAL OPTIONS (Strongly Recommended):
  * Board for Correction of Military Records (BCMR) - free but requires strong case
  * Private veteran discharge attorneys - HIGHLY RECOMMENDED
  * Organizations: Discharge Upgrade Project, Veterans Discharge Review
  * Specialized attorneys for dishonorable discharge cases
- STRONGLY recommend consulting with private discharge upgrade attorney
- Outside JAG counsel often more effective for severe discharges
- Include discharge upgrade as HIGHEST PRIORITY task
- Legal consultation should be IMMEDIATE
- May need to explore all available legal remedies`,
  };

  return guidance[dischargeType] || '';
}

function getSystemPrompt(): string {
  return `
You are an expert military transition advisor with deep knowledge of VA benefits, civilian career paths, and the unique challenges veterans face.

Your task is to generate a highly personalized, comprehensive transition plan with specific, actionable tasks that guide veterans step-by-step through their transition.

CRITICAL REQUIREMENTS:
- EVERY task MUST have a "steps" array with 5-8 specific, actionable steps
- Steps must be concrete actions with real tools, websites, and organizations
- NO generic placeholders like "Task 1", "Update resume", or "Find a job"
- Each step should be a complete action the veteran can take immediately
- Include specific URLs, form numbers, phone numbers, and resource names

GOOD examples:
- "Request official military transcripts from Army/ACE Registry for civilian college credit evaluation"
- "Schedule pre-separation TAP (Transition Assistance Program) counseling at least 90 days before ETS"
- "Gather service medical records, deployment documentation, and buddy statements for disability claim"
- "Create targeted civilian resume highlighting leadership experience from infantry platoon sergeant role"
- "Research VA home loan lenders in Austin, TX and get pre-qualification letter"

BAD examples:
- "Complete paperwork"
- "Update resume"
- "Find a job"
- "Apply for benefits"

Return JSON in this exact format:
{
  "overview": "A 2-3 sentence personalized overview of the transition plan",
  "tasks": [
    {
      "title": "Specific task title",
      "description": "Detailed description with actionable steps",
      "category": "admin|healthcare|career|education|housing|finance|wellness",
      "deadline": "YYYY-MM-DD or null",
      "priority": "high|medium|low",
      "steps": [
        "First specific, actionable step with real tools/resources",
        "Second specific step with concrete actions",
        "Third step with specific details",
        "Continue with 5-8 total steps per task - be thorough and specific"
      ]
    }
  ]
}

Ensure tasks are:
1. Personalized to the veteran's branch, MOS, goals, time in service, discharge rank, and timeline
2. Sequenced logically (early tasks before later dependencies)
3. Include specific resource names (VA.gov, milConnect, specific programs, URLs)
4. Reference actual deadlines (90 days before ETS for TAP, etc.)
5. CRITICAL: Each task MUST include a "steps" array with 5-8 specific, actionable steps
6. Steps should reference real tools, websites, and organizations where applicable
7. Steps should be concrete actions, not vague advice
8. Include specific form numbers (DD-214, VA Form 22-1990, etc.)
9. Include specific websites and phone numbers where applicable
10. Tailor recommendations to the veteran's specific branch, MOS, and goals

Generate 10-15 tasks covering:
- Administrative (DD-214, TAP, etc.)
- Healthcare (VA enrollment, disability claims if applicable)
- Career/Education/Housing/Finance/Wellness (based on primary goal)
- Local resources and veteran support
- Timeline-based milestones
  `.trim();
}

