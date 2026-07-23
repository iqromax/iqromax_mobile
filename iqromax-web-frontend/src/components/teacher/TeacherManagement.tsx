import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  AlertTriangle,
  FileText,
  Bell,
  Calendar,
  ChevronRight,
  Award,
  Star,
  Download,
  ArrowRight,
} from 'lucide-react';

/**
 * "Darslaringizni oson boshqaring" — 4 ustunli boshqaruv bloki:
 *  1) Zaif o'quvchilar (progress bar bilan)
 *  2) Top o'quvchilar (medal ranglari bilan)
 *  3) Dars materiallari (yuklab olish)
 *  4) Eslatmalar
 */
export const TeacherManagement = () => {
  const navigate = useNavigate();

  const weakStudents = [
    { name: 'Diyora N.', percent: 45, color: 'bg-rose-500' },
    { name: 'Sevinch R.', percent: 58, color: 'bg-orange-500' },
    { name: 'Sanjar T.', percent: 65, color: 'bg-orange-500' },
  ];

  const topStudents = [
    { rank: 1, name: 'Asadbek A.', score: 98, color: 'bg-amber-400' },
    { rank: 2, name: 'Madina K.', score: 92, color: 'bg-gray-400' },
    { rank: 3, name: 'Azizbek R.', score: 88, color: 'bg-orange-400' },
  ];

  const materials = [
    { ic: '📄', t: "Mental hisob — 12-dars", s: 'PDF · 2.4 MB', cl: 'bg-emerald-100 text-emerald-600' },
    { ic: '📊', t: 'Test variantlari', s: 'PDF · 1.8 MB', cl: 'bg-purple-100 text-purple-600' },
    { ic: '🎬', t: "Geometriya video plani", s: 'MP4 · 18 MB', cl: 'bg-orange-100 text-orange-600' },
  ];

  const reminders = [
    { ic: Bell, t: 'Vazifani tekshirish', d: 'Bugun 16:00 gacha', cl: 'bg-orange-100 text-orange-600' },
    { ic: Calendar, t: '5-A guruh dars rejasi', d: 'Ertaga 09:00', cl: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Darslaringizni <span className="text-emerald-600">oson boshqaring</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Har bir o'quvchini, har bir darsni va har bir vazifani bitta paneldan boshqaring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Zaif o'quvchilar */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Zaif o'quvchilar
            </h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded-full">
              {weakStudents.length}
            </span>
          </div>
          <ul className="space-y-3">
            {weakStudents.map((s, i) => (
              <li key={i}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold">{s.name}</span>
                  <span className="font-bold">{s.percent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/messages')}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-rose-50 dark:bg-rose-900/30 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-bold transition-colors"
          >
            Yordam yuborish
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Top o'quvchilar */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" />
              Top o'quvchilar
            </h3>
            <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
          </div>
          <ul className="space-y-2.5">
            {topStudents.map((s) => (
              <li key={s.rank} className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full ${s.color} flex items-center justify-center text-[10px] font-black text-white shadow-sm`}>
                  {s.rank}
                </span>
                <span className="text-xs font-semibold flex-1 truncate">{s.name}</span>
                <span className="text-xs font-display font-black text-emerald-600">{s.score}%</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate('/badges')}
            className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-bold transition-colors"
          >
            <Award className="h-3 w-3" />
            Mukofotlash
          </button>
        </div>

        {/* Dars materiallari */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-emerald-500" />
              Dars materiallari
            </h3>
            <button className="text-[10px] font-semibold text-emerald-600 inline-flex items-center gap-0.5 hover:text-emerald-700">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <ul className="space-y-2">
            {materials.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer transition-colors"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${m.cl} dark:bg-opacity-30`}>
                  {m.ic}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold truncate">{m.t}</div>
                  <div className="text-[9px] text-muted-foreground">{m.s}</div>
                </div>
                <Download className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              </li>
            ))}
          </ul>
        </div>

        {/* Eslatmalar */}
        <div className="rounded-2xl bg-card border border-border/40 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-sm sm:text-base flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-purple-500" />
              Eslatmalar
            </h3>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
              Bugun
            </span>
          </div>
          <ul className="space-y-2.5">
            {reminders.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-secondary/30">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.cl} dark:bg-opacity-30`}>
                  <r.ic className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold leading-tight">{r.t}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{r.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
