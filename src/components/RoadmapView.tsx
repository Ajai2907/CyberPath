import { useMemo, useState } from 'react';
import { Check, Lock, BookOpen, Trophy, Wrench, Rocket, Flag, ExternalLink } from 'lucide-react';
import { TRACKS, TRACK_MAP, type TrackId } from '@/data/tracks';
import { ROADMAPS, type RoadmapResource } from '@/data/roadmaps';
import { storage, topicKey } from '@/lib/storage';

const PHASE_ICONS = [Flag, BookOpen, Wrench, Trophy, Rocket];

const RESOURCE_TYPE_STYLE: Record<RoadmapResource['type'], string> = {
  Course: 'text-cyber-300 border-cyber-500/40 bg-cyber-500/10',
  Platform: 'text-signal-300 border-signal-500/40 bg-signal-500/10',
  Book: 'text-warn-300 border-warn-500/40 bg-warn-500/10',
  Cert: 'text-danger-300 border-danger-500/40 bg-danger-500/10',
  Project: 'text-cyber-300 border-cyber-500/40 bg-cyber-500/10',
  Reading: 'text-slate-300 border-ink-600 bg-ink-800/60',
};

const ACCENT_TEXT: Record<string, string> = {
  cyber: 'text-cyber-300',
  signal: 'text-signal-300',
  warn: 'text-warn-300',
  danger: 'text-danger-300',
};

export function RoadmapView({
  trackId,
  onRetake,
  onBackToResults,
}: {
  trackId: TrackId;
  onRetake: () => void;
  onBackToResults: () => void;
}) {
  const track = TRACK_MAP[trackId];
  const roadmap = ROADMAPS[trackId];
  const [activeTrack, setActiveTrack] = useState<TrackId>(trackId);
  const [progress, setProgress] = useState<Record<string, boolean>>(() =>
    storage.getProgress(trackId),
  );

  const current = ROADMAPS[activeTrack];
  const currentTrack = TRACK_MAP[activeTrack];

  // All topic keys for the active track — used to compute completion.
  const allKeys = useMemo(
    () =>
      current.phases.flatMap((p) =>
        p.topics.map((t) => topicKey(p.phase, t.title)),
      ),
    [current],
  );

  const completedCount = allKeys.filter((k) => progress[k]).length;
  const overallPct = allKeys.length
    ? Math.round((completedCount / allKeys.length) * 100)
    : 0;

  function toggle(key: string) {
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      storage.setProgress(activeTrack, next);
      return next;
    });
  }

  function switchTrack(id: TrackId) {
    setActiveTrack(id);
    setProgress(storage.getProgress(id));
  }

  return (
    <div className="mx-auto max-w-5xl animate-fadeIn space-y-6">
      {/* Header */}
      <div className="card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 ring-1 ring-ink-600">
              <currentTrack.icon className={`h-7 w-7 ${ACCENT_TEXT[currentTrack.accent]}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentTrack.name}</h2>
              <p className="text-sm text-slate-400">{currentTrack.blurb}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 md:items-end">
            <div className="flex gap-4 text-xs text-slate-400">
              <span>Demand: <span className="text-slate-200 font-medium">{currentTrack.demand}</span></span>
              <span>Salary: <span className="text-slate-200 font-medium">{currentTrack.avgSalary}</span></span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {currentTrack.roles.map((r) => (
                <span key={r} className="chip">{r}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Overall roadmap progress</span>
            <span className={`mono font-bold ${ACCENT_TEXT[currentTrack.accent]}`}>{overallPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyber-500 to-signal-500 transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Track switcher */}
      <div className="flex flex-wrap gap-2">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTrack(t.id)}
            className={`chip transition ${
              t.id === activeTrack
                ? 'border-cyber-500 bg-cyber-500/10 text-cyber-300'
                : 'hover:border-cyber-500/50 hover:text-slate-200'
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.name}
          </button>
        ))}
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {current.phases.map((phase, i) => {
          const Icon = PHASE_ICONS[i] ?? Flag;
          const phaseKeys = phase.topics.map((t) => topicKey(phase.phase, t.title));
          const done = phaseKeys.filter((k) => progress[k]).length;
          const pct = phaseKeys.length ? Math.round((done / phaseKeys.length) * 100) : 0;
          const locked = i > 0 && !phaseKeys.every((k) => progress[k]) && done === 0 && i > 0;
          // Don't actually lock — just visualize. Keep all clickable for demo.

          return (
            <div key={phase.phase} className="card overflow-hidden">
              <div className="flex items-center gap-4 border-b border-ink-700 bg-ink-800/40 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 ring-1 ring-ink-600">
                  <Icon className={`h-5 w-5 ${ACCENT_TEXT[currentTrack.accent]}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="mono text-xs text-slate-500">PHASE {phase.phase}</span>
                    {pct === 100 && (
                      <span className="chip border-signal-500/40 bg-signal-500/10 text-signal-300">
                        <Check className="h-3 w-3" /> complete
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white">{phase.title}</h3>
                  <p className="text-sm text-slate-400">{phase.goal}</p>
                </div>
                <div className="hidden md:block text-right">
                  <div className={`mono text-lg font-bold ${ACCENT_TEXT[currentTrack.accent]}`}>{pct}%</div>
                  <div className="text-xs text-slate-500">{phase.duration}</div>
                </div>
              </div>

              <div className="p-5">
                {/* Topics */}
                <ul className="space-y-2">
                  {phase.topics.map((topic) => {
                    const key = topicKey(phase.phase, topic.title);
                    const checked = !!progress[key];
                    return (
                      <li key={key}>
                        <button
                          onClick={() => toggle(key)}
                          className="group flex w-full items-start gap-3 rounded-lg p-2 text-left transition hover:bg-ink-800/60"
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition ${
                              checked
                                ? 'border-signal-500 bg-signal-500 text-ink-950'
                                : 'border-ink-500 text-transparent group-hover:border-cyber-500'
                            }`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="min-w-0">
                            <span className={`block font-medium ${checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                              {topic.title}
                            </span>
                            <span className="block text-sm text-slate-400">{topic.detail}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Resources */}
                <div className="mt-5 rounded-xl border border-ink-700 bg-ink-900/50 p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Curated resources
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phase.resources.map((r) => (
                      <span
                        key={r.name}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${RESOURCE_TYPE_STYLE[r.type]}`}
                        title={r.note}
                      >
                        {r.name}
                        <span className="text-[10px] opacity-70">{r.free ? 'free' : 'paid'}</span>
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onBackToResults} className="btn-ghost">
          Back to results
        </button>
        <button onClick={onRetake} className="btn-ghost">
          Retake assessment
        </button>
      </div>
    </div>
  );
}
