import { Router, Request, Response, NextFunction } from 'express';
import {
  analyzeCareerProfile,
  analyzeSkillGap,
  generateCareerRoadmap,
  chatCareerMentor,
  parseCVContent,
  generateTailoredCV,
  enhanceCVSection,
} from './geminiService';
import { REAL_GAMBIA_JOB_LISTINGS } from '../src/data/gambiaData';
import { db } from './db';

export const apiRouter = Router();

// Auth Middleware: Extracts and validates Bearer token if present
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token is missing.' });
  }

  const payload = db.verifyToken(token);
  if (!payload) {
    return res.status(403).json({ error: 'Invalid or expired session token. Please log in again.' });
  }

  req.user = payload;
  next();
};

// Optional auth middleware (attaches user if token is provided, does not fail if unauthenticated)
export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (token) {
    const payload = db.verifyToken(token);
    if (payload) {
      req.user = payload;
    }
  }
  next();
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. Sign Up
apiRouter.post('/auth/signup', async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, confirmPassword, initialProfile } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const newUser = await db.createUser(fullName, email, password);
    const token = db.generateAuthToken(newUser);

    // If initial profile info was supplied during signup, store it
    if (initialProfile) {
      db.saveProfile(newUser.id, {
        name: fullName,
        ...initialProfile,
      });
    }

    const completeData = db.getUserCompleteCareerPackage(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.full_name,
        email: newUser.email,
      },
      data: completeData,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(400).json({ error: error.message || 'Failed to create account.' });
  }
});

// 2. Login
apiRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await db.authenticateUser(email, password);
    const token = db.generateAuthToken(user);
    const completeData = db.getUserCompleteCareerPackage(user.id);

    return res.json({
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        lastLogin: user.last_login,
      },
      data: completeData,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(401).json({ error: error.message || 'Invalid email or password.' });
  }
});

// 3. Get Current User & Complete Career State (Persistent restore)
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const completeData = db.getUserCompleteCareerPackage(userId);

    if (!completeData) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json({
      success: true,
      user: completeData.user,
      data: completeData,
    });
  } catch (error: any) {
    console.error('Auth /me error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user session.' });
  }
});

// 4. Forgot Password
apiRouter.post('/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please enter your account email address.' });
    }

    const resetCode = await db.setResetToken(email);
    return res.json({
      success: true,
      message: `A password reset code has been generated. Use code: ${resetCode}`,
      resetCode, // In production this would be emailed; provided for testing and instant user feedback
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return res.status(400).json({ error: error.message || 'Failed to process password reset.' });
  }
});

// 5. Reset Password with Code
apiRouter.post('/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, reset code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    await db.resetPasswordWithToken(email, token, newPassword);
    return res.json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.',
    });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(400).json({ error: error.message || 'Failed to reset password.' });
  }
});

// 6. Change Password (Authenticated)
apiRouter.post('/auth/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    await db.changePassword(userId, currentPassword, newPassword);
    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error: any) {
    console.error('Change password error:', error);
    return res.status(400).json({ error: error.message || 'Failed to change password.' });
  }
});

// ==========================================
// USER PERSISTENT DATA & CAREER PROFILE
// ==========================================

// Get All Saved Career Data
apiRouter.get('/user/data', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = db.getUserCompleteCareerPackage(userId);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('Get user data error:', error);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
});

// Save or Update User Profile
apiRouter.post('/user/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { profile } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required.' });
    }

    const saved = db.saveProfile(userId, {
      name: profile.name,
      age: profile.age,
      location: profile.location,
      education_level: profile.educationLevel,
      institution: profile.institution,
      degree: profile.degree,
      field_of_study: profile.fieldOfStudy,
      graduation_year: profile.graduationYear,
      skills: profile.currentSkills || [],
      soft_skills: profile.softSkills || [],
      technical_skills: profile.currentSkills || [],
      interests: profile.interests || [],
      career_goal: profile.careerGoal || '',
      target_industries: profile.targetIndustries || [],
      cv_file_name: profile.cvFileName,
      cv_raw_text: profile.cvRawText,
      experience_years: profile.experienceYears,
      preferred_work_type: profile.preferredWorkType,
    });

    return res.json({ success: true, profile: saved });
  } catch (error: any) {
    console.error('Save profile error:', error);
    return res.status(500).json({ error: error.message || 'Failed to save profile.' });
  }
});

// Save Career Recommendations
apiRouter.post('/user/career-analysis', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { matches } = req.body;
    if (!matches || !Array.isArray(matches)) {
      return res.status(400).json({ error: 'Matches array is required.' });
    }
    const saved = db.saveCareerAnalysis(userId, matches);
    return res.json({ success: true, careerAnalysis: saved });
  } catch (error: any) {
    console.error('Save career analysis error:', error);
    return res.status(500).json({ error: 'Failed to save career analysis.' });
  }
});

// Save Skill Gap Analysis
apiRouter.post('/user/skill-gap', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { targetCareer, analysis } = req.body;
    if (!targetCareer || !analysis) {
      return res.status(400).json({ error: 'targetCareer and analysis are required.' });
    }
    const saved = db.saveSkillGap(userId, targetCareer, analysis);
    return res.json({ success: true, skillGap: saved });
  } catch (error: any) {
    console.error('Save skill gap error:', error);
    return res.status(500).json({ error: 'Failed to save skill gap.' });
  }
});

// Save Career Roadmap
apiRouter.post('/user/roadmap', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { career, learningPlan, completedTaskIds } = req.body;
    if (!career || !learningPlan) {
      return res.status(400).json({ error: 'career and learningPlan are required.' });
    }
    const saved = db.saveRoadmap(userId, career, learningPlan, completedTaskIds || []);
    return res.json({ success: true, roadmap: saved });
  } catch (error: any) {
    console.error('Save roadmap error:', error);
    return res.status(500).json({ error: 'Failed to save roadmap.' });
  }
});

// Update Roadmap Completed Tasks & Progress
apiRouter.post('/user/roadmap/progress', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { completedTaskIds } = req.body;
    if (!completedTaskIds || !Array.isArray(completedTaskIds)) {
      return res.status(400).json({ error: 'completedTaskIds array is required.' });
    }
    const updated = db.updateRoadmapProgress(userId, completedTaskIds);
    return res.json({ success: true, progress: updated?.progress || 0, completedTaskIds });
  } catch (error: any) {
    console.error('Update roadmap progress error:', error);
    return res.status(500).json({ error: 'Failed to update progress.' });
  }
});

// Save Generated or Edited CV
apiRouter.post('/user/cv', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { cvData } = req.body;
    if (!cvData) {
      return res.status(400).json({ error: 'cvData is required.' });
    }
    const saved = db.saveCV(userId, cvData);
    return res.json({ success: true, cv: saved });
  } catch (error: any) {
    console.error('Save CV error:', error);
    return res.status(500).json({ error: 'Failed to save CV.' });
  }
});

// ==========================================
// RESET SYSTEM (User-Controlled Danger Zone)
// ==========================================

apiRouter.post('/user/reset-career-profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { confirmEmail, confirmPhrase } = req.body;

    if (!confirmEmail) {
      return res.status(400).json({ error: 'Please enter your account email address.' });
    }

    if (!confirmPhrase || confirmPhrase.trim() !== 'RESET MY PROFILE') {
      return res.status(400).json({
        error: 'Confirmation phrase is invalid. You must type "RESET MY PROFILE" in capital letters.',
      });
    }

    db.resetUserCareerData(userId, confirmEmail);

    return res.json({
      success: true,
      message: 'Your career profile has been successfully reset. Let’s create your new career journey.',
    });
  } catch (error: any) {
    console.error('Reset profile error:', error);
    return res.status(400).json({ error: error.message || 'Failed to reset career profile.' });
  }
});

// ==========================================
// AI & CAREER SERVICES (with auto-persistence for logged in users)
// ==========================================

apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AfriPath AI API', timestamp: new Date().toISOString() });
});

apiRouter.post('/generate-cv', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profile, targetCareer, targetCompany, additionalInfo } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile data in request body' });
    }
    const cvData = await generateTailoredCV(
      profile,
      targetCareer || 'Software Developer',
      targetCompany,
      additionalInfo
    );

    // Auto-save if authenticated
    if (req.user?.userId) {
      try {
        db.saveCV(req.user.userId, cvData);
      } catch (err) {
        console.warn('Failed to auto-save CV for user:', err);
      }
    }

    return res.json({ success: true, cv: cvData });
  } catch (error: any) {
    console.error('API /generate-cv error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate CV' });
  }
});

apiRouter.post('/enhance-cv-section', async (req: Request, res: Response) => {
  try {
    const { sectionType, content, targetCareer, promptGuidance } = req.body;
    if (!sectionType || !content) {
      return res.status(400).json({ error: 'Missing sectionType or content' });
    }
    const enhanced = await enhanceCVSection(sectionType, content, targetCareer || 'Tech Professional', promptGuidance);
    return res.json({ success: true, enhanced });
  } catch (error: any) {
    console.error('API /enhance-cv-section error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to enhance section' });
  }
});

apiRouter.post('/analyze-career', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile data in request body' });
    }
    const matches = await analyzeCareerProfile(profile);

    // Auto-save if authenticated
    if (req.user?.userId) {
      try {
        db.saveProfile(req.user.userId, {
          name: profile.name,
          age: profile.age,
          location: profile.location,
          education_level: profile.educationLevel,
          institution: profile.institution,
          field_of_study: profile.fieldOfStudy,
          graduation_year: profile.graduationYear,
          skills: profile.currentSkills,
          soft_skills: profile.softSkills,
          interests: profile.interests,
          career_goal: profile.careerGoal,
          target_industries: profile.targetIndustries,
        });
        db.saveCareerAnalysis(req.user.userId, matches);
      } catch (err) {
        console.warn('Failed to auto-save analysis for user:', err);
      }
    }

    return res.json({ success: true, matches });
  } catch (error: any) {
    console.error('API /analyze-career error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze career profile' });
  }
});

apiRouter.post('/skill-gap', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profile, targetCareer } = req.body;
    if (!profile || !targetCareer) {
      return res.status(400).json({ error: 'Missing profile or targetCareer' });
    }
    const analysis = await analyzeSkillGap(profile, targetCareer);

    // Auto-save if authenticated
    if (req.user?.userId) {
      try {
        db.saveSkillGap(req.user.userId, targetCareer, analysis);
      } catch (err) {
        console.warn('Failed to auto-save skill gap:', err);
      }
    }

    return res.json({ success: true, analysis });
  } catch (error: any) {
    console.error('API /skill-gap error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze skill gap' });
  }
});

apiRouter.post('/generate-roadmap', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { profile, targetCareer } = req.body;
    if (!profile || !targetCareer) {
      return res.status(400).json({ error: 'Missing profile or targetCareer' });
    }
    const roadmap = await generateCareerRoadmap(profile, targetCareer);

    // Auto-save if authenticated
    if (req.user?.userId) {
      try {
        db.saveRoadmap(req.user.userId, targetCareer, roadmap, []);
      } catch (err) {
        console.warn('Failed to auto-save roadmap:', err);
      }
    }

    return res.json({ success: true, roadmap });
  } catch (error: any) {
    console.error('API /generate-roadmap error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate roadmap' });
  }
});

apiRouter.post('/mentor-chat', async (req: Request, res: Response) => {
  try {
    const { history = [], message, profile, targetCareer } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Missing message in request body' });
    }
    const reply = await chatCareerMentor(history, message, profile, targetCareer);
    return res.json({ success: true, reply });
  } catch (error: any) {
    console.error('API /mentor-chat error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to get mentor response' });
  }
});

apiRouter.post('/parse-cv', async (req: Request, res: Response) => {
  try {
    const { cvText } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: 'Missing cvText' });
    }
    const extractedData = await parseCVContent(cvText);
    return res.json({ success: true, profile: extractedData });
  } catch (error: any) {
    console.error('API /parse-cv error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to parse CV' });
  }
});

apiRouter.get('/opportunities', (req: Request, res: Response) => {
  const query = (req.query.search as string || '').toLowerCase();
  const category = (req.query.category as string || '').toLowerCase();

  let results = [...REAL_GAMBIA_JOB_LISTINGS];

  if (category && category !== 'all') {
    results = results.filter((j) => j.category.toLowerCase().includes(category));
  }

  if (query) {
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(query) ||
        j.company.toLowerCase().includes(query) ||
        j.location.toLowerCase().includes(query) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(query))
    );
  }

  res.json({ success: true, opportunities: results });
});
