import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  GraduationCap,
  Wrench,
  ShieldCheck,
  Building,
  Target,
  FileCheck,
} from 'lucide-react';
import { CareerSector, CareerPathwayType, UserProfile } from '../types/career';
import { CAREER_TAXONOMY, CAREER_SECTORS, CareerDefinition } from '../data/careerTaxonomy';
import { AFRICAN_COUNTRIES } from '../data/countriesData';
import { AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';

interface CareersExplorerProps {
  userProfile?: UserProfile | null;
  onSelectCareerForPath?: (careerTitle: string) => void;
  onStartAssessment?: () => void;
  onOpenCVBuilderForCareer?: (careerTitle: string) => void;
  onOpenAdvisorWithPrompt?: (prompt: string) => void;
}

export const CareersExplorer: React.FC<CareersExplorerProps> = ({
  userProfile,
  onSelectCareerForPath,
  onStartAssessment,
  onOpenCVBuilderForCareer,
  onOpenAdvisorWithPrompt,
}) => {
  const { t } = useTranslation(['careers', 'common', 'navigation']);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedPathway, setSelectedPathway] = useState<string>('all');
  const [selectedDegreeReq, setSelectedDegreeReq] = useState<string>('all');
  const [selectedGrowth, setSelectedGrowth] = useState<string>('all');

  // Active modal for deep career inspection
  const [activeCareer, setActiveCareer] = useState<CareerDefinition | null>(null);

  // Filtered Careers
  const filteredCareers = useMemo(() => {
    return CAREER_TAXONOMY.filter((career) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = career.title.toLowerCase().includes(q);
        const matchesDesc = career.description.toLowerCase().includes(q);
        const matchesSkills = career.coreSkills.some((s) => s.toLowerCase().includes(q));
        const matchesFamily = career.family.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSkills && !matchesFamily) {
          return false;
        }
      }

      // Sector filter
      if (selectedSector !== 'all' && career.sector !== selectedSector) {
        return false;
      }

      // Pathway filter
      if (selectedPathway !== 'all') {
        if (!career.typicalEntryPathways.includes(selectedPathway as CareerPathwayType)) {
          return false;
        }
      }

      // Degree requirement filter
      if (selectedDegreeReq === 'degree' && !career.degreeRequired) return false;
      if (selectedDegreeReq === 'no-degree' && career.degreeRequired) return false;

      // Growth trend filter
      if (selectedGrowth !== 'all' && career.growthTrend !== selectedGrowth) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSector, selectedPathway, selectedDegreeReq, selectedGrowth]);

  // Find related opportunities for active career
  const relatedOpportunities = useMemo(() => {
    if (!activeCareer) return [];
    const q = activeCareer.title.toLowerCase();
    return AFRICAN_OPPORTUNITIES.filter((opp) => {
      const matchTitle = opp.title.toLowerCase().includes(q) || q.includes(opp.title.toLowerCase());
      const matchCategory = opp.category.toLowerCase().includes(activeCareer.family.toLowerCase());
      const matchSector = opp.sector === activeCareer.sector;
      return matchTitle || matchCategory || matchSector;
    }).slice(0, 3);
  }, [activeCareer]);

  // Compute approximate match score if user has a profile
  const getCareerMatchEstimate = (career: CareerDefinition) => {
    if (!userProfile || !userProfile.currentSkills || userProfile.currentSkills.length === 0) {
      return null;
    }
    const userSkillsLower = [
      ...userProfile.currentSkills,
      ...(userProfile.softSkills || []),
      ...(userProfile.interests || []),
    ].map((s) => s.toLowerCase());

    const matchingCore = career.coreSkills.filter((s) =>
      userSkillsLower.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );

    const matchingSoft = career.softSkills.filter((s) =>
      userSkillsLower.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
    );

    const totalTracked = career.coreSkills.length + career.softSkills.length;
    const matchedCount = matchingCore.length * 1.5 + matchingSoft.length;
    const baseScore = Math.min(95, Math.round(50 + (matchedCount / Math.max(1, totalTracked)) * 45));

    return {
      score: baseScore,
      matchingCore,
      missingCore: career.coreSkills.filter((s) => !matchingCore.includes(s)),
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
              <span>Pan-African Career Intelligence Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Careers Across Africa
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Discover high-impact professions across tech, healthcare, skilled trades, agribusiness, finance, and engineering. Review entry pathways, required competencies, verified employers, and learning roadmaps.
            </p>

            {!userProfile && onStartAssessment && (
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onStartAssessment}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Take Career Assessment for Personalized Matching</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Comprehensive Filters */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by career title, skill (e.g., Python, Solar PV, Accounting), or industry..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sector Pill Tabs */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter by Economic Sector</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSector('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedSector === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All Sectors ({CAREER_TAXONOMY.length})
              </button>
              {CAREER_SECTORS.map((sec) => {
                const count = CAREER_TAXONOMY.filter((c) => c.sector === sec.name).length;
                const isSelected = selectedSector === sec.name;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSector(sec.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{sec.icon}</span>
                    <span>{sec.name}</span>
                    <span className="text-[10px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            {/* Pathway */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Entry Pathway
              </label>
              <select
                value={selectedPathway}
                onChange={(e) => setSelectedPathway(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Pathways (University, TVET, Self-Taught)</option>
                <option value="University / Degree">University / Degree</option>
                <option value="Vocational & TVET Apprenticeship">Vocational & TVET Apprenticeship</option>
                <option value="Self-Taught & Portfolio">Self-Taught & Portfolio</option>
                <option value="Professional Certification Ladder">Certification Ladder</option>
                <option value="Career Transition & Skill Bridge">Career Transition</option>
                <option value="Entrepreneurship & Agribusiness">Entrepreneurship</option>
              </select>
            </div>

            {/* Degree Requirement */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Education Prerequisite
              </label>
              <select
                value={selectedDegreeReq}
                onChange={(e) => setSelectedDegreeReq(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Education Levels</option>
                <option value="no-degree">Accessible without University Degree</option>
                <option value="degree">Requires University Degree</option>
              </select>
            </div>

            {/* Growth Trend */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Market Growth Demand
              </label>
              <select
                value={selectedGrowth}
                onChange={(e) => setSelectedGrowth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">All Growth Trends</option>
                <option value="Very High">Very High Growth</option>
                <option value="High">High Growth</option>
                <option value="Growing">Growing / Emerging</option>
                <option value="Specialized">Specialized / Niche</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredCareers.length}</strong> careers across Africa
          </div>
          {(selectedSector !== 'all' || selectedPathway !== 'all' || selectedDegreeReq !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedSector('all');
                setSelectedPathway('all');
                setSelectedDegreeReq('all');
                setSelectedGrowth('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Careers Grid */}
        {filteredCareers.length === 0 ? (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-12 text-center space-y-3">
            <Compass className="w-10 h-10 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No careers match your current filter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try loosening your search keywords or switching back to "All Sectors" to explore all available professions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCareers.map((career) => {
              const matchEstimate = getCareerMatchEstimate(career);

              return (
                <div
                  key={career.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-200 shadow-lg hover:shadow-emerald-950/20 group"
                >
                  <div className="space-y-4">
                    {/* Sector & Growth Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {career.sector}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          career.growthTrend === 'Very High'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : career.growthTrend === 'High'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {career.growthTrend} Demand
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition flex items-center justify-between">
                        <span>{career.title}</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {career.description}
                      </p>
                    </div>

                    {/* Profile Match Indicator if user exists */}
                    {matchEstimate && (
                      <div className="p-2.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                          <Target className="w-3.5 h-3.5" />
                          <span>Estimated Match</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">{matchEstimate.score}%</span>
                      </div>
                    )}

                    {/* Core Skills Chips */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Core Competencies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {career.coreSkills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {career.coreSkills.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-slate-800 text-slate-400 font-medium">
                            +{career.coreSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pathways Tags */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Entry Options
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {career.typicalEntryPathways.slice(0, 2).map((path, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400"
                          >
                            {path}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCareer(career)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Explore Path & Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deep Career Detail Modal */}
      {activeCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {activeCareer.sector}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {activeCareer.growthTrend} Demand
                  </span>
                  {activeCareer.degreeRequired ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      University Degree Common
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      Vocational / Self-Taught Friendly
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">{activeCareer.title}</h2>
                <p className="text-xs text-slate-400">{activeCareer.family} • Pan-African Career Profile</p>
              </div>

              <button
                onClick={() => setActiveCareer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Career Overview */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>What Does This Career Involve?</span>
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">{activeCareer.description}</p>
              </div>

              {/* Signature Career Pathway Component */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Career Progression & Execution Pathway</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Pan-African Blueprint</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
                  {/* Step 1: Foundation */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">01. Current Base</div>
                    <div className="text-xs font-semibold text-white my-1">Foundational Basics</div>
                    <div className="text-[10px] text-slate-400">Math, logic, literacy, basic tools</div>
                  </div>

                  {/* Step 2: Skills */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">02. Core Skills</div>
                    <div className="text-xs font-semibold text-emerald-300 my-1">
                      {activeCareer.coreSkills[0] || 'Technical Skills'}
                    </div>
                    <div className="text-[10px] text-slate-400">Tools & frameworks</div>
                  </div>

                  {/* Step 3: Learning */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-blue-400 uppercase">03. Pathways</div>
                    <div className="text-xs font-semibold text-blue-300 my-1">
                      {activeCareer.typicalEntryPathways[0] || 'TVET / Degree'}
                    </div>
                    <div className="text-[10px] text-slate-400">Certificates / Projects</div>
                  </div>

                  {/* Step 4: Experience */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-amber-400 uppercase">04. Experience</div>
                    <div className="text-xs font-semibold text-amber-300 my-1">Internships / Freelance</div>
                    <div className="text-[10px] text-slate-400">Portfolio verification</div>
                  </div>

                  {/* Step 5: Target Career */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">05. Destination</div>
                    <div className="text-xs font-bold text-white my-1">{activeCareer.title}</div>
                    <div className="text-[10px] text-emerald-300">Continuous Growth</div>
                  </div>
                </div>
              </div>

              {/* Skills & Prerequisites */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Core Technical */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Skills You'll Need (Technical / Core)</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeCareer.coreSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Soft Skills & Workplace */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Essential Soft & Transferable Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeCareer.softSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Where You Can Work & Entry Pathways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    <span>Where You Can Work Across Africa</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                    {activeCareer.sampleWorkEnvironments.map((env, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        <span>{env}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>Education & Alternative Pathways</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                    {activeCareer.typicalEntryPathways.map((path, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        <span>{path}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Regulation Notice if applicable */}
              {activeCareer.isRegulatedProfession && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-amber-300 font-bold block">Professional Licensing Notice</strong>
                    <p className="text-amber-200/80">
                      This is a regulated profession in most African jurisdictions. While self-study provides domain knowledge, official practice requires certification through national licensing bodies (e.g., {activeCareer.licensingBodyExample || 'National Professional Council'}).
                    </p>
                  </div>
                </div>
              )}

              {/* Related Live Opportunities */}
              {relatedOpportunities.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>Current Matched Opportunities in Africa</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {relatedOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2"
                      >
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {opp.type}
                          </span>
                          <h5 className="text-xs font-bold text-white mt-1.5 truncate">{opp.title}</h5>
                          <div className="text-[11px] text-slate-400 truncate">{opp.company} • {opp.location}</div>
                        </div>
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAdvisorWithPrompt) {
                    onOpenAdvisorWithPrompt(
                      `What are the step-by-step requirements to transition into a career as a ${activeCareer.title} in Africa?`
                    );
                  }
                  setActiveCareer(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ask AI Advisor About This Role</span>
              </button>

              <div className="flex items-center gap-2">
                {onOpenCVBuilderForCareer && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenCVBuilderForCareer(activeCareer.title);
                      setActiveCareer(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Build CV for This Career</span>
                  </button>
                )}

                {onSelectCareerForPath && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCareerForPath(activeCareer.title);
                      setActiveCareer(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50 flex items-center gap-1.5"
                  >
                    <Target className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Set as My Target Career</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
