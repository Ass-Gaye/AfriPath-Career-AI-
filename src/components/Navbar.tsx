import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Target,
  UserCheck,
  MapPin,
  MessageSquare,
  FileText,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Shield,
  AlertTriangle,
  ChevronDown,
  LogIn,
  UserPlus,
  Briefcase,
  FileCheck,
  Globe2,
  Globe,
  Zap,
  ShieldAlert,
  HelpCircle,
  Smartphone,
  Download,
} from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { AfriPathLogo } from './AfriPathLogo';
import { LanguageSelector } from './LanguageSelector';
import { UserProfile } from '../types/career';
import { AuthUser } from '../services/api';
import { AuthMode } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  authUser: AuthUser | null;
  onOpenAuth: (mode: AuthMode) => void;
  onOpenSettings: (tab?: 'profile' | 'security' | 'danger-zone' | 'application') => void;
  onLogout: () => void;
  onLoadDemoUser: () => void;
  isDemoUser: boolean;
  onOpenTranslationAdmin?: () => void;
  onOpenAboutModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  authUser,
  onOpenAuth,
  onOpenSettings,
  onLogout,
  onLoadDemoUser,
  isDemoUser,
  onOpenTranslationAdmin,
  onOpenAboutModal,
}) => {
  const { t } = useTranslation(['navigation', 'common']);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic Navigation Items based on auth state
  const publicNavItems = [
    { id: 'landing', label: t('navigation:home', 'Home'), icon: Compass },
    { id: 'careers', label: 'Careers', icon: Compass },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'opportunities', label: t('navigation:opportunities', 'Opportunities'), icon: Briefcase },
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'mentor', label: t('navigation:advisor', 'AI Advisor'), icon: MessageSquare },
  ];

  const authenticatedNavItems = [
    { id: 'dashboard', label: t('navigation:dashboard', 'Dashboard'), icon: TrendingUp },
    { id: 'my-path', label: 'My Path', icon: Compass },
    { id: 'careers', label: 'Careers', icon: Target },
    { id: 'skills', label: 'Skills', icon: Zap },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'roadmap', label: '90-Day Plan', icon: FileText },
    { id: 'cv-builder', label: t('navigation:cvBuilder', 'AI CV'), icon: FileCheck },
    { id: 'mentor', label: t('navigation:advisor', 'AI Advisor'), icon: MessageSquare },
  ];

  const currentNavItems = (authUser || userProfile) ? authenticatedNavItems : publicNavItems;

  const displayName = authUser?.fullName || userProfile?.name || t('navigation:viewProfile', 'Profile');
  const displayEmail = authUser?.email || (isDemoUser ? 'demo@afripath.ai' : 'Guest Account');

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Zone 1: AfriPath AI Brand Logo */}
        <button
          onClick={() => setActiveTab((authUser || userProfile) ? 'dashboard' : 'landing')}
          className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl py-1 transition hover:opacity-90 shrink-0"
        >
          <div className="sm:hidden">
            <AfriPathLogo size="sm" showTagline={false} />
          </div>
          <div className="hidden sm:block">
            <AfriPathLogo size="md" showTagline={false} />
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions, Language Selector & Account Menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 flex-nowrap">
          {/* Pan-African Language Selector Dropdown */}
          <LanguageSelector
            variant="compact"
            onOpenAdmin={onOpenTranslationAdmin}
          />

          {!authUser && !isDemoUser && (
            <button
              onClick={onLoadDemoUser}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition whitespace-nowrap"
              title="Load Musa Jallow Demo Profile"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Demo</span>
            </button>
          )}

          {/* If authenticated user */}
          {(authUser || userProfile) ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1 sm:gap-2 text-xs font-semibold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 shadow-sm shrink-0"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[70px] sm:max-w-[110px]">{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1rem)] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <div className="text-xs font-bold text-white truncate">{displayName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{displayEmail}</div>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>{t('navigation:dashboard', 'Dashboard')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setActiveTab('my-path');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>My Career Pathway</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setActiveTab('admin');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-purple-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-400" />
                    <span>Admin Control Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings('profile');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Profile Management</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings('security');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Security & Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings('application');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>App & PWA Offline</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono">v1.0.0</span>
                  </button>

                  {onOpenTranslationAdmin && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenTranslationAdmin();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-emerald-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Globe2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('navigation:adminTranslations', 'Translation Studio')}</span>
                    </button>
                  )}

                  {onOpenAboutModal && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAboutModal();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>About & Support</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenSettings('danger-zone');
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-red-300 hover:bg-red-950/50 flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Reset Career Profile</span>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span>{t('navigation:logout', 'Log Out')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated guest buttons */
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 flex-nowrap">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('navigation:login', 'Log In')}</span>
                <span className="sm:hidden">Login</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold transition shadow-sm flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{t('navigation:signup', 'Sign Up')}</span>
                <span className="sm:hidden">Join</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
