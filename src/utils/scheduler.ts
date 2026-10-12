import { StudySession, Exam, Task, Subject, LanguageCode } from '../types';

export interface ConflictInfo {
  sessionA: StudySession;
  sessionB: StudySession;
  message: string;
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTimeStr(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number, lang: LanguageCode = 'ar'): string {
  if (lang === 'ar') {
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) {
      return h === 1 ? 'ساعة واحدة' : h === 2 ? 'ساعتان' : `${h} ساعات`;
    }
    return `${h} س و ${m} د`;
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatTime12h(timeStr: string, lang: LanguageCode = 'ar'): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const isPM = h >= 12;
  h = h % 12;
  if (h === 0) h = 12;

  if (lang === 'ar') {
    return `${h}:${m} ${isPM ? 'م' : 'ص'}`;
  }
  return `${h}:${m} ${isPM ? 'PM' : 'AM'}`;
}

export function detectScheduleConflicts(sessions: StudySession[], lang: LanguageCode = 'ar'): ConflictInfo[] {
  const conflicts: ConflictInfo[] = [];
  const groupedByDate: Record<string, StudySession[]> = {};

  for (const session of sessions) {
    if (session.status === 'completed' || session.status === 'missed') continue;
    if (!groupedByDate[session.date]) {
      groupedByDate[session.date] = [];
    }
    groupedByDate[session.date].push(session);
  }

  for (const date in groupedByDate) {
    const daySessions = groupedByDate[date];
    for (let i = 0; i < daySessions.length; i++) {
      for (let j = i + 1; j < daySessions.length; j++) {
        const s1 = daySessions[i];
        const s2 = daySessions[j];
        const start1 = timeToMinutes(s1.startTime);
        const end1 = timeToMinutes(s1.endTime);
        const start2 = timeToMinutes(s2.startTime);
        const end2 = timeToMinutes(s2.endTime);

        // Overlap if start1 < end2 and start2 < end1
        if (start1 < end2 && start2 < end1) {
          const msg =
            lang === 'ar'
              ? `تعارض في تاريخ ${date} بين "${s1.topic}" (${formatTime12h(s1.startTime, 'ar')}–${formatTime12h(s1.endTime, 'ar')}) و "${s2.topic}" (${formatTime12h(s2.startTime, 'ar')}–${formatTime12h(s2.endTime, 'ar')})`
              : `Overlap on ${date} between "${s1.topic}" (${s1.startTime}–${s1.endTime}) and "${s2.topic}" (${s2.startTime}–${s2.endTime})`;

          conflicts.push({
            sessionA: s1,
            sessionB: s2,
            message: msg,
          });
        }
      }
    }
  }

  return conflicts;
}

export interface Recommendation {
  id: string;
  type: 'urgent_exam' | 'gap_opportunity' | 'missed_session' | 'goal_progress';
  title: string;
  description: string;
  actionText: string;
  actionType: 'schedule_session' | 'reschedule_session' | 'view_exam' | 'start_focus';
  subjectId?: string;
  topic?: string;
  suggestedDuration?: number;
  relatedId?: string;
}

export function generateSmartRecommendations(
  exams: Exam[],
  sessions: StudySession[],
  tasks: Task[],
  subjects: Subject[],
  dailyGoalHours: number,
  lang: LanguageCode = 'ar'
): Recommendation[] {
  const recs: Recommendation[] = [];
  const todayStr = new Date().toISOString().split('T')[0];
  const isAr = lang === 'ar';

  // 1. Check upcoming exams
  for (const exam of exams) {
    const examDate = new Date(exam.date);
    const todayDate = new Date(todayStr);
    const diffTime = examDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 7) {
      const completedTopics = exam.syllabusTopics.filter((t) => t.completed).length;
      const totalTopics = exam.syllabusTopics.length;
      const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 100;
      const subject = subjects.find((s) => s.id === exam.subjectId);

      if (progressPercent < 80) {
        recs.push({
          id: `rec-exam-${exam.id}`,
          type: 'urgent_exam',
          title: isAr
            ? `الامتحان بعد ${diffDays} ${diffDays === 1 ? 'يوم' : diffDays === 2 ? 'يومين' : 'أيام'}: ${exam.title}`
            : `Exam in ${diffDays} day${diffDays === 1 ? '' : 's'}: ${exam.title}`,
          description: isAr
            ? `تمت مراجعة ${progressPercent}% فقط من محتوى منهج ${subject?.name || 'هذه المادة'}. ننصح بجدولة جلسة مراجعة مركزة مدتها 45 دقيقة اليوم.`
            : `Only ${progressPercent}% of syllabus is reviewed for ${subject?.name || 'this course'}. Consider a 45-minute revision session today.`,
          actionText: isAr ? 'جدولة جلسة مراجعة (45 د)' : 'Schedule 45m Revision',
          actionType: 'schedule_session',
          subjectId: exam.subjectId,
          topic: isAr ? `مراجعة مركزة: ${exam.title}` : `Revision: ${exam.title}`,
          suggestedDuration: 45,
          relatedId: exam.id,
        });
      }
    }
  }

  // 2. Check missed sessions today or yesterday
  const missedSessions = sessions.filter((s) => s.status === 'missed');
  if (missedSessions.length > 0) {
    const firstMissed = missedSessions[0];
    const subject = subjects.find((s) => s.id === firstMissed.subjectId);
    recs.push({
      id: `rec-missed-${firstMissed.id}`,
      type: 'missed_session',
      title: isAr ? 'جلسة دراسية فائتة' : 'Missed Study Session',
      description: isAr
        ? `لم تكتمل الجلسة "${firstMissed.topic}". يمكنك إعادة جدولتها لليوم للحفاظ على الاستمرارية.`
        : `"${firstMissed.topic}" was missed. Reschedule to tonight or tomorrow to keep consistency.`,
      actionText: isAr ? 'إعادة جدولة الجلسة' : 'Reschedule Session',
      actionType: 'reschedule_session',
      relatedId: firstMissed.id,
      subjectId: firstMissed.subjectId,
      topic: firstMissed.topic,
    });
  }

  // 3. Gap opportunity: Check planned time vs daily goal
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const totalPlannedTodayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const targetDailyMinutes = dailyGoalHours * 60;

  if (totalPlannedTodayMinutes < targetDailyMinutes) {
    const remainingMinutes = targetDailyMinutes - totalPlannedTodayMinutes;
    // Find highest priority uncompleted task
    const pendingTask = tasks.find((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high'));
    if (pendingTask) {
      const subject = subjects.find((s) => s.id === pendingTask.subjectId);
      recs.push({
        id: `rec-gap-${pendingTask.id}`,
        type: 'gap_opportunity',
        title: isAr
          ? `وقت متاح للدراسة (متبقي ${formatDuration(remainingMinutes, 'ar')})`
          : `Open Study Window (${formatDuration(remainingMinutes)} needed)`,
        description: isAr
          ? `لديك وقت متاح اليوم للوصول لهدفك (${dailyGoalHours} ساعات). ننصح بإنجاز المهمة "${pendingTask.title}".`
          : `You have study time available today to reach your ${dailyGoalHours}h goal. Work on "${pendingTask.title}".`,
        actionText: isAr ? 'جدولة جلسة للمهمة' : 'Schedule Task Session',
        actionType: 'schedule_session',
        subjectId: pendingTask.subjectId,
        topic: pendingTask.title,
        suggestedDuration: Math.min(pendingTask.estimatedMinutes, 45),
      });
    }
  }

  // 4. Default high-motivation tip if no urgent alert
  if (recs.length === 0) {
    recs.push({
      id: 'rec-default-flow',
      type: 'goal_progress',
      title: isAr ? 'أنت تسير وفق الخطة بنجاح!' : 'You are on track with your study plan!',
      description: isAr
        ? 'الاستمرارية اليومية هي سر التفوق. ابدأ جلسة تركيز (بومودورو) لمدة 25 دقيقة الآن.'
        : 'Consistency is your best asset. Start a 25-minute Pomodoro focus session on your current subjects.',
      actionText: isAr ? 'بدء جلسة التركيز' : 'Launch Focus Mode',
      actionType: 'start_focus',
    });
  }

  return recs.slice(0, 3);
}
