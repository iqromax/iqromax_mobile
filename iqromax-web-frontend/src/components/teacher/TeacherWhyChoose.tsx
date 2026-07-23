import {
  Users2,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  Wallet,
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

/** O'qituvchilar uchun "Nega o'qituvchilar IQROMAX'ni tanlashadi?" — 6 xususiyat. */
export const TeacherWhyChoose = () => {
  const features: FeatureItem[] = [
    {
      icon: Users2,
      title: 'Guruh boshqaruvi',
      desc: "Cheksiz guruhlar oching, o'quvchilarni boshqaring va kuzating.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      fg: 'text-emerald-600',
    },
    {
      icon: CalendarCheck,
      title: 'Dars rejasi',
      desc: "Kunlik darslar va mavzularni rejalashtirib, automatik eslatma yuboring.",
      bg: 'bg-orange-100 dark:bg-orange-900/40',
      fg: 'text-orange-600',
    },
    {
      icon: ClipboardList,
      title: 'Uy vazifalari va testlar',
      desc: "Vazifa yarating, test tarqating, javoblarni avtomatik tekshiring.",
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      fg: 'text-purple-600',
    },
    {
      icon: TrendingUp,
      title: "O'quvchi progressi",
      desc: "Har bir o'quvchining bilim, vaqt va aniqlik darajasini kuzating.",
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      fg: 'text-amber-600',
    },
    {
      icon: Wallet,
      title: 'Moliyaviy nazorat',
      desc: "Daromadingiz, to'lovlar va qoldiqni real vaqtda kuzating.",
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      fg: 'text-blue-600',
    },
    {
      icon: Sparkles,
      title: 'AI yordamchi tavsiyalar',
      desc: "AI sizga eng zo'r dars rejasi va metodlarni taqdim etadi.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      fg: 'text-emerald-600',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Nega o'qituvchilar <span className="text-emerald-600">IQROMAX</span>'ni tanlashadi?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Dars berishni soddalashtiruvchi va daromadingizni oshiruvchi to'liq tizim.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {features.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-700/50 transition-all duration-200"
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
