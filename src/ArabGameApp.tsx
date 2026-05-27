import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Crown,
  Diamond,
  Eye,
  Flame,
  Gem,
  Heart,
  Lock,
  MessageCircle,
  Play,
  Plus,
  Radar,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

type View = 'home' | 'create' | 'trial' | 'result' | 'dashboard' | 'council' | 'boost';
type Status = 'winner' | 'failed' | 'revived';
type Level = 'easy' | 'medium' | 'hard';
type Question = { id: number; text: string; options: string[]; correct: number; level: Level };
type Trial = { creator: string; slug: string; reward: string; questions: Question[]; roasts: string[] };
type Attempt = { id: number; name: string; score: number; total: number; failAt: number | null; status: Status; city: string; time: string };

const questionsSeed: Question[] = [
  { id: 1, text: 'وش طلبي المعتاد آخر الليل؟', options: ['مسحب حراق من البيك', 'سوشي', 'برجر', 'شاورما'], correct: 0, level: 'easy' },
  { id: 2, text: 'أي تطبيق أفتحه أول ما أصحى؟', options: ['سناب شات', 'تيك توك', 'إنستغرام', 'واتساب'], correct: 0, level: 'easy' },
  { id: 3, text: 'وش جو الويكند المثالي عندي؟', options: ['طلعة خط مع الربع', 'نوم كامل اليوم', 'مول وقهوة', 'قيمينق لحالي'], correct: 0, level: 'medium' },
  { id: 4, text: 'أي نوع صديق يستفزني بسرعة؟', options: ['يختفي وقت الحاجة', 'يرسل ميمز كثير', 'صوته عالي', 'ساكت طول الوقت'], correct: 0, level: 'medium' },
  { id: 5, text: 'وش أكثر شي أحترمه بالسر؟', options: ['الوفاء وقت الضغط', 'اللبس الغالي', 'الرد السريع', 'الشهرة'], correct: 0, level: 'hard' },
  { id: 6, text: 'مين يستحق يدخل مجلس التاج؟', options: ['يعرف التفاصيل الصغيرة', 'يوافقني دائمًا', 'ما يمزح أبد', 'ينزل ستوري كل يوم'], correct: 0, level: 'hard' },
];

const trialSeed: Trial = {
  creator: 'يوسف',
  slug: 'yousef.trial',
  reward: 'الفائز يدخل مجلس التاج + عزيمة خاصة من صاحب التحدي.',
  questions: questionsSeed,
  roasts: [
    'وقفت من أول البوابة؟ المجلس سجلها عليك. تحتاج مراجعة علاقة كاملة.',
    'وصلت النص وانهرت. مو سيئ، لكن التفاصيل الصغيرة كشفت كل شيء.',
    'كنت قريب من التاج، بس آخر تفصيلة أسقطتك. خسارة فاخرة جدًا.',
  ],
};

const attemptsSeed: Attempt[] = [
  { id: 1, name: 'faisal.kw', score: 6, total: 6, failAt: null, status: 'winner', city: 'الكويت', time: 'قبل ٥ دقائق' },
  { id: 2, name: 'reem.dxb', score: 4, total: 6, failAt: 5, status: 'failed', city: 'دبي', time: 'قبل ١٩ دقيقة' },
  { id: 3, name: 'saud.riyadh', score: 2, total: 6, failAt: 3, status: 'revived', city: 'الرياض', time: 'قبل ٤٢ دقيقة' },
];

const cities = ['الكويت', 'الرياض', 'جدة', 'دبي', 'أبوظبي', 'الدوحة', 'المنامة', 'مسقط'];
const navItems: Array<{ key: View; label: string; icon: React.ReactNode }> = [
  { key: 'home', label: 'اللعبة', icon: <Play /> },
  { key: 'dashboard', label: 'النتائج', icon: <BarChart3 /> },
  { key: 'council', label: 'المجلس', icon: <Crown /> },
  { key: 'boost', label: 'المتجر', icon: <Gem /> },
];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'trial';
}

export default function ArabGameApp() {
  const [view, setView] = useState<View>(window.location.pathname.startsWith('/trial/') || window.location.pathname.startsWith('/r/') ? 'trial' : 'home');
  const [trial, setTrial] = useState<Trial>(trialSeed);
  const [draft, setDraft] = useState<Trial>(trialSeed);
  const [attempts, setAttempts] = useState<Attempt[]>(attemptsSeed);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);
  const [player, setPlayer] = useState('');
  const [city, setCity] = useState(cities[0]);
  const [started, setStarted] = useState(false);
  const [locked, setLocked] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [failedAt, setFailedAt] = useState<number | null>(null);
  const [revived, setRevived] = useState(false);

  const leaders = useMemo(() => [...attempts].sort((a, b) => b.score - a.score).slice(0, 3), [attempts]);

  const go = (next: View) => {
    setView(next);
    window.history.pushState({}, '', next === 'trial' ? `/trial/${trial.slug}` : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetRun = () => {
    setStarted(false);
    setLocked(false);
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setFailedAt(null);
    setRevived(false);
  };

  const publish = () => {
    setTrial({ ...draft, slug: slugify(draft.slug), questions: draft.questions.slice(0, 12) });
    go('dashboard');
  };

  const speakVerdict = () => {
    const level = failedAt ?? lastAttempt?.failAt ?? 1;
    const line = level <= 2 ? trial.roasts[0] : level <= 4 ? trial.roasts[1] : trial.roasts[2];
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(line);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

  const finish = (status: Status, finalScore: number, fail: number | null) => {
    const entry: Attempt = {
      id: Date.now(),
      name: player.trim() || 'لاعب مجهول',
      score: finalScore,
      total: trial.questions.length,
      failAt: fail,
      status,
      city,
      time: 'الآن',
    };
    setAttempts((items) => [entry, ...items]);
    setLastAttempt(entry);
    setLocked(true);
    go('result');
  };

  const choose = (index: number) => {
    if (selected !== null || locked) return;
    setSelected(index);
    const current = trial.questions[qIndex];
    const isCorrect = index === current.correct;
    setTimeout(() => {
      if (isCorrect) {
        const nextScore = score + 1;
        setScore(nextScore);
        if (qIndex + 1 >= trial.questions.length) finish('winner', nextScore, null);
        else {
          setQIndex((currentIndex) => currentIndex + 1);
          setSelected(null);
        }
      } else {
        const level = qIndex + 1;
        if (!revived && level >= Math.max(3, trial.questions.length - 1)) {
          setFailedAt(level);
          setLocked(true);
        } else {
          finish('failed', score, level);
        }
      }
    }, 520);
  };

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#080910] text-[#fff8e7] antialiased">
      <GameBackdrop />
      <TopHud go={go} />
      <main className="relative z-10 pb-32">
        {view === 'home' && <Home go={go} trial={trial} />}
        {view === 'create' && <Create draft={draft} setDraft={setDraft} publish={publish} />}
        {view === 'trial' && (
          <TrialPlay
            trial={trial}
            player={player}
            setPlayer={setPlayer}
            city={city}
            setCity={setCity}
            started={started}
            setStarted={setStarted}
            locked={locked}
            setLocked={setLocked}
            qIndex={qIndex}
            selected={selected}
            score={score}
            failedAt={failedAt}
            revived={revived}
            setRevived={setRevived}
            resetRun={resetRun}
            choose={choose}
            finish={finish}
            speakVerdict={speakVerdict}
          />
        )}
        {view === 'result' && <Result attempt={lastAttempt || attemptsSeed[0]} trial={trial} go={go} speakVerdict={speakVerdict} />}
        {view === 'dashboard' && <Dashboard trial={trial} attempts={attempts} go={go} />}
        {view === 'council' && <Council attempts={leaders} />}
        {view === 'boost' && <Boost />}
      </main>
      <BottomNav view={view} go={go} />
    </div>
  );
}

function GameBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-5%,rgba(255,198,92,.22),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(72,95,255,.20),transparent_30%),radial-gradient(circle_at_12%_72%,rgba(0,210,180,.12),transparent_28%),linear-gradient(180deg,#080910_0%,#0b1020_52%,#07070d_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[.055] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-[#ffd06b]/10 to-transparent" />
    </>
  );
}

function Mark() {
  return (
    <div className="relative grid h-11 w-11 place-items-center rounded-[18px] border border-[#ffd06b]/25 bg-[#ffd06b]/10 shadow-[0_0_28px_rgba(255,208,107,.13)]">
      <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M10 32C16.8 20.8 24.2 15.2 32 15.2C39.8 15.2 47.2 20.8 54 32C47.2 43.2 39.8 48.8 32 48.8C24.2 48.8 16.8 43.2 10 32Z" stroke="#FFD06B" strokeWidth="3.4" />
        <circle cx="32" cy="32" r="8.2" stroke="#FFF3C4" strokeWidth="3.4" />
        <path d="M32 7L38 19H26L32 7Z" fill="#FFD06B" />
        <path d="M22 53H42" stroke="#64E9FF" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function TopHud({ go }: { go: (next: View) => void }) {
  return (
    <>
      <div className="relative z-20 flex items-center justify-center border-b border-white/5 bg-black/20 px-4 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[.035] px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[.18em] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6df6c7] shadow-[0_0_10px_rgba(109,246,199,.9)]" />
          MENA GAME BUILD / مجلس الاختبار
        </div>
      </div>
      <header className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between border-b border-white/5 bg-[#080910]/78 px-5 py-4 backdrop-blur-2xl">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-right">
          <Mark />
          <div>
            <p className="text-base font-black tracking-[-.03em] text-white">المُراقب</p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#64e9ff]/80">TRIALS GAME</p>
          </div>
        </button>
        <button onClick={() => go('create')} className="rounded-[18px] bg-[#ffd06b] px-4 py-2 text-xs font-black text-[#080910] shadow-[0_12px_34px_rgba(255,208,107,.16)]">اصنع تحدي</button>
      </header>
    </>
  );
}

function Home({ go, trial }: { go: (next: View) => void; trial: Trial }) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr] lg:items-center">
        <div className="text-right">
          <Pill>طور المجلس / نسخة الخليج</Pill>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.92] tracking-[-.07em] text-white sm:text-7xl">
            اختبرهم.
            <span className="block bg-gradient-to-l from-[#ffd06b] via-[#fff0bd] to-[#64e9ff] bg-clip-text text-transparent">من يعرفك فعلاً؟</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/62">لعبة روابط للستوري والجروبات. أسئلة شخصية، مراحل، نقاط وفيرديكت فخم. اللي ينجح يدخل مجلس التاج، واللي يطيح يطلع له كرت نتيجة قابل للمشاركة.</p>
          <div className="mt-7 grid max-w-md grid-cols-2 gap-3">
            <Button onClick={() => go('create')} primary>ابدأ تصميم التحدي <ArrowLeft className="h-4 w-4" /></Button>
            <Button onClick={() => go('trial')}>جرّب اللعب</Button>
          </div>
          <div className="mt-6 grid max-w-md grid-cols-3 gap-2">
            <TinyStat label="مراحل" value={String(trial.questions.length)} />
            <TinyStat label="إحياء" value="$0.99" />
            <TinyStat label="مجلس" value="Top 3" />
          </div>
        </div>
        <GamePhone trial={trial} />
      </div>
    </section>
  );
}

function GamePhone({ trial }: { trial: Trial }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[34px] border border-white/10 bg-white/[.045] p-3 shadow-[0_28px_90px_rgba(0,0,0,.45)] backdrop-blur-xl">
      <div className="rounded-[27px] border border-white/10 bg-[#0b1020]/96 p-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-[#6df6c7]/10 px-3 py-1 font-mono text-[10px] font-black text-[#6df6c7]">LIVE ROOM</span>
          <span className="font-mono text-[10px] text-white/45">/trial/{trial.slug}</span>
        </div>
        <div className="relative overflow-hidden rounded-[28px] border border-[#ffd06b]/20 bg-gradient-to-b from-[#151d32] to-[#0d1020] p-5">
          <div className="absolute -left-12 -top-12 h-28 w-28 rounded-full bg-[#ffd06b]/10 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#ffd06b]">LEVEL 05</p>
              <h3 className="mt-1 text-2xl font-black leading-tight">وش أكثر شي أحترمه؟</h3>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffd06b] text-[#080910]"><Crown className="h-6 w-6" /></div>
          </div>
          <div className="mt-5 space-y-2">
            {['الوفاء وقت الضغط', 'الشهرة', 'الرد السريع'].map((item, index) => (
              <div key={item} className={cn('rounded-2xl border px-3 py-3 text-sm font-bold', index === 0 ? 'border-[#6df6c7]/45 bg-[#6df6c7]/10 text-[#cffff1]' : 'border-white/10 bg-white/[.04] text-white/55')}>{item}</div>
            ))}
          </div>
        </div>
        <LevelRail count={trial.questions.length} active={4} />
      </div>
    </div>
  );
}

function Create({ draft, setDraft, publish }: { draft: Trial; setDraft: React.Dispatch<React.SetStateAction<Trial>>; publish: () => void }) {
  const patchQuestion = (id: number, patch: Partial<Question>) => setDraft((state) => ({ ...state, questions: state.questions.map((q) => q.id === id ? { ...q, ...patch } : q) }));
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-8">
      <Title eyebrow="غرفة التصميم" title="ابنِ تحدي شخصي بخطوات قليلة." />
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Panel>
          <Label>اسم صاحب التحدي</Label>
          <Input value={draft.creator} onChange={(value) => setDraft({ ...draft, creator: value })} />
          <Label>رابط اللعب</Label>
          <Input value={draft.slug} onChange={(value) => setDraft({ ...draft, slug: slugify(value) })} ltr />
          <Label>جائزة الفائز</Label>
          <Area value={draft.reward} onChange={(value) => setDraft({ ...draft, reward: value })} />
          <div className="mt-5 flex items-center gap-2"><Mic2 className="h-5 w-5 text-[#ffd06b]" /><h3 className="font-black">نصوص الفيرديكت الصوتي</h3></div>
          {draft.roasts.map((line, index) => <Area key={index} value={line} onChange={(value) => setDraft((state) => ({ ...state, roasts: state.roasts.map((item, i) => i === index ? value : item) }))} />)}
        </Panel>
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[#ffd06b]">LEVEL MAP</p><h3 className="text-2xl font-black">{draft.questions.length} مراحل</h3></div>
            <button onClick={() => setDraft((state) => ({ ...state, questions: [...state.questions, { id: Date.now(), text: 'سؤال جديد؟', options: ['الإجابة الصحيحة', 'فخ', 'خيار مضحك', 'عشوائي'], correct: 0, level: 'medium' }] }))} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[.06] text-white"><Plus className="h-5 w-5" /></button>
          </div>
          {draft.questions.map((question, index) => (
            <div key={question.id} className="mb-4 rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="mb-3 flex items-center justify-between"><span className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-[#ffd06b]">مرحلة {index + 1}</span><select value={question.level} onChange={(e) => patchQuestion(question.id, { level: e.target.value as Level })} className="rounded-xl border border-white/10 bg-[#0b1020] px-2 py-1 text-xs"><option value="easy">سهل</option><option value="medium">وسط</option><option value="hard">صعب</option></select></div>
              <Input value={question.text} onChange={(value) => patchQuestion(question.id, { text: value })} />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option, optionIndex) => <div key={optionIndex} className="flex gap-2"><button onClick={() => patchQuestion(question.id, { correct: optionIndex })} className={cn('h-11 w-11 shrink-0 rounded-2xl border text-xs font-black', question.correct === optionIndex ? 'border-[#6df6c7]/50 bg-[#6df6c7]/15 text-[#baffea]' : 'border-white/10 bg-white/[.035] text-white/35')}>{String.fromCharCode(65 + optionIndex)}</button><Input value={option} onChange={(value) => patchQuestion(question.id, { options: question.options.map((item, i) => i === optionIndex ? value : item) })} /></div>)}</div>
            </div>
          ))}
          <Button onClick={publish} primary full>نشر التحدي</Button>
        </Panel>
      </div>
    </section>
  );
}

function TrialPlay(props: { trial: Trial; player: string; setPlayer: (value: string) => void; city: string; setCity: (value: string) => void; started: boolean; setStarted: (value: boolean) => void; locked: boolean; setLocked: (value: boolean) => void; qIndex: number; selected: number | null; score: number; failedAt: number | null; revived: boolean; setRevived: (value: boolean) => void; resetRun: () => void; choose: (index: number) => void; finish: (status: Status, finalScore: number, fail: number | null) => void; speakVerdict: () => void }) {
  const current = props.trial.questions[props.qIndex];
  if (!props.started) return <Lobby {...props} />;
  if (props.locked && props.failedAt) return <Locked {...props} />;
  return (
    <section className="mx-auto w-full max-w-md px-5 pt-8">
      <PhoneShell>
        <div className="mb-5 flex items-center justify-between"><span className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-[#ffd06b]">مرحلة {props.qIndex + 1} / {props.trial.questions.length}</span><span className="rounded-full bg-white/[.06] px-3 py-1 font-mono text-[10px] text-white/60">XP {props.score * 120}</span></div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-l from-[#ffd06b] to-[#6df6c7]" style={{ width: `${((props.qIndex + 1) / props.trial.questions.length) * 100}%` }} /></div>
        <div className="mb-4 flex gap-2">{props.trial.questions.map((_, index) => <span key={index} className={cn('h-2 flex-1 rounded-full', index <= props.qIndex ? 'bg-[#ffd06b]' : 'bg-white/10')} />)}</div>
        <p className="mb-2 font-mono text-[10px] font-black uppercase tracking-[.18em] text-[#64e9ff]">{current.level}</p>
        <h2 className="text-3xl font-black leading-tight tracking-[-.04em]">{current.text}</h2>
        <div className="mt-6 space-y-3">{current.options.map((option, index) => {
          const active = props.selected === index;
          const good = active && index === current.correct;
          const bad = active && index !== current.correct;
          return <button key={option} onClick={() => props.choose(index)} className={cn('w-full rounded-[22px] border px-4 py-4 text-right text-sm font-bold transition', good && 'border-[#6df6c7]/50 bg-[#6df6c7]/12 text-[#d5fff2]', bad && 'border-rose-300/50 bg-rose-300/12 text-rose-100', !active && 'border-white/10 bg-white/[.045] text-white/75 hover:bg-white/[.075]')}><span className="ml-2 font-mono text-white/30">{String.fromCharCode(65 + index)}</span>{option}</button>;
        })}</div>
      </PhoneShell>
    </section>
  );
}

function Lobby(props: any) {
  return <section className="mx-auto w-full max-w-md px-5 pt-8"><PhoneShell><div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-[#ffd06b] text-[#080910]"><Shield className="h-8 w-8" /></div><p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[.24em] text-[#ffd06b]" dir="ltr">/trial/{props.trial.slug}</p><h2 className="mt-3 text-4xl font-black tracking-[-.05em]">تحدي {props.trial.creator}</h2><p className="mt-4 rounded-[22px] border border-white/10 bg-white/[.04] p-4 text-sm leading-6 text-white/62">ادخل اسمك وابدأ. كل إجابة صحيحة ترفعك مرحلة. خطأ واحد قد يطلع لك فيرديكت.</p><div className="mt-6 space-y-3 text-right"><Input value={props.player} onChange={props.setPlayer} placeholder="اسمك أو يوزرك" /><select className="w-full rounded-[18px] border border-white/10 bg-[#0b1020] px-4 py-3 text-white" value={props.city} onChange={(e) => props.setCity(e.target.value)}>{cities.map((city) => <option key={city}>{city}</option>)}</select><Button primary full onClick={() => { props.resetRun(); props.setStarted(true); }}>ابدأ اللعب</Button></div></div></PhoneShell></section>;
}

function Locked(props: any) {
  return <section className="mx-auto w-full max-w-md px-5 pt-8"><PhoneShell><div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-rose-500/90"><Flame className="h-8 w-8" /></div><h2 className="mt-4 text-4xl font-black tracking-[-.05em]">انقفلت المرحلة</h2><p className="mt-3 text-sm leading-6 text-white/62">غلطت في مرحلة {props.failedAt}. تقدر تستخدم إحياء واحد، أو تقبل الفيرديكت.</p><Button full onClick={props.speakVerdict}><Play className="h-4 w-4" />شغل الفيرديكت</Button>{!props.revived && <Button primary full onClick={() => { props.setRevived(true); props.setLocked(false); }}>إحياء واحد / $0.99</Button>}<Button full onClick={() => props.finish('failed', props.score, props.failedAt)}>اقبل النتيجة</Button></div></PhoneShell></section>;
}

function Result({ attempt, trial, go, speakVerdict }: { attempt: Attempt; trial: Trial; go: (next: View) => void; speakVerdict: () => void }) {
  const won = attempt.status === 'winner';
  const text = won ? `نجحت في تحدي ${trial.creator} بنتيجة ${attempt.score}/${attempt.total}.` : `وقفت في تحدي ${trial.creator} عند مرحلة ${attempt.failAt}.`;
  return <section className="mx-auto w-full max-w-md px-5 pt-10 text-center"><Panel><div className={cn('mx-auto grid h-16 w-16 place-items-center rounded-[24px]', won ? 'bg-[#6df6c7] text-[#07130d]' : 'bg-rose-500')}><Trophy className="h-8 w-8" /></div><h2 className="mt-5 text-4xl font-black tracking-[-.05em]">{won ? 'مؤهل للمجلس' : 'صدر الفيرديكت'}</h2><p className="mt-4 text-white/62">{attempt.name} جاب {attempt.score}/{attempt.total}</p><div className="my-6 rounded-[22px] border border-white/10 bg-black/25 p-4 text-sm text-white/75">{text}</div>{!won && <Button full onClick={speakVerdict}><Play className="h-4 w-4" />إعادة الصوت</Button>}<Button primary full onClick={() => navigator.clipboard?.writeText(text)}>نسخ نص الستوري</Button><Button full onClick={() => go('create')}>اصنع تحديك</Button></Panel></section>;
}

function Dashboard({ trial, attempts, go }: { trial: Trial; attempts: Attempt[]; go: (next: View) => void }) {
  const winners = attempts.filter((item) => item.status === 'winner').length;
  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.score / item.total, 0) / attempts.length * 100) : 0;
  return <section className="mx-auto w-full max-w-6xl px-5 pt-8"><Title eyebrow="لوحة النتائج" title="تابع اللي نجح واللي وقف." /><div className="grid gap-4 sm:grid-cols-4"><Stat icon={<Users />} label="محاولات" value={String(attempts.length)} /><Stat icon={<Crown />} label="فائزين" value={String(winners)} /><Stat icon={<Flame />} label="فيرديكت" value={String(attempts.length - winners)} /><Stat icon={<Star />} label="المعدل" value={`${average}%`} /></div><Panel className="mt-5"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="font-mono text-[10px] font-black uppercase text-[#ffd06b]">ACTIVE TRIAL</p><h3 className="text-xl font-black" dir="ltr">/trial/{trial.slug}</h3><p className="text-sm text-white/48">{trial.reward}</p></div><Button primary onClick={() => go('council')}>Top 3</Button></div>{attempts.map((attempt) => <div key={attempt.id} className="mb-3 rounded-[22px] border border-white/10 bg-black/22 p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-black">{attempt.name}</p><p className="text-sm text-white/58">{attempt.status === 'winner' ? 'خلص كل المراحل' : `وقف عند مرحلة ${attempt.failAt}`}</p><p className="mt-2 font-mono text-[10px] uppercase text-white/30">{attempt.city} / {attempt.time}</p></div><p className="text-2xl font-black text-[#ffd06b]">{attempt.score}/{attempt.total}</p></div></div>)}</Panel></section>;
}

function Council({ attempts }: { attempts: Attempt[] }) {
  const names = ['ملك المجلس', 'أمير الألماس', 'حارس الذهب'];
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><Title eyebrow="مجلس التاج" title="أعلى ٣ نتائج يصيرون ستاتس." /><div className="grid gap-5 md:grid-cols-3">{attempts.map((attempt, index) => <Panel key={attempt.id} className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[24px] bg-[#ffd06b] text-[#080910]">{index === 1 ? <Diamond /> : <Crown />}</div><p className="mt-5 font-mono text-[10px] font-black uppercase tracking-[.18em] text-[#ffd06b]">#{index + 1} {names[index]}</p><h3 className="mt-2 text-2xl font-black">{attempt.name}</h3><p className="mt-2 text-sm text-white/50">{attempt.city} / {attempt.score}/{attempt.total}</p><p className="mt-5 text-5xl font-black text-[#ffd06b]">{Math.round(attempt.score / attempt.total * 100)}</p></Panel>)}</div></section>;
}

function Boost() {
  const items = [
    ['إحياء واحد', 'ارجع قبل ما تخسر آخر المراحل.', '$0.99', <RotateCcw />],
    ['حزمة فيرديكت', 'نصوص أقوى وكروت مشاركة أرتب.', '$1.99', <MessageCircle />],
    ['ستايل ملكي', 'تأثيرات ذهبية لكرت الستوري.', '$2.99', <Sparkles />],
    ['بوابة الجائزة', 'الفائز يفتح مكافأة خاصة.', '$4.99', <Lock />],
  ];
  return <section className="mx-auto w-full max-w-5xl px-5 pt-8"><Title eyebrow="متجر اللعبة" title="ادفع في لحظة الحماس." /><div className="grid gap-4 md:grid-cols-2">{items.map(([name, desc, price, icon]) => <Panel key={String(name)}><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#ffd06b]/12 text-[#ffd06b]">{icon as React.ReactNode}</div><h3 className="text-xl font-black">{name}</h3><p className="mt-2 text-sm leading-6 text-white/58">{desc}</p><p className="mt-4 text-2xl font-black text-[#ffd06b]">{price}</p></Panel>)}</div></section>;
}

function BottomNav({ view, go }: { view: View; go: (next: View) => void }) {
  return <nav className="fixed bottom-5 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 gap-1 rounded-[24px] border border-white/10 bg-[#0c1020]/88 p-2 shadow-[0_18px_55px_rgba(0,0,0,.55)] backdrop-blur-2xl">{navItems.map((item) => <button key={item.key} onClick={() => go(item.key)} className={cn('flex flex-1 flex-col items-center gap-1 rounded-[18px] px-2 py-2 text-[10px] font-black transition', view === item.key ? 'bg-[#ffd06b] text-[#080910]' : 'text-white/42')}><span className="[&>svg]:h-4 [&>svg]:w-4">{item.icon}</span>{item.label}</button>)}</nav>;
}

function LevelRail({ count, active }: { count: number; active: number }) {
  return <div className="mt-5 grid grid-cols-6 gap-2">{Array.from({ length: count }).map((_, index) => <div key={index} className={cn('h-2 rounded-full', index <= active ? 'bg-[#ffd06b]' : 'bg-white/10')} />)}</div>;
}

function Title({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="mb-7 text-right"><p className="font-mono text-[10px] font-black uppercase tracking-[.22em] text-[#ffd06b]">{eyebrow}</p><h2 className="mt-2 max-w-3xl text-4xl font-black leading-tight tracking-[-.05em] text-white sm:text-5xl">{title}</h2></div>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[.045] px-3.5 py-1.5 text-[11px] font-black text-white/72"><span className="h-1.5 w-1.5 rounded-full bg-[#6df6c7] shadow-[0_0_10px_rgba(109,246,199,.9)]" />{children}</div>;
}

function Button({ children, onClick, primary, full }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; full?: boolean }) {
  return <button onClick={onClick} className={cn('inline-flex items-center justify-center gap-2 rounded-[18px] px-4 py-3 text-sm font-black transition active:scale-[.98]', primary ? 'bg-[#ffd06b] text-[#080910] shadow-[0_16px_42px_rgba(255,208,107,.16)]' : 'border border-white/10 bg-white/[.055] text-white/72', full && 'w-full')}>{children}</button>;
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('rounded-[28px] border border-white/10 bg-white/[.055] p-5 shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-xl', className)}>{children}</div>;
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[34px] border border-white/10 bg-white/[.04] p-3 shadow-[0_30px_100px_rgba(0,0,0,.45)]"><div className="rounded-[27px] border border-white/10 bg-[#0b1020]/96 p-5">{children}</div></div>;
}

function TinyStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[18px] border border-white/10 bg-white/[.04] p-3 text-center"><p className="text-lg font-black text-[#ffd06b]">{value}</p><p className="text-[10px] font-bold text-white/38">{label}</p></div>;
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <Panel><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[18px] bg-white/[.055] text-[#ffd06b]">{icon}</div><p className="text-[11px] font-bold text-white/38">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></Panel>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 mt-4 block text-xs font-black text-white/40 first:mt-0">{children}</label>;
}

function Input({ value, onChange, placeholder, ltr }: { value: string; onChange: (value: string) => void; placeholder?: string; ltr?: boolean }) {
  return <input dir={ltr ? 'ltr' : 'rtl'} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-[18px] border border-white/10 bg-black/22 px-4 py-3 text-white outline-none placeholder:text-white/24 focus:border-[#ffd06b]/55" />;
}

function Area({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} className="mb-2 min-h-20 w-full rounded-[18px] border border-white/10 bg-black/22 px-4 py-3 text-white outline-none focus:border-[#ffd06b]/55" />;
}
