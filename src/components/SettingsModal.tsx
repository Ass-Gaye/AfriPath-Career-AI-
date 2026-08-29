import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Shield,
  AlertTriangle,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  Smartphone,
  Download,
  Wifi,
  HardDrive,
  Check,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../types/career';
import { usePWA } from '../hooks/usePWA';
import { PWAInstallCard } from './PWAInstallCard';
import {
  GAMBIAN_INSTITUTIONS,
  EDUCATION_LEVELS,
  GAMBIAN_LOCATIONS,
  COMMON_TECHNICAL_SKILLS,
  COMMON_SOFT_SKILLS,
  INDUSTRY_INTERESTS,
} from '../data/gambiaData';
import { changeUserPassword, resetCareerProfile, saveUserProfile, AuthUser } from '../services/api';

export type SettingsTab = 'profile' | 'security' | 'danger-zone' | 'application';

interface SettingsModalProps {
  isOpen: boolean;
  initialTab?: SettingsTab;
  onClose: () => void;
  user: AuthUser | null;
  profile: UserProfile | null;
  onProfileUpdated: (updated: UserProfile) => void;
  onResetComplete: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  initialTab = 'profile',
  onClose,
  user,
  profile,
  onProfileUpdated,
  onResetComplete,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const pwa = usePWA();
  const [storageInfo, setStorageInfo] = useState<{ cachedItems: number; quotaEstimate: string }>({
    cachedItems: 0,
    quotaEstimate: 'Calculating...',
  });
  const [isClearingCache, setIsClearingCache] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'application') {
      pwa.getStorageInfo().then(setStorageInfo);
    }
  }, [isOpen, activeTab]);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState<UserProfile>(() => {
    if (profile) {
      return {
        ...profile,
        name: profile.name?.trim() || user?.fullName?.trim() || '',
      };
    }
    return {
      id: user?.id || `usr-${Date.now()}`,
      name: user?.fullName || 'Assan Gaye',
      age: 23,
      location: 'Serekunda / KMC, The Gambia',
      educationLevel: 'Bachelor’s Degree',
      institution: 'University of The Gambia (UTG)',
      fieldOfStudy: 'Computer Science & Information Systems',
      graduationYear: '2025',
      currentSkills: ['HTML & CSS', 'JavaScript', 'React.js', 'Git & GitHub'],
      softSkills: ['Problem Solving', 'Team Collaboration'],
      interests: ['Fintech & Mobile Money', 'Software & Web Development'],
      careerGoal: 'Develop innovative technology products for Gambian businesses and international tech firms.',
      targetIndustries: ['Fintech & Mobile Money', 'Software & Web Development'],
    };
  });

  // Sync profileForm whenever modal opens or current user/profile updates
  useEffect(() => {
    if (profile) {
      const resolvedName = profile.name?.trim() || user?.fullName?.trim() || '';
      setProfileForm({
        ...profile,
        name: resolvedName,
        location: profile.location || 'Serekunda / KMC, The Gambia',
        educationLevel: profile.educationLevel || 'Bachelor’s Degree',
        institution: profile.institution || 'University of The Gambia (UTG)',
        fieldOfStudy: profile.fieldOfStudy || 'Information Systems',
        graduationYear: profile.graduationYear || '2025',
        currentSkills: profile.currentSkills || [],
        softSkills: profile.softSkills || ['Problem Solving', 'Team Collaboration'],
        interests: profile.interests || [],
        careerGoal: profile.careerGoal || 'Develop innovative technology products in The Gambia.',
        targetIndustries: profile.targetIndustries || ['Software & Web Development'],
      });
    } else if (user) {
      setProfileForm((prev) => ({
        ...prev,
        id: user.id || prev.id,
        name: user.fullName || prev.name,
      }));
    }
  }, [isOpen, profile, user]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');

  // Danger Zone Reset Flow (3 Steps)
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPhrase, setConfirmPhrase] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetErrorMsg, setResetErrorMsg] = useState('');

  // Live skill input states for SettingsModal
  const [typedTechSkill, setTypedTechSkill] = useState('');
  const [typedSoftSkill, setTypedSoftSkill] = useState('');

  const addDirectSkillSettings = (skillName: string, type: 'tech' | 'soft') => {
    const trimmed = skillName.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;

    if (type === 'tech') {
      setProfileForm((prev) => {
        if (prev.currentSkills.includes(trimmed)) return prev;
        return {
          ...prev,
          currentSkills: [...prev.currentSkills, trimmed],
        };
      });
      setTypedTechSkill('');
    } else {
      setProfileForm((prev) => {
        if (prev.softSkills.includes(trimmed)) return prev;
        return {
          ...prev,
          softSkills: [...prev.softSkills, trimmed],
        };
      });
      setTypedSoftSkill('');
    }
  };

  const removeSkillSettings = (skillToRemove: string, type: 'tech' | 'soft') => {
    if (type === 'tech') {
      setProfileForm((prev) => ({
        ...prev,
        currentSkills: prev.currentSkills.filter((s) => s !== skillToRemove),
      }));
    } else {
      setProfileForm((prev) => ({
        ...prev,
        softSkills: prev.softSkills.filter((s) => s !== skillToRemove),
      }));
    }
  };

  if (!isOpen) return null;

  // PROFILE SAVE HANDLER
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg('');
    setProfileSuccessMsg('');
    setIsSavingProfile(true);

    try {
      const sanitizedName = profileForm.name?.trim() || user?.fullName?.trim() || 'Assan Gaye';
      const updatedProfile: UserProfile = {
        ...profileForm,
        name: sanitizedName,
      };

      await saveUserProfile(updatedProfile);
      setProfileForm(updatedProfile);
      onProfileUpdated(updatedProfile);
      setProfileSuccessMsg('Profile settings saved successfully. Name synchronized with dashboard.');
      setTimeout(() => setProfileSuccessMsg(''), 3500);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // PASSWORD CHANGE HANDLER
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg('');
    setPassSuccessMsg('');

    if (newPassword.length < 6) {
      setPassErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPassErrorMsg('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changeUserPassword(currentPassword, newPassword, confirmNewPassword);
      setPassSuccessMsg(res.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPassErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  // RESET HANDLER (STEP 3 TRIGGER)
  const handleExecuteReset = async () => {
    setResetErrorMsg('');
    setIsResetting(true);

    try {
      await resetCareerProfile(confirmEmail, confirmPhrase);
      onResetComplete();
      onClose();
    } catch (err: any) {
      setResetErrorMsg(err.message || 'Failed to reset profile.');
      setIsResetting(false);
    }
  };

  const handleToggleSkill = (skill: string, type: 'tech' | 'soft' | 'interest') => {
    if (type === 'tech') {
      setProfileForm((prev) => ({
        ...prev,
        currentSkills: prev.currentSkills.includes(skill)
          ? prev.currentSkills.filter((s) => s !== skill)
          : [...prev.currentSkills, skill],
      }));
    } else if (type === 'soft') {
      setProfileForm((prev) => ({
        ...prev,
        softSkills: prev.softSkills.includes(skill)
          ? prev.softSkills.filter((s) => s !== skill)
          : [...prev.softSkills, skill],
      }));
    } else {
      setProfileForm((prev) => ({
        ...prev,
        targetIndustries: prev.targetIndustries.includes(skill)
          ? prev.targetIndustries.filter((s) => s !== skill)
          : [...prev.targetIndustries, skill],
      }));
    }
  };

  const userInitial = (user?.fullName || profileForm.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
              {userInitial}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                Account & Career Settings
              </h2>
              <p className="text-xs text-slate-400">
                {user?.email || 'Current Account'} • {profileForm.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Management</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'security'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Password</span>
          </button>

          <button
            onClick={() => setActiveTab('application')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'application'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Application & PWA</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('danger-zone');
              setResetStep(1);
              setResetErrorMsg('');
            }}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'danger-zone'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-red-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Danger Zone</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: PROFILE MANAGEMENT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Linked User Account Verification Header */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    {userInitial}
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>{user?.fullName || profileForm.name || 'Account Holder'}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        Authenticated
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      {user?.email || 'Current Account'}
                    </div>
                  </div>
                </div>
                <div className="text-slate-400 text-[11px] sm:text-right">
                  Changes sync across your Dashboard, Roadmap & CV
                </div>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
              {profileErrorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="e.g. Assan Gaye"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Registered Email (Account Login)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={user?.email || 'assgaye83@gmail.com'}
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400 cursor-not-allowed font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 absolute right-3 top-2.5 text-slate-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location in The Gambia</label>
                  <select
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {GAMBIAN_LOCATIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Education Level</label>
                  <select
                    value={profileForm.educationLevel}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, educationLevel: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {EDUCATION_LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gambian Institution</label>
                  <select
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {GAMBIAN_INSTITUTIONS.map((inst) => (
                      <option key={inst} value={inst}>
                        {inst}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Field of Study / Major</label>
                  <input
                    type="text"
                    value={profileForm.fieldOfStudy}
                    onChange={(e) => setProfileForm({ ...profileForm, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Information Systems / Computer Science"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={profileForm.graduationYear}
                    onChange={(e) => setProfileForm({ ...profileForm, graduationYear: e.target.value })}
                    placeholder="e.g. 2025"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Work Type</label>
                  <select
                    value={profileForm.preferredWorkType || 'Hybrid'}
                    onChange={(e) => setProfileForm({ ...profileForm, preferredWorkType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Local (Gambia)">Local (In-Person Gambia)</option>
                    <option value="Hybrid">Hybrid (Gambia & Remote)</option>
                    <option value="Remote (Global)">Remote (International / Global)</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
              </div>

              {/* Skills Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Technical & Hard Skills ({profileForm.currentSkills.length} selected)
                  </label>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
                  {COMMON_TECHNICAL_SKILLS.map((sk) => {
                    const isSelected = profileForm.currentSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk, 'tech')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sk}
                      </button>
                    );
                  })}
                </div>

                {/* Active Technical Skills Chips */}
                {profileForm.currentSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    {profileForm.currentSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px]"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillSettings(sk, 'tech')}
                          className="text-emerald-400 hover:text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Live Type-To-Add Technical Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom skill and press Enter..."
                    value={typedTechSkill}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        val.split(',').forEach((p) => addDirectSkillSettings(p, 'tech'));
                      } else {
                        setTypedTechSkill(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addDirectSkillSettings(typedTechSkill, 'tech');
                      }
                    }}
                    onBlur={() => {
                      if (typedTechSkill.trim()) addDirectSkillSettings(typedTechSkill, 'tech');
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => addDirectSkillSettings(typedTechSkill, 'tech')}
                    disabled={!typedTechSkill.trim()}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Soft Skills Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Soft Skills & Competencies ({profileForm.softSkills.length} selected)
                  </label>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-2">
                  {COMMON_SOFT_SKILLS.map((sk) => {
                    const isSelected = profileForm.softSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk, 'soft')}
                        className={`px-2 py-0.5 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {sk}
                      </button>
                    );
                  })}
                </div>

                {/* Active Soft Skills Chips */}
                {profileForm.softSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    {profileForm.softSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[11px]"
                      >
                        <span>{sk}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillSettings(sk, 'soft')}
                          className="text-blue-400 hover:text-white"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Live Type-To-Add Soft Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type soft skill and press Enter..."
                    value={typedSoftSkill}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes(',')) {
                        val.split(',').forEach((p) => addDirectSkillSettings(p, 'soft'));
                      } else {
                        setTypedSoftSkill(val);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addDirectSkillSettings(typedSoftSkill, 'soft');
                      }
                    }}
                    onBlur={() => {
                      if (typedSoftSkill.trim()) addDirectSkillSettings(typedSoftSkill, 'soft');
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => addDirectSkillSettings(typedSoftSkill, 'soft')}
                    disabled={!typedSoftSkill.trim()}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Target Industries */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Industries ({profileForm.targetIndustries.length} selected)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  {INDUSTRY_INTERESTS.map((ind) => {
                    const isSelected = profileForm.targetIndustries.includes(ind);
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => handleToggleSkill(ind, 'interest')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Career Goal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Career Goal / Desired Role
                </label>
                <textarea
                  rows={2}
                  value={profileForm.careerGoal}
                  onChange={(e) => setProfileForm({ ...profileForm, careerGoal: e.target.value })}
                  placeholder="e.g. Develop innovative technology products for Gambian businesses..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSavingProfile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div>
                <h3 className="text-sm font-bold text-white">Change Account Password</h3>
                <p className="text-xs text-slate-400">Keep your account secure with a strong password.</p>
              </div>

              {passSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{passSuccessMsg}</span>
                </div>
              )}
              {passErrorMsg && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passErrorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isChangingPass ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                <span>Update Password</span>
              </button>
            </form>
          )}

          {/* TAB 3: DANGER ZONE & RESET PROFILE */}
          {activeTab === 'danger-zone' && (
            <div className="space-y-5">
              {resetErrorMsg && (
                <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetErrorMsg}</span>
                </div>
              )}

              {/* STEP 1: WARNING */}
              {resetStep === 1 && (
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 shrink-0">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-red-300">
                        Reset My Career Profile
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Are you sure you want to reset your career profile? This will permanently remove your stored career progress while keeping your account login active.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="font-semibold text-slate-200">This will permanently remove:</p>
                    <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px]">
                      <li>Career analysis & recommendations</li>
                      <li>Skill gap recommendations</li>
                      <li>Learning roadmap & completed milestones</li>
                      <li>Generated CV & custom edits</li>
                      <li>Saved profile preferences</li>
                    </ul>
                    <p className="text-[11px] text-red-400 font-bold pt-1">
                      ⚠️ This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => setResetStep(2)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <span>Continue Reset</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: IDENTITY CONFIRMATION (Email + "RESET MY PROFILE") */}
              {resetStep === 2 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-red-500/30 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span>Step 2: Confirm Your Identity</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      To prevent accidental deletion, verify your email and type the confirmation phrase.
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        1. Enter your account email:
                      </label>
                      <input
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        placeholder={user?.email || 'musa@example.gm'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        2. Type <span className="font-mono text-red-400 font-bold">RESET MY PROFILE</span> in capital letters:
                      </label>
                      <input
                        type="text"
                        value={confirmPhrase}
                        onChange={(e) => setConfirmPhrase(e.target.value)}
                        placeholder="RESET MY PROFILE"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono uppercase focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Match indicators */}
                  <div className="text-[11px] space-y-1 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className={confirmEmail.toLowerCase().trim() === (user?.email || '').toLowerCase() ? 'text-emerald-400' : 'text-slate-500'}>
                        {confirmEmail.toLowerCase().trim() === (user?.email || '').toLowerCase() ? '✓ Email matched' : '○ Email pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={confirmPhrase.trim() === 'RESET MY PROFILE' ? 'text-emerald-400' : 'text-slate-500'}>
                        {confirmPhrase.trim() === 'RESET MY PROFILE' ? '✓ Phrase matched' : '○ "RESET MY PROFILE" phrase pending'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={
                        confirmEmail.toLowerCase().trim() !== (user?.email || '').toLowerCase() ||
                        confirmPhrase.trim() !== 'RESET MY PROFILE'
                      }
                      onClick={() => setResetStep(3)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      <span>Proceed to Final Confirmation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FINAL CONFIRMATION */}
              {resetStep === 3 && (
                <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                    <Trash2 className="w-6 h-6" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">
                      Final Confirmation
                    </h3>
                    <p className="text-xs text-red-200 max-w-md mx-auto leading-relaxed">
                      You are about to permanently delete your career data.
                      Your account login ({user?.email}) will remain active, and you will be redirected to set up a new career journey.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-3">
                    <button
                      type="button"
                      disabled={isResetting}
                      onClick={() => setResetStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={isResetting}
                      onClick={handleExecuteReset}
                      className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Deleting Career Data...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Yes, Reset Everything</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: APPLICATION & PWA */}
          {activeTab === 'application' && (
            <div className="space-y-5 animate-in fade-in duration-200 text-xs">
              <PWAInstallCard />

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Application & Cache Diagnostics</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 text-[11px]">PWA Environment</div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${pwa.isInstalled ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      <span>{pwa.isInstalled ? 'Standalone Installed App' : 'Browser Web App'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 text-[11px]">Network Connectivity</div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Wifi className={`w-3.5 h-3.5 ${pwa.isOnline ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span>{pwa.isOnline ? 'Online (Real-time AI Active)' : 'Offline (Cached Mode)'}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 text-[11px]">Application Version</div>
                    <div className="font-semibold text-white font-mono">v{pwa.version} (Production)</div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-slate-400 text-[11px]">Offline Cache Storage</div>
                    <div className="font-semibold text-white">
                      {storageInfo.cachedItems} cached assets ({storageInfo.quotaEstimate})
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-slate-400 text-[11px]">
                    If you experience outdated career data or layout glitches, purge the local service worker cache.
                  </div>
                  <button
                    type="button"
                    disabled={isClearingCache}
                    onClick={async () => {
                      setIsClearingCache(true);
                      await pwa.clearCacheAndReload();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCcw className={`w-3.5 h-3.5 ${isClearingCache ? 'animate-spin' : ''}`} />
                    <span>{isClearingCache ? 'Clearing Cache...' : 'Clear Cache & Reload'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <div className="font-semibold text-white text-xs flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pan-African Offline Resilience</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  AfriPath AI is engineered for African bandwidth environments. Core career frameworks, skill gap analyses, Gambian institutional mappings, and offline curriculum roadmaps are cached on your device for instant launch anytime without internet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
