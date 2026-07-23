import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ClipboardCheck,
  TrendingUp,
  PlayCircle,
  ListTodo,
  Trophy,
  MessageCircle,
  Lock,
  Bell,
  Settings,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: LucideIcon;
  emoji: string;
  title: string;
  desc: string;
  badge?: string;
  badgeColor?: string;
  bg: string;
  iconBg: string;
  iconFg: string;
  href: string;
  pulse?: boolean;
}

interface ParentControlMenuProps {
  pendingHomework?: number;
  unreadMessages?: number;
  newAchievements?: number;
  isChildOnline?: boolean;
}

/**
 * O'quvchini nazorat qilish uchun katta menyu — 8 ta funksional kartochka.
 * Har bir kartochka aniq bir nazorat yo'nalishi (live, hisobot, darslar va h.k.).
 */
export const ParentControlMenu = ({
  pendingHomework = 2,
  unreadMessages = 3,
  newAchievements = 1,
  isChildOnline = true,
}: ParentControlMenuProps) => {
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      id: 'live',
      icon: Activity,
      emoji: '🔴',
      title: 'Live faoliyat',
      desc: isChildOnline ? 'Hozir online' : 'Offline',
      badge: isChildOnline ? 'LIVE' : undefined,
      badgeColor: 'bg-red-500',
      bg: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200/60 dark:border-red-800/40',
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconFg: 'text-red-600',
      href: '/lesson-stats',
      pulse: isChildOnline,
    },
    {
      id: 'today',
      icon: ClipboardCheck,
      emoji: '📋',
      title: 'Bugungi hisobot',
      desc: 'Kunlik mashqlar va natijalar',
      bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200/60 dark:border-emerald-800/40',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
      iconFg: 'text-emerald-600',
      href: '/statistics',
    },
    {
      id: 'weekly',
      icon: TrendingUp,
      emoji: '📈',
      title: 'Haftalik tahlil',
      desc: 'Rivojlanish grafigi va tahlil',
      bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200/60 dark:border-orange-800/40',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
      iconFg: 'text-orange-600',
      href: '/statistics',
    },
    {
      id: 'lessons',
      icon: PlayCircle,
      emoji: '🎓',
      title: 'Ko\'rilgan darslar',
      desc: "Qaysi darslarni tugatdi va qancha vaqt sarfladi",
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200/60 dark:border-blue-800/40',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconFg: 'text-blue-600',
      href: '/lesson-stats',
    },
    {
      id: 'homework',
      icon: ListTodo,
      emoji: '📝',
      title: "Uy vazifalari",
      desc: 'Bajarilgan va kutilayotgan vazifalar',
      badge: pendingHomework > 0 ? `${pendingHomework} kutmoqda` : undefined,
      badgeColor: 'bg-orange-500',
      bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 border-purple-200/60 dark:border-purple-800/40',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconFg: 'text-purple-600',
      href: '/homework',
    },
    {
      id: 'achievements',
      icon: Trophy,
      emoji: '🏆',
      title: 'Yutuqlar',
      desc: 'Olgan badgelar va mukofotlar',
      badge: newAchievements > 0 ? `${newAchievements} yangi` : undefined,
      badgeColor: 'bg-amber-500',
      bg: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200/60 dark:border-amber-800/40',
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconFg: 'text-amber-600',
      href: '/badges',
    },
    {
      id: 'messages',
      icon: MessageCircle,
      emoji: '💬',
      title: 'Xabarlar',
      desc: "Trener va o'qituvchi bilan suhbat",
      badge: unreadMessages > 0 ? `${unreadMessages}` : undefined,
      badgeColor: 'bg-emerald-500',
      bg: 'bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 border-cyan-200/60 dark:border-cyan-800/40',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900/40',
      iconFg: 'text-cyan-600',
      href: '/messages',
    },
    {
      id: 'restrictions',
      icon: Lock,
      emoji: '🔒',
      title: 'Cheklovlar',
      desc: "Vaqt cheklovi va qurilma boshqaruvi",
      bg: 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200/60 dark:border-rose-800/40',
      iconBg: 'bg-rose-100 dark:bg-rose-900/40',
      iconFg: 'text-rose-600',
      href: '/settings',
    },
  ];

  return (
    <section>
      {/* Sarlavha */}
      <div className="flex items-end justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl">
            Nazorat <span className="text-orange-500">menyusi</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Farzandingizning faoliyatini har tomondan kuzating va boshqaring
          </p>
        </div>
        <button
          onClick={() => navigate('/settings')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600"
        >
          <Settings className="h-3.5 w-3.5" />
          Sozlash
        </button>
      </div>

      {/* Menyu grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.href)}
            className={`group relative text-left rounded-2xl border ${item.bg} p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200`}
          >
            {/* Badge (yangi/kutmoqda) */}
            {item.badge && (
              <span
                className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black text-white shadow-sm ${item.badgeColor}`}
              >
                {item.pulse && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                  </span>
                )}
                {item.badge}
              </span>
            )}

            {/* Icon */}
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${item.iconBg} flex items-center justify-center mb-3 shadow-sm`}>
              <item.icon className={`h-5 w-5 ${item.iconFg}`} />
            </div>

            {/* Matn */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-display font-bold text-sm sm:text-base leading-tight mb-1">
                  {item.title}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground leading-snug line-clamp-2">
                  {item.desc}
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
