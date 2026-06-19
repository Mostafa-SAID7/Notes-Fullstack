import React from 'react';

const SkeletonCard: React.FC<{ height?: string }> = ({ height = 'h-36' }) => (
  <div className={`rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] ${height} flex flex-col`}>
    <div className="h-1.5 w-full bg-[var(--surface-2)] animate-pulse" />
    <div className="p-4 flex flex-col gap-3 flex-1">
      <div className="h-4 rounded-md bg-[var(--surface-2)] animate-pulse w-3/4" />
      <div className="h-3 rounded-md bg-[var(--surface-2)] animate-pulse w-full opacity-60" />
      <div className="h-3 rounded-md bg-[var(--surface-2)] animate-pulse w-5/6 opacity-50" />
      <div className="h-3 rounded-md bg-[var(--surface-2)] animate-pulse w-2/3 opacity-40" />
      <div className="mt-auto flex gap-1.5">
        <div className="h-4 w-12 rounded-full bg-[var(--surface-2)] animate-pulse" />
        <div className="h-4 w-10 rounded-full bg-[var(--surface-2)] animate-pulse opacity-70" />
      </div>
    </div>
  </div>
);

export const LoadingState: React.FC = () => {
  const heights = ['h-40', 'h-52', 'h-36', 'h-44', 'h-48', 'h-36', 'h-52', 'h-40', 'h-44'];
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {heights.map((h, i) => (
        <div key={i} className="break-inside-avoid">
          <SkeletonCard height={h} />
        </div>
      ))}
    </div>
  );
};
