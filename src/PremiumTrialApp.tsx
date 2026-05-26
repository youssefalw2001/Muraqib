import React, { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Crown, Diamond, Eye, Flame, Headphones, Lock, MessageCircle, Mic2, Play, Radar, RotateCcw, ShieldCheck, Sparkles, Star, Trophy, Users } from 'lucide-react';

type View = 'home' | 'create' | 'trial' | 'result' | 'dashboard' | 'council' | 'boost';
type Status = 'winner' | 'failed' | 'revived';
type Question = { id: number; text: string; options: string[]; correct: number; level: 'easy' | 'medium' | 'hard' };
type Trial = { creator: string; slug: string; reward: string; questions: Question[]; roasts: string[] };
type Attempt = { id: number; name: string; score: number; total: number; failAt: number | null; status: Status; city: string; time: string };

const starterQuestions: Question[] = [
  { id: 1, text: 'What is my go-to late-night food?', options: ['Al Baik spicy nuggets', 'Sushi', 'Burger', 'Shawarma'], correct: 0, level: 'easy' },
  { id: 2, text: 'Which app do I check first in the morning?', options: ['Snapchat', 'TikTok', 'Instagram', 'WhatsApp'], correct: 0, level: 'easy' },
  { id: 3, text: 'What is my dream weekend plan?', options: ['Road trip with close friends', 'Sleeping all day', 'Mall run', 'Gaming alone'], correct: 0, level: 'medium' },
  { id: 4, text: 'What kind of friend annoys me fastest?', options: ['Someone who disappears when needed', 'Someone who sends memes', 'Someone who talks too much', 'Someone too quiet'], correct: 0, level: 'medium' },
  { id: 5, text: 'What is one thing I secretly respect most?', options: ['Loyalty under pressure', 'Expensive clothes', 'Fast replies only', 'Being popular'], correct: 0, level: 'hard' },
  { id: 6, text: 'What makes someone Crown Council material?', options: ['They know the small details', 'They always agree with me', 'They never joke', 'They post daily'], correct: 0, level: 'hard' },
];

const starterTrial: Trial = {
  creator: 'Youssef',
  slug: 'youssef.trial',
  reward: 'Winner unlocks a private Crown Council shoutout + dinner promise.',
  questions: starterQuestions,
  roasts: [
    'Level one or two? Be serious. You entered the Trial with confidence and left with a roast card.',
    'You made it halfway, then folded. The Council will review this failure immediately.',
    'One step from glory and you missed. This is the most dramatic Trial collapse of the night.',
  ],
};

const seeded: Attempt[] = [
  { id: 1, name: 'faisal.kw', score: 6, total: 6, failAt: null, status: 'winner', city: 'Kuwait City', time: '5 min ago' },
  { id: 2, name: 'reem.dxb', score: 4, total: 6, failAt: 5, status: 'failed', city: 'Dubai', time: '19 min ago' },
  { id: 3, name: 'saud.riyadh', score: 2, total: 6, failAt: 3, status: 'revived', city: 'Riyadh', time: '42 min ago' },
];

const cities = ['Kuwait City', 'Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Doha', 'Manama', 'Muscat'];
const cls = (...v: Array<string | false | undefined>) => v.filter(Boolean).join(' ');
const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'trial';

export default function PremiumTrialApp() {
  const [view, setView] = useState<View>(window.location.pathname.startsWith('/trial/') || window.location.pathname.startsWith('/r/') ? 'trial' : 'home');
  const [trial, setTrial] = useState<Trial>(starterTrial);
  const [attempts, setAttempts] = useState<Attempt[]>(seeded);
  const [last, setLast] = useState<Attempt | null>(null);
  const [draft, setDraft] = useState<Trial>(starterTrial);
  const [name, setName] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [q, setQ] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [failAt, setFailAt] = useState<number | null>(null);
  const [revived, setRevived] = useState(false);
  const top = useMemo(() => [...attempts].sort((a, b) => b.score - a.score).slice(0, 3), [attempts]);

  const go = (v: View) => { setView(v); window.history.pushState({}, '', v === 'trial' ? `/trial/${trial.slug}` : '/'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const reset = () => { setStarted(false); setLocked(false); setQ(0); setPick(null); setScore(0); setFailAt(null); setRevived(false); };
  const speak = () => {
    const level = failAt ?? last?.failAt ?? 1;
    const line = level <= 2 ? trial.roasts[0] : level <= 4 ? trial.roasts[1] : trial.roasts[2];
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(line)); } catch {}
  };
  const publish = () => { setTrial({ ...draft, slug: slugify(draft.slug), questions: draft.questions.slice(0, 12) }); go('dashboard'); };
  const finish = (status: Status, finalScore: number, failed: number | null) => {
    const item: Attempt = { id: Date.now(), name: name || 'anonymous.friend', score: finalScore, total: trial.questions.length, failAt: failed, status, city, time: 'Just now' };
    setAttempts([item, ...attempts]); setLast(item); setLocked(true); go('result');
  };
  const answer = (i: number) => {
    if (pick !== null || locked) return;
    setPick(i);
    const ok = i === trial.questions[q].correct;
    setTimeout(() => {
      if (ok) { const next = score + 1; setScore(next); q + 1 >= trial.questions.length ? finish('winner', next, null) : (setQ(q + 1), setPick(null)); }
      else { const level = q + 1; !revived && level >= Math.max(3, trial.questions.length - 1) ? (setFailAt(level), setLocked(true)) : finish('failed', score, level); }
    }, 620);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0B0516] text-[#F8FAFC]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(245,158,11,0.18),transparent_28%),radial-gradient(circle_at_80%_12%,rgba(124,58,237,0.2),transparent_30%),linear-gradient(145deg,#070311_0%,#0B0516_42%,#130925_100%)]" />
      <TopBar go={go} />
      <main className="relative z-10 pb-32">
        {view === 'home' && <Home go={go} slug={trial.slug} />}
        {view === 'create' && <Create draft={draft} setDraft={setDraft} publish={publish} />}
        {view === 'trial' && <TrialPlay trial={trial} name={name} setName={setName} city={city} setCity={setCity} started={started} setStarted={setStarted} locked={locked} setLocked={setLocked} q={q} pick={pick} score={score} failAt={failAt} revived={revived} setRevived={setRevived} reset={reset} answer={answer} finish={finish} speak={speak} />}
        {view === 'result' && <Result attempt={last || seeded[0]} trial={trial} go={go} speak={speak} />}
        {view === 'dashboard' && <Dashboard trial={trial} attempts={attempts} go={go} />}
        {view === 'council' && <Council attempts={top} />}
        {view === 'boost' && <Boost />}
      </main>
      <nav className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 gap-1 rounded-[1.4rem] border border-purple-500/25 bg-[#160B29]/90 p-2 shadow-[0_12px_35px_rgba(0,0,0,0.7)] backdrop-blur-lg">
        {[['home','Arena',Eye],['dashboard','Intel',BarChart3],['council','Council',Crown],['boost','Vault',Sparkles]].map(([key, label, Icon]) => (
          <button key={String(key)} onClick={() => go(key as View)} className={cls('flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black uppercase', view === key ? 'bg-gradient-to-b from-amber-400 to-amber-700 text-zinc-950' : 'text-purple-300/80')}><Icon className="h-4 w-4" />{label as string}</button>
        ))}
      </nav>
    </div>
  );
}

function TopBar({ go }: { go: (v: View) => void }) {
  return <><div className="relative z-20 border-b border-purple-500/10 bg-[#110A1F]/80 px-4 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300"><span className="text-amber-400">Al-Muraqib Trials</span> • Loyalty Arena • GCC/MENA beta</div><header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between border-b border-purple-500/10 bg-[#0B0516]/85 px-5 py-5 backdrop-blur-xl"><button onClick={() => go('home')} className="flex items-center gap-3 text-left"><div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-amber-500/40 bg-purple-950/40 shadow-[0_0_18px_rgba(212,175,55,0.25)]"><Eye className="h-5 w-5 text-amber-300" /></div><div><p className="font-sans text-sm font-black uppercase tracking-tight text-slate-100 sm:text-lg">Al-Muraqib <span className="rounded-sm border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[9px] text-amber-400">TRIALS</span></p><p className="font-mono text-[10px] font-bold uppercase tracking-wide text-purple-300">The Observer • Loyalty Duel</p></div></button><button onClick={() => go('create')} className="rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-300">Create Trial</button></header></>;
}

function Home({ go, slug }: { go: (v: View) => void; slug: string }) {
  return <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-12 text-center"><div className="relative w-full max-w-4xl pb-12"><Badge text="Create your Trial • Crown the real ones" /><div className="relative mb-3 inline-block text-7xl">⚔️<span className="absolute -right-3 -top-3 animate-bounce text-3xl">👑</span></div><h1 className="bg-gradient-to-r from-amber-400 via-amber-200 to-purple-400 bg-clip-text font-sans text-5xl font-black uppercase leading-none tracking-tight text-transparent sm:text-7xl">Al-Muraqib Trials</h1><p className="mt-3 font-mono text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">Test friends • Roast fails • Crown winners</p><h2 className="mx-auto mt-6 max-w-2xl text-xl font-light italic leading-relaxed text-slate-200 sm:text-2xl">Think they really know you? Let them climb your loyalty ladder. Winners unlock your reward. Failed challengers get a premium Roast Verdict.</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-400">Built for Snapchat, TikTok, Instagram, WhatsApp groups, and GCC friend circles.</p><div className="mx-auto mt-8 flex max-w-md flex-col gap-3.5 sm:flex-row"><button onClick={() => go('create')} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 px-8 py-4 text-xs font-black uppercase text-zinc-950 shadow-xl">Build My Trial <ArrowRight className="h-4 w-4" /></button><button onClick={() => go('trial')} className="flex flex-1 items-center justify-center rounded-xl border border-purple-500/25 bg-purple-950/45 px-6 py-4 text-xs font-bold uppercase text-slate-200">Preview /trial/{slug}</button></div></div><Card className="w-full max-w-md"><div className="mb-4 flex justify-between"><span className="font-mono text-[9px] font-bold uppercase text-amber-400">Trial orbit active</span><span className="rounded border border-purple-400/25 bg-purple-400/10 px-2 py-0.5 font-mono text-[9px] text-purple-300">CROWN SIGNAL HIGH</span></div><RadarOrb /><div className="mt-6 grid grid-cols-2 gap-3 border-t border-purple-500/15 pt-5"><Info label="Trials cast" value="18,495" /><Info label="Verdicts shared" value="4,912" gold /></div></Card></section>;
}

function Create({ draft, setDraft, publish }: { draft: Trial; setDraft: React.Dispatch<React.SetStateAction<Trial>>; publish: () => void }) {
  const setQ = (id: number, patch: Partial<Question>) => setDraft(d => ({ ...d, questions: d.questions.map(q => q.id === id ? { ...q, ...patch } : q) }));
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><Title eyebrow="Creator Studio" title="Build a Loyalty Trial they will send to every group chat." /><div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><Card><Label>Creator name</Label><Input value={draft.creator} onChange={v => setDraft({ ...draft, creator: v })} /><Label>Trial slug</Label><Input value={draft.slug} onChange={v => setDraft({ ...draft, slug: slugify(v) })} /><Label>Winner reward</Label><Area value={draft.reward} onChange={v => setDraft({ ...draft, reward: v })} /><div className="mt-4 flex items-center gap-2"><Mic2 className="h-5 w-5 text-amber-300" /><h3 className="font-black">Voice verdict scripts</h3></div>{draft.roasts.map((r, i) => <Area key={i} value={r} onChange={v => setDraft(d => ({ ...d, roasts: d.roasts.map((x, n) => n === i ? v : x) }))} />)}</Card><Card><div className="mb-4 flex justify-between"><div><p className="font-mono text-[10px] uppercase text-amber-400">Question ladder</p><h3 className="text-2xl font-black">{draft.questions.length} levels</h3></div><button onClick={() => setDraft(d => ({ ...d, questions: [...d.questions, { id: Date.now(), text: 'New loyalty question?', options: ['Correct', 'Trap', 'Funny', 'Random'], correct: 0, level: 'medium' }] }))} className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 text-xs font-black uppercase text-amber-100">Add</button></div>{draft.questions.map((q, idx) => <div key={q.id} className="mb-4 rounded-2xl border border-purple-500/15 bg-black/25 p-4"><div className="mb-2 flex justify-between"><span className="font-mono text-[10px] uppercase text-amber-100">Level {idx + 1}</span><select value={q.level} onChange={e => setQ(q.id, { level: e.target.value as Question['level'] })} className="rounded-lg bg-[#130925] px-2 text-xs"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div><Input value={q.text} onChange={v => setQ(q.id, { text: v })} />{q.options.map((o, oi) => <div key={oi} className="mt-2 flex gap-2"><button onClick={() => setQ(q.id, { correct: oi })} className={cls('w-10 rounded-xl border text-xs font-black', q.correct === oi ? 'border-emerald-300/50 bg-emerald-300/20' : 'border-purple-500/15')}>{String.fromCharCode(65 + oi)}</button><Input value={o} onChange={v => setQ(q.id, { options: q.options.map((x, n) => n === oi ? v : x) })} /></div>)}</div>)}<button onClick={publish} className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 px-6 py-4 font-black text-zinc-950">Publish Al-Muraqib Trial</button></Card></div></section>;
}

function TrialPlay(p: any) {
  const current = p.trial.questions[p.q];
  if (!p.started) return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-amber-400/40 bg-amber-400/10 text-4xl">⚔️</div><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-400">/trial/{p.trial.slug}</p><h2 className="mt-3 font-display text-4xl font-black italic">{p.trial.creator}'s Loyalty Trial</h2><p className="mt-4 rounded-3xl border border-purple-500/15 bg-white/[0.05] p-4 text-sm text-slate-300">Answer every level. Win the reward. Fail once and unlock a custom Roast Verdict.</p><div className="mt-6 space-y-3 text-left"><Input value={p.name} onChange={p.setName} placeholder="Your name / handle" /><select className="w-full rounded-xl border border-purple-500/20 bg-[#130925] px-4 py-3" value={p.city} onChange={e => p.setCity(e.target.value)}>{cities.map(c => <option key={c}>{c}</option>)}</select><button onClick={() => { p.reset(); p.setStarted(true); }} className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 py-4 font-black text-zinc-950">Start Trial</button></div></div></Phone></section>;
  if (p.locked && p.failAt) return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="text-center"><Flame className="mx-auto h-12 w-12 text-rose-300" /><h2 className="mt-4 font-display text-4xl font-black italic">Trial locked.</h2><p className="mt-3 text-sm text-slate-300">You missed Level {p.failAt}. Use one Extra Life or accept the Roast Verdict.</p><button onClick={p.speak} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 font-black"><Play className="h-4 w-4" /> Play Roast</button>{!p.revived && <button onClick={() => { p.setRevived(true); p.setLocked(false); }} className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 py-4 font-black text-zinc-950">Extra Life • $0.99 demo</button>}<button onClick={() => p.finish('failed', p.score, p.failAt)} className="mt-3 w-full rounded-xl border border-purple-500/20 bg-white/[0.06] py-4 font-bold">Accept Verdict</button></div></Phone></section>;
  return <section className="mx-auto max-w-md px-5 pt-8"><Phone><div className="mb-5 flex justify-between"><span className="font-mono text-[10px] uppercase text-amber-400">Level {p.q + 1} / {p.trial.questions.length}</span><span className="rounded-full bg-purple-950/50 px-3 py-1 font-mono text-[10px]">Score {p.score}</span></div><div className="mb-5 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-amber-400" style={{ width: `${((p.q + 1) / p.trial.questions.length) * 100}%` }} /></div><p className="mb-2 font-mono text-[10px] uppercase text-purple-300">{current.level} difficulty</p><h2 className="font-display text-3xl font-black italic leading-tight">{current.text}</h2><div className="mt-6 space-y-3">{current.options.map((o: string, i: number) => <button key={o} onClick={() => p.answer(i)} className={cls('w-full rounded-2xl border px-4 py-4 text-left text-sm font-bold', p.pick === i && i === current.correct && 'border-emerald-300/50 bg-emerald-300/15', p.pick === i && i !== current.correct && 'border-rose-300/50 bg-rose-300/15', p.pick !== i && 'border-purple-500/15 bg-white/[0.05]')}><span className="mr-2 font-mono text-slate-500">{String.fromCharCode(65 + i)}.</span>{o}</button>)}</div></Phone></section>;
}

function Result({ attempt, trial, go, speak }: { attempt: Attempt; trial: Trial; go: (v: View) => void; speak: () => void }) {
  const win = attempt.status === 'winner';
  const text = win ? `I survived ${trial.creator}'s Al-Muraqib Trial with ${attempt.score}/${attempt.total}.` : `I failed ${trial.creator}'s Al-Muraqib Trial at Level ${attempt.failAt}.`;
  return <section className="mx-auto max-w-md px-5 pt-10 text-center"><Card><div className={cls('mx-auto grid h-16 w-16 place-items-center rounded-3xl', win ? 'bg-emerald-400 text-zinc-950' : 'bg-rose-500')}><Trophy className="h-8 w-8" /></div><h2 className="mt-5 font-display text-4xl font-black italic">{win ? 'Crown Council material.' : 'You entered the Roast Court.'}</h2><p className="mt-4 text-slate-300">{attempt.name} scored {attempt.score}/{attempt.total}.</p><div className="my-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-slate-200">{text}</div>{!win && <button onClick={speak} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/10 py-3"><Headphones className="h-4 w-4" /> Replay voice roast</button>}<button onClick={() => navigator.clipboard?.writeText(text)} className="w-full rounded-xl bg-white py-4 font-black text-zinc-950">Copy story text</button><button onClick={() => go('create')} className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 py-4 font-black text-zinc-950">Create your Trial</button></Card></section>;
}

function Dashboard({ trial, attempts, go }: { trial: Trial; attempts: Attempt[]; go: (v: View) => void }) {
  const wins = attempts.filter(a => a.status === 'winner').length;
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score / a.total, 0) / attempts.length * 100) : 0;
  return <section className="mx-auto max-w-6xl px-5 pt-8"><Title eyebrow="Intelligence Dashboard" title="Track who survives, folds, revives, and shares." /><div className="grid gap-4 sm:grid-cols-4"><Stat icon={<Users />} label="Attempts" value={String(attempts.length)} /><Stat icon={<Crown />} label="Winners" value={String(wins)} /><Stat icon={<Flame />} label="Verdicts" value={String(attempts.length - wins)} /><Stat icon={<Star />} label="Avg Score" value={`${avg}%`} /></div><Card className="mt-5"><div className="mb-4 flex justify-between gap-3"><div><p className="font-mono text-[10px] uppercase text-amber-400">Active Trial</p><h3 className="text-xl font-black">/trial/{trial.slug}</h3><p className="text-sm text-slate-400">{trial.reward}</p></div><button onClick={() => go('council')} className="h-fit rounded-xl bg-amber-400 px-4 py-3 text-xs font-black uppercase text-zinc-950">Top 3</button></div>{attempts.map(a => <div key={a.id} className="mb-3 rounded-2xl border border-purple-500/15 bg-black/25 p-4"><div className="flex justify-between"><div><p className="font-black">{a.status === 'winner' ? '👑' : '🔥'} {a.name}</p><p className="text-sm text-slate-300">{a.status === 'winner' ? 'Survived the full Trial.' : `Failed on level ${a.failAt}.`}</p><p className="mt-2 font-mono text-[10px] uppercase text-slate-500">{a.city} • {a.time}</p></div><p className="text-2xl font-black text-amber-200">{a.score}/{a.total}</p></div></div>)}</Card></section>;
}

function Council({ attempts }: { attempts: Attempt[] }) {
  const titles = ['Crown King', 'Diamond Prince', 'Golden Guard'];
  return <section className="mx-auto max-w-5xl px-5 pt-8"><Title eyebrow="Crown Council" title="The Top 3 loyalty scores become the Council." /><div className="grid gap-5 md:grid-cols-3">{attempts.map((a, i) => <Card key={a.id} className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-400 text-zinc-950">{i === 1 ? <Diamond /> : <Crown />}</div><p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100">#{i + 1} {titles[i]}</p><h3 className="mt-2 text-2xl font-black">{a.name}</h3><p className="mt-2 text-sm text-slate-300">{a.city} • {a.score}/{a.total}</p><p className="mt-5 text-5xl font-black text-amber-200">{Math.round(a.score / a.total * 100)}</p></Card>)}</div></section>;
}

function Boost() {
  const items = [['Extra Life', 'Revive before losing the final levels.', '$0.99', <RotateCcw />], ['Premium Roast Pack', 'Sharper verdict copy and voice scripts.', '$1.99', <MessageCircle />], ['Royal Trial Skin', 'Cyber-gold story card effects.', '$2.99', <Sparkles />], ['Reward Gate', 'Let winners unlock a private reward.', '$4.99', <Lock />]];
  return <section className="mx-auto max-w-5xl px-5 pt-8"><Title eyebrow="Boost & Access" title="Monetize the exact moment they care." /><div className="grid gap-4 md:grid-cols-2">{items.map(([n, d, p, icon]) => <Card key={String(n)}><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-100">{icon as React.ReactNode}</div><h3 className="text-xl font-black">{n}</h3><p className="mt-2 text-sm text-slate-300">{d}</p><p className="mt-4 text-2xl font-black text-amber-200">{p}</p></Card>)}</div></section>;
}

function RadarOrb() { return <div className="relative mx-auto flex aspect-square w-full max-w-[300px] items-center justify-center"><div className="absolute inset-0 rounded-full border border-purple-500/10" /><div className="absolute h-[72%] w-[72%] rounded-full border border-amber-500/20" /><div className="absolute h-[45%] w-[45%] rounded-full border border-purple-500/30" /><div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left animate-spin-slow border-l border-amber-400/40 bg-[linear-gradient(45deg,rgba(234,179,8,0.15)_0%,rgba(124,58,237,0)_60%)]" /><Radar className="h-10 w-10 text-amber-400" /></div>; }
function Badge({ text }: { text: string }) { return <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-amber-300/10 to-transparent px-3.5 py-1.5"><Sparkles className="h-3.5 w-3.5 animate-spin-slow text-amber-400" /><span className="font-mono text-[10px] font-black uppercase tracking-wider text-amber-300">{text}</span></div>; }
function Title({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="mb-6 text-center"><p className="font-mono text-[10px] font-black uppercase tracking-[0.35em] text-amber-400">{eyebrow}</p><h2 className="mx-auto mt-2 max-w-3xl font-display text-4xl font-black italic tracking-tight text-white sm:text-5xl">{title}</h2></div>; }
function Card({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cls('rounded-3xl border border-purple-500/20 bg-[#1C1032]/95 p-5 shadow-xl backdrop-blur', className)}>{children}</div>; }
function Phone({ children }: { children: React.ReactNode }) { return <div className="rounded-[2.4rem] border border-purple-500/20 bg-white/[0.04] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)]"><div className="rounded-[2rem] border border-purple-500/15 bg-[#120822]/95 p-5">{children}</div></div>; }
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <Card><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-950/50 text-amber-300">{icon}</div><p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></Card>; }
function Info({ label, value, gold }: { label: string; value: string; gold?: boolean }) { return <div className="rounded-xl border border-purple-500/10 bg-purple-950/20 p-3 text-left"><span className="block font-mono text-[9.5px] uppercase text-slate-400">{label}</span><span className={cls('mt-1 block font-mono text-xl font-black', gold ? 'text-amber-400' : 'text-slate-100')}>{value}</span><span className="mt-0.5 block text-[8.5px] font-bold text-emerald-400">GCC active</span></div>; }
function Label({ children }: { children: React.ReactNode }) { return <label className="mb-2 mt-4 block text-xs font-bold uppercase tracking-widest text-purple-300 first:mt-0">{children}</label>; }
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) { return <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full rounded-xl border border-purple-500/20 bg-[#130925] px-4 py-3 text-slate-100 outline-none placeholder:text-purple-200/30 focus:border-amber-400" />; }
function Area({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <textarea value={value} onChange={e => onChange(e.target.value)} className="mb-2 min-h-20 w-full rounded-xl border border-purple-500/20 bg-[#130925] px-4 py-3 text-slate-100 outline-none focus:border-amber-400" />; }
