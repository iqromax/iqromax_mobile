import { GraduationCap, Users2, BookOpen, Smile } from 'lucide-react';

/** Yashil tema 4 ustunli platforma stats. */
export const TeacherTrustStats = () => {
  const stats = [
    { icon: GraduationCap, value: '500+', label: "Faol o'qituvchilar", color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' },
    { icon: Users2, value: '10 000+', label: "O'quvchilar", color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40' },
    { icon: BookOpen, value: '200+', label: 'Kurslar', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40' },
    { icon: Smile, value: '96%', label: 'Qoniqish darajasi', color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' },
  ];

  return (
    <section>
      <div className="rounded-2xl bg-card/90 backdrop-blur-sm border border-emerald-200/40 dark:border-emerald-700/30 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-emerald-200/40 dark:divide-emerald-700/30 shadow-sm">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center justify-center gap-3 px-4 py-4 sm:py-5">
            <div className={`flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-display font-black leading-tight">{s.value}</div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
