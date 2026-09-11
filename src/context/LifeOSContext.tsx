import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  DailyRecord,
  HealthData,
  FinanceData,
  HabitItem,
  GoalItem,
  NoteItem,
  LifeScoreWeights,
  LifeScoreBreakdown,
  UserProfile,
  AiInsightState,
  ChatMessage,
  ScreenTab,
  ExpenseItem,
  RecommendedGoal,
  AuthState,
  AuthUser,
  AuthAccount,
} from '../types';
import {
  initialHealth,
  initialFinance,
  initialHabits,
  initialGoals,
  initialNotes,
  initialWeights,
  initialProfile,
  initialAiInsight,
  initialRecommendedGoals,
  initialDailyRecords,
  createDefaultDailyRecord,
  zeroHealth,
  zeroFinance,
  zeroAiInsight,
} from '../data/initialData';

interface LifeOSContextType {
  // State
  health: HealthData;
  finance: FinanceData;
  habits: HabitItem[];
  goals: GoalItem[];
  notes: NoteItem[];
  weights: LifeScoreWeights;
  profile: UserProfile;
  activeTab: ScreenTab;
  isAddModalOpen: boolean;
  addModalDefaultTab: 'health' | 'finance' | 'habit' | 'goal' | 'note';
  isAiCoachOpen: boolean;
  aiInsight: AiInsightState;
  chatMessages: ChatMessage[];
  isGeneratingAi: boolean;

  // Calendar & Date-wise Storage
  selectedDate: string; // 'YYYY-MM-DD'
  setSelectedDate: (date: string) => void;
  dailyRecords: Record<string, DailyRecord>;
  currentDayRecord: DailyRecord;
  getDailyRecord: (date: string) => DailyRecord;
  updateDailyRecord: (date: string, updates: Partial<DailyRecord>) => void;
  setWaterForDate: (date: string, liters: number, targetLimit?: number) => void;
  setWaterLimitForDate: (date: string, targetLiters: number) => void;
  setStepsForDate: (date: string, steps: number, target?: number) => void;
  setSleepForDate: (date: string, hours: number, minutes: number, targetHours?: number) => void;
  setExerciseForDate: (date: string, minutes: number, targetMinutes?: number) => void;
  setWeightForDate: (date: string, weightKg: number) => void;
  toggleHabitForDate: (date: string, habitId: string) => void;

  // AI Goal Recommendations
  recommendedGoals: RecommendedGoal[];
  isRecommendingGoals: boolean;
  fetchGoalRecommendations: () => Promise<void>;
  acceptRecommendedGoal: (goal: RecommendedGoal) => void;
  dismissRecommendedGoal: (id: string) => void;

  // Authentication & Real Accounts
  authState: AuthState;
  authScreen: 'welcome' | 'signin' | 'signup' | null;
  setAuthScreen: (screen: 'welcome' | 'signin' | 'signup' | null) => void;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password?: string, startClean?: boolean) => { success: boolean; error?: string };
  logout: () => void;
  registeredAccounts: AuthAccount[];

  // Computed
  lifeScoreBreakdown: LifeScoreBreakdown;

  // Actions
  setActiveTab: (tab: ScreenTab) => void;
  setIsAddModalOpen: (open: boolean) => void;
  openAddModal: (tab?: 'health' | 'finance' | 'habit' | 'goal' | 'note') => void;
  setIsAiCoachOpen: (open: boolean) => void;

  // Zero-Data Reset & Demo Data
  resetToZeroData: () => void;
  resetToDemoData: () => void;

  // Health CRUD & Corrections
  addWater: (liters: number) => void;
  logWeight: (weightKg: number) => void;
  logSteps: (steps: number) => void;
  logSleep: (hours: number, minutes: number) => void;
  logExercise: (minutes: number) => void;
  setHealthMetric: (metric: 'weight' | 'water' | 'steps' | 'sleep' | 'exercise', val1: number, val2?: number) => void;
  deleteHealthHistoryItem: (date: string) => void;

  // Finance CRUD & Corrections
  addTransaction: (title: string, amount: number, category: ExpenseItem['category']) => void;
  editTransaction: (id: string, updated: { title: string; amount: number; category: ExpenseItem['category'] }) => void;
  deleteTransaction: (id: string) => void;
  addIncome: (amount: number) => void;
  updateFinanceBudget: (monthlyIncome: number, monthlyBudget: number) => void;

  // Habits CRUD & Corrections
  toggleHabit: (id: string) => void;
  addHabit: (title: string, category: HabitItem['category']) => void;
  editHabit: (id: string, updated: { title?: string; category?: HabitItem['category']; streakDays?: number }) => void;
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  deleteHabit: (id: string) => void;

  // Goals CRUD & Corrections
  addGoal: (goal: Omit<GoalItem, 'id'>) => void;
  editGoal: (id: string, updated: Partial<GoalItem>) => void;
  updateGoalProgress: (id: string, delta: number) => void;
  setGoalValue: (id: string, value: number) => void;
  deleteGoal: (id: string) => void;

  // Notes
  addNote: (title: string, content: string, tag: string) => void;
  deleteNote: (id: string) => void;

  // Settings & Weights
  updateWeights: (weights: LifeScoreWeights) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleTheme: () => void;

  // AI
  refreshAiInsights: () => Promise<void>;
  sendChatMessage: (message: string) => Promise<void>;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults with safe type checks
  const [health, setHealth] = useState<HealthData>(() => {
    try {
      const saved = localStorage.getItem('lifeos_health');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initialHealth,
            ...parsed,
            history: Array.isArray(parsed.history) ? parsed.history : initialHealth.history,
          };
        }
      }
    } catch {
      // fallback
    }
    return initialHealth;
  });

  const [finance, setFinance] = useState<FinanceData>(() => {
    try {
      const saved = localStorage.getItem('lifeos_finance');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initialFinance,
            ...parsed,
            categories: Array.isArray(parsed.categories) ? parsed.categories : initialFinance.categories,
            recentTransactions: Array.isArray(parsed.recentTransactions) ? parsed.recentTransactions : initialFinance.recentTransactions,
          };
        }
      }
    } catch {
      // fallback
    }
    return initialFinance;
  });

  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem('lifeos_habits');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return initialHabits;
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    try {
      const saved = localStorage.getItem('lifeos_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return initialGoals;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('lifeos_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return initialNotes;
  });

  const [weights, setWeights] = useState<LifeScoreWeights>(() => {
    try {
      const saved = localStorage.getItem('lifeos_weights');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            health: typeof parsed.health === 'number' ? parsed.health : initialWeights.health,
            finance: typeof parsed.finance === 'number' ? parsed.finance : initialWeights.finance,
            habits: typeof parsed.habits === 'number' ? parsed.habits : initialWeights.habits,
            goals: typeof parsed.goals === 'number' ? parsed.goals : initialWeights.goals,
          };
        }
      }
    } catch {
      // fallback
    }
    return initialWeights;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lifeos_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [aiInsight, setAiInsight] = useState<AiInsightState>(() => {
    try {
      const saved = localStorage.getItem('lifeos_ai_insight');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...initialAiInsight,
            ...parsed,
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : initialAiInsight.strengths,
            opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : initialAiInsight.opportunities,
            correlations: Array.isArray(parsed.correlations) ? parsed.correlations : initialAiInsight.correlations,
            suggestedFocus: Array.isArray(parsed.suggestedFocus) ? parsed.suggestedFocus : initialAiInsight.suggestedFocus,
          };
        }
      }
    } catch {
      // fallback
    }
    return initialAiInsight;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-1',
        role: 'assistant',
        content: `Good morning! 👋 I am your LIFEOS Personal Intelligence Engine.\n\nI have synchronized your Health, Money, Habits, and Goals. Your Life Score is ready.\n\nAsk me anything: "How am I doing?", "Where am I spending too much?", or "Why did my Life Score change?"`,
        timestamp: '9:00 AM',
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalDefaultTab, setAddModalDefaultTab] = useState<'health' | 'finance' | 'habit' | 'goal' | 'note'>('health');
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // AI Goal Recommendations State
  const [recommendedGoals, setRecommendedGoals] = useState<RecommendedGoal[]>(() => {
    try {
      const saved = localStorage.getItem('lifeos_recommended_goals');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialRecommendedGoals;
  });
  const [isRecommendingGoals, setIsRecommendingGoals] = useState(false);

  // Calendar & Date-wise Storage State (default to 2026-09-07)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('lifeos_selected_date');
      if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
    } catch {}
    return '2026-09-07';
  });

  const [dailyRecords, setDailyRecords] = useState<Record<string, DailyRecord>>(() => {
    try {
      const saved = localStorage.getItem('lifeos_daily_records');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return { ...initialDailyRecords, ...parsed };
        }
      }
    } catch {}
    return initialDailyRecords;
  });

  useEffect(() => {
    localStorage.setItem('lifeos_selected_date', selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem('lifeos_daily_records', JSON.stringify(dailyRecords));
  }, [dailyRecords]);

  const getDailyRecord = (date: string): DailyRecord => {
    if (dailyRecords[date]) {
      return dailyRecords[date];
    }
    return createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
  };

  const currentDayRecord = useMemo(() => {
    return getDailyRecord(selectedDate);
  }, [dailyRecords, selectedDate, health?.waterTargetLiters]);

  // Sync health display whenever selectedDate or dailyRecords change
  useEffect(() => {
    const rec = dailyRecords[selectedDate] || createDefaultDailyRecord(selectedDate, health?.waterTargetLiters || 2.5);
    setHealth((prev) => ({
      ...prev,
      waterLiters: rec.waterLiters,
      waterTargetLiters: rec.waterTargetLiters,
      steps: rec.steps,
      stepsTarget: rec.stepsTarget,
      sleepHours: rec.sleepHours,
      sleepMinutes: rec.sleepMinutes,
      sleepTargetHours: rec.sleepTargetHours,
      exerciseMinutes: rec.exerciseMinutes,
      exerciseTargetMinutes: rec.exerciseTargetMinutes,
      exerciseCompleted: rec.exerciseMinutes > 0,
      weightKg: rec.weightKg,
    }));
  }, [selectedDate]);

  // Standard demo account available for instant testing if desired
  const defaultAccounts: AuthAccount[] = [
    {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@lifeos.app',
      passwordHash: 'lifeos2026',
      createdAt: 'September 2026',
    },
  ];

  // Registered Accounts Store
  const [registeredAccounts, setRegisteredAccounts] = useState<AuthAccount[]>(() => {
    try {
      const saved = localStorage.getItem('lifeos_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return defaultAccounts;
  });

  // Auth State - STRICT: Starts unauthenticated unless a legitimate session exists
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem('lifeos_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any old hardcoded demo "Harix" / "u-1" session so it prompts sign-in properly
        if (parsed && typeof parsed === 'object') {
          if (parsed.user?.name === 'Harix' || parsed.user?.id === 'u-1') {
            localStorage.removeItem('lifeos_auth');
            return { isAuthenticated: false, user: null };
          }
          if (parsed.isAuthenticated && parsed.user?.email) {
            return parsed;
          }
        }
      }
    } catch {}
    return {
      isAuthenticated: false,
      user: null,
    };
  });
  const [authScreen, setAuthScreen] = useState<'welcome' | 'signin' | 'signup' | null>('signin');

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('lifeos_accounts', JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    localStorage.setItem('lifeos_recommended_goals', JSON.stringify(recommendedGoals));
  }, [recommendedGoals]);

  useEffect(() => {
    localStorage.setItem('lifeos_auth', JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem('lifeos_health', JSON.stringify(health));
  }, [health]);

  useEffect(() => {
    localStorage.setItem('lifeos_finance', JSON.stringify(finance));
  }, [finance]);

  useEffect(() => {
    localStorage.setItem('lifeos_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lifeos_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('lifeos_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('lifeos_weights', JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    localStorage.setItem('lifeos_profile', JSON.stringify(profile));
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('lifeos_ai_insight', JSON.stringify(aiInsight));
  }, [aiInsight]);

  // Compute Life Score dynamically
  const lifeScoreBreakdown = useMemo((): LifeScoreBreakdown => {
    // 1. Health Score (Weight 40%)
    const waterScore = Math.min(100, Math.round((health.waterLiters / health.waterTargetLiters) * 100));
    const stepsScore = Math.min(100, Math.round((health.steps / health.stepsTarget) * 100));
    const sleepTotalHours = health.sleepHours + health.sleepMinutes / 60;
    const sleepScore = Math.min(100, Math.round((sleepTotalHours / health.sleepTargetHours) * 100));
    const exerciseScore = health.exerciseCompleted ? 100 : Math.min(100, Math.round((health.exerciseMinutes / health.exerciseTargetMinutes) * 100));
    const healthScore = Math.round((waterScore * 0.2 + stepsScore * 0.25 + sleepScore * 0.3 + exerciseScore * 0.25));

    // 2. Finance Score (Weight 30%)
    const currentSavingsRate = finance.monthlyIncome > 0
      ? Math.max(0, Math.round(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome) * 100))
      : 0;
    const savingsScore = Math.min(100, Math.round((currentSavingsRate / finance.savingsTargetRate) * 100));
    const budgetScore = finance.monthlyBudget > 0
      ? Math.max(0, Math.min(100, Math.round((1 - finance.monthlyExpenses / finance.monthlyBudget) * 100 + 40)))
      : 80;
    const financeScore = Math.round(savingsScore * 0.6 + budgetScore * 0.4);

    // 3. Habits Score (Weight 20%)
    const completedCount = habits.filter((h) => h.completedToday).length;
    const habitsScore = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 80;

    // 4. Goals Score (Weight 10%)
    const totalGoalsPct = goals.reduce((acc, g) => {
      const pct = g.targetValue > 0 ? Math.min(100, Math.round((g.currentValue / g.targetValue) * 100)) : 0;
      return acc + pct;
    }, 0);
    const goalsScore = goals.length > 0 ? Math.round(totalGoalsPct / goals.length) : 75;

    // 5. Productivity (Supplemental)
    const productivityScore = Math.round((habitsScore * 0.6 + goalsScore * 0.4));

    // Composite weighted score
    const safeWeights = {
      health: typeof weights?.health === 'number' ? weights.health : initialWeights.health,
      finance: typeof weights?.finance === 'number' ? weights.finance : initialWeights.finance,
      habits: typeof weights?.habits === 'number' ? weights.habits : initialWeights.habits,
      goals: typeof weights?.goals === 'number' ? weights.goals : initialWeights.goals,
    };
    const totalWeight = safeWeights.health + safeWeights.finance + safeWeights.habits + safeWeights.goals;
    const compositeScore = totalWeight > 0
      ? Math.round(
          (healthScore * safeWeights.health +
            financeScore * safeWeights.finance +
            habitsScore * safeWeights.habits +
            goalsScore * safeWeights.goals) /
            totalWeight
        )
      : 82;

    const hasAnyData =
      health.weightKg > 0 ||
      health.steps > 0 ||
      health.waterLiters > 0 ||
      finance.monthlyIncome > 0 ||
      finance.recentTransactions.length > 0 ||
      habits.length > 0 ||
      goals.length > 0;

    return {
      healthScore: hasAnyData ? healthScore : 0,
      financeScore: hasAnyData ? financeScore : 0,
      habitsScore: hasAnyData ? habitsScore : 0,
      goalsScore: hasAnyData ? goalsScore : 0,
      productivityScore: hasAnyData ? productivityScore : 0,
      compositeScore: hasAnyData ? compositeScore : 0,
      percentageChange: hasAnyData ? 4.2 : 0,
    };
  }, [health, finance, habits, goals, weights]);

  // Open Add modal with specific category preselected
  const openAddModal = (tab: 'health' | 'finance' | 'habit' | 'goal' | 'note' = 'health') => {
    setAddModalDefaultTab(tab);
    setIsAddModalOpen(true);
  };

  // Daily Records & Date Actions
  const updateDailyRecord = (date: string, updates: Partial<DailyRecord>) => {
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          ...updates,
        },
      };
    });
  };

  const setWaterForDate = (date: string, liters: number, targetLimit?: number) => {
    const cleanLiters = Math.max(0, Number(liters.toFixed(2)));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          waterLiters: cleanLiters,
          ...(typeof targetLimit === 'number' ? { waterTargetLiters: Math.max(0.5, Number(targetLimit.toFixed(2))) } : {}),
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        waterLiters: cleanLiters,
        ...(typeof targetLimit === 'number' ? { waterTargetLiters: Math.max(0.5, Number(targetLimit.toFixed(2))) } : {}),
      }));
    }
  };

  const setWaterLimitForDate = (date: string, targetLiters: number) => {
    const cleanTarget = Math.max(0.5, Number(targetLiters.toFixed(2)));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, cleanTarget);
      return {
        ...prev,
        [date]: {
          ...existing,
          waterTargetLiters: cleanTarget,
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        waterTargetLiters: cleanTarget,
      }));
    }
  };

  const setStepsForDate = (date: string, steps: number, target?: number) => {
    const cleanSteps = Math.max(0, Math.round(steps));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          steps: cleanSteps,
          ...(typeof target === 'number' ? { stepsTarget: Math.max(100, Math.round(target)) } : {}),
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        steps: cleanSteps,
        ...(typeof target === 'number' ? { stepsTarget: Math.max(100, Math.round(target)) } : {}),
      }));
    }
  };

  const setSleepForDate = (date: string, hours: number, minutes: number, targetHours?: number) => {
    const cleanHours = Math.max(0, Math.round(hours));
    const cleanMinutes = Math.min(59, Math.max(0, Math.round(minutes)));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          sleepHours: cleanHours,
          sleepMinutes: cleanMinutes,
          ...(typeof targetHours === 'number' ? { sleepTargetHours: Math.max(1, Math.round(targetHours)) } : {}),
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        sleepHours: cleanHours,
        sleepMinutes: cleanMinutes,
        ...(typeof targetHours === 'number' ? { sleepTargetHours: Math.max(1, Math.round(targetHours)) } : {}),
      }));
    }
  };

  const setExerciseForDate = (date: string, minutes: number, targetMinutes?: number) => {
    const cleanMins = Math.max(0, Math.round(minutes));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          exerciseMinutes: cleanMins,
          ...(typeof targetMinutes === 'number' ? { exerciseTargetMinutes: Math.max(5, Math.round(targetMinutes)) } : {}),
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        exerciseMinutes: cleanMins,
        exerciseCompleted: cleanMins > 0,
        ...(typeof targetMinutes === 'number' ? { exerciseTargetMinutes: Math.max(5, Math.round(targetMinutes)) } : {}),
      }));
    }
  };

  const setWeightForDate = (date: string, weightKg: number) => {
    const cleanWeight = Math.max(0, Number(weightKg.toFixed(1)));
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      return {
        ...prev,
        [date]: {
          ...existing,
          weightKg: cleanWeight,
        },
      };
    });
    if (date === selectedDate) {
      setHealth((prev) => ({
        ...prev,
        weightKg: cleanWeight,
        weightDeltaKg: prev.weightKg > 0 ? Number((cleanWeight - prev.weightKg).toFixed(1)) : 0,
      }));
    }
  };

  const toggleHabitForDate = (date: string, habitId: string) => {
    setDailyRecords((prev) => {
      const existing = prev[date] || createDefaultDailyRecord(date, health?.waterTargetLiters || 2.5);
      const isCompleted = existing.completedHabitIds.includes(habitId);
      const newIds = isCompleted
        ? existing.completedHabitIds.filter((id) => id !== habitId)
        : [...existing.completedHabitIds, habitId];
      return {
        ...prev,
        [date]: {
          ...existing,
          completedHabitIds: newIds,
        },
      };
    });
    if (date === selectedDate) {
      toggleHabit(habitId);
    }
  };

  // Health Actions
  const addWater = (liters: number) => {
    const currentLiters = dailyRecords[selectedDate]?.waterLiters ?? health.waterLiters;
    const newWater = Math.max(0, Number((currentLiters + liters).toFixed(2)));
    setWaterForDate(selectedDate, newWater);
  };

  const logWeight = (weightKg: number) => {
    setWeightForDate(selectedDate, weightKg);
  };

  const logSteps = (stepsToAdd: number) => {
    const currentSteps = dailyRecords[selectedDate]?.steps ?? health.steps;
    setStepsForDate(selectedDate, currentSteps + stepsToAdd);
  };

  const logSleep = (hours: number, minutes: number) => {
    setSleepForDate(selectedDate, hours, minutes);
  };

  const logExercise = (minutes: number) => {
    const currentMins = dailyRecords[selectedDate]?.exerciseMinutes ?? health.exerciseMinutes;
    setExerciseForDate(selectedDate, currentMins + minutes);
  };

  const setHealthMetric = (metric: 'weight' | 'water' | 'steps' | 'sleep' | 'exercise', val1: number, val2?: number) => {
    switch (metric) {
      case 'weight':
        setWeightForDate(selectedDate, val1);
        break;
      case 'water':
        setWaterForDate(selectedDate, val1);
        break;
      case 'steps':
        setStepsForDate(selectedDate, val1);
        break;
      case 'sleep':
        setSleepForDate(selectedDate, val1, val2 || 0);
        break;
      case 'exercise':
        setExerciseForDate(selectedDate, val1);
        break;
    }
  };

  const deleteHealthHistoryItem = (date: string) => {
    setHealth((prev) => ({
      ...prev,
      history: prev.history.filter((h) => h.date !== date),
    }));
  };

  // Finance Actions
  const addTransaction = (title: string, amount: number, category: ExpenseItem['category']) => {
    setFinance((prev) => {
      const newExpenses = prev.monthlyExpenses + amount;
      const newTx: ExpenseItem = {
        id: `tx-${Date.now()}`,
        title,
        amount,
        category,
        date: 'Today',
      };

      // Recalculate categories
      const categoryTotals: Record<ExpenseItem['category'], number> = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0,
      };

      const allTx = [newTx, ...prev.recentTransactions];
      allTx.forEach((tx) => {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      });

      const updatedCategories = prev.categories.map((c) => {
        const added = c.category === category ? amount : 0;
        const catAmount = c.amount + added;
        const pct = newExpenses > 0 ? Math.round((catAmount / newExpenses) * 100) : c.percentage;
        return {
          ...c,
          amount: catAmount,
          percentage: pct,
        };
      });

      return {
        ...prev,
        monthlyExpenses: newExpenses,
        categories: updatedCategories,
        recentTransactions: [newTx, ...prev.recentTransactions.slice(0, 10)],
      };
    });
  };

  const editTransaction = (id: string, updated: { title: string; amount: number; category: ExpenseItem['category'] }) => {
    setFinance((prev) => {
      const existing = prev.recentTransactions.find((tx) => tx.id === id);
      if (!existing) return prev;

      const diff = updated.amount - existing.amount;
      const newExpenses = Math.max(0, prev.monthlyExpenses + diff);

      const updatedTransactions = prev.recentTransactions.map((tx) =>
        tx.id === id ? { ...tx, title: updated.title, amount: updated.amount, category: updated.category } : tx
      );

      const categoryTotals: Record<ExpenseItem['category'], number> = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0,
      };

      updatedTransactions.forEach((tx) => {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      });

      const updatedCategories = prev.categories.map((c) => {
        const catAmount = categoryTotals[c.category] || 0;
        const pct = newExpenses > 0 ? Math.round((catAmount / newExpenses) * 100) : 0;
        return {
          ...c,
          amount: catAmount,
          percentage: pct,
        };
      });

      return {
        ...prev,
        monthlyExpenses: newExpenses,
        categories: updatedCategories,
        recentTransactions: updatedTransactions,
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setFinance((prev) => {
      const target = prev.recentTransactions.find((tx) => tx.id === id);
      if (!target) return prev;

      const updatedTransactions = prev.recentTransactions.filter((tx) => tx.id !== id);
      const newExpenses = Math.max(0, prev.monthlyExpenses - target.amount);

      const categoryTotals: Record<ExpenseItem['category'], number> = {
        Food: 0,
        Transport: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0,
      };

      updatedTransactions.forEach((tx) => {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      });

      const updatedCategories = prev.categories.map((c) => {
        const catAmount = categoryTotals[c.category] || 0;
        const pct = newExpenses > 0 ? Math.round((catAmount / newExpenses) * 100) : 0;
        return {
          ...c,
          amount: catAmount,
          percentage: pct,
        };
      });

      return {
        ...prev,
        monthlyExpenses: newExpenses,
        categories: updatedCategories,
        recentTransactions: updatedTransactions,
      };
    });
  };

  const addIncome = (amount: number) => {
    setFinance((prev) => ({
      ...prev,
      monthlyIncome: prev.monthlyIncome + amount,
    }));
  };

  const updateFinanceBudget = (monthlyIncome: number, monthlyBudget: number) => {
    setFinance((prev) => ({
      ...prev,
      monthlyIncome: Math.max(0, monthlyIncome),
      monthlyBudget: Math.max(0, monthlyBudget),
    }));
  };

  // Habit Actions
  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newStatus = !h.completedToday;
          const newStreak = newStatus ? h.streakDays + 1 : Math.max(0, h.streakDays - 1);
          const newHistory = [...h.weekHistory];
          newHistory[newHistory.length - 1] = newStatus;
          return {
            ...h,
            completedToday: newStatus,
            streakDays: newStreak,
            weekHistory: newHistory,
          };
        }
        return h;
      })
    );
  };

  const editHabit = (id: string, updated: { title?: string; category?: HabitItem['category']; streakDays?: number }) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updated } : h))
    );
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId && dayIndex >= 0 && dayIndex < h.weekHistory.length) {
          const newHistory = [...h.weekHistory];
          newHistory[dayIndex] = !newHistory[dayIndex];
          const isToday = dayIndex === h.weekHistory.length - 1;
          const newCompletedToday = isToday ? newHistory[dayIndex] : h.completedToday;
          return {
            ...h,
            weekHistory: newHistory,
            completedToday: newCompletedToday,
          };
        }
        return h;
      })
    );
  };

  const addHabit = (title: string, category: HabitItem['category']) => {
    const newHabit: HabitItem = {
      id: `h-${Date.now()}`,
      title,
      completedToday: false,
      category,
      streakDays: 0,
      weekHistory: [false, false, false, false, false, false, false],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Goal Actions
  const addGoal = (goal: Omit<GoalItem, 'id'>) => {
    const newGoal: GoalItem = {
      ...goal,
      id: `g-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const editGoal = (id: string, updated: Partial<GoalItem>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          return {
            ...g,
            currentValue: Number(Math.max(0, g.currentValue + delta).toFixed(2)),
          };
        }
        return g;
      })
    );
  };

  const setGoalValue = (id: string, value: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentValue: value } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Notes Actions
  const addNote = (title: string, content: string, tag: string) => {
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      tag,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Settings Actions
  const updateWeights = (newWeights: LifeScoreWeights) => {
    setWeights(newWeights);
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const toggleTheme = () => {
    setProfile((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const resetToZeroData = () => {
    setHealth(zeroHealth);
    setFinance(zeroFinance);
    setHabits([]);
    setGoals([]);
    setNotes([]);
    setAiInsight(zeroAiInsight);
    setRecommendedGoals([]);
    const todayZero = { [selectedDate]: createDefaultDailyRecord(selectedDate, 2.5) };
    setDailyRecords(todayZero);
    localStorage.setItem('lifeos_daily_records', JSON.stringify(todayZero));
    localStorage.setItem('lifeos_health', JSON.stringify(zeroHealth));
    localStorage.setItem('lifeos_finance', JSON.stringify(zeroFinance));
    localStorage.setItem('lifeos_habits', JSON.stringify([]));
    localStorage.setItem('lifeos_goals', JSON.stringify([]));
    localStorage.setItem('lifeos_notes', JSON.stringify([]));
    localStorage.setItem('lifeos_ai_insight', JSON.stringify(zeroAiInsight));
    localStorage.setItem('lifeos_recommended_goals', JSON.stringify([]));
  };

  const resetToDemoData = () => {
    setHealth(initialHealth);
    setFinance(initialFinance);
    setHabits(initialHabits);
    setGoals(initialGoals);
    setNotes(initialNotes);
    setWeights(initialWeights);
    setProfile(initialProfile);
    setAiInsight(initialAiInsight);
    setRecommendedGoals(initialRecommendedGoals);
    setDailyRecords(initialDailyRecords);
    localStorage.setItem('lifeos_daily_records', JSON.stringify(initialDailyRecords));
    localStorage.setItem('lifeos_health', JSON.stringify(initialHealth));
    localStorage.setItem('lifeos_finance', JSON.stringify(initialFinance));
    localStorage.setItem('lifeos_habits', JSON.stringify(initialHabits));
    localStorage.setItem('lifeos_goals', JSON.stringify(initialGoals));
    localStorage.setItem('lifeos_notes', JSON.stringify(initialNotes));
    localStorage.setItem('lifeos_weights', JSON.stringify(initialWeights));
    localStorage.setItem('lifeos_profile', JSON.stringify(initialProfile));
    localStorage.setItem('lifeos_ai_insight', JSON.stringify(initialAiInsight));
    localStorage.setItem('lifeos_recommended_goals', JSON.stringify(initialRecommendedGoals));
  };

  // AI Insights Generation
  const refreshAiInsights = async () => {
    setIsGeneratingAi(true);
    try {
      const payload = {
        userData: {
          user: profile.name,
          lifeScore: lifeScoreBreakdown.compositeScore,
          weights,
          health: {
            weightKg: health.weightKg,
            steps: health.steps,
            waterLiters: health.waterLiters,
            sleepHours: health.sleepHours + health.sleepMinutes / 60,
            exerciseMinutes: health.exerciseMinutes,
          },
          finance: {
            currency: finance.currency,
            income: finance.monthlyIncome,
            expenses: finance.monthlyExpenses,
            savings: finance.monthlyIncome - finance.monthlyExpenses,
            savingsRate: Math.round(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome) * 100),
            categories: finance.categories,
          },
          habits: {
            completedCount: habits.filter((h) => h.completedToday).length,
            totalCount: habits.length,
            completionRate: Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100),
          },
          goals: goals.map((g) => ({
            title: g.title,
            progressPct: Math.round((g.currentValue / g.targetValue) * 100),
          })),
        },
      };

      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.insight) {
          setAiInsight((prev) => ({
            ...prev,
            ...data.insight,
            strengths: Array.isArray(data.insight.strengths) ? data.insight.strengths : prev.strengths,
            opportunities: Array.isArray(data.insight.opportunities) ? data.insight.opportunities : prev.opportunities,
            correlations: Array.isArray(data.insight.correlations) ? data.insight.correlations : prev.correlations,
            suggestedFocus: Array.isArray(data.insight.suggestedFocus) ? data.insight.suggestedFocus : prev.suggestedFocus,
            lastUpdated: 'Just now',
            isLoading: false,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to generate insights', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Chat
  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsGeneratingAi(true);

    try {
      const payload = {
        message: text,
        history: chatMessages.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        userData: {
          user: profile.name,
          lifeScore: lifeScoreBreakdown.compositeScore,
          weights,
          health: {
            weightKg: health.weightKg,
            steps: health.steps,
            waterLiters: health.waterLiters,
            sleepHours: `${health.sleepHours}h ${health.sleepMinutes}m`,
            exerciseMinutes: health.exerciseMinutes,
          },
          finance: {
            currency: finance.currency,
            income: finance.monthlyIncome,
            expenses: finance.monthlyExpenses,
            savings: finance.monthlyIncome - finance.monthlyExpenses,
            savingsRate: Math.round(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome) * 100),
            categories: finance.categories,
          },
          habits: {
            completedCount: habits.filter((h) => h.completedToday).length,
            totalCount: habits.length,
          },
          goals: goals.map((g) => ({
            title: g.title,
            progress: `${g.currentValue}/${g.targetValue} ${g.unit}`,
          })),
        },
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply || 'Data analyzed. Let me know if you want deeper correlation breakdowns.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('AI chat failed', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I've reviewed your current parameters: Health (${lifeScoreBreakdown.healthScore}), Finance (${lifeScoreBreakdown.financeScore}), Habits (${lifeScoreBreakdown.habitsScore}). Your daily anchors are stable. What specific metric would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // AI Goal Recommendations
  const fetchGoalRecommendations = async () => {
    setIsRecommendingGoals(true);
    try {
      const payload = {
        userData: {
          lifeScore: lifeScoreBreakdown.compositeScore,
          health: {
            weightKg: health.weightKg,
            weightDeltaKg: health.weightDeltaKg,
            steps: health.steps,
            waterLiters: health.waterLiters,
            waterTargetLiters: health.waterTargetLiters,
            sleepHours: health.sleepHours + health.sleepMinutes / 60,
            exerciseMinutes: health.exerciseMinutes,
          },
          finance: {
            currency: finance.currency,
            monthlyIncome: finance.monthlyIncome,
            monthlyExpenses: finance.monthlyExpenses,
            savingsRate: Math.round(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome) * 100),
            categories: finance.categories,
            foodExpenses: finance.categories.find((c) => c.category === 'Food')?.amount || 19800,
          },
          habits: {
            completedCount: habits.filter((h) => h.completedToday).length,
            totalCount: habits.length,
            items: habits.map((h) => ({ title: h.title, streak: h.streakDays, doneToday: h.completedToday })),
          },
          activeGoals: goals.map((g) => ({ title: g.title, progress: `${g.currentValue}/${g.targetValue} ${g.unit}` })),
        },
      };

      const res = await fetch('/api/ai/goals/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendedGoals(data.recommendations);
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI goal recommendations', err);
    } finally {
      setIsRecommendingGoals(false);
    }
  };

  const acceptRecommendedGoal = (rec: RecommendedGoal) => {
    const newGoal: GoalItem = {
      id: `g-${Date.now()}`,
      title: rec.title,
      category: rec.category === 'fitness' ? 'fitness' : rec.category === 'finance' ? 'finance' : 'productivity',
      currentValue: rec.currentValue,
      targetValue: rec.targetValue,
      unit: rec.unit,
      deadline: rec.timeframe,
      colorAccent:
        rec.colorAccent ||
        (rec.category === 'fitness'
          ? '#FF5C7A'
          : rec.category === 'finance'
          ? '#4D8DFF'
          : rec.category === 'habits'
          ? '#32D583'
          : '#FF8A3D'),
    };

    setGoals((prev) => [newGoal, ...(prev || [])]);
    setRecommendedGoals((prev) => (prev || []).filter((r) => r.id !== rec.id));
  };

  const dismissRecommendedGoal = (id: string) => {
    setRecommendedGoals((prev) => (prev || []).filter((r) => r.id !== id));
  };

  // Real Auth Methods
  const performLogin = (account: AuthAccount) => {
    setAuthState({
      isAuthenticated: true,
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        joinedDate: account.createdAt,
      },
    });
    setProfile((prev) => ({
      ...prev,
      email: account.email,
      name: account.name,
    }));
    setAuthScreen(null);
  };

  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    // Lookup in registered accounts
    let account = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);

    if (!account) {
      // Standard demo account fallback
      if (cleanEmail === 'demo@lifeos.app') {
        account = {
          id: 'demo-user-1',
          name: 'Demo User',
          email: cleanEmail,
          passwordHash: 'lifeos2026',
          createdAt: 'September 2026',
        };
        setRegisteredAccounts((prev) => [...prev, account!]);
      } else {
        return {
          success: false,
          error: 'No account found with this email. Please check your spelling or create an account in the Create Account tab.',
        };
      }
    }

    // Validate password if user set one
    if (cleanPass && account.passwordHash && account.passwordHash !== cleanPass) {
      return {
        success: false,
        error: 'Incorrect password for this account. Please try again.',
      };
    }

    performLogin(account);
    return { success: true };
  };

  const signup = (name: string, email: string, password?: string, startClean = false): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || cleanEmail.split('@')[0] || 'User';
    const cleanPass = password?.trim() || 'lifeos2026';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (cleanPass.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    const existing = registeredAccounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const newAccount: AuthAccount = {
      id: `u-${Date.now()}`,
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      email: cleanEmail,
      passwordHash: cleanPass,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    setRegisteredAccounts((prev) => [...prev, newAccount]);
    performLogin(newAccount);

    if (startClean) {
      resetToZeroData();
    }

    return { success: true };
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    setAuthScreen('welcome');
  };

  return (
    <LifeOSContext.Provider
      value={{
        health,
        finance,
        habits,
        goals,
        notes,
        weights,
        profile,
        activeTab,
        isAddModalOpen,
        addModalDefaultTab,
        isAiCoachOpen,
        aiInsight,
        chatMessages,
        isGeneratingAi,
        selectedDate,
        setSelectedDate,
        dailyRecords,
        currentDayRecord,
        getDailyRecord,
        updateDailyRecord,
        setWaterForDate,
        setWaterLimitForDate,
        setStepsForDate,
        setSleepForDate,
        setExerciseForDate,
        setWeightForDate,
        toggleHabitForDate,
        recommendedGoals,
        isRecommendingGoals,
        fetchGoalRecommendations,
        acceptRecommendedGoal,
        dismissRecommendedGoal,
        authState,
        authScreen,
        setAuthScreen,
        login,
        signup,
        logout,
        registeredAccounts,
        lifeScoreBreakdown,
        setActiveTab,
        setIsAddModalOpen,
        openAddModal,
        setIsAiCoachOpen,
        resetToZeroData,
        resetToDemoData,
        addWater,
        logWeight,
        logSteps,
        logSleep,
        logExercise,
        setHealthMetric,
        deleteHealthHistoryItem,
        addTransaction,
        editTransaction,
        deleteTransaction,
        addIncome,
        updateFinanceBudget,
        toggleHabit,
        addHabit,
        editHabit,
        toggleHabitDay,
        deleteHabit,
        addGoal,
        editGoal,
        updateGoalProgress,
        setGoalValue,
        deleteGoal,
        addNote,
        deleteNote,
        updateWeights,
        updateProfile,
        toggleTheme,
        refreshAiInsights,
        sendChatMessage,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
