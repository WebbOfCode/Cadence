'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X, Loader2 } from 'lucide-react';
import type { TransitionGoal } from '@/lib/types';
import { getGoalLabel } from '@/lib/utils';

interface EditGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const goalOptions: { value: TransitionGoal; label: string }[] = [
  { value: 'career', label: 'Career Development' },
  { value: 'education', label: 'Education & Training' },
  { value: 'housing', label: 'Housing & Relocation' },
  { value: 'finance', label: 'Financial Planning' },
  { value: 'wellness', label: 'Health & Wellness' },
];

export function EditGoalsModal({ isOpen, onClose }: EditGoalsModalProps) {
  const router = useRouter();
  const { data, updateData, setMissionPlan } = useOnboardingStore();
  const [selectedGoal, setSelectedGoal] = useState<TransitionGoal>(data.goal || 'career');
  const [secondaryGoals, setSecondaryGoals] = useState<TransitionGoal[]>(data.secondaryGoals || []);
  const [relocationCity, setRelocationCity] = useState(data.location || '');
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleSecondaryGoal = (goal: TransitionGoal) => {
    if (goal === selectedGoal) return; // Can't add primary goal as secondary
    
    setSecondaryGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleReconstruct = async () => {
    if (
      selectedGoal === data.goal && 
      relocationCity === (data.location || '') && 
      JSON.stringify(secondaryGoals) === JSON.stringify(data.secondaryGoals || [])
    ) {
      onClose();
      return;
    }

    setIsReconstructing(true);
    setError(null);

    try {
      // Update the data in the store
      updateData({ 
        goal: selectedGoal,
        location: relocationCity || undefined,
        secondaryGoals: secondaryGoals.length > 0 ? secondaryGoals : undefined,
      });

      // Prepare data for API call
      const cleanData = {
        name: data.name,
        etsDate: data.etsDate,
        branch: data.branch,
        mos: data.mos,
        goal: selectedGoal,
        disabilityClaim: data.disabilityClaim,
        giBill: data.giBill,
        hasAwards: data.hasAwards,
        awards: data.awards ?? [],
        ...(relocationCity && { location: relocationCity }),
        ...(secondaryGoals.length > 0 && { secondaryGoals }),
        ...(data.dischargeType && { dischargeType: data.dischargeType }),
        ...(data.otherAwards && { otherAwards: data.otherAwards }),
        ...(data.timeInService && { timeInService: data.timeInService }),
        ...(data.dischargeRank && { dischargeRank: data.dischargeRank }),
        ...(data.goalDetails && { goalDetails: data.goalDetails }),
      };

      console.log('Reconstructing mission plan with new settings:', { selectedGoal, secondaryGoals, relocationCity });

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

        if (response.status === 500) {
          if (errorMessage.includes('API key')) {
            errorMessage = 'OpenAI API key is not configured. Please contact support.';
          } else if (errorMessage.includes('authentication')) {
            errorMessage = 'OpenAI authentication failed. Please check your API key configuration.';
          } else {
            errorMessage = 'Failed to reconstruct your mission plan. Please try again or contact support.';
          }
        } else if (response.status === 400) {
          errorMessage = 'Invalid information provided. Please check all fields and try again.';
        }

        console.error('API Error:', errorData);
        throw new Error(errorMessage);
      }

      const missionPlan = await response.json();
      console.log('Mission plan reconstructed successfully');
      setMissionPlan(missionPlan);
      
      // Close modal and refresh the page
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Failed to reconstruct mission plan:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsReconstructing(false);
    }
  };

  const hasChanges = 
    selectedGoal !== data.goal || 
    relocationCity !== (data.location || '') || 
    JSON.stringify(secondaryGoals) !== JSON.stringify(data.secondaryGoals || []);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader className="sticky top-0 bg-white pb-6 border-b border-gray-200 mb-6 z-10">
          <div className="flex items-start justify-between gap-3 mb-4">
            <SheetTitle className="text-left text-2xl">Edit Your Transition Plan</SheetTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-left">
            Update your goals and location to reconstruct your mission plan with personalized recommendations.
          </p>
        </SheetHeader>

        <div className="space-y-6 pb-8">
          {/* Relocation City */}
          <section>
            <h3 className="text-lg font-bold mb-2">Relocation City</h3>
            <p className="text-sm text-gray-600 mb-3">Where are you planning to relocate?</p>
            <input
              type="text"
              value={relocationCity}
              onChange={(e) => setRelocationCity(e.target.value)}
              placeholder="e.g., Austin, TX"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
            />
          </section>

          {/* Primary Goal */}
          <section>
            <h3 className="text-lg font-bold mb-2">Primary Goal</h3>
            <p className="text-sm text-gray-600 mb-3">Your main focus during transition</p>
            <div className="space-y-3">
              {goalOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${selectedGoal === option.value
                      ? 'border-black bg-black bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-400'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={option.value}
                    checked={selectedGoal === option.value}
                    onChange={(e) => setSelectedGoal(e.target.value as TransitionGoal)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="ml-3 font-medium text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Secondary Goals */}
          <section>
            <h3 className="text-lg font-bold mb-2">Secondary Goals (Optional)</h3>
            <p className="text-sm text-gray-600 mb-3">Select additional areas you want to focus on</p>
            <div className="space-y-3">
              {goalOptions
                .filter((option) => option.value !== selectedGoal)
                .map((option) => (
                  <label
                    key={option.value}
                    className={`
                      flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                      ${secondaryGoals.includes(option.value)
                        ? 'border-black bg-black bg-opacity-5'
                        : 'border-gray-200 hover:border-gray-400'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={secondaryGoals.includes(option.value)}
                      onChange={() => handleToggleSecondaryGoal(option.value)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="ml-3 font-medium text-gray-900">{option.label}</span>
                  </label>
                ))}
            </div>
          </section>

          <section className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-900 mb-2">Current Settings</h4>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Primary Goal:</strong> {data.goal && getGoalLabel(data.goal)}</p>
              {data.location && <p><strong>Location:</strong> {data.location}</p>}
              {data.secondaryGoals && data.secondaryGoals.length > 0 && (
                <p><strong>Secondary Goals:</strong> {data.secondaryGoals.map(getGoalLabel).join(', ')}</p>
              )}
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-1">Error</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isReconstructing}
              className="flex-1 py-3 border-2 border-black text-black font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReconstruct}
              disabled={isReconstructing || !hasChanges}
              className="flex-1 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isReconstructing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Reconstructing...
                </>
              ) : (
                'Reconstruct Plan'
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
