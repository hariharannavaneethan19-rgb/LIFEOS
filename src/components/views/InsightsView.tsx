import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Brain,
  Link2,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const {
    aiInsight,
    lifeScoreBreakdown,
    refreshAiInsights,
    isGeneratingAi,
    setIsAiCoachOpen,
    finance,
    health,
  } = useLifeOS();

  const deltas = [
    { label: 'Sleep Duration', change: '+12%', positive: true, detail: 'Average 7.5h vs 6.7h prior week' },
    { label: 'Workout Volume', change: '+18%', positive: true, detail: '4 sessions logged vs 3 last week' },
    { label: 'Savings Rate', change: '+9%', positive: true, detail: '45% achieved this month' },
    { label: 'Discretionary Dining', change: '-6%', positive: true, detail: 'Home meal prep reduced restaurant bills' },
    { label: 'Habit Consistency', change: '+14%', positive: true, detail: 'Core anchors maintained at 91%' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17171F] dark:text-[#F3F4F6] tracking-tight">
              Life Analytics & AI
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6C63FF]/15 text-[#6C63FF] uppercase tracking-wider">
              Decision Support
            </span>
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#9CA3AF]">
            Cross-domain patterns, delta shifts & predictive recommendations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshAiInsights()}
            disabled={isGeneratingAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#15151F] border border-black/[0.08] dark:border-white/[0.08] text-xs font-semibold text-[#17171F] dark:text-[#F3F4F6] hover:border-[#6C63FF] transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin text-[#6C63FF]' : ''}`} />
            <span>{isGeneratingAi ? 'Analyzing...' : 'Refresh AI Analysis'}</span>
          </button>

          <button
            onClick={() => setIsAiCoachOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6C63FF] hover:bg-[#5851EA] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat with AI</span>
          </button>
        </div>
      </div>

      {/* 1. WHAT CHANGED? (Prompt Section 39 Vision) */}
      <div className="bg-white dark:bg-[#15151F] rounded-2xl p-6 border border-black/[0.06] dark:border-white/[0.06] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-[#17171F] dark:text-[#F3F4F6]">
              What Changed?
            </h2>
            <p className="text-xs text-[#71717A]">
              Comparative shifts against prior 30-day baseline
            </p>
          </div>
          <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full">
            Composite +4.2%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {deltas.map((d, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#F7F7FB] dark:bg-[#0B0B12]/50 border border-black/[0.04] dark:border-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#17171F] dark:text-[#F3F4F6]">
                  {d.label}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    d.positive
                      ? 'text-[#22C55E] bg-[#22C55E]/10'
                      : 'text-[#EF4444] bg-[#EF4444]/10'
                  }`}
                >
                  {d.change}
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] mt-1.5">{d.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. THE BIG DIFFERENTIATOR: Cross-Domain Correlation Engine (Prompt Section 15) */}
      <div className="bg-white dark:bg-[#15151F] rounded-2xl p-6 border border-black/[0.06] dark:border-white/[0.06] shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="p-1.5 rounded-lg bg-[#6C63FF]/15 text-[#6C63FF]">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-[#17171F] dark:text-[#F3F4F6]">
              The Big Differentiator · Cross-Domain Correlations
            </h2>
            <p className="text-xs text-[#71717A]">
              Revealing hidden causal links connecting Sleep, Exercise, and Financial Discipline
            </p>
          </div>
        </div>

        {/* Visual Flow Representation */}
        <div className="mt-4 p-4 rounded-xl bg-[#F7F7FB] dark:bg-[#0B0B12]/70 border border-black/[0.04] dark:border-white/[0.04] overflow-x-auto">
          <div className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-2">
            Identified Life Pattern
          </div>
          <div className="flex items-center gap-2 min-w-max text-xs font-semibold">
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15151F] border border-black/[0.06] dark:border-white/[0.06] text-[#8B5CF6]">
              Sleep &lt; 7h
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15151F] border border-black/[0.06] dark:border-white/[0.06] text-[#F59E0B]">
              Energy Dips
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15151F] border border-black/[0.06] dark:border-white/[0.06] text-[#EF4444]">
              Workouts Skipped (-32%)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15151F] border border-black/[0.06] dark:border-white/[0.06] text-amber-600">
              Convenience Dining (+24%)
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#71717A]" />
            <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#15151F] border border-[#22C55E]/40 text-[#22C55E] font-bold">
              Savings Rate Decline
            </div>
          </div>
        </div>

        {/* Detected Patterns */}
        <div className="space-y-2.5 mt-4">
          {(aiInsight?.correlations || []).map((corr, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF]/5 to-transparent border border-[#6C63FF]/15 text-xs text-[#17171F] dark:text-[#F3F4F6] flex items-start gap-2.5"
            >
              <div className="p-1 rounded bg-[#6C63FF] text-white mt-0.5">
                <Brain className="w-3 h-3" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold text-[#6C63FF]">Pattern {idx + 1}: </span>
                {corr}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#71717A] mt-3 italic">
          *Note: Patterns reflect statistical correlations within your personal historical logs, not medical or financial certainty.
        </p>
      </div>

      {/* 3. STRENGTHS & OPPORTUNITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-white dark:bg-[#15151F] rounded-2xl p-5 border border-black/[0.06] dark:border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#17171F] dark:text-[#F3F4F6]">
              Key Strengths This Week
            </h3>
          </div>
          <ul className="space-y-2.5 mt-3">
            {(aiInsight?.strengths || []).map((s, i) => (
              <li key={i} className="text-xs text-[#71717A] dark:text-[#9CA3AF] flex items-start gap-2">
                <span className="text-[#22C55E] font-bold mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-white dark:bg-[#15151F] rounded-2xl p-5 border border-black/[0.06] dark:border-white/[0.06] shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#17171F] dark:text-[#F3F4F6]">
              Highest-Leverage Opportunities
            </h3>
          </div>
          <ul className="space-y-2.5 mt-3">
            {(aiInsight?.opportunities || []).map((opp, i) => (
              <li key={i} className="text-xs text-[#71717A] dark:text-[#9CA3AF] flex items-start gap-2">
                <span className="text-[#F59E0B] font-bold mt-0.5">→</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. TODAY'S FOCAL ACTIONS */}
      <div className="bg-gradient-to-r from-[#6C63FF]/10 to-[#3B82F6]/10 rounded-2xl p-6 border border-[#6C63FF]/20 shadow-sm">
        <h3 className="text-sm uppercase tracking-wider font-extrabold text-[#6C63FF] mb-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4 fill-[#6C63FF]" />
          Today's Recommended Focus
        </h3>
        <p className="text-xs text-[#71717A] dark:text-[#9CA3AF] mb-4">
          Actions synthesized by the AI Layer to elevate your composite Life Score:
        </p>

        <div className="space-y-2">
          {(aiInsight?.suggestedFocus || []).map((focusItem, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/90 dark:bg-[#15151F]/90 border border-black/[0.06] dark:border-white/[0.06] text-xs font-semibold text-[#17171F] dark:text-[#F3F4F6] flex items-center gap-3 shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#6C63FF] text-white flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </div>
              <span>{focusItem}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
