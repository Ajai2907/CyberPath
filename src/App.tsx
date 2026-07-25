import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';
import { QuizFlow } from '@/components/QuizFlow';
import { ResultsDashboard } from '@/components/ResultsDashboard';
import { RoadmapView } from '@/components/RoadmapView';
import { Dashboard } from '@/components/Dashboard';
import { HowItWorks } from '@/components/HowItWorks';
import { scoreQuiz, type Answer, type ScoreResult } from '@/lib/scoring';
import { storage } from '@/lib/storage';
import type { TrackId } from '@/data/tracks';

type View = 'landing' | 'quiz' | 'results' | 'roadmap' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('landing');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [viewedTrack, setViewedTrack] = useState<TrackId | null>(null);
  const [showHow, setShowHow] = useState(false);

  // Restore prior session on first load.
  useEffect(() => {
    const saved = storage.getAnswers();
    if (saved && saved.length) {
      setAnswers(saved);
      setViewedTrack(storage.getViewedTrack());
      setView('dashboard');
    }
  }, []);

  const result: ScoreResult | null = useMemo(
    () => (answers.length ? scoreQuiz(answers) : null),
    [answers],
  );

  function startQuiz() {
    setView('quiz');
  }

  function completeQuiz(finalAnswers: Answer[]) {
    setAnswers(finalAnswers);
    storage.setAnswers(finalAnswers);
    setView('results');
  }

  function viewTrack(trackId: TrackId) {
    setViewedTrack(trackId);
    storage.setViewedTrack(trackId);
    setView('roadmap');
  }

  function retake() {
    storage.clearAnswers();
    storage.clearAiRationale();
    setAnswers([]);
    setViewedTrack(null);
    setView('quiz');
  }

  return (
    <div className="cyber-bg min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-ink-700/60 bg-ink-950/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <button
            onClick={() => setView(result ? 'dashboard' : 'landing')}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyber-500/10 ring-1 ring-cyber-500/40">
              <ShieldCheck className="h-5 w-5 text-cyber-300" />
            </div>
            <div className="leading-tight text-left">
              <div className="font-bold text-white">CyberPath</div>
              <div className="mono text-[10px] text-slate-500">BSCDS26-CIPL-01</div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHow(true)}
              className="btn-ghost px-3 py-1.5 text-sm"
            >
              <Info className="h-4 w-4" />
              How it works
            </button>
            {result && view !== 'dashboard' && (
              <button
                onClick={() => setView('dashboard')}
                className="btn-ghost px-3 py-1.5 text-sm"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {view === 'landing' && <Landing onStart={startQuiz} onHow={() => setShowHow(true)} />}

        {view === 'quiz' && (
          <QuizFlow onComplete={completeQuiz} onBack={() => setView('landing')} />
        )}

        {view === 'results' && result && (
          <ResultsDashboard result={result} onViewTrack={viewTrack} />
        )}

        {view === 'roadmap' && viewedTrack && result && (
          <RoadmapView
            trackId={viewedTrack}
            onRetake={retake}
            onBackToResults={() => setView('results')}
          />
        )}

        {view === 'dashboard' && result && (
          <Dashboard
            result={result}
            onViewRoadmap={viewTrack}
            onRetake={retake}
            onExplore={viewTrack}
          />
        )}
      </main>

      {/* How it works modal */}
      {showHow && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/80 p-4 py-10 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setShowHow(false)}
              className="absolute -top-2 right-0 -translate-y-full text-slate-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <HowItWorks onClose={() => setShowHow(false)} />
          </div>
        </div>
      )}

      <footer className="border-t border-ink-700/60 py-6 text-center text-xs text-slate-600">
        <span className="mono">CyberPath</span> — AI-Driven Cybersecurity Career &amp; Learning Pathway Engine
      </footer>
    </div>
  );
}

function Landing({ onStart, onHow }: { onStart: () => void; onHow: () => void }) {
  return (
    <div className="mx-auto max-w-4xl animate-fadeIn text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-cyber-500/40 bg-cyber-500/10 px-4 py-1.5 text-sm text-cyber-300">
        <ShieldCheck className="h-4 w-4" />
        AI-Driven Cybersecurity Career Engine
      </div>

      <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
        Find your path in
        <span className="bg-gradient-to-r from-cyber-300 to-signal-400 bg-clip-text text-transparent">
          {' '}cybersecurity
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
        Take a short assessment and get a personalized career track, an AI-generated rationale,
        and a milestone-based learning roadmap with curated resources — all in one place.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={onStart} className="btn-primary text-base">
          Start the assessment
        </button>
        <button onClick={onHow} className="btn-ghost text-base">
          How it works
        </button>
      </div>

      {/* Track preview */}
      <div className="mt-12 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {[
          { name: 'SOC / Blue Team', desc: 'Defend & detect' },
          { name: 'Penetration Tester', desc: 'Offense & exploit' },
          { name: 'GRC & Compliance', desc: 'Policy & risk' },
          { name: 'Cloud Security', desc: 'Secure at scale' },
          { name: 'DFIR', desc: 'Forensics & IR' },
          { name: 'AppSec', desc: 'Secure software' },
        ].map((t) => (
          <div key={t.name} className="card p-4 text-left">
            <div className="font-semibold text-white">{t.name}</div>
            <div className="text-sm text-slate-400">{t.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-xs text-slate-600 mono">
        10 questions · 6 career tracks · AI-powered rationale · progress saved locally
      </div>
    </div>
  );
}

export default App;
