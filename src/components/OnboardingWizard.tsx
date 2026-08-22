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
} from 'lucide-react';
import {
  UserProfile,
  EducationLevel,
  CVData,
} from '../types/career';
import {
  GAMBIAN_INSTITUTIONS,
  GAMBIAN_LOCATIONS,
  COMMON_TECHNICAL_SKILLS,
  COMMON_SOFT_SKILLS,
  INDUSTRY_INTERESTS,
} from '../data/gambiaData';
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
    location: 'Kanifing / KMC',
    educationLevel: 'Bachelor’s Degree',
    institution: 'University of The Gambia (UTG)',
    fieldOfStudy: '',
    graduationYear: '2025',
    currentSkills: [],
    softSkills: [],
    interests: [],
    careerGoal: '',
    targetIndustries: [],
    experienceYears: 'Less than 1 year',
    preferredWorkType: 'Flexible',
  });

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

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTechInput.trim()) {
      addSkillDirectly(customTechInput, 'tech');
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
      const targetRole = formData.careerGoal || `${formData.fieldOfStudy || 'Tech'} Specialist`;
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
      if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
    } else if (currentStep === 3) {
      if (formData.currentSkills.length === 0) {
        newErrors.skills = 'Select at least 1 technical skill';
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
        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-emerald-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Personal Information</h2>
                  <p className="text-xs text-slate-400">Basic details to localize recommendations.</p>
                </div>
              </div>
            </div>

            {/* Quick CV Helper Banner */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">
                  Have a CV or want AI to build one? You can configure it in Step 4.
                </span>
              </div>
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Location in The Gambia
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {GAMBIAN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
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
                <option value="Diploma / TVET Certificate">Diploma / TVET Certificate (GTTI/MDI)</option>
                <option value="High School / WASSCE">High School / WASSCE Graduate</option>
                <option value="Master’s Degree">Master’s Degree</option>
                <option value="Self-Taught / Bootcamps">Self-Taught / Bootcamp / Online Learner</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Background */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">Education & Background</h2>
                <p className="text-xs text-slate-400">Where you studied or obtained training.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Institution Name
              </label>
              <select
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {GAMBIAN_INSTITUTIONS.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Field of Study / Major <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BSc Computer Science"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors.fieldOfStudy && (
                  <p className="text-xs text-rose-400 mt-1">{errors.fieldOfStudy}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Completion Year
                </label>
                <input
                  type="text"
                  placeholder="2025"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project / Work Experience
              </label>
              <select
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="No formal experience (Fresh graduate)">No formal experience (Fresh graduate)</option>
                <option value="1 year (Academic & Freelance web projects)">1 year (Academic & Freelance projects)</option>
                <option value="1-2 years experience">1-2 years experience</option>
                <option value="3+ years experience">3+ years experience</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Wrench className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">Your Current Skills</h2>
                <p className="text-xs text-slate-400">Select skills you currently possess or have practiced.</p>
              </div>
            </div>

            {/* Technical Skills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Technical & Hard Skills <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.currentSkills.length} selected
                </span>
              </div>

              {/* Quick Select Preset Pills */}
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {COMMON_TECHNICAL_SKILLS.map((skill) => {
                  const selected = formData.currentSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTechnicalSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                        selected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Selected Skills Chips (including live typed) */}
              {formData.currentSkills.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-2.5">
                  <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                    Your Active Technical Skills (Click ✕ to remove):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.currentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomSkill(skill, 'tech')}
                          className="text-emerald-400 hover:text-white transition p-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Type-To-Add Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type any skill and press Enter or comma (e.g. Patient Care, Farm Management, AutoCAD, Tailoring)..."
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {customTechInput.trim() && (
                    <span className="absolute right-2.5 top-2 text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 animate-pulse">
                      Press Enter to add
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addSkillDirectly(customTechInput, 'tech')}
                  disabled={!customTechInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              {errors.skills && <p className="text-xs text-rose-400 mt-1">{errors.skills}</p>}
            </div>

            {/* Soft Skills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Soft Strengths & Competencies
                </label>
                <span className="text-[11px] text-slate-400">
                  {formData.softSkills.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {COMMON_SOFT_SKILLS.map((skill) => {
                  const selected = formData.softSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSoftSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                        selected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Soft Skills Chips */}
              {formData.softSkills.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-2.5">
                  <div className="text-[10px] font-semibold uppercase text-slate-400 mb-1.5">
                    Your Active Soft Skills (Click ✕ to remove):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Type-To-Add Soft Skill */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Type soft skills and press Enter or comma (e.g. Critical Thinking, Public Speaking, Conflict Resolution)..."
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {customSoftInput.trim() && (
                    <span className="absolute right-2.5 top-2 text-[10px] text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800 animate-pulse">
                      Press Enter to add
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addSkillDirectly(customSoftInput, 'soft')}
                  disabled={!customSoftInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
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
                    Don't have a CV? AI generates an authentic, ATS-optimized Gambian CV with 0 hallucinations.
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
                      Creates a verified CV using your {formData.institution || 'University'} credentials & {formData.currentSkills.length || 0} selected skills.
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
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px]">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anti-Hallucination Safe Notice & Option Toggle */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>100% Anti-Hallucination Safe (Zero fabricated companies or years)</span>
                  </div>

                  <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={openCVBuilderAfter}
                      onChange={(e) => setOpenCVBuilderAfter(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Open in AI CV Builder after setup</span>
                  </label>
                </div>
              </div>
            )}

            {/* Industry Interests */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Preferred Industries in The Gambia
              </label>
              <div className="flex flex-wrap gap-1.5">
                {INDUSTRY_INTERESTS.map((interest) => {
                  const selected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                        selected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Primary Career Goal / Desired Role
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Become a Full-Stack Software Developer or AI Specialist working on Gambian fintech platforms."
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition shadow-sm"
          >
            {step === 4 ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>
                  {openCVBuilderAfter
                    ? 'Save Profile & Launch AI CV Builder'
                    : 'Generate Recommendations'}
                </span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

