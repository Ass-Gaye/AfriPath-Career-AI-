import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter,
  Plus,
  Layers,
  Award,
  Zap,
  Target,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types/career';
import { CAREER_TAXONOMY } from '../data/careerTaxonomy';

interface SkillItem {
  id: string;
  name: string;
  category: 'Technical' | 'Soft' | 'Tools & Frameworks' | 'Domain & Industry' | 'Vocational & Trades' | 'Languages';
  demandLevel: 'Very High' | 'High' | 'Growing' | 'Foundational';
  description: string;
  typicalProficiency: string;
  relatedCareers: string[];
  recommendedResources: { title: string; provider: string; isFree: boolean }[];
}

export const MASTER_SKILLS_DIRECTORY: SkillItem[] = [
  // Technical
  {
    id: 'sk-python',
    name: 'Python Programming',
    category: 'Technical',
    demandLevel: 'Very High',
    description: 'Data analysis, backend web APIs (FastAPI/Django), automation scripts, and machine learning models.',
    typicalProficiency: 'Intermediate to Advanced',
    relatedCareers: ['Software Developer', 'Data Analyst / BI Specialist', 'Machine Learning Engineer', 'Cybersecurity Analyst'],
    recommendedResources: [
      { title: 'Python for Beginners & Data (ALX / Kaggle)', provider: 'ALX Africa & Kaggle', isFree: true },
      { title: 'Full-Stack Python Pathway', provider: 'freeCodeCamp', isFree: true },
    ],
  },
  {
    id: 'sk-sql',
    name: 'SQL & Relational Databases',
    category: 'Technical',
    demandLevel: 'Very High',
    description: 'Querying, data aggregation, database modeling (PostgreSQL/MySQL), and financial analytics.',
    typicalProficiency: 'Intermediate',
    relatedCareers: ['Data Analyst / BI Specialist', 'Software Developer', 'Fintech Specialist', 'Accountant'],
    recommendedResources: [
      { title: 'SQL Fundamentals for African Tech', provider: 'Mode Analytics & Coursera', isFree: true },
    ],
  },
  {
    id: 'sk-react',
    name: 'React.js & Frontend Web',
    category: 'Technical',
    demandLevel: 'High',
    description: 'Building responsive user interfaces, single-page web applications, and mobile-friendly layouts.',
    typicalProficiency: 'Intermediate',
    relatedCareers: ['Software Developer', 'UI/UX Designer', 'Digital Marketing Specialist'],
    recommendedResources: [
      { title: 'Modern React Architecture', provider: 'freeCodeCamp / Scrimba', isFree: true },
    ],
  },
  {
    id: 'sk-accounting',
    name: 'Financial Accounting & Reporting',
    category: 'Domain & Industry',
    demandLevel: 'High',
    description: 'Ledger management, balance sheets, taxation compliance (GRA, KRA, FIRS, etc.), and auditing.',
    typicalProficiency: 'Proficient',
    relatedCareers: ['Accountant & Financial Auditor', 'Financial Analyst', 'Fintech Specialist'],
    recommendedResources: [
      { title: 'Accounting Principles & IFRS', provider: 'ACCA Global / OpenLearn', isFree: true },
    ],
  },
  {
    id: 'sk-solar-pv',
    name: 'Solar PV System Installation',
    category: 'Vocational & Trades',
    demandLevel: 'Very High',
    description: 'Sizing solar arrays, inverter wiring, battery storage configuration, and microgrid maintenance.',
    typicalProficiency: 'Technical Certification',
    relatedCareers: ['Renewable Energy Technician', 'Electrical Installation & Maintenance Technician'],
    recommendedResources: [
      { title: 'Solar PV Technical Academy', provider: 'GTTI & ITC YEP Academy', isFree: true },
    ],
  },
  {
    id: 'sk-agri-irrigation',
    name: 'Smart Drip Irrigation & Soil Science',
    category: 'Vocational & Trades',
    demandLevel: 'Very High',
    description: 'Water conservation, soil nutrient balancing, greenhouse management, and solar-pumped irrigation.',
    typicalProficiency: 'Practical Application',
    relatedCareers: ['Agribusiness Manager & Agronomist', 'Agricultural Extension Officer'],
    recommendedResources: [
      { title: 'Modern Horticulture & Drip Systems', provider: 'FAO E-Learning Academy', isFree: true },
    ],
  },
  {
    id: 'sk-uiux',
    name: 'UI/UX & User Research',
    category: 'Tools & Frameworks',
    demandLevel: 'High',
    description: 'Wireframing in Figma, accessibility standards, user interview testing, and responsive design systems.',
    typicalProficiency: 'Intermediate',
    relatedCareers: ['UI/UX & Product Designer', 'Software Developer', 'Digital Marketing Specialist'],
    recommendedResources: [
      { title: 'Google UX Design Professional Certificate', provider: 'Coursera & Google', isFree: false },
    ],
  },
  {
    id: 'sk-comm',
    name: 'Stakeholder Communication & Negotiation',
    category: 'Soft',
    demandLevel: 'Very High',
    description: 'Clear written reporting, cross-cultural team collaboration, client presentations, and conflict resolution.',
    typicalProficiency: 'Advanced',
    relatedCareers: ['Project Manager', 'Public Sector & NGO Officer', 'Accountant', 'Software Developer'],
    recommendedResources: [
      { title: 'Effective Workplace Communication', provider: 'LinkedIn Learning / OpenLearn', isFree: true },
    ],
  },
  {
    id: 'sk-french',
    name: 'Professional French (Bilingual Africa)',
    category: 'Languages',
    demandLevel: 'Very High',
    description: 'Cross-border trade, regional ECOWAS/AfCFTA diplomacy, and international development collaboration.',
    typicalProficiency: 'B2 / Fluent',
    relatedCareers: ['Public Sector & NGO Officer', 'Supply Chain & Port Logistics', 'Financial Analyst'],
    recommendedResources: [
      { title: 'Business French for West Africa', provider: 'Alliance Française / TV5Monde', isFree: true },
    ],
  },
  {
    id: 'sk-nursing-triage',
    name: 'Clinical Patient Triage & Vital Monitoring',
    category: 'Domain & Industry',
    demandLevel: 'Very High',
    description: 'Emergency response, sterile procedures, medication administration, and maternal-child health.',
    typicalProficiency: 'Licensed Clinical',
    relatedCareers: ['Registered Nurse & Clinical Officer', 'Public Health Officer'],
    recommendedResources: [
      { title: 'Global Health Clinical Protocols', provider: 'WHO Academy', isFree: true },
    ],
  },
];

interface SkillsExplorerProps {
  userProfile?: UserProfile | null;
  onNavigateToRoadmap?: () => void;
  onOpenAdvisorWithSkill?: (skill: string) => void;
}

export const SkillsExplorer: React.FC<SkillsExplorerProps> = ({
  userProfile,
  onNavigateToRoadmap,
  onOpenAdvisorWithSkill,
}) => {
  const { t } = useTranslation(['skills', 'common']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  // User skills set
  const userOwnedSkills = useMemo<Set<string>>(() => {
    if (!userProfile) return new Set<string>();
    const list = [
      ...(userProfile.currentSkills || []),
      ...(userProfile.softSkills || []),
    ];
    return new Set<string>(list.map((s) => s.toLowerCase()));
  }, [userProfile]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return MASTER_SKILLS_DIRECTORY.filter((skill) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = skill.name.toLowerCase().includes(q);
        const matchDesc = skill.description.toLowerCase().includes(q);
        const matchCareers = skill.relatedCareers.some((c) => c.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCareers) return false;
      }

      if (selectedCategory !== 'all' && skill.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory]);

  const categories = [
    'Technical',
    'Soft',
    'Tools & Frameworks',
    'Domain & Industry',
    'Vocational & Trades',
    'Languages',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Skills Intelligence & Competency Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              African Labor Market Skills Intelligence
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore in-demand proficiencies across technical disciplines, skilled trades, management, and languages. Review verified learning pathways tailored for low-bandwidth environments.
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill (e.g., Python, SQL, Solar PV, Accounting, French)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Skills ({MASTER_SKILLS_DIRECTORY.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const isOwned = userOwnedSkills.has(skill.name.toLowerCase()) ||
              Array.from(userOwnedSkills).some((us: string) => us.includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(us));


            return (
              <div
                key={skill.id}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition shadow-lg group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {skill.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        skill.demandLevel === 'Very High'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {skill.demandLevel} Demand
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition flex items-center gap-2">
                      <span>{skill.name}</span>
                      {isOwned && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          In Your Profile
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{skill.description}</p>
                  </div>

                  {/* Related Careers */}
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Unlocks Careers In
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skill.relatedCareers.map((car, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {car}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAdvisorWithSkill) {
                        onOpenAdvisorWithSkill(
                          `What are the best free and low-bandwidth resources to learn ${skill.name} from Africa?`
                        );
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Get Learning Plan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
