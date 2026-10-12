import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  Timer,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  HelpCircle,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { ViewTab, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getThemeConfig } from '../utils/theme';

interface SidebarProps {
  currentTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  profile: UserProfile;
  onOpenAuthModal?: () => void;
  onOpenStudentGuide?: () => void;
  onToggleColorMode?: () => void;
  onLogout?: () => void;
}

const EDUCATION_LEVEL_NAMES: Record<string, { ar: string; eg: string; en: string }> = {
  university: { ar: 'مرحلة جامعية', eg: 'جامعة / كلية', en: 'University' },
  high_school: { ar: 'المرحلة الثانوية', eg: 'ثانوي', en: 'High School' },
  middle_school: { ar: 'المرحلة المتوسطة', eg: 'إعدادي', en: 'Middle School' },
  graduate: { ar: 'دراسات عليا', eg: 'ماجستير / دكتوراه', en: 'Graduate' },
  self_learner: { ar: 'تطوير ذاتي', eg: 'تطوير ذاتي حر', en: 'Self Learner' },
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onChangeTab,
  collapsed,
  onToggleCollapse,
  profile,
  onOpenAuthModal,
  onOpenStudentGuide,
  onToggleColorMode,
  onLogout,
}) => {
  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;
  const theme = getThemeConfig(profile.themeColor);
  const isDark = profile.colorMode === 'dark';

  const navItems = [
    { id: 'home' as ViewTab, label: t.navHome, icon: LayoutDashboard },
    { id: 'planner' as ViewTab, label: t.navPlanner, icon: Calendar },
    { id: 'subjects' as ViewTab, label: t.navSubjects, icon: BookOpen },
    { id: 'exams' as ViewTab, label: t.navExams, icon: GraduationCap },
    { id: 'focus' as ViewTab, label: t.navFocus, icon: Timer },
    { id: 'analytics' as ViewTab, label: t.navProgress, icon: BarChart3 },
    { id: 'settings' as ViewTab, label: t.navSettings, icon: Settings },
  ];

  const levelName =
    EDUCATION_LEVEL_NAMES[profile.educationLevel]?.[isEg ? 'eg' : isAr ? 'ar' : 'en'] ||
    profile.educationLevel;

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-900 text-slate-300 ltr:border-r rtl:border-l border-slate-800 transition-all duration-200 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Section: Modern Study More Identity */}
      <div className={`p-4 flex border-b border-slate-800/80 transition-all ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
        {!collapsed ? (
          <button
            onClick={() => onChangeTab('home')}
            className="flex items-center gap-2.5 text-start group focus:outline-none"
          >
            <div className={`relative p-0.5 rounded-xl bg-gradient-to-tr ${theme.gradientClass} shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform`}>
              <div className="w-8 h-8 rounded-[10px] bg-slate-950 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-extrabold text-base text-white tracking-tight font-sans">
                  Study
                </span>
                <span className={`font-black text-base bg-gradient-to-r ${theme.gradientClass} bg-clip-text text-transparent`}>
                  More
                </span>
                <span className="text-[9px] font-bold font-mono px-1 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 ms-1">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                {isEg ? 'ستدي مور رفيقك الأكاديمي' : isAr ? 'ستدي مور الأكاديمي' : 'Smart Study Suite'}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => onChangeTab('home')}
            className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${theme.gradientClass} p-[1.5px] shadow-sm group`}
            title="Study More"
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            </div>
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? (isAr ? 'توسيع القائمة' : 'Expand') : (isAr ? 'طي القائمة' : 'Collapse')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? `${theme.buttonClass} shadow-md`
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.id === 'focus' && (
                <span className="ms-auto text-[10px] font-bold tracking-wider text-teal-300 bg-teal-950/70 border border-teal-800/50 px-1.5 py-0.5 rounded">
                  {isAr ? 'مباشر' : 'Live'}
                </span>
              )}
            </button>
          );
        })}

        {/* Student Guide in Navigation */}
        {onOpenStudentGuide && (
          <div className="pt-2 border-t border-slate-800/70">
            <button
              onClick={onOpenStudentGuide}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-teal-300 hover:bg-teal-950/40 border border-teal-800/40 transition-all ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={t.studentGuideBtn}
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-teal-400" />
              {!collapsed && <span>{t.studentGuideBtn}</span>}
            </button>
          </div>
        )}
      </nav>

      {/* Footer / Student Status & Auth Card */}
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-bold flex items-center gap-1.5 truncate max-w-[120px]">
                {profile.isLoggedIn ? profile.name : (isEg ? 'طالب زائر' : 'حساب زائر')}
              </span>
              <span className="text-amber-400 font-mono text-xs font-bold">
                🔥 {profile.streakDays} {isAr ? 'أيام' : 'd'}
              </span>
            </div>

            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((profile.dailyGoalHours / 6) * 100))}%`,
                  backgroundColor: theme.primaryHex,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
              <span>{levelName}</span>
              <span className="font-mono">{profile.dailyGoalHours}h {isAr ? 'هدف يومي' : 'target'}</span>
            </div>
          </div>

          {/* Quick Action: Log In / Out & Day/Night Toggle */}
          <div className="flex items-center justify-between gap-2 pt-1">
            {profile.isLoggedIn ? (
              <button
                onClick={onLogout}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-red-950/50 text-slate-300 hover:text-red-400 text-xs font-semibold border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
                title={t.logoutBtn}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logoutBtn}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className={`flex-1 py-1.5 px-2 rounded-lg text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${theme.buttonClass}`}
                title={t.loginBtn}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.loginBtn}</span>
              </button>
            )}

            {onToggleColorMode && (
              <button
                onClick={onToggleColorMode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                title={isDark ? t.dayModeLabel : t.nightModeLabel}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 flex flex-col items-center gap-2">
          {profile.isLoggedIn ? (
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 flex items-center justify-center text-xs font-bold transition-colors"
              title={t.logoutBtn}
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
              title={t.loginBtn}
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}

          {onToggleColorMode && (
            <button
              onClick={onToggleColorMode}
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
              title={isDark ? t.dayModeLabel : t.nightModeLabel}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
