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
} from 'lucide-react';
import { JobOpportunity, UserProfile } from '../types/career';
import {
  GAMBIAN_TECH_HUBS,
  REAL_GAMBIA_JOB_LISTINGS,
  INDUSTRY_INTERESTS,
} from '../data/gambiaData';

interface GambiaCareerMapProps {
  userProfile: UserProfile | null;
  onApplyForJob?: (job: JobOpportunity) => void;
  onGenerateCVForJob?: (jobTitle: string, company: string) => void;
}

export const GambiaCareerMap: React.FC<GambiaCareerMapProps> = ({
  userProfile,
  onGenerateCVForJob,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [hasAppliedMap, setHasAppliedMap] = useState<Record<string, boolean>>({});

  const filteredJobs = REAL_GAMBIA_JOB_LISTINGS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || job.category.includes(selectedCategory);

    const matchesType = selectedType === 'All' || job.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleApply = (jobId: string) => {
    setHasAppliedMap((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Gambia Career Map & Verified Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Explore tech hubs across Greater Banjul and live openings for entry-level talent and graduates.
        </p>
      </div>

      {/* Regional Tech Hubs */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          <span>Regional Tech & Innovation Clusters in The Gambia</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {GAMBIAN_TECH_HUBS.map((hub, idx) => (
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
                <span className="font-medium text-slate-300">Key Employers: </span>
                {hub.keyCompanies.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Job Openings */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Verified Tech Openings</span>
            </h2>
            <p className="text-xs text-slate-400">
              Showing {filteredJobs.length} positions in The Gambia.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search roles or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Fellowship">Fellowship</option>
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
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {job.type} • {job.workplaceType}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location.split(',')[0]}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1">{job.title}</h3>
                  <div className="text-xs font-semibold text-emerald-400 mb-2">{job.company}</div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
                    {job.description}
                  </p>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.requiredSkills.map((skill, sIdx) => {
                      const isMatch = userProfile?.currentSkills.includes(skill);

                      return (
                        <span
                          key={sIdx}
                          className={`px-2 py-0.5 rounded text-[10px] ${
                            isMatch
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold'
                              : 'bg-slate-950 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {isMatch ? `✓ ${skill}` : skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{job.salaryOrStipend}</span>
                    <span className="text-[11px] text-slate-400">Due {job.deadline}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition text-center"
                    >
                      Details
                    </button>

                    {onGenerateCVForJob && (
                      <button
                        onClick={() => onGenerateCVForJob(job.title, job.company)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition flex items-center gap-1"
                        title="Generate tailored CV for this opening"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Tailor CV</span>
                      </button>
                    )}

                    {hasApplied ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(job.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedJob.type} • {selectedJob.workplaceType}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedJob.title}</h3>
                <p className="text-xs font-semibold text-emerald-400">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div>
                <strong className="text-slate-200 block mb-1">Role Description:</strong>
                <p>{selectedJob.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Compensation:</span>
                  <span className="font-bold text-white">{selectedJob.salaryOrStipend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{selectedJob.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deadline:</span>
                  <span className="text-amber-400 font-medium">{selectedJob.deadline}</span>
                </div>
              </div>

              <div>
                <strong className="text-slate-200 block mb-1">Required Competencies:</strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs bg-slate-950 text-slate-200 border border-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleApply(selectedJob.id);
                  setSelectedJob(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm"
              >
                Submit Fast Application
              </button>
              <a
                href={selectedJob.applicationUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
              >
                <span>Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
