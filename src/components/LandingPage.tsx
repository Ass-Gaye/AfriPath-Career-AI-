import React from 'react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target,
  MapPin,
  Building2,
  ChevronRight,
  UserPlus,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { REAL_GAMBIA_JOB_LISTINGS } from '../data/gambiaData';
import { AuthMode } from './AuthModal';

interface LandingPageProps {
  onStartAssessment: () => void;
  onLoadDemoUser: () => void;
  onExploreJobs: () => void;
  onOpenAuth?: (mode: AuthMode) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onLoadDemoUser,
  onExploreJobs,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Hero Section */}
      <section className="pt-14 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title & Tagline */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>National Career Intelligence for The Gambia 🇬🇲</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Discover the skills and careers that match your future.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Turn uncertainty into opportunity with persistent personal career accounts, AI career matches, actionable 90-day learning roadmaps, and local Gambian job connections.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onOpenAuth ? onOpenAuth('signup') : onStartAssessment()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account & Start Free</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => onOpenAuth ? onOpenAuth('login') : onStartAssessment()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onLoadDemoUser}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/20 font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Target className="w-4 h-4 text-amber-400" />
                <span>Try Demo (Musa Jallow)</span>
              </button>

              <button
                onClick={onExploreJobs}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Gambia Map & Jobs</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="p-3 text-center border-r border-slate-800 last:border-none">
              <div className="text-2xl font-bold text-emerald-400">92%</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Match Precision</div>
            </div>
            <div className="p-3 text-center md:border-r border-slate-800 last:border-none">
              <div className="text-2xl font-bold text-white">90 Days</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Execution Roadmap</div>
            </div>
            <div className="p-3 text-center border-r border-slate-800 last:border-none">
              <div className="text-2xl font-bold text-amber-400">GMD 35k+</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Avg Tech Salary</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-slate-200">20+</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Gambian Employers</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Comparison */}
      <section className="py-14 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bridge the Gap Between University & Employment
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Transforming academic qualifications into in-demand capabilities for Banjul, KMC, and remote international markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Challenge */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                The Challenge for Graduates
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Unclear which career pathways match current skills and market demand.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Absence of guided, weekly learning milestones post-graduation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>Lack of clarity on realistic local salaries and required portfolio standards.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                The Gambia Career AI Solution
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI Career Matches:</strong> Evaluates your skillset against live tech roles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Skill Gap & 90-Day Plan:</strong> Structured roadmap with free learning links.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI CV Builder:</strong> Don't have a CV? Create an ATS-ready CV with AI with 100% verified factual data.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Persistent Accounts & Reset:</strong> Secure data storage that saves your progress until you choose to reset.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Simple 4-Step Process */}
      <section className="py-14 bg-slate-950 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">How It Works</h2>
            <p className="mt-1 text-xs text-slate-400">Simple, streamlined career acceleration in four steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center mb-3 text-xs">
                01
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Set Profile & CV</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload your existing CV if you have one, or let the AI CV Builder generate an authentic Gambian CV for you.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center mb-3 text-xs">
                02
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Career Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get top 5 viable career pathways with Gambian Dalasi salary benchmarks and demand ratings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center mb-3 text-xs">
                03
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Skill Gap & Roadmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                See exact missing skills and follow an interactive 12-week roadmap to build portfolio deliverables.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center mb-3 text-xs">
                04
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Apply & Get Mentored</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse verified openings in Banjul & KMC, and get continuous coaching from Kemo AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Employers Banner */}
      <section className="py-10 bg-slate-900/30 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connecting Graduates with Top Gambian Tech Employers
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-300">
            {['QCell Ltd', 'Africell Gambia', 'Gamswitch', 'Insist Global', 'Trust Bank Gambia', 'PointClick Tech', 'YEP Tech'].map((emp) => (
              <span key={emp} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{emp}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live Opportunities Preview */}
      <section className="py-14 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Featured Tech Opportunities in The Gambia
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Live verified positions across Banjul and KMC.</p>
            </div>
            <button
              onClick={onExploreJobs}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
            >
              <span>View All on Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REAL_GAMBIA_JOB_LISTINGS.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {job.type}
                    </span>
                    <span className="text-xs text-slate-400">{job.location.split(',')[0]}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{job.title}</h3>
                  <p className="text-xs font-medium text-emerald-400 mt-0.5">{job.company}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{job.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{job.salaryOrStipend}</span>
                  <button
                    onClick={onExploreJobs}
                    className="font-semibold text-emerald-400 hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <span>© 2026 Gambia Career AI • Built for Gambian Youth & Graduates</span>
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <span>UTG</span>
            <span>•</span>
            <span>GTTI</span>
            <span>•</span>
            <span>MDI</span>
            <span>•</span>
            <span>YEP Gambia</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
