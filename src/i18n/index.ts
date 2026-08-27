import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguageByCode } from './languages';

// English translations
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enHome from './locales/en/home.json';
import enAssessment from './locales/en/assessment.json';
import enCareers from './locales/en/careers.json';
import enSkills from './locales/en/skills.json';
import enRoadmap from './locales/en/roadmap.json';
import enAdvisor from './locales/en/advisor.json';
import enDashboard from './locales/en/dashboard.json';
import enCV from './locales/en/cv.json';
import enOpportunities from './locales/en/opportunities.json';
import enAuth from './locales/en/auth.json';
import enErrors from './locales/en/errors.json';
import enAdmin from './locales/en/admin.json';

// French translations
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frHome from './locales/fr/home.json';
import frAssessment from './locales/fr/assessment.json';
import frCareers from './locales/fr/careers.json';
import frSkills from './locales/fr/skills.json';
import frRoadmap from './locales/fr/roadmap.json';
import frAdvisor from './locales/fr/advisor.json';
import frDashboard from './locales/fr/dashboard.json';
import frCV from './locales/fr/cv.json';
import frOpportunities from './locales/fr/opportunities.json';
import frAuth from './locales/fr/auth.json';
import frErrors from './locales/fr/errors.json';
import frAdmin from './locales/fr/admin.json';

// Wolof translations
import woCommon from './locales/wo/common.json';
import woNavigation from './locales/wo/navigation.json';
import woHome from './locales/wo/home.json';
import woAssessment from './locales/wo/assessment.json';
import woCareers from './locales/wo/careers.json';
import woSkills from './locales/wo/skills.json';
import woRoadmap from './locales/wo/roadmap.json';
import woAdvisor from './locales/wo/advisor.json';
import woDashboard from './locales/wo/dashboard.json';
import woCV from './locales/wo/cv.json';
import woOpportunities from './locales/wo/opportunities.json';
import woAuth from './locales/wo/auth.json';
import woErrors from './locales/wo/errors.json';
import woAdmin from './locales/wo/admin.json';

// Arabic translations
import arCommon from './locales/ar/common.json';
import arNavigation from './locales/ar/navigation.json';
import arHome from './locales/ar/home.json';
import arAssessment from './locales/ar/assessment.json';
import arCareers from './locales/ar/careers.json';
import arSkills from './locales/ar/skills.json';
import arRoadmap from './locales/ar/roadmap.json';
import arAdvisor from './locales/ar/advisor.json';
import arDashboard from './locales/ar/dashboard.json';
import arCV from './locales/ar/cv.json';
import arOpportunities from './locales/ar/opportunities.json';
import arAuth from './locales/ar/auth.json';
import arErrors from './locales/ar/errors.json';
import arAdmin from './locales/ar/admin.json';

const LANGUAGE_KEY = 'afripath_language';

export function getInitialLanguage(): string {
  try {
    // 1. Saved localStorage preference
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved && ['en', 'fr', 'wo', 'ar'].includes(saved)) {
      return saved;
    }

    // 2. Authenticated user profile preference (if already present in local user cache)
    const userJson = localStorage.getItem('gambia_career_user');
    if (userJson) {
      try {
        const u = JSON.parse(userJson);
        if (u.languagePreference && ['en', 'fr', 'wo', 'ar'].includes(u.languagePreference)) {
          return u.languagePreference;
        }
      } catch {
        // ignore JSON parse
      }
    }

    // 3. Browser language detection
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (['fr', 'wo', 'ar'].includes(browserLang)) {
        return browserLang;
      }
    }
  } catch (e) {
    console.warn('Language detection error:', e);
  }

  // 4. Default fallback to English
  return 'en';
}

const resources = {
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

const initialLang = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
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
    ],
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * Updates document attributes (dir and lang) and saves language preference
 */
export function changeLanguage(langCode: string): void {
  const langConfig = getLanguageByCode(langCode);
  i18n.changeLanguage(langConfig.code);
  
  if (typeof document !== 'undefined') {
    document.documentElement.lang = langConfig.code;
    document.documentElement.dir = langConfig.direction;
    if (langConfig.direction === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }

  try {
    localStorage.setItem(LANGUAGE_KEY, langConfig.code);
  } catch (err) {
    console.error('Failed to save language to localStorage:', err);
  }
}

// Initial sync of document direction on load
if (typeof document !== 'undefined') {
  const initialConfig = getLanguageByCode(initialLang);
  document.documentElement.lang = initialConfig.code;
  document.documentElement.dir = initialConfig.direction;
  if (initialConfig.direction === 'rtl') {
    document.documentElement.classList.add('rtl');
  }
}

export default i18n;
