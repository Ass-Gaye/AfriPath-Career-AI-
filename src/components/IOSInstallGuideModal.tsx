import React from 'react';
import { X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { AfriPathLogo } from './AfriPathLogo';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <AfriPathLogo size="sm" showTagline={false} />
          <div>
            <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
            <p className="text-xs text-slate-400">Add AfriPath AI to your home screen</p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                Tap the Share icon <Share className="w-3.5 h-3.5 text-blue-400 inline" />
              </p>
              <p className="text-slate-400 mt-0.5">
                At the bottom of your Safari browser bar, tap the share icon.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                Tap "Add to Home Screen" <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" />
              </p>
              <p className="text-slate-400 mt-0.5">
                Scroll down the options list and select <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                Tap "Add" in Top Right <CheckCircle className="w-3.5 h-3.5 text-amber-400 inline" />
              </p>
              <p className="text-slate-400 mt-0.5">
                AfriPath AI will be installed directly to your iPhone app grid with full offline support.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
