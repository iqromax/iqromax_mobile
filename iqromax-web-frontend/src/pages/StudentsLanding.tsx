import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Zap className={className} />;
  return <IconComponent className={className} />;
};

import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Gamepad2, Trophy, Target, Zap, Award, Star, Play, ChevronRight, CheckCircle2,
  BookOpen, BarChart3, Users, Calendar, Bell, ClipboardCheck, Sparkles,
  Crown, Shield, Flame,
} from 'lucide-react';
import heroKids from '@/assets/hero-student-tablet.jpg';

const StudentsLanding = () => {
  const navigate = useNavigate();
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const res = await api.get('features/');
        setDbFeatures(res.data);
      } catch (err) {
        console.error("Error fetching features:", err);
      }
    };
    fetchFeatures();
  }, []);

  const features = [
    { icon: Gamepad2, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40', title: 'Qiziqarli mashqlar', desc: "Darajaga mos mashqlar, interaktiv topshiriqlar va mini o'yinlar." },
    { icon: Zap, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40', title: 'XP va level tizimi', desc: "XP to'plang, yangi levelga o'ting va o'z mahoratingizni oshiring." },
    { icon: Trophy, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40', title: 'Top reyting', desc: "Do'stlaringiz bilan bellashing va reytingda eng yuqoriga chiqing." },
    { icon: Award, color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40', title: 'Badges va mukofotlar', desc: "Yutuqlaringiz uchun noyob badges va sovg'alar oling." },
    { icon: Target, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40', title: 'Kunlik maqsadlar', desc: "Har kuni o'z maqsadingizni bajaring va streak seriyangizni saqlang." },
    { icon: BarChart3, color: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40', title: 'Tezkor natijalar', desc: "Grafiklar va statistika orqali o'sishingizni real vaqtda kuzating." },
  ];

  const levels = [
    { n: 1, t: "Boshlang'ich", d: "Asosiy arifmetik amallar va tez hisoblash asoslari", v: 70, c: 'bg-emerald-500', bg: 'from-emerald-50 to-emerald-100/50' },
    { n: 2, t: "O'rta", d: "Murakkabroq misollar va aralash mashqlar", v: 25, c: 'bg-violet-500', bg: 'from-violet-50 to-violet-100/50' },
    { n: 3, t: "Ilg'or", d: "Vaqtga qarshi mashqlar va mantiqiy topshiriqlar", v: 60, c: 'bg-orange-500', bg: 'from-orange-50 to-orange-100/50' },
    { n: 4, t: "Chempion", d: "Eng yuqori daraja! Chempionlar ligasiga qo'shiling", v: 100, c: 'bg-amber-500', bg: 'from-amber-50 to-amber-100/50' },
  ];

  const badges = [
    { i: Star, c: 'bg-emerald-100 text-emerald-600', t: 'Boshlovchi' },
    { i: Zap, c: 'bg-sky-100 text-sky-600', t: 'Tezkor' },
    { i: Target, c: 'bg-violet-100 text-violet-600', t: 'Aniq hisobchi' },
    { i: Flame, c: 'bg-orange-100 text-orange-600', t: 'Streak ustasi' },
    { i: Trophy, c: 'bg-amber-100 text-amber-600', t: 'Top 10' },
    { i: Shield, c: 'bg-rose-100 text-rose-600', t: 'Master' },
    { i: Crown, c: 'bg-fuchsia-100 text-fuchsia-600', t: 'Legend' },
  ];

  const testimonials = [
    { name: 'Asadbek, 11 yosh', text: "IQROMAX mashqlari juda qiziqarli! Har kuni o'ynab o'rganaman va tez hisoblashni ancha yaxshiladim." },
    { name: 'Zarina, 10 yosh', text: "Level o'tish va badges olish menga motivatsiya beradi. Do'stlarim bilan musobaqa qilish yoqadi." },
    { name: 'Jahongir, 12 yosh', text: "Kunlik maqsadlar meni intizomli bo'lishga o'rgatdi. Endi matematika menga oson!" },
  ];

  const faqs = [
    { q: "IQROMAX'da qanday mashqlar bor?", a: "Tez hisoblash, mantiq, soroban abakus, matematika va aralash mashqlar." },
    { q: "Badges va mukofotlar qanday olinadi?", a: "Maqsadlarni bajarib, levellarni o'tib va musobaqalarda g'olib bo'lib." },
    { q: "XP va level tizimi qanday ishlaydi?", a: "Har bir to'g'ri javob va bajarilgan vazifa uchun XP olasiz, ma'lum miqdorga yetganda yangi levelga o'tasiz." },
    { q: "Streak seriyasini qanday saqlash mumkin?", a: "Har kuni kamida bitta mashq bajaring va seriyangizni davom ettiring." },
    { q: "Kunlik maqsad nima uchun kerak?", a: "Har kuni ozgina mashq qilish samarali natija beradi va odat hosil qiladi." },
    { q: "Do'stlarni qanday qo'shish mumkin?", a: "Profil sahifasidan do'st kodi orqali do'stlaringizni qo'shing va ular bilan musobaqa qiling." },
    { q: "Musobaqalarda qanday qatnashaman?", a: "Haftalik chellenj va Top 3 musobaqalariga avtomatik qatnashasiz." },
    { q: "Ota-onam mening natijalarimni ko'ra oladimi?", a: "Ha, ota-onangiz alohida panel orqali sizning yutuqlaringizni kuzatib boradi." },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf7] dark:bg-background">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />

      <main className="pt-4 pb-16">
        {/* HERO */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06180e] via-[#0a2818] to-[#0f3a22] text-white">
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
            <div className="relative grid lg:grid-cols-[1.05fr_1fr] gap-4 lg:gap-8 p-4 sm:p-8 lg:p-10 min-h-[420px] lg:min-h-[560px]">
              <div className="flex flex-col justify-center order-2 lg:order-1 max-w-2xl">
                <div className="inline-flex self-start items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full mb-3 sm:mb-5">
                  <Sparkles className="h-3.5 w-3.5" /> O'QUVCHI BO'LIMI
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-[1.05] mb-3 sm:mb-5">
                  O'ynab o'rganing,
                  <span className="block text-emerald-400">tez rivojlaning!</span>
                </h1>
                <p className="hidden sm:block text-base text-white/70 mb-6 max-w-lg leading-relaxed">
                  Qiziqarli mashqlar, XP va level tizimi, kunlik maqsadlar va do'stlar bilan musobaqalar orqali tez hisoblash ko'nikmalaringizni super darajaga chop eting!
                </p>

                <ul className="hidden sm:block space-y-3 mb-6">
                  {[
                    { i: '🎮', t: 'Gamifikatsiya va ball tizimi', d: "XP to'plang, level oting va sovg'alar yuting" },
                    { i: '🔥', t: 'Kunlik mashq va streak', d: "Har kuni mashq qiling va seriyangiz saqlang" },
                    { i: '🏆', t: "Do'stlar bilan musobaqa", d: "Reytingda yuqorilab, yetakchi bo'ling" },
                  ].map(f => (
                    <li key={f.t} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-base">{f.i}</div>
                      <div>
                        <p className="text-sm font-bold">{f.t}</p>
                        <p className="text-xs text-white/60">{f.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button size="lg" onClick={() => navigate('/train')} className="h-10 sm:h-12 px-4 sm:px-6 rounded-full font-bold gap-2 bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg">
                    <Play className="h-4 w-4" /> Boshlash <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/about')} className="hidden sm:inline-flex h-12 px-6 rounded-full font-bold gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white">
                    <Play className="h-4 w-4" /> Demo ko'rish
                  </Button>
                </div>
              </div>

              {/* RIGHT: image + overlays */}
              <div className="relative order-1 lg:order-2 min-h-[200px] sm:min-h-[480px]">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img src={heroKids} alt="O'quvchi" className="w-full h-full object-cover" />
                </div>

                {/* Level card */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#0a2818]/90 backdrop-blur-md border border-emerald-400/30 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl w-[110px] sm:w-[200px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div>
                      <p className="text-xs sm:text-lg font-black leading-none">Level 7</p>
                      <p className="text-[8px] sm:text-[10px] text-emerald-300/70 mt-0.5">XP 900 / 1200</p>
                    </div>
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400 ml-auto" />
                  </div>
                  <div className="h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-[8px] sm:text-[10px] text-emerald-300/70 text-right mt-0.5">Zo'r!</p>
                </div>

                {/* Top reyting */}
                <div className="hidden sm:block absolute top-[120px] right-4 bg-[#0a2818]/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3 shadow-xl w-[200px]">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold">Top reyting</p>
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <ul className="space-y-1">
                    {[{n:'Asadbek',s:'15 300'},{n:'Zarina',s:'12 450'},{n:'Jahongir',s:'11 200'},{n:'Sarvar',s:'10 150'}].map((p,i)=>(
                      <li key={i} className="flex justify-between text-[10px]">
                        <span className="flex gap-1"><span className="text-emerald-300/70 w-3">{i+1}</span><span className="font-semibold">{p.n}</span></span>
                        <span className="font-bold">{p.s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Daily goal */}
                <div className="hidden sm:flex absolute top-[300px] right-4 bg-[#0a2818]/90 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-3 shadow-xl w-[200px] flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold">Kunlik maqsad 🎯</p>
                    <span className="text-[10px] text-emerald-300/70">3/5</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="text-[9px] text-emerald-300/60">Yana 2 ta mashq bajariling 🎁</p>
                </div>

                {/* Badges */}
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-violet-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl text-white flex items-center gap-2 sm:gap-3 w-[110px] sm:w-[200px]">
                  <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-lg bg-amber-400 flex items-center justify-center shrink-0">
                    <Star className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-700 fill-amber-600" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-[10px] text-white/70">Badges</p>
                    <p className="text-sm sm:text-lg font-black">12 <span className="text-[10px] sm:text-sm text-white/60">/ 24</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* FEATURES */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3">
              O'quvchilar uchun yaratilgan <span className="text-emerald-500">xususiyatlar</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">O'yin elementi bilan o'qish ko'proq motivatsiya va natija beradi!</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {(dbFeatures.length > 0 ? dbFeatures : features).map((f, i) => {
              const isDb = !!f.slug;
              const title = isDb ? f.name : f.title;
              const desc = isDb ? f.description : f.desc;
              const slugOrId = isDb ? f.slug : f.id;

              const getColorClasses = (colorName: string) => {
                switch (colorName) {
                  case 'emerald': return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40';
                  case 'blue': return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40';
                  case 'amber': return 'bg-amber-50 text-amber-600 dark:bg-amber-950/40';
                  case 'rose': return 'bg-rose-50 text-rose-600 dark:bg-rose-950/40';
                  case 'violet': return 'bg-violet-50 text-violet-600 dark:bg-violet-950/40';
                  case 'cyan': return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40';
                  default: return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40';
                }
              };

              const colorClass = isDb ? getColorClasses(f.color) : f.color;

              return (
                <div 
                  key={i} 
                  onClick={() => navigate(`/feature/${slugOrId}`)}
                  className="bg-white dark:bg-card rounded-2xl p-4 sm:p-5 border border-border/40 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-500/20"
                >
                  <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center mb-2 sm:mb-3 ${colorClass}`}>
                    {isDb ? (
                      <DynamicIcon name={f.icon} className="h-5 w-5" />
                    ) : (
                      <f.icon className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              Bitta ekran <span className="text-emerald-500">— barcha imkoniyatlar</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Shaxsiy boshqaruv panelingizda o'qish jarayoningizni kuzating va boshqaring.</p>
          </div>

          <div className="bg-white dark:bg-card rounded-3xl p-4 sm:p-8 border border-border/40 shadow-sm">
            <div className="grid lg:grid-cols-[200px_1fr] gap-4">
              <aside className="bg-muted/40 rounded-2xl p-4 hidden lg:block">
                <div className="flex items-center gap-2 mb-5">
                  <img src="/favicon.ico" alt="" className="h-7 w-7 rounded" />
                  <p className="text-xs font-black text-emerald-600">IQROMAX</p>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {[
                    { i: BarChart3, t: 'Asosiy', active: true },
                    { i: Gamepad2, t: 'Mashqlar' },
                    { i: BookOpen, t: 'Kurslar' },
                    { i: Trophy, t: 'Reyting' },
                    { i: Target, t: 'Maqsadlar' },
                    { i: Award, t: 'Badges' },
                    { i: Users, t: "Do'stlar" },
                    { i: Bell, t: 'Sozlamalar' },
                  ].map((it, i) => (
                    <li key={i} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${it.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 font-bold' : 'hover:bg-muted'}`}>
                      <it.i className="h-3.5 w-3.5" /><span>{it.t}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 bg-orange-100 dark:bg-orange-950/30 rounded-xl p-3 text-center">
                  <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Streak</p>
                  <p className="text-lg font-black text-orange-600">7 kun</p>
                </div>
              </aside>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3 sm:p-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black">A</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">Salom, Asadbek! 👋</p>
                    <p className="text-[10px] text-muted-foreground">Bugungi maqsadingizga yaqinlashayapsiz</p>
                  </div>
                  <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-950/30 px-2 py-1 rounded-full">🔥 7 kun</span>
                  <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/30 px-2 py-1 rounded-full">⭐ 1 250 XP</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-[10px] text-muted-foreground mb-1">Bugungi mashq</p>
                    <p className="text-sm font-bold mb-2">Tez hisoblash – Aralash</p>
                    <p className="text-[10px] text-muted-foreground mb-3">(Murakkabroq)</p>
                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-8 px-4 text-xs font-bold">Boshlash</Button>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4 text-center">
                    <p className="text-[10px] text-muted-foreground mb-2">Kunlik maqsad</p>
                    <div className="relative w-20 h-20 mx-auto mb-2">
                      <svg className="transform -rotate-90 w-20 h-20">
                        <circle cx="40" cy="40" r="34" stroke="hsl(var(--muted))" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="34" stroke="rgb(16,185,129)" strokeWidth="6" fill="none" strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * 0.4} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-black">3 / 5</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Yana 2 ta mashq bajaring</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-xs font-bold mb-2">Top reyting</p>
                    <ul className="space-y-1.5">
                      {[{n:'Asadbek',s:'15 300'},{n:'Zarina',s:'12 450'},{n:'Jahongir',s:'11 200'}].map((p,i)=>(
                        <li key={i} className="flex justify-between text-[10px]"><span>{i+1}. {p.n}</span><span className="font-bold">{p.s}</span></li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-emerald-600 font-bold mt-2 cursor-pointer">Barchasini ko'rish</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-xs font-bold mb-3">Yutuqlarim</p>
                    <div className="flex gap-2">
                      {[Star, Trophy, Award].map((I,i)=>(
                        <div key={i} className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center"><I className="h-5 w-5 text-white" /></div>
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-600 font-bold mt-2 cursor-pointer">Barchasini ko'rish</p>
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-xs font-bold mb-3">Kurslarim</p>
                    {[{t:"Boshlang'ich daraja",v:45,s:"60% tugatildi"},{t:"O'rta daraja",v:20,s:"20% tugatildi"}].map(c=>(
                      <div key={c.t} className="mb-2">
                        <div className="flex justify-between text-[10px] mb-1"><span>{c.t}</span><span className="font-bold">{c.v}%</span></div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{width:`${c.v}%`}} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/40 rounded-xl p-4">
                    <p className="text-xs font-bold mb-3">Mening o'sishim</p>
                    <svg viewBox="0 0 200 80" className="w-full h-20">
                      <polyline points="0,70 40,55 80,40 120,30 160,15 200,5" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" />
                      {[[0,70],[40,55],[80,40],[120,30],[160,15],[200,5]].map(([x,y],i)=>(
                        <circle key={i} cx={x} cy={y} r="2.5" fill="rgb(16,185,129)" />
                      ))}
                    </svg>
                    <div className="flex justify-between text-[9px] text-muted-foreground">
                      {['1-h','2-h','3-h','4-h'].map(d=><span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPETITIONS */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              Musobaqalar <span className="text-emerald-500">va yutuqlar dunyosi</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Bellashing, g'alaba qozoning va sovg'alarga ega bo'ling!</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 dark:from-violet-950/30 dark:to-violet-900/10 rounded-2xl p-4 border border-violet-200/40">
              <p className="text-xs font-bold text-violet-700 mb-1">Haftalik chellenj</p>
              <p className="text-[10px] text-muted-foreground mb-2">Qoldi: 3 kun 12:46:30</p>
              <p className="text-sm font-bold mb-2">100 mashqni bajaring</p>
              <p className="text-xs text-muted-foreground mb-2">75 / 100</p>
              <div className="h-1.5 bg-white rounded-full overflow-hidden mb-3"><div className="h-full bg-violet-500 rounded-full" style={{width:'75%'}} /></div>
              <Button size="sm" className="bg-violet-500 hover:bg-violet-600 text-white rounded-full h-8 px-4 text-xs font-bold w-full">Qatnashish</Button>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border/40">
              <p className="text-xs font-bold mb-3">Top 3 o'quvchi</p>
              <ul className="space-y-2">
                {[{n:'Asadbek',s:'15 300 XP'},{n:'Zarina',s:'12 450 XP'},{n:'Jahongir',s:'11 200 XP'}].map((p,i)=>(
                  <li key={i} className="flex items-center gap-2">
                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i===0?'bg-amber-400 text-white':i===1?'bg-zinc-300 text-zinc-700':'bg-orange-300 text-white'}`}>{i+1}</span>
                    <span className="flex-1 text-xs font-semibold">{p.n}</span>
                    <span className="text-[10px] font-bold">{p.s}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-emerald-600 font-bold mt-3 cursor-pointer text-center">Barcha reyting</p>
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border/40">
              <p className="text-xs font-bold mb-3">Mukofotlar do'koni</p>
              {[{t:'500 XP',i:'⭐'},{t:'2000 XP',i:'🏅'},{t:'Premium avatar',i:'👤'}].map((m,i)=>(
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{m.i}</span>
                  <span className="flex-1 text-xs font-semibold">{m.t}</span>
                  <Button size="sm" variant="outline" className="h-6 text-[10px] rounded-full">Olish</Button>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-card rounded-2xl p-4 border border-border/40">
              <p className="text-xs font-bold mb-3">Yangi missiyalar</p>
              {[
                {t:'5 kun streak saqlang',v:'0 / 5',xp:'100 XP'},
                {t:'20 ta matematik topishmoq',v:'10 / 20',xp:'150 XP'},
                {t:"Do'stni taklif qiling",v:'0 / 1',xp:'200 XP'},
              ].map((m,i)=>(
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-[10px]"><span>{m.t}</span><span className="font-bold text-emerald-600">{m.xp}</span></div>
                  <p className="text-[9px] text-muted-foreground">{m.v}</p>
                </div>
              ))}
              <p className="text-[10px] text-emerald-600 font-bold mt-2 cursor-pointer">Barcha missiyalar</p>
            </div>
          </div>
        </section>

        {/* COLLECTION BADGES */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-16">
          <div className="bg-white dark:bg-card rounded-3xl p-5 sm:p-8 border border-border/40">
            <h3 className="text-lg sm:text-xl font-black mb-5">Kolleksion badges</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
              {badges.map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center mb-2 ${b.c}`}>
                    <b.i className="h-7 w-7" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold">{b.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LEVELS */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">
              Darajalar yo'li <span className="text-emerald-500">— chempion bo'ling!</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Boshlang'ichdan chempionga bo'lgan yo'l. Har bir qadamda yangi bilim va yutuqlar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {levels.map((l) => (
              <div key={l.n} className={`bg-gradient-to-br ${l.bg} dark:from-card dark:to-card rounded-2xl p-4 border border-border/40`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-8 w-8 rounded-full ${l.c} text-white flex items-center justify-center font-black text-sm`}>{l.n}</span>
                  <p className="font-bold text-sm">{l.t}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{l.d}</p>
                <div className="flex justify-between text-[10px] mb-1"><span>Progress</span><span className="font-bold">{l.v}%</span></div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden">
                  <div className={`h-full ${l.c} rounded-full`} style={{ width: `${l.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">O'quvchilarimiz nima deydi?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-2xl p-5 border border-border/40">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black">{t.name[0]}</div>
                  <p className="text-sm font-bold">{t.name}</p>
                </div>
                <div className="flex gap-0.5 mb-2">{Array.from({length:5}).map((_,j)=><Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-xs leading-relaxed text-muted-foreground italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-3 sm:px-6 max-w-3xl mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-black text-center mb-6 sm:mb-8">Ko'p beriladigan savollar</h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <details key={i} className="bg-white dark:bg-card rounded-2xl p-4 border border-border/40 group">
                <summary className="font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-between gap-2">
                  {f.q}
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 shrink-0" />
                </summary>
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-3 sm:px-6 max-w-7xl mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-6 sm:p-10 text-white text-center">
            <h2 className="text-xl sm:text-3xl font-black mb-3">O'ynab o'rganishni hoziroq boshlang!</h2>
            <p className="text-xs sm:text-sm text-white/85 mb-5 max-w-xl mx-auto">Bepul ro'yxatdan o'ting va birinchi mashqingizni hoziroq boshlang.</p>
            <Button size="lg" onClick={() => navigate('/auth')} className="bg-white text-emerald-700 hover:bg-white/90 rounded-full h-11 sm:h-12 px-6 font-black gap-2">
              Bepul boshlash <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StudentsLanding;
