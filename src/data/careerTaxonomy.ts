import { CareerSector, CareerPathwayType } from '../types/career';

export interface CareerDefinition {
  id: string;
  title: string;
  sector: CareerSector;
  family: string;
  description: string;
  coreSkills: string[];
  softSkills: string[];
  typicalEntryPathways: CareerPathwayType[];
  degreeRequired: boolean;
  isRegulatedProfession: boolean;
  licensingBodyExample?: string;
  transferableFrom: string[];
  growthTrend: 'Very High' | 'High' | 'Growing' | 'Specialized';
  sampleWorkEnvironments: string[];
}

export const CAREER_SECTORS = [
  { id: 'tech', name: 'Technology & AI' as CareerSector, icon: '💻', description: 'Software, Data Analytics, Cybersecurity, AI/ML, Cloud Infrastructure, and IT Support.' },
  { id: 'health', name: 'Healthcare & Life Sciences' as CareerSector, icon: '🩺', description: 'Clinical Nursing, Public Health, Medical Laboratory, Pharmacy, and Nutrition.' },
  { id: 'finance', name: 'Business, Finance & Banking' as CareerSector, icon: '📈', description: 'Accounting, Financial Analysis, Digital Marketing, Fintech, and Auditing.' },
  { id: 'trades', name: 'Skilled Trades & Vocational' as CareerSector, icon: '🔧', description: 'Solar PV Systems, Electrical Installation, Automotive Mechanics, Welding, and Plumbing.' },
  { id: 'agri', name: 'Agriculture, Agribusiness & Fisheries' as CareerSector, icon: '🌱', description: 'Horticulture, Poultry, Agribusiness Management, Soil Science, and Fisheries.' },
  { id: 'creative', name: 'Creative Arts, Media & Design' as CareerSector, icon: '🎨', description: 'UI/UX Design, Digital Animation, Video Production, Graphic Design, and Content Creation.' },
  { id: 'law', name: 'Law, Governance & Compliance' as CareerSector, icon: '⚖️', description: 'Legal Practice, Corporate Compliance, Intellectual Property, and Regulatory Advisory.' },
  { id: 'edu', name: 'Education & EdTech' as CareerSector, icon: '🎓', description: 'STEM Teaching, TVET Instruction, Curriculum Design, and Educational Technology.' },
  { id: 'eng', name: 'Engineering & Construction' as CareerSector, icon: '🏗️', description: 'Civil Infrastructure, Renewable Energy Systems, Mechanical, and Construction Site Management.' },
  { id: 'logistics', name: 'Transportation, Logistics & Maritime' as CareerSector, icon: '🚢', description: 'Port Operations, Supply Chain Management, Freight Logistics, and Fleet Management.' },
  { id: 'public', name: 'Public Sector & International Development' as CareerSector, icon: '🌐', description: 'Policy Analysis, NGO Project Management, Monitoring & Evaluation (M&E), and Diplomatic Service.' },
];

export const CAREER_SECTORS_LIST: { sector: CareerSector; description: string; iconName: string }[] = [
  {
    sector: 'Technology & AI',
    description: 'Software, Data Analytics, Cybersecurity, AI/ML, Cloud Infrastructure, and IT Support.',
    iconName: 'Cpu',
  },
  {
    sector: 'Healthcare & Life Sciences',
    description: 'Clinical Nursing, Public Health, Medical Laboratory, Pharmacy, and Nutrition.',
    iconName: 'HeartPulse',
  },
  {
    sector: 'Business, Finance & Banking',
    description: 'Accounting, Financial Analysis, Digital Marketing, Fintech, and Auditing.',
    iconName: 'TrendingUp',
  },
  {
    sector: 'Skilled Trades & Vocational',
    description: 'Solar PV Systems, Electrical Installation, Automotive Mechanics, Welding, and Plumbing.',
    iconName: 'Wrench',
  },
  {
    sector: 'Agriculture, Agribusiness & Fisheries',
    description: 'Horticulture, Poultry, Agribusiness Management, Soil Science, and Fisheries.',
    iconName: 'Sprout',
  },
  {
    sector: 'Creative Arts, Media & Design',
    description: 'UI/UX Design, Digital Animation, Video Production, Graphic Design, and Content Creation.',
    iconName: 'Palette',
  },
  {
    sector: 'Law, Governance & Compliance',
    description: 'Legal Practice, Corporate Compliance, Intellectual Property, and Regulatory Advisory.',
    iconName: 'Scale',
  },
  {
    sector: 'Education & EdTech',
    description: 'STEM Teaching, TVET Instruction, Curriculum Design, and Educational Technology.',
    iconName: 'GraduationCap',
  },
  {
    sector: 'Engineering & Construction',
    description: 'Civil Infrastructure, Renewable Energy Systems, Mechanical, and Construction Site Management.',
    iconName: 'Building2',
  },
  {
    sector: 'Transportation, Logistics & Maritime',
    description: 'Port Operations, Supply Chain Management, Freight Logistics, and Fleet Management.',
    iconName: 'Ship',
  },
  {
    sector: 'Public Sector & International Development',
    description: 'Policy Analysis, NGO Project Management, Monitoring & Evaluation (M&E), and Diplomatic Service.',
    iconName: 'Globe',
  },
];

export const GLOBAL_CAREER_TAXONOMY: CareerDefinition[] = [
  // 1. TECHNOLOGY
  {
    id: 'software-engineer',
    title: 'Software Developer (Frontend / Full-Stack)',
    sector: 'Technology & AI',
    family: 'Software Development',
    description: 'Builds modern web and mobile applications using React, TypeScript, Node.js, and cloud APIs.',
    coreSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'Git', 'Tailwind CSS', 'SQL'],
    softSkills: ['Problem Solving', 'Logical Thinking', 'Team Collaboration', 'Continuous Learning'],
    typicalEntryPathways: ['University / Degree', 'Self-Taught & Portfolio', 'Vocational & TVET Apprenticeship'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['Graphic Design', 'Data Entry', 'Mathematics / Physics', 'Customer Support'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Tech Startups', 'Fintech Banks', 'Remote Global Companies', 'Agencies'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst & Business Intelligence',
    sector: 'Technology & AI',
    family: 'Data & Analytics',
    description: 'Extracts insights from structured data to drive strategic business decisions using SQL, Excel, and Power BI.',
    coreSkills: ['SQL', 'Python', 'Power BI / Tableau', 'Advanced Excel', 'Data Cleaning', 'Statistics'],
    softSkills: ['Analytical Mindset', 'Data Storytelling', 'Critical Thinking', 'Business Acumen'],
    typicalEntryPathways: ['University / Degree', 'Self-Taught & Portfolio', 'Professional Certification Ladder'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['Accounting / Auditing', 'Economics', 'Banking Operations', 'Market Research'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Telecom Providers', 'Commercial Banks', 'Fintech Companies', 'NGOs / Research Units'],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity & SOC Analyst',
    sector: 'Technology & AI',
    family: 'Security & Infrastructure',
    description: 'Protects enterprise networks, cloud workloads, and payment gateways against security vulnerabilities.',
    coreSkills: ['Network Security', 'Linux Administration', 'SIEM & SOC Tools', 'Incident Response', 'Vulnerability Assessment'],
    softSkills: ['Vigilance', 'Investigation', 'Communication under pressure', 'Ethics'],
    typicalEntryPathways: ['Professional Certification Ladder', 'University / Degree', 'Vocational & TVET Apprenticeship'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['IT Support Technician', 'Network Administrator', 'Systems Engineering'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Commercial Banks', 'Central Bank & Payment Switches', 'ISP Providers', 'Government CSIRTs'],
  },

  // 2. SKILLED TRADES & VOCATIONAL
  {
    id: 'solar-pv-technician',
    title: 'Solar PV & Renewable Energy Technician',
    sector: 'Skilled Trades & Vocational',
    family: 'Renewable Energy',
    description: 'Designs, installs, and maintains off-grid and grid-tied solar photovoltaic systems and inverter battery banks.',
    coreSkills: ['Solar PV Sizing', 'Inverter & Battery Wiring', 'Electrical Troubleshooting', 'Multimeter Diagnostics', 'Safety Protocols'],
    softSkills: ['Safety Consciousness', 'Physical Stamina', 'Client Communication', 'Reliability'],
    typicalEntryPathways: ['Vocational & TVET Apprenticeship', 'Professional Certification Ladder', 'Entrepreneurship & Agribusiness'],
    degreeRequired: false,
    isRegulatedProfession: true,
    licensingBodyExample: 'National Energy / Technical Certification Agency (e.g. PURA / GTTI)',
    transferableFrom: ['General Electrician', 'Electronics Repair', 'Building Maintenance'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Solar EPC Companies', 'Horticulture Farms', 'Commercial Buildings', 'Independent Contracting'],
  },
  {
    id: 'certified-electrician',
    title: 'Industrial & Domestic Electrician',
    sector: 'Skilled Trades & Vocational',
    family: 'Electrical Trades',
    description: 'Installs, tests, and repairs electrical wiring, control panels, generator switchboards, and domestic installations.',
    coreSkills: ['Single & 3-Phase Wiring', 'Circuit Breaker Installation', 'Electrical Blueprint Reading', 'Troubleshooting'],
    softSkills: ['Attention to Detail', 'Safety Focus', 'Problem Solving'],
    typicalEntryPathways: ['Vocational & TVET Apprenticeship', 'Professional Certification Ladder'],
    degreeRequired: false,
    isRegulatedProfession: true,
    licensingBodyExample: 'National Electrical Licensure Board',
    transferableFrom: ['Appliance Repair', 'Construction Labor'],
    growthTrend: 'High',
    sampleWorkEnvironments: ['Construction Contractors', 'Hotels & Resorts', 'Manufacturing Plants', 'Self-Employed'],
  },

  // 3. AGRICULTURE & AGRIBUSINESS
  {
    id: 'agribusiness-manager',
    title: 'Agribusiness & Horticulture Enterprise Manager',
    sector: 'Agriculture, Agribusiness & Fisheries',
    family: 'Agricultural Management',
    description: 'Manages commercial crop production, drip irrigation systems, supply chain packaging, and wholesale market distribution.',
    coreSkills: ['Drip Irrigation Systems', 'Soil & Fertilizer Management', 'Crop Yield Planning', 'Agri-Accounting', 'Market Distribution'],
    softSkills: ['Venture Management', 'Resilience', 'Negotiation', 'Team Leadership'],
    typicalEntryPathways: ['Entrepreneurship & Agribusiness', 'Vocational & TVET Apprenticeship', 'University / Degree'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['General Business / Trading', 'Community Development', 'Logistics'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Commercial Farms', 'Poultry Operations', 'Exporters', 'Agri-Cooperatives'],
  },

  // 4. HEALTHCARE & LIFE SCIENCES
  {
    id: 'registered-nurse',
    title: 'Registered General Nurse / Clinical Officer',
    sector: 'Healthcare & Life Sciences',
    family: 'Nursing & Patient Care',
    description: 'Provides direct patient clinical care, administers prescribed medications, and coordinates patient recovery.',
    coreSkills: ['Clinical Assessment', 'Patient Triage', 'Medication Administration', 'Infection Control', 'Emergency First Aid'],
    softSkills: ['Empathy', 'Communication', 'Calm under pressure', 'Active Listening'],
    typicalEntryPathways: ['University / Degree', 'Vocational & TVET Apprenticeship'],
    degreeRequired: true,
    isRegulatedProfession: true,
    licensingBodyExample: 'National Nursing & Midwifery Council',
    transferableFrom: ['Community Health Volunteer', 'First Aid Responder', 'Caregiver'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Public General Hospitals', 'Private Clinics', 'International Medical Units (MRCG)', 'NGO Field Teams'],
  },
  {
    id: 'public-health-specialist',
    title: 'Public Health & Epidemiological Officer',
    sector: 'Healthcare & Life Sciences',
    family: 'Public Health',
    description: 'Designs disease surveillance programs, community health outreach, immunization monitoring, and hygiene interventions.',
    coreSkills: ['Epidemiological Data Analysis', 'Community Health Surveys', 'Health Education', 'WHO / CDC Guidelines'],
    softSkills: ['Community Engagement', 'Cross-cultural Communication', 'Research Rigor'],
    typicalEntryPathways: ['University / Degree', 'Professional Certification Ladder'],
    degreeRequired: true,
    isRegulatedProfession: true,
    licensingBodyExample: 'Ministry of Health & Public Health Board',
    transferableFrom: ['Biology / Chemistry Teaching', 'Nursing', 'Statistics'],
    growthTrend: 'High',
    sampleWorkEnvironments: ['Ministry of Health', 'WHO / UNICEF', 'Red Cross', 'Research Institutes'],
  },

  // 5. BUSINESS & FINANCE
  {
    id: 'chartered-accountant',
    title: 'Financial Accountant & Tax Specialist',
    sector: 'Business, Finance & Banking',
    family: 'Accounting & Auditing',
    description: 'Prepares statutory financial statements, manages corporate tax compliance, conducts internal audits, and oversees payroll.',
    coreSkills: ['IFRS Accounting', 'Corporate Taxation (GRA/FIRS)', 'QuickBooks / Tally / SAP', 'Financial Modeling', 'Audit Readiness'],
    softSkills: ['Integrity', 'Attention to Precision', 'Ethical Standards', 'Client Advisory'],
    typicalEntryPathways: ['Professional Certification Ladder', 'University / Degree'],
    degreeRequired: true,
    isRegulatedProfession: true,
    licensingBodyExample: 'Institute of Chartered Accountants (GICA / ICAN / ICAG / ACCA)',
    transferableFrom: ['Bookkeeper', 'Banking Teller', 'Cash Management'],
    growthTrend: 'High',
    sampleWorkEnvironments: ['Audit Firms (PwC, KPMG, Local)', 'Commercial Banks', 'Government Agencies', 'Corporate Enterprises'],
  },

  // 6. CREATIVE ARTS, MEDIA & DESIGN
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Product Designer & Brand Strategist',
    sector: 'Creative Arts, Media & Design',
    family: 'Design & Media',
    description: 'Creates user personas, wireframes, interactive mobile prototypes in Figma, design systems, and brand visual identities.',
    coreSkills: ['Figma / Adobe XD', 'Wireframing & Prototyping', 'User Research', 'Design Systems', 'Visual Hierarchy'],
    softSkills: ['Empathy', 'Creative Direction', 'Feedback Receptivity', 'Storytelling'],
    typicalEntryPathways: ['Self-Taught & Portfolio', 'Vocational & TVET Apprenticeship', 'University / Degree'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['Graphic Design', 'Architecture / Drafting', 'Front-End Development', 'Fine Arts'],
    growthTrend: 'Very High',
    sampleWorkEnvironments: ['Design Studios', 'Fintech Startups', 'Digital Agencies', 'Remote Global Freelancing'],
  },

  // 7. LAW & GOVERNANCE
  {
    id: 'corporate-legal-counsel',
    title: 'Corporate Legal Counsel & Compliance Officer',
    sector: 'Law, Governance & Compliance',
    family: 'Legal Services',
    description: 'Drafts commercial contracts, ensures regulatory adherence to data protection and banking laws, and handles dispute resolution.',
    coreSkills: ['Contract Drafting', 'Regulatory Compliance', 'Legal Research', 'Intellectual Property Law', 'Corporate Governance'],
    softSkills: ['Persuasive Writing', 'Negotiation', 'Discretion', 'Analytical Rigor'],
    typicalEntryPathways: ['University / Degree'],
    degreeRequired: true,
    isRegulatedProfession: true,
    licensingBodyExample: 'National Bar Association & Council of Legal Education',
    transferableFrom: ['Paralegal', 'Policy Officer', 'Contract Administration'],
    growthTrend: 'High',
    sampleWorkEnvironments: ['Commercial Law Firms', 'Telecoms & FinTechs', 'Banks & Inward Investors', 'Judiciary'],
  },

  // 8. LOGISTICS & SUPPLY CHAIN
  {
    id: 'supply-chain-specialist',
    title: 'Supply Chain, Logistics & Port Operations Coordinator',
    sector: 'Transportation, Logistics & Maritime',
    family: 'Supply Chain',
    description: 'Coordinates cargo clearing, inventory warehousing, customs documentation (ASYCUDA), freight forwarding, and distribution fleets.',
    coreSkills: ['ASYCUDA Customs System', 'Freight Forwarding', 'Inventory Control', 'Warehouse Management', 'Import/Export Compliance'],
    softSkills: ['Problem Solving', 'Vendor Negotiation', 'Crisis Management', 'Coordination'],
    typicalEntryPathways: ['Vocational & TVET Apprenticeship', 'University / Degree', 'Professional Certification Ladder'],
    degreeRequired: false,
    isRegulatedProfession: false,
    transferableFrom: ['Retail Store Management', 'Fleet Coordination', 'Operations Support'],
    growthTrend: 'High',
    sampleWorkEnvironments: ['Ports Authority (GPA)', 'Shipping Lines (Maersk, Bolloré)', 'Importers / Supermarkets', 'Logistics Companies'],
  },
];

export const CAREER_TAXONOMY = GLOBAL_CAREER_TAXONOMY;

