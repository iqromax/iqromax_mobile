import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  BookOpen,
  Calendar,
  ClipboardList,
  Wallet,
  MessageCircle,
  Settings,
  TrendingUp,
  ChevronRight,
  Quote,
  CheckCircle2,
  PlayCircle,
  Plus,
  LucideIcon,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface TeacherDashboardPanelProps {
  teacherName?: string;
  coursesCount?: number;
  groupsCount?: number;
  studentsCount?: number;
  monthlyIncome?: string;
}

/**
 * O'qituvchi katta dashboard paneli (reference dizayniga moslangan):
 *  - Chap: sidebar nav
 *  - Yuqori: 4 ta KPI (kurslar, guruhlar, o'quvchilar, daromad)
 *  - Markazda: haftalik faollik chart + o'quvchilar progress bars + kelajak darslar
 *  - Pastda: so'nggi faollik + so'nggi xabarlar
 */
export const TeacherDashboardPanel = ({
  teacherName = 'Bahromjon',
  coursesCount = 4,
  groupsCount = 6,
  studentsCount = 56,
  monthlyIncome = '12 450 000',
}: TeacherDashboardPanelProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const sidebarItems: SidebarItem[] = [
    { id: 'home', icon: LayoutDashboard, label: 'Bosh sahifa' },
    { id: 'groups', icon: Users2, label: 'Guruhlar' },
    { id: 'lessons', icon: BookOpen, label: 'Darslar' },
    { id: 'tasks', icon: ClipboardList, label: 'Topshiriqlar' },
    { id: 'students', icon: Users2, label: "O'quvchilar" },
    { id: 'income', icon: Wallet, label: 'Daromad' },
    { id: 'messages', icon: MessageCircle, label: 'Xabarlar' },
    { id: 'settings', icon: Settings, label: 'Sozlamalar' },
  ];

  const kpis = [
    { label: 'Faol kurslar', value: coursesCount, icon: BookOpen, fg: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
    { label: 'Guruhlar', value: groupsCount, icon: Users2, fg: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/40' },
    { label: "O'quvchilar", value: studentsCount, icon: Users2, fg: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/40' },
    { label: 'Bu oy daromad', value: monthlyIncome, icon: Wallet, fg: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/40' },
  ];

  // Mock weekly activity (lessons / homework / tests)
  const weekData = [
    { day: 'Du', lessons: 3, homework: 4 },
    { day: 'Se', lessons: 4, homework: 5 },
    { day: 'Ch', lessons: 2, homework: 3 },
    { day: 'Pa', lessons: 5, homework: 6 },
    { day: 'Ju', lessons: 4, homework: 4 },
    { day: 'Sh', lessons: 3, homework: 2 },
    { day: 'Ya', lessons: 2, homework: 3 },
  ];
  const maxVal = Math.max(...weekData.map((d) => Math.max(d.lessons, d.homework)));

  const studentsProgress = [
    { name: 'Asadbek A.', percent: 92 },
    { name: 'Madina K.', percent: 84 },
    { name: 'Sanjar T.', percent: 76 },
    { name: 'Sevinch R.', percent: 65 },
    { name: 'Diyora N.', percent: 58 },
  ];

  const upcoming = [
    { time: 'Bugun 18:00', title: '5-A guruh', subtitle: 'Mental hisob — 12-dars', cl: 'bg-emerald-100 text-emerald-600' },
    { time: 'Bugun 19:30', title: '5-B guruh', subtitle: 'Geometriya — 8-dars', cl: 'bg-orange-100 text-orange-600' },
    { time: 'Ertaga 10:00', title: '6-A guruh', subtitle: "Ko'paytirish — 5-dars", cl: 'bg-purple-100 text-purple-600' },
  ];

  const recentActivity = [
    { ic: PlayCircle, t: 'Yangi dars yuklandi', s: 'Mental hisob — 13-dars', cl: 'bg-emerald-100 text-emerald-600' },
    { ic: ClipboardList, t: 'Vazifa tarqatildi', s: '5-A guruhga · 12 ta o\'quvchi', cl: 'bg-orange-100 text-orange-600' },
    { ic: CheckCircle2, t: 'Dars yakunlandi', s: '5-B guruh — Tez hisoblash', cl: 'bg-purple-100 text-purple-600' },
  ];

  const recentMessages = [
    { name: 'Madina Karimova', role: 'Ota-ona', time: '5 daq oldin', msg: 'Salom ustoz! Farzandimning bugungi darsi qanday o\'tdi?' },
    { name: 'Asadbek Abduazizov', role: 'O\'quvchi', time: '12 daq oldin', msg: 'Vazifani yubordim, tekshirib bering iltimos.' },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Bitta panelda <span className="text-emerald-600">barcha boshqaruv</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Barcha guruhlar, darslar, vazifalar va daromad — yagona oynada boshqariladi.
        </p>
      </div>

      <div className="rounded-3xl bg-card border border-border/40 shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
          {/* SIDEBAR */}
          <aside className="bg-emerald-950 text-white lg:min-h-[660px] p-4">
            {/* Profil */}
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-emerald-800/60">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-base font-display font-black text-emerald-900">
                {teacherName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{teacherName}</div>
                <div className="text-[10px] text-emerald-300 font-semibold">Premium Pro</div>
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
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-emerald-200 hover:bg-emerald-900/60 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Premium kartochka */}
            <div className="hidden lg:block mt-6 pt-4 border-t border-emerald-800/60">
              <div className="rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-3 text-amber-950">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1">Premium</div>
                <div className="text-sm font-display font-black mb-2">Pro · 30 kun</div>
                <button className="w-full text-[10px] font-bold bg-amber-950 text-amber-200 py-1.5 rounded-lg hover:bg-amber-900 transition-colors">
                  Yangilash
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-base sm:text-lg">Bosh sahifa</h3>
              <button
                onClick={() => navigate('/courses')}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Yangi dars
              </button>
            </div>

            {/* KPI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {kpis.map((k, i) => (
                <div key={i} className="rounded-xl border border-border/40 bg-background/50 p-3 sm:p-4">
                  <div className={`w-9 h-9 rounded-lg ${k.bg} flex items-center justify-center mb-2`}>
                    <k.icon className={`h-4 w-4 ${k.fg}`} />
                  </div>
                  <div className={`text-base sm:text-lg font-display font-black ${k.fg} leading-tight`}>
                    {k.value}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{k.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr] gap-4 mb-5">
              {/* HAFTALIK FAOLLIK */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-display font-bold">Haftalik faollik</div>
                    <div className="text-[10px] text-muted-foreground">Darslar va vazifalar</div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Darslar
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" /> Vazifalar
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2 h-32">
                  {weekData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1 h-28">
                        <div
                          className="w-2.5 sm:w-3 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                          style={{ height: `${(d.lessons / maxVal) * 100}%` }}
                        />
                        <div
                          className="w-2.5 sm:w-3 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t"
                          style={{ height: `${(d.homework / maxVal) * 100}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-muted-foreground">{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* O'QUVCHILAR PROGRESSI */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-display font-bold">O'quvchilar progressi</div>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <ul className="space-y-2.5">
                  {studentsProgress.map((s, i) => (
                    <li key={i}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-medium truncate">{s.name}</span>
                        <span className="font-bold">{s.percent}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.percent >= 80
                              ? 'bg-emerald-500'
                              : s.percent >= 60
                              ? 'bg-orange-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${s.percent}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* KELAJAK DARSLAR */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-display font-bold">Kelajak darslar</div>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-[10px] font-semibold text-emerald-600 inline-flex items-center gap-0.5 hover:text-emerald-700"
                  >
                    Hammasi <ChevronRight className="h-2.5 w-2.5" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {upcoming.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                      <div className={`h-7 w-7 rounded-lg ${u.cl} dark:bg-opacity-30 flex items-center justify-center flex-shrink-0`}>
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-amber-600">{u.time}</div>
                        <div className="text-[11px] font-semibold truncate">{u.title}</div>
                        <div className="text-[9px] text-muted-foreground truncate">{u.subtitle}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PASTKI 2 USTUN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* So'nggi faollik */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-display font-bold">So'nggi faollik</div>
                  <span className="text-[10px] text-muted-foreground">Bugun</span>
                </div>
                <ul className="space-y-2">
                  {recentActivity.map((a, i) => (
                    <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg">
                      <div className={`h-8 w-8 rounded-lg ${a.cl} dark:bg-opacity-30 flex items-center justify-center flex-shrink-0`}>
                        <a.ic className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{a.t}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{a.s}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* So'nggi xabarlar */}
              <div className="rounded-xl border border-border/40 bg-background/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-display font-bold">So'nggi xabarlar</div>
                  <button
                    onClick={() => navigate('/messages')}
                    className="text-[10px] font-semibold text-emerald-600 inline-flex items-center gap-0.5 hover:text-emerald-700"
                  >
                    Hammasi <ChevronRight className="h-2.5 w-2.5" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {recentMessages.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="text-[11px] font-bold truncate">{m.name}</div>
                          <span className="text-[9px] text-muted-foreground flex-shrink-0">{m.time}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-2">
                          <Quote className="h-2.5 w-2.5 inline mr-0.5 opacity-50" />
                          {m.msg}
                        </div>
                      </div>
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
