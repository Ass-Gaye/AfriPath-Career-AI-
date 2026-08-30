import { UserProfile, CareerRoadmap, RoadmapMonth, RoadmapWeek, RoadmapTask, CareerPathwayType } from '../../src/types/career';
import { SkillGapEngine, DetailedSkillGapReport, EvaluatedGapItem } from './skill-gap.service';
import { SkillEvidenceRecord } from './skill-evidence.service';
import { getCareerCompetencies } from './career-requirement.service';

export interface RoadmapGenerationOptions {
  weeklyHours?: number;
  learningPreference?: 'projects' | 'videos' | 'reading' | 'practice' | 'courses' | 'mentorship' | 'mixed';
  careerStage?: string;
  language?: string;
}

export class RoadmapEngineService {
  /**
   * Generates a fully personalized, evidence-grounded 90-Day Career Roadmap.
   */
  public static generateRoadmap(
    profile: UserProfile,
    targetCareer: string,
    options: RoadmapGenerationOptions = {},
    customEvidence: SkillEvidenceRecord[] = [],
    assessments: Record<string, number> = {}
  ): CareerRoadmap {
    const language = options.language || profile.languagePreference || 'en';
    const weeklyHours = options.weeklyHours || profile.constraints?.timeAvailableWeeklyHours || 10;
    const learningPref = options.learningPreference || 'mixed';
    const country = profile.country || 'Africa';
    const careerTitle = targetCareer || 'Technology Professional';

    // 1. Run Grounded Skill Gap Analysis to get real priorities and mastered skills
    const gapReport: DetailedSkillGapReport = SkillGapEngine.analyze(
      profile,
      careerTitle,
      customEvidence,
      assessments
    );

    const topPriorities = gapReport.topPriorities || [];
    const meetsRequirements = gapReport.meetsRequirements || [];
    const insufficientEvidence = gapReport.insufficientEvidenceItems || [];
    const readinessScore = gapReport.readinessScore || 45;

    // 2. Identify transferable foundations
    const transferableFoundations = meetsRequirements
      .filter((m) => m.classification === 'TRANSFERABLE_FOUNDATION' || m.transferableFromSource)
      .map((m) => m.competencyName);

    // 3. Determine Dynamic Phase Distribution based on readiness & gap severity
    let phase1Days = 30;
    let phase2Days = 30;
    let phase3Days = 30;
    let startingLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Career Changer' = 'Beginner';

    if (readinessScore >= 75) {
      // High baseline: Accelerate foundation, focus heavily on advanced portfolio & job hunt
      phase1Days = 20;
      phase2Days = 35;
      phase3Days = 35;
      startingLevel = 'Advanced';
    } else if (readinessScore >= 50) {
      // Moderate baseline: Balanced distribution
      phase1Days = 30;
      phase2Days = 30;
      phase3Days = 30;
      startingLevel = 'Intermediate';
    } else {
      // Significant gaps: Dedicate more days to core fundamentals before heavy projects
      phase1Days = 40;
      phase2Days = 30;
      phase3Days = 20;
      startingLevel = profile.careerGoalType === 'Career Change' ? 'Career Changer' : 'Beginner';
    }

    // 4. Construct Before/After Skill Gap Projection
    const beforeAfterGaps = this.buildBeforeAfterProjection(gapReport);

    // 5. Generate 12 Structured Weeks across 3 Months
    const months = this.build12WeekCurriculum({
      profile,
      careerTitle,
      country,
      gapReport,
      topPriorities,
      meetsRequirements,
      insufficientEvidence,
      transferableFoundations,
      weeklyHours,
      learningPref,
      language,
      phase1Days,
      phase2Days,
      phase3Days,
    });

    // 6. Identify Key Outcomes & Deliverables
    const keyOutcomes = this.generateKeyOutcomes(careerTitle, country, topPriorities, language);

    // 7. Pick Today's Recommended Action
    const firstIncompleteTask = months[0]?.weeks[0]?.tasks[0];
    const todayAction = firstIncompleteTask
      ? {
          taskId: firstIncompleteTask.id,
          weekNumber: 1,
          title: firstIncompleteTask.title,
          reason: firstIncompleteTask.reason || `Essential starting milestone for your ${careerTitle} pathway.`,
          estimatedMinutes: Math.round(firstIncompleteTask.estimatedHours * 60 * 0.5), // First sprint chunk
          skill: firstIncompleteTask.skillCompetency || topPriorities[0]?.competencyName || 'Core Foundations',
        }
      : undefined;

    return {
      targetCareer: `${careerTitle} (90-Day Execution Roadmap)`,
      targetTimeframeDays: 90,
      pathwayType: profile.preferredPathway || 'University / Degree',
      startingLevel,
      weeklyHoursRecommended: weeklyHours,
      learningPreference: learningPref,
      phaseAllocation: {
        phase1Days,
        phase2Days,
        phase3Days,
        focusSummary:
          language === 'ar'
            ? `توزيع زمني ديناميكي: ${phase1Days} يوماً للأساسيات، ${phase2Days} يوماً للمشاريع التطبيقية، و${phase3Days} يوماً لجاهزية التوظيف والسيرة الذاتية.`
            : language === 'fr'
            ? `Allocation dynamique : ${phase1Days}j fondations, ${phase2Days}j projets appliqués, et ${phase3Days}j préparation à l'emploi et CV.`
            : language === 'wo'
            ? `Xoolal yoon wi : ${phase1Days} fann ci xam-xam, ${phase2Days} fann ci proset, ak ${phase3Days} fann ci wut liggéey.`
            : `Dynamic timeline: ${phase1Days}d Foundation, ${phase2Days}d Applied Projects, and ${phase3Days}d Career & Job Readiness.`,
      },
      topPriorities: topPriorities.slice(0, 4).map((p) => p.competencyName),
      transferableFoundationsUsed: transferableFoundations,
      beforeAfterGaps,
      todayAction,
      months,
      keyOutcomes,
      disclaimer:
        language === 'ar'
          ? 'تعتمد هذه الخطة على كفاءاتك الحالية المثبتة ومستوى التفرغ الأسبوعي. يمكنك تعديل المهام في أي وقت.'
          : language === 'fr'
          ? 'Ce plan personnalisé est calculé d’après vos compétences vérifiées et votre disponibilité hebdomadaire. Vous pouvez ajuster les tâches à tout moment.'
          : language === 'wo'
          ? 'Yoon wii dañ ko defar tekk ci xam-xam bi nga am ak waxtu yi nga am ci ayiubés bi.'
          : 'Personalized curriculum computed from your verified competencies and weekly time commitment. You can adapt tasks at any time.',
    };
  }

  private static buildBeforeAfterProjection(report: DetailedSkillGapReport) {
    const items: {
      skill: string;
      beforeLevel: string;
      targetLevel: string;
      projectedAfterLevel: string;
      resolvedInMonth: number;
    }[] = [];

    // Add Top Priorities
    report.topPriorities.slice(0, 5).forEach((p, idx) => {
      items.push({
        skill: p.competencyName,
        beforeLevel: p.currentProficiencyLabel,
        targetLevel: p.requiredProficiencyLabel,
        projectedAfterLevel: p.requiredProficiencyLabel,
        resolvedInMonth: idx < 2 ? 1 : 2,
      });
    });

    // Add Mastered / Transferable skills
    report.meetsRequirements.slice(0, 3).forEach((m) => {
      items.push({
        skill: m.competencyName,
        beforeLevel: m.currentProficiencyLabel,
        targetLevel: m.requiredProficiencyLabel,
        projectedAfterLevel: 'Advanced / Mastered',
        resolvedInMonth: 1,
      });
    });

    return items;
  }

  private static build12WeekCurriculum(params: {
    profile: UserProfile;
    careerTitle: string;
    country: string;
    gapReport: DetailedSkillGapReport;
    topPriorities: EvaluatedGapItem[];
    meetsRequirements: EvaluatedGapItem[];
    insufficientEvidence: EvaluatedGapItem[];
    transferableFoundations: string[];
    weeklyHours: number;
    learningPref: string;
    language: string;
    phase1Days: number;
    phase2Days: number;
    phase3Days: number;
  }): RoadmapMonth[] {
    const {
      profile,
      careerTitle,
      country,
      topPriorities,
      meetsRequirements,
      insufficientEvidence,
      transferableFoundations,
      weeklyHours,
      language,
      phase1Days,
      phase2Days,
      phase3Days,
    } = params;

    const p1Skill = topPriorities[0]?.competencyName || 'Core Technical Foundations';
    const p2Skill = topPriorities[1]?.competencyName || 'Domain Tools & Methodologies';
    const p3Skill = topPriorities[2]?.competencyName || 'Practical Problem Solving';
    const masteredSkill = meetsRequirements[0]?.competencyName;

    const taskHours = Math.max(2, Math.round(weeklyHours / 3));

    // Phase 1: Foundation & Core Tooling (Weeks 1 to 4)
    const month1Weeks: RoadmapWeek[] = [
      {
        weekNumber: 1,
        title:
          language === 'ar'
            ? `إعداد بيئة العمل والتحقق من المهارات الأولية (${p1Skill})`
            : language === 'fr'
            ? `Configuration de l'environnement & fondamentaux (${p1Skill})`
            : language === 'wo'
            ? `Dawal toolchain ak xam-xam bu jëkk (${p1Skill})`
            : `Toolchain Setup & Core Fundamentals (${p1Skill})`,
        focus:
          language === 'ar'
            ? `سد الفجوة في ${p1Skill}، وإنشاء مساحة عمل احترافية، وتنظيم مستودع GitHub.`
            : language === 'fr'
            ? `Combler l'écart en ${p1Skill}, configurer un environnement pro et initialiser GitHub.`
            : language === 'wo'
            ? `Defar yoon ci ${p1Skill} ak GitHub.`
            : `Bridging critical baseline in ${p1Skill}, setting up professional dev environment, and mastering daily version control.`,
        milestoneDeliverable:
          language === 'ar'
            ? `مستودع GitHub مهيأ مع توثيق README ونموذج تطبيقي أولي لـ ${p1Skill}.`
            : language === 'fr'
            ? `Dépôt GitHub configuré avec README soigné et premier module fonctionnel en ${p1Skill}.`
            : language === 'wo'
            ? `Dépôt GitHub yu leer ak README ci ${p1Skill}.`
            : `Configured GitHub repository with professional README and initial functional ${p1Skill} code module.`,
        milestoneDeliverableType: 'Portfolio Artifact',
        tasks: [
          {
            id: 'w1-t1',
            title:
              language === 'ar'
                ? `تثبيت وتكوين أدوات التطوير الاحترافية والتحكم في الإصدارات`
                : language === 'fr'
                ? `Configurer l'IDE professionnel, le linter et les règles de versionnage Git`
                : language === 'wo'
                ? `Sampal IDE ak Git`
                : `Configure standard IDE boilerplate, linting rules, and daily Git branch workflows`,
            description: `Set up production-grade development tooling with automated formatting, type definitions, and environment secrets management.`,
            skillCompetency: 'Development Environment & Git',
            reason: `Establishes standard engineering hygiene required by remote teams and leading ${country} tech organizations.`,
            activityType: 'PRACTICE',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Clean local workspace and linked GitHub profile ready for project contributions.`,
            completionCriteria: `Verified terminal environment and authenticated GitHub repository.`,
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToPortfolio: false,
          },
          {
            id: 'w1-t2',
            title:
              language === 'ar'
                ? `دراسة المفاهيم الأساسية لـ ${p1Skill} وحل 10 تمارين عملية`
                : language === 'fr'
                ? `Étudier les concepts clés de ${p1Skill} et résoudre 10 exercices pratiques`
                : language === 'wo'
                ? `Jàng ${p1Skill} ak def 10 exercices`
                : `Master core ${p1Skill} syntaxes and complete 10 hands-on algorithmic drills`,
            description: `Focus on fundamental operations, data flow, and error handling for ${p1Skill}.`,
            skillCompetency: p1Skill,
            reason: `Your profile indicates a foundational gap in ${p1Skill} for the ${careerTitle} pathway. Strengthening this prevents downstream bottlenecks.`,
            activityType: 'LEARN',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Demonstrated ability to execute core syntax without syntax errors.`,
            completionCriteria: `Passed 10 practical test cases in ${p1Skill}.`,
            resourceTitle: `${p1Skill} Essentials & Interactive Exercises`,
            resourceProvider: 'ALX Africa & FreeCodeCamp',
            resourceLink: 'https://www.freecodecamp.org',
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToPortfolio: false,
          },
          {
            id: 'w1-t3',
            title:
              masteredSkill
                ? language === 'ar'
                  ? `استثمار خبرتك في ${masteredSkill} لتسريع بناء النماذج`
                  : language === 'fr'
                  ? `Mobiliser votre maîtrise de ${masteredSkill} pour accélérer les prototypes`
                  : language === 'wo'
                  ? `Jëfandikoo ${masteredSkill} bi nga xam`
                  : `Leverage your verified ${masteredSkill} competency to architect baseline structure`
                : language === 'ar'
                ? `إنشاء وتوثيق نموذج عمل تجريبي وتصدير أول حزمة تعليمية`
                : language === 'fr'
                ? `Structurer un projet bac à sable documenté avec premier commit propre`
                : language === 'wo'
                ? `Defar proset bu jëkk`
                : `Publish a documented sandbox project with clean commit history`,
            description: masteredSkill
              ? `You already have verified proficiency in ${masteredSkill}. Maintain it by integrating it with your new ${p1Skill} exercises.`
              : `Create a modular playground demonstrating clean separation of concerns and markdown documentation.`,
            skillCompetency: masteredSkill || p1Skill,
            reason: masteredSkill
              ? `Avoid repeating basic training on skills you already mastered; instead, apply them immediately to real-world tasks.`
              : `Reinforces daily documentation habits demanded by engineering teams.`,
            activityType: masteredSkill ? 'APPLY' : 'DOCUMENT',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Documented starter module published to GitHub with comprehensive documentation.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
        ],
      },
      {
        weekNumber: 2,
        title:
          language === 'ar'
            ? `التعمق في العمليات المتقدمة لـ ${p1Skill} ومعالجة البيانات`
            : language === 'fr'
            ? `Opérations avancées & structuration des données en ${p1Skill}`
            : language === 'wo'
            ? `Xam-xam bu mag ci ${p1Skill}`
            : `Advanced Data Pipelines & Operations in ${p1Skill}`,
        focus:
          language === 'ar'
            ? `التحول من المبادئ إلى حل المشكلات المركبة ومعالجة البيانات الحقيقية.`
            : language === 'fr'
            ? `Passer des bases à la résolution de cas réels et au traitement de données.`
            : language === 'wo'
            ? `Liggéey ci cas réels ak ${p1Skill}.`
            : `Transitioning from syntax basics to robust real-world data pipelines and error boundaries.`,
        milestoneDeliverable:
          language === 'ar'
            ? `نظام بيانات صغير يقوم بتصفية وتجميع وتحليل بيانات واقعية لـ ${country}.`
            : language === 'fr'
            ? `Mini-moteur de données filtrant et agrégeant des cas réels du marché en ${country}.`
            : language === 'wo'
            ? `Mini-système bu nuy analyser données ci ${country}.`
            : `Mini data engine querying, filtering, and aggregating real-world African market datasets.`,
        milestoneDeliverableType: 'Project',
        tasks: [
          {
            id: 'w2-t1',
            title: `Implement complex multi-condition queries, joins, and data transformations in ${p1Skill}`,
            skillCompetency: p1Skill,
            reason: `Target ${careerTitle} roles require intermediate independence without relying on basic templates.`,
            activityType: 'PRACTICE',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Script/Notebook solving 5 real-world analytical prompts.`,
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToPortfolio: false,
          },
          {
            id: 'w2-t2',
            title: `Run performance profiling and error-resilient exception handlers`,
            skillCompetency: 'Error Handling & Reliability',
            reason: `Ensures production code won't fail unexpectedly on edge-cases or spotty internet connections.`,
            activityType: 'BUILD',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Robust module with 100% test coverage on critical data paths.`,
            completed: false,
            status: 'not_started',
            taskType: 'Theory',
            canAddToPortfolio: false,
          },
        ],
      },
      {
        weekNumber: 3,
        title:
          language === 'ar'
            ? `تطوير الكفاءة الثانية: ${p2Skill}`
            : language === 'fr'
            ? `Développement de la compétence clé : ${p2Skill}`
            : language === 'wo'
            ? `Defar xarala bu ñaar : ${p2Skill}`
            : `Bridging Second High-Priority Gap: ${p2Skill}`,
        focus: `Integrating ${p2Skill} with your existing foundation.`,
        milestoneDeliverable: `Functional workflow component combining ${p1Skill} and ${p2Skill}.`,
        milestoneDeliverableType: 'Project',
        tasks: [
          {
            id: 'w3-t1',
            title: `Study ${p2Skill} architectures and standard industry conventions`,
            skillCompetency: p2Skill,
            reason: `${p2Skill} is classified as a High-Priority competency for ${careerTitle}.`,
            activityType: 'LEARN',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Clear mental model and hands-on cheat sheet for ${p2Skill}.`,
            completed: false,
            status: 'not_started',
            taskType: 'Theory',
            canAddToPortfolio: false,
          },
          {
            id: 'w3-t2',
            title: `Build interactive prototype applying ${p2Skill} on local African use cases`,
            skillCompetency: p2Skill,
            reason: `Applying learning directly to African economic and business contexts boosts interview recall.`,
            activityType: 'BUILD',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Working prototype with responsive output.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
        ],
      },
      {
        weekNumber: 4,
        title:
          language === 'ar'
            ? `التقييم الشامل للمرحلة الأولى وسد الثغرات المتبقية`
            : language === 'fr'
            ? `Bilan de la Phase 1 & Validation des compétences`
            : language === 'wo'
            ? `Saytu Phase 1 ak vérification`
            : `Phase 1 Capstone & Verified Skill Assessment`,
        focus: `Formalizing foundational competencies through assessment testing and code review.`,
        milestoneDeliverable:
          language === 'ar'
            ? `اجتياز اختبار التقييم المعتمد لـ ${p1Skill} والحصول على شارة الكفاءة.`
            : language === 'fr'
            ? `Score vérifié à l'évaluation en ${p1Skill} et documentation du projet d'étape.`
            : language === 'wo'
            ? `Am score bu baax ci évaluation ${p1Skill}.`
            : `Verified score on ${p1Skill} skill assessment upgrading competency status to HIGH confidence.`,
        milestoneDeliverableType: 'Assessment',
        tasks: [
          {
            id: 'w4-t1',
            title: `Complete comprehensive 15-question skill assessment in ${p1Skill}`,
            skillCompetency: p1Skill,
            reason: `Formal assessment provides verifiable evidence for your AfriPath skill profile.`,
            activityType: 'ASSESS',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Verified assessment certificate with score > 80%.`,
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToCV: true,
            canAddToPortfolio: true,
          },
          {
            id: 'w4-t2',
            title: `Refactor Month 1 code deliverables and conduct peer/mentor code review`,
            skillCompetency: 'Code Quality & Clean Architecture',
            reason: `Refactoring ingrains self-critique habits and optimizes code readability for hiring managers.`,
            activityType: 'REVIEW',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Refactored GitHub repository with zero lint errors and clear commit log.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
        ],
      },
    ];

    // Phase 2: Application & Real-World Projects (Weeks 5 to 8)
    const month2Weeks: RoadmapWeek[] = [
      {
        weekNumber: 5,
        title:
          language === 'ar'
            ? `المشروع الرئيسي الأول: منصة تحليلات موجهة لسوق ${country}`
            : language === 'fr'
            ? `Projet Phare 1 : Plateforme d'analyse adaptée au marché de ${country}`
            : language === 'wo'
            ? `Projet 1 : Plateforme d'analyse ci ${country}`
            : `Flagship Project 1: Market & Service Intelligence App for ${country}`,
        focus: `Designing database models, business logic, and mobile-optimized interfaces for local community needs.`,
        milestoneDeliverable: `Production-ready application repository solving a real ${country} or African SME workflow.`,
        milestoneDeliverableType: 'Project',
        tasks: [
          {
            id: 'w5-t1',
            title: `Draft system architecture diagram, schema models, and user workflow wireframes`,
            skillCompetency: 'System Design & Problem Formulation',
            reason: `Employers hire problem solvers who plan structured systems before writing raw code.`,
            activityType: 'DOCUMENT',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Complete architecture specification document in GitHub wiki/README.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
          {
            id: 'w5-t2',
            title: `Develop core computational modules utilizing ${p1Skill} and ${p2Skill}`,
            skillCompetency: `${p1Skill} + ${p2Skill}`,
            reason: `Proves your ability to integrate multiple competencies seamlessly in a cohesive product.`,
            activityType: 'BUILD',
            difficulty: 'Advanced',
            estimatedHours: taskHours,
            expectedOutcome: `Tested backend/processing pipeline functioning with sample data.`,
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToPortfolio: true,
          },
        ],
      },
      {
        weekNumber: 6,
        title:
          language === 'ar'
            ? `تحسين تجربة المستخدم ودعم العمل دون إنترنت (Offline-First)`
            : language === 'fr'
            ? `Optimisation UX & résilience réseau (Offline-first & mobile)`
            : language === 'wo'
            ? `Defar UX bu baax ci mobile ak offline`
            : `UX Polish & Offline/Low-Bandwidth Optimization`,
        focus: `Adapting application performance for African telecommunication realities.`,
        milestoneDeliverable: `Live responsive deployment with fast load times on 3G/4G cellular networks.`,
        milestoneDeliverableType: 'Portfolio Artifact',
        tasks: [
          {
            id: 'w6-t1',
            title: `Implement local caching, optimistic updates, and responsive mobile layouts`,
            skillCompetency: 'Mobile & Network Optimization',
            reason: `High value in African markets where mobile data efficiency is a major competitive advantage.`,
            activityType: 'APPLY',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Lighthouse performance score > 90 on mobile devices.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
          {
            id: 'w6-t2',
            title: `Deploy application to free cloud hosting (Vercel, Render, or Railway) with live demo URL`,
            skillCompetency: 'Cloud Deployment & DevOps Basics',
            reason: `Recruiters require live clickable demos to verify claims instantly.`,
            activityType: 'DEMONSTRATE',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Live working URL accessible globally with SSL certificate.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToCV: true,
            canAddToPortfolio: true,
          },
        ],
      },
      {
        weekNumber: 7,
        title:
          language === 'ar'
            ? `المشروع الرئيسي الثاني: حلول تكامل الخدمات والبيانات (${p3Skill})`
            : language === 'fr'
            ? `Projet Phare 2 : Intégration d'API et automatisation métier (${p3Skill})`
            : language === 'wo'
            ? `Projet 2 : API ak données (${p3Skill})`
            : `Flagship Project 2: Cross-System API Integration & Automation (${p3Skill})`,
        focus: `Building real-time data integrations (SMS alerts, Payment gateways, or External Open Data).`,
        milestoneDeliverable: `Second production portfolio artifact with live automated data sync.`,
        milestoneDeliverableType: 'Project',
        tasks: [
          {
            id: 'w7-t1',
            title: `Integrate REST/GraphQL APIs with robust error retry and telemetry`,
            skillCompetency: p3Skill,
            reason: `Demonstrates industry-standard software and data connectivity required for ${careerTitle}.`,
            activityType: 'BUILD',
            difficulty: 'Advanced',
            estimatedHours: taskHours,
            expectedOutcome: `Functional integration pipeline passing automated integration tests.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToPortfolio: true,
          },
        ],
      },
      {
        weekNumber: 8,
        title:
          language === 'ar'
            ? `مراجعة كفاءة المشاريع وكتابة دراسة الحالة (Case Study)`
            : language === 'fr'
            ? `Rédaction des études de cas (Case Studies) & Métriques d'impact`
            : language === 'wo'
            ? `Bind Case Study ak résultats`
            : `Impact Documentation & Portfolio Case Study Writing`,
        focus: `Transforming code into business impact narratives following STAR format.`,
        milestoneDeliverable: `Two polished case study articles documenting architecture decisions and measurable metrics.`,
        milestoneDeliverableType: 'Portfolio Artifact',
        tasks: [
          {
            id: 'w8-t1',
            title: `Write comprehensive Case Study detailing Problem, Approach, Architecture, and Impact Metrics`,
            skillCompetency: 'Technical Communication & Product Documentation',
            reason: `Senior hiring managers and international clients evaluate how well you explain technical tradeoffs.`,
            activityType: 'DOCUMENT',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Published case study on GitHub / Dev.to / Medium / Personal Site.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToCV: true,
            canAddToPortfolio: true,
          },
        ],
      },
    ];

    // Phase 3: Career Readiness, Job Search & Interview Mastery (Weeks 9 to 12)
    const month3Weeks: RoadmapWeek[] = [
      {
        weekNumber: 9,
        title:
          language === 'ar'
            ? `بناء السيرة الذاتية الذكية والمتوافقة مع أنظمة ATS`
            : language === 'fr'
            ? `Optimisation du CV ATS & Structuration des compétences vérifiées`
            : language === 'wo'
            ? `Defar CV ATS bu baax ak xam-xam yi`
            : `AI-Powered ATS CV Optimization & Evidence Synchronization`,
        focus: `Translating completed roadmap milestones and verified projects into high-scoring ATS CV bullet points.`,
        milestoneDeliverable: `Confirmed ATS-Compliant CV scored above 85% on AfriPath AI CV Validator.`,
        milestoneDeliverableType: 'CV Milestone',
        tasks: [
          {
            id: 'w9-t1',
            title: `Import completed projects and verified skills into the AfriPath AI CV Builder`,
            skillCompetency: 'Professional Career Branding',
            reason: `Directly integrates verified roadmap evidence into your official candidate record without hallucination.`,
            activityType: 'PREPARE',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Structured CV draft featuring real metrics and GitHub links.`,
            completed: false,
            status: 'not_started',
            taskType: 'Portfolio Project',
            canAddToCV: true,
          },
          {
            id: 'w9-t2',
            title: `Run anti-hallucination fact verification and apply executive action-verbs`,
            skillCompetency: 'Executive Presentation',
            reason: `Ensures 100% truthful representation that passes corporate background checks.`,
            activityType: 'REVIEW',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Validated CV ready for 1-click PDF/Word export.`,
            completed: false,
            status: 'not_started',
            taskType: 'Hands-on Practice',
            canAddToCV: true,
          },
        ],
      },
      {
        weekNumber: 10,
        title:
          language === 'ar'
            ? `تحسين الحضور الرقمي وشبكة LinkedIn ومستودعات GitHub`
            : language === 'fr'
            ? `Optimisation du profil LinkedIn & Visibilité GitHub internationale`
            : language === 'wo'
            ? `Defar LinkedIn ak GitHub bu baax`
            : `LinkedIn & Global Online Presence Optimization`,
        focus: `Aligning profile headline, about section, and featured achievements with ${careerTitle} keywords.`,
        milestoneDeliverable: `All-Star LinkedIn profile and pinned flagship GitHub repositories with live demo badges.`,
        milestoneDeliverableType: 'Portfolio Artifact',
        tasks: [
          {
            id: 'w10-t1',
            title: `Update LinkedIn headline, summary, and work experiences with quantifiable outcomes`,
            skillCompetency: 'Professional Networking',
            reason: `Recruiters actively search for specific skills (${p1Skill}, ${p2Skill}) when sourcing talent in ${country}.`,
            activityType: 'DEMONSTRATE',
            difficulty: 'Beginner',
            estimatedHours: taskHours,
            expectedOutcome: `Updated LinkedIn profile ranking higher in recruiter searches.`,
            completed: false,
            status: 'not_started',
            taskType: 'Networking / Community',
          },
        ],
      },
      {
        weekNumber: 11,
        title:
          language === 'ar'
            ? `محاكاة المقابلات الفنية وأسئلة السلوك المهني (STAR)`
            : language === 'fr'
            ? `Simulations d'entretiens techniques & questions comportementales (STAR)`
            : language === 'wo'
            ? `Pratique entretiens techniques ak STAR`
            : `Technical Mock Interviews & Behavioral Mastery (STAR)`,
        focus: `Practicing live problem solving, system design explanations, and confident communication.`,
        milestoneDeliverable: `Completed 3 mock interview simulations with AfriPath AI Career Mentor.`,
        milestoneDeliverableType: 'Assessment',
        tasks: [
          {
            id: 'w11-t1',
            title: `Practice 20 common technical interview questions for ${careerTitle}`,
            skillCompetency: 'Technical Problem Articulation',
            reason: `Prepares you to clearly explain your code and architectural reasoning under interview pressure.`,
            activityType: 'PRACTICE',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `Prepared concise STAR responses for top 10 scenario questions.`,
            completed: false,
            status: 'not_started',
            taskType: 'Theory',
          },
        ],
      },
      {
        weekNumber: 12,
        title:
          language === 'ar'
            ? `إطلاق حملة التقديم على الوظائف والتواصل مع أصحاب العمل`
            : language === 'fr'
            ? `Lancement des candidatures ciblées & Réseautage employeurs en ${country}`
            : language === 'wo'
            ? `Door di déposer ci liggéey yi ak kontak employeurs`
            : `Active Opportunity Outreach & Direct Employer Applications`,
        focus: `Submitting tailored applications to verified employers in ${country} and remote African tech hubs.`,
        milestoneDeliverable: `Submitted 10 tailored applications with custom cover notes and tracked pipeline.`,
        milestoneDeliverableType: 'CV Milestone',
        tasks: [
          {
            id: 'w12-t1',
            title: `Apply to 5 verified local/regional opportunities in AfriPath Opportunities Board`,
            skillCompetency: 'Job Search Execution',
            reason: `Converts your 90 days of skill building into tangible interviews and employment offers.`,
            activityType: 'APPLY',
            difficulty: 'Intermediate',
            estimatedHours: taskHours,
            expectedOutcome: `5 confirmed submissions with tailored CVs.`,
            completed: false,
            status: 'not_started',
            taskType: 'Networking / Community',
          },
        ],
      },
    ];

    return [
      {
        month: 1,
        phaseName:
          language === 'ar'
            ? 'المرحلة 1: بناء الأساسيات والأدوات الجوهرية'
            : language === 'fr'
            ? 'Phase 1 : Fondations & Outils Clés'
            : language === 'wo'
            ? 'Phase 1 : Xam-xam bu jëkk ak jumtukaay yi'
            : 'Phase 1: Foundations & Core Tooling',
        theme:
          language === 'ar'
            ? `إتقان المبادئ وسد الفجوات الأساسية (${phase1Days} يوماً)`
            : language === 'fr'
            ? `Maîtrise des fondamentaux et comblement des écarts (${phase1Days} jours)`
            : language === 'wo'
            ? `Dawal xam-xam bi (${phase1Days} fann)`
            : `Core Mastery & Gap Bridging (${phase1Days} Days)`,
        description:
          language === 'ar'
            ? `التركيز المكثف على أهم المهارات الناقصة (${p1Skill} و${p2Skill})، وبناء بيئة عمل هندسية موثوقة.`
            : language === 'fr'
            ? `Focus intensif sur vos compétences prioritaires (${p1Skill} et ${p2Skill}) et mise en place d'un environnement de travail pro.`
            : language === 'wo'
            ? `Xam-xam bu wér ci ${p1Skill} ak ${p2Skill}.`
            : `Intensive focus on your highest-priority gaps (${p1Skill}, ${p2Skill}), establishing robust tooling and version-controlled daily discipline.`,
        durationDays: phase1Days,
        weeks: month1Weeks,
      },
      {
        month: 2,
        phaseName:
          language === 'ar'
            ? 'المرحلة 2: التطبيق العملي وبناء المشاريع'
            : language === 'fr'
            ? 'Phase 2 : Projets Appliqués & Contexte Réel'
            : language === 'wo'
            ? 'Phase 2 : Proset yu am njariñ ci réew mi'
            : 'Phase 2: Applied Domain Projects',
        theme:
          language === 'ar'
            ? `بناء حلول عملية واقعية لسوق ${country} وأفريقيا (${phase2Days} يوماً)`
            : language === 'fr'
            ? `Création de solutions réelles pour le marché de ${country} et d'Afrique (${phase2Days} jours)`
            : language === 'wo'
            ? `Liggéey proset yu mag ci ${country} (${phase2Days} fann)`
            : `Real-World Engineering in African Context (${phase2Days} Days)`,
        description:
          language === 'ar'
            ? `تحويل المهارات النظرية إلى مشاريع برمجية متكاملة يمكن للمستخدمين والموظفين استخدامها واختبارها.`
            : language === 'fr'
            ? `Transformer les acquis en 2 projets d'envergure démontrables et déployés en ligne.`
            : language === 'wo'
            ? `Defar 2 proset yu leer ci internet.`
            : `Translate learned knowledge into 2 production-grade applications that solve recognizable regional problems.`,
        durationDays: phase2Days,
        weeks: month2Weeks,
      },
      {
        month: 3,
        phaseName:
          language === 'ar'
            ? 'المرحلة 3: جاهزية التوظيف والسيرة الذاتية والمقابلات'
            : language === 'fr'
            ? 'Phase 3 : Employabilité, CV & Entretiens'
            : language === 'wo'
            ? 'Phase 3 : Wut liggéey, CV ak entretiens'
            : 'Phase 3: Portfolio, Job Hunt & Interview Mastery',
        theme:
          language === 'ar'
            ? `الانتقال نحو التوظيف والفرص المهنية (${phase3Days} يوماً)`
            : language === 'fr'
            ? `Transition vers un emploi à haute valeur ajoutée (${phase3Days} jours)`
            : language === 'wo'
            ? `Jéem am liggéey bu baax (${phase3Days} fann)`
            : `Transition to High-Value Employment (${phase3Days} Days)`,
        description:
          language === 'ar'
            ? `صياغة السيرة الذاتية بأسلوب احترافي خالٍ من التلفيق، وتجهيز الحسابات المهنية، ومحاكاة المقابلات.`
            : language === 'fr'
            ? `Finalisation du CV professionnel sans extrapolation, optimisation LinkedIn et simulations d'entretiens techniques.`
            : language === 'wo'
            ? `Pare pour entretiens ak déposer CV.`
            : `Polish your online presence, prepare technical interviews, and initiate direct outreach to regional employers and remote recruiters.`,
        durationDays: phase3Days,
        weeks: month3Weeks,
      },
    ];
  }

  private static generateKeyOutcomes(
    careerTitle: string,
    country: string,
    topPriorities: EvaluatedGapItem[],
    language: string
  ): string[] {
    const p1 = topPriorities[0]?.competencyName || 'Core Tooling';
    const p2 = topPriorities[1]?.competencyName || 'Production Stacks';

    if (language === 'ar') {
      return [
        `إتقان العمل المستقل بـ ${p1} و ${p2}`,
        `بناء ونشر مشروعين تطبيقيين موجهين لسوق ${country} وأفريقيا مع روابط تجريبية حية`,
        `سيرة ذاتية متوافقة 100% مع أنظمة ATS ومثبتة بالأدلة الواقعية الخالية من التلفيق`,
        `الاستعداد الكامل للمقابلات الفنية والتقديم المباشر لفرص العمل في ${country} وعن بُعد`,
      ];
    }

    if (language === 'fr') {
      return [
        `Maîtrise indépendante de ${p1} et ${p2}`,
        `Déploiement de 2 projets phares avec liens de démonstration adaptés au contexte de ${country}`,
        `CV professionnel 100% conforme ATS, fondé sur des preuves concrètes sans hallucination`,
        `Préparation complète aux entretiens techniques et candidatures ciblées régionales / télétravail`,
      ];
    }

    if (language === 'wo') {
      return [
        `Xam bu baax ${p1} ak ${p2}`,
        `Defar 2 proset yu leer ci internet ngir réew mi`,
        `CV bu am solo te wér ci sistem ATS`,
        `Pare pour entretiens ak liggéey ci ${country} ak télétravail`,
      ];
    }

    return [
      `Independent production mastery in ${p1} and ${p2}`,
      `2 live deployed portfolio applications solving authentic ${country} & Pan-African market needs`,
      `Verified ATS-compliant CV grounded strictly on real proof with zero hallucinated claims`,
      `Complete technical & behavioral interview readiness for ${careerTitle} roles locally and remotely`,
    ];
  }
}
