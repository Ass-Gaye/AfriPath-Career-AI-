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
  | 'Entrepreneurship & Agribusiness'
  | 'Technology'
  | 'Business & Finance'
  | 'Healthcare'
  | 'Engineering'
  | 'Agriculture'
  | 'Education'
  | 'Creative & Design'
  | 'Law & Governance'
  | 'Media & Communications'
  | 'Hospitality & Tourism'
  | 'Skilled Trades'
  | 'Environment & Sustainability'
  | 'Logistics & Supply Chain'
  | 'Research & Academia'
  | 'Public Service'
  | 'Not sure yet';

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

export type ContentConfidence =
  | 'USER_PROVIDED'
  | 'USER_CONFIRMED'
  | 'USER_EDITED'
  | 'AI_REWRITTEN'
  | 'SUGGESTED'
  | 'UNVERIFIED';

export interface VerifiedCompetency {
  id: string;
  competency: string;
  evidenceText?: string;
  isVerified: boolean;
  sourceType: 'user_claim' | 'experience' | 'education' | 'project';
  confidence: ContentConfidence;
}

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
  discipline?: string; // Sub-specialty (e.g. "Civil Engineering", "Software Engineering", "Accounting")
  graduationYear: string;
  currentSkills: string[]; // Existing verified skills provided by user
  suggestedSkills?: string[]; // System recommended skills (not yet confirmed)
  softSkills: string[]; // Verified soft skills
  verifiedCompetencies?: VerifiedCompetency[];
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
  requiredProficiency: number;
  requiredProficiencyLabel: string;
  currentProficiency: number;
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
  assessmentAvailable?: boolean;
  assessmentQuestions?: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface DetailedSkillGapReport {
  targetCareer: string;
  pathway: string;
  fieldOfStudy: string;
  discipline: string;
  readinessScore: number;
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
  detailedReport?: DetailedSkillGapReport;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  skillCompetency?: string;
  reason?: string;
  activityType?: 'LEARN' | 'PRACTICE' | 'BUILD' | 'ASSESS' | 'DOCUMENT' | 'DEMONSTRATE' | 'APPLY' | 'NETWORK' | 'PREPARE' | 'REVIEW';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  expectedOutcome?: string;
  resourceTitle?: string;
  resourceLink?: string;
  resourceProvider?: string;
  completionCriteria?: string;
  completed: boolean;
  status?: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  taskType?: 'Theory' | 'Hands-on Practice' | 'Portfolio Project' | 'Networking / Community';
  attachedEvidence?: {
    type: 'project_link' | 'certificate' | 'github_repo' | 'work_sample' | 'notes';
    title: string;
    urlOrText: string;
    date: string;
  };
  canAddToCV?: boolean;
  addedToCV?: boolean;
  canAddToPortfolio?: boolean;
  addedToPortfolio?: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focus: string;
  tasks: RoadmapTask[];
  milestoneDeliverable: string;
  milestoneDeliverableType?: 'Project' | 'Assessment' | 'Certification' | 'Portfolio Artifact' | 'CV Milestone';
}

export interface RoadmapMonth {
  month: number;
  phaseName: string;
  theme: string;
  description: string;
  durationDays?: number;
  weeks: RoadmapWeek[];
}

export interface CareerRoadmap {
  targetCareer: string;
  targetTimeframeDays: number;
  pathwayType?: CareerPathwayType;
  startingLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Career Changer';
  weeklyHoursRecommended: number;
  learningPreference?: string;
  phaseAllocation?: {
    phase1Days: number;
    phase2Days: number;
    phase3Days: number;
    focusSummary: string;
  };
  topPriorities?: string[];
  transferableFoundationsUsed?: string[];
  beforeAfterGaps?: {
    skill: string;
    beforeLevel: string;
    targetLevel: string;
    projectedAfterLevel: string;
    resolvedInMonth: number;
  }[];
  todayAction?: {
    taskId: string;
    weekNumber: number;
    title: string;
    reason: string;
    estimatedMinutes: number;
    skill: string;
  };
  months: RoadmapMonth[];
  keyOutcomes: string[];
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

export type CVTemplateType =
  | 'modern-standard'
  | 'classic'
  | 'minimal-ats'
  | 'professional'
  | 'graduate'
  | 'creative'
  | 'technical'
  | 'tech-developer'
  | 'executive-compact';

export interface CVChangeRecord {
  id: string;
  section: string;
  field: string;
  originalText: string;
  suggestedText: string;
  rationale?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'custom_edited';
}

export interface CVFactCheckItem {
  id: string;
  section: string;
  field: string;
  claim: string;
  status: 'verified' | 'unverified' | 'flagged' | 'confirmed_by_user';
  issueType?: 'unverified_claim' | 'unsupported_metric' | 'missing_evidence' | 'unverified_employer' | 'ok';
  message: string;
  severity: 'info' | 'warning' | 'error';
}

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
  confidence?: ContentConfidence;
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
  confidence?: ContentConfidence;
}

export interface CVProjectItem {
  id: string;
  title: string;
  roleOrContext?: string;
  toolsUsed: string[];
  demoUrl?: string;
  githubUrl?: string;
  bulletPoints: string[];
  confidence?: ContentConfidence;
}

export interface CVCertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  confidence?: ContentConfidence;
}

export interface CVReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  contact: string;
  confidence?: ContentConfidence;
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
    confidence?: ContentConfidence;
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
  factCheckAudit?: CVFactCheckItem[];
  pendingChanges?: CVChangeRecord[];
  userConfirmedAllFacts?: boolean;
}


