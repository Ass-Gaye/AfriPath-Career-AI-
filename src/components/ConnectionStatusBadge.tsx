import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const ConnectionStatusBadge: React.FC = () => {
  const { isOnline } = usePWA();
  const [showReconnected, setShowReconnected] = useState<boolean>(false);
  const [wasOffline, setWasOffline] = useState<boolean>(!isOnline);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowReconnected(false);
    } else if (wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 800);
  };

  // If online and not showing reconnect toast, don't display anything to avoid clutter
  if (isOnline && !showReconnected) {
    return null;
  }

  // Reconnected Toast
  if (isOnline && showReconnected) {
    return (
      <div
        id="connection-reconnected-toast"
        className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center gap-2 border border-emerald-400/30 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <Wifi className="w-4 h-4 text-emerald-200 animate-pulse" />
        <span>Connected — Full AI & live data restored</span>
      </div>
    );
  }

  // Offline Banner
  return (
    <div
      id="connection-offline-banner"
      role="alert"
      className="fixed top-16 sm:top-18 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl bg-slate-900/95 backdrop-blur-xl text-slate-200 text-xs rounded-2xl shadow-2xl shadow-black/80 p-3 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 border border-amber-500/40 animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="truncate">
          <span className="font-bold text-amber-300 mr-1.5">You’re offline</span>
          <span className="text-slate-300 hidden sm:inline">
            — Saved roadmaps and cached profiles are active. AI features require an internet connection.
          </span>
          <span className="text-slate-300 sm:hidden">
            — Cached data active.
          </span>
        </div>
      </div>

      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
        <span>{isRetrying ? 'Checking...' : 'Retry'}</span>
      </button>
    </div>
  );
};
