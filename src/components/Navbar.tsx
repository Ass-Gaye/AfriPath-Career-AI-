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
} from 'lucide-react';
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
  onOpenSettings: (tab?: 'profile' | 'security' | 'danger-zone') => void;
  onLogout: () => void;
  onLoadDemoUser: () => void;
  isDemoUser: boolean;
  onOpenTranslationAdmin?: () => void;
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

  const navItems = [
    { id: 'landing', label: t('navigation:home'), icon: Compass },
    { id: 'dashboard', label: t('navigation:dashboard'), icon: TrendingUp, disabled: !userProfile },
    { id: 'matches', label: t('navigation:matches'), icon: Target, disabled: !userProfile },
    { id: 'skill-gap', label: t('navigation:skillGap'), icon: FileText, disabled: !userProfile },
    { id: 'roadmap', label: t('navigation:roadmap'), icon: TrendingUp, disabled: !userProfile },
    { id: 'cv-builder', label: t('navigation:cvBuilder'), icon: FileCheck, disabled: !userProfile },
    { id: 'gambia-map', label: t('navigation:opportunities'), icon: Briefcase },
    { id: 'mentor', label: t('navigation:advisor'), icon: MessageSquare },
  ];

  const displayName = authUser?.fullName || userProfile?.name || t('navigation:viewProfile');
  const displayEmail = authUser?.email || 'Authenticated User';

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: AfriPath AI Brand Logo */}
        <button
          onClick={() => setActiveTab(userProfile ? 'dashboard' : 'landing')}
          className="flex items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl py-1 transition hover:opacity-90 shrink-0"
        >
          <AfriPathLogo size="md" showTagline={false} />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDisabled
                    ? 'text-slate-600 cursor-not-allowed opacity-40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={isDisabled ? 'Complete career assessment to unlock' : item.label}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions, Language Selector & Account Menu */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pan-African Language Selector Dropdown */}
          <LanguageSelector
            variant="compact"
            onOpenAdmin={onOpenTranslationAdmin}
          />

          {!authUser && !isDemoUser && (
            <button
              onClick={onLoadDemoUser}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition whitespace-nowrap"
              title="Load Musa Jallow Demo Profile"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Demo</span>
            </button>
          )}

          {/* If authenticated user */}
          {authUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition border border-slate-700 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate max-w-[100px]">{displayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95">
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
                    <span>{t('navigation:dashboard')}</span>
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

                  {onOpenTranslationAdmin && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenTranslationAdmin();
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium text-emerald-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Globe2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('navigation:adminTranslations')}</span>
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
                    <span>{t('navigation:logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated guest buttons */
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('navigation:login')}</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('navigation:signup')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden overflow-x-auto border-t border-slate-800 bg-slate-900 px-3 py-2 flex items-center gap-1.5 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              disabled={isDisabled}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white'
                  : isDisabled
                  ? 'text-slate-600 opacity-40'
                  : 'text-slate-400 hover:text-white bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
