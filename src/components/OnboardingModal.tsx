import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { UserProfile, LanguageCode, EducationLevel } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedProfile: Partial<UserProfile>) => void;
  profile: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  profile,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile.name);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [language, setLanguage] = useState<LanguageCode>(profile.language);
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours);

  const isAr = language === 'ar';

  const handleFinish = () => {
    onComplete({
      name: name.trim() || (isAr ? 'أحمد علي' : 'Alex Morgan'),
      educationLevel,
      language,
      dailyGoalHours: Number(dailyGoalHours) || 3.5,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">
              {isAr ? 'إعداد Study More' : 'Study More Setup'}
            </span>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-400">
            {isAr ? `الخطوة ${step} من 2` : `Step ${step} of 2`}
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'مرحباً بك في Study More!' : 'Welcome to Study More!'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'مساعدك الدراسي الذكي الذي يحول أهدافك الأكاديمية إلى خطة يومية منظمة وقابلة للتحقيق بسهولة.'
                : 'Your intelligent personal study assistant that turns academic goals into an organized, achievable daily schedule.'}
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'ما اسمك الكريم؟' : "What's your name?"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: أحمد، سارة' : 'e.g. Alex'}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'اللغة المفضلة' : 'Preferred Language & Direction'}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="eg">🇪🇬 عربي مصري - Egyptian Arabic (RTL)</option>
                  <option value="ar">🇸🇦 العربية الفصحى - Arabic (RTL)</option>
                  <option value="en">🇬🇧 English (LTR)</option>
                  <option value="es">🇪🇸 Español - Spanish</option>
                  <option value="de">🇩🇪 Deutsch - German</option>
                  <option value="fr">🇫🇷 Français - French</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'المرحلة الدراسية' : 'Academic Level'}
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="middle_school">{isAr ? 'المرحلة المتوسطة' : 'Middle School'}</option>
                  <option value="high_school">{isAr ? 'المرحلة الثانوية' : 'High School'}</option>
                  <option value="university">{isAr ? 'المرحلة الجامعية' : 'University / College'}</option>
                  <option value="graduate">{isAr ? 'الدراسات العليا (ماجستير/دكتوراه)' : 'Graduate / PhD'}</option>
                  <option value="self_learner">{isAr ? 'تعلم وتطوير ذاتي' : 'Self-Learner / Professional'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>{isAr ? 'المتابعة' : 'Continue'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isAr ? 'حدد هدفك اليومي' : 'Set Your Daily Goal'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? 'لقد قمنا بتجهيز نموذج خطة وجدول دراسي تجريبي يحتوي على مواد وواجبات وامتحانات حتى تتمكن من تجربة التطبيق فوراً.'
                : "We've preloaded a sample schedule so you can start exploring immediately."}
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isAr ? 'الهدف اليومي للمذاكرة (ساعات)' : 'Daily Study Goal (Hours)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="12"
                  value={dailyGoalHours}
                  onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1 text-xs text-blue-900">
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>{isAr ? 'جاهز للانطلاق!' : 'Ready to Roll'}</span>
                </div>
                <p className="text-[11px] text-blue-700">
                  {isAr
                    ? 'يمكنك تعديل المواد، إضافة مواضيع المنهج، وتخصيص مؤقت التركيز بأي وقت من القوائم.'
                    : 'Sample subjects, exams, and priority checklists are pre-configured. You can modify or delete them anytime!'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                {isAr ? 'رجوع' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <span>{isAr ? 'ابدأ المذاكرة والتنظيم' : 'Start Learning'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
