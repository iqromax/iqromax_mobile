import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Gamepad2,
  Trophy,
  Star,
  Shield,
  Rocket,
  Gift,
  Award,
} from 'lucide-react';
import photoKid from '@/assets/hero-slide-kid.jpg';
import { MathSymbolsBg } from './MathSymbolsBg';

/** 4-slide — Bolalar uchun (gamification). */
export const KidSlide = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100/40 dark:from-sky-950/40 dark:via-background dark:to-blue-900/30 text-gray-900 dark:text-foreground">
      <MathSymbolsBg colorClass="text-blue-400" opacity={0.07} />
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-blue-300/30 dark:bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-sky-300/30 dark:bg-sky-400/5 blur-3xl pointer-events-none" />

      <div className="relative h-full grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8 px-5 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-blue-600 text-white mb-5 sm:mb-6 shadow-md shadow-blue-600/25">
            <Gamepad2 className="h-3.5 w-3.5" />
            BOLALAR UCHUN
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-3 sm:mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]">
              O'ynab o'rganing,
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-blue-600 dark:text-blue-400">
              tez rivojlaning!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-7 max-w-md">
            Qiziqarli mashqlar, darajalar va o'yinlar bilan matematikani sevib o'rganing va do'stlaringiz orasida eng zo'r bo'ling!
          </p>

          <ul className="space-y-3 mb-6 sm:mb-7">
            {[
              { icon: Gamepad2, title: 'Qiziqarli mashqlar', desc: "O'yin ko'rinishidagi mashqlar zeriktirmaydi", color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600' },
              { icon: Star, title: 'XP va level tizimi', desc: "XP to'plang va yangi levelga o'ting", color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600' },
              { icon: Trophy, title: 'Reyting va musobaqalar', desc: "Do'stlaringiz bilan bellashing va g'alaba qozoning", color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600' },
              { icon: Shield, title: 'Badges va mukofotlar', desc: 'Yutuqlaringiz uchun maxsus nishonlar oling', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600' },
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`flex-shrink-0 mt-0.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${f.color}`}>
                  <f.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base">{f.title}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="gap-2 h-12 sm:h-14 px-7 sm:px-8 rounded-full text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30"
            >
              <Rocket className="h-4 w-4 sm:h-5 sm:w-5" />
              Boshlash
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-0 flex items-end justify-center">
            <div className="relative h-[80%] w-auto aspect-[4/5]">
              <img src={photoKid} alt="Bola planshet bilan" className="h-full w-full object-cover rounded-3xl" />
            </div>
          </div>

          <div className="absolute top-32 left-2 text-3xl animate-bounce">⭐</div>
          <div className="absolute top-40 left-32 px-3 py-1.5 bg-blue-500 text-white text-sm font-black rounded-full shadow-lg shadow-blue-500/40 rotate-[-8deg]">
            +7
          </div>

          <div className="absolute top-2 right-0 w-56 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-3 shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-lg">🧒</div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-display font-black leading-tight">Level 7</div>
                <div className="text-[10px] text-white/80">XP 900 / 1200</div>
              </div>
              <Trophy className="h-5 w-5 text-amber-300" fill="currentColor" />
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div className="h-full rounded-full bg-amber-300" style={{ width: '75%' }} />
            </div>
            <div className="text-right text-[10px] text-amber-300 font-bold mt-0.5">Zo'r!</div>
          </div>

          <div className="absolute top-36 right-0 w-56 bg-white dark:bg-card rounded-2xl p-3 shadow-2xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Reyting</div>
              <Trophy className="h-3.5 w-3.5 text-amber-500" fill="currentColor" />
            </div>
            <ul className="space-y-1.5">
              {[
                { rank: 1, name: 'Asadbek', xp: '15 300', color: 'bg-amber-400' },
                { rank: 2, name: 'Zarina', xp: '12 450', color: 'bg-gray-400' },
                { rank: 3, name: 'Jahongir', xp: '11 200', color: 'bg-orange-400' },
                { rank: 4, name: 'Sarvar', xp: '10 150', color: 'bg-blue-400' },
              ].map((r, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px]">
                  <span className={`w-5 h-5 rounded-full ${r.color} flex items-center justify-center text-[9px] font-black text-white`}>
                    {r.rank}
                  </span>
                  <span className="flex-1 font-semibold truncate">{r.name}</span>
                  <span className="text-[10px] font-bold text-gray-600">{r.xp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute top-[19.5rem] right-0 w-56 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kunlik maqsad</div>
              <span className="text-[10px] font-bold">3/5</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-secondary overflow-hidden mb-1">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: '60%' }} />
            </div>
            <div className="flex items-center gap-1 text-[9px] text-gray-500">
              <Gift className="h-2.5 w-2.5" /> Yana 2 ta mashq bajarilsin
            </div>
          </div>

          <div className="absolute bottom-20 right-2 w-44 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-3 shadow-2xl">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-amber-300 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-700" fill="currentColor" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold opacity-90">Badges</div>
                <div className="text-2xl font-display font-black leading-none">
                  12<span className="text-base text-white/70"> / 24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
