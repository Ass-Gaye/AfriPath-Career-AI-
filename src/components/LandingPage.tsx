import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target,
  MapPin,
  Building2,
  ChevronRight,
  UserPlus,
  LogIn,
  Globe2,
  TrendingUp,
  BookOpen,
  Briefcase,
  Compass,
  Cpu,
  HeartPulse,
  Scale,
  GraduationCap,
  Sprout,
  Wrench,
  Palette,
  Ship,
  Sun,
  ShieldCheck,
  Search,
  MessageSquare,
  ChevronDown,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { AfriPathLogo } from './AfriPathLogo';
import { AFRICAN_COUNTRIES, CountryConfig } from '../data/countriesData';
import { PAN_AFRICAN_OPPORTUNITIES } from '../data/africanOpportunitiesData';
import { CountryDetailModal } from './CountryDetailModal';
import { AuthMode } from './AuthModal';

interface LandingPageProps {
  onStartAssessment: () => void;
  onLoadDemoUser: () => void;
  onExploreJobs: () => void;
  onOpenAuth?: (mode: AuthMode) => void;
  onOpenMentorWithQuery?: (query: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onLoadDemoUser,
  onExploreJobs,
  onOpenAuth,
  onOpenMentorWithQuery,
}) => {
  const { t } = useTranslation(['home', 'common', 'navigation']);

  // Modal states
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig | null>(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('tech');

  // Interactive skills preview state in Section 13
  const [activeSkillSet, setActiveSkillSet] = useState<'data' | 'solar' | 'health' | 'finance'>('data');

  // 12 Career Categories matching prompt specifications
  const careerCategories = [
    {
      id: 'tech',
      name: 'Software & Technology',
      icon: Cpu,
      color: 'emerald',
      count: '42+ Careers',
      desc: 'Frontend, Full-Stack, AI Engineering, Cloud DevOps, Cybersecurity, Mobile Apps.',
    },
    {
      id: 'health',
      name: 'Healthcare & Life Sciences',
      icon: HeartPulse,
      color: 'rose',
      count: '28+ Careers',
      desc: 'Clinical Nursing, Public Health, Medical Laboratory, Pharmacy, Community Health.',
    },
    {
      id: 'finance',
      name: 'Finance, Banking & Fintech',
      icon: TrendingUp,
      color: 'blue',
      count: '35+ Careers',
      desc: 'Financial Accounting, Fintech Analysis, Tax Compliance, Audit, Digital Payments.',
    },
    {
      id: 'energy',
      name: 'Renewable Energy & Climate',
      icon: Sun,
      color: 'amber',
      count: '22+ Careers',
      desc: 'Solar PV Systems, Microgrids, Inverter Installation, Energy Efficiency Auditing.',
    },
    {
      id: 'agri',
      name: 'Agriculture & Agribusiness',
      icon: Sprout,
      color: 'green',
      count: '30+ Careers',
      desc: 'Horticulture, Commercial Poultry, Drip Irrigation, Agribusiness Supply Chains.',
    },
    {
      id: 'trades',
      name: 'Skilled Trades & TVET',
      icon: Wrench,
      color: 'orange',
      count: '38+ Careers',
      desc: 'Domestic & Industrial Electrical, Automotive Mechanics, Welding, Construction.',
    },
    {
      id: 'creative',
      name: 'Creative Arts & Design',
      icon: Palette,
      color: 'purple',
      count: '24+ Careers',
      desc: 'UI/UX Product Design, Digital Animation, Video Production, Brand Architecture.',
    },
    {
      id: 'edu',
      name: 'Education & EdTech',
      icon: GraduationCap,
      color: 'indigo',
      count: '18+ Careers',
      desc: 'STEM Instruction, TVET Mentorship, Instructional Design, Digital Curriculum.',
    },
    {
      id: 'law',
      name: 'Law & Corporate Governance',
      icon: Scale,
      color: 'teal',
      count: '16+ Careers',
      desc: 'Commercial Legal Counsel, Data Compliance, Regulatory Risk, IP Advisory.',
    },
    {
      id: 'logistics',
      name: 'Logistics & Supply Chain',
      icon: Ship,
      color: 'cyan',
      count: '20+ Careers',
      desc: 'Port Operations, Customs Clearance (ASYCUDA), Freight Logistics, Fleet Management.',
    },
    {
      id: 'business',
      name: 'Business & Operations',
      icon: Building2,
      color: 'violet',
      count: '32+ Careers',
      desc: 'Product Management, Business Intelligence, Enterprise Sales, Operations Strategy.',
    },
    {
      id: 'public',
      name: 'Public Service & Development',
      icon: Globe2,
      color: 'sky',
      count: '25+ Careers',
      desc: 'Policy Formulation, Monitoring & Evaluation (M&E), NGO Project Management.',
    },
  ];

  // Advisor Starter Prompts (Section 18)
  const advisorPrompts = [
    'What careers fit my mathematics skills?',
    "I don't have a university degree. What can I do?",
    'I want to switch from accounting to technology.',
    'What skills should I learn for cybersecurity?',
    'What opportunities are available in West Africa?',
    'What can I study to work in renewable energy?',
  ];

  const handleOpenCountry = (country: CountryConfig) => {
    setSelectedCountry(country);
    setIsCountryModalOpen(true);
  };

  const handleAdvisorClick = (promptText: string) => {
    if (onOpenMentorWithQuery) {
      onOpenMentorWithQuery(promptText);
    } else {
      onStartAssessment();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* SECTION 8: HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden border-b border-slate-800/80">
        {/* Subtle Ambient Background Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline, Brand & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-emerald-400 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{t('home:hero.badge', { defaultValue: 'AfriPath AI • Pan-African Career Intelligence Platform' })}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                {t('home:hero.title', { defaultValue: 'Your future starts with a path.' })}
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
                {t('home:hero.subtitle', {
                  defaultValue:
                    'AfriPath AI helps you discover careers that match your interests and skills, understand what you need to learn, and find opportunities across Africa.',
                })}
              </p>

              {/* Primary Action Buttons Group */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => (onOpenAuth ? onOpenAuth('signup') : onStartAssessment())}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-950/50 flex items-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t('home:hero.ctaStart', { defaultValue: 'Discover My Career' })}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('career-discovery-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>{t('home:hero.ctaExplore', { defaultValue: 'Explore Careers' })}</span>
                </button>

                <button
                  onClick={onExploreJobs}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition flex items-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>{t('home:hero.ctaJobs', { defaultValue: 'Explore Opportunities' })}</span>
                </button>

                <button
                  onClick={onLoadDemoUser}
                  className="px-4 py-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-amber-300 border border-amber-500/20 font-semibold text-xs transition flex items-center gap-1.5"
                  title="Explore with Musa Jallow (UTG IT Graduate) demo profile"
                >
                  <Target className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('home:hero.demoButton', { defaultValue: 'Demo Profile' })}</span>
                </button>
              </div>

              {/* Trust & Reach Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified African Data</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No Degree Required Paths</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free for Students</span>
                </span>
              </div>
            </div>

            {/* Right Column: Signature Career Connection Visual (People -> Skills -> Careers -> Learning -> Opportunities) */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
                {/* Header of Visual */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      AfriPath Intelligence Loop
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-400">Live Connected</span>
                </div>

                {/* 5-Node Connected Progression Visual */}
                <div className="space-y-3">
                  {/* Node 1: Person */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                      01
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">Person & Ambition</div>
                      <div className="text-[11px] text-slate-400">Background, curiosity, education & interests</div>
                    </div>
                    <span className="text-xs text-emerald-400 font-semibold">Start</span>
                  </div>

                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/50"></div>
                  </div>

                  {/* Node 2: Skills */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                      02
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">Skills Intelligence</div>
                      <div className="text-[11px] text-slate-400">Excel, Mathematics, Problem Solving, Logic</div>
                    </div>
                    <span className="text-xs text-blue-400 font-semibold">Mapped</span>
                  </div>

                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/50"></div>
                  </div>

                  {/* Node 3: Career Match */}
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0">
                      03
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">Target Career Pathway</div>
                      <div className="text-[11px] text-emerald-300 font-medium">Data Analyst & Business Intelligence</div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      88% Match
                    </span>
                  </div>

                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/50"></div>
                  </div>

                  {/* Node 4: Learning Roadmap */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                      04
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">Guided Learning & Gaps</div>
                      <div className="text-[11px] text-slate-400">SQL, Python, 3 Production Portfolio Projects</div>
                    </div>
                    <span className="text-xs text-amber-400 font-semibold">90 Days</span>
                  </div>

                  <div className="flex justify-center -my-1">
                    <div className="w-0.5 h-3 bg-emerald-500/50"></div>
                  </div>

                  {/* Node 5: Real Opportunities */}
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-xs shrink-0">
                      05
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-white">Pan-African Opportunities</div>
                      <div className="text-[11px] text-slate-400">Banjul, Lagos, Nairobi, Kigali & Remote</div>
                    </div>
                    <span className="text-xs text-purple-400 font-semibold">Launch 🚀</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: PAN-AFRICAN REACH & REGIONAL NODES */}
      <section className="py-8 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Connected Innovation Hubs & Talent Corridors
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Connecting talent across regional ecosystems and remote global markets.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold">
              {[
                { city: 'Banjul 🇬🇲', note: 'Initial Launch Hub' },
                { city: 'Dakar 🇸🇳', note: 'FinTech Corridor' },
                { city: 'Accra 🇬🇭', note: 'Tech & Green Hub' },
                { city: 'Lagos 🇳🇬', note: 'Startup Ecosystem' },
                { city: 'Nairobi 🇰🇪', note: 'Silicon Savannah' },
                { city: 'Kigali 🇷🇼', note: 'Innovation City' },
                { city: 'Cape Town 🇿🇦', note: 'Cloud & Tech' },
                { city: 'Cairo 🇪🇬', note: 'Engineering Center' },
              ].map((hub) => (
                <div
                  key={hub.city}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5 shadow-sm"
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{hub.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 40: HOW IT WORKS (4 STEPS) */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3">
              <span>The AfriPath Methodology</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How AfriPath Works
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Four clear steps designed to help anyone in Africa navigate modern career opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-white mb-2">Discover</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Tell us about your interests, current skills, education level, or career aspirations. No resume required to begin.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Personalized profile setup</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-white mb-2">Match</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Explore careers tailored to you with match percentages, verified local and remote salary ranges, and growth trends.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>AI match intelligence</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-white mb-2">Build</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Identify specific skill gaps and follow an interactive 90-day roadmap with free, verified African and global learning resources.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Structured milestone roadmap</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-white mb-2">Launch</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Generate ATS-tailored CVs, prepare for interviews with the AI Coach, and apply directly to verified openings across Africa.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Direct opportunity connection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: CAREER DISCOVERY SECTION (12 SECTORS) */}
      <section id="career-discovery-section" className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
                <span>Comprehensive African Career Taxonomy</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Find careers that fit your path.
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Explore emerging and essential careers across 12 high-demand sectors in Africa — from digital technology to renewable energy and skilled TVET trades.
              </p>
            </div>

            <button
              onClick={() => onStartAssessment()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto shadow-sm"
            >
              <span>Take Assessment for My Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {careerCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => onStartAssessment()}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {cat.count}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition">
                    <span>Explore sector pathways</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 11 & 12: PERSONALIZED CAREER MATCH & SIGNATURE PATHWAY PREVIEW */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <span>Personalized Match Sample</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Your Career Match Preview
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              See how AfriPath AI connects personal strengths, missing skills, and real compensation in the African job market.
            </p>
          </div>

          {/* Sample Match Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            {/* Top Match Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1.5">
                  <span>Top Recommendation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Data Analyst & Business Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Sector: Technology & Business Intelligence • Available in The Gambia, Nigeria, Kenya & Remote
                </p>
              </div>

              {/* Match Score Meter */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400">Overall Match</div>
                  <div className="text-xs text-emerald-400 font-medium">Very High Alignment</div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  88%
                </div>
              </div>
            </div>

            {/* Why It Fits & Skills to Develop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Why It Fits */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Why This Career Fits You</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Strong background in analytical thinking & mathematics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>High interest in solving business & community challenges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Comfortable with spreadsheet formulas and data structuring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Rapidly growing demand across African telcos, banks & NGOs</span>
                  </li>
                </ul>
              </div>

              {/* Skills to Develop */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  <span>Skills to Develop (90-Day Focus)</span>
                </div>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">Relational SQL & Queries</span>
                      <span className="text-amber-400 font-bold">Needs Mastery</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">PowerBI / Tableau Dashboards</span>
                      <span className="text-amber-400 font-bold">Needs Mastery</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">Python for Data Analysis</span>
                      <span className="text-amber-400 font-bold">Needs Practice</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 12: Signature Career Pathway Visual */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Signature Career Pathway Progression
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Where you are</div>
                  <div className="font-bold text-white mt-1">Student / Switcher</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">What you have</div>
                  <div className="font-bold text-emerald-400 mt-1">Math & Excel</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">What you need</div>
                  <div className="font-bold text-amber-400 mt-1">SQL + PowerBI</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Build</div>
                  <div className="font-bold text-blue-400 mt-1">3 Projects</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Experience</div>
                  <div className="font-bold text-purple-400 mt-1">Internship / Freelance</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50">
                  <div className="text-[10px] text-emerald-300 uppercase font-bold">Target Career</div>
                  <div className="font-bold text-emerald-300 mt-1">Data Analyst 🚀</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400 text-center sm:text-left">
                Salary Benchmark: <strong className="text-slate-200">GMD 35,000 - 65,000/mo</strong> • Remote: <strong className="text-slate-200">$800 - $2,200/mo</strong>
              </div>

              <button
                onClick={() => onStartAssessment()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Explore This Path & Roadmaps</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 13: SKILLS INTELLIGENCE SECTION */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <span>Skills Intelligence Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Turn your skills into opportunities.
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              AfriPath AI analyzes your existing competencies, flags exact gaps, and recommends high-quality free learning resources.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Interactive Skills Selector */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Your Skill Profile
              </div>

              <div className="space-y-2">
                {[
                  { id: 'data', label: 'Data & Analytics', skills: 'Excel, Math, Problem Solving' },
                  { id: 'solar', label: 'Solar & Renewable Tech', skills: 'Wiring, Electrical, Safety' },
                  { id: 'health', label: 'Healthcare & Public Health', skills: 'Biology, Patient Care, First Aid' },
                  { id: 'finance', label: 'Accounting & Finance', skills: 'Bookkeeping, Tax, Compliance' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSkillSet(s.id as any)}
                    className={`w-full p-3.5 rounded-2xl text-left transition border ${
                      activeSkillSet === s.id
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{s.skills}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Career Matches for Selected Skillset */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                2. Instant Career Matches
              </div>

              <div className="space-y-3">
                {activeSkillSet === 'data' && (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Data Analyst</span>
                        <span className="text-xs font-extrabold text-emerald-400">88%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">High demand in Telcos & Banking</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Business Intelligence</span>
                        <span className="text-xs font-extrabold text-emerald-400">82%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Operations & KPI Reporting</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Fintech Product Analyst</span>
                        <span className="text-xs font-extrabold text-emerald-400">79%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Payment switch & USSD gateways</p>
                    </div>
                  </>
                )}

                {activeSkillSet === 'solar' && (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Solar PV Technician</span>
                        <span className="text-xs font-extrabold text-emerald-400">92%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">High demand for off-grid installations</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Inverter & Battery Specialist</span>
                        <span className="text-xs font-extrabold text-emerald-400">85%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Commercial & domestic backup systems</p>
                    </div>
                  </>
                )}

                {activeSkillSet === 'health' && (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Public Health Officer</span>
                        <span className="text-xs font-extrabold text-emerald-400">90%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">NGO & Ministry health surveillance</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Clinical Research Nurse</span>
                        <span className="text-xs font-extrabold text-emerald-400">86%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">MRCG & international medical trials</p>
                    </div>
                  </>
                )}

                {activeSkillSet === 'finance' && (
                  <>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Tax & Audit Specialist</span>
                        <span className="text-xs font-extrabold text-emerald-400">91%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">GRA & corporate statutory reporting</p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-white">Fintech Compliance Officer</span>
                        <span className="text-xs font-extrabold text-emerald-400">84%</span>
                      </div>
                      <p className="text-[11px] text-slate-400">AML & Central Bank regulations</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Column 3: Learning Recommendations */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                3. Learning Recommendations
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">ALX Africa & FreeCodeCamp</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Free, structured, certified courses tailored for African job seekers.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">ITC / YEP Academy</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Vocational & technical apprenticeships with local employer links.
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-xs font-bold text-white">Google Cloud & Coursera</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Global industry certifications in data, cloud, and digital tools.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 14: OPPORTUNITIES ACROSS AFRICA */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
                <span>Verified African Opportunities</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Opportunities across Africa.
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Browse verified full-time roles, internships, apprenticeships, and scholarships across West, East, Southern, and North Africa.
              </p>
            </div>

            <button
              onClick={onExploreJobs}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 self-start md:self-auto"
            >
              <span>Explore All Opportunities on Map</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAN_AFRICAN_OPPORTUNITIES.slice(0, 6).map((job) => (
              <div
                key={job.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {job.type} • {job.workplaceType || 'Hybrid'}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">{job.salaryOrStipend}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                    <span className="text-slate-600">•</span>
                    <span className="truncate">{job.location}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{job.category}</span>
                  <button
                    onClick={onExploreJobs}
                    className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 15: COUNTRY EXPLORER SECTION */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2">
              <span>Country & Regional Landscapes</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Careers by Country
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Select any African nation to explore education credentials, top growth sectors, key universities, and local compensation dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AFRICAN_COUNTRIES.map((country) => (
              <div
                key={country.code}
                onClick={() => handleOpenCountry(country)}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{country.flag}</span>
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {country.currencyCode}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    {country.name}
                  </h3>
                  <div className="text-xs text-slate-400">{country.region}</div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {country.majorIndustries.slice(0, 3).join(', ')}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 transition">
                  <span>Explore {country.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 18: MEET YOUR AI CAREER ADVISOR */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold flex items-center justify-center text-lg mx-auto shadow-md">
              AI
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Meet Your AI Career Advisor
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
                Ask questions. Explore possibilities. Build your path.
              </p>
              <p className="mt-1 text-xs text-slate-400 max-w-xl mx-auto">
                Get grounded answers about salaries in Banjul, TVET pathways, career switching, portfolio construction, or remote opportunities.
              </p>
            </div>

            {/* Clickable Starter Queries */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {advisorPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleAdvisorClick(prompt)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition text-left flex items-center gap-1.5 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>"{prompt}"</span>
                </button>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onStartAssessment()}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Free Career Discovery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 41: GLOBAL FOOTER */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <AfriPathLogo size="md" showTagline={true} />

            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
              <button onClick={() => onStartAssessment()} className="hover:text-white transition">
                Career Assessment
              </button>
              <span>•</span>
              <button onClick={onExploreJobs} className="hover:text-white transition">
                Pan-African Opportunities
              </button>
              <span>•</span>
              <button onClick={onLoadDemoUser} className="hover:text-white transition">
                Demo Profile
              </button>
              <span>•</span>
              <button onClick={() => onOpenAuth?.('login')} className="hover:text-white transition">
                Sign In
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
            <div>
              © 2026 AfriPath AI • Empowering African Talent Across 54 Nations
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Launch Hubs:</span>
              <span className="text-slate-400">🇬🇲 The Gambia</span>
              <span>•</span>
              <span className="text-slate-400">🇸🇳 Senegal</span>
              <span>•</span>
              <span className="text-slate-400">🇬🇭 Ghana</span>
              <span>•</span>
              <span className="text-slate-400">🇳🇬 Nigeria</span>
              <span>•</span>
              <span className="text-slate-400">🇰🇪 Kenya</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Country Detail Modal */}
      <CountryDetailModal
        country={selectedCountry}
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        onSelectCountryForJobs={() => {
          setIsCountryModalOpen(false);
          onExploreJobs();
        }}
      />
    </div>
  );
};
