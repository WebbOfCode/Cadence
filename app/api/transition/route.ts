import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { TransitionPlanSchema } from '@/lib/transition/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Inputs from the dashboard
    const { profile, dashboard, context } = body ?? {};

    const instructions = `
You are Cadence, a veteran transition planning AI. Your job is to produce a SINGLE JSON object that matches the required schema.
NO markdown. NO commentary. ONLY JSON.

Goals:
- Identify ONE "Next Critical Action" with highest real-world impact
- Compute a Transition Risk Score (0-100) where higher = more urgent risk
- Provide a timeline broken into windows (e.g., "180-90 days", "30-0 days", "Post-separation")
- List 5-10 recommended near-term tasks ranked by priority

Constraints:
- Only recommend benefits the veteran actually qualifies for based on input
- Prioritize low-friction, high-leverage actions first
- Include links only for official resources (va.gov, dol.gov, etc.)
- Be specific and actionable; no vague advice
- Consider military branch, MOS, disability status, location, and timeline

SCHEMA (required output structure):
{
  "nextCriticalAction": {
    "title": "specific action title",
    "why": "why this matters for their transition",
    "impact": "expected outcome or benefit",
    "timeEstimateMinutes": number (1-480),
    "deadline": "YYYY-MM-DD or null",
    "steps": ["step 1", "step 2", ... "step 5-8"],
    "links": [
      { "label": "resource name", "url": "https://..." }
    ]
  },
  "riskScore": {
    "overall": number (0-100),
    "buckets": {
      "employment": number,
      "financial": number,
      "housing": number,
      "benefits": number
    },
    "notes": ["reason 1", "reason 2", ...]
  },
  "timeline": [
    {
      "windowLabel": "window description (e.g., '180-90 days before separation')",
      "priorities": ["priority 1", "priority 2", ...]
    }
  ],
  "recommendedTasks": [
    {
      "id": "task-id",
      "title": "task title",
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "reason": "why this task matters",
      "estimatedMinutes": number
    }
  ]
}

Veteran Profile:
${JSON.stringify(profile, null, 2)}

Dashboard State:
${JSON.stringify(dashboard, null, 2)}

Additional Context:
${context || 'None provided'}

Return ONLY valid JSON. Do not include markdown, code blocks, or any text outside the JSON object.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: instructions,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '';

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('Model did not return valid JSON:', raw);
      return NextResponse.json(
        { error: 'Model did not return valid JSON', raw },
        { status: 502 }
      );
    }

    const plan = TransitionPlanSchema.parse(parsed);
    return NextResponse.json(plan);
  } catch (err: any) {
    console.error('Transition plan generation error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
