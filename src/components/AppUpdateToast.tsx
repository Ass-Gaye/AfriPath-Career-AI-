import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const AppUpdateToast: React.FC = () => {
  const { updateAvailable, applyUpdate } = usePWA();
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (!updateAvailable || isDismissed) {
    return null;
  }

  return (
    <aside
      id="app-update-notification"
      role="status"
      aria-label="App update available"
      className="fixed bottom-24 lg:bottom-6 left-4 sm:left-6 z-50 max-w-sm w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-4 shadow-2xl shadow-emerald-950 text-slate-100 animate-in slide-in-from-bottom-3 duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">New version available</h4>
            <p className="text-[11px] text-slate-400">An update with fresh career data is ready.</p>
          </div>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          aria-label="Close update notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => applyUpdate()}
          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Update now</span>
        </button>
      </div>
    </aside>
  );
};
