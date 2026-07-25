import { QUIZ } from '@/data/quiz';
import { TRACK_MAP, type TrackId } from '@/data/tracks';
import { ROADMAPS } from '@/data/roadmaps';
import { ruleBasedRationale, type Answer, type ScoreResult } from './scoring';

export interface AiRationaleResponse {
  rationale: string;
  nextSteps: string[];
  source: 'ai' | 'fallback';
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cyberpath-ai`;

/**
 * Fetch an AI-generated rationale + next steps for a recommended track.
 *
 * The edge function calls a real LLM. If the function is unreachable, the LLM
 * errors out, or the response is malformed, we fall back to the rule-based
 * engine so the demo never breaks.
 */
export async function fetchAiRationale(
  trackId: TrackId,
  result: ScoreResult,
): Promise<AiRationaleResponse> {
  const track = TRACK_MAP[trackId];
  const roadmap = ROADMAPS[trackId];

  // Build a compact summary of the user's answers for the prompt.
  const answerSummary = result.answers
    .map((a: Answer) => {
      const q = QUIZ.find((x) => x.id === a.questionId);
      const opt = q?.options.find((o) => o.id === a.optionId);
      return `- ${q?.prompt} -> ${opt?.label}`;
    })
    .join('\n');

  const scoresSummary = result.ranked
    .map((s) => `${TRACK_MAP[s.trackId].name}: ${s.match}%`)
    .join(', ');

  const payload = {
    trackId,
    trackName: track.name,
    matchPercent: result.scores.find((s) => s.trackId === trackId)?.match ?? 0,
    scoresSummary,
    answers: answerSummary,
    phaseTitles: roadmap.phases.map((p) => p.title).join(', '),
  };

  try {
    const res = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`edge function returned ${res.status}`);
    }

    const data = (await res.json()) as {
      rationale?: string;
      nextSteps?: string[];
    };

    if (!data.rationale || !Array.isArray(data.nextSteps)) {
      throw new Error('malformed AI response');
    }

    return {
      rationale: data.rationale,
      nextSteps: data.nextSteps.slice(0, 4),
      source: 'ai',
    };
  } catch {
    // Fallback — rule-based engine, never breaks the demo.
    const rationale = ruleBasedRationale(trackId, result);
    const nextSteps = roadmap.phases.slice(0, 4).map(
      (p) => `Start ${p.title}: ${p.goal}`,
    );
    return { rationale, nextSteps, source: 'fallback' };
  }
}
