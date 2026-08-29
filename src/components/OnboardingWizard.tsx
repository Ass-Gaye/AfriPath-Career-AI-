import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  User,
  GraduationCap,
  Wrench,
  Compass,
  Check,
  FileText,
  Loader2,
  Plus,
  X,
  Target,
  FileCheck,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Globe2,
  Briefcase,
  Layers,
} from 'lucide-react';
import {
  UserProfile,
  EducationLevel,
  CVData,
  CareerPathwayType,
  CareerGoalType,
  CareerMaturityStage,
  CareerSector,
} from '../types/career';
import {
  GAMBIAN_INSTITUTIONS,
  GAMBIAN_LOCATIONS,
  COMMON_TECHNICAL_SKILLS,
  COMMON_SOFT_SKILLS,
} from '../data/gambiaData';
import { AFRICAN_COUNTRIES, getCountryByName } from '../data/countriesData';
import {
  CAREER_SECTORS,
  FIELDS_OF_STUDY_CONFIG,
  CAREER_PATHWAYS_LIST,
  getDisciplinesForField,
  getPersonalizedSkillSuggestions,
  getEvidenceBasedCompetencies,
} from '../data/careerTaxonomy';
import { parseCVFile, fetchGeneratedCV, AuthUser } from '../services/api';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile, generatedCV?: CVData | null, targetTab?: string) => void;
  onLoadDemo: () => void;
  authUser?: AuthUser | null;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onLoadDemo,
  authUser,
}) => {
  const [step, setStep] = useState<number>(1);
  const [isParsingCV, setIsParsingCV] = useState<boolean>(false);
  // Custom Skill live input states
  const [customTechInput, setCustomTechInput] = useState<string>('');
  const [customSoftInput, setCustomSoftInput] = useState<string>('');

  const addSkillDirectly = (skillName: string, type: 'tech' | 'soft') => {
    const trimmed = skillName.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    if (type === 'tech') {
      setFormData((prev) => {
        if (prev.currentSkills.includes(trimmed)) return prev;
        return {
          ...prev,
          currentSkills: [...prev.currentSkills, trimmed],
        };
      });
      setCustomTechInput('');
    } else {
      setFormData((prev) => {
        if (prev.softSkills.includes(trimmed)) return prev;
        return {
          ...prev,
          softSkills: [...prev.softSkills, trimmed],
        };
      });
      setCustomSoftInput('');
    }
  };

  const handleTechInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillDirectly(customTechInput, 'tech');
    }
  };

  const handleSoftInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkillDirectly(customSoftInput, 'soft');
    }
  };

  const removeCustomSkill = (skillToRemove: string, type: 'tech' | 'soft') => {
    if (type === 'tech') {
      setFormData((prev) => ({
        ...prev,
        currentSkills: prev.currentSkills.filter((s) => s !== skillToRemove),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        softSkills: prev.softSkills.filter((s) => s !== skillToRemove),
      }));
    }
  };
  const [cvFileName, setCvFileName] = useState<string>('');

  // CV Setup Choice: 'upload' or 'ai-builder'
  const [cvChoice, setCvChoice] = useState<'upload' | 'ai-builder'>('ai-builder');
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const [isGeneratingCV, setIsGeneratingCV] = useState<boolean>(false);
  const [openCVBuilderAfter, setOpenCVBuilderAfter] = useState<boolean>(false);

  const [formData, setFormData] = useState<UserProfile>({
    id: authUser?.id || `user-${Date.now()}`,
    name: authUser?.fullName || '',
    age: 22,
    country: 'The Gambia',
    countryCode: 'GM',
    location: 'Kanifing / KMC, The Gambia',
    targetLocations: ['The Gambia', 'Remote (Global/Pan-African)'],
    educationLevel: 'Bachelor’s Degree',
    institution: 'University of The Gambia (UTG)',
    fieldOfStudy: '',
    graduationYear: '2025',
    currentSkills: [],
    softSkills: [],
    interests: [],
    careerGoal: '',
    careerGoalType: 'Employment',
    maturityStage: 'Student',
    preferredPathway: 'University / Degree',
    targetIndustries: [],
    experienceYears: 'Less than 1 year',
    preferredWorkType: 'Flexible',
    constraints: {
      budgetLevel: 'Low / Free Only',
      timeAvailableWeeklyHours: 20,
      deviceAccess: 'Laptop / Desktop',
      internetReliability: 'Moderate / 4G',
    },
  });

  const selectedCountryConfig = getCountryByName(formData.country || 'The Gambia');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleTechnicalSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.currentSkills.includes(skill);
      return {
        ...prev,
        currentSkills: exists
          ? prev.currentSkills.filter((s) => s !== skill)
          : [...prev.currentSkills, skill],
      };
    });
  };

  const toggleSoftSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.softSkills.includes(skill);
      return {
        ...prev,
        softSkills: exists
          ? prev.softSkills.filter((s) => s !== skill)
          : [...prev.softSkills, skill],
      };
    });
  };

  const handleCountryChange = (countryName: string) => {
    const matched = getCountryByName(countryName);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        country: matched.name,
        countryCode: matched.code,
        location: matched.name === 'The Gambia' ? 'Kanifing / KMC, The Gambia' : `${matched.name}`,
        institution: matched.universitiesAndInstitutes[0] || prev.institution,
        targetLocations: [matched.name, 'Remote (Global/Pan-African)'],
      }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCvFileName(file.name);
    setIsParsingCV(true);

    try {
      const text = await file.text();
      const extracted = await parseCVFile(text);

      setFormData((prev) => ({
        ...prev,
        name: extracted.name || prev.name || file.name.replace(/\.[^/.]+$/, ''),
        institution: extracted.institution || prev.institution,
        fieldOfStudy: extracted.fieldOfStudy || prev.fieldOfStudy,
        educationLevel: (extracted.educationLevel as EducationLevel) || prev.educationLevel,
        currentSkills: Array.from(new Set([...prev.currentSkills, ...(extracted.currentSkills || [])])),
        softSkills: Array.from(new Set([...prev.softSkills, ...(extracted.softSkills || [])])),
        careerGoal: extracted.careerGoal || prev.careerGoal,
        targetIndustries: extracted.targetIndustries || prev.targetIndustries,
      }));
    } catch (err) {
      console.error('File parsing failed:', err);
    } finally {
      setIsParsingCV(false);
    }
  };

  const handleGenerateInstantCV = async () => {
    setIsGeneratingCV(true);
    try {
      const targetRole = formData.careerGoal || `${formData.fieldOfStudy || 'Career'} Specialist`;
      const cv = await fetchGeneratedCV(formData, targetRole);
      setGeneratedCV(cv);
    } catch (err) {
      console.error('Error generating preview CV:', err);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.age) newErrors.age = 'Age is required';
    } else if (currentStep === 2) {
      if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study or specialty is required';
    } else if (currentStep === 3) {
      if (formData.currentSkills.length === 0) {
        newErrors.skills = 'Select or type at least 1 skill';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        let finalCV = generatedCV;
        if (cvChoice === 'ai-builder' && !finalCV) {
          try {
            finalCV = await fetchGeneratedCV(
              formData,
              formData.careerGoal || 'Software Developer'
            );
          } catch (err) {
            console.warn('Fallback generating CV on submit:', err);
          }
        }
        onComplete(
          formData,
          finalCV,
          openCVBuilderAfter ? 'cv-builder' : 'dashboard'
        );
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header & Demo shortcut */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Step {step} of 4
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
            Build Your Career Profile
          </h1>
        </div>

        <button
          onClick={onLoadDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition self-start sm:self-auto"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Quick Demo (Musa Jallow)</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-emerald-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${(step / 4) * 100}%` }}
        ></div>
      </div>

      {/* Step Container Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        {/* STEP 1: Personal Info & Country Selection */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Personal Information & Region</h2>
                  <p className="text-xs text-slate-400">Localize career matching and market insights across Africa.</p>
                </div>
              </div>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Primary Country of Residence / Focus</span>
              </label>
              <select
                value={formData.country || 'The Gambia'}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {AFRICAN_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name} ({c.region} Africa • {c.currencyCode})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Musa Jallow"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Age <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  placeholder="23"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 22 })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.age && <p className="text-xs text-rose-400 mt-1">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  list="city-suggestions"
                  placeholder="e.g. Kanifing, Dakar, Lagos, Accra..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <datalist id="city-suggestions">
                  {GAMBIAN_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Education Level
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Bachelor’s Degree">Bachelor’s Degree (University)</option>
                  <option value="Diploma / TVET Certificate">Diploma / TVET / Technical Certificate</option>
                  <option value="High School / WASSCE">High School / Secondary / WASSCE</option>
                  <option value="Master’s Degree">Master’s / Postgraduate Degree</option>
                  <option value="Self-Taught / Bootcamps">Self-Taught / Apprenticeship / Bootcamps</option>
                </select>
              </div>
            </div>

            {/* Career Stage & Goal Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Career Stage
                </label>
                <select
                  value={formData.maturityStage || 'Student'}
                  onChange={(e) =>
                    setFormData({ ...formData, maturityStage: e.target.value as CareerMaturityStage })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Student">Current Student / Undergraduate</option>
                  <option value="JobSeeker">Job Seeker / Fresh Graduate</option>
                  <option value="CareerSwitcher">Career Switcher / Pivoting</option>
                  <option value="Upskilling">Mid-Career Upskilling</option>
                  <option value="Entrepreneur">Aspiring Founder / Business Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Goal
                </label>
                <select
                  value={formData.careerGoalType || 'Employment'}
                  onChange={(e) =>
                    setFormData({ ...formData, careerGoalType: e.target.value as CareerGoalType })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Employment">Formal Employment / Corporate</option>
                  <option value="Freelance">Remote Freelance & Contracts</option>
                  <option value="Entrepreneurship">Starting a Business / Enterprise</option>
                  <option value="Further Studies / Research">Postgraduate / Academic Research</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Education, Institutions & Sectors */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">Education & Sector Focus</h2>
                <p className="text-xs text-slate-400">Specify your training, institution, and career sector interests.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institution or Training Center Name
              </label>
              <input
                type="text"
                list="inst-suggestions"
                placeholder="e.g. University of The Gambia (UTG), GTTI, MDI, ALX Africa..."
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <datalist id="inst-suggestions">
                {selectedCountryConfig?.universitiesAndInstitutes.map((inst) => (
                  <option key={inst} value={inst} />
                ))}
                {GAMBIAN_INSTITUTIONS.map((inst) => (
                  <option key={inst} value={inst} />
                ))}
              </datalist>
            </div>

            {/* Field of Study & Discipline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field of Study <span className="text-rose-400">*</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    list="field-of-study-suggestions"
                    placeholder="e.g. Computer Science, Nursing, Accounting..."
                    value={formData.fieldOfStudy}
                    onChange={(e) => {
                      const newField = e.target.value;
                      const discList = getDisciplinesForField(newField);
                      setFormData((prev) => ({
                        ...prev,
                        fieldOfStudy: newField,
                        discipline: discList.length > 0 ? discList[0] : prev.discipline,
                      }));
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <datalist id="field-of-study-suggestions">
                    {FIELDS_OF_STUDY_CONFIG.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name} ({f.category})
                      </option>
                    ))}
                  </datalist>
                </div>
                {errors.fieldOfStudy && (
                  <p className="text-xs text-rose-400 mt-1">{errors.fieldOfStudy}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Discipline / Specialization
                </label>
                {getDisciplinesForField(formData.fieldOfStudy).length > 0 ? (
                  <select
                    value={formData.discipline || ''}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select Specialization...</option>
                    {getDisciplinesForField(formData.fieldOfStudy).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="e.g. Web Development, Audit, Clinical Care..."
                    value={formData.discipline || ''}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Pathway
                </label>
                <select
                  value={formData.preferredPathway || 'Technology'}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredPathway: e.target.value as CareerPathwayType })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CAREER_PATHWAYS_LIST.map((pw) => (
                    <option key={pw.id} value={pw.name}>
                      {pw.icon} {pw.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Career Ambition / Target Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full-Stack Developer, Clinical Nurse, Chartered Accountant..."
                  value={formData.careerGoal || ''}
                  onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Target Career Sectors */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target Career Sectors & Interests</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAREER_SECTORS.map((sector) => {
                  const isSelected = (formData.targetIndustries || []).includes(sector.name);
                  return (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const current = prev.targetIndustries || [];
                          const updated = current.includes(sector.name)
                            ? current.filter((s) => s !== sector.name)
                            : [...current, sector.name];
                          return { ...prev, targetIndustries: updated };
                        });
                      }}
                      className={`p-2.5 rounded-xl text-left transition border text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">{sector.icon}</span>
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className="font-semibold text-[11px] leading-tight text-slate-200">
                        {sector.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills (Live Typing + Preset Chips) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Wrench className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">Your Current Skills</h2>
                <p className="text-xs text-slate-400">Type any skills live or tap presets to add them instantly.</p>
              </div>
            </div>

            {/* LIVE TYPE-TO-ADD TECHNICAL SKILL INPUT */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Technical, Domain & Professional Skills <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">
                  {formData.currentSkills.length} added
                </span>
              </div>

              {/* LIVE INPUT FIELD */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type ANY skill (e.g. Python, Financial Analysis, Agronomy, Patient Triage, Solar Sizing)..."
                    value={customTechInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        const parts = val.split(',');
                        parts.forEach((p) => addSkillDirectly(p, 'tech'));
                      } else {
                        setCustomTechInput(val);
                      }
                    }}
                    onKeyDown={handleTechInputKeyDown}
                    onBlur={() => {
                      if (customTechInput.trim()) {
                        addSkillDirectly(customTechInput, 'tech');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                  {customTechInput.trim() && (
                    <span className="absolute right-2.5 top-2.5 text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 animate-pulse font-medium">
                      Press Enter to add live
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addSkillDirectly(customTechInput, 'tech')}
                  disabled={!customTechInput.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Selected Skills Chips */}
              {formData.currentSkills.length > 0 ? (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                    <span>Your Active Skills ({formData.currentSkills.length}):</span>
                    <span className="text-slate-500">Tap ✕ to remove</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.currentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-medium shadow-sm animate-in fade-in"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomSkill(skill, 'tech')}
                          className="text-emerald-400 hover:text-white transition p-0.5 hover:bg-emerald-800/40 rounded"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 mb-3 text-center text-xs text-slate-500">
                  Type any skill above or click quick presets below to populate your skillset live.
                </div>
              )}

              {/* Personalized Skill Suggestions for User's Field & Discipline */}
              {(() => {
                const personalized = getPersonalizedSkillSuggestions(
                  formData.fieldOfStudy,
                  formData.discipline,
                  formData.preferredPathway,
                  formData.currentSkills
                );
                const displayField = formData.discipline || formData.fieldOfStudy || 'Your Field';

                return (
                  <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended for {displayField} ({formData.preferredPathway || 'Pathway'}):</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Tap to add</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {personalized.map((skill) => {
                        const selected = formData.currentSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleTechnicalSkill(skill)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                              selected
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-900 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60'
                            }`}
                          >
                            {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              {errors.skills && <p className="text-xs text-rose-400 mt-1">{errors.skills}</p>}
            </div>

            {/* Soft Skills Section */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Soft Strengths & Competencies
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.softSkills.length} added
                </span>
              </div>

              {/* Live Soft Skill Input */}
              <div className="flex gap-2 mb-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type soft skill (e.g. Critical Thinking, Stakeholder Management, Public Speaking)..."
                    value={customSoftInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        const parts = val.split(',');
                        parts.forEach((p) => addSkillDirectly(p, 'soft'));
                      } else {
                        setCustomSoftInput(val);
                      }
                    }}
                    onKeyDown={handleSoftInputKeyDown}
                    onBlur={() => {
                      if (customSoftInput.trim()) {
                        addSkillDirectly(customSoftInput, 'soft');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addSkillDirectly(customSoftInput, 'soft')}
                  disabled={!customSoftInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Active Soft Skills Chips */}
              {formData.softSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {formData.softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-medium"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeCustomSkill(skill, 'soft')}
                        className="text-blue-400 hover:text-white transition p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Field-tailored Evidence Competencies & Soft Skills */}
              {(() => {
                const evidence = getEvidenceBasedCompetencies(
                  formData.fieldOfStudy,
                  formData.discipline,
                  formData.preferredPathway
                );
                const softOptions = Array.from(new Set([...evidence.map((e) => e.name), ...COMMON_SOFT_SKILLS]));

                return (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-blue-300">
                      Recommended Competencies for {formData.fieldOfStudy || 'Your Field'}:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {softOptions.map((skill) => {
                        const selected = formData.softSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSoftSkill(skill)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                              selected
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-slate-900 text-blue-300 border border-blue-500/30 hover:border-blue-400'
                            }`}
                          >
                            {selected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 opacity-60" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* STEP 4: CV Setup & Career Aspirations */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Compass className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">CV Setup & Career Aspirations</h2>
                <p className="text-xs text-slate-400">
                  Upload an existing CV or let our AI CV Builder generate an authentic one for you.
                </p>
              </div>
            </div>

            {/* Target Goal Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Specific Career Ambition / Target Title
              </label>
              <input
                type="text"
                placeholder="e.g. AI Engineer, Solar Microgrid Technician, Fintech Product Analyst, Clinical Nurse..."
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* DUAL CV OPTION CHOOSER */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Choose How to Set Up Your CV:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A: Upload Existing CV */}
                <button
                  type="button"
                  onClick={() => setCvChoice('upload')}
                  className={`p-4 rounded-xl text-left transition border ${
                    cvChoice === 'upload'
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300">
                      <Upload className="w-4 h-4 text-emerald-400" />
                    </div>
                    {cvChoice === 'upload' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-white">I have a CV already</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Upload your PDF, DOCX, or TXT file. AI extracts your skills automatically.
                  </p>
                </button>

                {/* Option B: AI CV Builder */}
                <button
                  type="button"
                  onClick={() => setCvChoice('ai-builder')}
                  className={`p-4 rounded-xl text-left transition border ${
                    cvChoice === 'ai-builder'
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    {cvChoice === 'ai-builder' && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-white">Generate CV with AI</h3>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Don't have a CV? AI generates an authentic, ATS-optimized verified CV with 0 hallucinations.
                  </p>
                </button>
              </div>
            </div>

            {/* CONDITIONAL PANEL: Option A Upload Box */}
            {cvChoice === 'upload' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-dashed border-slate-700 text-center space-y-2">
                <Upload className="w-6 h-6 text-emerald-400 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-white">Upload Your Existing CV / Resume</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supported formats: PDF, DOCX, TXT. AI extracts details to enrich your profile.
                  </p>
                </div>

                <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer transition">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Browse & Upload File</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {cvFileName && (
                  <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-medium">{cvFileName}</span>
                    <button
                      type="button"
                      onClick={() => setCvFileName('')}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {isParsingCV && (
                  <div className="pt-2 flex items-center justify-center gap-2 text-xs text-amber-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Parsing credentials with AI...</span>
                  </div>
                )}
              </div>
            )}

            {/* CONDITIONAL PANEL: Option B AI CV Builder Generation */}
            {cvChoice === 'ai-builder' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI CV Builder Auto-Synthesis</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Creates a verified CV using your {formData.institution || 'University'} credentials & {formData.currentSkills.length || 0} skills.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateInstantCV}
                    disabled={isGeneratingCV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition disabled:opacity-50 self-start sm:self-auto shrink-0 shadow-sm"
                  >
                    <Eye className={`w-3.5 h-3.5 ${isGeneratingCV ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingCV ? 'Synthesizing...' : generatedCV ? 'Re-Synthesize Preview' : 'Generate Instant Preview'}</span>
                  </button>
                </div>

                {/* Live Preview Card if generated */}
                {generatedCV && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-emerald-500/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{generatedCV.personalInfo.fullName}</span>
                        <span className="text-[10px] text-slate-400">• {generatedCV.targetCareer}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>ATS Score {generatedCV.atsAnalysis?.score || 91}%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed">
                      "{generatedCV.personalInfo.summary}"
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {generatedCV.skills.technical.slice(0, 5).map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>{step === 4 ? 'Complete Profile & Get Intelligence' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
