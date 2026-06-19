import React, { useMemo } from 'react';
import type { Note } from '../types/note';
import { NOTE_COLORS } from '../types/note';
import { MdNotes, MdPushPin, MdLocalOffer, MdTextFields, MdPalette, MdTrendingUp } from 'react-icons/md';
import { formatDate } from '../utils/dateFormatter';

interface StatsPageProps {
  notes: Note[];
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}> = ({ icon, label, value, sub, accent = 'rgb(var(--primary-rgb))' }) => (
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">{label}</span>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
        <span style={{ color: accent }}>{icon}</span>
      </div>
    </div>
    <div>
      <p className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const StatsPage: React.FC<StatsPageProps> = ({ notes }) => {
  const stats = useMemo(() => {
    const totalWords = notes.reduce((sum, n) => {
      const words = n.desc.trim() ? n.desc.trim().split(/\s+/).length : 0;
      return sum + words;
    }, 0);

    const allTags = notes.flatMap(n =>
      n.tags ? n.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    );
    const tagFreq = allTags.reduce<Record<string, number>>((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    const topTags = Object.entries(tagFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    const colorFreq = notes.reduce<Record<string, number>>((acc, n) => {
      acc[n.color] = (acc[n.color] || 0) + 1;
      return acc;
    }, {});
    const topColors = Object.entries(colorFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const newestNote = notes.length
      ? notes.reduce((a, b) => new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b)
      : null;

    const avgWords = notes.length ? Math.round(totalWords / notes.length) : 0;

    return { totalWords, topTags, topColors, newestNote, avgWords, uniqueTags: Object.keys(tagFreq).length };
  }, [notes]);

  const accentColors: Record<string, string> = {
    default: '#64748B', yellow: '#EAB308', green: '#10B981',
    blue: '#3B82F6', red: '#EF4444', purple: '#8B5CF6',
    orange: '#F97316', pink: '#EC4899', brown: '#92400E',
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]" style={{ fontFamily: 'var(--font-heading)' }}>
          📊 Stats
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">A snapshot of your notes collection</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<MdNotes size={18} />} label="Total Notes" value={notes.length} sub="in your collection" />
        <StatCard icon={<MdPushPin size={18} />} label="Pinned" value={notes.filter(n => n.isPinned).length} sub="pinned notes" accent="#F59E0B" />
        <StatCard icon={<MdLocalOffer size={18} />} label="Unique Tags" value={stats.uniqueTags} sub="across all notes" accent="#8B5CF6" />
        <StatCard icon={<MdTextFields size={18} />} label="Total Words" value={stats.totalWords.toLocaleString()} sub="written across notes" accent="#10B981" />
        <StatCard icon={<MdTrendingUp size={18} />} label="Avg Words" value={stats.avgWords} sub="per note" accent="#F97316" />
        <StatCard icon={<MdPalette size={18} />} label="Colors Used" value={Object.keys(notes.reduce<Record<string,boolean>>((a,n) => ({...a,[n.color]:true}),{})).length} sub="out of 9 available" accent="#EC4899" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.topTags.length > 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              🏷️ Top Tags
            </h2>
            <div className="flex flex-col gap-2">
              {stats.topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[var(--foreground)] w-24 truncate">#{tag}</span>
                  <div className="flex-1 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(count / (stats.topTags[0]?.[1] || 1)) * 100}%`,
                        background: 'rgb(var(--primary-rgb))',
                      }}
                    />
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] w-6 text-right tabular-nums">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="text-base font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            🎨 Color Distribution
          </h2>
          {stats.topColors.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No color data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.topColors.map(([color, count]) => {
                const cfg = NOTE_COLORS.find(c => c.value === color);
                const accent = accentColors[color] ?? '#64748B';
                return (
                  <div key={color} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                    <span className="text-xs font-medium text-[var(--foreground)] w-16 truncate">
                      {cfg?.label ?? color}
                    </span>
                    <div className="flex-1 h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(count / notes.length) * 100}%`, backgroundColor: accent }}
                      />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)] tabular-nums">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {stats.newestNote && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 lg:col-span-2">
            <h2 className="text-base font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              ✏️ Most Recently Updated
            </h2>
            <p className="text-sm font-semibold text-[var(--foreground)]">{stats.newestNote.title}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">{stats.newestNote.desc}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2 opacity-60">
              {formatDate(stats.newestNote.updatedAt)}
            </p>
          </div>
        )}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-[var(--muted-foreground)] text-sm">No notes yet — create some to see stats!</p>
        </div>
      )}
    </div>
  );
};
