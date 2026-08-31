import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ArrowRight,
  HelpCircle,
  Award,
  BookOpen,
  FileCheck,
  Zap,
  PlusCircle,
  X,
  Check,
} from 'lucide-react';
import { UserProfile, SkillGapAnalysis, CareerMatch, EvaluatedGapItem, CourseEntity } from '../types/career';
import { submitSkillAssessment, submitSkillEvidence } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CourseRecommendationsModal } from './CourseRecommendationsModal';

interface SkillGapViewProps {
  userProfile: UserProfile;
  skillGap: SkillGapAnalysis | null;
  careerMatches: CareerMatch[];
  targetCareer: string;
  onSelectTargetCareer: (careerTitle: string) => void;
  onNavigateToRoadmap: () => void;
  isLoading: boolean;
  onRefreshGapAnalysis?: () => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  userProfile,
  skillGap,
  careerMatches,
  targetCareer,
  onSelectTargetCareer,
  onNavigateToRoadmap,
  isLoading,
  onRefreshGapAnalysis,
}) => {
  const { t, formatNumber, isRTL, language, getLocalizedCareer } = useLanguage();
  const [activeTab, setActiveTab] = useState<'priorities' | 'insufficient' | 'meets' | 'recommendations'>('priorities');
  const [assessmentModalItem, setAssessmentModalItem] = useState<EvaluatedGapItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [evidenceModalItem, setEvidenceModalItem] = useState<EvaluatedGapItem | null>(null);
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceSource, setEvidenceSource] = useState<'project_deliverable' | 'work_experience' | 'certification'>('project_deliverable');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Personalized Course Recommendation Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalSkillId, setCourseModalSkillId] = useState<string | undefined>(undefined);

  const handleOpenCoursesForGap = (skillId?: string) => {
    setCourseModalSkillId(skillId);
    setIsCourseModalOpen(true);
  };

  if (isLoading || !skillGap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white">
          {language === 'ar'
            ? 'جاري تشغيل تحليل فجوة المهارات في الوقت الفعلي...'
            : language === 'fr'
            ? 'Exécution du pipeline d’analyse des écarts de compétences...'
            : language === 'wo'
            ? 'Maa ngiy xool xarala yi manke...'
            : 'Running Real-Time Skill Gap Pipeline...'}
        </h2>
        <p className="text-xs text-slate-400">
          {language === 'ar'
            ? `مقارنة الأدلة المعتمدة مع نماذج الكفاءة لمهنة ${targetCareer}`
            : language === 'fr'
            ? `Comparaison des compétences vérifiées avec les exigences pour ${targetCareer}.`
            : language === 'wo'
            ? `Di méngal xam-xam yi nga am ak lañ laaj ci ${targetCareer}.`
            : `Comparing verified evidence against competency models for ${targetCareer}.`}
        </p>
      </div>
    );
  }

  const report = skillGap.detailedReport;
  const topPriorities = report?.topPriorities || [];
  const insufficientItems = report?.insufficientEvidenceItems || [];
  const meetsItems = report?.meetsRequirements || [];
  const recommendations = report?.skillRecommendations || [];

  const handleStartAssessment = (item: EvaluatedGapItem) => {
    setAssessmentModalItem(item);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSubmitQuiz = async () => {
    if (!assessmentModalItem?.assessmentQuestions) return;
    const questions = assessmentModalItem.assessmentQuestions;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setQuizScore(calculatedScore);
    setQuizSubmitted(true);

    try {
      await submitSkillAssessment(assessmentModalItem.competencyName, calculatedScore);
      if (onRefreshGapAnalysis) {
        onRefreshGapAnalysis();
      }
    } catch (err) {
      console.warn('Failed to submit assessment score:', err);
    }
  };

  const handleAddEvidence = async () => {
    if (!evidenceModalItem || !evidenceText.trim()) return;
    setIsSubmitting(true);
    try {
      await submitSkillEvidence(
        evidenceModalItem.competencyName,
        evidenceSource,
        evidenceText.trim()
      );
      setEvidenceModalItem(null);
      setEvidenceText('');
      if (onRefreshGapAnalysis) {
        onRefreshGapAnalysis();
      }
    } catch (err) {
      console.warn('Failed to record evidence:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Target Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t('skills:title', 'Real-Time Skill Gap Diagnostics')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              {language === 'ar' ? 'نموذج مبني على الأدلة' : language === 'fr' ? 'Pipeline Vérifié' : 'Grounded Pipeline'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('skills:subtitle', {
              targetCareer: getLocalizedCareer(targetCareer).name || targetCareer,
              country: userProfile.country || 'Gambia',
              defaultValue: `Grounded comparison for ${userProfile.name} • ${userProfile.discipline || userProfile.fieldOfStudy} (${userProfile.institution || 'UTG'}).`
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
            {language === 'ar' ? 'المهنة المستهدفة:' : language === 'fr' ? 'Métier visé :' : language === 'wo' ? 'Ligéey bi:' : 'Target Career:'}
          </label>
          <select
            value={targetCareer}
            onChange={(e) => onSelectTargetCareer(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {careerMatches.map((c) => (
              <option key={c.id} value={c.title}>
                {getLocalizedCareer(c.title).name || c.title} ({formatNumber(c.matchScore)}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grounded Readiness Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {formatNumber(skillGap.overallReadinessScore)}%
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {t('skills:readinessScore', 'Verified Readiness')}
            </div>
            <div className="text-xs font-bold text-white">
              {skillGap.overallReadinessScore >= 75
                ? (language === 'ar' ? 'جاهزية قوية للعمل' : language === 'fr' ? 'Excellente préparation' : 'Strong Job Readiness')
                : skillGap.overallReadinessScore >= 50
                ? (language === 'ar' ? 'أساسيات متينة' : language === 'fr' ? 'Bases solides' : 'Solid Fundamentals')
                : (language === 'ar' ? 'أساس قيد التطوير' : language === 'fr' ? 'Bases en cours d’acquisition' : 'Emerging Foundation')}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
            {formatNumber(topPriorities.length)}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {language === 'ar' ? 'فجوات ذات أولوية' : language === 'fr' ? 'Écarts prioritaires' : 'Top Priority Gaps'}
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'ar' ? 'تتطلب تدريباً' : language === 'fr' ? 'À combler' : 'Require Bridging'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {formatNumber(meetsItems.length)}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {t('skills:ownedSkills', 'Meets Requirements')}
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'ar' ? 'كفاءة موثقة' : language === 'fr' ? 'Compétence vérifiée' : 'Verified Proficiency'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 font-bold text-lg">
            {formatNumber(insufficientItems.length)}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              {language === 'ar' ? 'تحتاج إلى إثبات' : language === 'fr' ? 'Besoin de preuves' : 'Needs Evidence'}
            </div>
            <div className="text-xs font-bold text-white">
              {language === 'ar' ? 'إجراء تقييم سريع' : language === 'fr' ? 'Faire le test' : 'Take Assessment'}
            </div>
          </div>
        </div>
      </div>

      {/* Grounded Diagnostic Summary & Course Hub CTA */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'ar'
                ? 'ملخص التقييم التشخيصي'
                : language === 'fr'
                ? 'Résumé du diagnostic des compétences'
                : language === 'wo'
                ? 'Tënk bu tënk xarala yi'
                : 'Diagnostic Assessment Summary'}
            </span>
          </div>

          {topPriorities.length > 0 && (
            <button
              onClick={() => handleOpenCoursesForGap(undefined)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition self-start sm:self-auto"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? 'استكشاف الدورات المخصصة لفجواتك'
                  : language === 'fr'
                  ? 'Voir les formations adaptées à vos lacunes'
                  : 'View Courses for Your Gaps'}
              </span>
            </button>
          )}
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {report?.executiveSummary || skillGap.aiSummary}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('priorities')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'priorities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? `الفجوات ذات الأولوية (${formatNumber(topPriorities.length)})`
              : language === 'fr'
              ? `Écarts prioritaires (${formatNumber(topPriorities.length)})`
              : `Top Priority Gaps (${topPriorities.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('insufficient')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'insufficient'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? `أدلة غير كافية (${formatNumber(insufficientItems.length)})`
              : language === 'fr'
              ? `Preuves insuffisantes (${formatNumber(insufficientItems.length)})`
              : `Insufficient Evidence (${insufficientItems.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('meets')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'meets'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? `تفي بالمتطلبات (${formatNumber(meetsItems.length)})`
              : language === 'fr'
              ? `Exigences satisfaites (${formatNumber(meetsItems.length)})`
              : `Meets Requirements (${meetsItems.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'recommendations'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>
            {language === 'ar'
              ? `توصيات مستهدفة (${formatNumber(recommendations.length)})`
              : language === 'fr'
              ? `Recommandations ciblées (${formatNumber(recommendations.length)})`
              : `Targeted Recommendations (${recommendations.length})`}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* TAB 1: TOP PRIORITIES */}
        {activeTab === 'priorities' && (
          <div className="space-y-4">
            {topPriorities.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  {language === 'ar'
                    ? 'لم يتم رصد أي فجوات حرجة!'
                    : language === 'fr'
                    ? 'Aucun écart critique détecté !'
                    : 'No Critical Priority Gaps Detected!'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ar'
                    ? `خبرتك وتدريبك المعتمد يفي بمتطلبات مهنة ${targetCareer}.`
                    : language === 'fr'
                    ? `Votre expérience et formation répondent déjà aux exigences principales pour ${targetCareer}.`
                    : `Your verified experience and training meet or exceed the primary requirements for ${targetCareer}.`}
                </p>
              </div>
            ) : (
              topPriorities.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800/40">
                        {item.displayStatusBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 text-slate-300 border border-slate-800">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">{item.competencyName}</h3>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">
                        {language === 'ar' ? 'المستوى الحالي:' : language === 'fr' ? 'Niveau actuel :' : 'Current:'}{' '}
                        <strong className="text-amber-400">{item.currentProficiencyLabel}</strong>
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-400">
                        {language === 'ar' ? 'المستوى المستهدف:' : language === 'fr' ? 'Objectif :' : 'Target:'}{' '}
                        <strong className="text-emerald-400">{item.requiredProficiencyLabel}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.reasonExplanation}</p>

                  {/* Evidence Used */}
                  {item.evidenceUsed && item.evidenceUsed.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'ar' ? 'الأدلة التي تم تحليلها:' : language === 'fr' ? 'Preuves analysées :' : 'Evidence Analyzed:'}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 pl-1">
                        {item.evidenceUsed.map((ev, eIdx) => (
                          <li key={eIdx}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Guidance & Resources */}
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="text-xs text-emerald-400 font-medium">
                        💡 <strong>{language === 'ar' ? 'الإجراء الموصى به:' : language === 'fr' ? 'Action recommandée :' : 'Recommended Action:'}</strong> {item.recommendedAction}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleOpenCoursesForGap(item.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>{language === 'ar' ? 'الدورات الموصى بها' : language === 'fr' ? 'Formations recommandées' : 'View Recommended Courses'}</span>
                        </button>
                        {item.assessmentAvailable && (
                          <button
                            onClick={() => handleStartAssessment(item)}
                            className="px-3 py-1 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-300 hover:bg-blue-900 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>{language === 'ar' ? 'إجراء التقييم' : language === 'fr' ? 'Passer l’évaluation' : 'Take Assessment'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => setEvidenceModalItem(item)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>{language === 'ar' ? 'إضافة دليل أو مشروع' : language === 'fr' ? 'Ajouter une preuve' : 'Add Evidence'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.recommendedResources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                        >
                          <div className="overflow-hidden">
                            <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 transition truncate">
                              {res.title}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              <span>{res.provider}</span> •{' '}
                              <span className="text-emerald-400">{res.type}</span>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: INSUFFICIENT EVIDENCE */}
        {activeTab === 'insufficient' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200 leading-relaxed">
              <strong>{language === 'ar' ? 'توضيح "أدلة غير كافية":' : language === 'fr' ? 'Comprendre « Preuves insuffisantes » :' : 'Understanding "Insufficient Evidence":'}</strong>{' '}
              {language === 'ar'
                ? 'لا تفترض المنصة وجود فجوة لمجرد عدم ذكر المهارة في ملفك. بدلاً من ذلك، يمكنك تأكيد كفاءتك بإجراء اختبار قصير مدته 3 دقائق أو توثيق مشاريعك ذات الصلة.'
                : language === 'fr'
                ? 'AfriPath AI ne suppose pas un écart simplement parce qu’une compétence n’était pas listée. Vous pouvez vérifier votre niveau en passant notre test de 3 minutes ou en documentant vos projets.'
                : 'AfriPath AI does not assume you have a gap simply because a skill was not listed. Rather than penalizing you, you can verify your proficiency by taking our 3-minute quiz or documenting relevant projects.'}
            </div>

            {insufficientItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800/40">
                      {language === 'ar' ? 'أدلة غير كافية' : language === 'fr' ? 'Preuves insuffisantes' : 'Insufficient Evidence'}
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.competencyName}</h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    {language === 'ar' ? 'متطلبات المسار:' : language === 'fr' ? 'Exigence du parcours :' : 'Pathway Requirement:'}{' '}
                    <strong className="text-slate-200">{item.requiredProficiencyLabel}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.reasonExplanation}</p>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                  {item.assessmentAvailable && (
                    <button
                      onClick={() => handleStartAssessment(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'إجراء اختبار مدته 3 دقائق' : language === 'fr' ? 'Faire le test (3 min)' : 'Take 3-Min Assessment'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setEvidenceModalItem(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إضافة دليل مشروع أو دورة' : language === 'fr' ? 'Ajouter une preuve de projet' : 'Add Project or Course Evidence'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MEETS REQUIREMENTS */}
        {activeTab === 'meets' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200 leading-relaxed">
              <strong>{language === 'ar' ? 'توافق موثق للمسار المهني:' : language === 'fr' ? 'Alignement validé :' : 'Verified Pathway Alignment:'}</strong>{' '}
              {language === 'ar'
                ? 'الكفاءات التالية تفي بمتطلبات دورك المستهدف أو تتجاوزها بناءً على تدريبك الأكاديمي ومشاريعك المعتمدة.'
                : language === 'fr'
                ? 'Les compétences suivantes répondent ou dépassent le niveau attendu pour votre rôle cible d’après vos projets et évaluations.'
                : 'The following competencies meet or exceed the expected level for your target role based on your academic training, verified projects, and assessments.'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetsItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{item.competencyName}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {language === 'ar' ? 'تفي بالمتطلبات' : language === 'fr' ? 'Conforme aux exigences' : 'Meets Requirement'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{item.reasonExplanation}</p>

                  {item.evidenceUsed && item.evidenceUsed.length > 0 && (
                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800/60">
                      ✓ {item.evidenceUsed[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TARGETED RECOMMENDATIONS */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong>{language === 'ar' ? 'مسرّعات النمو المستهدفة:' : language === 'fr' ? 'Accélérateurs de croissance :' : 'Targeted Growth Accelerators:'}</strong>{' '}
              {language === 'ar'
                ? `هذه مهارات تكميلية عالية القيمة مخصصة لخلفيتك في ${userProfile.discipline || userProfile.fieldOfStudy} تميز المرشحين في سوق العمل الإقليمي.`
                : language === 'fr'
                ? `Ces compétences complémentaires à fort impact adaptées à votre parcours en ${userProfile.discipline || userProfile.fieldOfStudy} vous démarquent sur le marché.`
                : `These are high-yield complementary skills tailored to your ${userProfile.discipline || userProfile.fieldOfStudy} background that distinguish candidates in the regional job market.`}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-indigo-400" />
                      <span>{rec.skillName}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                      {rec.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action to Launch Roadmap */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
        <div>
          <h3 className="text-sm font-bold text-white">
            {language === 'ar'
              ? 'حوّل هذا التشخيص إلى خطة طريق تنفيذية مخصصة'
              : language === 'fr'
              ? 'Transformez ce diagnostic en feuille de route personnalisée'
              : 'Translate your diagnostics into a personalized roadmap'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'ar'
              ? `احصل على معالم أسبوعية ومشاريع عملية موجهة لمهنة ${targetCareer}.`
              : language === 'fr'
              ? `Accédez aux étapes hebdomadaires et projets concrets pour ${targetCareer}.`
              : `Access weekly milestones, structured projects, and verified milestones for ${targetCareer}.`}
          </p>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm shrink-0"
        >
          <span>{t('skills:proceedToRoadmap', 'Launch 90-Day Roadmap')}</span>
          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* MODAL 1: ASSESSMENT QUIZ */}
      {assessmentModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  {language === 'ar' ? 'تقييم المهارة:' : language === 'fr' ? 'Évaluation de compétence :' : 'Skill Assessment:'} {assessmentModalItem.competencyName}
                </h2>
              </div>
              <button
                onClick={() => setAssessmentModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  {language === 'ar'
                    ? `أجب عن الأسئلة التالية للتحقق من مستوى كفاءتك العملية في `
                    : language === 'fr'
                    ? `Répondez aux questions suivantes pour valider votre niveau pratique en `
                    : `Answer the following questions to verify your practical competency level in `}
                  <span className="text-white font-semibold">{assessmentModalItem.competencyName}</span>.
                </p>

                {(assessmentModalItem.assessmentQuestions || []).map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-semibold text-white">
                      {formatNumber(qIdx + 1)}. {q.question}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))
                          }
                          className={`p-2 rounded-lg text-xs flex items-center gap-2.5 cursor-pointer border transition ${
                            selectedAnswers[qIdx] === optIdx
                              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            checked={selectedAnswers[qIdx] === optIdx}
                            onChange={() => {}}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setAssessmentModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
                  >
                    {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length <
                      (assessmentModalItem.assessmentQuestions?.length || 0)
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition"
                  >
                    {language === 'ar' ? 'إرسال الإجابات' : language === 'fr' ? 'Valider les réponses' : 'Submit Answers'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 font-bold text-2xl mx-auto">
                  {formatNumber(quizScore || 0)}%
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar' ? 'اكتمل التقييم بنجاح' : language === 'fr' ? 'Évaluation terminée' : 'Assessment Complete'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'ar'
                      ? `تم التحقق من نتيجتك. تم ترقية درجة الثقة في مهارة `
                      : language === 'fr'
                      ? `Votre score est vérifié. La confiance en votre compétence en `
                      : `Your score has been verified. Your proficiency confidence for `}
                    <span className="text-white font-medium">{assessmentModalItem.competencyName}</span>{' '}
                    {language === 'ar' ? 'إلى ' : language === 'fr' ? 'est maintenant ' : 'is now upgraded to '}
                    <span className="text-emerald-400 font-bold">{language === 'ar' ? 'عالية' : language === 'fr' ? 'ÉLEVÉE' : 'HIGH'}</span>.
                  </p>
                </div>
                <button
                  onClick={() => setAssessmentModalItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
                >
                  {language === 'ar' ? 'العودة لتحليل الفجوات' : language === 'fr' ? 'Retour au diagnostic' : 'Return to Gap Analysis'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: ADD EVIDENCE */}
      {evidenceModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">
                  {language === 'ar' ? 'إضافة دليل كفاءة:' : language === 'fr' ? 'Ajouter une preuve :' : 'Add Evidence:'} {evidenceModalItem.competencyName}
                </h2>
              </div>
              <button
                onClick={() => setEvidenceModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'نوع الدليل' : language === 'fr' ? 'Type de preuve' : 'Evidence Type'}
                </label>
                <select
                  value={evidenceSource}
                  onChange={(e: any) => setEvidenceSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="project_deliverable">
                    {language === 'ar' ? 'مشروع عملي / مخرج ملموس' : language === 'fr' ? 'Projet pratique / Livrable' : 'Hands-on Project / Deliverable'}
                  </option>
                  <option value="work_experience">
                    {language === 'ar' ? 'تدريب عملي / خبرة مهنية' : language === 'fr' ? 'Stage / Expérience professionnelle' : 'Internship / Work Experience'}
                  </option>
                  <option value="certification">
                    {language === 'ar' ? 'شهادة أو دورة معتمدة' : language === 'fr' ? 'Certification / Cours validé' : 'Course / Certification Credential'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'ar' ? 'صف ما قمت ببنائه أو إنجازه' : language === 'fr' ? 'Décrivez ce que vous avez réalisé' : 'Describe what you built or accomplished'}
                </label>
                <textarea
                  rows={4}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: قمت ببناء قاعدة بيانات طلابية باستخدام PostgreSQL وكتابة استعلامات متقدمة...'
                      : language === 'fr'
                      ? 'ex. Création d’une base de données avec PostgreSQL, rédaction de requêtes complexes...'
                      : 'e.g. Built student database using PostgreSQL, wrote complex joins, and prepared monthly reports.'
                  }
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEvidenceModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
              </button>
              <button
                onClick={handleAddEvidence}
                disabled={!evidenceText.trim() || isSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                {isSubmitting
                  ? (language === 'ar' ? 'جاري الحفظ...' : language === 'fr' ? 'Enregistrement...' : 'Saving...')
                  : (language === 'ar' ? 'حفظ الدليل' : language === 'fr' ? 'Enregistrer la preuve' : 'Save Evidence')}
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
        targetCareer={targetCareer}
        initialSkillId={courseModalSkillId}
        language={language}
        onCourseCompleted={() => {
          if (onRefreshGapAnalysis) {
            onRefreshGapAnalysis();
          }
        }}
      />
    </div>
  );
};
