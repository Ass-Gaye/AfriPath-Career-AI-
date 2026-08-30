import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Compass,
  Target,
  Briefcase,
  MessageSquare,
  Zap,
  FileText,
  FileCheck,
  Globe,
  Settings,
  ShieldAlert,
  User,
  LogOut,
  X,
  ChevronRight,
  Sparkles,
  Menu,
  HelpCircle,
} from 'lucide-react';
import { UserProfile } from '../types/career';
import { AuthUser } from '../services/api';
import { AuthMode } from './AuthModal';

interface MobileBottomNavProps {
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
  onOpenAboutModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const isAuthenticated = Boolean(authUser || userProfile);

  // Close more menu when active tab changes
  useEffect(() => {
    setMoreMenuOpen(false);
  }, [activeTab]);

  // Primary 4 bar items + More button (5 items total for perfect mobile width fitting)
  const authenticatedPrimaryTabs = [
    { id: 'dashboard', label: t('navigation:dashboard', 'Dashboard'), icon: TrendingUp },
    { id: 'my-path', label: t('navigation:myPath', 'My Path'), icon: Compass },
    { id: 'careers', label: t('navigation:careers', 'Careers'), icon: Target },
    { id: 'opportunities', label: t('navigation:opportunities', 'Jobs'), icon: Briefcase },
  ];

  const publicPrimaryTabs = [
    { id: 'landing', label: t('navigation:home', 'Home'), icon: Compass },
    { id: 'careers', label: t('navigation:careers', 'Careers'), icon: Target },
    { id: 'skills', label: t('navigation:skills', 'Skills'), icon: Zap },
    { id: 'opportunities', label: t('navigation:opportunities', 'Jobs'), icon: Briefcase },
  ];

  const primaryTabs = isAuthenticated ? authenticatedPrimaryTabs : publicPrimaryTabs;

  // Secondary items shown in the "More" Drawer
  const secondaryMenuItems = isAuthenticated
    ? [
        { id: 'mentor', label: t('navigation:advisor', 'AI Career Advisor'), icon: MessageSquare, desc: t('navigation:advisorDesc', 'Chat with real-time coach') },
        { id: 'roadmap', label: t('navigation:roadmap', '90-Day Roadmap Plan'), icon: FileText, desc: t('navigation:roadmapDesc', 'Weekly milestones & skill sprints') },
        { id: 'cv-builder', label: t('navigation:cvBuilder', 'AI CV & Resume Studio'), icon: FileCheck, desc: t('navigation:cvBuilderDesc', 'Download ATS-ready PDF') },
        { id: 'skills', label: t('navigation:skills', 'Skills Intelligence'), icon: Zap, desc: t('navigation:skillsDesc', 'Technical & vocational directory') },
        { id: 'countries', label: t('navigation:countries', 'African Ecosystems'), icon: Globe, desc: t('navigation:countriesDesc', 'Universities, TVET & salaries') },
        { id: 'admin', label: t('navigation:adminHub', 'Admin Control Hub'), icon: ShieldAlert, desc: t('navigation:adminHubDesc', 'Taxonomies & translations') },
      ]
    : [
        { id: 'mentor', label: t('navigation:advisor', 'AI Career Advisor'), icon: MessageSquare, desc: t('navigation:advisorDesc', 'Instant career guidance') },
        { id: 'countries', label: t('navigation:countries', 'African Ecosystems'), icon: Globe, desc: t('navigation:countriesDesc', '14+ countries education & salary data') },
        { id: 'about', label: t('navigation:about', 'About AfriPath AI'), icon: HelpCircle, desc: t('navigation:aboutDesc', 'Mission, vision & partner inquiries') },
      ];

  const isMoreActive = secondaryMenuItems.some((item) => item.id === activeTab);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-navigation"
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] px-1 sm:px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-center justify-between gap-1 w-full max-w-lg mx-auto">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`bottom-nav-${tab.id}`}
                onClick={() => {
                  setMoreMenuOpen(false);
                  setActiveTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center flex-1 min-w-0 min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 active:scale-95'
                }`}
              >
                {/* Active Indicator Top Light */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 bg-emerald-300 rounded-full shadow-[0_0_6px_#34d399]" />
                )}

                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
                <span className="text-[10px] xs:text-[11px] leading-tight mt-0.5 tracking-tight truncate max-w-full font-medium text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* "More / Menu" Button */}
          <button
            id="bottom-nav-more"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className={`relative flex flex-col items-center justify-center flex-1 min-w-0 min-h-[48px] py-1 px-0.5 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
              moreMenuOpen || isMoreActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 font-bold'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 active:scale-95'
            }`}
          >
            {(moreMenuOpen || isMoreActive) && (
              <span className="absolute -top-1 w-6 h-1 bg-emerald-300 rounded-full shadow-[0_0_6px_#34d399]" />
            )}
            <Menu
              className={`w-5 h-5 transition-transform duration-200 ${
                moreMenuOpen || isMoreActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
              }`}
            />
            <span className="text-[10px] xs:text-[11px] leading-tight mt-0.5 tracking-tight truncate font-medium text-center">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* "More" Slide-Up Bottom Sheet Drawer */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Backdrop click to dismiss */}
          <div
            className="flex-1 w-full"
            onClick={() => setMoreMenuOpen(false)}
          />

          {/* Sheet Content */}
          <div className="w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-6 duration-300 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {/* Header & Drag Handle */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">All Platform Features</h3>
                  <p className="text-xs text-slate-400">Navigate the Pan-African career system</p>
                </div>
              </div>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Options */}
            <div className="space-y-1.5">
              {secondaryMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'about') {
                        setMoreMenuOpen(false);
                        onOpenAboutModal?.();
                      } else {
                        setActiveTab(item.id);
                        setMoreMenuOpen(false);
                      }
                    }}
                    className={`w-full min-h-[50px] px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition text-left ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-800 text-emerald-400 border border-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.label}</div>
                        <div className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* User Account / Management Section */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Account & Settings
              </div>

              {isAuthenticated ? (
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onOpenSettings('profile');
                    }}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 flex items-center gap-3 text-xs font-medium transition"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Profile Management</span>
                  </button>

                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onOpenSettings('security');
                    }}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 flex items-center gap-3 text-xs font-medium transition"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Security & Password</span>
                  </button>

                  {onOpenTranslationAdmin && (
                    <button
                      onClick={() => {
                        setMoreMenuOpen(false);
                        onOpenTranslationAdmin();
                      }}
                      className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-emerald-300 flex items-center gap-3 text-xs font-medium transition"
                    >
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>{t('navigation:adminTranslations', 'Translation Studio')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full min-h-[46px] px-3.5 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-300 flex items-center gap-3 text-xs font-medium transition"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="min-h-[46px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      onOpenAuth('signup');
                    }}
                    className="min-h-[46px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              {!isAuthenticated && !isDemoUser && (
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    onLoadDemoUser();
                  }}
                  className="w-full min-h-[46px] mt-1 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 font-medium text-xs flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Try Demo (Musa Jallow Profile)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
