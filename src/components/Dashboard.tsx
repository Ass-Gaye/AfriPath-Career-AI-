import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Download,
  Edit3,
  User,
  TrendingUp,
  MapPin,
  MessageSquare,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Settings,
  Globe2,
} from 'lucide-react';
import {
  UserProfile,
  CareerMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  CVData,
} from '../types/career';
import { AuthUser } from '../services/api';
import { getCountryByCode } from '../data/countriesData';
import { useLanguage } from '../context/LanguageContext';

interface DashboardProps {
  userProfile: UserProfile;
  careerMatches: CareerMatch[];
  skillGap: SkillGapAnalysis | null;
  roadmap: CareerRoadmap | null;
  cvData: CVData | null;
  targetCareer: string;
  onSelectTargetCareer: (careerTitle: string) => void;
  onNavigate: (tab: string) => void;
  completedTaskIds: string[];
  onOpenSettings?: (tab?: 'profile' | 'security' | 'danger-zone') => void;
  onOpenCVBuilder?: () => void;
  authUser?: AuthUser | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  careerMatches,
  skillGap,
  roadmap,
  cvData,
  targetCareer,
  onSelectTargetCareer,
  onNavigate,
  completedTaskIds,
  onOpenSettings,
  onOpenCVBuilder,
  authUser,
}) => {
  const { t } = useTranslation(['dashboard', 'common', 'navigation']);
  const { isRTL, formatNumber } = useLanguage();
  const countryConfig = getCountryByCode(userProfile.countryCode || 'GM');
  const userCountryName = userProfile.country || countryConfig.name;

  // Calculate Roadmap progress
  const totalTasks = roadmap?.months
    ? roadmap.months.flatMap((m) => (m.weeks || []).flatMap((w) => w.tasks || [])).length
    : 12;
  const completedCount = completedTaskIds.length;
  const roadmapProgressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Calculate dynamic overall readiness score
  const roadmapBonus = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 30) : 0;
  const baseScore = skillGap?.overallReadinessScore || 65;
  const readinessScore = Math.min(100, baseScore + roadmapBonus);

  const topMatch = careerMatches[0] || {
    title: targetCareer || 'Software Developer',
    matchScore: 92,
  };
  const topMatches = careerMatches.slice(0, 3);
  const criticalGaps = (skillGap?.skillGaps || []).filter((g) => g.priority === 'Critical');

  // Determine accurate user full & first name
  const candidateName = userProfile.name?.trim() || authUser?.fullName?.trim();
  const displayName = candidateName && candidateName !== 'Applicant' && candidateName !== 'Professional'
    ? candidateName
    : authUser?.fullName || userProfile.name || 'Assan Gaye';
  const firstName = displayName.split(' ')[0] || displayName;

  // CV Status
  const isCVReady = !!cvData;

  const handleDownloadCV = () => {
    if (onOpenCVBuilder) {
      onOpenCVBuilder();
    } else {
      onNavigate('cv-builder');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Personalized Welcome Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{countryConfig.flag} {userCountryName} & Pan-African Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t('dashboard:welcome', `Welcome back, {{name}}`, { name: firstName })} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {userProfile.fieldOfStudy || 'Technology & Science'} • {userProfile.institution || 'Higher Education Institution'} ({userProfile.location || userCountryName})
            </p>
          </div>

          {/* Quick Action Buttons Group */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenSettings?.('profile')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('navigation:viewProfile', 'View Profile')}</span>
            </button>

            <button
              onClick={() => onOpenSettings?.('profile')}
              className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('common:edit', 'Update Profile')}</span>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('dashboard:actions.viewRoadmap', 'Continue Roadmap')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Career Profile */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('navigation:viewProfile', 'Career Profile')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('common:complete', 'Complete')} ✓</span>
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-white truncate">{displayName}</div>
            <div className="text-xs text-slate-300 font-medium truncate">{userProfile.institution || `${userCountryName} Institution`}</div>
            <div className="text-xs text-slate-400 truncate">
              {userProfile.fieldOfStudy ? `${userProfile.fieldOfStudy} • ` : ''}{userProfile.currentSkills?.length || 0} skills added
            </div>
          </div>
          <button
            onClick={() => onOpenSettings?.('profile')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
          >
            <span>{t('common:edit', 'Update Details')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: AI Career Analysis */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('navigation:careers', 'AI Career Analysis')}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              {topMatch.matchScore}% Match
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-white truncate">{topMatch.title}</div>
            <div className="text-xs text-slate-400">Top pathway for {userCountryName} & Africa</div>
          </div>
          <button
            onClick={() => onNavigate('matches')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
          >
            <span>{t('common:viewDetails', 'View All Matches')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Skill Roadmap */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('navigation:roadmap', 'Skill Roadmap')}
            </span>
            <span className="text-xs font-bold text-emerald-400">
              {roadmapProgressPct}% Complete
            </span>
          </div>
          <div>
            <div className="w-full bg-slate-950 rounded-full h-2 mb-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, roadmapProgressPct)}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-400">
              {completedCount} of {totalTasks} milestones completed
            </div>
          </div>
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1"
          >
            <span>{t('dashboard:actions.viewRoadmap', 'Continue Roadmap')}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 4: My CV */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('navigation:cvBuilder', 'My CV')}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                isCVReady
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800/40'
                  : 'text-amber-300 bg-amber-950/80 border border-amber-800/40'
              }`}
            >
              {isCVReady ? `${t('common:ready', 'Ready')} ✓` : t('common:pending', 'Needs Generation')}
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-white truncate">
              {cvData ? cvData.targetCareer : 'AI Verified CV'}
            </div>
            <div className="text-xs text-slate-400">
              {isCVReady ? 'ATS Optimized & Verified' : 'Generate with 1-click'}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('cv-builder')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{t('common:edit', 'Edit CV')}</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={handleDownloadCV}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>{t('common:download', 'Download')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Careers + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Careers (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>{t('dashboard:savedMatches', 'AI Career Recommendations')}</span>
              </h2>
              <p className="text-xs text-slate-400">
                Ranked by alignment with your skills and market demand in {userCountryName}.
              </p>
            </div>
            <button
              onClick={() => onNavigate('matches')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              <span>{t('common:viewDetails', 'View All')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topMatches.map((career, idx) => {
              const isSelected =
                targetCareer.toLowerCase().includes(career.title.toLowerCase()) ||
                career.title.toLowerCase().includes(targetCareer.toLowerCase());

              return (
                <div
                  key={career.id}
                  className={`p-5 rounded-2xl transition border ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">{career.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                        {career.matchScore}% Match
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                        {career.marketDemandGambia} Demand
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{career.reason}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="text-slate-400">
                      Salary: <strong className="text-slate-200">{career.salaryRangeGMD}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t('dashboard:activeTarget', 'Active Focus')}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onSelectTargetCareer(career.title)}
                          className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        >
                          {t('dashboard:actions.switchTarget', 'Select Pathway')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Skill Gaps & Action shortcuts */}
        <div className="space-y-4">
          {/* Skill Gap Alert Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Critical Skill Gaps</span>
              </h3>
              <button
                onClick={() => onNavigate('skill-gap')}
                className="text-xs font-medium text-emerald-400 hover:underline"
              >
                {t('common:viewDetails', 'Details')}
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Focus skills for <strong>{targetCareer || 'Target Career'}</strong>:
            </p>

            <div className="space-y-2">
              {criticalGaps.length > 0 ? (
                criticalGaps.map((gap, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-slate-200">{gap.skill}</div>
                      <div className="text-[11px] text-slate-400">
                        ~{gap.estimatedHours} hrs ({gap.estimatedWeeks} wks)
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                      {gap.priority}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                  Click 'Skill Gap' tab to run diagnostics on your target pathway.
                </div>
              )}
            </div>
          </div>

          {/* AI CV Builder Spotlight Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                <FileCheck className="w-3 h-3" />
                <span>{t('navigation:cvBuilder', 'AI CV Builder')}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">
                {isCVReady ? 'Ready' : 'ATS Ready'}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                {isCVReady ? 'Your Verified CV is Ready' : 'Don’t have a CV? Create one with AI.'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isCVReady
                  ? `Optimized for ${cvData.targetCareer} with 0 hallucinations and ATS compliance.`
                  : `Generate an authentic CV tailored to ${targetCareer}. 100% verified facts.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('cv-builder')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{isCVReady ? 'Open & Tailor CV' : 'Generate CV with AI'}</span>
              </button>
            </div>
          </div>

          {/* AI Career Advisor Callout Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AfriPath AI Advisor</h3>
                <p className="text-[11px] text-slate-400">Pan-African Career & Interview Coach</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Get grounded guidance on salaries, portfolio preparation, TVET credentials, or remote opportunities.
            </p>
            <button
              onClick={() => onNavigate('mentor')}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('navigation:advisor', 'Chat with Advisor')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
