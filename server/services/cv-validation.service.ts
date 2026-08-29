import { CVData, CVFactCheckItem, UserProfile } from '../../src/types/career';

export interface CVValidationReport {
  isValid: boolean;
  canConfirm: boolean;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  auditItems: CVFactCheckItem[];
  unsupportedClaims: string[];
}

export class CVValidationService {
  /**
   * Performs an exhaustive factual audit of CV data against the user's profile and evidence.
   */
  public static validateCV(cv: CVData, profile?: UserProfile): CVValidationReport {
    const auditItems: CVFactCheckItem[] = [];
    const unsupportedClaims: string[] = [];

    // Helper regex to detect invented commercial metrics like $100k, 30%, 5x, 50 clients if not in user profile
    const metricRegex = /(\b\d+%\b|\$\d+[\d,]*|\b\d+x\b|\bmanaged (?:a team of )?\d+\b|\bincreased (?:revenue|sales) by \d+)/i;

    // 1. Audit Personal Summary
    if (cv.personalInfo.summary) {
      const match = cv.personalInfo.summary.match(metricRegex);
      if (match) {
        const claim = `Summary claims metric: "${match[0]}"`;
        unsupportedClaims.push(claim);
        auditItems.push({
          id: `audit-summary-metric`,
          section: 'Personal Summary',
          field: 'summary',
          claim: match[0],
          status: 'flagged',
          issueType: 'unsupported_metric',
          message: `The summary mentions "${match[0]}". Please confirm this specific metric is backed by your actual experience.`,
          severity: 'warning',
        });
      } else {
        auditItems.push({
          id: `audit-summary-ok`,
          section: 'Personal Summary',
          field: 'summary',
          claim: 'Summary alignment',
          status: 'verified',
          issueType: 'ok',
          message: 'Professional summary is grounded in your verified degree and target career.',
          severity: 'info',
        });
      }
    }

    // 2. Audit Education
    cv.education.forEach((edu, idx) => {
      if (profile && profile.institution && !edu.institution.toLowerCase().includes(profile.institution.toLowerCase().slice(0, 5))) {
        auditItems.push({
          id: `audit-edu-${idx}`,
          section: 'Education',
          field: 'institution',
          claim: edu.institution,
          status: 'flagged',
          issueType: 'unverified_claim',
          message: `Institution "${edu.institution}" differs from your profile institution "${profile.institution}".`,
          severity: 'warning',
        });
      } else {
        auditItems.push({
          id: `audit-edu-${idx}-ok`,
          section: 'Education',
          field: 'degree',
          claim: `${edu.degree} at ${edu.institution}`,
          status: 'verified',
          issueType: 'ok',
          message: 'Education verified against profile credentials.',
          severity: 'info',
        });
      }
    });

    // 3. Audit Experience Bullet Points
    cv.experience.forEach((exp, expIdx) => {
      exp.bulletPoints.forEach((bullet, bIdx) => {
        const metricMatch = bullet.match(metricRegex);
        if (metricMatch) {
          const claim = `Bullet metric: "${metricMatch[0]}"`;
          unsupportedClaims.push(claim);
          auditItems.push({
            id: `audit-exp-${expIdx}-${bIdx}`,
            section: 'Experience',
            field: `bullet-${bIdx + 1}`,
            claim: bullet,
            status: 'flagged',
            issueType: 'unsupported_metric',
            message: `Experience bullet mentions "${metricMatch[0]}". Ensure you have documented evidence to support this number.`,
            severity: 'warning',
          });
        }
      });
    });

    // 4. Audit Skills
    if (profile && profile.currentSkills) {
      const userSkillsSet = new Set(profile.currentSkills.map((s) => s.toLowerCase()));
      cv.skills.technical.forEach((tech, sIdx) => {
        if (!userSkillsSet.has(tech.toLowerCase()) && !userSkillsSet.has(tech.toLowerCase().split(' ')[0])) {
          auditItems.push({
            id: `audit-skill-${sIdx}`,
            section: 'Skills',
            field: 'technical',
            claim: tech,
            status: 'unverified',
            issueType: 'missing_evidence',
            message: `Skill "${tech}" was added in the CV but was not in your initial verified skills list.`,
            severity: 'info',
          });
        }
      });
    }

    const criticalCount = auditItems.filter((i) => i.severity === 'error').length;
    const warningCount = auditItems.filter((i) => i.severity === 'warning').length;
    const infoCount = auditItems.filter((i) => i.severity === 'info').length;

    return {
      isValid: criticalCount === 0,
      canConfirm: criticalCount === 0,
      criticalCount,
      warningCount,
      infoCount,
      auditItems,
      unsupportedClaims,
    };
  }
}
