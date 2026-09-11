import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Activity,
  Droplets,
  Footprints,
  Moon,
  Zap,
  Plus,
  RotateCw,
  SlidersHorizontal,
  X,
  Check,
  TrendingDown,
  Scale,
  ArrowRight,
  BatteryCharging,
  Radio,
} from 'lucide-react';

export const FitnessView: React.FC = () => {
  const {
    health,
    selectedDate,
    currentDayRecord,
    addWater,
    logWeight,
    logSteps,
    setWaterLimitForDate,
    openAddModal,
  } = useLifeOS();

  // Unit toggle: kg vs lbs
  const [isLbs, setIsLbs] = useState(false);

  // Targets
  const [targetHydration, setTargetHydration] = useState(
    currentDayRecord?.waterTargetLiters || 2.5
  );

  // Modals state
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [isTargetsModalOpen, setIsTargetsModalOpen] = useState(false);
  const [bioCategory, setBioCategory] = useState('Weight & Mass (kg)');
  const [bioValue, setBioValue] = useState('');

  // Target sliders
  const [targetStepGoal, setTargetStepGoal] = useState(10000);
  const [targetHydroGoal, setTargetHydroGoal] = useState(targetHydration);
  const [targetActiveMins, setTargetActiveMins] = useState(45);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Day record values
  const dayWater = currentDayRecord?.waterLiters ?? health.waterLiters;
  const dayWaterTarget = targetHydration;
  const waterPct = dayWaterTarget > 0 ? Math.min(100, Math.round((dayWater / dayWaterTarget) * 100)) : 72;

  const daySteps = currentDayRecord?.steps ?? health.steps;
  const dayStepsTarget = targetStepGoal;
  const stepsPct = dayStepsTarget > 0 ? Math.min(100, Math.round((daySteps / dayStepsTarget) * 100)) : 78;

  const baseWeightKg = currentDayRecord?.weightKg ?? health.weightKg;
  const displayWeight = isLbs
    ? (baseWeightKg * 2.20462).toFixed(1)
    : baseWeightKg.toFixed(1);
  const displayTargetWeight = isLbs ? '157.6 LBS' : '71.5 KG';

  const handleWaterQuickAdd = (amount: number) => {
    addWater(amount);
    showToast(`+${Math.round(amount * 1000)}ml Water Logged • ${(dayWater + amount).toFixed(1)}L / ${dayWaterTarget.toFixed(1)}L`);
  };

  const handleSelectHydrationTarget = (val: number) => {
    setTargetHydration(val);
    setWaterLimitForDate(selectedDate, val);
    showToast(`Hydration Goal updated to ${val.toFixed(1)}L`);
  };

  const handleCommitBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(bioValue);
    if (!isNaN(val) && val > 0) {
      if (bioCategory.includes('Weight')) {
        logWeight(val);
      } else if (bioCategory.includes('Water')) {
        addWater(val / 1000);
      } else if (bioCategory.includes('Steps')) {
        logSteps(val);
      }
      showToast(`Telemetry Point Successfully Committed: ${val}`);
    }
    setIsBioModalOpen(false);
    setBioValue('');
  };

  const handleSaveTargets = () => {
    setTargetHydration(targetHydroGoal);
    setWaterLimitForDate(selectedDate, targetHydroGoal);
    setIsTargetsModalOpen(false);
    showToast('Daily Target Parameters Recalibrated');
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-[1600px] mx-auto text-white">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#C5FF00] text-[#0A0A0A] px-4 py-2.5 rounded-sm shadow-2xl font-['Space_Grotesk'] text-xs font-bold flex items-center gap-2 transition-all">
          <Check className="w-4 h-4 text-[#0A0A0A] stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Telemetry Action Deck */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-[#C5FF00] shadow-[0_0_10px_#C5FF00] animate-pulse" />
            <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-widest text-[#C5FF00] font-bold">
              LIVE BIOMETRIC TELEMETRY • THU, OCT 24
            </span>
          </div>
          <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
            Health & Performance Biometrics
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[#C8C6C5] max-w-2xl leading-relaxed">
            Real-time athletic telemetry, autonomous recovery indices, dynamic hydration tracking, and multi-system metabolic load mapping.
          </p>
        </div>

        {/* Rapid Tactical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleWaterQuickAdd(0.25)}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1B1B] hover:bg-[#201F1F] text-white hover:text-[#C5FF00] transition-all rounded-sm border border-[#2A2A2A] shadow-sm cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-[#C5FF00]" />
            <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
              Water +250ml
            </span>
          </button>

          <button
            onClick={() => showToast('Whoop & Garmin Telemetry Synchronized: 100%')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1B1B] hover:bg-[#201F1F] text-white transition-all rounded-sm border border-[#2A2A2A] shadow-sm group cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-[#C5FF00] group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider">
              Sync Wearable (Whoop/Garmin)
            </span>
          </button>

          <button
            onClick={() => openAddModal('health')}
            className="flex items-center gap-2 px-4 py-2 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Workout</span>
          </button>
        </div>
      </section>

      {/* 2. High-Voltage Vital Gauge Cluster (Hero Metric Overview) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Card 1: Recovery Index */}
        <div className="flex flex-col bg-[#0E0E0E] p-4 rounded-sm border border-[#2A2A2A] shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase tracking-wider font-bold">
              Recovery Index
            </span>
            <RotateCw className="w-3.5 h-3.5 text-[#C5FF00]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">89</span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00]">/100</span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C5FF00] mt-0.5 font-bold">
            PRIME • High Strain Ready
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[89%] rounded-full" />
          </div>
        </div>

        {/* Card 2: Resting HR / HRV */}
        <div className="flex flex-col bg-[#0E0E0E] p-4 rounded-sm border border-[#2A2A2A] shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase tracking-wider font-bold">
              Resting HR / HRV
            </span>
            <Activity className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">48</span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8E8E93]">BPM</span>
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white ml-2">74</span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00]">MS</span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C8C6C5] mt-0.5">
            +6ms vs 7-day baseline
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[78%] rounded-full" />
          </div>
        </div>

        {/* Card 3: Metabolic Active Burn */}
        <div className="flex flex-col bg-[#0E0E0E] p-4 rounded-sm border border-[#2A2A2A] shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase tracking-wider font-bold">
              Metabolic Active Burn
            </span>
            <Zap className="w-3.5 h-3.5 text-[#C5FF00]" />
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">640</span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00]">/ 850 KCAL</span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C8C6C5] mt-0.5">
            75% daily metabolic pace
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[75%] rounded-full" />
          </div>
        </div>

        {/* Card 4: Sleep Performance */}
        <div className="flex flex-col bg-[#0E0E0E] p-4 rounded-sm border border-[#2A2A2A] shadow-sm relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase tracking-wider font-bold">
              Sleep Performance
            </span>
            <Moon className="w-3.5 h-3.5 text-[#C5FF00]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">7h 42m</span>
            <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">91%</span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] font-mono text-[#C5FF00] mt-0.5 font-semibold">
            Optimal architecture
          </span>
          <div className="w-full bg-[#201F1F] h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-[#C5FF00] h-full w-[91%] rounded-full" />
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Level 1: Primary Telemetry Engines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. Steps & Daily Kinetic Activity (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                Kinetic Locomotive Engine
              </span>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                Steps & Motion Load
              </h2>
            </div>
            <span className="flex items-center gap-1.5 font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] bg-[#1C1B1B] border border-[#2A2A2A] px-2 py-1 rounded-sm font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5FF00]" /> {stepsPct}%
            </span>
          </div>

          {/* Radial Dial & Stat Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 my-5 items-center">
            {/* SVG Radial Gauge */}
            <div className="sm:col-span-6 flex flex-col items-center justify-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#201F1F"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="transparent"
                    stroke="#C5FF00"
                    strokeWidth="8"
                    strokeDasharray="314.16"
                    strokeDashoffset={314.16 * (1 - stepsPct / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">
                    {daySteps.toLocaleString()}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#8D9479]">
                    / {dayStepsTarget.toLocaleString()}
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold mt-0.5">
                    STEPS
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Readout Stack */}
            <div className="sm:col-span-6 flex flex-col gap-2">
              <div className="bg-[#1C1B1B] p-2.5 rounded-sm border border-[#2A2A2A]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Footprints className="w-4 h-4 text-[#8E8E93]" />
                  <span className="font-['Space_Grotesk'] text-[11px] text-[#C8C6C5] uppercase font-bold">
                    Distance
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
                  6.2 <span className="font-mono text-xs text-[#8E8E93]">KM</span>
                </span>
              </div>

              <div className="bg-[#1C1B1B] p-2.5 rounded-sm border border-[#2A2A2A]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#C5FF00]" />
                  <span className="font-['Space_Grotesk'] text-[11px] text-[#C8C6C5] uppercase font-bold">
                    Active Cal
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-[#C5FF00]">
                  640 <span className="font-mono text-xs text-[#C5FF00]/70">KCAL</span>
                </span>
              </div>

              <div className="bg-[#1C1B1B] p-2.5 rounded-sm border border-[#2A2A2A]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#8E8E93]" />
                  <span className="font-['Space_Grotesk'] text-[11px] text-[#C8C6C5] uppercase font-bold">
                    Avg Cadence
                  </span>
                </div>
                <span className="font-['Space_Grotesk'] text-sm font-bold text-white">
                  158 <span className="font-mono text-xs text-[#8E8E93]">SPM</span>
                </span>
              </div>
            </div>
          </div>

          {/* Micro Pace Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]/40 text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">
              {Math.max(0, dayStepsTarget - daySteps).toLocaleString()} STEPS TO DAILY LOCK-IN
            </span>
            <button
              onClick={() => showToast('Locomotive Sensor Active • 158 spm average')}
              className="font-['Space_Grotesk'] text-xs uppercase font-bold text-[#C5FF00] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Activity Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Hydration Command Center (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                Cellular Hydration Status
              </span>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                Hydration Command Center
              </h2>
            </div>

            {/* Target Selector Controls */}
            <div className="flex items-center gap-1 bg-[#1C1B1B] border border-[#2A2A2A] p-1 rounded-sm">
              {[2.0, 2.5, 3.0].map((tgt) => {
                const isSelected = targetHydration === tgt;
                return (
                  <button
                    key={tgt}
                    onClick={() => handleSelectHydrationTarget(tgt)}
                    className={`px-3 py-1 font-['Space_Grotesk'] text-xs font-mono rounded-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#201F1F] text-[#C5FF00] font-bold border border-[#C5FF00]/40'
                        : 'text-[#C8C6C5] hover:text-white'
                    }`}
                  >
                    {tgt.toFixed(1)}L
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Intake & Wave Indicator Array */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-5 items-center">
            {/* Liquid Gauge Block */}
            <div className="md:col-span-5 flex flex-col bg-[#1C1B1B] p-4 rounded-sm border border-[#2A2A2A] relative overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                  Intake Progress
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                  {waterPct}%
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-2 z-10">
                <span className="font-['Space_Grotesk'] text-4xl font-extrabold text-white">
                  {dayWater.toFixed(1)}
                </span>
                <span className="font-['Space_Grotesk'] text-lg text-[#8E8E93]">/</span>
                <span className="font-['Space_Grotesk'] text-lg text-[#8E8E93]">
                  {dayWaterTarget.toFixed(1)}L
                </span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-xs text-[#C8C6C5] z-10">
                Peak replenishment achieved post-morning sprint session.
              </p>

              {/* Wave SVG Level Fill */}
              <div className="absolute -bottom-2 -left-2 -right-2 h-20 opacity-20 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 25">
                  <path
                    d="M0,15 C20,5 35,25 50,15 C65,5 80,20 100,10 L100,25 L0,25 Z"
                    fill="#C5FF00"
                  />
                </svg>
              </div>
            </div>

            {/* Hourly Intake Bar Graph */}
            <div className="md:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                  Hourly Distribution (ML)
                </span>
                <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                  Peak: 08:00 (600ml)
                </span>
              </div>

              {/* Bar Columns Container */}
              <div className="h-28 flex items-end justify-between gap-2 pt-2 border-b border-[#2A2A2A]/60 pb-1">
                {/* 06:00 */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#201F1F] hover:bg-[#C5FF00] transition-colors rounded-t-xs h-8" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">06</span>
                </div>
                {/* 08:00 Peak */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#C5FF00] shadow-[0_0_12px_rgba(197,255,0,0.3)] rounded-t-xs h-24" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00] font-bold">08</span>
                </div>
                {/* 10:00 */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#201F1F] hover:bg-[#C5FF00] transition-colors rounded-t-xs h-12" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">10</span>
                </div>
                {/* 12:00 */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#201F1F] hover:bg-[#C5FF00] transition-colors rounded-t-xs h-16" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">12</span>
                </div>
                {/* 14:00 */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#201F1F] hover:bg-[#C5FF00] transition-colors rounded-t-xs h-10" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">14</span>
                </div>
                {/* 16:00 Current */}
                <div className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-[#C5FF00]/80 rounded-t-xs h-14" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#C5FF00]">16</span>
                </div>
                {/* 18:00 Projected */}
                <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
                  <div className="w-full bg-[#201F1F] border-t border-dashed border-[#8E8E93] rounded-t-xs h-8" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">18</span>
                </div>
                {/* 20:00 Projected */}
                <div className="flex-1 flex flex-col items-center gap-1 opacity-40">
                  <div className="w-full bg-[#201F1F] border-t border-dashed border-[#8E8E93] rounded-t-xs h-6" />
                  <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Quick Log */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]/40 text-xs">
            <span className="font-['Space_Grotesk'] font-mono text-[#C8C6C5]">
              ELECTROLYTE REPLACEMENT RATIO: 1.2 : 1
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleWaterQuickAdd(0.25)}
                className="px-2.5 py-1 bg-[#1C1B1B] hover:bg-[#201F1F] text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs font-mono rounded-sm border border-[#2A2A2A] cursor-pointer"
              >
                +250ml
              </button>
              <button
                onClick={() => handleWaterQuickAdd(0.5)}
                className="px-2.5 py-1 bg-[#1C1B1B] hover:bg-[#201F1F] text-white hover:text-[#C5FF00] font-['Space_Grotesk'] text-xs font-mono rounded-sm border border-[#2A2A2A] cursor-pointer"
              >
                +500ml
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bento Grid Level 2: Training Strain, Sleep Architecture & Body Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3. Workout & Training Load (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                Active Strain
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#93000A] text-white font-['Space_Grotesk'] font-mono text-xs font-bold rounded-sm">
                ZONE 4/5
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
              Training Load
            </h2>
          </div>

          {/* Active Session Highlight */}
          <div className="flex flex-col bg-[#1C1B1B] p-4 rounded-sm border border-[#2A2A2A] my-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">32</span>
                <span className="font-['Space_Grotesk'] text-sm text-[#8E8E93]">/ 45 MIN</span>
              </div>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                71% DONE
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-xs uppercase text-white font-semibold mt-1">
              High-Intensity Interval Cardio
            </span>

            {/* Heart Rate Pulse Line */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#2A2A2A]/60">
              <div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                  AVG HEART RATE
                </span>
                <span className="font-['Space_Grotesk'] text-lg font-bold text-white">
                  154 <span className="text-xs text-[#8E8E93]">BPM</span>
                </span>
              </div>
              <div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                  PEAK STRAIN
                </span>
                <span className="font-['Space_Grotesk'] text-lg font-bold text-[#FFB4AB]">
                  178 <span className="text-xs text-[#8E8E93]">BPM</span>
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Strain Index */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                7-Day Strain Index
              </span>
              <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">
                Optimal (14.6 / 21.0)
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 h-14 items-end mt-1">
              <div className="bg-[#201F1F] h-[40%] rounded-t-xs" />
              <div className="bg-[#201F1F] h-[65%] rounded-t-xs" />
              <div className="bg-[#201F1F] h-[85%] rounded-t-xs" />
              <div className="bg-[#C5FF00] h-[72%] rounded-t-xs shadow-[0_0_8px_rgba(197,255,0,0.3)]" />
              <div className="bg-[#201F1F] h-[20%] rounded-t-xs opacity-40" />
              <div className="bg-[#201F1F] h-[50%] rounded-t-xs opacity-40" />
              <div className="bg-[#201F1F] h-[30%] rounded-t-xs opacity-40" />
            </div>
            <div className="flex justify-between font-['Space_Grotesk'] font-mono text-[10px] text-[#8D9479] pt-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span className="text-[#C5FF00] font-bold">T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>
        </div>

        {/* 4. Sleep Architecture & Recovery (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                Circadian Neuro-Recovery
              </span>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] bg-[#1C1B1B] border border-[#2A2A2A] px-2 py-0.5 rounded-sm font-bold">
                91% OPTIMAL
              </span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
              Sleep Architecture
            </h2>
          </div>

          {/* Main Sleep Metric */}
          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] text-3xl font-extrabold text-white">7h 42m</span>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#C5FF00] font-bold">
                +32m vs baseline
              </span>
            </div>
            <span className="font-['Plus_Jakarta_Sans'] text-xs text-[#C8C6C5] block mt-1">
              Autonomous REM and Slow-Wave restorative cycles locked.
            </span>
          </div>

          {/* Sleep Phase Segmentation Bar */}
          <div className="flex flex-col gap-2">
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#201F1F]">
              {/* Deep 23% */}
              <div className="bg-[#C5FF00] h-full" style={{ width: '23%' }} title="Deep Sleep (1h 48m)" />
              {/* REM 28% */}
              <div className="bg-white/80 h-full" style={{ width: '28%' }} title="REM Sleep (2h 10m)" />
              {/* Light 49% */}
              <div className="bg-[#474746] h-full" style={{ width: '49%' }} title="Light Sleep (3h 44m)" />
            </div>

            {/* Breakdown Legend */}
            <div className="grid grid-cols-3 gap-1 pt-1 text-center">
              <div className="flex flex-col bg-[#1C1B1B] p-2 rounded-sm border border-[#2A2A2A]/40">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF00]" />
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">Deep</span>
                </div>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-white mt-0.5">1h 48m</span>
                <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">23%</span>
              </div>

              <div className="flex flex-col bg-[#1C1B1B] p-2 rounded-sm border border-[#2A2A2A]/40">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">REM</span>
                </div>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-white mt-0.5">2h 10m</span>
                <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">28%</span>
              </div>

              <div className="flex flex-col bg-[#1C1B1B] p-2 rounded-sm border border-[#2A2A2A]/40">
                <div className="flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93]" />
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase">Light</span>
                </div>
                <span className="font-['Space_Grotesk'] text-xs font-bold text-white mt-0.5">3h 44m</span>
                <span className="font-['Space_Grotesk'] text-[10px] font-mono text-[#8E8E93]">49%</span>
              </div>
            </div>
          </div>

          {/* Recovery Readiness Footer */}
          <div className="flex items-center justify-between p-2.5 bg-[#1C1B1B] rounded-sm border border-[#2A2A2A]/60 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-[#C5FF00]" />
              <span className="font-['Space_Grotesk'] text-white font-bold">CNS READINESS</span>
            </div>
            <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-extrabold">
              94 / 100
            </span>
          </div>
        </div>

        {/* 5. Weight & Body Composition Trend (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-[#0E0E0E] p-5 sm:p-6 rounded-xl border border-[#2A2A2A] shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-['Space_Grotesk'] text-[11px] text-[#8D9479] uppercase tracking-wider font-bold">
                Somatic Mass Index
              </span>
              {/* Unit Toggle */}
              <div className="flex items-center bg-[#1C1B1B] border border-[#2A2A2A] p-0.5 rounded-sm">
                <button
                  onClick={() => setIsLbs(false)}
                  className={`px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-mono rounded-xs transition-colors cursor-pointer ${
                    !isLbs
                      ? 'bg-[#201F1F] text-[#C5FF00] font-bold border border-[#C5FF00]/40'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  KG
                </button>
                <button
                  onClick={() => setIsLbs(true)}
                  className={`px-2 py-0.5 font-['Space_Grotesk'] text-[10px] font-mono rounded-xs transition-colors cursor-pointer ${
                    isLbs
                      ? 'bg-[#201F1F] text-[#C5FF00] font-bold border border-[#C5FF00]/40'
                      : 'text-[#8E8E93] hover:text-white'
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
              Body Composition
            </h2>
          </div>

          {/* Current Weight Readout */}
          <div className="flex items-baseline justify-between my-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-['Space_Grotesk'] text-4xl font-extrabold text-white">
                {displayWeight}
              </span>
              <span className="font-['Space_Grotesk'] text-xs font-mono text-[#8D9479]">
                {isLbs ? 'LBS' : 'KG'}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase font-bold">
                Target Goal
              </span>
              <span className="font-['Space_Grotesk'] font-mono text-sm text-[#C5FF00] font-bold">
                {displayTargetWeight}
              </span>
            </div>
          </div>

          {/* 30-Day SVG Trend Line with rolling 7-day average */}
          <div className="flex flex-col gap-1 my-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] font-bold">
                30-DAY TRAJECTORY
              </span>
              <span className="font-['Space_Grotesk'] font-mono text-xs text-[#C5FF00]">
                -1.2 kg this month
              </span>
            </div>
            <div className="w-full h-24 relative flex items-center">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 80">
                {/* Target Dashed Line */}
                <line
                  x1="0"
                  y1="65"
                  x2="200"
                  y2="65"
                  stroke="#353534"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                {/* Rolling 7-day average */}
                <path
                  d="M0,20 Q40,25 70,35 T130,42 T200,52"
                  fill="none"
                  stroke="#8D9479"
                  strokeWidth="1.5"
                />
                {/* Daily Actual Points Curve */}
                <path
                  d="M0,15 L15,18 L30,12 L50,28 L70,25 L90,38 L110,34 L130,46 L150,42 L175,54 L200,49"
                  fill="none"
                  stroke="#C5FF00"
                  strokeWidth="2.5"
                />
                {/* Highlight Node */}
                <circle cx="200" cy="49" r="4" fill="#C5FF00" className="shadow-[0_0_8px_#C5FF00]" />
              </svg>
            </div>
          </div>

          {/* Body Metrics Sub-Table */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2A2A2A]/40">
            <div className="bg-[#1C1B1B] p-2 rounded-sm border border-[#2A2A2A]/40">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                Body Fat Est.
              </span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-white">12.8%</span>
            </div>
            <div className="bg-[#1C1B1B] p-2 rounded-sm border border-[#2A2A2A]/40">
              <span className="font-['Space_Grotesk'] text-[10px] text-[#8D9479] uppercase block font-bold">
                Skeletal Muscle
              </span>
              <span className="font-['Space_Grotesk'] text-sm font-bold text-[#C5FF00]">
                {isLbs ? '78.5 LBS' : '35.6 KG'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Deep Telemetry Action Bar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#0E0E0E] rounded-xl border border-[#2A2A2A] shadow-sm">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#C5FF00]" />
          <span className="font-['Space_Grotesk'] font-mono text-xs text-[#C8C6C5] uppercase">
            ENGINE FIRMWARE v4.12 • ALL TRANSMITTERS ONLINE
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsTargetsModalOpen(true)}
            className="px-4 py-2 bg-[#1C1B1B] hover:bg-[#201F1F] text-white font-['Space_Grotesk'] text-xs uppercase font-bold tracking-wider rounded-sm border border-[#2A2A2A] transition-all cursor-pointer"
          >
            Edit Daily Targets
          </button>
          <button
            onClick={() => setIsBioModalOpen(true)}
            className="px-4 py-2 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Log Biometric</span>
          </button>
        </div>
      </section>

      {/* MODAL 1: Log Biometric Entry */}
      {isBioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-6 max-w-md w-full shadow-2xl rounded-xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] uppercase tracking-wider font-bold">
                  Direct Telemetry Input
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                  Log Biometric Data
                </h3>
              </div>
              <button
                onClick={() => setIsBioModalOpen(false)}
                className="text-[#8E8E93] hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCommitBiometric} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Metric Category
                </label>
                <select
                  value={bioCategory}
                  onChange={(e) => setBioCategory(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Plus_Jakarta_Sans'] text-sm rounded-sm focus:outline-none focus:border-[#C5FF00]"
                >
                  <option>Weight & Mass (kg)</option>
                  <option>Resting Heart Rate (bpm)</option>
                  <option>Water Intake (ml)</option>
                  <option>Kinetic Steps</option>
                  <option>Blood Glucose (mg/dL)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Readout Value
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 72.4"
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value)}
                  className="bg-[#1C1B1B] border border-[#2A2A2A] p-2.5 text-white font-['Space_Grotesk'] text-xl font-bold rounded-sm focus:outline-none focus:border-[#C5FF00]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-['Space_Grotesk'] text-xs uppercase text-[#8D9479] font-bold">
                  Timestamp
                </label>
                <input
                  type="text"
                  readOnly
                  value="Today • 16:45:12 UTC (Live Transmit)"
                  className="bg-[#201F1F] border border-[#2A2A2A] p-2 text-[#8E8E93] font-['Space_Grotesk'] font-mono text-xs rounded-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
              >
                Commit Metric to LifeOS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Daily Targets */}
      {isTargetsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E0E0E] border border-[#2A2A2A] p-6 max-w-md w-full shadow-2xl rounded-xl flex flex-col gap-4 relative">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#C5FF00] uppercase tracking-wider font-bold">
                  Mission Optimization
                </span>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white uppercase">
                  Edit Daily Targets
                </h3>
              </div>
              <button
                onClick={() => setIsTargetsModalOpen(false)}
                className="text-[#8E8E93] hover:text-white p-1 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-['Space_Grotesk'] uppercase text-[#8D9479] font-bold">
                    Daily Step Goal
                  </label>
                  <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">
                    {targetStepGoal.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="20000"
                  step="500"
                  value={targetStepGoal}
                  onChange={(e) => setTargetStepGoal(parseInt(e.target.value, 10))}
                  className="accent-[#C5FF00] w-full cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-['Space_Grotesk'] uppercase text-[#8D9479] font-bold">
                    Daily Hydration Target
                  </label>
                  <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">
                    {targetHydroGoal.toFixed(1)} Liters
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.5"
                  step="0.25"
                  value={targetHydroGoal}
                  onChange={(e) => setTargetHydroGoal(parseFloat(e.target.value))}
                  className="accent-[#C5FF00] w-full cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-['Space_Grotesk'] uppercase text-[#8D9479] font-bold">
                    Cardio Active Minutes
                  </label>
                  <span className="font-['Space_Grotesk'] font-mono text-[#C5FF00] font-bold">
                    {targetActiveMins} Mins
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={targetActiveMins}
                  onChange={(e) => setTargetActiveMins(parseInt(e.target.value, 10))}
                  className="accent-[#C5FF00] w-full cursor-pointer"
                />
              </div>

              <button
                onClick={handleSaveTargets}
                className="w-full mt-2 py-3 bg-[#C5FF00] hover:bg-[#B5EB00] active:scale-[0.98] text-[#0A0A0A] font-['Space_Grotesk'] text-xs font-extrabold uppercase tracking-wider rounded-sm shadow-md transition-all cursor-pointer"
              >
                Save Engine Targets
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
