import React from 'react';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Navigation } from './components/Navigation';
import { AddModal } from './components/AddModal';
import { AiCoachModal } from './components/AiCoachModal';
import { AuthFlow } from './components/auth/AuthFlow';
import { HomeView } from './components/views/HomeView';
import { FitnessView } from './components/views/FitnessView';
import { FinanceView } from './components/views/FinanceView';
import { HabitsView } from './components/views/HabitsView';
import { GoalsView } from './components/views/GoalsView';
import { InsightsView } from './components/views/InsightsView';
import { ProfileView } from './components/views/ProfileView';

const MainApp: React.FC = () => {
  const { activeTab, authState, authScreen, setAuthScreen } = useLifeOS();

  // If user is not authenticated or explicitly viewing auth screens
  if (!authState.isAuthenticated || authScreen !== null) {
    return (
      <AuthFlow
        initialScreen={authScreen || 'welcome'}
        onClose={authState.isAuthenticated ? () => setAuthScreen(null) : undefined}
      />
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'fitness':
        return <FitnessView />;
      case 'finance':
        return <FinanceView />;
      case 'habits':
        return <HabitsView />;
      case 'goals':
        return <GoalsView />;
      case 'insights':
        return <InsightsView />;
      case 'me':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#FFFFFF] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#111111] selection:text-white dark:selection:bg-[#C5FF00] dark:selection:text-[#0A0A0A] transition-colors">
      {/* Desktop Sidebar Navigation Matrix */}
      <Sidebar />

      {/* Top Header */}
      <Header />

      {/* Main Content Area (Offset by 64 (w-64) on Desktop) */}
      <div className="lg:pl-64 min-h-screen flex flex-col pt-16 pb-24 lg:pb-10">
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation & Floating Coach AI Pill */}
      <Navigation />

      {/* Global Action & AI Modals */}
      <AddModal />
      <AiCoachModal />
    </div>
  );
};

export default function App() {
  return (
    <LifeOSProvider>
      <MainApp />
    </LifeOSProvider>
  );
}
