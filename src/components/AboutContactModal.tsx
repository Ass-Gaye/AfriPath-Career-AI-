import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Mail,
  Send,
  CheckCircle2,
  X,
  Globe,
  Sparkles,
  Users,
  Building,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

interface AboutContactModalProps {
  isOpen: boolean;
  initialTab?: 'about' | 'contact';
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({
  isOpen,
  initialTab = 'about',
  onClose,
}) => {
  const { t } = useTranslation(['common']);
  const [tab, setTab] = useState<'about' | 'contact'>(initialTab);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCountry, setContactCountry] = useState('The Gambia');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-sm">
              AP
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AfriPath AI</h2>
              <p className="text-xs text-slate-400">"Your Career. Your Skills. Your Future."</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setTab('about')}
            className={`pb-3 transition relative ${
              tab === 'about'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            About AfriPath AI
          </button>
          <button
            type="button"
            onClick={() => setTab('contact')}
            className={`pb-3 transition relative ${
              tab === 'contact'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Contact & Partnerships
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === 'about' ? (
            <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>The Pan-African Career Intelligence Mission</span>
                </h3>
                <p>
                  AfriPath AI is built to empower African talent across 54 nations. By uniting market-verified career taxonomies, realistic skill-gap diagnostics, 90-day actionable roadmaps, and low-bandwidth learning pathways, we close the gap between education and high-demand African and global opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>54 Nations</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Localized education and TVET systems across West, East, Southern, North, and Central Africa.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>Multiple Languages</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Native support for English, French, Wolof, and Arabic with dynamic RTL styling.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ethical AI</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Transparent match scoring, low-bandwidth accessibility, and clear professional licensing guidance.</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {submitted ? (
                <div className="p-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Message Sent Successfully</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out to the AfriPath AI team. An educational advisor or partnership lead will reply to your email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g., Musa Jallow"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g., musa@afripath.ai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={contactCountry}
                      onChange={(e) => setContactCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Inquiry / Partnership Proposal
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us how we can assist your institution, organization, or personal career journey..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to AfriPath Team</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
