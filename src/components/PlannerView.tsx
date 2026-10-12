import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Filter,
  Sparkles,
  Bell,
  BellOff,
  BellRing,
  Check,
} from 'lucide-react';
import { StudySession, Subject, UserProfile, Priority, Task } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import {
  detectScheduleConflicts,
  formatDuration,
  formatTime12h,
  minutesToTimeStr,
  timeToMinutes,
} from '../utils/scheduler';

interface PlannerViewProps {
  profile: UserProfile;
  subjects: Subject[];
  sessions: StudySession[];
  tasks?: Task[];
  onAddSession: () => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleSessionStatus: (sessionId: string) => void;
  onStartFocusSession: (session: StudySession) => void;
  onRescheduleSession: (sessionId: string, newDate: string, newStartTime: string) => void;
  onToggleTaskAlert?: (taskId: string) => void;
  onToggleSessionAlert?: (sessionId: string) => void;
  onToggleTaskStatus?: (taskId: string) => void;
}

type CalendarViewMode = 'day' | 'week' | 'month';

export const PlannerView: React.FC<PlannerViewProps> = ({
  profile,
  subjects,
  sessions,
  tasks = [],
  onAddSession,
  onEditSession,
  onDeleteSession,
  onToggleSessionStatus,
  onStartFocusSession,
  onRescheduleSession,
  onToggleTaskAlert,
  onToggleSessionAlert,
  onToggleTaskStatus,
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

  const isAr = profile.language === 'ar';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;

  // Conflict detection
  const conflicts = detectScheduleConflicts(sessions, profile.language);

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    if (filterSubjectId !== 'all' && s.subjectId !== filterSubjectId) return false;
    return true;
  });

  // Date math
  const currentDateObj = new Date(selectedDate);

  const navigateDate = (direction: 'prev' | 'next') => {
    const d = new Date(selectedDate);
    const step = direction === 'next' ? 1 : -1;
    if (viewMode === 'day') {
      d.setDate(d.getDate() + step);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + step * 7);
    } else {
      d.setMonth(d.getMonth() + step);
    }
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const jumpToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Generate days for Week View
  const getWeekDates = () => {
    const d = new Date(selectedDate);
    const day = d.getDay(); // 0 is Sunday
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const week: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];
      week.push({
        dateStr,
        dayName: current.toLocaleDateString(isAr ? 'ar-EG' : undefined, { weekday: 'short' }),
        dayNum: current.getDate(),
        isToday: dateStr === todayStr,
      });
    }
    return week;
  };

  const weekDays = getWeekDates();
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  // Automatic conflict resolution
  const resolveConflict = (sessionB: StudySession, sessionA: StudySession) => {
    const endMinutes = timeToMinutes(sessionA.endTime) + 15;
    const newStart = minutesToTimeStr(endMinutes);
    onRescheduleSession(sessionB.id, sessionB.date, newStart);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.studyPlannerTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'إدارة فترات المذاكرة، وتفادي تعارض المواعيد، وتحقيق التوازن الأسبوعي.'
              : 'Manage study blocks, detect schedule conflicts, and balance weekly workload.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Segmented View Mode Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            {(['day', 'week', 'month'] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'day' ? t.dayView : mode === 'week' ? t.weekView : t.monthView}
              </button>
            ))}
          </div>

          <button
            onClick={onAddSession}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة جلسة' : 'Add Session'}</span>
          </button>
        </div>
      </div>

      {/* Conflict Warning Banner */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold">
                {isAr
                  ? `تم رصد ${conflicts.length} تعارض في مواعيد الجلسات`
                  : `${conflicts.length} Overlapping Study Session${conflicts.length > 1 ? 's' : ''} Detected`}
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {conflicts[0].message}
              </p>
            </div>
          </div>
          <button
            onClick={() => resolveConflict(conflicts[0].sessionB, conflicts[0].sessionA)}
            className="px-3 py-1 text-xs font-semibold rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0"
          >
            {t.autoStaggerTime}
          </button>
        </div>
      )}

      {/* Date Navigation & Subject Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title={isAr ? 'السابق' : 'Previous'}
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={jumpToToday}
            className="px-3 py-1 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            {t.todayBtn}
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title={isAr ? 'التالي' : 'Next'}
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          <span className="text-sm font-bold text-slate-800 mx-2">
            {currentDateObj.toLocaleDateString(isAr ? 'ar-EG' : undefined, {
              month: 'long',
              year: 'numeric',
              ...(viewMode === 'day' ? { day: 'numeric', weekday: 'short' } : {}),
            })}
          </span>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">
            {isAr ? 'تصفية حسب المادة:' : 'Filter by subject:'}
          </span>
          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">{isAr ? 'جميع المواد' : 'All Subjects'}</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
            {weekDays.map((day) => (
              <div
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`p-3 text-center cursor-pointer transition-colors border-e border-slate-200/60 last:border-e-0 ${
                  day.isToday ? 'bg-blue-50/50' : 'hover:bg-slate-100/50'
                }`}
              >
                <div className="text-[11px] font-semibold text-slate-500 uppercase">
                  {day.dayName}
                </div>
                <div
                  className={`mt-1 inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full font-mono tabular-nums ${
                    day.isToday
                      ? 'bg-blue-600 text-white'
                      : day.dateStr === selectedDate
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-800'
                  }`}
                >
                  {day.dayNum}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 min-h-[480px] divide-x divide-slate-100 rtl:divide-x-reverse">
            {weekDays.map((day) => {
              const daySessions = filteredSessions.filter((s) => s.date === day.dateStr);

              return (
                <div
                  key={day.dateStr}
                  className="p-2 space-y-2 bg-slate-50/20 hover:bg-slate-50/60 transition-colors min-h-[480px]"
                >
                  {daySessions.map((session) => {
                    const subject = getSubject(session.subjectId);
                    const isCompleted = session.status === 'completed';

                    return (
                      <div
                        key={session.id}
                        className="p-2.5 rounded-lg border bg-white shadow-2xs hover:shadow-xs transition-all space-y-1.5 group"
                        style={{
                          borderInlineStartColor: subject?.color || '#2563EB',
                          borderInlineStartWidth: '3px',
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span
                            className={`text-xs font-semibold leading-snug ${
                              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {session.topic}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          {formatTime12h(session.startTime, profile.language)}
                          <span className="mx-1 text-slate-300">·</span>
                          {session.durationMinutes} {isAr ? 'د' : 'm'}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <button
                            onClick={() => onToggleSessionStatus(session.id)}
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isCompleted
                                ? 'bg-teal-50 text-teal-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isCompleted ? (isAr ? 'أُنجز' : 'Done') : (isAr ? 'تحديد' : 'Mark')}
                          </button>

                          {!isCompleted && (
                            <button
                              onClick={() => onStartFocusSession(session)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title={isAr ? 'بدء مؤقت التركيز' : 'Start Focus Timer'}
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {daySessions.length === 0 && (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-300 italic py-8">
                      {isAr ? 'وقت متاح' : 'Free slot'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isAr ? 'جلسات يوم' : 'Sessions for'}{' '}
                {new Date(selectedDate).toLocaleDateString(isAr ? 'ar-EG' : undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'الجدول الزمني والتفاصيل' : 'Timeline and breakdown'}
              </p>
            </div>
            <button
              onClick={onAddSession}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              {isAr ? '+ إضافة جلسة لهذا اليوم' : '+ Add Session for this Day'}
            </button>
          </div>

          <div className="space-y-3">
            {filteredSessions.filter((s) => s.date === selectedDate).length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                {isAr
                  ? 'لا توجد جلسات مجدولة لهذا اليوم. استمتع بوقت فراغك أو قم بجدولة جلسة مذاكرة!'
                  : 'No sessions scheduled for this day. Enjoy your free time or schedule a study block!'}
              </div>
            ) : (
              filteredSessions
                .filter((s) => s.date === selectedDate)
                .map((session) => {
                  const subject = getSubject(session.subjectId);
                  const isCompleted = session.status === 'completed';

                  return (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-10 rounded-full"
                          style={{ backgroundColor: subject?.color || '#2563EB' }}
                        />
                        <div>
                          <div
                            className={`text-sm font-bold ${
                              isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {session.topic}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span className="font-medium text-slate-700">{subject?.name}</span>
                            <span>·</span>
                            <span className="font-mono tabular-nums">
                              {formatTime12h(session.startTime, profile.language)} – {formatTime12h(session.endTime, profile.language)}
                            </span>
                            <span>·</span>
                            <span className="font-mono tabular-nums">
                              {session.durationMinutes} {isAr ? 'دقيقة' : 'minutes'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleSessionStatus(session.id)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${
                            isCompleted
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isCompleted ? (isAr ? 'تم الإنجاز' : 'Completed') : (isAr ? 'تحديد كمكتمل' : 'Mark Completed')}
                        </button>
                        {!isCompleted && (
                          <button
                            onClick={() => onStartFocusSession(session)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isAr ? 'بدء التركيز' : 'Launch Focus'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="text-xs text-slate-400 hover:text-red-600 px-2 py-1"
                        >
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {isAr ? 'نظرة عامة على الشهر' : 'Monthly Overview'}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const datePad = dayNum.toString().padStart(2, '0');
              const dStr = `${selectedDate.slice(0, 7)}-${datePad}`;
              const count = sessions.filter((s) => s.date === dStr).length;

              return (
                <div
                  key={dStr}
                  onClick={() => {
                    setSelectedDate(dStr);
                    setViewMode('day');
                  }}
                  className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                    count > 0
                      ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-100/40'
                      : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-slate-700">{dayNum}</div>
                  {count > 0 && (
                    <div className="text-[10px] text-blue-600 font-semibold mt-1">
                      {count} {isAr ? (count > 2 && count < 11 ? 'جلسات' : 'جلسة') : 'session' + (count > 1 ? 's' : '')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Alerts & Smart Reminders Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {isAr ? 'نظام تنبيهات المهام والمواعيد' : 'Task Alerts & Scheduled Alarms'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'تنبيهات صوتية وإشعارات للمتصفح قبل مواعيد تسليم الواجبات والمهام الدراسية'
                  : 'Audio alarms and browser notifications prior to assignment deadlines'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {tasks.filter((t) => t.hasAlert).length} {isAr ? 'منبهات نشطة' : 'active alarms'}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            {isAr ? 'لا توجد مهام مسجلة حالياً.' : 'No tasks recorded yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((task) => {
              const subject = getSubject(task.subjectId);
              const isAlertActive = task.hasAlert;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isAlertActive
                      ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                      : 'bg-slate-50/40 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTaskStatus && onToggleTaskStatus(task.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-slate-300 bg-white hover:border-blue-600'
                      }`}
                      title={task.completed ? 'تحديد كغير مكتملة' : 'تحديد كمكتملة'}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <div>
                      <div
                        className={`text-xs font-semibold ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium" style={{ color: subject?.color || '#3b82f6' }}>
                          {subject?.name}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {task.deadline === new Date().toISOString().split('T')[0]
                            ? (isAr ? 'اليوم' : 'Today')
                            : task.deadline}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{task.estimatedMinutes} {isAr ? 'دقيقة' : 'm'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alert Toggle Button */}
                  <button
                    onClick={() => onToggleTaskAlert && onToggleTaskAlert(task.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAlertActive
                        ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-400 hover:text-amber-700'
                    }`}
                    title={isAlertActive ? 'إلغاء التنبيه' : 'تفعيل التنبيه الصوتي'}
                  >
                    {isAlertActive ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 animate-bounce" />
                        <span>{isAr ? 'تنبيه نشط' : 'Alert On'}</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تفعيل منبه' : 'Set Alert'}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
