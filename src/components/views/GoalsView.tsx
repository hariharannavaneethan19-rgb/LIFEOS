import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { AiGoalRecommendations } from '../goals/AiGoalRecommendations';
import { GoalItem } from '../../types';
import {
  Target,
  Plus,
  ChevronLeft,
  Calendar,
  Sparkles,
  TrendingUp,
  Trash2,
  CheckCircle,
  Edit2,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, updateGoalProgress, deleteGoal, editGoal, openAddModal, setActiveTab } = useLifeOS();

  const [editingGoal, setEditingGoal] = useState<GoalItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCurrent, setEditCurrent] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  // Helper to format values nicely
  const formatVal = (val: number, unit: string) => {
    if (unit === 'Rs.' || unit.includes('Rs')) {
      if (val >= 100000) return `Rs. ${(val / 1000).toFixed(0)}K`;
      if (val >= 1000) return `Rs. ${(val / 1000).toFixed(1)}K`;
      return `Rs. ${val.toLocaleString()}`;
    }
    return `${val} ${unit}`;
  };

  const handleOpenEdit = (goal: GoalItem) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditCurrent(String(goal.currentValue));
    setEditTarget(String(goal.targetValue));
    setEditUnit(goal.unit);
    setEditDeadline(goal.deadline || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal) return;

    editGoal(editingGoal.id, {
      title: editTitle.trim() || editingGoal.title,
      currentValue: Math.max(0, parseFloat(editCurrent) || 0),
      targetValue: Math.max(1, parseFloat(editTarget) || 1),
      unit: editUnit.trim() || editingGoal.unit,
      deadline: editDeadline.trim() || undefined,
    });
    setEditingGoal(null);
  };

  return (
    <div className="space-y-7 pb-28 animate-fade-in text-white selection:bg-[#C8FF00] selection:text-black">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-xl bg-[#111111] border border-[#222222] text-[#757575] hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              GOALS & HORIZONS
            </h1>
            <p className="text-xs text-[#757575] font-medium">
              Data-grounded milestones, active tracking, and AI synthesis
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddModal('goal')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#000000] border border-[#222222] hover:bg-[#C8FF00] hover:text-black hover:border-[#C8FF00] text-white text-xs font-bold transition-all shadow-md active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Goal</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. AI RECOMMENDED GOALS (Personalized Analysis Section) */}
      {/* ========================================================= */}
      <AiGoalRecommendations />

      {/* ========================================================= */}
      {/* 2. ACTIVE GOALS LIST */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A875FF]" />
            <h2 className="font-display text-lg font-bold text-white uppercase tracking-tight">
              Active Milestones ({(goals || []).length})
            </h2>
          </div>
          <span className="text-xs text-[#757575] font-medium">
            Tap edit icon to fix incorrect numbers or delete
          </span>
        </div>

        {goals.length === 0 ? (
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-12 text-center">
            <Target className="w-10 h-10 text-[#757575] mx-auto mb-3" />
            <p className="text-sm text-[#757575] font-semibold">No goals active right now.</p>
            <button
              onClick={() => openAddModal('goal')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#C8FF00] text-black font-bold text-xs hover:bg-[#b2e600] transition-colors"
            >
              Set First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(goals || []).map((goal) => {
              let progressPct = 0;
              if (goal.category === 'fitness' && goal.title.toLowerCase().includes('weight')) {
                const startWeight = 80;
                const lost = startWeight - goal.currentValue;
                const totalToLose = startWeight - goal.targetValue;
                progressPct = Math.min(100, Math.max(0, Math.round((lost / totalToLose) * 100)));
              } else {
                progressPct = goal.targetValue > 0
                  ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                  : 0;
              }

              const accentColor = goal.colorAccent || '#A875FF';

              return (
                <div
                  key={goal.id}
                  className="bg-[#111111] rounded-2xl p-5 sm:p-6 border border-[#222222] hover:border-[#333333] shadow-lg relative overflow-hidden group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: accentColor }}
                          />
                          <h3 className="font-display text-base font-bold text-white tracking-tight">
                            {goal.title}
                          </h3>
                        </div>
                        {goal.deadline && (
                          <div className="flex items-center gap-1 text-[11px] text-[#757575] mt-1 font-medium">
                            <Calendar className="w-3 h-3" />
                            <span>Target: {goal.deadline}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right flex items-center gap-2">
                        <span className="font-display text-2xl font-black text-white tabular-nums">
                          {progressPct}%
                        </span>
                        <button
                          onClick={() => handleOpenEdit(goal)}
                          className="p-1.5 rounded-lg text-[#757575] hover:text-white hover:bg-white/5 transition-colors"
                          title="Edit or fix this goal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Numbers */}
                    <div className="mt-4 flex justify-between items-baseline text-xs bg-[#000000] px-3.5 py-2 rounded-xl border border-[#222222]">
                      <span className="font-bold text-white tabular-nums">
                        {formatVal(goal.currentValue, goal.unit)}
                      </span>
                      <span className="text-[#757575]">
                        Target: {formatVal(goal.targetValue, goal.unit)}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-[#000000] h-2.5 rounded-full overflow-hidden border border-[#222222]">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(5, progressPct)}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Increment Controls & Remove */}
                  <div className="mt-5 pt-3.5 border-t border-[#222222] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const delta = goal.unit.includes('Rs') ? 5000 : goal.unit === 'kg' ? -0.2 : 1;
                          updateGoalProgress(goal.id, delta);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#000000] hover:bg-[#C8FF00] hover:text-black text-white border border-[#222222] transition-colors active:scale-[0.98]"
                      >
                        {goal.unit.includes('Rs') ? '+Rs. 5K' : goal.unit === 'kg' ? '-0.2 kg' : '+1 ' + goal.unit}
                      </button>
                      <button
                        onClick={() => handleOpenEdit(goal)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#757575] hover:text-white border border-[#222222] hover:border-[#444444] transition-colors"
                        title="Set exact current value"
                      >
                        Fix / Set Exact
                      </button>
                    </div>

                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-[#757575] hover:text-red-400 transition-colors"
                      title="Remove Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT GOAL MODAL */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111111] border border-[#222222] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">
                Fix / Edit Goal
              </h3>
              <button
                onClick={() => setEditingGoal(null)}
                className="p-1 rounded-lg text-[#757575] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#000000] text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                    Current Progress Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editCurrent}
                    onChange={(e) => setEditCurrent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#000000] text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                    Target Milestone Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editTarget}
                    onChange={(e) => setEditTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#000000] text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                    Unit (e.g. Rs., kg, books)
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#000000] text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                    Deadline (e.g. Q4 2026)
                  </label>
                  <input
                    type="text"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#222222] bg-[#000000] text-sm text-white focus:outline-none focus:border-[#C8FF00]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteGoal(editingGoal.id);
                    setEditingGoal(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Goal</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGoal(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#222222] text-xs font-bold text-[#757575] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#C8FF00] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#b2e600] transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
