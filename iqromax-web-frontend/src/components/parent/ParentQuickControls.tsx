import { useState } from 'react';
import {
  Target,
  Clock,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Save,
  Sliders,
} from 'lucide-react';

interface ParentQuickControlsProps {
  initialDailyGoal?: number;
  initialTimeLimitMinutes?: number;
  initialIsLocked?: boolean;
  initialNotifyEnabled?: boolean;
  onSave?: (payload: {
    dailyGoal: number;
    timeLimitMinutes: number;
    isLocked: boolean;
    notifyEnabled: boolean;
  }) => void;
}

/**
 * Tezkor nazorat paneli — ota-ona farzandning kunlik maqsadi, vaqt cheklovi,
 * qurilma qulflanishi va bildirishnomalarini bir joyda boshqaradi.
 */
export const ParentQuickControls = ({
  initialDailyGoal = 20,
  initialTimeLimitMinutes = 60,
  initialIsLocked = false,
  initialNotifyEnabled = true,
  onSave,
}: ParentQuickControlsProps) => {
  const [dailyGoal, setDailyGoal] = useState(initialDailyGoal);
  const [timeLimit, setTimeLimit] = useState(initialTimeLimitMinutes);
  const [isLocked, setIsLocked] = useState(initialIsLocked);
  const [notifyEnabled, setNotifyEnabled] = useState(initialNotifyEnabled);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave?.({
      dailyGoal,
      timeLimitMinutes: timeLimit,
      isLocked,
      notifyEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl flex items-center gap-2">
            <Sliders className="h-5 w-5 text-orange-500" />
            Tezkor nazorat
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Farzandingiz uchun maqsad, vaqt cheklovi va qulflashni shu yerda boshqaring
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Kunlik maqsad slider */}
          <div className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <Target className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold">Kunlik maqsad</span>
              </div>
              <span className="text-base font-display font-black text-emerald-600">
                {dailyGoal} <span className="text-[10px] text-muted-foreground font-normal">savol</span>
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>5</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Vaqt cheklovi slider */}
          <div className="rounded-xl border border-border/40 bg-background/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-semibold">Kunlik vaqt cheklovi</span>
              </div>
              <span className="text-base font-display font-black text-orange-600">
                {timeLimit} <span className="text-[10px] text-muted-foreground font-normal">daqiqa</span>
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={15}
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
              <span>15</span>
              <span>1 soat</span>
              <span>3 soat</span>
            </div>
          </div>

          {/* Qulflash toggle */}
          <button
            onClick={() => setIsLocked(!isLocked)}
            className={`rounded-xl border p-4 text-left transition-all ${
              isLocked
                ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                : 'bg-background/40 border-border/40 hover:border-rose-200 dark:hover:border-rose-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  isLocked
                    ? 'bg-rose-200 dark:bg-rose-900/60'
                    : 'bg-secondary/60'
                }`}>
                  {isLocked ? (
                    <Lock className="h-4 w-4 text-rose-600" />
                  ) : (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm font-semibold">Qurilmani qulflash</span>
              </div>
              {/* Toggle switch */}
              <div className={`relative h-6 w-11 rounded-full transition-colors ${
                isLocked ? 'bg-rose-500' : 'bg-secondary'
              }`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isLocked ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {isLocked
                ? 'Farzandingiz qurilmaga kira olmaydi'
                : "Farzandingiz erkin foydalanmoqda"}
            </div>
          </button>

          {/* Bildirishnomalar toggle */}
          <button
            onClick={() => setNotifyEnabled(!notifyEnabled)}
            className={`rounded-xl border p-4 text-left transition-all ${
              notifyEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                : 'bg-background/40 border-border/40 hover:border-emerald-200 dark:hover:border-emerald-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  notifyEnabled
                    ? 'bg-emerald-200 dark:bg-emerald-900/60'
                    : 'bg-secondary/60'
                }`}>
                  {notifyEnabled ? (
                    <Bell className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <BellOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm font-semibold">Push bildirishnomalar</span>
              </div>
              <div className={`relative h-6 w-11 rounded-full transition-colors ${
                notifyEnabled ? 'bg-emerald-500' : 'bg-secondary'
              }`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  notifyEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground">
              {notifyEnabled
                ? 'Har bir muhim faoliyatdan xabardor bo\'lasiz'
                : 'Bildirishnomalar o\'chirilgan'}
            </div>
          </button>
        </div>

        {/* Saqlash tugmasi */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/40">
          {saved && (
            <span className="text-[11px] font-semibold text-emerald-600">
              ✓ Saqlandi
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold shadow-md shadow-orange-500/25 transition-colors"
          >
            <Save className="h-4 w-4" />
            O'zgarishlarni saqlash
          </button>
        </div>
      </div>
    </section>
  );
};
