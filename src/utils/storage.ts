import { Subject, StudySession, Exam, Task, StudyLog, NotificationItem, UserProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'studyflow_user_profile',
  SUBJECTS: 'studyflow_subjects',
  SESSIONS: 'studyflow_sessions',
  EXAMS: 'studyflow_exams',
  TASKS: 'studyflow_tasks',
  LOGS: 'studyflow_study_logs',
  NOTIFICATIONS: 'studyflow_notifications',
  LAST_SYNC: 'studyflow_last_sync_timestamp',
};

// Formats YYYY-MM-DD helper based on today offset
export function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const INITIAL_PROFILE: UserProfile = {
  name: 'أحمد علي',
  avatarSeed: 'ahmed',
  educationLevel: 'university',
  dailyGoalHours: 3.5,
  weeklyGoalHours: 20,
  preferredSessionMinutes: 45,
  language: 'ar', // Default to clear Arabic
  simplifiedMode: false,
  notificationsEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  streakDays: 5,
  lastActiveDate: getDateOffset(0),
  isLoggedIn: true,
  email: 'ahmed.ali@study.edu',
  themeColor: 'blue',
  colorMode: 'light',
  soundEffectsEnabled: true,
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-german',
    name: 'اللغة الألمانية',
    code: 'GER-101',
    color: '#D97706', // amber
    targetWeeklyHours: 4,
    topics: [
      { id: 'top-ger-1', title: 'مفردات الوحدة 4 و 5', completed: true, difficulty: 'medium' },
      { id: 'top-ger-2', title: 'حروف الجر وحالات النصب والمجرور', completed: false, difficulty: 'hard' },
      { id: 'top-ger-3', title: 'تدريب المحادثة والاستماع', completed: false, difficulty: 'easy' },
    ],
  },
  {
    id: 'sub-math',
    name: 'الرياضيات المتقدمة',
    code: 'MATH-204',
    color: '#2563EB', // blue
    targetWeeklyHours: 6,
    topics: [
      { id: 'top-math-1', title: 'التفاضل والتكامل والنهايات', completed: true, difficulty: 'hard' },
      { id: 'top-math-2', title: 'الجبر الخطي والقيم الذاتية', completed: false, difficulty: 'hard' },
      { id: 'top-math-3', title: 'تمارين وتطبيقات عملية (مجموعة ب)', completed: false, difficulty: 'medium' },
    ],
  },
  {
    id: 'sub-bio',
    name: 'علم الأحياء',
    code: 'BIO-110',
    color: '#0D9488', // teal
    targetWeeklyHours: 4,
    topics: [
      { id: 'top-bio-1', title: 'التنفس الخلوي وإنتاج الطاقة', completed: true, difficulty: 'medium' },
      { id: 'top-bio-2', title: 'الفصل الثاني: الوراثة والجينات', completed: false, difficulty: 'hard' },
      { id: 'top-bio-3', title: 'فيزيولوجيا النباتات والأنسجة', completed: false, difficulty: 'easy' },
    ],
  },
  {
    id: 'sub-chem',
    name: 'الكيمياء',
    code: 'CHEM-201',
    color: '#7C3AED', // purple
    targetWeeklyHours: 5,
    topics: [
      { id: 'top-chem-1', title: 'تسمية المركبات العضوية والألكانات', completed: true, difficulty: 'medium' },
      { id: 'top-chem-2', title: 'الديناميكا الحرارية الكيميائية', completed: false, difficulty: 'hard' },
      { id: 'top-chem-3', title: 'سرعة التفاعلات والعوامل الحفازة', completed: false, difficulty: 'hard' },
      { id: 'top-chem-4', title: 'الاتزان الكيميائي والأحماض والقواعد', completed: false, difficulty: 'medium' },
    ],
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  {
    id: 'sess-1',
    subjectId: 'sub-german',
    topic: 'مراجعة مفردات الألمانية: الوحدة الرابعة',
    date: getDateOffset(0),
    startTime: '16:00',
    endTime: '16:30',
    durationMinutes: 30,
    priority: 'high',
    status: 'completed',
    actualDurationMinutes: 30,
    notes: 'تمت مراجعة بطاقات الاستذكار لمفردات السفر والعمل بنجاح.',
  },
  {
    id: 'sess-2',
    subjectId: 'sub-math',
    topic: 'تمارين الرياضيات: حل مسائل الجبر الخطي',
    date: getDateOffset(0),
    startTime: '17:00',
    endTime: '17:45',
    durationMinutes: 45,
    priority: 'medium',
    status: 'scheduled',
  },
  {
    id: 'sess-3',
    subjectId: 'sub-bio',
    topic: 'مراجعة الأحياء: الفصل الثاني علم الوراثة',
    date: getDateOffset(0),
    startTime: '18:15',
    endTime: '18:45',
    durationMinutes: 30,
    priority: 'high',
    status: 'scheduled',
  },
  {
    id: 'sess-4',
    subjectId: 'sub-chem',
    topic: 'مسائل الكيمياء: قوانين الديناميكا الحرارية',
    date: getDateOffset(1),
    startTime: '15:00',
    endTime: '16:00',
    durationMinutes: 60,
    priority: 'urgent',
    status: 'scheduled',
  },
  {
    id: 'sess-5',
    subjectId: 'sub-math',
    topic: 'تدريبات على التكامل المحدود',
    date: getDateOffset(-1),
    startTime: '14:00',
    endTime: '15:00',
    durationMinutes: 60,
    priority: 'medium',
    status: 'completed',
    actualDurationMinutes: 55,
  },
  {
    id: 'sess-6',
    subjectId: 'sub-chem',
    topic: 'آليات التفاعلات العضوية الأساسية',
    date: getDateOffset(-1),
    startTime: '16:30',
    endTime: '17:30',
    durationMinutes: 60,
    priority: 'high',
    status: 'completed',
    actualDurationMinutes: 60,
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-chem',
    subjectId: 'sub-chem',
    title: 'امتحان منتصف الفصل: الكيمياء الفيزيائية والعضوية',
    date: getDateOffset(3),
    time: '09:00',
    location: 'مبنى العلوم · مدرج ب-104',
    durationMinutes: 90,
    targetGrade: 'ممتاز (A)',
    syllabusTopics: [
      { id: 'et-1', name: 'تسمية المركبات العضوية', completed: true },
      { id: 'et-2', name: 'الديناميكا الحرارية الكيميائية', completed: false },
      { id: 'et-3', name: 'سرعة التفاعلات والعوامل الحفازة', completed: false },
      { id: 'et-4', name: 'اتزان الأحماض والقواعد', completed: true },
    ],
    mockTests: [
      { id: 'mt-1', name: 'اختبار تجريبي 1 (أسئلة 2025)', score: 78, maxScore: 100, date: getDateOffset(-4) },
      { id: 'mt-2', name: 'اختبار قصير: سرعة التفاعلات', score: 88, maxScore: 100, date: getDateOffset(-2) },
    ],
  },
  {
    id: 'exam-math',
    subjectId: 'sub-math',
    title: 'التقييم الفصلي: التفاضل والتكامل المتقدم',
    date: getDateOffset(7),
    time: '13:30',
    location: 'القاعة الكبرى · الصف ج',
    durationMinutes: 120,
    targetGrade: 'ممتاز مرتفع (A+)',
    syllabusTopics: [
      { id: 'et-m1', name: 'التفاضل متعدد المتغيرات', completed: true },
      { id: 'et-m2', name: 'التكامل المتعدد والمجالات المتجهة', completed: false },
      { id: 'et-m3', name: 'المعادلات التفاضلية العادية', completed: false },
      { id: 'et-m4', name: 'نظريات غرين وستوكس', completed: false },
    ],
    mockTests: [
      { id: 'mt-m1', name: 'امتحان تشخيصي نصفي', score: 82, maxScore: 100, date: getDateOffset(-6) },
    ],
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    subjectId: 'sub-german',
    title: 'مراجعة بطاقات مفردات اللغة الألمانية',
    deadline: getDateOffset(0),
    priority: 'high',
    estimatedMinutes: 30,
    completed: true,
    notes: 'تغطية أفعال وصفات الوحدة الرابعة',
  },
  {
    id: 'task-2',
    subjectId: 'sub-math',
    title: 'حل مسائل الرياضيات من 14 إلى 28',
    deadline: getDateOffset(0),
    priority: 'medium',
    estimatedMinutes: 45,
    completed: false,
    notes: 'الكتاب المدرسي صفحة 142',
  },
  {
    id: 'task-3',
    subjectId: 'sub-bio',
    title: 'مراجعة ملخص الفصل الثاني في الأحياء',
    deadline: getDateOffset(1),
    priority: 'high',
    estimatedMinutes: 30,
    completed: false,
  },
  {
    id: 'task-4',
    subjectId: 'sub-chem',
    title: 'إنهاء التقرير المعملي لمادة الكيمياء',
    deadline: getDateOffset(2),
    priority: 'urgent',
    estimatedMinutes: 60,
    completed: false,
  },
  {
    id: 'task-5',
    subjectId: 'sub-german',
    title: 'الاستماع لتسجيل المحادثة الألمانية والبودكاست',
    deadline: getDateOffset(0),
    priority: 'low',
    estimatedMinutes: 20,
    completed: true,
  },
  {
    id: 'task-6',
    subjectId: 'sub-math',
    title: 'تسليم ورقة واجب الجبر الخطي رقم 3',
    deadline: getDateOffset(-1),
    priority: 'high',
    estimatedMinutes: 40,
    completed: true,
  },
];

export const INITIAL_LOGS: StudyLog[] = [
  {
    id: 'log-1',
    date: getDateOffset(-4),
    subjectId: 'sub-math',
    topic: 'تطبيقات التكامل المحدود',
    durationMinutes: 90,
    timestamp: Date.now() - 4 * 86400000,
  },
  {
    id: 'log-2',
    date: getDateOffset(-3),
    subjectId: 'sub-chem',
    topic: 'تسمية وتفاعلات المركبات العضوية',
    durationMinutes: 120,
    timestamp: Date.now() - 3 * 86400000,
  },
  {
    id: 'log-3',
    date: getDateOffset(-2),
    subjectId: 'sub-german',
    topic: 'تدريب مكثف على المفردات الألمانية',
    durationMinutes: 45,
    timestamp: Date.now() - 2 * 86400000,
  },
  {
    id: 'log-4',
    date: getDateOffset(-1),
    subjectId: 'sub-math',
    topic: 'مراجعة الجبر الخطي والمصفوفات',
    durationMinutes: 75,
    timestamp: Date.now() - 1 * 86400000,
  },
  {
    id: 'log-5',
    date: getDateOffset(0),
    subjectId: 'sub-german',
    topic: 'مفردات الألمانية الوحدة الرابعة',
    durationMinutes: 30,
    timestamp: Date.now() - 2 * 3600000,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'exam',
    title: 'موعد الامتحان بعد 3 أيام',
    message: 'امتحان الكيمياء النصفي في تاريخ ' + getDateOffset(3) + '. هناك فصلان في المنهج لم تتم مراجعتهما بعد.',
    timestamp: 'منذ 10 دقائق',
    read: false,
    relatedId: 'exam-chem',
    actionLabel: 'عرض خطة الامتحان',
  },
  {
    id: 'notif-2',
    type: 'session',
    title: 'تنبيه جلسة دراسة قادمة',
    message: 'جلسة تمارين الرياضيات تبدأ الساعة 5:00 مساءً (المدة: 45 دقيقة).',
    timestamp: 'منذ 45 دقيقة',
    read: false,
    relatedId: 'sess-2',
    actionLabel: 'بدء الجلسة الآن',
  },
  {
    id: 'notif-3',
    type: 'suggestion',
    title: 'توصية ذكية لاستغلال الوقت',
    message: 'لديك متسع دراسي قدره 45 دقيقة قبل المساء. ننصح بمراجعة الفصل الثاني في مادة الأحياء.',
    timestamp: 'منذ ساعتين',
    read: true,
  },
];

// LocalStorage helpers
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export function getLastSyncTime(): string {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || new Date().toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export function exportAllData(): string {
  const payload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profile: loadFromStorage(STORAGE_KEYS.PROFILE, INITIAL_PROFILE),
    subjects: loadFromStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS),
    sessions: loadFromStorage(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS),
    exams: loadFromStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAMS),
    tasks: loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS),
    logs: loadFromStorage(STORAGE_KEYS.LOGS, INITIAL_LOGS),
  };
  return JSON.stringify(payload, null, 2);
}

export function importAllData(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.profile) saveToStorage(STORAGE_KEYS.PROFILE, parsed.profile);
    if (parsed.subjects) saveToStorage(STORAGE_KEYS.SUBJECTS, parsed.subjects);
    if (parsed.sessions) saveToStorage(STORAGE_KEYS.SESSIONS, parsed.sessions);
    if (parsed.exams) saveToStorage(STORAGE_KEYS.EXAMS, parsed.exams);
    if (parsed.tasks) saveToStorage(STORAGE_KEYS.TASKS, parsed.tasks);
    if (parsed.logs) saveToStorage(STORAGE_KEYS.LOGS, parsed.logs);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(INITIAL_PROFILE));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(INITIAL_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(INITIAL_EXAMS));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
}

export const SAVED_ACCOUNTS_KEY = 'studymore_saved_accounts';

export function getSavedAccounts(): import('../types').SavedAccount[] {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (!raw) {
      return [
        {
          id: 'acc-1',
          name: 'أحمد علي',
          email: 'ahmed.ali@study.edu',
          educationLevel: 'university',
          lastLogin: new Date().toISOString(),
          themeColor: 'blue',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAccount(account: import('../types').SavedAccount): void {
  try {
    const current = getSavedAccounts();
    const existingIndex = current.findIndex((a) => a.id === account.id || a.email === account.email);
    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...account, lastLogin: new Date().toISOString() };
    } else {
      updated = [account, ...current];
    }
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving account:', err);
  }
}
