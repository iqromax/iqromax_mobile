import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Star,
  Award,
  ArrowRight,
  Bell,
  Calendar,
  ChevronRight,
} from 'lucide-react';

interface WeakTopic {
  name: string;
  level: string;
  value: number;
  color: string;
}

interface ParentRecommendationsProps {
  weakTopics?: WeakTopic[];
}

/**
 * "Farzandingiz uchun shaxsiy tavsiyalar" — ikki ustunli bo'lim:
 *  - chap: Zaif mavzular (progress bar bilan) + Keying maqsadlar
 *  - o'ng: Yutuqlar + Eslatmalar
 */
export const ParentRecommendations = ({
  weakTopics = [
    { name: 'Ingliz tili', level: 'Boshlang\'ich', value: 65, color: 'bg-emerald-500' },
    { name: 'Matematika - Geometriya', level: "O'rta", value: 60, color: 'bg-orange-500' },
    { name: 'Mantiqiy fikrlash mashqlari', level: 'Murakkab', value: 80, color: 'bg-purple-500' },
  ],
}: ParentRecommendationsProps) => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Farzandingiz uchun <span className="text-orange-500">shaxsiy tavsiyalar</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          AI tahlili asosida farzandingizning rivojlanishini tezlashtiradigan yo'nalishlar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CHAP — Zaif mavzular + Keying maqsadlar */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-base sm:text-lg">Zaif mavzular</h3>
              <button className="text-[11px] text-orange-500 font-semibold inline-flex items-center gap-1 hover:text-orange-600">
                Hammasi <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-4">
              {weakTopics.map((t, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{t.name}</div>
                      <div className="text-[10px] text-muted-foreground">{t.level}</div>
                    </div>
                    <div className="text-sm font-display font-black">{t.value}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/courses')}
              className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl gap-2"
            >
              Mashg'ulot boshlash
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Keying maqsadlar */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 shadow-sm">
            <h3 className="font-display font-bold text-base sm:text-lg mb-3">Keying maqsadlar</h3>
            <ul className="space-y-2.5">
              {[
                { ic: '🎯', t: "Kunlik 30 daqiqa mashg'ulot" },
                { ic: '📚', t: "Geometriya bo'yicha 5 dars tugatish" },
                { ic: '🏆', t: 'Haftalik 100 ta savolni yechish' },
              ].map((g, i) => (
                <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                  <span className="text-base">{g.ic}</span>
                  <span className="text-xs sm:text-sm font-medium flex-1">{g.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* O'NG — Yutuqlar + Eslatmalar */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-base sm:text-lg">Yutuqlar</h3>
              <span className="text-[11px] text-muted-foreground">Erishilgan</span>
            </div>
            <ul className="space-y-3">
              {[
                {
                  ic: Trophy,
                  t: 'Matematika ustasi',
                  d: '50 ta to\'g\'ri javob ketma-ket',
                  bg: 'bg-amber-100 dark:bg-amber-900/40',
                  fg: 'text-amber-600',
                },
                {
                  ic: Star,
                  t: 'Tez hisoblash champion',
                  d: '10 daqiqa ichida 30 ta savol',
                  bg: 'bg-purple-100 dark:bg-purple-900/40',
                  fg: 'text-purple-600',
                },
                {
                  ic: Award,
                  t: "Faol o'quvchi",
                  d: '15 kunlik streak',
                  bg: 'bg-emerald-100 dark:bg-emerald-900/40',
                  fg: 'text-emerald-600',
                },
              ].map((row, i) => (
                <li key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary/30">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${row.bg}`}>
                    <row.ic className={`h-5 w-5 ${row.fg}`} fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{row.t}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{row.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Eslatmalar */}
          <div className="rounded-2xl bg-card border border-border/40 p-5 sm:p-6 shadow-sm">
            <h3 className="font-display font-bold text-base sm:text-lg mb-3">Eslatmalar</h3>
            <ul className="space-y-2.5">
              {[
                {
                  ic: Bell,
                  t: 'Ingliz tili darsi (bugun 18:00)',
                  cl: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600',
                },
                {
                  ic: Calendar,
                  t: 'Matematika imtihoni (ertaga 10:00)',
                  cl: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600',
                },
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-orange-50/50 dark:bg-orange-900/10">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.cl}`}>
                    <r.ic className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium flex-1">{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
