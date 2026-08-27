import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe2, Check, Search, Filter, ShieldCheck, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../i18n/languages';
import { changeLanguage } from '../i18n';

// Import translation data for analysis
import enCommon from '../i18n/locales/en/common.json';
import enNavigation from '../i18n/locales/en/navigation.json';
import enHome from '../i18n/locales/en/home.json';
import enAssessment from '../i18n/locales/en/assessment.json';
import enCareers from '../i18n/locales/en/careers.json';
import enSkills from '../i18n/locales/en/skills.json';
import enRoadmap from '../i18n/locales/en/roadmap.json';
import enAdvisor from '../i18n/locales/en/advisor.json';
import enDashboard from '../i18n/locales/en/dashboard.json';
import enCV from '../i18n/locales/en/cv.json';
import enOpportunities from '../i18n/locales/en/opportunities.json';
import enAuth from '../i18n/locales/en/auth.json';
import enErrors from '../i18n/locales/en/errors.json';
import enAdmin from '../i18n/locales/en/admin.json';

import frCommon from '../i18n/locales/fr/common.json';
import frNavigation from '../i18n/locales/fr/navigation.json';
import frHome from '../i18n/locales/fr/home.json';
import frAssessment from '../i18n/locales/fr/assessment.json';
import frCareers from '../i18n/locales/fr/careers.json';
import frSkills from '../i18n/locales/fr/skills.json';
import frRoadmap from '../i18n/locales/fr/roadmap.json';
import frAdvisor from '../i18n/locales/fr/advisor.json';
import frDashboard from '../i18n/locales/fr/dashboard.json';
import frCV from '../i18n/locales/fr/cv.json';
import frOpportunities from '../i18n/locales/fr/opportunities.json';
import frAuth from '../i18n/locales/fr/auth.json';
import frErrors from '../i18n/locales/fr/errors.json';
import frAdmin from '../i18n/locales/fr/admin.json';

import woCommon from '../i18n/locales/wo/common.json';
import woNavigation from '../i18n/locales/wo/navigation.json';
import woHome from '../i18n/locales/wo/home.json';
import woAssessment from '../i18n/locales/wo/assessment.json';
import woCareers from '../i18n/locales/wo/careers.json';
import woSkills from '../i18n/locales/wo/skills.json';
import woRoadmap from '../i18n/locales/wo/roadmap.json';
import woAdvisor from '../i18n/locales/wo/advisor.json';
import woDashboard from '../i18n/locales/wo/dashboard.json';
import woCV from '../i18n/locales/wo/cv.json';
import woOpportunities from '../i18n/locales/wo/opportunities.json';
import woAuth from '../i18n/locales/wo/auth.json';
import woErrors from '../i18n/locales/wo/errors.json';
import woAdmin from '../i18n/locales/wo/admin.json';

import arCommon from '../i18n/locales/ar/common.json';
import arNavigation from '../i18n/locales/ar/navigation.json';
import arHome from '../i18n/locales/ar/home.json';
import arAssessment from '../i18n/locales/ar/assessment.json';
import arCareers from '../i18n/locales/ar/careers.json';
import arSkills from '../i18n/locales/ar/skills.json';
import arRoadmap from '../i18n/locales/ar/roadmap.json';
import arAdvisor from '../i18n/locales/ar/advisor.json';
import arDashboard from '../i18n/locales/ar/dashboard.json';
import arCV from '../i18n/locales/ar/cv.json';
import arOpportunities from '../i18n/locales/ar/opportunities.json';
import arAuth from '../i18n/locales/ar/auth.json';
import arErrors from '../i18n/locales/ar/errors.json';
import arAdmin from '../i18n/locales/ar/admin.json';

const ALL_LOCALES: Record<string, Record<string, any>> = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    home: enHome,
    assessment: enAssessment,
    careers: enCareers,
    skills: enSkills,
    roadmap: enRoadmap,
    advisor: enAdvisor,
    dashboard: enDashboard,
    cv: enCV,
    opportunities: enOpportunities,
    auth: enAuth,
    errors: enErrors,
    admin: enAdmin,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    home: frHome,
    assessment: frAssessment,
    careers: frCareers,
    skills: frSkills,
    roadmap: frRoadmap,
    advisor: frAdvisor,
    dashboard: frDashboard,
    cv: frCV,
    opportunities: frOpportunities,
    auth: frAuth,
    errors: frErrors,
    admin: frAdmin,
  },
  wo: {
    common: woCommon,
    navigation: woNavigation,
    home: woHome,
    assessment: woAssessment,
    careers: woCareers,
    skills: woSkills,
    roadmap: woRoadmap,
    advisor: woAdvisor,
    dashboard: woDashboard,
    cv: woCV,
    opportunities: woOpportunities,
    auth: woAuth,
    errors: woErrors,
    admin: woAdmin,
  },
  ar: {
    common: arCommon,
    navigation: arNavigation,
    home: arHome,
    assessment: arAssessment,
    careers: arCareers,
    skills: arSkills,
    roadmap: arRoadmap,
    advisor: arAdvisor,
    dashboard: arDashboard,
    cv: arCV,
    opportunities: arOpportunities,
    auth: arAuth,
    errors: arErrors,
    admin: arAdmin,
  },
};

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}

interface TranslationAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TranslationAdminModal: React.FC<TranslationAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [targetLang, setTargetLang] = useState<string>('fr');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMissingOnly, setFilterMissingOnly] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const namespaces = [
    'common',
    'navigation',
    'home',
    'assessment',
    'careers',
    'skills',
    'roadmap',
    'advisor',
    'dashboard',
    'cv',
    'opportunities',
    'auth',
    'errors',
    'admin',
  ];

  // Collect all English source strings
  const sourceKeys: { ns: string; key: string; sourceValue: string; targetValue?: string; status: string }[] = [];

  namespaces.forEach((ns) => {
    if (selectedNamespace !== 'all' && selectedNamespace !== ns) return;

    const sourceObj = ALL_LOCALES['en']?.[ns] || {};
    const targetObj = ALL_LOCALES[targetLang]?.[ns] || {};

    const flatSource = flattenObject(sourceObj, ns);
    const flatTarget = flattenObject(targetObj, ns);

    for (const [fullKey, sourceVal] of Object.entries(flatSource)) {
      const targetVal = flatTarget[fullKey];
      const hasTranslation = targetVal !== undefined && targetVal !== '';
      const status = hasTranslation ? 'PUBLISHED' : 'NEEDS_TRANSLATION';

      if (filterMissingOnly && hasTranslation) continue;
      if (statusFilter !== 'ALL' && status !== statusFilter) continue;

      if (
        !searchQuery ||
        fullKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sourceVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (targetVal && targetVal.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        sourceKeys.push({
          ns,
          key: fullKey,
          sourceValue: sourceVal,
          targetValue: targetVal,
          status,
        });
      }
    }
  });

  // Calculate completeness for all languages
  const completenessByLang: Record<string, { total: number; translated: number; percent: number }> = {};

  SUPPORTED_LANGUAGES.forEach((lang) => {
    let total = 0;
    let translated = 0;

    namespaces.forEach((ns) => {
      const flatSource = flattenObject(ALL_LOCALES['en']?.[ns] || {}, ns);
      const flatTarget = flattenObject(ALL_LOCALES[lang.code]?.[ns] || {}, ns);

      for (const k of Object.keys(flatSource)) {
        total += 1;
        if (flatTarget[k]) {
          translated += 1;
        }
      }
    });

    completenessByLang[lang.code] = {
      total,
      translated,
      percent: total > 0 ? Math.round((translated / total) * 100) : 0,
    };
  });

  const targetLangConfig = getLanguageByCode(targetLang);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ALL_LOCALES[targetLang], null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `afripath_translations_${targetLang}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {t('admin:title')}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Pan-African I18N
                </span>
              </h2>
              <p className="text-xs text-slate-400">{t('admin:subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Metrics Bar */}
        <div className="px-6 py-4 bg-slate-950/50 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const stats = completenessByLang[lang.code] || { total: 0, translated: 0, percent: 0 };
            const isSelected = targetLang === lang.code;

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setTargetLang(lang.code)}
                className={`p-3 rounded-2xl border text-left transition ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">{stats.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
                  <span>{lang.code.toUpperCase()} ({lang.direction})</span>
                  <span>{stats.translated}/{stats.total} strings</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('admin:searchKeys')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedNamespace}
              onChange={(e) => setSelectedNamespace(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Namespaces</option>
              {namespaces.map((ns) => (
                <option key={ns} value={ns}>
                  {ns}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMissingOnly(!filterMissingOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                filterMissingOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('admin:filterMissing')}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('admin:exportPO')}</span>
            </button>
          </div>
        </div>

        {/* Translation Strings Table */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sourceKeys.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-medium">{t('admin:allVerified')}</p>
            </div>
          ) : (
            sourceKeys.map((item) => (
              <div
                key={item.key}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {item.key}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {item.ns}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* English Source */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>🇬🇧</span> English (Source)
                    </div>
                    <p className="text-slate-200">{item.sourceValue}</p>
                  </div>

                  {/* Target Language Translation */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/60">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span>{targetLangConfig.flag}</span> {targetLangConfig.name} ({targetLangConfig.nativeName})
                    </div>
                    {item.targetValue ? (
                      <p className="text-emerald-300 font-medium">{item.targetValue}</p>
                    ) : (
                      <p className="text-slate-500 italic">No translation recorded (Falls back to English)</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{sourceKeys.length}</strong> translation keys
          </div>
          <button
            onClick={() => {
              changeLanguage(targetLang);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Apply {targetLangConfig.nativeName} to App
          </button>
        </div>
      </div>
    </div>
  );
};
