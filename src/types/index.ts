export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type EducationLevel = 'middle_school' | 'high_school' | 'university' | 'graduate' | 'self_learner';

export type LanguageCode = 'ar' | 'eg' | 'en' | 'es' | 'de' | 'fr';

export type AppThemeColor = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan';

export type ColorMode = 'light' | 'dark';

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // Hex color code
  textColor?: string;
  targetWeeklyHours: number;
  topics: Topic[];
  iconName?: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  durationMinutes: number;
  priority: Priority;
  status: 'scheduled' | 'completed' | 'missed' | 'in_progress';
  actualDurationMinutes?: number;
  notes?: string;
  recurring?: 'none' | 'daily' | 'weekly';
  hasAlert?: boolean;
  alertTime?: string; // HH:mm or offset
}

export interface ExamTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface MockTest {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  durationMinutes: number;
  syllabusTopics: ExamTopic[];
  mockTests: MockTest[];
  targetGrade?: string;
  postExamReflection?: string;
  actualGrade?: string;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  deadline: string; // YYYY-MM-DD
  priority: Priority;
  estimatedMinutes: number;
  completed: boolean;
  notes?: string;
  hasAlert?: boolean;
  alertTime?: string; // e.g. "10:00"
}

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  scientificFact: string;
  scientificSource: string;
  category: string;
}

export interface StudyLog {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topic: string;
  durationMinutes: number;
  timestamp: number;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  type: 'session' | 'exam' | 'deadline' | 'suggestion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
  actionLabel?: string;
}

export interface UserProfile {
  name: string;
  avatarSeed: string;
  educationLevel: EducationLevel;
  dailyGoalHours: number;
  weeklyGoalHours: number;
  preferredSessionMinutes: number;
  language: LanguageCode;
  simplifiedMode: boolean;
  notificationsEnabled: boolean;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string; // e.g. "07:00"
  streakDays: number;
  lastActiveDate: string;
  isLoggedIn?: boolean;
  email?: string;
  themeColor?: AppThemeColor;
  colorMode?: ColorMode;
  soundEffectsEnabled?: boolean;
}

export interface SavedAccount {
  id: string;
  name: string;
  email: string;
  educationLevel: EducationLevel;
  lastLogin: string;
  themeColor?: AppThemeColor;
}

export interface MotivationalCheer {
  id: string;
  title: string;
  message: string;
  subMessage?: string;
  type: 'task' | 'streak' | 'session';
  streakCount?: number;
}

export type ViewTab = 'home' | 'planner' | 'subjects' | 'exams' | 'focus' | 'analytics' | 'settings';
