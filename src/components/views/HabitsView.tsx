import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { HabitItem } from '../../types';
import {
  CheckSquare,
  Flame,
  Plus,
  ChevronLeft,
  Trash2,
  Calendar,
  Sparkles,
  Zap,
  Edit2,
  X,
  Check,
} from 'lucide-react';

export const HabitsView: React.FC = () => {
  const { habits, toggleHabit, deleteHabit, editHabit, toggleHabitDay, openAddModal, setActiveTab } = useLifeOS();

  const [editingHabit, setEditingHabit] = useState<HabitItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<HabitItem['category']>('health');
  const [editStreak, setEditStreak] = useState('0');

  const completedCount = habits.filter((h) => h.completedToday).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streakDays), 0);

  const daysHeader = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handleOpenEdit = (h: HabitItem) => {
    setEditingHabit(h);
    setEditTitle(h.title);
    setEditCategory(h.category);
    setEditStreak(String(h.streakDays));
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabit) return;

    editHabit(editingHabit.id, {
      title: editTitle.trim() || editingHabit.title,
      category: editCategory,
      streakDays: Math.max(0, parseInt(editStreak) || 0),
    });
    setEditingHabit(null);
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-lg border border-black/[0.08] dark:border-white/[0.08] text-[#71717A] hover:text-[#17171F] dark:hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17171F] dark:text-[#F3F4F6] tracking-tight">
              Habits & Routines
            </h1>
            <p className="text-xs text-[#71717A] dark:text-[#9CA3AF]">
              Compound Daily Actions · Zero Friction
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddModal('habit')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6C63FF] hover:bg-[#5851EA] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#15151F] rounded-2xl p-4 border border-black/[0.06] dark:border-white/[0.06] shadow-sm text-center">
          <div className="text-xs text-[#71717A]">Completed Today</div>
          <div className="text-2xl font-extrabold text-[#17171F] dark:text-[#F3F4F6] mt-1 tabular-nums">
            {completedCount} / {habits.length}
          </div>
          <div className="text-[11px] text-[#22C55E] font-semibold mt-0.5">{completionRate}% Done</div>
        </div>

        <div className="bg-white dark:bg-[#15151F] rounded-2xl p-4 border border-black/[0.06] dark:border-white/[0.06] shadow-sm text-center">
          <div className="text-xs text-[#71717A]">Best Active Streak</div>
          <div className="text-2xl font-extrabold text-[#F59E0B] mt-1 flex items-center justify-center gap-1 tabular-nums">
            <Flame className="w-5 h-5 fill-[#F59E0B]" />
            <span>{longestStreak}</span>
          </div>
          <div className="text-[11px] text-[#71717A] mt-0.5">Consecutive Days</div>
        </div>

        <div className="bg-white dark:bg-[#15151F] rounded-2xl p-4 border border-black/[0.06] dark:border-white/[0.06] shadow-sm text-center">
          <div className="text-xs text-[#71717A]">Consistency</div>
          <div className="text-2xl font-extrabold text-[#6C63FF] mt-1 tabular-nums">
            {completionRate > 0 ? `${completionRate}%` : '0%'}
          </div>
          <div className="text-[11px] text-[#6C63FF] font-semibold mt-0.5">Tracked Habits</div>
        </div>
      </div>

      {/* TODAY'S HABITS CHECKLIST & 7-DAY STREAKS */}
      <div className="bg-white dark:bg-[#15151F] rounded-2xl p-6 border border-black/[0.06] dark:border-white/[0.06] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06] gap-2">
          <div>
            <h2 className="text-sm uppercase tracking-wider font-bold text-[#17171F] dark:text-[#F3F4F6]">
              Habits Checklist & Day History
            </h2>
            <p className="text-[11px] text-[#71717A]">
              Tap checkboxes to complete, click any day letter to toggle, or use pencil to edit/remove
            </p>
          </div>
          <span className="text-xs text-[#71717A]">{habits.length} habits</span>
        </div>

        {habits.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[#71717A]">No habits tracked yet.</p>
            <button
              onClick={() => openAddModal('habit')}
              className="mt-3 px-4 py-2 rounded-xl bg-[#6C63FF] text-white text-xs font-bold hover:bg-[#5851EA] transition-colors"
            >
              Add First Habit
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] mt-2">
            {(habits || []).map((habit) => (
              <div
                key={habit.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Checkbox and title */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      habit.completedToday
                        ? 'bg-[#22C55E] text-white shadow-xs scale-105'
                        : 'border-2 border-[#71717A]/40 hover:border-[#6C63FF]'
                    }`}
                  >
                    {habit.completedToday && <span className="text-xs font-extrabold">✓</span>}
                  </button>

                  <div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        habit.completedToday
                          ? 'line-through text-[#71717A] dark:text-[#9CA3AF]'
                          : 'text-[#17171F] dark:text-[#F3F4F6]'
                      }`}
                    >
                      {habit.title}
                    </span>
                    <div className="text-[11px] text-[#71717A] capitalize">
                      {habit.category} · {habit.streakDays} day streak
                    </div>
                  </div>
                </div>

                {/* Right: 7-Day Streak Indicators (M T W T F S S) & Action buttons */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center gap-1 bg-[#F7F7FB] dark:bg-[#0B0B12] p-1.5 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
                    {daysHeader.map((dayLabel, idx) => {
                      const isDone = habit.weekHistory[idx];
                      const isToday = idx === daysHeader.length - 1;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleHabitDay(habit.id, idx)}
                          title={`Click to toggle ${dayLabel}`}
                          className="flex flex-col items-center hover:scale-105 transition-transform"
                        >
                          <span className="text-[9px] font-bold text-[#71717A] mb-1">
                            {dayLabel}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone
                                ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                                : isToday
                                ? 'bg-black/[0.05] dark:bg-white/[0.05] text-[#71717A] border border-dashed border-black/[0.15] dark:border-white/[0.15]'
                                : 'text-zinc-400'
                            }`}
                          >
                            {isDone ? '✓' : '·'}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(habit)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      title="Edit habit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT HABIT MODAL */}
      {editingHabit && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#15151F] border border-black/[0.08] dark:border-white/[0.1] rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h3 className="text-base font-bold text-[#17171F] dark:text-white">
                Edit Habit
              </h3>
              <button
                onClick={() => setEditingHabit(null)}
                className="p-1 rounded-lg text-[#71717A] hover:text-[#17171F] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-[#71717A] uppercase mb-1">
                  Habit Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-sm text-[#17171F] dark:text-white focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#71717A] uppercase mb-1">
                  Category
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as HabitItem['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-white dark:bg-[#15151F] text-sm text-[#17171F] dark:text-white focus:outline-none focus:border-[#6C63FF]"
                >
                  <option value="health">Health & Body</option>
                  <option value="mind">Mind & Focus</option>
                  <option value="finance">Finance & Career</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#71717A] uppercase mb-1">
                  Active Streak (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={editStreak}
                  onChange={(e) => setEditStreak(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.02] dark:bg-white/[0.02] text-sm text-[#17171F] dark:text-white focus:outline-none focus:border-[#6C63FF]"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    deleteHabit(editingHabit.id);
                    setEditingHabit(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Habit</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingHabit(null)}
                    className="px-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-xs font-bold text-[#71717A] hover:text-[#17171F] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5851EA] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Habit</span>
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
