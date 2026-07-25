import { ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export function HowItWorks({ onClose }: { onClose?: () => void }) {
  return (
    <div className="card p-6 md:p-8 animate-fadeIn">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">How CyberPath works</h2>
          <p className="mt-1 text-sm text-slate-400">
            Transparent scoring + a real LLM layer — here's exactly what's happening under the hood.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn-ghost px-3 py-1.5 text-sm">
            Close
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-ink-700 bg-ink-800/50 p-5">
          <ShieldCheck className="h-6 w-6 text-cyber-400" />
          <h3 className="mt-3 font-semibold text-white">1. Weighted quiz scoring</h3>
          <p className="mt-2 text-sm text-slate-400">
            Each quiz option carries weighted points across 6 career tracks. Your answers
            accumulate per-track scores, normalized to 0–100% against each track's maximum
            possible score — so matches are comparable, not just raw totals.
          </p>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800/50 p-5">
          <Cpu className="h-6 w-6 text-signal-400" />
          <h3 className="mt-3 font-semibold text-white">2. Real AI enrichment</h3>
          <p className="mt-2 text-sm text-slate-400">
            Your ranked scores and quiz answers are sent to a serverless edge function that
            calls a real LLM. It writes a personalized rationale and tailored next steps
            grounded in your actual answers — not a static template.
          </p>
        </div>

        <div className="rounded-xl border border-ink-700 bg-ink-800/50 p-5">
          <Sparkles className="h-6 w-6 text-warn-400" />
          <h3 className="mt-3 font-semibold text-white">3. Graceful fallback</h3>
          <p className="mt-2 text-sm text-slate-400">
            If the AI endpoint is unreachable or misconfigured, a deterministic rule-based
            engine generates the rationale instead — so the demo never breaks on stage. The
            source badge tells you which path produced the text.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-ink-700 bg-ink-900/60 p-5">
        <h3 className="font-semibold text-white">The LLM prompt, in plain terms</h3>
        <p className="mt-2 text-sm text-slate-400">
          The system prompt instructs the model to act as a cybersecurity career mentor, given
          the learner's quiz answers, ranked track scores, and the target track's roadmap phases.
          It must respond as JSON with a <code className="mono text-cyber-300">rationale</code> and
          exactly four <code className="mono text-cyber-300">nextSteps</code>. The edge function
          validates that shape before returning — anything malformed triggers the fallback.
        </p>
      </div>
    </div>
  );
}
