import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Calendar,
  CheckCircle2,
  Award,
  Flame,
  PieChart as PieChartIcon,
  BarChart3,
  Download,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface GameSession {
  id: string;
  section: string;
  difficulty: string;
  mode: string;
  correct: number;
  incorrect: number;
  best_streak: number;
  score: number;
  total_time: number;
  created_at: string;
}

interface PeriodStats {
  score: number;
  solved: number;
  accuracy: number;
  bestStreak: number;
  avgTime: number;
  games: number;
}

type Period = 'week' | 'month' | 'year';

const Statistics = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [, setSessions] = useState<GameSession[]>([]);
  const [weekStats, setWeekStats] = useState<PeriodStats>({ score: 0, solved: 0, accuracy: 0, bestStreak: 0, avgTime: 0, games: 0 });
  const [monthStats, setMonthStats] = useState<PeriodStats>({ score: 0, solved: 0, accuracy: 0, bestStreak: 0, avgTime: 0, games: 0 });
  const [yearStats, setYearStats] = useState<PeriodStats>({ score: 0, solved: 0, accuracy: 0, bestStreak: 0, avgTime: 0, games: 0 });
  const [chartData, setChartData] = useState<{ date: string; score: number; accuracy: number; solved: number }[]>([]);
  const [sectionData, setSectionData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [topDays, setTopDays] = useState<{ date: string; score: number; accuracy: number }[]>([]);
  const [period, setPeriod] = useState<Period>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const { data: sessionsData } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (sessionsData) {
        setSessions(sessionsData);

        const now = new Date();

        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const calcStats = (filteredSessions: typeof sessionsData): PeriodStats => {
          const problems = filteredSessions.reduce((sum, s) => sum + (s.correct || 0) + (s.incorrect || 0), 0);
          const correct = filteredSessions.reduce((sum, s) => sum + (s.correct || 0), 0);
          const score = filteredSessions.reduce((sum, s) => sum + (s.score || 0), 0);
          const accuracy = problems > 0 ? Math.round((correct / problems) * 100) : 0;
          const bestStreak = filteredSessions.reduce((max, s) => Math.max(max, s.best_streak || 0), 0);
          const totalTime = filteredSessions.reduce((sum, s) => sum + (s.total_time || 0), 0);
          const avgTime = problems > 0 ? Math.round((totalTime / problems) * 10) / 10 : 0;

          return { score, solved: problems, accuracy, bestStreak, avgTime, games: filteredSessions.length };
        };

        setWeekStats(calcStats(sessionsData.filter((s) => new Date(s.created_at) >= startOfWeek)));
        const monthSessions = sessionsData.filter((s) => new Date(s.created_at) >= startOfMonth);
        setMonthStats(calcStats(monthSessions));
        setYearStats(calcStats(sessionsData.filter((s) => new Date(s.created_at) >= startOfYear)));

        const dailyData: { [key: string]: { score: number; correct: number; total: number } } = {};
        for (let i = 13; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          dailyData[dateStr] = { score: 0, correct: 0, total: 0 };
        }

        sessionsData.forEach((s) => {
          const dateStr = s.created_at.split('T')[0];
          if (dailyData[dateStr]) {
            dailyData[dateStr].score += s.score || 0;
            dailyData[dateStr].correct += s.correct || 0;
            dailyData[dateStr].total += (s.correct || 0) + (s.incorrect || 0);
          }
        });

        const chartDataArray = Object.entries(dailyData).map(([date, data]) => ({
          date: new Date(date).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' }),
          score: data.score,
          accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
          solved: data.total,
        }));

        setChartData(chartDataArray);

        // Top days (best score days)
        const top = [...chartDataArray]
          .filter((d) => d.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
        setTopDays(top);

        // Section breakdown
        const sectionScores: { [key: string]: number } = {};
        const sectionColors: { [key: string]: string } = {
          'mental-arithmetic': '#f97316',
          addition: '#10b981',
          subtraction: '#ef4444',
          multiplication: '#a855f7',
          division: '#3b82f6',
        };
        const sectionLabels: { [key: string]: string } = {
          'mental-arithmetic': 'Mental',
          addition: "Qo'shish",
          subtraction: 'Ayirish',
          multiplication: "Ko'paytirish",
          division: "Bo'lish",
        };

        monthSessions.forEach((s) => {
          sectionScores[s.section] = (sectionScores[s.section] || 0) + (s.score || 0);
        });

        const sectionDataArray = Object.entries(sectionScores)
          .filter(([, value]) => value > 0)
          .map(([name, value]) => ({
            name: sectionLabels[name] || name,
            value,
            color: sectionColors[name] || '#94a3b8',
          }));

        setSectionData(sectionDataArray);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/50 via-background to-amber-50/50">
        <div className="animate-pulse text-muted-foreground">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!user) return null;

  const currentStats =
    period === 'week' ? weekStats : period === 'month' ? monthStats : yearStats;

  const periodLabels: Record<Period, string> = {
    week: 'shu hafta',
    month: 'shu oy',
    year: 'shu yil',
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-orange-50/40 via-background to-amber-50/40 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Orqaga"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-display font-black flex items-center gap-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              Statistika va tahlil
            </h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Farzandingiz yutuqlari, aniqligi va vaqt sarfi haqida to'liq ma'lumot
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-secondary hover:bg-secondary/70 text-xs font-semibold transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            PDF eksport
          </button>
        </div>
      </div>

      <div className="container px-3 sm:px-6 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* HERO BLOCK */}
        <section className="rounded-3xl bg-gradient-to-br from-orange-100/70 via-amber-50/60 to-white dark:from-orange-950/30 dark:via-amber-950/20 dark:to-card border border-orange-200/60 dark:border-orange-800/40 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 px-5 sm:px-7 py-5 sm:py-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500 text-white shadow-sm mb-3">
                <BarChart3 className="h-3 w-3" />
                STATISTIKA · {periodLabels[period].toUpperCase()}
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl leading-tight">
                Farzandingiz <span className="text-orange-500">{periodLabels[period]}</span> qanday natijaga erishdi?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl">
                Ball, masalalar soni, aniqlik va o'rtacha vaqt — barchasi bir oynada.
              </p>
            </div>

            {/* Period tabs */}
            <div className="flex items-end">
              <div className="inline-flex items-center bg-card border border-border/40 rounded-2xl p-1 shadow-sm">
                {(['week', 'month', 'year'] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      period === p
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Yil'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KPI CARDS — 4 ustun */}
        <section>
          <StatsGrid stats={currentStats} period={period} />
        </section>

        {/* CHARTS — 2 ustun */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Haftalik progress (Area) */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Kunlik progress
                </h3>
                <p className="text-[11px] text-muted-foreground">Oxirgi 14 kun ballari</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Yaxshilanmoqda
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.55 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.55 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#scoreGrad)"
                    name="Ball"
                    dot={{ fill: 'white', stroke: '#f97316', strokeWidth: 2, r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Aniqlik trendi (Bar) */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Aniqlik trendi
                </h3>
                <p className="text-[11px] text-muted-foreground">Kundalik to'g'ri javoblar foizi</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                {currentStats.accuracy}% o'rtacha
              </span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.55 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.55 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="accuracy" fill="#10b981" radius={[6, 6, 0, 0]} name="Aniqlik %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* SECTIONS + TOP DAYS — 2 ustun */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
          {/* Bo'limlar bo'yicha pie */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-purple-500" />
                  Bo'limlar bo'yicha
                </h3>
                <p className="text-[11px] text-muted-foreground">Qaysi bo'limga ko'p vaqt sarfladi</p>
              </div>
            </div>
            {sectionData.length > 0 ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectionData}
                      cx="40%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {sectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground">
                <PieChartIcon className="h-10 w-10 mb-2 opacity-40" />
                <div className="text-xs">Hali ma'lumot to'planmadi</div>
              </div>
            )}
          </div>

          {/* Eng zo'r kunlar */}
          <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  Eng zo'r kunlar
                </h3>
                <p className="text-[11px] text-muted-foreground">Eng yuqori ball olingan 5 kun</p>
              </div>
            </div>
            {topDays.length > 0 ? (
              <ul className="space-y-2">
                {topDays.map((d, i) => {
                  const medals = ['bg-amber-400', 'bg-gray-400', 'bg-orange-400', 'bg-blue-400', 'bg-purple-400'];
                  return (
                    <li
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm ${medals[i]}`}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">{d.date}</div>
                        <div className="text-[10px] text-muted-foreground">
                          Aniqlik: {d.accuracy}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-display font-black text-orange-600">
                          {d.score}
                        </div>
                        <div className="text-[9px] text-muted-foreground">ball</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center text-muted-foreground">
                <Award className="h-10 w-10 mb-2 opacity-40" />
                <div className="text-xs">Hali yetarli ma'lumot yo'q</div>
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-display font-black text-lg sm:text-xl mb-1">
                Tizimli kuzatuv ishlaydi 🎯
              </h3>
              <p className="text-sm text-white/85">
                Farzandingizning har bir mashg'uloti avtomatik ravishda yozib boriladi.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => navigate('/lesson-stats')}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white text-orange-600 hover:bg-white/95 text-sm font-bold shadow-sm transition-all"
              >
                <Eye className="h-4 w-4" />
                Darslarni ko'rish
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-bold backdrop-blur-sm transition-all"
              >
                Bosh sahifa
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface StatsGridProps {
  stats: PeriodStats;
  period: Period;
}

const StatsGrid = ({ stats, period }: StatsGridProps) => {
  const items = [
    {
      icon: Zap,
      value: stats.score.toLocaleString('uz-UZ'),
      label: 'Umumiy ball',
      sub: `${stats.games} ta sessiya`,
      bg: 'bg-orange-100 dark:bg-orange-900/40',
      fg: 'text-orange-600',
      border: 'border-orange-200 dark:border-orange-800/50',
      gradient: 'from-orange-50 to-amber-50/30 dark:from-orange-950/30 dark:to-amber-950/20',
    },
    {
      icon: CheckCircle2,
      value: stats.solved.toLocaleString('uz-UZ'),
      label: 'Yechilgan masala',
      sub: 'savol bajarildi',
      bg: 'bg-emerald-100 dark:bg-emerald-900/40',
      fg: 'text-emerald-600',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      gradient: 'from-emerald-50 to-green-50/30 dark:from-emerald-950/30 dark:to-green-950/20',
    },
    {
      icon: Target,
      value: `${stats.accuracy}%`,
      label: 'Aniqlik',
      sub: stats.accuracy >= 80 ? "A'lo" : stats.accuracy >= 60 ? "O'rtacha" : 'Yaxshilash kerak',
      bg: 'bg-purple-100 dark:bg-purple-900/40',
      fg: 'text-purple-600',
      border: 'border-purple-200 dark:border-purple-800/50',
      gradient: 'from-purple-50 to-fuchsia-50/30 dark:from-purple-950/30 dark:to-fuchsia-950/20',
    },
    {
      icon: Clock,
      value: `${stats.avgTime}s`,
      label: "O'rtacha vaqt",
      sub: 'har bir savolga',
      bg: 'bg-blue-100 dark:bg-blue-900/40',
      fg: 'text-blue-600',
      border: 'border-blue-200 dark:border-blue-800/50',
      gradient: 'from-blue-50 to-cyan-50/30 dark:from-blue-950/30 dark:to-cyan-950/20',
    },
    {
      icon: Flame,
      value: stats.bestStreak.toString(),
      label: 'Eng yaxshi streak',
      sub: 'ketma-ket javob',
      bg: 'bg-rose-100 dark:bg-rose-900/40',
      fg: 'text-rose-600',
      border: 'border-rose-200 dark:border-rose-800/50',
      gradient: 'from-rose-50 to-pink-50/30 dark:from-rose-950/30 dark:to-pink-950/20',
    },
    {
      icon: Calendar,
      value: stats.games.toString(),
      label: 'Mashqlar soni',
      sub: period === 'week' ? 'shu hafta' : period === 'month' ? 'shu oy' : 'shu yil',
      bg: 'bg-amber-100 dark:bg-amber-900/40',
      fg: 'text-amber-600',
      border: 'border-amber-200 dark:border-amber-800/50',
      gradient: 'from-amber-50 to-yellow-50/30 dark:from-amber-950/30 dark:to-yellow-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={`relative rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}
        >
          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-3 shadow-sm`}>
            <item.icon className={`h-5 w-5 ${item.fg}`} />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black leading-tight">
            {item.value}
          </div>
          <div className="text-xs font-semibold text-foreground mt-0.5">{item.label}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
