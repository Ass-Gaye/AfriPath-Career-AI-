export type EducationLevel =
  | 'High School / WASSCE'
  | 'Diploma / TVET Certificate'
  | 'Bachelor’s Degree'
  | 'Master’s Degree'
  | 'Self-Taught / Bootcamps';

export interface UserProfile {
  id: string;
  name: string;
  age: number | string;
  location: string;
  educationLevel: EducationLevel;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  currentSkills: string[];
  softSkills: string[];
  interests: string[];
  careerGoal: string;
  targetIndustries: string[];
  cvFileName?: string;
  cvRawText?: string;
  experienceYears?: string;
  preferredWorkType?: 'Local (Gambia)' | 'Remote (Global)' | 'Hybrid' | 'Flexible';
}

export interface CareerMatch {
  id: string;
  title: string;
  matchScore: number;
  industry: string;
  tagline: string;
  reason: string;
  marketDemandGambia: 'Very High' | 'High' | 'Growing' | 'Specialized';
  salaryRangeGMD: string;
  salaryRangeUSD: string;
  matchingSkills: string[];
  missingSkills: string[];
  gambianEmployers: string[];
  growthPotential: string;
  difficultyToTransition: 'Low' | 'Moderate' | 'Challenging';
  sampleJobTitles: string[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Technical' | 'Soft' | 'Tool' | 'Domain';
  priority: 'Critical' | 'High' | 'Medium';
  estimatedHours: number;
  estimatedWeeks: number;
  description: string;
  recommendedResources: {
    title: string;
    provider: string;
    url: string;
    isFree: boolean;
    type: 'Course' | 'Project' | 'Certification' | 'Tutorial';
  }[];
}

export interface SkillGapAnalysis {
  targetCareer: string;
  ownedSkills: string[];
  skillGaps: SkillGapItem[];
  overallReadinessScore: number;
  aiSummary: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focus: string;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    estimatedHours: number;
    resourceLink?: string;
  }[];
  milestoneDeliverable: string;
}

export interface RoadmapMonth {
  month: number;
  phaseName: string;
  theme: string;
  description: string;
  weeks: RoadmapWeek[];
}

export interface CareerRoadmap {
  targetCareer: string;
  targetTimeframeDays: number;
  months: RoadmapMonth[];
  keyOutcomes: string[];
  weeklyHoursRecommended: number;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Contract' | 'Fellowship' | 'Part-time';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  salaryOrStipend: string;
  category: string;
  requiredSkills: string[];
  matchScore?: number;
  deadline: string;
  description: string;
  applicationUrl: string;
  isVerifiedGambia: boolean;
  logoColor?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  isThinking?: boolean;
}

export interface GambiaTechHub {
  name: string;
  region: string;
  description: string;
  keyCompanies: string[];
  demandGrowth: string;
  topRoles: string[];
}

export type CVTemplateType = 'modern-standard' | 'tech-developer' | 'minimal-ats' | 'executive-compact';

export interface CVEducationItem {
  id: string;
  institution: string;
  degree: string;
  location?: string;
  startDate?: string;
  endDate: string;
  gpaOrHonors?: string;
  relevantCoursework?: string[];
  achievements?: string[];
}

export interface CVExperienceItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  bulletPoints: string[];
}

export interface CVProjectItem {
  id: string;
  title: string;
  roleOrContext?: string;
  toolsUsed: string[];
  demoUrl?: string;
  githubUrl?: string;
  bulletPoints: string[];
}

export interface CVCertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface CVReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  contact: string;
}

export interface CVData {
  id: string;
  targetCareer: string;
  targetCompany?: string;
  template: CVTemplateType;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    summary: string;
  };
  education: CVEducationItem[];
  experience: CVExperienceItem[];
  projects: CVProjectItem[];
  skills: {
    technical: string[];
    soft: string[];
    toolsAndFrameworks: string[];
    languages?: { language: string; proficiency: string }[];
  };
  certifications?: CVCertificationItem[];
  references?: CVReferenceItem[];
  atsAnalysis?: {
    score: number;
    strengths: string[];
    improvements: string[];
    actionVerbsCount: number;
    keywordMatchRate: number;
  };
  antiHallucinationVerified: boolean;
}

