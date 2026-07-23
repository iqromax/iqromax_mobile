import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ClipboardList,
  Trophy,
  MessageSquare,
  Settings,
  TrendingUp,
  Star,
  CheckCircle2,
  Award,
  ChevronRight,
  PlayCircle,
  LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyStat {
  date: string;
  accuracy: number;
}

interface RecentLesson {
  id: string;
  title: string;
  course_title: string;
  watched_seconds: number;
  completed: boolean;
}

interface ParentDashboardPanelProps {
  childName?: string;
  level?: number;
  totalXp?: number;
  weeklyAccuracy?: number;
  totalCorrect?: number;
  improvement?: number;
  dailyStats?: DailyStat[];
  recentLessons?: RecentLesson[];
}

interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

/**
 * Reference dizayniga moslangan katta "Bitta panelda barcha ma'lumot" karta:
 * - Chapda sidebar nav
 * - Yuqorida 4 ta KPI kartalari
 * - Markazda haftalik progress chart
 * - O'ngda mavzular bo'yicha bilimlilik
 * - Pastda so'nggi darslar va yutuqlar
 */
export const ParentDashboardPanel = ({
  childName = 'Asadbek Abduazizov',
  level = 7,
  totalXp = 2350,
  weeklyAccuracy = 75,
  totalCorrect = 124,
  improvement = 14,
  dailyStats = [],
  recentLessons = [],
}: ParentDashboardPanelProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'progress', icon: TrendingUp, label: 'Progress' },
    { id: 'lessons', icon: BookOpen, label: 'Darslar' },
    { id: 'homework', icon: ClipboardList, label: "Uy vazifalari" },
    { id: 'achievements', icon: Trophy, label: 'Yutuqlar' },
    { id: 'messages', icon: MessageSquare, label: 'Xabarlar' },
    { id: 'settings', icon: Settings, label: 'Sozlamalar' },
  ];

  const topStats = [
    { value: totalCorrect, label: "To'g'ri javoblar", trend: `+${improvement}% bu hafta`, color: 'text-emerald-600' },
    { value: totalXp, label: 'XP', trend: 'jami', color: 'text-orange-500' },
    { value: `+${improvement}%`, label: 'Rivojlanish', trend: 'bu oy', color: 'text-purple-600' },
    { value: `${weeklyAccuracy}%`, label: 'Aniqlik', trend: 'haftalik', color: 'text-emerald-600' },
  ];

  // Dummy fallback for chart if dailyStats empty
  const chartData =
    dailyStats.length > 0
      ? dailyStats.slice(-7)
      : [
          { date: 'Du', accuracy: 40 },
          { date: 'Se', accuracy: 55 },
          { date: 'Ch', accuracy: 50 },
          { date: 'Pa', accuracy: 70 },
          { date: 'Ju', accuracy: 75 },
          { date: 'Sh', accuracy: 80 },
          { date: 'Ya', accuracy: 88 },
        ];

  // Mavzular bo'yicha bilimlilik (placeholder)
  const topicScores = [
    { name: "Qo'shish va ayirish", value: 92, color: 'bg-emerald-500' },
    { name: "Ko'paytirish", value: 78, color: 'bg-orange-500' },
    { name: 'Geometriya', value: 65, color: 'bg-purple-500' },
    { name: 'Tez hisoblash', value: 88, color: 'bg-blue-500' },
  ];

  const maxAccuracy = Math.max(...chartData.map((d) => d.accuracy), 100);

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Bitta panelda <span className="text-orange-500">barcha ma'lumot</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Barcha muhim ko'rsatkichlar yagona oynada — endi har joydan qidirishga hojat yo'q.
        </p>
      </div>

      <div className="rounded-3xl bg-card border border-border/40 shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr]">
          {/* SIDEBAR */}
          <aside className="bg-gradient-to-b from-orange-50/60 to-white dark:from-orange-950/20 dark:to-card border-b lg:border-b-0 lg:border-r border-border/40 p-4">
            {/* Profil */}
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border/40">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-300 to-amber-400 flex items-center justify-center text-base shadow-sm">
                🧑
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{childName.split(' ')[0]}</div>
                <div className="text-[10px] text-orange-500 font-semibold">Level {level}</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'text-muted-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600'
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN */}
          <div className="p-4 sm:p-6">
            {/* TOP KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {topStats.map((s, i) => (
                <div key={i} className="rounded-xl border border-border/40 bg-background/50 p-3 sm:p-4">
                  <div className={`text-xl sm:text-2xl font-display font-black ${s.color} leading-tight`}>
                    {s.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="h-2.5 w-2.5" /> {s.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-6">
              {/* HAFTALIK CHART */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-display font-bold text-sm sm:text-base">Haftalik progress</div>
                    <div className="text-[11px] text-muted-foreground">Oxirgi 7 kun aniqligi</div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3" /> +{improvement}%
                  </span>
                </div>
                <svg viewBox="0 0 320 140" className="w-full h-32 sm:h-36">
                  <defs>
                    <linearGradient id="parentPanelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((p) => {
                    const y = 120 - (p / 100) * 110;
                    return (
                      <g key={p}>
                        <line x1="30" x2="310" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                        <text x="22" y={y + 3} textAnchor="end" fontSize="8" fill="currentColor" opacity="0.4">
                          {p}%
                        </text>
                      </g>
                    );
                  })}
                  {/* Path */}
                  {(() => {
                    const points = chartData.map((d, i) => {
                      const x = 30 + (i * 280) / Math.max(chartData.length - 1, 1);
                      const y = 120 - (d.accuracy / maxAccuracy) * 110;
                      return { x, y };
                    });
                    const linePath = points
                      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                      .join(' ');
                    const areaPath = `${linePath} L ${points[points.length - 1].x} 120 L ${points[0].x} 120 Z`;

                    return (
                      <>
                        <path d={areaPath} fill="url(#parentPanelGrad)" />
                        <path d={linePath} fill="none" stroke="rgb(249 115 22)" strokeWidth="2.5" strokeLinecap="round" />
                        {points.map((p, i) => (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="rgb(249 115 22)" strokeWidth="2" />
                            <text x={p.x} y="135" textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.55">
                              {chartData[i].date.length > 3 ? chartData[i].date.slice(-2) : chartData[i].date}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* MAVZULAR BO'YICHA */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4 sm:p-5">
                <div className="font-display font-bold text-sm sm:text-base mb-4">
                  Mavzular bo'yicha bilimlilik
                </div>
                <div className="space-y-3">
                  {topicScores.map((t, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-medium">{t.name}</span>
                        <span className="font-bold text-foreground">{t.value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${t.color}`} style={{ width: `${t.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PASTKI 2 USTUN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* So'nggi darslar */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-display font-bold text-sm sm:text-base">So'nggi darslar</div>
                  <button
                    onClick={() => navigate('/lesson-stats')}
                    className="text-[11px] text-orange-500 font-semibold inline-flex items-center gap-1 hover:text-orange-600"
                  >
                    Hammasi <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                {recentLessons.length > 0 ? (
                  <ul className="space-y-2">
                    {recentLessons.slice(0, 3).map((l) => (
                      <li
                        key={l.id}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors cursor-pointer"
                        onClick={() => navigate(`/lessons/${l.id}`)}
                      >
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            l.completed ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-orange-100 dark:bg-orange-900/40'
                          }`}
                        >
                          {l.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-orange-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{l.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{l.course_title}</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">
                          {Math.floor(l.watched_seconds / 60)} daq
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    {[
                      { ic: '✖️', t: "Ko'paytirish qoidalari", s: 'Tez hisoblash kursi', p: '92%', cl: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40' },
                      { ic: '⚡', t: 'Tez hisoblash – 1-daraja', s: 'Boshlang\'ich kurs', p: '85%', cl: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' },
                      { ic: '➕', t: "Qo'shish va ayirish", s: 'Asoslar kursi', p: '78%', cl: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' },
                    ].map((row, i) => (
                      <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${row.cl}`}>
                          {row.ic}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold truncate">{row.t}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{row.s}</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 flex-shrink-0">{row.p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Yutuqlar */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-display font-bold text-sm sm:text-base">So'nggi yutuqlar</div>
                  <button
                    onClick={() => navigate('/badges')}
                    className="text-[11px] text-orange-500 font-semibold inline-flex items-center gap-1 hover:text-orange-600"
                  >
                    Hammasi <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {[
                    { ic: Trophy, t: 'Matematika ustasi', d: '50 ta to\'g\'ri javob', cl: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40' },
                    { ic: Star, t: 'Tez hisoblash champion', d: '10 daq ichida 30 ta savol', cl: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40' },
                    { ic: Award, t: 'Faol o\'quvchi', d: '15 kunlik streak', cl: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' },
                  ].map((row, i) => (
                    <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.cl}`}>
                        <row.ic className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{row.t}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{row.d}</div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
