import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import {
  X,
  Activity,
  DollarSign,
  CheckSquare,
  Target,
  BookOpen,
  Plus,
  Droplets,
  Moon,
  Footprints,
  Flame,
  Calendar,
  Check,
} from 'lucide-react';
import { ExpenseItem, HabitItem, GoalItem } from '../types';

export const AddModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    addModalDefaultTab,
    selectedDate,
    dailyRecords,
    getDailyRecord,
    setWaterForDate,
    setWaterLimitForDate,
    setStepsForDate,
    setSleepForDate,
    setExerciseForDate,
    setWeightForDate,
    addTransaction,
    addIncome,
    addHabit,
    addGoal,
    addNote,
    finance,
    health,
  } = useLifeOS();

  const [activeSubTab, setActiveSubTab] = useState<'health' | 'finance' | 'habit' | 'goal' | 'note'>('health');

  // Date selection state for logging
  const [entryDate, setEntryDate] = useState<string>(selectedDate || '2026-09-07');

  // Health states
  const [waterInput, setWaterInput] = useState('0.25');
  const [waterLimitInput, setWaterLimitInput] = useState('2.5');
  const [weightInput, setWeightInput] = useState('72.4');
  const [stepsInput, setStepsInput] = useState('1500');
  const [sleepHoursInput, setSleepHoursInput] = useState('7');
  const [sleepMinsInput, setSleepMinsInput] = useState('30');
  const [exerciseMinsInput, setExerciseMinsInput] = useState('30');
  const [healthActionType, setHealthActionType] = useState<'water' | 'weight' | 'steps' | 'sleep' | 'exercise'>('water');

  // Finance states
  const [financeType, setFinanceType] = useState<'expense' | 'income'>('expense');
  const [financeTitle, setFinanceTitle] = useState('');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeCategory, setFinanceCategory] = useState<ExpenseItem['category']>('Food');

  // Habit states
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitItem['category']>('health');

  // Goal states
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<GoalItem['category']>('finance');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalUnit, setGoalUnit] = useState('Rs.');
  const [goalDeadline, setGoalDeadline] = useState('Dec 2026');

  // Note states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTag, setNoteTag] = useState('Daily Reflection');

  // Toast confirmation feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isAddModalOpen) {
      setActiveSubTab(addModalDefaultTab);
      setEntryDate(selectedDate || '2026-09-07');
      setFeedback(null);
      // Load current record for that date to prefill limits
      const rec = getDailyRecord(selectedDate || '2026-09-07');
      setWaterLimitInput(String(rec.waterTargetLiters || 2.5));
      if (rec.weightKg) setWeightInput(String(rec.weightKg));
    }
  }, [isAddModalOpen, addModalDefaultTab, selectedDate]);

  // When entryDate changes, update the target water limit field to match that date's stored limit
  useEffect(() => {
    const rec = getDailyRecord(entryDate);
    if (rec) {
      setWaterLimitInput(String(rec.waterTargetLiters || 2.5));
      if (rec.weightKg) setWeightInput(String(rec.weightKg));
    }
  }, [entryDate]);

  if (!isAddModalOpen) return null;

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback(null);
      setIsAddModalOpen(false);
    }, 1100);
  };

  const handleSaveHealth = (e: React.FormEvent) => {
    e.preventDefault();
    const existingRec = getDailyRecord(entryDate);

    if (healthActionType === 'water') {
      const addedWater = parseFloat(waterInput) || 0;
      const targetWater = parseFloat(waterLimitInput) || 2.5;
      const newTotal = Number(((existingRec?.waterLiters || 0) + addedWater).toFixed(2));
      setWaterForDate(entryDate, newTotal, targetWater);
      setWaterLimitForDate(entryDate, targetWater);
      showToast(`+${addedWater}L Logged for ${entryDate} (Limit: ${targetWater}L)`);
    } else if (healthActionType === 'weight') {
      const val = parseFloat(weightInput) || 72.4;
      setWeightForDate(entryDate, val);
      showToast(`Weight: ${val} kg for ${entryDate}`);
    } else if (healthActionType === 'steps') {
      const addedSteps = parseInt(stepsInput, 10) || 1000;
      const newSteps = (existingRec?.steps || 0) + addedSteps;
      setStepsForDate(entryDate, newSteps);
      showToast(`+${addedSteps.toLocaleString()} Steps for ${entryDate}`);
    } else if (healthActionType === 'sleep') {
      const h = parseInt(sleepHoursInput, 10) || 7;
      const m = parseInt(sleepMinsInput, 10) || 0;
      setSleepForDate(entryDate, h, m);
      showToast(`Sleep: ${h}h ${m}m for ${entryDate}`);
    } else if (healthActionType === 'exercise') {
      const addedMins = parseInt(exerciseMinsInput, 10) || 30;
      const newMins = (existingRec?.exerciseMinutes || 0) + addedMins;
      setExerciseForDate(entryDate, newMins);
      showToast(`+${addedMins}m Workout for ${entryDate}`);
    }
  };

  const handleSaveFinance = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(financeAmount);
    if (!amount || amount <= 0) return;

    if (financeType === 'expense') {
      const title = financeTitle.trim() || `${financeCategory} expense`;
      addTransaction(title, amount, financeCategory);
      showToast(`Expense: ${finance.currency} ${amount.toLocaleString()} added for ${entryDate}`);
    } else {
      addIncome(amount);
      showToast(`Income: ${finance.currency} ${amount.toLocaleString()} added`);
    }
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;
    addHabit(habitTitle.trim(), habitCategory);
    showToast(`New Habit "${habitTitle.trim()}" created`);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    const current = parseFloat(goalCurrent) || 0;
    const target = parseFloat(goalTarget) || 100;
    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      currentValue: current,
      targetValue: target,
      unit: goalUnit.trim() || '',
      deadline: goalDeadline.trim() || undefined,
      colorAccent: '#111111',
    });
    showToast(`Goal "${goalTitle.trim()}" created`);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    addNote(noteTitle.trim(), noteContent.trim(), noteTag);
    showToast(`Note logged for ${entryDate}`);
  };

  const isToday = entryDate === '2026-09-07';
  const isYesterday = entryDate === '2026-09-06';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#FFFFFF] text-[#111111] rounded-3xl border border-[#E5E5E5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#111111] text-[#C5FF00] flex items-center justify-center font-black text-sm">
              +
            </div>
            <div>
              <h2 className="text-base font-black text-[#111111] uppercase tracking-tight">
                Log Life Data
              </h2>
              <p className="text-xs text-[#7E7E7E]">
                Select date and record metrics with custom limits
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-1.5 rounded-full text-[#7E7E7E] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DATE SELECTION BAR */}
        <div className="bg-[#F5F5F5] px-6 py-3 border-b border-[#E5E5E5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#111111]" />
              <span className="text-xs font-black uppercase text-[#111111] tracking-wider">
                Target Date:
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setEntryDate('2026-09-07')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isToday
                    ? 'bg-[#111111] text-[#C5FF00] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#7E7E7E] hover:text-[#111111] border border-[#E5E5E5]'
                }`}
              >
                Today (Sep 7)
              </button>
              <button
                type="button"
                onClick={() => setEntryDate('2026-09-06')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  isYesterday
                    ? 'bg-[#111111] text-[#C5FF00] shadow-sm'
                    : 'bg-[#FFFFFF] text-[#7E7E7E] hover:text-[#111111] border border-[#E5E5E5]'
                }`}
              >
                Yesterday (Sep 6)
              </button>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#FFFFFF] border border-[#E5E5E5] text-[#111111] focus:outline-none focus:border-[#111111]"
                  title="Pick any custom date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E5E5] bg-[#FFFFFF] p-2 gap-1.5 overflow-x-auto text-xs font-bold">
          {[
            { id: 'health', label: 'Health & Water' },
            { id: 'finance', label: 'Money & Wealth' },
            { id: 'habit', label: 'Habits' },
            { id: 'goal', label: 'Goals' },
            { id: 'note', label: 'Reflection' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-full transition-all whitespace-nowrap text-center text-xs font-bold uppercase tracking-wider ${
                activeSubTab === tab.id
                  ? 'bg-[#111111] text-[#FFFFFF] shadow-sm'
                  : 'text-[#7E7E7E] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback notification */}
        {feedback && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#111111] text-[#C5FF00] text-xs font-bold text-center flex items-center justify-center gap-2 border border-[#C5FF00]/40">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          {/* HEALTH TAB */}
          {activeSubTab === 'health' && (
            <form onSubmit={handleSaveHealth} className="space-y-5">
              {/* Category sub-selector */}
              <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#F5F5F5] rounded-2xl border border-[#E5E5E5]">
                {[
                  { id: 'water', label: 'Water', icon: <Droplets className="w-3.5 h-3.5" /> },
                  { id: 'steps', label: 'Steps', icon: <Footprints className="w-3.5 h-3.5" /> },
                  { id: 'weight', label: 'Weight', icon: <Activity className="w-3.5 h-3.5" /> },
                  { id: 'sleep', label: 'Sleep', icon: <Moon className="w-3.5 h-3.5" /> },
                  { id: 'exercise', label: 'Workout', icon: <Flame className="w-3.5 h-3.5" /> },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setHealthActionType(item.id as any)}
                    className={`flex flex-col items-center py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                      healthActionType === item.id
                        ? 'bg-[#111111] text-[#C5FF00] shadow-sm'
                        : 'text-[#7E7E7E] hover:text-[#111111]'
                    }`}
                  >
                    {item.icon}
                    <span className="mt-1">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* WATER INPUT - WITH DATE-WISE WATER LIMIT */}
              {healthActionType === 'water' && (
                <div className="space-y-4">
                  {/* Current status for this date */}
                  <div className="p-3.5 rounded-2xl bg-[#F5F5F5] border border-[#E5E5E5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#7E7E7E] tracking-wider block">
                        Logged on {entryDate}:
                      </span>
                      <span className="text-xl font-black text-[#111111] tabular-nums">
                        {dailyRecords[entryDate]?.waterLiters ?? health.waterLiters} L
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-[#7E7E7E] tracking-wider block">
                        Daily Water Limit:
                      </span>
                      <span className="text-sm font-bold text-[#111111] tabular-nums">
                        {dailyRecords[entryDate]?.waterTargetLiters ?? 2.5} L
                      </span>
                    </div>
                  </div>

                  {/* 1. Water Intake Amount */}
                  <div>
                    <label className="block text-xs font-black uppercase text-[#111111] tracking-wider mb-2">
                      1. Add Water Intake (Liters)
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {['0.25', '0.50', '0.75', '1.00'].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => setWaterInput(val)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            waterInput === val
                              ? 'border-[#111111] bg-[#111111] text-[#C5FF00]'
                              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#111111] hover:border-[#111111]'
                          }`}
                        >
                          +{val} L
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.05"
                        value={waterInput}
                        onChange={(e) => setWaterInput(e.target.value)}
                        placeholder="Custom amount (e.g. 0.35)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                      />
                      <span className="text-xs font-bold text-[#7E7E7E]">Liters</span>
                    </div>
                  </div>

                  {/* 2. Daily Water Limit for This Date */}
                  <div className="pt-2 border-t border-[#E5E5E5]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-black uppercase text-[#111111] tracking-wider">
                        2. Daily Water Limit For {entryDate} (Liters)
                      </label>
                      <span className="text-[10px] text-[#7E7E7E] font-semibold">Stored per-day</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {['2.0', '2.5', '3.0', '3.5'].map((limit) => (
                        <button
                          type="button"
                          key={limit}
                          onClick={() => setWaterLimitInput(limit)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            waterLimitInput === limit
                              ? 'border-[#111111] bg-[#111111] text-[#C5FF00]'
                              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#7E7E7E] hover:text-[#111111] hover:border-[#111111]'
                          }`}
                        >
                          {limit} L Target
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={waterLimitInput}
                        onChange={(e) => setWaterLimitInput(e.target.value)}
                        placeholder="Custom limit (e.g. 2.7)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                      />
                      <span className="text-xs font-bold text-[#7E7E7E]">Goal</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEPS INPUT */}
              {healthActionType === 'steps' && (
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase text-[#111111] tracking-wider">
                    Add Steps Walked for {entryDate}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1000', '2500', '5000'].map((val) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setStepsInput(val)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          stepsInput === val
                            ? 'border-[#111111] bg-[#111111] text-[#C5FF00]'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#111111] hover:border-[#111111]'
                        }`}
                      >
                        +{parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="100"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    placeholder="Custom steps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
              )}

              {/* WEIGHT INPUT */}
              {healthActionType === 'weight' && (
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase text-[#111111] tracking-wider">
                    Record Body Weight (kg) for {entryDate}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-lg focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                    />
                    <span className="text-sm font-black text-[#111111]">KG</span>
                  </div>
                </div>
              )}

              {/* SLEEP INPUT */}
              {healthActionType === 'sleep' && (
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase text-[#111111] tracking-wider">
                    Record Sleep for {entryDate}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#7E7E7E] uppercase block mb-1">Hours</span>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={sleepHoursInput}
                        onChange={(e) => setSleepHoursInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#7E7E7E] uppercase block mb-1">Minutes</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={sleepMinsInput}
                        onChange={(e) => setSleepMinsInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXERCISE INPUT */}
              {healthActionType === 'exercise' && (
                <div className="space-y-4">
                  <label className="block text-xs font-black uppercase text-[#111111] tracking-wider">
                    Log Workout / Active Minutes for {entryDate}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['20', '30', '45', '60'].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setExerciseMinsInput(mins)}
                        className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                          exerciseMinsInput === mins
                            ? 'border-[#111111] bg-[#111111] text-[#C5FF00]'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#111111] hover:border-[#111111]'
                        }`}
                      >
                        {mins} mins
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    step="5"
                    value={exerciseMinsInput}
                    onChange={(e) => setExerciseMinsInput(e.target.value)}
                    placeholder="Workout duration (minutes)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-[#111111] font-bold text-sm focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-nike-black font-black uppercase tracking-wider text-xs shadow-md"
              >
                Save Health Data for {entryDate}
              </button>
            </form>
          )}

          {/* FINANCE TAB */}
          {activeSubTab === 'finance' && (
            <form onSubmit={handleSaveFinance} className="space-y-4">
              <div className="flex gap-2 p-1 bg-[#F5F5F5] rounded-xl border border-[#E5E5E5]">
                <button
                  type="button"
                  onClick={() => setFinanceType('expense')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    financeType === 'expense'
                      ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                      : 'text-[#7E7E7E]'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFinanceType('income')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    financeType === 'income'
                      ? 'bg-[#111111] text-[#C5FF00] shadow-xs'
                      : 'text-[#7E7E7E]'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Amount ({finance.currency})
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  required
                  value={financeAmount}
                  onChange={(e) => setFinanceAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-lg font-bold text-[#111111] focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Description / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Groceries, Gym shoes, Protein powder"
                  value={financeTitle}
                  onChange={(e) => setFinanceTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              {financeType === 'expense' && (
                <div>
                  <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Food', 'Transport', 'Shopping', 'Bills', 'Other'] as ExpenseItem['category'][]).map(
                      (cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setFinanceCategory(cat)}
                          className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                            financeCategory === cat
                              ? 'border-[#111111] bg-[#111111] text-[#FFFFFF]'
                              : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#7E7E7E] hover:text-[#111111]'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-nike-black font-black uppercase tracking-wider text-xs shadow-md"
              >
                Log Transaction for {entryDate}
              </button>
            </form>
          )}

          {/* HABIT TAB */}
          {activeSubTab === 'habit' && (
            <form onSubmit={handleSaveHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Habit Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10,000 steps daily, Morning meditation, Read 20 mins"
                  required
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Pillar / Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'health', label: 'Health & Fitness' },
                    { id: 'productivity', label: 'Productivity' },
                    { id: 'mindset', label: 'Mindset & Mental' },
                    { id: 'finance', label: 'Financial Discipline' },
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setHabitCategory(cat.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        habitCategory === cat.id
                          ? 'border-[#111111] bg-[#111111] text-[#FFFFFF]'
                          : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#7E7E7E] hover:text-[#111111]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-nike-black font-black uppercase tracking-wider text-xs shadow-md"
              >
                Create Habit Routine
              </button>
            </form>
          )}

          {/* GOAL TAB */}
          {activeSubTab === 'goal' && (
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Run 10k Marathon, Save Rs. 500,000, 15% Body Fat"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                    Current Progress
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="100"
                    required
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="Rs., km, kg, books"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                    Target Date / Horizon
                  </label>
                  <input
                    type="text"
                    placeholder="Dec 2026"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-nike-black font-black uppercase tracking-wider text-xs shadow-md"
              >
                Track New Milestone
              </button>
            </form>
          )}

          {/* NOTE TAB */}
          {activeSubTab === 'note' && (
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Subject / Heading
                </label>
                <input
                  type="text"
                  placeholder="e.g. Energy dip pattern, Weekly workout review"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7E7E7E] mb-1 uppercase tracking-wider">
                  Content / Log Entry
                </label>
                <textarea
                  rows={4}
                  placeholder="Record your notes, learnings, or observations..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] text-sm text-[#111111] font-medium focus:outline-none focus:border-[#111111] focus:bg-[#FFFFFF]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-nike-black font-black uppercase tracking-wider text-xs shadow-md"
              >
                Save Reflection for {entryDate}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
