import { useEffect, useState } from 'react';
import { Clock, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import type { PulsePrompt, UrgencyLevel } from '../../types';
import { usePulseStore } from '../../store/pulseStore';

interface PulseCardProps {
  prompt: PulsePrompt;
}

const urgencyConfig: Record<
  UrgencyLevel,
  { color: string; bgColor: string; icon: any; gradient: string }
> = {
  critical: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    icon: Zap,
    gradient: 'from-red-500 to-red-600',
  },
  high: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    icon: TrendingUp,
    gradient: 'from-orange-500 to-orange-600',
  },
  medium: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    icon: Clock,
    gradient: 'from-yellow-500 to-yellow-600',
  },
  low: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    icon: Target,
    gradient: 'from-blue-500 to-blue-600',
  },
};

export default function PulseCard({ prompt }: PulseCardProps) {
  const { markPromptViewed, executePrompt } = usePulseStore();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const config = urgencyConfig[prompt.urgency];
  const Icon = config.icon;

  useEffect(() => {
    if (!prompt.viewed) {
      markPromptViewed(prompt.id);
    }

    const updateTimer = () => {
      const remaining = Math.max(0, prompt.expiresAt.getTime() - Date.now());
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [prompt, markPromptViewed]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExecute = async () => {
    if (isExecuting || prompt.executed) return;

    setIsExecuting(true);
    await executePrompt(prompt.id);
    setIsExecuting(false);
  };

  if (prompt.executed) {
    return (
      <div className="border border-white/10 rounded-2xl bg-slate-800/40 p-6 opacity-60">
        <div className="flex items-center gap-2 text-gray-500 mb-3">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-semibold">Executed</span>
        </div>
        <p className="text-sm text-gray-400">
          {prompt.interpretation?.title} - Trade submitted to Thetanuts
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-2xl bg-slate-800/40 p-6 hover:bg-slate-800/60 hover:border-emerald-500/30 will-change-transform transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bgColor}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`font-semibold text-sm uppercase tracking-wide ${config.color}`}>
            {prompt.type.replace('_', ' ')}
          </span>
        </div>
        <div className={`flex items-center gap-2 font-mono font-bold text-sm ${config.color}`}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">
        {prompt.interpretation?.title}
      </h3>

      {/* Why Now */}
      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
        {prompt.interpretation?.whyNow}
      </p>

      {/* Risk/Reward */}
      <div className="border border-white/10 rounded-xl bg-slate-900/40 p-4 mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Max Gain</span>
          <span className="font-bold text-emerald-400">
            +${prompt.strategy.maxGain}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Max Loss</span>
          <span className="font-bold text-red-400">
            -${prompt.strategy.maxLoss}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
          <span className="text-gray-500">Confidence</span>
          <span className="font-medium text-white">
            {Math.round(prompt.confidence * 100)}%
          </span>
        </div>
      </div>

      {/* Outcome */}
      <div className="text-xs text-gray-500 mb-4 p-3 rounded-lg bg-slate-900/40">
        <span className="font-semibold text-gray-400">Outcome:</span> {prompt.interpretation?.outcomeExplanation}
      </div>

      {/* Urgency Reason */}
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <span className="text-gray-400">{prompt.interpretation?.urgencyReason}</span>
      </div>

      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={isExecuting || timeRemaining < 1000}
        className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-gradient-to-r ${config.gradient}
          hover:shadow-lg
          active:scale-95
        `}
      >
        {isExecuting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            EXECUTING...
          </span>
        ) : (
          prompt.interpretation?.suggestedAction || 'EXECUTE TRADE'
        )}
      </button>

      {/* Footer */}
      <div className="text-xs text-gray-500 text-center mt-3">
        Via Thetanuts OptionBook
      </div>
    </div>
  );
}
