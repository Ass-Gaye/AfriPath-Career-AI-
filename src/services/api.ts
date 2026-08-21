import {
  UserProfile,
  CareerMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  JobOpportunity,
  ChatMessage,
  CVData,
} from '../types/career';
import {
  MUSA_JALLOW_PROFILE,
  MUSA_JALLOW_CAREER_MATCHES,
  MUSA_JALLOW_SKILL_GAP,
  MUSA_JALLOW_ROADMAP,
  MUSA_JALLOW_CV,
} from '../data/demoUser';
import { REAL_GAMBIA_JOB_LISTINGS } from '../data/gambiaData';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface CompleteUserData {
  user: AuthUser;
  profile: UserProfile | null;
  careerMatches: CareerMatch[];
  skillGap: SkillGapAnalysis | null;
  roadmap: CareerRoadmap | null;
  completedTaskIds: string[];
  roadmapProgress: number;
  cvData: CVData | null;
  hasCompletedProfile: boolean;
}

// Token management in localStorage
const TOKEN_KEY = 'gambia_career_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error('Error saving auth token:', err);
  }
}

// Helper to construct headers with auth token if available
function getHeaders(customHeaders: Record<string, string> = {}): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ==========================================
// AUTHENTICATION API CALLS
// ==========================================

export async function signupUser(
  fullName: string,
  email: string,
  password: string,
  confirmPassword?: string,
  initialProfile?: Partial<UserProfile>
): Promise<{ user: AuthUser; token: string; data?: CompleteUserData }> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password, confirmPassword, initialProfile }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to create account.');
  }

  setStoredToken(resJson.token);
  return { user: resJson.user, token: resJson.token, data: resJson.data };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string; data: CompleteUserData }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Invalid credentials.');
  }

  setStoredToken(resJson.token);
  return { user: resJson.user, token: resJson.token, data: resJson.data };
}

export async function getCurrentUserSession(): Promise<{ user: AuthUser; data: CompleteUserData } | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setStoredToken(null);
      }
      return null;
    }

    const resJson = await response.json();
    return { user: resJson.user, data: resJson.data };
  } catch (err) {
    console.error('Session validation error:', err);
    return null;
  }
}

export function logoutUser(): void {
  setStoredToken(null);
}

export async function forgotPassword(email: string): Promise<{ message: string; resetCode?: string }> {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to request password reset.');
  }

  return { message: resJson.message, resetCode: resJson.resetCode };
}

export async function resetPasswordWithToken(
  email: string,
  token: string,
  newPassword: string,
  confirmPassword?: string
): Promise<{ message: string }> {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, newPassword, confirmPassword }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to reset password.');
  }

  return { message: resJson.message };
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword?: string
): Promise<{ message: string }> {
  const response = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to change password.');
  }

  return { message: resJson.message };
}

// ==========================================
// PERSISTENT USER DATA OPERATIONS
// ==========================================

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile> {
  const token = getStoredToken();
  if (!token) return profile;

  try {
    const response = await fetch('/api/user/profile', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ profile }),
    });

    const resJson = await response.json();
    if (!response.ok) {
      throw new Error(resJson.error || 'Failed to persist profile on server.');
    }

    // Update local cached auth user if full name changed
    const userStr = localStorage.getItem('gambia_career_user');
    if (userStr && profile.name?.trim()) {
      try {
        const u = JSON.parse(userStr);
        u.fullName = profile.name.trim();
        localStorage.setItem('gambia_career_user', JSON.stringify(u));
      } catch (e) {
        // ignore parse error
      }
    }

    return profile;
  } catch (err: any) {
    console.warn('Failed to persist profile:', err);
    throw err;
  }
}

export async function saveCareerMatches(matches: CareerMatch[]): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  try {
    await fetch('/api/user/career-analysis', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ matches }),
    });
  } catch (err) {
    console.warn('Failed to persist career analysis:', err);
  }
}

export async function saveSkillGapAnalysis(targetCareer: string, analysis: SkillGapAnalysis): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  try {
    await fetch('/api/user/skill-gap', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ targetCareer, analysis }),
    });
  } catch (err) {
    console.warn('Failed to persist skill gap:', err);
  }
}

export async function saveRoadmapData(
  career: string,
  learningPlan: CareerRoadmap,
  completedTaskIds: string[]
): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  try {
    await fetch('/api/user/roadmap', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ career, learningPlan, completedTaskIds }),
    });
  } catch (err) {
    console.warn('Failed to persist roadmap:', err);
  }
}

export async function updateRoadmapTaskProgress(completedTaskIds: string[]): Promise<number> {
  const token = getStoredToken();
  if (!token) return 0;

  try {
    const res = await fetch('/api/user/roadmap/progress', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ completedTaskIds }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.progress || 0;
    }
  } catch (err) {
    console.warn('Failed to update task progress:', err);
  }
  return 0;
}

export async function saveCVData(cvData: CVData): Promise<void> {
  const token = getStoredToken();
  if (!token) return;

  try {
    await fetch('/api/user/cv', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cvData }),
    });
  } catch (err) {
    console.warn('Failed to persist CV:', err);
  }
}

// User-Controlled Reset Action (Requires email & "RESET MY PROFILE")
export async function resetCareerProfile(confirmEmail: string, confirmPhrase: string): Promise<string> {
  const response = await fetch('/api/user/reset-career-profile', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ confirmEmail, confirmPhrase }),
  });

  const resJson = await response.json();
  if (!response.ok) {
    throw new Error(resJson.error || 'Failed to reset career profile.');
  }

  return resJson.message;
}

// ==========================================
// AI & CAREER SERVICES
// ==========================================

export async function fetchGeneratedCV(
  profile: UserProfile,
  targetCareer: string,
  targetCompany?: string,
  additionalInfo?: {
    extraProjects?: string;
    extraExperience?: string;
    contactPhone?: string;
    contactEmail?: string;
    githubUsername?: string;
    linkedinUrl?: string;
  }
): Promise<CVData> {
  try {
    const response = await fetch('/api/generate-cv', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ profile, targetCareer, targetCompany, additionalInfo }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.cv || MUSA_JALLOW_CV;
  } catch (err) {
    console.warn('Using fallback CV due to:', err);
    return {
      ...MUSA_JALLOW_CV,
      targetCareer,
      targetCompany: targetCompany || 'Gambian Tech Industry',
      personalInfo: {
        ...MUSA_JALLOW_CV.personalInfo,
        fullName: profile.name || 'Fatou Bah',
        location: profile.location || 'Kanifing / KMC, The Gambia',
      },
    };
  }
}

export async function fetchEnhancedCVSection(
  sectionType: string,
  content: any,
  targetCareer: string,
  promptGuidance?: string
): Promise<any> {
  try {
    const response = await fetch('/api/enhance-cv-section', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ sectionType, content, targetCareer, promptGuidance }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.enhanced || content;
  } catch (err) {
    console.warn('Using fallback enhanced section due to:', err);
    return content;
  }
}

export async function fetchCareerMatches(profile: UserProfile): Promise<CareerMatch[]> {
  try {
    const response = await fetch('/api/analyze-career', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ profile }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.matches || MUSA_JALLOW_CAREER_MATCHES;
  } catch (err) {
    console.warn('Using fallback career matches due to:', err);
    return MUSA_JALLOW_CAREER_MATCHES;
  }
}

export async function fetchSkillGap(
  profile: UserProfile,
  targetCareer: string
): Promise<SkillGapAnalysis> {
  try {
    const response = await fetch('/api/skill-gap', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ profile, targetCareer }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.analysis || MUSA_JALLOW_SKILL_GAP;
  } catch (err) {
    console.warn('Using fallback skill gap due to:', err);
    return {
      ...MUSA_JALLOW_SKILL_GAP,
      targetCareer,
    };
  }
}

export async function fetchRoadmap(
  profile: UserProfile,
  targetCareer: string
): Promise<CareerRoadmap> {
  try {
    const response = await fetch('/api/generate-roadmap', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ profile, targetCareer }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.roadmap || MUSA_JALLOW_ROADMAP;
  } catch (err) {
    console.warn('Using fallback roadmap due to:', err);
    return {
      ...MUSA_JALLOW_ROADMAP,
      targetCareer: `${targetCareer} Pathway (90 Days)`,
    };
  }
}

export async function sendMentorMessage(
  history: ChatMessage[],
  message: string,
  profile?: UserProfile | null,
  targetCareer?: string | null
): Promise<{ text: string; quickReplies: string[] }> {
  try {
    const response = await fetch('/api/mentor-chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        history: history.map((h) => ({ sender: h.sender, text: h.text })),
        message,
        profile,
        targetCareer,
      }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.reply;
  } catch (err) {
    console.warn('Using fallback mentor reply due to:', err);
    return {
      text: `Great question! In The Gambia's tech job market, employers like QCell, Gamswitch, and Insist Global prioritize verifiable practical projects, clean GitHub repositories, and direct problem-solving skills over purely theoretical degrees. I recommend dedicating 10-15 hours a week towards building real Gambian-focused applications.`,
      quickReplies: [
        'How do I build a strong Gambian tech CV?',
        'What are the highest paying tech jobs in Banjul?',
        'How can I get started with AI Engineering?',
      ],
    };
  }
}

export async function parseCVFile(cvText: string): Promise<Partial<UserProfile>> {
  try {
    const response = await fetch('/api/parse-cv', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cvText }),
    });
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.profile || {};
  } catch (err) {
    console.warn('CV parsing fallback:', err);
    return {
      name: 'Musa Jallow',
      educationLevel: 'Bachelor’s Degree',
      institution: 'University of The Gambia (UTG)',
      fieldOfStudy: 'Computer Science',
      currentSkills: ['HTML & CSS', 'JavaScript', 'Git & GitHub'],
      softSkills: ['Problem Solving', 'Team Collaboration'],
    };
  }
}

export async function fetchOpportunities(
  search = '',
  category = ''
): Promise<JobOpportunity[]> {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await fetch(`/api/opportunities?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    return data.opportunities || REAL_GAMBIA_JOB_LISTINGS;
  } catch (err) {
    console.warn('Using local opportunities data due to:', err);
    return REAL_GAMBIA_JOB_LISTINGS;
  }
}
