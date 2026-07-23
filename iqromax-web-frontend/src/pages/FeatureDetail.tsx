import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';
import { motion, useScroll } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return <Icons.Zap className={className} />;
  return <IconComponent className={className} />;
};

import { 
  ChevronLeft, 
  Gamepad2, 
  Zap, 
  Trophy, 
  Award, 
  Target, 
  BarChart3, 
  Star, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  MousePointer2
} from 'lucide-react';
import { CourseEnrollmentDialog } from '@/components/CourseEnrollmentDialog';

const featureDetails: Record<string, any> = {
  'qiziqarli-mashqlar': {
    title: "Qiziqarli mashqlar",
    subtitle: "O'yin orqali o'rganish - yangi avlod ta'limi!",
    desc: "Matematika endi zerikarli emas! Biz har bir misolni qiziqarli topshiriqqa aylantirdik. Bolalar o'yin o'ynash asnosida mantiqiy fikrlashni rivojlantiradilar.",
    image: "https://images.unsplash.com/photo-1611996598516-5147a0db03dd?q=80&w=2070&auto=format&fit=crop",
    icon: Gamepad2,
    color: "emerald",
    stats: { users: "25k+", rating: "4.9", tasks: "500+" },
    steps: [
      { t: "Darajani tanlang", d: "Bolaning bilimiga mos boshlang'ich nuqta." },
      { t: "O'yinda qatnashing", d: "Interaktiv va qiziqarli topshiriqlar." },
      { t: "Natijani ko'ring", d: "Har bir to'g'ri javob uchun mukofot." }
    ]
  },
  'xp-level': {
    title: "XP va level tizimi",
    subtitle: "O'sish darajangizni har qadamda his qiling!",
    desc: "Tajriba ballari (XP) bolaga o'z yutuqlarini vizual tarzda ko'rish imkonini beradi. Har bir yangi daraja - bu yangi imkoniyatlar demakdir.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    icon: Zap,
    color: "blue",
    stats: { users: "18k+", rating: "4.8", tasks: "100 levels" },
    steps: [
      { t: "Vazifani bajaring", d: "To'g'ri yechim uchun XP oling." },
      { t: "Levelga ko'taring", d: "Yangi unvon va imkoniyatlar oching." },
      { t: "Cho'qqini zabt eting", d: "Eng yuqori darajaga yeting." }
    ]
  },
  'top-reyting': {
    title: "Top reyting",
    subtitle: "Eng yaxshilar orasida o'z o'rningizni toping!",
    desc: "Sog'lom raqobat bolani yanada ko'proq ishlashga undaydi. Dunyo bo'ylab minglab tengdoshlar orasida o'z mahoratingizni ko'rsating.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
    icon: Trophy,
    color: "amber",
    stats: { users: "40k+", rating: "5.0", tasks: "Weekly" },
    steps: [
      { t: "Ball to'plang", d: "Mashqlarni aniq va tez bajaring." },
      { t: "Reytingni kuzating", d: "O'z o'rningizni real vaqtda ko'ring." },
      { t: "Sovrin yuting", d: "Haftalik yetakchilar uchun sovg'alar." }
    ]
  },
  'badges-mukofotlar': {
    title: "Badges va mukofotlar",
    subtitle: "Har bir kichik yutuq - katta bayram!",
    desc: "Nishonlar (badges) bolaning profilingizni bezatibgina qolmay, uning qaysi sohalarda kuchli ekanligini ham ko'rsatadi.",
    image: "https://images.unsplash.com/photo-1589482523598-a3cb0661ffc2?q=80&w=2070&auto=format&fit=crop",
    icon: Award,
    color: "rose",
    stats: { users: "12k+", rating: "4.9", tasks: "60+ Badges" },
    steps: [
      { t: "Rekord o'rnating", d: "O'z natijalaringizni yangilang." },
      { t: "Nishonni oling", d: "Profilga qo'shiladigan noyob badges." },
      { t: "Maqtanish vaqti", d: "Yutuqlaringizni do'stlarga ko'rsating." }
    ]
  },
  'kunlik-maqsadlar': {
    title: "Kunlik maqsadlar",
    subtitle: "Uzluksiz ta'lim - muvaffaqiyat garovi!",
    desc: "Kichik qadamlar bilan katta maqsadlar sari. Har kuni atigi 15 daqiqa matematika bilan shug'ullanish orqali hayratlanarli natijalar.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
    icon: Target,
    color: "violet",
    stats: { users: "15k+", rating: "4.7", tasks: "Daily" },
    steps: [
      { t: "Vazifani oling", d: "Har kuni yangi 3 ta maqsad." },
      { t: "Streakni saqlang", d: "Kunlarni o'tkazib yubormang." },
      { t: "Bonus yuting", d: "Uzluksiz kunlar uchun bonus ball." }
    ]
  },
  'tezkor-natijalar': {
    title: "Tezkor natijalar",
    subtitle: "O'z rivojlanishingizni tahlil qiling!",
    desc: "Bizning intellektual tahlil tizimimiz har bir javobingizni o'rganadi. Qayerda xato qilayotganingizni aniq ko'rsatib beramiz.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    icon: BarChart3,
    color: "cyan",
    stats: { users: "20k+", rating: "4.8", tasks: "Analytics" },
    steps: [
      { t: "Test topshiring", d: "Bilimingizni sinovdan o'tkazing." },
      { t: "Hisobot oling", d: "Batafsil grafiklar va tahlillar." },
      { t: "Rivojlaning", d: "Xatolar ustida ishlash tavsiyalari." }
    ]
  }
};

const FeatureDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [feature, setFeature] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeature = async () => {
      try {
        const res = await api.get(`features/${id}/`);
        setFeature(res.data);
      } catch (err) {
        console.error("Error fetching feature from API:", err);
      } finally {
        setLoading(false);
      }
    };
    getFeature();
  }, [id]);

  const staticFeature = id ? featureDetails[id] : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center font-bold text-zinc-500 animate-pulse">Yuklanmoqda...</div>
      </div>
    );
  }

  const finalFeature = feature ? {
    title: feature.name,
    subtitle: feature.detail ? feature.detail.subtitle : feature.description,
    desc: feature.detail ? feature.detail.description : feature.description,
    image: feature.detail ? feature.detail.image : "https://images.unsplash.com/photo-1611996598516-5147a0db03dd?q=80&w=2070",
    icon: feature.icon,
    color: feature.color || "emerald",
    stats: { users: "25k+", rating: "4.9", tasks: "500+" },
    steps: feature.detail ? [
      { t: feature.detail.step1_title, d: feature.detail.step1_desc },
      { t: feature.detail.step2_title, d: feature.detail.step2_desc },
      { t: feature.detail.step3_title, d: feature.detail.step3_desc }
    ] : [
      { t: "Darajani tanlang", d: "Bolaning bilimiga mos boshlang'ich nuqta." },
      { t: "O'yinda qatnashing", d: "Interaktiv va qiziqarli topshiriqlar." },
      { t: "Natijani ko'ring", d: "Har bir to'g'ri javob uchun mukofot." }
    ]
  } : staticFeature;

  if (!finalFeature) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center p-6 rounded-2xl bg-white shadow-xl border border-zinc-100 max-w-xs">
          <h1 className="text-xl font-bold mb-2">Ma'lumot topilmadi</h1>
          <Button onClick={() => navigate('/')} className="w-full h-10 rounded-lg">Orqaga</Button>
        </div>
      </div>
    );
  }

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/10",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
    violet: "text-violet-500 bg-violet-500/10 border-violet-500/20 shadow-violet-500/10",
    cyan: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10"
  };

  const isStringIcon = typeof finalFeature.icon === 'string';
  const IconComponent = finalFeature.icon;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />
      
      {/* COMPACT HERO SECTION (80% FEEL) */}
      <section className="pt-8 pb-16 relative overflow-hidden">
        <div className="container max-w-6xl mx-auto px-6 relative">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="h-10 w-10 rounded-full p-0 bg-white shadow-lg shadow-zinc-200/50 hover:bg-zinc-50 border border-zinc-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Orqaga</span>
          </motion.div>
 
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl ${colorMap[finalFeature.color] || colorMap['emerald']} border text-[9px] font-black tracking-widest mb-6 uppercase shadow-md`}>
                  <Sparkles className="w-3 h-3" />
                  PREMIUM
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight tracking-tight">
                  {finalFeature.title}
                </h1>
                
                <p className="text-lg md:text-xl font-bold text-zinc-400 mb-5">
                  {finalFeature.subtitle}
                </p>
                
                <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 font-medium">
                  {finalFeature.desc}
                </p>
 
                <div className="flex flex-wrap items-center gap-4">
                  <CourseEnrollmentDialog courseName={finalFeature.title}>
                    <Button 
                      size="lg"
                      className="h-12 rounded-2xl bg-zinc-900 text-white hover:bg-emerald-600 font-black px-8 text-base shadow-xl shadow-zinc-900/10 transition-all hover:scale-105"
                    >
                      Boshlash <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CourseEnrollmentDialog>
                  
                  <div className="flex items-center gap-2 px-4 h-12 rounded-2xl bg-white border border-zinc-100 shadow-lg shadow-zinc-200/50">
                    <span className="text-xs font-black text-zinc-900">{finalFeature.stats?.users || "25k+"} faol</span>
                  </div>
                </div>
              </motion.div>
            </div>
 
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative group lg:ml-auto"
            >
              <div className="relative z-10 rounded-[30px] md:rounded-[40px] overflow-hidden border-[8px] border-white shadow-2xl w-full max-w-[420px] aspect-square bg-zinc-100">
                <img 
                  src={finalFeature.image} 
                  alt={finalFeature.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
 
              {/* Compact Floating Badges */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 rounded-2xl bg-white shadow-xl border border-zinc-100 z-20 hidden md:block"
              >
                <div className={`w-8 h-8 rounded-lg ${colorMap[finalFeature.color] || colorMap['emerald']} flex items-center justify-center mb-1`}>
                  {isStringIcon ? (
                    <DynamicIcon name={finalFeature.icon} className="w-4 h-4" />
                  ) : IconComponent ? (
                    <IconComponent className="w-4 h-4" />
                  ) : null}
                </div>
                <p className="text-sm font-black text-zinc-900">{finalFeature.stats?.rating || "4.9"}</p>
              </motion.div>
 
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-6 -left-6 p-4 rounded-2xl bg-zinc-900 text-white shadow-xl z-20 hidden md:block"
              >
                <p className="text-[8px] font-black text-white/50 uppercase tracking-widest">DARJA</p>
                <p className="text-sm font-black">{finalFeature.stats?.tasks || "500+"}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
 
      {/* COMPACT HOW IT WORKS */}
      <section className="py-16 bg-zinc-50 border-y border-zinc-100">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Qanday <span className="text-emerald-500">ishlaydi?</span></h2>
            <p className="text-zinc-500 text-sm md:text-base font-medium max-w-xl mx-auto">Siz uchun jarayonni maksimal darajada oson qildik.</p>
          </div>
 
          <div className="grid md:grid-cols-3 gap-6">
            {finalFeature.steps?.map((step: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[30px] border border-zinc-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-lg font-black mb-5">
                  {i + 1}
                </div>
                <h3 className="text-lg font-black mb-2 text-zinc-900">{step.t}</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
 
      {/* COMPACT CTA */}
      <section className="py-20">
        <div className="container max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 md:p-14 rounded-[40px] bg-zinc-900 text-white relative overflow-hidden shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              Matematikaga bo'lgan <span className="text-emerald-400">muhabbatni</span> uyg'oting!
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              <CourseEnrollmentDialog courseName={finalFeature.title}>
                <Button 
                  size="lg"
                  className="h-12 rounded-2xl bg-emerald-500 text-zinc-900 hover:bg-white font-black px-10 text-base shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  Boshlash
                </Button>
              </CourseEnrollmentDialog>
            </div>
          </motion.div>
        </div>
      </section>
 
      <Footer />
    </div>
  );
};

export default FeatureDetail;
