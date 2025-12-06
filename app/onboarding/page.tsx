'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/lib/useOnboardingStore';
import { ProgressBar } from './components/ProgressBar';
import { StepName } from './components/StepName';
import { StepETS } from './components/StepETS';
import { StepBranch } from './components/StepBranch';
import { StepMOS } from './components/StepMOS';
import { StepGoal } from './components/StepGoal';
import { StepLocation } from './components/StepLocation';
import { StepDisability } from './components/StepDisability';
import { StepGIBill } from './components/StepGIBill';
import { StepDischargeType } from './components/StepDischargeType';
import { StepAwards } from './components/StepAwards';
import { Summary } from './components/Summary';

const TOTAL_STEPS = 11;

export default function OnboardingPage() {
  const { currentStep, nextStep, prevStep } = useOnboardingStore();
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  const handleNext = () => {
    setDirection('forward');
    nextStep();
  };

  const handleBack = () => {
    setDirection('backward');
    prevStep();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepName onNext={handleNext} />;
      case 1:
        return <StepETS onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <StepBranch onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <StepMOS onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <StepGoal onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <StepLocation onNext={handleNext} onBack={handleBack} />;
      case 6:
        return <StepDisability onNext={handleNext} onBack={handleBack} />;
      case 7:
        return <StepGIBill onNext={handleNext} onBack={handleBack} />;
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

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      
      <div className="flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <div key={currentStep}>
              {renderStep()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
