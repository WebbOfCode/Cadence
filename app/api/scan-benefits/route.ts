import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const questionnaire = await req.json();

    const {
      branch,
      status,
      separationType,
      dischargeCode,
      disabilityRating,
      deployed,
      state,
      county,
      educationLevel,
      employmentStatus,
      optional = {},
    } = questionnaire;

    const prompt = `You are a veteran benefits expert. Analyze this service member's profile and identify ALL federal, state, county, and nonprofit benefits they qualify for.

SERVICE MEMBER PROFILE:
- Branch: ${branch}
- Status: ${status}
- Separation Type: ${separationType || 'Not specified'}
${dischargeCode ? `- Discharge Code: ${dischargeCode}` : ''}
- Disability Rating: ${disabilityRating}
- Deployment: ${deployed || 'Not specified'}
- Location: ${county}, ${state}
- Education: ${educationLevel}
- Employment: ${employmentStatus}
- Combat Decorations: ${optional.combatDecorations ? 'Yes' : 'No'}
- Purple Heart: ${optional.purpleHeart ? 'Yes' : 'No'}
- Dependents: ${optional.dependents ? 'Yes' : 'No'}
- Spouse is Veteran: ${optional.spouseVeteran ? 'Yes' : 'No'}
- Homeowner: ${optional.homeowner ? 'Yes' : 'No'}

Return a JSON array of benefit objects with the following structure:
{
  "benefits": [
    {
      "id": "unique-id",
      "category": "education|housing|finance|career|health|cash|other",
      "title": "Benefit Name",
      "whyQualified": "Clear explanation of why they qualify and what makes this valuable for their situation",
      "impactUSD": estimated_annual_value_number,
      "complexity": "easy|moderate|heavy",
      "timeToApply": "time estimate",
      "approvalETA": "approval timeline",
      "docs": ["array", "of", "required", "documents"],
      "links": [
        {
          "label": "Link label",
          "url": "https://actual-url.gov"
        }
      ]
    }
  ]
}

IMPORTANT GUIDELINES:
1. Include ALL applicable benefits: federal (VA, DoD, IRS), state-specific (${state}), county (${county}), and nonprofit programs
2. Consider discharge type and code when evaluating eligibility
3. Prioritize high-impact benefits based on their profile
4. Include lesser-known "hidden money" programs (tax credits, property tax exemptions, utility discounts, etc.)
5. Be realistic about eligibility - don't suggest benefits they won't qualify for
6. For discharge codes like RE-3, JKA, etc., note any restrictions and upgrade paths
7. Include state-specific education benefits for ${state}
8. Consider employment status when recommending career/finance benefits
9. Use real, working URLs for benefit applications
10. Estimate realistic dollar values based on location and circumstances

Return ONLY valid JSON, no markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert veteran benefits counselor with comprehensive knowledge of federal, state, and local programs. You provide accurate, actionable benefit recommendations.',
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

    // Rank benefits by impact with category weighting
    const weights: Record<string, number> = {
      education: separationType === 'honorable' ? 1.0 : 0.85,
      finance: dischargeCode ? 1.1 : 1.0,
      health: dischargeCode ? 1.15 : 1.05,
      career: separationType === 'honorable' ? 1.0 : 0.95,
      cash: dischargeCode ? 1.1 : 1.0,
      housing: 1.0,
      other: 1.0,
    };

    const rankedBenefits = parsedResult.benefits
      .map((b: any) => ({
        ...b,
        _score: (b.impactUSD || 0) * (weights[b.category] || 1.0),
      }))
      .sort((a: any, b: any) => (b._score || 0) - (a._score || 0));

    return NextResponse.json({
      benefits: rankedBenefits,
      totalValue: rankedBenefits.reduce((sum: number, b: any) => sum + (b.impactUSD || 0), 0),
    });
  } catch (error) {
    console.error('Error scanning benefits:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to scan benefits',
      },
      { status: 500 }
    );
  }
}
