import React from 'react';
import {
  Printer,
  X,
  Sparkles,
  Award,
  Calendar,
} from 'lucide-react';
import { UserProfile, CareerMatch, SkillGapAnalysis, CareerRoadmap } from '../types/career';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  careerMatches: CareerMatch[];
  skillGap: SkillGapAnalysis | null;
  roadmap: CareerRoadmap | null;
  targetCareer: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  careerMatches,
  skillGap,
  roadmap,
  targetCareer,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const reportDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto">
        {/* Top Actions Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Career Assessment Report
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div className="space-y-6 print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h1 className="text-xl font-bold text-white">Gambia Career AI Report</h1>
              <p className="text-xs text-slate-400">Personalized Career Intelligence & Skills Audit</p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-400">
              <div>Date: <strong className="text-slate-200">{reportDate}</strong></div>
              <div>Target: <strong className="text-emerald-400">{targetCareer}</strong></div>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <div className="text-slate-400">Candidate</div>
              <div className="font-bold text-white mt-0.5">{userProfile.name}</div>
              <div className="text-[11px] text-slate-400">{userProfile.age} yrs • {userProfile.location}</div>
            </div>

            <div>
              <div className="text-slate-400">Institution</div>
              <div className="font-bold text-white mt-0.5">{userProfile.institution}</div>
              <div className="text-[11px] text-slate-400">{userProfile.educationLevel}</div>
            </div>

            <div>
              <div className="text-slate-400">Major / Field</div>
              <div className="font-bold text-white mt-0.5">{userProfile.fieldOfStudy}</div>
              <div className="text-[11px] text-slate-400">Class of {userProfile.graduationYear}</div>
            </div>

            <div>
              <div className="text-slate-400">Readiness Score</div>
              <div className="font-bold text-emerald-400 text-sm mt-0.5">
                {skillGap?.overallReadinessScore || 68}%
              </div>
            </div>
          </div>

          {/* Ranked Pathways */}
          <div className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ranked Career Matches</span>
            </h2>

            <div className="space-y-2">
              {careerMatches.map((c, i) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">#{i + 1}</span>
                      <strong className="text-white">{c.title}</strong>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold">
                        {c.matchScore}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-0.5">{c.reason}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-semibold text-slate-200">{c.salaryRangeGMD}</div>
                    <div className="text-[10px] text-slate-400">{c.marketDemandGambia} Demand</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap Analysis */}
          {skillGap && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Identified Priority Skill Gaps ({targetCareer})</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {skillGap.skillGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white">{gap.skill}</strong>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300">
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{gap.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 90-Day Roadmap Summary */}
          {roadmap && (
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>90-Day Action Roadmap (12 Weeks)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {roadmap.months.map((m) => (
                  <div
                    key={m.month}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <strong className="text-white block">
                      Month {m.month}: {m.phaseName}
                    </strong>
                    <p className="text-slate-400 text-[11px]">{m.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Gambia Career AI • Powered by Google Gemini AI Intelligence
          </div>
        </div>
      </div>
    </div>
  );
};
