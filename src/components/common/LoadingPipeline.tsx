import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Sparkles, Cpu } from 'lucide-react';
import { AIProcessingStep } from '../../services/aiService';
import { cn } from '../../utils';

interface LoadingPipelineProps {
  steps: AIProcessingStep[];
  onComplete?: () => void;
  title?: string;
  subtitle?: string;
}

export const LoadingPipeline: React.FC<LoadingPipelineProps> = ({
  steps: initialSteps,
  onComplete,
  title = 'AI Verification & Compliance Engine Ingestion',
  subtitle = 'Executing deep neural layout parsing, optical character recognition & clause extraction',
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  useEffect(() => {
    let currentIdx = 0;
    const totalSteps = initialSteps.length;

    const runNextStep = () => {
      if (currentIdx < totalSteps) {
        setCurrentStepIndex(currentIdx);
        const calcProgress = Math.min(Math.round(((currentIdx + 1) / totalSteps) * 100), 98);
        setProgress(calcProgress);

        const currentStep = initialSteps[currentIdx];
        const timer = setTimeout(() => {
          currentIdx++;
          runNextStep();
        }, currentStep.durationMs || 500);

        return timer;
      } else {
        setProgress(100);
        const completeTimer = setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
        return completeTimer;
      }
    };

    const timerId = runNextStep();
    return () => clearTimeout(timerId);
  }, [initialSteps, onComplete]);

  return (
    <div className="enterprise-card p-8 max-w-3xl mx-auto shadow-enterprise border-blue-100/80">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md shadow-blue-950/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{title}</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                Active Process
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-blue-900 font-mono tracking-tight">{progress}%</div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Analysis Complete</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="my-6">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {initialSteps.map((step, idx) => {
          const isDone = idx < currentStepIndex || progress === 100;
          const isCurrent = idx === currentStepIndex && progress < 100;
          const isPending = idx > currentStepIndex && progress < 100;

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-xl border transition-all duration-200',
                isDone && 'bg-emerald-50/40 border-emerald-100 text-slate-800',
                isCurrent && 'bg-blue-50/70 border-blue-200 shadow-sm text-blue-950 ring-1 ring-blue-500/20',
                isPending && 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-blue-700 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div>
                  <p className={cn('text-xs font-semibold', isCurrent ? 'text-blue-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-500')}>
                    {step.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{step.detail}</p>
                </div>
              </div>

              <div>
                {isDone ? (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                ) : isCurrent ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Processing...
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Queued</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
