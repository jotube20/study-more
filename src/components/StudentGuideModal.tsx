import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Timer,
  Mic,
  Palette,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Layers,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { UserProfile, ViewTab } from '../types';
import { getThemeConfig } from '../utils/theme';

interface StudentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onChangeTab: (tab: ViewTab) => void;
  onOpenNewSessionModal: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const StudentGuideModal: React.FC<StudentGuideModalProps> = ({
  isOpen,
  onClose,
  profile,
  onChangeTab,
  onOpenNewSessionModal,
  onOpenVoiceAssistant,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const theme = getThemeConfig(profile.themeColor);

  if (!isOpen) return null;

  const steps = [
    {
      id: 'subjects',
      icon: BookOpen,
      badge: 'الخطوة الأولى',
      title: isEg ? '١. ضيف موادك الدراسية وقسم الفصول' : isAr ? '١. إضافة المواد الدراسية وتحديد المنهج' : '1. Add Subjects & Syllabus',
      description: isEg
        ? 'ابدأ بإضافة المواد اللي بتدرسها الترم ده عشان تقدر ترتب جدولك ومذاكرتك بسهولة.'
        : isAr
        ? 'الخطوة الأولى هي تسجيل مقرراتك الدراسية لتنظيم جلساتك ومتابعة تقدم الفصول والموضوعات.'
        : 'Start by adding the subjects you are studying this semester.',
      points: isEg
        ? [
            'اضغط على "المواد بتاعتي" في القائمة، واضغط زر "+ مادة جديدة".',
            'اكتب اسم المادة (زي: فيزياء، رياضيات، ألماني) وكودها.',
            'اختر لون مميز للمادة عشان تظهر بيه في التقويم والجدول بشكل واضح.',
            'حدد كام ساعة ناوي تذاكرها في الأسبوع.',
            'ضيف فصول أو موضوعات المنهج (Topics) عشان تعلم على كل درس لما تخلصه!',
          ]
        : isAr
        ? [
            'انتقل إلى قسم "المواد الدراسية" واضغط على زر "+ إضافة مادة جديدة".',
            'أدخل اسم المادة (مثل: الرياضيات المتقدمة، علم الأحياء) ورمز المقرر.',
            'اختر لوناً مميزاً للمادة ليسهل تمييزها بصرياً في جدولك والتقويم.',
            'حدد الساعات المستهدفة أسبوعياً لتوزيع جهدك بشكل متوازن.',
            'أضف فصول وموضوعات المنهج الدراسي لتتبع نسبة إنجاز المقرر أولاً بأول.',
          ]
        : [
            'Go to "My Subjects" and click "+ Add Subject".',
            'Enter the course name and code.',
            'Pick a distinct color so sessions stand out on your calendar.',
            'Set your weekly target hours.',
            'Add curriculum topics to mark them completed as you study.',
          ],
      actionLabel: isEg ? 'الانتقال لقسم المواد الآن ←' : isAr ? 'الانتقال لقسم المواد الدراسية ←' : 'Go to Subjects →',
      onAction: () => {
        onChangeTab('subjects');
        onClose();
      },
    },
    {
      id: 'planner',
      icon: Calendar,
      badge: 'الخطوة الثانية',
      title: isEg ? '٢. اعمل جدول المذاكرة واكشف أي تعارض' : isAr ? '٢. جدولة جلسات المذاكرة والتقويم الذكي' : '2. Plan Sessions & Detect Conflicts',
      description: isEg
        ? 'جدول مذاكرتك باليوم والساعة، والتطبيق ذكي جداً هيكشف أي تعارض في المواعيد وينبهك تلقائياً!'
        : isAr
        ? 'أنشئ جدولك الدراسي الأسبوعي أو الشهري مع ميزة الكشف التلقائي عن التعارضات الزمنية.'
        : 'Build your study schedule with automated time-conflict detection.',
      points: isEg
        ? [
            'افتح "جدول المذاكرة" واختر العرض المريح ليك (يومي، أسبوعي، أو شهري).',
            'اضغط زر "+ جلسة مذاكرة جديدة"، واختر المادة والموضوع ووقت البدء والانتهاء.',
            'لو حطيت جلستين في نفس الوقت، التطبيق هينبهك فوراً ويقترح تعديل التوقيت بضغطة زر.',
            'فعّل زر التنبيه للجلسة عشان تسمع رنة التذكير قبل الميعاد.',
          ]
        : isAr
        ? [
            'افتح "جدول الدراسة" وتنقّل بين العرض اليومي، الأسبوعي، أو الشهري.',
            'اضغط على زر "+ جلسة دراسة جديدة" واختر المادة، الموضوع، ووقتي البدء والانتهاء.',
            'في حال تداخل موعدين، يقوم النظام تلقائياً بكشف التعارض واقتراح تعديل الموعد لتفادي أي تصادم.',
            'فعّل خيار التنبيه للجلسة لسماع رنين التذكير قبل موعد البدء.',
          ]
        : [
            'Open "Planner" and switch between Day, Week, and Month views.',
            'Click "+ New Study Session", pick subject, topic, and start/end times.',
            'The smart engine alerts you if any sessions overlap and offers 1-click auto-stagger.',
            'Enable alert bells to receive audio and browser reminders.',
          ],
      actionLabel: isEg ? 'فتح جدول المذاكرة الآن ←' : isAr ? 'فتح جدول المذاكرة والتقويم ←' : 'Open Planner →',
      onAction: () => {
        onChangeTab('planner');
        onClose();
      },
    },
    {
      id: 'exams',
      icon: GraduationCap,
      badge: 'الخطوة الثالثة',
      title: isEg ? '٣. سجل الامتحانات والواجبات العاجلة' : isAr ? '٣. مواعيد الامتحانات، المهام، ومؤشر الجاهزية' : '3. Track Exams, Tasks & Readiness',
      description: isEg
        ? 'خليك دايماً مستعد قبل الامتحانات بعد تنازلي دقيق، وقوائم مراجعة شاملة، وتشجيع عند كل إنجاز!'
        : isAr
        ? 'جدولة الاختبارات وتتبع الأيام المتبقية، مع إدارة المهام العاجلة ومؤشرات الجاهزية.'
        : 'Manage exam countdowns, syllabus checklists, and homework tasks.',
      points: isEg
        ? [
            'في قسم "الامتحانات والمهام"، سجل مواعيد اختباراتك والمكان والمدة.',
            'التطبيق هيحسبلك عد تنازلي بالأيام المتبقية تلقائياً.',
            'ضيف الواجبات والمهام وحدد الأولوية (عاجل جداً، عالية، عادية).',
            'لما تخلص أي مهمة، علم عليها وهتسمع صوت احتفالي وكلمات تشجيعية فورية ترفع معنوياتك!',
          ]
        : isAr
        ? [
            'انتقل إلى قسم "الامتحانات والمهام" لإضافة مواعيد اختباراتك بدقة.',
            'يحسب النظام العد التنازلي للأيام المتبقية تلقائياً ويوصي بأولويات المراجعة.',
            'أضف المهام والواجبات المنزلية وحدد درجتها (عاجل جداً، أولوية عالية، إلخ).',
            'بمجرد إتمام المهمة والضغط على علامة الصح، ستستمع لنغمة إنجاز وكلمات تشجيعية دافعة!',
          ]
        : [
            'Log exam dates in "Exams & Tasks" with locations and durations.',
            'Live countdown shows days left and readiness scores.',
            'Add homework tasks with priorities (Urgent, High, Medium).',
            'Checking off a completed task triggers triumph sounds and motivational cheers!',
          ],
      actionLabel: isEg ? 'الانتقال للامتحانات والمهام ←' : isAr ? 'الانتقال لقسم الامتحانات والمهام ←' : 'Go to Exams & Tasks →',
      onAction: () => {
        onChangeTab('exams');
        onClose();
      },
    },
    {
      id: 'focus',
      icon: Timer,
      badge: 'الخطوة الرابعة',
      title: isEg ? '٤. مود التركيز وبومودورو مع أصوات رايقة' : isAr ? '٤. وضع التركيز الاحترافي وتقنية بومودورو' : '4. Focus Mode & Pomodoro Ambient Sound',
      description: isEg
        ? 'ذاكر بجلسات تركيز عميقة (بومودورو بالدقائق العربية) مع أصوات المطر والطبيعة وتدوين الملاحظات.'
        : isAr
        ? 'عزز تركيزك الذهني بتقنية بومودورو بالدقائق العربية، أصوات محيطية مهدئة، وملاحظات فورية.'
        : 'Boost retention with Pomodoro intervals, ambient audio, and instant notes.',
      points: isEg
        ? [
            'افتح "مود التركيز" واختر نظامك المفضل: بومودورو (25 دقيقة) أو تركيز عميق (50 دقيقة).',
            'شغل أصوات الخلفية المريحة: مطر هادي، موجات ألفا لزيادة التركيز، أو ضوضاء بيضاء.',
            'اكتب ملاحظاتك وتلخيصك في صندوق الملاحظات أثناء المذاكرة.',
            'لما تخلص، اضغط "إنهاء وتسجيل الوقت" وهيتحسب تلقائياً في سجلاتك وساعات المذاكرة!',
          ]
        : isAr
        ? [
            'انتقل إلى "وضع التركيز" واختر المدة المناسبة: بومودورو (25 د) أو تركيز عميق (50 د).',
            'استمع للأصوات المحيطية المساعدة على التركيز: المطر الهادئ، موجات ألفا، أو الضوضاء البيضاء.',
            'دوّن استنتاجاتك وملاحظاتك الفورية في لوحة الملاحظات المدمجة.',
            'عند الانتهاء، اضغط "إنهاء وتسجيل الوقت" ليُضاف الإنجاز إلى سجل ساعاتك الأكاديمية.',
          ]
        : [
            'Open "Focus Mode" and choose Pomodoro (25m) or Deep Work (50m).',
            'Listen to study ambient soundscapes (Gentle Rain, Alpha Waves, White Noise).',
            'Take quick live notes during the session.',
            'Click "Finish & Log" to record actual minutes into your analytics.',
          ],
      actionLabel: isEg ? 'تجربة مود التركيز الآن ←' : isAr ? 'تجربة وضع التركيز الآن ←' : 'Try Focus Mode →',
      onAction: () => {
        onChangeTab('focus');
        onClose();
      },
    },
    {
      id: 'voice-theme',
      icon: Mic,
      badge: 'الخطوة الخامسة',
      title: isEg ? '٥. المساعد الصوتي والوضع الليلي والألوان' : isAr ? '٥. المساعد الصوتي وتخصيص الألوان والوضع الليلي' : '5. Voice Assistant, Colors & Night Mode',
      description: isEg
        ? 'تحدث بصوتك بالعربي لإضافة الجلسات والمهام، واختر لونك المفضل ووضع الليل لراحة عينك.'
        : isAr
        ? 'استفد من الذكاء الصوتي باللغة العربية، وخصّص ألوان التطبيق الحيوية والوضع الليلي.'
        : 'Use hands-free voice commands, customize vibrant color palettes, and toggle night mode.',
      points: isEg
        ? [
            'اضغط على أيقونة الميكروفون في أعلى الشاشة واتكلم بصوتك: مثلاً "أضف جلسة فيزياء" أو "ابدأ التركيز".',
            'اختر لون التطبيق اللي تحبه من الإعدادات: أزرق ملكي، زمردي فريش، بنفسجي شيك، كهرماني نار، أو سماوي سيبراني.',
            'شغل الوضع الليلي (🌙) في أي وقت لو بتذاكر بالليل عشان تحافظ على راحة عينك.',
            'تقدر تسجل دخولك أو تسجل كطالب جديد في أي لحظة من القائمة الرئيسية.',
          ]
        : isAr
        ? [
            'اضغط على زر الميكروفون في الشريط العلوي وتحدث باللغة العربية: مثل "أضف جلسة أحياء" أو "ما هي امتحاناتي القادمة؟".',
            'اختر لون التطبيق الأكاديمي المفضل من لوحة الألوان الحيوية في الإعدادات أو الحساب.',
            'بدّل بين الوضع النهاري (☀️) والوضع الليلي (🌙) بضغطة زر لحماية بصرك أثناء الدراسة المسائية.',
            'يمكنك تسجيل الدخول أو تسجيل طالب جديد في أي وقت وحفظ بياناتك سحابياً.',
          ]
        : [
            'Tap the top microphone icon to speak commands in Arabic or English.',
            'Choose your vibrant app color palette (Royal Blue, Emerald, Violet, Amber, Rose, Cyan).',
            'Toggle Daylight (☀️) or Night mode (🌙) anytime for eye comfort.',
            'Log in or register new student accounts to sync your schedules safely.',
          ],
      actionLabel: isEg ? 'تحدث مع المساعد الصوتي 🎙️' : isAr ? 'تشغيل المساعد الصوتي الذكي 🎙️' : 'Open Voice Assistant 🎙️',
      onAction: () => {
        if (onOpenVoiceAssistant) onOpenVoiceAssistant();
        onClose();
      },
    },
  ];

  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${theme.gradientClass} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  {isEg ? 'دليل الطالب الذكي 📘' : isAr ? 'دليل الطالب الأكاديمي 📘' : 'Student Study Guide 📘'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {isEg ? 'خطوة بخطوة' : isAr ? 'شرح مفصل ومبسط' : 'Step-by-Step'}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1">
                {isEg
                  ? 'شرح بسيط وسهل عشان تضيف موادك وجدولك ومهامك وتذاكر بأعلى كفاءة!'
                  : isAr
                  ? 'دليل عملي سريع لتنظيم موادك، جدولة جلساتك، واكتساب أفضل عادات المذاكرة'
                  : 'Everything you need to master your schedule, subjects, and study sessions'}
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-between gap-1 mt-4 pt-3 border-t border-white/15">
            {steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 py-1 px-1 rounded-md text-[11px] font-bold transition-all text-center truncate ${
                  activeStep === idx
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="hidden sm:inline">{st.badge}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 bg-gradient-to-tr ${theme.gradientClass} shadow-md`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider uppercase">
                {current.badge}
              </span>
              <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {current.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Step Points */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            {current.points.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Quick Action Button for this step */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={current.onAction}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${theme.buttonClass} flex items-center justify-center gap-2`}
            >
              <span>{current.actionLabel}</span>
            </button>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isEg ? 'السابق' : isAr ? 'السابق' : 'Previous'}</span>
              </button>

              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <span>{isEg ? 'التالي' : isAr ? 'التالي' : 'Next'}</span>
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
