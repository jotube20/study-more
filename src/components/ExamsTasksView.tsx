import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Target,
  Award,
  AlertTriangle,
  FileText,
  Check,
  Trash2,
  ListTodo,
} from 'lucide-react';
import { Exam, Task, Subject, Priority, ExamTopic, MockTest, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatDuration } from '../utils/scheduler';

interface ExamsTasksViewProps {
  profile?: UserProfile;
  exams: Exam[];
  tasks: Task[];
  subjects: Subject[];
  onAddExam: (exam: Partial<Exam>) => void;
  onUpdateExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
  onAddTask: (task: Partial<Task>) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const ExamsTasksView: React.FC<ExamsTasksViewProps> = ({
  profile,
  exams,
  tasks,
  subjects,
  onAddExam,
  onUpdateExam,
  onDeleteExam,
  onAddTask,
  onToggleTaskStatus,
  onDeleteTask,
}) => {
  const isAr = (profile?.language || 'ar') === 'ar';
  const t = TRANSLATIONS[profile?.language || 'ar'] || TRANSLATIONS.ar;

  const [activeTab, setActiveTab] = useState<'exams' | 'tasks'>('exams');
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [filterSubjectId, setFilterSubjectId] = useState<string>('all');

  // Exam modal fields
  const [examTitle, setExamTitle] = useState('');
  const [examSubjectId, setExamSubjectId] = useState(subjects[0]?.id || '');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('09:00');
  const [examLocation, setExamLocation] = useState(isAr ? 'القاعة الرئيسية' : 'Main Hall');
  const [examDuration, setExamDuration] = useState(90);
  const [examTargetGrade, setExamTargetGrade] = useState(isAr ? 'ممتاز (A)' : 'A');
  const [examSyllabusText, setExamSyllabusText] = useState('');

  // Task modal fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubjectId, setTaskSubjectId] = useState(subjects[0]?.id || '');
  const [taskDeadline, setTaskDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskMinutes, setTaskMinutes] = useState(45);

  // Mock test score input modal/state
  const [mockScoreExamId, setMockScoreExamId] = useState<string | null>(null);
  const [mockTestName, setMockTestName] = useState('');
  const [mockTestScore, setMockTestScore] = useState<number>(85);

  const todayStr = new Date().toISOString().split('T')[0];

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const handleToggleSyllabusTopic = (exam: Exam, topicId: string) => {
    const updated = exam.syllabusTopics.map((t) =>
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );
    onUpdateExam({ ...exam, syllabusTopics: updated });
  };

  const handleAddMockTest = (exam: Exam) => {
    if (!mockTestName.trim()) return;
    const newMock: MockTest = {
      id: `mt-${Date.now()}`,
      name: mockTestName.trim(),
      score: Number(mockTestScore) || 0,
      maxScore: 100,
      date: new Date().toISOString().split('T')[0],
    };
    onUpdateExam({
      ...exam,
      mockTests: [...exam.mockTests, newMock],
    });
    setMockTestName('');
    setMockScoreExamId(null);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim() || !examDate) return;

    const topics: ExamTopic[] = examSyllabusText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((name, i) => ({ id: `et-${Date.now()}-${i}`, name, completed: false }));

    onAddExam({
      title: examTitle.trim(),
      subjectId: examSubjectId,
      date: examDate,
      time: examTime,
      location: examLocation || (isAr ? 'قاعة الامتحان' : 'Examination Hall'),
      durationMinutes: Number(examDuration) || 90,
      targetGrade: examTargetGrade || 'A',
      syllabusTopics: topics.length > 0 ? topics : [{ id: `et-1`, name: isAr ? 'مراجعة المنهج كاملاً' : 'All chapters review', completed: false }],
      mockTests: [],
    });

    setExamTitle('');
    setExamSyllabusText('');
    setShowAddExamModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      subjectId: taskSubjectId,
      deadline: taskDeadline,
      priority: taskPriority,
      estimatedMinutes: Number(taskMinutes) || 30,
      completed: false,
    });

    setTaskTitle('');
    setShowAddTaskModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.assessmentsTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'مؤشرات الجاهزية للامتحانات، تفصيل فصول المنهج، الاختبارات التجريبية، ومتابعة الواجبات.'
              : 'Exam readiness matrices, syllabus checklists, mock tests, and assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'exams'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? `الامتحانات (${exams.length})` : `Exams (${exams.length})`}
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? `الواجبات والمهام (${tasks.length})` : `Tasks & Homework (${tasks.length})`}
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'exams' ? setShowAddExamModal(true) : setShowAddTaskModal(true))}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{activeTab === 'exams' ? t.addExamBtn : t.addTaskBtn}</span>
          </button>
        </div>
      </div>

      {/* EXAMS TAB */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          {exams.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              {isAr
                ? 'لا توجد امتحانات مسجلة حتى الآن. أضف مواعيد امتحاناتك لمتابعة نسبة جاهزيتك!'
                : 'No exams scheduled yet. Add your upcoming midterms and finals to track syllabus readiness!'}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {exams.map((exam) => {
                const subject = getSubject(exam.subjectId);
                const diffDays = Math.ceil(
                  (new Date(exam.date).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24)
                );
                const completedSyllabus = exam.syllabusTopics.filter((t) => t.completed).length;
                const totalSyllabus = exam.syllabusTopics.length;
                const prepPct = totalSyllabus > 0 ? Math.round((completedSyllabus / totalSyllabus) * 100) : 0;
                const isUrgent = diffDays <= 3;

                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Title & Countdown */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full mt-1 shrink-0"
                            style={{ backgroundColor: subject?.color || '#2563EB' }}
                          />
                          <div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {exam.title}
                            </h3>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                              <span className="font-medium text-slate-700">{subject?.name}</span>
                              <span>·</span>
                              <span>{isAr ? 'الدرجة المستهدفة' : 'Target'}: {exam.targetGrade || 'A'}</span>
                            </div>
                          </div>
                        </div>

                        <div
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold tabular-nums shrink-0 ${
                            isUrgent
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {diffDays === 0
                            ? (isAr ? 'اليوم' : 'Today')
                            : diffDays === 1
                            ? (isAr ? 'غداً' : 'Tomorrow')
                            : `${diffDays} ${isAr ? 'أيام متبقية' : 'days left'}`}
                        </div>
                      </div>

                      {/* Info badges */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{exam.time} ({exam.durationMinutes} {isAr ? 'د' : 'm'})</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{exam.location}</span>
                        </div>
                      </div>

                      {/* Syllabus Breakdown Checklist */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">
                            {isAr ? 'قائمة فصول المنهج والمراجعة' : 'Syllabus Revision Checklist'}
                          </span>
                          <span className="font-mono tabular-nums font-semibold text-slate-600">
                            {prepPct}% ({completedSyllabus}/{totalSyllabus} {isAr ? 'فصول تمت مراجعتها' : 'covered'})
                          </span>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              prepPct >= 75
                                ? 'bg-teal-600'
                                : prepPct >= 40
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${prepPct}%` }}
                          />
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                          {exam.syllabusTopics.map((topic) => (
                            <div
                              key={topic.id}
                              onClick={() => handleToggleSyllabusTopic(exam, topic.id)}
                              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-50 cursor-pointer text-xs transition-colors"
                            >
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  topic.completed
                                    ? 'bg-teal-600 border-teal-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {topic.completed && <Check className="w-3 h-3" />}
                              </div>
                              <span
                                className={`${
                                  topic.completed ? 'line-through text-slate-400' : 'text-slate-800'
                                }`}
                              >
                                {topic.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mock Tests and Scores */}
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">{t.mockTestsTitle}</span>
                          <button
                            onClick={() => setMockScoreExamId(mockScoreExamId === exam.id ? null : exam.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t.logMockScore}
                          </button>
                        </div>

                        {mockScoreExamId === exam.id && (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2 text-xs">
                            <input
                              type="text"
                              placeholder={isAr ? 'اسم الاختبار (مثال: نموذج امتحانات 2025)...' : 'Test name (e.g. 2025 Past Paper)...'}
                              value={mockTestName}
                              onChange={(e) => setMockTestName(e.target.value)}
                              className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md"
                            />
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder={isAr ? 'الدرجة' : 'Score'}
                              value={mockTestScore}
                              onChange={(e) => setMockTestScore(Number(e.target.value))}
                              className="w-16 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                            />
                            <button
                              onClick={() => handleAddMockTest(exam)}
                              className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                            >
                              {t.saveMockTest}
                            </button>
                          </div>
                        )}

                        {exam.mockTests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {exam.mockTests.map((test) => (
                              <div
                                key={test.id}
                                className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-xs flex items-center gap-2"
                              >
                                <span className="text-slate-600">{test.name}:</span>
                                <span className="font-mono font-bold text-teal-700">
                                  {test.score}/{test.maxScore}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 italic">
                            {isAr ? 'لم تسجل اختبارات تجريبية بعد.' : 'No mock tests recorded yet.'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => onDeleteExam(exam.id)}
                        className="text-xs text-slate-400 hover:text-red-600"
                      >
                        {isAr ? 'حذف الامتحان' : 'Delete Exam'}
                      </button>
                      <span className="text-[11px] text-slate-400">
                        {prepPct >= 80 ? (isAr ? 'جاهز للامتحان' : 'Exam Ready') : (isAr ? 'قيد الاستعداد' : 'In Preparation')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.tasksTab}</h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'متابعة وإنجاز التكليفات والتمارين والواجبات المنزلية.' : 'Filter and complete assignments, practice sets, and readings.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">{isAr ? 'المادة:' : 'Subject:'}</span>
              <select
                value={filterSubjectId}
                onChange={(e) => setFilterSubjectId(e.target.value)}
                className="px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-xs"
              >
                <option value="all">{isAr ? 'جميع المواد' : 'All Subjects'}</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks
              .filter((t) => filterSubjectId === 'all' || t.subjectId === filterSubjectId)
              .map((task) => {
                const subject = getSubject(task.subjectId);

                let priorityLabel = t.priorityMedium;
                if (task.priority === 'urgent') priorityLabel = t.priorityUrgent;
                else if (task.priority === 'high') priorityLabel = t.priorityHigh;
                else if (task.priority === 'low') priorityLabel = t.priorityLow;

                return (
                  <div
                    key={task.id}
                    className="py-3 flex items-center justify-between gap-4 group"
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
                          className={`text-xs font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span style={{ color: subject?.color || '#475569' }}>{subject?.name}</span>
                          <span>·</span>
                          <span>{isAr ? `تاريخ التسليم: ${task.deadline}` : `Due: ${task.deadline}`}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">{task.estimatedMinutes} {isAr ? 'د' : 'm'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border ${
                          task.priority === 'urgent'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : task.priority === 'high'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {priorityLabel}
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 p-1"
                        title={isAr ? 'حذف المهمة' : 'Delete task'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">{t.addExamBtn}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'أدخل تفاصيل الامتحان وقائمة الفصول للمراجعة.' : 'Enter assessment details and chapter syllabus breakdown.'}
            </p>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'عنوان الامتحان' : 'Exam Title'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: امتحان منتصف الفصل لمادة الكيمياء' : 'e.g. Midterm Examination: Chemistry'}
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'المادة' : 'Subject'}</label>
                  <select
                    value={examSubjectId}
                    onChange={(e) => setExamSubjectId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'الدرجة المستهدفة' : 'Target Grade'}</label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: ممتاز، 95%' : 'e.g. A, 90%'}
                    value={examTargetGrade}
                    onChange={(e) => setExamTargetGrade(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'تاريخ الامتحان' : 'Exam Date'}</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'الوقت' : 'Time'}</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'المدة (دقيقة)' : 'Duration (Min)'}</label>
                  <input
                    type="number"
                    value={examDuration}
                    onChange={(e) => setExamDuration(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'مكان الامتحان / القاعة' : 'Location / Room'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: المدرج المركزي أو قاعة 102' : 'e.g. Hall B-104'}
                  value={examLocation}
                  onChange={(e) => setExamLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'فصول وموضوعات المنهج (كل فصل في سطر)' : 'Syllabus Chapters (One per line)'}
                </label>
                <textarea
                  rows={3}
                  placeholder={isAr ? `الفصل 1: الأساسيات والمفاهيم\nالفصل 2: القوانين والمعادلات\nالفصل 3: حل المسائل التطبيقية` : `Chapter 1: Foundations\nChapter 2: Formulas\nChapter 3: Problems`}
                  value={examSyllabusText}
                  onChange={(e) => setExamSyllabusText(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  {isAr ? 'حفظ الامتحان' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-slate-900">{t.addTaskBtn}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr ? 'أدخل تفاصيل التكليف والموعد النهائي.' : 'Enter details and deadline.'}
            </p>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'عنوان الواجب أو المهمة' : 'Task Title'}
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: حل التمارين من 1 إلى 15' : 'e.g. Solve exercises 1 to 15'}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'المادة' : 'Subject'}</label>
                  <select
                    value={taskSubjectId}
                    onChange={(e) => setTaskSubjectId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isAr ? 'الأولوية' : 'Priority'}</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white capitalize"
                  >
                    <option value="urgent">{t.priorityUrgent}</option>
                    <option value="high">{t.priorityHigh}</option>
                    <option value="medium">{t.priorityMedium}</option>
                    <option value="low">{t.priorityLow}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'تاريخ التسليم' : 'Deadline'}
                  </label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isAr ? 'المدة المقدرة (دقيقة)' : 'Est. Duration (Min)'}
                  </label>
                  <input
                    type="number"
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  {isAr ? 'إضافة المهمة' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
