'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { StepWrapper } from './StepWrapper';
import { formatDate, getGoalLabel, getDaysUntilETS } from '@/lib/utils';

interface SummaryProps {
  onBack: () => void;
}

export function Summary({ onBack }: SummaryProps) {
  const router = useRouter();
  const { data, setMissionPlan } = useOnboardingStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Clean data - remove undefined/null values except for optional fields
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
        ...(data.timeInService && { timeInService: data.timeInService }),
        ...(data.dischargeRank && { dischargeRank: data.dischargeRank }),
      };

      console.log('Submitting onboarding data:', cleanData);
      
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = errorData.error || `Server error: ${response.status}`;
        
        // Provide more helpful error messages
        if (response.status === 500) {
          if (errorMessage.includes('API key')) {
            errorMessage = 'OpenAI API key is not configured. Please contact support.';
          } else if (errorMessage.includes('authentication')) {
            errorMessage = 'OpenAI authentication failed. Please check your API key configuration.';
          } else {
            errorMessage = 'Failed to generate your mission plan. Please try again or contact support.';
          }
        } else if (response.status === 400) {
          errorMessage = 'Invalid information provided. Please check all fields and try again.';
        }
        
        console.error('API Error:', errorData);
        throw new Error(errorMessage);
      }

      const missionPlan = await response.json();
      console.log('Mission plan generated successfully');
      setMissionPlan(missionPlan);
      router.push('/dashboard');
    } catch (err) {
      console.error('Failed to generate mission plan:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsGenerating(false);
    }
  };

  const daysUntilETS = data.etsDate ? getDaysUntilETS(data.etsDate) : 0;

  return (
    <StepWrapper>
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Ready to launch
          </h1>
          <p className="text-xl text-gray-600">
            Review your information
          </p>
        </div>

        <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Name</p>
            <p className="text-lg mt-1">{data.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">ETS Date</p>
            <p className="text-lg mt-1">
              {data.etsDate && formatDate(data.etsDate)}
              <span className="text-gray-600 ml-2">({daysUntilETS} days)</span>
            </p>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Branch & MOS</p>
            <p className="text-lg mt-1">{data.branch} • {data.mos}</p>
          </div>

          {data.timeInService && (
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Time in Service</p>
              <p className="text-lg mt-1">{data.timeInService} {data.timeInService === '1' ? 'year' : 'years'}</p>
            </div>
          )}

          {data.dischargeRank && (
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Discharge Rank</p>
              <p className="text-lg mt-1">{data.dischargeRank}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Primary Goal</p>
            <p className="text-lg mt-1">{data.goal && getGoalLabel(data.goal)}</p>
          </div>

          {data.location && (
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Location</p>
              <p className="text-lg mt-1">{data.location}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">VA Disability Claim</p>
            <p className="text-lg mt-1">{data.disabilityClaim ? 'Yes' : 'No'}</p>
          </div>

          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">GI Bill</p>
            <p className="text-lg mt-1">{data.giBill ? 'Yes' : 'No'}</p>
          </div>

          {data.dischargeType && (
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Discharge Type</p>
              <p className="text-lg mt-1">
                {data.dischargeType === 'honorable' && 'Honorable Discharge'}
                {data.dischargeType === 'general' && 'General Discharge (Under Honorable Conditions)'}
                {data.dischargeType === 'other-than-honorable' && 'Other Than Honorable (OTH)'}
                {data.dischargeType === 'bad-conduct' && 'Bad Conduct Discharge (BCD)'}
                {data.dischargeType === 'dishonorable' && 'Dishonorable Discharge'}
              </p>
            </div>
          )}

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
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-700 mb-1">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isGenerating}
            className="flex-1 py-4 border-2 border-black text-black font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={isGenerating}
            className="flex-1 py-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
          >
            {isGenerating ? 'Generating Your Plan...' : 'Finish Setup'}
          </button>
        </div>
      </div>
    </StepWrapper>
  );
}
