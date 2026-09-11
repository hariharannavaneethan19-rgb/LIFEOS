import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { RecommendedGoal } from '../../types';
import {
  Sparkles,
  RefreshCw,
  Plus,
  Check,
  TrendingUp,
  Clock,
  Target,
  Brain,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AiGoalRecommendationsProps {
  compact?: boolean;
}

export const AiGoalRecommendations: React.FC<AiGoalRecommendationsProps> = ({ compact = false }) => {
  const {
    recommendedGoals,
    isRecommendingGoals,
    fetchGoalRecommendations,
    acceptRecommendedGoal,
    dismissRecommendedGoal,
    health,
    finance,
    habits,
    lifeScoreBreakdown,
  } = useLifeOS();

  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);

  const handleAccept = (goal: RecommendedGoal) => {
    setAcceptedId(goal.id);
    setTimeout(() => {
      acceptRecommendedGoal(goal);
      setAcceptedId(null);
    }, 400);
  };

  const getCategoryColor = (cat: RecommendedGoal['category']) => {
    switch (cat) {
      case 'fitness':
        return '#FF5C7A';
      case 'finance':
        return '#4D8DFF';
      case 'habits':
        return '#32D583';
      case 'productivity':
        return '#FF8A3D';
      default:
        return '#A875FF';
    }
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl sm:rounded-3xl p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#C8FF00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#222222] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8FF00]/15 text-[#C8FF00] border border-[#C8FF00]/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C8FF00]" />
              LIFEOS AI Intelligence
            </span>
            <span className="text-[11px] text-[#757575] font-medium hidden sm:inline">
              Multi-domain synthesis
            </span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Recommended Goals
          </h2>
          <p className="text-xs text-[#757575] mt-1 max-w-xl">
            Biometric and financial telemetry synthesized to formulate high-leverage milestones with transparent data reasoning.
          </p>
        </div>

        <button
          onClick={() => fetchGoalRecommendations()}
          disabled={isRecommendingGoals}
          className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] border border-[#222222] hover:border-[#C8FF00] text-xs font-bold text-white hover:text-[#C8FF00] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRecommendingGoals ? 'animate-spin text-[#C8FF00]' : ''}`} />
          <span>{isRecommendingGoals ? 'Analyzing Telemetry...' : 'Regenerate Recommendations'}</span>
        </button>
      </div>

      {/* Recommendation Cards Grid */}
      <div className={`mt-6 grid grid-cols-1 ${compact ? 'gap-3.5' : 'md:grid-cols-2 gap-4'} relative z-10`}>
        {(!recommendedGoals || recommendedGoals.length === 0) && (
          <div className="col-span-full py-10 text-center text-[#757575]">
            <Brain className="w-8 h-8 text-[#C8FF00] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-white">All current recommendations adopted!</p>
            <p className="text-xs mt-1">Tap "Regenerate Recommendations" to analyze latest telemetry.</p>
          </div>
        )}

        {(recommendedGoals || []).map((goal) => {
          const categoryColor = goal.colorAccent || getCategoryColor(goal.category);
          const isJustAccepted = acceptedId === goal.id;

          return (
            <div
              key={goal.id}
              className={`rounded-2xl p-5 sm:p-6 bg-[#000000] border transition-all duration-300 flex flex-col justify-between group ${
                isJustAccepted
                  ? 'border-[#C8FF00] bg-[#C8FF00]/5 scale-[0.98]'
                  : 'border-[#222222] hover:border-[#444444]'
              }`}
            >
              <div>
                {/* Category Pill & Score Impact */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: `${categoryColor}18`,
                        color: categoryColor,
                        border: `1px solid ${categoryColor}40`,
                      }}
                    >
                      {goal.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#757575] font-semibold">
                      <Clock className="w-3 h-3" />
                      {goal.timeframe}
                    </span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#C8FF00]/15 text-[#C8FF00] text-[10px] font-black tracking-wider uppercase border border-[#C8FF00]/30 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{goal.scoreImpact} Score
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                  {goal.title}
                </h3>

                {/* Target Metric Badge */}
                <div className="mt-3 flex items-baseline gap-2 text-xs bg-[#111111] px-3 py-2 rounded-xl border border-[#222222]">
                  <span className="text-[#757575] font-medium">Target:</span>
                  <span className="font-bold text-white tabular-nums">
                    {goal.unit === 'Rs.' || goal.unit.includes('Rs')
                      ? `Rs. ${goal.targetValue.toLocaleString()}`
                      : `${goal.targetValue} ${goal.unit}`}
                  </span>
                  <span className="text-[#757575] text-[11px] ml-auto">
                    Baseline: {goal.unit === 'Rs.' || goal.unit.includes('Rs') ? `Rs. ${goal.currentValue.toLocaleString()}` : `${goal.currentValue} ${goal.unit}`}
                  </span>
                </div>

                {/* Data Reasoning Section (The AI explanation) */}
                <div className="mt-3.5 p-3.5 rounded-xl bg-[#161616] border border-[#262626]">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#C8FF00] uppercase tracking-wider mb-1">
                    <Brain className="w-3.5 h-3.5" />
                    <span>AI Reasoning</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                    {goal.reasoning}
                  </p>

                  {goal.actionPlan && (
                    <div className="mt-2 pt-2 border-t border-[#262626] flex items-start gap-1.5 text-[11px]">
                      <Zap className="w-3 h-3 text-[#C8FF00] shrink-0 mt-0.5" />
                      <span className="text-[#A8D900]">
                        <strong className="text-white">Action:</strong> {goal.actionPlan}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-[#222222] flex items-center justify-between gap-3">
                <button
                  onClick={() => dismissRecommendedGoal(goal.id)}
                  className="text-xs text-[#757575] hover:text-zinc-400 font-semibold px-2 py-1 transition-colors"
                >
                  Dismiss
                </button>

                <button
                  onClick={() => handleAccept(goal)}
                  disabled={isJustAccepted}
                  className="flex-1 sm:flex-initial py-2.5 px-5 rounded-xl bg-[#C8FF00] hover:bg-[#A8D900] active:scale-[0.98] text-black font-display text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#C8FF00]/15"
                >
                  {isJustAccepted ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Goals</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Accept & Add Goal</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
