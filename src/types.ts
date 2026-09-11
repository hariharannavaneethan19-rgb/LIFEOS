export type ScreenTab = 'home' | 'fitness' | 'finance' | 'habits' | 'goals' | 'insights' | 'me';

export interface DailyRecord {
  date: string; // "YYYY-MM-DD"
  waterLiters: number;
  waterTargetLiters: number; // e.g. 2.5
  steps: number;
  stepsTarget: number; // e.g. 10000
  sleepHours: number;
  sleepMinutes: number;
  sleepTargetHours: number; // e.g. 8
  sleepQuality?: number;
  exerciseMinutes: number;
  exerciseTargetMinutes: number; // e.g. 45
  weightKg: number;
  completedHabitIds: string[];
  notes?: string;
}

export interface HealthData {
  weightKg: number;
  weightDeltaKg: number; // e.g. -0.6
  waterLiters: number;
  waterTargetLiters: number; // e.g. 2.5
  steps: number;
  stepsTarget: number; // e.g. 10000
  sleepHours: number;
  sleepMinutes: number;
  sleepTargetHours: number; // e.g. 8
  sleepQuality: number; // 1-100
  exerciseMinutes: number;
  exerciseTargetMinutes: number; // e.g. 45
  exerciseCompleted: boolean;
  history: {
    date: string;
    weight: number;
    water: number;
    steps: number;
    sleep: number;
    exercise: number;
  }[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';
  date: string;
}

export interface FinanceData {
  currency: string; // e.g. "Rs."
  month: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBudget: number;
  savingsTargetRate: number; // e.g. 40
  categories: {
    category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Other';
    percentage: number;
    amount: number;
  }[];
  recentTransactions: ExpenseItem[];
  history: {
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }[];
}

export interface HabitItem {
  id: string;
  title: string;
  completedToday: boolean;
  category: 'health' | 'productivity' | 'mindset' | 'finance';
  streakDays: number;
  weekHistory: boolean[]; // 7 days (M, T, W, T, F, S, S)
}

export interface GoalItem {
  id: string;
  title: string;
  category: 'finance' | 'fitness' | 'productivity' | 'learning';
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline?: string;
  colorAccent?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: string;
}

export interface RecommendedGoal {
  id: string;
  title: string;
  category: 'fitness' | 'finance' | 'habits' | 'productivity';
  targetValue: number;
  currentValue: number;
  unit: string;
  timeframe: string; // e.g. "30 Days", "60 Days"
  reasoning: string; // explanation of user health/finance/habit data
  scoreImpact: number; // e.g. 4
  actionPlan: string;
  colorAccent?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
}

export interface AuthAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export interface LifeScoreWeights {
  health: number; // e.g. 40
  finance: number; // e.g. 30
  habits: number; // e.g. 20
  goals: number; // e.g. 10
}

export interface LifeScoreBreakdown {
  healthScore: number;
  financeScore: number;
  habitsScore: number;
  goalsScore: number;
  productivityScore: number;
  compositeScore: number;
  percentageChange: number; // e.g. +4.2
}

export interface AiInsightState {
  headline: string;
  summary: string;
  strengths: string[];
  opportunities: string[];
  correlations: string[];
  suggestedFocus: string[];
  lastUpdated: string;
  isLoading: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  theme: 'light' | 'dark';
  weightUnit?: 'kg' | 'lbs';
}
