import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  GraduationCap,
  Timer,
  BarChart3,
  Settings,
} from 'lucide-react';
import { ViewTab, UserProfile } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { getThemeConfig } from '../utils/theme';

interface MobileNavProps {
  currentTab: ViewTab;
  onChangeTab: (tab: ViewTab) => void;
  profile: UserProfile;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onChangeTab,
  profile,
}) => {
  const isAr = profile.language === 'ar' || profile.language === 'eg';
  const isEg = profile.language === 'eg';
  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.ar;
  const theme = getThemeConfig(profile.themeColor);

  const items = [
    { id: 'home' as ViewTab, label: t.navHome, icon: LayoutDashboard },
    { id: 'planner' as ViewTab, label: t.navPlanner, icon: Calendar },
    { id: 'focus' as ViewTab, label: t.navFocus, icon: Timer },
    { id: 'exams' as ViewTab, label: isEg ? 'الامتحانات' : isAr ? 'الامتحانات' : 'Exams', icon: GraduationCap },
    { id: 'subjects' as ViewTab, label: isEg ? 'المواد' : isAr ? 'المواد' : 'Subjects', icon: BookOpen },
    { id: 'settings' as ViewTab, label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg transition-colors">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                isActive ? `${theme.textClass} font-bold` : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? theme.accentBg : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="truncate mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
