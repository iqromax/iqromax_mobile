import { useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, ArrowRight, Quote, Star } from 'lucide-react';

interface TeacherIncomeProps {
  monthlyIncome?: string;
  monthlyDelta?: number;
}

/**
 * "Daromadingizni oshiring" — chap tomonda 4 oylik daromad bar chart,
 * o'ng tomonda testimonial.
 */
export const TeacherIncome = ({
  monthlyIncome = '12 450 000',
  monthlyDelta = 18,
}: TeacherIncomeProps) => {
  const navigate = useNavigate();

  const months = [
    { label: '1-h', value: 35 },
    { label: '2-h', value: 50 },
    { label: '3-h', value: 65 },
    { label: '4-h', value: 75 },
    { label: '1-h', value: 80 },
    { label: '2-h', value: 88 },
    { label: 'Bu', value: 95 },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Daromadingizni <span className="text-emerald-600">oshiring</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Yaxshi natija ko'rsatgan o'qituvchilar IQROMAX orqali yaxshi daromad olishadi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Daromad chart */}
        <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Bu oy daromad
              </div>
              <div className="text-2xl sm:text-3xl font-display font-black text-emerald-600 leading-tight">
                {monthlyIncome} <span className="text-sm text-muted-foreground font-normal">so'm</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full">
              <TrendingUp className="h-3 w-3" /> +{monthlyDelta}%
            </span>
          </div>

          {/* Bar chart */}
          <div className="h-44 flex items-end gap-2 sm:gap-3 mb-3 px-1">
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[9px] font-bold text-muted-foreground">{m.value}%</div>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-emerald-500 via-emerald-400 to-emerald-300 transition-all hover:from-emerald-600 hover:to-emerald-400"
                    style={{ height: `${m.value}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground">Mavjud balans</div>
                <div className="text-sm font-display font-black">8 320 000 so'm</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
            >
              Yechib olish
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Testimonial card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md p-5 sm:p-6 flex flex-col">
          <Quote className="h-7 w-7 text-emerald-200 mb-3" />
          <p className="text-sm sm:text-base leading-relaxed mb-4 flex-1">
            IQROMAX meni nafaqat yaxshi o'qituvchi, balki muvaffaqiyatli mentor ham qildi. Daromadim bargaror, o'quvchilar esa natijasidan mamnun.
          </p>
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-amber-300" fill="currentColor" />
            ))}
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-white/20">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 flex items-center justify-center text-base">
              🧕
            </div>
            <div>
              <div className="text-sm font-display font-bold">Dilfuza Ismoilova</div>
              <div className="text-[11px] text-emerald-200">Mental hisob trener · Toshkent</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
