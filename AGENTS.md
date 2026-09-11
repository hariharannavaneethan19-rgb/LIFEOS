# LIFEOS — Project Memory & System Context

## 1. Project Overview
- **App Name**: LIFEOS
- **Description**: Unified Personal Life Operating System connecting Health, Fitness, Finance, Habits, Goals, Analytics, and Gemini AI into a single high-performance intelligence interface.
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Express backend, Lucide Icons, Motion.
- **Hosting / Deploy Target**: Cloud Run / Containerized Node (`server.ts` on port 3000) with full Vercel Serverless compatibility (`vercel.json` + `/api/index.ts`).

---

## 2. Design System & Aesthetics (Nike Performance Palette)
The application adheres strictly to the 60-25-10-5 Nike athletic performance design rule:
- **60% Canvas**: Pure Light White (`#FFFFFF`) in Lit mode / Deep Obsidian (`#0A0A0A` / `#121212`) in Dark mode.
- **25% Structure**: High-contrast Nike Black (`#111111`) text, headers, and core action elements.
- **10% Secondary Cards**: Neutral light gray (`#F5F5F5`, border `#E5E5E5`) in Lit mode / Elevated charcoal (`#1A1A1A`, border `#2A2A2A`) in Dark mode.
- **5% Volt Accent**: Electric Volt (`#C5FF00`) for high-priority badges, active indicators, and health accents.
- **Typography**: Space Grotesk (display headings, tracking, uppercase labels) and Plus Jakarta Sans (body copy).
- **Themes**: Instant toggle between **Lit Mode** (Light) and **Dark Mode** via Header toggle button and Profile Settings.

---

## 3. Core Architecture & Domains

### A. Authentication & Session Gate
- **State**: `authState` (`isAuthenticated`, `user: { id, name, email }`, `guestMode`).
- **Gating**: Visitors must log in, register, or continue as guest before accessing the system dashboard.
- **Session Persistence**: Stored in `localStorage` under `lifeos_auth_state_v1`.

### B. Date-Wise Daily Records Engine
- **Structure**: `dailyRecords: Record<string, DailyRecord>` indexed by ISO date string (`YYYY-MM-DD`).
- **Date Independence**: Hydration, steps, sleep, exercise, and habits are persisted per specific calendar date.
- **Custom Water Limits**: Daily water targets (e.g. 2.0L, 2.5L, 3.0L) can be customized individually per date without overriding past or future targets.
- **Date Navigation**: Interactive `DateCalendarStrip` allowing 7-day strip selection, custom calendar picker, previous/next day stepping, and "Jump to Today".

### C. Life Score Algorithm
- **Formula**: `(Health × W_h) + (Finance × W_f) + (Habits × W_hb) + (Goals × W_g)`.
- **Dynamic Weights**: User-customizable in the Profile view (defaults: 30% Health, 30% Finance, 25% Habits, 15% Goals).
- **Score Range**: 0 to 100 with real-time breakdowns for each domain.

### D. Health & Fitness Tracker
- **Hydration**: Logged in liters, compared against the date-specific water limit.
- **Activity**: Step counter, workout duration (minutes), target comparisons.
- **Rest**: Sleep hours, minutes, and calculated sleep quality percentage.
- **Weight**: Weight logging with unit support (`kg` or `lbs`).

### E. Finance & Budgeting
- **Currency Support**: Customizable symbol (e.g. `Rs.`, `$`, `€`, `£`).
- **Metrics**: Monthly Income, Total Expenses, Monthly Budget, and Savings Target Rate.
- **Breakdown**: Categorized into Food, Transport, Shopping, Bills, and Other.
- **Transactions**: Add, filter, and review recent dated expenses.

### F. Habits & Consistency Matrix
- **Daily Check-ins**: Toggle habit completion with immediate streak increments.
- **Weekly Matrix**: 7-day tracking dots for weekly adherence.
- **Categories**: Health, Productivity, Mindset, and Finance.

### G. Goals & Milestones
- **Target Tracking**: Progress bars comparing `currentValue` against `targetValue`.
- **Categories**: Finance, Fitness, Productivity, Learning.
- **Deadlines**: Optional countdown and target dates.

### H. Cross-Domain Gemini AI Coach
- **Endpoint**: `POST /api/ai/coach` on the server using `@google/genai` with `process.env.GEMINI_API_KEY`.
- **Holistic Context**: Server injects real-time snapshot of user health, finance, habits, and score.
- **Client UI**: Slide-over AI Coach modal with quick prompt chips, markdown message rendering, and streaming responses.

---

## 4. Deployment & Configuration Guidelines
- **Port Requirement**: The containerized server binds strictly to `0.0.0.0:3000`.
- **Dual Server Mode**:
  - In container/local environments, `server.ts` starts Express on port 3000 with Vite middleware.
  - When deployed on Vercel (`process.env.VERCEL === "1"`), `app` is exported for serverless execution.
- **Vercel Setup**:
  - `vercel.json` routes `/api/(.*)` to `/api` and non-API requests to `/index.html`.
  - `/api/index.ts` re-exports the Express instance.
  - Compatible with Vercel Skew Protection and Atomic Deployments.
