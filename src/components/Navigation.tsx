import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { LayoutGrid, HeartPulse, Wallet, CheckSquare, Flag, Bot } from 'lucide-react';
import { ScreenTab } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsAiCoachOpen } = useLifeOS();

  const mobileTabs: { id: ScreenTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'DASH', icon: LayoutGrid },
    { id: 'fitness', label: 'HEALTH', icon: HeartPulse },
    { id: 'finance', label: 'FINANCE', icon: Wallet },
    { id: 'habits', label: 'HABITS', icon: CheckSquare },
    { id: 'goals', label: 'GOALS', icon: Flag },
  ];

  return (
    <>
      {/* Floating Mobile AI Coach Pill */}
      <aside className="fixed right-4 bottom-20 z-50 lg:hidden">
        <button
          onClick={() => setIsAiCoachOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#111111] text-white dark:bg-[#C5FF00] dark:text-[#111111] rounded-full shadow-lg active:scale-95 transition-all cursor-pointer border border-[#2A2A2A]"
          title="Launch AI Performance Coach"
        >
          <span className="w-2 h-2 rounded-full bg-[#C5FF00] dark:bg-[#111111] animate-pulse" />
          <Bot className="w-4 h-4" />
          <span className="font-['Barlow_Condensed'] text-xs font-black uppercase tracking-wider">
            COACH AI
          </span>
        </button>
      </aside>

      {/* Persistent Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 dark:bg-[#0E0E0E]/95 backdrop-blur-xl border-t border-[#E5E5E5] dark:border-[#1F1F1F] px-4 py-2 flex justify-between items-center lg:hidden select-none transition-colors shadow-lg">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#111111] dark:text-[#C5FF00]'
                  : 'text-[#707072] dark:text-[#8E8E93] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`font-['Barlow_Condensed'] text-xs tracking-wider mt-1 uppercase ${
                  isActive ? 'font-black' : 'font-bold'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
