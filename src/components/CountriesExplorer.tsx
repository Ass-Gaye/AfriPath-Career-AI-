import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Search,
  Building,
  GraduationCap,
  Briefcase,
  ChevronRight,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Landmark,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CountryConfig, AfricanRegion } from '../types/career';
import { AFRICAN_COUNTRIES, AFRICAN_REGIONS } from '../data/countriesData';
import { AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';

interface CountriesExplorerProps {
  onSelectCountryForJobs?: (countryCode: string) => void;
  onOpenAdvisorForCountry?: (countryName: string) => void;
}

export const CountriesExplorer: React.FC<CountriesExplorerProps> = ({
  onSelectCountryForJobs,
  onOpenAdvisorForCountry,
}) => {
  const { t } = useTranslation(['common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeCountry, setActiveCountry] = useState<CountryConfig | null>(null);

  // Filter countries
  const filteredCountries = useMemo(() => {
    return AFRICAN_COUNTRIES.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchLang = c.languages.some((l) => l.toLowerCase().includes(q));
        const matchInd = c.majorIndustries.some((i) => i.toLowerCase().includes(q));
        if (!matchName && !matchLang && !matchInd) return false;
      }

      if (selectedRegion !== 'all' && c.region !== selectedRegion) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Pan-African Country Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Career Ecosystems by Country
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover education frameworks, accredited universities, TVET training academies, top growth sectors, and verified employers across 54 African nations.
            </p>
          </div>
        </div>

        {/* Search & Region Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search African country, language, or key industry..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedRegion === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Africa ({AFRICAN_COUNTRIES.length})
            </button>
            {AFRICAN_REGIONS.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedRegion === reg
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCountries.map((c) => (
            <div
              key={c.code}
              className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition shadow-lg group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                        {c.name}
                      </h3>
                      <div className="text-[11px] text-slate-400">{c.region}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400">
                    {c.currencyCode} ({c.currencySymbol})
                  </span>
                </div>

                {/* Major Industries */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Top Growth Sectors
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {c.majorIndustries.slice(0, 3).map((ind, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800 truncate max-w-[200px]"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Institutions sample */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Key Institutes & TVET
                  </div>
                  <div className="text-xs text-slate-300 truncate">
                    {c.universitiesAndInstitutes.slice(0, 2).join(' • ')}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setActiveCountry(c)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Ecosystem Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Country Detail Modal */}
      {activeCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeCountry.flag}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{activeCountry.name} Career Ecosystem</h2>
                  <p className="text-xs text-slate-400">
                    {activeCountry.region} • Currency: {activeCountry.currencyCode} ({activeCountry.currencySymbol})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCountry(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Major Industries */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>Major Economic & Hiring Sectors</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeCountry.majorIndustries.map((ind, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Universities & TVET */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>Recognized Higher Education & TVET Institutions</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                  {activeCountry.universitiesAndInstitutes.map((inst, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Professional Bodies & Licensing */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  <span>Professional Regulatory & Licensing Bodies</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                  {activeCountry.professionalBodies.map((pb, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>{pb}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verified Job Sources */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>Verified National Career & Job Portals</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeCountry.jobSources.map((js, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 font-medium"
                    >
                      {js}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAdvisorForCountry) {
                    onOpenAdvisorForCountry(activeCountry.name);
                  }
                  setActiveCountry(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask AI Advisor About {activeCountry.name}</span>
              </button>

              {onSelectCountryForJobs && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectCountryForJobs(activeCountry.code);
                    setActiveCountry(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>View Opportunities in {activeCountry.name}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
