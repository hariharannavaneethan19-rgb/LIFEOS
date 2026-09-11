import React, { useState, useEffect } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  User,
  Sliders,
  DollarSign,
  Moon,
  Sun,
  Download,
  RotateCcw,
  Check,
  ShieldCheck,
  Zap,
  Trash2,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    weights,
    updateWeights,
    lifeScoreBreakdown,
    toggleTheme,
    resetToZeroData,
    resetToDemoData,
    authState,
    logout,
    setAuthScreen,
    health,
    finance,
    habits,
    goals,
  } = useLifeOS();

  const [name, setName] = useState(authState.user?.name || profile?.name || 'User');
  const [currency, setCurrency] = useState(profile?.currency || 'Rs.');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(profile?.weightUnit || 'kg');

  // Weights
  const [healthWeight, setHealthWeight] = useState(weights?.health ?? 40);
  const [financeWeight, setFinanceWeight] = useState(weights?.finance ?? 30);
  const [habitsWeight, setHabitsWeight] = useState(weights?.habits ?? 20);
  const [goalsWeight, setGoalsWeight] = useState(weights?.goals ?? 10);

  const [savedStatus, setSavedStatus] = useState(false);
  const [showZeroConfirm, setShowZeroConfirm] = useState(false);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);

  // Sync state when context weights/profile change
  useEffect(() => {
    if (weights) {
      setHealthWeight(weights.health ?? 40);
      setFinanceWeight(weights.finance ?? 30);
      setHabitsWeight(weights.habits ?? 20);
      setGoalsWeight(weights.goals ?? 10);
    }
  }, [weights]);

  useEffect(() => {
    if (profile) {
      setName(authState.user?.name || profile.name || 'User');
      setCurrency(profile.currency || 'Rs.');
      setWeightUnit(profile.weightUnit || 'kg');
    }
  }, [profile]);

  const totalWeight = healthWeight + financeWeight + habitsWeight + goalsWeight;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      currency,
      weightUnit,
    });
    updateWeights({
      health: healthWeight,
      finance: financeWeight,
      habits: habitsWeight,
      goals: goalsWeight,
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const applyPreset = (preset: 'balanced' | 'health' | 'wealth' | 'habits') => {
    if (preset === 'balanced') {
      setHealthWeight(30);
      setFinanceWeight(30);
      setHabitsWeight(25);
      setGoalsWeight(15);
    } else if (preset === 'health') {
      setHealthWeight(45);
      setFinanceWeight(20);
      setHabitsWeight(20);
      setGoalsWeight(15);
    } else if (preset === 'wealth') {
      setHealthWeight(20);
      setFinanceWeight(45);
      setHabitsWeight(20);
      setGoalsWeight(15);
    } else if (preset === 'habits') {
      setHealthWeight(20);
      setFinanceWeight(20);
      setHabitsWeight(45);
      setGoalsWeight(15);
    }
  };

  const handleExportData = () => {
    const backup = {
      profile,
      health,
      finance,
      habits,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `lifeos-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C5FF00] border border-[#111111]" />
          <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7E7E7E] dark:text-[#A1A1AA]">
            SYSTEM SETTINGS
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] dark:text-[#FFFFFF] uppercase tracking-tight mt-1">
          Me & Configuration
        </h1>
        <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA]">
          Personal profile, dark and lit mode themes, custom Life Score weightings, and account settings
        </p>
      </div>

      {/* 🌓 1. APPEARANCE & DISPLAY THEME (LIT AND DARK MODE) */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#111111] dark:bg-[#C5FF00] text-[#C5FF00] dark:text-[#111111] flex items-center justify-center font-black">
              {profile?.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wider font-black text-[#111111] dark:text-[#FFFFFF]">
                Display Theme (Lit & Dark Mode)
              </h2>
              <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA]">
                Select your preferred mode. Currently active:{' '}
                <strong className="text-[#111111] dark:text-[#C5FF00] uppercase font-black">
                  {profile?.theme === 'dark' ? 'Dark Mode' : 'Lit Mode'}
                </strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full btn-nike-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Quick Toggle
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Lit Mode Card */}
          <button
            type="button"
            onClick={() => updateProfile({ theme: 'light' })}
            className={`p-5 rounded-2xl border text-left transition-all relative cursor-pointer ${
              profile?.theme !== 'dark'
                ? 'bg-[#FFFFFF] dark:bg-[#FFFFFF] text-[#111111] border-[#111111] shadow-md ring-2 ring-[#111111]'
                : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#111111] dark:text-[#FFFFFF] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-[#C5FF00]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#111111] text-[#FFFFFF] flex items-center justify-center">
                  <Sun className="w-4 h-4 text-[#C5FF00]" />
                </div>
                <span className="font-black text-sm uppercase tracking-wide">
                  Lit Mode
                </span>
              </div>
              {profile?.theme !== 'dark' && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#111111] text-[#C5FF00] text-[10px] font-black uppercase">
                  Active
                </span>
              )}
            </div>

            <p className="text-xs text-[#7E7E7E] leading-relaxed">
              Clean, high-contrast pure white canvas with Nike Black headings and crisp neutral borders. Ideal for daylight readability.
            </p>

            {/* Preview swatch */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E5E5E5] flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#111111]" />
              <div className="h-2 w-16 bg-[#111111] rounded-sm" />
              <div className="ml-auto w-3 h-3 rounded-full bg-[#C5FF00]" />
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => updateProfile({ theme: 'dark' })}
            className={`p-5 rounded-2xl border text-left transition-all relative cursor-pointer ${
              profile?.theme === 'dark'
                ? 'bg-[#151515] border-[#C5FF00] shadow-md ring-2 ring-[#C5FF00]'
                : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#111111] dark:text-[#FFFFFF] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111] dark:hover:border-[#C5FF00]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#000000] text-[#C5FF00] border border-[#2A2A2A] flex items-center justify-center">
                  <Moon className="w-4 h-4 text-[#C5FF00]" />
                </div>
                <span className="font-black text-sm text-[#111111] dark:text-[#FFFFFF] uppercase tracking-wide">
                  Dark Mode
                </span>
              </div>
              {profile?.theme === 'dark' && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#C5FF00] text-[#111111] text-[10px] font-black uppercase">
                  Active
                </span>
              )}
            </div>

            <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA] leading-relaxed">
              Deep obsidian performance canvas with high-visibility Volt highlights and eye-friendly dark cards. Low-glare focus.
            </p>

            {/* Preview swatch */}
            <div className="mt-4 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#C5FF00]" />
              <div className="h-2 w-16 bg-[#FFFFFF] rounded-sm" />
              <div className="ml-auto w-3 h-3 rounded-full bg-[#C5FF00]" />
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 2. PROFILE IDENTITY CARD */}
        <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E5E5] dark:border-[#222222]">
            <div className="w-8 h-8 rounded-xl bg-[#111111] dark:bg-[#C5FF00] text-[#C5FF00] dark:text-[#111111] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-sm uppercase tracking-wider font-black text-[#111111] dark:text-[#FFFFFF]">
              Personal Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
            <div>
              <label className="block text-xs font-black uppercase text-[#7E7E7E] dark:text-[#A1A1AA] mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-sm font-bold text-[#111111] dark:text-[#FFFFFF] focus:outline-none focus:border-[#111111] dark:focus:border-[#C5FF00]"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#7E7E7E] dark:text-[#A1A1AA] mb-1.5">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-sm font-bold text-[#111111] dark:text-[#FFFFFF] focus:outline-none focus:border-[#111111] dark:focus:border-[#C5FF00]"
              >
                <option value="Rs.">Rs. (Rupees)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (Euro)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#7E7E7E] dark:text-[#A1A1AA] mb-1.5">
                Weight Unit
              </label>
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] text-sm font-bold text-[#111111] dark:text-[#FFFFFF] focus:outline-none focus:border-[#111111] dark:focus:border-[#C5FF00]"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🎛 3. LIFE SCORE SYSTEM & WEIGHTS */}
        <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E5E5] dark:border-[#222222] gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#111111] dark:bg-[#C5FF00] text-[#C5FF00] dark:text-[#111111] flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-wider font-black text-[#111111] dark:text-[#FFFFFF]">
                  Life Score Weights
                </h2>
                <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA] mt-0.5">
                  Formula: (Health × {healthWeight}%) + (Finance × {financeWeight}%) + (Habits × {habitsWeight}%) + (Goals × {goalsWeight}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-black px-3 py-1 rounded-full ${
                  totalWeight === 100
                    ? 'bg-[#C5FF00] text-[#111111]'
                    : 'bg-[#EF4444] text-white'
                }`}
              >
                Total: {totalWeight}% {totalWeight === 100 ? '✓' : '(Must equal 100%)'}
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="text-xs font-bold text-[#7E7E7E] dark:text-[#A1A1AA] self-center mr-1">Presets:</span>
            {[
              { id: 'balanced', label: 'Balanced (30/30/25/15)' },
              { id: 'health', label: 'Health First (45/20/20/15)' },
              { id: 'wealth', label: 'Wealth Builder (20/45/20/15)' },
              { id: 'habits', label: 'Habit Mastery (20/20/45/15)' },
            ].map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => applyPreset(p.id as any)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F5F5F5] dark:bg-[#1C1C1C] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-[#FFFFFF] transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-4 mt-6">
            {/* Health Weight */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1.5">
                <span className="text-[#111111] dark:text-[#FFFFFF] uppercase">Health & Fitness Weight</span>
                <span className="text-[#111111] dark:text-[#C5FF00]">{healthWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={healthWeight}
                onChange={(e) => setHealthWeight(parseInt(e.target.value, 10))}
                className="w-full accent-[#111111] dark:accent-[#C5FF00]"
              />
            </div>

            {/* Finance Weight */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1.5">
                <span className="text-[#111111] dark:text-[#FFFFFF] uppercase">Money & Finance Weight</span>
                <span className="text-[#111111] dark:text-[#C5FF00]">{financeWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={financeWeight}
                onChange={(e) => setFinanceWeight(parseInt(e.target.value, 10))}
                className="w-full accent-[#111111] dark:accent-[#C5FF00]"
              />
            </div>

            {/* Habits Weight */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1.5">
                <span className="text-[#111111] dark:text-[#FFFFFF] uppercase">Habits & Consistency Weight</span>
                <span className="text-[#111111] dark:text-[#C5FF00]">{habitsWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={habitsWeight}
                onChange={(e) => setHabitsWeight(parseInt(e.target.value, 10))}
                className="w-full accent-[#111111] dark:accent-[#C5FF00]"
              />
            </div>

            {/* Goals Weight */}
            <div>
              <div className="flex justify-between text-xs font-black mb-1.5">
                <span className="text-[#111111] dark:text-[#FFFFFF] uppercase">Long-Term Goals Weight</span>
                <span className="text-[#111111] dark:text-[#C5FF00]">{goalsWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={goalsWeight}
                onChange={(e) => setGoalsWeight(parseInt(e.target.value, 10))}
                className="w-full accent-[#111111] dark:accent-[#C5FF00]"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3">
          {savedStatus && (
            <span className="text-xs font-black text-[#111111] dark:text-[#C5FF00] flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            disabled={totalWeight !== 100}
            className="px-6 py-2.5 rounded-full btn-nike-black disabled:opacity-50 text-xs font-black uppercase tracking-wider transition-all"
          >
            Save Configuration
          </button>
        </div>
      </form>

      {/* DATA MANAGEMENT & ACCOUNT */}
      <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm uppercase tracking-wider font-black text-[#111111] dark:text-[#FFFFFF] pb-3 border-b border-[#E5E5E5] dark:border-[#222222]">
            Account & Session
          </h2>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-[#111111] dark:text-white">
                {authState.user?.name || 'Local User'}
              </p>
              <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA]">
                {authState.user?.email || 'Logged in locally'} · Mode: {authState.isAuthenticated ? 'Authenticated Account' : 'Guest Mode'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {authState.isAuthenticated ? (
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-rose-500 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAuthScreen('login')}
                  className="px-4 py-2 rounded-full btn-nike-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wider font-black text-[#111111] dark:text-[#FFFFFF] pb-3 border-b border-[#E5E5E5] dark:border-[#222222]">
            Data Management & Reset
          </h2>
          <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA] mt-2">
            Control your logged entries. Start completely fresh with zero metrics, or reload sample demo metrics.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="py-3 px-4 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#1A1A1A] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] text-xs font-bold text-[#111111] dark:text-[#FFFFFF] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#7E7E7E]" />
              <span>Export Backup (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowZeroConfirm(true)}
              className="py-3 px-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clean Slate (Reset to 0)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDemoConfirm(true)}
              className="py-3 px-4 rounded-2xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#1A1A1A] hover:bg-[#EAEAEA] dark:hover:bg-[#252525] text-xs font-bold text-[#7E7E7E] hover:text-[#111111] dark:hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#C5FF00]" />
              <span>Load Sample Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: ZERO DATA CONFIRMATION */}
      {showZeroConfirm && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111111] dark:text-white uppercase">
                  Reset to Clean Slate (0)?
                </h3>
                <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA]">
                  Start with zero metrics and empty transactions
                </p>
              </div>
            </div>

            <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA] leading-relaxed">
              This will clear out demo expenses, health logs, habits, and goals so you can track your real daily life from scratch. Your score will start fresh.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowZeroConfirm(false)}
                className="px-4 py-2 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold text-[#7E7E7E] hover:text-[#111111] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToZeroData();
                  setShowZeroConfirm(false);
                }}
                className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Yes, Start Clean Slate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DEMO DATA CONFIRMATION */}
      {showDemoConfirm && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#262626] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#111111] dark:text-[#C5FF00]">
              <div className="w-10 h-10 rounded-2xl bg-[#111111] dark:bg-[#222222] text-[#C5FF00] flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-[#C5FF00]" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#111111] dark:text-white uppercase">
                  Reload Demo Data?
                </h3>
                <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA]">
                  Populate LifeOS with sample activities
                </p>
              </div>
            </div>

            <p className="text-xs text-[#7E7E7E] dark:text-[#A1A1AA] leading-relaxed">
              This will replace current entries with realistic sample transactions, health logs, habits, and goals for demo and exploration purposes.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDemoConfirm(false)}
                className="px-4 py-2 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A] text-xs font-bold text-[#7E7E7E] hover:text-[#111111] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDemoData();
                  setShowDemoConfirm(false);
                }}
                className="px-4 py-2 rounded-full btn-nike-black text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Load Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
