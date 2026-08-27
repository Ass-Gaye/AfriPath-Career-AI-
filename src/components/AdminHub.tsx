import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Compass,
  Globe,
  Layers,
  Settings,
  Database,
  Languages,
  CheckCircle2,
  TrendingUp,
  Search,
  Plus,
  RefreshCw,
  FileCheck,
  Zap,
} from 'lucide-react';
import { CAREER_TAXONOMY, CAREER_SECTORS } from '../data/careerTaxonomy';
import { AFRICAN_COUNTRIES } from '../data/countriesData';
import { AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';
import { MASTER_SKILLS_DIRECTORY } from './SkillsExplorer';

interface AdminHubProps {
  onOpenTranslationModal?: () => void;
}

type AdminTab =
  | 'overview'
  | 'careers'
  | 'skills'
  | 'countries'
  | 'opportunities'
  | 'translations'
  | 'settings';

export const AdminHub: React.FC<AdminHubProps> = ({ onOpenTranslationModal }) => {
  const { t } = useTranslation(['admin', 'common']);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchFilter, setSearchFilter] = useState('');

  // Sample admin metrics
  const stats = [
    { title: 'Registered Users', value: '1,420+', icon: Users, color: 'text-emerald-400' },
    { title: 'Taxonomy Careers', value: `${CAREER_TAXONOMY.length}`, icon: Compass, color: 'text-blue-400' },
    { title: 'Verified Skills', value: `${MASTER_SKILLS_DIRECTORY.length}+`, icon: Zap, color: 'text-amber-400' },
    { title: 'African Nations', value: `${AFRICAN_COUNTRIES.length}`, icon: Globe, color: 'text-purple-400' },
    { title: 'Live Opportunities', value: `${AFRICAN_OPPORTUNITIES.length}`, icon: Briefcase, color: 'text-teal-400' },
    { title: 'Supported Locales', value: '4 (en, fr, wo, ar)', icon: Languages, color: 'text-rose-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>AfriPath Administration Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pan-African Intelligence Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Audit and manage career taxonomy, skills index, country profiles, verified opportunities, and translations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTranslationModal && (
              <button
                type="button"
                onClick={onOpenTranslationModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Translation Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
            { id: 'careers', label: 'Careers Database', icon: Compass },
            { id: 'skills', label: 'Skills Index', icon: Zap },
            { id: 'countries', label: 'Country Profiles', icon: Globe },
            { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
            { id: 'translations', label: 'Translation Audit', icon: Languages },
            { id: 'settings', label: 'System Configuration', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                  >
                    <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{stat.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>AI Engine & Data Store Health</span>
                </h3>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Gemini 2.5 Intelligence Engine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Pan-African Taxonomy Index</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {CAREER_TAXONOMY.length} Careers Loaded
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300">Multilingual i18n Engine</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 4 Locales Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>Regional Deployment Scope</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AfriPath AI operates across 54 African nations. Verified data includes Gambia, Senegal, Nigeria, Ghana, Kenya, South Africa, Rwanda, Egypt, and Morocco with active cross-border expansion.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  {AFRICAN_COUNTRIES.slice(0, 7).map((c) => (
                    <span
                      key={c.code}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                    >
                      {c.flag} {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Careers Database */}
        {activeTab === 'careers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Career Taxonomy ({CAREER_TAXONOMY.length})</h3>
                <p className="text-xs text-slate-400">Master database of professions and entry pathways</p>
              </div>
              <input
                type="text"
                placeholder="Filter careers..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Career Title</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3">Degree Required</th>
                    <th className="py-3 px-3">Growth Demand</th>
                    <th className="py-3 px-3">Regulated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {CAREER_TAXONOMY.filter((c) =>
                    searchFilter ? c.title.toLowerCase().includes(searchFilter.toLowerCase()) : true
                  ).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-semibold text-white">{c.title}</td>
                      <td className="py-2.5 px-3 text-slate-300">{c.sector}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.degreeRequired ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-400'
                          }`}
                        >
                          {c.degreeRequired ? 'Degree' : 'TVET / Open'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">{c.growthTrend}</td>
                      <td className="py-2.5 px-3 text-slate-400">{c.isRegulatedProfession ? 'Yes (Licensing)' : 'Standard'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Skills Index */}
        {activeTab === 'skills' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Skills Intelligence Index</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MASTER_SKILLS_DIRECTORY.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{s.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Countries */}
        {activeTab === 'countries' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Configured African Nations ({AFRICAN_COUNTRIES.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AFRICAN_COUNTRIES.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span className="text-xs font-bold text-white">{c.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {c.region} • Currency: {c.currencyCode} ({c.currencySymbol})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Opportunities */}
        {activeTab === 'opportunities' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Active Verified Opportunities ({AFRICAN_OPPORTUNITIES.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AFRICAN_OPPORTUNITIES.map((opp) => (
                <div key={opp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{opp.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {opp.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {opp.company} • {opp.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Translations */}
        {activeTab === 'translations' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
            <Languages className="w-10 h-10 mx-auto text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Translation Studio Audit</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Inspect, search, and export localized strings across all 14 translation namespaces (English, French, Wolof, Arabic).
            </p>
            {onOpenTranslationModal && (
              <button
                type="button"
                onClick={onOpenTranslationModal}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition inline-flex items-center gap-2"
              >
                <Languages className="w-4 h-4" />
                <span>Launch Translation Studio Modal</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 7: Settings */}
        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 max-w-2xl">
            <h3 className="text-base font-bold text-white">System Architecture & AI Configuration</h3>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div><strong className="text-white">Platform Name:</strong> AfriPath AI</div>
              <div><strong className="text-white">Tagline:</strong> "Your Career. Your Skills. Your Future."</div>
              <div><strong className="text-white">Default Model:</strong> Gemini 2.5 Flash</div>
              <div><strong className="text-white">Supported Locales:</strong> English (en), French (fr), Wolof (wo), Arabic (ar)</div>
              <div><strong className="text-white">Persistence:</strong> Secure Local / Server JSON Storage with JWT Auth</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
