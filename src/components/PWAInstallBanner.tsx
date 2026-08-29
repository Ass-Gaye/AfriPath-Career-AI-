import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';

const PWA_DISMISSED_KEY = 'afripath_pwa_banner_dismissed';

interface PWAInstallBannerProps {
  onInstalled?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onInstalled }) => {
  const { isInstallable, isInstalled, platform, promptInstall } = usePWA();
  const [isDismissed, setIsDismissed] = useState<boolean>(true);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    // Check if dismissed recently (within 7 days)
    const dismissedUntil = localStorage.getItem(PWA_DISMISSED_KEY);
    if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
      setIsDismissed(true);
      return;
    }

    // Only show if installable and not already in standalone mode
    if (isInstallable && !isInstalled) {
      // Delay showing for 2.5 seconds so user has landed cleanly
      const timer = setTimeout(() => {
        setIsDismissed(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Dismiss for 7 days
    localStorage.setItem(PWA_DISMISSED_KEY, String(Date.now() + 7 * 24 * 60 * 60 * 1000));
  };

  const handleInstallClick = async () => {
    if (platform === 'ios') {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    try {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setIsDismissed(true);
        onInstalled?.();
      } else {
        handleDismiss();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isDismissed || isInstalled || (!isInstallable && platform !== 'ios')) {
    return (
      <>
        <IOSInstallGuideModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
      </>
    );
  }

  const title =
    platform === 'desktop'
      ? 'Install AfriPath AI'
      : 'Add AfriPath AI to your home screen';

  return (
    <>
      <aside
        id="pwa-install-banner"
        aria-label="Install AfriPath AI"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-emerald-950/50 text-slate-100 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              {platform === 'desktop' ? (
                <Monitor className="w-5 h-5" />
              ) : (
                <Smartphone className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
              <p className="text-[11px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Standalone App & Offline Access
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition"
            aria-label="Dismiss installation prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mt-3 leading-relaxed">
          Get faster access to your career roadmap, opportunities and AI career advisor with instant offline access.
        </p>

        <div className="flex items-center gap-2 mt-4">
          <button
            id="pwa-install-action-btn"
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex-1 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-950 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isInstalling ? 'Installing...' : 'Install'}</span>
          </button>
          <button
            id="pwa-dismiss-action-btn"
            onClick={handleDismiss}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-700 transition"
          >
            Not now
          </button>
        </div>
      </aside>

      <IOSInstallGuideModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
};
