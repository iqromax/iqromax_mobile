import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  TrendingUp, BarChart3, MessageCircle, ClipboardCheck, Shield, Brain,
  Eye, Users, Star, Play, ChevronRight, CheckCircle2, Calendar, Bell,
  Award, BookOpen, Trophy, Clock, Target, Mail
} from 'lucide-react';
import heroParents from '@/assets/hero-parents-child.jpg';

const Stat = ({ icon: Icon, value, label, color }: any) => (
  <div className="flex items-center justify-center gap-3 bg-white dark:bg-card rounded-2xl px-5 py-4 shadow-sm border border-border/40">
    <Icon className={`h-7 w-7 ${color}`} />
    <div className="text-left">
      <p className="text-lg sm:text-xl font-black leading-none">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, color, title, desc }: any) => (
  <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40 shadow-sm hover:shadow-md transition-shadow">
    <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-bold text-base mb-1.5">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const ParentsLanding = () => {
  const navigate = useNavigate();

  const features = [
    { icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40', title: 'Kunlik nazorat', desc: "Farzandingizning har kuni darslarda erishgan yutuqlari va faoliyatini real vaqtda kuzating." },
    { icon: BarChart3, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40', title: 'Batafsil tahlil', desc: "Kuchli va zaif tomonlari, mavzulardagi bilim darajasi va o'sish dinamikasini to'liq tahlil qiling." },
    { icon: MessageCircle, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40', title: "O'qituvchi fikri", desc: "O'qituvchilarning izohlari va tavsiyalarini oling, farzandingizning rivojlanishini yaxshilang." },
    { icon: ClipboardCheck, color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40', title: 'Uy vazifalari nazorati', desc: "Uy vazifalarining bajarilishi, muddati va natijalarini kuzating va eslatmalar oling." },
    { icon: Shield, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40', title: 'Xavfsizlik va maxfiylik', desc: "Ma'lumotlar maksimal darajada himoyalangan. Bolalar uchun xavfsiz raqamli muhit." },
    { icon: Brain, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40', title: 'AI tavsiyalar', desc: "Sun'iy intellekt asosida shaxsiy tavsiyalar va mashqlar bilan o'sishni tezlashtiring." },
  ];

  const testimonials = [
    { name: 'Malika Rahimova', role: 'Asadbekning onasi', text: 'IQROMAX orqali farzandimning har kuni nimalardni o\'rganayotganini aniq ko\'ra olaman. Tavsiyalar juda foydali!' },
    { name: 'Javohir To\'xtayev', role: 'Zarinaning otasi', text: "Oldin uy vazifalarini nazorat qilish qiyin edi. Endi hammasi tizimda, vaqtimni tejayman va bolamga ko'proq yordam bera olaman." },
    { name: 'Shahnoza Ismoilova', role: 'Sardorning onasi', text: "O'qituvchilarning fikrlari va tahlillar juda detail. Farzandimning kuchli va zaif tomonlarini yaxshi tushunib qoldim." },
  ];

  const faqs = [
    { q: 'Farzandim haqidagi ma\'lumotlarni qanday kuzata olaman?', a: 'Ota-onalar dashboardida real vaqtda barcha mashg\'ulotlar, natijalar va progress ko\'rsatiladi.' },
    { q: 'Ma\'lumotlar xavfsizligi qanday ta\'minlanadi?', a: 'Barcha ma\'lumotlar shifrlangan holda saqlanadi va faqat sizga ko\'rsatiladi.' },
    { q: 'Ota-ona sifatida qanday bildirishnomalar olaman?', a: 'Kunlik xulosa, dars natijalari, uy vazifalari muddati va o\'qituvchi izohlari haqida bildirishnomalar.' },
    { q: 'Agar bir nechta farzandim bo\'lsa, ularni alohida kuzata olsam bo\'ladimi?', a: 'Ha, har bir farzand uchun alohida profil va statistika mavjud.' },
    { q: 'IQROMAX\'dan foydalanish qancha turadi?', a: 'Bepul rejimi mavjud, premium imkoniyatlar uchun esa qulay tariflar mavjud.' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] dark:bg-background">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />

      <main className="pt-4 pb-16">
        {/* HERO */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-[11px] font-black px-3 py-1.5 rounded-full mb-5">
                <Eye className="h-3.5 w-3.5" /> OTA-ONALAR UCHUN
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mb-5">
                Farzandingiz <br /> natijasini real <br />
                <span className="text-orange-500">vaqtda kuzating</span>
              </h1>
              <p className="text-base text-muted-foreground mb-7 max-w-lg leading-relaxed">
                IQROMAX orqali farzandingizning o'quv jarayoni, darslardagi yutuqlari, uy vazifalari, qatnashuvi va kuchli hamda zaif tomonlarini real vaqtda kuzatishingiz mumkin. Tavsiyalar va eslatmalar bilan uni yanada muvaffaqiyatli qiling.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Button size="lg" onClick={() => navigate('/auth')} className="h-12 px-6 rounded-full font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                  Natijalarni ko'rish <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/about')} className="h-12 px-6 rounded-full font-bold gap-2">
                  <Play className="h-4 w-4" /> Demo ko'rish
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Real vaqt ma\'lumotlari', 'Xavfsiz va himoyalangan', 'Oson va qulay'].map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-full bg-white dark:bg-card border border-border/40 font-semibold">{b}</span>
                ))}
              </div>
            </div>

            {/* HERO IMAGE + OVERLAYS */}
            <div className="relative order-1 lg:order-2 min-h-[420px] lg:min-h-[520px]">
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img src={heroParents} alt="Ota-ona va farzand" className="w-full h-full object-cover" />
              </div>

              {/* Profile card */}
              <div className="absolute top-3 right-3 bg-white dark:bg-card rounded-2xl p-3 sm:p-4 shadow-2xl border border-border/40 w-[220px] sm:w-[260px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-black">A</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Asadbek Abduazizov</p>
                    <p className="text-[10px] text-orange-600 font-semibold">Level 7</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground">900/1200 XP</span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[{v:'12',l:'Kurslar'},{v:'2350',l:'XP'},{v:'75%',l:'Progress'},{v:'15',l:'Kunlik 🔥'}].map(s=>(
                    <div key={s.l}>
                      <p className="text-xs font-black">{s.v}</p>
                      <p className="text-[8px] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly progress */}
              <div className="absolute top-[155px] right-3 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[220px] sm:w-[260px]">
                <p className="text-xs font-bold mb-1">Haftalik progress</p>
                <svg viewBox="0 0 200 60" className="w-full h-14">
                  <polyline points="0,50 33,42 66,32 99,25 132,18 165,12 200,5" fill="none" stroke="rgb(249,115,22)" strokeWidth="2.5" strokeLinecap="round" />
                  {[[0,50],[33,42],[66,32],[99,25],[132,18],[165,12],[200,5]].map(([x,y],i)=>(
                    <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(249,115,22)" />
                  ))}
                </svg>
                <div className="flex justify-between text-[9px] text-muted-foreground">
                  {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map(d=><span key={d}>{d}</span>)}
                </div>
              </div>

              {/* Activity */}
              <div className="absolute bottom-3 right-3 bg-white dark:bg-card rounded-2xl p-3 shadow-xl border border-border/40 w-[220px] sm:w-[260px]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">So'nggi faoliyat</p>
                  <span className="text-[9px] text-orange-600 font-bold">Barchasi</span>
                </div>
                {[{t:"4. Ko'paytirish qoidalari",s:'92%'},{t:'Tez hisoblash – 1-daraja',s:'85%'}].map((a,i)=>(
                  <div key={i} className="flex items-center justify-between text-[10px] mb-1">
                    <span className="truncate flex-1 mr-2">{a.t}</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600">{a.s}<CheckCircle2 className="h-3 w-3" /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
            <Stat icon={Users} value="10 000+" label="Ota-onalar" color="text-orange-500" />
            <Stat icon={Eye} value="20 000+" label="Kuzatilayotgan bolalar" color="text-emerald-500" />
            <Stat icon={TrendingUp} value="96%" label="Faol ota-ona" color="text-orange-500" />
            <Stat icon={Star} value="4.9/5" label="Ota-onalar bahosi" color="text-amber-500" />
          </div>
        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              Nega ota-onalar <span className="text-orange-500">IQROMAX</span>'ni tanlashadi?
            </h2>
            <p className="text-sm text-muted-foreground">Farzandingizning ta'lim yo'lida sizning eng yaxshi yordamchingiz</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl mt-20">
          <div className="bg-white dark:bg-card rounded-3xl p-6 sm:p-10 border border-border/40 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Bitta panelda barcha ma'lumot</h2>
              <p className="text-sm text-muted-foreground">Barcha muhim ko'rsatkichlar, tahlillar va xabarlar bir joyda</p>
            </div>

            <div className="grid lg:grid-cols-[200px_1fr] gap-5">
              {/* Sidebar mock */}
              <aside className="bg-muted/40 rounded-2xl p-4 hidden lg:block">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-black">A</div>
                  <div>
                    <p className="text-xs font-bold">Asadbek Abduazizov</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {[
                    { i: BarChart3, t: 'Bosh sahifa', active: true },
                    { i: BookOpen, t: "O'quv jarayoni" },
                    { i: Calendar, t: 'Darslar' },
                    { i: ClipboardCheck, t: 'Uy vazifalari' },
                    { i: TrendingUp, t: 'Tahlillar' },
                    { i: Bell, t: 'Xabarlar', badge: 2 },
                    { i: Award, t: "To'lovlar" },
                    { i: Users, t: 'Sozlamalar' },
                  ].map((it, i) => (
                    <li key={i} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${it.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 font-bold' : 'hover:bg-muted'}`}>
                      <it.i className="h-3.5 w-3.5" />
                      <span className="flex-1">{it.t}</span>
                      {it.badge && <span className="text-[9px] bg-orange-500 text-white rounded-full px-1.5">{it.badge}</span>}
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Main */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { i: BookOpen, l: "O'tgan darslar", v: '124', sub: '+12 bu hafta', c: 'text-emerald-600' },
                    { i: Trophy, l: 'Umumiy XP', v: '2350', sub: '+330 bu hafta', c: 'text-amber-500' },
                    { i: Clock, l: "O'rganish vaqti", v: '34 soat', sub: '+6 soat bu hafta', c: 'text-sky-500' },
                    { i: Target, l: 'Davomat', v: '95%', sub: '↑ 3% darsi', c: 'text-violet-500' },
                  ].map((s, i) => (
                    <div key={i} className="bg-muted/40 rounded-xl p-3">
                      <s.i className={`h-4 w-4 ${s.c} mb-2`} />
                      <p className="text-[10px] text-muted-foreground">{s.l}</p>
                      <p className="text-lg font-black">{s.v}</p>
                      <p className="text-[9px] text-emerald-600 font-semibold mt-1">{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-3">
                  <div className="bg-muted/40 rounded-xl p-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs font-bold">Haftalik progress</p>
                      <span className="text-[10px] text-muted-foreground">Bu hafta</span>
                    </div>
                    <svg viewBox="0 0 300 110" className="w-full h-28">
                      <polyline points="10,90 50,75 90,70 130,55 170,35 210,40 250,20 290,15" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" />
                      {[[10,90],[50,75],[90,70],[130,55],[170,35],[210,40],[250,20],[290,15]].map(([x,y],i)=>(
                        <circle key={i} cx={x} cy={y} r="3" fill="rgb(16,185,129)" />
                      ))}
                      <text x="170" y="25" fontSize="10" fontWeight="bold" fill="rgb(16,185,129)">75%</text>
                    </svg>
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      {['Du','Se','Ch','Pa','Ju','Sh','Ya'].map(d=><span key={d}>{d}</span>)}
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-xs font-bold mb-3">Mavzulardagi o'zlashtirish</p>
                    {[
                      { t: 'Matematika', v: 78, c: 'bg-emerald-500' },
                      { t: 'Mantiq', v: 82, c: 'bg-violet-500' },
                      { t: 'Ingliz tili', v: 65, c: 'bg-orange-500' },
                      { t: 'Tez hisoblash', v: 90, c: 'bg-amber-500' },
                    ].map(s => (
                      <div key={s.t} className="mb-2">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span>{s.t}</span><span className="font-bold">{s.v}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${s.c} rounded-full`} style={{ width: `${s.v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl mt-20">
          <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">Farzandingiz uchun shaxsiy tavsiyalar</h2>
              <p className="text-sm text-muted-foreground mb-5">Asadbekning o'sishini tezlashtirish uchun individual yondashuv va aniq rejalar.</p>
              <ul className="space-y-2 text-sm mb-5">
                {[
                  'Zaif mavzular bo\'yicha maxsus mashqlar',
                  'Kuchli tomonlarini rivojlantirish rejasi',
                  'Keyingi maqsadlar va motivatsiya',
                  'Eslatmalar va davomiy qo\'llab-quvvatlash',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{t}</li>
                ))}
              </ul>
              <Button onClick={() => navigate('/auth')} className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 px-5 gap-2">
                Barchasini ko'rish <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                <div className="flex justify-between mb-3">
                  <p className="text-sm font-bold">Zaif mavzular</p>
                  <span className="text-[10px] text-orange-600 font-bold">Barchasi</span>
                </div>
                {[{t:'Ingliz tili: Grammar',v:65},{t:'Matematika: Geometriya',v:58},{t:'Mantiq: Mantiqiy masalalar',v:63}].map(m=>(
                  <div key={m.t} className="mb-3">
                    <div className="flex justify-between text-[11px] mb-1"><span>{m.t}</span><span className="font-bold">{m.v}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${m.v}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                <div className="flex justify-between mb-3">
                  <p className="text-sm font-bold">Yutuqlar</p>
                  <span className="text-[10px] text-orange-600 font-bold">Barchasi</span>
                </div>
                {[
                  { i: Trophy, t: 'Matematika ustasi', s: '10 ta botinli tugatildi', c: 'bg-amber-100 text-amber-600' },
                  { i: Award, t: 'Tez hisoblash chempioni', s: '90%+ aniqlik', c: 'bg-emerald-100 text-emerald-600' },
                  { i: Star, t: "Faol o'quvchi", s: '7 kunlik seriya', c: 'bg-violet-100 text-violet-600' },
                ].map((y, i) => (
                  <div key={i} className="flex items-center gap-3 mb-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${y.c}`}>
                      <y.i className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{y.t}</p>
                      <p className="text-[10px] text-muted-foreground">{y.s}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                <p className="text-sm font-bold mb-3">Keyingi maqsadlar</p>
                {[
                  '6. Bo\'linish qoidalari 90%+ o\'zlashtirish',
                  'Grammar bo\'yicha 10 ta mashq tugatish',
                  'Haftalik XP maqsad: 600 XP',
                ].map(g => (
                  <div key={g} className="flex items-center gap-2 text-[11px] mb-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{g}</div>
                ))}
              </div>

              <div className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                <p className="text-sm font-bold mb-3">Eslatmalar</p>
                {[
                  { i: ClipboardCheck, t: 'Uy vazifasi muddati: Bugun 20:00' },
                  { i: Calendar, t: 'Ingliz tili darsi: Ertaga 18:30' },
                  { i: Users, t: 'Ota-ona uchrashuvi: 25-may, 17:00' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] mb-2"><r.i className="h-3.5 w-3.5 text-orange-500" />{r.t}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl mt-20">
          <div className="bg-orange-50/60 dark:bg-orange-950/10 rounded-3xl p-6 sm:p-10 border border-orange-200/40">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black mb-2">Ota-onalarimiz fikri</h2>
              <p className="text-sm text-muted-foreground">IQROMAX orqali farzandlarining yutuqlariga erishayotgan ota-onalar</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-2">{Array.from({length:5}).map((_,j)=><Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 sm:px-6 max-w-3xl mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-8">Ko'p beriladigan savollar</h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white dark:bg-card rounded-2xl p-4 border border-border/40 group">
                <summary className="font-bold text-sm cursor-pointer flex items-center justify-between">
                  {f.q}
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-10 text-white text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-3">Bugundan farzandingiz natijasini ko'rishni boshlang</h2>
            <p className="text-sm text-white/80 mb-5 max-w-xl mx-auto">Bepul ro'yxatdan o'ting va birinchi natijalarni bir necha daqiqada ko'ring.</p>
            <Button size="lg" onClick={() => navigate('/auth')} className="rounded-full bg-white text-orange-600 hover:bg-white/90 font-bold h-12 px-6 gap-2">
              Bepul boshlash <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ParentsLanding;
