import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  Droplets,
  Footprints,
  Moon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Zap,
  Flag,
  Wallet,
  Receipt,
  Scale,
  Send,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    health,
    finance,
    habits,
    lifeScoreBreakdown,
    selectedDate,
    setSelectedDate,
    currentDayRecord,
    addWater,
    toggleHabitForDate,
    setActiveTab,
    setIsAiCoachOpen,
    profile,
    authState,
  } = useLifeOS();

  const [aiPrompt, setAiPrompt] = useState('');
  const userName = authState.user?.name || profile?.name || 'Marcus';

  // Hydration state
  const dayWater = currentDayRecord?.waterLiters ?? health.waterLiters;
  const dayWaterTarget = currentDayRecord?.waterTargetLiters ?? health.waterTargetLiters;
  const waterPct = dayWaterTarget > 0 ? Math.min(100, Math.round((dayWater / dayWaterTarget) * 100)) : 72;

  // Steps state
  const daySteps = currentDayRecord?.steps ?? health.steps;
  const dayStepsTarget = currentDayRecord?.stepsTarget ?? health.stepsTarget;

  // Sleep state
  const daySleepHours = currentDayRecord?.sleepHours ?? health.sleepHours;
  const daySleepMins = currentDayRecord?.sleepMinutes ?? health.sleepMinutes;

  // Weight
  const dayWeight = currentDayRecord?.weightKg ?? health.weightKg;

  // Habits
  const completedHabitIds = currentDayRecord?.completedHabitIds ?? [];
  const habitsDoneCount = habits.filter((h) => completedHabitIds.includes(h.id)).length;

  // Savings
  const savingsAmount = Math.max(0, finance.monthlyIncome - finance.monthlyExpenses);
  const savingsRate = finance.monthlyIncome > 0
    ? Math.round((savingsAmount / finance.monthlyIncome) * 100)
    : 40;

  // Days for the 7-day strip
  const dateStrip = [
    { label: 'MON', num: '21', date: '2026-09-07' },
    { label: 'TUE', num: '22', date: '2026-09-08' },
    { label: 'WED', num: '23', date: '2026-09-09' },
    { label: 'THU', num: '24', date: '2026-09-10' },
    { label: 'FRI', num: '25', date: '2026-09-11' },
    { label: 'SAT', num: '26', date: '2026-09-12' },
    { label: 'SUN', num: '27', date: '2026-09-13' },
  ];

  const handleAiQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      setIsAiCoachOpen(true);
    }
  };

  const handleLockInData = () => {
    // Check first unfinished habit or add water
    const uncompleted = habits.find((h) => !completedHabitIds.includes(h.id));
    if (uncompleted) {
      toggleHabitForDate(selectedDate, uncompleted.id);
    } else {
      addWater(0.25);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto text-[#111111] dark:text-white">
      {/* Nike Championship Hero Billboard (Directly from user screenshot aesthetic) */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#111111] text-white shadow-xl border border-[#E5E5E5] dark:border-[#2A2A2A]">
        {/* Dynamic Stadium Lighting & Rivalry Split Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#990000]/50 via-[#111111] to-[#002B7F]/50 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Ambient Geometric Speed Lines */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-20 hidden md:block">
          <svg viewBox="0 0 400 300" className="w-full h-full object-cover">
            <path d="M50,300 L250,0 L350,0 L150,300 Z" fill="#FFFFFF" />
            <path d="M150,300 L300,0 L380,0 L230,300 Z" fill="#C5FF00" />
          </svg>
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[280px] lg:min-h-[320px]">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#FFFFFF]/15 backdrop-blur-md border border-[#FFFFFF]/25 text-[#FFFFFF] rounded-full font-['Barlow_Condensed'] text-xs font-black uppercase tracking-wider">
                ATHLETIC PERFORMANCE • SEASON 2026
              </span>
              <span className="px-3 py-1 bg-[#FA5400] text-[#FFFFFF] rounded-full font-['Barlow_Condensed'] text-xs font-black uppercase tracking-wider">
                NFL RIVALRY EDITION
              </span>
            </div>

            {/* The Signature Nike Headline from user screenshot */}
            <h1 className="font-['Barlow_Condensed'] text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white leading-none mt-2">
              CLEARED FOR KICKOFF
            </h1>

            {/* The Subtitle from user screenshot */}
            <p className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg text-[#E5E5E5] max-w-2xl font-normal leading-relaxed mt-1">
              Two sides. One rivalry. Zero middle ground. Show 'em where you stand. Run your health, finance, and daily habits with championship execution.
            </p>
          </div>

          {/* Action Pills & Stats (Matching 'Shop NFL' pill from screenshot) */}
          <div className="flex flex-wrap items-center gap-3.5 pt-6">
            <button
              onClick={handleLockInData}
              className="nike-pill-white font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              <span>Log Today's Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAiCoachOpen(true)}
              className="px-6 py-2.5 rounded-full border-2 border-white/60 hover:border-white text-white font-['Plus_Jakarta_Sans'] font-bold text-sm sm:text-base hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[#C5FF00]" />
              <span>Ask AI Coach</span>
            </button>

            <div className="hidden sm:flex items-center gap-4 pl-4 border-l border-white/20 text-xs font-['Barlow_Condensed'] uppercase tracking-wider text-white/80">
              <div>
                <span className="text-white font-black text-sm block">94%</span>
                <span>Readiness</span>
              </div>
              <div>
                <span className="text-[#C5FF00] font-black text-sm block">14 DAYS</span>
                <span>Streak</span>
              </div>
              <div>
                <span className="text-white font-black text-sm block">{lifeScoreBreakdown.compositeScore || 82} / 100</span>
                <span>Life Score</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Top Command Strip & Context */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#111111] dark:bg-[#C5FF00] animate-ping" />
            <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#111111] dark:text-[#C5FF00] tracking-wider">
              SYSTEM ACTIVE • TELEMETRY SYNCED
            </span>
          </div>
          <h2 className="font-['Barlow_Condensed'] text-3xl sm:text-4xl font-extrabold text-[#111111] dark:text-white uppercase tracking-tight">
            Good morning, {userName.split(' ')[0]}.
          </h2>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#707072] dark:text-[#C8C6C5] flex flex-wrap items-center gap-2">
            <span>Here's your life at a glance.</span>
            <span className="text-[#A1A1AA]">•</span>
            <span className="font-['Barlow_Condensed'] text-xs font-bold text-[#111111] dark:text-white bg-[#F5F5F5] dark:bg-[#201F1F] px-2.5 py-0.5 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A]">
              Today: Thu, Oct 24
            </span>
            <span className="text-[#A1A1AA]">•</span>
            <span className="font-['Barlow_Condensed'] text-xs uppercase tracking-wider text-[#FA5400] dark:text-[#C5FF00] font-bold">
              BUILD MOMENTUM
            </span>
          </p>
        </div>

        {/* Date Navigation Strip */}
        <div className="flex flex-wrap items-center gap-2 bg-[#F5F5F5] dark:bg-[#0E0E0E] p-1.5 rounded-full border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {}}
              className="p-1.5 text-[#707072] hover:text-[#111111] dark:text-[#C8C6C5] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#201F1F] rounded-full transition-all cursor-pointer"
              title="Previous 7 Days"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {dateStrip.map((item) => {
                const isActive = item.label === 'THU';
                return (
                  <button
                    key={item.date}
                    onClick={() => setSelectedDate(item.date)}
                    className={`flex flex-col items-center px-3 py-1 rounded-full transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#111111] text-white dark:bg-[#201F1F] shadow-sm'
                        : 'text-[#707072] dark:text-[#C8C6C5] hover:bg-[#EAEAEA] dark:hover:bg-[#201F1F]'
                    }`}
                  >
                    <span
                      className={`font-['Barlow_Condensed'] text-[10px] font-bold uppercase flex items-center gap-0.5 ${
                        isActive ? 'text-[#C5FF00]' : 'text-[#707072] dark:text-[#8D9479]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`font-['Barlow_Condensed'] text-xs font-bold ${
                        isActive ? 'text-white' : 'text-[#111111] dark:text-[#C8C6C5]'
                      }`}
                    >
                      {item.num}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {}}
              className="p-1.5 text-[#707072] hover:text-[#111111] dark:text-[#C8C6C5] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#201F1F] rounded-full transition-all cursor-pointer"
              title="Next 7 Days"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setSelectedDate('2026-09-07')}
            className="px-4 py-1.5 bg-[#111111] text-white dark:bg-[#201F1F] hover:bg-black dark:hover:bg-[#2A2A2A] font-['Barlow_Condensed'] text-xs font-bold uppercase rounded-full transition-all cursor-pointer shadow-xs"
          >
            Jump to Today
          </button>
        </div>
      </section>

      {/* 2. Hero Life Score & Core Metric Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Hero: Life Score Engine */}
        <div className="lg:col-span-5 bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#C5FF00]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C5FF00]" />
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-[#8D9479] font-bold tracking-wider">
                  AGGREGATE BIO-PERFORMANCE
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#0A0A0A] bg-[#C5FF00] px-2 py-0.5 rounded-sm font-extrabold tracking-wider">
                +6.2% THIS WEEK
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 items-center gap-5">
              {/* Radial Telemetry Gauge */}
              <div className="relative flex items-center justify-center">
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 120 120">
                  {/* Background Ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#201F1F"
                    strokeWidth="8"
                    strokeDasharray="314.16"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* 82% Life Score Radial Vector */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#C5FF00"
                    strokeWidth="8"
                    strokeDasharray="314.16"
                    strokeDashoffset={314.16 * (1 - (lifeScoreBreakdown.compositeScore || 82) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Outer concentric tick ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    stroke="#2A2A2A"
                    strokeWidth="1.5"
                    strokeDasharray="2 6"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-['Space_Grotesk'] text-5xl font-extrabold text-white tracking-tighter leading-none">
                    {lifeScoreBreakdown.compositeScore || 82}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest text-[#8E8E93] mt-1 font-bold">
                    LIFE SCORE
                  </span>
                </div>
              </div>

              {/* Category Decomposition Weight Table */}
              <div className="flex flex-col gap-2">
                {/* Health */}
                <div className="p-2 bg-[#1C1B1B] rounded-sm flex flex-col gap-1 border border-[#2A2A2A]/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">Health (30%)</span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#C5FF00]">
                      {lifeScoreBreakdown.healthScore || 88}
                    </span>
                  </div>
                  <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-[#C5FF00] h-full rounded-sm transition-all duration-700"
                      style={{ width: `${lifeScoreBreakdown.healthScore || 88}%` }}
                    />
                  </div>
                </div>

                {/* Finance */}
                <div className="p-2 bg-[#1C1B1B] rounded-sm flex flex-col gap-1 border border-[#2A2A2A]/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">Finance (30%)</span>
                    <span className="font-['Space_Grotesk'] font-bold text-white">
                      {lifeScoreBreakdown.financeScore || 84}
                    </span>
                  </div>
                  <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-white h-full rounded-sm transition-all duration-700"
                      style={{ width: `${lifeScoreBreakdown.financeScore || 84}%` }}
                    />
                  </div>
                </div>

                {/* Habits */}
                <div className="p-2 bg-[#1C1B1B] rounded-sm flex flex-col gap-1 border border-[#2A2A2A]/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">Habits (25%)</span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#C5FF00]">
                      {lifeScoreBreakdown.habitsScore || 78}
                    </span>
                  </div>
                  <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-[#C5FF00] h-full rounded-sm transition-all duration-700"
                      style={{ width: `${lifeScoreBreakdown.habitsScore || 78}%` }}
                    />
                  </div>
                </div>

                {/* Goals */}
                <div className="p-2 bg-[#1C1B1B] rounded-sm flex flex-col gap-1 border border-[#2A2A2A]/40">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">Goals (15%)</span>
                    <span className="font-['Space_Grotesk'] font-bold text-[#8D9479]">
                      {lifeScoreBreakdown.goalsScore || 72}
                    </span>
                  </div>
                  <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-[#353534] h-full rounded-sm transition-all duration-700"
                      style={{ width: `${lifeScoreBreakdown.goalsScore || 72}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Focus Callout HUD */}
          <div className="mt-5 p-3.5 bg-[#1C1B1B] rounded-xl border border-[#2A2A2A] flex items-start gap-3">
            <div className="p-2 bg-[#C5FF00]/10 text-[#C5FF00] rounded-sm flex-shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase text-[#C5FF00] font-bold tracking-wider">
                WHAT TO FOCUS ON NEXT
              </span>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#E5E2E1] leading-relaxed">
                Increase hydration by{' '}
                <span className="font-bold text-white underline decoration-[#C5FF00] underline-offset-4">
                  700ml
                </span>{' '}
                before your 18:00 interval run to optimize recovery index.
              </p>
            </div>
          </div>
        </div>

        {/* Right Summary Visual Banner: Athletic Focus */}
        <div className="lg:col-span-7 bg-[#0E0E0E] rounded-xl border border-[#2A2A2A] p-5 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle Ambient Vignette Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E] via-[#0E0E0E]/90 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(#C5FF00_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

          <div className="relative z-20 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-widest font-bold">
                REAL-TIME TELEMETRY STREAM
              </span>
              <div className="flex items-center gap-1.5 text-[#C5FF00] font-['Space_Grotesk'] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF00] animate-pulse" />
                <span>LIVE PROTOCOL</span>
              </div>
            </div>

            <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight max-w-xl">
              OPTIMAL RECOVERY STATE DETECTED.
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#C8C6C5] max-w-lg leading-relaxed">
              Resting heart rate decreased to 49 bpm. Cognitive readiness peak projected between 09:30 and 12:45.
            </p>
          </div>

          {/* Live Quick Stat Row */}
          <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-5">
            <div className="bg-[#1C1B1B]/90 backdrop-blur-md p-3 rounded-sm border border-[#2A2A2A] flex flex-col">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                READINESS
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1">
                94<span className="text-xs text-[#C5FF00] font-normal ml-0.5">/100</span>
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C5FF00] mt-0.5">
                Peak Band
              </span>
            </div>

            <div className="bg-[#1C1B1B]/90 backdrop-blur-md p-3 rounded-sm border border-[#2A2A2A] flex flex-col">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                STRAIN LOAD
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1">
                11.4<span className="text-xs text-[#8E8E93] font-normal ml-0.5">/21</span>
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C8C6C5] mt-0.5">
                Moderate
              </span>
            </div>

            <div className="bg-[#1C1B1B]/90 backdrop-blur-md p-3 rounded-sm border border-[#2A2A2A] flex flex-col">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                HRV STATUS
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#C5FF00] mt-1">
                78<span className="text-xs font-normal text-white ml-0.5">ms</span>
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C5FF00] mt-0.5">
                +12ms baseline
              </span>
            </div>

            <div className="bg-[#1C1B1B]/90 backdrop-blur-md p-3 rounded-sm border border-[#2A2A2A] flex flex-col">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                DAILY BUDGET
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1">
                74%
              </span>
              <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C8C6C5] mt-0.5">
                On Target
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Life Domains Bento Grid (4 Columns) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Card 1: Health & Biometrics */}
        <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-lg relative group hover:border-[#444444] transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2A2A2A]/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#1C1B1B] rounded-sm text-[#C5FF00]">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  Health & Biometrics
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00]">
                SYS: OPTIMAL
              </span>
            </div>

            {/* Hydration Interactive Block */}
            <div className="bg-[#1C1B1B] p-3 rounded-sm flex flex-col gap-2 border border-[#2A2A2A]/60">
              <div className="flex justify-between items-center">
                <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C8C6C5]">
                  Hydration Track
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-white">
                  <span className="text-[#C5FF00]">{dayWater.toFixed(1)}</span>L{' '}
                  <span className="text-[#8E8E93] font-normal">/ {dayWaterTarget.toFixed(1)}L</span>
                </span>
              </div>
              <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                <div
                  className="bg-[#C5FF00] h-full rounded-sm transition-all duration-300"
                  style={{ width: `${waterPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                  {waterPct}% CONSUMED
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => addWater(0.25)}
                    className="px-2 py-0.5 bg-[#201F1F] hover:bg-[#2A2A2A] text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-[11px] font-mono rounded-sm transition-colors cursor-pointer"
                  >
                    +250ml
                  </button>
                  <button
                    onClick={() => addWater(0.5)}
                    className="px-2 py-0.5 bg-[#201F1F] hover:bg-[#2A2A2A] text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-[11px] font-mono rounded-sm transition-colors cursor-pointer"
                  >
                    +500ml
                  </button>
                </div>
              </div>
            </div>

            {/* Biometrics Quad Matrix */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1C1B1B] p-2.5 rounded-sm flex flex-col justify-between border border-[#2A2A2A]/40">
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">STEPS</span>
                  <Footprints className="w-3.5 h-3.5 text-[#8E8E93]" />
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    {daySteps.toLocaleString()}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93] block">
                    / {dayStepsTarget.toLocaleString()}
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] mt-1 font-bold">
                  78% • Active Pace
                </span>
              </div>

              <div className="bg-[#1C1B1B] p-2.5 rounded-sm flex flex-col justify-between border border-[#2A2A2A]/40">
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">WORKOUT</span>
                  <Activity className="w-3.5 h-3.5 text-[#C5FF00]" />
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    32 <span className="text-xs font-normal text-[#8E8E93]">min</span>
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93] block">
                    Target 45 min
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C8C6C5] mt-1 font-medium">
                  HIIT Run Logged
                </span>
              </div>

              <div className="bg-[#1C1B1B] p-2.5 rounded-sm flex flex-col justify-between border border-[#2A2A2A]/40">
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">SLEEP</span>
                  <Moon className="w-3.5 h-3.5 text-[#8E8E93]" />
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    7h 42m
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93] block">
                    Deep: 2h 10m
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] mt-1 font-bold">
                  91% Peak Rest
                </span>
              </div>

              <div className="bg-[#1C1B1B] p-2.5 rounded-sm flex flex-col justify-between border border-[#2A2A2A]/40">
                <div className="flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">WEIGHT</span>
                  <Scale className="w-3.5 h-3.5 text-[#8E8E93]" />
                </div>
                <div className="mt-1">
                  <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                    {dayWeight.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#8E8E93]">kg</span>
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00] block">
                    -0.3kg this week
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] mt-1">
                  Target 71.5kg
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">Last Sync: 12 min ago</span>
            <button
              onClick={() => setActiveTab('fitness')}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Full Metrics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Finance Command */}
        <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-lg relative group hover:border-[#444444] transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2A2A2A]/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#1C1B1B] rounded-sm text-white">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  Finance Command
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#0A0A0A] bg-[#C5FF00] px-2 py-0.5 rounded-sm font-extrabold tracking-wider">
                {savingsRate}% SAVINGS RATE
              </span>
            </div>

            {/* Inflow vs Expenses vs Saved */}
            <div className="grid grid-cols-3 gap-2 bg-[#1C1B1B] p-2.5 rounded-sm text-center border border-[#2A2A2A]/40">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] font-bold">INCOME</span>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-white mt-0.5">
                  Rs. 250k
                </span>
              </div>
              <div className="flex flex-col border-x border-[#2A2A2A]">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] font-bold">EXPENSES</span>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-[#C8C6C5] mt-0.5">
                  Rs. 148.5k
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] font-bold">SAVED</span>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-[#C5FF00] mt-0.5">
                  Rs. 101.5k
                </span>
              </div>
            </div>

            {/* Monthly Burn Allocation */}
            <div className="flex flex-col gap-1.5 bg-[#1C1B1B] p-3 rounded-sm border border-[#2A2A2A]/40">
              <div className="flex justify-between items-center text-xs">
                <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">Monthly Burn Allocation</span>
                <span className="font-['Space_Grotesk'] font-mono text-white font-bold">
                  Rs. 148,500 / 175,000
                </span>
              </div>
              <div className="w-full bg-[#201F1F] h-2 rounded-sm overflow-hidden">
                <div className="bg-white h-full rounded-sm" style={{ width: '84.8%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-['Space_Grotesk'] text-[#C5FF00] font-bold">HEALTHY STATE</span>
                <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">Rs. 26,500 runway</span>
              </div>
            </div>

            {/* Category Outflows */}
            <div className="flex flex-col gap-1.5">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                Top Outflows
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm font-['Space_Grotesk'] text-[11px] text-[#C8C6C5]">
                  Bills: <strong className="text-white font-bold">Rs. 65k</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm font-['Space_Grotesk'] text-[11px] text-[#C8C6C5]">
                  Food: <strong className="text-white font-bold">Rs. 38k</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm font-['Space_Grotesk'] text-[11px] text-[#C8C6C5]">
                  Shopping: <strong className="text-white font-bold">Rs. 22k</strong>
                </span>
                <span className="px-2 py-0.5 bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm font-['Space_Grotesk'] text-[11px] text-[#C8C6C5]">
                  Transport: <strong className="text-white font-bold">Rs. 14k</strong>
                </span>
              </div>
            </div>

            {/* Recent Transaction */}
            <div className="p-2.5 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#8D9479]" />
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs text-white font-medium">
                    Equinox Fitness Membership
                  </span>
                  <span className="font-['Space_Grotesk'] text-[9px] uppercase tracking-wider text-[#8E8E93]">
                    HEALTH • TODAY
                  </span>
                </div>
              </div>
              <span className="font-['Space_Grotesk'] text-xs font-bold text-white">
                -Rs. 8,500
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">Updated Today</span>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Audit Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: 7-Day Habit Matrix */}
        <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-lg relative group hover:border-[#444444] transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2A2A2A]/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#1C1B1B] rounded-sm text-[#C5FF00]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  7-Day Habit Matrix
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-xs font-mono font-bold text-[#C5FF00]">
                {habitsDoneCount}/{habits.length || 4} TODAY
              </span>
            </div>

            {/* Matrix Column Headers */}
            <div className="flex items-center justify-between px-1 pt-1 text-[10px] font-['Space_Grotesk'] text-[#8D9479] font-bold">
              <span>PROTOCOL</span>
              <div className="flex items-center gap-1.5">
                <span className="w-4 text-center">M</span>
                <span className="w-4 text-center">T</span>
                <span className="w-4 text-center">W</span>
                <span className="w-4 text-center text-[#C5FF00] font-extrabold">T</span>
                <span className="w-4 text-center">F</span>
                <span className="w-4 text-center">S</span>
                <span className="w-4 text-center">S</span>
              </div>
            </div>

            {/* Habit Rows */}
            <div className="flex flex-col gap-2">
              {habits.slice(0, 4).map((habit, idx) => {
                const isCompleted = completedHabitIds.includes(habit.id) || habit.completedToday;
                return (
                  <div
                    key={habit.id}
                    className="p-2 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/40 flex items-center justify-between gap-2 hover:bg-[#201F1F] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleHabitForDate(selectedDate, habit.id)}
                        className={`w-4 h-4 rounded-xs flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                          isCompleted
                            ? 'bg-[#C5FF00] text-[#0A0A0A]'
                            : 'bg-[#2A2A2A] text-transparent hover:border-[#C5FF00]'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <div className="flex flex-col min-w-0 truncate text-left">
                        <span className="font-['Plus_Jakarta_Sans'] text-xs text-white truncate">
                          {habit.title}
                        </span>
                        <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00]">
                          {habit.streakDays}d streak
                        </span>
                      </div>
                    </div>

                    {/* 7-Dot Adherence Matrix */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                        const filled = idx === 3 ? dayIdx !== 2 && dayIdx !== 6 : true;
                        return (
                          <span
                            key={dayIdx}
                            className={`w-3.5 h-3.5 rounded-full transition-all ${
                              filled
                                ? 'bg-[#C5FF00] shadow-[0_0_6px_rgba(197,255,0,0.3)]'
                                : 'bg-[#2A2A2A]'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">Consistency: 89%</span>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Configure Habits <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Active Goals */}
        <div className="bg-[#0E0E0E] p-5 rounded-xl border border-[#2A2A2A] flex flex-col justify-between shadow-lg relative group hover:border-[#444444] transition-all">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1 border-b border-[#2A2A2A]/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#1C1B1B] rounded-sm text-white">
                  <Flag className="w-4 h-4" />
                </div>
                <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                  Active Missions
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                Q4 OBJECTIVES
              </span>
            </div>

            {/* Goal 1 */}
            <div className="bg-[#1C1B1B] p-3 rounded-sm flex flex-col gap-1.5 border border-[#2A2A2A]/40">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                    Save Emergency Fund
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                    Target: Liquid Reserve
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[9px] font-bold text-[#C5FF00] bg-[#201F1F] px-1.5 py-0.5 rounded-sm">
                  45 DAYS REMAINING
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1 text-xs">
                <span className="font-['Space_Grotesk'] font-bold text-white">Rs. 350,000</span>
                <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">/ Rs. 500,000</span>
              </div>
              <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-[#C5FF00] h-full rounded-sm" style={{ width: '70%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-['Space_Grotesk'] text-[#C5FF00] font-bold">70% ACHIEVED</span>
                <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">Rs. 3,333/day</span>
              </div>
            </div>

            {/* Goal 2 */}
            <div className="bg-[#1C1B1B] p-3 rounded-sm flex flex-col gap-1.5 border border-[#2A2A2A]/40">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                    Sub-20min 5K Time Trial
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">
                    Vo2Max & Pacing Program
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-[9px] font-bold text-[#8D9479] bg-[#201F1F] px-1.5 py-0.5 rounded-sm">
                  18 DAYS REMAINING
                </span>
              </div>
              <div className="flex justify-between items-baseline mt-1 text-xs">
                <span className="font-['Space_Grotesk'] font-bold text-white">
                  21:15 <span className="text-[10px] text-[#8E8E93] font-normal">CURRENT</span>
                </span>
                <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">
                  19:59 TARGET
                </span>
              </div>
              <div className="w-full bg-[#201F1F] h-1.5 rounded-sm overflow-hidden">
                <div className="bg-white h-full rounded-sm" style={{ width: '78%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-['Space_Grotesk'] text-[#8E8E93]">78% PERFORMANCE INDEX</span>
                <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00]">-0:32 last run</span>
              </div>
            </div>

            {/* High-Urgency Solid Electric Volt Action Button */}
            <button
              onClick={handleLockInData}
              className="p-3 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] rounded-sm flex items-center justify-between transition-all cursor-pointer shadow-lg shadow-[#C5FF00]/10 group"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0A0A0A]" />
                <span className="font-['Space_Grotesk'] text-xs uppercase font-extrabold tracking-wider">
                  LOCK IN TODAY'S DATA
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="pt-3 mt-3 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">2 Active Targets</span>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              View All Goals <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Secondary Row: AI Performance Intelligence Briefing & Scheduled Protocols */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Coach Intelligence Feed */}
        <div className="xl:col-span-8 bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#2A2A2A]/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C5FF00] animate-ping" />
                <h3 className="font-['Space_Grotesk'] text-base sm:text-lg uppercase tracking-tight text-white font-bold">
                  AI PERFORMANCE INTELLIGENCE BRIEFING
                </h3>
              </div>
              <span className="font-['Space_Grotesk'] text-[10px] font-mono bg-[#1C1B1B] border border-[#2A2A2A] px-2 py-1 rounded-sm text-[#C5FF00] font-bold">
                NEURAL AGENT v4.8
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Insight 1 */}
              <div className="p-4 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[#C5FF00]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
                    Deep Work Protocol Insight
                  </span>
                </div>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#E5E2E1] leading-relaxed">
                  Marcus, your completed habits reveal an 8-day uninterrupted streak on high-intensity morning focus. However, deep work completion tends to degrade on Thursdays post-15:00. Pre-schedule your 90-minute block immediately to preserve target momentum.
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2A2A2A]/60 text-xs">
                  <span className="font-['Space_Grotesk'] font-mono text-[#8D9479]">IMPACT ON LIFE SCORE:</span>
                  <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">+1.8 PTS</span>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="p-4 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-white">
                  <Wallet className="w-4 h-4 text-[#C5FF00]" />
                  <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
                    Liquidity Optimization
                  </span>
                </div>
                <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#E5E2E1] leading-relaxed">
                  Zero-impulse spend streak has preserved Rs. 14,200 this fortnight. Pacing suggests you will reach your 70% emergency liquidity milestone 4 days ahead of scheduled timeline. No reallocation recommended.
                </p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2A2A2A]/60 text-xs">
                  <span className="font-['Space_Grotesk'] font-mono text-[#8D9479]">STATUS:</span>
                  <span className="font-['Space_Grotesk'] font-mono text-white font-bold">ON PARALLEL TRACK</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick AI Interaction Prompt Bar */}
          <form
            onSubmit={handleAiQuerySubmit}
            className="mt-5 pt-3 border-t border-[#2A2A2A]/60 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative w-full">
              <Sparkles className="w-4 h-4 absolute left-3 top-2.5 text-[#8E8E93]" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask AI Coach for real-time recovery adjustments or protocol review..."
                className="w-full bg-[#1C1B1B] border border-[#2A2A2A] rounded-sm pl-9 pr-4 py-2 font-['Plus_Jakarta_Sans'] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#C5FF00] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#201F1F] hover:bg-[#2A2A2A] text-white hover:text-[#C5FF00] border border-[#2A2A2A] font-['Space_Grotesk'] text-xs font-bold uppercase rounded-sm whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Query</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Scheduled Protocols Today Timeline */}
        <div className="xl:col-span-4 bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-lg flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]/60">
              <span className="font-['Space_Grotesk'] text-[11px] uppercase text-white font-bold tracking-wider">
                SCHEDULED PROTOCOLS TODAY
              </span>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                OCT 24
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {/* Protocol 1 */}
              <div className="flex items-center gap-3 p-2.5 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/40">
                <div className="font-['Space_Grotesk'] font-mono text-xs text-[#8E8E93] w-12 text-center">
                  07:00
                </div>
                <div className="w-1 h-6 bg-[#C5FF00] rounded-full" />
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                    Hydration & Cold Exposure
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] font-bold">
                    COMPLETED • 100%
                  </span>
                </div>
              </div>

              {/* Protocol 2 */}
              <div className="flex items-center gap-3 p-2.5 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/40">
                <div className="font-['Space_Grotesk'] font-mono text-xs text-[#8E8E93] w-12 text-center">
                  10:00
                </div>
                <div className="w-1 h-6 bg-[#C5FF00] rounded-full" />
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                    Deep Focus: Architecture Plan
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] font-bold">
                    COMPLETED • 90 MIN
                  </span>
                </div>
              </div>

              {/* Protocol 3 (Next Up) */}
              <div className="flex items-center gap-3 p-2.5 bg-[#201F1F] rounded-sm border border-[#C5FF00]/40 shadow-sm">
                <div className="font-['Space_Grotesk'] font-mono text-xs text-white font-bold w-12 text-center">
                  18:00
                </div>
                <div className="w-1 h-6 bg-[#C5FF00] animate-pulse rounded-full" />
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                    Sub-20 5K Speed Interval Session
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] font-extrabold">
                    NEXT UP • IN 4H 15M
                  </span>
                </div>
              </div>

              {/* Protocol 4 */}
              <div className="flex items-center gap-3 p-2.5 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/40 opacity-60">
                <div className="font-['Space_Grotesk'] font-mono text-xs text-[#8E8E93] w-12 text-center">
                  22:00
                </div>
                <div className="w-1 h-6 bg-[#353534] rounded-full" />
                <div className="flex flex-col">
                  <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#C8C6C5]">
                    Digital Curfew & Magnesium Sleep Stack
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479]">
                    SCHEDULED
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2A2A2A]/60 flex items-center justify-between text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#8E8E93]">All routines synced</span>
            <button
              onClick={() => setActiveTab('fitness')}
              className="text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              Calendar View <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
