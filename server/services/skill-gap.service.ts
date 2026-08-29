import {
  getCareerCompetencies,
  CompetencyRequirement,
  SkillProficiencyLevel,
  PROFICIENCY_DESCRIPTIONS,
} from './career-requirement.service';
import {
  SkillEvidenceService,
  SkillEvidenceRecord,
  EvaluatedUserSkill,
} from './skill-evidence.service';
import { UserProfile } from '../../src/types/career';

export type GapClassification =
  | 'NO_GAP'
  | 'MINOR_GAP'
  | 'MODERATE_GAP'
  | 'SIGNIFICANT_GAP'
  | 'INSUFFICIENT_EVIDENCE'
  | 'TRANSFERABLE_FOUNDATION';

export interface EvaluatedGapItem {
  id: string;
  competencyName: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'Technical' | 'Soft' | 'Domain' | 'Tool' | 'Vocational';
  requiredProficiency: SkillProficiencyLevel;
  requiredProficiencyLabel: string;
  currentProficiency: SkillProficiencyLevel;
  currentProficiencyLabel: string;
  userConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  classification: GapClassification;
  displayStatusBadge: string;
  reasonExplanation: string;
  evidenceUsed: string[];
  recommendedAction: string;
  transferableFromSource?: string;
  recommendedResources: {
    title: string;
    provider: string;
    url: string;
    isFree: boolean;
    type: string;
    africanProvider?: boolean;
  }[];
  assessmentAvailable: boolean;
  assessmentQuestions?: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  priorityOrder: number; // For sorting
}

export interface DetailedSkillGapReport {
  targetCareer: string;
  pathway: string;
  fieldOfStudy: string;
  discipline: string;
  readinessScore: number; // 0 - 100
  topPriorities: EvaluatedGapItem[];
  meetsRequirements: EvaluatedGapItem[];
  insufficientEvidenceItems: EvaluatedGapItem[];
  additionalAreas: EvaluatedGapItem[];
  skillRecommendations: {
    skillName: string;
    reason: string;
    category: string;
  }[];
  executiveSummary: string;
  totalCompetenciesEvaluated: number;
  unmetPriorityCount: number;
}

export class SkillGapEngine {
  /**
   * Runs the complete grounded Real-Time Skill Gap Pipeline.
   */
  public static analyze(
    profile: UserProfile,
    targetCareer: string,
    customEvidenceList: SkillEvidenceRecord[] = [],
    assessments: Record<string, number> = {}
  ): DetailedSkillGapReport {
    const pathway = profile.preferredPathway || 'University / Degree';
    const fieldOfStudy = profile.fieldOfStudy || 'General';
    const discipline = profile.discipline || 'General Specialization';

    // 1. Get structured career competency requirements for target career
    const careerCompetencies = getCareerCompetencies(targetCareer, pathway, fieldOfStudy, discipline);

    // 2. Evaluate all user skills with multi-source evidence
    const evaluatedUserSkills = SkillEvidenceService.evaluateAllUserSkills(
      profile,
      customEvidenceList,
      assessments
    );

    const evaluatedGaps: EvaluatedGapItem[] = [];

    // 3. Compare each requirement against user's verified evidence
    careerCompetencies.forEach((req) => {
      const matchedUserSkill = SkillEvidenceService.matchCompetencyWithUserSkills(
        req.name,
        req.transferableFrom,
        evaluatedUserSkills
      );

      const gapItem = this.evaluateSingleCompetency(req, matchedUserSkill, targetCareer);
      evaluatedGaps.push(gapItem);
    });

    // 4. Categorize items into prioritized buckets
    const meetsRequirements: EvaluatedGapItem[] = [];
    const topPriorities: EvaluatedGapItem[] = [];
    const insufficientEvidenceItems: EvaluatedGapItem[] = [];
    const additionalAreas: EvaluatedGapItem[] = [];

    evaluatedGaps.forEach((item) => {
      if (item.classification === 'NO_GAP') {
        meetsRequirements.push(item);
      } else if (item.classification === 'INSUFFICIENT_EVIDENCE') {
        insufficientEvidenceItems.push(item);
      } else if (
        item.importance === 'HIGH' ||
        item.classification === 'SIGNIFICANT_GAP' ||
        item.classification === 'MODERATE_GAP'
      ) {
        topPriorities.push(item);
      } else {
        additionalAreas.push(item);
      }
    });

    // Sort Top Priorities by importance and gap magnitude
    topPriorities.sort((a, b) => b.priorityOrder - a.priorityOrder);

    // 5. Calculate genuine Readiness Score based on verified competencies
    const totalWeight = careerCompetencies.reduce(
      (sum, c) => sum + (c.importance === 'HIGH' ? 3 : c.importance === 'MEDIUM' ? 2 : 1),
      0
    );

    let earnedWeight = 0;
    evaluatedGaps.forEach((gap) => {
      const weight = gap.importance === 'HIGH' ? 3 : gap.importance === 'MEDIUM' ? 2 : 1;
      const ratio = Math.min(1, gap.currentProficiency / Math.max(1, gap.requiredProficiency));
      earnedWeight += weight * ratio;
    });

    const readinessScore = Math.min(98, Math.max(15, Math.round((earnedWeight / Math.max(1, totalWeight)) * 100)));

    // 6. Separate Skill Recommendations from Skill Gaps
    const skillRecommendations = this.generateTargetedRecommendations(
      targetCareer,
      fieldOfStudy,
      discipline,
      evaluatedUserSkills
    );

    // 7. Grounded Executive Summary
    const executiveSummary = this.generateExecutiveSummary(
      profile,
      targetCareer,
      readinessScore,
      meetsRequirements,
      topPriorities,
      insufficientEvidenceItems
    );

    return {
      targetCareer,
      pathway,
      fieldOfStudy,
      discipline,
      readinessScore,
      topPriorities,
      meetsRequirements,
      insufficientEvidenceItems,
      additionalAreas,
      skillRecommendations,
      executiveSummary,
      totalCompetenciesEvaluated: careerCompetencies.length,
      unmetPriorityCount: topPriorities.length,
    };
  }

  private static evaluateSingleCompetency(
    req: CompetencyRequirement,
    matchedUserSkill: EvaluatedUserSkill | null,
    targetCareer: string
  ): EvaluatedGapItem {
    const requiredLevel = req.requiredProficiency;
    const requiredLabel = PROFICIENCY_DESCRIPTIONS[requiredLevel].label;

    // Case A: User has no evidence for this skill and no transferable match
    if (!matchedUserSkill) {
      return {
        id: req.id,
        competencyName: req.name,
        importance: req.importance,
        category: req.category,
        requiredProficiency: requiredLevel,
        requiredProficiencyLabel: requiredLabel,
        currentProficiency: 0,
        currentProficiencyLabel: PROFICIENCY_DESCRIPTIONS[0].label,
        userConfidence: 'UNKNOWN',
        classification: 'INSUFFICIENT_EVIDENCE',
        displayStatusBadge: 'Insufficient Evidence',
        reasonExplanation: `${req.name} is a ${req.importance.toLowerCase()}-importance competency for the ${targetCareer} pathway, but we don't have enough documented evidence or assessment results in your profile to determine your proficiency.`,
        evidenceUsed: ['No coursework, project deliverable, or assessment recorded yet.'],
        recommendedAction: `Provide evidence, add relevant projects, or take the 3-minute ${req.name} assessment to verify your level.`,
        recommendedResources: req.recommendedResources,
        assessmentAvailable: !!req.assessmentQuestions && req.assessmentQuestions.length > 0,
        assessmentQuestions: req.assessmentQuestions,
        priorityOrder: req.importance === 'HIGH' ? 8 : 4,
      };
    }

    // Case B: Transferable skill foundation recognized
    if (matchedUserSkill.isTransferable) {
      return {
        id: req.id,
        competencyName: req.name,
        importance: req.importance,
        category: req.category,
        requiredProficiency: requiredLevel,
        requiredProficiencyLabel: requiredLabel,
        currentProficiency: matchedUserSkill.proficiency,
        currentProficiencyLabel: PROFICIENCY_DESCRIPTIONS[matchedUserSkill.proficiency].label,
        userConfidence: matchedUserSkill.confidence,
        classification: 'TRANSFERABLE_FOUNDATION',
        displayStatusBadge: 'Transferable Foundation',
        reasonExplanation: `Your documented background provides transferable foundations for ${req.name}. ${matchedUserSkill.transferableNote || ''}`,
        evidenceUsed: matchedUserSkill.evidenceDetails,
        recommendedAction: `Deepen your practical application from your foundation to reach the required ${requiredLabel} level.`,
        transferableFromSource: matchedUserSkill.transferableNote,
        recommendedResources: req.recommendedResources,
        assessmentAvailable: !!req.assessmentQuestions && req.assessmentQuestions.length > 0,
        assessmentQuestions: req.assessmentQuestions,
        priorityOrder: req.importance === 'HIGH' ? 7 : 3,
      };
    }

    const currentLevel = matchedUserSkill.proficiency;
    const currentLabel = PROFICIENCY_DESCRIPTIONS[currentLevel].label;
    const diff = requiredLevel - currentLevel;

    // Case C: NO GAP - User meets or exceeds requirement
    if (diff <= 0) {
      return {
        id: req.id,
        competencyName: req.name,
        importance: req.importance,
        category: req.category,
        requiredProficiency: requiredLevel,
        requiredProficiencyLabel: requiredLabel,
        currentProficiency: currentLevel,
        currentProficiencyLabel: currentLabel,
        userConfidence: matchedUserSkill.confidence,
        classification: 'NO_GAP',
        displayStatusBadge: 'Meets Expected Level',
        reasonExplanation: `${req.name} already meets or exceeds the expected proficiency (${requiredLabel}) for the ${targetCareer} pathway based on your verified evidence.`,
        evidenceUsed: matchedUserSkill.evidenceDetails,
        recommendedAction: `Maintain your active proficiency and document advanced deliverables in your portfolio.`,
        recommendedResources: req.recommendedResources,
        assessmentAvailable: false,
        priorityOrder: 0,
      };
    }

    // Case D: Real Gap (Minor, Moderate, or Significant)
    let classification: GapClassification = 'MODERATE_GAP';
    let badge = 'Moderate Gap';
    let priorityOrder = 5;

    if (diff === 1 && req.importance !== 'HIGH') {
      classification = 'MINOR_GAP';
      badge = 'Minor Gap';
      priorityOrder = 2;
    } else if (diff >= 3 || (diff >= 2 && req.importance === 'HIGH')) {
      classification = 'SIGNIFICANT_GAP';
      badge = 'Significant Gap';
      priorityOrder = req.importance === 'HIGH' ? 10 : 8;
    } else {
      classification = 'MODERATE_GAP';
      badge = 'Moderate Gap';
      priorityOrder = req.importance === 'HIGH' ? 9 : 6;
    }

    const reason = `${req.name} is a ${req.importance.toLowerCase()}-priority competency for your selected ${targetCareer} pathway. Your current verified evidence shows ${currentLabel.toLowerCase()} level (${matchedUserSkill.confidence.toLowerCase()} confidence), while this role requires ${requiredLabel.toLowerCase()} proficiency.`;

    return {
      id: req.id,
      competencyName: req.name,
      importance: req.importance,
      category: req.category,
      requiredProficiency: requiredLevel,
      requiredProficiencyLabel: requiredLabel,
      currentProficiency: currentLevel,
      currentProficiencyLabel: currentLabel,
      userConfidence: matchedUserSkill.confidence,
      classification,
      displayStatusBadge: badge,
      reasonExplanation: reason,
      evidenceUsed: matchedUserSkill.evidenceDetails,
      recommendedAction: `Focus on guided practice, targeted learning modules, or a hands-on project to bridge from ${currentLabel} to ${requiredLabel}.`,
      recommendedResources: req.recommendedResources,
      assessmentAvailable: !!req.assessmentQuestions && req.assessmentQuestions.length > 0,
      assessmentQuestions: req.assessmentQuestions,
      priorityOrder,
    };
  }

  private static generateTargetedRecommendations(
    targetCareer: string,
    fieldOfStudy: string,
    discipline: string,
    evaluatedSkills: Map<string, EvaluatedUserSkill>
  ): { skillName: string; reason: string; category: string }[] {
    const recommendations: { skillName: string; reason: string; category: string }[] = [];

    const normCareer = targetCareer.toLowerCase();
    const hasSkill = (s: string) => evaluatedSkills.has(s.toLowerCase());

    if (normCareer.includes('developer') || normCareer.includes('software') || normCareer.includes('tech')) {
      if (!hasSkill('Docker & Containerization')) {
        recommendations.push({
          skillName: 'Docker & Containerization',
          reason: 'Modern African tech startups use containers for local development and Cloud Run deployments.',
          category: 'Tool',
        });
      }
      if (!hasSkill('Automated Unit Testing')) {
        recommendations.push({
          skillName: 'Automated Unit Testing (Jest / PyTest)',
          reason: 'Writing unit tests makes your pull requests stand out to international engineering managers.',
          category: 'Technical',
        });
      }
    } else if (normCareer.includes('analyst') || normCareer.includes('finance')) {
      if (!hasSkill('Power Query & ETL')) {
        recommendations.push({
          skillName: 'Power Query & ETL Automation',
          reason: 'Automates daily spreadsheet imports and saves hours of manual reconciliation.',
          category: 'Tool',
        });
      }
    } else if (normCareer.includes('agri') || normCareer.includes('farm')) {
      if (!hasSkill('GIS Drone Mapping')) {
        recommendations.push({
          skillName: 'Drone & Satellite Vegetation Index (NDVI)',
          reason: 'Useful for large commercial farm crop stress monitoring and yield forecasting.',
          category: 'Technical',
        });
      }
    }

    return recommendations;
  }

  private static generateExecutiveSummary(
    profile: UserProfile,
    targetCareer: string,
    score: number,
    meets: EvaluatedGapItem[],
    priorities: EvaluatedGapItem[],
    insufficient: EvaluatedGapItem[]
  ): string {
    const verifiedStrengths = meets.map((m) => m.competencyName).join(', ');
    const criticalGaps = priorities.map((p) => p.competencyName).join(', ');

    if (score >= 75) {
      return `Your academic training in ${profile.fieldOfStudy || 'your discipline'} at ${profile.institution || 'university'} has established a strong foundation (${score}% readiness). You already meet expected competencies in ${verifiedStrengths || 'core fundamentals'}. To achieve complete job readiness for ${targetCareer}, focus on bridging ${criticalGaps || 'specialized tools'}.`;
    }

    if (score >= 45) {
      return `You have established verified fundamentals with a readiness score of ${score}%. Your strengths in ${verifiedStrengths || 'core areas'} provide a solid launchpad. By completing targeted hands-on projects in ${criticalGaps || 'key priority competencies'}, you will rapidly elevate your qualification for ${targetCareer}.`;
    }

    return `Diagnostic analysis indicates an emerging readiness foundation (${score}%). We have identified ${priorities.length} high-yield priority areas (${criticalGaps || 'core technical competencies'}) where focused practice and verified projects will create the largest impact for your ${targetCareer} pathway.`;
  }
}
