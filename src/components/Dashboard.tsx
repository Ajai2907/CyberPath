import { ArrowRight, RotateCcw, Compass, BarChart3, TrendingUp } from 'lucide-react';
import { TRACKS, TRACK_MAP, type TrackId } from '@/data/tracks';
import { ROADMAPS } from '@/data/roadmaps';
import { storage, topicKey } from '@/lib/storage';
import type { ScoreResult } from '@/lib/scoring';

function overallProgress(trackId: TrackId): number {
  const roadmap = ROADMAPS[trackId];
  const progress = storage.getProgress(trackId);
  const keys = roadmap.phases.flatMap((p) =>
    p.topics.map((t) => topicKey(p.phase, t.title)),
  );
  if (!keys.length) return 0;
  return Math.round((keys.filter((k) => progress[k]).length / keys.length) * 100);
}

export function Dashboard({
  result,
  onViewRoadmap,
  onRetake,
  onExplore,
}: {
  result: ScoreResult;
  onViewRoadmap: (trackId: TrackId) => void;
  onRetake: () => void;
  onExplore: (trackId: TrackId) => void;
}) {
  const top = result.top;
  const topTrack = TRACK_MAP[top.trackId];
  const pct = overallProgress(top.trackId);

  return (
    <div className="mx-auto max-w-5xl animate-fadeIn space-y-6">
      {/* Hero summary */}
      <div className="card overflow-hidden">
        <div className="relative border-b border-ink-700 bg-gradient-to-br from-ink-800/80 to-ink-900 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 ring-1 ring-cyber-500/40">
                <topTrack.icon className="h-7 w-7 text-cyber-300" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">Your recommended track</div>
                <h2 className="text-2xl font-bold text-white">{topTrack.name}</h2>
                <p className="text-sm text-slate-400">{topTrack.tagline}</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="mono text-4xl font-bold text-cyber-300">{top.match}%</div>
              <div className="text-xs uppercase tracking-wider text-slate-500">match</div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Roadmap progress</span>
            <span className="mono font-bold text-cyber-300">{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-500 to-signal-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onViewRoadmap(top.trackId)} className="btn-primary">
              Continue your roadmap
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={onRetake} className="btn-ghost">
              <RotateCcw className="h-4 w-4" />
              Retake assessment
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <Compass className="h-5 w-5 text-cyber-400" />
          <div className="mt-3 text-2xl font-bold text-white">{TRACKS.length}</div>
          <div className="text-sm text-slate-400">career tracks analyzed</div>
        </div>
        <div className="card p-5">
          <BarChart3 className="h-5 w-5 text-signal-400" />
          <div className="mt-3 text-2xl font-bold text-white">{result.ranked.length}</div>
          <div className="text-sm text-slate-400">tracks scored for you</div>
        </div>
        <div className="card p-5">
          <TrendingUp className="h-5 w-5 text-warn-400" />
          <div className="mt-3 text-2xl font-bold text-white">{pct}%</div>
          <div className="text-sm text-slate-400">overall roadmap complete</div>
        </div>
      </div>

      {/* Explore other tracks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Explore other tracks</h3>
          <span className="text-sm text-slate-500">No retake needed</span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TRACKS.filter((t) => t.id !== top.trackId).map((t) => {
            const score = result.scores.find((s) => s.trackId === t.id);
            return (
              <button
                key={t.id}
                onClick={() => onExplore(t.id)}
                className="group card p-4 text-left transition hover:border-cyber-500/60 hover:shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <t.icon className="h-5 w-5 text-slate-300 group-hover:text-cyber-300" />
                  <span className="font-semibold text-white">{t.name}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{t.demand} demand</span>
                  {score && <span className="mono text-sm text-slate-300">{score.match}%</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
