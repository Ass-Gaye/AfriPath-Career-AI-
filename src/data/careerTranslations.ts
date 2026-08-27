export interface LocalizedCareerContent {
  id: string; // canonical slug / ID (e.g., 'software-engineer')
  translations: {
    [langCode: string]: {
      name: string;
      tagline: string;
      description: string;
      sampleJobTitles: string[];
      aliases: string[]; // for multilingual search matching
    };
  };
}

export const CANONICAL_CAREER_TRANSLATIONS: Record<string, LocalizedCareerContent> = {
  'software-engineer': {
    id: 'software-engineer',
    translations: {
      en: {
        name: 'Software Engineer',
        tagline: 'Design and build enterprise software and scalable systems',
        description: 'Develops backend and frontend web applications, APIs, and cloud services for enterprises, fintechs, and tech hubs across Africa.',
        sampleJobTitles: ['Full Stack Developer', 'Backend Engineer', 'Frontend Engineer', 'Web Applications Developer'],
        aliases: ['programmer', 'coder', 'developer', 'software dev', 'web developer'],
      },
      fr: {
        name: 'Ingénieur Logiciel',
        tagline: 'Concevoir et développer des logiciels et systèmes évolutifs',
        description: 'Développe des applications web frontend et backend, des API et des services cloud pour les entreprises, les fintechs et les pôles tech en Afrique.',
        sampleJobTitles: ['Développeur Full Stack', 'Ingénieur Backend', 'Développeur Frontend', 'Concepteur d’applications Web'],
        aliases: ['programmeur', 'développeur web', 'informaticien', 'logiciel', 'codeur'],
      },
      wo: {
        name: 'Boroom Xarala bu Logiciel (Software Engineer)',
        tagline: 'Tabax jumtukaayi xarala ak porogaraamu ordinateer',
        description: 'Defar sit web, porogaraam yu mag ak jumtukaayi xarala ngir kër ligéey yi ci Afrik.',
        sampleJobTitles: ['Développeur Full Stack', 'Defarkat Sit Web', 'Software Developer'],
        aliases: ['programmer', 'informatique', 'ordinateur', 'codeur', 'site web'],
      },
      ar: {
        name: 'مهندس برمجيات (Software Engineer)',
        tagline: 'تصميم وتطوير الأنظمة البرمجية والتطبيقات السحابية',
        description: 'تطوير تطبيقات الويب والواجهات الخلفية والخدمات السحابية للشركات والمنصات المالية في أفريقيا.',
        sampleJobTitles: ['مطور ويب متكامل (Full Stack)', 'مهندس واجهات خلفية (Backend)', 'مطور واجهات أمامية (Frontend)'],
        aliases: ['مبرمج', 'مطور برامج', 'مهندس حاسوب', 'تطوير ويب'],
      },
    },
  },
  'data-analyst': {
    id: 'data-analyst',
    translations: {
      en: {
        name: 'Data Analyst & Business Intelligence Specialist',
        tagline: 'Transform raw data into business intelligence and insights',
        description: 'Leverages SQL, Python, Power BI, and statistical methods to uncover actionable patterns for banks, telcos, agriculture, and government agencies.',
        sampleJobTitles: ['Data Analyst', 'BI Developer', 'Insights Analyst', 'Reporting Specialist'],
        aliases: ['analytics', 'sql specialist', 'power bi', 'business analyst'],
      },
      fr: {
        name: 'Analyste de Données & Spécialiste Business Intelligence',
        tagline: 'Transformer les données brutes en indicateurs stratégiques',
        description: 'Utilise SQL, Python, Power BI et les statistiques pour éclairer les décisions des banques, opérateurs télécoms et institutions publiques.',
        sampleJobTitles: ['Analyste de Données', 'Développeur BI', 'Analyste Décisionnel', 'Chargé d’études statistiques'],
        aliases: ['data scientist', 'analyse de données', 'statistiques', 'business intelligence'],
      },
      wo: {
        name: 'Analyste de Données (Data Analyst)',
        tagline: 'Saytu lim yi ak xibaar yi ngir joxe xalaat yu wóor',
        description: 'Jëfandikoo SQL, Python ak Power BI ngir xam ni kër gi gën a mën a defee ligéeyam.',
        sampleJobTitles: ['Data Analyst', 'Saytukaat Xibaar', 'Reporting Specialist'],
        aliases: ['chiffres', 'statistiques', 'données', 'data'],
      },
      ar: {
        name: 'محلل بيانات ومتخصص ذكاء الأعمال (Data Analyst)',
        tagline: 'تحويل البيانات إلى رؤى استراتيجية لاتخاذ القرارات',
        description: 'استخدام SQL وPython وPower BI والتحليل الإحصائي لدعم القرارات في البنوك وشركات الاتصالات والجهات الحكومية.',
        sampleJobTitles: ['محلل بيانات', 'مطور ذكاء أعمال (BI)', 'أخصائي تقارير وإحصاء'],
        aliases: ['تحليل بيانات', 'إحصاء', 'ذكاء أعمال', 'علم البيانات'],
      },
    },
  },
  'cybersecurity-specialist': {
    id: 'cybersecurity-specialist',
    translations: {
      en: {
        name: 'Cybersecurity Analyst & Network Defender',
        tagline: 'Protect vital infrastructure, banking systems, and confidential data',
        description: 'Monitors threat vectors, performs vulnerability audits, and secures network topologies for African financial institutions and corporations.',
        sampleJobTitles: ['Security Operations Center (SOC) Analyst', 'Information Security Officer', 'Vulnerability Assessor'],
        aliases: ['security', 'soc analyst', 'infosec', 'hacker', 'network security'],
      },
      fr: {
        name: 'Analyste en Cybersécurité & Protection Réseaux',
        tagline: 'Protéger les infrastructures critiques, systèmes bancaires et données',
        description: 'Surveille les menaces, réalise des audits de vulnérabilité et sécurise les réseaux pour les banques et institutions africaines.',
        sampleJobTitles: ['Analyste SOC', 'Responsable Sécurité SI (RSSI)', 'Auditeur Sécurité'],
        aliases: ['sécurité informatique', 'piratage éthique', 'réseau sécurité', 'cybersécurité'],
      },
      wo: {
        name: 'Kaaraange ci Xarala (Cybersecurity Analyst)',
        tagline: 'Aar ordinateer yi ak xibaari kër ligéey yi ci saac yi',
        description: 'Aar jumtukaayi bank yi ak kër yi ci saytu yi ak mbóoti addina sépp.',
        sampleJobTitles: ['Security Analyst', 'Aarkat Xibaar'],
        aliases: ['sécurité', 'protection', 'infosec'],
      },
      ar: {
        name: 'محلل أمن سيبراني وحماية شبكات (Cybersecurity Analyst)',
        tagline: 'حماية البنية التحتية والأنظمة المصرفية والبيانات الحساسة',
        description: 'مراقبة التهديدات الرقمية وإجراء تدقيق الثغرات وحماية الشبكات للمؤسسات المالية والحكومية في أفريقيا.',
        sampleJobTitles: ['محلل مركز العمليات الأمنية (SOC)', 'مسؤول أمن المعلومات', 'مختبر اختراق'],
        aliases: ['أمن معلومات', 'حماية شبكات', 'أمن سيبراني', 'هاكر أخلاقي'],
      },
    },
  },
  'fintech-specialist': {
    id: 'fintech-specialist',
    translations: {
      en: {
        name: 'Fintech Product & Digital Payments Analyst',
        tagline: 'Drive mobile money, cross-border payments, and financial inclusion',
        description: 'Designs and manages digital wallet flows, agent banking networks, and payment gateway integrations across African markets.',
        sampleJobTitles: ['Fintech Product Manager', 'Digital Payments Officer', 'Mobile Money Operations Lead'],
        aliases: ['mobile money', 'fintech', 'payments', 'banking', 'wave', 'orange money'],
      },
      fr: {
        name: 'Spécialiste Fintech & Paiements Numériques',
        tagline: 'Accélérer le mobile money, les transferts et l’inclusion financière',
        description: 'Conçoit et supervise les solutions de paiement électronique, les réseaux d’agents et l’intégration de passerelles de paiement en Afrique.',
        sampleJobTitles: ['Chef de Produit Fintech', 'Responsable Paiements Numériques', 'Gestionnaire Opérations Mobile Money'],
        aliases: ['mobile money', 'fintech', 'paiement électronique', 'banque digitale'],
      },
      wo: {
        name: 'Xarala ci Koppar (Fintech & Mobile Money Specialist)',
        tagline: 'Yokkal yooni koppar ci telefon ak bank yu bees',
        description: 'Ligéey ci mobile money, transfertu koppar ak jumtukaayi fay yu bees ci réew mi.',
        sampleJobTitles: ['Fintech Officer', 'Mobile Money Lead'],
        aliases: ['mobile money', 'wave', 'orange money', 'koppar'],
      },
      ar: {
        name: 'أخصائي التكنولوجيا المالية والمدفوعات الرقمية (Fintech Specialist)',
        tagline: 'تطوير محافظ الهاتف والمدفوعات الإلكترونية والشمول المالي',
        description: 'إدارة وتطوير مسارات الدفع الإلكتروني وشبكات المحافظ الذكية وبوابات الدفع عبر الأسواق الأفريقية.',
        sampleJobTitles: ['مدير منتجات مالية (Fintech)', 'مسؤول مدفوعات رقمية', 'أخصائي محافظ الهاتف'],
        aliases: ['تكنولوجيا مالية', 'محافظ إلكترونية', 'دفع إلكتروني', 'بنوك رقمية'],
      },
    },
  },
  'agritech-specialist': {
    id: 'agritech-specialist',
    translations: {
      en: {
        name: 'AgriTech Specialist & Smart Farming Advisor',
        tagline: 'Modernize agriculture through IoT, solar irrigation, and farm data',
        description: 'Implements precision agriculture, climate-smart irrigation, and digital market linkages for African agribusinesses and farmers.',
        sampleJobTitles: ['AgriTech Project Manager', 'Smart Irrigation Consultant', 'Farm Operations Specialist'],
        aliases: ['agriculture', 'farming', 'agribusiness', 'irrigation', 'agritech'],
      },
      fr: {
        name: 'Spécialiste AgriTech & Agriculture Intelligente',
        tagline: 'Moderniser l’agriculture par l’IoT, l’irrigation solaire et les données',
        description: 'Déploie l’agriculture de précision, l’irrigation solaire et les plateformes numériques de commercialisation pour les agriculteurs africains.',
        sampleJobTitles: ['Responsable Projet AgriTech', 'Consultant Irrigation Intelligente', 'Spécialiste Exploitation Agricole'],
        aliases: ['agriculture', 'agrobusiness', 'agronomie', 'ferme intelligente'],
      },
      wo: {
        name: 'Xarala ci Mbay (AgriTech Specialist)',
        tagline: 'Yokkal mbay mi ak jumtukaayi xarala ak ndoxum naaje',
        description: 'Dugal xarala yu bees ci bay ak xool ni tool yi gën a mën a amee meññeef.',
        sampleJobTitles: ['AgriTech Lead', 'Baykat bu Xereñ'],
        aliases: ['mbay', 'agriculture', 'tool', 'tol'],
      },
      ar: {
        name: 'أخصائي التكنولوجيا الزراعية والزراعة الذكية (AgriTech Specialist)',
        tagline: 'تحديث الإنتاج الزراعي بالري الشمسي وإنترنت الأشياء والبيانات المناخية',
        description: 'تطبيق أساليب الزراعة الدقيقة وأنظمة الري الذكي ومنصات ربط المزارعين بالأسواق عبر أفريقيا.',
        sampleJobTitles: ['مدير مشاريع زراعية تقنية', 'مستشار ري ذكي', 'أخصائي عمليات زراعية'],
        aliases: ['زراعة ذكية', 'تكنولوجيا زراعية', 'ري حديث', 'إنتاج زراعي'],
      },
    },
  },
};

export function getLocalizedCareer(careerIdOrTitle: string, langCode = 'en'): {
  name: string;
  tagline: string;
  description: string;
} {
  const norm = (careerIdOrTitle || '').toLowerCase().replace(/[\s/&]+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Find matching canonical entry
  const entry = Object.values(CANONICAL_CAREER_TRANSLATIONS).find(
    (c) => c.id === norm || norm.includes(c.id) || c.id.includes(norm)
  );

  if (entry) {
    const lang = entry.translations[langCode] || entry.translations['en'] || Object.values(entry.translations)[0];
    if (lang) {
      return {
        name: lang.name,
        tagline: lang.tagline,
        description: lang.description,
      };
    }
  }

  // Fallback to original title if not found
  return {
    name: careerIdOrTitle,
    tagline: 'Professional career path across African markets',
    description: `Professional career opportunity in ${careerIdOrTitle}`,
  };
}

/**
 * Multilingual search helper: Matches search queries in English, French, Wolof, or Arabic
 * to find the matching canonical career.
 */
export function matchCareerMultilingual(query: string): string[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();

  const matchingIds: string[] = [];

  for (const item of Object.values(CANONICAL_CAREER_TRANSLATIONS)) {
    let matched = false;
    for (const trans of Object.values(item.translations)) {
      if (
        trans.name.toLowerCase().includes(q) ||
        trans.tagline.toLowerCase().includes(q) ||
        trans.aliases.some((a) => a.toLowerCase().includes(q)) ||
        trans.sampleJobTitles.some((s) => s.toLowerCase().includes(q))
      ) {
        matched = true;
        break;
      }
    }
    if (matched) {
      matchingIds.push(item.id);
    }
  }

  return matchingIds;
}
