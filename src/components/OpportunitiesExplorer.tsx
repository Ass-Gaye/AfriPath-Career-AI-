import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Briefcase,
  Search,
  Filter,
  ExternalLink,
  MapPin,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  Sparkles,
  FileCheck,
  ShieldCheck,
  Globe,
  Tag,
  DollarSign,
  GraduationCap,
  Award,
} from 'lucide-react';
import { JobOpportunity, OpportunityType, UserProfile } from '../types/career';
import { AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';
import { AFRICAN_COUNTRIES } from '../data/countriesData';

interface OpportunitiesExplorerProps {
  userProfile?: UserProfile | null;
  onGenerateCVForJob?: (jobTitle: string) => void;
  onOpenAdvisorForOpp?: (oppTitle: string) => void;
}

export const OpportunitiesExplorer: React.FC<OpportunitiesExplorerProps> = ({
  userProfile,
  onGenerateCVForJob,
  onOpenAdvisorForOpp,
}) => {
  const { t } = useTranslation(['opportunities', 'common']);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('all');

  // Active Opportunity Modal
  const [activeOpportunity, setActiveOpportunity] = useState<JobOpportunity | null>(null);

  // Filtered list
  const filteredOpportunities = useMemo(() => {
    return AFRICAN_OPPORTUNITIES.filter((opp) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchCompany = opp.company.toLowerCase().includes(q);
        const matchDesc = opp.description.toLowerCase().includes(q);
        const matchSkills = opp.requiredSkills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchDesc && !matchSkills) return false;
      }

      // Country
      if (selectedCountry !== 'all') {
        if (selectedCountry === 'remote') {
          if (opp.workplaceType !== 'Remote' && !opp.country.toLowerCase().includes('remote')) {
            return false;
          }
        } else if (opp.countryCode !== selectedCountry && !opp.country.includes(selectedCountry)) {
          return false;
        }
      }

      // Type
      if (selectedType !== 'all' && opp.type !== selectedType) {
        return false;
      }

      // Workplace type
      if (selectedWorkplace !== 'all' && opp.workplaceType !== selectedWorkplace) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCountry, selectedType, selectedWorkplace]);

  const opportunityTypes: OpportunityType[] = [
    'Job',
    'Internship',
    'Apprenticeship',
    'Scholarship',
    'Fellowship',
    'Training Program',
    'Startup Grant / Incubation',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Opportunities Across Africa</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Jobs, Internships & Fellowships
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore verified roles, TVET apprenticeships, graduate fellowships, and tech scholarships from leading employers and development partners across 54 African countries.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunity title, company, skill (e.g. Flutter, React, Solar, Finance)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Country filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Country / Location
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All African Countries & Remote</option>
                <option value="remote">Pan-African Remote Only</option>
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Opportunity Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Opportunity Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Types (Jobs, Internships, Scholarships)</option>
                {opportunityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Workplace mode */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Workplace Mode
              </label>
              <select
                value={selectedWorkplace}
                onChange={(e) => setSelectedWorkplace(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Workplace Modes</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Count & Reset */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredOpportunities.length}</strong> active opportunities
          </div>
          {(selectedCountry !== 'all' || selectedType !== 'all' || selectedWorkplace !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCountry('all');
                setSelectedType('all');
                setSelectedWorkplace('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Opportunities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition shadow-lg group"
            >
              <div className="space-y-3.5">
                {/* Header badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {opp.type}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {opp.workplaceType}
                  </span>
                </div>

                {/* Title & Company */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {opp.title}
                  </h3>
                  <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span>{opp.company}</span>
                  </div>
                </div>

                {/* Location & Compensation */}
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{opp.location} ({opp.country})</span>
                  </div>
                  {opp.salaryOrStipend && (
                    <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{opp.salaryOrStipend}</span>
                    </div>
                  )}
                  {opp.deadline && (
                    <div className="flex items-center gap-1.5 text-amber-400/90 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Deadline: {opp.deadline}</span>
                    </div>
                  )}
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {opp.requiredSkills.slice(0, 4).map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {onGenerateCVForJob && (
                  <button
                    type="button"
                    onClick={() => onGenerateCVForJob(opp.title)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1"
                    title="Build tailored CV for this opportunity"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CV</span>
                  </button>
                )}

                <a
                  href={opp.applicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
