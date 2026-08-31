import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Clock,
  Award,
  Globe,
  Filter,
  Check,
  RotateCcw,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Play,
  Flame,
  Search,
} from 'lucide-react';
import {
  UserProfile,
  CourseEntity,
  CourseRecommendation,
  PersonalizedCourseHubResponse,
} from '../types/career';

interface CourseRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  targetCareer: string;
  initialSkillId?: string; // If opened for a specific gap
  language: 'en' | 'fr' | 'ar' | 'wo';
  onCourseCompleted?: (course: CourseEntity, evidenceNotes: string, addToCV: boolean) => void;
}

export const CourseRecommendationsModal: React.FC<CourseRecommendationsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  targetCareer,
  initialSkillId,
  language,
  onCourseCompleted,
}) => {
  const [loading, setLoading] = useState(true);
  const [courseHub, setCourseHub] = useState<PersonalizedCourseHubResponse | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(initialSkillId || null);
  const [freeOnlyFilter, setFreeOnlyFilter] = useState(false);
  const [projectsOnlyFilter, setProjectsOnlyFilter] = useState(false);
  const [africanOnlyFilter, setAfricanOnlyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Progress states
  const [courseStatuses, setCourseStatuses] = useState<Record<string, 'Not Started' | 'In Progress' | 'Completed'>>({});
  
  // Evidence modal state for completion
  const [completingCourse, setCompletingCourse] = useState<CourseEntity | null>(null);
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [addEvidenceToCV, setAddEvidenceToCV] = useState(true);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Alternative selector modal
  const [replacingGapId, setReplacingGapId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCourseRecommendations();
    }
  }, [isOpen, targetCareer, userProfile]);

  useEffect(() => {
    if (initialSkillId) {
      setSelectedSkillId(initialSkillId);
    }
  }, [initialSkillId]);

  const fetchCourseRecommendations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/course-recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          targetCareer,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCourseHub(data.data);
        if (!selectedSkillId && data.data.topGapsWithCourses.length > 0) {
          setSelectedSkillId(data.data.topGapsWithCourses[0].skillId);
        }
      }
    } catch (err) {
      console.error('Failed to load course recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async (course: CourseEntity) => {
    try {
      await fetch(`/api/courses/${course.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userProfile.id || 'user-1' }),
      });
      setCourseStatuses((prev) => ({ ...prev, [course.id]: 'In Progress' }));
      
      // Open course URL in safe new tab
      if (course.url && course.url !== '#') {
        window.open(course.url, '_blank', 'noopener,noreferrer');
      }
      
      setSuccessToast(`Course "${course.title}" started! Added to your active learning sprint.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      console.error('Error starting course:', err);
    }
  };

  const handleOpenCompleteModal = (course: CourseEntity) => {
    setCompletingCourse(course);
    setEvidenceNotes(`Successfully completed ${course.title} (${course.provider}) covering ${course.skills.join(', ')} with hands-on practice.`);
    setAddEvidenceToCV(true);
  };

  const handleConfirmCompletion = async () => {
    if (!completingCourse) return;
    try {
      await fetch(`/api/courses/${completingCourse.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id || 'user-1',
          evidenceNotes,
          addToCV: addEvidenceToCV,
        }),
      });

      setCourseStatuses((prev) => ({ ...prev, [completingCourse.id]: 'Completed' }));
      if (onCourseCompleted) {
        onCourseCompleted(completingCourse, evidenceNotes, addEvidenceToCV);
      }

      setSuccessToast(`Course completed! Evidence logged and synced with your verified profile.`);
      setTimeout(() => setSuccessToast(null), 5000);
      setCompletingCourse(null);
    } catch (err) {
      console.error('Error completing course:', err);
    }
  };

  if (!isOpen) return null;

  const gaps = courseHub?.topGapsWithCourses || [];
  const currentGapItem = gaps.find((g) => g.skillId === selectedSkillId) || gaps[0];

  // Filtering
  const filteredGaps = gaps.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.skillName.toLowerCase().includes(q) ||
      g.topCourse.course.title.toLowerCase().includes(q) ||
      g.topCourse.course.provider.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {language === 'ar' ? 'محرك الدورات التدريبية المخصص' : language === 'fr' ? 'Recommandations Personnalisées' : 'Gap-Driven Course Engine'}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'ar' ? 'المهنة المستهدفة:' : language === 'fr' ? 'Objectif :' : 'Target:'} <strong className="text-white">{targetCareer}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {language === 'ar' ? 'دورات تدريبية مبنية حصرياً على فجواتك المهارية' : language === 'fr' ? 'Formations alignées sur vos lacunes réelles' : 'Personalized Courses Derived from Real Skill Gaps'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {language === 'ar'
                ? 'لا نوصي بدورات عشوائية أو مكررة. كل دورة تعالج فجوة حقيقية تم التحقق منها في ملفك المهني.'
                : language === 'fr'
                ? 'Aucune formation générique. Chaque cours comble un écart de compétence précisément identifié dans votre profil.'
                : 'Zero random suggestions. Every course below is directly linked to an active competency gap, matching your proficiency level and weekly schedule.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Toast Banner */}
        {successToast && (
          <div className="bg-emerald-950 border-b border-emerald-800 px-6 py-2.5 flex items-center justify-between text-emerald-200 text-xs font-medium animate-in slide-in-from-top">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Body */}
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-300">
              {language === 'ar' ? 'جاري تحليل الفجوات واختيار أفضل الدورات...' : language === 'fr' ? 'Analyse des lacunes et sélection des cours optimaux...' : 'Matching verified gaps against curated course repository...'}
            </p>
          </div>
        ) : !courseHub || gaps.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {language === 'ar' ? 'لا توجد فجوات مهارية نشطة تتطلب دورات!' : language === 'fr' ? 'Aucune lacune majeure nécessitant de cours !' : 'No Critical Skill Gaps Requiring Courses!'}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {language === 'ar'
                ? 'ملفك المهني يظهر إتقاناً ممتازاً للمهارات المطلوبة لهذه المهنة. يمكنك التركيز مباشرة على بناء المشاريع والتقديم للوظائف.'
                : language === 'fr'
                ? 'Votre profil démontre déjà les compétences requises. Concentrez-vous sur la consolidation de votre portfolio.'
                : 'Your profile and verified competencies already meet or exceed the target baseline for this career. Focus on portfolio projects and job applications.'}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar: Gap List */}
            <div className="w-full md:w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0 overflow-hidden">
              
              {/* Search & Filter bar */}
              <div className="p-3 border-b border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'ar' ? 'بحث في الفجوات...' : language === 'fr' ? 'Filtrer par compétence...' : 'Filter by skill gap...'}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                
                {/* Stats summary chip */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>{gaps.length} {language === 'ar' ? 'فجوات مستهدفة' : language === 'fr' ? 'lacunes identifiées' : 'active gaps'}</span>
                  <span className="text-emerald-400 font-semibold">{courseHub.filterStats.totalFree} {language === 'ar' ? 'مجانية' : language === 'fr' ? 'gratuites' : '100% free'}</span>
                </div>
              </div>

              {/* Gaps List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
                {filteredGaps.map((gap) => {
                  const isSelected = gap.skillId === (selectedSkillId || currentGapItem?.skillId);
                  const status = courseStatuses[gap.topCourse.course.id] || 'Not Started';

                  return (
                    <button
                      key={gap.skillId}
                      onClick={() => setSelectedSkillId(gap.skillId)}
                      className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-950/50 border border-emerald-700/60 text-white'
                          : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate pr-2">{gap.skillName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            gap.gapPriority === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                              : gap.gapPriority === 'HIGH'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                              : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                          }`}
                        >
                          {gap.gapPriority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Lvl {gap.currentProficiency}/4 → Lvl {gap.targetProficiency}/4</span>
                        {status === 'Completed' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : status === 'In Progress' ? (
                          <span className="text-blue-400 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="text-slate-500">{gap.topCourse.course.duration}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Skills Mastered (No course needed) accordion summary */}
              {courseHub.userContextSummary.skillsMasteredNoCourseNeeded.length > 0 && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'ar' ? 'مهارات متقنة (لا تحتاج دورات)' : language === 'fr' ? 'Compétences maîtrisées' : 'Mastered (No Course Needed)'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {courseHub.userContextSummary.skillsMasteredNoCourseNeeded.slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Pane: Selected Gap & Recommended Course */}
            {currentGapItem && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                
                {/* Gap Context Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'ar' ? 'الفجوة المهارية المستهدفة' : language === 'fr' ? 'Lacune ciblée' : 'Targeted Competency Gap'}
                      </div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span>{currentGapItem.skillName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-950 text-amber-300 border border-amber-800/40">
                          {currentGapItem.gapPriority} Priority Gap
                        </span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">{language === 'ar' ? 'المستوى الحالي إلى المطلوب:' : language === 'fr' ? 'Niveau actuel vers cible :' : 'Current to Target Level:'}</div>
                      <div className="text-xs font-semibold text-emerald-400">
                        Level {currentGapItem.currentProficiency}/4 ({currentGapItem.currentProficiency <= 1 ? 'Beginner' : 'Developing'}) → Level {currentGapItem.targetProficiency}/4 (Production Ready)
                      </div>
                    </div>
                  </div>

                  {/* Measurable Outcome */}
                  <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{language === 'ar' ? 'النتيجة العملية المتوقعة:' : language === 'fr' ? 'Objectif mesurable :' : 'Measurable Outcome:'}</strong>
                      <span>{currentGapItem.measurableOutcome}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Recommended Course Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-emerald-800/60 shadow-xl space-y-4">
                  
                  {/* Card Header with Top Pick Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {language === 'ar' ? 'الدورة الأساسية الموصى بها' : language === 'fr' ? 'Recommandation Principale' : 'Top Course For This Gap'}
                        </span>
                        {currentGapItem.topCourse.course.africanProvider && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                            <Globe className="w-3 h-3" /> African Ecosystem
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-semibold">
                          Match Score: <strong className="text-emerald-400">{currentGapItem.topCourse.matchScore}%</strong>
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-white">
                        {currentGapItem.topCourse.course.title}
                      </h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="font-semibold text-slate-300">{currentGapItem.topCourse.course.provider}</span>
                        <span>•</span>
                        <span>{currentGapItem.topCourse.course.language}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-emerald-400">
                        {currentGapItem.topCourse.course.cost}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentGapItem.topCourse.course.description}
                  </p>

                  {/* Course Specs Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'المستوى' : language === 'fr' ? 'Niveau' : 'Difficulty Level'}</span>
                      <span className="font-bold text-white">{currentGapItem.topCourse.course.level}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'المدة المقدرة' : language === 'fr' ? 'Durée totale' : 'Estimated Time'}</span>
                      <span className="font-bold text-white">{currentGapItem.topCourse.course.estimatedHours}h ({currentGapItem.topCourse.course.duration})</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'أسلوب التدريب' : language === 'fr' ? 'Format' : 'Format'}</span>
                      <span className="font-bold text-white">{currentGapItem.topCourse.course.format}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                      <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'مشروع عملي' : language === 'fr' ? 'Projet inclus' : 'Project Included'}</span>
                      <span className="font-bold text-emerald-400">{currentGapItem.topCourse.course.projectIncluded ? 'Yes (Hands-on)' : 'Guided Practice'}</span>
                    </div>
                  </div>

                  {/* Personalized "Why This Course?" Callout */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'لماذا تم اختيار هذه الدورة لك تحديداً؟' : language === 'fr' ? 'Pourquoi ce cours vous correspond ?' : 'Why This Course Was Selected For You'}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {currentGapItem.topCourse.whyRecommended}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300 pt-1">
                      <div>• <span className="text-slate-400">Level Match:</span> {currentGapItem.topCourse.matchReasons.levelFit}</div>
                      <div>• <span className="text-slate-400">Schedule Fit:</span> {currentGapItem.topCourse.matchReasons.timeFit}</div>
                    </div>
                  </div>

                  {/* Actions & Progress State */}
                  <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartCourse(currentGapItem.topCourse.course)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {courseStatuses[currentGapItem.topCourse.course.id] === 'In Progress'
                            ? (language === 'ar' ? 'متابعة الدورة' : language === 'fr' ? 'Continuer le cours' : 'Continue Course')
                            : (language === 'ar' ? 'بدء الدورة في نافذة جديدة' : language === 'fr' ? 'Démarrer le cours' : 'Start Course Online')}
                        </span>
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </button>

                      <button
                        onClick={() => handleOpenCompleteModal(currentGapItem.topCourse.course)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition border border-slate-700"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'ar' ? 'إكمال وإرفاق دليل' : language === 'fr' ? 'Terminé (Ajouter preuve)' : 'Mark Complete & Log Evidence'}</span>
                      </button>
                    </div>

                    {currentGapItem.alternativeCourses.length > 0 && (
                      <button
                        onClick={() => setReplacingGapId(currentGapItem.skillId)}
                        className="text-xs text-slate-400 hover:text-white font-medium flex items-center gap-1 transition"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{language === 'ar' ? 'عرض خيارات بديلة' : language === 'fr' ? 'Voir alternatives' : `View ${currentGapItem.alternativeCourses.length} Alternative(s)`}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Practical Project Requirement Callout (Section 27) */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'المشروع التطبيقي المطلوب لإثبات هذه المهارة' : language === 'fr' ? 'Projet d\'application requis' : 'Practical Evidence Project'}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{language === 'ar' ? 'بعد إكمال الدورة' : language === 'fr' ? 'Après la formation' : 'Post-Course Milestone'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentGapItem.practicalProjectSuggestion}
                  </p>
                </div>

                {/* Alternative Courses Section */}
                {currentGapItem.alternativeCourses.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'خيارات تدريبية بديلة لنفس الفجوة' : language === 'fr' ? 'Autres options de formation' : 'Other Relevant Options for this Gap'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentGapItem.alternativeCourses.map((alt) => (
                        <div key={alt.id} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-emerald-400 font-semibold">{alt.provider}</span>
                              <span className="text-slate-400">{alt.cost}</span>
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-1">{alt.title}</h5>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{alt.description}</p>
                          </div>

                          <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{alt.estimatedHours}h ({alt.level})</span>
                            <a
                              href={alt.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                            >
                              <span>View Course</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{language === 'ar' ? 'التعلم المستمر يحدث الفجوات تلقائياً' : language === 'fr' ? 'La validation met à jour votre profil' : 'Continuous loop: completing courses & logging projects recalculates gaps in real-time'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      </div>

      {/* Course Completion & Evidence Dialog */}
      {completingCourse && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Log Course Completion & Evidence</h4>
              </div>
              <button onClick={() => setCompletingCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Course: <strong className="text-white">{completingCourse.title}</strong></div>
              <div>Provider: <strong className="text-emerald-400">{completingCourse.provider}</strong></div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Evidence & Key Learnings Note:</label>
              <textarea
                value={evidenceNotes}
                onChange={(e) => setEvidenceNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                placeholder="Describe what you built or learned in this course..."
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <input
                type="checkbox"
                id="addToCVCheckbox"
                checked={addEvidenceToCV}
                onChange={(e) => setAddEvidenceToCV(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-700 focus:ring-emerald-500"
              />
              <label htmlFor="addToCVCheckbox" className="text-slate-300 cursor-pointer">
                Automatically add this achievement and verified skills to my tailored CV
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCompletingCourse(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCompletion}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950 transition"
              >
                Confirm & Reassess Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
