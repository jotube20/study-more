import React, { useState } from 'react';
import {
  User,
  Globe,
  Bell,
  Cloud,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Moon,
  Sun,
  Check,
  Palette,
  Volume2,
  Smartphone,
  CheckCircle2,
  GraduationCap,
  LogOut,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { UserProfile, LanguageCode, EducationLevel, AppThemeColor, ColorMode } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { APP_THEMES, getThemeConfig } from '../utils/theme';
import { exportAllData, importAllData, resetToDemoData } from '../utils/storage';
import { requestNotificationPermission } from '../utils/notifications';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  lastSyncTime: string;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
  onResetData,
  lastSyncTime,
  onOpenAuthModal,
  onLogout,
}) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(profile.educationLevel);
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours);
  const [language, setLanguage] = useState<LanguageCode>(profile.language || 'ar');
  const [simplifiedMode, setSimplifiedMode] = useState(profile.simplifiedMode);
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile.notificationsEnabled);
  const [quietHoursStart, setQuietHoursStart] = useState(profile.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(profile.quietHoursEnd);
  const [themeColor, setThemeColor] = useState<AppThemeColor>(profile.themeColor || 'blue');
  const [colorMode, setColorMode] = useState<ColorMode>(profile.colorMode || 'light');
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(profile.soundEffectsEnabled ?? true);

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isAr = language === 'ar' || language === 'eg';
  const isEg = language === 'eg';
  const t = TRANSLATIONS[language] || TRANSLATIONS.ar;
  const theme = getThemeConfig(themeColor);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      email,
      educationLevel,
      dailyGoalHours: Number(dailyGoalHours),
      language,
      simplifiedMode,
      notificationsEnabled,
      quietHoursStart,
      quietHoursEnd,
      themeColor,
      colorMode,
      soundEffectsEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymore_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) {
        setImportStatus(isAr ? 'تم استرجاع النسخة الاحتياطية بنجاح! جاري التحديث...' : 'Backup restored successfully! Reloading...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setImportStatus(isAr ? 'خطأ: ملف النسخة الاحتياطية غير صالح.' : 'Error: Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isEg ? 'الإعدادات وتخصيص التطبيق' : isAr ? 'الإعدادات والتخصيص الأكاديمي' : 'Settings & Customization'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isEg
            ? 'ظبط لغة التطبيق، الألوان، الوضع الليلي، التنبيهات، وحساب الطالب بسهولة.'
            : isAr
            ? 'تخصيص تفضيلات المذاكرة، الملف الشخصي، الألوان الحيوية، اللغة، والمزامنة السحابية.'
            : 'Customize your study preferences, colors, night mode, language, and cloud backup.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>{isEg ? 'تم حفظ التعديلات بنجاح يا بطل! 🚀' : isAr ? 'تم حفظ وتحديث جميع التفضيلات بنجاح!' : 'Preferences saved successfully!'}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Student Profile & Account Management */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEg ? 'حساب وملف الطالب' : isAr ? 'الملف الشخصي وحساب الطالب' : 'Student Profile & Account'}
              </h3>
            </div>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isEg ? 'تسجيل طالب جديد / تبديل' : isAr ? 'تسجيل طالب جديد / تبديل الحساب' : 'Switch / Register Student'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEg ? 'اسمك (يا بطل)' : isAr ? 'اسم الطالب' : 'Student Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEg ? 'البريد أو المعرف الأكاديمي' : isAr ? 'البريد الأكاديمي / المعرف' : 'Student Email / ID'}
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@study.edu"
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'المرحلة الدراسية' : 'Education Level'}
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="middle_school">{isEg ? 'إعدادي' : isAr ? 'المرحلة المتوسطة' : 'Middle School'}</option>
                <option value="high_school">{isEg ? 'ثانوي' : isAr ? 'المرحلة الثانوية' : 'High School'}</option>
                <option value="university">{isEg ? 'جامعة / كلية' : isAr ? 'المرحلة الجامعية / الكلية' : 'University / College'}</option>
                <option value="graduate">{isEg ? 'دراسات عليا / ماجستير' : isAr ? 'دراسات عليا / ماجستير ودكتوراه' : 'Graduate / PhD'}</option>
                <option value="self_learner">{isEg ? 'تطوير ذاتي حر' : isAr ? 'تعلم وتطوير ذاتي' : 'Self-Learner / Professional'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isEg ? 'هدف المذاكرة اليومي (ساعات)' : isAr ? 'الهدف اليومي (ساعات)' : 'Daily Goal (Hours)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={dailyGoalHours}
                onChange={(e) => setDailyGoalHours(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Language Selection (Egyptian Arabic, Standard Arabic, English) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEg ? 'اختيار اللغة واللهجة المفضلة' : isAr ? 'اللغة واللهجة واتجاه الواجهة' : 'Language & Dialect Selection'}
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isEg ? 'اختر اللغة المناسبة ليك (بين العربي المصري، الفصحى، أو الإنجليزي):' : isAr ? 'اختر اللغة واللهجة المفضلة:' : 'Choose App Language:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('eg')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  language === 'eg'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">🇪🇬 عربي مصري</span>
                  {language === 'eg' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  عامية مصرية تشجيعية دافعة للمذاكرة والنشاط!
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('ar')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  language === 'ar'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">🇸🇦 العربية الفصحى</span>
                  {language === 'ar' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  لغة عربية واضحة ورسمية وأكاديمية دقيقة.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`p-3 rounded-xl border text-start transition-all ${
                  language === 'en'
                    ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 ring-2 ring-blue-500 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">🇬🇧 English</span>
                  {language === 'en' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  International Academic English with LTR support.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Theme Colors & Day/Night Mode Customization */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEg ? 'ألوان التطبيق والوضع النهاري والليلي' : isAr ? 'المظهر والألوان الحيوية والوضع الليلي' : 'App Appearance, Colors & Dark Mode'}
            </h3>
          </div>

          {/* Daylight vs Night Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isEg ? 'وضع العرض (نهاري أو ليلي):' : isAr ? 'نمط العرض (وضع نهاري أو ليلي):' : 'Display Mode:'}
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setColorMode('light')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  colorMode === 'light'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{t.dayModeLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => setColorMode('dark')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  colorMode === 'dark'
                    ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 ring-2 ring-indigo-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>{t.nightModeLabel}</span>
              </button>
            </div>
          </div>

          {/* Vibrant Theme Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
              <span>{isEg ? 'اختر لون التطبيق الحيوي اللي يعجبك:' : isAr ? 'اختر لون التطبيق الحيوي المفضل:' : 'Select Accent Color:'}</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                {APP_THEMES[themeColor].nameAr}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {(Object.keys(APP_THEMES) as AppThemeColor[]).map((colKey) => {
                const cfg = APP_THEMES[colKey];
                const isSelected = themeColor === colKey;
                return (
                  <button
                    key={colKey}
                    type="button"
                    onClick={() => setThemeColor(colKey)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-slate-900 dark:border-white ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-102 bg-slate-50 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-full shadow-sm flex items-center justify-center text-white"
                      style={{ backgroundColor: cfg.primaryHex }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cfg.nameAr.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Sounds & Motivational Cheers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isEg ? 'أصوات التشجيع والتنبيهات' : isAr ? 'أصوات الاحتفال والتشجيع والتنبيهات' : 'Sound Effects & Motivational Cheers'}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isEg ? 'تشغيل كلمات التشجيع ونغمة الإنجاز عند إنهاء المهام' : isAr ? 'تفعيل أصوات التشجيع ونغمة إنجاز المهام' : 'Celebration Chimes & Motivational Cheers'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isEg
                  ? 'سماع نغمة احتفالية ورسالة تشجيعية حماسية عند الضغط على علامة صح لأي مهمة.'
                  : isAr
                  ? 'سماع نغمة انتصار مع رسائل تشجيعية فورية تعزز الاستمرارية عند إتمام كل مهمة.'
                  : 'Play triumphant chimes and encouraging words when completing tasks and streaks.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEffectsEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 start-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEffectsEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 5. Notifications & Quiet Hours */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'التنبيهات وساعات الهدوء' : 'Notifications & Quiet Hours'}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isAr ? 'تنبيهات جلسات الدراسة والامتحانات' : 'Study Session Reminders'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'استلام تنبيهات المتصفح قبل 10–15 دقيقة من مواعيد الجلسات والامتحانات.'
                  : 'Receive browser alerts 10–15 minutes before study sessions and exams.'}
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 start-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'بداية ساعات الهدوء' : 'Quiet Hours Start'}
              </label>
              <input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isAr ? 'نهاية ساعات الهدوء' : 'Quiet Hours End'}
              </label>
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-7 py-3 text-xs font-extrabold text-white rounded-xl shadow-md transition-all ${theme.buttonClass}`}
          >
            {isEg ? 'حفظ التعديلات والتفضيلات ✨' : isAr ? 'حفظ جميع التفضيلات والتعديلات' : 'Save All Preferences'}
          </button>
        </div>
      </form>

      {/* Cloud Synchronization & Data Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isAr ? 'المزامنة السحابية والنسخ الاحتياطي' : 'Cloud Sync & Backup'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-md font-medium">
            <Check className="w-3.5 h-3.5" />
            <span>{isAr ? 'متصل بالتخزين السحابي المشفر' : 'Encrypted Cloud Storage Connected'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'يتم حفظ جدولك وسجلات مذاكرتك محلياً وسحابياً بصفة مستمرة لضمان عدم فقدان أي بيانات. يمكنك أيضاً تحميل نسخة احتياطية كاملة بصيغة JSON أو استرجاعها.'
            : 'Your schedule and study logs are continuously preserved locally and backed up. You can also manually download your entire database as a JSON file or restore from a previous backup.'}
        </p>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تصدير نسخة احتياطية (JSON)' : 'Export Backup (JSON)'}</span>
          </button>

          <label className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>{isAr ? 'استعادة نسخة احتياطية' : 'Restore Backup'}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors ms-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة تعيين للبيانات الافتراضية' : 'Reset to Demo Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
