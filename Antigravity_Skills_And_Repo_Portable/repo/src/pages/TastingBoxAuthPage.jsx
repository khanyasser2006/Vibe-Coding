import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Gift,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import EditorialMarquee from '../components/EditorialMarquee';
import {
  hashPassword,
  getActiveUser,
  setActiveUser,
  clearSession,
  isRateLimited,
  recordLoginAttempt,
  getRateLimitRemainingSeconds,
  isApprovedAdmin,
  APPROVED_ADMIN_EMAILS,
} from '../utils/authUtils';

export default function TastingBoxAuthPage({
  selectedFlavors = [],
  onOpenFlight,
  onNavigate,
}) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regProfile, setRegProfile] = useState('White Peach Purist');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Feedback notifications & highlighting
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error' | 'info', message: string }
  const [highlightSide, setHighlightSide] = useState(null); // 'login' | 'register'

  // Mobile active tab toggle
  const [activeMobileTab, setActiveMobileTab] = useState('login');

  // Members are created via registration. No hardcoded seed accounts.
  useEffect(() => {
    try {
      const existing = localStorage.getItem('cine_members');
      const members = existing ? JSON.parse(existing) : [];
      // Members are created via registration. No hardcoded seed accounts.
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Helper to read all registered members
  const getMembers = () => {
    try {
      const raw = localStorage.getItem('cine_members');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // 1. REGISTER WORKFLOW: "If not registered, first register, then login"
  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const cleanEmail = regEmail.trim().toLowerCase();
    const cleanName = regName.trim();

    if (!cleanName || !cleanEmail || !regPassword) {
      setFeedback({
        type: 'error',
        message: 'Please complete all required fields to create your Tasting Box membership.',
      });
      return;
    }

    const members = getMembers();
    const existingUser = members.find((m) => m.email.toLowerCase() === cleanEmail);

    // If already registered -> direct to login
    if (existingUser) {
      setFeedback({
        type: 'info',
        message: `An account for ${cleanEmail} is already registered! Please sign in with your password.`,
      });
      setLoginEmail(cleanEmail);
      setHighlightSide('login');
      setActiveMobileTab('login');
      return;
    }

    // Hash password with SHA-256 before storing
    const hashedPw = await hashPassword(regPassword);
    const isAdminEmail = APPROVED_ADMIN_EMAILS.some(
      (adminEmail) => adminEmail.toLowerCase().trim() === cleanEmail
    );

    // Register new user
    const newUser = {
      name: cleanName,
      email: cleanEmail,
      password: hashedPw,
      profile: regProfile,
      tier: isAdminEmail ? 'Head of Atelier' : 'Ciné Connoisseur Tier 1',
      role: isAdminEmail ? 'admin' : 'member',
      registeredAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('cine_members', JSON.stringify([...members, newUser]));
    } catch {
      // Continue even if storage fails
    }

    // Celebrate registration
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FEC5A8', '#F4784E', '#FFF0E8', '#DE5F32'],
    });

    // Workflow rule: "if not registered, first register, then login"
    // Pre-fill login email, display guidance, and switch visual focus to Login
    setLoginEmail(cleanEmail);
    setLoginPassword('');
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setHighlightSide('login');
    setActiveMobileTab('login');

    setFeedback({
      type: 'success',
      message: `Membership created for ${cleanName}! Now sign in below with your password to access your Tasting Box.`,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. LOGIN WORKFLOW: "If registered, then login"
  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback(null);

    // Rate limiting check: max 5 attempts per 15 minutes
    if (isRateLimited()) {
      const remainingSecs = getRateLimitRemainingSeconds();
      setFeedback({
        type: 'error',
        message: `Too many failed login attempts. Please wait ${remainingSecs} second${remainingSecs !== 1 ? 's' : ''} before trying again.`,
      });
      return;
    }

    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail || !loginPassword) {
      setFeedback({
        type: 'error',
        message: 'Please enter both your email and password to sign in.',
      });
      return;
    }

    const members = getMembers();
    const found = members.find((m) => m.email.toLowerCase() === cleanEmail);

    // If user is not registered -> instruct to register first
    if (!found) {
      recordLoginAttempt();
      setFeedback({
        type: 'error',
        message: `No membership found for "${cleanEmail}". Please register on the right first, then sign in.`,
      });
      setRegEmail(cleanEmail);
      setHighlightSide('register');
      setActiveMobileTab('register');
      return;
    }

    // Check password using SHA-256 hash comparison
    const hashedEnteredPassword = await hashPassword(loginPassword);
    if (found.password !== hashedEnteredPassword) {
      recordLoginAttempt();
      setFeedback({
        type: 'error',
        message: 'The password you entered is incorrect. Please verify and try again.',
      });
      return;
    }

    // Successfully authenticated
    setCurrentUser(found);
    if (rememberMe) {
      try {
        setActiveUser(found);
      } catch {
        // Storage fail safe
      }
    }

    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#FEC5A8', '#F4784E', '#FFF0E8', '#DE5F32'],
    });

    setFeedback({
      type: 'success',
      message: `Welcome back, ${found.name}! Your Tasting Flight Box is unlocked.`,
    });
    setHighlightSide(null);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cine_auth_change'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      clearSession();
    } catch {
      // Ignore
    }
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cine_auth_change'));
    setFeedback({
      type: 'info',
      message: 'You have signed out of your Tasting Box account.',
    });
  };

  const tastingProfiles = [
    'White Peach Purist',
    'Valencian Citrus Explorer',
    'Grand Cru Mixed Flight',
  ];

  return (
    <div className="relative min-h-screen bg-peach-50 text-terracotta pt-24 pb-20 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-24 right-10 w-96 h-96 bg-tangerine/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-peach-300/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        {/* Page Hero Header - Strict Main Hero Spacing, Typography & Hierarchy */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 self-start px-3.5 sm:px-4 py-1.5 rounded-full bg-peach/40 border border-tangerine/30 text-terracotta text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>Tasting Box &bull; Connoisseur Portal</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-6xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
            Tasting Box &bull; <br />
            <span className="italic font-light text-tangerine">Member Access.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl">
            Sign in to access your curated 4-pint cryo-insulated tasting flight, or create a new membership to reserve limited harvest batches shipped cellar-cold overnight.
          </p>

          {/* Feedback & Guidance Banner */}
          {feedback && (
            <div
              className={`p-4 md:p-5 rounded-2xl flex items-start gap-3 border transition-all duration-300 ${
                feedback.type === 'success'
                  ? 'bg-peach-200/80 border-tangerine text-terracotta'
                  : feedback.type === 'error'
                  ? 'bg-tangerine-50 border-tangerine text-terracotta'
                  : 'bg-peach-100 border-tangerine/30 text-terracotta'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-tangerine shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-tangerine shrink-0 mt-0.5" />
              )}
              <div className="text-sm font-medium leading-relaxed">
                {feedback.message}
              </div>
            </div>
          )}
        </div>

        {/* LOGGED IN VIEW: Member Tasting Concierge Dashboard */}
        {currentUser ? (
          <div className="rounded-3xl bg-peach-100/80 border border-tangerine/30 p-8 md:p-12 shadow-luxury flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-tangerine/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-tangerine to-peach flex items-center justify-center text-terracotta font-serif text-2xl font-bold shadow-glow-peach">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-3xl font-bold text-terracotta">
                      Bienvenue, {currentUser.name}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tangerine text-white">
                      {currentUser.tier || 'Connoisseur Member'}
                    </span>
                  </div>
                  <p className="text-sm text-terracotta/70 font-sans mt-0.5">
                    {currentUser.email} &bull; Preference: {currentUser.profile || 'White Peach Purist'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="self-start md:self-auto px-5 py-2.5 rounded-full border border-tangerine/30 bg-peach-50 hover:bg-peach-200 text-terracotta text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4 text-tangerine" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Atelier Admin Studio Access Banner */}
            {isApprovedAdmin(currentUser) && (
              <div className="p-6 md:p-8 rounded-3xl bg-terracotta text-white border-2 border-tangerine shadow-luxury flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-tangerine flex items-center justify-center shrink-0 shadow-glow-tangerine">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-2xl font-bold text-peach">
                        Live Headless CMS Studio
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-peach/20 text-peach text-[10px] uppercase font-bold tracking-wider">
                        Master Access
                      </span>
                    </div>
                    <p className="text-xs text-peach-light/80 font-sans mt-1 max-w-xl leading-relaxed">
                      You are logged in as an Atelier Administrator. You have full CRUD control over flavors, boutique locations, photography galleries, craft stages, and brand manifesto in real time.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate && onNavigate('admin')}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all shrink-0 flex items-center gap-2"
                >
                  <span>Open Live CMS Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tasting Flight Status Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl bg-white/70 border border-tangerine/20 p-6 flex flex-col justify-between gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-tangerine" />
                      <h3 className="font-serif text-2xl font-bold text-terracotta">
                        Your Tasting Flight Box
                      </h3>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-tangerine font-bold">
                      {selectedFlavors.length} of 4 Slots Reserved
                    </span>
                  </div>

                  {selectedFlavors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedFlavors.map((flavor, index) => (
                        <div
                          key={flavor.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-peach-50 border border-tangerine/20"
                        >
                          <img
                            src={flavor.image}
                            alt={flavor.name}
                            className="w-12 h-12 object-contain rounded-lg bg-peach-100"
                          />
                          <div className="text-xs">
                            <span className="font-mono text-[10px] uppercase text-tangerine font-bold block">
                              Slot 0{index + 1}
                            </span>
                            <span className="font-serif font-bold text-terracotta block text-sm">
                              {flavor.name}
                            </span>
                            <span className="text-terracotta/70">{flavor.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl border border-dashed border-tangerine/30 text-center text-sm text-terracotta/70">
                      You haven't selected any flavors for your flight box yet.
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-tangerine/15">
                  <button
                    onClick={onOpenFlight}
                    className="px-6 py-3 rounded-full bg-tangerine text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:bg-tangerine-deep transition-all flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Open Flight Box ({selectedFlavors.length}/4)</span>
                  </button>

                  <button
                    onClick={() => onNavigate && onNavigate('flavors')}
                    className="px-6 py-3 rounded-full bg-peach-200 hover:bg-peach-300 text-terracotta font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <span>Browse Flavors Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* VIP Benefits Card */}
              <div className="rounded-2xl bg-terracotta text-white p-6 flex flex-col justify-between gap-4 border border-peach/25">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-peach">
                    <Gift className="w-5 h-5 text-tangerine" />
                    <span className="text-xs uppercase tracking-widest font-bold">
                      Member Privileges
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white">
                    Grand Cru Member Status
                  </h4>
                  <ul className="space-y-2.5 text-xs text-peach-light/90">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
                      <span>Complimentary cryo-dry-ice shipping on all flights</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
                      <span>4 engraved gold tasting spoons included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
                      <span>48-hour early allocation on limited harvest drops</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-peach-200/10 border border-peach/20 text-[11px] text-peach font-mono">
                  Concierge Hotline: concierge@cine-glacier.fr
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SIDE-BY-SIDE AUTH CONTAINER */
          <div>
            {/* Mobile Tab Switcher (Visible on small screens only) */}
            <div className="flex lg:hidden rounded-full bg-peach-200/70 p-1 mb-8 border border-tangerine/20">
              <button
                type="button"
                onClick={() => setActiveMobileTab('login')}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeMobileTab === 'login'
                    ? 'bg-tangerine text-white shadow-glow-tangerine'
                    : 'text-terracotta/70 hover:text-terracotta'
                }`}
              >
                1. Sign In (Registered)
              </button>
              <button
                type="button"
                onClick={() => setActiveMobileTab('register')}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeMobileTab === 'register'
                    ? 'bg-tangerine text-white shadow-glow-tangerine'
                    : 'text-terracotta/70 hover:text-terracotta'
                }`}
              >
                2. Register First
              </button>
            </div>

            {/* Desktop Side-by-Side Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {/* ======================================================== */}
              {/* LEFT COLUMN: SIGN IN (FOR REGISTERED CONNOISSEURS) */}
              {/* ======================================================== */}
              <div
                className={`rounded-3xl bg-peach-100/70 border p-6 md:p-10 shadow-luxury card-hover-luxury flex flex-col justify-between transition-all duration-300 ${
                  highlightSide === 'login'
                    ? 'border-tangerine ring-4 ring-tangerine/20'
                    : 'border-tangerine/20'
                } ${activeMobileTab === 'login' ? 'block' : 'hidden lg:flex'}`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-tangerine/20 mb-6">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-tangerine-700 block">
                        Existing Connoisseurs
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-terracotta mt-1">
                        Sign In &bull; Tasting Box
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-peach-200 flex items-center justify-center text-terracotta">
                      <Lock className="w-5 h-5 text-tangerine" />
                    </div>
                  </div>

                  <p className="text-sm text-terracotta/80 font-sans leading-relaxed mb-6">
                    Sign in to load your saved flight selections, track insulated cold shipping, and order your custom 4-pint tasting box.
                  </p>

                  {/* Login Form */}
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-terracotta mb-2">
                        Member Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/50" />
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="member@cine-glacier.fr"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-tangerine/30 text-sm text-terracotta placeholder:text-terracotta/40 focus:outline-none focus:border-tangerine focus:ring-2 focus:ring-tangerine/20 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-terracotta mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terracotta/50" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white/80 border border-tangerine/30 text-sm text-terracotta placeholder:text-terracotta/40 focus:outline-none focus:border-tangerine focus:ring-2 focus:ring-tangerine/20 transition-all font-sans"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-terracotta/50 hover:text-terracotta"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Quick Hint */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-terracotta/80 font-medium">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-tangerine/30 text-tangerine focus:ring-tangerine"
                        />
                        <span>Remember my flight box</span>
                      </label>
                      <span className="text-tangerine font-semibold cursor-pointer hover:underline">
                        Forgot key?
                      </span>
                    </div>

                    {/* Sign In Submit Button */}
                    <button
                      type="submit"
                      className="w-full mt-4 py-4 px-6 rounded-full bg-tangerine text-white font-bold text-xs uppercase tracking-widest shadow-glow-tangerine hover:bg-tangerine-deep hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Sign In &bull; Access Tasting Box</span>
                    </button>
                  </form>
                </div>

                {/* Workflow Guidance Footer */}
                <div className="pt-6 mt-8 border-t border-tangerine/15 flex items-center justify-between text-xs">
                  <span className="text-terracotta/70 font-medium">
                    Not registered yet?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMobileTab('register');
                      setHighlightSide('register');
                    }}
                    className="text-tangerine font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Register on the right</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ======================================================== */}
              {/* RIGHT COLUMN: REGISTER (FOR UNREGISTERED CONNOISSEURS) */}
              {/* ======================================================== */}
              <div
                className={`rounded-3xl bg-terracotta text-white border p-6 md:p-10 shadow-2xl card-hover-luxury flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                  highlightSide === 'register'
                    ? 'border-peach ring-4 ring-peach/30'
                    : 'border-peach/25'
                } ${activeMobileTab === 'register' ? 'block' : 'hidden lg:flex'}`}
              >
                {/* Background Ambient Glow */}
                <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-tangerine/20 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-peach/20 mb-6">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-peach block">
                        First Time Tasting?
                      </span>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-1">
                        Register &bull; New Connoisseur
                      </h2>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-peach text-terracotta flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 text-terracotta" />
                    </div>
                  </div>

                  <p className="text-sm text-peach-light/80 font-sans leading-relaxed mb-6">
                    First register your tasting membership to unlock custom 4-pint flights, complimentary cryo-insulated gift boxes, and seasonal batch reserves.
                  </p>

                  {/* Register Form */}
                  <form onSubmit={handleRegister} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-peach mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-peach/50" />
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Camille de Provence"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-terracotta-card border border-peach/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-peach mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-peach/50" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="camille@domain.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-terracotta-card border border-peach/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-sans"
                          required
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-peach mb-2">
                        Create Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-peach/50" />
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-terracotta-card border border-peach/30 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-peach focus:ring-2 focus:ring-peach/20 transition-all font-sans"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-peach/50 hover:text-white"
                        >
                          {showRegPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Flavor Preference Selection */}
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold text-peach mb-2">
                        Preferred Tasting Palette
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {tastingProfiles.map((prof) => (
                          <button
                            key={prof}
                            type="button"
                            onClick={() => setRegProfile(prof)}
                            className={`p-2.5 rounded-xl text-[11px] font-bold text-center border transition-all ${
                              regProfile === prof
                                ? 'bg-peach text-terracotta border-peach'
                                : 'bg-terracotta-card text-peach-light/80 border-peach/20 hover:border-peach/50'
                            }`}
                          >
                            {prof}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Complimentary Perks Banner */}
                    <div className="p-3.5 rounded-2xl bg-peach-200/10 border border-peach/20 flex items-start gap-2.5">
                      <Gift className="w-4 h-4 text-tangerine shrink-0 mt-0.5" />
                      <div className="text-[11px] text-peach-light/90">
                        <span className="font-bold text-peach">Included with Registration:</span>{' '}
                        Zero-degree sub-zero insulated packaging & 4 gold-engraved tasting spoons.
                      </div>
                    </div>

                    {/* Register Submit Button */}
                    <button
                      type="submit"
                      className="w-full mt-4 py-4 px-6 rounded-full bg-gradient-to-r from-tangerine to-peach text-terracotta font-bold text-xs uppercase tracking-widest shadow-glow-tangerine hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Register Tasting Membership &rarr;</span>
                    </button>
                  </form>
                </div>

                {/* Workflow Guidance Footer */}
                <div className="relative z-10 pt-6 mt-8 border-t border-peach/20 flex items-center justify-between text-xs">
                  <span className="text-peach/70 font-medium">
                    Already registered?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMobileTab('login');
                      setHighlightSide('login');
                    }}
                    className="text-peach font-bold uppercase tracking-wider flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Sign in on the left</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Luxury Motion Ribbon */}
      <div className="mt-20">
        <EditorialMarquee variant="peach" />
      </div>
    </div>
  );
}
