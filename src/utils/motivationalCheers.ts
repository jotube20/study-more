import { LanguageCode, MotivationalCheer } from '../types';

export const TASK_CHEERS_EG: { title: string; message: string; subMessage: string }[] = [
  {
    title: 'عاش يا بطل! 💪',
    message: 'خلصت المهمة دي وباقي حلمك بيقرب خطوة كبيرة!',
    subMessage: 'كمل بنفس الحماس، مفيش حاجة توقفك النهاردة!',
  },
  {
    title: 'الله ينور عليك يا وحش! 🔥',
    message: 'تسلم إيدك يا برنس، إنجاز يرفع الراس!',
    subMessage: 'خطوة جبارة في طريق النجاح والتفوق الأكاديمي.',
  },
  {
    title: 'شاطر جداً يا فنان! 🌟',
    message: 'مهمة كمان في جيبك، فخورين بيك والله!',
    subMessage: 'كدة المجموع العالي والامتياز بينادي عليك.',
  },
  {
    title: 'يا سيدي على الشطارة! 🚀',
    message: 'ماشي زي الصاروخ وعينك على الهدف!',
    subMessage: 'كل مهمة بتخلصها بتفتحلك باب جديد للتفوق.',
  },
  {
    title: 'جامد جداً والله! 👏',
    message: 'ولا تشيل هم، أنت قدها وقدود!',
    subMessage: 'استمر بنفس الطاقة الإيجابية يا بطل.',
  },
];

export const TASK_CHEERS_AR: { title: string; message: string; subMessage: string }[] = [
  {
    title: 'أحسنت صنعاً ومبارك الإنجاز! 🌟',
    message: 'خطوة مباركة تقربك من قمة التفوق والتميز.',
    subMessage: 'العلم يُنال بالصبر والمثابرة وأنت تثبت ذلك كل يوم.',
  },
  {
    title: 'إنجاز رائع ومتقن! 🚀',
    message: 'بارك الله في همتك وجدّك يا بطل.',
    subMessage: 'كل جهد تبذله اليوم هو استثمار في مستقبلك المشرق.',
  },
  {
    title: 'رائع جداً، استمر في التألق! ✨',
    message: 'المستقبل ينتظر الواثقين والمجتهدين مثلك.',
    subMessage: 'قوة الإرادة هي سر كل إنجاز عظيم.',
  },
  {
    title: 'خطوة جديدة نحو الامتياز! 🏆',
    message: 'لقد أكملت المهمة بكفاءة عالية، فخورون بجهدك!',
    subMessage: 'استمر في المسير ولا تتراجع.',
  },
];

export const TASK_CHEERS_EN: { title: string; message: string; subMessage: string }[] = [
  {
    title: 'Awesome Job! Crushed it! 🔥',
    message: 'You completed this task with flying colors.',
    subMessage: 'One step closer to your academic dreams!',
  },
  {
    title: 'Unstoppable Momentum! 🚀',
    message: 'Great focus and dedication paying off right now.',
    subMessage: 'Keep up the incredible consistency!',
  },
  {
    title: 'Proud of Your Effort! 🌟',
    message: 'Every checked task builds your path to excellence.',
    subMessage: 'Stay locked in and celebrate your win!',
  },
];

export function getRandomTaskCheer(lang: LanguageCode): MotivationalCheer {
  let list = TASK_CHEERS_AR;
  if (lang === 'eg') {
    list = TASK_CHEERS_EG;
  } else if (lang === 'en') {
    list = TASK_CHEERS_EN;
  }

  const selected = list[Math.floor(Math.random() * list.length)];
  return {
    id: `cheer-${Date.now()}`,
    type: 'task',
    title: selected.title,
    message: selected.message,
    subMessage: selected.subMessage,
  };
}

export function getStreakCheer(streakDays: number, lang: LanguageCode): MotivationalCheer {
  if (lang === 'eg') {
    return {
      id: `streak-${Date.now()}`,
      type: 'streak',
      title: `🔥 استمرارية أسطورية: ${streakDays} أيام ورا بعض!`,
      message: 'يا سلام على الالتزام! كدة مفيش أي مادة تقف قدامك يا بطل.',
      subMessage: 'عاش وحوش المذاكرة.. خليك مكمل على نفس العهد!',
      streakCount: streakDays,
    };
  }

  if (lang === 'en') {
    return {
      id: `streak-${Date.now()}`,
      type: 'streak',
      title: `🔥 Brilliant ${streakDays}-Day Study Streak!`,
      message: 'Consistency is your superpower. Your dedication is inspiring!',
      subMessage: 'Keep the fire burning every single day!',
      streakCount: streakDays,
    };
  }

  return {
    id: `streak-${Date.now()}`,
    type: 'streak',
    title: `🔥 استمرارية بطولية: ${streakDays} أيام متواصلة!`,
    message: 'الاستمرار سر التفوق. كل يوم تدرسه يصنع فارقاً حقيقياً في مستقبلك.',
    subMessage: 'نحيي عزيمتك وانضباطك الاستثنائي في الدراسة.',
    streakCount: streakDays,
  };
}
