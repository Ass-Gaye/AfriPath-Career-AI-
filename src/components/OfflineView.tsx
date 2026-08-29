import React, { useState } from 'react';
import { WifiOff, RefreshCw, Compass, Target, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { AfriPathLogo } from './AfriPathLogo';

interface OfflineViewProps {
  onNavigate: (tab: string) => void;
  hasSavedProfile: boolean;
}

export const OfflineView: React.FC<OfflineViewProps> = ({ onNavigate, hasSavedProfile }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  const handleRetry = () => {
    setIsChecking(true);
    setCheckMessage(null);
    setTimeout(() => {
      setIsChecking(false);
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setCheckMessage("Still offline. Reconnect to Wi-Fi or mobile data and try again.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        {/* Brand & Icon */}
        <div className="flex flex-col items-center gap-3">
          <AfriPathLogo size="md" showTagline={false} />
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-inner mt-2">
            <WifiOff className="w-8 h-8" />
          </div>
        </div>

        {/* Heading & Details */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">You're offline</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Some AfriPath features require an internet connection. Your previously saved career information and cached roadmaps remain available.
          </p>
        </div>

        {/* Available offline cards */}
        <div className="text-left bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
          <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Available in Offline Mode:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <button
              onClick={() => onNavigate(hasSavedProfile ? 'dashboard' : 'careers')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center gap-2 transition text-left"
            >
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{hasSavedProfile ? 'My Dashboard' : 'Explore Careers'}</span>
            </button>
            <button
              onClick={() => onNavigate('careers')}
              className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center gap-2 transition text-left"
            >
              <Target className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Cached Career Library</span>
            </button>
            {hasSavedProfile && (
              <>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center gap-2 transition text-left"
                >
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Saved 90-Day Roadmap</span>
                </button>
                <button
                  onClick={() => onNavigate('cv-builder')}
                  className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 flex items-center gap-2 transition text-left"
                >
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>AI CV Studio Drafts</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Retry Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking connection...' : 'Retry connection'}</span>
          </button>

          {checkMessage && (
            <p className="text-xs text-amber-400 animate-in fade-in duration-200">
              {checkMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
