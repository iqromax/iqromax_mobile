import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  PlayCircle,
  Eye,
  TrendingUp,
  Award,
  Check,
  Bell,
} from 'lucide-react';
import photoParentHijab from '@/assets/photo-parent-hijab.jpg';

interface ParentHeroProps {
  childName?: string;
  level?: number;
  totalXp?: number;
  weeklyAccuracy?: number;
  coursesCount?: number;
  todayProgressPct?: number;
  streak?: number;
}

/**
 * Ota-ona sahifasi uchun katta hero — reference dizayniga moslangan.
 * Chap tomonda: badge, sarlavha, qisqa tavsif, 2 tugma.
 * O'ng tomonda: oila rasmi + floating profil va haftalik progress kartalari.
 */
export const ParentHero = ({
  childName = 'Asadbek Abduazizov',
  level = 7,
  totalXp = 2350,
  weeklyAccuracy = 75,
  coursesCount = 12,
  todayProgressPct = 75,
  streak = 15,
}: ParentHeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-white dark:from-orange-950/30 dark:via-amber-950/20 dark:to-background border border-orange-100/60 dark:border-orange-900/30 shadow-sm">
      {/* Decorativ glow */}
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-orange-300/30 dark:bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-amber-200/30 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 px-5 sm:px-8 md:px-10 lg:px-14 py-8 sm:py-10 md:py-14">
        {/* CHAP — matn */}
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500 text-white mb-5 sm:mb-6 shadow-md shadow-orange-500/25">
            <Eye className="h-3.5 w-3.5" />
            OTA-ONA UCHUN
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem]">
              Farzandingiz natijasini real
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] text-orange-500 dark:text-orange-400">
              vaqtda kuzating
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
            IQROMAX orqali farzandingizning o'quv jarayoni, darslarini ko'rishi,
            kunlik mashqlari va yutuqlaringizni bitta panelda kuzating.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              size="lg"
              onClick={() => navigate('/statistics')}
              className="gap-2 h-12 sm:h-13 px-6 sm:px-7 rounded-full text-sm sm:text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
            >
              Natijalarni ko'rish
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/lesson-stats')}
              className="gap-2 h-12 sm:h-13 px-5 sm:px-6 rounded-full text-sm sm:text-base font-bold bg-white dark:bg-card border-2"
            >
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
              Demo ko'rish
            </Button>
          </div>

          {/* Pastki micro-pills */}
          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
            {[
              { ic: <Check className="h-3 w-3 stroke-[3]" />, t: 'Real vaqt nazorat', cl: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-700/40' },
              { ic: <Check className="h-3 w-3 stroke-[3]" />, t: 'Istalgan vaqtda kirish', cl: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200/60 dark:border-orange-700/40' },
              { ic: <Check className="h-3 w-3 stroke-[3]" />, t: '100% xavfsiz', cl: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-700/40' },
            ].map((p, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border ${p.cl}`}>
                {p.ic} {p.t}
              </span>
            ))}
          </div>
        </div>

        {/* O'NG — Rasm + floating kartalar */}
        <div className="relative min-h-[420px] lg:min-h-[480px]">
          {/* Family photo */}
          <div className="absolute inset-0 flex items-end justify-center lg:justify-end">
            <div className="relative h-full w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={photoParentHijab}
                alt="Ota-ona va bola"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Profile card (yuqori-o'ng) */}
          <div className="absolute top-3 -right-1 sm:right-2 lg:right-0 w-[260px] sm:w-72 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-base shadow">
                🧑
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-900 dark:text-foreground truncate">
                  {childName}
                </div>
                <div className="text-[10px] text-orange-500 font-semibold flex items-center gap-1">
                  <Award className="h-3 w-3" /> Level {level}
                </div>
              </div>
              <div className="h-7 w-7 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <Bell className="h-3.5 w-3.5 text-orange-600" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { v: coursesCount, l: 'Kurslar' },
                { v: totalXp, l: 'XP' },
                { v: `${todayProgressPct}%`, l: 'Progress' },
                { v: streak, l: 'Kunlik' },
              ].map((s, i) => (
                <div key={i} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg py-1.5 px-1">
                  <div className="text-[13px] sm:text-sm font-display font-black text-orange-500 leading-tight">
                    {s.v}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Haftalik progress card (pastki-chap) */}
          <div className="absolute bottom-2 -left-1 sm:left-2 lg:left-0 w-[260px] sm:w-72 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-gray-900 dark:text-foreground">
                Haftalik progress
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> +{Math.max(weeklyAccuracy - 60, 5)}%
              </span>
            </div>
            <svg viewBox="0 0 200 60" className="w-full h-14">
              <defs>
                <linearGradient id="parentHeroGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 5 50 L 35 44 L 65 36 L 95 28 L 125 20 L 155 14 L 195 6"
                fill="none"
                stroke="rgb(249 115 22)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 5 50 L 35 44 L 65 36 L 95 28 L 125 20 L 155 14 L 195 6 L 195 60 L 5 60 Z"
                fill="url(#parentHeroGrad)"
              />
              {[
                { x: 5, y: 50 },
                { x: 35, y: 44 },
                { x: 65, y: 36 },
                { x: 95, y: 28 },
                { x: 125, y: 20 },
                { x: 155, y: 14 },
                { x: 195, y: 6 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="rgb(249 115 22)" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
              {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
