import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from 'lucide-react';
import { UserProfile, CareerMatch } from '../types/career';

interface CareerReportProps {
  userProfile: UserProfile;
  careerMatches: CareerMatch[];
  targetCareer: string;
  onSelectTargetCareer: (careerTitle: string) => void;
  onOpenReportModal: () => void;
  onNavigateToGap: () => void;
  onNavigateToCV?: (careerTitle: string) => void;
}

export const CareerReport: React.FC<CareerReportProps> = ({
  userProfile,
  careerMatches,
  targetCareer,
  onSelectTargetCareer,
  onOpenReportModal,
  onNavigateToGap,
  onNavigateToCV,
}) => {
  const [expandedId, setExpandedId] = useState<string>(careerMatches[0]?.id || '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Personalized Career Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Matched for {userProfile.name} • {userProfile.fieldOfStudy} ({userProfile.institution})
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Report (PDF)</span>
        </button>
      </div>

      {/* Target Career Active Pathway Strip */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Active Target Pathway
            </div>
            <div className="text-sm font-bold text-white">{targetCareer}</div>
          </div>
        </div>

        <button
          onClick={onNavigateToGap}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition self-start sm:self-auto shadow-sm"
        >
          <span>View Skill Gap & Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Ranked Career Cards List */}
      <div className="space-y-4">
        {careerMatches.map((career, index) => {
          const isExpanded = expandedId === career.id;
          const isTarget =
            targetCareer.toLowerCase().includes(career.title.toLowerCase()) ||
            career.title.toLowerCase().includes(targetCareer.toLowerCase());

          return (
            <div
              key={career.id}
              className={`rounded-2xl transition border ${
                isTarget
                  ? 'bg-slate-900 border-emerald-500/50 ring-1 ring-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? '' : career.id)}
                className="p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      index === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">{career.title}</h3>
                      {isTarget && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          Target
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{career.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Match</div>
                    <div className="text-base font-bold text-emerald-400">{career.matchScore}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Demand</div>
                    <div className="text-xs font-bold text-slate-200">{career.marketDemandGambia}</div>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 ml-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details Body */}
              {isExpanded && (
                <div className="px-5 pb-5 space-y-4 pt-3 border-t border-slate-800">
                  {/* Rationale */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong className="text-white block mb-1">Why this pathway fits you:</strong>
                    {career.reason}
                  </div>

                  {/* Skills Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Matching Skills ({career.matchingSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {career.matchingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        <span>Missing Skills ({career.missingSkills.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {career.missingSkills.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-xs bg-amber-950 text-amber-300 border border-amber-800/40"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Compensation & Employers */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 mb-0.5">Salary Benchmark</div>
                      <div className="font-bold text-white text-sm">{career.salaryRangeGMD}</div>
                      <div className="text-[11px] text-slate-400">{career.salaryRangeUSD}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 mb-0.5">Gambian Employers Hiring</div>
                      <div className="font-medium text-slate-200">{career.gambianEmployers.join(', ')}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 mb-0.5">Transition Difficulty</div>
                      <div className="font-medium text-emerald-400">{career.difficultyToTransition}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                    {onNavigateToCV && (
                      <button
                        onClick={() => onNavigateToCV(career.title)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition flex items-center gap-1.5"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Create Tailored CV</span>
                      </button>
                    )}
                    {!isTarget && (
                      <button
                        onClick={() => onSelectTargetCareer(career.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                      >
                        Set As Target
                      </button>
                    )}
                    <button
                      onClick={onNavigateToGap}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition flex items-center gap-1"
                    >
                      <span>Analyze Skill Gap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
