import React, { useState, useEffect } from 'react';
import {
  User,
  LogIn,
  UserPlus,
  LogOut,
  X,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Mail,
  Palette,
  Clock,
  GraduationCap,
  Globe,
  Trash2,
} from 'lucide-react';
import { UserProfile, EducationLevel, LanguageCode, AppThemeColor, SavedAccount } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { APP_THEMES, getThemeConfig } from '../utils/theme';
import { getSavedAccounts, saveAccount, SAVED_ACCOUNTS_KEY } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onLogin: (updatedProfile: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);

  // Registration Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLevel, setNewLevel] = useState<EducationLevel>('university');
  const [newDailyGoal, setNewDailyGoal] = useState<number>(3.5);
  const [newThemeColor, setNewThemeColor] = useState<AppThemeColor>(profile.themeColor || 'blue');
  const [newLanguage, setNewLanguage] = useState<LanguageCode>(profile.language || 'ar');

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;
  const theme = getThemeConfig(profile.themeColor);

  useEffect(() => {
    if (isOpen) {
      setSavedAccounts(getSavedAccounts());
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegisterNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setErrorMsg(isEg ? 'اكتب اسمك الأول يا بطل!' : isAr ? 'يرجى إدخال اسم الطالب' : 'Please enter student name');
      return;
    }

    const emailToUse = newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s+/g, '.') || 'student'}@study.edu`;
    const newAccount: SavedAccount = {
      id: `acc-${Date.now()}`,
      name: newName.trim(),
      email: emailToUse,
      educationLevel: newLevel,
      lastLogin: new Date().toISOString(),
      themeColor: newThemeColor,
    };

    saveAccount(newAccount);

    onLogin({
      name: newName.trim(),
      email: emailToUse,
      educationLevel: newLevel,
      dailyGoalHours: newDailyGoal,
      themeColor: newThemeColor,
      language: newLanguage,
      isLoggedIn: true,
      streakDays: 1,
    });

    onClose();
  };

  const handleQuickAccountSelect = (acc: SavedAccount) => {
    saveAccount(acc);
    onLogin({
      name: acc.name,
      email: acc.email,
      educationLevel: acc.educationLevel,
      themeColor: acc.themeColor || 'blue',
      isLoggedIn: true,
    });
    onClose();
  };

  const handleSignInWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg(isEg ? 'اكتب اسمك أو إيميلك' : isAr ? 'يرجى إدخال البريد أو الاسم' : 'Please enter email/name');
      return;
    }

    const match = savedAccounts.find(
      (a) => a.email.toLowerCase() === loginEmail.trim().toLowerCase() ||
             a.name.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (match) {
      handleQuickAccountSelect(match);
    } else {
      // Create quick student session
      const newAcc: SavedAccount = {
        id: `acc-${Date.now()}`,
        name: loginEmail.includes('@') ? loginEmail.split('@')[0] : loginEmail,
        email: loginEmail.includes('@') ? loginEmail : `${loginEmail.toLowerCase()}@study.edu`,
        educationLevel: 'university',
        lastLogin: new Date().toISOString(),
        themeColor: profile.themeColor || 'blue',
      };
      saveAccount(newAcc);
      handleQuickAccountSelect(newAcc);
    }
  };

  const handleDeleteSavedAccount = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAccounts.filter((a) => a.id !== id);
    setSavedAccounts(updated);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 transition-all">
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 bg-gradient-to-r ${theme.gradientClass} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight">Study More</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  {isEg ? 'حساب الطالب' : isAr ? 'بوابة الطالب' : 'Student Portal'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {isEg
                  ? 'سجل دخولك أو سجل كطالب جديد وذاكر بذكاء!'
                  : isAr
                  ? 'تسجيل الدخول أو إنشاء حساب طالب جديد للمتابعة وحفظ الجدول'
                  : 'Sign in or register a new student account to save your study schedule'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 mt-4 p-1 bg-black/20 rounded-xl">
            <button
              onClick={() => { setMode('signin'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEg ? 'تسجيل الدخول' : isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isEg ? 'تسجيل طالب جديد ✨' : isAr ? 'تسجيل كطالب جديد ✨' : 'Register New Student'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Mode: Sign In */}
          {mode === 'signin' && (
            <div className="space-y-4">
              {/* Currently Active Status */}
              {profile.isLoggedIn && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{profile.name}</span>
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-normal">
                          ({isEg ? 'مسجل حالياً ✅' : isAr ? 'الحساب النشط حالياً' : 'Currently Active'})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {profile.email || `${profile.name.toLowerCase()}@study.edu`}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                    title={isEg ? 'تسجيل الخروج' : isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isEg ? 'خروج' : isAr ? 'خروج' : 'Log out'}</span>
                  </button>
                </div>
              )}

              {/* Saved accounts to pick from */}
              {savedAccounts.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {isEg ? 'أو اختر حساب طالب مسجل سابقاً:' : isAr ? 'الحسابات المحفوظة على هذا الجهاز:' : 'Saved Student Profiles:'}
                  </label>
                  <div className="space-y-2">
                    {savedAccounts.map((acc) => {
                      const isCurrent = profile.isLoggedIn && profile.name === acc.name;
                      return (
                        <div
                          key={acc.id}
                          onClick={() => handleQuickAccountSelect(acc)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 ring-1 ring-blue-500'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white font-bold flex items-center justify-center text-xs">
                              {acc.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {acc.name}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                {acc.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                              {isCurrent ? (isEg ? 'الحالي' : isAr ? 'نشط' : 'Active') : (isEg ? 'دخول ←' : isAr ? 'تسجيل دخول' : 'Select')}
                            </span>
                            {savedAccounts.length > 1 && (
                              <button
                                onClick={(e) => handleDeleteSavedAccount(acc.id, e)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                title="حذف من الجهاز"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Direct email sign in */}
              <form onSubmit={handleSignInWithEmail} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEg ? 'اسم الطالب أو البريد الإلكتروني:' : isAr ? 'اسم الطالب أو البريد الأكاديمي:' : 'Student Name or Email:'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={isEg ? 'مثال: سارة أحمد أو sara@study.edu' : isAr ? 'مثال: أحمد علي أو ahmed@study.edu' : 'e.g. Alex Morgan'}
                      className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${theme.buttonClass} flex items-center justify-center gap-2`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isEg ? 'دخول وحفظ الجدول' : isAr ? 'تسجيل الدخول والبدء' : 'Sign In Now'}</span>
                </button>
              </form>
            </div>
          )}

          {/* Mode: Register New Student */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterNewStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEg ? 'اسمك بالكامل (يا بطل):' : isAr ? 'اسم الطالب الكامل:' : 'Full Name:'} *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isEg ? 'مثال: عمر الشريف' : isAr ? 'مثال: نور الدين محمود' : 'Student Name'}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEg ? 'البريد أو المعرف (اختياري):' : isAr ? 'البريد الإلكتروني أو المعرّف الأكاديمي:' : 'Email or Student ID (Optional):'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
                  <input
                    type="text"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="student@study.edu"
                    className="w-full text-xs ps-9 pe-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEg ? 'المرحلة الدراسية:' : isAr ? 'المرحلة الدراسية:' : 'Education Level:'}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as EducationLevel)}
                    className="w-full text-xs px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="middle_school">{isEg ? 'إعدادي' : isAr ? 'المرحلة المتوسطة' : 'Middle School'}</option>
                    <option value="high_school">{isEg ? 'ثانوي' : isAr ? 'المرحلة الثانوية' : 'High School'}</option>
                    <option value="university">{isEg ? 'جامعة / كلية' : isAr ? 'المرحلة الجامعية' : 'University'}</option>
                    <option value="graduate">{isEg ? 'دراسات عليا / ماجستير' : isAr ? 'دراسات عليا' : 'Graduate'}</option>
                    <option value="self_learner">{isEg ? 'تطوير ذاتي حر' : isAr ? 'تعلم وتطوير ذاتي' : 'Self Learner'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isEg ? 'هدف المذاكرة اليومي:' : isAr ? 'الهدف اليومي (ساعات):' : 'Daily Goal (Hours):'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="14"
                    value={newDailyGoal}
                    onChange={(e) => setNewDailyGoal(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Language Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isEg ? 'اللهجة واللغة المفضلة للتطبيق:' : isAr ? 'لغة التطبيق واللهجة المفضلة:' : 'Language:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLanguage('eg')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                      newLanguage === 'eg'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    🇪🇬 عربي مصري
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLanguage('ar')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                      newLanguage === 'ar'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    🇸🇦 العربية الفصحى
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewLanguage('en')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all text-center ${
                      newLanguage === 'en'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              {/* Theme Color Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{isEg ? 'اختر لون التطبيق المفضل ليك (ألوان حيوية):' : isAr ? 'اختر لون التطبيق المفضل (ألوان حيوية):' : 'Choose App Accent Color:'}</span>
                  <span className="text-[11px] font-normal text-blue-600 dark:text-blue-400">
                    {APP_THEMES[newThemeColor].nameAr}
                  </span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {(Object.keys(APP_THEMES) as AppThemeColor[]).map((colKey) => {
                    const cfg = APP_THEMES[colKey];
                    const isSelected = newThemeColor === colKey;
                    return (
                      <button
                        key={colKey}
                        type="button"
                        onClick={() => setNewThemeColor(colKey)}
                        className={`h-9 rounded-xl transition-all relative flex items-center justify-center ${
                          isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-105' : 'hover:scale-102'
                        }`}
                        style={{ backgroundColor: cfg.primaryHex }}
                        title={cfg.nameAr}
                      >
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-extrabold text-white transition-all shadow-lg ${theme.buttonClass} flex items-center justify-center gap-2 mt-2`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEg ? 'إنشاء حسابي والبدء فوراً يا وحش 🚀' : isAr ? 'إنشاء حساب الطالب والبدء فوراً 🚀' : 'Register & Start Studying 🚀'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
