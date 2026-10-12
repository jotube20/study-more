import { DailyQuote } from '../types';

export const DAILY_QUOTES: DailyQuote[] = [
  {
    id: 'quote-1',
    quote: 'العلم لا يُعطيك بعضه حتى تُعطيه كلك، فإذا أعطيته كلك فأنت من إعطائه البعض على وجل.',
    author: 'أبو حنيفة النعمان',
    scientificFact: 'تأثير التكرار المتباعد (Spaced Repetition): مراجعة المعلومة بعد فترات متباعدة يقلل التلاشي العصبي بنسبة 80% مقارنة بالمذاكرة المكثفة ليلة الامتحان.',
    scientificSource: 'دراسات هيرمان إبنجهاوس وعلم الأعصاب الإدراكي',
    category: 'إتقان التعلم',
  },
  {
    id: 'quote-2',
    quote: 'النجاح هو مجموع جهود صغيرة تتكرر يوماً بعد يوم.',
    author: 'روبرت كولير',
    scientificFact: 'المرونة العصبية (Neuroplasticity): كل جلسة دراسية مدتها 30 دقيقة تُحفز الدماغ لإنشاء روابط سينابسبية جديدة؛ التكرار اليومي يحول المذاكرة إلى مسار عصبي تلقائي غير مجهد.',
    scientificSource: 'أبحاث جامعة ستانفورد في العادات العصبية',
    category: 'الاستمرارية',
  },
  {
    id: 'quote-3',
    quote: 'إذا كنت لا تستطيع شرح فكرة لطفل في التاسعة، فأنت لم تفهمها بشكل حقيقي بعد.',
    author: 'ريتشارد فاينمان (عالم فيزياء نوبل)',
    scientificFact: 'تقنية فاينمان (The Feynman Technique): إعادة صياغة المفاهيم بلغة مبسطة بدون مصطلحات معقدة يكشف الفجوات المعرفية فوراً ويرفع معدل الاستيعاب بنسبة تصل إلى 90%.',
    scientificSource: 'معهد ماساتشوستس للتكنولوجيا (MIT)',
    category: 'الفهم العميق',
  },
  {
    id: 'quote-4',
    quote: 'ليس المهم أين أنت الآن، بل المهم في أي اتجاه تتحرك.',
    author: 'أوليفر وندل هولمز',
    scientificFact: 'تأثير الاسترجاع النشط (Active Recall): إغلاق الكتاب واختبار النفس ينشط القشرة الجبهية والحصين في الدماغ، مما يضاعف ثبات المعلومة 3 أضعاف القراءة السلبية.',
    scientificSource: 'مجلة Science للأبحاث الإدراكية',
    category: 'قوة الذاكرة',
  },
  {
    id: 'quote-5',
    quote: 'الوقت كالسيف إن لم تقطعه قطعك، ونفسك إن لم تشغلها بالحق شغلتك بالباطل.',
    author: 'الشافعي',
    scientificFact: 'قانون باركنسون وتقنية بومودورو: حصر وقت المذاكرة في فترات 25 أو 50 دقيقة يمنع التسويف ويحد من هرمون الكورتيزول المسبب لتشتت الانتباه.',
    scientificSource: 'أبحاث الإنتاجية الإدراكية بجامعة كامبريدج',
    category: 'إدارة الوقت',
  },
  {
    id: 'quote-6',
    quote: 'التعليم هو أقوى سلاح يمكنك استخدامه لتغيير العالم ومستقبلك.',
    author: 'نيلسون مانديلا',
    scientificFact: 'تأثير النوم في تثبيت الذاكرة: أثناء نوم حركة العين السريعة (REM)، يقوم الدماغ بتنظيم ملفات اليوم ونقل المعلومات من الذاكرة اللحظية إلى طويلة الأمد.',
    scientificSource: 'أكاديمية طب النوم الأمريكية',
    category: 'صحة الدماغ',
  },
  {
    id: 'quote-7',
    quote: 'ما لا يُبدأ اليوم لا ينتهي غداً أبداً.',
    author: 'يوهان فولفغانغ فون غوته',
    scientificFact: 'قاعدة الخمس دقائق للتغلب على التسويف: بمجرد بدء المذاكرة لمدة 5 دقائق، يفرز الدماغ مادة الدوبامين التي تدفعك للاستمرار وإكمال الجلسة بسهولة.',
    scientificSource: 'علم النفس السلوكي - هارفارد',
    category: 'كسر التسويف',
  },
  {
    id: 'quote-8',
    quote: 'أصعب ما في الأمر هو اتخاذ القرار بالبدء، وما تبقى ليس إلا إصراراً ومتابعة.',
    author: 'إميليا إيرهارت',
    scientificFact: 'أهمية شرب الماء: انخفاض ترطيب الجسم بنسبة 2% فقط يؤدي إلى هبوط التركيز وسرعة الاستيعاب بنسبة 15%، احرص على كوب ماء بجوارك دائماً.',
    scientificSource: 'الجمعية البريطانية لأبحاث التغذية الإدراكية',
    category: 'التركيز الذهني',
  },
  {
    id: 'quote-9',
    quote: 'العبقرية هي 1% إلهام و 99% عرق وجهد مستمر.',
    author: 'توماس إديسون',
    scientificFact: 'تأثير الإضاءة والأصوات المحيطية: الاستماع لأصوات الطبيعة أو موجات ألفا (Binaural Alpha Waves) يُدخل الدماغ في حالة تدفق ذهني (Flow State) خالية من المشتتات.',
    scientificSource: 'مختبرات الصوت الإدراكي - معهد ماكس بلانك',
    category: 'بيئة الدراسة',
  },
];

export function getDailyQuote(dateStr?: string): DailyQuote {
  const d = dateStr ? new Date(dateStr) : new Date();
  // Generate deterministic day index based on day of year
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}

export function getRandomQuote(excludeId?: string): DailyQuote {
  const filtered = DAILY_QUOTES.filter((q) => q.id !== excludeId);
  const random = Math.floor(Math.random() * filtered.length);
  return filtered[random] || DAILY_QUOTES[0];
}
