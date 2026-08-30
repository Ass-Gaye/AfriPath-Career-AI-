import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import {
  SUPPORTED_LANGUAGES,
  LanguageConfig,
  getLanguageByCode,
  formatLocalizedNumber,
  formatLocalizedDate,
  formatLocalizedCurrency,
} from '../i18n/languages';
import { changeLanguage, getInitialLanguage } from '../i18n';
import { getLocalizedCareer, CANONICAL_CAREER_TRANSLATIONS } from '../data/careerTranslations';

export interface LanguageContextType {
  language: string;
  languageConfig: LanguageConfig;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  setLanguage: (langCode: string) => void;
  t: (key: string, fallbackOrOptions?: string | Record<string, any>, options?: Record<string, any>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  getLocalizedCareer: (careerIdOrTitle: string) => { name: string; tagline: string; description: string };
  supportedLanguages: LanguageConfig[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t: i18nTranslate } = useI18nTranslation();
  const [currentCode, setCurrentCode] = useState<string>(() => i18n.language || getInitialLanguage());

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentCode(lng);
      const config = getLanguageByCode(lng);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = config.code;
        document.documentElement.dir = config.direction;
        if (config.direction === 'rtl') {
          document.documentElement.classList.add('rtl');
        } else {
          document.documentElement.classList.remove('rtl');
        }
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const setLanguage = (code: string) => {
    changeLanguage(code);
    setCurrentCode(code);
  };

  const languageConfig = useMemo(() => getLanguageByCode(currentCode), [currentCode]);
  const isRTL = languageConfig.direction === 'rtl';
  const direction = languageConfig.direction;

  const t = (key: string, fallbackOrOptions?: string | Record<string, any>, options?: Record<string, any>): string => {
    if (typeof fallbackOrOptions === 'string') {
      return String(i18nTranslate(key, fallbackOrOptions, options));
    }
    return String(i18nTranslate(key, fallbackOrOptions as any));
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    return formatLocalizedNumber(value, currentCode, options);
  };

  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    return formatLocalizedDate(date, currentCode, options);
  };

  const formatCurrency = (amount: number, currencyCode = 'USD') => {
    return formatLocalizedCurrency(amount, currencyCode, currentCode);
  };

  const localizedCareerHelper = (careerIdOrTitle: string) => {
    return getLocalizedCareer(careerIdOrTitle, currentCode);
  };

  const value: LanguageContextType = {
    language: currentCode,
    languageConfig,
    isRTL,
    direction,
    setLanguage,
    t,
    formatNumber,
    formatDate,
    formatCurrency,
    getLocalizedCareer: localizedCareerHelper,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    const fallbackCode = getInitialLanguage();
    const config = getLanguageByCode(fallbackCode);
    return {
      language: fallbackCode,
      languageConfig: config,
      isRTL: config.direction === 'rtl',
      direction: config.direction,
      setLanguage: changeLanguage,
      t: (k: string, f?: any) => (typeof f === 'string' ? f : k),
      formatNumber: (v: number) => String(v),
      formatDate: (d: any) => String(d),
      formatCurrency: (a: number, c = 'USD') => `${c} ${a}`,
      getLocalizedCareer: (title: string) => getLocalizedCareer(title, fallbackCode),
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
