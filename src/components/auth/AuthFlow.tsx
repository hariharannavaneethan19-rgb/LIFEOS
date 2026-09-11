import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  Check,
} from 'lucide-react';

interface AuthFlowProps {
  initialScreen?: 'welcome' | 'signin' | 'signup';
  onClose?: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ initialScreen = 'signin', onClose }) => {
  const { login, signup, authScreen, setAuthScreen } = useLifeOS();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
    initialScreen === 'signup' ? 'signup' : 'signin'
  );

  // Form states - clean and empty by default (no hardcoded credentials)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [startClean, setStartClean] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign In Modal State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = login(cleanEmail, password);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Sign in failed. Please check your credentials.');
        return;
      }
      setSuccessMsg('Signed in successfully! Loading your dashboard...');
      setTimeout(() => {
        if (onClose) onClose();
      }, 350);
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = signup(cleanName, cleanEmail, password, startClean);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Sign up failed.');
        return;
      }
      setSuccessMsg(`Welcome to LIFEOS, ${cleanName}! Preparing your dashboard...`);
      setTimeout(() => {
        if (onClose) onClose();
      }, 400);
    }, 450);
  };

  const handleFillDemo = () => {
    setEmail('demo@lifeos.app');
    setPassword('lifeos2026');
    setError(null);
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleName.trim() || !googleEmail.trim()) {
      setError('Please provide your name and email to continue with Google.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      signup(googleName.trim(), googleEmail.trim(), 'google-oauth-pass', false);
      setIsLoading(false);
      setIsGoogleModalOpen(false);
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000] flex flex-col justify-between items-center p-4 sm:p-8 overflow-y-auto text-white selection:bg-[#C8FF00] selection:text-black">
      {/* Background Ambient Glows */}
      <div className="fixed top-[-140px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-[#C8FF00]/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-2 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 bg-[#C8FF00] rounded-sm rotate-45 shadow-[0_0_12px_#C8FF00]" />
          <span className="font-display font-black text-base tracking-[0.25em] text-white">
            LIFEOS
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-[#757575] hover:text-white transition-colors uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg border border-[#222222] hover:border-[#444444] bg-[#111111]"
          >
            Back to App ✕
          </button>
        )}
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="bg-[#0B0B0F]/90 backdrop-blur-2xl border border-[#222222] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top highlight border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8FF00]/60 to-transparent" />

          {/* Header Title & Tagline */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161E] border border-[#222222] text-[#C8FF00] text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Operating System</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              {activeTab === 'signin' ? 'Sign In to LIFEOS' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-[#757575] font-medium mt-1">
              {activeTab === 'signin'
                ? 'Sign in to access your synchronized Health, Money, Habits & Goals.'
                : 'Build your unified personal dashboard in under 30 seconds.'}
            </p>
          </div>

          {/* Pill Tabs: Sign In / Create Account */}
          <div className="flex bg-[#111115] p-1 rounded-2xl border border-[#222222] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'signin'
                  ? 'bg-[#C8FF00] text-black shadow-md shadow-[#C8FF00]/20 font-black'
                  : 'text-[#757575] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-display text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'bg-[#C8FF00] text-black shadow-md shadow-[#C8FF00]/20 font-black'
                  : 'text-[#757575] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] text-xs font-bold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ================= TAB 1: SIGN IN ================= */}
          {activeTab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:ring-1 focus:ring-[#C8FF00] focus:outline-none text-sm text-white placeholder-[#757575] transition-all"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-[11px] text-[#C8FF00] hover:underline font-semibold flex items-center gap-1"
                    title="Fill test credentials"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Demo login?</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:ring-1 focus:ring-[#C8FF00] focus:outline-none text-sm text-white placeholder-[#757575] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-display text-xs font-black uppercase tracking-[0.15em] bg-[#C8FF00] text-black hover:bg-[#b5ea00] transition-all duration-200 shadow-xl shadow-[#C8FF00]/15 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#222222]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0B0B0F] px-2 text-[#757575] font-bold tracking-widest">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#111115] border border-[#222222] hover:border-[#444444] text-xs font-bold text-white flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.56 0 2.97.55 4.09 1.45l3.07-3.07C17.3 1.63 14.82 0 12 0 7.37 0 3.39 2.65 1.44 6.52l3.66 2.84C6.01 6.86 8.78 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.1 14.64c-.25-.74-.39-1.53-.39-2.64s.14-1.9.39-2.64L1.44 6.52C.52 8.35 0 10.37 0 12.5s.52 4.15 1.44 5.98l3.66-2.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.22 0-5.99-1.86-6.9-4.86L1.44 17.35C3.39 21.22 7.37 24 12 24z"
                  />
                </svg>
                <span>Google Account</span>
              </button>
            </form>
          ) : (
            /* ================= TAB 2: CREATE ACCOUNT ================= */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    autoComplete="name"
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:ring-1 focus:ring-[#C8FF00] focus:outline-none text-sm text-white placeholder-[#757575] transition-all"
                  />
                  <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:ring-1 focus:ring-[#C8FF00] focus:outline-none text-sm text-white placeholder-[#757575] transition-all"
                  />
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 4 characters"
                      autoComplete="new-password"
                      required
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:outline-none text-xs text-white placeholder-[#757575]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      required
                      className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-[#111115] border border-[#222222] focus:border-[#C8FF00] focus:outline-none text-xs text-white placeholder-[#757575]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Clean Slate Checkbox */}
              <div className="p-3 rounded-xl bg-[#111115] border border-[#222222] hover:border-[#333333] transition-colors">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={startClean}
                    onChange={(e) => setStartClean(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#333333] bg-[#000000] text-[#C8FF00] focus:ring-[#C8FF00] accent-[#C8FF00]"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Start Clean Slate (Zero Data)
                    </span>
                    <span className="text-[11px] text-[#757575] block">
                      Start fresh with 0 steps, 0 transactions, and track your actual life.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl font-display text-xs font-black uppercase tracking-[0.15em] bg-[#C8FF00] text-black hover:bg-[#b5ea00] transition-all duration-200 shadow-xl shadow-[#C8FF00]/15 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>CREATE ACCOUNT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Google Account Modal Simulation */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#111115] border border-[#222222] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.56 0 2.97.55 4.09 1.45l3.07-3.07C17.3 1.63 14.82 0 12 0 7.37 0 3.39 2.65 1.44 6.52l3.66 2.84C6.01 6.86 8.78 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.1 14.64c-.25-.74-.39-1.53-.39-2.64s.14-1.9.39-2.64L1.44 6.52C.52 8.35 0 10.37 0 12.5s.52 4.15 1.44 5.98l3.66-2.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.07.72-2.44 1.16-4.22 1.16-3.22 0-5.99-1.86-6.9-4.86L1.44 17.35C3.39 21.22 7.37 24 12 24z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">Google Authentication</h3>
                <p className="text-[11px] text-[#757575]">Connect your Google profile to LIFEOS</p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#222222] text-xs text-white focus:outline-none focus:border-[#C8FF00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#757575] uppercase mb-1">
                  Google Email
                </label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#000000] border border-[#222222] text-xs text-white focus:outline-none focus:border-[#C8FF00]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#222222] text-xs font-bold text-[#757575] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#C8FF00] text-black text-xs font-bold hover:bg-[#b5ea00]"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="w-full max-w-md flex items-center justify-center gap-3 text-[11px] font-semibold text-[#757575] uppercase tracking-widest z-10 pb-2">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8FF00]" />
          Encrypted & Protected
        </span>
        <span>•</span>
        <span className="text-white/60">LIFEOS v2.6</span>
      </div>
    </div>
  );
};
