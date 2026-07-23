import { useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '@/lib/axios';
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
  ChevronRight, 
  Sparkles, 
  Zap, 
  Trophy, 
  Users, 
  Target,
  Flame,
  Award,
  Star,
  CheckCircle2,
  Brain,
  Gamepad2,
  BarChart3,
  Search,
  ChevronLeft,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { blogPosts } from '@/data/blogData';
import heroImage from '@/assets/hero-student.png';

const features = [
  {
    id: "qiziqarli-mashqlar",
    title: "Qiziqarli mashqlar",
    desc: "Darajaga mos mashqlar, interaktiv topshiriqlar va mini o'yinlar.",
    icon: Gamepad2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: "xp-level",
    title: "XP va level tizimi",
    desc: "XP to'plang, yangi levelga o'ting va o'z mahoratingizni oshiring.",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: "top-reyting",
    title: "Top reyting",
    desc: "Do'stlar bilan bellashing va reytingda eng yuqoriga chiqing.",
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    id: "badges-mukofotlar",
    title: "Badges va mukofotlar",
    desc: "Yutuqlaringiz uchun noyob badges va sovg'alar oling.",
    icon: Award,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: "kunlik-maqsadlar",
    title: "Kunlik maqsadlar",
    desc: "Har kuni o'z maqsadlaringizni bajaring va streak seriyangizni saqlang.",
    icon: Target,
    color: "text-violet-400",
    bg: "bg-violet-500/10"
  },
  {
    id: "tezkor-natijalar",
    title: "Tezkor natijalar",
    desc: "Grafiklar va statistika orqali o'sishingizni real vaqtda kuzating.",
    icon: BarChart3,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  }
];


const faqItems = [
  {
    q: "IQROMAX'da qanday mashqlar bor?",
    a: "Platformamizda mental arifmetika, mantiqiy fikrlash, tez o'qish va xotira mashqlari mavjud. Har bir mashq o'yin shaklida ishlab chiqilgan."
  },
  {
    q: "Badges va mukofotlar qanday olinadi?",
    a: "Mashqlarni muvaffaqiyatli yakunlash, yangi rekordlar o'rnatish va kunlik vazifalarni bajarish orqali noyob badges va virtual sovg'alar olishingiz mumkin."
  },
  {
    q: "XP va level tizimi qanday ishlaydi?",
    a: "Har bir to'g'ri javob uchun XP (ball) beriladi. Ballar yetarli bo'lganda level (daraja) oshadi va yangi imkoniyatlar ochiladi."
  },
  {
    q: "Streak seriyasini qanday saqlash mumkin?",
    a: "Har kuni kamida bitta mashqni bajarsangiz, streak seriyangiz davom etadi. Agar bir kun o'tkazib yuborsangiz, seriya nollashadi."
  },
  {
    q: "Kunlik maqsad nima uchun kerak?",
    a: "Kunlik maqsadlar o'quvchida intizom va muntazamlikni shakllantiradi. Ularni bajarish orqali qo'shimcha bonus ballar olish mumkin."
  },
  {
    q: "Do'stlarni qanday qo'shish mumkin?",
    a: "Profilingizdagi qidiruv bo'limi orqali do'stlaringizni topishingiz va ularga do'stlik so'rovi yuborishingiz mumkin."
  },
  {
    q: "Musobaqalarda qanday qatnashaman?",
    a: "Bosh sahifadagi 'Musobaqalar' bo'limiga o'tib, faol turnirlardan birini tanlashingiz va bellashuvga qo'shilishingiz mumkin."
  },
  {
    q: "Ota-onam mening natijalarimni ko'ra oladimi?",
    a: "Ha, ota-onalar uchun maxsus panel mavjud bo'lib, ular orqali farzandining o'zlashtirish ko'rsatkichlari va grafiklarini kuzatish mumkin."
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<any[]>([]);
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const [dbBlogs, setDbBlogs] = useState<any[]>([]);
  const [dbFaqs, setDbFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get('ads/');
        setSlides(res.data);
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };
    const fetchFeatures = async () => {
      try {
        const res = await api.get('features/');
        setDbFeatures(res.data);
      } catch (err) {
        console.error("Error fetching features:", err);
      }
    };
    const fetchBlogs = async () => {
      try {
        const res = await api.get('blogs/');
        setDbBlogs(res.data.slice(0, 6));
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    const fetchFaqs = async () => {
      try {
        const res = await api.get('faqs/');
        setDbFaqs(res.data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchAds();
    fetchFeatures();
    fetchBlogs();
    fetchFaqs();
  }, []);

  const slideColors = [
    "from-emerald-600/20 to-emerald-900/40",
    "from-blue-600/20 to-blue-900/40",
    "from-amber-600/20 to-amber-900/40",
    "from-violet-600/20 to-violet-900/40",
    "from-rose-600/20 to-rose-900/40",
    "from-cyan-600/20 to-cyan-900/40"
  ];

  // Hero Swiper Logic
  const [heroEmblaRef, heroEmblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 30
  }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);

  const [heroCurrentSlide, setHeroCurrentSlide] = useState(0);

  const onSelect = useCallback(() => {
    if (!heroEmblaApi) return;
    setHeroCurrentSlide(heroEmblaApi.selectedScrollSnap());
  }, [heroEmblaApi]);

  useEffect(() => {
    if (!heroEmblaApi) return;
    onSelect();
    heroEmblaApi.on('select', onSelect);
    return () => {
      heroEmblaApi.off('select', onSelect);
    };
  }, [heroEmblaApi, onSelect]);

  const heroScrollPrev = useCallback(() => {
    if (heroEmblaApi) heroEmblaApi.scrollPrev();
  }, [heroEmblaApi]);

  const heroScrollNext = useCallback(() => {
    if (heroEmblaApi) heroEmblaApi.scrollNext();
  }, [heroEmblaApi]);

  // Blog Carousel logic
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-emerald-500/30 selection:text-emerald-600">
      <Navbar soundEnabled={false} onToggleSound={() => {}} />

      <main className="pb-20">
        {/* HEADER SWIPER - PREMIUM MODERN DESIGN */}
        <section className="relative pt-6 px-4 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto relative group">
            <div className="overflow-hidden rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] bg-white" ref={heroEmblaRef}>
              <div className="flex">
                {slides.length === 0 ? (
                  <div className="flex-[0_0_100%] min-w-0 relative h-[400px] md:h-[550px] overflow-hidden flex items-center justify-center bg-zinc-50/50">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
                        <Sparkles className="w-6 h-6 animate-spin" />
                      </div>
                      <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Yuklanmoqda...</p>
                    </div>
                  </div>
                ) : (
                   slides.map((slide, i) => {
                    const colorMap: Record<string, string> = {
                      white:   '255,255,255',
                      emerald: '5,150,105',
                      blue:    '29,78,216',
                      violet:  '109,40,217',
                      amber:   '180,83,9',
                      rose:    '190,18,60',
                      slate:   '15,23,42',
                    };
                    const solid = colorMap[slide.overlay_color] || colorMap['white'];
                    const isLight = !slide.overlay_color || slide.overlay_color === 'white';
                    
                    const textColorMap: Record<string, string> = {
                      dark: '#111827',
                      white: '#ffffff',
                      emerald: '#10b981',
                      blue: '#2563eb',
                      amber: '#f59e0b',
                      rose: '#e11d48'
                    };
                    const fallbackColor = isLight ? '#111827' : '#ffffff';
                    const hasCustomText = !!slide.text_color;
                    const textMain   = hasCustomText ? textColorMap[slide.text_color] : fallbackColor;
                    const textAccent = hasCustomText ? textMain : (isLight ? '#10b981' : 'rgba(255,255,255,0.92)');
                    const textSub    = hasCustomText ? textMain : (isLight ? '#6b7280' : 'rgba(255,255,255,0.8)');
                    const badgeBg    = hasCustomText ? 'rgba(0,0,0,0.05)' : (isLight ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.22)');
                    const badgeBorder= hasCustomText ? textMain : (isLight ? 'rgba(16,185,129,0.3)'  : 'rgba(255,255,255,0.4)');
                    const badgeColor = hasCustomText ? textMain : (isLight ? '#059669' : '#fff');

                    // Desktop: chapdan o'ngga gradient — faqat chap ~30% ni qoplaydi
                    const gradDesktop = `linear-gradient(to right, rgba(${solid},1) 0%, rgba(${solid},0.92) 18%, rgba(${solid},0.45) 30%, rgba(${solid},0.05) 42%, transparent 52%)`;
                    // Mobile: pastdan yuqoriga gradient — matn sig'ishi uchun ~75% ni qoplaydi
                    const gradMobile  = `linear-gradient(to top, rgba(${solid},1) 0%, rgba(${solid},0.92) 25%, rgba(${solid},0.55) 45%, rgba(${solid},0.05) 65%, transparent 75%)`;


                    return (
                    <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-[180px] md:h-[550px] overflow-hidden">
                      {/* Rasm — to'liq background */}
                      <img
                        src={getImageUrl(slide.image)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[10s] group-hover:scale-105"
                      />

                      {/* MOBILE gradient: pastdan yuqoriga (md dan katta bo'lsa yashiriladi) */}
                      <div
                        className="absolute inset-0 z-10 md:hidden"
                        style={{ background: gradMobile }}
                      />

                      {/* DESKTOP gradient: chapdan o'ngga (faqat md va undan katta) */}
                      <div
                        className="absolute inset-0 z-10 hidden md:block"
                        style={{ background: gradDesktop }}
                      />

                      {/* Decorative Mesh Gradient */}
                      <div className={`absolute inset-0 z-10 opacity-20 mix-blend-multiply bg-gradient-to-br ${slideColors[i % slideColors.length]}`} />

                      {/* MOBILE Content — pastda */}
                      <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 px-6 pb-3 pt-6 flex justify-between items-end gap-2">
                        <div className="flex-1 min-w-0">
                          <h2
                            className="text-lg font-black mb-1 leading-tight tracking-tight"
                            style={{ color: textMain }}
                          >
                            {slide.title.split(' ').map((word: string, idx: number) => (
                              <span key={idx} style={{ color: idx === slide.title.split(' ').length - 1 ? textAccent : textMain }}>
                                {word}{' '}
                              </span>
                            ))}
                          </h2>
                          <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: textSub }}>
                            {slide.description || slide.subtitle}
                          </p>
                        </div>
                        {slide.tag && (
                          <span
                            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-black tracking-[0.15em] uppercase"
                            style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            {slide.tag}
                          </span>
                        )}
                      </div>

                      {/* DESKTOP Content — chapda */}
                      <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-center px-24">
                        <div className="max-w-xl">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black tracking-[0.2em] mb-8 w-fit uppercase"
                            style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}
                          >
                            <Sparkles className="w-4 h-4" />
                            {slide.tag || "AKSIYA"}
                          </motion.div>
                          <motion.h2
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl xl:text-6xl font-black mb-6 leading-[1.1] tracking-tight"
                            style={{ color: textMain }}
                          >
                            {slide.title.split(' ').map((word: string, idx: number) => (
                              <span key={idx} style={{ color: idx === slide.title.split(' ').length - 1 ? textAccent : textMain }}>
                                {word}{' '}
                              </span>
                            ))}
                          </motion.h2>
                          <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg font-medium max-w-md leading-relaxed"
                            style={{ color: textSub }}
                          >
                            {slide.description || slide.subtitle}
                          </motion.p>
                        </div>
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Premium Navigation Controls */}
            <div className="absolute top-1/2 -left-6 -right-6 -translate-y-1/2 hidden md:flex justify-between pointer-events-none z-20 px-4">
              <Button
                variant="outline"
                size="icon"
                onClick={heroScrollPrev}
                className="w-14 h-14 rounded-[20px] bg-white border-zinc-200 shadow-2xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900 -translate-x-4 group-hover:translate-x-0 active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={heroScrollNext}
                className="w-14 h-14 rounded-[20px] bg-white border-zinc-200 shadow-2xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-zinc-900 hover:text-white hover:border-zinc-900 translate-x-4 group-hover:translate-x-0 active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            {/* Progress Indicators — faqat desktop */}
            {slides.length > 0 && (
              <div className="absolute bottom-10 left-10 md:left-24 hidden md:flex gap-3 z-20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => heroEmblaApi?.scrollTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === heroCurrentSlide 
                      ? 'w-12 bg-emerald-500' 
                      : 'w-4 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </section>

        {/* FEATURES SECTION - ULTRA COMPACT LIGHT THEME */}
        <section className="pt-12 pb-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center mb-10">
            <h2 className="text-xl md:text-3xl font-black mb-2 text-zinc-900 tracking-tight">
              O'quvchilar uchun yaratilgan <span className="text-emerald-500">xususiyatlar</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-lg mx-auto">
              O'yin elementi bilan o'qish ko'proq motivatsiya va natija beradi!
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(dbFeatures.length > 0 ? dbFeatures : features).map((feature, i) => {
              const isDb = !!feature.slug;
              const title = isDb ? feature.name : feature.title;
              const desc = isDb ? feature.description : feature.desc;
              const slugOrId = isDb ? feature.slug : feature.id;
              
              // Color config
              const getColorClasses = (colorName: string) => {
                switch (colorName) {
                  case 'emerald': return { text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
                  case 'blue': return { text: 'text-blue-500', bg: 'bg-blue-500/10' };
                  case 'amber': return { text: 'text-amber-500', bg: 'bg-amber-500/10' };
                  case 'rose': return { text: 'text-rose-500', bg: 'bg-rose-500/10' };
                  case 'violet': return { text: 'text-violet-500', bg: 'bg-violet-500/10' };
                  case 'cyan': return { text: 'text-cyan-500', bg: 'bg-cyan-500/10' };
                  default: return { text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
                }
              };

              let textClass = feature.color || 'text-emerald-500';
              let bgClass = feature.bg || 'bg-emerald-500/10';
              if (isDb && feature.color) {
                const colorConfig = getColorClasses(feature.color);
                textClass = colorConfig.text;
                bgClass = colorConfig.bg;
              }

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => navigate(`/feature/${slugOrId}`)}
                  className="group p-5 rounded-[20px] bg-white border border-zinc-100 hover:border-emerald-500/20 transition-all shadow-lg shadow-zinc-200/20 hover:shadow-emerald-500/5 text-left w-full"
                >
                  <div className={`w-10 h-10 rounded-lg ${bgClass} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    {isDb ? (
                      <DynamicIcon name={feature.icon} className={`w-4.5 h-4.5 ${textClass}`} />
                    ) : (
                      <feature.icon className={`w-4.5 h-4.5 ${textClass}`} />
                    )}
                  </div>
                  <h3 className="text-base font-bold mb-1.5 text-zinc-900 group-hover:text-emerald-500 transition-colors">
                    {title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed text-xs">
                    {desc}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* BLOG SECTION - COMPACT PREMIUM */}
        <section className="py-16 px-6 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-7xl mx-auto mb-12 text-center">
            <h2 className="text-xl md:text-3xl font-black mb-3 text-zinc-900 tracking-tight">
              So'nggi <span className="text-emerald-500">yangiliklar</span> va bloglar
            </h2>
            <p className="text-zinc-500 text-sm font-medium mb-8 max-w-xl mx-auto">
              Programma va o'quv tizimlari haqida foydali ma'lumotlar.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/blogs')}
                className="h-11 rounded-2xl border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 text-xs font-black uppercase tracking-widest hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all px-8 group"
              >
                Barcha bloglar <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 group">
            {/* Carousel Buttons */}
            <div className="absolute top-1/2 -left-4 -right-4 -translate-y-1/2 hidden md:flex justify-between pointer-events-none z-10 px-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border-zinc-200 shadow-xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 -translate-x-2 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border-zinc-200 shadow-xl pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 translate-x-2 group-hover:translate-x-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                 {(dbBlogs.length > 0 ? dbBlogs : blogPosts).map((post, i) => {
                  const isDb = !!post.slug;
                  const idOrSlug = isDb ? post.slug : post.id;
                  const dateText = isDb ? new Date(post.created_at).toLocaleDateString() : post.date;
                  const excerptText = isDb ? (post.content ? post.content.slice(0, 100) + '...' : '') : post.excerpt;
                  const authorImageSrc = isDb && post.author_image ? getImageUrl(post.author_image) : `https://i.pravatar.cc/100?u=${post.author}`;

                  return (
                    <div key={post.id || idOrSlug} className="flex-[0_0_100%] min-w-0 pl-4 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] py-2">
                      <motion.article
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -5 }}
                        onClick={() => navigate(`/blog/${idOrSlug}`)}
                        className="group cursor-pointer bg-white rounded-[24px] overflow-hidden border border-zinc-100 shadow-lg shadow-zinc-200/20 hover:shadow-xl transition-all h-full"
                      >
                        <div className="relative h-44 overflow-hidden bg-zinc-100">
                          <motion.img 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            src={getImageUrl(post.image)} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black uppercase text-emerald-600 tracking-wider shadow-sm">
                            {post.category}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-400">
                            <Calendar className="w-3 h-3" />
                            {dateText}
                          </div>
                          <h3 className="text-base font-black mb-2 text-zinc-900 group-hover:text-emerald-500 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">
                            {excerptText}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden">
                                <img src={authorImageSrc} alt="" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[10px] font-bold text-zinc-700">{post.author}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </div>
                        </div>
                      </motion.article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION - COMPACT PREMIUM */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-xl md:text-3xl font-black mb-3 text-zinc-900 tracking-tight">
                Ko'p beriladigan <span className="text-emerald-500">savollar</span>
              </h2>
              <p className="text-zinc-500 text-sm font-medium">
                Sizni qiziqtirgan savollarga javoblar.
              </p>
            </div>

            <div className="space-y-3">
              {(dbFaqs.length > 0 ? dbFaqs.filter(f => f.is_active) : faqItems).map((item, i) => {
                const questionText = item.question || item.q;
                const answerText = item.answer || item.a;
                return (
                  <motion.div
                    key={item.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <details className="bg-zinc-50 rounded-2xl border border-zinc-100 overflow-hidden transition-all hover:border-emerald-500/20 hover:bg-zinc-50/50">
                      <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                        <span className="text-sm font-bold text-zinc-800 group-hover:text-emerald-600 transition-colors">
                          {questionText}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center transition-transform group-open:rotate-180">
                          <ChevronRight className="w-3 h-3 text-zinc-400 rotate-90" />
                        </div>
                      </summary>
                      <div className="px-5 pb-5 text-xs md:text-sm text-zinc-500 leading-relaxed font-medium">
                        {answerText}
                      </div>
                    </details>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OLD HERO CONTENT (Now secondary) */}
        <section className="relative pt-24 overflow-hidden hidden">
           {/* ... old hero section content moved or integrated ... */}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
