import { Users, Eye, BarChart3, Star } from 'lucide-react';

/**
 * Hero ostidagi platforma statistikasi qatori (4 ustun).
 */
export const ParentTrustStats = () => {
  const stats = [
    {
      icon: Users,
      value: '10 000+',
      label: 'Ota-onalar',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40',
    },
    {
      icon: Eye,
      value: '20 000+',
      label: 'Kuzatilayotgan bolalar',
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40',
    },
    {
      icon: BarChart3,
      value: '96%',
      label: 'Faol ota-onalar',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/40',
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Reyting',
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/40',
    },
  ];

  return (
    <section>
      <div className="rounded-2xl bg-card/90 backdrop-blur-sm border border-orange-200/40 dark:border-orange-700/30 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-orange-200/40 dark:divide-orange-700/30 shadow-sm">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center justify-center gap-3 px-4 py-4 sm:py-5">
            <div className={`flex-shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-display font-black leading-tight">
                {s.value}
              </div>
              <div className="text-[11px] sm:text-xs text-muted-foreground leading-tight">
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
