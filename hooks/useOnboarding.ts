import { useState, useEffect, useCallback } from 'react';

export type OnboardingStep = 'quickStyles' | 'slides' | 'export' | null;

const STORAGE_KEY = 'onboarding_completed';
const ONBOARDING_STEPS: OnboardingStep[] = ['quickStyles', 'slides', 'export'];

export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(null);
  const [isCompleted, setIsCompleted] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEY);
    if (!completed) {
      setIsCompleted(false);
      // Start onboarding after a short delay
      setTimeout(() => {
        setCurrentStep('quickStyles');
      }, 1000);
    }
  }, []);

  const nextStep = useCallback(() => {
    if (!currentStep) return;

    const currentIndex = ONBOARDING_STEPS.indexOf(currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(ONBOARDING_STEPS[currentIndex + 1]);
    } else {
      // Complete onboarding
      setCurrentStep(null);
      setIsCompleted(true);
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    setCurrentStep(null);
    setIsCompleted(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsCompleted(false);
    setCurrentStep('quickStyles');
  }, []);

  return {
    currentStep,
    isCompleted,
    nextStep,
    skipOnboarding,
    resetOnboarding,
  };
}
