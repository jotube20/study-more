import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  Timer,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { StudySession, Subject, Exam, Task, UserProfile, ViewTab } from '../types';
import { formatTime12h } from '../utils/scheduler';
import { getDateOffset } from '../utils/storage';

interface SmartVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  sessions: StudySession[];
  exams: Exam[];
  tasks: Task[];
  profile: UserProfile;
  onAddSession: (session: Omit<StudySession, 'id'>) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onChangeTab: (tab: ViewTab) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionTaken?: {
    type: 'session_added' | 'task_added' | 'navigated';
    details: string;
  };
}

export const SmartVoiceAssistant: React.FC<SmartVoiceAssistantProps> = ({
  isOpen,
  onClose,
  subjects,
  sessions,
  exams,
  tasks,
  profile,
  onAddSession,
  onAddTask,
  onChangeTab,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speakResponses, setSpeakResponses] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `أهلاً بك يا ${profile.name.split(' ')[0]}! أنا مساعدك الصوتي الذكي في Study More. يمكنك التحدث إليّ أو الكتابة لإضافة جلسات مذاكرة، تسجيل مهام وتنبيهات، معرفة جدولك اليومي، أو طلب نصيحة أكاديمية.`,
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition not available:', err);
      setVoiceSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // When speech recognition ends and we have a transcript, process it!
  useEffect(() => {
    if (!isListening && transcript.trim().length > 0) {
      handleUserQuery(transcript.trim());
      setTranscript('');
    }
  }, [isListening, transcript]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch {
      // If already started, restart
      recognitionRef.current.stop();
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch {
          // ignore
        }
      }, 200);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text to speech playback
  const speakText = (text: string) => {
    if (!speakResponses || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arVoice) {
        utterance.voice = arVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  };

  // Smart Query Interpreter & Executive Engine
  const handleUserQuery = (queryText: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = queryText.toLowerCase();
    const todayStr = new Date().toISOString().split('T')[0];

    // Helper: Find matching subject in user library
    const matchedSubject = subjects.find(
      (s) =>
        lower.includes(s.name.toLowerCase()) ||
        lower.includes(s.code.toLowerCase()) ||
        (s.name.includes('ألماني') && lower.includes('ألمان')) ||
        (s.name.includes('رياضيات') && (lower.includes('رياض') || lower.includes('حساب'))) ||
        (s.name.includes('أحياء') && lower.includes('أحياء')) ||
        (s.name.includes('كيمياء') && lower.includes('كيمياء'))
    ) || subjects[0];

    // 1. Intent: What is my schedule today? (ما هو جدولي؟)
    if (
      lower.includes('جدول') ||
      lower.includes('اليوم') ||
      lower.includes('علي ايه') ||
      lower.includes('ماذا لدي') ||
      lower.includes('ما هي مهامي')
    ) {
      const todaySessions = sessions.filter((s) => s.date === todayStr);
      const todayTasks = tasks.filter((t) => t.deadline === todayStr);

      let reply = '';
      if (todaySessions.length === 0 && todayTasks.length === 0) {
        reply = 'ليس لديك أي جلسات أو مهام مجدولة لهذا اليوم حتى الآن. يوم ممتاز لجدولة جلسة مذاكرة مسبقة!';
      } else {
        reply = `جدولك اليوم يتضمن ${todaySessions.length} جلسات مذاكرة و ${todayTasks.length} مهام: `;
        if (todaySessions.length > 0) {
          const sessionSummaries = todaySessions
            .map((s) => {
              const sub = subjects.find((sub) => sub.id === s.subjectId);
              return `${s.topic} (${sub?.name || ''}) الساعة ${formatTime12h(s.startTime, 'ar')}`;
            })
            .join('، ثم ');
          reply += sessionSummaries;
        }
        if (todayTasks.length > 0) {
          reply += `، بالإضافة إلى مهام: ${todayTasks.map((t) => t.title).join('، ')}.`;
        }
      }

      addAssistantMessage(reply);
      speakText(reply);
      return;
    }

    // 2. Intent: Upcoming Exams (ما هي امتحاناتي القادمة؟)
    if (lower.includes('امتحان') || lower.includes('اختبار') || lower.includes('امتحانات')) {
      if (lower.includes('أضف') || lower.includes('سجل') || lower.includes('جديد')) {
        // Adding exam
        addAssistantMessage(
          'يمكنك تسجيل الامتحان بكل تفاصيله وفصوله وموقعه عبر تبويب الامتحانات. سأنقلك إلى هناك الآن!'
        );
        speakText('سأنقلك الآن لصفحة الامتحانات لتسجيله وتحديد الفصول بدقة.');
        onChangeTab('exams');
        onClose();
        return;
      }

      if (exams.length === 0) {
        const reply = 'لا توجد امتحانات مسجلة حالياً في نظامك الأكاديمي.';
        addAssistantMessage(reply);
        speakText(reply);
      } else {
        const upcoming = exams.slice(0, 3).map((e) => {
          const diffDays = Math.ceil(
            (new Date(e.date).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24)
          );
          const daysText =
            diffDays === 0
              ? 'اليوم'
              : diffDays === 1
              ? 'غداً'
              : `خلال ${diffDays} أيام`;
          return `${e.title} (${daysText})`;
        });
        const reply = `امتحاناتك القادمة هي: ${upcoming.join('، و ')}. يمكنك مراجعة فصول المنهج في تبويب الامتحانات.`;
        addAssistantMessage(reply);
        speakText(reply);
      }
      return;
    }

    // 3. Intent: Start Focus Mode (ابدأ المذاكرة / افتح التركيز / بومودورو)
    if (
      lower.includes('تركيز') ||
      lower.includes('بومودورو') ||
      lower.includes('ذاكر') ||
      lower.includes('ابدأ المذاكرة')
    ) {
      const reply = 'ممتاز! جاري فتح وضع التركيز مع مؤقت بومودورو والأصوات المحيطية لمساعدتك على الإنجاز الفوري.';
      addAssistantMessage(reply, {
        type: 'navigated',
        details: 'تم الانتقال إلى وضع التركيز',
      });
      speakText(reply);
      onChangeTab('focus');
      setTimeout(() => onClose(), 600);
      return;
    }

    // 4. Intent: Add a Study Session (أضف جلسة / ذاكر كذا)
    if (
      lower.includes('أضف جلسة') ||
      lower.includes('سجل جلسة') ||
      lower.includes('جلسة مذاكرة') ||
      lower.includes('أريد مذاكرة') ||
      lower.includes('بدي اذاكر') ||
      lower.includes('مذاكرة')
    ) {
      // Determine topic
      let topic = 'جلسة مذاكرة مخصصة';
      if (lower.includes('مراجعة')) {
        topic = 'مراجعة شاملة وتدريبات';
      } else if (lower.includes('حل مسائل') || lower.includes('تمارين')) {
        topic = 'حل تمارين وتطبيقات عملية';
      } else if (lower.includes('حفظ') || lower.includes('مفردات')) {
        topic = 'حفظ ومراجعة بطاقات استذكار';
      }

      // Determine duration
      let duration = 45;
      if (lower.includes('ساعة')) duration = 60;
      else if (lower.includes('نصف ساعة') || lower.includes('30')) duration = 30;
      else if (lower.includes('ساعتين') || lower.includes('120')) duration = 120;
      else if (lower.includes('25') || lower.includes('بومودورو')) duration = 25;

      // Determine start time
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const defaultStart = `${String(now.getHours()).padStart(2, '0')}:00`;
      const endH = Math.floor((now.getHours() * 60 + duration) / 60);
      const endM = (now.getHours() * 60 + duration) % 60;
      const defaultEnd = `${String(endH % 24).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      const newSess: Omit<StudySession, 'id'> = {
        subjectId: matchedSubject?.id || subjects[0]?.id || 'sub-1',
        topic: `${topic} (${matchedSubject?.name || 'عام'})`,
        date: lower.includes('غدا') || lower.includes('بكرة') ? getDateOffset(1) : todayStr,
        startTime: defaultStart,
        endTime: defaultEnd,
        durationMinutes: duration,
        priority: 'high',
        status: 'scheduled',
        hasAlert: true,
      };

      onAddSession(newSess);
      const reply = `تم بنجاح جدولة جلسة مذاكرة لمادة ${matchedSubject?.name} بعنوان "${topic}" لمدة ${duration} دقيقة مع تفعيل جرس التنبيه 🔔!`;
      addAssistantMessage(reply, {
        type: 'session_added',
        details: `${matchedSubject?.name} · ${duration} دقيقة`,
      });
      speakText(reply);
      return;
    }

    // 5. Intent: Add a Task (أضف مهمة / واجب / تسليم)
    if (lower.includes('أضف مهمة') || lower.includes('واجب') || lower.includes('تسليم') || lower.includes('مهمة')) {
      const taskTitle = queryText
        .replace(/(أضف مهمة|سجل مهمة|واجب|عندي واجب|أريد إضافة مهمة)/gi, '')
        .trim() || 'واجب دراسي جديد';

      const newTask: Omit<Task, 'id'> = {
        subjectId: matchedSubject?.id || subjects[0]?.id || 'sub-1',
        title: taskTitle.length > 2 ? taskTitle : `واجب ${matchedSubject?.name}`,
        deadline: lower.includes('غدا') || lower.includes('بكرة') ? getDateOffset(1) : todayStr,
        priority: 'high',
        estimatedMinutes: 30,
        completed: false,
        hasAlert: true,
        alertTime: '09:00',
      };

      onAddTask(newTask);
      const reply = `تمت إضافة المهمة "${newTask.title}" لمادة ${matchedSubject?.name} مع تفعيل التنبيه بالمهام 🔔!`;
      addAssistantMessage(reply, {
        type: 'task_added',
        details: newTask.title,
      });
      speakText(reply);
      return;
    }

    // 6. Intent: Study Advice & Anti-Procrastination (نصيحة / تشتت / تسويف / حفظ)
    if (
      lower.includes('نصيحة') ||
      lower.includes('تشتت') ||
      lower.includes('تسويف') ||
      lower.includes('كسل') ||
      lower.includes('حفظ') ||
      lower.includes('كيف أذاكر')
    ) {
      const tips = [
        'قاعدة الـ 5 دقائق الذهبية: ابدأ المذاكرة لمدة 5 دقائق فقط دون التفكير في طول المنهج، وسيتولى الدوبامين تحفيزك للاستمرار.',
        'تقنية الاسترجاع النشط (Active Recall): بعد قراءة أي صفحة، أغلق الكتاب واشرح ما قرأته بصوت مسموع، هذا يثبت المعلومة بنسبة 80% أكثر من مجرد إعادة القراءة.',
        'بيئة خالية من المشتتات: ضع هاتفك في غرفة أخرى أثناء جلسة المذاكرة، فمجرد وجود الهاتف بجانبك يستهلك جزءاً من طاقتك الذهنية دون أن تشعر.',
        'قسّم المهام الكبيرة إلى أجزاء صغيرة لا تتجاوز 25 دقيقة، ثم كافئ نفسك باستراحة 5 دقائق.',
      ];
      const selectedTip = tips[Math.floor(Math.random() * tips.length)];
      addAssistantMessage(selectedTip);
      speakText(selectedTip);
      return;
    }

    // Fallback: General helpful academic reply
    const fallbackReply = `فهمت طلبك: "${queryText}". يمكنك تجربة أوامر مثل: "ما هو جدولي اليوم؟"، "أضف جلسة مذاكرة رياضيات"، "ابدأ وضع التركيز"، أو "ما هي امتحاناتي القادمة؟".`;
    addAssistantMessage(fallbackReply);
    speakText(fallbackReply);
  };

  const addAssistantMessage = (
    text: string,
    actionTaken?: { type: 'session_added' | 'task_added' | 'navigated'; details: string }
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text,
        actionTaken,
      },
    ]);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    handleUserQuery(inputMessage.trim());
    setInputMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative p-0.5 rounded-xl bg-gradient-to-tr from-blue-500 via-teal-400 to-indigo-500 shadow-md">
              <div className="w-8 h-8 rounded-[10px] bg-slate-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-teal-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h3 className="font-extrabold text-sm text-white tracking-tight">
                  المساعد الصوتي الذكي
                </h3>
                <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 px-1.5 py-0.2 rounded">
                  Voice AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                تحدث بحرية باللغة العربية لإدارة دراستك
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const nextState = !speakResponses;
                setSpeakResponses(nextState);
                if (!nextState && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                speakResponses
                  ? 'text-teal-300 bg-slate-800 hover:bg-slate-700'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900'
              }`}
              title={speakResponses ? 'الرد الصوتي مفعّل' : 'الرد الصوتي صامت'}
            >
              {speakResponses ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 min-h-[260px] max-h-[380px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-ee-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-es-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.actionTaken && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-1 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-teal-600" />
                    <span>{msg.actionTaken.details}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live Voice Transcript Bubble */}
          {isListening && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 animate-pulse text-xs">
              <div className="flex items-center gap-1 px-1">
                <span className="w-1.5 h-3 bg-blue-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-2.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
              <span className="font-semibold text-blue-800">
                {transcript || 'أنا أستمع إليك الآن... تفضل بالحديث'}
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Quick Commands */}
        <div className="px-3 py-2 bg-slate-100/70 border-t border-slate-200/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">اقتراحات:</span>
          {[
            { label: 'ما هو جدولي اليوم؟ 📅', text: 'ما هو جدولي اليوم؟' },
            { label: 'أضف جلسة مذاكرة ⏱️', text: 'أضف جلسة مذاكرة رياضيات لمدة 45 دقيقة' },
            { label: 'امتحاناتي القادمة 🎓', text: 'ما هي امتحاناتي القادمة؟' },
            { label: 'ابدأ وضع التركيز 🔥', text: 'ابدأ وضع التركيز مع مؤقت بومودورو' },
            { label: 'نصيحة للتغلب على التسويف 💡', text: 'أعطني نصيحة للتغلب على التسويف' },
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleUserQuery(chip.text)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 shadow-2xs font-medium transition-colors shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Input & Voice Controls */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmitText} className="flex items-center gap-2">
            {voiceSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
                title={isListening ? 'إيقاف الاستماع' : 'بدء التحدث بالصوت'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  isListening
                    ? 'جاري الاستماع لصوتك...'
                    : 'تحدث بالمايكروفون أو اكتب هنا (مثال: أضف جلسة مذاكرة...)'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all pe-9"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="absolute end-1.5 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:text-blue-800 disabled:text-slate-300 transition-colors"
                title="إرسال"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </form>

          {!voiceSupported && (
            <p className="text-[10px] text-amber-600 mt-1.5 text-center">
              ⚠️ ميزة الإدخال الصوتي تحتاج تصريح المايكروفون في المتصفح، يمكنك الكتابة في المربع أعلاه بشكل طبيعي.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
