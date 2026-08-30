/**
 * AfriPath AI
 * Pan-African Career Intelligence Platform
 * "Your Career. Your Skills. Your Future."
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { Dashboard } from './components/Dashboard';
import { CareerReport } from './components/CareerReport';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { RegionalCareerMap } from './components/RegionalCareerMap';
import { MentorChat } from './components/MentorChat';
import { ReportModal } from './components/ReportModal';
import { AICVBuilder } from './components/AICVBuilder';
import { AuthModal, AuthMode } from './components/AuthModal';
import { SettingsModal, SettingsTab } from './components/SettingsModal';
import { TranslationAdminModal } from './components/TranslationAdminModal';
import { CareersExplorer } from './components/CareersExplorer';
import { SkillsExplorer } from './components/SkillsExplorer';
import { OpportunitiesExplorer } from './components/OpportunitiesExplorer';
import { CountriesExplorer } from './components/CountriesExplorer';
import { MyPathView } from './components/MyPathView';
import { AdminHub } from './components/AdminHub';
import { AboutContactModal } from './components/AboutContactModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ConnectionStatusBadge } from './components/ConnectionStatusBadge';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AppUpdateToast } from './components/AppUpdateToast';
import { OfflineView } from './components/OfflineView';
import {
  UserProfile,
  CareerMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  CVData,
} from './types/career';
import {
  MUSA_JALLOW_PROFILE,
  MUSA_JALLOW_CAREER_MATCHES,
  MUSA_JALLOW_SKILL_GAP,
  MUSA_JALLOW_ROADMAP,
  MUSA_JALLOW_CV,
} from './data/demoUser';
import {
  fetchCareerMatches,
  fetchSkillGap,
  fetchRoadmap,
  getCurrentUserSession,
  logoutUser,
  saveUserProfile,
  saveCareerMatches,
  saveSkillGapAnalysis,
  saveRoadmapData,
  updateRoadmapTaskProgress,
  saveCVData,
  AuthUser,
  CompleteUserData,
} from './services/api';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation & Core App State
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [targetCareer, setTargetCareer] = useState<string>('Software Developer (Frontend / Full-Stack)');
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['w1-t1', 'w1-t2', 'w1-t3', 'w2-t1']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [mentorInitialQuery, setMentorInitialQuery] = useState<string | null>(null);

  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Settings & Reset State
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [settingsModalTab, setSettingsModalTab] = useState<SettingsTab>('profile');

  // Modals & Banners
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTranslationAdminOpen, setIsTranslationAdminOpen] = useState<boolean>(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [systemBanner, setSystemBanner] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  // Check persistent session & URL query shortcuts on initial mount
  useEffect(() => {
    // Check URL parameters for PWA shortcuts and direct links
    const searchParams = new URLSearchParams(window.location.search);
    const requestedTab = searchParams.get('tab');
    const isOfflinePath = window.location.pathname === '/offline' || requestedTab === 'offline';

    if (isOfflinePath) {
      setActiveTab('offline');
      return;
    }

    async function restoreSession() {
      try {
        const session = await getCurrentUserSession();
        if (session && session.user) {
          setAuthUser(session.user);
          setIsDemoUser(false);

          if (session.data && session.data.profile) {
            setUserProfile(session.data.profile);
            setCareerMatches(session.data.careerMatches || []);
            setSkillGap(session.data.skillGap || null);
            setRoadmap(session.data.roadmap || null);
            setCompletedTaskIds(session.data.completedTaskIds || []);
            setCvData(session.data.cvData || null);

            if (session.data.careerMatches && session.data.careerMatches[0]?.title) {
              setTargetCareer(session.data.careerMatches[0].title);
            }
            // If requested a specific tab from PWA shortcut, prefer that tab
            if (requestedTab) {
              setActiveTab(requestedTab);
            } else {
              setActiveTab('dashboard');
            }
          } else {
            // Logged in user without completed profile
            setActiveTab(requestedTab || 'assessment');
          }
        } else if (requestedTab) {
          setActiveTab(requestedTab);
        }
      } catch (err) {
        console.warn('Could not restore session:', err);
        if (requestedTab) {
          setActiveTab(requestedTab);
        }
      }
    }
    restoreSession();
  }, []);

  // Handle Authentication Success
  const handleAuthSuccess = (user: AuthUser, data?: CompleteUserData) => {
    setAuthUser(user);
    setIsDemoUser(false);

    if (data && data.profile && data.hasCompletedProfile) {
      setUserProfile(data.profile);
      setCareerMatches(data.careerMatches || []);
      setSkillGap(data.skillGap || null);
      setRoadmap(data.roadmap || null);
      setCompletedTaskIds(data.completedTaskIds || []);
      setCvData(data.cvData || null);

      if (data.careerMatches && data.careerMatches[0]?.title) {
        setTargetCareer(data.careerMatches[0].title);
      }
      setActiveTab('dashboard');
      setSystemBanner({
        type: 'success',
        message: `Welcome back, ${user.fullName}! Your AfriPath career profile and roadmaps are ready.`,
      });
    } else {
      // New user registration -> proceed to Career Profile Setup
      setUserProfile(null);
      setCareerMatches([]);
      setSkillGap(null);
      setRoadmap(null);
      setCvData(null);
      setCompletedTaskIds([]);
      setActiveTab('assessment');
      setSystemBanner({
        type: 'success',
        message: `Account created for ${user.fullName}. Let's set up your personalized career journey.`,
      });
    }

    setTimeout(() => {
      setSystemBanner(null);
    }, 6000);
  };

  // Handle User Log Out
  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
    setUserProfile(null);
    setCareerMatches([]);
    setSkillGap(null);
    setRoadmap(null);
    setCvData(null);
    setIsDemoUser(false);
    setCompletedTaskIds([]);
    setActiveTab('landing');
    setSystemBanner({
      type: 'info',
      message: 'You have been safely logged out. Your career data remains securely saved.',
    });
    setTimeout(() => setSystemBanner(null), 4000);
  };

  // Load Demo User (Musa Jallow)
  const handleLoadDemoUser = async () => {
    setIsLoading(true);
    setUserProfile(MUSA_JALLOW_PROFILE);
    setCareerMatches(MUSA_JALLOW_CAREER_MATCHES);
    setTargetCareer('Software Developer (Frontend / Full-Stack)');
    setSkillGap(MUSA_JALLOW_SKILL_GAP);
    setRoadmap(MUSA_JALLOW_ROADMAP);
    setCvData(MUSA_JALLOW_CV);
    setIsDemoUser(true);
    setCompletedTaskIds(['w1-t1', 'w1-t2', 'w1-t3', 'w2-t1']);
    setIsLoading(false);
    setActiveTab('dashboard');
  };

  // Process Onboarding Submission
  const handleOnboardingComplete = async (
    profile: UserProfile,
    generatedCV?: CVData | null,
    targetTab?: string
  ) => {
    setUserProfile(profile);
    setIsLoading(true);
    setIsDemoUser(false);
    if (generatedCV) {
      setCvData(generatedCV);
    }
    setActiveTab(targetTab === 'cv-builder' ? 'cv-builder' : 'dashboard');

    try {
      // 1. Persist user profile
      if (authUser) {
        saveUserProfile(profile);
      }

      // 2. Fetch AI career matches
      const matches = await fetchCareerMatches(profile);
      setCareerMatches(matches);
      if (authUser) {
        saveCareerMatches(matches);
      }

      const topCareerTitle = matches[0]?.title || profile.careerGoal || 'Software Developer';
      setTargetCareer(topCareerTitle);

      // 3. Fetch skill gap & roadmap in parallel
      const [gapData, roadmapData] = await Promise.all([
        fetchSkillGap(profile, topCareerTitle),
        fetchRoadmap(profile, topCareerTitle),
      ]);

      setSkillGap(gapData);
      setRoadmap(roadmapData);

      // 4. Persist gap, roadmap, and CV
      if (authUser) {
        saveSkillGapAnalysis(topCareerTitle, gapData);
        saveRoadmapData(topCareerTitle, roadmapData, []);
        if (generatedCV) {
          saveCVData(generatedCV);
        }
      }
    } catch (err) {
      console.error('Error generating AI analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch active target career
  const handleSelectTargetCareer = async (newTarget: string) => {
    setTargetCareer(newTarget);
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const [gapData, roadmapData] = await Promise.all([
        fetchSkillGap(userProfile, newTarget),
        fetchRoadmap(userProfile, newTarget),
      ]);
      setSkillGap(gapData);
      setRoadmap(roadmapData);

      if (authUser) {
        saveSkillGapAnalysis(newTarget, gapData);
        saveRoadmapData(newTarget, roadmapData, completedTaskIds);
      }
    } catch (err) {
      console.error('Error updating target career:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle roadmap task completion
  const handleToggleTask = (taskId: string) => {
    const updatedIds = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];

    setCompletedTaskIds(updatedIds);

    if (authUser && roadmap) {
      updateRoadmapTaskProgress(updatedIds);
    }
  };

  // Handle CV Edits & auto-save
  const handleSaveCV = (newCV: CVData) => {
    setCvData(newCV);
    if (authUser) {
      saveCVData(newCV);
    }
  };

  // Profile Update from Settings
  const handleProfileUpdated = (updated: UserProfile) => {
    setUserProfile(updated);
    if (authUser && updated.name && updated.name.trim()) {
      setAuthUser({
        ...authUser,
        fullName: updated.name.trim(),
      });
    }
  };

  // User-Controlled Reset Action Completed
  const handleResetComplete = () => {
    setUserProfile(null);
    setCareerMatches([]);
    setSkillGap(null);
    setRoadmap(null);
    setCvData(null);
    setCompletedTaskIds([]);
    setIsDemoUser(false);

    setActiveTab('assessment');

    setSystemBanner({
      type: 'success',
      message: "Your career profile has been successfully reset. Let's create your new career journey.",
    });

    setTimeout(() => {
      setSystemBanner(null);
    }, 8000);
  };

  // Open Auth Modal helper
  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Open Settings Modal helper
  const handleOpenSettings = (tab: SettingsTab = 'profile') => {
    setSettingsModalTab(tab);
    setSettingsModalOpen(true);
  };

  // Open Mentor with Query helper
  const handleOpenMentorWithQuery = (query: string) => {
    setMentorInitialQuery(query);
    setActiveTab('mentor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Network Connectivity Status Badge & Reconnected Toast */}
      <ConnectionStatusBadge />

      {/* Top Notification Banner */}
      {systemBanner && (
        <div
          className={`px-4 py-3 text-xs font-semibold flex items-center justify-between transition-all ${
            systemBanner.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-slate-200 border-b border-slate-700'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center gap-2 flex-1 justify-center text-center">
            {systemBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{systemBanner.message}</span>
          </div>
          <button
            onClick={() => setSystemBanner(null)}
            className="p-1 hover:opacity-80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onOpenSettings={handleOpenSettings}
        onLogout={handleLogout}
        onLoadDemoUser={handleLoadDemoUser}
        isDemoUser={isDemoUser}
        onOpenTranslationAdmin={() => setIsTranslationAdminOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-24 lg:pb-0">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAssessment={() => {
              if (authUser) {
                setActiveTab(userProfile ? 'dashboard' : 'assessment');
              } else {
                handleOpenAuth('signup');
              }
            }}
            onLoadDemoUser={handleLoadDemoUser}
            onExploreJobs={() => setActiveTab('opportunities')}
            onOpenAuth={handleOpenAuth}
            onOpenMentorWithQuery={handleOpenMentorWithQuery}
          />
        )}

        {activeTab === 'assessment' && (
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onLoadDemo={handleLoadDemoUser}
            authUser={authUser}
          />
        )}

        {activeTab === 'dashboard' && userProfile && (
          <Dashboard
            userProfile={userProfile}
            authUser={authUser}
            careerMatches={careerMatches}
            skillGap={skillGap}
            roadmap={roadmap}
            cvData={cvData}
            targetCareer={targetCareer}
            onSelectTargetCareer={handleSelectTargetCareer}
            onNavigate={(tab) => setActiveTab(tab)}
            completedTaskIds={completedTaskIds}
            onOpenSettings={handleOpenSettings}
            onOpenCVBuilder={() => setActiveTab('cv-builder')}
          />
        )}

        {activeTab === 'my-path' && userProfile && (
          <MyPathView
            userProfile={userProfile}
            careerMatches={careerMatches}
            skillGap={skillGap}
            roadmap={roadmap}
            targetCareer={targetCareer}
            onSelectTargetCareer={handleSelectTargetCareer}
            onNavigate={(tab) => setActiveTab(tab)}
            completedTaskIds={completedTaskIds}
          />
        )}

        {activeTab === 'careers' && (
          <CareersExplorer
            userProfile={userProfile}
            onSelectCareerForPath={(career) => {
              setTargetCareer(career);
              if (userProfile) {
                setActiveTab('my-path');
              } else {
                setActiveTab('assessment');
              }
            }}
            onStartAssessment={() => setActiveTab('assessment')}
            onOpenCVBuilderForCareer={(career) => {
              setTargetCareer(career);
              setActiveTab('cv-builder');
            }}
            onOpenAdvisorWithPrompt={handleOpenMentorWithQuery}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsExplorer
            userProfile={userProfile}
            onNavigateToRoadmap={() => setActiveTab(userProfile ? 'roadmap' : 'assessment')}
            onOpenAdvisorWithSkill={(skill) =>
              handleOpenMentorWithQuery(`How can I master ${skill} and use it to get hired in Africa?`)
            }
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesExplorer
            userProfile={userProfile}
            onGenerateCVForJob={(jobTitle) => {
              setTargetCareer(jobTitle);
              setActiveTab('cv-builder');
            }}
            onOpenAdvisorForOpp={(title) =>
              handleOpenMentorWithQuery(`What are the interview expectations for ${title}?`)
            }
          />
        )}

        {activeTab === 'countries' && (
          <CountriesExplorer
            onSelectCountryForJobs={(code) => {
              setActiveTab('opportunities');
            }}
            onOpenAdvisorForCountry={(country) =>
              handleOpenMentorWithQuery(`What are the highest demand tech and vocational careers in ${country}?`)
            }
          />
        )}

        {activeTab === 'matches' && userProfile && (
          <CareerReport
            userProfile={userProfile}
            careerMatches={careerMatches}
            targetCareer={targetCareer}
            onSelectTargetCareer={handleSelectTargetCareer}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateToGap={() => setActiveTab('skill-gap')}
            onNavigateToCV={(role) => {
              setTargetCareer(role);
              setActiveTab('cv-builder');
            }}
          />
        )}

        {activeTab === 'skill-gap' && userProfile && (
          <SkillGapView
            userProfile={userProfile}
            skillGap={skillGap}
            careerMatches={careerMatches}
            targetCareer={targetCareer}
            onSelectTargetCareer={handleSelectTargetCareer}
            onNavigateToRoadmap={() => setActiveTab('roadmap')}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'roadmap' && userProfile && (
          <RoadmapView
            userProfile={userProfile}
            roadmap={roadmap}
            targetCareer={targetCareer}
            completedTaskIds={completedTaskIds}
            onToggleTask={handleToggleTask}
            isLoading={isLoading}
            onNavigateToCV={() => setActiveTab('cv-builder')}
            onRoadmapUpdated={(newRoadmap) => {
              setRoadmap(newRoadmap);
              if (authUser) {
                saveRoadmapData(targetCareer, newRoadmap, completedTaskIds);
              }
            }}
          />
        )}

        {activeTab === 'cv-builder' && (
          <AICVBuilder
            userProfile={userProfile || MUSA_JALLOW_PROFILE}
            careerMatches={careerMatches.length > 0 ? careerMatches : MUSA_JALLOW_CAREER_MATCHES}
            targetCareer={targetCareer}
            onSelectTargetCareer={handleSelectTargetCareer}
            onNavigateToJobs={() => setActiveTab('opportunities')}
            initialCV={cvData}
            onSaveCV={handleSaveCV}
          />
        )}

        {activeTab === 'gambia-map' && (
          <RegionalCareerMap
            userProfile={userProfile}
            countryCode={userProfile?.countryCode || 'GM'}
            onGenerateCVForJob={(jobTitle) => {
              setTargetCareer(jobTitle);
              setActiveTab('cv-builder');
            }}
          />
        )}

        {activeTab === 'mentor' && (
          <MentorChat
            userProfile={userProfile}
            targetCareer={targetCareer}
            initialQuery={mentorInitialQuery}
          />
        )}

        {activeTab === 'admin' && (
          <AdminHub
            onOpenTranslationModal={() => setIsTranslationAdminOpen(true)}
          />
        )}

        {activeTab === 'offline' && (
          <OfflineView
            onNavigate={(tab) => setActiveTab(tab)}
            hasSavedProfile={Boolean(userProfile)}
          />
        )}
      </main>

      {/* Progressive Web App (PWA) Install Prompt Banner */}
      <PWAInstallBanner />

      {/* Service Worker App Update Notification */}
      <AppUpdateToast />

      {/* Mobile Bottom Navigation Bar with large touch targets & distinct emerald-600 active state */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onOpenSettings={handleOpenSettings}
        onLogout={handleLogout}
        onLoadDemoUser={handleLoadDemoUser}
        isDemoUser={isDemoUser}
        onOpenTranslationAdmin={() => setIsTranslationAdminOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
      />

      {/* Printable Report Modal */}
      {userProfile && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          userProfile={userProfile}
          careerMatches={careerMatches}
          skillGap={skillGap}
          roadmap={roadmap}
          targetCareer={targetCareer}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Account Settings & Danger Zone Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        initialTab={settingsModalTab}
        onClose={() => setSettingsModalOpen(false)}
        user={authUser}
        profile={userProfile}
        onProfileUpdated={handleProfileUpdated}
        onResetComplete={handleResetComplete}
      />

      {/* Translation Admin Studio Modal */}
      <TranslationAdminModal
        isOpen={isTranslationAdminOpen}
        onClose={() => setIsTranslationAdminOpen(false)}
      />

      {/* About & Contact Modal */}
      <AboutContactModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
}
