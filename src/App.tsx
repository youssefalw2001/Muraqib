import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Crown,
  Diamond,
  Eye,
  Flame,
  Headphones,
  Lock,
  MessageCircle,
  Mic2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

type View = 'home' | 'create' | 'trial' | 'result' | 'dashboard' | 'council' | 'boost';
type ResultStatus = 'winner' | 'roasted' | 'revived';
type Difficulty = 'easy' | 'medium' | 'hard';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
};

type Trial = {
  creatorName: string;
  slug: string;
  reward: string;
  questions: Question[];
  roasts: {
    early: string;
    mid: string;
    final: string;
  };
};

type Attempt = {
  id: number;
  challengerName: string;
  score: number;
  total: number;
  failedLevel: number | null;
  status: ResultStatus;
  city: string;
  createdAt: string;
};

const starterQuestions: Question[] = [
  { id: 1, text: 'What is my go-to late-night food?', options: ['Al Baik spicy nuggets', 'Sushi', 'Burger', 'Shawarma'], correctIndex: 0, difficulty: 'easy' },
  { id: 2, text: 'Which app do I check first in the morning?', options: ['Snapchat', 'TikTok', 'Instagram', 'WhatsApp'], correctIndex: 0, difficulty: 'easy' },
  { id: 3, text: 'What is my dream weekend plan?', options: ['Road trip with close friends', 'Sleeping all day', 'Mall run', 'Gaming alone'], correctIndex: 0, difficulty: 'medium' },
  { id: 4, text: 'What kind of friend annoys me fastest?', options: ['Someone who disappears when needed', 'Someone who sends memes', 'Someone who talks too much', 'Someone too quiet'], correctIndex: 0, difficulty: 'medium' },
  { id: 5, text: 'What is one thing I secretly respect most?', options: ['Loyalty under pressure', 'Expensive clothes', 'Fast replies only', 'Being popular'], correctIndex: 0, difficulty: 'hard' },
  { id: 6, text: 'What makes someone Crown Council material?', options: ['They know the small details', 'They always agree with me', 'They never joke', 'They post daily'], correctIndex: 0, difficulty: 'hard' },
];

const starterTrial: Trial = {
  creatorName: 'Youssef',
  slug: 'youssef.trial',
  reward: 'Winner unlocks a private Crown Council shoutout + dinner promise.',
  questions: starterQuestions,
  roasts: {
    early: 'Level 1 or 2? Be serious. You entered the Trial with confidence and left with a clown card.',
    mid: 'You made it halfway, then folded. The Council will review this failure immediately.',
    final: 'One step from glory and you missed. This is the most dramatic Trial collapse of the night.',
  },
};

const seededAttempts: Attempt[] = [
  { id: 1, challengerName: 'faisal.kw', score: 6, total: 6, failedLevel: null, status: 'winner', city: 'Kuwait City', createdAt: '5 min ago' },
  { id: 2, challengerName: 'reem.dxb', score: 4, total: 6, failedLevel: 5, status: 'roasted', city: 'Dubai', createdAt: '19 min ago' },
  { id: 3, challengerName: 'saud.riyadh', score: 2, total: 6, failedLevel: 3, status: 'revived', city: 'Riyadh', createdAt: '42 min ago' },
];

const cities = ['Kuwait City', 'Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha', 'Manama', 'Muscat'];

function cleanSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'trial';
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const initialView: View = window.location.pathname.startsWith('/trial/') || window.location.pathname.startsWith('/r/') ? 'trial' : 'home';
  const [view, setView] = useState<View>(initialView);
  const [trial, setTrial] = useState<Trial>(starterTrial);
  const [attempts, setAttempts] = useState<Attempt[]>(seededAttempts);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);

  const [draftCreator, setDraftCreator] = useState(starterTrial.creatorName);
  const [draftSlug, setDraftSlug] = useState(starterTrial.slug);
  const [draftReward, setDraftReward] = useState(starterTrial.reward);
  const [draftQuestions, setDraftQuestions] = useState<Question[]>(starterTrial.questions);
  const [draftEarlyRoast, setDraftEarlyRoast] = useState(starterTrial.roasts.early);
  const [draftMidRoast, setDraftMidRoast] = useState(starterTrial.roasts.mid);
  const [draftFinalRoast, setDraftFinalRoast] = useState(starterTrial.roasts.final);

  const [challengerName, setChallengerName] = useState('');
  const [challengerCity, setChallengerCity] = useState(cities[0]);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [failedLevel, setFailedLevel] = useState<number | null>(null);
  const [reviveUsed, setReviveUsed] = useState(false);

  const topAttempts = useMemo(() => [...attempts].sort((a, b) => b.score - a.score).slice(0, 3), [attempts]);

  const navigate = (next: View) => {
    setView(next);
    window.history.pushState({}, '', next === 'trial' ? `/trial/${trial.slug}` : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const publishTrial = () => {
    setTrial({
      creatorName: draftCreator.trim() || 'Creator',
      slug: cleanSlug(draftSlug),
      reward: draftReward.trim() || 'Winner unlocks a Crown Council reward.',
      questions: draftQuestions.slice(0, 12),
      roasts: { early: draftEarlyRoast, mid: draftMidRoast, final: draftFinalRoast },
    });
    navigate('dashboard');
  };

  const updateQuestion = (id: number, field: keyof Question, value: string | number) => {
    setDraftQuestions(items => items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setDraftQuestions(items => items.map(item => {
      if (item.id !== questionId) return item;
      const options = [...item.options];
      options[optionIndex] = value;
      return { ...item, options };
    }));
  };

  const addQuestion = () => {
    setDraftQuestions(items => [...items, {
      id: Date.now(),
      text: 'New loyalty question?',
      options: ['Correct answer', 'Trap answer', 'Funny answer', 'Random answer'],
      correctIndex: 0,
      difficulty: 'medium',
    }]);
  };

  const resetPlay = () => {
    setStarted(false);
    setEnded(false);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setFailedLevel(null);
    setReviveUsed(false);
  };

  const startTrial = () => {
    if (!challengerName.trim()) return;
    resetPlay();
    setStarted(true);
  };

  const finishAttempt = (status: ResultStatus, finalScore: number, failed: number | null) => {
    const attempt: Attempt = {
      id: Date.now(),
      challengerName: challengerName.trim() || 'anonymous.friend',
      score: finalScore,
      total: trial.questions.length,
      failedLevel: failed,
      status,
      city: challengerCity,
      createdAt: 'Just now',
    };
    setAttempts(items => [attempt, ...items]);
    setLastAttempt(attempt);
    setEnded(true);
    navigate('result');
  };

  const chooseAnswer = (optionIndex: number) => {
    if (selected !== null || ended) return;
    setSelected(optionIndex);
    const current = trial.questions[questionIndex];
    const correct = optionIndex === current.correctIndex;
    setTimeout(() => {
      if (correct) {
        const nextScore = score + 1;
        setScore(nextScore);
        if (questionIndex + 1 >= trial.questions.length) finishAttempt('winner', nextScore, null);
        else {
          setQuestionIndex(i => i + 1);
          setSelected(null);
        }
      } else {
        const level = questionIndex + 1;
        if (!reviveUsed && level >= Math.max(3, trial.questions.length - 1)) {
          setFailedLevel(level);
          setEnded(true);
        } else finishAttempt('roasted', score, level);
      }
    }, 650);
  };

  const useRevive = () => {
    setReviveUsed(true);
    setEnded(false);
    setSelected(null);
    setFailedLevel(null);
  };

  const playVoiceRoast = () => {
    const level = failedLevel ?? lastAttempt?.failedLevel ?? 1;
    const script = level <= 2 ? trial.roasts.early : level <= 4 ? trial.roasts.mid : trial.roasts.final;
    try {
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = 1.02;
      utterance.pitch = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const copyTrialLink = async () => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/trial/${trial.slug}`); } catch {}
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040917] text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_8%,rgba(0,229,255,0.18),transparent_32%),radial-gradient(circle_at_85%_0%,rgba(245,196,66,0.2),transparent_32%),linear-gradient(145deg,#040917_0%,#081a31_48%,#04040a_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:36px_36px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <button onClick={() => navigate('home')} className="flex items-center gap-3 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/35 bg-amber-300/10 shadow-[0_0_35px_rgba(244,196,48,.18)]">
            <Eye className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-white">Al-Muraqib</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/75">Trials • The Observer</p>
          </div>
        </button>
        <button onClick={() => navigate('create')} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-100 backdrop-blur transition hover:bg-amber-300/20">Create Trial</button>
      </header>

      <main className="relative z-10 pb-28">
        {view === 'home' && <HomeScreen navigate={navigate} slug={trial.slug} />}
        {view === 'create' && <CreateScreen draftCreator={draftCreator} setDraftCreator={setDraftCreator} draftSlug={draftSlug} setDraftSlug={setDraftSlug} draftReward={draftReward} setDraftReward={setDraftReward} draftQuestions={draftQuestions} updateQuestion={updateQuestion} updateOption={updateOption} addQuestion={addQuestion} draftEarlyRoast={draftEarlyRoast} setDraftEarlyRoast={setDraftEarlyRoast} draftMidRoast={draftMidRoast} setDraftMidRoast={setDraftMidRoast} draftFinalRoast={draftFinalRoast} setDraftFinalRoast={setDraftFinalRoast} publishTrial={publishTrial} />}
        {view === 'trial' && <TrialScreen trial={trial} challengerName={challengerName} setChallengerName={setChallengerName} challengerCity={challengerCity} setChallengerCity={setChallengerCity} started={started} ended={ended} questionIndex={questionIndex} score={score} selected={selected} failedLevel={failedLevel} reviveUsed={reviveUsed} startTrial={startTrial} chooseAnswer={chooseAnswer} useRevive={useRevive} finishAttempt={finishAttempt} playVoiceRoast={playVoiceRoast} />}
        {view === 'result' && <ResultScreen attempt={lastAttempt} trial={trial} navigate={navigate} playVoiceRoast={playVoiceRoast} />}
        {view === 'dashboard' && <DashboardScreen trial={trial} attempts={attempts} navigate={navigate} copyTrialLink={copyTrialLink} />}
        {view === 'council' && <CouncilScreen attempts={topAttempts} />}
        {view === 'boost' && <BoostScreen />}
      </main>

      <nav className="fixed bottom-4 left-1/2 z-30 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 grid-cols-4 rounded-[1.7rem] border border-white/10 bg-[#071427]/85 p-2 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-xl">
        {[{ key: 'home' as View, label: 'Home', icon: <Eye className="h-4 w-4" /> }, { key: 'dashboard' as View, label: 'Intel', icon: <BarChart3 className="h-4 w-4" /> }, { key: 'council' as View, label: 'Council', icon: <Crown className="h-4 w-4" /> }, { key: 'boost' as View, label: 'Boost', icon: <Sparkles className="h-4 w-4" /> }].map(item => (
          <button key={item.key} onClick={() => navigate(item.key)} className={cx('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition', view === item.key ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-white/10')}>
            {item.icon}{item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function HomeScreen({ navigate, slug }: { navigate: (view: View) => void; slug: string }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-8 md:grid-cols-[1.06fr_.94fr] md:items-center md:pt-16">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100"><ShieldCheck className="h-3.5 w-3.5" /> GCC / MENA loyalty game</div>
        <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl">Test your friends.<br /><span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Crown the real ones.</span></h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Create a high-stakes Loyalty Trial with personal questions, custom voice-roast scripts, and a winner reward. Friends play through your link, fail into a viral verdict, or survive into your Crown Council.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => navigate('create')} className="group rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-6 py-4 font-black text-slate-950 shadow-[0_18px_55px_rgba(244,196,48,.25)]">Build My Trial <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" /></button>
          <button onClick={() => navigate('trial')} className="rounded-2xl border border-white/15 bg-white/[0.08] px-6 py-4 font-bold text-white backdrop-blur transition hover:bg-white/[0.12]">Preview /trial/{slug}</button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">{['Voice Roasts', 'Extra Life', 'Crown Council'].map(item => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">{item}</div>)}</div>
      </div>
      <PhoneShell>
        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-[#061426] p-5">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative">
            <div className="mb-5 flex items-center justify-between"><span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 font-mono text-[10px] font-bold text-amber-100">LIVE TRIAL</span><span className="font-mono text-[10px] text-cyan-100">LEVEL 05 / 06</span></div>
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-100">Question</p><h3 className="mt-2 text-2xl font-black leading-tight text-white">What is one thing I secretly respect most?</h3>
              <div className="mt-5 space-y-3">{['Loyalty under pressure', 'Fast replies only', 'Being popular'].map((answer, index) => <div key={answer} className={cx('rounded-2xl border p-3 text-sm font-bold', index === 0 ? 'border-emerald-300/40 bg-emerald-300/10 text-emerald-100' : 'border-white/10 bg-white/[0.05] text-slate-300')}>{answer}</div>)}</div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3"><MetricMini label="Attempts" value="18" /><MetricMini label="Winners" value="4" /><MetricMini label="Roasts" value="14" /></div>
          </div>
        </div>
      </PhoneShell>
    </section>
  );
}

function CreateScreen(props: { draftCreator: string; setDraftCreator: (v: string) => void; draftSlug: string; setDraftSlug: (v: string) => void; draftReward: string; setDraftReward: (v: string) => void; draftQuestions: Question[]; updateQuestion: (id: number, field: keyof Question, value: string | number) => void; updateOption: (questionId: number, optionIndex: number, value: string) => void; addQuestion: () => void; draftEarlyRoast: string; setDraftEarlyRoast: (v: string) => void; draftMidRoast: string; setDraftMidRoast: (v: string) => void; draftFinalRoast: string; setDraftFinalRoast: (v: string) => void; publishTrial: () => void }) {
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><PageTitle eyebrow="Creator Studio" title="Build a Loyalty Trial they will send to every group chat." /><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-4"><GlassCard><Label>Creator name</Label><Input value={props.draftCreator} onChange={props.setDraftCreator} /><Label className="mt-4">Trial slug</Label><Input value={props.draftSlug} onChange={v => props.setDraftSlug(cleanSlug(v))} /><Label className="mt-4">Winner reward</Label><TextArea value={props.draftReward} onChange={props.setDraftReward} /></GlassCard><GlassCard><div className="mb-4 flex items-center gap-2"><Mic2 className="h-5 w-5 text-amber-200" /><h3 className="text-xl font-black text-white">Voice-roast scripts</h3></div><Label>Early fail roast</Label><TextArea value={props.draftEarlyRoast} onChange={props.setDraftEarlyRoast} /><Label className="mt-4">Mid fail roast</Label><TextArea value={props.draftMidRoast} onChange={props.setDraftMidRoast} /><Label className="mt-4">Final boss fail roast</Label><TextArea value={props.draftFinalRoast} onChange={props.setDraftFinalRoast} /></GlassCard></div><GlassCard><div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100">Question ladder</p><h3 className="text-2xl font-black text-white">{props.draftQuestions.length} levels</h3></div><button onClick={props.addQuestion} className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-100">Add level</button></div><div className="space-y-4">{props.draftQuestions.map((question, qIndex) => <div key={question.id} className="rounded-3xl border border-white/10 bg-black/20 p-4"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-100">Level {qIndex + 1}</span><select className="rounded-xl border border-white/10 bg-[#071427] px-3 py-2 text-xs text-slate-200" value={question.difficulty} onChange={e => props.updateQuestion(question.id, 'difficulty', e.target.value)}><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hardcore</option></select></div><Input value={question.text} onChange={v => props.updateQuestion(question.id, 'text', v)} /><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, index) => <div key={index} className="flex gap-2"><button onClick={() => props.updateQuestion(question.id, 'correctIndex', index)} className={cx('w-10 shrink-0 rounded-xl border text-xs font-black', question.correctIndex === index ? 'border-emerald-300/50 bg-emerald-300/20 text-emerald-100' : 'border-white/10 bg-white/[0.04] text-slate-400')}>{String.fromCharCode(65 + index)}</button><Input value={option} onChange={v => props.updateOption(question.id, index, v)} small /></div>)}</div></div>)}</div><button onClick={props.publishTrial} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-200 to-amber-300 px-6 py-4 font-black text-slate-950">Publish Al-Muraqib Trial</button></GlassCard></div></section>;
}

function TrialScreen(props: { trial: Trial; challengerName: string; setChallengerName: (v: string) => void; challengerCity: string; setChallengerCity: (v: string) => void; started: boolean; ended: boolean; questionIndex: number; score: number; selected: number | null; failedLevel: number | null; reviveUsed: boolean; startTrial: () => void; chooseAnswer: (idx: number) => void; useRevive: () => void; finishAttempt: (status: ResultStatus, finalScore: number, failed: number | null) => void; playVoiceRoast: () => void }) {
  const current = props.trial.questions[props.questionIndex];
  return <section className="mx-auto w-full max-w-md px-5 pt-8"><PhoneShell>{!props.started && <div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-amber-200/40 bg-amber-200/10"><Flame className="h-8 w-8 text-amber-200" /></div><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-100">/trial/{props.trial.slug}</p><h2 className="mt-3 text-4xl font-black tracking-tight text-white">{props.trial.creatorName}'s Loyalty Trial</h2><p className="mt-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-sm leading-6 text-slate-300">Answer every level. Win the reward. Fail once and unlock a custom roast verdict.</p><div className="mt-6 space-y-3 text-left"><Input placeholder="Your name / handle" value={props.challengerName} onChange={props.setChallengerName} /><select className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none" value={props.challengerCity} onChange={e => props.setChallengerCity(e.target.value)}>{cities.map(city => <option key={city}>{city}</option>)}</select><button onClick={props.startTrial} className="w-full rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-5 py-4 font-black text-slate-950">Start Trial</button></div></div>}{props.started && !props.ended && current && <div><div className="mb-5 flex items-center justify-between"><span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-100">Level {props.questionIndex + 1} / {props.trial.questions.length}</span><span className="rounded-full bg-amber-300/10 px-3 py-1 font-mono text-[10px] text-amber-100">Score {props.score}</span></div><div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-amber-300" style={{ width: `${((props.questionIndex + 1) / props.trial.questions.length) * 100}%` }} /></div><p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-amber-100">{current.difficulty} difficulty</p><h2 className="text-2xl font-black leading-tight text-white">{current.text}</h2><div className="mt-6 space-y-3">{current.options.map((option, index) => { const wasSelected = props.selected === index; const isCorrect = current.correctIndex === index; return <button key={option} onClick={() => props.chooseAnswer(index)} className={cx('w-full rounded-2xl border px-4 py-4 text-left text-sm font-bold transition', wasSelected && isCorrect && 'border-emerald-300/50 bg-emerald-300/15 text-emerald-100', wasSelected && !isCorrect && 'border-rose-300/50 bg-rose-300/15 text-rose-100', !wasSelected && 'border-white/10 bg-white/[0.05] text-slate-300 hover:bg-white/[0.09]')}><span className="mr-2 font-mono text-slate-500">{String.fromCharCode(65 + index)}.</span>{option}</button>; })}</div></div>}{props.started && props.ended && props.failedLevel !== null && <div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-rose-300/40 bg-rose-300/10"><Flame className="h-8 w-8 text-rose-200" /></div><h2 className="mt-4 text-4xl font-black text-white">Trial locked.</h2><p className="mt-3 text-sm leading-6 text-slate-300">You missed Level {props.failedLevel}. Use one Extra Life to keep your streak alive, or accept the roast verdict.</p><button onClick={props.playVoiceRoast} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-400 px-4 py-3 text-sm font-black text-white"><Play className="h-4 w-4" /> Play Roast</button><div className="mt-5 grid gap-3">{!props.reviveUsed && <button onClick={props.useRevive} className="rounded-2xl bg-gradient-to-r from-cyan-200 to-amber-300 px-5 py-4 font-black text-slate-950">Extra Life • $0.99 demo</button>}<button onClick={() => props.finishAttempt('roasted', props.score, props.failedLevel)} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 font-bold text-white">Accept Roast Verdict</button></div></div>}</PhoneShell></section>;
}

function ResultScreen({ attempt, trial, navigate, playVoiceRoast }: { attempt: Attempt | null; trial: Trial; navigate: (view: View) => void; playVoiceRoast: () => void }) {
  const result = attempt ?? seededAttempts[0];
  const isWinner = result.status === 'winner';
  const shareText = isWinner ? `I survived ${trial.creatorName}'s Al-Muraqib Trial with ${result.score}/${result.total}. Crown Council material.` : `I failed ${trial.creatorName}'s Al-Muraqib Trial at Level ${result.failedLevel}. The roast verdict is live.`;
  const copyShare = async () => { try { await navigator.clipboard.writeText(shareText); } catch {} };
  return <section className="mx-auto w-full max-w-md px-5 pt-10 text-center"><div className={cx('rounded-[2rem] border p-7 shadow-[0_24px_90px_rgba(0,0,0,.45)] backdrop-blur', isWinner ? 'border-emerald-200/30 bg-emerald-300/10' : 'border-rose-200/30 bg-rose-300/10')}>{isWinner ? <Trophy className="mx-auto h-12 w-12 text-emerald-200" /> : <Flame className="mx-auto h-12 w-12 text-rose-200" />}<h2 className="mt-5 text-4xl font-black tracking-tight text-white">{isWinner ? 'Crown Council material.' : 'You entered the Roast Court.'}</h2><p className="mt-4 text-lg font-semibold text-slate-300">{result.challengerName} scored {result.score}/{result.total}.</p><div className="my-6 rounded-3xl border border-white/10 bg-black/20 p-5"><p className="font-mono text-[10px] uppercase tracking-widest text-cyan-100">Shareable Verdict</p><p className="mt-2 text-sm leading-6 text-slate-200">{shareText}</p></div>{!isWinner && <button onClick={playVoiceRoast} className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/30 bg-rose-300/10 px-5 py-3 font-bold text-rose-100"><Headphones className="h-4 w-4" /> Replay voice roast</button>}<button onClick={copyShare} className="w-full rounded-2xl bg-white px-5 py-4 font-black text-slate-950">Copy story text</button><button onClick={() => navigate('create')} className="mt-3 w-full rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-5 py-4 font-black text-slate-950">Create your Trial</button></div></section>;
}

function DashboardScreen({ trial, attempts, navigate, copyTrialLink }: { trial: Trial; attempts: Attempt[]; navigate: (view: View) => void; copyTrialLink: () => void }) {
  const winners = attempts.filter(item => item.status === 'winner').length;
  const roasts = attempts.filter(item => item.status === 'roasted').length;
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total, 0) / attempts.length * 100) : 0;
  return <section className="mx-auto w-full max-w-6xl px-5 pt-8"><PageTitle eyebrow="Intelligence Dashboard" title="Track the friends who survive, fold, revive, and share." /><div className="grid gap-4 sm:grid-cols-4"><Metric icon={<Users />} label="Attempts" value={String(attempts.length)} /><Metric icon={<Crown />} label="Winners" value={String(winners)} /><Metric icon={<Flame />} label="Roast Cards" value={String(roasts)} /><Metric icon={<Star />} label="Avg Score" value={`${average}%`} /></div><div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.05] p-5"><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan-100">Active Trial</p><h3 className="text-xl font-black text-white">/trial/{trial.slug}</h3><p className="mt-1 text-sm text-slate-400">{trial.reward}</p></div><div className="flex gap-2"><button onClick={copyTrialLink} className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Copy link</button><button onClick={() => navigate('council')} className="rounded-2xl bg-amber-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-950">Top 3</button></div></div><div className="space-y-3">{attempts.map(attempt => <div key={attempt.id} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 font-black text-white">{attempt.status === 'winner' ? <Crown className="h-4 w-4 text-amber-200" /> : <Flame className="h-4 w-4 text-rose-200" />}{attempt.challengerName}</p><p className="mt-1 text-sm text-slate-300">{attempt.status === 'winner' ? 'Survived the full Trial.' : `Failed on level ${attempt.failedLevel}.`}</p><p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{attempt.city} • {attempt.createdAt} • {attempt.status}</p></div><div className="text-right"><p className="text-2xl font-black text-amber-200">{attempt.score}/{attempt.total}</p><p className="font-mono text-[9px] uppercase text-cyan-100">score</p></div></div></div>)}</div></div></section>;
}

function CouncilScreen({ attempts }: { attempts: Attempt[] }) {
  const titles = ['Crown King', 'Diamond Prince', 'Golden Guard'];
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><PageTitle eyebrow="Crown Council" title="The Top 3 loyalty scores become the Council." /><div className="grid gap-5 md:grid-cols-3">{attempts.map((attempt, index) => <div key={attempt.id} className="rounded-[2rem] border border-amber-200/30 bg-gradient-to-b from-amber-200/12 to-white/[0.04] p-6 text-center shadow-[0_0_55px_rgba(244,196,48,.1)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-200 text-slate-950">{index === 1 ? <Diamond className="h-8 w-8" /> : <Crown className="h-8 w-8" />}</div><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100">#{index + 1} {titles[index]}</p><h3 className="mt-2 text-2xl font-black text-white">{attempt.challengerName}</h3><p className="mt-2 text-sm text-slate-300">{attempt.city} • {attempt.score}/{attempt.total}</p><p className="mt-5 text-5xl font-black text-amber-200">{Math.round(attempt.score / attempt.total * 100)}</p><p className="text-xs font-bold uppercase tracking-widest text-cyan-100">Loyalty Score</p></div>)}</div></section>;
}

function BoostScreen() {
  const boosts = [['Extra Life', 'Revive at the emotional moment before losing the final levels.', '$0.99', <RotateCcw className="h-5 w-5" />], ['Premium Roast Pack', 'Unlock sharper pre-written roast scripts and meme verdict copy.', '$1.99', <MessageCircle className="h-5 w-5" />], ['Royal Trial Skin', 'Upgrade story cards with cyber-gold effects and Crown Council styling.', '$2.99', <Sparkles className="h-5 w-5" />], ['Reward Gate', 'Let winners unlock a private reward after completing the Trial.', '$4.99', <Lock className="h-5 w-5" />]];
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><PageTitle eyebrow="Boost & Access" title="Monetize the exact moment they care." /><div className="grid gap-4 md:grid-cols-2">{boosts.map(([name, desc, price, icon]) => <div key={String(name)} className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-200/10 text-amber-100">{icon}</div><h3 className="text-xl font-black text-white">{name}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p><p className="mt-4 text-2xl font-black text-amber-200">{price}</p></div>)}</div></section>;
}

function PhoneShell({ children }: { children: React.ReactNode }) { return <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.06] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur"><div className="rounded-[2rem] border border-white/10 bg-[#07101f]/95 p-5">{children}</div></div>; }
function PageTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="mb-6"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100">{eyebrow}</p><h2 className="mt-2 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h2></div>; }
function GlassCard({ children }: { children: React.ReactNode }) { return <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">{children}</div>; }
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-200/10 text-cyan-100">{icon}</div><p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></div>; }
function MetricMini({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center"><p className="text-2xl font-black text-white">{value}</p><p className="font-mono text-[9px] uppercase tracking-widest text-slate-400">{label}</p></div>; }
function Label({ children, className }: { children: React.ReactNode; className?: string }) { return <label className={cx('block text-xs font-bold uppercase tracking-widest text-cyan-100', className)}>{children}</label>; }
function Input({ value, onChange, placeholder, small }: { value: string; onChange: (value: string) => void; placeholder?: string; small?: boolean }) { return <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={cx('w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-white outline-none placeholder:text-slate-500 focus:border-amber-200/50', small ? 'py-2 text-sm' : 'py-3')} />; }
function TextArea({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <textarea value={value} onChange={e => onChange(e.target.value)} className="min-h-24 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-amber-200/50" />; }
