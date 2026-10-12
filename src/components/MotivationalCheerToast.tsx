import React, { useEffect } from 'react';
import { Sparkles, Trophy, Flame, CheckCircle2, X } from 'lucide-react';
import { MotivationalCheer } from '../types';

interface MotivationalCheerToastProps {
  cheer: MotivationalCheer | null;
  onClose: () => void;
}

export const MotivationalCheerToast: React.FC<MotivationalCheerToastProps> = ({
  cheer,
  onClose,
}) => {
  useEffect(() => {
    if (!cheer) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [cheer, onClose]);

  if (!cheer) return null;

  const isStreak = cheer.type === 'streak';

  return (
    <div className="fixed bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-md relative overflow-hidden flex items-start gap-3.5 ${
        isStreak
          ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white border-amber-400/40 shadow-amber-500/25'
          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 text-white border-blue-400/40 shadow-blue-500/25'
      }`}>
        {/* Background glow decoration */}
        <div className="absolute top-0 end-0 -mt-6 -me-6 w-28 h-28 bg-white/15 rounded-full blur-xl pointer-events-none" />

        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25">
          {isStreak ? (
            <Flame className="w-5 h-5 text-amber-200 animate-bounce" />
          ) : (
            <Sparkles className="w-5 h-5 text-teal-200 animate-spin" style={{ animationDuration: '4s' }} />
          )}
        </div>

        <div className="flex-1 pe-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-extrabold tracking-tight">
              {cheer.title}
            </h4>
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full bg-white/20 text-white">
              {isStreak ? 'Streak 🔥' : 'إنجاز رائع 🌟'}
            </span>
          </div>
          <p className="text-xs text-white/95 mt-1 font-semibold leading-relaxed">
            {cheer.message}
          </p>
          {cheer.subMessage && (
            <p className="text-[11px] text-white/80 mt-0.5 font-medium">
              {cheer.subMessage}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
