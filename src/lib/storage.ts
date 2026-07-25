import type { Answer } from './scoring';
import type { TrackId } from '@/data/tracks';

const KEYS = {
  answers: 'cyberpath.answers',
  progress: 'cyberpath.progress', // { [trackId]: { [topicKey]: boolean } }
  viewedTrack: 'cyberpath.viewedTrack',
  aiCache: 'cyberpath.aiCache', // { [trackId]: rationale }
} as const;

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export const storage = {
  getAnswers: (): Answer[] | null => safeGet<Answer[] | null>(KEYS.answers, null),
  setAnswers: (a: Answer[]) => safeSet(KEYS.answers, a),
  clearAnswers: () => localStorage.removeItem(KEYS.answers),

  getProgress: (trackId: TrackId): Record<string, boolean> =>
    safeGet<Record<string, boolean>>(`${KEYS.progress}.${trackId}`, {}),
  setProgress: (trackId: TrackId, p: Record<string, boolean>) =>
    safeSet(`${KEYS.progress}.${trackId}`, p),

  getViewedTrack: (): TrackId | null => safeGet<TrackId | null>(KEYS.viewedTrack, null),
  setViewedTrack: (t: TrackId) => safeSet(KEYS.viewedTrack, t),

  getAiRationale: (trackId: TrackId): string | null =>
    safeGet<Record<TrackId, string> | null>(KEYS.aiCache, null)?.[trackId] ?? null,
  setAiRationale: (trackId: TrackId, text: string) => {
    const all = safeGet<Record<string, string> | null>(KEYS.aiCache, null) ?? {};
    all[trackId] = text;
    safeSet(KEYS.aiCache, all);
  },
  clearAiRationale: () => localStorage.removeItem(KEYS.aiCache),
};

/** Stable key for a roadmap topic, used as the progress checkbox id. */
export function topicKey(phase: number, title: string): string {
  return `p${phase}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`;
}
