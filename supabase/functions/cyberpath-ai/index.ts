// CyberPath AI edge function.
// Calls a real LLM (OpenAI-compatible endpoint) to generate a personalized
// rationale + next steps for a recommended cybersecurity career track.
//
// Falls back to a deterministic rule-based response if no API key is configured
// or the upstream call fails — so the demo never breaks on stage.
//
// Env vars (configured automatically in the Supabase project):
//   OPENAI_API_KEY  — required for live AI. If absent, fallback is used.
//   OPENAI_BASE_URL — optional, defaults to https://api.openai.com/v1
//   OPENAI_MODEL     — optional, defaults to gpt-4o-mini

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface Payload {
  trackId: string;
  trackName: string;
  matchPercent: number;
  scoresSummary: string;
  answers: string;
  phaseTitles: string;
}

const SYSTEM_PROMPT = `You are CyberPath, an expert cybersecurity career mentor.
You receive a learner's quiz answers and a recommended career track with its match percentage.
Write a warm, specific, 3-4 sentence rationale explaining WHY this track fits them, referencing their actual answers.
Then provide exactly 4 concrete "nextSteps" — short, actionable next actions tied to the track's roadmap phases.
Be encouraging but grounded. No hype, no fluff. Plain text only.`;

function fallback(payload: Payload) {
  return {
    rationale: `${payload.trackName} is your strongest match at ${payload.matchPercent}%. Based on your quiz answers, your background and interests align well with this track's day-to-day work. The roadmap below lays out a phased path from foundations to job-readiness — start with Phase 1 and check items off as you go.`,
    nextSteps: [
      'Complete Phase 1: Foundations before moving on.',
      'Set up accounts on TryHackMe and/or HackTheBox.',
      'Pick a target certification from Phase 4 to work toward.',
      'Start a GitHub portfolio to document your progress.',
    ],
  };
}

async function callLLM(payload: Payload) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) return null;

  const baseUrl = Deno.env.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1';
  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini';

  const userPrompt = `Recommended track: ${payload.trackName} (${payload.matchPercent}% match)
All track scores: ${payload.scoresSummary}

Learner's quiz answers:
${payload.answers}

Roadmap phases for this track: ${payload.phaseTitles}

Respond as JSON ONLY, with this exact shape:
{"rationale": "...", "nextSteps": ["...", "...", "...", "..."]}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM API ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('empty LLM content');

  const parsed = JSON.parse(content);
  if (!parsed.rationale || !Array.isArray(parsed.nextSteps)) {
    throw new Error('malformed LLM JSON');
  }
  return parsed;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as Payload;

    let body;
    let source: 'ai' | 'fallback' = 'fallback';

    try {
      const ai = await callLLM(payload);
      if (ai) {
        body = { ...ai, source: 'ai' };
        source = 'ai';
      } else {
        body = { ...fallback(payload), source: 'fallback' };
      }
    } catch (err) {
      console.error('LLM call failed, using fallback:', err.message);
      body = { ...fallback(payload), source: 'fallback' };
    }

    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message, source: 'fallback' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
