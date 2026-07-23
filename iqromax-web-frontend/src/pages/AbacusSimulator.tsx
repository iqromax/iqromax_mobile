import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PageBackground } from '@/components/layout/PageBackground';
import { RealisticAbacus } from '@/components/abacus';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSound } from '@/hooks/useSound';

const AbacusSimulator = () => {
  const [value, setValue] = useState(0);
  const isMobile = useIsMobile();
  const compactMode = isMobile;
  const { soundEnabled, toggleSound } = useSound();

  return (
    <PageBackground className="min-h-screen">
      <Navbar soundEnabled={soundEnabled} onToggleSound={toggleSound} />
      <main className="w-full px-4 py-8 flex flex-col items-center gap-8 sm:gap-10">
        <div className="w-full max-w-[1400px] space-y-8">
          <section className="mx-auto w-full max-w-3xl rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-8">
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <p className="text-3xl font-bold text-primary sm:text-4xl">10 ustunli abakus</p>
              <p className="text-base leading-7 text-muted-foreground">Tez hisoblash uchun abacusni ishlating, ustunlarni suring va natijani ko‘ring.</p>
              <p className="text-base leading-7 text-muted-foreground">Oddiy, qulay va to‘liq 10 ustunli hisoblash sahifasi.</p>
            </div>
          </section>

          <div className="flex justify-center overflow-x-auto px-1">
            <div className="w-full max-w-full">
              <RealisticAbacus
                columns={10}
                value={value}
                onChange={setValue}
                compact={compactMode}
                mode="beginner"
                orientation="horizontal"
                showValue={false}
              />
            </div>
          </div>
        </div>
      </main>
    </PageBackground>
  );
};

export default AbacusSimulator;
