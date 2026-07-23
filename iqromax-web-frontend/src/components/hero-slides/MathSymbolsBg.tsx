import { cn } from '@/lib/utils';

interface MathSymbolsBgProps {
  className?: string;
  colorClass?: string;
  opacity?: number;
}

/** Yumshoq matematik belgilar (+ × ÷ −) fonida — reference dizaynga moslangan */
export const MathSymbolsBg = ({
  className,
  colorClass = 'text-white',
  opacity = 0.08,
}: MathSymbolsBgProps) => {
  const symbols = [
    { ch: '+', x: '8%', y: '18%', size: 'text-5xl', rot: -15 },
    { ch: '×', x: '22%', y: '40%', size: 'text-3xl', rot: 10 },
    { ch: '÷', x: '12%', y: '70%', size: 'text-4xl', rot: -5 },
    { ch: '−', x: '32%', y: '85%', size: 'text-4xl', rot: 0 },
    { ch: '+', x: '46%', y: '12%', size: 'text-3xl', rot: 20 },
    { ch: '÷', x: '52%', y: '52%', size: 'text-5xl', rot: -10 },
    { ch: '×', x: '64%', y: '75%', size: 'text-4xl', rot: 15 },
    { ch: '+', x: '78%', y: '25%', size: 'text-4xl', rot: -20 },
    { ch: '−', x: '88%', y: '60%', size: 'text-3xl', rot: 5 },
    { ch: '×', x: '38%', y: '28%', size: 'text-2xl', rot: 25 },
  ];

  return (
    <div
      aria-hidden
      className={cn(
        'absolute inset-0 pointer-events-none overflow-hidden font-display font-black select-none',
        colorClass,
        className
      )}
      style={{ opacity }}
    >
      {symbols.map((s, i) => (
        <span
          key={i}
          className={cn('absolute', s.size)}
          style={{ left: s.x, top: s.y, transform: `rotate(${s.rot}deg)` }}
        >
          {s.ch}
        </span>
      ))}
    </div>
  );
};
