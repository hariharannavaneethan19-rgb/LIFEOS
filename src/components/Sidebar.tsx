import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { BrandLogo } from './BrandLogo';
import {
  LayoutGrid,
  HeartPulse,
  Wallet,
  CheckCircle2,
  Flag,
  LineChart,
  Bot,
  User,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { ScreenTab } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsAiCoachOpen,
    authState,
    profile,
    toggleTheme,
  } = useLifeOS();

  const userName = authState.user?.name || profile?.name || 'Marcus Vance';
  const isDark = profile?.theme === 'dark';

  const navItems = [
    { id: 'home' as ScreenTab, label: 'Dashboard', icon: LayoutGrid },
    { id: 'fitness' as ScreenTab, label: 'Health', icon: HeartPulse },
    { id: 'finance' as ScreenTab, label: 'Finance', icon: Wallet },
    { id: 'habits' as ScreenTab, label: 'Habits', icon: CheckCircle2 },
    { id: 'goals' as ScreenTab, label: 'Goals', icon: Flag },
    { id: 'insights' as ScreenTab, label: 'Analytics', icon: LineChart },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#FFFFFF] dark:bg-[#0E0E0E] border-r border-[#E5E5E5] dark:border-[#2A2A2A] z-50 flex flex-col justify-between hidden lg:flex select-none transition-colors shadow-[1px_0_4px_rgba(0,0,0,0.02)]">
      {/* Top Branding & Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between">
          <BrandLogo size="md" />
          <div className="h-2 w-2 rounded-full bg-[#111111] dark:bg-[#C5FF00] shadow-[0_0_8px_#C5FF00] animate-pulse" />
        </div>

        {/* Section Heading */}
        <div className="px-5 pt-5 pb-2">
          <span className="font-['Barlow_Condensed'] text-xs font-bold uppercase text-[#707072] dark:text-[#8D9479] tracking-wider">
            ATHLETIC NAVIGATION
          </span>
        </div>

        {/* Nav Links (Nike Pill Style) */}
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all font-['Barlow_Condensed'] text-base tracking-wide uppercase font-bold text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-white dark:bg-[#C5FF00] dark:text-[#111111] font-black shadow-sm'
                    : 'text-[#707072] hover:text-[#111111] dark:text-[#C8C6C5] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1C1B1B]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-[#C5FF00] dark:text-[#111111]'
                      : 'text-[#8E8E93]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* AI Coach Action Link */}
          <button
            onClick={() => setIsAiCoachOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-[#707072] hover:text-[#111111] dark:text-[#C8C6C5] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1C1B1B] transition-all font-['Barlow_Condensed'] text-base tracking-wide uppercase font-bold text-left group cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#111111] dark:text-[#C5FF00] group-hover:scale-110 transition-transform" />
            <span className="flex-1">AI Coach</span>
            <span className="w-2 h-2 rounded-full bg-[#FA5400] dark:bg-[#C5FF00] animate-pulse" />
          </button>

          {/* Profile Link */}
          <button
            onClick={() => setActiveTab('me')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-all font-['Barlow_Condensed'] text-base tracking-wide uppercase font-bold text-left cursor-pointer ${
              activeTab === 'me'
                ? 'bg-[#111111] text-white dark:bg-[#C5FF00] dark:text-[#111111] font-black shadow-sm'
                : 'text-[#707072] hover:text-[#111111] dark:text-[#C8C6C5] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#1C1B1B]'
            }`}
          >
            <User
              className={`w-4 h-4 ${
                activeTab === 'me'
                  ? 'text-[#C5FF00] dark:text-[#111111]'
                  : 'text-[#8E8E93]'
              }`}
            />
            <span>Profile</span>
          </button>
        </nav>
      </div>

      {/* Bottom Profile & Telemetry Controls */}
      <div className="p-4 border-t border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col gap-3 bg-[#FAFAFA] dark:bg-[#0E0E0E]">
        {/* User Card */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('me')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-full border border-[#111111] dark:border-[#434933] overflow-hidden bg-[#111111] text-white dark:bg-[#1C1B1B] dark:text-[#C5FF00] flex items-center justify-center font-['Barlow_Condensed'] font-black text-xs">
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'MV'}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-['Barlow_Condensed'] text-sm font-bold text-[#111111] dark:text-white uppercase truncate max-w-[120px]">
                {userName}
              </span>
              <span className="font-['Barlow_Condensed'] text-[11px] text-[#FA5400] dark:text-[#C5FF00] font-black tracking-wider">
                CHAMPION TIER
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('me')}
            className="text-[#707072] hover:text-[#111111] dark:text-[#8E8E93] dark:hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            title="Account & System Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]/80 text-xs">
          <span className="font-['Barlow_Condensed'] text-xs font-bold tracking-wider text-[#707072] dark:text-[#8E8E93] uppercase">
            DISPLAY THEME
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] dark:bg-[#1C1B1B] hover:bg-[#F0F0F0] dark:hover:bg-[#2A2A2A] text-[#111111] dark:text-white border border-[#E5E5E5] dark:border-[#2A2A2A] transition-colors cursor-pointer shadow-xs"
            title="Toggle Nike Stark White / Obsidian Dark Mode"
          >
            {isDark ? (
              <>
                <Moon className="w-3 h-3 text-[#C5FF00]" />
                <span className="font-['Barlow_Condensed'] text-xs font-bold text-white uppercase">
                  DARK
                </span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-[#FA5400]" />
                <span className="font-['Barlow_Condensed'] text-xs font-bold text-[#111111] uppercase">
                  LIGHT
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
