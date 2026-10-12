import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Play,
  Plus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Check,
  RotateCcw,
  BookOpen,
  ChevronRight,
  ListTodo,
  Mic,
  RefreshCw,
  Volume2,
  Brain,
  Quote,
} from 'lucide-react';
import { StudySession, Subject, Exam, Task, UserProfile, ViewTab } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatDuration, formatTime12h, generateSmartRecommendations, Recommendation } from '../utils/scheduler';
import { getDailyQuote, getRandomQuote } from '../utils/dailyQuotes';
import { getThemeConfig } from '../utils/theme';

interface HomeDashboardProps {
  profile: UserProfile;
  subjects: Subject[];
  sessions: StudySession[];
  exams: Exam[];
  tasks: Task[];
  onChangeTab: (tab: ViewTab) => void;
  onToggleSessionStatus: (sessionId: string) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onStartFocusSession: (session: StudySession) => void;
  onOpenNewSessionModal: () => void;
  onQuickAddTask: (title: string, subjectId: string) => void;
  onApplyRecommendation: (rec: Recommendation) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenStudentGuide?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  subjects,
  sessions,
  exams,
  tasks,
  onChangeTab,
  onToggleSessionStatus,
  onToggleTaskStatus,
  onStartFocusSession,
  onOpenNewSessionModal,
  onQuickAddTask,
  onApplyRecommendation,
  onOpenVoiceAssistant,
  onOpenStudentGuide,
}) => {
  const [quickTaskText, setQuickTaskText] = useState('');
  const [quickTaskSubjectId, setQuickTaskSubjectId] = useState(subjects[0]?.id || '');
  const [showQuickTaskInput, setShowQuickTaskInput] = useState(false);
  const [isSpeakingQuote, setIsSpeakingQuote] = useState(false);

  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;
  const theme = getThemeConfig(profile.themeColor);
  const todayStr = new Date().toISOString().split('T')[0];
  const [dailyQuote, setDailyQuote] = useState(() => getDailyQuote(todayStr));

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;

  // Filter today's sessions
  const todaysSessions = sessions.filter((s) => s.date === todayStr);

  // Calculated metrics
  const totalPlannedTodayMinutes = todaysSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalLoggedTodayMinutes = todaysSessions
    .filter((s) => s.status === 'completed')
    .reduce((acc, s) => acc + (s.actualDurationMinutes || s.durationMinutes), 0);

  const todaysTasks = tasks.filter((task) => task.deadline === todayStr);
  const completedTodayTasks = todaysTasks.filter((task) => task.completed).length;

  // Next 7 days upcoming exams
  const upcomingExams7Days = exams.filter((e) => {
    const diff = (new Date(e.date).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 7;
  });

  // Smart recommendations
  const recommendations = generateSmartRecommendations(
    exams,
    sessions,
    tasks,
    subjects,
    profile.dailyGoalHours,
    profile.language
  );

  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;
    onQuickAddTask(quickTaskText.trim(), quickTaskSubjectId || subjects[0]?.id || '');
    setQuickTaskText('');
    setShowQuickTaskInput(false);
  };

  const getSubjectById = (id: string) => subjects.find((s) => s.id === id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>
              {new Date().toLocaleDateString(isAr ? 'ar-EG' : undefined, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
              {t.academicTermBadge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting} {profile.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">{t.greetingSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenStudentGuide && (
            <button
              onClick={onOpenStudentGuide}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors flex items-center gap-1.5"
              title={isEg ? 'شرح مفصل للطالب' : isAr ? 'دليل الطالب الأكاديمي' : 'Student Guide'}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.studentGuideBtn}</span>
            </button>
          )}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className={`relative px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r ${theme.gradientClass} text-white hover:opacity-95 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 group cursor-pointer`}
              title="تحدث مع المساعد الصوتي الذكي"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-200"></span>
              </span>
              <Mic className="w-3.5 h-3.5" />
              <span>{isEg ? 'المساعد الصوتي الذكي 🎙️' : 'المساعد الصوتي الذكي'}</span>
            </button>
          )}
          <button
            onClick={() => onChangeTab('planner')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors whitespace-nowrap"
          >
            {t.openPlannerBtn}
          </button>
          <button
            onClick={onOpenNewSessionModal}
            className={`px-4 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all whitespace-nowrap ${theme.buttonClass}`}
          >
            {t.newSessionBtn}
          </button>
        </div>
      </section>

      {/* 1.5. Daily Inspirational Quote & Scientific Brain Fact */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-indigo-950/20 border border-slate-800 relative overflow-hidden">
        {/* Glow backdrop decorative accent */}
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-blue-500/0 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-10 -ms-10 w-48 h-48 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          {/* Quote Portion */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                ✨ مقتبس وحكمة اليوم · {dailyQuote.category}
              </span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs text-slate-400 font-medium">جرعة تحفيز يومية</span>
            </div>

            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 opacity-80" />
              <div>
                <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed font-sans">
                  "{dailyQuote.quote}"
                </p>
                <p className="text-xs text-teal-300 font-semibold mt-1">
                  — {dailyQuote.author}
                </p>
              </div>
            </div>

            {/* Scientific Fact Box */}
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-xs space-y-1.5 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>معلومة علمية مثبتة لتعزيز الذاكرة والتعلم:</span>
              </div>
              <p className="text-slate-300 leading-relaxed ps-6">
                {dailyQuote.scientificFact}
              </p>
              <div className="text-[11px] text-slate-400 ps-6 font-mono">
                المصدر الأكاديمي: {dailyQuote.scientificSource}
              </div>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end gap-2.5 shrink-0 pt-1">
            <button
              onClick={() => {
                if (!('speechSynthesis' in window)) return;
                if (isSpeakingQuote) {
                  window.speechSynthesis.cancel();
                  setIsSpeakingQuote(false);
                  return;
                }
                window.speechSynthesis.cancel();
                const textToRead = `${dailyQuote.quote}، بقلم: ${dailyQuote.author}. معلومة علمية: ${dailyQuote.scientificFact}`;
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.lang = 'ar-SA';
                const voices = window.speechSynthesis.getVoices();
                const arVoice = voices.find((v) => v.lang.startsWith('ar'));
                if (arVoice) utterance.voice = arVoice;
                utterance.onend = () => setIsSpeakingQuote(false);
                utterance.onerror = () => setIsSpeakingQuote(false);
                setIsSpeakingQuote(true);
                window.speechSynthesis.speak(utterance);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isSpeakingQuote
                  ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title={isSpeakingQuote ? 'إيقاف القراءة الصوتية' : 'استماع صوتي للمقتبس والمعلومة'}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeakingQuote ? 'جاري الاستماع...' : 'استماع صوتي'}</span>
            </button>

            <button
              onClick={() => {
                if (isSpeakingQuote && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsSpeakingQuote(false);
                }
                setDailyQuote(getRandomQuote(dailyQuote.id));
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="عرض مقتبس ومعلومة جديدة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>حكمة أخرى</span>
            </button>

            {onOpenVoiceAssistant && (
              <button
                onClick={onOpenVoiceAssistant}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 transition-colors flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5 text-teal-300" />
                <span>سؤال المساعد 🎙️</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Daily Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Time Planned */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{t.studyTimePlanned}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {formatDuration(totalPlannedTodayMinutes || 150, profile.language)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{t.plannedToday}</span>
            <span className="font-mono tabular-nums text-slate-700">
              {formatDuration(totalLoggedTodayMinutes, profile.language)} {t.loggedTime}
            </span>
          </div>
        </div>

        {/* Card 2: Tasks Completed */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{t.tasksCompleted}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {todaysTasks.length > 0
              ? `${completedTodayTasks} / ${todaysTasks.length}`
              : '3 / 5'}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{t.dailyChecklist}</span>
            <span className="font-mono tabular-nums text-teal-700 font-medium">
              {todaysTasks.length > 0
                ? `${Math.round((completedTodayTasks / todaysTasks.length) * 100)}%`
                : '60%'}
            </span>
          </div>
        </div>

        {/* Card 3: Upcoming Exams */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{t.upcomingExams}</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            {upcomingExams7Days.length}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{t.next7Days}</span>
            <button
              onClick={() => onChangeTab('exams')}
              className="text-blue-600 hover:text-blue-700 font-medium text-xs inline-flex items-center gap-1"
            >
              <span>{t.viewAll}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Card 4: Weekly Goal */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
            <span>{t.weeklyGoal}</span>
            <span className="text-sm">🔥</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 tracking-tight">
            70%
          </div>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: '70%' }} />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-400 flex justify-between font-mono tabular-nums">
            <span>{isAr ? '14 ساعة منجزة' : '14h completed'}</span>
            <span>{isAr ? '20 ساعة كهدف' : '20h goal'}</span>
          </div>
        </div>
      </section>

      {/* 3. Main Grid: Today's Schedule + Upcoming Deadlines & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Today's Study Schedule & Tasks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Study Schedule */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {t.todaysSchedule}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'الفترات الزمنية المنظمة وترتيب الأولويات' : 'Structured time slots and priority sequence'}
                </p>
              </div>
              <button
                onClick={onOpenNewSessionModal}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isAr ? '+ إضافة جلسة' : '+ Add Session'}
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {todaysSessions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  {t.noSessionsToday}
                  <div className="mt-2">
                    <button
                      onClick={onOpenNewSessionModal}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      {t.planFirstSession}
                    </button>
                  </div>
                </div>
              ) : (
                todaysSessions.map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const isCompleted = session.status === 'completed';

                  // Priority badge text & color
                  let priorityLabel = t.priorityMedium;
                  let priorityColor = 'text-blue-700 bg-blue-50 border-blue-200';
                  if (session.priority === 'urgent') {
                    priorityLabel = t.priorityUrgent;
                    priorityColor = 'text-red-700 bg-red-50 border-red-200';
                  } else if (session.priority === 'high') {
                    priorityLabel = t.priorityHigh;
                    priorityColor = 'text-amber-700 bg-amber-50 border-amber-200';
                  } else if (session.priority === 'low') {
                    priorityLabel = t.priorityLow;
                    priorityColor = 'text-slate-600 bg-slate-50 border-slate-200';
                  }

                  return (
                    <div
                      key={session.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors hover:bg-slate-50/50 rounded-lg px-2"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleSessionStatus(session.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                            isCompleted
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'border-slate-300 hover:border-blue-600 bg-white'
                          }`}
                          title={isCompleted ? (isAr ? 'تحديد كغير مكتملة' : 'Mark as incomplete') : (isAr ? 'تحديد كمكتملة' : 'Mark as complete')}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: subject?.color || '#2563EB' }}
                            />
                            <h3
                              className={`text-sm font-semibold text-slate-900 ${
                                isCompleted ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {session.topic}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">{subject?.name}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {formatTime12h(session.startTime, profile.language)} – {formatTime12h(session.endTime, profile.language)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums">
                              {session.durationMinutes} {isAr ? 'دقيقة' : 'm'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center ms-8 sm:ms-0">
                        <span
                          className={`text-[11px] font-medium px-2 py-0.5 rounded border ${priorityColor}`}
                        >
                          {priorityLabel}
                        </span>

                        {!isCompleted ? (
                          <button
                            onClick={() => onStartFocusSession(session)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{t.startSessionBtn}</span>
                          </button>
                        ) : (
                          <span className="text-xs text-teal-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isAr ? 'مكتملة' : 'Completed'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Concept Prototype & Today's Study Plan Tasks */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  {t.taskChecklistTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowQuickTaskInput(!showQuickTaskInput)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.quickAddTask}</span>
              </button>
            </div>

            {showQuickTaskInput && (
              <form onSubmit={handleCreateQuickTask} className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <input
                  type="text"
                  placeholder={isAr ? 'عنوان المهمة (مثال: مراجعة ملخص الفصل الثاني)...' : 'Task title (e.g. Revise biology chapter 2)...'}
                  value={quickTaskText}
                  onChange={(e) => setQuickTaskText(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={quickTaskSubjectId}
                    onChange={(e) => setQuickTaskSubjectId(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-white rounded-md border border-slate-200 text-slate-700"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQuickTaskInput(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {isAr ? 'إضافة المهمة' : 'Add Task'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-2 mt-3">
              {tasks.slice(0, 5).map((task) => {
                const subject = getSubjectById(task.subjectId);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-100 text-slate-400'
                        : 'bg-white border-slate-200/70 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleTaskStatus(task.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300 bg-white hover:border-blue-600'
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3" />}
                      </button>
                      <div>
                        <div
                          className={`text-xs font-medium ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span className="font-medium" style={{ color: subject?.color || '#475569' }}>
                            {subject?.name}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {task.estimatedMinutes} {isAr ? 'دقيقة مقدرة' : 'minutes'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTaskStatus(task.id)}
                      className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                        task.completed
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {task.completed ? (isAr ? 'تم الإنجاز' : 'Completed') : (isAr ? 'إنجاز' : 'Complete')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Upcoming Deadlines + Smart Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Smart Recommendations Engine */}
          <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-xl border border-blue-100 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.smartRecommendations}
              </h3>
            </div>

            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 bg-white/95 rounded-lg border border-blue-200/60 shadow-xs space-y-2 hover:border-blue-300 transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{rec.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  <div className="pt-1">
                    <button
                      onClick={() => onApplyRecommendation(rec)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>{rec.actionText}</span>
                      {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines & Countdown Cards */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {t.upcomingDeadlines}
              </h3>
              <button
                onClick={() => onChangeTab('exams')}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                {t.viewAll} ({exams.length})
              </button>
            </div>

            <div className="space-y-3 mt-4">
              {exams.slice(0, 3).map((exam) => {
                const subject = getSubjectById(exam.subjectId);
                const diffDays = Math.ceil(
                  (new Date(exam.date).getTime() - new Date(todayStr).getTime()) /
                    (1000 * 3600 * 24)
                );
                const completedSyllabus = exam.syllabusTopics.filter((t) => t.completed).length;
                const totalSyllabus = exam.syllabusTopics.length;
                const prepPct = totalSyllabus > 0 ? Math.round((completedSyllabus / totalSyllabus) * 100) : 0;

                const isUrgent = diffDays <= 3;

                return (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{exam.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {subject?.name} · {exam.location}
                        </div>
                      </div>
                      <div
                        className={`text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded shrink-0 ${
                          isUrgent ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {diffDays === 0
                          ? (isAr ? 'اليوم' : 'Today')
                          : diffDays === 1
                          ? (isAr ? 'غداً' : 'Tomorrow')
                          : `${diffDays} ${isAr ? 'أيام متبقية' : 'days'}`}
                      </div>
                    </div>

                    {/* Preparation Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>{t.syllabusPreparation}</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-700">
                          {prepPct}% ({completedSyllabus}/{totalSyllabus} {isAr ? 'فصول' : 'topics'})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            prepPct >= 75
                              ? 'bg-teal-600'
                              : prepPct >= 40
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${prepPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {isAr ? 'الدرجة المستهدفة' : 'Target'}: {exam.targetGrade || 'A'}
                      </span>
                      <button
                        onClick={() => onChangeTab('exams')}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                      >
                        <span>{isAr ? 'قائمة الفصول' : 'Checklist'}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
