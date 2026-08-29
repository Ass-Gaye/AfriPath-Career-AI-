import React, { useState } from 'react';
import { Download, CheckCircle2, Sparkles, Smartphone, Monitor, ShieldCheck, Zap } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { IOSInstallGuideModal } from './IOSInstallGuideModal';

interface PWAInstallCardProps {
  compact?: boolean;
}

export const PWAInstallCard: React.FC<PWAInstallCardProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, platform, promptInstall } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  const handleInstall = async () => {
    if (platform === 'ios') {
      setShowIOSModal(true);
      return;
    }

    setIsInstalling(true);
    try {
      const outcome = await promptInstall();
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsInstalling(false);
    }
  };

  if (isInstalled || installedSuccess) {
    return (
      <div className={`rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-4 text-slate-200 flex items-center justify-between gap-3 ${compact ? 'text-xs' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-xs sm:text-sm">AfriPath AI Installed</div>
            <div className="text-[11px] text-emerald-400">Running in standalone application mode with offline caching enabled.</div>
          </div>
        </div>
      </div>
    );
  }

  const title = platform === 'desktop' ? 'Install AfriPath AI Desktop' : 'Install AfriPath AI App';

  return (
    <>
      <div className={`rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-4 sm:p-5 text-slate-200 transition shadow-lg ${compact ? 'text-xs' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              {platform === 'desktop' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>{title}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold tracking-wide">
                  PWA
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                Launch instantly from your home screen or desktop taskbar without browser borders.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-950 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isInstalling ? 'Installing...' : 'Install AfriPath'}</span>
            </button>
          </div>
        </div>

        {!compact && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Offline Cache</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure Local Data</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Quick App Shortcuts</span>
            </div>
          </div>
        )}
      </div>

      <IOSInstallGuideModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
};
