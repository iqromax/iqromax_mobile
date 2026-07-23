import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  bg: string;
  fg: string;
}

/**
 * "Nega ota-onalar IQROMAX'ni tanlashadi?" — 6 ta xususiyat
 * 3 ustunli grid, har bir karta o'ziga xos pastel rangda.
 */
export const ParentWhyChoose = () => {
  const features: FeatureItem[] = [
    {
      icon: BarChart3,
      title: 'Kunlik nazorat',
      desc: "Farzandingizning kundalik mashqlari va natijalarini har soniyada kuzating.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      fg: 'text-emerald-600',
    },
    {
      icon: TrendingUp,
      title: 'Batafsil tahlil',
      desc: "Aniq grafiklar va statistikalar bilan rivojlanishni kuzating.",
      bg: 'bg-orange-100 dark:bg-orange-900/40',
      fg: 'text-orange-600',
    },
    {
      icon: MessageSquare,
      title: "O'qituvchi fikri",
      desc: "Trener va o'qituvchidan haftalik baho va izoh oling.",
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      fg: 'text-purple-600',
    },
    {
      icon: ClipboardList,
      title: 'Uy vazifalari nazorati',
      desc: "Bajarilgan va bajarilmagan vazifalar bo'yicha xabar oling.",
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      fg: 'text-blue-600',
    },
    {
      icon: ShieldCheck,
      title: 'Xavfsizlik va maxfiylik',
      desc: "Ma'lumotlar shifrlangan va faqat sizga ko'rinadi.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      fg: 'text-emerald-600',
    },
    {
      icon: Sparkles,
      title: 'AI tavsiyalari',
      desc: "Sun'iy intellekt farzandingizga shaxsiy tavsiyalar beradi.",
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      fg: 'text-amber-600',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Nega ota-onalar <span className="text-orange-500">IQROMAX</span>'ni tanlashadi?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Farzandingizning bilim olishi va rivojlanishi uchun barcha kerakli vositalar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 hover:shadow-lg hover:border-orange-200 dark:hover:border-orange-700/50 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
              <f.icon className={`h-5 w-5 ${f.fg}`} />
            </div>
            <h3 className="font-display font-bold text-base sm:text-lg mb-2">{f.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
