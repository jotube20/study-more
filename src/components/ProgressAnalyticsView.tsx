import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { StudyLog, Subject, Exam, Task, UserProfile } from '../types';
import { formatDuration } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

interface ProgressAnalyticsViewProps {
  profile: UserProfile;
  subjects: Subject[];
  studyLogs: StudyLog[];
  exams: Exam[];
  tasks: Task[];
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  profile,
  subjects,
  studyLogs,
  exams,
  tasks,
}) => {
  const isAr = profile.language === 'ar';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;

  const [timeRange, setTimeRange] = useState<'7days' | '14days' | '30days'>('7days');

  // Days history calculation
  const numDays = timeRange === '7days' ? 7 : timeRange === '14days' ? 14 : 30;

  const pastDaysData: { dateStr: string; label: string; minutes: number }[] = [];
  const today = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString(isAr ? 'ar-EG' : undefined, {
      weekday: 'short',
      month: 'numeric',
      day: 'numeric',
    });

    const totalMinutes = studyLogs
      .filter((log) => log.date === dateStr)
      .reduce((sum, log) => sum + log.durationMinutes, 0);

    pastDaysData.push({
      dateStr,
      label: dayLabel,
      minutes: totalMinutes,
    });
  }

  const maxDayMinutes = Math.max(...pastDaysData.map((d) => d.minutes), 120);

  // Subject distribution
  const subjectDistribution = subjects.map((sub) => {
    const totalMinutes = studyLogs
      .filter((log) => log.subjectId === sub.id)
      .reduce((sum, log) => sum + log.durationMinutes, 0);
    return {
      subject: sub,
      minutes: totalMinutes,
    };
  });

  const totalStudiedMinutes = subjectDistribution.reduce((sum, s) => sum + s.minutes, 0);

  // Task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Exam readiness calculation
  const examReadinessList = exams.map((exam) => {
    const subject = subjects.find((s) => s.id === exam.subjectId);
    const completedTopics = exam.syllabusTopics.filter((t) => t.completed).length;
    const totalTopics = exam.syllabusTopics.length;
    const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return {
      exam,
      subject,
      readinessPct: pct,
    };
  });

  const avgReadiness =
    examReadinessList.length > 0
      ? Math.round(
          examReadinessList.reduce((sum, item) => sum + item.readinessPct, 0) /
            examReadinessList.length
        )
      : 80;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.progressTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'ساعات المذاكرة الموثقة، توازن توزيع الوقت على المناهج، ومؤشرات الجاهزية للامتحانات.'
              : 'Verified study hours, subject allocation balance, and exam readiness scores.'}
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          {(['7days', '14days', '30days'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range === '7days'
                ? isAr ? 'آخر 7 أيام' : 'Last 7 Days'
                : range === '14days'
                ? isAr ? 'آخر 14 يوماً' : 'Last 14 Days'
                : isAr ? 'آخر 30 يوماً' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>{t.totalStudyTime}</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatDuration(totalStudiedMinutes || 360, profile.language)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'مسجل عبر جميع المواد' : 'Logged across all subjects'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>{t.activeStreak}</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {profile.streakDays} {isAr ? 'أيام' : 'Days'}
          </div>
          <p className="text-xs text-amber-700 font-medium mt-1">
            {isAr ? 'تم فتح شارة المواظبة المستمرة 🔥' : 'Consistency badge unlocked 🔥'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>{t.completionRate}</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {taskCompletionRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {completedTasks} {isAr ? 'من أصل' : 'of'} {totalTasks} {isAr ? 'مهام منجزة' : 'assignments done'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
            <span>{t.avgReadiness}</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900">
            {avgReadiness}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'عبر جميع الاختبارات المجدولة' : 'Across all scheduled tests'}
          </p>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Study Hours Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.dailyTrend}</h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? `مقارنة ساعات التركيز اليومية مقابل الهدف اليومي (${profile.dailyGoalHours} ساعات)`
                  : `Visual log of daily focus duration vs daily target (${profile.dailyGoalHours}h)`}
              </p>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-4">
            <div className="h-60 flex items-end gap-2 sm:gap-3 justify-between border-b border-slate-200 pb-2">
              {pastDaysData.map((item, idx) => {
                const heightPct = Math.min(100, Math.round((item.minutes / maxDayMinutes) * 100));
                const targetMinutes = profile.dailyGoalHours * 60;
                const metTarget = item.minutes >= targetMinutes;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                      {formatDuration(item.minutes, profile.language)} · {item.label}
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-100 rounded-t-md h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          metTarget ? 'bg-teal-600' : item.minutes > 0 ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                        style={{ height: `${Math.max(4, heightPct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between gap-1 pt-2 text-[10px] text-slate-400 font-mono">
              {pastDaysData.map((item, idx) => (
                <div key={idx} className="flex-1 text-center truncate">
                  {item.label.split(',')[0]}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
                <span>{isAr ? 'حقق الهدف اليومي' : 'Met Target Goal'}</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                <span>{isAr ? 'مذاكرة جزئية' : 'Partial Focus'}</span>
              </span>
            </div>
            <span className="font-mono text-slate-600 font-medium">
              {isAr ? `الهدف اليومي: ${profile.dailyGoalHours} ساعات` : `Daily Target: ${profile.dailyGoalHours}h`}
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Subject Distribution & Readiness */}
        <div className="lg:col-span-5 space-y-6">
          {/* Subject Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.subjectDistribution}</h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'الوقت المخصص لكل منهج دراسي ومادة' : 'Time allocated per curriculum course'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {subjectDistribution.map(({ subject, minutes }) => {
                const pct =
                  totalStudiedMinutes > 0
                    ? Math.round((minutes / totalStudiedMinutes) * 100)
                    : 25;

                return (
                  <div key={subject.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span className="font-medium text-slate-800">{subject.name}</span>
                      </div>
                      <span className="font-mono tabular-nums text-slate-600 font-semibold">
                        {formatDuration(minutes, profile.language)} ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(5, pct)}%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exam Readiness Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.examReadinessIndex}</h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'نسبة تغطية المنهج والمراجعة قبل موعد الاختبار' : 'Syllabus completion before assessment date'}
              </p>
            </div>

            <div className="space-y-3">
              {examReadinessList.map(({ exam, subject, readinessPct }) => (
                <div key={exam.id} className="p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{exam.title}</span>
                    <span
                      className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded text-[11px] ${
                        readinessPct >= 80
                          ? 'bg-teal-50 text-teal-700'
                          : readinessPct >= 50
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {readinessPct}% {isAr ? 'جاهز' : 'Ready'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {subject?.name} · {isAr ? `تاريخ الامتحان: ${exam.date}` : `Exam in ${exam.date}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
