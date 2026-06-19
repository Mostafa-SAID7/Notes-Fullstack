import React from 'react';

const SHIMMER = `
  relative overflow-hidden
  before:absolute before:inset-0
  before:-translate-x-full
  before:bg-gradient-to-r
  before:from-transparent before:via-white/[0.06] before:to-transparent
  before:animate-[shimmer_1.6s_infinite]
`;

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-lg bg-[var(--surface-2)] ${SHIMMER} ${className}`} />
);

const SkeletonCard: React.FC<{ lines?: number; accentClass?: string }> = ({
  lines = 3,
  accentClass = 'bg-[var(--surface-2)]',
}) => (
  <div className="rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] flex flex-col">
    <div className={`h-1 w-full flex-shrink-0 opacity-50 ${accentClass}`} />
    <div className="p-4 flex flex-col gap-3">
      <Bone className="h-4 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Bone
          key={i}
          className={`h-3 ${i === 0 ? 'w-full' : i === lines - 1 ? 'w-1/2' : 'w-5/6'}`}
          style={{ opacity: 1 - i * 0.15 } as React.CSSProperties}
        />
      ))}
      <div className="flex gap-1.5 pt-1">
        <Bone className="h-4 w-12 rounded-full" />
        <Bone className="h-4 w-9 rounded-full opacity-60" />
      </div>
    </div>
  </div>
);

const CARD_SPECS: { lines: number; accent: string }[] = [
  { lines: 4, accent: 'bg-blue-500' },
  { lines: 2, accent: 'bg-yellow-400' },
  { lines: 5, accent: 'bg-emerald-500' },
  { lines: 3, accent: 'bg-purple-500' },
  { lines: 2, accent: 'bg-pink-400' },
  { lines: 4, accent: 'bg-orange-400' },
  { lines: 3, accent: 'bg-blue-500' },
  { lines: 5, accent: 'bg-red-500' },
  { lines: 2, accent: 'bg-emerald-500' },
];

export const LoadingState: React.FC = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]">
    {CARD_SPECS.map((spec, i) => (
      <div
        key={i}
        className="break-inside-avoid mb-4"
        style={{
          animation: `fadeSlideUp 0.4s ease both`,
          animationDelay: `${i * 60}ms`,
        }}
      >
        <SkeletonCard lines={spec.lines} accentClass={spec.accent} />
      </div>
    ))}
  </div>
);
