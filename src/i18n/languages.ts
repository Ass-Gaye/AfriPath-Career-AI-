export interface Language {
  id: string;
  code: string; // ISO 639-1 code (e.g. 'en', 'fr', 'wo', 'ar', 'sw', 'pt', 'ha', 'yo')
  name: string;
  nativeName: string;
  locale: string;
  direction: 'ltr' | 'rtl';
  isActive: boolean;
  isDefault: boolean;
  flag: string;
  speechSupported: boolean;
  voiceSupported: boolean;
  currencyBehavior: 'symbol-prefix' | 'symbol-suffix' | 'code-suffix';
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
  };
  translationCompleteness?: number;
  status: 'PUBLISHED' | 'BETA' | 'IN_DEVELOPMENT';
}

export type LanguageConfig = Language;

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'lang-en',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-US',
    direction: 'ltr',
    isActive: true,
    isDefault: true,
    flag: '🇬🇧',
    speechSupported: true,
    voiceSupported: true,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'MMMM D, YYYY',
    numberFormat: { decimal: '.', thousand: ',' },
    translationCompleteness: 100,
    status: 'PUBLISHED',
  },
  {
    id: 'lang-fr',
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    locale: 'fr-FR',
    direction: 'ltr',
    isActive: true,
    isDefault: false,
    flag: '🇫🇷',
    speechSupported: true,
    voiceSupported: true,
    currencyBehavior: 'symbol-suffix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: ',', thousand: ' ' },
    translationCompleteness: 98,
    status: 'PUBLISHED',
  },
  {
    id: 'lang-wo',
    code: 'wo',
    name: 'Wolof',
    nativeName: 'Wolof',
    locale: 'wo-SN',
    direction: 'ltr',
    isActive: true,
    isDefault: false,
    flag: '🇸🇳',
    speechSupported: false,
    voiceSupported: false,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: '.', thousand: ',' },
    translationCompleteness: 88,
    status: 'PUBLISHED',
  },
  {
    id: 'lang-ar',
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    locale: 'ar-EG',
    direction: 'rtl',
    isActive: true,
    isDefault: false,
    flag: '🇸🇦',
    speechSupported: true,
    voiceSupported: true,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: '٫', thousand: '٬' },
    translationCompleteness: 85,
    status: 'BETA',
  },
  {
    id: 'lang-sw',
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    locale: 'sw-KE',
    direction: 'ltr',
    isActive: false,
    isDefault: false,
    flag: '🇰🇪',
    speechSupported: true,
    voiceSupported: false,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: '.', thousand: ',' },
    translationCompleteness: 40,
    status: 'IN_DEVELOPMENT',
  },
  {
    id: 'lang-pt',
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    locale: 'pt-MZ',
    direction: 'ltr',
    isActive: false,
    isDefault: false,
    flag: '🇲🇿',
    speechSupported: true,
    voiceSupported: true,
    currencyBehavior: 'symbol-suffix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: ',', thousand: ' ' },
    translationCompleteness: 45,
    status: 'IN_DEVELOPMENT',
  },
  {
    id: 'lang-ha',
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    locale: 'ha-NG',
    direction: 'ltr',
    isActive: false,
    isDefault: false,
    flag: '🇳🇬',
    speechSupported: false,
    voiceSupported: false,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: '.', thousand: ',' },
    translationCompleteness: 35,
    status: 'IN_DEVELOPMENT',
  },
  {
    id: 'lang-yo',
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    locale: 'yo-NG',
    direction: 'ltr',
    isActive: false,
    isDefault: false,
    flag: '🇳🇬',
    speechSupported: false,
    voiceSupported: false,
    currencyBehavior: 'symbol-prefix',
    dateFormat: 'D MMMM YYYY',
    numberFormat: { decimal: '.', thousand: ',' },
    translationCompleteness: 30,
    status: 'IN_DEVELOPMENT',
  },
];

export function getActiveLanguages(): Language[] {
  return SUPPORTED_LANGUAGES.filter((lang) => lang.isActive);
}

export function getAllLanguages(): Language[] {
  return SUPPORTED_LANGUAGES;
}

export function getLanguageByCode(code: string): Language {
  const normalized = (code || 'en').toLowerCase().split('-')[0];
  const match = SUPPORTED_LANGUAGES.find((lang) => lang.code === normalized);
  return (
    match ||
    SUPPORTED_LANGUAGES.find((lang) => lang.isDefault) ||
    SUPPORTED_LANGUAGES[0]
  );
}

/**
 * Format localized numbers safely using Intl.NumberFormat
 */
export function formatLocalizedNumber(
  value: number,
  languageCode = 'en',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const lang = getLanguageByCode(languageCode);
    return new Intl.NumberFormat(lang.locale, options).format(value);
  } catch {
    return value.toLocaleString();
  }
}

/**
 * Format localized dates safely using Intl.DateTimeFormat
 */
export function formatLocalizedDate(
  date: Date | string | number,
  languageCode = 'en',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
  try {
    const lang = getLanguageByCode(languageCode);
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    return new Intl.DateTimeFormat(lang.locale, options).format(d);
  } catch {
    return String(date);
  }
}

/**
 * Format localized currency amounts
 */
export function formatLocalizedCurrency(
  amount: number,
  currencyCode = 'USD',
  languageCode = 'en'
): string {
  try {
    const lang = getLanguageByCode(languageCode);
    return new Intl.NumberFormat(lang.locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toLocaleString()}`;
  }
}
