import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Trophy,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { MathSymbolsBg } from './MathSymbolsBg';
import heroSlideMain from '@/assets/hero-slide-main.jpg';

/** 1-slide — IQROMAX brand intro (to'q yashil hero). */
export const MainSlide = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white">
      <MathSymbolsBg colorClass="text-emerald-300" opacity={0.12} />
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-8 px-5 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-10 md:py-12">
        {/* CHAP — matn */}
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-800/60 border border-emerald-500/30 text-emerald-100 mb-5 sm:mb-6 backdrop-blur-sm">
            Bolalar · Trenerlar · Ota-onalar uchun
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-emerald-300">
              IQROMAX —
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] mt-1">
              tez hisoblashni
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem]">
              o'rgatuvchi platforma
            </span>
          </h1>

          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-5 sm:mb-7 max-w-md">
            5–15 yoshdagi bolalar uchun yapon abakus metodikasi asosida ishlab chiqilgan zamonaviy ta'lim platformasi.
          </p>

          <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-7">
            {[
              { icon: Zap, title: 'Tez va samarali metodika', desc: 'Yapon abakus metodiga asoslangan' },
              { icon: Trophy, title: "O'yin tarzida o'qitish", desc: 'XP, level, reyting va badges tizimi' },
              { icon: BarChart3, title: "Real natijani ko'rish", desc: 'Har kuni progress va tahlillar' },
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center backdrop-blur-sm">
                  <f.icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-300" />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base">{f.title}</div>
                  <div className="text-xs sm:text-sm text-white/65">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 h-12 sm:h-14 px-6 sm:px-7 rounded-full text-sm sm:text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            >
              Bepul boshlash
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-full text-sm sm:text-base font-bold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Nima uchun IQROMAX?
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* O'NG — Rasm + floating kartochkalar */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 flex items-end justify-center">
            <img
              src={heroSlideMain}
              alt="Bola abakus bilan"
              className="h-[88%] w-auto max-w-full object-contain object-bottom drop-shadow-2xl"
            />
          </div>

          <div className="absolute top-4 right-0 w-48 bg-white text-gray-900 rounded-2xl p-3 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Level</div>
                <div className="text-2xl font-black leading-none">7</div>
              </div>
              <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-amber-500" fill="currentColor" />
              </div>
            </div>
            <div className="text-[10px] text-gray-500 mb-1.5">XP 650 / 1200</div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: '54%' }} />
            </div>
            <div className="mt-1 text-right text-[10px] font-semibold text-emerald-600">54%</div>
          </div>

          <div className="absolute top-44 right-0 w-52 bg-white text-gray-900 rounded-2xl p-3 shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold">Progress</div>
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <svg viewBox="0 0 120 50" className="w-full h-12">
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 5 35 Q 25 32 40 25 T 75 18 T 115 8"
                fill="none"
                stroke="rgb(16 185 129)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 5 35 Q 25 32 40 25 T 75 18 T 115 8 L 115 50 L 5 50 Z"
                fill="url(#progressGrad)"
              />
              {[
                { x: 5, y: 35 },
                { x: 40, y: 25 },
                { x: 75, y: 18 },
                { x: 115, y: 8 },
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="rgb(16 185 129)" />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-gray-400 mt-1">
              <span>1-hafta</span>
              <span>2-hafta</span>
              <span>3-hafta</span>
              <span>4-hafta</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
