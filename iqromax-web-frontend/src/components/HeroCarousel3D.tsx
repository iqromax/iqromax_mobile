import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

import { MainSlide } from './hero-slides/MainSlide';
import { TrainerSlide } from './hero-slides/TrainerSlide';
import { ParentSlide } from './hero-slides/ParentSlide';
import { KidSlide } from './hero-slides/KidSlide';

interface HeroCarousel3DProps {
  /** Eski API bilan moslik uchun saqlangan, hozircha ishlatilmaydi */
  totalUsers?: number;
}

/**
 * Bosh sahifa karuseli — 4 ta alohida audience-fokuslangan slide:
 * 1) Asosiy IQROMAX intro (yashil)
 * 2) Trenerlar uchun
 * 3) Ota-onalar uchun
 * 4) Bolalar uchun
 *
 * Har bir slide haqiqiy React layout (matn, tugmalar, floating kartalar,
 * SVG chartlar, statistika qatori) — fon-rasm emas.
 */
export const HeroCarousel3D = ({ totalUsers: _totalUsers }: HeroCarousel3DProps = {}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const slides = useMemo(
    () => [
      { id: 'main', component: <MainSlide /> },
      { id: 'trainer', component: <TrainerSlide /> },
      { id: 'parent', component: <ParentSlide /> },
      { id: 'kid', component: <KidSlide /> },
    ],
    []
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 7000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  return (
    <div className="relative overflow-hidden rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl -mx-4 sm:mx-0 bg-background">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          dragFree: false,
          containScroll: 'trimSnaps',
          skipSnaps: false,
          duration: 22,
          dragThreshold: 4,
        }}
        plugins={[autoplayPlugin]}
        className="w-full touch-pan-y select-none"
      >
        <CarouselContent className="ml-0" style={{ touchAction: 'pan-y pinch-zoom' }}>
          {slides.map((slide) => (
            <CarouselItem
              key={slide.id}
              className="touch-manipulation pl-0 basis-full"
            >
              <div className="relative w-full min-h-[560px] h-[600px] sm:h-[640px] md:h-[680px] lg:h-[720px] overflow-hidden">
                {slide.component}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious
          aria-label="Oldingi"
          className="hidden sm:flex left-3 md:left-5 bg-white/95 hover:bg-white text-gray-900 border-0 shadow-lg sm:h-10 sm:w-10 md:h-12 md:w-12 backdrop-blur-sm z-20"
        />
        <CarouselNext
          aria-label="Keyingi"
          className="hidden sm:flex right-3 md:right-5 bg-white/95 hover:bg-white text-gray-900 border-0 shadow-lg sm:h-10 sm:w-10 md:h-12 md:w-12 backdrop-blur-sm z-20"
        />
      </Carousel>

      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === i
                ? 'w-7 bg-white shadow-md'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
