import { CVData } from '../../src/types/career';

export interface CVVersionRecord {
  versionId: string;
  versionNumber: number;
  label: string;
  timestamp: string;
  cvData: CVData;
  isConfirmed: boolean;
}

export class CVVersionService {
  private static versionStore = new Map<string, CVVersionRecord[]>();

  public static saveVersion(userId: string, cvData: CVData, label?: string): CVVersionRecord {
    const list = this.versionStore.get(userId) || [];
    const versionNumber = list.length + 1;
    const versionRecord: CVVersionRecord = {
      versionId: `ver-${Date.now()}-${versionNumber}`,
      versionNumber,
      label: label || (versionNumber === 1 ? 'Initial AI Generation' : `Revision v${versionNumber}`),
      timestamp: new Date().toISOString(),
      cvData: JSON.parse(JSON.stringify(cvData)),
      isConfirmed: !!cvData.userConfirmedAllFacts,
    };

    list.push(versionRecord);
    this.versionStore.set(userId, list);
    return versionRecord;
  }

  public static getVersions(userId: string): CVVersionRecord[] {
    return this.versionStore.get(userId) || [];
  }

  /**
   * Regenerates professional phrasing while preserving all underlying user facts.
   */
  public static polishWordingPreservingFacts(cv: CVData): CVData {
    const cloned: CVData = JSON.parse(JSON.stringify(cv));

    // Refine summary phrasing without adding new facts
    if (cloned.personalInfo.summary) {
      cloned.personalInfo.summary = cloned.personalInfo.summary
        .replace(/Motivated/i, 'Goal-oriented')
        .replace(/hands-on proficiency in/i, 'demonstrated technical capabilities in')
        .replace(/Eager to contribute directly/i, 'Prepared to deliver measurable value');
    }

    // Refine experience action verbs while strictly keeping the same subject
    cloned.experience.forEach((exp) => {
      exp.bulletPoints = exp.bulletPoints.map((bp) => {
        let refined = bp;
        if (refined.startsWith('Applied')) {
          refined = refined.replace('Applied', 'Leveraged');
        } else if (refined.startsWith('Collaborated')) {
          refined = refined.replace('Collaborated', 'Partnered cross-functionally');
        } else if (refined.startsWith('Maintained')) {
          refined = refined.replace('Maintained', 'Upheld strict');
        }
        return refined;
      });
    });

    return cloned;
  }

  /**
   * Formats clean structured plain text / markdown / DOCX-ready representation of the confirmed CV.
   */
  public static formatDocxText(cv: CVData): string {
    const lines: string[] = [];

    lines.push(cv.personalInfo.fullName.toUpperCase());
    lines.push(`${cv.personalInfo.location} | ${cv.personalInfo.email} | ${cv.personalInfo.phone}`);
    if (cv.personalInfo.linkedinUrl || cv.personalInfo.portfolioUrl) {
      lines.push(`${cv.personalInfo.linkedinUrl || ''} ${cv.personalInfo.portfolioUrl || ''}`.trim());
    }
    lines.push('\n------------------------------------------------------------\n');

    lines.push('PROFESSIONAL SUMMARY');
    lines.push(cv.personalInfo.summary);
    lines.push('\n------------------------------------------------------------\n');

    lines.push('EDUCATION');
    cv.education.forEach((edu) => {
      lines.push(`${edu.degree.toUpperCase()}`);
      lines.push(`${edu.institution} | ${edu.location || ''} | ${edu.endDate}`);
      if (edu.relevantCoursework && edu.relevantCoursework.length > 0) {
        lines.push(`Relevant Coursework: ${edu.relevantCoursework.join(', ')}`);
      }
      lines.push('');
    });
    lines.push('------------------------------------------------------------\n');

    lines.push('EXPERIENCE');
    cv.experience.forEach((exp) => {
      lines.push(`${exp.title.toUpperCase()} — ${exp.company}`);
      lines.push(`${exp.startDate} - ${exp.endDate} | ${exp.location || ''}`);
      exp.bulletPoints.forEach((b) => lines.push(`• ${b}`));
      lines.push('');
    });
    lines.push('------------------------------------------------------------\n');

    lines.push('TECHNICAL & CORE SKILLS');
    lines.push(`Technical Skills: ${cv.skills.technical.join(', ')}`);
    lines.push(`Soft Skills: ${cv.skills.soft.join(', ')}`);
    if (cv.skills.toolsAndFrameworks && cv.skills.toolsAndFrameworks.length > 0) {
      lines.push(`Tools & Technologies: ${cv.skills.toolsAndFrameworks.join(', ')}`);
    }
    lines.push('\n------------------------------------------------------------\n');

    if (cv.projects && cv.projects.length > 0) {
      lines.push('PROJECTS');
      cv.projects.forEach((p) => {
        lines.push(`${p.title} (${p.roleOrContext || 'Project'})`);
        if (p.toolsUsed && p.toolsUsed.length > 0) {
          lines.push(`Technologies: ${p.toolsUsed.join(', ')}`);
        }
        p.bulletPoints.forEach((b) => lines.push(`• ${b}`));
        lines.push('');
      });
      lines.push('------------------------------------------------------------\n');
    }

    if (cv.certifications && cv.certifications.length > 0) {
      lines.push('CERTIFICATIONS');
      cv.certifications.forEach((c) => {
        lines.push(`• ${c.title} — ${c.issuer} (${c.issueDate})`);
      });
      lines.push('\n------------------------------------------------------------\n');
    }

    if (cv.references && cv.references.length > 0) {
      lines.push('REFERENCES');
      cv.references.forEach((r) => {
        lines.push(`• ${r.name}, ${r.title} at ${r.organization} (${r.contact})`);
      });
    }

    return lines.join('\n');
  }
}
