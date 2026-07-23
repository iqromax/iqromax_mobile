import { Star } from 'lucide-react';

/** "O'qituvchilarimiz nima deydi?" — 3 ta o'qituvchi testimoniallari. */
export const TeacherTestimonials = () => {
  const testimonials = [
    {
      name: 'Bahromjon Qodirov',
      role: 'Toshkent · Mental hisob trener',
      avatar: '👨‍🏫',
      rating: 5,
      text:
        "Platforma ajoyib va qulay. O'quvchilarni boshqarish, vazifalarni tarqatish nihoyatda oson. Daromadim ham tez orada oshdi.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
    {
      name: 'Madina Karimboyeva',
      role: 'Samarqand · Geometriya o\'qituvchisi',
      avatar: '👩‍🏫',
      rating: 5,
      text:
        "Oldin vaqtimni dars rejasi uchun ko'p sarflardim, endi esa hammasi avtomatik. Ko'proq o'quvchiga e'tibor qarating.",
      bg: 'bg-purple-100 dark:bg-purple-900/40',
    },
    {
      name: 'Javohir Ergashev',
      role: 'Andijon · Tez hisob coach',
      avatar: '👨‍🏫',
      rating: 5,
      text:
        "Bitta panelda guruh, dars, vazifa va daromad — hamma narsa shu yerda. Bu meni ko'p vaqtdan saqlab qoladi.",
      bg: 'bg-amber-100 dark:bg-amber-900/40',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          O'qituvchilarimiz <span className="text-emerald-600">nima deydi?</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          IQROMAX bilan ishlayotgan o'qituvchilar tajribasi haqida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((t, i) => (
          <article
            key={i}
            className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl ${t.bg}`}>
                {t.avatar}
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold text-sm sm:text-base truncate">{t.name}</div>
                <div className="text-[11px] text-muted-foreground">{t.role}</div>
              </div>
            </div>
            <div className="flex gap-0.5 mb-3">
              {[...Array(t.rating)].map((_, idx) => (
                <Star key={idx} className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
          </article>
        ))}
      </div>
    </section>
  );
};
