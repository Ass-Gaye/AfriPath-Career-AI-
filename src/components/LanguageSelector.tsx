import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe2, Check, ChevronDown, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageConfig, getLanguageByCode } from '../i18n/languages';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'inline';
  onOpenAdmin?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  onOpenAdmin,
}) => {
  const { t } = useTranslation(['common', 'navigation']);
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang: LanguageConfig = getLanguageByCode(language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (langCode: string) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        id="language-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-xl transition border focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0 ${
          variant === 'compact'
            ? 'px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border-slate-700 shadow-sm'
            : 'px-3 py-2 text-sm font-medium bg-slate-900/80 hover:bg-slate-800 text-white border-slate-700'
        }`}
        title={t('common:selectLanguage', 'Select Language')}
        aria-label={t('common:selectLanguage', 'Select Language')}
      >
        <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 hidden sm:inline-block" />
        <span className="font-bold tracking-tight text-xs sm:text-sm">{currentLang.flag}</span>
        <span className="hidden md:inline-block max-w-[80px] truncate">{currentLang.nativeName}</span>
        <span className="hidden sm:inline-block md:hidden uppercase text-[10px] tracking-wider font-bold text-slate-300">
          {currentLang.code}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="language-dropdown-menu"
          className={`absolute ${
            isRTL ? 'left-0' : 'right-0'
          } mt-2 w-64 max-w-[calc(100vw-1rem)] rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95`}
        >
          <div className="px-3 py-2 border-b border-slate-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t('common:selectLanguage', 'Select Language')}
            </div>
            <div className="text-[10px] text-slate-500">
              {t('common:panAfrican', 'Pan-African')} (English, Français, Wolof, العربية)
            </div>
          </div>

          <div className="py-1 space-y-0.5 max-h-72 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  id={`language-option-${lang.code}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{lang.flag}</span>
                    <div className="truncate">
                      <div className="font-bold text-white text-xs flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        {lang.direction === 'rtl' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{lang.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {onOpenAdmin && (
            <div className="pt-1 border-t border-slate-800">
              <button
                type="button"
                id="open-admin-translations-btn"
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                className="w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-semibold text-emerald-400 hover:bg-slate-800 flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('navigation:adminTranslations', 'Translation Studio')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
