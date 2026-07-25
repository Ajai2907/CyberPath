import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { QUIZ } from '@/data/quiz';
import type { Answer } from '@/lib/scoring';

const CATEGORY_COLORS: Record<string, string> = {
  Background: 'text-cyber-300 border-cyber-500/40 bg-cyber-500/10',
  Interest: 'text-signal-300 border-signal-500/40 bg-signal-500/10',
  WorkStyle: 'text-warn-300 border-warn-500/40 bg-warn-500/10',
  Experience: 'text-danger-300 border-danger-500/40 bg-danger-500/10',
};

export function QuizFlow({
  onComplete,
  onBack,
}: {
  onComplete: (answers: Answer[]) => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const q = QUIZ[index];
  const total = QUIZ.length;
  const selected = answers.find((a) => a.questionId === q.id)?.optionId;
  const progress = ((index + (selected ? 1 : 0)) / total) * 100;

  function choose(optionId: string) {
    const next: Answer[] = [
      ...answers.filter((a) => a.questionId !== q.id),
      { questionId: q.id, optionId },
    ];
    setAnswers(next);
    // Auto-advance after a short tick for a snappy feel.
    setTimeout(() => {
      if (index < total - 1) setIndex((i) => i + 1);
      else onComplete(next);
    }, 220);
  }

  function back() {
    if (index === 0) onBack();
    else setIndex((i) => i - 1);
  }

  return (
    <div className="mx-auto max-w-2xl animate-fadeIn">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span className="mono">
            Question {index + 1} of {total}
          </span>
          <span className="chip">{q.category}</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyber-500 to-signal-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card p-6 md:p-8" key={q.id}>
        <h2 className="text-xl md:text-2xl font-bold text-white">{q.prompt}</h2>
        {q.helper && <p className="mt-2 text-sm text-slate-400">{q.helper}</p>}

        <div className="mt-6 space-y-3">
          {q.options.map((o) => {
            const active = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                className={`group flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-cyber-500 bg-cyber-500/10 text-white shadow-glow'
                    : 'border-ink-700 bg-ink-800/40 text-slate-300 hover:border-cyber-500/60 hover:bg-ink-800/70'
                }`}
              >
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition ${
                    active
                      ? 'border-cyber-400 bg-cyber-500 text-ink-950'
                      : 'border-ink-500 text-transparent group-hover:border-cyber-500'
                  }`}
                >
                  <Check className="h-4 w-4" />
                </span>
                <span className="font-medium">{o.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={back} className="btn-ghost">
          <ArrowLeft className="h-4 w-4" />
          {index === 0 ? 'Start over' : 'Back'}
        </button>
        {index < total - 1 && (
          <button
            onClick={() => setIndex((i) => i + 1)}
            disabled={!selected}
            className="btn-ghost"
          >
            Skip
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {QUIZ.map((qq, i) => (
          <span
            key={qq.id}
            title={qq.category}
            className={`h-1.5 w-6 rounded-full transition ${
              i < index
                ? 'bg-cyber-500'
                : i === index
                  ? 'bg-cyber-300'
                  : 'bg-ink-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
