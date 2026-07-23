import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Trophy,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';

type AlertType = 'success' | 'warning' | 'info' | 'danger' | 'achievement';

interface AlertItem {
  id: string;
  type: AlertType;
  icon: LucideIcon;
  title: string;
  desc: string;
  time: string;
}

const TYPE_STYLE: Record<AlertType, { bg: string; iconBg: string; iconFg: string; ring: string; label: string; labelBg: string }> = {
  success: {
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconFg: 'text-emerald-600',
    ring: 'border-emerald-200/60 dark:border-emerald-800/40',
    label: 'Yaxshi',
    labelBg: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconFg: 'text-amber-600',
    ring: 'border-amber-200/60 dark:border-amber-800/40',
    label: 'Diqqat',
    labelBg: 'bg-amber-500',
  },
  info: {
    bg: 'bg-blue-50/60 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconFg: 'text-blue-600',
    ring: 'border-blue-200/60 dark:border-blue-800/40',
    label: 'Eslatma',
    labelBg: 'bg-blue-500',
  },
  danger: {
    bg: 'bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconFg: 'text-rose-600',
    ring: 'border-rose-200/60 dark:border-rose-800/40',
    label: 'Muhim',
    labelBg: 'bg-rose-500',
  },
  achievement: {
    bg: 'bg-purple-50/60 dark:bg-purple-950/20 hover:bg-purple-50 dark:hover:bg-purple-950/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/40',
    iconFg: 'text-purple-600',
    ring: 'border-purple-200/60 dark:border-purple-800/40',
    label: 'Yutuq',
    labelBg: 'bg-purple-500',
  },
};

interface ParentAlertsProps {
  initialAlerts?: AlertItem[];
}

/**
 * Bildirishnomalar / eslatmalar paneli — ota-ona uchun jonli alertlar oqimi.
 */
export const ParentAlerts = ({ initialAlerts }: ParentAlertsProps) => {
  const defaultAlerts: AlertItem[] = [
    {
      id: '1',
      type: 'achievement',
      icon: Trophy,
      title: "Yangi yutuq: \"Tez hisoblash champion\"",
      desc: "Asadbek 10 daqiqa ichida 30 ta savolni yechdi.",
      time: '5 daq oldin',
    },
    {
      id: '2',
      type: 'success',
      icon: TrendingUp,
      title: 'Haftalik aniqlik 14% oshdi',
      desc: 'Geometriya bo\'yicha katta yaxshilanish kuzatildi.',
      time: '1 soat oldin',
    },
    {
      id: '3',
      type: 'warning',
      icon: AlertTriangle,
      title: "Kunlik maqsad bajarilmadi",
      desc: 'Kechagi natija: 14/20 savol. Eslatma yuborildi.',
      time: '12 soat oldin',
    },
    {
      id: '4',
      type: 'info',
      icon: Calendar,
      title: "Ertaga 10:00 da matematika imtihoni",
      desc: 'Mantiq va tez hisoblash bo\'limlaridan.',
      time: '3 soat oldin',
    },
    {
      id: '5',
      type: 'danger',
      icon: Clock,
      title: 'Vaqt cheklovi 90% ishlatildi',
      desc: 'Bugun yana 6 daqiqa qoldi. Keyin avtomatik qulflanadi.',
      time: '20 daq oldin',
    },
    {
      id: '6',
      type: 'warning',
      icon: TrendingDown,
      title: "Geometriya mavzusida zaiflik aniqlandi",
      desc: "AI tahlili 60% bilim ko'rsatkichi haqida xabar beradi.",
      time: 'Kecha',
    },
  ];

  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts ?? defaultAlerts);
  const [filter, setFilter] = useState<'all' | AlertType>('all');

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.type === filter);

  const filters: { id: 'all' | AlertType; label: string }[] = [
    { id: 'all', label: 'Hammasi' },
    { id: 'danger', label: 'Muhim' },
    { id: 'warning', label: 'Diqqat' },
    { id: 'achievement', label: 'Yutuqlar' },
    { id: 'success', label: 'Yaxshi' },
  ];

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Bildirishnomalar
            {alerts.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                {alerts.length}
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Farzandingizning faoliyati bo'yicha eng so'nggi yangiliklar
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === f.id
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-3" />
            <div className="text-sm font-semibold">Hech qanday bildirishnoma yo'q</div>
            <div className="text-[11px]">Barchasi yangilab ko'rilgan</div>
          </div>
        ) : (
          <ul className="divide-y divide-border/40">
            {filtered.map((alert) => {
              const style = TYPE_STYLE[alert.type];
              return (
                <li
                  key={alert.id}
                  className={`flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-4 transition-colors ${style.bg}`}
                >
                  <div className={`h-10 w-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <alert.icon className={`h-5 w-5 ${style.iconFg}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-0.5">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black text-white ${style.labelBg} flex-shrink-0`}>
                        {style.label}
                      </span>
                      <div className="text-xs sm:text-sm font-bold leading-tight flex-1 min-w-0">
                        {alert.title}
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground leading-snug mb-1">
                      {alert.desc}
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 inline-flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {alert.time}
                    </div>
                  </div>
                  <button
                    onClick={() => dismiss(alert.id)}
                    aria-label="O'chirish"
                    className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};
