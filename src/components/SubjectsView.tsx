import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Trash2,
  Check,
  Award,
} from 'lucide-react';
import { Subject, StudyLog, Topic, UserProfile } from '../types';
import { formatDuration } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

interface SubjectsViewProps {
  profile?: UserProfile;
  subjects: Subject[];
  studyLogs: StudyLog[];
  onAddSubject: (subject: Partial<Subject>) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  profile,
  subjects,
  studyLogs,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
}) => {
  const isAr = (profile?.language || 'ar') === 'ar';
  const t = TRANSLATIONS[profile?.language || 'ar'] || TRANSLATIONS.ar;

  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(
    subjects[0]?.id || null
  );
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubColor, setNewSubColor] = useState('#2563EB');
  const [newSubTargetHours, setNewSubTargetHours] = useState(4);

  // New topic inline form
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    onAddSubject({
      name: newSubName.trim(),
      code: newSubCode.trim() || (isAr ? 'مادة' : 'SUB'),
      color: newSubColor,
      targetWeeklyHours: Number(newSubTargetHours) || 4,
      topics: [],
    });

    setNewSubName('');
    setNewSubCode('');
    setShowAddSubjectModal(false);
  };

  const handleToggleTopic = (subject: Subject, topicId: string) => {
    const updatedTopics = subject.topics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    onUpdateSubject({ ...subject, topics: updatedTopics });
  };

  const handleAddTopic = (subject: Subject) => {
    if (!newTopicTitle.trim()) return;
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      title: newTopicTitle.trim(),
      completed: false,
      difficulty: newTopicDifficulty,
    };
    onUpdateSubject({
      ...subject,
      topics: [...subject.topics, newTopic],
    });
    setNewTopicTitle('');
  };

  const handleDeleteTopic = (subject: Subject, topicId: string) => {
    onUpdateSubject({
      ...subject,
      topics: subject.topics.filter((t) => t.id !== topicId),
    });
  };

  // Calculate actual hours logged per subject this week
  const getSubjectLoggedMinutes = (subjectId: string) => {
    return studyLogs
      .filter((log) => log.subjectId === subjectId)
      .reduce((acc, log) => acc + log.durationMinutes, 0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.navSubjects}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'المناهج الدراسية، قوائم الفصول والمواضيع، وتخصيص الساعات الأسبوعية لكل مادة.'
              : 'Course curriculum, chapter checklists, study resources, and hour allocations.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addSubjectBtn}</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const isExpanded = expandedSubjectId === subject.id;
          const completedCount = subject.topics.filter((t) => t.completed).length;
          const totalCount = subject.topics.length;
          const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const loggedMinutes = getSubjectLoggedMinutes(subject.id);

          return (
            <div
              key={subject.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col transition-all hover:border-slate-300"
            >
              {/* Header */}
              <div className="p-5 flex items-start justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: subject.color }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{subject.name}</h3>
                      <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {subject.code}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>
                        {isAr ? `الهدف: ${subject.targetWeeklyHours} س/أسبوع` : `Target: ${subject.targetWeeklyHours}h/week`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums text-slate-700">
                        {formatDuration(loggedMinutes, profile?.language || 'ar')} {isAr ? 'تمت دراسته' : 'studied'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Progress Summary Strip */}
              <div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{t.curriculumProgress}:</span>
                  <span className="font-bold text-slate-800 font-mono tabular-nums">
                    {progressPercent}%
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {completedCount} {isAr ? 'من أصل' : 'of'} {totalCount} {isAr ? 'مواضيع منجزة' : 'topics completed'}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>

              {/* Collapsible Topics Checklist */}
              {isExpanded && (
                <div className="p-5 flex-1 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isAr ? 'قائمة الفصول والمواضيع في المنهج' : 'Syllabus Topics & Chapters'}
                    </h4>

                    {subject.topics.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        {isAr
                          ? 'لم تتم إضافة فصول بعد. أضف فصول مادتك في الحقل أدناه لمتابعة جاهزيتك!'
                          : 'No topics added yet. Add your chapters below to track completion!'}
                      </p>
                    ) : (
                      subject.topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => handleToggleTopic(subject, topic.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                topic.completed
                                  ? 'bg-teal-600 border-teal-600 text-white'
                                  : 'border-slate-300 bg-white hover:border-blue-600'
                              }`}
                            >
                              {topic.completed && <Check className="w-3 h-3" />}
                            </button>
                            <span
                              className={`text-xs font-medium ${
                                topic.completed ? 'line-through text-slate-400' : 'text-slate-800'
                              }`}
                            >
                              {topic.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {topic.difficulty && (
                              <span
                                className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${
                                  topic.difficulty === 'hard'
                                    ? 'bg-red-50 text-red-700'
                                    : topic.difficulty === 'medium'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-teal-50 text-teal-700'
                                }`}
                              >
                                {topic.difficulty === 'hard'
                                  ? isAr ? 'صعب' : 'Hard'
                                  : topic.difficulty === 'medium'
                                  ? isAr ? 'متوسط' : 'Medium'
                                  : isAr ? 'سهل' : 'Easy'}
                              </span>
                            )}
                            <button
                              onClick={() => handleDeleteTopic(subject, topic.id)}
                              className="text-slate-300 hover:text-red-500 p-1"
                              title={isAr ? 'حذف الموضوع' : 'Delete topic'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Topic Inline Form */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={isAr ? 'أضف فصلاً أو موضوعاً جديداً للمنهج...' : 'Add new topic or chapter...'}
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopic(subject);
                        }
                      }}
                      className="flex-1 text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    <select
                      value={newTopicDifficulty}
                      onChange={(e) =>
                        setNewTopicDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
                      }
                      className="text-xs px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700"
                    >
                      <option value="easy">{isAr ? 'سهل' : 'Easy'}</option>
                      <option value="medium">{isAr ? 'متوسط' : 'Medium'}</option>
                      <option value="hard">{isAr ? 'صعب' : 'Hard'}</option>
                    </select>
                    <button
                      onClick={() => handleAddTopic(subject)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 text-white hover:bg-slate-900 transition-colors"
                    >
                      {isAr ? 'إضافة' : 'Add'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900">{t.addSubjectBtn}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'أدخل اسم المادة ورمزها والساعات الأسبوعية المستهدفة.' : 'Enter course information and weekly target hours.'}
            </p>

            <form onSubmit={handleCreateSubject} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اسم المادة الدراسية' : 'Subject Name'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: الفيزياء، التاريخ، علم الحاسوب' : 'e.g. Physics, History, Computer Science'}
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'رمز المادة' : 'Course Code'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: فيز-101' : 'e.g. PHY-101'}
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'الساعات المستهدفة/أسبوع' : 'Target Hours / Wk'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={newSubTargetHours}
                    onChange={(e) => setNewSubTargetHours(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isAr ? 'اللون المميز للمادة' : 'Color Theme'}
                </label>
                <div className="flex items-center gap-3">
                  {[
                    '#2563EB',
                    '#0D9488',
                    '#D97706',
                    '#7C3AED',
                    '#DC2626',
                    '#059669',
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewSubColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        newSubColor === color ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  {isAr ? 'إنشاء المادة' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
