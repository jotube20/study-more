import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  BookOpen,
  FileText,
  Clock,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudySession, Subject, StudyLog, UserProfile } from '../types';
import {
  AmbientSoundType,
  playCompletionChime,
  startAmbientSound,
  stopAmbientSound,
} from '../utils/audioSynth';
import { formatDuration } from '../utils/scheduler';
import { TRANSLATIONS } from '../utils/translations';

interface FocusModeViewProps {
  profile?: UserProfile;
  activeSession: StudySession | null;
  subjects: Subject[];
  onFinishSession: (session: StudySession, actualDurationMinutes: number, notes: string) => void;
  onExitFocus: () => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  profile,
  activeSession,
  subjects,
  onFinishSession,
  onExitFocus,
}) => {
  const isAr = (profile?.language || 'ar') === 'ar';
  const t = TRANSLATIONS[profile?.language || 'ar'] || TRANSLATIONS.ar;

  const initialDuration = activeSession ? activeSession.durationMinutes : 25;
  const [totalSeconds, setTotalSeconds] = useState(initialDuration * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(initialDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionNotes, setSessionNotes] = useState(activeSession?.notes || '');
  const [selectedAmbient, setSelectedAmbient] = useState<AmbientSoundType>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.4);
  const [completedTopicsChecklist, setCompletedTopicsChecklist] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedSecondsRef = useRef<number>(0);

  const subject = subjects.find((s) => s.id === activeSession?.subjectId);

  // Timer loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          elapsedSecondsRef.current += 1;
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Handle ambient audio
  useEffect(() => {
    if (isRunning && selectedAmbient !== 'none') {
      startAmbientSound(selectedAmbient, ambientVolume);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isRunning, selectedAmbient, ambientVolume]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = (minutes: number) => {
    setIsRunning(false);
    stopAmbientSound();
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
    elapsedSecondsRef.current = 0;
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    stopAmbientSound();
    playCompletionChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    const actualMinutes = Math.max(1, Math.round(elapsedSecondsRef.current / 60));

    if (activeSession) {
      onFinishSession(activeSession, actualMinutes, sessionNotes);
    } else {
      const fallback: StudySession = {
        id: `sess-${Date.now()}`,
        subjectId: subjects[0]?.id || 'sub-1',
        topic: isAr ? 'جلسة تركيز دراسية' : 'Focused Study Session',
        date: new Date().toISOString().split('T')[0],
        startTime: '12:00',
        endTime: '12:30',
        durationMinutes: actualMinutes,
        priority: 'medium',
        status: 'completed',
        actualDurationMinutes: actualMinutes,
        notes: sessionNotes,
      };
      onFinishSession(fallback, actualMinutes, sessionNotes);
    }
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    setCompletedTopicsChecklist([...completedTopicsChecklist, newTopicInput.trim()]);
    setNewTopicInput('');
  };

  // Time format calculations
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = 440 - 440 * progressRatio;

  return (
    <div
      className={`min-h-[82vh] rounded-2xl bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Bar: Back & Session Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopAmbientSound();
              onExitFocus();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors p-1"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{t.exitFocus}</span>
          </button>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: subject?.color || '#3B82F6' }}
            />
            <span className="text-xs font-semibold text-slate-300">
              {subject?.name || t.generalStudy}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            {isRunning ? (isAr ? 'الجلسة نشطة ومؤقتة' : 'Session Active') : (isAr ? 'موقوف مؤقتاً' : 'Paused')}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? (isAr ? 'إنهاء وضع ملء الشاشة' : 'Exit full screen') : (isAr ? 'وضع ملء الشاشة' : 'Full screen')}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Center Area: Circular Timer & Sound Bar */}
      <div className="flex flex-col items-center justify-center py-8 my-auto space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
            {activeSession?.topic || (isAr ? 'جلسة تركيز واستيعاب عميق' : 'Deep Work Study Session')}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {isAr ? 'المدة المخططة' : 'Planned Duration'}: {formatDuration(totalSeconds / 60, profile?.language || 'ar')}
          </p>
        </div>

        {/* Circular SVG Timer */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-800"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={subject?.color || '#2563EB'}
              strokeWidth="6"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Centered Digital Clock readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-6xl font-bold font-mono tabular-nums tracking-tighter text-white">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase">
              {isRunning ? (isAr ? 'تركيز وانتباه' : 'Concentrating') : (isAr ? 'جاهز للبدء' : 'Ready')}
            </span>
          </div>
        </div>

        {/* Timer Presets Selection */}
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[
            { label: t.pomodoro, mins: 25 },
            { label: t.deepWork, mins: 50 },
            { label: t.shortBreak, mins: 5 },
            { label: t.longBreak, mins: 15 },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => resetTimer(preset.mins)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                totalSeconds === preset.mins * 60
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            title={isRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'بدء' : 'Start')}
          >
            {isRunning ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ms-0.5" />
            )}
          </button>

          <button
            onClick={() => resetTimer(totalSeconds / 60)}
            className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
            title={isAr ? 'إعادة ضبط المؤقت' : 'Reset Timer'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleCompleteSession}
            className="px-4 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.finishAndLog}</span>
          </button>
        </div>

        {/* Ambient Sound Generator Panel */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Volume2 className="w-4 h-4 text-blue-400" />
            <span>{t.ambientSound}:</span>
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: 'none', label: isAr ? 'إيقاف' : 'Off' },
              { id: 'rain', label: isAr ? '🌧️ صوت المطر' : '🌧️ Rain' },
              { id: 'white_noise', label: isAr ? '💨 ضجيج أبيض' : '💨 White Noise' },
              { id: 'binaural_alpha', label: isAr ? '🧠 موجات ألفا' : '🧠 Alpha Beats' },
              { id: 'deep_stream', label: isAr ? '🌊 صوت الأمواج' : '🌊 Stream' },
            ].map((amb) => (
              <button
                key={amb.id}
                onClick={() => setSelectedAmbient(amb.id as AmbientSoundType)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedAmbient === amb.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {amb.label}
              </button>
            ))}
          </div>

          {selectedAmbient !== 'none' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">{isAr ? 'الصوت:' : 'Vol:'}</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                className="w-16 accent-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tray: Notes & Completed Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/80 pt-4 text-xs">
        {/* Notes */}
        <div className="space-y-1">
          <label className="text-slate-400 font-semibold flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{t.sessionNotes}</span>
          </label>
          <textarea
            rows={2}
            placeholder={isAr ? 'اكتب المعادلات الهامة، القوانين، أو الملاحظات التي ترغب بمراجعتها لاحقاً...' : 'Write key equations, formulas, or things to review next time...'}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Covered topics */}
        <div className="space-y-1">
          <label className="text-slate-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.checkTopicsCompleted}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={isAr ? 'مثال: مفردات الوحدة 4، حل التمارين 1-5...' : 'e.g. Chapter 4 vocab, exercises 1-5...'}
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTopic();
                }
              }}
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-slate-200 text-xs focus:outline-none"
            />
            <button
              onClick={handleAddTopic}
              className="px-3 py-1.5 bg-slate-800 text-slate-200 hover:text-white rounded-md font-medium"
            >
              {isAr ? 'إضافة' : 'Add'}
            </button>
          </div>
          {completedTopicsChecklist.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {completedTopicsChecklist.map((top, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-teal-950/70 border border-teal-800/60 text-teal-300 text-[11px]"
                >
                  ✓ {top}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
