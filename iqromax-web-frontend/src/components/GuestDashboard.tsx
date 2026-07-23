import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  Play,
  User,
  Users,
  GraduationCap,
  Award,
  ChevronRight,
  Star,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Trophy,
  Sparkles,
  Gift,
  Wallet,
  UserPlus,
  BookOpenCheck,
  Coins,
} from 'lucide-react';
import { TestimonialForm } from './TestimonialForm';
import { HeroCarousel3D } from './HeroCarousel3D';
import heroKids from '@/assets/hero-kids-learning.jpg';
import heroParents from '@/assets/hero-parents-child.jpg';
import heroTeachers from '@/assets/hero-teacher-class.jpg';
import logo from '@/assets/iqromax-logo.png';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url: string | null;
}

interface PlatformStats {
  total_users: number;
  total_problems_solved: number;
  total_lessons: number;
  total_courses: number;
}

const fmt = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}K+` : `${n.toLocaleString()}+`);

export const GuestDashboard = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    total_users: 10000,
    total_problems_solved: 0,
    total_lessons: 200,
    total_courses: 20,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: testimonialsData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(6);
      if (testimonialsData) setTestimonials(testimonialsData);

      const { data: statsData } = await supabase.rpc('get_platform_stats');
      const row = Array.isArray(statsData) ? statsData[0] : statsData;
      if (row) setStats(row);
    };
    fetchData();
  }, []);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
    ));

  // Simulated weekly progress for hero chart
  const weekData = [30, 45, 50, 65, 60, 80, 95];

  return (
    <div className="space-y-12 sm:space-y-20 pb-10">
      {/* ════════════ HERO CAROUSEL (4 slides) ════════════ */}
      <section className="-mx-3 xs:-mx-4 sm:mx-0">
        <HeroCarousel3D totalUsers={stats.total_users || 10000} />
      </section>

      {/* ════════════ STATS BAR ════════════ */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 -mt-4 sm:-mt-12 relative z-10">
        {[
          { icon: Users, label: "O'quvchilar", value: fmt(stats.total_users || 10000), color: 'text-emerald-600 bg-emerald-100' },
          { icon: GraduationCap, label: 'Trenerlar', value: '500+', color: 'text-blue-600 bg-blue-100' },
          { icon: BookOpenCheck, label: 'Kurslar', value: fmt(stats.total_lessons || 200), color: 'text-amber-600 bg-amber-100' },
          { icon: Award, label: 'Mamlakat', value: '20+', color: 'text-purple-600 bg-purple-100' },
        ].map((s, i) => (
          <Card key={i} className="p-3 sm:p-5 border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-foreground leading-none">{s.value}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* ════════════ 3 ROLE CARDS ════════════ */}
      <section>
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
            Har bir ishtirokchi uchun <span className="text-emerald-600">maksimal foyda</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            IQROMAX platformasi bolalar, ota-onalar va trenerlar ehtiyojiga mos ravishda yaratilgan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              title: 'Bolalar uchun',
              subtitle: "O'ynab o'rganing, tez rivojlaning!",
              features: ['Qiziqarli mashqlar va o\'yinlar', 'XP, level va reyting tizimi', 'Musobaqalar va mukofotlar', "Har doim va har joyda o'rganish"],
              cta: 'Boshlash',
              href: '/courses',
              img: heroKids,
              bg: 'from-sky-50 to-white dark:from-sky-950/30 dark:to-card',
              accent: 'text-sky-600',
              btn: 'bg-sky-500 hover:bg-sky-600',
              icon: '✨',
            },
            {
              title: 'Ota-onalar uchun',
              subtitle: "Natijani kuzating, rivojlanishni qo'llab-quvvatlang!",
              features: ['Real vaqtda progress kuzatuv', 'Statistikalar va tahlillar', 'Tavsiyalar va eslatmalar', "Xavfsiz va ishonchli muhit"],
              cta: 'Batafsil',
              href: '/parent-dashboard',
              img: heroParents,
              bg: 'from-orange-50 to-white dark:from-orange-950/30 dark:to-card',
              accent: 'text-orange-600',
              btn: 'bg-orange-500 hover:bg-orange-600',
              icon: '💜',
            },
            {
              title: 'Trenerlar uchun',
              subtitle: 'Bilimingizni daromadga aylantiring!',
              features: ['Guruh ochish va boshqarish', 'Tayyor kurslar va materiallar', "O'quvchilarni kuzatish", 'Barqaror daromad imkoniyati'],
              cta: "Trener bo'lish",
              href: '/lms',
              img: heroTeachers,
              bg: 'from-violet-50 to-white dark:from-violet-950/30 dark:to-card',
              accent: 'text-violet-600',
              btn: 'bg-violet-500 hover:bg-violet-600',
              icon: '🎓',
            },
          ].map((r, i) => (
            <Card key={i} className={`overflow-hidden border bg-gradient-to-br ${r.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
              <CardContent className="p-5 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h3 className={`text-xl font-black ${r.accent}`}>
                    {r.title}
                  </h3>
                  <span className="text-2xl">{r.icon}</span>
                </div>
                <p className="text-sm font-semibold text-foreground mb-4">{r.subtitle}</p>
                <ul className="space-y-2 mb-4 flex-1">
                  {r.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs sm:text-sm">
                      <CheckCircle2 className={`h-4 w-4 ${r.accent} shrink-0 mt-0.5`} />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl overflow-hidden mb-4 -mx-5 sm:-mx-6">
                  <img src={r.img} alt={r.title} className="w-full h-32 sm:h-36 object-cover" />
                </div>
                <Button onClick={() => navigate(r.href)} className={`${r.btn} text-white rounded-full h-11 font-bold`}>
                  {r.cta} <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ════════════ KIDS — DASHBOARD PREVIEW ════════════ */}
      <section className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            Bolalar uchun <span className="text-sky-500">qiziqarli</span><br />
            va samarali o'rganish
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Gamifikatsiya, interaktiv mashqlar va mukofotlar tizimi orqali bolalar o'ynab o'rganadi va har kuni o'zini yaxshilaydi.
          </p>
          <ul className="space-y-4">
            {[
              { icon: '🎮', title: 'Qiziqarli mashqlar', desc: "Interaktiv mashqlar va o'yinlar aqliy hisoblashni rivojlantiradi." },
              { icon: '⭐', title: 'XP va level tizimi', desc: 'Har bir yutuq uchun tajriba ochkolari va yangi levellar.' },
              { icon: '🏆', title: 'Reyting va musobaqalar', desc: "Do'stlaringiz bilan bellashing va reytingda yuqorilarga ko'tariling." },
              { icon: '🎁', title: 'Badge va mukofotlar', desc: "Yutuqlaringiz uchun maxsus badge va qimmatbaho mukofotlar." },
            ].map((it, i) => (
              <li key={i} className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-950/30 flex items-center justify-center text-xl shrink-0">{it.icon}</div>
                <div>
                  <p className="font-bold text-sm text-foreground">{it.title}</p>
                  <p className="text-xs text-muted-foreground">{it.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DashboardPreviewCard />
      </section>

      {/* ════════════ PARENTS MONITORING ════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50/50 to-white dark:from-orange-950/20 dark:to-card p-6 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
              Farzandingiz natijasini<br /><span className="text-orange-500">real vaqtda kuzating</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              IQROMAX sizga farzandingizning o'quv jarayoni va natijalarini kuzatish uchun barcha kerakli vositalarni taqdim etadi.
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                "Kundalik mashg'ulotlar va progress",
                'Kuchli statistikalar va tahlillar',
                "Tavsiyalar va rivojlantirish yo'nalishlari",
                'Motivatsiya va eslatmalar tizimi',
                "Xavfsiz muhit va shaxsiy ma'lumotlar himoyasi",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/parent-dashboard')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-11 px-6 font-bold">
              Batafsil ma'lumot <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <ParentDashboardCard />
        </div>
      </section>

      {/* ════════════ TEACHERS — INCOME ════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50 to-white dark:from-violet-950/20 dark:to-card p-6 sm:p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
              Bilimingizni<br />
              <span className="text-violet-600">daromadga aylantiring</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              O'z kurslaringizni yarating, o'quvchilarni o'qiting va barqaror daromad oling.
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                "O'z guruhingizni oching va boshqaring",
                "Tayyor kurslar va mashq materiallari",
                "O'quvchilar progressini kuzating",
                "Barqaror va oshib boradigan daromad",
              ].map((t, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                  <span className="text-foreground/80">{t}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate('/lms')} className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-11 px-6 font-bold">
              Trener bo'lish <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <TeacherIncomeCard />
        </div>
      </section>

      {/* ════════════ REFERRAL CASHBACK ════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-card p-6 sm:p-8 lg:p-10">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
              Do'stlaringizni taklif qiling<br />
              va <span className="text-emerald-600">keshbek oling!</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Do'stingiz platformaga qo'shilsa, siz 3 yilgacha doimiy keshbekdan foydalanasiz. Ko'proq taklif — ko'proq foyda!
            </p>
            <div className="inline-flex items-center gap-3 bg-emerald-500 text-white rounded-2xl p-4 sm:p-5 shadow-lg">
              <div className="text-4xl sm:text-5xl font-black">25%</div>
              <div className="text-xs sm:text-sm font-bold leading-tight">
                dan boshlab<br />
                <span className="text-amber-200">3 YILGACHA KESHBEK!</span>
              </div>
              <Gift className="h-10 w-10 text-amber-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: UserPlus, label: "Do'stingizni taklif qiling", desc: 'Unikal havolangizni ulashing.' },
              { icon: CheckCircle2, label: "Do'stingiz ro'yxatdan o'tadi", desc: "U IQROMAX'da hisob ochadi." },
              { icon: GraduationCap, label: "Do'stingiz o'qishni boshlaydi", desc: 'Faol darslarga qatnashadi.' },
              { icon: Wallet, label: 'Siz keshbek olasiz!', desc: 'Daromadingiz hisobingizga keladi.' },
            ].map((s, i) => (
              <Card key={i} className="p-3 sm:p-4 border-emerald-200/60 dark:border-emerald-800/30 hover:shadow-md transition-shadow text-center">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto mb-2">
                  <s.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="font-bold text-[11px] sm:text-xs text-foreground mb-1">{i + 1}. {s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ TESTIMONIALS ════════════ */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-2">Foydalanuvchilarimiz nima deydi?</h2>
        </div>

        {testimonials.length > 0 ? (
          <Carousel opts={{ align: 'start', loop: true }} plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]} className="w-full">
            <CarouselContent className="-ml-3">
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="pl-3 basis-[88%] sm:basis-1/2 lg:basis-1/3">
                  <Card className="p-5 border-border/40 hover:shadow-md transition-all h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center shrink-0 overflow-hidden">
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt={t.name} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-emerald-700" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">{t.name}</h4>
                        <p className="text-[11px] text-muted-foreground">{t.role}</p>
                        <div className="flex gap-0.5 mt-0.5">{renderStars(t.rating)}</div>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4">"{t.content}"</p>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : (
          <Card className="p-6 text-center border-border/40">
            <p className="text-sm text-muted-foreground">Hozircha fikrlar yo'q. Birinchi bo'lib sharh qoldiring!</p>
            <div className="mt-3 inline-block">
              <TestimonialForm onSuccess={() => {}} />
            </div>
          </Card>
        )}
      </section>

      {/* ════════════ FINAL CTA ════════════ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2818] to-[#0f3a22] p-8 sm:p-12 text-center">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative">
          <img src={logo} alt="IQROMAX" className="h-12 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">Hoziroq IQROMAX'ni sinab ko'ring</h3>
          <p className="text-emerald-100/80 text-sm mb-6 max-w-md mx-auto">
            Bepul ro'yxatdan o'ting va farzandingizning aqliy salohiyatini bugundan boshlab oching.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="h-12 px-7 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-xl">
              Bepul boshlash <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/pricing')} className="h-12 px-7 rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white font-bold backdrop-blur">
              Tariflar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ─────────── Sub-cards ─────────── */

const DashboardPreviewCard = () => (
  <Card className="p-4 sm:p-5 bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-950/40 dark:to-card border-violet-200 dark:border-violet-800/30 shadow-xl">
    <div className="flex items-center gap-2 mb-4">
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-black">A</div>
      <p className="text-sm font-bold">Salom, Asadbek!</p>
    </div>

    <div className="grid grid-cols-3 gap-2 mb-3">
      {[
        { label: 'Daraj', val: '7' },
        { label: 'XP', val: '650' },
        { label: 'Bugun', val: '24/30' },
      ].map((s) => (
        <div key={s.label} className="bg-white/60 dark:bg-white/5 rounded-xl p-2 text-center">
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
          <p className="text-sm font-black text-violet-700">{s.val}</p>
        </div>
      ))}
    </div>

    <div className="bg-white/70 dark:bg-white/5 rounded-xl p-3 mb-3">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-bold">Bugungi mashq</span>
        <span className="text-emerald-600 font-bold">+15 XP</span>
      </div>
      <div className="h-2 bg-violet-200 dark:bg-violet-900/40 rounded-full overflow-hidden">
        <div className="h-full w-[80%] bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">24 / 30 mashq</p>
    </div>

    <div className="bg-white/70 dark:bg-white/5 rounded-xl p-3">
      <p className="text-xs font-bold mb-2">Top reyting</p>
      <ul className="space-y-1.5">
        {[
          { n: 'Asadbek', s: '15 300' },
          { n: 'Zarina', s: '12 450' },
          { n: 'Jahongir', s: '11 200' },
        ].map((p, i) => (
          <li key={i} className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-violet-200 dark:bg-violet-900/40 flex items-center justify-center text-[10px] font-bold text-violet-700">{i + 1}</span>
              {p.n}
            </span>
            <span className="font-bold text-violet-700">{p.s}</span>
          </li>
        ))}
      </ul>
    </div>
  </Card>
);

const ParentDashboardCard = () => (
  <Card className="p-4 sm:p-5 bg-white dark:bg-card border-orange-200/60 dark:border-orange-800/30 shadow-xl">
    <div className="flex items-center gap-2 mb-4">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[11px] font-black">A</div>
      <div className="flex-1">
        <p className="text-xs font-bold">Asadbek Abduazizov</p>
        <p className="text-[10px] text-muted-foreground">Level 7</p>
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2 mb-3">
      {[
        { l: 'Kurslar', v: '12' },
        { l: 'XP', v: '2350' },
        { l: 'Progress', v: '75%' },
        { l: 'Davomat', v: '95%' },
      ].map((s) => (
        <div key={s.l} className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-orange-600">{s.v}</p>
          <p className="text-[9px] text-muted-foreground">{s.l}</p>
        </div>
      ))}
    </div>
    <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold">Haftalik progress</p>
        <span className="text-[10px] text-orange-600 font-bold">75%</span>
      </div>
      <svg viewBox="0 0 200 60" className="w-full h-14">
        <polyline
          points="0,45 33,40 66,30 99,25 132,15 165,12 198,8"
          fill="none"
          stroke="rgb(249, 115, 22)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {[0, 33, 66, 99, 132, 165, 198].map((x, i) => (
          <circle key={i} cx={x} cy={[45, 40, 30, 25, 15, 12, 8][i]} r="3" fill="rgb(249, 115, 22)" />
        ))}
      </svg>
      <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
        {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map((d) => <span key={d}>{d}</span>)}
      </div>
    </div>
  </Card>
);

const TeacherIncomeCard = () => (
  <Card className="p-4 sm:p-5 bg-white dark:bg-card border-violet-200/60 dark:border-violet-800/30 shadow-xl">
    <div className="grid grid-cols-2 gap-3 mb-3">
      <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3">
        <p className="text-[10px] text-muted-foreground">Oylik daromad</p>
        <p className="text-lg font-black text-violet-700">12 450 000 so'm</p>
        <p className="text-[10px] text-emerald-600 font-bold">+16%</p>
      </div>
      <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] text-muted-foreground">O'quvchilar</p>
          <Users className="h-3 w-3 text-violet-600" />
        </div>
        <p className="text-lg font-black text-violet-700">56</p>
        <p className="text-[10px] text-violet-600">Batafsil ›</p>
      </div>
    </div>
    <div className="bg-violet-50/50 dark:bg-violet-950/20 rounded-xl p-3 mb-3">
      <p className="text-xs font-bold mb-2">Daromad o'sishi</p>
      <svg viewBox="0 0 200 50" className="w-full h-12">
        <polyline
          points="0,40 50,35 100,25 150,15 200,8"
          fill="none"
          stroke="rgb(124, 58, 237)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        { i: TrendingUp, l: '500+', s: 'Faol trener' },
        { i: Users, l: '10 000+', s: "O'quvchi" },
        { i: Coins, l: '12.4 mln+', s: 'Daromad' },
      ].map((s, i) => (
        <div key={i} className="bg-violet-50/30 dark:bg-violet-950/10 rounded-lg p-2">
          <s.i className="h-4 w-4 text-violet-600 mx-auto mb-1" />
          <p className="text-xs font-black text-violet-700">{s.l}</p>
          <p className="text-[9px] text-muted-foreground">{s.s}</p>
        </div>
      ))}
    </div>
  </Card>
);
