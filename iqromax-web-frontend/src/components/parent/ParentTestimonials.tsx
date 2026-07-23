import { Star } from 'lucide-react';

/**
 * "Ota-onalarimiz fikri" — 3 ta testimonial kartochka.
 */
export const ParentTestimonials = () => {
  const testimonials = [
    {
      name: 'Malika Rahimova',
      role: 'Toshkent',
      avatar: '🧕',
      rating: 5,
      text:
        "IQROMAX orqali farzandimning har bir o'quv yutug'ini real vaqtda kuzata olaman. Tavsiyalar juda foydali!",
      bg: 'bg-orange-100 dark:bg-orange-900/40',
    },
    {
      name: 'Javohir To\'xtayev',
      role: 'Samarqand',
      avatar: '👨',
      rating: 5,
      text:
        "Doim o'g'limni yangilashlar haqida xabardor bo'lib turaman. Endi unga to'g'ri yo'nalish ko'rsatish ancha oson.",
      bg: 'bg-purple-100 dark:bg-purple-900/40',
    },
    {
      name: 'Shahnoza Ismoilova',
      role: 'Andijon',
      avatar: '🧕',
      rating: 5,
      text:
        "O'qituvchining haftalik fikri — eng zo'r imkoniyat! Farzandimning kuchli va zaif tomonlarini bilib olaman.",
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Ota-onalarimiz <span className="text-orange-500">fikri</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          IQROMAX orqali farzandlarining rivojlanishini kuzatayotgan ota-onalar bilan tanishing.
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
