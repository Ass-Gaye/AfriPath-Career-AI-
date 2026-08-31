import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Trophy,
  Award,
  FileCheck,
  Clock,
  BookOpen,
  Code2,
  Flame,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  Target,
  RefreshCw,
  Sliders,
  TrendingUp,
  Briefcase,
  Paperclip,
  Share2,
  Check,
  HelpCircle,
  FolderPlus,
  PlayCircle,
  FileText,
  Search,
  Filter,
  GraduationCap,
  Compass,
  Globe2,
  Smartphone,
  Wifi,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, CareerRoadmap, RoadmapTask, RoadmapWeek, RoadmapMonth, RoadmapProfileGrounding } from '../types/career';
import { useLanguage } from '../context/LanguageContext';
import { attachTaskEvidence, fetchRoadmap } from '../services/api';
import { PhaseProgressTracker } from './PhaseProgressTracker';
import { CourseRecommendationsModal } from './CourseRecommendationsModal';

interface RoadmapViewProps {
  userProfile: UserProfile;
  roadmap: CareerRoadmap | null;
  targetCareer: string;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  isLoading: boolean;
  onNavigateToCV?: () => void;
  onRoadmapUpdated?: (newRoadmap: CareerRoadmap) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  userProfile,
  roadmap,
  targetCareer,
  completedTaskIds,
  onToggleTask,
  isLoading: parentLoading,
  onNavigateToCV,
  onRoadmapUpdated,
}) => {
  const { t, formatNumber, isRTL, language, getLocalizedCareer } = useLanguage();

  // Local state for interactive personalization
  const [activeMonthTab, setActiveMonthTab] = useState<number>(0); // 0 = All
  const [filterActivityType, setFilterActivityType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [showGroundingSnapshot, setShowGroundingSnapshot] = useState<boolean>(false);
  const [showGapProjection, setShowGapProjection] = useState<boolean>(true);
  const [selectedHours, setSelectedHours] = useState<number>(roadmap?.weeklyHoursRecommended || userProfile.constraints?.timeAvailableWeeklyHours || 10);
  const [selectedLearningPref, setSelectedLearningPref] = useState<string>(
    roadmap?.learningPreference || 'mixed'
  );
  const [selectedPathway, setSelectedPathway] = useState<string>(
    roadmap?.pathwayType || userProfile.preferredPathway || 'University / Degree'
  );
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [expandedTaskDetails, setExpandedTaskDetails] = useState<Record<string, boolean>>({});
  
  // Evidence modal state
  const [evidenceModalTask, setEvidenceModalTask] = useState<RoadmapTask | null>(null);
  const [evidenceType, setEvidenceType] = useState<'project_link' | 'certificate' | 'github_repo' | 'notes'>('project_link');
  const [evidenceUrlOrText, setEvidenceUrlOrText] = useState<string>('');
  const [evidenceAddToCV, setEvidenceAddToCV] = useState<boolean>(true);
  const [evidenceAddToPortfolio, setEvidenceAddToPortfolio] = useState<boolean>(true);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState<boolean>(false);
  const [evidenceSuccessBanner, setEvidenceSuccessBanner] = useState<string | null>(null);

  // Personalized Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalSkillId, setCourseModalSkillId] = useState<string | undefined>(undefined);

  const handleOpenCourses = (skillId?: string) => {
    setCourseModalSkillId(skillId);
    setIsCourseModalOpen(true);
  };

  // Local roadmap state when regenerated
  const [currentRoadmap, setCurrentRoadmap] = useState<CareerRoadmap | null>(roadmap);

  React.useEffect(() => {
    if (roadmap) {
      setCurrentRoadmap(roadmap);
      if (roadmap.weeklyHoursRecommended) setSelectedHours(roadmap.weeklyHoursRecommended);
      if (roadmap.learningPreference) setSelectedLearningPref(roadmap.learningPreference);
      if (roadmap.pathwayType) setSelectedPathway(roadmap.pathwayType);
    }
  }, [roadmap]);

  if (parentLoading || !currentRoadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white">
          {t('roadmap:synthesizing', 'Personalizing Your 90-Day Career Roadmap...')}
        </h2>
        <p className="text-xs text-slate-400">
          {t('roadmap:architecting', 'Analyzing verified competencies, weekly availability, and real market pathways for')}{' '}
          <span className="text-emerald-400 font-semibold">{getLocalizedCareer(targetCareer).name || targetCareer}</span>
        </p>
      </div>
    );
  }

  const allTasks: RoadmapTask[] = (currentRoadmap.months || []).flatMap((m) =>
    (m.weeks || []).flatMap((w) => w.tasks || [])
  );
  const totalTasks = allTasks.length;
  const completedCount = completedTaskIds.filter((id) => allTasks.some((t) => t.id === id)).length;
  const progressPercent = Math.round((completedCount / (totalTasks || 1)) * 100);

  const totalEstimatedHours = allTasks.reduce((acc, t) => acc + (t.estimatedHours || 3), 0);
  const completedHours = allTasks
    .filter((t) => completedTaskIds.includes(t.id))
    .reduce((acc, t) => acc + (t.estimatedHours || 3), 0);

  // Find next actionable task for "Today's Action"
  const nextIncompleteTask = allTasks.find((t) => !completedTaskIds.includes(t.id)) || allTasks[0];

  // Detect if user profile has evolved since this roadmap was synthesized
  const grounding = currentRoadmap.profileGrounding;
  const profileHasEvolved = grounding && (
    grounding.educationLevel !== (userProfile.educationLevel || 'Bachelor’s Degree') ||
    grounding.preferredPathway !== (userProfile.preferredPathway || 'University / Degree') ||
    grounding.country !== (userProfile.country || 'The Gambia') ||
    grounding.weeklyHours !== (selectedHours) ||
    grounding.verifiedSkillCount !== ((userProfile.currentSkills?.length || 0) + (userProfile.softSkills?.length || 0) + (userProfile.verifiedCompetencies?.length || 0))
  );

  const handleTaskClick = (taskId: string) => {
    const isNowCompleted = !completedTaskIds.includes(taskId);
    onToggleTask(taskId);

    if (isNowCompleted) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10B981', '#34D399', '#FBBF24', '#38BDF8'],
      });
    }
  };

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTaskDetails((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleRecalculateRoadmap = async () => {
    setIsRecalculating(true);
    try {
      const updatedProfileWithPreferences: UserProfile = {
        ...userProfile,
        preferredPathway: selectedPathway as any,
        constraints: {
          ...userProfile.constraints,
          timeAvailableWeeklyHours: selectedHours,
        },
      };

      const updated = await fetchRoadmap(
        updatedProfileWithPreferences,
        targetCareer,
        language,
        {
          weeklyHours: selectedHours,
          learningPreference: selectedLearningPref,
        }
      );
      setCurrentRoadmap(updated);
      if (onRoadmapUpdated) {
        onRoadmapUpdated(updated);
      }
      setShowPreferences(false);
      setEvidenceSuccessBanner(
        language === 'ar'
          ? 'تمت إعادة حساب وتخصيص خطة الـ 90 يوماً بنجاح بناءً على تفضيلاتك!'
          : language === 'fr'
          ? 'Feuille de route de 90 jours recalculée et personnalisée avec succès !'
          : language === 'wo'
          ? 'Yoonu 90 fann bi génn na te méngoo ak sa xam-xam !'
          : '90-Day Roadmap successfully recalculated and grounded in your latest profile!'
      );
      setTimeout(() => setEvidenceSuccessBanner(null), 5000);
    } catch (err) {
      console.error('Failed to recalculate roadmap:', err);
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleOpenEvidenceModal = (task: RoadmapTask, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvidenceModalTask(task);
    setEvidenceUrlOrText('');
    setEvidenceAddToCV(true);
    setEvidenceAddToPortfolio(true);
  };

  const handleSubmitEvidence = async () => {
    if (!evidenceModalTask || !evidenceUrlOrText.trim()) return;
    setIsSubmittingEvidence(true);
    try {
      await attachTaskEvidence({
        taskId: evidenceModalTask.id,
        taskTitle: evidenceModalTask.title,
        skillName: evidenceModalTask.skillCompetency || currentRoadmap.targetCareer,
        evidenceType,
        urlOrText: evidenceUrlOrText,
        addToCV: evidenceAddToCV,
        addToPortfolio: evidenceAddToPortfolio,
      });

      // Also ensure task is marked completed
      if (!completedTaskIds.includes(evidenceModalTask.id)) {
        onToggleTask(evidenceModalTask.id);
      }

      setEvidenceSuccessBanner(
        language === 'ar'
          ? `تم حفظ الدليل للمهمة "${evidenceModalTask.title}" وتثبيته في ملف الكفاءات والسيرة الذاتية!`
          : language === 'fr'
          ? `Preuve enregistrée pour "${evidenceModalTask.title}" et synchronisée avec le CV !`
          : `Evidence recorded for "${evidenceModalTask.title}" and synchronized with candidate records!`
      );
      setEvidenceModalTask(null);
      setTimeout(() => setEvidenceSuccessBanner(null), 5000);
    } catch (err) {
      console.error('Failed to submit evidence:', err);
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  // Activity type badge styling
  const getActivityBadge = (type?: string) => {
    switch (type) {
      case 'BUILD':
        return { label: 'BUILD', color: 'bg-indigo-950 text-indigo-300 border-indigo-800/40' };
      case 'PRACTICE':
        return { label: 'PRACTICE', color: 'bg-emerald-950 text-emerald-300 border-emerald-800/40' };
      case 'LEARN':
        return { label: 'LEARN', color: 'bg-blue-950 text-blue-300 border-blue-800/40' };
      case 'ASSESS':
        return { label: 'ASSESS', color: 'bg-amber-950 text-amber-300 border-amber-800/40' };
      case 'DOCUMENT':
        return { label: 'DOCUMENT', color: 'bg-purple-950 text-purple-300 border-purple-800/40' };
      case 'DEMONSTRATE':
        return { label: 'DEMO', color: 'bg-cyan-950 text-cyan-300 border-cyan-800/40' };
      case 'APPLY':
        return { label: 'APPLY', color: 'bg-rose-950 text-rose-300 border-rose-800/40' };
      case 'NETWORK':
        return { label: 'NETWORK', color: 'bg-teal-950 text-teal-300 border-teal-800/40' };
      case 'PREPARE':
        return { label: 'PREPARE', color: 'bg-violet-950 text-violet-300 border-violet-800/40' };
      case 'REVIEW':
        return { label: 'REVIEW', color: 'bg-slate-800 text-slate-300 border-slate-700' };
      default:
        return { label: 'PRACTICE', color: 'bg-emerald-950 text-emerald-300 border-emerald-800/40' };
    }
  };

  // Filter months & weeks
  const displayedMonths = (currentRoadmap.months || []).filter((m) => {
    if (activeMonthTab === 0) return true;
    return m.month === activeMonthTab;
  });

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Toast Notification Banner */}
      {evidenceSuccessBanner && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-700/60 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{evidenceSuccessBanner}</span>
          </div>
          <button
            onClick={() => setEvidenceSuccessBanner(null)}
            className="text-emerald-400 hover:text-white text-xs underline"
          >
            {t('common:dismiss', 'Dismiss')}
          </button>
        </div>
      )}

      {/* Reactive Profile Evolution Alert Banner */}
      {profileHasEvolved && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/50 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs font-bold text-white">
                {language === 'ar'
                  ? 'تم تحديث بيانات ملفك المهني'
                  : language === 'fr'
                  ? 'Profil professionnel mis à jour'
                  : 'Profile Updates Detected'}
              </p>
              <p className="text-[11px] text-amber-300/90">
                {language === 'ar'
                  ? 'تم تعديل كفاءاتك أو تفرغك الأسبوعي. اضغط لإعادة حساب خطة الـ 90 يوماً لتلائم وضعك الحالي.'
                  : language === 'fr'
                  ? 'Vos compétences ou disponibilités ont changé. Recalculez votre feuille de route pour l’adapter.'
                  : 'Your verified skills, pathway, or availability have evolved. Recalculate to adapt your 90-day plan.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleRecalculateRoadmap}
            disabled={isRecalculating}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? t('roadmap:recomputing', 'Recalculating...') : t('roadmap:recalcNow', 'Recalculate Roadmap')}</span>
          </button>
        </div>
      )}

      {/* Main Roadmap Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                {t('roadmap:daysPlan', '90-Day Execution Blueprint')}
              </span>
              {currentRoadmap.startingLevel && (
                <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  {t('roadmap:level', 'Starting Level:')} {currentRoadmap.startingLevel}
                </span>
              )}
              <span className="text-[11px] font-semibold bg-blue-950 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800/40 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedHours} hrs / week
              </span>
              {currentRoadmap.pathwayType && (
                <span className="text-[11px] font-semibold bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800/40 flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  {currentRoadmap.pathwayType}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {currentRoadmap.targetCareer}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentRoadmap.phaseAllocation?.focusSummary ||
                `A personalized 12-week progression for ${userProfile.name} designed to bridge verified skill gaps, ship live African-market applications, and guarantee ATS interview readiness.`}
            </p>

            {/* Profile Grounding Toggle */}
            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowGroundingSnapshot(!showGroundingSnapshot)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {showGroundingSnapshot
                    ? t('roadmap:hideGrounding', 'Hide 9-Dimension Profile Grounding Snapshot')
                    : t('roadmap:viewGrounding', 'View 9-Dimension Profile Grounding Snapshot')}
                </span>
                {showGroundingSnapshot ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Progress Card & Actions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shrink-0 w-full lg:w-80 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">{t('roadmap:progress', 'Milestone Completion')}</span>
              <span className="text-emerald-400 font-bold text-sm">{progressPercent}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-900">
              <div>
                <span className="text-white font-semibold">{completedCount}</span> / {totalTasks} {t('roadmap:tasks', 'tasks')}
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-semibold">{completedHours}</span> / {totalEstimatedHours} hrs done
              </div>
            </div>

            {/* Customize / Recalculate toggle button */}
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showPreferences ? t('roadmap:hidePrefs', 'Hide Settings') : t('roadmap:customCommitment', 'Customize Hours, Pathway & Style')}</span>
              {showPreferences ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Section 33 & 34: Personalization Summary & Confidence Matrix */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Starting Point Card */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'نقطة الانطلاق المهنية الخاصة بك' : language === 'fr' ? 'Votre point de départ professionnel' : 'Your Career Starting Point'}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                {language === 'ar' ? 'مخصص بالكامل' : language === 'fr' ? 'Personnalisé' : 'Fully Personalized'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'المجال والتخصص:' : language === 'fr' ? 'Filière & Discipline :' : 'Field & Discipline:'}</span>
                <span className="font-semibold text-white truncate block">{userProfile.discipline || userProfile.fieldOfStudy || 'General Computing'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'الخبرة الحالية:' : language === 'fr' ? 'Expérience actuelle :' : 'Current Experience:'}</span>
                <span className="font-semibold text-white block">{userProfile.experienceYears || '0-1 Years'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'المهنة المستهدفة:' : language === 'fr' ? 'Métier visé :' : 'Target Career:'}</span>
                <span className="font-semibold text-emerald-400 truncate block">{currentRoadmap.targetCareer}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'الوقت المتاح:' : language === 'fr' ? 'Temps disponible :' : 'Available Time:'}</span>
                <span className="font-semibold text-blue-400 block">{selectedHours} {language === 'ar' ? 'ساعات / أسبوع' : language === 'fr' ? 'h / semaine' : 'hrs / week'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 text-xs space-y-1">
              <div>
                <span className="text-slate-400 text-[11px] font-medium">{language === 'ar' ? 'نقاط القوة الحالية:' : language === 'fr' ? 'Forces actuelles :' : 'Current Strengths:'} </span>
                <span className="text-slate-200">{(userProfile.currentSkills || []).slice(0, 3).join(', ') || 'Foundational Computing'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] font-medium">{language === 'ar' ? 'الفجوات ذات الأولوية:' : language === 'fr' ? 'Écarts prioritaires :' : 'Priority Gaps:'} </span>
                <span className="text-amber-400 font-semibold">{(currentRoadmap.topPriorities || []).slice(0, 3).join(', ') || 'Domain Specialization'}</span>
              </div>
            </div>
          </div>

          {/* 90-Day Adaptive Plan Summary */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'خطة الـ 90 يوماً المخصصة لك' : language === 'fr' ? 'Votre plan sur 90 jours' : 'Your 90-Day Plan'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">12 {language === 'ar' ? 'أسبوعاً مقسمة على 3 مراحل' : language === 'fr' ? 'semaines réparties en 3 phases' : 'weeks across 3 phases'}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40 shrink-0">
                    Phase 1 (D1–{currentRoadmap.phaseAllocation?.phase1Days || 30})
                  </span>
                  <span className="truncate">{currentRoadmap.phaseAllocation?.phase1Focus || 'Bridging core verified technical baseline & tooling'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800/40 shrink-0">
                    Phase 2 (D{((currentRoadmap.phaseAllocation?.phase1Days || 30) + 1)}–{((currentRoadmap.phaseAllocation?.phase1Days || 30) + (currentRoadmap.phaseAllocation?.phase2Days || 30))})
                  </span>
                  <span className="truncate">{currentRoadmap.phaseAllocation?.phase2Focus || 'Applied African-context projects & integration'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-400 border border-purple-800/40 shrink-0">
                    Phase 3 (D{((currentRoadmap.phaseAllocation?.phase1Days || 30) + (currentRoadmap.phaseAllocation?.phase2Days || 30) + 1)}–90)
                  </span>
                  <span className="truncate">{currentRoadmap.phaseAllocation?.phase3Focus || 'Portfolio hardening, ATS CV sync & job applications'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {language === 'ar' ? 'المسار المفضل:' : language === 'fr' ? 'Parcours choisi :' : 'Pathway:'} <strong className="text-slate-200">{selectedPathway}</strong>
              </span>
              <span className="text-emerald-400 font-semibold">
                {formatNumber(selectedHours * 12)} {language === 'ar' ? 'ساعة تدريب إجمالية' : language === 'fr' ? 'heures totales' : 'total hours'}
              </span>
            </div>
          </div>
        </div>

        {/* 9-Dimension Profile Grounding Snapshot Panel */}
        {showGroundingSnapshot && (
          <div className="mt-6 pt-5 border-t border-slate-800 bg-slate-950/80 p-5 rounded-xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t('roadmap:groundingTitle', 'Synthesized from Your Verified 9-Dimension Profile')}</span>
              </h3>
              <span className="text-[10px] text-slate-400">
                {t('roadmap:groundingSubtitle', 'Continuously recalculates as profile changes')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {/* 1. Verified Skills */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1. Verified Skills Baseline</span>
                </div>
                <div className="text-white font-semibold">
                  {(userProfile.currentSkills || []).slice(0, 4).join(', ') || 'Foundational Computing'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {userProfile.currentSkills?.length || 0} technical + {userProfile.softSkills?.length || 0} soft skills
                </div>
              </div>

              {/* 2. Target Career */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                  <span>2. Target Career & Goal</span>
                </div>
                <div className="text-white font-semibold truncate">{currentRoadmap.targetCareer}</div>
                <div className="text-[10px] text-slate-400 truncate">
                  Goal: {userProfile.careerGoal || 'High-growth employment'}
                </div>
              </div>

              {/* 3. Skill Gaps Bridged */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  <span>3. Priority Gaps Bridged</span>
                </div>
                <div className="text-white font-semibold truncate">
                  {(currentRoadmap.topPriorities || []).slice(0, 3).join(', ') || 'Domain Specialization'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Calculated from live AfriPath Skill Gap Engine
                </div>
              </div>

              {/* 4. Availability & Pace */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>4. Available Time & Pace</span>
                </div>
                <div className="text-white font-semibold">
                  {selectedHours} hrs / week • ~{selectedHours * 12} hrs total
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedHours >= 20 ? 'Full-Time Intensive' : selectedHours >= 10 ? 'Part-Time Student Pace' : 'Lightweight Evening Pace'}
                </div>
              </div>

              {/* 5. Education & Background */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>5. Education & Institution</span>
                </div>
                <div className="text-white font-semibold truncate">
                  {userProfile.educationLevel} in {userProfile.fieldOfStudy}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{userProfile.institution}</div>
              </div>

              {/* 6. Preferred Pathway */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>6. Preferred Career Pathway</span>
                </div>
                <div className="text-white font-semibold truncate">
                  {selectedPathway}
                </div>
                <div className="text-[10px] text-slate-400">
                  Tailored milestone and deliverable criteria
                </div>
              </div>

              {/* 7. Experience Level */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>7. Experience Stage</span>
                </div>
                <div className="text-white font-semibold">
                  {userProfile.experienceYears || '0-1 Years (Entry/Junior)'}
                </div>
                <div className="text-[10px] text-slate-400">
                  Calibrated difficulty curve & task complexity
                </div>
              </div>

              {/* 8. Country & Local Ecosystem */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>8. Country & Market Context</span>
                </div>
                <div className="text-white font-semibold truncate">
                  {userProfile.country || 'The Gambia'} ({userProfile.location || 'Urban Hub'})
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  Aligned with local employers & regional remote demand
                </div>
              </div>

              {/* 9. Device & Connectivity Context */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium flex items-center gap-1.5 text-[11px]">
                  <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                  <span>9. Hardware & Connectivity</span>
                </div>
                <div className="text-white font-semibold truncate">
                  {userProfile.constraints?.deviceAccess || 'Laptop / Desktop'}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {userProfile.constraints?.internetReliability || 'Stable High-Speed'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalization Drawer */}
        {showPreferences && (
          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl animate-in fade-in">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {t('roadmap:weeklyTime', 'Weekly Availability Commitment')}
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {[5, 10, 15, 20, 30].map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHours(h)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      selectedHours === h
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {h}h/wk
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                {t('roadmap:pathwayChoice', 'Career Pathway Model')}
              </label>
              <select
                value={selectedPathway}
                onChange={(e) => setSelectedPathway(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="University / Degree">University / Degree Track</option>
                <option value="Vocational & TVET Apprenticeship">Vocational & TVET Apprenticeship</option>
                <option value="Self-Taught & Portfolio">Self-Taught & Portfolio Showcase</option>
                <option value="Professional Certification Ladder">Professional Certification Ladder</option>
                <option value="Career Transition & Skill Bridge">Career Transition & Skill Bridge</option>
                <option value="Entrepreneurship & Agribusiness">Entrepreneurship & Startup MVP</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {t('roadmap:learningStyle', 'Preferred Learning Format')}
              </label>
              <select
                value={selectedLearningPref}
                onChange={(e) => setSelectedLearningPref(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="projects">Hands-on Projects & Repositories</option>
                <option value="practice">Interactive Exercises & Drills</option>
                <option value="videos">Video Courses & Tutorials</option>
                <option value="reading">Documentation & Case Studies</option>
                <option value="mixed">Mixed Multimodal Curriculum</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRecalculateRoadmap}
                disabled={isRecalculating}
                className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
                <span>{isRecalculating ? t('roadmap:recomputing', 'Recalculating Plan...') : t('roadmap:recalcCTA', 'Apply & Recalculate Roadmap')}</span>
              </button>
            </div>
          </div>
        )}

        {/* 90-Day Deliverables Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('roadmap:keyArtifacts', 'Target 90-Day Portfolio Deliverables & Proof Points:')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {currentRoadmap.keyOutcomes.map((outcome, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Phase Progress Tracking Component */}
      <PhaseProgressTracker
        roadmap={currentRoadmap}
        completedTaskIds={completedTaskIds}
        activeMonthTab={activeMonthTab}
        onSelectMonthTab={(monthNumber) => {
          // If clicked the already selected month, toggle to all (0), otherwise select month
          setActiveMonthTab((prev) => (prev === monthNumber ? 0 : monthNumber));
        }}
      />

      {/* "Today's Action" / Immediate Sprint Banner */}
      {nextIncompleteTask && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
                {t('roadmap:todayAction', "Today's Recommended Sprint")}
              </span>
              <span className="text-xs text-slate-400">~{Math.round(nextIncompleteTask.estimatedHours * 45)} mins</span>
              {nextIncompleteTask.skillCompetency && (
                <span className="text-[11px] text-emerald-400 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {nextIncompleteTask.skillCompetency}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white">
              {nextIncompleteTask.title}
            </h3>

            {nextIncompleteTask.reason && (
              <p className="text-xs text-slate-300 italic">
                "{nextIncompleteTask.reason}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {nextIncompleteTask.resourceLink && (
              <a
                href={nextIncompleteTask.resourceLink}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition"
              >
                <PlayCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>{nextIncompleteTask.resourceProvider || 'Open Resource'}</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            )}

            <button
              onClick={() => handleTaskClick(nextIncompleteTask.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Check className="w-4 h-4" />
              <span>{t('roadmap:markComplete', 'Mark Completed')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Before / After Skill Gap Progression Matrix (Collapsible) */}
      {currentRoadmap.beforeAfterGaps && currentRoadmap.beforeAfterGaps.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setShowGapProjection(!showGapProjection)}
            className="w-full flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {t('roadmap:gapMatrix', 'Skill Gap Progression: Starting Level vs. 90-Day Outcome')}
              </h3>
            </div>
            {showGapProjection ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showGapProjection && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentRoadmap.beforeAfterGaps.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-bold text-white truncate">{item.skill}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Baseline:</span>
                    <span className="text-amber-400 font-medium">{item.beforeLevel}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Target (90d):</span>
                    <span className="text-emerald-400 font-bold">{item.projectedAfterLevel}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                    Mastery target: Month {item.resolvedInMonth}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Month & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Month Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveMonthTab(0)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeMonthTab === 0
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t('roadmap:allMonths', 'All 3 Months (12 Weeks)')}
          </button>

          {currentRoadmap.months.map((m) => (
            <button
              key={m.month}
              onClick={() => setActiveMonthTab(m.month)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeMonthTab === m.month
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Month {m.month}: {m.phaseName}
            </button>
          ))}
        </div>

        {/* Activity Filter & Course Hub */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => handleOpenCourses()}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مركز الدورات المخصصة' : language === 'fr' ? 'Formations personnalisées' : 'Personalized Courses'}</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder={t('roadmap:searchTasks', 'Search tasks & skills...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* Month & Weeks Timeline Display */}
      <div className="space-y-8">
        {displayedMonths.map((month) => {
          const monthTasks = month.weeks.flatMap((w) => w.tasks || []);
          const monthCompleted = monthTasks.filter((t) => completedTaskIds.includes(t.id)).length;

          return (
            <div key={month.month} className="space-y-4">
              {/* Month Header Banner */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Month {month.month}: {month.phaseName}</span>
                    {month.durationDays && (
                      <span className="text-[11px] font-normal text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {month.durationDays} Days
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400">{month.theme}</p>
                </div>

                <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shrink-0 font-medium">
                  {monthCompleted} / {monthTasks.length} {t('roadmap:tasksDone', 'tasks complete')}
                </div>
              </div>

              {/* 4 Weekly Cards for this Month */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {month.weeks.map((week) => {
                  const filteredTasks = (week.tasks || []).filter((t) => {
                    if (searchQuery.trim()) {
                      const q = searchQuery.toLowerCase();
                      return (
                        t.title.toLowerCase().includes(q) ||
                        (t.skillCompetency && t.skillCompetency.toLowerCase().includes(q)) ||
                        (t.description && t.description.toLowerCase().includes(q))
                      );
                    }
                    return true;
                  });

                  const weekCompleted = (week.tasks || []).length > 0 && (week.tasks || []).every((t) => completedTaskIds.includes(t.id));

                  return (
                    <div
                      key={week.weekNumber}
                      className={`p-5 rounded-2xl transition border flex flex-col justify-between ${
                        weekCompleted
                          ? 'bg-slate-900 border-emerald-500/40 ring-1 ring-emerald-500/20'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        {/* Week Header */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                            <span>Week {week.weekNumber}</span>
                          </span>
                          {weekCompleted && (
                            <span className="text-[10px] font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>{t('roadmap:completedBadge', 'Completed')}</span>
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-bold text-white mb-0.5">{week.title}</h3>
                        <p className="text-xs text-slate-400 mb-3">{week.focus}</p>

                        {/* Tasks Checklist */}
                        <div className="space-y-2.5">
                          {filteredTasks.map((task) => {
                            const isDone = completedTaskIds.includes(task.id);
                            const badge = getActivityBadge(task.activityType);
                            const isExpanded = !!expandedTaskDetails[task.id];

                            return (
                              <div
                                key={task.id}
                                className={`p-3 rounded-xl text-xs transition border flex flex-col gap-2 ${
                                  isDone
                                    ? 'bg-slate-950 text-slate-400 border-slate-800/60'
                                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                                }`}
                              >
                                <div className="flex items-start gap-2.5 select-none">
                                  <button
                                    type="button"
                                    onClick={() => handleTaskClick(task.id)}
                                    className="mt-0.5 shrink-0 focus:outline-none"
                                  >
                                    {isDone ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-500 hover:text-emerald-400 transition" />
                                    )}
                                  </button>

                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${badge.color}`}
                                      >
                                        {badge.label}
                                      </span>
                                      {task.skillCompetency && (
                                        <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                                          {task.skillCompetency}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-slate-500">
                                        ~{task.estimatedHours}h
                                      </span>
                                    </div>

                                    <div className={`font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                                      {task.title}
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => toggleTaskExpanded(task.id)}
                                    className="text-slate-500 hover:text-slate-300 p-1"
                                  >
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>

                                {/* Expanded Task Details (Rationale, Outcomes, Attachments) */}
                                {isExpanded && (
                                  <div className="pt-2 border-t border-slate-900 space-y-2 text-[11px] text-slate-300">
                                    {task.reason && (
                                      <div className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
                                        <span className="font-semibold text-emerald-400 block mb-0.5">
                                          💡 Why this task is assigned:
                                        </span>
                                        {task.reason}
                                      </div>
                                    )}

                                    {task.description && (
                                      <p className="text-slate-400">{task.description}</p>
                                    )}

                                    {task.expectedOutcome && (
                                      <div>
                                        <span className="font-semibold text-slate-400">Expected Outcome: </span>
                                        <span>{task.expectedOutcome}</span>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                                      {task.resourceLink && (
                                        <a
                                          href={task.resourceLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                                        >
                                          <PlayCircle className="w-3 h-3" />
                                          <span>{task.resourceProvider || 'Resource'}</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}

                                      <button
                                        onClick={(e) => handleOpenEvidenceModal(task, e)}
                                        className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        <span>Attach Proof / Repo</span>
                                      </button>

                                      {(task.activityType === 'learn' || task.skillCompetency) && (
                                        <button
                                          onClick={() => handleOpenCourses(task.skillCompetency)}
                                          className="inline-flex items-center gap-1 text-[11px] text-teal-300 hover:text-teal-200 bg-slate-900 px-2.5 py-1 rounded border border-slate-800"
                                        >
                                          <BookOpen className="w-3 h-3" />
                                          <span>Personalized Courses</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Milestone Deliverable */}
                      <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">
                        <div className="text-[11px] font-semibold uppercase text-amber-400 mb-0.5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>Milestone Deliverable</span>
                          </div>
                          {(week.weekNumber === 9 || week.weekNumber === 10) && onNavigateToCV && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToCV();
                              }}
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                            >
                              <FileCheck className="w-3 h-3" />
                              <span>Launch AI CV Builder</span>
                            </button>
                          )}
                        </div>
                        <p className="text-slate-300">{week.milestoneDeliverable}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attach Evidence Modal */}
      {evidenceModalTask && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Attach Evidence to Milestone</h3>
              </div>
              <button
                onClick={() => setEvidenceModalTask(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">Task:</span>
              <p className="text-sm font-semibold text-white">{evidenceModalTask.title}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Evidence Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'project_link', label: 'Live Demo URL' },
                    { id: 'github_repo', label: 'GitHub Repo' },
                    { id: 'certificate', label: 'Certificate' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setEvidenceType(fmt.id as any)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border transition ${
                        evidenceType === fmt.id
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  URL or Verification Summary
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/myusername/project-repo"
                  value={evidenceUrlOrText}
                  onChange={(e) => setEvidenceUrlOrText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evidenceAddToCV}
                    onChange={(e) => setEvidenceAddToCV(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Sync to Candidate Verified Skills Inventory (for ATS CV)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={evidenceAddToPortfolio}
                    onChange={(e) => setEvidenceAddToPortfolio(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Feature in 90-Day Portfolio Showpiece</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEvidenceModalTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitEvidence}
                disabled={isSubmittingEvidence || !evidenceUrlOrText.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmittingEvidence ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Save Evidence</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personalized Course Recommendations Engine Modal */}
      <CourseRecommendationsModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        userProfile={userProfile}
        targetCareer={currentRoadmap.targetCareer}
        initialSkillId={courseModalSkillId}
        language={language}
        onCourseCompleted={() => {
          // Trigger smooth roadmap recalculation with evidence
          handleRecalculateRoadmap();
        }}
      />
    </div>
  );
};
