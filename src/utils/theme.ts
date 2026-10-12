import { AppThemeColor } from '../types';

export interface ThemeConfig {
  id: AppThemeColor;
  nameAr: string;
  nameEg: string;
  nameEn: string;
  primaryHex: string;
  secondaryHex: string;
  gradientClass: string;
  buttonClass: string;
  badgeClass: string;
  ringClass: string;
  textClass: string;
  borderClass: string;
  accentBg: string;
}

export const APP_THEMES: Record<AppThemeColor, ThemeConfig> = {
  blue: {
    id: 'blue',
    nameAr: 'أزرق ملكي (كلاسيكي)',
    nameEg: 'أزرق ملكي رايق',
    nameEn: 'Royal Blue',
    primaryHex: '#2563EB',
    secondaryHex: '#0D9488',
    gradientClass: 'from-blue-600 via-indigo-600 to-teal-500',
    buttonClass: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/25',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60',
    ringClass: 'focus:ring-blue-500 focus-visible:ring-blue-600',
    textClass: 'text-blue-600 dark:text-blue-400',
    borderClass: 'border-blue-500',
    accentBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
  },
  emerald: {
    id: 'emerald',
    nameAr: 'زمردي نابض (طاقة وحيوية)',
    nameEg: 'أخضر زمردي فريش',
    nameEn: 'Vibrant Emerald',
    primaryHex: '#059669',
    secondaryHex: '#0284C7',
    gradientClass: 'from-emerald-600 via-teal-600 to-cyan-500',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-500/25',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60',
    ringClass: 'focus:ring-emerald-500 focus-visible:ring-emerald-600',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-emerald-500',
    accentBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
  },
  violet: {
    id: 'violet',
    nameAr: 'بنفسجي كوني (إبداع وتركيز)',
    nameEg: 'بنفسجي كوزميك شيك',
    nameEn: 'Cosmic Violet',
    primaryHex: '#7C3AED',
    secondaryHex: '#EC4899',
    gradientClass: 'from-violet-600 via-purple-600 to-fuchsia-500',
    buttonClass: 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white shadow-violet-500/25',
    badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/60 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/60',
    ringClass: 'focus:ring-violet-500 focus-visible:ring-violet-600',
    textClass: 'text-violet-600 dark:text-violet-400',
    borderClass: 'border-violet-500',
    accentBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
  },
  amber: {
    id: 'amber',
    nameAr: 'كهرماني شمسي (شغف وحماس)',
    nameEg: 'كهرماني مشرق نار',
    nameEn: 'Sunset Amber',
    primaryHex: '#D97706',
    secondaryHex: '#EA580C',
    gradientClass: 'from-amber-500 via-orange-600 to-rose-500',
    buttonClass: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-amber-500/25',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60',
    ringClass: 'focus:ring-amber-500 focus-visible:ring-amber-600',
    textClass: 'text-amber-600 dark:text-amber-400',
    borderClass: 'border-amber-500',
    accentBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
  },
  rose: {
    id: 'rose',
    nameAr: 'وردي فاقع (أناقة وعصرية)',
    nameEg: 'وردي فاقع ستايل',
    nameEn: 'Electric Rose',
    primaryHex: '#E11D48',
    secondaryHex: '#9333EA',
    gradientClass: 'from-rose-600 via-pink-600 to-violet-500',
    buttonClass: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-500/25',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60',
    ringClass: 'focus:ring-rose-500 focus-visible:ring-rose-600',
    textClass: 'text-rose-600 dark:text-rose-400',
    borderClass: 'border-rose-500',
    accentBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
  },
  cyan: {
    id: 'cyan',
    nameAr: 'سماوي سيبراني (تكنولوجيا وهدوء)',
    nameEg: 'سماوي سيبراني جامد',
    nameEn: 'Cyber Cyan',
    primaryHex: '#0891B2',
    secondaryHex: '#2563EB',
    gradientClass: 'from-cyan-600 via-sky-600 to-indigo-500',
    buttonClass: 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white shadow-cyan-500/25',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200/60 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800/60',
    ringClass: 'focus:ring-cyan-500 focus-visible:ring-cyan-600',
    textClass: 'text-cyan-600 dark:text-cyan-400',
    borderClass: 'border-cyan-500',
    accentBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
  },
};

export function getThemeConfig(theme?: AppThemeColor): ThemeConfig {
  if (!theme || !APP_THEMES[theme]) {
    return APP_THEMES.blue;
  }
  return APP_THEMES[theme];
}
