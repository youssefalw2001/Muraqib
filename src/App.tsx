import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Crown,
  Diamond,
  Eye,
  EyeOff,
  Gem,
  Heart,
  Lock,
  MessageCircle,
  Radar,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

type View = 'home' | 'create' | 'radar' | 'verdict' | 'dashboard' | 'council' | 'boost';
type RadarMode = 'General Radar' | 'Crush Radar' | 'Unfinished Radar' | 'Signal Check';

type Observer = {
  id: number;
  name: string;
  masked: boolean;
  answer: string;
  score: number;
  repeats: number;
  city: string;
  lastSeen: string;
  boost: string;
};

const radarModes: Array<{ mode: RadarMode; question: string; icon: React.ReactNode; tone: string }> = [
  {
    mode: 'General Radar',
    question: 'Who is watching my story?',
    icon: <Radar className="h-5 w-5" />,
    tone: 'General curiosity and story attention.',
  },
  {
    mode: 'Crush Radar',
    question: 'Do I cross your mind?',
    icon: <Heart className="h-5 w-5" />,
    tone: 'Romantic signals without pressure.',
  },
  {
    mode: 'Unfinished Radar',
    question: 'Would you reply if I texted?',
    icon: <MessageCircle className="h-5 w-5" />,
    tone: 'For silent history and unfinished conversations.',
  },
  {
    mode: 'Signal Check',
    question: 'What is my vibe to you?',
    icon: <Zap className="h-5 w-5" />,
    tone: 'Fast read on your social aura.',
  },
];

const starterObservers: Observer[] = [
  {
    id: 1,
    name: 'Masked Observer 07',
    masked: true,
    answer: 'I check your stories first.',
    score: 96,
    repeats: 18,
    city: 'Kuwait City',
    lastSeen: '4 min ago',
    boost: 'Crown Boost',
  },
  {
    id: 2,
    name: 's.alnasser',
    masked: false,
    answer: 'Every time certain songs play.',
    score: 89,
    repeats: 12,
    city: 'Riyadh',
    lastSeen: '22 min ago',
    boost: 'Diamond Boost',
  },
  {
    id: 3,
    name: 'Masked Observer 19',
    masked: true,
    answer: 'Yes, but I would need a sign.',
    score: 82,
    repeats: 9,
    city: 'Dubai',
    lastSeen: '1 hr ago',
    boost: 'Golden Boost',
  },
  {
    id: 4,
    name: 'mariam.dxb',
    masked: false,
    answer: 'Mysterious, calm, expensive energy.',
    score: 74,
    repeats: 5,
    city: 'Abu Dhabi',
    lastSeen: '3 hrs ago',
    boost: 'None',
  },
];

const councilTitles = ['Crown King', 'Diamond Prince', 'Golden Guard'];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const initialRoute = window.location.pathname.startsWith('/r/') ? 'radar' : 'home';
  const [view, setView] = useState<View>(initialRoute);
  const [mode, setMode] = useState<RadarMode>('Crush Radar');
  const [question, setQuestion] = useState('Do I cross your mind?');
  const [handle, setHandle] = useState('your.name');
  const [observerName, setObserverName] = useState('');
  const [observerMasked, setObserverMasked] = useState(true);
  const [observerAnswer, setObserverAnswer] = useState('I check your stories first.');
  const [observers, setObservers] = useState<Observer[]>(starterObservers);

  const slug = useMemo(() => handle.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '') || 'radar', [handle]);
  const topThree = [...observers].sort((a, b) => b.score - a.score).slice(0, 3);

  const go = (next: View) => {
    setView(next);
    const path = next === 'radar' ? `/r/${slug}` : '/';
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitObserver = () => {
    const newObserver: Observer = {
      id: Date.now(),
      name: observerMasked ? `Masked Observer ${Math.floor(Math.random() * 90 + 10)}` : observerName || 'Public Observer',
      masked: observerMasked,
      answer: observerAnswer,
      score: Math.floor(Math.random() * 18) + 78,
      repeats: Math.floor(Math.random() * 6) + 1,
      city: ['Kuwait City', 'Riyadh', 'Dubai', 'Jeddah'][Math.floor(Math.random() * 4)],
      lastSeen: 'Just now',
      boost: 'None',
    };
    setObservers((current) => [newObserver, ...current]);
    go('verdict');
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b18] text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(21,184,255,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(244,196,48,0.16),transparent_30%),linear-gradient(145deg,#050b18_0%,#081a33_48%,#02040b_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:36px_36px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <button onClick={() => go('home')} className="group flex items-center gap-3 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-amber-300/35 bg-amber-300/10 shadow-[0_0_35px_rgba(244,196,48,.18)]">
            <Eye className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-white">Al-Muraqib</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">The Observer</p>
          </div>
        </button>
        <button onClick={() => go('create')} className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-100 backdrop-blur hover:bg-amber-300/20">
          Create Radar
        </button>
      </header>

      <main className="relative z-10 pb-28">
        {view === 'home' && <Home go={go} slug={slug} />}
        {view === 'create' && (
          <CreateRadar
            go={go}
            mode={mode}
            setMode={setMode}
            question={question}
            setQuestion={setQuestion}
            handle={handle}
            setHandle={setHandle}
          />
        )}
        {view === 'radar' && (
          <PublicRadar
            mode={mode}
            question={question}
            handle={handle}
            observerName={observerName}
            setObserverName={setObserverName}
            observerMasked={observerMasked}
            setObserverMasked={setObserverMasked}
            observerAnswer={observerAnswer}
            setObserverAnswer={setObserverAnswer}
            submitObserver={submitObserver}
          />
        )}
        {view === 'verdict' && <ViralVerdict go={go} />}
        {view === 'dashboard' && <Dashboard go={go} observers={observers} question={question} />}
        {view === 'council' && <CrownCouncil go={go} observers={topThree} />}
        {view === 'boost' && <BoostAccess />}
      </main>

      <nav className="fixed bottom-4 left-1/2 z-30 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 grid-cols-4 rounded-[1.7rem] border border-white/10 bg-[#081426]/85 p-2 shadow-[0_24px_80px_rgba(0,0,0,.55)] backdrop-blur-xl">
        {[
          ['home', 'Home', Radar],
          ['dashboard', 'Intel', BarChart3],
          ['council', 'Council', Crown],
          ['boost', 'Boost', Gem],
        ].map(([key, label, Icon]) => (
          <button key={String(key)} onClick={() => go(key as View)} className={cx('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold uppercase tracking-wider transition', view === key ? 'bg-amber-300 text-slate-950' : 'text-slate-300 hover:bg-white/10')}>
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function Home({ go, slug }: { go: (view: View) => void; slug: string }) {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-8 md:grid-cols-[1.08fr_.92fr] md:items-center md:pt-16">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-100">
          <ShieldCheck className="h-3.5 w-3.5" /> GCC / MENA Social Intelligence
        </div>
        <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl">
          Create your <span className="bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">Social Radar.</span>
          <br />Find your <span className="text-amber-200">Crown Council.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
          Post one premium radar link on Snapchat, Instagram, TikTok, or WhatsApp. Collect observer signals, answers, repeat signals, and interest scores — then see who rises into your Top 3.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => go('create')} className="group rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-6 py-4 font-black text-slate-950 shadow-[0_18px_55px_rgba(244,196,48,.25)]">
            Build My Radar <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
          </button>
          <button onClick={() => go('radar')} className="rounded-2xl border border-white/15 bg-white/8 px-6 py-4 font-bold text-white backdrop-blur hover:bg-white/12">
            Preview /r/{slug}
          </button>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          {['Observer Signals', 'Masked Mode', 'Consent Reveal'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[.06] p-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </div>
      <PhoneShell>
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[2rem] border border-cyan-200/10 bg-[#061426]">
          <div className="absolute h-[78%] w-[78%] rounded-full border border-cyan-200/20" />
          <div className="absolute h-[55%] w-[55%] rounded-full border border-amber-200/20" />
          <div className="absolute h-[32%] w-[32%] rounded-full border border-cyan-200/20" />
          <div className="absolute h-[2px] w-[48%] origin-left animate-[spin_4s_linear_infinite] bg-gradient-to-r from-cyan-300 to-transparent" />
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className="absolute h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(244,196,48,.9)]" style={{ transform: `rotate(${dot * 62}deg) translateX(${70 + dot * 12}px)` }} />
          ))}
          <div className="relative rounded-3xl border border-amber-200/30 bg-black/30 px-6 py-5 text-center backdrop-blur">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-100">Live Radar</p>
            <p className="mt-1 text-3xl font-black text-white">12</p>
            <p className="text-xs text-slate-300">observers could be waiting</p>
          </div>
        </div>
      </PhoneShell>
    </section>
  );
}

function CreateRadar({ go, mode, setMode, question, setQuestion, handle, setHandle }: { go: (view: View) => void; mode: RadarMode; setMode: (m: RadarMode) => void; question: string; setQuestion: (q: string) => void; handle: string; setHandle: (h: string) => void }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-8">
      <PageLabel label="Create Radar" title="Choose the question they cannot ignore." />
      <div className="grid gap-5 md:grid-cols-2">
        {radarModes.map((item) => (
          <button key={item.mode} onClick={() => { setMode(item.mode); setQuestion(item.question); }} className={cx('rounded-3xl border p-5 text-left transition', mode === item.mode ? 'border-amber-200/60 bg-amber-200/10 shadow-[0_0_40px_rgba(244,196,48,.12)]' : 'border-white/10 bg-white/[.05] hover:bg-white/[.08]')}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100">{item.icon}</div>
            <h3 className="text-xl font-black text-white">{item.mode}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.tone}</p>
            <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm font-semibold text-amber-100">“{item.question}”</p>
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.06] p-5 backdrop-blur">
        <label className="text-xs font-bold uppercase tracking-widest text-cyan-100">Your handle / slug</label>
        <input value={handle} onChange={(e) => setHandle(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-amber-200/50" />
        <label className="mt-5 block text-xs font-bold uppercase tracking-widest text-cyan-100">Radar question</label>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none focus:border-amber-200/50" />
        <button onClick={() => go('radar')} className="mt-5 w-full rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-5 py-4 font-black text-slate-950">Activate Social Radar</button>
      </div>
    </section>
  );
}

function PublicRadar(props: { mode: RadarMode; question: string; handle: string; observerName: string; setObserverName: (v: string) => void; observerMasked: boolean; setObserverMasked: (v: boolean) => void; observerAnswer: string; setObserverAnswer: (v: string) => void; submitObserver: () => void }) {
  return (
    <section className="mx-auto w-full max-w-md px-5 pt-8">
      <PhoneShell>
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-amber-200/40 bg-amber-200/10"><Eye className="h-7 w-7 text-amber-200" /></div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-cyan-100">You entered @{props.handle}</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">{props.mode}</h2>
          <p className="mt-3 rounded-3xl border border-white/10 bg-white/[.06] p-5 text-xl font-bold leading-snug text-amber-100">{props.question}</p>
        </div>
        <div className="mt-6 space-y-4">
          <input value={props.observerName} onChange={(e) => props.setObserverName(e.target.value)} placeholder="Public name or handle" className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-slate-500" />
          <button onClick={() => props.setObserverMasked(!props.observerMasked)} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[.05] px-4 py-3 text-sm font-bold text-slate-200">
            <span className="flex items-center gap-2">{props.observerMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {props.observerMasked ? 'Enter as Masked Observer' : 'Enter publicly'}</span>
            <span className="text-amber-200">24h discreet</span>
          </button>
          {['I check your stories first.', 'You cross my mind.', 'I would reply.', 'Mysterious, premium vibe.'].map((answer) => (
            <button key={answer} onClick={() => props.setObserverAnswer(answer)} className={cx('w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold', props.observerAnswer === answer ? 'border-amber-200/60 bg-amber-200/10 text-amber-100' : 'border-white/10 bg-white/[.04] text-slate-300')}>
              {answer}
            </button>
          ))}
          <button onClick={props.submitObserver} className="w-full rounded-2xl bg-gradient-to-r from-cyan-200 to-amber-200 px-5 py-4 font-black text-slate-950">Log My Observer Score</button>
        </div>
      </PhoneShell>
    </section>
  );
}

function ViralVerdict({ go }: { go: (view: View) => void }) {
  return (
    <section className="mx-auto w-full max-w-md px-5 pt-10 text-center">
      <div className="rounded-[2rem] border border-amber-200/30 bg-gradient-to-b from-white/[.1] to-white/[.04] p-7 shadow-[0_24px_90px_rgba(0,0,0,.45)] backdrop-blur">
        <Sparkles className="mx-auto h-10 w-10 text-amber-200" />
        <h2 className="mt-5 text-4xl font-black tracking-tight text-white">You entered their Radar.</h2>
        <p className="mt-4 text-lg font-semibold text-slate-300">Your Observer Score has been logged.</p>
        <div className="my-6 rounded-3xl border border-cyan-200/20 bg-cyan-200/10 p-5">
          <p className="text-5xl font-black text-amber-200">12</p>
          <p className="mt-1 text-sm font-bold uppercase tracking-widest text-cyan-100">observers could be waiting on yours</p>
        </div>
        <button onClick={() => go('create')} className="w-full rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 px-5 py-4 font-black text-slate-950">Create your Social Radar now</button>
      </div>
    </section>
  );
}

function Dashboard({ go, observers, question }: { go: (view: View) => void; observers: Observer[]; question: string }) {
  const avg = Math.round(observers.reduce((sum, item) => sum + item.score, 0) / observers.length);
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-8">
      <PageLabel label="Intelligence Dashboard" title="Observer signals, repeat interest, and answers." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={<Eye />} label="Observer Log" value={String(observers.length)} />
        <Metric icon={<Repeat2 />} label="Repeat Signal" value={`${observers.reduce((s, o) => s + o.repeats, 0)}x`} />
        <Metric icon={<Star />} label="Interest Score" value={`${avg}%`} />
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[.05] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan-100">Radar Question</p><h3 className="text-xl font-black text-white">{question}</h3></div>
          <button onClick={() => go('council')} className="rounded-2xl bg-amber-200 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-950">Top 3</button>
        </div>
        <div className="space-y-3">
          {observers.map((observer) => <ObserverRow key={observer.id} observer={observer} />)}
        </div>
      </div>
    </section>
  );
}

function CrownCouncil({ go, observers }: { go: (view: View) => void; observers: Observer[] }) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-8">
      <PageLabel label="Crown Council" title="Your Top 3 observers become the council." />
      <div className="grid gap-5 md:grid-cols-3">
        {observers.map((observer, index) => (
          <div key={observer.id} className="rounded-[2rem] border border-amber-200/30 bg-gradient-to-b from-amber-200/12 to-white/[.04] p-6 text-center shadow-[0_0_55px_rgba(244,196,48,.1)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-200 text-slate-950"><Crown className="h-8 w-8" /></div>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-amber-100">#{index + 1} {councilTitles[index]}</p>
            <h3 className="mt-2 text-2xl font-black text-white">{observer.name}</h3>
            <p className="mt-2 text-sm text-slate-300">{observer.city} • {observer.repeats} repeat signals</p>
            <p className="mt-5 text-5xl font-black text-amber-200">{observer.score}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-100">Interest Score</p>
          </div>
        ))}
      </div>
      <button onClick={() => go('dashboard')} className="mt-6 rounded-2xl border border-white/10 bg-white/[.06] px-5 py-3 font-bold text-white">Back to dashboard</button>
    </section>
  );
}

function BoostAccess() {
  const boosts = [
    ['Golden Boost', 'Small rank boost for observers who want to be noticed.', '$1.99', <Sparkles className="h-5 w-5" />],
    ['Diamond Boost', 'Stronger rank lift with premium council styling.', '$4.99', <Diamond className="h-5 w-5" />],
    ['Crown Boost', 'Challenge the Top 3 and push toward Crown Council.', '$9.99', <Crown className="h-5 w-5" />],
    ['Masked Mode', 'Stay discreet for 24h while your signal is logged.', '$2.99', <EyeOff className="h-5 w-5" />],
    ['Royal Reveal Request', 'Ask an observer to reveal only if they consent.', '$6.99', <Lock className="h-5 w-5" />],
  ];
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-8">
      <PageLabel label="Boost & Access" title="Paid social actions first. Creator payouts later." />
      <div className="grid gap-4 md:grid-cols-2">
        {boosts.map(([name, desc, price, icon]) => (
          <div key={String(name)} className="rounded-3xl border border-white/10 bg-white/[.05] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-200/10 text-amber-100">{icon}</div>
            <h3 className="text-xl font-black text-white">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
            <p className="mt-4 text-2xl font-black text-amber-200">{price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PageLabel({ label, title }: { label: string; title: string }) {
  return <div className="mb-6"><p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-cyan-100">{label}</p><h2 className="mt-2 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h2></div>;
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[2.4rem] border border-white/12 bg-white/[.06] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)] backdrop-blur"><div className="rounded-[2rem] border border-white/10 bg-[#07101f]/92 p-5">{children}</div></div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-3xl border border-white/10 bg-white/[.05] p-5"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-200/10 text-cyan-100">{icon}</div><p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></div>;
}

function ObserverRow({ observer }: { observer: Observer }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-black text-white">{observer.masked ? <EyeOff className="h-4 w-4 text-cyan-100" /> : <Eye className="h-4 w-4 text-amber-100" />} {observer.name}</p>
          <p className="mt-1 text-sm text-slate-300">“{observer.answer}”</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">{observer.city} • {observer.lastSeen} • {observer.repeats} repeat signals</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-amber-200">{observer.score}</p>
          <p className="font-mono text-[9px] uppercase text-cyan-100">score</p>
        </div>
      </div>
    </div>
  );
}
