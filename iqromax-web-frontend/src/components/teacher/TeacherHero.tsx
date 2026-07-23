import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  PlayCircle,
  GraduationCap,
  TrendingUp,
  Users2,
  FolderKanban,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import photoTeacher from '@/assets/photo-teacher-male.jpg';

interface TeacherHeroProps {
  teacherName?: string;
  monthlyIncome?: string;
  monthlyDelta?: number;
  studentsCount?: number;
  groupsCount?: number;
  upcomingLessonTime?: string;
  upcomingLessonTitle?: string;
}

/**
 * O'qituvchi sahifasi uchun yashil gradientli katta hero —
 * chap tomonda matn va CTA, o'ng tomonda rasm + 3 floating karta:
 *  - Oylik daromad (chart bilan)
 *  - O'quvchilar soni
 *  - Guruhlar soni
 */
export const TeacherHero = ({
  teacherName = 'Bahromjon',
  monthlyIncome = '12 450 000',
  monthlyDelta = 18,
  studentsCount = 56,
  groupsCount = 4,
  upcomingLessonTime = "Bugun 18:00",
  upcomingLessonTitle = '5-A guruh · Mental hisob',
}: TeacherHeroProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-100/40 dark:from-emerald-950/30 dark:via-background dark:to-emerald-900/30 border border-emerald-200/50 dark:border-emerald-800/40 shadow-sm">
      {/* Decorativ glow */}
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-emerald-300/30 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-green-200/30 dark:bg-emerald-400/5 blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 px-5 sm:px-8 md:px-10 lg:px-14 py-8 sm:py-10 md:py-14">
        {/* CHAP — matn */}
        <div className="flex flex-col justify-center max-w-xl">
          <span className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-500 text-white mb-5 sm:mb-6 shadow-md shadow-emerald-500/25">
            <GraduationCap className="h-3.5 w-3.5" />
            O'QITUVCHI UCHUN
          </span>

          <h1 className="font-display font-black leading-[1.05] mb-4">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]">
              Dars bering,
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem]">
              guruh boshqaring
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] text-emerald-600 dark:text-emerald-400">
              va natijani kuzating!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
            IQROMAX sizga darslar yaratish, o'quvchilaringizni boshqarish, uy vazifalari berish va barchasi bo'yicha daromad olish imkoniyatini beradi.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              size="lg"
              onClick={() => navigate('/courses')}
              className="gap-2 h-12 sm:h-13 px-6 sm:px-7 rounded-full text-sm sm:text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            >
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
              O'qitishni boshlash
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="gap-2 h-12 sm:h-13 px-5 sm:px-6 rounded-full text-sm sm:text-base font-bold bg-white dark:bg-card border-2"
            >
              <PlayCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
              Demo ko'rish
            </Button>
          </div>

          {/* Pastki micro-pills */}
          <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs">
            {[
              { ic: <CheckCircle2 className="h-3 w-3" />, t: 'Guruhlarni boshqarish', cl: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-700/40' },
              { ic: <CheckCircle2 className="h-3 w-3" />, t: 'Real vaqt nazorat', cl: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-700/40' },
              { ic: <CheckCircle2 className="h-3 w-3" />, t: 'Barqaror daromad', cl: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-700/40' },
            ].map((p, i) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold border ${p.cl}`}>
                {p.ic} {p.t}
              </span>
            ))}
          </div>
        </div>

        {/* O'NG — Rasm + floating kartalar */}
        <div className="relative min-h-[440px] lg:min-h-[480px]">
          {/* Teacher photo */}
          <div className="absolute inset-0 flex items-end justify-center lg:justify-end">
            <div className="relative h-full w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src={photoTeacher}
                alt={teacherName}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/15 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Oylik daromad card — endi yuqori-o'ng burchakda */}
          <div className="absolute top-2 right-0 lg:-right-2 w-[260px] sm:w-72 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Oylik daromad
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" /> +{monthlyDelta}%
              </span>
            </div>
            <div className="text-base sm:text-lg font-display font-black text-gray-900 dark:text-foreground mb-2">
              {monthlyIncome} <span className="text-xs text-gray-500">so'm</span>
            </div>
            {/* Bar chart mini */}
            <svg viewBox="0 0 200 60" className="w-full h-12">
              {[
                { x: 8, h: 18 },
                { x: 38, h: 26 },
                { x: 68, h: 34 },
                { x: 98, h: 28 },
                { x: 128, h: 42 },
                { x: 158, h: 50 },
                { x: 188, h: 46 },
              ].map((b, i) => (
                <rect
                  key={i}
                  x={b.x}
                  y={60 - b.h}
                  width="14"
                  height={b.h}
                  rx="3"
                  fill="rgb(16 185 129)"
                  fillOpacity={0.2 + (i / 7) * 0.7}
                />
              ))}
            </svg>
            <div className="flex justify-between text-[8px] text-gray-400 mt-0.5">
              <span>1-h</span>
              <span>2-h</span>
              <span>3-h</span>
              <span>4-h</span>
              <span>1-h</span>
              <span>2-h</span>
              <span>Bu</span>
            </div>
          </div>

          {/* O'quvchilar mini card — chap tomonda */}
          <div className="absolute top-[12rem] -left-1 sm:left-0 w-44 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Users2 className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500">O'quvchilar</div>
                <div className="text-lg font-display font-black leading-tight">{studentsCount}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Guruhlar mini card — chap tomonda, O'quvchilar ostida */}
          <div className="absolute top-[16rem] -left-1 sm:left-0 w-44 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <FolderKanban className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-gray-500">Guruhlar</div>
                <div className="text-lg font-display font-black leading-tight">{groupsCount}</div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Keyingi dars — endi pastki-o'ng burchakda */}
          <div className="absolute bottom-2 right-0 lg:right-2 w-[260px] sm:w-72 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-gray-100 dark:border-border/50 z-10">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  ⏰ Keyingi dars
                </div>
                <div className="text-xs font-bold truncate">{upcomingLessonTitle}</div>
                <div className="text-[10px] text-muted-foreground">{upcomingLessonTime}</div>
              </div>
              <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
