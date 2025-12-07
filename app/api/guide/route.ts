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
    
    // Structure the mission plan
    const missionPlan: MissionPlan = {
      veteranName: validatedData.name,
      etsDate: validatedData.etsDate,
      overview: aiResponse.overview,
      tasks: aiResponse.tasks.map((task: any, index: number) => ({
        id: `task-${index + 1}`,
        title: task.title,
        description: task.description,
        category: task.category,
        deadline: task.deadline,
        priority: task.priority,
        completed: false,
      })),
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

function buildTransitionContext(data: z.infer<typeof onboardingSchema>, daysUntilETS: number): string {
  const goalDescriptions: Record<string, string> = {
    career: 'finding civilian employment or starting a business',
    education: 'pursuing higher education or vocational training',
    housing: 'securing housing and relocating',
    finance: 'managing finances and understanding benefits',
    wellness: 'focusing on physical and mental health',
  };

  const dischargeGuidance = getDischargeGuidance(data.dischargeType);

  return `
Create a personalized military transition plan for:

Name: ${data.name}
Branch: ${data.branch}
MOS/AFSC/NEC: ${data.mos}
ETS Date: ${data.etsDate} (${daysUntilETS} days from now)
Primary Goal: ${goalDescriptions[data.goal] || data.goal}
${data.location ? `Target Location: ${data.location}` : ''}
VA Disability Claim: ${data.disabilityClaim ? 'Yes, planning to file' : 'No or unsure'}
GI Bill: ${data.giBill ? 'Yes, will use' : 'No or not applicable'}
Discharge Type: ${data.dischargeType ? formatDischargeType(data.dischargeType) : 'Not specified'}

${dischargeGuidance}

Generate a comprehensive transition checklist with 8-12 actionable tasks. Include:

1. Critical administrative tasks (DD-214, VA enrollment, etc.)
2. ${data.disabilityClaim ? 'Detailed disability claim preparation steps with documentation requirements' : 'General healthcare enrollment guidance'}
3. ${data.goal === 'career' ? 'Career transition tasks: resume building, LinkedIn optimization, job search strategies, veteran hiring programs' : ''}
${data.goal === 'education' ? 'Education planning: GI Bill application, school selection, transcript requests, FAFSA completion' : ''}
${data.goal === 'housing' ? 'Housing tasks: VA home loan pre-qualification, housing search, relocation planning, utility setup' : ''}
${data.goal === 'finance' ? 'Financial planning: budget creation, TSP/401k rollover, veteran benefits maximization, emergency fund setup' : ''}
${data.goal === 'wellness' ? 'Wellness planning: VA healthcare enrollment, mental health resources, fitness routines, veteran support groups' : ''}
4. ${data.location ? `Local veteran resources and opportunities in ${data.location}` : 'General veteran resource connections'}
5. Timeline-based milestones leading up to ETS date
6. ${data.giBill ? 'GI Bill application and certificate of eligibility process' : ''}

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

Your task is to generate a personalized transition plan with specific, actionable tasks.

DO NOT use generic placeholders like "Task 1" or "Update resume". Be specific.

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
        "Continue with 3-7 total steps per task"
      ]
    }
  ]
}

Ensure tasks are:
1. Personalized to the veteran's branch, MOS, goals, and timeline
2. Sequenced logically (early tasks before later dependencies)
3. Include specific resource names (VA.gov, ebenefits, specific programs)
4. Reference actual deadlines (90 days before ETS for TAP, etc.)
5. Each task MUST include a "steps" array with 3-7 specific, actionable steps
6. Steps should reference real tools, websites, and organizations where applicable
7. Steps should be concrete actions, not vague advice (e.g., "Visit Zillow.com and search for properties" not "Find housing")
  `.trim();
}

function generateMockMissionPlan(data: z.infer<typeof onboardingSchema>): MissionPlan {
  const etsDate = new Date(data.etsDate);
  const today = new Date();
  const daysUntilETS = Math.ceil((etsDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate deadlines
  const tapDeadline = new Date(etsDate);
  tapDeadline.setDate(tapDeadline.getDate() - 90);
  
  const healthcareDeadline = new Date(etsDate);
  healthcareDeadline.setDate(healthcareDeadline.getDate() - 30);
  
  const tasks: MissionTask[] = [
    {
      id: 'task-1',
      title: 'Schedule TAP (Transition Assistance Program) counseling',
      description: `Contact your installation's transition office to schedule mandatory TAP counseling at least 90 days before ETS. This comprehensive program covers resume writing, interview skills, VA benefits, and civilian job market preparation.`,
      category: 'admin',
      deadline: tapDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      steps: [
        'Locate your installation\'s Transition Assistance Program (TAP) office or call your Human Resources office for contact information.',
        'Call or visit the TAP office to inquire about available counseling sessions and schedule an appointment at least 90 days before your ETS date.',
        'Confirm the session date, time, and location, and ask if your spouse is welcome to attend.',
        'Prepare a list of questions about resume writing, interview preparation, and VA benefits.',
        'Attend the scheduled TAP counseling session and take notes on key information provided.',
      ],
    },
    {
      id: 'task-2',
      title: 'Request certified copy of DD-214 upon separation',
      description: 'Ensure you receive multiple certified copies of your DD Form 214 (Member 4 copy) at separation. This document is essential for VA benefits, employment verification, and accessing veteran services.',
      category: 'admin',
      deadline: data.etsDate,
      priority: 'high',
      completed: false,
      steps: [
        'Contact your installation\'s Personnel or Human Resources office to request multiple certified copies of your DD-214 form (Member 4 copy).',
        'Request at least 5 certified copies to ensure you have extras for VA benefits, employment, and personal records.',
        'Confirm the copies will be provided on or before your ETS date.',
        'Upon receipt, verify all information on the DD-214 is accurate (dates, MOS, awards, characterization of service).',
        'Scan the certified copies and save digital versions to cloud storage and an external hard drive for backup.',
      ],
    },
    {
      id: 'task-3',
      title: 'Enroll in VA healthcare before ETS date',
      description: 'Apply for VA healthcare online at VA.gov or visit your nearest VA medical center. Enrollment within one year of separation ensures continuous healthcare coverage.',
      category: 'healthcare',
      deadline: healthcareDeadline.toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      steps: [
        'Visit VA.gov and navigate to the \'Health Care\' section.',
        'Click \'Apply for VA Health Care\' and select \'Apply Now\' to start the online application.',
        'Log in with your VA.gov account (create one if needed using your email and Social Security number).',
        'Complete the VA Form 10-10EZ, providing your military service information, current health status, and contact details.',
        'Submit the application and note the confirmation number for your records.',
        'Within 2-3 weeks, the VA will contact you with enrollment information and your assigned medical facility.',
      ],
    },
  ];

  if (data.disabilityClaim) {
    tasks.push({
      id: 'task-4',
      title: 'Gather documentation for VA disability claim',
      description: 'Collect service medical records, deployment documentation, performance evaluations, and buddy statements supporting your claimed conditions. Request your complete military medical records through milConnect or eBenefits.',
      category: 'healthcare',
      deadline: new Date(etsDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      steps: [
        'Log in to milConnect or eBenefits and request your complete military medical records (DD Form 180).',
        'Contact your unit\'s medical officer to schedule a final separation physical and request documentation of any service-related injuries or conditions.',
        'Gather deployment documentation, including dates, locations, and any combat-related incidents.',
        'Collect performance evaluations and any incident reports that document service-connected conditions.',
        'Reach out to 3-5 fellow service members who can provide buddy statements supporting your claimed conditions.',
        'Organize all documents in a folder and create a checklist to ensure nothing is missing before filing your claim.',
      ],
    });
    
    tasks.push({
      id: 'task-5',
      title: 'File VA disability claim (Intent to File)',
      description: 'Submit an Intent to File (ITF) form on VA.gov immediately to establish your effective date for benefits. This preserves your filing date while you gather supporting documentation.',
      category: 'healthcare',
      deadline: new Date(etsDate.getTime() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
      steps: [
        'Visit VA.gov and navigate to \'File a Claim for Disability Compensation\'.',
        'Select \'File an Intent to File (ITF)\' to establish your effective date.',
        'Log in with your VA.gov account and provide your military service information.',
        'List the conditions you believe are service-connected (you can add more details later).',
        'Submit the ITF form and save the confirmation number.',
        'Begin gathering supporting documentation and schedule a consultation with a Veterans Service Officer (VSO) for free claim assistance.',
      ],
    });
  }

  if (data.goal === 'career') {
    tasks.push({
      id: `task-${tasks.length + 1}`,
      title: `Create targeted civilian resume highlighting ${data.branch} ${data.mos} experience`,
      description: `Translate your military experience into civilian language. Emphasize leadership, training, logistics coordination, and performance under pressure. Use metrics and tailor to your target industry.`,
      category: 'career',
      deadline: new Date(etsDate.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
    });
    
    tasks.push({
      id: `task-${tasks.length + 2}`,
      title: 'Apply to veteran hiring programs',
      description: 'Target companies with strong veteran hiring initiatives: Amazon Military Talent Program, JPMorgan Chase Veterans Program, Walmart. Use Hiring Our Heroes and RecruitMilitary job boards.',
      category: 'career',
      deadline: new Date(etsDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
    });
  }

  if (data.giBill) {
    tasks.push({
      id: `task-${tasks.length + 1}`,
      title: 'Apply for GI Bill Certificate of Eligibility',
      description: 'Submit VA Form 22-1990 on VA.gov to obtain your Certificate of Eligibility. This is required before schools can process your GI Bill benefits.',
      category: 'education',
      deadline: new Date(etsDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'high',
      completed: false,
    });
  }

  if (data.location) {
    tasks.push({
      id: `task-${tasks.length + 1}`,
      title: `Research veteran resources in ${data.location}`,
      description: `Identify local VA facilities, veteran service organizations, networking events, and community support groups in ${data.location}. Connect with the local veteran community.`,
      category: 'wellness',
      deadline: new Date(etsDate.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
    });
  }

  tasks.push({
    id: `task-${tasks.length + 1}`,
    title: 'Create 90-day post-ETS transition budget',
    description: 'Calculate monthly expenses including housing, utilities, healthcare, transportation, and food. Account for potential gap between ETS and first civilian paycheck. Set aside 3-6 months expenses if possible.',
    category: 'finance',
    deadline: new Date(etsDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
  });

  const goalLabels: Record<string, string> = {
    career: 'career transition',
    education: 'education and training',
    housing: 'housing and relocation',
    finance: 'financial planning',
    wellness: 'health and wellness',
  };

  return {
    veteranName: data.name,
    etsDate: data.etsDate,
    overview: `Your transition plan focuses on ${goalLabels[data.goal] || 'your goals'} with ${daysUntilETS} days until ETS. ${data.disabilityClaim ? 'We\'ve prioritized VA disability claim preparation alongside ' : 'Key priorities include '}administrative tasks, healthcare enrollment, and ${goalLabels[data.goal] || 'transition preparation'}.`,
    tasks,
    generatedAt: new Date().toISOString(),
  };
}
