import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from './ui/carousel';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import api, { getImageUrl } from '@/lib/axios';

// ─── Rang → to'q CSS rang ───────────────────────────────────────────────────
const COLOR_MAP: Record<string, { solid: string; text: string; badgeBg: string }> = {
  white:   { solid: '255,255,255', text: '#111827', badgeBg: 'rgba(16,185,129,0.15)' },
  emerald: { solid: '5,150,105',   text: '#ffffff', badgeBg: 'rgba(255,255,255,0.25)' },
  blue:    { solid: '29,78,216',   text: '#ffffff', badgeBg: 'rgba(255,255,255,0.25)' },
  violet:  { solid: '109,40,217',  text: '#ffffff', badgeBg: 'rgba(255,255,255,0.25)' },
  amber:   { solid: '180,83,9',    text: '#ffffff', badgeBg: 'rgba(255,255,255,0.25)' },
  rose:    { solid: '190,18,60',   text: '#ffffff', badgeBg: 'rgba(255,255,255,0.25)' },
  slate:   { solid: '15,23,42',    text: '#ffffff', badgeBg: 'rgba(255,255,255,0.18)' },
};

interface AdSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  tag: string | null;
  overlay_color: string;
}

interface HeroCarouselProps {
  userRole?: 'student' | 'parent' | 'teacher' | 'admin' | null;
}

export const HeroCarousel = ({ userRole }: HeroCarouselProps = {}) => {
  const navigate = useNavigate();
  const [apiCarousel, setApiCarousel] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<AdSlide[]>([]);

  const fetchSlides = () => {
    api.get(`ads/?t=${Date.now()}`).then(res => setSlides(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchSlides();
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchSlides();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  useEffect(() => {
    if (!apiCarousel) return;
    setCurrent(apiCarousel.selectedScrollSnap());
    apiCarousel.on('select', () => {
      setCurrent(apiCarousel.selectedScrollSnap());
    });
  }, [apiCarousel]);

  if (slides.length === 0) {
    return (
      <div className="w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl bg-muted animate-pulse" />
    );
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setApiCarousel}
        opts={{ align: 'start', loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => {
            const colorKey = slide.overlay_color || 'white';
            const c = COLOR_MAP[colorKey] || COLOR_MAP['white'];
            const { solid, text, badgeBg } = c;

            // Gradient: bir qatorda (CSS newline muammosidan xoli)
            const gradient = `linear-gradient(to right, rgba(${solid},1) 0%, rgba(${solid},0.97) 45%, rgba(${solid},0.75) 65%, rgba(${solid},0.2) 82%, transparent 100%)`;

            const descColor = colorKey === 'white' ? '#374151' : 'rgba(255,255,255,0.9)';
            const btnBorder  = colorKey === 'white' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.35)';
            const btnBgHover = colorKey === 'white' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.18)';

            return (
              <CarouselItem key={slide.id} className="pl-0 basis-full">
                <div className="relative w-full min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg">

                  {/* Rasm — to'liq background */}
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Rangli gradient overlay — rasm ustida, ABSOLUTE */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{ background: gradient }}
                  />

                  {/* Matn kontenti — gradient ustida */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-center px-5 sm:px-8 lg:px-10 py-6 sm:py-8 w-[58%] sm:w-[50%] lg:w-[44%]">
                    {/* Tag badge */}
                    {slide.tag && (
                      <span
                        className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-3 sm:mb-4"
                        style={{
                          background: badgeBg,
                          color: text,
                          border: `1px solid ${colorKey === 'white' ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.4)'}`,
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        {slide.tag}
                      </span>
                    )}

                    {/* Sarlavha */}
                    <h2
                      className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-2 sm:mb-3"
                      style={{ color: text }}
                    >
                      {slide.title}
                    </h2>

                    {/* Tavsif */}
                    <p
                      className="text-xs sm:text-sm lg:text-base font-medium leading-relaxed line-clamp-3 sm:line-clamp-4 mb-4 sm:mb-6"
                      style={{ color: descColor }}
                    >
                      {slide.description}
                    </p>

                    {/* CTA tugma */}
                    <button
                      onClick={() => navigate('/train')}
                      className="inline-flex items-center gap-2 self-start px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                      style={{
                        color: text,
                        background: btnBgHover,
                        border: `1.5px solid ${btnBorder}`,
                      }}
                    >
                      Batafsil
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => apiCarousel?.scrollTo(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                current === index
                  ? 'w-6 sm:w-8 bg-primary'
                  : 'w-1.5 sm:w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};
