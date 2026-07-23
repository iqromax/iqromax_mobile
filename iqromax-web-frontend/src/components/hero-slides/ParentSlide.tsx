import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Check,
  Eye,
  TrendingUp,
  BarChart3,
  Award,
  Shield,
} from 'lucide-react';
import photoParentHijab from '@/assets/photo-parent-hijab.jpg';

/** 3-slide — Ota-onalar uchun (oranj). */
export const ParentSlide = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-100/40 dark:from-orange-950/40 dark:via-background dark:to-amber-900/30 text-gray-900 dark:text-foreground">
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-orange-300/30 dark:bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-amber-200/30 dark:bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 px-5 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-orange-500 text-white mb-5 sm:mb-6 shadow-md shadow-orange-500/25">
            <Eye className="h-3.5 w-3.5" />
            OTA-ONALAR UCHUN
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]">
              Farzandingiz rivojini
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-orange-500 dark:text-orange-400">
              nazorat qiling
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-7 max-w-md">
            IQROMAX orqali farzandingizning o'quv jarayoni, natijalari va progressini real vaqtda kuzatib boring.
          </p>

          <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-7">
            {[
              "Kunlik mashg'ulotlar va natijalarni kuzatish",
              'Real vaqt rejimida progress va statistikalar',
              "Tavsiyalar va rivojlantirish yo'nalishlari",
              'Motivatsiya va yutuqlar tizimi',
              'Xavfsiz va ishonchli muhit',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-sm sm:text-base">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700 flex items-center justify-center">
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-orange-500 dark:text-orange-400 stroke-[3]" />
                </span>
                <span className="font-medium leading-snug">{t}</span>
              </li>
            ))}
          </ul>

          <div>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 h-12 sm:h-14 px-6 sm:px-7 rounded-full text-sm sm:text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
            >
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Natijalarni ko'rish
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 flex items-end justify-start lg:justify-center">
            <div className="relative h-[80%] w-auto aspect-[4/5] rounded-3xl overflow-hidden">
              <img src={photoParentHijab} alt="Ota-ona va bola" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="absolute top-2 right-0 w-64 bg-white dark:bg-card rounded-2xl p-3 shadow-2xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-base">🧑</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-gray-900 dark:text-foreground truncate">Asadbek Abduazizov</div>
                <div className="text-[10px] text-orange-500 font-semibold">Level 7</div>
              </div>
              <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Award className="h-3 w-3 text-purple-600" />
              </div>
            </div>
            <div className="text-[9px] text-gray-500 mb-2">850 / 1200 XP</div>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { v: '12', l: 'Kurslar' },
                { v: '2350', l: 'XP' },
                { v: '75%', l: 'Progress' },
                { v: '15', l: 'Kunlik' },
              ].map((s, i) => (
                <div key={i} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg py-1.5">
                  <div className="text-xs font-display font-black text-orange-500">{s.v}</div>
                  <div className="text-[8px] text-gray-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-44 right-0 w-56 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Haftalik progress</div>
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <svg viewBox="0 0 140 50" className="w-full h-12">
              <path
                d="M 5 42 L 25 38 L 45 32 L 65 26 L 85 18 L 105 12 L 130 5"
                fill="none"
                stroke="rgb(249 115 22)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {[5, 25, 45, 65, 85, 105, 130].map((x, i) => {
                const yMap = [42, 38, 32, 26, 18, 12, 5];
                return <circle key={i} cx={x} cy={yMap[i]} r="2" fill="rgb(249 115 22)" />;
              })}
            </svg>
            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
              <span>Du</span>
              <span>Se</span>
              <span>Ch</span>
              <span>Pa</span>
              <span>Ju</span>
              <span>Sh</span>
              <span>Ya</span>
            </div>
          </div>

          <div className="absolute bottom-24 right-0 w-60 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">So'nggi faoliyat</div>
              <span className="text-[9px] text-orange-500 font-semibold">Barchasi</span>
            </div>
            <ul className="space-y-1.5">
              {[
                { ic: '✖️', t: "Ko'paytirish qoidalari", s: 'Dars tugallandi', p: '92%', cl: 'bg-purple-100 text-purple-600' },
                { ic: '⚡', t: 'Tez hisoblash – 1-daraja', s: 'Mashq bajarildi', p: '85%', cl: 'bg-amber-100 text-amber-600' },
              ].map((row, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={`flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-xs ${row.cl}`}>
                    {row.ic}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-gray-900 dark:text-foreground truncate">{row.t}</div>
                    <div className="text-[9px] text-gray-500">{row.s}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600">{row.p}</span>
                  <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-3 left-2 w-44 bg-white dark:bg-card rounded-xl p-2 shadow-lg border border-gray-100 dark:border-border/50 flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold leading-tight">Xavfsiz va ishonchli</div>
              <div className="text-[8px] text-gray-500 leading-tight">Bolalaringiz uchun 100% xavfsiz muhit</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
