import React, { useState } from 'react';
import {
  MapPin,
  Briefcase,
  Search,
  CheckCircle2,
  ExternalLink,
  X,
  Compass,
  FileCheck,
  Globe2,
  Building,
  Layers,
  Filter,
} from 'lucide-react';
import { JobOpportunity, UserProfile } from '../types/career';
import { GAMBIAN_TECH_HUBS } from '../data/gambiaData';
import { PAN_AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';
import { AFRICAN_COUNTRIES, getCountryByCode } from '../data/countriesData';
import { CAREER_SECTORS } from '../data/careerTaxonomy';

interface RegionalCareerMapProps {
  userProfile?: UserProfile | null;
  countryCode?: string;
  onApplyForJob?: (job: JobOpportunity) => void;
  onGenerateCVForJob?: (jobTitle: string, company: string) => void;
}

export const RegionalCareerMap: React.FC<RegionalCareerMapProps> = ({
  userProfile,
  countryCode = userProfile?.countryCode || 'GM',
  onGenerateCVForJob,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    userProfile?.countryCode || countryCode || 'GM'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [hasAppliedMap, setHasAppliedMap] = useState<Record<string, boolean>>({});

  const currentCountryConfig = getCountryByCode(selectedCountryCode);

  const filteredJobs = PAN_AFRICAN_OPPORTUNITIES.filter((job) => {
    // Country filter: Match selected country code or Remote / All
    const matchesCountry =
      selectedCountryCode === 'ALL'
        ? true
        : selectedCountryCode === 'REMOTE'
        ? job.workplaceType === 'Remote' || job.country?.toLowerCase().includes('remote')
        : job.countryCode?.toUpperCase() === selectedCountryCode.toUpperCase() ||
          job.country?.toLowerCase().includes(currentCountryConfig.name.toLowerCase()) ||
          job.workplaceType === 'Remote';

    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSector =
      selectedSector === 'All' ||
      job.sector === selectedSector ||
      job.category.toLowerCase().includes(selectedSector.toLowerCase());

    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesCountry && matchesSearch && matchesSector && matchesType;
  });

  const handleApply = (jobId: string) => {
    setHasAppliedMap((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Country Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1.5">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Pan-African & Regional Verified Intelligence</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {currentCountryConfig.flag} {currentCountryConfig.name} & Regional Career Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Explore verified opportunities across {currentCountryConfig.name}, West Africa, and remote Pan-African employers.
          </p>
        </div>

        {/* Quick Country Switcher Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs text-slate-400 font-medium">Filter by Country:</span>
          <select
            value={selectedCountryCode}
            onChange={(e) => setSelectedCountryCode(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">🌍 All African Countries & Remote</option>
            <option value="REMOTE">🌐 Remote (Pan-African)</option>
            {AFRICAN_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.currencyCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Regional Tech & Economic Clusters in Selected Country / Gambia */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>
            {currentCountryConfig.code === 'GM'
              ? 'Key Tech & Economic Growth Corridors (The Gambia)'
              : `Major Economic & Industry Centers (${currentCountryConfig.name})`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentCountryConfig.code === 'GM' ? (
            GAMBIAN_TECH_HUBS.map((hub, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {hub.region}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">{hub.demandGrowth}</span>
                  </div>
                  <h2 className="text-sm font-bold text-white mb-1">{hub.name}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{hub.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Key Organizations: </span>
                  {hub.keyCompanies.join(', ')}
                </div>
              </div>
            ))
          ) : (
            currentCountryConfig.majorIndustries.slice(0, 4).map((ind, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {currentCountryConfig.region}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400">High Growth</span>
                  </div>
                  <h2 className="text-sm font-bold text-white mb-1">{ind}</h2>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Active industry corridor hiring across {currentCountryConfig.name}.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Hubs: </span>
                  {currentCountryConfig.universitiesAndInstitutes[idx % currentCountryConfig.universitiesAndInstitutes.length]}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Verified Opportunities List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Verified Openings & Apprenticeships</span>
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredJobs.length} verified listings in {currentCountryConfig.name} and across Africa.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search roles, companies, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-56"
              />
            </div>

            {/* Sector Filter */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Sectors</option>
              {CAREER_SECTORS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>

            {/* Employment Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract / Remote</option>
              <option value="Scholarship">Scholarship & Fellowships</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = hasAppliedMap[job.id];

            return (
              <div
                key={job.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {job.type} • {job.workplaceType || 'Hybrid'}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      {job.salaryOrStipend}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1 leading-snug">{job.title}</h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                    <span className="text-slate-600">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{job.location}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 4).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                        +{job.requiredSkills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  {onGenerateCVForJob && (
                    <button
                      type="button"
                      onClick={() => onGenerateCVForJob(job.title, job.company)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1"
                    >
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>Tailor CV</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    {hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(job.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-slate-500 mx-auto" />
            <div className="text-sm font-semibold text-white">No listings found matching your search.</div>
            <p className="text-xs text-slate-400">
              Try choosing "All African Countries & Remote" or adjusting your search query and sector filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
