import { QUIZ, type QuizQuestion } from '@/data/quiz';
import { TRACKS, type TrackId } from '@/data/tracks';

export interface Answer {
  questionId: string;
  optionId: string;
}

export interface TrackScore {
  trackId: TrackId;
  raw: number;
  /** 0–100 normalized match percentage. */
  match: number;
}

export interface ScoreResult {
  scores: TrackScore[];
  ranked: TrackScore[];
  top: TrackScore;
  answers: Answer[];
}

/**
 * Compute weighted scores per career track.
 *
 * Algorithm:
 * 1. For each question, add the selected option's weights to a per-track accumulator.
 * 2. Normalize each track's raw score to 0–100 by dividing by that track's maximum
 *    possible raw score across all questions (the sum of the single highest-weight
 *    option per question for that track). This makes scores comparable across tracks
 *    even though tracks have different maxima.
 */
export function scoreQuiz(answers: Answer[]): ScoreResult {
  const raw: Record<TrackId, number> = TRACKS.reduce(
    (acc, t) => ({ ...acc, [t.id]: 0 }),
    {} as Record<TrackId, number>,
  );

  const answerMap = new Map(answers.map((a) => [a.questionId, a.optionId]));

  for (const q of QUIZ) {
    const optionId = answerMap.get(q.id);
    if (!optionId) continue;
    const option = q.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [trackId, weight] of Object.entries(option.weights)) {
      raw[trackId as TrackId] += weight as number;
    }
  }

  // Max possible per track = sum over questions of the max weight that track could get.
  const maxPerTrack: Record<TrackId, number> = TRACKS.reduce(
    (acc, t) => ({ ...acc, [t.id]: 0 }),
    {} as Record<TrackId, number>,
  );
  for (const q of QUIZ) {
    for (const track of TRACKS) {
      const maxForTrack = Math.max(
        0,
        ...q.options.map((o) => (o.weights[track.id] as number) ?? 0),
      );
      maxPerTrack[track.id] += maxForTrack;
    }
  }

  const scores: TrackScore[] = TRACKS.map((t) => {
    const r = raw[t.id];
    const max = maxPerTrack[t.id] || 1;
    // Scale so a perfect run = 100, but keep a floor so partial matches still feel meaningful.
    const match = Math.round((r / max) * 100);
    return { trackId: t.id, raw: r, match };
  });

  const ranked = [...scores].sort((a, b) => b.match - a.match || b.raw - a.raw);

  return {
    scores,
    ranked,
    top: ranked[0],
    answers,
  };
}

/** Return a short, rule-based rationale for a track match (used as fallback / preview). */
export function ruleBasedRationale(trackId: TrackId, result: ScoreResult): string {
  const track = TRACKS.find((t) => t.id === trackId)!;
  const top = result.top;
  const isTop = top.trackId === trackId;

  const strengths: string[] = [];
  for (const q of QUIZ) {
    const ans = result.answers.find((a) => a.questionId === q.id);
    if (!ans) continue;
    const opt = q.options.find((o) => o.id === ans.optionId);
    if (!opt) continue;
    const w = opt.weights[trackId];
    if (w && w >= 4) {
      strengths.push(q.category.toLowerCase());
    }
  }
  const deduped = Array.from(new Set(strengths)).slice(0, 3);

  const match = result.scores.find((s) => s.trackId === trackId)!;
  const lead = isTop
    ? `${track.name} is your strongest match at ${match.match}%.`
    : `${track.name} scored ${match.match}% for you.`;

  if (deduped.length) {
    return `${lead} Your answers in ${deduped.join(', ')} aligned strongly with this track's profile.`;
  }
  return `${lead} This is a reasonable stretch path — consider building skills in its core areas.`;
}

export function getQuizQuestion(index: number): QuizQuestion | undefined {
  return QUIZ[index];
}
