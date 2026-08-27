import React from 'react';
import {
  X,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Banknote,
  Globe2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { CountryConfig } from '../types/career';
import { PAN_AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';

interface CountryDetailModalProps {
  country: CountryConfig | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectCountryForJobs?: (countryCode: string) => void;
}

export const CountryDetailModal: React.FC<CountryDetailModalProps> = ({
  country,
  isOpen,
  onClose,
  onSelectCountryForJobs,
}) => {
  if (!isOpen || !country) return null;

  const countryOpportunities = PAN_AFRICAN_OPPORTUNITIES.filter(
    (job) =>
      job.countryCode?.toUpperCase() === country.code.toUpperCase() ||
      job.country?.toLowerCase().includes(country.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl sm:text-5xl shadow-sm">{country.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {country.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {country.region}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Currency: <strong className="text-slate-200">{country.currencyCode} ({country.currencySymbol})</strong> • Languages: {country.languages.join(', ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Major High-Growth Industries */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>High-Growth Industry Sectors</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {country.majorIndustries.map((ind, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic & TVET Institutions */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <GraduationCap className="w-4 h-4" />
              <span>Key Higher & TVET Institutions</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {country.universitiesAndInstitutes.map((uni, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span>{uni}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recognized Education Credentials */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <GraduationCap className="w-4 h-4" />
            <span>Standard Education & TVET Pathways</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {country.educationLevels.map((lvl, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200"
              >
                {lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Professional & Licensing Bodies */}
        {country.professionalBodies && country.professionalBodies.length > 0 && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Professional Regulatory & Licensing Bodies</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {country.professionalBodies.map((body, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300"
                >
                  {body}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Active Verified Opportunities in this Country */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>Verified Openings in {country.name} ({countryOpportunities.length})</span>
            </h3>
            {onSelectCountryForJobs && (
              <button
                onClick={() => {
                  onSelectCountryForJobs(country.code);
                  onClose();
                }}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
              >
                <span>View Full Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {countryOpportunities.length > 0 ? (
              countryOpportunities.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{job.title}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {job.company} • {job.location} ({job.type})
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-400 shrink-0">
                    {job.salaryOrStipend}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                Remote & regional Pan-African roles available for candidates in {country.name}.
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
          {onSelectCountryForJobs && (
            <button
              onClick={() => {
                onSelectCountryForJobs(country.code);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
            >
              Explore {country.name} Opportunities
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
