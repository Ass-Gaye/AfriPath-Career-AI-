export type SkillProficiencyLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const PROFICIENCY_DESCRIPTIONS: Record<SkillProficiencyLevel, { label: string; description: string }> = {
  0: { label: 'No Evidence', description: 'No documented coursework, project, or experience found.' },
  1: { label: 'Awareness', description: 'Understands basic terms, concepts, and high-level use cases.' },
  2: { label: 'Beginner', description: 'Can perform basic tasks with direct guidance or documentation.' },
  3: { label: 'Intermediate', description: 'Works independently on standard industry tasks and production pipelines.' },
  4: { label: 'Advanced', description: 'Solves complex edge-cases, architects solutions, and mentors junior peers.' },
  5: { label: 'Expert', description: 'Industry authority, establishes engineering or operational standards.' },
};

export type SkillImportance = 'HIGH' | 'MEDIUM' | 'LOW';

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ResourceLink {
  title: string;
  provider: string;
  url: string;
  isFree: boolean;
  type: 'Course' | 'Project' | 'Certification' | 'Tutorial' | 'Apprenticeship' | 'Local Institute';
  africanProvider?: boolean;
}

export interface CompetencyRequirement {
  id: string;
  name: string;
  importance: SkillImportance;
  requiredProficiency: SkillProficiencyLevel;
  category: 'Technical' | 'Soft' | 'Domain' | 'Tool' | 'Vocational';
  description: string;
  transferableFrom: string[];
  recommendedResources: ResourceLink[];
  assessmentQuestions?: AssessmentQuestion[];
}

export interface CareerCompetencyProfile {
  careerId: string;
  careerTitle: string;
  sector: string;
  disciplineAliases: string[];
  competencies: CompetencyRequirement[];
}

export const CAREER_COMPETENCY_REGISTRY: Record<string, CareerCompetencyProfile> = {
  'data-analyst': {
    careerId: 'data-analyst',
    careerTitle: 'Data Analyst',
    sector: 'Technology & AI',
    disciplineAliases: ['data science', 'statistics', 'computer science', 'mathematics', 'economics', 'business analysis'],
    competencies: [
      {
        id: 'sql',
        name: 'SQL',
        importance: 'HIGH',
        requiredProficiency: 3, // Intermediate
        category: 'Technical',
        description: 'Writing complex queries, joins, window functions, and data aggregations from relational databases.',
        transferableFrom: ['Relational Databases', 'Microsoft Access', 'Excel Formulas', 'Query Languages'],
        recommendedResources: [
          { title: 'SQL for Data Analysis', provider: 'ALX Africa', url: 'https://alxafrica.com', isFree: true, type: 'Course', africanProvider: true },
          { title: 'PostgreSQL Tutorial & Exercises', provider: 'FreeCodeCamp', url: 'https://freecodecamp.org', isFree: true, type: 'Course' },
        ],
        assessmentQuestions: [
          {
            id: 'sql-q1',
            question: 'Which SQL clause is used to filter records after aggregation with GROUP BY?',
            options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
            correctIndex: 1,
            explanation: 'The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.',
          },
          {
            id: 'sql-q2',
            question: 'What type of JOIN returns all records when there is a match in either left or right table?',
            options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
            correctIndex: 2,
            explanation: 'FULL OUTER JOIN returns all matched rows along with unmatched rows from both tables.',
          },
          {
            id: 'sql-q3',
            question: 'Which window function assigns a rank to each row within a partition without leaving gaps in ranking values?',
            options: ['ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'NTILE()'],
            correctIndex: 2,
            explanation: 'DENSE_RANK() computes the rank of a row without gaps in rankings for tied values.',
          },
        ],
      },
      {
        id: 'excel',
        name: 'Excel & Spreadsheets',
        importance: 'HIGH',
        requiredProficiency: 3, // Intermediate
        category: 'Tool',
        description: 'Advanced lookup functions (XLOOKUP, INDEX/MATCH), pivot tables, data cleaning, and dashboarding.',
        transferableFrom: ['Google Sheets', 'Financial Modeling', 'Data Entry', 'Bookkeeping'],
        recommendedResources: [
          { title: 'Advanced Excel for African Business Analysts', provider: 'InSist Academy Gambia', url: 'https://insistglobal.com', isFree: false, type: 'Local Institute', africanProvider: true },
          { title: 'Excel Skills for Business', provider: 'Coursera / Macquarie', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
        assessmentQuestions: [
          {
            id: 'excel-q1',
            question: 'What advantage does XLOOKUP have over traditional VLOOKUP?',
            options: ['It only works horizontally', 'It defaults to exact match and can look up to the left', 'It requires data to be sorted ascending', 'It requires more memory'],
            correctIndex: 1,
            explanation: 'XLOOKUP defaults to exact match and can search columns to the left of the return column.',
          },
        ],
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization & BI',
        importance: 'HIGH',
        requiredProficiency: 3, // Intermediate
        category: 'Technical',
        description: 'Designing clear, executive-ready dashboards in Power BI, Tableau, or Metabase.',
        transferableFrom: ['Graphic Design', 'Presentation Design', 'Business Reporting', 'Infographics'],
        recommendedResources: [
          { title: 'Power BI Interactive Dashboards', provider: 'DataCamp', url: 'https://datacamp.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'statistics',
        name: 'Statistical Methods',
        importance: 'MEDIUM',
        requiredProficiency: 3, // Intermediate
        category: 'Domain',
        description: 'Hypothesis testing, probability distributions, sample sizing, and regression analysis.',
        transferableFrom: ['Academic Mathematics', 'Research Methods', 'Economics Econometrics', 'Biostatistics'],
        recommendedResources: [
          { title: 'Applied Statistics for Analysts', provider: 'Khan Academy', url: 'https://khanacademy.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'python-data',
        name: 'Python for Data Analysis',
        importance: 'MEDIUM',
        requiredProficiency: 2, // Beginner/Intermediate
        category: 'Technical',
        description: 'Using pandas, numpy, and matplotlib for data manipulation and automated ETL scripts.',
        transferableFrom: ['R Programming', 'General Programming', 'MATLAB', 'Scripting'],
        recommendedResources: [
          { title: 'Python for Data Science', provider: 'DeepLearning.AI', url: 'https://deeplearning.ai', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'communication',
        name: 'Data Storytelling & Communication',
        importance: 'HIGH',
        requiredProficiency: 3, // Intermediate
        category: 'Soft',
        description: 'Translating technical statistical insights into clear business and policy recommendations.',
        transferableFrom: ['Public Speaking', 'Report Writing', 'Debate', 'Client Relations', 'Teaching'],
        recommendedResources: [
          { title: 'Data Storytelling Masterclass', provider: 'ALX Professional Skills', url: 'https://alxafrica.com', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
    ],
  },

  'fullstack-web-developer': {
    careerId: 'fullstack-web-developer',
    careerTitle: 'Full-Stack Web & Mobile Developer',
    sector: 'Technology & AI',
    disciplineAliases: ['computer science', 'software engineering', 'information technology', 'web development'],
    competencies: [
      {
        id: 'javascript-typescript',
        name: 'JavaScript / TypeScript',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Asynchronous programming, closures, ES6+, DOM manipulation, and strong type safety.',
        transferableFrom: ['Java', 'C#', 'Python', 'PHP', 'General Scripting'],
        recommendedResources: [
          { title: 'Full Stack Open (React & Node)', provider: 'University of Helsinki', url: 'https://fullstackopen.com', isFree: true, type: 'Course' },
        ],
        assessmentQuestions: [
          {
            id: 'js-q1',
            question: 'What is the purpose of Promise.all() in JavaScript?',
            options: ['To run promises sequentially', 'To wait for all promises in an iterable to resolve or reject', 'To cancel running promises', 'To catch syntax errors'],
            correctIndex: 1,
            explanation: 'Promise.all waits for all promises in an array to resolve before returning an array of resolved values.',
          },
        ],
      },
      {
        id: 'frontend-react',
        name: 'Modern Frontend (React / Vue)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Component lifecycle, hooks, state management, accessibility, and responsive UI layout.',
        transferableFrom: ['HTML5 & CSS3', 'UI Design', 'Angular', 'Mobile App Layout'],
        recommendedResources: [
          { title: 'React Official Documentation & Interactive Guide', provider: 'React.dev', url: 'https://react.dev', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'backend-apis',
        name: 'Backend API Development (Node/Express/Python)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'RESTful API architecture, authentication (JWT/OAuth), middleware, and data validation.',
        transferableFrom: ['Database Management', 'PHP Backend', 'Java Spring', 'Server Administration'],
        recommendedResources: [
          { title: 'Node.js Backend Microservices', provider: 'FreeCodeCamp', url: 'https://freecodecamp.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'databases',
        name: 'Database Architecture (SQL & NoSQL)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Schema modeling, relational normalization, indexing, queries, and ORMs.',
        transferableFrom: ['Access', 'Spreadsheet Modeling', 'Data Structures'],
        recommendedResources: [
          { title: 'PostgreSQL Database Design', provider: 'PostgreSQL.org', url: 'https://postgresql.org', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'git-collaboration',
        name: 'Git Version Control & CI/CD',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'Branching strategies, resolving merge conflicts, pull requests, and deployment workflows.',
        transferableFrom: ['Command Line Interface', 'Team Coordination', 'File Management'],
        recommendedResources: [
          { title: 'Git & GitHub Immersion', provider: 'ALX Software Engineering', url: 'https://alxafrica.com', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
      {
        id: 'problem-solving',
        name: 'Algorithmic Problem Solving & Debugging',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Root-cause error tracing, test writing, performance profiling, and refactoring.',
        transferableFrom: ['Mathematics', 'Logical Reasoning', 'Troubleshooting Hardware'],
        recommendedResources: [
          { title: 'LeetCode / HackerRank Problem Sets', provider: 'HackerRank', url: 'https://hackerrank.com', isFree: true, type: 'Project' },
        ],
      },
    ],
  },

  'agribusiness-specialist': {
    careerId: 'agribusiness-specialist',
    careerTitle: 'Agribusiness & Precision Farming Specialist',
    sector: 'Agriculture, Agribusiness & Fisheries',
    disciplineAliases: ['agriculture', 'agronomy', 'horticulture', 'crop science', 'soil science', 'agricultural economics'],
    competencies: [
      {
        id: 'crop-soil-science',
        name: 'Agronomy & Soil Management',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Soil pH and nutrient balance testing, crop rotation strategies, disease diagnosis, and integrated pest control.',
        transferableFrom: ['Biology', 'Environmental Science', 'Botany', 'Family Farming Experience'],
        recommendedResources: [
          { title: 'Tropical Agriculture & Soil Health', provider: 'National Agricultural Research Institute (NARI)', url: 'http://www.nari.gm', isFree: true, type: 'Local Institute', africanProvider: true },
        ],
      },
      {
        id: 'irrigation-climate',
        name: 'Climate-Smart Irrigation & Drip Systems',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Solar-powered water pumping sizing, drip line calibration, water conservation, and seasonal rainwater harvesting.',
        transferableFrom: ['Plumbing', 'Hydraulics', 'General Physics', 'Solar PV Installation'],
        recommendedResources: [
          { title: 'Solar Irrigation for West Africa', provider: 'FAO Regional Africa', url: 'https://fao.org/africa', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
      {
        id: 'agri-financial-planning',
        name: 'Farm Financial Planning & Unit Economics',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Input cost budgeting, seasonal cashflow forecasting, break-even yield calculation, and market pricing strategy.',
        transferableFrom: ['Bookkeeping', 'Business Administration', 'Microfinance', 'Spreadsheets'],
        recommendedResources: [
          { title: 'Agri-Enterprise Financial Management', provider: 'Gambia Youth Chamber of Commerce', url: 'https://gycc.gm', isFree: true, type: 'Local Institute', africanProvider: true },
        ],
      },
      {
        id: 'post-harvest-logistics',
        name: 'Post-Harvest Handling & Cold Chain Management',
        importance: 'HIGH',
        requiredProficiency: 2,
        category: 'Vocational',
        description: 'Sorting, packaging, solar drying, cold storage temperature maintenance, and minimizing transport damage.',
        transferableFrom: ['Supply Chain', 'Warehousing', 'Food Processing'],
        recommendedResources: [
          { title: 'Post-Harvest Loss Prevention', provider: 'WFP Post-Harvest Hub', url: 'https://wfp.org', isFree: true, type: 'Tutorial', africanProvider: true },
        ],
      },
      {
        id: 'outreach-farmer-training',
        name: 'Farmer Group Training & Extension Outreach',
        importance: 'MEDIUM',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Community facilitation in local languages (Wolof, Mandinka, Fula), demonstration plots, and cooperative leadership.',
        transferableFrom: ['Community Organizing', 'Teaching', 'Youth Leadership', 'Public Speaking'],
        recommendedResources: [
          { title: 'Agricultural Extension Methodologies', provider: 'University of The Gambia School of Agriculture', url: 'https://utg.edu.gm', isFree: false, type: 'Local Institute', africanProvider: true },
        ],
      },
    ],
  },

  'clinical-nurse-specialist': {
    careerId: 'clinical-nurse-specialist',
    careerTitle: 'Clinical Care & Public Health Practitioner',
    sector: 'Healthcare & Life Sciences',
    disciplineAliases: ['nursing', 'public health', 'medicine', 'clinical medicine', 'pharmacy', 'health sciences'],
    competencies: [
      {
        id: 'patient-triage',
        name: 'Patient Assessment & Emergency Triage',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Vital signs monitoring, rapid symptom triage, emergency response protocol, and clinical documentation.',
        transferableFrom: ['First Aid & CPR', 'Pharmacy Dispensing', 'Community Health Worker Experience'],
        recommendedResources: [
          { title: 'Clinical Nursing Protocols', provider: 'Edward Francis Small Teaching Hospital (EFSTH)', url: 'https://moh.gov.gm', isFree: false, type: 'Local Institute', africanProvider: true },
        ],
      },
      {
        id: 'infection-control',
        name: 'Infection Prevention & Sterile Techniques',
        importance: 'HIGH',
        requiredProficiency: 4,
        category: 'Domain',
        description: 'Sterile field maintenance, waste management, standard precautions, and antimicrobial stewardship.',
        transferableFrom: ['Laboratory Safety', 'Biology Lab Procedures', 'Hygiene Standards'],
        recommendedResources: [
          { title: 'WHO Infection Prevention in Low-Resource Settings', provider: 'World Health Organization', url: 'https://openwho.org', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
      {
        id: 'pharmacology-administration',
        name: 'Medication Administration & Dosage Calculation',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'The 5 rights of medication administration, IV fluid calculation, adverse reaction reporting, and safe storage.',
        transferableFrom: ['Applied Mathematics', 'Pharmacy Assisting', 'Chemistry'],
        recommendedResources: [
          { title: 'Safe Medication Administration Protocols', provider: 'Gambia Nursing & Midwifery Council', url: 'https://moh.gov.gm', isFree: true, type: 'Tutorial', africanProvider: true },
        ],
      },
      {
        id: 'public-health-surveillance',
        name: 'Epidemiological Surveillance & Health Data',
        importance: 'MEDIUM',
        requiredProficiency: 2,
        category: 'Domain',
        description: 'DHIS2 recording, vaccination tracking, malaria surveillance, and maternal health indicators reporting.',
        transferableFrom: ['Data Entry', 'Survey Fieldwork', 'Excel'],
        recommendedResources: [
          { title: 'DHIS2 Health Data Training', provider: 'University of Oslo / DHIS2', url: 'https://dhis2.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'empathy-communication',
        name: 'Patient Empathy & Sensitive Communication',
        importance: 'HIGH',
        requiredProficiency: 4,
        category: 'Soft',
        description: 'Active listening, counseling anxious patients and families, cultural competence, and de-escalation.',
        transferableFrom: ['Customer Support', 'Peer Counseling', 'Community Outreach'],
        recommendedResources: [
          { title: 'Compassionate Healthcare Communication', provider: 'Coursera / Johns Hopkins', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
    ],
  },

  'solar-pv-engineer': {
    careerId: 'solar-pv-engineer',
    careerTitle: 'Solar PV & Renewable Energy Systems Engineer',
    sector: 'Skilled Trades & Vocational',
    disciplineAliases: ['electrical engineering', 'energy engineering', 'solar', 'physics', 'mechanical engineering', 'renewable energy'],
    competencies: [
      {
        id: 'solar-sizing',
        name: 'Solar PV System Sizing & Load Analysis',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Daily watt-hour load profiling, peak sun hour calculations, battery storage sizing, and inverter capacity matching.',
        transferableFrom: ['Physics Circuit Theory', 'Electrical Schematics', 'Spreadsheet Modeling'],
        recommendedResources: [
          { title: 'Solar PV Design & Installation Standard', provider: 'GTTI / NAWEC Clean Energy', url: 'https://gtti.gm', isFree: false, type: 'Local Institute', africanProvider: true },
        ],
      },
      {
        id: 'electrical-safety-codes',
        name: 'Electrical Schematics & West African Wiring Standards',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Vocational',
        description: 'DC/AC circuit protection (fuses, breakers, surge protection), grounding/earthing systems, and conduit routing.',
        transferableFrom: ['General Electrical Trade', 'Apprenticeship', 'Physics Lab Wiring'],
        recommendedResources: [
          { title: 'IEC / West Africa Solar Installation Safety', provider: 'ECREEE Regional Center', url: 'https://ecreee.org', isFree: true, type: 'Certification', africanProvider: true },
        ],
      },
      {
        id: 'battery-storage',
        name: 'Lithium & Gel Battery Energy Storage Systems (BESS)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Battery management systems (BMS), charge controllers (MPPT/PWM), cycle life optimization, and thermal management.',
        transferableFrom: ['Electronics Repair', 'Automotive Battery Maintenance'],
        recommendedResources: [
          { title: 'Energy Storage Systems Operations', provider: 'Solar Energy International (SEI)', url: 'https://solarenergy.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'field-troubleshooting',
        name: 'Multimeter Diagnostics & Troubleshooting',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'Open-circuit voltage (Voc), short-circuit current (Isc) testing, insulation resistance testing, and inverter fault code isolation.',
        transferableFrom: ['Appliance Repair', 'Hardware Troubleshooting'],
        recommendedResources: [
          { title: 'Practical Multimeter Solar Field Testing', provider: 'YouTube / Clean Energy Africa', url: 'https://youtube.com', isFree: true, type: 'Tutorial', africanProvider: true },
        ],
      },
    ],
  },

  'fintech-analyst': {
    careerId: 'fintech-analyst',
    careerTitle: 'Fintech & Digital Payments Analyst',
    sector: 'Business, Finance & Banking',
    disciplineAliases: ['finance', 'banking', 'economics', 'business administration'],
    competencies: [
      {
        id: 'financial-accounting',
        name: 'Financial Accounting & Reconciliation',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Double-entry bookkeeping, daily settlement reconciliation, ledger balancing, and transaction fee auditing.',
        transferableFrom: ['Bookkeeping', 'Commerce Coursework', 'Excel Auditing', 'Retail Cash Management'],
        recommendedResources: [
          { title: 'Digital Payment Reconciliation & Settlement', provider: 'Gamswitch Academy', url: 'https://gamswitch.gm', isFree: false, type: 'Local Institute', africanProvider: true },
          { title: 'ACCA Foundations in Accountancy', provider: 'ACCA Global', url: 'https://accaglobal.com', isFree: false, type: 'Certification' },
        ],
      },
      {
        id: 'fintech-regulations',
        name: 'AML / KYC & Central Bank Regulations',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Anti-money laundering screening, customer due diligence tiers, fraud pattern detection, and CBG regulatory compliance.',
        transferableFrom: ['Compliance', 'Legal Studies', 'Risk Management', 'Customer Onboarding'],
        recommendedResources: [
          { title: 'Central Bank of The Gambia Fintech Directives', provider: 'CBG Official Portal', url: 'https://cbg.gm', isFree: true, type: 'Tutorial', africanProvider: true },
        ],
      },
      {
        id: 'sql-financial-queries',
        name: 'SQL & Transaction Data Queries',
        importance: 'HIGH',
        requiredProficiency: 2,
        category: 'Technical',
        description: 'Querying high-volume payment transaction logs, calculating success rates, and extracting merchant summaries.',
        transferableFrom: ['Excel Lookup Formulas', 'Database Basics'],
        recommendedResources: [
          { title: 'SQL for Financial Analysis', provider: 'Coursera', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'mobile-money-protocols',
        name: 'Mobile Money & Payment Rails (USSD / ISO 8583 / APIs)',
        importance: 'MEDIUM',
        requiredProficiency: 2,
        category: 'Technical',
        description: 'Understanding USSD flows, QR payments, mobile wallet APIs (Wave, QMoney, Afrimoney), and bank integrations.',
        transferableFrom: ['Telecom Operations', 'API Basics', 'POS Terminal Operations'],
        recommendedResources: [
          { title: 'African Digital Payment Infrastructure Overview', provider: 'AfriPath Tech Library', url: '#', isFree: true, type: 'Tutorial', africanProvider: true },
        ],
      },
    ],
  },

  'financial-analyst': {
    careerId: 'financial-analyst',
    careerTitle: 'Financial Analyst',
    sector: 'Business, Finance & Banking',
    disciplineAliases: ['financial analysis', 'corporate finance', 'investment analysis', 'accounting', 'auditing'],
    competencies: [
      {
        id: 'financial-modeling',
        name: 'Financial Modeling & Valuation (DCF / 3-Statement)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Building dynamic 3-statement integrated financial models, DCF valuations, and sensitivity analysis.',
        transferableFrom: ['Accounting', 'Financial Reporting', 'Bookkeeping', 'Cost Accounting'],
        recommendedResources: [
          { title: 'Financial Modeling & Valuation Masterclass', provider: 'Corporate Finance Institute (CFI)', url: 'https://corporatefinanceinstitute.com', isFree: true, type: 'Course' },
        ],
        assessmentQuestions: [
          {
            id: 'fm-q1',
            question: 'In a 3-statement model, how does Net Income flow into the Balance Sheet?',
            options: ['Through Retained Earnings in Shareholders Equity', 'Directly into Current Assets', 'Through Accounts Payable', 'It does not connect to the Balance Sheet'],
            correctIndex: 0,
            explanation: 'Net Income flows from the Income Statement into Retained Earnings on the Balance Sheet (minus dividends).',
          },
        ],
      },
      {
        id: 'advanced-excel-finance',
        name: 'Advanced Excel & Financial Forecasting',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'INDEX/MATCH, XLOOKUP, Data Tables, Scenario Manager, Solver, and financial KPI dashboards.',
        transferableFrom: ['Spreadsheets', 'Excel Formulas', 'Accounting Ledgers'],
        recommendedResources: [
          { title: 'Excel for Financial Analysis', provider: 'Coursera / Wharton', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'sql-bi-finance',
        name: 'SQL & Business Intelligence (Power BI / Tableau)',
        importance: 'HIGH',
        requiredProficiency: 2,
        category: 'Technical',
        description: 'Extracting ERP data with SQL queries and designing automated executive reporting dashboards.',
        transferableFrom: ['Database Basics', 'Spreadsheet Reporting', 'Data Entry'],
        recommendedResources: [
          { title: 'SQL & Power BI for Financial Analysts', provider: 'DataCamp', url: 'https://datacamp.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'financial-statement-analysis',
        name: 'Financial Statement Analysis & Ratios',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Liquidity, profitability, leverage, and efficiency ratios, identifying variance trends in P&L.',
        transferableFrom: ['Accounting Principles', 'Auditing', 'IFRS Standards'],
        recommendedResources: [
          { title: 'Financial Statement Analysis', provider: 'Khan Academy', url: 'https://khanacademy.org', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'investment-reporting',
        name: 'Investment Pitching & Executive Deck Preparation',
        importance: 'MEDIUM',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Presenting valuation models, risks, and strategic recommendations clearly to board and C-suite.',
        transferableFrom: ['Public Speaking', 'Report Writing', 'Client Presentations'],
        recommendedResources: [
          { title: 'Executive Financial Storytelling', provider: 'ALX Africa', url: 'https://alxafrica.com', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
    ],
  },

  'digital-marketing-manager': {
    careerId: 'digital-marketing-manager',
    careerTitle: 'Digital Marketing Manager',
    sector: 'Marketing, Media & Communications',
    disciplineAliases: ['marketing', 'digital marketing', 'growth marketing', 'communications', 'brand management'],
    competencies: [
      {
        id: 'marketing-strategy-kpis',
        name: 'Growth Strategy & Campaign Management',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Setting CAC, LTV, ROAS goals, omnichannel acquisition funnels, and managing quarterly marketing budgets.',
        transferableFrom: ['Traditional Marketing', 'Brand Strategy', 'Sales Management'],
        recommendedResources: [
          { title: 'Digital Marketing Specialization', provider: 'Google Digital Skills for Africa', url: 'https://grow.google/intl/en_africa', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
      {
        id: 'paid-ads-social',
        name: 'Paid Advertising (Meta Ads, Google Ads, TikTok)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'Audience targeting, pixel conversion tracking, A/B ad creative testing, and budget pacing.',
        transferableFrom: ['Social Media Management', 'Graphic Design', 'Copywriting'],
        recommendedResources: [
          { title: 'Meta Certified Digital Marketing Associate', provider: 'Meta Blueprint', url: 'https://facebook.com/business/learn', isFree: true, type: 'Certification' },
        ],
      },
      {
        id: 'seo-content-strategy',
        name: 'SEO & Content Marketing',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Keyword research, on-page optimization, content pillar architecture, and organic backlink building.',
        transferableFrom: ['Journalism', 'Blogging', 'Copywriting', 'Creative Writing'],
        recommendedResources: [
          { title: 'SEO Fundamentals', provider: 'HubSpot Academy', url: 'https://academy.hubspot.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'marketing-analytics',
        name: 'Marketing Analytics & GA4 / Looker Studio',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'GA4 event setup, UTM tracking, attribution modeling, and automated executive dashboards.',
        transferableFrom: ['Excel', 'Data Entry', 'Business Reporting'],
        recommendedResources: [
          { title: 'Google Analytics 4 Certification', provider: 'Google Skillshop', url: 'https://skillshop.withgoogle.com', isFree: true, type: 'Certification' },
        ],
      },
      {
        id: 'brand-copywriting',
        name: 'High-Converting Copywriting & Creative Direction',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Direct response copy, email nurture flows, and directing creative asset production.',
        transferableFrom: ['Storytelling', 'English / Literature', 'Advertising'],
        recommendedResources: [
          { title: 'Direct Response Copywriting', provider: 'Copyblogger', url: 'https://copyblogger.com', isFree: true, type: 'Tutorial' },
        ],
      },
    ],
  },

  'machine-learning-engineer': {
    careerId: 'machine-learning-engineer',
    careerTitle: 'Machine Learning & AI Engineer',
    sector: 'Technology & AI',
    disciplineAliases: ['machine learning', 'artificial intelligence', 'data science', 'deep learning', 'nlp', 'computer vision'],
    competencies: [
      {
        id: 'ml-frameworks-python',
        name: 'Python ML Frameworks (PyTorch / Scikit-Learn / TensorFlow)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Model training pipelines, hyperparameter tuning, loss optimization, and evaluation metrics.',
        transferableFrom: ['Python Programming', 'R', 'Mathematics', 'Statistics'],
        recommendedResources: [
          { title: 'Machine Learning Specialization', provider: 'DeepLearning.AI / Stanford', url: 'https://deeplearning.ai', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'feature-engineering-data',
        name: 'Data Preprocessing & Feature Engineering',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Pandas, NumPy, vectorization, handling missing values, encoding, and dimensionality reduction.',
        transferableFrom: ['SQL', 'Data Analysis', 'Excel'],
        recommendedResources: [
          { title: 'Feature Engineering for Machine Learning', provider: 'Kaggle Learn', url: 'https://kaggle.com/learn', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'mlops-deployment',
        name: 'MLOps, Model Serving & Docker (FastAPI / Triton / ONNX)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Containerizing inference services, API latency optimization, model registry, and CI/CD pipelines.',
        transferableFrom: ['Backend Development', 'DevOps', 'Linux Shell'],
        recommendedResources: [
          { title: 'MLOps Fundamentals', provider: 'Coursera / Duke', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'applied-math-stats',
        name: 'Applied Linear Algebra & Probability',
        importance: 'MEDIUM',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Matrix decompositions, gradient descent mechanics, Bayes theorem, and statistical distributions.',
        transferableFrom: ['University Mathematics', 'Engineering Math', 'Physics'],
        recommendedResources: [
          { title: 'Mathematics for Machine Learning', provider: 'Imperial College London', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
    ],
  },

  'freelance-graphic-designer': {
    careerId: 'freelance-graphic-designer',
    careerTitle: 'Freelance Graphic & Brand Identity Designer',
    sector: 'Creative & Digital Arts',
    disciplineAliases: ['graphic design', 'ui/ux design', 'brand identity', 'visual design', 'digital arts'],
    competencies: [
      {
        id: 'design-tools-figma-adobe',
        name: 'Industry Design Tools (Figma, Photoshop, Illustrator)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'Vector asset creation, raster manipulation, responsive UI layouts, component systems, and design tokens.',
        transferableFrom: ['Canva', 'Traditional Drawing', 'Art Coursework'],
        recommendedResources: [
          { title: 'Figma UI/UX & Brand Design Masterclass', provider: 'YouTube / Flux Academy', url: 'https://youtube.com', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'visual-hierarchy-typography',
        name: 'Visual Hierarchy, Color Theory & Typography',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Grid systems, typographic scale, high-contrast accessible palettes, and editorial layout.',
        transferableFrom: ['Fine Arts', 'Print Media', 'Photography'],
        recommendedResources: [
          { title: 'Graphic Design Basics', provider: 'Coursera / CalArts', url: 'https://coursera.org', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'portfolio-case-studies',
        name: 'Case Study Storytelling & Behance Portfolio',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Domain',
        description: 'Structuring client case studies, problem-solution narratives, mockups, and client testimonials.',
        transferableFrom: ['Writing', 'Project Presentations', 'Marketing'],
        recommendedResources: [
          { title: 'Building a World-Class Design Portfolio', provider: 'Dribbble / Behance', url: 'https://behance.net', isFree: true, type: 'Tutorial' },
        ],
      },
      {
        id: 'freelance-client-ops',
        name: 'Freelance Client Scoping, Contracts & Pricing',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Writing proposals, milestone billing, managing client revisions, and Upwork/Fiverr profile optimization.',
        transferableFrom: ['Customer Service', 'Negotiation', 'Small Business Sales'],
        recommendedResources: [
          { title: 'The Freelance Blueprint for African Creatives', provider: 'AfriPath Freelance Hub', url: '#', isFree: true, type: 'Course', africanProvider: true },
        ],
      },
    ],
  },

  'cybersecurity-specialist': {
    careerId: 'cybersecurity-specialist',
    careerTitle: 'Cybersecurity & SOC Defense Analyst',
    sector: 'Technology & AI',
    disciplineAliases: ['cybersecurity', 'information security', 'network security', 'soc analyst', 'ethical hacking'],
    competencies: [
      {
        id: 'network-traffic-analysis',
        name: 'Networking & Packet Analysis (Wireshark / TCP/IP)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'OSI model, subnetting, inspecting PCAP captures, DNS/HTTP traffic analysis, and firewall rules.',
        transferableFrom: ['IT Support', 'Hardware Troubleshooting', 'System Administration'],
        recommendedResources: [
          { title: 'Network Security Fundamentals', provider: 'Cisco Networking Academy', url: 'https://netacad.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'soc-siem-monitoring',
        name: 'SIEM & Log Monitoring (Splunk / Elastic / Wazuh)',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Tool',
        description: 'Triaging security alerts, writing detection queries, correlation rules, and event log auditing.',
        transferableFrom: ['Database Queries', 'System Monitoring', 'Linux Administration'],
        recommendedResources: [
          { title: 'SOC Analyst Career Path', provider: 'TryHackMe', url: 'https://tryhackme.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'vulnerability-remediation',
        name: 'Vulnerability Scanning & Threat Mitigation',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Technical',
        description: 'Nmap, Nessus/OpenVAS vulnerability scans, patch management, and OWASP Top 10 mitigation.',
        transferableFrom: ['Web Development', 'System Administration'],
        recommendedResources: [
          { title: 'Practical Ethical Hacking', provider: 'TCM Security', url: 'https://tcm-sec.com', isFree: true, type: 'Course' },
        ],
      },
      {
        id: 'incident-response-reporting',
        name: 'Incident Response & Security Documentation',
        importance: 'HIGH',
        requiredProficiency: 3,
        category: 'Soft',
        description: 'Documenting security breaches, root-cause timelines, chain of custody, and regulatory breach notification.',
        transferableFrom: ['Technical Writing', 'Compliance', 'Auditing'],
        recommendedResources: [
          { title: 'CompTIA Security+ Prep', provider: 'Professor Messer', url: 'https://professormesser.com', isFree: true, type: 'Course' },
        ],
      },
    ],
  },
};

/**
 * Resolves or builds structured competency requirements for any requested career.
 */
export function getCareerCompetencies(
  targetCareer: string,
  pathway?: string,
  fieldOfStudy?: string,
  discipline?: string
): CompetencyRequirement[] {
  const normTitle = targetCareer.toLowerCase().trim();
  const normField = (fieldOfStudy || '').toLowerCase().trim();
  const normDisc = (discipline || '').toLowerCase().trim();

  // 1. Direct registry lookup
  for (const [key, profile] of Object.entries(CAREER_COMPETENCY_REGISTRY)) {
    if (
      normTitle.includes(key) ||
      profile.careerTitle.toLowerCase().includes(normTitle) ||
      normTitle.includes(profile.careerTitle.toLowerCase()) ||
      profile.disciplineAliases.some((a) => normTitle.includes(a) || normDisc.includes(a))
    ) {
      return profile.competencies;
    }
  }

  // 2. Field/Sector fallback with structured competencies
  if (normField.includes('agri') || normDisc.includes('agri') || normTitle.includes('farm') || normTitle.includes('crop')) {
    return CAREER_COMPETENCY_REGISTRY['agribusiness-specialist'].competencies;
  }
  if (normField.includes('nurs') || normField.includes('health') || normField.includes('med') || normTitle.includes('nurse') || normTitle.includes('clinic')) {
    return CAREER_COMPETENCY_REGISTRY['clinical-nurse-specialist'].competencies;
  }
  if (normField.includes('solar') || normField.includes('energy') || normField.includes('electric') || normTitle.includes('solar') || normTitle.includes('power')) {
    return CAREER_COMPETENCY_REGISTRY['solar-pv-engineer'].competencies;
  }
  if (normField.includes('finance') || normField.includes('account') || normField.includes('bank') || normTitle.includes('finance') || normTitle.includes('account') || normTitle.includes('analyst')) {
    if (normTitle.includes('data') || normTitle.includes('ai') || normTitle.includes('bi')) {
      return CAREER_COMPETENCY_REGISTRY['data-analyst'].competencies;
    }
    return CAREER_COMPETENCY_REGISTRY['fintech-analyst'].competencies;
  }
  if (normField.includes('computer') || normField.includes('software') || normField.includes('it') || normTitle.includes('developer') || normTitle.includes('engineer') || normTitle.includes('software')) {
    if (normTitle.includes('data') || normTitle.includes('analyst')) {
      return CAREER_COMPETENCY_REGISTRY['data-analyst'].competencies;
    }
    return CAREER_COMPETENCY_REGISTRY['fullstack-web-developer'].competencies;
  }

  // Default baseline high-value career competencies for unspecified fields
  return [
    {
      id: 'core-discipline',
      name: `${targetCareer} Foundational Practice`,
      importance: 'HIGH',
      requiredProficiency: 3,
      category: 'Domain',
      description: `Core operational methodologies and standards applied in the ${targetCareer} discipline.`,
      transferableFrom: ['Academic Coursework', 'Internships', 'Industry Projects'],
      recommendedResources: [
        { title: `${targetCareer} Essentials`, provider: 'AfriPath Curated Library', url: '#', isFree: true, type: 'Course', africanProvider: true },
      ],
    },
    {
      id: 'digital-tools',
      name: 'Digital Industry Tools & Spreadsheets',
      importance: 'HIGH',
      requiredProficiency: 3,
      category: 'Tool',
      description: 'Professional computing, data record management, documentation, and reporting.',
      transferableFrom: ['Excel', 'Google Docs', 'Data Entry', 'Computer Literacy'],
      recommendedResources: [
        { title: 'Professional Productivity Tools', provider: 'ALX Africa', url: 'https://alxafrica.com', isFree: true, type: 'Course', africanProvider: true },
      ],
    },
    {
      id: 'communication-client',
      name: 'Professional Communication & Stakeholder Relations',
      importance: 'HIGH',
      requiredProficiency: 3,
      category: 'Soft',
      description: 'Clear written reporting, active listening, teamwork, and client management.',
      transferableFrom: ['Presentations', 'Team Leadership', 'Customer Care'],
      recommendedResources: [
        { title: 'Workplace Communication & Leadership', provider: 'Coursera', url: 'https://coursera.org', isFree: true, type: 'Course' },
      ],
    },
    {
      id: 'problem-solving-ops',
      name: 'Operational Problem Solving & Quality Control',
      importance: 'MEDIUM',
      requiredProficiency: 3,
      category: 'Soft',
      description: 'Analyzing bottlenecks, implementing standard operating procedures, and continuous improvement.',
      transferableFrom: ['Project Coordination', 'Troubleshooting', 'Research'],
      recommendedResources: [
        { title: 'Operational Excellence & Quality Systems', provider: 'Khan Academy', url: 'https://khanacademy.org', isFree: true, type: 'Tutorial' },
      ],
    },
  ];
}
