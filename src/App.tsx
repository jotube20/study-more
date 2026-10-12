import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Subject,
  StudySession,
  Exam,
  Task,
  StudyLog,
  NotificationItem,
  ViewTab,
} from './types';
import {
  loadFromStorage,
  saveToStorage,
  getLastSyncTime,
  resetToDemoData,
  INITIAL_PROFILE,
  INITIAL_SUBJECTS,
  INITIAL_SESSIONS,
  INITIAL_EXAMS,
  INITIAL_TASKS,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
} from './utils/storage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { HomeDashboard } from './components/HomeDashboard';
import { PlannerView } from './components/PlannerView';
import { SubjectsView } from './components/SubjectsView';
import { ExamsTasksView } from './components/ExamsTasksView';
import { FocusModeView } from './components/FocusModeView';
import { ProgressAnalyticsView } from './components/ProgressAnalyticsView';
import { SettingsView } from './components/SettingsView';
import { NewSessionModal } from './components/NewSessionModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SmartVoiceAssistant } from './components/SmartVoiceAssistant';
import { AuthModal } from './components/AuthModal';
import { StudentGuideModal } from './components/StudentGuideModal';
import { MotivationalCheerToast } from './components/MotivationalCheerToast';
import { Recommendation, minutesToTimeStr, timeToMinutes } from './utils/scheduler';
import { playTaskAlertChime, playVictoryChime } from './utils/audioSynth';
import { getRandomTaskCheer, getStreakCheer } from './utils/motivationalCheers';
import { AppThemeColor, MotivationalCheer } from './types';

export default function App() {
  // Global persistent states (default to Arabic per request)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = loadFromStorage('studyflow_user_profile', INITIAL_PROFILE);
    return {
      ...INITIAL_PROFILE,
      ...loaded,
      language: loaded.language || 'ar',
      name: loaded.name === 'Alex Morgan' ? 'أحمد علي' : loaded.name || 'أحمد علي',
      themeColor: loaded.themeColor || 'blue',
      colorMode: loaded.colorMode || 'light',
      isLoggedIn: loaded.isLoggedIn ?? true,
      soundEffectsEnabled: loaded.soundEffectsEnabled ?? true,
    };
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const loaded = loadFromStorage('studyflow_subjects', INITIAL_SUBJECTS);
    // If user has old English default subjects, upgrade to Arabic initial subjects
    if (loaded.length > 0 && loaded[0].name === 'German Language') {
      return INITIAL_SUBJECTS;
    }
    return loaded;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const loaded = loadFromStorage('studyflow_sessions', INITIAL_SESSIONS);
    if (loaded.length > 0 && loaded[0].topic.includes('German Vocabulary')) {
      return INITIAL_SESSIONS;
    }
    return loaded;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const loaded = loadFromStorage('studyflow_exams', INITIAL_EXAMS);
    if (loaded.length > 0 && loaded[0].title.includes('Midterm Exam:')) {
      return INITIAL_EXAMS;
    }
    return loaded;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const loaded = loadFromStorage('studyflow_tasks', INITIAL_TASKS);
    if (loaded.length > 0 && loaded[0].title.includes('Review German')) {
      return INITIAL_TASKS;
    }
    return loaded;
  });

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() =>
    loadFromStorage('studyflow_study_logs', INITIAL_LOGS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const loaded = loadFromStorage('studyflow_notifications', INITIAL_NOTIFICATIONS);
    if (loaded.length > 0 && loaded[0].title.includes('Exam in 3 Days')) {
      return INITIAL_NOTIFICATIONS;
    }
    return loaded;
  });

  // App UI state
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [newSessionSeed, setNewSessionSeed] = useState<{
    subjectId?: string;
    topic?: string;
    duration?: number;
  }>({});
  const [activeFocusSession, setActiveFocusSession] = useState<StudySession | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStudentGuideOpen, setIsStudentGuideOpen] = useState(false);
  const [cheer, setCheer] = useState<MotivationalCheer | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>(getLastSyncTime);

  // Sync state to LocalStorage
  useEffect(() => {
    saveToStorage('studyflow_user_profile', profile);
    setLastSyncTime(new Date().toISOString());
  }, [profile]);

  useEffect(() => {
    saveToStorage('studyflow_subjects', subjects);
    setLastSyncTime(new Date().toISOString());
  }, [subjects]);

  useEffect(() => {
    saveToStorage('studyflow_sessions', sessions);
    setLastSyncTime(new Date().toISOString());
  }, [sessions]);

  useEffect(() => {
    saveToStorage('studyflow_exams', exams);
    setLastSyncTime(new Date().toISOString());
  }, [exams]);

  useEffect(() => {
    saveToStorage('studyflow_tasks', tasks);
    setLastSyncTime(new Date().toISOString());
  }, [tasks]);

  useEffect(() => {
    saveToStorage('studyflow_study_logs', studyLogs);
    setLastSyncTime(new Date().toISOString());
  }, [studyLogs]);

  useEffect(() => {
    saveToStorage('studyflow_notifications', notifications);
  }, [notifications]);

  // Dark Mode class on document
  useEffect(() => {
    if (profile.colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.colorMode]);

  // RTL handling for Arabic and Egyptian Arabic
  useEffect(() => {
    const isRtl = profile.language === 'ar' || profile.language === 'eg';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = profile.language;
  }, [profile.language]);

  // Session Handlers
  const handleToggleSessionStatus = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const nextStatus = s.status === 'completed' ? 'scheduled' : 'completed';
          return {
            ...s,
            status: nextStatus,
            actualDurationMinutes: nextStatus === 'completed' ? s.durationMinutes : undefined,
          };
        }
        return s;
      })
    );
  };

  const handleStartFocusSession = (session: StudySession) => {
    setActiveFocusSession(session);
    setCurrentTab('focus');
  };

  const handleFinishFocusSession = (
    session: StudySession,
    actualDurationMinutes: number,
    notes: string
  ) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id
          ? {
              ...s,
              status: 'completed',
              actualDurationMinutes,
              notes,
            }
          : s
      )
    );

    const newLog: StudyLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      subjectId: session.subjectId,
      topic: session.topic,
      durationMinutes: actualDurationMinutes,
      timestamp: Date.now(),
      notes,
    };
    setStudyLogs((prev) => [newLog, ...prev]);

    setActiveFocusSession(null);
    setCurrentTab('home');
  };

  const handleRescheduleSession = (sessionId: string, newDate: string, newStartTime: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const startMins = timeToMinutes(newStartTime);
          const endMins = startMins + s.durationMinutes;
          return {
            ...s,
            date: newDate,
            startTime: newStartTime,
            endTime: minutesToTimeStr(endMins),
            status: 'scheduled',
          };
        }
        return s;
      })
    );
  };

  const handleSaveNewSession = (newSess: Partial<StudySession>) => {
    const session: StudySession = {
      id: `sess-${Date.now()}`,
      subjectId: newSess.subjectId || subjects[0]?.id || '',
      topic: newSess.topic || (profile.language === 'ar' ? 'جلسة مذاكرة جديدة' : 'New Study Session'),
      date: newSess.date || new Date().toISOString().split('T')[0],
      startTime: newSess.startTime || '16:00',
      endTime: newSess.endTime || '16:45',
      durationMinutes: newSess.durationMinutes || 45,
      priority: newSess.priority || 'medium',
      status: 'scheduled',
      notes: newSess.notes,
      recurring: newSess.recurring,
    };
    setSessions((prev) => [...prev, session]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Task Handlers
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            if (profile.soundEffectsEnabled !== false) {
              playVictoryChime();
            }
            const randomCheer = getRandomTaskCheer(profile.language);
            setCheer(randomCheer);
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleToggleColorMode = () => {
    setProfile((prev) => ({
      ...prev,
      colorMode: prev.colorMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleSelectThemeColor = (color: AppThemeColor) => {
    setProfile((prev) => ({
      ...prev,
      themeColor: color,
    }));
  };

  const handleLogin = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updated,
      isLoggedIn: true,
    }));
  };

  const handleLogout = () => {
    setProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const handleQuickAddTask = (title: string, subjectId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      subjectId,
      title,
      deadline: new Date().toISOString().split('T')[0],
      priority: 'high',
      estimatedMinutes: 30,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: `task-${Date.now()}`,
      subjectId: newTask.subjectId || subjects[0]?.id || '',
      title: newTask.title || (profile.language === 'ar' ? 'مهمة دراسية' : 'Untitled Task'),
      deadline: newTask.deadline || new Date().toISOString().split('T')[0],
      priority: newTask.priority || 'medium',
      estimatedMinutes: newTask.estimatedMinutes || 30,
      completed: false,
      notes: newTask.notes,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Subject Handlers
  const handleAddSubject = (newSub: Partial<Subject>) => {
    const sub: Subject = {
      id: `sub-${Date.now()}`,
      name: newSub.name || (profile.language === 'ar' ? 'مادة جديدة' : 'New Subject'),
      code: newSub.code || (profile.language === 'ar' ? 'مادة-101' : 'SUB-101'),
      color: newSub.color || '#2563EB',
      targetWeeklyHours: newSub.targetWeeklyHours || 4,
      topics: newSub.topics || [],
    };
    setSubjects((prev) => [...prev, sub]);
  };

  const handleUpdateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  // Exam Handlers
  const handleAddExam = (newExam: Partial<Exam>) => {
    const exam: Exam = {
      id: `exam-${Date.now()}`,
      subjectId: newExam.subjectId || subjects[0]?.id || '',
      title: newExam.title || (profile.language === 'ar' ? 'امتحان جديد' : 'New Assessment'),
      date: newExam.date || new Date().toISOString().split('T')[0],
      time: newExam.time || '09:00',
      location: newExam.location || (profile.language === 'ar' ? 'قاعة الامتحان' : 'Exam Hall'),
      durationMinutes: newExam.durationMinutes || 90,
      syllabusTopics: newExam.syllabusTopics || [],
      mockTests: [],
      targetGrade: newExam.targetGrade || 'A',
    };
    setExams((prev) => [...prev, exam]);
  };

  const handleUpdateExam = (updated: Exam) => {
    setExams((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  // Notification Handlers
  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Recommendation 1-click execution
  const handleApplyRecommendation = (rec: Recommendation) => {
    if (rec.actionType === 'start_focus') {
      const match = sessions.find((s) => s.status === 'scheduled');
      if (match) {
        handleStartFocusSession(match);
      } else {
        setCurrentTab('focus');
      }
    } else if (rec.actionType === 'schedule_session' || rec.actionType === 'reschedule_session') {
      setNewSessionSeed({
        subjectId: rec.subjectId,
        topic: rec.topic,
        duration: rec.suggestedDuration || 45,
      });
      setIsNewSessionModalOpen(true);
    } else if (rec.actionType === 'view_exam') {
      setCurrentTab('exams');
    }
  };

  // Voice Assistant and Alert handlers
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [activeAlertToast, setActiveAlertToast] = useState<{
    id: string;
    title: string;
    message: string;
  } | null>(null);

  const handleToggleTaskAlert = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextAlert = !t.hasAlert;
          if (nextAlert) {
            playTaskAlertChime();
            const newNotif: NotificationItem = {
              id: `notif-${Date.now()}`,
              type: 'deadline',
              title: `🔔 تم تفعيل التنبيه للمهمة: ${t.title}`,
              message: `سيتم إشعارك صوتياً عند حلول موعد المهمة اليوم.`,
              timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
              read: false,
            };
            setNotifications((n) => [newNotif, ...n]);
            setActiveAlertToast({
              id: `toast-${Date.now()}`,
              title: 'تم تفعيل التنبيه بنجاح 🔔',
              message: `منبه مجدول للمهمة: "${t.title}"`,
            });
            setTimeout(() => setActiveAlertToast(null), 4000);
          }
          return { ...t, hasAlert: nextAlert };
        }
        return t;
      })
    );
  };

  const handleToggleSessionAlert = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const nextAlert = !s.hasAlert;
          if (nextAlert) {
            playTaskAlertChime();
            setActiveAlertToast({
              id: `toast-${Date.now()}`,
              title: 'تم تفعيل منبه الجلسة 🔔',
              message: `سيتم تنبيهك قبل موعد: "${s.topic}"`,
            });
            setTimeout(() => setActiveAlertToast(null), 4000);
          }
          return { ...s, hasAlert: nextAlert };
        }
        return s;
      })
    );
  };

  const handleVoiceAddSession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleVoiceAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleResetDemoData = () => {
    const confirmMsg =
      profile.language === 'ar'
        ? 'هل أنت متأكد من رغبتك في إعادة تعيين جميع بيانات الجدول والامتحانات للوضع الافتراضي؟'
        : 'Reset all schedule data to default demo state?';

    if (window.confirm(confirmMsg)) {
      resetToDemoData();
      setProfile(INITIAL_PROFILE);
      setSubjects(INITIAL_SUBJECTS);
      setSessions(INITIAL_SESSIONS);
      setExams(INITIAL_EXAMS);
      setTasks(INITIAL_TASKS);
      setStudyLogs(INITIAL_LOGS);
      setNotifications(INITIAL_NOTIFICATIONS);
      setLastSyncTime(new Date().toISOString());
      setCurrentTab('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative transition-colors">
      {/* Active Alert Toast Notification */}
      {activeAlertToast && (
        <div className="fixed top-4 start-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
            🔔
          </div>
          <div className="text-xs">
            <div className="font-bold text-amber-300">{activeAlertToast.title}</div>
            <div className="text-slate-300 mt-0.5">{activeAlertToast.message}</div>
          </div>
          <button
            onClick={() => setActiveAlertToast(null)}
            className="text-slate-400 hover:text-white ms-2 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        profile={profile}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onOpenNewSessionModal={() => {
          setNewSessionSeed({});
          setIsNewSessionModalOpen(true);
        }}
        onChangeTab={setCurrentTab}
        lastSyncTime={lastSyncTime}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenStudentGuide={() => setIsStudentGuideOpen(true)}
        onToggleColorMode={handleToggleColorMode}
        onSelectThemeColor={handleSelectThemeColor}
        onLogout={handleLogout}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onChangeTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          profile={profile}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenStudentGuide={() => setIsStudentGuideOpen(true)}
          onToggleColorMode={handleToggleColorMode}
          onLogout={handleLogout}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeDashboard
              profile={profile}
              subjects={subjects}
              sessions={sessions}
              exams={exams}
              tasks={tasks}
              onChangeTab={setCurrentTab}
              onToggleSessionStatus={handleToggleSessionStatus}
              onToggleTaskStatus={handleToggleTaskStatus}
              onStartFocusSession={handleStartFocusSession}
              onOpenNewSessionModal={() => {
                setNewSessionSeed({});
                setIsNewSessionModalOpen(true);
              }}
              onQuickAddTask={handleQuickAddTask}
              onApplyRecommendation={handleApplyRecommendation}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
              onOpenStudentGuide={() => setIsStudentGuideOpen(true)}
            />
          )}

          {currentTab === 'planner' && (
            <PlannerView
              profile={profile}
              subjects={subjects}
              sessions={sessions}
              tasks={tasks}
              onAddSession={() => {
                setNewSessionSeed({});
                setIsNewSessionModalOpen(true);
              }}
              onEditSession={() => {}}
              onDeleteSession={handleDeleteSession}
              onToggleSessionStatus={handleToggleSessionStatus}
              onStartFocusSession={handleStartFocusSession}
              onRescheduleSession={handleRescheduleSession}
              onToggleTaskAlert={handleToggleTaskAlert}
              onToggleSessionAlert={handleToggleSessionAlert}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectsView
              profile={profile}
              subjects={subjects}
              studyLogs={studyLogs}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
            />
          )}

          {currentTab === 'exams' && (
            <ExamsTasksView
              profile={profile}
              exams={exams}
              tasks={tasks}
              subjects={subjects}
              onAddExam={handleAddExam}
              onUpdateExam={handleUpdateExam}
              onDeleteExam={handleDeleteExam}
              onAddTask={handleAddTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'focus' && (
            <FocusModeView
              profile={profile}
              activeSession={
                activeFocusSession ||
                sessions.find((s) => s.status === 'scheduled') ||
                sessions[0] ||
                null
              }
              subjects={subjects}
              onFinishSession={handleFinishFocusSession}
              onExitFocus={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'analytics' && (
            <ProgressAnalyticsView
              profile={profile}
              subjects={subjects}
              studyLogs={studyLogs}
              exams={exams}
              tasks={tasks}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={setProfile}
              onResetData={handleResetDemoData}
              lastSyncTime={lastSyncTime}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        profile={profile}
      />

      {/* New Study Session Modal */}
      <NewSessionModal
        profile={profile}
        isOpen={isNewSessionModalOpen}
        onClose={() => setIsNewSessionModalOpen(false)}
        subjects={subjects}
        sessions={sessions}
        onSaveSession={handleSaveNewSession}
        initialSubjectId={newSessionSeed.subjectId}
        initialTopic={newSessionSeed.topic}
        initialDuration={newSessionSeed.duration}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={(updated) => {
          setProfile((p) => ({ ...p, ...updated }));
          setIsOnboardingOpen(false);
        }}
        profile={profile}
      />

      {/* Smart Voice Assistant Modal */}
      <SmartVoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        subjects={subjects}
        sessions={sessions}
        exams={exams}
        tasks={tasks}
        profile={profile}
        onAddSession={handleVoiceAddSession}
        onAddTask={handleVoiceAddTask}
        onChangeTab={setCurrentTab}
      />

      {/* Student Auth Modal (Login / Register new student) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        profile={profile}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Student Study Guide & Step-by-Step Walkthrough Modal */}
      <StudentGuideModal
        isOpen={isStudentGuideOpen}
        onClose={() => setIsStudentGuideOpen(false)}
        profile={profile}
        onChangeTab={setCurrentTab}
        onOpenNewSessionModal={() => {
          setNewSessionSeed({});
          setIsNewSessionModalOpen(true);
        }}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
      />

      {/* Motivational Cheer Toast for Task Completion & Streaks */}
      <MotivationalCheerToast
        cheer={cheer}
        onClose={() => setCheer(null)}
      />
    </div>
  );
}
