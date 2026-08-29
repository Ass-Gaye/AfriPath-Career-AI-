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
import { UserProfile, SkillGapAnalysis, CareerMatch, EvaluatedGapItem } from '../types/career';
import { submitSkillAssessment, submitSkillEvidence } from '../services/api';

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
  const [activeTab, setActiveTab] = useState<'priorities' | 'insufficient' | 'meets' | 'recommendations'>('priorities');
  const [assessmentModalItem, setAssessmentModalItem] = useState<EvaluatedGapItem | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [evidenceModalItem, setEvidenceModalItem] = useState<EvaluatedGapItem | null>(null);
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceSource, setEvidenceSource] = useState<'project_deliverable' | 'work_experience' | 'certification'>('project_deliverable');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading || !skillGap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="inline-block p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-lg font-bold text-white">Running Real-Time Skill Gap Pipeline...</h2>
        <p className="text-xs text-slate-400">
          Comparing verified evidence against competency models for {targetCareer}.
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
              Real-Time Skill Gap Diagnostics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
              Grounded Pipeline
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounded comparison for <span className="text-white font-medium">{userProfile.name}</span> •{' '}
            <span className="text-slate-300">{userProfile.discipline || userProfile.fieldOfStudy}</span> ({userProfile.institution || 'UTG'}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">Target Career:</label>
          <select
            value={targetCareer}
            onChange={(e) => onSelectTargetCareer(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {careerMatches.map((c) => (
              <option key={c.id} value={c.title}>
                {c.title} ({c.matchScore}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grounded Readiness Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {skillGap.overallReadinessScore}%
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Verified Readiness</div>
            <div className="text-xs font-bold text-white">
              {skillGap.overallReadinessScore >= 75
                ? 'Strong Job Readiness'
                : skillGap.overallReadinessScore >= 50
                ? 'Solid Fundamentals'
                : 'Emerging Foundation'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
            {topPriorities.length}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Top Priority Gaps</div>
            <div className="text-xs font-bold text-white">Require Bridging</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-lg">
            {meetsItems.length}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Meets Requirements</div>
            <div className="text-xs font-bold text-white">Verified Proficiency</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 font-bold text-lg">
            {insufficientItems.length}
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Needs Evidence</div>
            <div className="text-xs font-bold text-white">Take Assessment</div>
          </div>
        </div>
      </div>

      {/* Grounded Diagnostic Summary */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Diagnostic Assessment Summary</span>
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
          <span>Top Priority Gaps ({topPriorities.length})</span>
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
          <span>Insufficient Evidence ({insufficientItems.length})</span>
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
          <span>Meets Requirements ({meetsItems.length})</span>
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
          <span>Targeted Recommendations ({recommendations.length})</span>
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
                <h3 className="text-sm font-bold text-white">No Critical Priority Gaps Detected!</h3>
                <p className="text-xs text-slate-400">
                  Your verified experience and training meet or exceed the primary requirements for {targetCareer}.
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
                        Current: <strong className="text-amber-400">{item.currentProficiencyLabel}</strong>
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-400">
                        Target: <strong className="text-emerald-400">{item.requiredProficiencyLabel}</strong>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.reasonExplanation}</p>

                  {/* Evidence Used */}
                  {item.evidenceUsed && item.evidenceUsed.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Evidence Analyzed:</span>
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
                        💡 <strong>Recommended Action:</strong> {item.recommendedAction}
                      </div>

                      <div className="flex items-center gap-2">
                        {item.assessmentAvailable && (
                          <button
                            onClick={() => handleStartAssessment(item)}
                            className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>Take Assessment</span>
                          </button>
                        )}
                        <button
                          onClick={() => setEvidenceModalItem(item)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Add Evidence</span>
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
              <strong>Understanding "Insufficient Evidence":</strong> AfriPath AI does not assume you have a gap simply because a skill was not listed. Rather than penalizing you, you can verify your proficiency by taking our 3-minute quiz or documenting relevant projects.
            </div>

            {insufficientItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-800/40">
                      Insufficient Evidence
                    </span>
                    <h3 className="text-sm font-bold text-white">{item.competencyName}</h3>
                  </div>

                  <span className="text-xs text-slate-400">
                    Pathway Requirement: <strong className="text-slate-200">{item.requiredProficiencyLabel}</strong>
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
                      <span>Take 3-Min Assessment</span>
                    </button>
                  )}

                  <button
                    onClick={() => setEvidenceModalItem(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Project or Course Evidence</span>
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
              <strong>Verified Pathway Alignment:</strong> The following competencies meet or exceed the expected level for your target role based on your academic training, verified projects, and assessments.
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
                      Meets Requirement
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
              <strong>Targeted Growth Accelerators:</strong> These are high-yield complementary skills tailored to your {userProfile.discipline || userProfile.fieldOfStudy} background that distinguish candidates in the regional job market.
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
          <h3 className="text-sm font-bold text-white">Translate your diagnostics into a personalized roadmap</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Access weekly milestones, structured projects, and verified milestones for {targetCareer}.
          </p>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm shrink-0"
        >
          <span>Launch 90-Day Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
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
                  Skill Assessment: {assessmentModalItem.competencyName}
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
                  Answer the following questions to verify your practical competency level in{' '}
                  <span className="text-white font-semibold">{assessmentModalItem.competencyName}</span>.
                </p>

                {(assessmentModalItem.assessmentQuestions || []).map((q, qIdx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                    <div className="text-xs font-semibold text-white">
                      {qIdx + 1}. {q.question}
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
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(selectedAnswers).length <
                      (assessmentModalItem.assessmentQuestions?.length || 0)
                    }
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition"
                  >
                    Submit Answers
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-400 font-bold text-2xl mx-auto">
                  {quizScore}%
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Assessment Complete</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Your score has been verified. Your proficiency confidence for{' '}
                    <span className="text-white font-medium">{assessmentModalItem.competencyName}</span> is now upgraded to{' '}
                    <span className="text-emerald-400 font-bold">HIGH</span>.
                  </p>
                </div>
                <button
                  onClick={() => setAssessmentModalItem(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
                >
                  Return to Gap Analysis
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
                  Add Evidence: {evidenceModalItem.competencyName}
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
                <label className="block text-slate-300 font-semibold mb-1">Evidence Type</label>
                <select
                  value={evidenceSource}
                  onChange={(e: any) => setEvidenceSource(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="project_deliverable">Hands-on Project / Deliverable</option>
                  <option value="work_experience">Internship / Work Experience</option>
                  <option value="certification">Course / Certification Credential</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Describe what you built or accomplished
                </label>
                <textarea
                  rows={4}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                  placeholder="e.g. Built student database using PostgreSQL, wrote complex joins, and prepared monthly reports."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEvidenceModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvidence}
                disabled={!evidenceText.trim() || isSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                {isSubmitting ? 'Saving...' : 'Save Evidence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
