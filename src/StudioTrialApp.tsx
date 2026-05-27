import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Check, Crown, Diamond, Eye, Flame, Lock, MessageCircle, Mic2, Play, Radar, RotateCcw, Shield, ShieldCheck, Sparkles, Star, Trophy, Users } from 'lucide-react';

type View = 'home' | 'create' | 'trial' | 'result' | 'dashboard' | 'council' | 'boost';
type Status = 'winner' | 'failed' | 'revived';
type Level = 'easy' | 'medium' | 'hard';
type Question = { id: number; text: string; options: string[]; correct: number; level: Level };
type Trial = { creator: string; slug: string; reward: string; questions: Question[]; roasts: string[] };
type Attempt = { id: number; name: string; score: number; total: number; failAt: number | null; status: Status; city: string; time: string };

const starterQuestions: Question[] = [
  { id: 1, text: 'What is my go-to late-night food?', options: ['Al Baik spicy nuggets', 'Sushi', 'Burger', 'Shawarma'], correct: 0, level: 'easy' },
  { id: 2, text: 'Which app do I check first in the morning?', options: ['Snapchat', 'TikTok', 'Instagram', 'WhatsApp'], correct: 0, level: 'easy' },
  { id: 3, text: 'What is my ideal weekend plan?', options: ['Road trip with close friends', 'Sleeping all day', 'Mall run', 'Gaming alone'], correct: 0, level: 'medium' },
  { id: 4, text: 'What kind of friend annoys me fastest?', options: ['Someone who disappears when needed', 'Someone who sends memes', 'Someone too loud', 'Someone too quiet'], correct: 0, level: 'medium' },
  { id: 5, text: 'What do I secretly respect most?', options: ['Loyalty under pressure', 'Expensive clothes', 'Fast replies only', 'Being popular'], correct: 0, level: 'hard' },
  { id: 6, text: 'What makes someone Crown Council material?', options: ['They know the small details', 'They always agree with me', 'They never joke', 'They post daily'], correct: 0, level: 'hard' },
];

const initialTrial: Trial = {
  creator: 'Youssef',
  slug: 'youssef.trial',
  reward: 'Winner unlocks a private Crown Council shoutout and dinner promise.',
  questions: starterQuestions,
  roasts: [
    'You entered with confidence and exited at the first gate. The Trial has recorded your collapse.',
    'A respectable climb, but not enough. The Council will review the missed detail.',
    'One step from the Council and you missed. That is the most expensive kind of failure.',
  ],
};

const initialAttempts: Attempt[] = [
  { id: 1, name: 'faisal.kw', score: 6, total: 6, failAt: null, status: 'winner', city: 'Kuwait City', time: '5 min ago' },
  { id: 2, name: 'reem.dxb', score: 4, total: 6, failAt: 5, status: 'failed', city: 'Dubai', time: '19 min ago' },
  { id: 3, name: 'saud.riyadh', score: 2, total: 6, failAt: 3, status: 'revived', city: 'Riyadh', time: '42 min ago' },
];

const cities = ['Kuwait City', 'Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha', 'Manama', 'Muscat'];
const cn = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(' ');
const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'trial';

export default function StudioTrialApp() {
  const [view, setView] = useState<View>(window.location.pathname.startsWith('/trial/') || window.location.pathname.startsWith('/r/') ? 'trial' : 'home');
  const [trial, setTrial] = useState(initialTrial);
  const [draft, setDraft] = useState(initialTrial);
  const [attempts, setAttempts] = useState(initialAttempts);
  const [last, setLast] = useState<Attempt | null>(null);
  const [player, setPlayer] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [q, setQ] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [failAt, setFailAt] = useState<number | null>(null);
  const [revived, setRevived] = useState(false);
  const leaders = useMemo(() => [...attempts].sort((a, b) => b.score - a.score).slice(0, 3), [attempts]);

  const go = (next: View) => {
    setView(next);
    window.history.pushState({}, '', next === 'trial' ? `/trial/${trial.slug}` : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPlay = () => { setStarted(false); setLocked(false); setQ(0); setPick(null); setScore(0); setFailAt(null); setRevived(false); };
  const publish = () => { setTrial({ ...draft, slug: slugify(draft.slug), questions: draft.questions.slice(0, 12) }); go('dashboard'); };
  const speak = () => {
    const level = failAt ?? last?.failAt ?? 1;
    const line = level <= 2 ? trial.roasts[0] : level <= 4 ? trial.roasts[1] : trial.roasts[2];
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(line)); } catch {}
  };
  const finish = (status: Status, finalScore: number, failed: number | null) => {
    const entry = { id: Date.now(), name: player || 'anonymous.friend', score: finalScore, total: trial.questions.length, failAt: failed, status, city, time: 'Just now' };
    setAttempts([entry, ...attempts]); setLast(entry); setLocked(true); go('result');
  };
  const answer = (index: number) => {
    if (pick !== null || locked) return;
    setPick(index);
    const correct = index === trial.questions[q].correct;
    setTimeout(() => {
      if (correct) {
        const nextScore = score + 1;
        setScore(nextScore);
        q + 1 >= trial.questions.length ? finish('winner', nextScore, null) : (setQ(q + 1), setPick(null));
      } else {
        const level = q + 1;
        !revived && level >= Math.max(3, trial.questions.length - 1) ? (setFailAt(level), setLocked(true)) : finish('failed', score, level);
      }
    }, 520);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07050f] text-[#f9f4e8] antialiased">
      <Backdrop />
      <Header go={go} />
      <main className="relative z-10 pb-32">
        {view === 'home' && <Home go={go} slug={trial.slug} />}
        {view === 'create' && <Create draft={draft} setDraft={setDraft} publish={publish} />}
        {view === 'trial' && <TrialPlay trial={trial} player={player} setPlayer={setPlayer} city={city} setCity={setCity} started={started} setStarted={setStarted} locked={locked} setLocked={setLocked} q={q} pick={pick} score={score} failAt={failAt} revived={revived} setRevived={setRevived} resetPlay={resetPlay} answer={answer} finish={finish} speak={speak} />}
        {view === 'result' && <Result attempt={last || initialAttempts[0]} trial={trial} go={go} speak={speak} />}
        {view === 'dashboard' && <Dashboard trial={trial} attempts={attempts} go={go} />}
        {view === 'council' && <Council attempts={leaders} />}
        {view === 'boost' && <Vault />}
      </main>
      <BottomNav view={view} go={go} />
    </div>
  );
}

function Backdrop() {
  return <><div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_8%,rgba(219,172,73,.2),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(91,64,255,.22),transparent_34%),linear-gradient(145deg,#05040b_0%,#0b0718_46%,#11091f_100%)]" /><div className="pointer-events-none fixed inset-0 opacity-[.07] [background-image:linear-gradient(rgba(219,172,73,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(219,172,73,.32)_1px,transparent_1px)] [background-size:44px_44px]" /></>;
}

function BrandMark({ small }: { small?: boolean }) {
  return <div className={cn('relative grid place-items-center rounded-2xl border border-[#dcb14d]/35 bg-[#dcb14d]/10 shadow-[0_0_30px_rgba(220,177,77,.18)]', small ? 'h-11 w-11' : 'h-20 w-20')}><svg viewBox="0 0 80 80" className={small ? 'h-7 w-7' : 'h-12 w-12'} fill="none"><path d="M14 40C22 26 31 19 40 19C49 19 58 26 66 40C58 54 49 61 40 61C31 61 22 54 14 40Z" stroke="#dcb14d" strokeWidth="4"/><circle cx="40" cy="40" r="11" stroke="#f6e6b7" strokeWidth="4"/><path d="M40 9L48 24H32L40 9Z" fill="#dcb14d"/><path d="M27 66H53" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round"/></svg></div>;
}

function Header({ go }: { go: (v: View) => void }) {
  return <><div className="relative z-20 border-b border-white/5 bg-[#0f0a1b]/75 px-4 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[.22em] text-white/55"><span className="text-[#dcb14d]">Al-Muraqib Trials</span> / Loyalty intelligence for close circles</div><header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between border-b border-white/5 bg-[#080510]/80 px-5 py-4 backdrop-blur-2xl"><button onClick={() => go('home')} className="flex items-center gap-3 text-left"><BrandMark small /><div><p className="text-sm font-black uppercase tracking-[.16em] text-white sm:text-base">Al-Muraqib</p><p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#a895ff]">Trials OS</p></div></button><button onClick={() => go('create')} className="rounded-2xl border border-[#dcb14d]/30 bg-[#dcb14d]/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#f6d37d]">Create</button></header></>;
}

function Home({ go, slug }: { go: (v: View) => void; slug: string }) {
  return <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-14 text-center"><Badge>Private beta / GCC social game</Badge><BrandMark /><h1 className="mt-6 max-w-4xl bg-gradient-to-r from-[#f6d37d] via-[#fff7d6] to-[#a895ff] bg-clip-text text-5xl font-black uppercase leading-[.9] tracking-[-.06em] text-transparent sm:text-7xl">Test the circle. Crown the real ones.</h1><p className="mt-5 max-w-xl text-base leading-8 text-white/68">Build a personal loyalty trial. Friends climb your question ladder, unlock a reward, or receive a premium verdict card designed for stories and group chats.</p><div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"><Primary onClick={() => go('create')}>Build my Trial <ArrowRight className="h-4 w-4" /></Primary><Secondary onClick={() => go('trial')}>Preview /trial/{slug}</Secondary></div><HeroDevice /></section>;
}

function HeroDevice() {
  return <Panel className="mt-10 w-full max-w-md p-5"><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-bold uppercase tracking-[.2em] text-[#dcb14d]">Trial orbit active</span><span className="rounded-full border border-[#a895ff]/25 bg-[#a895ff]/10 px-3 py-1 font-mono text-[9px] text-[#c6bbff]">Crown signal 94%</span></div><div className="relative mx-auto my-6 grid aspect-square max-w-[300px] place-items-center"><div className="absolute inset-0 rounded-full border border-white/10"/><div className="absolute h-[76%] w-[76%] rounded-full border border-[#dcb14d]/20"/><div className="absolute h-[48%] w-[48%] rounded-full border border-[#a895ff]/30"/><div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left animate-spin-slow border-l border-[#dcb14d]/50 bg-[linear-gradient(45deg,rgba(220,177,77,.16),transparent_65%)]"/><Radar className="h-11 w-11 text-[#dcb14d]"/></div><div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4"><Mini label="Attempts" value="18.4k"/><Mini label="Winners" value="4.9k"/><Mini label="Revives" value="1.2k"/></div></Panel>;
}

function Create({ draft, setDraft, publish }: { draft: Trial; setDraft: React.Dispatch<React.SetStateAction<Trial>>; publish: () => void }) {
  const patchQ = (id: number, patch: Partial<Question>) => setDraft(d => ({ ...d, questions: d.questions.map(q => q.id === id ? { ...q, ...patch } : q) }));
  return <section className="mx-auto max-w-5xl px-5 pt-8"><Title eyebrow="Creator studio" title="Design a Trial that feels personal."/><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><Panel><Label>Creator name</Label><Input value={draft.creator} onChange={v => setDraft({ ...draft, creator: v })}/><Label>Public link</Label><Input value={draft.slug} onChange={v => setDraft({ ...draft, slug: slugify(v) })}/><Label>Winner reward</Label><Area value={draft.reward} onChange={v => setDraft({ ...draft, reward: v })}/><div className="mt-6 flex items-center gap-2"><Mic2 className="h-5 w-5 text-[#dcb14d]"/><h3 className="font-black">Verdict scripts</h3></div>{draft.roasts.map((r, i) => <Area key={i} value={r} onChange={v => setDraft(d => ({ ...d, roasts: d.roasts.map((x, n) => n === i ? v : x) }))}/>)}</Panel><Panel><div className="mb-4 flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#dcb14d]">Question ladder</p><h3 className="text-2xl font-black">{draft.questions.length} levels</h3></div><button onClick={() => setDraft(d => ({ ...d, questions: [...d.questions, { id: Date.now(), text: 'New loyalty question?', options: ['Correct', 'Trap', 'Funny', 'Random'], correct: 0, level: 'medium' }] }))} className="rounded-xl border border-[#dcb14d]/25 bg-[#dcb14d]/10 px-4 py-2 text-xs font-black uppercase text-[#f6d37d]">Add</button></div>{draft.questions.map((q, idx) => <div key={q.id} className="mb-4 rounded-2xl border border-white/10 bg-black/25 p-4"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#dcb14d]">Level {idx + 1}</span><select value={q.level} onChange={e => patchQ(q.id, { level: e.target.value as Level })} className="rounded-lg border border-white/10 bg-[#0b0718] px-2 py-1 text-xs"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div><Input value={q.text} onChange={v => patchQ(q.id, { text: v })}/>{q.options.map((o, oi) => <div key={oi} className="mt-2 flex gap-2"><button onClick={() => patchQ(q.id, { correct: oi })} className={cn('w-10 rounded-xl border text-xs font-black', q.correct === oi ? 'border-emerald-300/50 bg-emerald-300/15 text-emerald-200' : 'border-white/10 text-white/50')}>{String.fromCharCode(65 + oi)}</button><Input value={o} onChange={v => patchQ(q.id, { options: q.options.map((x, n) => n === oi ? v : x) })}/></div>)}</div>)}<Primary full onClick={publish}>Publish Trial</Primary></Panel></div></section>;
}

function TrialPlay(p: any) {
  const current = p.trial.questions[p.q];
  if (!p.started) return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="text-center"><BrandMark/><p className="mt-4 font-mono text-[10px] uppercase tracking-[.25em] text-[#dcb14d]">/trial/{p.trial.slug}</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em]">{p.trial.creator}'s Trial</h2><p className="mt-4 rounded-2xl border border-white/10 bg-white/[.04] p-4 text-sm leading-6 text-white/65">Answer every level. Win the reward. Miss once and receive a shareable verdict.</p><div className="mt-6 space-y-3 text-left"><Input value={p.player} onChange={p.setPlayer} placeholder="Your name or handle"/><select className="w-full rounded-2xl border border-white/10 bg-[#0b0718] px-4 py-3 text-white" value={p.city} onChange={e => p.setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select><Primary full onClick={() => { p.resetPlay(); p.setStarted(true); }}>Start Trial</Primary></div></div></Phone></section>;
  if (p.locked && p.failAt) return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="text-center"><Flame className="mx-auto h-12 w-12 text-rose-300"/><h2 className="mt-4 text-4xl font-black tracking-[-.04em]">Trial locked</h2><p className="mt-3 text-sm leading-6 text-white/65">You missed Level {p.failAt}. Use one Extra Life or accept the verdict.</p><button onClick={p.speak} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/90 px-4 py-3 font-black"><Play className="h-4 w-4"/>Play verdict</button>{!p.revived && <button onClick={() => { p.setRevived(true); p.setLocked(false); }} className="mt-3 w-full rounded-2xl bg-[#dcb14d] py-4 font-black text-[#0b0718]">Extra Life / $0.99 demo</button>}<Secondary full onClick={() => p.finish('failed', p.score, p.failAt)}>Accept verdict</Secondary></div></Phone></section>;
  return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="mb-5 flex justify-between"><span className="font-mono text-[10px] uppercase tracking-[.2em] text-[#dcb14d]">Level {p.q + 1} / {p.trial.questions.length}</span><span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] text-white/70">Score {p.score}</span></div><div className="mb-5 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] to-[#dcb14d]" style={{ width: `${((p.q + 1) / p.trial.questions.length) * 100}%` }}/></div><p className="mb-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#a895ff]">{current.level}</p><h2 className="text-3xl font-black tracking-[-.04em]">{current.text}</h2><div className="mt-6 space-y-3">{current.options.map((o: string, i: number) => <button key={o} onClick={() => p.answer(i)} className={cn('w-full rounded-2xl border px-4 py-4 text-left text-sm font-bold transition', p.pick === i && i === current.correct && 'border-emerald-300/50 bg-emerald-300/15', p.pick === i && i !== current.correct && 'border-rose-300/50 bg-rose-300/15', p.pick !== i && 'border-white/10 bg-white/[.045] hover:bg-white/[.075]')}><span className="mr-2 font-mono text-white/35">{String.fromCharCode(65 + i)}</span>{o}</button>)}</div></Phone></section>;
}

function Result({ attempt, trial, go, speak }: { attempt: Attempt; trial: Trial; go: (v: View) => void; speak: () => void }) {
  const win = attempt.status === 'winner';
  const text = win ? `I survived ${trial.creator}'s Al-Muraqib Trial with ${attempt.score}/${attempt.total}.` : `I missed ${trial.creator}'s Al-Muraqib Trial at Level ${attempt.failAt}.`;
  return <section className="mx-auto max-w-md px-5 pt-10 text-center"><Panel><div className={cn('mx-auto grid h-16 w-16 place-items-center rounded-3xl', win ? 'bg-emerald-300 text-[#07130d]' : 'bg-rose-500')}><Trophy className="h-8 w-8"/></div><h2 className="mt-5 text-4xl font-black tracking-[-.04em]">{win ? 'Council eligible' : 'Verdict issued'}</h2><p className="mt-4 text-white/65">{attempt.name} scored {attempt.score}/{attempt.total}.</p><div className="my-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/75">{text}</div>{!win && <Secondary full onClick={speak}><Play className="h-4 w-4"/>Replay verdict</Secondary>}<Primary full onClick={() => navigator.clipboard?.writeText(text)}>Copy story text</Primary><Secondary full onClick={() => go('create')}>Create my Trial</Secondary></Panel></section>;
}

function Dashboard({ trial, attempts, go }: { trial: Trial; attempts: Attempt[]; go: (v: View) => void }) {
  const wins = attempts.filter(a => a.status === 'winner').length;
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score / a.total, 0) / attempts.length * 100) : 0;
  return <section className="mx-auto max-w-6xl px-5 pt-8"><Title eyebrow="Intelligence dashboard" title="Watch the Trial spread."/><div className="grid gap-4 sm:grid-cols-4"><Stat icon={<Users/>} label="Attempts" value={String(attempts.length)}/><Stat icon={<Crown/>} label="Winners" value={String(wins)}/><Stat icon={<Flame/>} label="Verdicts" value={String(attempts.length - wins)}/><Stat icon={<Star/>} label="Average" value={`${avg}%`}/></div><Panel className="mt-5"><div className="mb-4 flex justify-between gap-3"><div><p className="font-mono text-[10px] uppercase text-[#dcb14d]">Active Trial</p><h3 className="text-xl font-black">/trial/{trial.slug}</h3><p className="text-sm text-white/50">{trial.reward}</p></div><Primary onClick={() => go('council')}>Top 3</Primary></div>{attempts.map(a => <div key={a.id} className="mb-3 rounded-2xl border border-white/10 bg-black/25 p-4"><div className="flex justify-between gap-4"><div><p className="font-black">{a.name}</p><p className="text-sm text-white/60">{a.status === 'winner' ? 'Completed the Trial.' : `Missed level ${a.failAt}.`}</p><p className="mt-2 font-mono text-[10px] uppercase text-white/35">{a.city} / {a.time}</p></div><p className="text-2xl font-black text-[#f6d37d]">{a.score}/{a.total}</p></div></div>)}</Panel></section>;
}

function Council({ attempts }: { attempts: Attempt[] }) {
  const titles = ['Crown King', 'Diamond Prince', 'Golden Guard'];
  return <section className="mx-auto max-w-5xl px-5 pt-8"><Title eyebrow="Crown Council" title="Top loyalty scores become status."/><div className="grid gap-5 md:grid-cols-3">{attempts.map((a, i) => <Panel key={a.id} className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#dcb14d] text-[#090714]">{i === 1 ? <Diamond/> : <Crown/>}</div><p className="mt-5 font-mono text-[10px] uppercase tracking-[.24em] text-[#f6d37d]">#{i + 1} {titles[i]}</p><h3 className="mt-2 text-2xl font-black">{a.name}</h3><p className="mt-2 text-sm text-white/55">{a.city} / {a.score}/{a.total}</p><p className="mt-5 text-5xl font-black text-[#f6d37d]">{Math.round(a.score / a.total * 100)}</p></Panel>)}</div></section>;
}

function Vault() {
  const items = [['Extra Life', 'Revive before losing the final levels.', '$0.99', <RotateCcw/>], ['Premium Verdict Pack', 'Sharper copy and voice scripts.', '$1.99', <MessageCircle/>], ['Royal Skin', 'Cyber-gold story-card effects.', '$2.99', <Sparkles/>], ['Reward Gate', 'Let winners unlock a private reward.', '$4.99', <Lock/>]];
  return <section className="mx-auto max-w-5xl px-5 pt-8"><Title eyebrow="Boost & Access" title="Monetize the exact moment they care."/><div className="grid gap-4 md:grid-cols-2">{items.map(([n, d, p, icon]) => <Panel key={String(n)}><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#dcb14d]/20 bg-[#dcb14d]/10 text-[#f6d37d]">{icon as React.ReactNode}</div><h3 className="text-xl font-black">{n}</h3><p className="mt-2 text-sm text-white/60">{d}</p><p className="mt-4 text-2xl font-black text-[#f6d37d]">{p}</p></Panel>)}</div></section>;
}

function BottomNav({ view, go }: { view: View; go: (v: View) => void }) {
  const items: Array<[View, string, React.ReactNode]> = [['home','Arena',<Eye/>],['dashboard','Intel',<BarChart3/>],['council','Council',<Crown/>],['boost','Vault',<Sparkles/>]];
  return <nav className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 gap-1 rounded-[1.4rem] border border-white/10 bg-[#100a1d]/90 p-2 shadow-[0_12px_35px_rgba(0,0,0,.7)] backdrop-blur-lg">{items.map(([key, label, icon]) => <button key={key} onClick={() => go(key)} className={cn('flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black uppercase', view === key ? 'bg-[#dcb14d] text-[#0b0718]' : 'text-white/45')}>{React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}{label}</button>)}</nav>;
}

function Badge({ children }: { children: React.ReactNode }) { return <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcb14d]/25 bg-[#dcb14d]/10 px-3.5 py-1.5"><Sparkles className="h-3.5 w-3.5 text-[#dcb14d]"/><span className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#f6d37d]">{children}</span></div>; }
function Title({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="mb-7 text-center"><p className="font-mono text-[10px] font-black uppercase tracking-[.35em] text-[#dcb14d]">{eyebrow}</p><h2 className="mx-auto mt-2 max-w-3xl text-4xl font-black tracking-[-.05em] text-white sm:text-5xl">{title}</h2></div>; }
function Panel({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn('rounded-[1.8rem] border border-white/10 bg-white/[.055] p-5 shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-xl', className)}>{children}</div>; }
function Phone({ children }: { children: React.ReactNode }) { return <div className="rounded-[2.3rem] border border-white/10 bg-white/[.04] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)]"><div className="rounded-[1.9rem] border border-white/10 bg-[#0b0718]/95 p-5">{children}</div></div>; }
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <Panel><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] text-[#dcb14d]">{icon}</div><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></Panel>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-2xl font-black text-[#f6d37d]">{value}</p><p className="font-mono text-[9px] uppercase tracking-wider text-white/35">{label}</p></div>; }
function Primary({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) { return <button onClick={onClick} className={cn('inline-flex items-center justify-center gap-2 rounded-2xl bg-[#dcb14d] px-5 py-3 text-xs font-black uppercase tracking-[.12em] text-[#090714] shadow-[0_18px_50px_rgba(220,177,77,.18)]', full && 'w-full')}>{children}</button>; }
function Secondary({ children, onClick, full }: { children: React.ReactNode; onClick?: () => void; full?: boolean }) { return <button onClick={onClick} className={cn('mt-3 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white/75', full && 'w-full')}>{children}</button>; }
function Label({ children }: { children: React.ReactNode }) { return <label className="mb-2 mt-4 block text-xs font-bold uppercase tracking-widest text-white/45 first:mt-0">{children}</label>; }
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) { return <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#dcb14d]/60"/>; }
function Area({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <textarea value={value} onChange={e => onChange(e.target.value)} className="mb-2 min-h-20 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-[#dcb14d]/60"/>; }
