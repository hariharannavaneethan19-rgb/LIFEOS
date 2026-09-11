import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw, Plus, Droplets, CheckCircle2 } from 'lucide-react';

interface DateCalendarStripProps {
  onOpenLogModal?: () => void;
}

export const DateCalendarStrip: React.FC<DateCalendarStripProps> = ({ onOpenLogModal }) => {
  const { selectedDate, setSelectedDate, dailyRecords, currentDayRecord, openAddModal } = useLifeOS();

  // Helper to format date strings
  const formatDateDisplay = (dateStr: string) => {
    try {
      const parts = dateStr.split('-').map(Number);
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Generate 7-day strip centered or surrounding 2026-09-07
  // Sep 1 to Sep 7, 2026
  const weekDays = [
    { date: '2026-09-01', dayShort: 'Tue', dayNum: '1' },
    { date: '2026-09-02', dayShort: 'Wed', dayNum: '2' },
    { date: '2026-09-03', dayShort: 'Thu', dayNum: '3' },
    { date: '2026-09-04', dayShort: 'Fri', dayNum: '4' },
    { date: '2026-09-05', dayShort: 'Sat', dayNum: '5' },
    { date: '2026-09-06', dayShort: 'Sun', dayNum: '6' },
    { date: '2026-09-07', dayShort: 'Mon', dayNum: '7' },
  ];

  // Navigate back/forward 1 day
  const shiftDay = (delta: number) => {
    try {
      const parts = selectedDate.split('-').map(Number);
      const dateObj = new Date(parts[0], parts[1] - 1, parts[2] + delta);
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const d = String(dateObj.getDate()).padStart(2, '0');
      setSelectedDate(`${y}-${m}-${d}`);
    } catch {
      // fallback
    }
  };

  const isToday = selectedDate === '2026-09-07';

  // Stats for the active selected day
  const waterLogged = currentDayRecord?.waterLiters ?? 0;
  const waterTarget = currentDayRecord?.waterTargetLiters ?? 2.5;
  const waterPct = Math.min(100, Math.round((waterLogged / waterTarget) * 100));

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl p-5 sm:p-6 shadow-sm transition-all">
      {/* Top row: Date banner + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E5E5] dark:border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5FF00] border border-[#111111] dark:border-transparent" />
            <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7E7E7E] dark:text-[#A1A1AA]">
              DATE-WISE TRACKER
            </span>
            {isToday ? (
              <span className="px-2 py-0.5 rounded-full bg-[#111111] text-[#C5FF00] dark:bg-[#C5FF00] dark:text-[#111111] text-[10px] font-black tracking-wider uppercase">
                CURRENT DATE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#111111] dark:text-[#FFFFFF] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] font-black tracking-wider uppercase">
                HISTORICAL VIEW
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#111111] dark:text-[#FFFFFF] uppercase tracking-tight mt-1">
            {formatDateDisplay(selectedDate)}
          </h2>
        </div>

        {/* Action buttons: Today button, picker, prev/next */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isToday && (
            <button
              onClick={() => setSelectedDate('2026-09-07')}
              className="px-3 py-1.5 rounded-full bg-[#111111] text-[#C5FF00] dark:bg-[#C5FF00] dark:text-[#111111] hover:opacity-90 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Jump to Today</span>
            </button>
          )}

          <div className="flex items-center bg-[#F5F5F5] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded-full p-1">
            <button
              onClick={() => shiftDay(-1)}
              className="p-1.5 rounded-full text-[#111111] dark:text-[#FFFFFF] hover:bg-[#FFFFFF] dark:hover:bg-[#282828] hover:shadow-xs transition-all"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="relative flex items-center px-1">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) setSelectedDate(e.target.value);
                }}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                title="Choose custom date"
              />
              <span className="flex items-center gap-1 text-xs font-bold text-[#111111] dark:text-[#FFFFFF] px-2 py-1 rounded-full hover:bg-[#FFFFFF] dark:hover:bg-[#282828] transition-colors cursor-pointer">
                <CalendarIcon className="w-3.5 h-3.5 text-[#7E7E7E] dark:text-[#A1A1AA]" />
                <span className="hidden sm:inline">Calendar</span>
              </span>
            </div>
            <button
              onClick={() => shiftDay(1)}
              className="p-1.5 rounded-full text-[#111111] dark:text-[#FFFFFF] hover:bg-[#FFFFFF] dark:hover:bg-[#282828] hover:shadow-xs transition-all"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => (onOpenLogModal ? onOpenLogModal() : openAddModal('health'))}
            className="px-3.5 py-1.5 rounded-full btn-nike-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#C5FF00]" />
            <span>Log for this date</span>
          </button>
        </div>
      </div>

      {/* Week Calendar Strip with Activity Dots */}
      <div className="pt-4">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((item) => {
            const isSelected = item.date === selectedDate;
            const rec = dailyRecords[item.date];
            const hasData = rec && (rec.waterLiters > 0 || rec.steps > 0 || rec.completedHabitIds.length > 0);
            const reachedTarget = rec && rec.waterLiters >= rec.waterTargetLiters;

            return (
              <button
                key={item.date}
                onClick={() => setSelectedDate(item.date)}
                className={`flex flex-col items-center py-2.5 sm:py-3 px-1 rounded-2xl transition-all border ${
                  isSelected
                    ? 'bg-[#111111] text-[#FFFFFF] dark:bg-[#C5FF00] dark:text-[#111111] border-[#111111] dark:border-[#C5FF00] shadow-md -translate-y-0.5'
                    : 'bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#111111] dark:text-[#FFFFFF] border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#111111]/30 dark:hover:border-[#C5FF00]/40 hover:bg-[#EAEAEA] dark:hover:bg-[#262626]'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    isSelected
                      ? 'text-[#C5FF00] dark:text-[#111111]'
                      : 'text-[#7E7E7E] dark:text-[#A1A1AA]'
                  }`}
                >
                  {item.dayShort}
                </span>
                <span className="text-base sm:text-lg font-black tabular-nums mt-0.5">
                  {item.dayNum}
                </span>
                
                {/* Indicator dot: Volt if data logged */}
                <div className="mt-1 flex items-center gap-0.5 h-2">
                  {hasData && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        reachedTarget ? 'bg-[#C5FF00]' : 'bg-[#FA5400]'
                      }`}
                      title={reachedTarget ? 'Target met' : 'Data logged'}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Quick Summary Banner: Hydration & Move */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#F5F5F5] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-[#262626] text-[#C5FF00] flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4 fill-[#C5FF00]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-[#111111] dark:text-[#FFFFFF]">
                Daily Hydration on {selectedDate}:
              </span>
              <span className="text-xs font-extrabold text-[#111111] dark:text-[#C5FF00] tabular-nums">
                {waterLogged.toFixed(2)}L / {waterTarget.toFixed(2)}L
              </span>
              <span className="text-[10px] font-bold text-[#7E7E7E] dark:text-[#A1A1AA]">
                ({waterPct}% of daily limit)
              </span>
            </div>
            <div className="w-48 sm:w-64 h-1.5 bg-[#E5E5E5] dark:bg-[#2A2A2A] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-[#111111] dark:bg-[#C5FF00] rounded-full transition-all duration-500"
                style={{ width: `${waterPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAddModal('health')}
            className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg bg-[#FFFFFF] dark:bg-[#222222] border border-[#E5E5E5] dark:border-[#333333] hover:border-[#111111] dark:hover:border-[#C5FF00] text-[#111111] dark:text-[#FFFFFF] transition-all"
          >
            Adjust Water Limit
          </button>
        </div>
      </div>
    </div>
  );
};
