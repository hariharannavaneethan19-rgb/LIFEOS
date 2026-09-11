import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { BrandLogo } from './BrandLogo';
import { Bell, ArrowRight, Sun, Moon, Search, Heart } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    setIsAiCoachOpen,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    toggleTheme,
    authState,
  } = useLifeOS();

  const userName = authState.user?.name || profile?.name || 'Marcus Vance';
  const isDark = profile?.theme === 'dark';

  const daysOfWeek = [
    { day: 'MON', date: '07', fullDate: '2026-09-07' },
    { day: 'TUE', date: '08', fullDate: '2026-09-08' },
    { day: 'WED', date: '09', fullDate: '2026-09-09' },
    { day: 'THU', date: '10', fullDate: '2026-09-10' },
    { day: 'FRI', date: '11', fullDate: '2026-09-11' },
    { day: 'SAT', date: '12', fullDate: '2026-09-12' },
    { day: 'SUN', date: '13', fullDate: '2026-09-13' },
  ];

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-[#FFFFFF] dark:bg-[#0E0E0E] border-b border-[#E5E5E5] dark:border-[#2A2A2A] z-40 px-4 sm:px-6 flex items-center justify-between transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left side: Mobile Brand / Status Indicator & Date strip */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile-only Logo */}
        <div className="lg:hidden">
          <BrandLogo size="sm" showText={true} />
        </div>

        {/* Nike Kickoff System Beacon Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#F5F5F5] dark:bg-[#1C1B1B] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-full">
          <span className="h-2 w-2 rounded-full bg-[#111111] dark:bg-[#C5FF00] animate-pulse" />
          <span className="font-['Barlow_Condensed'] text-xs font-bold text-[#111111] dark:text-white uppercase tracking-wider">
            RUN YOUR LIFE
          </span>
        </div>

        {/* Weekly Header Strip (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 bg-[#F5F5F5] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] p-1 rounded-full">
          {daysOfWeek.map((d) => {
            const isSelected = selectedDate === d.fullDate;
            return (
              <button
                key={d.fullDate}
                onClick={() => setSelectedDate(d.fullDate)}
                className={`px-3 py-0.5 flex flex-col items-center rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] dark:bg-[#2A2A2A] text-white shadow-sm'
                    : 'text-[#707072] hover:text-[#111111] dark:hover:text-white hover:bg-[#EAEAEA] dark:hover:bg-[#1F1F1F]'
                }`}
              >
                <span className="font-['Barlow_Condensed'] text-[10px] uppercase font-bold leading-none">
                  {d.day}
                </span>
                <span className="font-['Barlow_Condensed'] text-xs font-bold leading-tight mt-0.5">
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: Search Pill, Theme toggle, Notifications, AI Coach Trigger, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Nike Search Pill (Matches screenshot) */}
        <div
          onClick={() => setIsAiCoachOpen(true)}
          className="hidden md:flex items-center gap-2 bg-[#F5F5F5] dark:bg-[#1C1B1B] hover:bg-[#EAEAEA] dark:hover:bg-[#242424] text-[#707072] dark:text-[#A1A1AA] border border-[#E5E5E5] dark:border-[#2A2A2A] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-medium">Search metrics or ask AI...</span>
        </div>

        {/* Theme quick toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-[#707072] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-white rounded-full hover:bg-[#F5F5F5] dark:hover:bg-[#1C1B1B] transition-colors cursor-pointer"
          title="Toggle Light / Dark Mode"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-[#C5FF00]" />
          ) : (
            <Moon className="w-4 h-4 text-[#111111]" />
          )}
        </button>

        {/* Notifications Icon Button */}
        <button
          className="relative p-2 text-[#707072] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-white rounded-full hover:bg-[#F5F5F5] dark:hover:bg-[#1C1B1B] transition-colors cursor-pointer"
          title="Telemetry Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FA5400] shadow-[0_0_6px_#FA5400]" />
        </button>

        {/* ASK AI COACH Pill Button (Nike styling) */}
        <button
          onClick={() => setIsAiCoachOpen(true)}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#111111] hover:bg-black text-white dark:bg-[#C5FF00] dark:hover:bg-[#B5EB00] dark:text-[#111111] rounded-full transition-all group cursor-pointer shadow-sm active:scale-95"
          title="Launch AI Performance Coach"
        >
          <span className="h-2 w-2 rounded-full bg-[#C5FF00] dark:bg-[#111111] group-hover:scale-125 transition-transform" />
          <span className="font-['Barlow_Condensed'] text-xs font-black uppercase tracking-wider">
            ASK AI COACH
          </span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveTab('me')}
          className="w-8 h-8 rounded-full border-2 border-[#111111] dark:border-[#C5FF00] overflow-hidden bg-[#111111] text-white dark:bg-[#1C1B1B] dark:text-[#C5FF00] flex items-center justify-center font-['Barlow_Condensed'] font-black text-xs cursor-pointer transition-transform hover:scale-105"
          title="View Profile & Settings"
        >
          {userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() || 'MV'}
        </button>
      </div>
    </header>
  );
};
