import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data_storage');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const JWT_SECRET = process.env.JWT_SECRET || 'gambia-career-ai-secure-jwt-key-2026-banjul';

export interface UserRecord {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  reset_token?: string;
  reset_token_expiry?: string;
}

export interface ProfileRecord {
  id: string;
  user_id: string;
  name: string;
  age: number | string;
  location: string;
  education_level: string;
  institution: string;
  degree?: string;
  field_of_study: string;
  graduation_year: string;
  skills: string[];
  soft_skills: string[];
  technical_skills: string[];
  interests: string[];
  career_goal: string;
  target_industry?: string;
  target_industries: string[];
  cv_file_name?: string;
  cv_raw_text?: string;
  experience_years?: string;
  preferred_work_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CareerAnalysisRecord {
  id: string;
  user_id: string;
  recommended_careers: any[];
  match_scores: Record<string, number>;
  career_explanations: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface SkillGapRecord {
  id: string;
  user_id: string;
  target_career: string;
  missing_skills: string[];
  priority_levels: Record<string, string>;
  analysis_data: any;
  created_at: string;
  updated_at: string;
}

export interface RoadmapRecord {
  id: string;
  user_id: string;
  career: string;
  learning_plan: any;
  progress: number;
  completed_task_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface CVRecord {
  id: string;
  user_id: string;
  cv_data_json: any;
  template: string;
  target_career: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  profiles: ProfileRecord[];
  career_analyses: CareerAnalysisRecord[];
  skill_gaps: SkillGapRecord[];
  roadmaps: RoadmapRecord[];
  cvs: CVRecord[];
}

// Initial demo user hash for demo login compatibility
const DEFAULT_DEMO_HASH = bcrypt.hashSync('Musa2026!', 10);
const DEFAULT_USER_HASH = bcrypt.hashSync('Password123!', 10);

const initialData: DatabaseSchema = {
  users: [
    {
      id: 'demo-musa-001',
      full_name: 'Musa Jallow',
      email: 'musa.jallow@utg.edu.gm',
      password_hash: DEFAULT_DEMO_HASH,
      created_at: '2026-01-15T10:00:00.000Z',
      updated_at: '2026-02-01T12:00:00.000Z',
      last_login: new Date().toISOString(),
    },
    {
      id: 'usr-assgaye-001',
      full_name: 'Assan Gaye',
      email: 'assgaye83@gmail.com',
      password_hash: DEFAULT_DEMO_HASH, // Also accepts Musa2026! or Password123!
      created_at: '2026-02-01T10:00:00.000Z',
      updated_at: '2026-02-01T12:00:00.000Z',
      last_login: new Date().toISOString(),
    },
  ],
  profiles: [
    {
      id: 'prof-demo-001',
      user_id: 'demo-musa-001',
      name: 'Musa Jallow',
      age: 23,
      location: 'Kanifing / KMC, The Gambia',
      education_level: 'Bachelor’s Degree',
      institution: 'University of The Gambia (UTG)',
      degree: 'BSc Computer Science',
      field_of_study: 'Computer Science',
      graduation_year: '2025',
      skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Git & GitHub', 'Tailwind CSS', 'Basic Python'],
      soft_skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability'],
      technical_skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Git & GitHub', 'Tailwind CSS'],
      interests: ['Fintech & Mobile Money', 'Software & Web Development', 'AI & Data Science'],
      career_goal: 'Become a leading Software Engineer in Banjul building West African digital banking and mobile money solutions.',
      target_industries: ['Fintech & Mobile Money', 'Software & Web Development', 'Telecommunications'],
      experience_years: '1 year (Internship & Projects)',
      preferred_work_type: 'Local (Gambia)',
      created_at: '2026-01-15T10:00:00.000Z',
      updated_at: '2026-02-01T12:00:00.000Z',
    },
    {
      id: 'prof-assgaye-001',
      user_id: 'usr-assgaye-001',
      name: 'Assan Gaye',
      age: 24,
      location: 'Serekunda / KMC, The Gambia',
      education_level: 'Bachelor’s Degree',
      institution: 'University of The Gambia (UTG)',
      degree: 'BSc Information Systems',
      field_of_study: 'Information Systems & Computer Science',
      graduation_year: '2025',
      skills: ['JavaScript', 'React.js', 'TypeScript', 'Node.js', 'SQL', 'Git & GitHub', 'Tailwind CSS'],
      soft_skills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Critical Thinking'],
      technical_skills: ['JavaScript', 'React.js', 'TypeScript', 'Node.js', 'SQL', 'Git & GitHub', 'Tailwind CSS'],
      interests: ['Software & Web Development', 'Fintech & Mobile Money', 'Artificial Intelligence'],
      career_goal: 'Develop innovative technology products for Gambian businesses and international tech firms.',
      target_industries: ['Software & Web Development', 'Fintech & Mobile Money', 'Telecommunications'],
      experience_years: '1-2 years',
      preferred_work_type: 'Hybrid (Gambia & Remote)',
      created_at: '2026-02-01T10:00:00.000Z',
      updated_at: '2026-02-01T12:00:00.000Z',
    },
  ],
  career_analyses: [],
  skill_gaps: [],
  roadmaps: [],
  cvs: [],
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const users: UserRecord[] = parsed.users || [];
        const profiles: ProfileRecord[] = parsed.profiles || [];

        // Ensure default seeded accounts are always available
        initialData.users.forEach((initU) => {
          if (!users.some((u) => u.email.toLowerCase() === initU.email.toLowerCase())) {
            users.push(initU);
          }
        });
        initialData.profiles.forEach((initP) => {
          if (!profiles.some((p) => p.user_id === initP.user_id)) {
            profiles.push(initP);
          }
        });

        return {
          users,
          profiles,
          career_analyses: parsed.career_analyses || [],
          skill_gaps: parsed.skill_gaps || [],
          roadmaps: parsed.roadmaps || [],
          cvs: parsed.cvs || [],
        };
      }
    } catch (err) {
      console.error('Failed to read db.json, initializing fresh database:', err);
    }
    this.save(initialData);
    return initialData;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const content = JSON.stringify(dataToSave || this.data, null, 2);
      fs.writeFileSync(DB_FILE, content, 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  // User Authentication Operations
  public async createUser(fullName: string, email: string, password: string):Promise<UserRecord> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = this.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const now = new Date().toISOString();

    const newUser: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      full_name: fullName.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now,
      last_login: now,
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public async authenticateUser(email: string, password: string): Promise<UserRecord> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = this.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('No account found with this email. Please check spelling or create a free account.');
    }

    let isMatch = await bcrypt.compare(password, user.password_hash);
    // Allow fallback default password for seeded accounts
    if (!isMatch && (user.email === 'musa.jallow@utg.edu.gm' || user.email === 'assgaye83@gmail.com')) {
      if (password === 'Musa2026!' || password === 'Password123!' || password === 'assgaye83') {
        isMatch = true;
      }
    }

    if (!isMatch) {
      throw new Error('Incorrect password. Please verify your password or use "Forgot password".');
    }

    user.last_login = new Date().toISOString();
    user.updated_at = user.last_login;
    this.save();
    return user;
  }

  public getUserById(id: string): UserRecord | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    const normalizedEmail = email.toLowerCase().trim();
    return this.data.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  }

  public generateAuthToken(user: UserRecord): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.full_name,
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  public verifyToken(token: string): { userId: string; email: string; name: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return decoded;
    } catch {
      return null;
    }
  }

  public async changePassword(userId: string, oldPass: string, newPass: string): Promise<boolean> {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');

    const isMatch = await bcrypt.compare(oldPass, user.password_hash);
    if (!isMatch) throw new Error('Current password is incorrect.');

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPass, salt);
    user.updated_at = new Date().toISOString();
    this.save();
    return true;
  }

  public async setResetToken(email: string): Promise<string> {
    const user = this.getUserByEmail(email);
    if (!user) throw new Error('No user found with this email.');

    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    user.reset_token = token;
    user.reset_token_expiry = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 min
    this.save();
    return token;
  }

  public async resetPasswordWithToken(email: string, token: string, newPass: string): Promise<boolean> {
    const user = this.getUserByEmail(email);
    if (!user || user.reset_token !== token.trim().toUpperCase()) {
      throw new Error('Invalid or expired reset code.');
    }
    if (!user.reset_token_expiry || new Date(user.reset_token_expiry) < new Date()) {
      throw new Error('Reset code has expired. Please request a new one.');
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPass, salt);
    user.reset_token = undefined;
    user.reset_token_expiry = undefined;
    user.updated_at = new Date().toISOString();
    this.save();
    return true;
  }

  // Profile Operations
  public getProfileByUserId(userId: string): ProfileRecord | undefined {
    return this.data.profiles.find((p) => p.user_id === userId);
  }

  public saveProfile(userId: string, profileData: Partial<ProfileRecord>): ProfileRecord {
    const now = new Date().toISOString();
    let profile = this.getProfileByUserId(userId);
    const user = this.getUserById(userId);

    if (user && profileData.name && profileData.name.trim()) {
      user.full_name = profileData.name.trim();
      user.updated_at = now;
    }

    if (profile) {
      Object.assign(profile, {
        ...profileData,
        name: profileData.name?.trim() || user?.full_name || profile.name,
        user_id: userId,
        updated_at: now,
      });
    } else {
      profile = {
        id: `prof_${Date.now()}`,
        user_id: userId,
        name: profileData.name?.trim() || user?.full_name || '',
        age: profileData.age || 22,
        location: profileData.location || 'Kanifing / KMC, The Gambia',
        education_level: profileData.education_level || 'Bachelor’s Degree',
        institution: profileData.institution || 'University of The Gambia (UTG)',
        degree: profileData.degree || '',
        field_of_study: profileData.field_of_study || 'Computer Science',
        graduation_year: profileData.graduation_year || '2025',
        skills: profileData.skills || [],
        soft_skills: profileData.soft_skills || [],
        technical_skills: profileData.technical_skills || [],
        interests: profileData.interests || [],
        career_goal: profileData.career_goal || '',
        target_industry: profileData.target_industry || '',
        target_industries: profileData.target_industries || [],
        cv_file_name: profileData.cv_file_name || '',
        cv_raw_text: profileData.cv_raw_text || '',
        experience_years: profileData.experience_years || '',
        preferred_work_type: profileData.preferred_work_type || 'Hybrid',
        created_at: now,
        updated_at: now,
      };
      this.data.profiles.push(profile);
    }

    this.save();
    return profile;
  }

  // Career Analysis Operations
  public getCareerAnalysis(userId: string): CareerAnalysisRecord | undefined {
    return this.data.career_analyses.find((ca) => ca.user_id === userId);
  }

  public saveCareerAnalysis(userId: string, matches: any[]): CareerAnalysisRecord {
    const now = new Date().toISOString();
    const scores: Record<string, number> = {};
    const explanations: Record<string, string> = {};

    matches.forEach((m) => {
      if (m.title) {
        scores[m.title] = m.matchScore || 0;
        explanations[m.title] = m.reason || '';
      }
    });

    let rec = this.getCareerAnalysis(userId);
    if (rec) {
      rec.recommended_careers = matches;
      rec.match_scores = scores;
      rec.career_explanations = explanations;
      rec.updated_at = now;
    } else {
      rec = {
        id: `ca_${Date.now()}`,
        user_id: userId,
        recommended_careers: matches,
        match_scores: scores,
        career_explanations: explanations,
        created_at: now,
        updated_at: now,
      };
      this.data.career_analyses.push(rec);
    }
    this.save();
    return rec;
  }

  // Skill Gap Operations
  public getSkillGap(userId: string, targetCareer?: string): SkillGapRecord | undefined {
    if (targetCareer) {
      return this.data.skill_gaps.find(
        (sg) => sg.user_id === userId && sg.target_career.toLowerCase() === targetCareer.toLowerCase()
      ) || this.data.skill_gaps.find((sg) => sg.user_id === userId);
    }
    return this.data.skill_gaps.find((sg) => sg.user_id === userId);
  }

  public saveSkillGap(userId: string, targetCareer: string, analysis: any): SkillGapRecord {
    const now = new Date().toISOString();
    const missing = (analysis?.skillGaps || []).map((g: any) => g.skill);
    const priorities: Record<string, string> = {};
    (analysis?.skillGaps || []).forEach((g: any) => {
      priorities[g.skill] = g.priority;
    });

    let rec = this.data.skill_gaps.find((sg) => sg.user_id === userId);
    if (rec) {
      rec.target_career = targetCareer;
      rec.missing_skills = missing;
      rec.priority_levels = priorities;
      rec.analysis_data = analysis;
      rec.updated_at = now;
    } else {
      rec = {
        id: `sg_${Date.now()}`,
        user_id: userId,
        target_career: targetCareer,
        missing_skills: missing,
        priority_levels: priorities,
        analysis_data: analysis,
        created_at: now,
        updated_at: now,
      };
      this.data.skill_gaps.push(rec);
    }
    this.save();
    return rec;
  }

  // Roadmap Operations
  public getRoadmap(userId: string): RoadmapRecord | undefined {
    return this.data.roadmaps.find((r) => r.user_id === userId);
  }

  public saveRoadmap(
    userId: string,
    career: string,
    learningPlan: any,
    completedTaskIds: string[] = []
  ): RoadmapRecord {
    const now = new Date().toISOString();
    // Calculate progress percentage based on completed tasks
    let totalTasks = 0;
    if (learningPlan?.months) {
      learningPlan.months.forEach((m: any) => {
        (m.weeks || []).forEach((w: any) => {
          totalTasks += (w.tasks || []).length;
        });
      });
    }
    const progress = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0;

    let rec = this.getRoadmap(userId);
    if (rec) {
      rec.career = career;
      rec.learning_plan = learningPlan;
      rec.completed_task_ids = completedTaskIds;
      rec.progress = progress;
      rec.updated_at = now;
    } else {
      rec = {
        id: `rd_${Date.now()}`,
        user_id: userId,
        career,
        learning_plan: learningPlan,
        completed_task_ids: completedTaskIds,
        progress,
        created_at: now,
        updated_at: now,
      };
      this.data.roadmaps.push(rec);
    }
    this.save();
    return rec;
  }

  public updateRoadmapProgress(userId: string, completedTaskIds: string[]): RoadmapRecord | undefined {
    const rec = this.getRoadmap(userId);
    if (!rec) return undefined;

    let totalTasks = 0;
    if (rec.learning_plan?.months) {
      rec.learning_plan.months.forEach((m: any) => {
        (m.weeks || []).forEach((w: any) => {
          totalTasks += (w.tasks || []).length;
        });
      });
    }
    rec.completed_task_ids = completedTaskIds;
    rec.progress = totalTasks > 0 ? Math.round((completedTaskIds.length / totalTasks) * 100) : 0;
    rec.updated_at = new Date().toISOString();
    this.save();
    return rec;
  }

  // CV Operations
  public getCV(userId: string): CVRecord | undefined {
    return this.data.cvs.find((c) => c.user_id === userId);
  }

  public saveCV(userId: string, cvData: any): CVRecord {
    const now = new Date().toISOString();
    let rec = this.getCV(userId);
    if (rec) {
      rec.cv_data_json = cvData;
      rec.template = cvData.template || 'modern-standard';
      rec.target_career = cvData.targetCareer || 'Software Developer';
      rec.updated_at = now;
    } else {
      rec = {
        id: `cv_${Date.now()}`,
        user_id: userId,
        cv_data_json: cvData,
        template: cvData.template || 'modern-standard',
        target_career: cvData.targetCareer || 'Software Developer',
        created_at: now,
        updated_at: now,
      };
      this.data.cvs.push(rec);
    }
    this.save();
    return rec;
  }

  // Full User Career Package Query
  public getUserCompleteCareerPackage(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const profile = this.getProfileByUserId(userId);
    const careerAnalysis = this.getCareerAnalysis(userId);
    const skillGap = this.getSkillGap(userId);
    const roadmap = this.getRoadmap(userId);
    const cv = this.getCV(userId);

    return {
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        createdAt: user.created_at,
        lastLogin: user.last_login,
      },
      profile: profile ? {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        location: profile.location,
        educationLevel: profile.education_level,
        institution: profile.institution,
        degree: profile.degree,
        fieldOfStudy: profile.field_of_study,
        graduationYear: profile.graduation_year,
        currentSkills: profile.skills,
        softSkills: profile.soft_skills,
        interests: profile.interests,
        careerGoal: profile.career_goal,
        targetIndustries: profile.target_industries,
        cvFileName: profile.cv_file_name,
        experienceYears: profile.experience_years,
        preferredWorkType: profile.preferred_work_type,
      } : null,
      careerMatches: careerAnalysis ? careerAnalysis.recommended_careers : [],
      skillGap: skillGap ? skillGap.analysis_data : null,
      roadmap: roadmap ? roadmap.learning_plan : null,
      completedTaskIds: roadmap ? roadmap.completed_task_ids : [],
      roadmapProgress: roadmap ? roadmap.progress : 0,
      cvData: cv ? cv.cv_data_json : null,
      hasCompletedProfile: !!profile && !!profile.institution && profile.skills.length > 0,
    };
  }

  // User-Controlled Reset System
  public resetUserCareerData(userId: string, confirmEmail: string): boolean {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.email.toLowerCase() !== confirmEmail.toLowerCase().trim()) {
      throw new Error('Provided email does not match account email.');
    }

    // Delete all career data for this user
    this.data.profiles = this.data.profiles.filter((p) => p.user_id !== userId);
    this.data.career_analyses = this.data.career_analyses.filter((ca) => ca.user_id !== userId);
    this.data.skill_gaps = this.data.skill_gaps.filter((sg) => sg.user_id !== userId);
    this.data.roadmaps = this.data.roadmaps.filter((r) => r.user_id !== userId);
    this.data.cvs = this.data.cvs.filter((c) => c.user_id !== userId);

    user.updated_at = new Date().toISOString();
    this.save();
    return true;
  }
}

export const db = new Database();
