import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { UserProfile, SkillGapAnalysis, CareerMatch } from '../types/career';

interface SkillGapViewProps {
  userProfile: UserProfile;
  skillGap: SkillGapAnalysis | null;
  careerMatches: CareerMatch[];
  targetCareer: string;
  onSelectTargetCareer: (careerTitle: string) => void;
  onNavigateToRoadmap: () => void;
  isLoading: boolean;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  userProfile,
  skillGap,
  careerMatches,
  targetCareer,
  onSelectTargetCareer,
  onNavigateToRoadmap,
  isLoading,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');

  if (isLoading || !skillGap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white">Analyzing Skill Gaps with Gemini AI...</h2>
        <p className="text-xs text-slate-400">Comparing your profile with Gambian employer expectations.</p>
      </div>
    );
  }

  const filteredGaps = (skillGap?.skillGaps || []).filter(
    (g) => priorityFilter === 'All' || g.priority === priorityFilter
  );

  const totalEstimatedHours = (skillGap?.skillGaps || []).reduce((acc, curr) => acc + (curr.estimatedHours || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Skill Requirements & Gap Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Diagnostic comparison for {userProfile.name} aiming for {targetCareer}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Target Career:</label>
          <select
            value={targetCareer}
            onChange={(e) => onSelectTargetCareer(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {careerMatches.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title} ({c.matchScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-base">
            {skillGap.overallReadinessScore}%
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Initial Profile Readiness</div>
            <div className="text-xs font-bold text-white">
              {skillGap.overallReadinessScore >= 75 ? 'Strong Foundation' : 'Core Fundamentals Ready'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-base">
            {skillGap.skillGaps?.length || 0}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Skills to Acquire</div>
            <div className="text-xs font-bold text-white">
              {(skillGap.skillGaps || []).filter((g) => g.priority === 'Critical').length} Critical Priorities
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300">
            <Clock className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Est. Study Investment</div>
            <div className="text-xs font-bold text-white">~{totalEstimatedHours} Hours (90 Days)</div>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Commentary */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          AI Analysis Summary
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{skillGap.aiSummary}</p>
      </div>

      {/* Side-by-Side: Owned Skills vs Skills to Acquire */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owned Skills */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Skills You Already Have ({skillGap.ownedSkills?.length || 0})</span>
          </h2>
          <p className="text-xs text-slate-400">
            These competencies directly transfer to your target role:
          </p>
          <div className="space-y-1.5 pt-1">
            {(skillGap.ownedSkills || []).map((s, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <span className="text-emerald-400 text-xs">✓</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Skills with Learning Resources */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Skills To Learn & Free Courses</span>
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
              {(['All', 'Critical', 'High', 'Medium'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setPriorityFilter(lvl)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    priorityFilter === lvl
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredGaps.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.priority === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                          : item.priority === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.skill}</h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    {item.estimatedHours} hrs ({item.estimatedWeeks} wks)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Free Learning Resources */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Recommended Learning Pathway:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.recommendedResources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                      >
                        <div className="overflow-hidden">
                          <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 transition truncate">
                            {res.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            <span>{res.provider}</span> • <span className="text-emerald-400">{res.type}</span>
                          </div>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action to Launch Roadmap */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div>
              <h3 className="text-sm font-bold text-white">Ready to close these skill gaps?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Organized into a weekly 90-day learning and portfolio roadmap.
              </p>
            </div>

            <button
              onClick={onNavigateToRoadmap}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm shrink-0"
            >
              <span>Open 90-Day Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
