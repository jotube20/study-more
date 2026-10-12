import React, { useState } from 'react';
import {
  Bell,
  Cloud,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  Clock,
  BookOpen,
  Volume2,
  X,
  AlertTriangle,
  Mic,
  Sun,
  Moon,
  Palette,
  LogIn,
  LogOut,
  HelpCircle,
  User,
  GraduationCap,
} from 'lucide-react';
import { NotificationItem, UserProfile, ViewTab, AppThemeColor } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { APP_THEMES, getThemeConfig } from '../utils/theme';

interface HeaderProps {
  profile: UserProfile;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenNewSessionModal: () => void;
  onChangeTab: (tab: ViewTab) => void;
  lastSyncTime: string;
  onOpenVoiceAssistant?: () => void;
  onOpenAuthModal?: () => void;
  onOpenStudentGuide?: () => void;
  onToggleColorMode?: () => void;
  onSelectThemeColor?: (color: AppThemeColor) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  notifications,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onOpenNewSessionModal,
  onChangeTab,
  lastSyncTime,
  onOpenVoiceAssistant,
  onOpenAuthModal,
  onOpenStudentGuide,
  onToggleColorMode,
  onSelectThemeColor,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;
  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const theme = getThemeConfig(profile.themeColor);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isDark = profile.colorMode === 'dark';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3 md:gap-6 max-w-7xl mx-auto">
        {/* Zone 1: Modern Study More Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onChangeTab('home')}
            className="flex items-center gap-2.5 text-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1 transition-all"
          >
            <div className={`relative p-[1.5px] rounded-xl bg-gradient-to-tr ${theme.gradientClass} shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-all`}>
              <div className="w-9 h-9 rounded-[10px] bg-slate-900 flex items-center justify-center text-white relative overflow-hidden">
                <BookOpen className="w-4 h-4 text-white relative z-10" />
                <Sparkles className="w-2.5 h-2.5 text-teal-300 absolute top-1 end-1 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Study
                </span>
                <span className={`text-xl font-black tracking-tight bg-gradient-to-r ${theme.gradientClass} bg-clip-text text-transparent`}>
                  More
                </span>
                <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${theme.badgeClass} ms-1`}>
                  PRO
                </span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {isEg ? 'ستدي مور · رفيق المذاكرة' : isAr ? 'ستدي مور · المنصة الأكاديمية' : 'Smart Academic Suite'}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Status & Quick Info */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            <Cloud className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t.syncedJustNow}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="tabular-nums font-mono text-[11px] text-slate-500 dark:text-slate-400">
              {new Date(lastSyncTime).toLocaleTimeString(isAr ? 'ar-EG' : undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-200/60 dark:border-amber-800/60">
            <span className="text-sm">🔥</span>
            <span>
              {profile.streakDays} {t.dayStreak}
            </span>
          </div>
        </div>

        {/* Zone 3: Interactive Tools, Day/Night, Colors, Guide, Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* 1. Student Guide Walkthrough Trigger */}
          {onOpenStudentGuide && (
            <button
              onClick={onOpenStudentGuide}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/70 dark:border-slate-700 transition-colors flex items-center gap-1.5"
              title={isEg ? 'شرح مفصل للطالب' : isAr ? 'دليل الطالب الأكاديمي' : 'Student Guide'}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">{t.studentGuideBtn}</span>
            </button>
          )}

          {/* 2. Vibrant Theme Color Picker Trigger */}
          {onSelectThemeColor && (
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title={isEg ? 'اختر لون التطبيق الحيوي' : isAr ? 'تخصيص لون التطبيق' : 'Theme Color'}
                aria-label="Theme Color"
              >
                <Palette className="w-4 h-4" style={{ color: theme.primaryHex }} />
              </button>

              {showThemePicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
                  <div className="absolute ltr:right-0 rtl:left-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 w-52 animate-in fade-in slide-in-from-top-2">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {isEg ? 'اختر لونك المفضل ✨' : isAr ? 'اختر لون التطبيق الحيوي' : 'Select Theme Accent:'}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(APP_THEMES) as AppThemeColor[]).map((colKey) => {
                        const cfg = APP_THEMES[colKey];
                        const isSelected = (profile.themeColor || 'blue') === colKey;
                        return (
                          <button
                            key={colKey}
                            onClick={() => {
                              onSelectThemeColor(colKey);
                              setShowThemePicker(false);
                            }}
                            className={`p-1.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'border-slate-900 dark:border-white ring-2 ring-offset-1 ring-blue-500 bg-slate-50 dark:bg-slate-700'
                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full inline-block shadow-xs"
                              style={{ backgroundColor: cfg.primaryHex }}
                            />
                            <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-300 truncate w-full">
                              {cfg.nameAr.split(' ')[0]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 3. Daylight / Night Mode Toggle */}
          {onToggleColorMode && (
            <button
              onClick={onToggleColorMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? t.dayModeLabel : t.nightModeLabel}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 hover:-rotate-12 transition-transform" />
              )}
            </button>
          )}

          {/* 4. Smart Voice Assistant Trigger */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 focus:outline-none transition-colors group"
              aria-label="المساعد الصوتي الذكي"
              title={isAr ? 'المساعد الصوتي الذكي' : 'Smart Voice Assistant'}
            >
              <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>
          )}

          {/* 5. Notification Bell with Menu */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={`التنبيهات (${unreadCount} غير مقروءة)`}
              title={isAr ? 'التنبيهات' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-4 transition-all animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {isAr ? 'التنبيهات' : 'Notifications'}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-xs font-mono tabular-nums text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                          {unreadCount} {isAr ? 'جديد' : 'new'}
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={onClearAllNotifications}
                        className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        {isAr ? 'مسح الكل' : 'Clear all'}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                        <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto mb-2 opacity-60" />
                        {isAr ? 'لا توجد تنبيهات جديدة، كل أمورك منتظمة!' : "No unread notifications. You're all caught up!"}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-lg text-xs transition-colors border ${
                            n.read
                              ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              : 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900 text-slate-900 dark:text-white font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums shrink-0">
                              {n.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1 font-normal leading-relaxed">{n.message}</p>
                          <div className="mt-2 flex items-center justify-between">
                            {n.actionLabel && (
                              <button
                                onClick={() => {
                                  setShowNotifications(false);
                                  onMarkNotificationAsRead(n.id);
                                  if (n.type === 'session') onChangeTab('focus');
                                  else if (n.type === 'exam') onChangeTab('exams');
                                  else onChangeTab('home');
                                }}
                                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                {n.actionLabel} ←
                              </button>
                            )}
                            {!n.read && (
                              <button
                                onClick={() => onMarkNotificationAsRead(n.id)}
                                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ms-auto"
                              >
                                {isAr ? 'تحديد كمقروء' : 'Mark read'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 6. Student Login & Account Menu */}
          <div className="relative">
            {profile.isLoggedIn ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                title={isEg ? 'حساب الطالب' : isAr ? 'حساب الطالب والخيارات' : 'Student Profile'}
              >
                <div
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-xs shadow-xs"
                  style={{ backgroundColor: theme.primaryHex }}
                >
                  {profile.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">
                  {profile.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all ${theme.buttonClass}`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.loginBtn}</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {showUserMenu && profile.isLoggedIn && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute ltr:right-0 rtl:left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 p-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {profile.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {profile.email || `${profile.name.toLowerCase()}@study.edu`}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onChangeTab('settings');
                      }}
                      className="w-full text-start px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>{t.navSettings}</span>
                    </button>

                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenAuthModal();
                        }}
                        className="w-full text-start px-2.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-teal-500" />
                        <span>{t.registerStudentBtn}</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-start px-2.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-2 border-t border-slate-100 dark:border-slate-700 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t.logoutBtn}</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Primary Action Button: New Session */}
          <button
            onClick={onOpenNewSessionModal}
            className={`inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all whitespace-nowrap shrink-0 ${theme.buttonClass}`}
          >
            <span>{t.newSessionBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
