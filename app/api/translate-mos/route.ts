import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getOnetCrosswalk, zipToStateMetro, getBlSalaries } from '@/lib/mosData';
import type { Branch } from '@/lib/mosData';

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add a valid API key to environment variables.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { mos, zip, branch } = await req.json();

    if (!mos || !zip) {
      return NextResponse.json(
        { error: 'MOS and ZIP code are required' },
        { status: 400 }
      );
    }

    // Get location and salary data
    const stateMetro = await zipToStateMetro(zip);
    const inferredBranch = (branch as Branch) || inferBranchFromCode(mos);
    const onetCodes = await getOnetCrosswalk(mos, inferredBranch);
    
    let salaryData = null;
    if (stateMetro && onetCodes.length > 0) {
      salaryData = await getBlSalaries(onetCodes[0], stateMetro.state, stateMetro.metro);
    }

    // Build context for AI
    const context = {
      mos,
      branch: inferredBranch,
      zip,
      state: stateMetro?.state,
      metro: stateMetro?.metro,
      onetCodes,
      salaryData,
    };

    const prompt = `You are a military transition career counselor. Analyze this service member's military occupational specialty and provide detailed civilian career guidance.

MOS/AFSC/Rating/NEC: ${mos}
Branch: ${inferredBranch}
Location: ZIP ${zip}${stateMetro ? ` (${stateMetro.state}${stateMetro.metro ? ', ' + stateMetro.metro : ''})` : ''}
O*NET SOC Codes: ${onetCodes.join(', ') || 'None mapped'}
${salaryData ? `Local Salary Data: Median $${salaryData.median.toLocaleString()}, 25th percentile $${salaryData.p25.toLocaleString()}, 75th percentile $${salaryData.p75.toLocaleString()}` : ''}

Provide a JSON response with the following structure:
{
  "jobTitles": ["array of 5-8 realistic civilian job titles veterans with this MOS actually get hired for"],
  "avgSalary": [
    {
      "title": "job title",
      "amount": salary_number,
      "source": "data source description"
    }
  ],
  "skillGaps": ["array of 3-6 specific skills, certifications, or qualifications commonly missing"],
  "certPaths": [
    {
      "name": "certification name",
      "timeWeeks": estimated_weeks,
      "costUSD": estimated_cost,
      "provider": "provider name"
    }
  ],
  "resumeBullets": ["array of 4-6 military-to-civilian translated resume bullet points using strong action verbs and quantified achievements"]
}

Guidelines:
- Job titles should be specific and realistic (not generic)
- Use actual salary data when available, otherwise estimate based on role and location
- Skills gaps should be actionable and specific
- Cert paths should include DoD COOL-eligible certs when applicable for this MOS
- Resume bullets should translate military jargon to civilian terms
- Consider the location's job market and cost of living
- Be realistic about entry points vs. aspirational roles

Return ONLY valid JSON, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert military transition counselor specializing in translating military experience to civilian careers. You provide accurate, realistic, and actionable career guidance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const parsedResult = JSON.parse(result);

    return NextResponse.json({
      ...parsedResult,
      context,
    });
  } catch (error) {
    console.error('Error translating MOS:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to translate MOS',
      },
      { status: 500 }
    );
  }
}

function inferBranchFromCode(code: string): Branch {
  const c = code.toUpperCase();
  if (/^[0-9]{2}[A-Z]/.test(c)) return 'army';
  if (/^[A-Z]{2,3}$/.test(c)) return 'navy';
  if (/^[0-9][A-Z][0-9]X[0-9]/.test(c)) return 'air_force';
  if (/^[0-9]{4}$/.test(c)) return 'marines';
  return 'army';
}
