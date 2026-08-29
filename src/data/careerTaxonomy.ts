import { CareerSector, CareerPathwayType, UserProfile } from '../types/career';

export interface FieldOfStudyDefinition {
  id: string;
  name: string;
  icon: string;
  category: string;
  disciplines: string[];
  primaryPathways: CareerPathwayType[];
  coreTechnicalSkills: string[];
  evidenceBasedCompetencies: {
    name: string;
    description: string;
    suggestedEvidencePrompt: string;
  }[];
  sampleRoles: string[];
}

export interface PathwayDefinition {
  id: string;
  name: CareerPathwayType;
  title: string;
  icon: string;
  description: string;
  relatedFields: string[];
  keyCompetencies: string[];
}

export interface CareerDefinition {
  id: string;
  title: string;
  sector: CareerSector;
  family: string;
  description: string;
  coreSkills: string[];
  softSkills: string[];
  typicalEntryPathways: string[];
  degreeRequired: boolean;
  isRegulatedProfession: boolean;
  licensingBodyExample?: string;
  transferableFrom: string[];
  growthTrend: string;
  sampleWorkEnvironments: string[];
}

export const CAREER_PATHWAYS_LIST: PathwayDefinition[] = [
  {
    id: 'tech',
    name: 'Technology',
    title: 'Technology & AI',
    icon: '💻',
    description: 'Software development, cloud architecture, cybersecurity, data science, and AI systems.',
    relatedFields: ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science'],
    keyCompetencies: ['Algorithmic Problem Solving', 'Systems Thinking', 'Technical Debugging', 'Code Documentation'],
  },
  {
    id: 'biz_finance',
    name: 'Business & Finance',
    title: 'Business, Finance & Banking',
    icon: '📈',
    description: 'Corporate accounting, financial modeling, fintech, banking, investment, and market analysis.',
    relatedFields: ['Accounting', 'Finance', 'Economics', 'Business Administration', 'Banking'],
    keyCompetencies: ['Quantitative Analysis', 'Regulatory Compliance', 'Fiscal Prudence', 'Stakeholder Advisory'],
  },
  {
    id: 'health',
    name: 'Healthcare',
    title: 'Healthcare & Life Sciences',
    icon: '🩺',
    description: 'Clinical nursing, public health epidemiology, medical labs, pharmacy, and healthcare administration.',
    relatedFields: ['Nursing', 'Medicine', 'Public Health', 'Pharmacy', 'Biomedical Science'],
    keyCompetencies: ['Patient Advocacy & Triage', 'Clinical Protocol Adherence', 'Crisis Composure', 'Empathetic Communication'],
  },
  {
    id: 'eng',
    name: 'Engineering',
    title: 'Engineering & Infrastructure',
    icon: '🏗️',
    description: 'Civil structural design, electrical power grids, mechanical systems, and renewable energy.',
    relatedFields: ['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Renewable Energy'],
    keyCompetencies: ['CAD & Blueprint Precision', 'Mathematical Modeling', 'Structural Quality Assurance', 'Site Safety Leadership'],
  },
  {
    id: 'agri',
    name: 'Agriculture',
    title: 'Agriculture, Agribusiness & Food',
    icon: '🌱',
    description: 'Horticulture, drip irrigation, livestock management, post-harvest supply chains, and agribusiness.',
    relatedFields: ['Agriculture', 'Agronomy', 'Animal Science', 'Agribusiness', 'Food Science'],
    keyCompetencies: ['Agronomic Planning', 'Supply Chain Coordination', 'Resource Optimization', 'Field Team Supervision'],
  },
  {
    id: 'edu',
    name: 'Education',
    title: 'Education & EdTech',
    icon: '🎓',
    description: 'STEM pedagogy, TVET vocational instruction, instructional design, and educational technology.',
    relatedFields: ['Education', 'Pedagogy', 'Instructional Design', 'Linguistics'],
    keyCompetencies: ['Curriculum Scaffolding', 'Differentiated Instruction', 'Learner Assessment', 'Mentorship'],
  },
  {
    id: 'creative',
    name: 'Creative & Design',
    title: 'Creative Arts, Media & UX',
    icon: '🎨',
    description: 'UI/UX product design, animation, visual identity, digital media, and video production.',
    relatedFields: ['Design', 'Graphic Design', 'Architecture', 'Fine Arts', 'Digital Media'],
    keyCompetencies: ['User Empathy & Research', 'Visual Hierarchy', 'Iterative Prototyping', 'Design System Architecture'],
  },
  {
    id: 'law',
    name: 'Law & Governance',
    title: 'Law, Compliance & Policy',
    icon: '⚖️',
    description: 'Commercial contract drafting, corporate compliance, regulatory affairs, and policy governance.',
    relatedFields: ['Law', 'Legal Studies', 'Political Science', 'Public Administration'],
    keyCompetencies: ['Statutory Interpretation', 'Contractual Precision', 'Ethical Governance', 'Advocacy & Negotiation'],
  },
  {
    id: 'media',
    name: 'Media & Communications',
    title: 'Media, PR & Communications',
    icon: '🎙️',
    description: 'Public relations, corporate communications, journalism, content strategy, and digital marketing.',
    relatedFields: ['Communications', 'Journalism', 'Marketing', 'Public Relations'],
    keyCompetencies: ['Editorial Clarity', 'Brand Storytelling', 'Crisis Messaging', 'Multichannel Campaign Management'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    title: 'Hospitality, Tourism & Travel',
    icon: '🏨',
    description: 'Hotel operations, eco-tourism, culinary arts, travel management, and guest services.',
    relatedFields: ['Hospitality Management', 'Tourism Studies', 'Culinary Arts'],
    keyCompetencies: ['Guest Experience Excellence', 'Service Delivery Rigor', 'Cross-Cultural Hospitality', 'Operations Optimization'],
  },
  {
    id: 'trades',
    name: 'Skilled Trades',
    title: 'Skilled Trades & Technical',
    icon: '🔧',
    description: 'Solar PV installation, domestic & industrial electrical wiring, automotive diagnostics, and welding.',
    relatedFields: ['Vocational / Technical Training', 'Electrical Trades', 'Automotive', 'Welding'],
    keyCompetencies: ['Diagnostics & Troubleshooting', 'Tool Precision', 'Occupational Safety Compliance', 'Practical Craftsmanship'],
  },
  {
    id: 'environment',
    name: 'Environment & Sustainability',
    title: 'Environment & Sustainability',
    icon: '🌍',
    description: 'Climate adaptation, environmental impact assessment (EIA), waste management, and renewable energy.',
    relatedFields: ['Environmental Science', 'Forestry & Wildlife', 'Marine Science'],
    keyCompetencies: ['Environmental Impact Auditing', 'Ecological Data Sampling', 'Sustainability Frameworks', 'Community Sensitization'],
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    title: 'Logistics, Port & Supply Chain',
    icon: '🚢',
    description: 'Port operations, customs clearing (ASYCUDA), freight forwarding, inventory, and procurement.',
    relatedFields: ['Logistics & Supply Chain', 'Transportation Management', 'Procurement'],
    keyCompetencies: ['ASYCUDA Customs Processing', 'Freight Optimization', 'Inventory Accuracy', 'Vendor Coordination'],
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Agribusiness',
    title: 'Entrepreneurship & Ventures',
    icon: '🚀',
    description: 'Venture creation, business model validation, seed fundraising, and micro-enterprise management.',
    relatedFields: ['Business Administration', 'Marketing', 'Economics', 'Vocational / Technical Training'],
    keyCompetencies: ['Venture Financial Modeling', 'Customer Discovery', 'Lean Execution', 'Resilience & Grit'],
  },
  {
    id: 'research',
    name: 'Research & Academia',
    title: 'Research & Academia',
    icon: '🔬',
    description: 'Scientific methodology, statistical modeling, peer review publishing, and grant proposal drafting.',
    relatedFields: ['Natural Sciences', 'Social Sciences', 'Economics', 'Mathematics / Statistics'],
    keyCompetencies: ['Methodological Rigor', 'Statistical Modeling (R/Python/SPSS)', 'Academic Writing', 'Grant Writing'],
  },
  {
    id: 'public_service',
    name: 'Public Service',
    title: 'Public Service & NGO',
    icon: '🏛️',
    description: 'Government administration, NGO project delivery, monitoring & evaluation (M&E), and international development.',
    relatedFields: ['Public Administration', 'Social Sciences', 'International Relations', 'Economics'],
    keyCompetencies: ['M&E Frameworks', 'Grant Reporting', 'Community Stakeholder Management', 'Public Sector Ethics'],
  },
  {
    id: 'not_sure',
    name: 'Not sure yet',
    title: 'Exploring & Open Pathway',
    icon: '🧭',
    description: 'Flexible career discovery based on your natural strengths, background, and regional high-growth trends.',
    relatedFields: ['All Fields'],
    keyCompetencies: ['Adaptability', 'Rapid Learning', 'Transferable Problem Solving'],
  },
];

export const FIELDS_OF_STUDY_CONFIG: FieldOfStudyDefinition[] = [
  {
    id: 'cs',
    name: 'Computer Science',
    icon: '💻',
    category: 'Technology & Computing',
    disciplines: [
      'Software Engineering & Web Development',
      'Artificial Intelligence & Machine Learning',
      'Cybersecurity & Network Defense',
      'Database Systems & Cloud Computing',
      'Mobile App Development',
      'Data Science & Analytics',
      'Human-Computer Interaction (HCI)',
      'Other / General Computer Science',
    ],
    primaryPathways: ['Technology', 'Research & Academia', 'Entrepreneurship & Agribusiness'],
    coreTechnicalSkills: [
      'JavaScript / TypeScript',
      'Python',
      'React / Next.js',
      'Node.js & Express',
      'SQL & Relational Databases',
      'Git & GitHub Version Control',
      'REST APIs & Microservices',
      'Data Structures & Algorithms',
      'Linux Command Line',
      'Docker & Cloud Basics',
      'HTML5 & Tailwind CSS',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Technical Problem Solving',
        description: 'Systematic debugging and breaking complex algorithmic problems into modular solutions.',
        suggestedEvidencePrompt: 'e.g. Debugged and refactored a database query reducing load times by 40% in university project.',
      },
      {
        name: 'Agile & Collaborative Coding',
        description: 'Working in peer teams using Git branches, code reviews, and sprint boards.',
        suggestedEvidencePrompt: 'e.g. Collaborated in a 4-person cohort using Git pull requests to ship semester capstone application.',
      },
      {
        name: 'Continuous Learning Agility',
        description: 'Self-driven acquisition of modern frameworks and SDKs.',
        suggestedEvidencePrompt: 'e.g. Self-taught TypeScript and Tailwind CSS to build live interactive portfolio projects.',
      },
    ],
    sampleRoles: ['Software Developer', 'Full-Stack Engineer', 'Frontend Specialist', 'Data Analyst', 'DevOps Associate'],
  },
  {
    id: 'it',
    name: 'Information Technology',
    icon: '🖥️',
    category: 'Technology & Computing',
    disciplines: [
      'Network Administration & Cisco Systems',
      'IT Support & Enterprise Systems',
      'Cybersecurity & SOC Operations',
      'Cloud & Server Infrastructure',
      'Database Administration',
      'Telecommunications',
      'Other / General IT',
    ],
    primaryPathways: ['Technology', 'Skilled Trades', 'Public Service'],
    coreTechnicalSkills: [
      'Computer Networking (TCP/IP, VLAN, DNS)',
      'Linux & Windows Server Admin',
      'Hardware Diagnostics & Troubleshooting',
      'Cybersecurity Fundamentals & Firewalls',
      'SQL & Database Backups',
      'Cloud Virtualization (AWS/Azure/GCP)',
      'IT Service Management (ITIL Basics)',
      'Bash / PowerShell Scripting',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Systemic Troubleshooting',
        description: 'Rapidly isolating network and workstation hardware/software issues under pressure.',
        suggestedEvidencePrompt: 'e.g. Resolved network connectivity downtime for campus lab affecting 30+ workstations.',
      },
      {
        name: 'Security & Protocol Vigilance',
        description: 'Enforcing user access controls, backups, and firewall security policies.',
        suggestedEvidencePrompt: 'e.g. Configured local backup schedule and user permission groups in training lab environment.',
      },
    ],
    sampleRoles: ['Network Administrator', 'IT Support Specialist', 'Cybersecurity Analyst', 'Systems Administrator'],
  },
  {
    id: 'business_admin',
    name: 'Business Administration',
    icon: '📊',
    category: 'Business & Management',
    disciplines: [
      'Operations & General Management',
      'Human Resource Management (HR)',
      'Project Management',
      'Strategic Planning',
      'Supply Chain & Procurement',
      'Enterprise Business Development',
      'Other / General Business',
    ],
    primaryPathways: ['Business & Finance', 'Entrepreneurship & Agribusiness', 'Public Service', 'Logistics & Supply Chain'],
    coreTechnicalSkills: [
      'Microsoft Excel (Pivot Tables, VLOOKUP, Models)',
      'Project Management (Asana, Trello, Gantt)',
      'Business Process Modeling (BPMN)',
      'Financial Budgeting & Forecasting',
      'Market & Competitor Analysis',
      'Business Report & Executive Writing',
      'KPI Performance Dashboards',
      'Procurement & Vendor Evaluation',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Cross-Functional Team Coordination',
        description: 'Aligning operational activities across team members to achieve project milestones on schedule.',
        suggestedEvidencePrompt: 'e.g. Coordinated committee of 6 student leaders to organize annual university business symposium.',
      },
      {
        name: 'Strategic Decision Analysis',
        description: 'Synthesizing market research data into concrete business plans and recommendations.',
        suggestedEvidencePrompt: 'e.g. Formulated a 15-page feasibility plan for a local SME distribution initiative.',
      },
    ],
    sampleRoles: ['Operations Associate', 'Project Coordinator', 'HR Specialist', 'Business Development Officer'],
  },
  {
    id: 'accounting',
    name: 'Accounting',
    icon: '🧾',
    category: 'Business & Management',
    disciplines: [
      'Financial Accounting & Reporting (IFRS)',
      'Auditing & Assurance',
      'Management Accounting & Cost Control',
      'Corporate & Direct Taxation',
      'Forensic Accounting',
      'Public Sector Accounting (IPSAS)',
      'Other / General Accounting',
    ],
    primaryPathways: ['Business & Finance', 'Public Service', 'Research & Academia'],
    coreTechnicalSkills: [
      'IFRS Accounting Standards',
      'QuickBooks & Tally Accounting Software',
      'Advanced Excel & Financial Functions',
      'Bank Reconciliation & Ledger Audits',
      'Corporate Tax Filing (GRA / FIRS / KRA)',
      'Payroll Administration',
      'Financial Statement Preparation',
      'Internal Control Verification',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Precision & Numerical Rigor',
        description: 'Exacting attention to balancing ledgers, double-entry accuracy, and error detection.',
        suggestedEvidencePrompt: 'e.g. Performed end-of-month reconciliations for student association account with zero discrepancies.',
      },
      {
        name: 'Ethical & Compliance Standards',
        description: 'Strict adherence to statutory tax laws and professional accounting ethics.',
        suggestedEvidencePrompt: 'e.g. Prepared tax compliance worksheets aligning with national revenue authority guidelines.',
      },
    ],
    sampleRoles: ['Financial Accountant', 'Internal Auditor', 'Tax Associate', 'Finance Officer'],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💳',
    category: 'Business & Management',
    disciplines: [
      'Corporate Finance & Valuation',
      'Investment Banking & Capital Markets',
      'Fintech & Digital Payment Systems',
      'Risk Management & Compliance',
      'Microfinance & SME Lending',
      'Other / General Finance',
    ],
    primaryPathways: ['Business & Finance', 'Technology', 'Entrepreneurship & Agribusiness'],
    coreTechnicalSkills: [
      'Financial Modeling & Valuation (DCF)',
      'Mobile Money & Payment Rails (USSD, API)',
      'Credit Risk Analysis & Scoring',
      'Macroeconomic Data Analysis',
      'Investment Portfolio Analysis',
      'Regulatory Compliance (AML/KYC)',
      'SQL & Power BI for Financial Data',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Quantitative Risk Assessment',
        description: 'Evaluating financial exposure, payback horizons, and loan viability objectively.',
        suggestedEvidencePrompt: 'e.g. Modeled 3-year cash flow projections for micro-enterprise loan proposal.',
      },
    ],
    sampleRoles: ['Financial Analyst', 'Fintech Product Associate', 'Credit Officer', 'Investment Associate'],
  },
  {
    id: 'economics',
    name: 'Economics',
    icon: '📉',
    category: 'Social Sciences & Economics',
    disciplines: [
      'Applied Econometrics & Data Analysis',
      'Development Economics & Policy',
      'Monetary & International Economics',
      'Agricultural & Resource Economics',
      'Public Finance & Fiscal Policy',
      'Other / General Economics',
    ],
    primaryPathways: ['Business & Finance', 'Public Service', 'Research & Academia'],
    coreTechnicalSkills: [
      'Econometric Modeling (STATA / R / EViews)',
      'Advanced Excel & Statistical Analysis',
      'Policy Impact Assessment',
      'Data Cleaning & Survey Sampling',
      'Cost-Benefit Analysis',
      'Economic Report Drafting',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Macro & Policy Data Interpretation',
        description: 'Extracting causal relationships from socioeconomic datasets to advise public or private policy.',
        suggestedEvidencePrompt: 'e.g. Analyzed consumer inflation trends using STATA for undergraduate dissertation.',
      },
    ],
    sampleRoles: ['Economic Policy Analyst', 'M&E Specialist', 'Market Research Lead', 'Data Specialist'],
  },
  {
    id: 'engineering_civil',
    name: 'Civil Engineering',
    icon: '🏗️',
    category: 'Engineering & Construction',
    disciplines: [
      'Structural Engineering',
      'Highway & Transportation Engineering',
      'Geotechnical Engineering',
      'Water Resources & Sanitation',
      'Construction Management & Quantity Surveying',
      'Other / General Civil Engineering',
    ],
    primaryPathways: ['Engineering', 'Skilled Trades', 'Public Service'],
    coreTechnicalSkills: [
      'AutoCAD & Civil 3D',
      'Structural Analysis (STAAD Pro / ETABS)',
      'Bill of Quantities (BOQ) Preparation',
      'Concrete & Soil Material Testing',
      'Site Supervision & Surveying (Total Station)',
      'Building Codes & Construction Safety',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Spatial & Structural Precision',
        description: 'Translating engineering blueprints into exact physical specifications with safety margins.',
        suggestedEvidencePrompt: 'e.g. Conducted site leveling survey and generated 2D structural plans for community drainage project.',
      },
    ],
    sampleRoles: ['Civil Site Engineer', 'Structural Draftsman', 'Quantity Surveyor', 'Project Engineer'],
  },
  {
    id: 'engineering_electrical',
    name: 'Electrical Engineering',
    icon: '⚡',
    category: 'Engineering & Construction',
    disciplines: [
      'Power Systems & Renewable Energy (Solar PV)',
      'Electronics & Embedded Systems',
      'Telecommunications & Signal Processing',
      'Control Systems & Industrial Automation',
      'Building Electrical Design',
      'Other / General Electrical Engineering',
    ],
    primaryPathways: ['Engineering', 'Skilled Trades', 'Technology'],
    coreTechnicalSkills: [
      'Solar PV Sizing & System Design (PVsyst)',
      'Single & 3-Phase Electrical Wiring',
      'Circuit Design & Simulation (MATLAB/Proteus)',
      'Multimeter & Oscilloscope Diagnostics',
      'Inverter & Battery Bank Configuration',
      'Microcontrollers (Arduino / Raspberry Pi)',
      'Electrical Schematics & Single-Line Diagrams',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Electrical Safety & Standards Adherence',
        description: 'Prioritizing earthing, circuit breaker sizing, and hazard prevention in all installations.',
        suggestedEvidencePrompt: 'e.g. Sized and installed 5kVA solar backup system for domestic installation with zero circuit faults.',
      },
    ],
    sampleRoles: ['Solar PV Engineer', 'Electrical Maintenance Engineer', 'Power Systems Associate', 'Automation Technician'],
  },
  {
    id: 'engineering_mechanical',
    name: 'Mechanical Engineering',
    icon: '⚙️',
    category: 'Engineering & Construction',
    disciplines: [
      'Automotive Engineering & Diagnostics',
      'HVAC & Refrigeration Systems',
      'Manufacturing & Production Systems',
      'Thermodynamics & Fluid Mechanics',
      'Maintenance Engineering',
      'Other / General Mechanical',
    ],
    primaryPathways: ['Engineering', 'Skilled Trades', 'Logistics & Supply Chain'],
    coreTechnicalSkills: [
      'SolidWorks / Autodesk Inventor (3D CAD)',
      'HVAC & Refrigeration Troubleshooting',
      'Automotive Computer Diagnostics (OBD-II)',
      'Hydraulics & Pneumatics Maintenance',
      'Welding & Metal Fabrication',
      'Preventive Maintenance Scheduling',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Mechanical Diagnostics & Assembly',
        description: 'Identifying mechanical wear, pressure drops, and vibration issues through systematic testing.',
        suggestedEvidencePrompt: 'e.g. Overhauled commercial air conditioning condenser unit during technical internship.',
      },
    ],
    sampleRoles: ['Mechanical Maintenance Engineer', 'HVAC Technician', 'Automotive Diagnostic Specialist', 'Plant Supervisor'],
  },
  {
    id: 'nursing',
    name: 'Nursing',
    icon: '🩺',
    category: 'Healthcare & Medical',
    disciplines: [
      'General Clinical Nursing',
      'Maternal & Child Health / Midwifery',
      'Community & Public Health Nursing',
      'Emergency & Critical Care Nursing',
      'Surgical / Perioperative Nursing',
      'Pediatric Nursing',
      'Other / General Nursing',
    ],
    primaryPathways: ['Healthcare', 'Public Service', 'Research & Academia'],
    coreTechnicalSkills: [
      'Patient Triage & Vital Signs Monitoring',
      'Medication Administration & IV Therapy',
      'Wound Care & Sterile Dressing',
      'Electronic Health Records (EHR) Documentation',
      'Infection Prevention & Control Protocols',
      'BLS / CPR & Emergency First Response',
      'Health Education & Patient Counseling',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Patient-Centered Empathy & Communication',
        description: 'Translating complex medical instructions into reassuring, culturally sensitive dialogue for patients.',
        suggestedEvidencePrompt: 'e.g. Managed 15+ daily inpatient bedside handovers and medication rounds during clinical rotation.',
      },
      {
        name: 'Crisis Triage & Clinical Calm',
        description: 'Prioritizing urgent interventions during patient emergencies while following clinical SOPs.',
        suggestedEvidencePrompt: 'e.g. Assisted clinical team in casualty ward triage during peak admission hours.',
      },
    ],
    sampleRoles: ['Registered General Nurse', 'Community Health Nurse', 'Clinical Ward Nurse', 'Health Outreach Officer'],
  },
  {
    id: 'medicine',
    name: 'Medicine',
    icon: '🏥',
    category: 'Healthcare & Medical',
    disciplines: [
      'General Medical Practice',
      'Internal Medicine',
      'Pediatrics & Child Health',
      'Surgery & Trauma',
      'Obstetrics & Gynecology',
      'Public Health & Epidemiology',
      'Other / Specialized Medicine',
    ],
    primaryPathways: ['Healthcare', 'Research & Academia', 'Public Service'],
    coreTechnicalSkills: [
      'Clinical Diagnostic Reasoning',
      'Patient History Taking & Physical Examination',
      'Interpretation of Lab & Diagnostic Imaging',
      'Pharmacotherapy & Treatment Planning',
      'Minor Surgical Procedures & Suturing',
      'Infectious Disease Surveillance',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Diagnostic Clinical Reasoning',
        description: 'Synthesizing symptoms, lab assays, and patient history into accurate differential diagnoses.',
        suggestedEvidencePrompt: 'e.g. Documented 100+ clinical case studies during hospital clinical clerkships.',
      },
    ],
    sampleRoles: ['Medical Officer', 'Clinical Research Associate', 'Public Health Medical Lead'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: '🌱',
    category: 'Agriculture & Environment',
    disciplines: [
      'Agronomy & Crop Production',
      'Horticulture & Greenhouse Farming',
      'Animal Husbandry & Poultry Science',
      'Agribusiness Management & Marketing',
      'Soil Science & Irrigation Technology',
      'Fisheries & Aquaculture',
      'Other / General Agriculture',
    ],
    primaryPathways: ['Agriculture', 'Entrepreneurship & Agribusiness', 'Environment & Sustainability'],
    coreTechnicalSkills: [
      'Drip Irrigation Sizing & Installation',
      'Soil Fertility & Organic Composting',
      'Integrated Pest Management (IPM)',
      'Poultry Broiler & Layer Flock Management',
      'Post-Harvest Storage & Packaging',
      'Farm Recordkeeping & Gross Margin Analysis',
      'Agri-input Sourcing & Wholesale Marketing',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Farm Enterprise Operations',
        description: 'Managing planting calendars, harvest logistics, and field worker coordination.',
        suggestedEvidencePrompt: 'e.g. Managed 0.5-hectare commercial vegetable trial yielding 800kg tomatoes for local market.',
      },
    ],
    sampleRoles: ['Agribusiness Manager', 'Agronomist', 'Horticulture Specialist', 'Farm Operations Supervisor'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    category: 'Education & Pedagogy',
    disciplines: [
      'STEM Teaching & Science Pedagogy',
      'Early Childhood & Primary Education',
      'Secondary Language & Humanities Teaching',
      'TVET & Vocational Instruction',
      'Curriculum Development & Instructional Design',
      'Educational Leadership & Administration',
      'Other / General Education',
    ],
    primaryPathways: ['Education', 'Public Service', 'Research & Academia'],
    coreTechnicalSkills: [
      'Lesson Planning & Instructional Scaffolding',
      'Student Assessment & Rubric Grading',
      'Classroom Management & Inclusive Pedagogy',
      'EdTech Tools (Google Classroom, Moodle, Kahoot)',
      'Educational Material & Worksheet Design',
      'Differentiated Learning Strategies',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Empowering Learner Engagement',
        description: 'Simplifying complex topics through interactive analogies, experiments, and structured feedback.',
        suggestedEvidencePrompt: 'e.g. Delivered 40+ hours of high school mathematics instruction during student-teaching practicum.',
      },
    ],
    sampleRoles: ['Secondary STEM Teacher', 'TVET Instructor', 'Instructional Designer', 'Education Program Officer'],
  },
  {
    id: 'law',
    name: 'Law',
    icon: '⚖️',
    category: 'Law & Governance',
    disciplines: [
      'Commercial & Corporate Law',
      'Human Rights & Constitutional Law',
      'Intellectual Property & Cyber Law',
      'Labor & Employment Law',
      'Litigation & Dispute Resolution',
      'Other / General Legal Studies',
    ],
    primaryPathways: ['Law & Governance', 'Public Service', 'Business & Finance'],
    coreTechnicalSkills: [
      'Legal Research & Case Law Citation',
      'Contract Drafting & Review',
      'Statutory Compliance Auditing',
      'Legal Brief & Memo Writing',
      'Dispute Mediation Techniques',
      'Due Diligence Investigation',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Analytical Legal Argumentation',
        description: 'Structuring clear, precedent-backed legal arguments and identifying contractual loopholes.',
        suggestedEvidencePrompt: 'e.g. Drafted commercial lease agreements and client legal opinions in moot court competition.',
      },
    ],
    sampleRoles: ['Corporate Legal Associate', 'Legal Researcher', 'Compliance Officer', 'Paralegal'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📣',
    category: 'Business & Communications',
    disciplines: [
      'Digital Marketing & Social Media Management',
      'Brand Strategy & Visual Storytelling',
      'Performance Marketing & SEO/SEM',
      'Content Marketing & Copywriting',
      'Market Research & Consumer Analytics',
      'Other / General Marketing',
    ],
    primaryPathways: ['Media & Communications', 'Creative & Design', 'Business & Finance'],
    coreTechnicalSkills: [
      'Social Media Ads (Meta Ads, Google Ads)',
      'SEO Keyword Research & Optimization',
      'Copywriting & Content Calendar Strategy',
      'Google Analytics & Conversion Tracking',
      'Canva & Adobe Creative Suite Basics',
      'Email Marketing Automation (Mailchimp)',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Audience Engagement & Growth',
        description: 'Executing targeted digital campaigns that increase follower acquisition and lead conversions.',
        suggestedEvidencePrompt: 'e.g. Grew campus student union social media engagement by 65% through weekly video series.',
      },
    ],
    sampleRoles: ['Digital Marketing Specialist', 'Social Media Manager', 'Content Strategist', 'Brand Associate'],
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    category: 'Creative & Design',
    disciplines: [
      'UI/UX & Product Design',
      'Graphic Design & Branding',
      'Motion Graphics & 2D/3D Animation',
      'Industrial & Product Design',
      'Interior & Architectural Design',
      'Other / General Design',
    ],
    primaryPathways: ['Creative & Design', 'Technology', 'Media & Communications'],
    coreTechnicalSkills: [
      'Figma & FigJam (Wireframes & Prototypes)',
      'Design Systems & Auto-Layout in Figma',
      'Adobe Illustrator & Photoshop',
      'User Personas & Usability Testing',
      'Typography, Color Theory & Visual Hierarchy',
      'Design Handoff for Developers',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'User-Centric Design Thinking',
        description: 'Translating user pain points into frictionless, aesthetically polished digital interfaces.',
        suggestedEvidencePrompt: 'e.g. Designed mobile prototype for a health tracking app validated with 10 user testing interviews.',
      },
    ],
    sampleRoles: ['UI/UX Product Designer', 'Graphic Designer', 'Brand Visual Designer', 'Creative Lead'],
  },
  {
    id: 'environmental_science',
    name: 'Environmental Science',
    icon: '🌍',
    category: 'Natural Sciences & Environment',
    disciplines: [
      'Environmental Impact Assessment (EIA)',
      'Climate Change Mitigation & Adaptation',
      'Waste Management & Circular Economy',
      'Forestry, Wildlife & Conservation Biology',
      'GIS & Remote Sensing',
      'Other / General Environmental Science',
    ],
    primaryPathways: ['Environment & Sustainability', 'Public Service', 'Research & Academia'],
    coreTechnicalSkills: [
      'GIS Mapping (QGIS / ArcGIS)',
      'Environmental Impact Assessment (EIA) Protocols',
      'Water & Air Quality Sampling',
      'Carbon Footprint Auditing',
      'Ecological Data Analysis',
      'Environmental Policy Compliance',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Ecological Fieldwork & Auditing',
        description: 'Executing structured field sampling, community questionnaires, and habitat assessments.',
        suggestedEvidencePrompt: 'e.g. Conducted coastal erosion survey mapping 5km shoreline using QGIS.',
      },
    ],
    sampleRoles: ['Environmental Officer', 'GIS Technician', 'Sustainability Consultant', 'Conservation Field Officer'],
  },
  {
    id: 'vocational_trades',
    name: 'Vocational / Technical Training',
    icon: '🔧',
    category: 'Skilled Trades & TVET',
    disciplines: [
      'Solar PV & Renewable Energy Systems',
      'Domestic & Industrial Electrical Installation',
      'Automotive Mechanics & Diagnostics',
      'Welding & Metal Fabrication',
      'Plumbing & Pipe Fitting',
      'Carpentry & Furniture Joinery',
      'Refrigeration & Air Conditioning',
      'Other / Skilled Technical Trade',
    ],
    primaryPathways: ['Skilled Trades', 'Engineering', 'Entrepreneurship & Agribusiness'],
    coreTechnicalSkills: [
      'Technical Blueprint & Wiring Diagram Reading',
      'Power Tool & Machine Operation Safety',
      'Solar Panel Wiring & Inverter Setup',
      'Troubleshooting & Fault Finding',
      'Welding (MIG/TIG/Arc) Techniques',
      'Material Measurement & Quantity Estimation',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Hands-on Technical Craftsmanship',
        description: 'Executing durable physical installations matching technical and safety standards.',
        suggestedEvidencePrompt: 'e.g. Completed 3 residential electrical re-wiring jobs during 6-month TVET apprenticeship.',
      },
    ],
    sampleRoles: ['Solar PV Technician', 'Certified Electrician', 'Automotive Technician', 'HVAC Specialist'],
  },
  {
    id: 'other',
    name: 'Other',
    icon: '✨',
    category: 'Custom / Multidisciplinary',
    disciplines: [
      'Multidisciplinary Studies',
      'Self-Taught / Independent Learning',
      'Interdisciplinary Arts & Sciences',
      'Custom Discipline',
    ],
    primaryPathways: ['Not sure yet', 'Entrepreneurship & Agribusiness', 'Technology', 'Business & Finance'],
    coreTechnicalSkills: [
      'Project Coordination & Task Management',
      'Digital Literacy & Cloud Collaboration',
      'Written & Verbal Professional Communication',
      'Research & Information Synthesis',
      'Basic Data Organization & Spreadsheets',
    ],
    evidenceBasedCompetencies: [
      {
        name: 'Adaptable Learning & Self-Direction',
        description: 'Demonstrating proactive capacity to acquire new domain skills rapidly without rigid supervision.',
        suggestedEvidencePrompt: 'e.g. Completed multiple online certifications and applied new knowledge directly to personal projects.',
      },
    ],
    sampleRoles: ['Operations Associate', 'Project Assistant', 'Digital Coordinator', 'Entrepreneur'],
  },
];

/**
 * Dynamic Helpers for Mapping and Personalization
 */

export function getDisciplinesForField(fieldName: string): string[] {
  if (!fieldName) return [];
  const normalized = fieldName.trim().toLowerCase();

  const found = FIELDS_OF_STUDY_CONFIG.find(
    (f) =>
      f.name.toLowerCase() === normalized ||
      f.id.toLowerCase() === normalized ||
      normalized.includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(normalized)
  );

  if (found) {
    return found.disciplines;
  }

  // Generic fallback if not explicitly matched
  return [
    'General Specialty',
    'Applied Practice',
    'Management & Coordination',
    'Technical / Vocational Focus',
    'Research & Analytics',
    'Other / Custom Specialty',
  ];
}

export function getPersonalizedSkillSuggestions(
  field?: string,
  discipline?: string,
  pathway?: string,
  existingSkills: string[] = []
): string[] {
  const existingSet = new Set((existingSkills || []).map((s) => s.toLowerCase().trim()));
  const suggestions: string[] = [];

  // Match field
  const normalizedField = (field || '').toLowerCase().trim();
  const matchedField = FIELDS_OF_STUDY_CONFIG.find(
    (f) =>
      f.name.toLowerCase() === normalizedField ||
      f.id.toLowerCase() === normalizedField ||
      normalizedField.includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(normalizedField)
  );

  if (matchedField) {
    matchedField.coreTechnicalSkills.forEach((s) => {
      if (!existingSet.has(s.toLowerCase().trim())) {
        suggestions.push(s);
      }
    });
  }

  // Match pathway
  const normalizedPathway = (pathway || '').toLowerCase().trim();
  const matchedPathway = CAREER_PATHWAYS_LIST.find(
    (p) =>
      p.name.toLowerCase() === normalizedPathway ||
      p.title.toLowerCase().includes(normalizedPathway) ||
      normalizedPathway.includes(p.name.toLowerCase())
  );

  if (matchedPathway) {
    matchedPathway.keyCompetencies.forEach((c) => {
      if (!existingSet.has(c.toLowerCase().trim()) && !suggestions.includes(c)) {
        suggestions.push(c);
      }
    });
  }

  // If specific discipline is given, add discipline-oriented skills
  if (discipline) {
    const discLower = discipline.toLowerCase();
    if (discLower.includes('ai') || discLower.includes('machine learning')) {
      ['PyTorch / TensorFlow', 'Pandas & NumPy', 'Model Fine-tuning', 'Prompt Engineering'].forEach((s) => {
        if (!existingSet.has(s.toLowerCase()) && !suggestions.includes(s)) suggestions.unshift(s);
      });
    } else if (discLower.includes('cyber') || discLower.includes('security')) {
      ['Wireshark', 'SOC Incident Response', 'Vulnerability Scanning (Nmap)', 'Penetration Testing'].forEach((s) => {
        if (!existingSet.has(s.toLowerCase()) && !suggestions.includes(s)) suggestions.unshift(s);
      });
    } else if (discLower.includes('mobile')) {
      ['React Native', 'Flutter', 'Android Studio (Kotlin)', 'App Store Deployment'].forEach((s) => {
        if (!existingSet.has(s.toLowerCase()) && !suggestions.includes(s)) suggestions.unshift(s);
      });
    } else if (discLower.includes('audit') || discLower.includes('tax')) {
      ['Auditing Working Papers', 'Tax Law Compliance', 'Internal Control Systems', 'Sampling Methodology'].forEach((s) => {
        if (!existingSet.has(s.toLowerCase()) && !suggestions.includes(s)) suggestions.unshift(s);
      });
    } else if (discLower.includes('solar')) {
      ['PVsyst Simulation', 'Solar String Inverter Sizing', 'Battery Storage Safety', 'Off-Grid Sizing'].forEach((s) => {
        if (!existingSet.has(s.toLowerCase()) && !suggestions.includes(s)) suggestions.unshift(s);
      });
    }
  }

  // If still empty, supply foundational cross-functional skills
  if (suggestions.length === 0) {
    ['Data Analysis', 'Project Management', 'Technical Problem Solving', 'Quality Assurance', 'Process Optimization'].forEach((s) => {
      if (!existingSet.has(s.toLowerCase())) suggestions.push(s);
    });
  }

  return suggestions.slice(0, 16);
}

export function getEvidenceBasedCompetencies(
  field?: string,
  discipline?: string,
  pathway?: string,
  experienceYears?: string
): { name: string; description: string; suggestedEvidencePrompt: string }[] {
  const normalizedField = (field || '').toLowerCase().trim();
  const matchedField = FIELDS_OF_STUDY_CONFIG.find(
    (f) =>
      f.name.toLowerCase() === normalizedField ||
      f.id.toLowerCase() === normalizedField ||
      normalizedField.includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(normalizedField)
  );

  if (matchedField && matchedField.evidenceBasedCompetencies.length > 0) {
    return matchedField.evidenceBasedCompetencies;
  }

  return [
    {
      name: 'Structured Problem Solving',
      description: 'Systematic approach to breaking down operational blockers into actionable steps.',
      suggestedEvidencePrompt: 'e.g. Documented and resolved workflow bottlenecks during university coursework.',
    },
    {
      name: 'Collaborative Teamwork',
      description: 'Productive peer execution and constructive feedback across group milestones.',
      suggestedEvidencePrompt: 'e.g. Led peer sub-group to deliver project deliverable before deadline.',
    },
    {
      name: 'Accountability & Delivery Rigor',
      description: 'Dependable execution on commitments with clear communication on progress.',
      suggestedEvidencePrompt: 'e.g. Consistently met all academic project deadlines with high evaluation scores.',
    },
  ];
}

export function recommendPathwayFromProfile(profile: Partial<UserProfile>): {
  pathway: CareerPathwayType;
  title: string;
  reason: string;
} {
  const field = (profile.fieldOfStudy || '').toLowerCase();
  const discipline = (profile.discipline || '').toLowerCase();
  const skills = (profile.currentSkills || []).join(' ').toLowerCase();

  if (field.includes('computer') || field.includes('software') || field.includes('it') || skills.includes('react') || skills.includes('python')) {
    return {
      pathway: 'Technology',
      title: 'Technology & AI',
      reason: 'Your background in computer systems and software programming provides a strong runway for tech roles across Africa.',
    };
  }

  if (field.includes('account') || field.includes('finance') || field.includes('econ') || field.includes('business')) {
    return {
      pathway: 'Business & Finance',
      title: 'Business, Finance & Banking',
      reason: 'Your financial analysis and accounting coursework directly matches commercial and fintech demand.',
    };
  }

  if (field.includes('nurs') || field.includes('med') || field.includes('health')) {
    return {
      pathway: 'Healthcare',
      title: 'Healthcare & Life Sciences',
      reason: 'Your clinical and medical training aligns with healthcare systems and public health initiatives.',
    };
  }

  if (field.includes('agri') || field.includes('crop') || field.includes('soil')) {
    return {
      pathway: 'Agriculture',
      title: 'Agriculture & Agribusiness',
      reason: 'Your agronomy and agribusiness background positions you at the heart of food security and agro-export growth.',
    };
  }

  if (field.includes('civil') || field.includes('electr') || field.includes('mechanic') || field.includes('engine')) {
    return {
      pathway: 'Engineering',
      title: 'Engineering & Infrastructure',
      reason: 'Your engineering training equips you to lead renewable energy, structural, and infrastructure projects.',
    };
  }

  return {
    pathway: 'Technology',
    title: 'Technology & Modern Services',
    reason: 'High regional demand for digitally agile professionals with problem-solving capabilities.',
  };
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

