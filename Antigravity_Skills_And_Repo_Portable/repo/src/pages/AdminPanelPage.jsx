import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Plus,
  Edit3,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Settings,
  Flame,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Coffee,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useCms } from '../context/CmsContext';
import ImageDropzone from '../components/ImageDropzone';
import {
  isApprovedAdmin,
  getActiveUser,
  APPROVED_ADMIN_EMAILS,
  hashPassword,
  setActiveUser,
  clearSession,
  isRateLimited,
  recordLoginAttempt,
  getRateLimitRemainingSeconds,
} from '../utils/authUtils';

export default function AdminPanelPage({ onNavigate }) {
  const {
    brand,
    flavors,
    boutiques,
    galleryPhotos,
    processSteps,
    pageContent,
    updateBrand,
    addFlavor,
    updateFlavor,
    deleteFlavor,
    addBoutique,
    updateBoutique,
    deleteBoutique,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addProcessStep,
    updateProcessStep,
    deleteProcessStep,
    updatePageContent,
    resetToDefaults,
    exportData,
    importData,
  } = useCms();

  const [activeTab, setActiveTab] = useState('flavors');
  const [notification, setNotification] = useState(null);

  // Modal editing states
  const [flavorModal, setFlavorModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [boutiqueModal, setBoutiqueModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [photoModal, setPhotoModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [stepModal, setStepModal] = useState({ isOpen: false, mode: 'create', data: null, index: -1 });

  // Delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });

  // Brand form local state
  const [brandForm, setBrandForm] = useState({
    name: brand?.name || 'Ciné',
    tagline: brand?.tagline || '',
    manifesto: brand?.manifesto || '',
    peachDescription: brand?.dualTones?.peach?.description || '',
    tangerineDescription: brand?.dualTones?.tangerine?.description || '',
  });

  // Sync brandForm if brand context updates
  useEffect(() => {
    if (brand) {
      setBrandForm({
        name: brand?.name || 'Ciné',
        tagline: brand?.tagline || '',
        manifesto: brand?.manifesto || '',
        peachDescription: brand?.dualTones?.peach?.description || '',
        tangerineDescription: brand?.dualTones?.tangerine?.description || '',
      });
    }
  }, [brand]);

  // Page content local states
  const [pageForm, setPageForm] = useState(pageContent || {});

  useEffect(() => {
    if (pageContent) {
      setPageForm(pageContent);
    }
  }, [pageContent]);

  // Lock body scroll when any modal is open to prevent background scrolling
  const isAnyModalOpen =
    flavorModal.isOpen ||
    boutiqueModal.isOpen ||
    photoModal.isOpen ||
    stepModal.isOpen ||
    deleteConfirm.isOpen;

  useEffect(() => {
    if (isAnyModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isAnyModalOpen]);

  // Check auth user strictly
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const isAuthorized = isApprovedAdmin(currentUser);

  // Sync auth state with window events
  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getActiveUser());
    };
    window.addEventListener('storage', syncAuth);
    window.addEventListener('cine_auth_change', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('cine_auth_change', syncAuth);
    };
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');

    // Rate limiting check: max 5 attempts per 15 minutes
    if (isRateLimited()) {
      const remainingSecs = getRateLimitRemainingSeconds();
      setLoginError(`Too many failed login attempts. Please wait ${remainingSecs} second${remainingSecs !== 1 ? 's' : ''} before trying again.`);
      return;
    }

    const cleanEmail = adminEmail.trim().toLowerCase();
    const isApproved = APPROVED_ADMIN_EMAILS.some((adm) => adm.toLowerCase().trim() === cleanEmail);

    if (!isApproved) {
      recordLoginAttempt();
      setLoginError('Access denied: This email is not authorized for Atelier Administration.');
      return;
    }

    let members = [];
    try {
      const saved = localStorage.getItem('cine_members');
      members = saved ? JSON.parse(saved) : [];
    } catch {
      members = [];
    }

    const foundMember = members.find((m) => m.email.toLowerCase() === cleanEmail);

    if (!foundMember) {
      recordLoginAttempt();
      setLoginError('No administrator account found. Please register at Tasting Box with your admin email first.');
      return;
    }

    const hashedInput = await hashPassword(adminPassword);
    if (hashedInput !== foundMember.password) {
      recordLoginAttempt();
      setLoginError('Incorrect administrator password.');
      return;
    }

    const adminUser = {
      name: foundMember?.name || 'Master Glacier Admin',
      email: cleanEmail,
      role: 'admin',
      tier: 'Head of Atelier',
    };

    const session = setActiveUser(adminUser);
    setCurrentUser(session);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cine_auth_change'));
    showToast('Authenticated as Atelier Admin');
  };

  const handleSignOut = () => {
    clearSession();
    setCurrentUser(null);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('cine_auth_change'));
    if (onNavigate) onNavigate('home');
  };

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cine-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CMS Configuration exported successfully');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const res = importData(content);
        if (res.success) {
          showToast('CMS data restored from JSON backup');
        } else {
          showToast('Failed to import JSON file: ' + res.error, 'error');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Reset all CMS content to original atelier defaults? This will erase custom additions.')) {
      resetToDefaults();
      showToast('All website content restored to defaults');
    }
  };

  const handleSaveAll = () => {
    // 1. Commit brand identity and manifesto
    updateBrand({
      name: brandForm.name,
      tagline: brandForm.tagline,
      manifesto: brandForm.manifesto,
      dualTones: {
        peach: { ...brand?.dualTones?.peach, description: brandForm.peachDescription },
        tangerine: { ...brand?.dualTones?.tangerine, description: brandForm.tangerineDescription },
      },
    });

    // 2. Commit all page editorial hero forms
    Object.keys(pageForm).forEach((key) => {
      updatePageContent(key, pageForm[key]);
    });

    // 3. Update document title
    if (typeof document !== 'undefined') {
      document.title = `${brandForm.name || 'Ciné'} — Haute Glacerie & Artisanal Ice Cream`;
    }

    // 4. Force multi-window / multi-component sync
    window.dispatchEvent(new Event('storage'));

    showToast(`All changes and "${brandForm.name}" brand settings saved live across the entire site!`);
  };

  // =========================================================================
  // EXCLUSIVE ACCESS GATEKEEPER: RESTRICTED TO APPROVED ADMIN EMAILS
  // =========================================================================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-peach-50 text-terracotta pt-32 pb-24 md:pt-40 md:pb-32 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-peach-100/90 border border-tangerine/30 rounded-3xl p-8 sm:p-10 shadow-luxury flex flex-col gap-6 text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-tangerine/20 border border-tangerine/40 text-tangerine mx-auto flex items-center justify-center shadow-glow-tangerine">
            <Lock className="w-8 h-8 text-tangerine" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-tangerine-700 block">
              Restricted Area
            </span>
            <h1 className="font-serif text-3xl font-bold text-terracotta mt-1">
              Atelier CMS Studio
            </h1>
            <p className="text-xs sm:text-sm text-terracotta/80 font-sans mt-2 leading-relaxed">
              This environment is strictly reserved for authorized atelier administrators. Please authenticate with an approved administrator email.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-tangerine-50 border border-tangerine text-terracotta text-xs font-semibold text-left">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-terracotta/80 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@cine-glacier.fr"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-tangerine/30 text-terracotta text-sm focus:outline-none focus:border-tangerine"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-terracotta/80 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-tangerine/30 text-terracotta text-sm focus:outline-none focus:border-tangerine"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-tangerine mt-2 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate &amp; Enter Studio</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs font-bold uppercase tracking-wider text-terracotta/70 hover:text-terracotta hover:underline mt-2"
          >
            &larr; Return to Public Storefront
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-peach-50 text-terracotta pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-fadeIn">
            <div
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-luxury border backdrop-blur-md ${
                notification.type === 'error'
                  ? 'bg-terracotta text-white border-peach/30'
                  : 'bg-peach-light text-terracotta border-tangerine shadow-glow-tangerine'
              }`}
            >
              <CheckCircle2 className="w-5 h-5 text-tangerine shrink-0" />
              <span className="text-xs font-bold font-sans tracking-wide">{notification.msg}</span>
            </div>
          </div>
        )}

        {/* Hero Section Header (Strict Parity with Main Hero Hierarchy & Typography) */}
        <div className="flex flex-col gap-6 mb-12 md:mb-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach/40 border border-tangerine/30 text-terracotta text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>Live Headless CMS &bull; Master Atelier Studio</span>
            </div>

            {/* Quick Status Bar */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-peach-100 border border-tangerine/20 text-xs font-semibold text-terracotta">
                <span className="w-2 h-2 rounded-full bg-tangerine animate-pulse" />
                <span>Live Sync Active</span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('home')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-peach-200/70 hover:bg-peach-200 border border-tangerine/30 text-xs font-bold text-terracotta transition-colors"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3 text-tangerine" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight text-terracotta leading-[0.95]">
                Haute Glacerie &bull; <br />
                <span className="italic font-light text-tangerine">Live CMS Studio.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-terracotta/80 font-sans leading-relaxed max-w-2xl mt-4">
                Real-time CRUD orchestrator for the entire Ciné website. Any edit made here updates immediately across all public collections, boutique listings, photography galleries, and editorial narratives.
              </p>
            </div>

            {/* Global Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveAll}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white hover:scale-105 border border-peach/30 text-xs font-bold transition-all shadow-glow-tangerine"
                title="Save and publish all current edits live across the entire website"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save All</span>
              </button>

              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-peach-100 hover:bg-peach-200 border border-tangerine/30 text-xs font-bold text-terracotta transition-all shadow-sm"
                title="Backup full CMS data as JSON"
              >
                <Download className="w-3.5 h-3.5 text-tangerine" />
                <span>Export JSON</span>
              </button>

              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-peach-100 hover:bg-peach-200 border border-tangerine/30 text-xs font-bold text-terracotta transition-all shadow-sm cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-tangerine" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-peach-100 hover:bg-terracotta hover:text-white border border-tangerine/30 text-xs font-bold text-terracotta transition-all shadow-sm"
                title="Restore default factory content"
              >
                <RotateCcw className="w-3.5 h-3.5 text-tangerine" />
                <span>Reset Defaults</span>
              </button>

              {currentUser && (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta text-white hover:bg-terracotta-dark text-xs font-bold transition-all shadow-sm"
                  title="Sign out of admin"
                >
                  <LogOut className="w-3.5 h-3.5 text-peach" />
                  <span>Exit</span>
                </button>
              )}
            </div>
          </div>
        </div>


        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-peach-100/80 border border-tangerine/30 shadow-luxury mb-12 overflow-x-auto">
          {[
            { id: 'flavors', label: 'Flavors Catalog', count: flavors?.length || 0 },
            { id: 'boutiques', label: 'Boutiques & Shops', count: boutiques?.length || 0 },
            { id: 'gallery', label: 'Visual Gallery', count: galleryPhotos?.length || 0 },
            { id: 'process', label: "Craft & Alchemy", count: processSteps?.length || 0 },
            { id: 'brand', label: 'Brand & Story' },
            { id: 'pages', label: 'Page Heroes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-tangerine text-white shadow-glow-tangerine font-bold'
                  : 'text-terracotta/80 hover:text-terracotta font-medium hover:bg-peach-200/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white text-tangerine' : 'bg-peach-200 text-terracotta'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TAB 1: FLAVORS CRUD
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'flavors' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                  Flavors Catalog <span className="italic text-tangerine-600">({flavors?.length || 0})</span>
                </h2>
                <p className="text-xs text-terracotta/75 font-sans mt-1">
                  Manage signature pints, seasonal specials, tasting notes, and Brix fruit percentages.
                </p>
              </div>

              <button
                onClick={() =>
                  setFlavorModal({
                    isOpen: true,
                    mode: 'create',
                    data: {
                      name: '',
                      subtitle: '',
                      category: 'Signature Flavors',
                      tone: 'peach',
                      price: '$15.00',
                      badge: 'New Harvest',
                      notes: ['Fresh Fruit', 'Real Vanilla', 'Farm Cream'],
                      intensity: 'Smooth & Fruity',
                      sweetness: '65%',
                      tartness: '30%',
                      image: '/assets/cine-cone-hero.png',
                      description: 'Freshly harvested fruits blended into rich farm cream.',
                      origin: 'Provence, France',
                      fruitPercentage: '65% Real Fruit',
                      calories: '220 Cal / Scoop',
                      dairySource: 'Organic Grass-Fed Farm Milk',
                      pairing: 'Enjoy in a warm waffle cone.',
                      detailedStory: 'Hand-picked at peak ripeness and slow-churned in copper vats.',
                    },
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Flavor</span>
              </button>
            </div>

            {/* Flavors Table */}
            <div className="bg-peach-light/95 rounded-3xl border border-tangerine/25 shadow-luxury overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-peach-200/70 border-b border-tangerine/20 text-terracotta uppercase tracking-wider font-bold text-[11px]">
                    <tr>
                      <th className="py-4 px-6">Flavor</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Tone</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Sweet / Tart</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tangerine/15">
                    {flavors?.map((flavor) => (
                      <tr key={flavor.id} className="hover:bg-peach-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={flavor.image}
                              alt={flavor.name}
                              className="w-12 h-12 rounded-xl object-cover border border-tangerine/20 shrink-0 bg-peach-200"
                            />
                            <div>
                              <div className="font-serif text-base font-bold text-terracotta">
                                {flavor.name}
                              </div>
                              <div className="text-[11px] text-terracotta/70 font-medium">
                                {flavor.subtitle} &bull; {flavor.origin}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-peach/60 text-terracotta border border-tangerine/20">
                            {flavor.category}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-white ${
                              flavor.tone === 'peach' ? 'bg-tangerine-400' : 'bg-tangerine-600'
                            }`}
                          >
                            {flavor.tone}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-serif text-sm font-bold text-terracotta">
                          {flavor.price}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-tangerine font-bold">S:{flavor.sweetness}</span>
                            <span className="text-terracotta/40">/</span>
                            <span className="text-tangerine-600 font-bold">T:{flavor.tartness}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => setFlavorModal({ isOpen: true, mode: 'edit', data: { ...flavor } })}
                              className="p-2 rounded-full bg-peach-100 hover:bg-tangerine hover:text-white text-terracotta transition-colors border border-tangerine/30"
                              title="Edit flavor"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  isOpen: true,
                                  type: 'flavor',
                                  id: flavor.id,
                                  title: flavor.name,
                                })
                              }
                              className="p-2 rounded-full bg-peach-100 hover:bg-terracotta hover:text-white text-terracotta transition-colors border border-tangerine/30"
                              title="Delete flavor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 2: BOUTIQUES CRUD
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'boutiques' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                  Boutiques &amp; Flagship Ateliers <span className="italic text-tangerine-600">({boutiques?.length || 0})</span>
                </h2>
                <p className="text-xs text-terracotta/75 font-sans mt-1">
                  Manage flagship shop locations, hours of operation, phone numbers, and local specialties.
                </p>
              </div>

              <button
                onClick={() =>
                  setBoutiqueModal({
                    isOpen: true,
                    mode: 'create',
                    data: {
                      city: '',
                      country: '',
                      district: '',
                      address: '',
                      status: 'Open Daily 12:00 – 23:00',
                      phone: '+1 555 019 2831',
                      image: '/assets/generated/boutique_paris.jpg',
                      specialty: 'Signature Tasting Flight & Espresso',
                      metro: 'Central Station',
                      description: 'Sunlit marble counters and fresh fruit churners.',
                      coords: '0.0000° N, 0.0000° E',
                    },
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Boutique</span>
              </button>
            </div>

            {/* Boutiques Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boutiques?.map((boutique) => (
                <div
                  key={boutique.id || boutique.city}
                  className="bg-peach-light/95 rounded-3xl p-6 border border-tangerine/25 shadow-luxury flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-tangerine/20 bg-peach-200">
                      <img
                        src={boutique.image}
                        alt={boutique.city}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-terracotta/80 backdrop-blur-md text-[10px] text-peach uppercase font-bold tracking-wider">
                        {boutique.district}
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-terracotta">{boutique.city}</h3>
                    <p className="text-[11px] text-tangerine-700 font-bold uppercase tracking-wider mt-0.5">
                      {boutique.country}
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-terracotta/80 font-medium">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-tangerine shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{boutique.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-tangerine shrink-0" />
                        <span>{boutique.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-tangerine shrink-0" />
                        <span>{boutique.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-tangerine/20 flex items-center justify-between">
                    <span className="text-[10px] text-terracotta/60 font-mono">{boutique.coords}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBoutiqueModal({ isOpen: true, mode: 'edit', data: { ...boutique } })}
                        className="p-2 rounded-full bg-peach-100 hover:bg-tangerine hover:text-white text-terracotta transition-colors border border-tangerine/30"
                        title="Edit boutique"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            type: 'boutique',
                            id: boutique.id || boutique.city,
                            title: boutique.city,
                          })
                        }
                        className="p-2 rounded-full bg-peach-100 hover:bg-terracotta hover:text-white text-terracotta transition-colors border border-tangerine/30"
                        title="Delete boutique"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 3: GALLERY PHOTOS CRUD
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                  Visual Journal Gallery <span className="italic text-tangerine-600">({galleryPhotos?.length || 0})</span>
                </h2>
                <p className="text-xs text-terracotta/75 font-sans mt-1">
                  Manage imagery across Orchards, Craft, Moments, and Boutique collections.
                </p>
              </div>

              <button
                onClick={() =>
                  setPhotoModal({
                    isOpen: true,
                    mode: 'create',
                    data: {
                      title: '',
                      category: 'Orchards',
                      image: '/assets/generated/provence_peach_orchard.jpg',
                      caption: 'Sun-drenched orchards in the south of France.',
                      location: 'Provence, France',
                      aspect: 'landscape',
                    },
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Photo</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryPhotos?.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-peach-light/95 rounded-3xl p-4 border border-tangerine/25 shadow-luxury flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3 border border-tangerine/20 bg-peach-200">
                      <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-terracotta/80 backdrop-blur-md text-[10px] text-peach uppercase font-bold tracking-wider">
                        {photo.category}
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-terracotta">{photo.title}</h3>
                    <p className="text-[11px] text-tangerine-700 font-bold mt-0.5">{photo.location}</p>
                    <p className="text-xs text-terracotta/70 font-sans mt-2 line-clamp-2">{photo.caption}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-tangerine/20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setPhotoModal({ isOpen: true, mode: 'edit', data: { ...photo } })}
                      className="p-2 rounded-full bg-peach-100 hover:bg-tangerine hover:text-white text-terracotta transition-colors border border-tangerine/30"
                      title="Edit photo"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'photo',
                          id: photo.id,
                          title: photo.title,
                        })
                      }
                      className="p-2 rounded-full bg-peach-100 hover:bg-terracotta hover:text-white text-terracotta transition-colors border border-tangerine/30"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 4: PROCESS STEPS CRUD
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                  The Alchemy of Cold Steps <span className="italic text-tangerine-600">({processSteps?.length || 0})</span>
                </h2>
                <p className="text-xs text-terracotta/75 font-sans mt-1">
                  Configure the 4-stage artisanal manufacturing narrative displayed on the homepage and "How It's Made" subpage.
                </p>
              </div>

              <button
                onClick={() =>
                  setStepModal({
                    isOpen: true,
                    mode: 'create',
                    index: -1,
                    data: {
                      step: `0${(processSteps?.length || 0) + 1}`,
                      title: '',
                      tagline: '',
                      desc: '',
                      temp: '4°C Chilled',
                      metric: '100% Artisanal',
                      detail: 'Preserving pure natural flavours.',
                      icon: 'Sparkles',
                    },
                  })
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Process Stage</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {processSteps?.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-peach-light/95 rounded-3xl p-6 md:p-8 border border-tangerine/25 shadow-luxury flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-3xl font-bold text-tangerine">{step.step}</span>
                      <span className="px-3 py-1 rounded-full bg-peach/60 text-terracotta text-xs font-bold font-mono border border-tangerine/20">
                        {step.temp}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-terracotta">{step.title}</h3>
                    <p className="text-xs uppercase tracking-widest text-tangerine-700 font-bold mt-1">
                      {step.tagline}
                    </p>

                    <p className="text-xs text-terracotta/80 font-sans mt-3 leading-relaxed">{step.desc}</p>

                    <div className="mt-4 p-3 rounded-xl bg-peach-50/80 border border-tangerine/20 text-xs text-terracotta/75 font-medium">
                      <span className="font-bold text-tangerine-800">Metric: </span>
                      {step.metric} &bull; {step.detail}
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-tangerine/20 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setStepModal({ isOpen: true, mode: 'edit', index: idx, data: { ...step } })}
                      className="p-2 rounded-full bg-peach-100 hover:bg-tangerine hover:text-white text-terracotta transition-colors border border-tangerine/30"
                      title="Edit step"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          type: 'process',
                          id: idx,
                          title: `Stage ${step.step}: ${step.title}`,
                        })
                      }
                      className="p-2 rounded-full bg-peach-100 hover:bg-terracotta hover:text-white text-terracotta transition-colors border border-tangerine/30"
                      title="Delete step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 5: BRAND & MANIFESTO
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'brand' && (
          <div className="bg-peach-light/95 rounded-3xl p-8 md:p-12 border border-tangerine/25 shadow-luxury">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                  Brand Identity &bull; <span className="italic text-tangerine-600">Manifesto</span>
                </h2>
                <p className="text-xs text-terracotta/75 font-sans mt-1">
                  Updates brand naming, taglines, and editorial philosophy displayed in headers, footers, and story overlays.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateBrand({
                    name: brandForm.name,
                    tagline: brandForm.tagline,
                    manifesto: brandForm.manifesto,
                    dualTones: {
                      peach: { ...brand?.dualTones?.peach, description: brandForm.peachDescription },
                      tangerine: { ...brand?.dualTones?.tangerine, description: brandForm.tangerineDescription },
                    },
                  });
                  if (typeof document !== 'undefined') {
                    document.title = `${brandForm.name || 'Ciné'} — Haute Glacerie & Artisanal Ice Cream`;
                  }
                  window.dispatchEvent(new Event('storage'));
                  showToast(`Brand identity updated to "${brandForm.name}" — live everywhere!`);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                      Brand Tagline
                    </label>
                    <input
                      type="text"
                      value={brandForm.tagline}
                      onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-2xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                    Brand Manifesto
                  </label>
                  <textarea
                    rows={4}
                    value={brandForm.manifesto}
                    onChange={(e) => setBrandForm({ ...brandForm, manifesto: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                      Provence Peach Palette Description
                    </label>
                    <input
                      type="text"
                      value={brandForm.peachDescription}
                      onChange={(e) => setBrandForm({ ...brandForm, peachDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-terracotta font-bold mb-2">
                      Valencian Tangerine Palette Description
                    </label>
                    <input
                      type="text"
                      value={brandForm.tangerineDescription}
                      onChange={(e) => setBrandForm({ ...brandForm, tangerineDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Brand Manifesto</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            TAB 6: PAGE HEROES
        ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'pages' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl text-terracotta font-bold">
                Page Heroes &bull; <span className="italic text-tangerine-600">Editorial Copy</span>
              </h2>
              <p className="text-xs text-terracotta/75 font-sans mt-1">
                Customize the hero pill badges, titles, italic accents, and introductory paragraphs across each dedicated subpage.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { key: 'flavors', label: 'Flavors Page (#/flavors)' },
                { key: 'howItsMade', label: "How It's Made Page (#/how-its-made)" },
                { key: 'photos', label: 'Our Photos Page (#/photos)' },
                { key: 'shops', label: 'Our Shops Page (#/shops)' },
              ].map((pg) => {
                const cur = pageForm[pg.key] || {};

                return (
                  <div
                    key={pg.key}
                    className="bg-peach-light/95 rounded-3xl p-6 md:p-8 border border-tangerine/25 shadow-luxury flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-serif text-xl font-bold text-terracotta">{pg.label}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-peach/60 text-terracotta border border-tangerine/20">
                          Route: {pg.key}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-terracotta/80 font-bold mb-1">
                            Pill Badge Text
                          </label>
                          <input
                            type="text"
                            value={cur.badge || ''}
                            onChange={(e) =>
                              setPageForm({
                                ...pageForm,
                                [pg.key]: { ...cur, badge: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-terracotta/80 font-bold mb-1">
                              Headline Prefix
                            </label>
                            <input
                              type="text"
                              value={cur.title || ''}
                              onChange={(e) =>
                                setPageForm({
                                  ...pageForm,
                                  [pg.key]: { ...cur, title: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] uppercase tracking-wider text-terracotta/80 font-bold mb-1">
                              Italic Accent
                            </label>
                            <input
                              type="text"
                              value={cur.titleAccent || ''}
                              onChange={(e) =>
                                setPageForm({
                                  ...pageForm,
                                  [pg.key]: { ...cur, titleAccent: e.target.value },
                                })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine text-tangerine font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-terracotta/80 font-bold mb-1">
                            Introductory Description
                          </label>
                          <textarea
                            rows={3}
                            value={cur.description || ''}
                            onChange={(e) =>
                              setPageForm({
                                ...pageForm,
                                [pg.key]: { ...cur, description: e.target.value },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-xs font-sans text-terracotta focus:outline-none focus:border-tangerine leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-tangerine/20 flex justify-end">
                      <button
                        onClick={() => {
                          updatePageContent(pg.key, pageForm[pg.key]);
                          showToast(`Updated hero for ${pg.label}`);
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-tangerine hover:bg-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save {pg.key}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MODAL: FLAVOR CREATE / EDIT
        ═══════════════════════════════════════════════════════════ */}
        {flavorModal.isOpen && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={() => setFlavorModal({ isOpen: false, mode: 'create', data: null })}
            className="fixed inset-0 z-50 bg-terracotta/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="bg-peach-light rounded-3xl border-2 border-tangerine shadow-2xl max-w-2xl w-full flex flex-col max-h-[88vh] overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (flavorModal.mode === 'create') {
                    addFlavor(flavorModal.data);
                    showToast(`Flavor "${flavorModal.data.name}" created!`);
                  } else {
                    updateFlavor(flavorModal.data.id, flavorModal.data);
                    showToast(`Flavor "${flavorModal.data.name}" updated!`);
                  }
                  setFlavorModal({ isOpen: false, mode: 'create', data: null });
                }}
                className="flex flex-col h-full max-h-[88vh] overflow-hidden"
              >
                {/* Sticky Modal Header */}
                <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-tangerine/20 bg-peach-light/95 backdrop-blur-sm shrink-0">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-terracotta">
                      {flavorModal.mode === 'create' ? 'Create New Flavor' : 'Edit Flavor'}
                    </h3>
                    <span className="text-xs text-tangerine-700 font-bold uppercase tracking-wider">
                      {flavorModal.data.name || 'Untitled Flavor'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFlavorModal({ isOpen: false, mode: 'create', data: null })}
                    className="p-2 rounded-full hover:bg-peach-200 text-terracotta transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Modal Body (Isolated from background scroll) */}
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs font-sans flex-1"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Flavor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={flavorModal.data.name}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, name: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-semibold focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Subtitle *
                      </label>
                      <input
                        type="text"
                        required
                        value={flavorModal.data.subtitle}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, subtitle: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Category
                      </label>
                      <select
                        value={flavorModal.data.category}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, category: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      >
                        <option value="Signature Flavors">Signature Flavors</option>
                        <option value="Seasonal Specials">Seasonal Specials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Palette Tone
                      </label>
                      <select
                        value={flavorModal.data.tone}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, tone: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      >
                        <option value="peach">Provence Peach</option>
                        <option value="tangerine">Valencian Tangerine</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Price *
                      </label>
                      <input
                        type="text"
                        required
                        value={flavorModal.data.price}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, price: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono font-bold focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={flavorModal.data.badge}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, badge: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Sweetness (%)
                      </label>
                      <input
                        type="text"
                        value={flavorModal.data.sweetness}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, sweetness: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Tartness (%)
                      </label>
                      <input
                        type="text"
                        value={flavorModal.data.tartness}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, tartness: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Fruit Origin
                      </label>
                      <input
                        type="text"
                        value={flavorModal.data.origin}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, origin: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Fruit Percentage
                      </label>
                      <input
                        type="text"
                        value={flavorModal.data.fruitPercentage}
                        onChange={(e) =>
                          setFlavorModal({
                            ...flavorModal,
                            data: { ...flavorModal.data, fruitPercentage: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  {/* Drag-and-Drop Image Uploader */}
                  <ImageDropzone
                    label="Flavor Visual Asset"
                    value={flavorModal.data.image}
                    onChange={(img) =>
                      setFlavorModal({
                        ...flavorModal,
                        data: { ...flavorModal.data, image: img },
                      })
                    }
                    helperText="Drop flavor image or cone visual here, or click to browse"
                  />

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Sensory Notes (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(flavorModal.data.notes)
                          ? flavorModal.data.notes.join(', ')
                          : flavorModal.data.notes
                      }
                      onChange={(e) =>
                        setFlavorModal({
                          ...flavorModal,
                          data: {
                            ...flavorModal.data,
                            notes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Storefront Description
                    </label>
                    <textarea
                      rows={2}
                      value={flavorModal.data.description}
                      onChange={(e) =>
                        setFlavorModal({
                          ...flavorModal,
                          data: { ...flavorModal.data, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta leading-relaxed focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Detailed Heritage Story
                    </label>
                    <textarea
                      rows={3}
                      value={flavorModal.data.detailedStory}
                      onChange={(e) =>
                        setFlavorModal({
                          ...flavorModal,
                          data: { ...flavorModal.data, detailedStory: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta leading-relaxed focus:outline-none focus:border-tangerine"
                    />
                  </div>
                </div>

                {/* Sticky Modal Footer: Save & Cancel Buttons Always in Sight */}
                <div className="px-6 md:px-8 py-4 border-t border-tangerine/20 bg-peach-light/95 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFlavorModal({ isOpen: false, mode: 'create', data: null })}
                    className="px-5 py-2.5 rounded-full bg-peach-200 text-terracotta font-bold text-xs uppercase tracking-wider hover:bg-peach-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{flavorModal.mode === 'create' ? 'Create Flavor' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MODAL: BOUTIQUE CREATE / EDIT
        ═══════════════════════════════════════════════════════════ */}
        {boutiqueModal.isOpen && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={() => setBoutiqueModal({ isOpen: false, mode: 'create', data: null })}
            className="fixed inset-0 z-50 bg-terracotta/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="bg-peach-light rounded-3xl border-2 border-tangerine shadow-2xl max-w-xl w-full flex flex-col max-h-[88vh] overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (boutiqueModal.mode === 'create') {
                    addBoutique(boutiqueModal.data);
                    showToast(`Boutique in "${boutiqueModal.data.city}" created!`);
                  } else {
                    updateBoutique(boutiqueModal.data.id || boutiqueModal.data.city, boutiqueModal.data);
                    showToast(`Boutique in "${boutiqueModal.data.city}" updated!`);
                  }
                  setBoutiqueModal({ isOpen: false, mode: 'create', data: null });
                }}
                className="flex flex-col h-full max-h-[88vh] overflow-hidden"
              >
                {/* Sticky Modal Header */}
                <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-tangerine/20 bg-peach-light/95 backdrop-blur-sm shrink-0">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-terracotta">
                      {boutiqueModal.mode === 'create' ? 'Add Boutique Flagship' : 'Edit Boutique Flagship'}
                    </h3>
                    <span className="text-xs text-tangerine-700 font-bold uppercase tracking-wider">
                      {boutiqueModal.data.city || 'New Location'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBoutiqueModal({ isOpen: false, mode: 'create', data: null })}
                    className="p-2 rounded-full hover:bg-peach-200 text-terracotta transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Modal Body (Isolated from background scroll) */}
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs font-sans flex-1"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={boutiqueModal.data.city}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, city: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-semibold focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        value={boutiqueModal.data.country}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, country: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        District / Quarter
                      </label>
                      <input
                        type="text"
                        value={boutiqueModal.data.district}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, district: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={boutiqueModal.data.phone}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, phone: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={boutiqueModal.data.address}
                      onChange={(e) =>
                        setBoutiqueModal({
                          ...boutiqueModal,
                          data: { ...boutiqueModal.data, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Opening Hours
                      </label>
                      <input
                        type="text"
                        value={boutiqueModal.data.status}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, status: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Coordinates
                      </label>
                      <input
                        type="text"
                        value={boutiqueModal.data.coords}
                        onChange={(e) =>
                          setBoutiqueModal({
                            ...boutiqueModal,
                            data: { ...boutiqueModal.data, coords: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Local Specialty
                    </label>
                    <input
                      type="text"
                      value={boutiqueModal.data.specialty}
                      onChange={(e) =>
                        setBoutiqueModal({
                          ...boutiqueModal,
                          data: { ...boutiqueModal.data, specialty: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  {/* Drag-and-Drop Image Uploader */}
                  <ImageDropzone
                    label="Boutique Exterior / Interior Photo"
                    value={boutiqueModal.data.image || ''}
                    onChange={(img) =>
                      setBoutiqueModal({
                        ...boutiqueModal,
                        data: { ...boutiqueModal.data, image: img },
                      })
                    }
                    helperText="Drop boutique photo or storefront render here, or click to browse"
                  />

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Atelier Atmosphere Description
                    </label>
                    <textarea
                      rows={3}
                      value={boutiqueModal.data.description}
                      onChange={(e) =>
                        setBoutiqueModal({
                          ...boutiqueModal,
                          data: { ...boutiqueModal.data, description: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta leading-relaxed focus:outline-none focus:border-tangerine"
                    />
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div className="px-6 md:px-8 py-4 border-t border-tangerine/20 bg-peach-light/95 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setBoutiqueModal({ isOpen: false, mode: 'create', data: null })}
                    className="px-5 py-2.5 rounded-full bg-peach-200 text-terracotta font-bold text-xs uppercase tracking-wider hover:bg-peach-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{boutiqueModal.mode === 'create' ? 'Add Boutique' : 'Save Boutique'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MODAL: PHOTO CREATE / EDIT
        ═══════════════════════════════════════════════════════════ */}
        {photoModal.isOpen && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={() => setPhotoModal({ isOpen: false, mode: 'create', data: null })}
            className="fixed inset-0 z-50 bg-terracotta/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="bg-peach-light rounded-3xl border-2 border-tangerine shadow-2xl max-w-lg w-full flex flex-col max-h-[88vh] overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (photoModal.mode === 'create') {
                    addPhoto(photoModal.data);
                    showToast(`Photo "${photoModal.data.title}" added!`);
                  } else {
                    updatePhoto(photoModal.data.id, photoModal.data);
                    showToast(`Photo "${photoModal.data.title}" updated!`);
                  }
                  setPhotoModal({ isOpen: false, mode: 'create', data: null });
                }}
                className="flex flex-col h-full max-h-[88vh] overflow-hidden"
              >
                {/* Sticky Modal Header */}
                <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-tangerine/20 bg-peach-light/95 backdrop-blur-sm shrink-0">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-terracotta">
                      {photoModal.mode === 'create' ? 'Add Gallery Image' : 'Edit Gallery Image'}
                    </h3>
                    <span className="text-xs text-tangerine-700 font-bold uppercase tracking-wider">
                      {photoModal.data.title || 'New Capture'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPhotoModal({ isOpen: false, mode: 'create', data: null })}
                    className="p-2 rounded-full hover:bg-peach-200 text-terracotta transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Modal Body (Isolated from background scroll) */}
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs font-sans flex-1"
                >
                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Image Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={photoModal.data.title}
                      onChange={(e) =>
                        setPhotoModal({
                          ...photoModal,
                          data: { ...photoModal.data, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-semibold focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Category
                      </label>
                      <select
                        value={photoModal.data.category}
                        onChange={(e) =>
                          setPhotoModal({
                            ...photoModal,
                            data: { ...photoModal.data, category: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      >
                        <option value="Orchards">Orchards</option>
                        <option value="Craft">Craft</option>
                        <option value="Moments">Moments</option>
                        <option value="Boutiques">Boutiques</option>
                      </select>
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={photoModal.data.location}
                        onChange={(e) =>
                          setPhotoModal({
                            ...photoModal,
                            data: { ...photoModal.data, location: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  {/* Drag-and-Drop Image Uploader */}
                  <ImageDropzone
                    label="Gallery Visual Journal Photo"
                    value={photoModal.data.image || ''}
                    onChange={(img) =>
                      setPhotoModal({
                        ...photoModal,
                        data: { ...photoModal.data, image: img },
                      })
                    }
                    helperText="Drop photograph or visual journal capture here, or click to browse"
                  />

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Editorial Caption
                    </label>
                    <textarea
                      rows={3}
                      value={photoModal.data.caption}
                      onChange={(e) =>
                        setPhotoModal({
                          ...photoModal,
                          data: { ...photoModal.data, caption: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta leading-relaxed focus:outline-none focus:border-tangerine"
                    />
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div className="px-6 md:px-8 py-4 border-t border-tangerine/20 bg-peach-light/95 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPhotoModal({ isOpen: false, mode: 'create', data: null })}
                    className="px-5 py-2.5 rounded-full bg-peach-200 text-terracotta font-bold text-xs uppercase tracking-wider hover:bg-peach-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{photoModal.mode === 'create' ? 'Add Photo' : 'Save Photo'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MODAL: PROCESS STEP CREATE / EDIT
        ═══════════════════════════════════════════════════════════ */}
        {stepModal.isOpen && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onClick={() => setStepModal({ isOpen: false, mode: 'create', data: null, index: -1 })}
            className="fixed inset-0 z-50 bg-terracotta/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="bg-peach-light rounded-3xl border-2 border-tangerine shadow-2xl max-w-lg w-full flex flex-col max-h-[88vh] overflow-hidden"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (stepModal.mode === 'create') {
                    addProcessStep(stepModal.data);
                    showToast(`Stage "${stepModal.data.title}" added!`);
                  } else {
                    updateProcessStep(stepModal.index, stepModal.data);
                    showToast(`Stage "${stepModal.data.title}" updated!`);
                  }
                  setStepModal({ isOpen: false, mode: 'create', data: null, index: -1 });
                }}
                className="flex flex-col h-full max-h-[88vh] overflow-hidden"
              >
                {/* Sticky Modal Header */}
                <div className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-tangerine/20 bg-peach-light/95 backdrop-blur-sm shrink-0">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-terracotta">
                      {stepModal.mode === 'create' ? 'Add Process Step' : 'Edit Process Step'}
                    </h3>
                    <span className="text-xs text-tangerine-700 font-bold uppercase tracking-wider">
                      Stage {stepModal.data.step}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStepModal({ isOpen: false, mode: 'create', data: null, index: -1 })}
                    className="p-2 rounded-full hover:bg-peach-200 text-terracotta transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Scrollable Modal Body */}
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="p-6 md:p-8 overflow-y-auto space-y-4 text-xs font-sans flex-1"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Step Number (e.g. 05)
                      </label>
                      <input
                        type="text"
                        required
                        value={stepModal.data.step}
                        onChange={(e) =>
                          setStepModal({
                            ...stepModal,
                            data: { ...stepModal.data, step: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-mono font-bold focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Temperature / Ambient
                      </label>
                      <input
                        type="text"
                        value={stepModal.data.temp}
                        onChange={(e) =>
                          setStepModal({
                            ...stepModal,
                            data: { ...stepModal.data, temp: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={stepModal.data.title}
                      onChange={(e) =>
                        setStepModal({
                          ...stepModal,
                          data: { ...stepModal.data, title: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta font-semibold focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={stepModal.data.tagline}
                      onChange={(e) =>
                        setStepModal({
                          ...stepModal,
                          data: { ...stepModal.data, tagline: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={stepModal.data.desc}
                      onChange={(e) =>
                        setStepModal({
                          ...stepModal,
                          data: { ...stepModal.data, desc: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta leading-relaxed focus:outline-none focus:border-tangerine"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Key Metric
                      </label>
                      <input
                        type="text"
                        value={stepModal.data.metric}
                        onChange={(e) =>
                          setStepModal({
                            ...stepModal,
                            data: { ...stepModal.data, metric: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>

                    <div>
                      <label className="block uppercase tracking-wider font-bold text-terracotta mb-1">
                        Detail Note
                      </label>
                      <input
                        type="text"
                        value={stepModal.data.detail}
                        onChange={(e) =>
                          setStepModal({
                            ...stepModal,
                            data: { ...stepModal.data, detail: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-peach-50 border border-tangerine/30 text-terracotta focus:outline-none focus:border-tangerine"
                      />
                    </div>
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div className="px-6 md:px-8 py-4 border-t border-tangerine/20 bg-peach-light/95 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setStepModal({ isOpen: false, mode: 'create', data: null, index: -1 })}
                    className="px-5 py-2.5 rounded-full bg-peach-200 text-terracotta font-bold text-xs uppercase tracking-wider hover:bg-peach-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-full bg-gradient-to-r from-tangerine to-tangerine-deep text-white font-bold text-xs uppercase tracking-wider shadow-glow-tangerine hover:scale-105 transition-all flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{stepModal.mode === 'create' ? 'Add Stage' : 'Save Stage'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MODAL: DELETE CONFIRMATION
        ═══════════════════════════════════════════════════════════ */}
        {deleteConfirm.isOpen && (
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 bg-terracotta/75 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              data-lenis-prevent="true"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              className="bg-peach-light rounded-3xl border-2 border-terracotta shadow-2xl max-w-sm w-full p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-peach" />
              </div>
              <h3 className="font-serif text-xl font-bold text-terracotta">Confirm Deletion</h3>
              <p className="text-xs text-terracotta/75 font-sans mt-2">
                Are you sure you want to remove <span className="font-bold text-terracotta">"{deleteConfirm.title}"</span>? This will take effect on the live website immediately.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
                  className="px-5 py-2.5 rounded-full bg-peach-200 text-terracotta font-bold text-xs uppercase tracking-wider hover:bg-peach-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirm.type === 'flavor') deleteFlavor(deleteConfirm.id);
                    if (deleteConfirm.type === 'boutique') deleteBoutique(deleteConfirm.id);
                    if (deleteConfirm.type === 'photo') deletePhoto(deleteConfirm.id);
                    if (deleteConfirm.type === 'process') deleteProcessStep(deleteConfirm.id);
                    showToast(`Deleted "${deleteConfirm.title}"`);
                    setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
                  }}
                  className="px-5 py-2.5 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
