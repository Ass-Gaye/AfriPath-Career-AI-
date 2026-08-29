import { SkillProficiencyLevel } from './career-requirement.service';
import { UserProfile } from '../../src/types/career';

export type EvidenceSourceType =
  | 'self_reported'
  | 'user_evidence_text'
  | 'education_foundation'
  | 'work_experience'
  | 'project_deliverable'
  | 'certification'
  | 'assessment_score'
  | 'transferable_skill';

export interface SkillEvidenceRecord {
  id: string;
  skillName: string;
  sourceType: EvidenceSourceType;
  description: string;
  verifiedScore?: number; // 0 - 100 if assessment
  dateAdded: string;
}

export interface EvaluatedUserSkill {
  skillName: string;
  proficiency: SkillProficiencyLevel; // 0 - 5
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  sources: EvidenceSourceType[];
  evidenceDetails: string[];
  isTransferable: boolean;
  transferableNote?: string;
  assessmentScore?: number;
}

export class SkillEvidenceService {
  /**
   * Evaluates all known skills and evidence from the user's profile and attached evidence records.
   */
  public static evaluateAllUserSkills(
    profile: UserProfile,
    customEvidenceList: SkillEvidenceRecord[] = [],
    assessments: Record<string, number> = {}
  ): Map<string, EvaluatedUserSkill> {
    const evaluatedMap = new Map<string, EvaluatedUserSkill>();

    const normalize = (s: string) => s.toLowerCase().trim();

    // 1. Process Self-Reported Skills (currentSkills & softSkills)
    const allSelfReported = [
      ...(profile.currentSkills || []),
      ...(profile.softSkills || []),
    ];

    allSelfReported.forEach((skill) => {
      const key = normalize(skill);
      if (!evaluatedMap.has(key)) {
        evaluatedMap.set(key, {
          skillName: skill,
          proficiency: 2, // Baseline Beginner for self-reported (not automatically Advanced)
          confidence: 'LOW',
          sources: ['self_reported'],
          evidenceDetails: ['Self-reported in career profile.'],
          isTransferable: false,
        });
      }
    });

    // 2. Extract Evidence from Education
    const field = profile.fieldOfStudy || '';
    const disc = profile.discipline || '';
    const institution = profile.institution || '';
    const eduLevel = profile.educationLevel || '';

    if (field || disc) {
      const eduSummary = `${eduLevel} in ${disc ? `${disc} (${field})` : field} at ${institution || 'recognized institution'}`;

      // Education provides foundation (Awareness / Beginner: Level 1-2) with appropriate academic wording
      const potentialEduSkills = [field, disc].filter(Boolean);
      potentialEduSkills.forEach((eduSkill) => {
        const key = normalize(eduSkill);
        const existing = evaluatedMap.get(key);
        if (existing) {
          if (!existing.sources.includes('education_foundation')) {
            existing.sources.push('education_foundation');
            existing.evidenceDetails.push(`Academic background provides relevant foundations (${eduSummary}).`);
            if (existing.confidence === 'LOW') existing.confidence = 'MEDIUM';
            if (existing.proficiency < 2) existing.proficiency = 2;
          }
        } else {
          evaluatedMap.set(key, {
            skillName: eduSkill,
            proficiency: 2,
            confidence: 'MEDIUM',
            sources: ['education_foundation'],
            evidenceDetails: [`Academic training provides foundational knowledge (${eduSummary}).`],
            isTransferable: false,
          });
        }
      });
    }

    // 3. Extract Evidence from Work Experience
    const cvRaw = profile.cvRawText || '';
    // Look for verified competencies attached to profile
    if (profile.verifiedCompetencies && profile.verifiedCompetencies.length > 0) {
      profile.verifiedCompetencies.forEach((vc) => {
        const key = normalize(vc.competency);
        const existing = evaluatedMap.get(key);
        const sourceMap: Record<string, EvidenceSourceType> = {
          experience: 'work_experience',
          project: 'project_deliverable',
          education: 'education_foundation',
          user_claim: 'self_reported',
        };
        const src = sourceMap[vc.sourceType] || 'user_evidence_text';

        if (existing) {
          if (!existing.sources.includes(src)) existing.sources.push(src);
          if (vc.evidenceText) existing.evidenceDetails.push(vc.evidenceText);
          if (vc.isVerified) {
            existing.confidence = 'HIGH';
            if (existing.proficiency < 3) existing.proficiency = 3;
          }
        } else {
          evaluatedMap.set(key, {
            skillName: vc.competency,
            proficiency: vc.isVerified ? 3 : 2,
            confidence: vc.isVerified ? 'HIGH' : 'MEDIUM',
            sources: [src],
            evidenceDetails: vc.evidenceText ? [vc.evidenceText] : ['Documented in verified profile experience.'],
            isTransferable: false,
          });
        }
      });
    }

    // 4. Incorporate Custom Evidence List
    customEvidenceList.forEach((ev) => {
      const key = normalize(ev.skillName);
      const existing = evaluatedMap.get(key);

      if (existing) {
        if (!existing.sources.includes(ev.sourceType)) existing.sources.push(ev.sourceType);
        existing.evidenceDetails.push(ev.description);
        // Evidence upgrades confidence & proficiency
        if (ev.sourceType === 'assessment_score' && ev.verifiedScore !== undefined) {
          existing.assessmentScore = ev.verifiedScore;
          existing.confidence = 'HIGH';
          if (ev.verifiedScore >= 80) existing.proficiency = 4;
          else if (ev.verifiedScore >= 60) existing.proficiency = 3;
          else existing.proficiency = 2;
        } else {
          if (existing.confidence === 'LOW') existing.confidence = 'MEDIUM';
          if (existing.sources.length >= 2) existing.confidence = 'HIGH';
          if (existing.proficiency < 3) existing.proficiency = 3;
        }
      } else {
        const prof: SkillProficiencyLevel =
          ev.sourceType === 'assessment_score' && ev.verifiedScore
            ? ev.verifiedScore >= 80
              ? 4
              : ev.verifiedScore >= 60
              ? 3
              : 2
            : 2;

        evaluatedMap.set(key, {
          skillName: ev.skillName,
          proficiency: prof,
          confidence: ev.sourceType === 'assessment_score' ? 'HIGH' : 'MEDIUM',
          sources: [ev.sourceType],
          evidenceDetails: [ev.description],
          isTransferable: false,
          assessmentScore: ev.verifiedScore,
        });
      }
    });

    // 5. Incorporate Assessment Scores
    Object.entries(assessments).forEach(([skill, score]) => {
      const key = normalize(skill);
      const existing = evaluatedMap.get(key);
      const profLevel: SkillProficiencyLevel = score >= 85 ? 4 : score >= 65 ? 3 : score >= 40 ? 2 : 1;

      if (existing) {
        existing.assessmentScore = score;
        existing.confidence = 'HIGH';
        existing.proficiency = Math.max(existing.proficiency, profLevel) as SkillProficiencyLevel;
        if (!existing.sources.includes('assessment_score')) existing.sources.push('assessment_score');
        existing.evidenceDetails.push(`Assessment passed with verified score of ${score}%.`);
      } else {
        evaluatedMap.set(key, {
          skillName: skill,
          proficiency: profLevel,
          confidence: 'HIGH',
          sources: ['assessment_score'],
          evidenceDetails: [`Skill assessment completed with score of ${score}%.`],
          isTransferable: false,
          assessmentScore: score,
        });
      }
    });

    return evaluatedMap;
  }

  /**
   * Finds matching or transferable skills for a required competency.
   */
  public static matchCompetencyWithUserSkills(
    requiredSkillName: string,
    transferableFrom: string[] = [],
    evaluatedMap: Map<string, EvaluatedUserSkill>
  ): EvaluatedUserSkill | null {
    const normalize = (s: string) => s.toLowerCase().trim();
    const reqKey = normalize(requiredSkillName);

    // 1. Direct Match (Exact or Substring)
    for (const [key, userSkill] of evaluatedMap.entries()) {
      if (
        key === reqKey ||
        key.includes(reqKey) ||
        reqKey.includes(key) ||
        (reqKey.includes('sql') && key.includes('sql')) ||
        (reqKey.includes('excel') && key.includes('excel')) ||
        (reqKey.includes('react') && key.includes('react')) ||
        (reqKey.includes('python') && key.includes('python'))
      ) {
        return userSkill;
      }
    }

    // 2. Transferable Match Check
    for (const trans of transferableFrom) {
      const transKey = normalize(trans);
      for (const [userKey, userSkill] of evaluatedMap.entries()) {
        if (userKey === transKey || userKey.includes(transKey) || transKey.includes(userKey)) {
          // Return a derived transferable skill
          return {
            skillName: requiredSkillName,
            proficiency: Math.min(2, userSkill.proficiency) as SkillProficiencyLevel, // Transferable gives foundation (1-2)
            confidence: 'MEDIUM',
            sources: [...userSkill.sources, 'transferable_skill'],
            evidenceDetails: [
              ...userSkill.evidenceDetails,
              `Your verified experience in ${userSkill.skillName} provides transferable foundations for ${requiredSkillName}.`,
            ],
            isTransferable: true,
            transferableNote: `Transferable foundation from ${userSkill.skillName}.`,
          };
        }
      }
    }

    return null;
  }
}
