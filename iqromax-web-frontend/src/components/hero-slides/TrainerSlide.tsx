import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Check,
  PlayCircle,
  Users2,
  FolderKanban,
  Briefcase,
  Quote,
} from 'lucide-react';
import photoTrainerHijab from '@/assets/photo-trainer-hijab.jpg';

/** 2-slide — Trenerlar uchun. */
export const TrainerSlide = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 dark:from-emerald-950/40 dark:via-background dark:to-emerald-900/30 text-gray-900 dark:text-foreground">
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-emerald-300/30 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-emerald-200/30 dark:bg-emerald-400/5 blur-3xl pointer-events-none" />

      <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 px-5 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-purple-500 text-white mb-5 sm:mb-6 shadow-md shadow-purple-500/25">
            <Briefcase className="h-3.5 w-3.5" />
            TRENERLAR UCHUN
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]">
              Trener bo'lib
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-emerald-600 dark:text-emerald-400">
              daromad toping!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-7 max-w-md">
            IQROMAX platformasi orqali o'z bilim va tajribangizni minglab bolalar bilan baham ko'ring va daromad qiling.
          </p>

          <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-7">
            {[
              "1 oyda professional trener bo'lasiz",
              "O'z guruhingizni ochasiz va boshqarasiz",
              'Dars materiallari va mashqlar biz tomondan taqdim etiladi',
              "O'quvchilaringiz natijasini kuzatib borasiz",
              "Barqaror daromad manbaiga ega bo'lasiz",
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-sm sm:text-base">
                <span className="flex-shrink-0 mt-0.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center">
                  <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                </span>
                <span className="font-medium leading-snug">{t}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 h-12 sm:h-14 px-6 sm:px-7 rounded-full text-sm sm:text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            >
              <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
              Trener bo'lish
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-full text-sm sm:text-base font-bold bg-white dark:bg-card border-2"
            >
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              Qanday ishlashini ko'rish
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative h-[88%] w-auto aspect-[3/4] rounded-3xl overflow-hidden">
              <img src={photoTrainerHijab} alt="Trener ayol" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="absolute top-4 right-0 w-56 bg-white dark:bg-card rounded-2xl p-3 shadow-2xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Oylik daromad</div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">+18%</span>
            </div>
            <div className="text-base font-display font-black text-gray-900 dark:text-foreground mb-2">
              12 450 000 <span className="text-xs text-gray-500">so'm</span>
            </div>
            <svg viewBox="0 0 140 50" className="w-full h-11">
              <path
                d="M 5 40 Q 25 38 40 30 T 75 22 T 110 12 L 135 5"
                fill="none"
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {[
                { x: 5, y: 40 },
                { x: 40, y: 30 },
                { x: 75, y: 22 },
                { x: 110, y: 12 },
                { x: 135, y: 5 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="white" stroke="rgb(16 185 129)" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
              <span>1-hafta</span>
              <span>2-hafta</span>
              <span>3-hafta</span>
              <span>4-hafta</span>
            </div>
          </div>

          <div className="absolute top-44 right-0 w-44 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Users2 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500">O'quvchilar</div>
                <div className="text-lg font-black leading-tight">56</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="absolute top-[14.5rem] right-0 w-44 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <FolderKanban className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500">Guruhlar</div>
                <div className="text-lg font-black leading-tight">4</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          <div className="absolute bottom-20 right-2 w-60 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <Quote className="h-3.5 w-3.5 text-gray-300 mb-1" />
            <p className="text-[11px] leading-snug text-gray-700 dark:text-foreground/90 mb-2">
              IQROMAX bilan trenerlikni boshladim va 3 oy ichida o'zim orzu qilgan daromadga erishdim!
            </p>
            <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100 dark:border-border/50">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-[10px]">🧕</div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-gray-900 dark:text-foreground truncate">Nilufar Saidova</div>
                <div className="text-[9px] text-gray-500">Trener, Toshkent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
