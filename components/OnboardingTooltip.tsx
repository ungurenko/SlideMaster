import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { OnboardingStep } from '../hooks/useOnboarding';

interface OnboardingTooltipProps {
  step: OnboardingStep;
  currentStep: OnboardingStep;
  children: React.ReactNode;
  onNext: () => void;
  onSkip: () => void;
}

const STEP_CONTENT: Record<Exclude<OnboardingStep, null>, { title: string; description: string; stepNumber: number }> = {
  quickStyles: {
    title: 'Выбери стиль',
    description: 'Начни с выбора готового стиля — это задаст общий вид твоей карусели',
    stepNumber: 1,
  },
  slides: {
    title: 'Управляй слайдами',
    description: 'Здесь можно добавить, дублировать или удалить слайды',
    stepNumber: 2,
  },
  export: {
    title: 'Экспортируй результат',
    description: 'Когда карусель готова — скачай её в HD качестве',
    stepNumber: 3,
  },
};

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  step,
  currentStep,
  children,
  onNext,
  onSkip,
}) => {
  const isActive = step === currentStep && currentStep !== null;

  if (!isActive || !step) {
    return <>{children}</>;
  }

  const content = STEP_CONTENT[step];
  const totalSteps = Object.keys(STEP_CONTENT).length;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={isActive}>
        <TooltipTrigger asChild>
          <div className="relative">
            {/* Pulse ring animation */}
            <div className="absolute -inset-2 rounded-2xl bg-[#9CAF88]/20 animate-pulse pointer-events-none" />
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="start"
          sideOffset={16}
          className="w-72 p-0 bg-white border border-[#E5E0D8] shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="p-4">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    num <= content.stepNumber ? 'bg-[#9CAF88]' : 'bg-[#E5E0D8]'
                  }`}
                />
              ))}
              <span className="text-[10px] text-[#8C847C] ml-1 font-medium">
                {content.stepNumber} / {totalSteps}
              </span>
            </div>

            {/* Content */}
            <h4 className="font-bold text-[#333] text-sm mb-1">
              {content.title}
            </h4>
            <p className="text-xs text-[#6B6054] leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex border-t border-[#F0EBE5]">
            <button
              onClick={onSkip}
              className="flex-1 px-4 py-2.5 text-xs text-[#8C847C] hover:bg-[#F9F9F9] transition-colors"
            >
              Пропустить
            </button>
            <button
              onClick={onNext}
              className="flex-1 px-4 py-2.5 text-xs font-bold text-[#9CAF88] hover:bg-[#F9F9F9] border-l border-[#F0EBE5] transition-colors"
            >
              Далее →
            </button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
