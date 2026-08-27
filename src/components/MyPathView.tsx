import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Briefcase,
  Target,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Zap,
} from 'lucide-react';
import { UserProfile, CareerMatch, SkillGapAnalysis, CareerRoadmap } from '../types/career';

interface MyPathViewProps {
  userProfile: UserProfile;
  careerMatches: CareerMatch[];
  skillGap: SkillGapAnalysis | null;
  roadmap: CareerRoadmap | null;
  targetCareer: string;
  onSelectTargetCareer: (newTarget: string) => void;
  onNavigate: (tab: string) => void;
  completedTaskIds: string[];
}

export const MyPathView: React.FC<MyPathViewProps> = ({
  userProfile,
  careerMatches,
  skillGap,
  roadmap,
  targetCareer,
  onSelectTargetCareer,
  onNavigate,
  completedTaskIds,
}) => {
  const { t } = useTranslation(['roadmap', 'common', 'dashboard']);
  const [selectedStage, setSelectedStage] = useState<number>(0);

  // Compute stats
  const totalTasks = roadmap
    ? roadmap.phases.reduce((acc, phase) => acc + phase.tasks.length, 0)
    : 0;
  const completedCount = completedTaskIds.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 35;

  const currentRole = userProfile.currentRole || userProfile.currentEducationLevel || 'Exploring Career Pathways';

  // 6 Path Nodes
  const pathStages = [
    {
      id: 0,
      title: 'Current Position',
      subtitle: currentRole,
      status: 'completed',
      tag: 'Starting Point',
      details: {
        summary: `You are currently positioned at ${currentRole} in ${userProfile.country || 'Africa'}.`,
        attributes: [
          `Education: ${userProfile.currentEducationLevel || 'Senior Secondary'}`,
          `Preferred Work: ${userProfile.preferredWorkEnvironment || 'Hybrid / Remote'}`,
          `Time Commitment: ${userProfile.weeklyHoursCommitted || 15} hrs/week`,
        ],
      },
    },
    {
      id: 1,
      title: 'Current Skills',
      subtitle: `${userProfile.currentSkills?.length || 0} Core Skills Identified`,
      status: 'completed',
      tag: 'Verified Assets',
      details: {
        summary: 'Your established technical proficiencies and soft skills recognized by AfriPath AI.',
        attributes: userProfile.currentSkills || ['Communication', 'Computer Literacy', 'Problem Solving'],
      },
    },
    {
      id: 2,
      title: 'Skill Gaps & Analysis',
      subtitle: `${skillGap?.missingCriticalSkills?.length || 3} Priority Skills to Bridge`,
      status: 'active',
      tag: 'Priority Focus',
      details: {
        summary: `Key skills required to qualify for ${targetCareer} across African hiring markets.`,
        attributes: skillGap?.missingCriticalSkills?.map((s) => s.skill) || [
          'Advanced Frameworks',
          'Production Portfolio',
          'System Architecture',
        ],
      },
    },
    {
      id: 3,
      title: 'Learning & Credentials',
      subtitle: '90-Day Curated Execution Plan',
      status: 'in-progress',
      tag: 'Structured Learning',
      details: {
        summary: 'Step-by-step low-bandwidth courses, YouTube tutorials, and TVET micro-credentials.',
        attributes: [
          'Phase 1: Foundation & Tooling',
          'Phase 2: Core Competencies & Real Projects',
          'Phase 3: Portfolio Polish & ATS CV Optimization',
        ],
      },
    },
    {
      id: 4,
      title: 'Practical Experience',
      subtitle: 'Portfolio & Apprenticeship',
      status: 'upcoming',
      tag: 'Applied Proof',
      details: {
        summary: 'Build proof-of-work projects tailored for African and global remote employers.',
        attributes: [
          'GitHub / Project Portfolio Deployment',
          'Freelance / NGO / Community Contribution',
          'Pan-African Internship Applications',
        ],
      },
    },
    {
      id: 5,
      title: 'Target Career Launch',
      subtitle: targetCareer,
      status: 'goal',
      tag: 'Destination',
      details: {
        summary: `Successfully launch your career as a ${targetCareer} with industry-aligned salary benchmarks.`,
        attributes: [
          'Professional Network Outreach',
          'Direct Interview Preparations',
          'Continuous Lifelong Upskilling',
        ],
      },
    },
  ];

  const activeStageData = pathStages[selectedStage];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>AfriPath Interactive Career Pathway</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                My Career Pathway: {targetCareer}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Your visual roadmap from current baseline to high-impact career launch across Africa.
              </p>
            </div>

            {/* Target Career Switcher */}
            {careerMatches.length > 1 && (
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1.5 shrink-0">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Switch Active Target Role
                </label>
                <select
                  value={targetCareer}
                  onChange={(e) => onSelectTargetCareer(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500"
                >
                  {careerMatches.map((m) => (
                    <option key={m.id} value={m.title}>
                      {m.title} ({m.matchScore}% Match)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Visual Pathway Diagram */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Interactive Step-by-Step Pathway</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-400">{progressPercent}% Completed</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            ></div>
          </div>

          {/* Pathway Nodes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pathStages.map((stage) => {
              const isSelected = selectedStage === stage.id;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStage(stage.id)}
                  className={`p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between h-36 relative ${
                    isSelected
                      ? 'bg-emerald-950/40 border-2 border-emerald-500 shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-500/20'
                      : 'bg-slate-950/80 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        0{stage.id + 1}
                      </span>
                      {stage.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : stage.status === 'goal' ? (
                        <Target className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{stage.title}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-400 truncate">{stage.subtitle}</div>
                    <div
                      className={`text-[9px] font-bold mt-1.5 inline-block px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {stage.tag}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detailed Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Stage 0{activeStageData.id + 1} Inspection
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{activeStageData.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{activeStageData.details.summary}</p>
            </div>

            <div className="flex items-center gap-2">
              {activeStageData.id === 2 && (
                <button
                  type="button"
                  onClick={() => onNavigate('skill-gap')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <span>Detailed Skill Gap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              {activeStageData.id === 3 && (
                <button
                  type="button"
                  onClick={() => onNavigate('roadmap')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Open 90-Day Execution Plan</span>
                </button>
              )}
              {activeStageData.id === 5 && (
                <button
                  type="button"
                  onClick={() => onNavigate('cv-builder')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Build ATS-Optimized CV</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Attributes of Active Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeStageData.details.attributes.map((attr, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
                <span className="text-xs font-medium text-slate-200">{attr}</span>
              </div>
            ))}
          </div>

          {/* Next Stage Teaser */}
          {selectedStage < pathStages.length - 1 && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Next in Pathway: <strong className="text-slate-200">{pathStages[selectedStage + 1].title}</strong></span>
              <button
                type="button"
                onClick={() => setSelectedStage(selectedStage + 1)}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Advance to Step 0{selectedStage + 2}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
