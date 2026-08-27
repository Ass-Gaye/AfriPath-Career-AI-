export type AfricanRegion =
  | 'West Africa'
  | 'East Africa'
  | 'Southern Africa'
  | 'North Africa'
  | 'Central Africa'
  | 'Pan-African & Remote';

export type CareerSector =
  | 'Technology & AI'
  | 'Healthcare & Life Sciences'
  | 'Business, Finance & Banking'
  | 'Skilled Trades & Vocational'
  | 'Agriculture, Agribusiness & Fisheries'
  | 'Creative Arts, Media & Design'
  | 'Law, Governance & Compliance'
  | 'Education & EdTech'
  | 'Engineering & Construction'
  | 'Transportation, Logistics & Maritime'
  | 'Public Sector & International Development';

export type CareerPathwayType =
  | 'University / Degree'
  | 'Vocational & TVET Apprenticeship'
  | 'Self-Taught & Portfolio'
  | 'Professional Certification Ladder'
  | 'Career Transition & Skill Bridge'
  | 'Entrepreneurship & Agribusiness';

export type CareerGoalType =
  | 'Employment'
  | 'Entrepreneurship'
  | 'Freelancing & Remote Work'
  | 'Further Education / Upskilling'
  | 'Career Change'
  | 'Undecided / Exploring';

export type CareerMaturityStage =
  | 'Explorer' // "I don't know what career I want"
  | 'Beginner' // "I have chosen a field but don't know where to start"
  | 'Learner' // "I am currently acquiring skills"
  | 'JobSeeker' // "I am actively seeking employment"
  | 'Professional' // "I want to advance in my current field"
  | 'CareerChanger' // "I want to transition to another industry"
  | 'Entrepreneur'; // "I want to launch or grow a venture"

export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  region: AfricanRegion;
  currencyCode: string;
  currencySymbol: string;
  languages: string[];
  educationLevels: string[];
  majorIndustries: string[];
  professionalBodies: string[];
  universitiesAndInstitutes: string[];
  jobSources: string[];
  salaryDataAvailability: 'High' | 'Medium' | 'Emerging';
  active: boolean;
  notes?: string;
}

export type EducationLevel =
  | 'High School / WASSCE'
  | 'Diploma / TVET Certificate'
  | 'Higher National Diploma (HND)'
  | 'Bachelor’s Degree'
  | 'Master’s Degree'
  | 'Doctorate / PhD'
  | 'Self-Taught / Bootcamps';

export interface UserProfile {
  id: string;
  name: string;
  age: number | string;
  country: string; // e.g. "The Gambia", "Senegal", "Ghana", "Nigeria", "Kenya"
  countryCode?: string; // "GM", "SN", "GH", "NG", "KE", "ZA", "RW", etc.
  location: string; // City or Region (e.g., "Kanifing / KMC", "Dakar", "Lagos", "Nairobi")
  targetLocations?: string[]; // Preferred countries or "Remote"
  educationLevel: EducationLevel;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  currentSkills: string[];
  softSkills: string[];
  interests: string[];
  careerGoal: string; // Free text or CareerGoalType
  careerGoalType?: CareerGoalType;
  maturityStage?: CareerMaturityStage;
  targetIndustries: string[];
  preferredPathway?: CareerPathwayType;
  cvFileName?: string;
  cvRawText?: string;
  experienceYears?: string;
  preferredWorkType?: 'Local' | 'Remote (Global/Pan-African)' | 'Hybrid' | 'Flexible' | 'Local (Gambia)' | 'Remote (Global)';
  languagePreference?: string; // 'en', 'fr', 'wo', 'ar', etc.
  // Optional constraints
  constraints?: {
    budgetLevel?: 'Low / Free Only' | 'Moderate' | 'Flexible';
    timeAvailableWeeklyHours?: number;
    deviceAccess?: 'Smartphone Only' | 'Laptop / Desktop' | 'Shared Community Computer';
    internetReliability?: 'High / Fiber' | 'Moderate / 4G' | 'Low / Limited Data';
  };
}

export interface MatchDimensions {
  interestMatch: number; // 0 - 100
  skillMatch: number; // 0 - 100
  educationCompatibility: number; // 0 - 100
  marketOpportunity: number; // 0 - 100
  learningFeasibility: number; // 0 - 100
}

export interface CareerMatch {
  id: string;
  title: string;
  matchScore: number; // Career Match Indicator (0 - 100)
  matchDimensions?: MatchDimensions;
  industry: string;
  sector?: CareerSector;
  tagline: string;
  reason: string;
  marketDemandGambia?: 'Very High' | 'High' | 'Growing' | 'Specialized';
  marketDemandRegion?: 'Very High' | 'High' | 'Growing' | 'Specialized';
  salaryRangeLocal?: string;
  salaryRangeGMD?: string;
  salaryRangeUSD: string;
  currencyCode?: string;
  matchingSkills: string[];
  missingSkills: string[];
  localEmployers?: string[];
  gambianEmployers?: string[];
  regionalEmployers?: string[];
  growthPotential: string;
  difficultyToTransition: 'Low' | 'Moderate' | 'Challenging';
  sampleJobTitles: string[];
  // Pan-African additions
  supportedPathways?: {
    pathwayType: CareerPathwayType;
    description: string;
    durationEstimate: string;
    keyPrerequisite: string;
  }[];
  alternativeCareers?: {
    title: string;
    matchScore: number;
    whyFits: string;
  }[];
  regulationNotice?: {
    isRegulated: boolean;
    licensingBody?: string;
    requirementNotes?: string;
  };
  whyThisFits?: string[];
  actionPlanNextSteps?: string[];
}

export interface SkillGapItem {
  skill: string;
  category: 'Technical' | 'Soft' | 'Tool' | 'Domain' | 'Vocational';
  priority: 'Critical' | 'High' | 'Medium';
  estimatedHours: number;
  estimatedWeeks: number;
  description: string;
  recommendedResources: {
    title: string;
    provider: string;
    url: string;
    isFree: boolean;
    type: 'Course' | 'Project' | 'Certification' | 'Tutorial' | 'Apprenticeship' | 'Local Institute';
    africanProvider?: boolean;
  }[];
}

export interface SkillGapAnalysis {
  targetCareer: string;
  ownedSkills: string[];
  skillGaps: SkillGapItem[];
  overallReadinessScore: number;
  aiSummary: string;
  transferableStrengths?: string[];
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
    taskType?: 'Theory' | 'Hands-on Practice' | 'Portfolio Project' | 'Networking / Community';
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
  pathwayType?: CareerPathwayType;
  months: RoadmapMonth[];
  keyOutcomes: string[];
  weeklyHoursRecommended: number;
  disclaimer?: string;
}

export type OpportunityType =
  | 'Job'
  | 'Internship'
  | 'Apprenticeship'
  | 'Scholarship'
  | 'Fellowship'
  | 'Training Program'
  | 'Startup Grant / Incubation'
  | 'Competition'
  | 'Contract';

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  country: string; // e.g. "The Gambia", "Senegal", "Nigeria", "Ghana", "Kenya", "Remote / Pan-African"
  countryCode?: string;
  city?: string;
  location: string;
  type: OpportunityType | 'Full-time' | 'Internship' | 'Contract' | 'Fellowship' | 'Part-time';
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  salaryOrStipend: string;
  currency?: string;
  category: string;
  sector?: CareerSector;
  requiredSkills: string[];
  matchScore?: number;
  deadline: string;
  description: string;
  applicationUrl: string;
  isVerifiedGambia?: boolean;
  isVerifiedPanAfrican?: boolean;
  sourceName?: string;
  lastVerifiedDate?: string;
  logoColor?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  isThinking?: boolean;
  countryContext?: string;
}

export interface RegionalHub {
  name: string;
  country: string;
  region: string;
  description: string;
  keyCompanies: string[];
  demandGrowth: string;
  topRoles: string[];
  ecosystemHighlights: string[];
}

export interface GambiaTechHub extends RegionalHub {}

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
    country?: string;
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


