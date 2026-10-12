import React, { useState } from 'react';
import { X, Clock, Calendar, AlertTriangle, Sparkles } from 'lucide-react';
import { Subject, StudySession, Priority, UserProfile } from '../types';
import { timeToMinutes, minutesToTimeStr } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

interface NewSessionModalProps {
  profile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  sessions: StudySession[];
  onSaveSession: (session: Partial<StudySession>) => void;
  initialSubjectId?: string;
  initialTopic?: string;
  initialDuration?: number;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  profile,
  isOpen,
  onClose,
  subjects,
  sessions,
  onSaveSession,
  initialSubjectId,
  initialTopic,
  initialDuration = 45,
}) => {
  if (!isOpen) return null;

  const isAr = (profile?.language || 'ar') === 'ar';
  const t = TRANSLATIONS[profile?.language || 'ar'] || TRANSLATIONS.ar;
  const todayStr = new Date().toISOString().split('T')[0];

  const [subjectId, setSubjectId] = useState(initialSubjectId || subjects[0]?.id || '');
  const [topic, setTopic] = useState(initialTopic || '');
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('16:00');
  const [durationMinutes, setDurationMinutes] = useState(initialDuration);
  const [priority, setPriority] = useState<Priority>('high');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');

  // Calculate end time
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + durationMinutes;
  const calculatedEndTime = minutesToTimeStr(endMins);

  // Real-time conflict preview
  const hasConflict = sessions.some((s) => {
    if (s.date !== date || s.status === 'completed' || s.status === 'missed') return false;
    const sStart = timeToMinutes(s.startTime);
    const sEnd = timeToMinutes(s.endTime);
    return startMins < sEnd && sStart < endMins;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onSaveSession({
      subjectId,
      topic: topic.trim(),
      date,
      startTime,
      endTime: calculatedEndTime,
      durationMinutes: Number(durationMinutes),
      priority,
      status: 'scheduled',
      notes: notes.trim() || undefined,
      recurring,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-slate-900">
          {isAr ? 'جدولة جلسة مذاكرة جديدة' : 'Schedule Study Session'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAr
            ? 'حدد موعداً مخصصاً للمذاكرة مع فحص فوري لتعارض المواعيد.'
            : 'Plan a dedicated learning block with intelligent conflict detection.'}
        </p>

        {hasConflict && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              {isAr
                ? `تنبيه: توجد جلسة دراسية مجدولة بالفعل في هذا التوقيت تقريباً في تاريخ ${date}.`
                : `Warning: A study session is already scheduled around this time on ${date}.`}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'المادة الدراسية' : 'Subject'}
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
              required
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'الموضوع أو الفصل المستهدف' : 'Topic or Chapter'}
            </label>
            <input
              type="text"
              placeholder={isAr ? 'مثال: مراجعة مفردات الوحدة 4، حل مسائل الكيمياء' : 'e.g. German vocabulary Unit 4, Chemistry problem sets'}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'الأولوية' : 'Priority'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white capitalize"
              >
                <option value="urgent">{t.priorityUrgent}</option>
                <option value="high">{t.priorityHigh}</option>
                <option value="medium">{t.priorityMedium}</option>
                <option value="low">{t.priorityLow}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'وقت البدء' : 'Start Time'}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'المدة (دقيقة)' : 'Duration (Min)'}
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono"
              >
                <option value={15}>{isAr ? '15 دقيقة' : '15 mins'}</option>
                <option value={25}>{isAr ? '25 دقيقة (بومودورو)' : '25 mins (Pomodoro)'}</option>
                <option value={30}>{isAr ? '30 دقيقة' : '30 mins'}</option>
                <option value={45}>{isAr ? '45 دقيقة' : '45 mins'}</option>
                <option value={50}>{isAr ? '50 دقيقة (تركيز عميق)' : '50 mins (Deep)'}</option>
                <option value={60}>{isAr ? '60 دقيقة (ساعة)' : '60 mins (1 hr)'}</option>
                <option value={90}>{isAr ? '90 دقيقة' : '90 mins'}</option>
                <option value={120}>{isAr ? '120 دقيقة (ساعتان)' : '120 mins (2 hrs)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isAr ? 'وقت الانتهاء' : 'End Time'}
              </label>
              <input
                type="text"
                disabled
                value={calculatedEndTime}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 font-mono text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'التكرار (اختياري)' : 'Recurrence (Optional)'}
            </label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value as 'none' | 'daily' | 'weekly')}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
            >
              <option value="none">{isAr ? 'لا يتكرر' : 'Does not repeat'}</option>
              <option value="daily">{isAr ? 'يتكرر يومياً' : 'Repeats Daily'}</option>
              <option value="weekly">{isAr ? 'يتكرر أسبوعياً' : 'Repeats Weekly'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isAr ? 'الهدف من الجلسة أو الملاحظات' : 'Session Objective or Notes'}
            </label>
            <textarea
              rows={2}
              placeholder={isAr ? 'مثال: التركيز على حفظ المفردات، حل مسائل نهاية الفصل' : 'e.g. Focus on flashcard retention, solve end of chapter quiz'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
            >
              {isAr ? 'جدولة الجلسة' : 'Schedule Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
