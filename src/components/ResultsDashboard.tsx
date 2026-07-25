import { useEffect, useState } from 'react';
import { Sparkles, Cpu, AlertCircle, ArrowRight } from 'lucide-react';
import { TRACK_MAP, type TrackId } from '@/data/tracks';
import type { ScoreResult } from '@/lib/scoring';
import { fetchAiRationale, type AiRationaleResponse } from '@/lib/ai';
import { storage } from '@/lib/storage';

const ACCENT: Record<string, { bar: string; text: string; ring: string }> = {
  cyber: { bar: 'bg-cyber-500', text: 'text-cyber-300', ring: 'ring-cyber-500/40' },
  signal: { bar: 'bg-signal-500', text: 'text-signal-300', ring: 'ring-signal-500/40' },
  warn: { bar: 'bg-warn-500', text: 'text-warn-300', ring: 'ring-warn-500/40' },
  danger: { bar: 'bg-danger-500', text: 'text-danger-300', ring: 'ring-danger-500/40' },
};

export function ResultsDashboard({
  result,
  onViewTrack,
}: {
  result: ScoreResult;
  onViewTrack: (trackId: TrackId) => void;
}) {
  const top = result.top;
  const topTrack = TRACK_MAP[top.trackId];
  const accent = ACCENT[topTrack.accent];

  const [ai, setAi] = useState<AiRationaleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    // Check cache first for instant paint.
    const cached = storage.getAiRationale(top.trackId);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AiRationaleResponse;
        setAi(parsed);
        setLoading(false);
        return;
      } catch {
        /* ignore */
      }
    }
    fetchAiRationale(top.trackId, result).then((res) => {
      if (cancelled) return;
      setAi(res);
      setLoading(false);
      storage.setAiRationale(top.trackId, JSON.stringify(res));
    });
    return () => {
      cancelled = true;
    };
  }, [top.trackId, result]);

  return (
    <div className="mx-auto max-w-5xl animate-fadeIn space-y-8">
      {/* Hero recommendation */}
      <div className="card overflow-hidden">
        <div className="border-b border-ink-700 bg-gradient-to-br from-ink-800/80 to-ink-900 p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 text-cyber-400" />
            Your top career match
          </div>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 ring-2 ${accent.ring}`}
              >
                <topTrack.icon className={`h-7 w-7 ${accent.text}`} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{topTrack.name}</h2>
                <p className="text-sm text-slate-400">{topTrack.tagline}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className={`mono text-4xl font-bold ${accent.text}`}>{top.match}%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500">match</div>
            </div>
          </div>
        </div>

        {/* AI rationale */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Cpu className="h-4 w-4 text-cyber-400" />
            AI mentor rationale
            {ai && (
              <span
                className={`chip ${
                  ai.source === 'ai'
                    ? 'border-cyber-500/40 bg-cyber-500/10 text-cyber-300'
                    : 'border-warn-500/40 bg-warn-500/10 text-warn-300'
                }`}
              >
                {ai.source === 'ai' ? 'live AI' : 'fallback engine'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-ink-700" />
              <div className="h-4 w-full animate-pulse rounded bg-ink-700" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-ink-700" />
            </div>
          ) : ai ? (
            <>
              <p className="mt-3 text-slate-300 leading-relaxed">{ai.rationale}</p>
              <div className="mt-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Suggested next steps
                </h4>
                <ul className="mt-3 space-y-2">
                  {ai.nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className={`mono mt-0.5 ${accent.text}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-warn-300">
              <AlertCircle className="h-4 w-4" />
              Rationale unavailable — continuing with rule-based recommendations.
            </div>
          )}

          <button
            onClick={() => onViewTrack(top.trackId)}
            className="btn-primary mt-6"
          >
            View your roadmap
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* All tracks ranked */}
      <div>
        <h3 className="mb-4 text-lg font-bold text-white">All career tracks, ranked for you</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {result.ranked.map((s) => {
            const t = TRACK_MAP[s.trackId];
            const a = ACCENT[t.accent];
            return (
              <button
                key={s.trackId}
                onClick={() => onViewTrack(s.trackId)}
                className="group card flex items-center gap-4 p-4 text-left transition hover:border-cyber-500/60 hover:shadow-glow"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 ring-1 ring-ink-600">
                  <t.icon className={`h-5 w-5 ${a.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-white">{t.name}</span>
                    <span className={`mono font-bold ${a.text}`}>{s.match}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                    <div
                      className={`h-full rounded-full ${a.bar} transition-all duration-700`}
                      style={{ width: `${s.match}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
