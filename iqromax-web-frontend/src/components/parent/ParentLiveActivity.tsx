import { useNavigate } from 'react-router-dom';
import {
  Eye,
  PlayCircle,
  Clock,
  Target,
  CheckCircle2,
  ArrowRight,
  Wifi,
  WifiOff,
  Pause,
} from 'lucide-react';

interface ParentLiveActivityProps {
  isOnline?: boolean;
  currentLessonTitle?: string;
  currentCourseTitle?: string;
  watchedSeconds?: number;
  totalSeconds?: number;
  todaySolved?: number;
  dailyGoal?: number;
  todayMinutes?: number;
  childName?: string;
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Hozirgi paytdagi faoliyatni ko'rsatadigan katta jonli karta:
 *  - Online/offline status
 *  - Hozir ko'rilayotgan dars (progress bilan)
 *  - Bugungi qisqa metrikalar (solved, daily goal, vaqt)
 */
export const ParentLiveActivity = ({
  isOnline = true,
  currentLessonTitle = "Ko'paytirish qoidalari — 2-qism",
  currentCourseTitle = 'Tez hisoblash kursi',
  watchedSeconds = 423,
  totalSeconds = 720,
  todaySolved = 14,
  dailyGoal = 20,
  todayMinutes = 27,
  childName = 'Asadbek',
}: ParentLiveActivityProps) => {
  const navigate = useNavigate();
  const lessonProgress = totalSeconds > 0
    ? Math.min(Math.round((watchedSeconds / totalSeconds) * 100), 100)
    : 0;
  const dailyProgress = dailyGoal > 0
    ? Math.min(Math.round((todaySolved / dailyGoal) * 100), 100)
    : 0;

  return (
    <section className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden">
      {/* Yuqori chiziq */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border/40 bg-gradient-to-r from-orange-50/40 to-transparent dark:from-orange-950/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`relative h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isOnline
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
              : 'bg-gray-100 dark:bg-gray-800/40 text-gray-500'
          }`}>
            {isOnline ? <Wifi className="h-4.5 w-4.5" /> : <WifiOff className="h-4.5 w-4.5" />}
            {isOnline && (
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-card" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-display font-bold text-sm sm:text-base flex items-center gap-2">
              <span>{childName}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400'
              }`}>
                {isOnline ? '● ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isOnline ? "Hozir o'qimoqda" : 'Faoliyat kuzatilmadi'}
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/lesson-stats')}
          className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-orange-500 hover:text-orange-600 flex-shrink-0"
        >
          To'liq ko'rish <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Kontent */}
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
        {/* CHAP — Hozirgi dars */}
        <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-r border-border/40">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Hozirgi faoliyat
          </div>
          {isOnline ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/30">
                  <PlayCircle className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-bold text-sm sm:text-base leading-tight mb-0.5 line-clamp-2">
                    {currentLessonTitle}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {currentCourseTitle}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-orange-500 flex-shrink-0">
                  {lessonProgress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                  style={{ width: `${lessonProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {formatTime(watchedSeconds)} / {formatTime(totalSeconds)}
                </span>
                <span>Qolgan: {formatTime(Math.max(totalSeconds - watchedSeconds, 0))}</span>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate('/lesson-stats')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Kuzatish
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg bg-secondary hover:bg-secondary/70 text-foreground text-xs font-bold transition-colors"
                >
                  <Pause className="h-3.5 w-3.5" />
                  Pauza
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <div className="h-14 w-14 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
                <WifiOff className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold mb-1">Hozir offline</div>
              <div className="text-[11px]">So'nggi faollik 2 soat oldin</div>
            </div>
          )}
        </div>

        {/* O'NG — Bugungi metrikalar */}
        <div className="p-4 sm:p-6 bg-secondary/20">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
            Bugungi metrikalar
          </div>

          <div className="space-y-3">
            {/* Daily goal */}
            <div className="rounded-xl bg-card border border-border/40 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold inline-flex items-center gap-1.5">
                  <Target className="h-3 w-3 text-emerald-600" />
                  Kunlik maqsad
                </span>
                <span className="text-[11px] font-bold">
                  {todaySolved}/{dailyGoal}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
              <div className="text-right text-[9px] font-bold text-emerald-600 mt-1">
                {dailyProgress}%
              </div>
            </div>

            {/* 2 stat boxes */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-card border border-border/40 p-3">
                <Clock className="h-4 w-4 text-orange-500 mb-1" />
                <div className="text-base font-display font-black leading-none">
                  {todayMinutes}<span className="text-[10px] text-muted-foreground font-normal"> daq</span>
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">Bugun sarflangan</div>
              </div>
              <div className="rounded-xl bg-card border border-border/40 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mb-1" />
                <div className="text-base font-display font-black leading-none">
                  {todaySolved}
                </div>
                <div className="text-[9px] text-muted-foreground mt-0.5">To'g'ri javoblar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
