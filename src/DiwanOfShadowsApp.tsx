import React, { useMemo, useRef, useState } from 'react';
import {
  AudioLines,
  BadgeCheck,
  ChevronLeft,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Gem,
  Lock,
  Mic,
  Moon,
  Play,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Store,
  Unlock,
  WalletCards,
} from 'lucide-react';

type View = 'creator' | 'send' | 'hearth' | 'shop';
type DeckType = 'truth' | 'roast' | 'crush';
type ClueKey = 'time' | 'aura' | 'hint';

type ShadowCard = {
  id: number;
  deck: DeckType;
  text: string;
  voiceReady: boolean;
  flipped: boolean;
  unlocked: Record<ClueKey, boolean>;
  clues: Record<ClueKey, string>;
};

const deckMeta: Record<DeckType, { title: string; ar: string; glow: string; prompt: string }> = {
  truth: {
    title: 'Truth Deck',
    ar: 'ديك الحقيقة',
    glow: 'from-[#D4AF37] to-[#F3E5AB]',
    prompt: 'اكتب همسة صريحة لا تنقال بصوت عالي.',
  },
  roast: {
    title: 'Roast Deck',
    ar: 'ديك الحرق',
    glow: 'from-[#FF6B6B] to-[#D4AF37]',
    prompt: 'اكتب ملاحظة حادة بس بدون تجريح شخصي.',
  },
  crush: {
    title: 'Secret Crush Deck',
    ar: 'ديك الإعجاب السري',
    glow: 'from-[#C084FC] to-[#F3E5AB]',
    prompt: 'اكتب همسة إعجاب غامضة وخفيفة.',
  },
};

const startingCards: ShadowCard[] = [
  {
    id: 1,
    deck: 'crush',
    text: 'فيه شخص كل ما شاف ستوري لك يرجع يعيده مرتين. مو فضول، يمكن شيء أعمق.',
    voiceReady: true,
    flipped: false,
    unlocked: { time: false, aura: false, hint: false },
    clues: { time: 'أُرسلت بعد منتصف الليل', aura: 'اختار ديك الإعجاب السري', hint: 'التلميح الطوعي: “نعرف بعض من الشتاء”' },
  },
  {
    id: 2,
    deck: 'truth',
    text: 'أنت تحسب وجودك عادي، بس في المجلس اسمك يطلع أكثر مما تتخيل.',
    voiceReady: false,
    flipped: false,
    unlocked: { time: false, aura: false, hint: false },
    clues: { time: 'أُرسلت وقت الدوام', aura: 'نبرة الرسالة: قريب من الدائرة', hint: 'التلميح الطوعي: “قهوة ومكان معروف”' },
  },
  {
    id: 3,
    deck: 'roast',
    text: 'أحيانًا ستايلك يعطي: داخل بثقة، خارج بدون خطة.',
    voiceReady: false,
    flipped: false,
    unlocked: { time: false, aura: false, hint: false },
    clues: { time: 'أُرسلت مساء الجمعة', aura: 'اختار ديك الحرق', hint: 'التلميح الطوعي: “مزحنا ثقيل”' },
  },
];

const safeCluePrice = 2;
const initialTokens = 8;

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function makeCard(deck: DeckType, text: string, voiceReady: boolean): ShadowCard {
  const clueBank = [
    { time: 'أُرسلت بعد منتصف الليل', aura: `اختار ${deckMeta[deck].ar}`, hint: 'التلميح الطوعي: “قريب أكثر مما تتوقع”' },
    { time: 'أُرسلت في وقت ستوري نشط', aura: 'نبرة الرسالة: دائرة قريبة', hint: 'التلميح الطوعي: “شفنا بعض قريب”' },
    { time: 'أُرسلت في آخر الليل', aura: 'مزاج الكرت: اعتراف مؤجل', hint: 'التلميح الطوعي: “بيننا ذكرى”' },
  ];
  const pick = clueBank[Math.floor(Math.random() * clueBank.length)];
  return {
    id: Date.now(),
    deck,
    text,
    voiceReady,
    flipped: false,
    unlocked: { time: false, aura: false, hint: false },
    clues: pick,
  };
}

export default function DiwanOfShadowsApp() {
  const [view, setView] = useState<View>(window.location.pathname.startsWith('/d/') ? 'send' : 'creator');
  const [handle, setHandle] = useState('latifa');
  const [selectedDeck, setSelectedDeck] = useState<DeckType>('crush');
  const [secret, setSecret] = useState('');
  const [cards, setCards] = useState<ShadowCard[]>(startingCards);
  const [tokens, setTokens] = useState(initialTokens);
  const [checkout, setCheckout] = useState<{ cardId: number; clue: ClueKey } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const publicLink = `diwan.xyz/${handle || 'latifa'}`;
  const shadowCount = cards.length;
  const rareCount = cards.filter((card) => card.deck === 'crush').length;

  const startRecording = async () => {
    setAudioError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setAudioError('المتصفح لا يدعم تسجيل الصوت. اكتب الهمسة بدلًا من ذلك.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
      };
      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setAudioError('تم رفض المايكروفون. تقدر ترسل همسة مكتوبة فقط.');
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setIsRecording(false);
  };

  const playScrambled = async () => {
    if (!recordedUrl) return;
    setAudioError('');
    try {
      const response = await fetch(recordedUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new AudioContext();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = 0.72;

      const distortion = audioContext.createWaveShaper();
      distortion.curve = makeDistortionCurve(520);
      distortion.oversample = '4x';

      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 760;
      filter.Q.value = 8;

      const gain = audioContext.createGain();
      gain.gain.value = 0.9;

      source.connect(distortion);
      distortion.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);
      source.start();
    } catch {
      setAudioError('تعذر تشغيل المعاينة المشوشة.');
    }
  };

  const submitWhisper = () => {
    if (!secret.trim() && !recordedUrl) return;
    const text = secret.trim() || 'همسة صوتية مشوشة بدون نص.';
    setCards((current) => [makeCard(selectedDeck, text, Boolean(recordedUrl)), ...current]);
    setSecret('');
    setRecordedUrl(null);
    setView('hearth');
  };

  const flipCard = (cardId: number) => {
    setCards((current) => current.map((card) => card.id === cardId ? { ...card, flipped: true } : card));
  };

  const unlockClue = (cardId: number, clue: ClueKey) => {
    if (tokens >= safeCluePrice) {
      setTokens((balance) => balance - safeCluePrice);
      setCards((current) => current.map((card) => card.id === cardId ? { ...card, unlocked: { ...card.unlocked, [clue]: true } } : card));
      setCheckout(null);
    } else {
      setCheckout({ cardId, clue });
    }
  };

  const buyTokens = () => {
    setTokens((balance) => balance + 10);
    if (checkout) {
      const pending = checkout;
      setTimeout(() => unlockClue(pending.cardId, pending.clue), 150);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#f8f1d5] antialiased">
      <LuxuryBackdrop />
      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/10 bg-[#0A0A0A]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-4">
          <button onClick={() => setView('creator')} className="flex items-center gap-3 text-left">
            <DiwanMark />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F3E5AB]">Diwan</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/38">of Shadows</p>
            </div>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/8 px-3 py-2 text-xs font-black text-[#F3E5AB]"><Gem className="h-3.5 w-3.5" /> {tokens}</div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-md px-4 pb-28 pt-5">
        {view === 'creator' && <CreatorSetup handle={handle} setHandle={setHandle} publicLink={publicLink} shadowCount={shadowCount} rareCount={rareCount} go={setView} />}
        {view === 'send' && <AnonymousSender selectedDeck={selectedDeck} setSelectedDeck={setSelectedDeck} secret={secret} setSecret={setSecret} isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} recordedUrl={recordedUrl} playScrambled={playScrambled} audioError={audioError} submitWhisper={submitWhisper} />}
        {view === 'hearth' && <ShadowHearth cards={cards} flipCard={flipCard} unlockClue={(cardId, clue) => tokens >= safeCluePrice ? unlockClue(cardId, clue) : setCheckout({ cardId, clue })} />}
        {view === 'shop' && <ClueShop tokens={tokens} buyTokens={buyTokens} />}
      </main>

      <BottomNav view={view} setView={setView} />
      {checkout && <CheckoutModal tokens={tokens} buyTokens={buyTokens} close={() => setCheckout(null)} />}
    </div>
  );
}

function makeDistortionCurve(amount: number) {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function LuxuryBackdrop() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(212,175,55,.18),transparent_30%),radial-gradient(circle_at_85%_22%,rgba(90,72,255,.18),transparent_31%),linear-gradient(180deg,#0A0A0A_0%,#101010_48%,#070707_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[.045] [background-image:linear-gradient(rgba(243,229,171,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(243,229,171,.35)_1px,transparent_1px)] [background-size:34px_34px]" />
    </>
  );
}

function DiwanMark() {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 shadow-[0_0_30px_rgba(212,175,55,.12)]">
      <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
        <path d="M12 34C18 23 25 18 32 18C39 18 46 23 52 34C46 45 39 50 32 50C25 50 18 45 12 34Z" stroke="#D4AF37" strokeWidth="3.6" />
        <circle cx="32" cy="34" r="8" stroke="#F3E5AB" strokeWidth="3.6" />
        <path d="M32 8L38 20H26L32 8Z" fill="#D4AF37" />
        <path d="M21 55H43" stroke="#8BE7FF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function CreatorSetup(props: { handle: string; setHandle: (value: string) => void; publicLink: string; shadowCount: number; rareCount: number; go: (view: View) => void }) {
  return (
    <section>
      <Pill>ديوان الظلال / Private Beta</Pill>
      <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white">Leave a whisper. <span className="block bg-gradient-to-r from-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">Flip the card.</span></h1>
      <p className="mt-5 leading-8 text-white/58">A luxury anonymous card game for close circles. Share your Diwan, receive shadow cards, flip them tonight, and unlock safe voluntary clues with Insight Tokens.</p>

      <Panel className="mt-7">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-white/35">Custom link</label>
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2">
          <span className="font-mono text-xs text-white/32">diwan.xyz/</span>
          <input value={props.handle} onChange={(event) => props.setHandle(event.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))} className="min-w-0 flex-1 bg-transparent py-2 text-sm font-bold text-[#F3E5AB] outline-none" />
          <Copy className="h-4 w-4 text-white/35" />
        </div>
        <button onClick={() => props.go('send')} className="mt-4 w-full rounded-2xl bg-[#D4AF37] py-4 text-sm font-black uppercase tracking-[0.18em] text-black">Preview sender link</button>
      </Panel>

      <StickerPreview link={props.publicLink} shadowCount={props.shadowCount} rareCount={props.rareCount} />
      <button onClick={() => navigator.clipboard?.writeText(`Leave a whisper in my Diwan: ${props.publicLink}`)} className="mt-4 w-full rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 py-4 text-sm font-black text-[#F3E5AB]">Generate Snapchat Sticker</button>
    </section>
  );
}

function StickerPreview({ link, shadowCount, rareCount }: { link: string; shadowCount: number; rareCount: number }) {
  return (
    <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#D4AF37]/20 bg-gradient-to-b from-[#1a1710] to-[#0b0b0b] p-5 shadow-[0_25px_80px_rgba(0,0,0,.45)]">
      <div className="flex items-center justify-between"><DiwanMark /><span className="rounded-full bg-white/8 px-3 py-1 font-mono text-[10px] text-white/45">STORY STICKER</span></div>
      <h2 className="mt-8 text-3xl font-black leading-tight text-white">Leave a whisper in my Diwan...</h2>
      <p className="mt-2 text-lg font-semibold text-[#F3E5AB]">I'm flipping the cards tonight.</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Mini label="Shadow cards" value={String(shadowCount)} />
        <Mini label="Crush cards" value={String(rareCount)} />
      </div>
      <p className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-center font-mono text-xs text-white/60">{link}</p>
    </div>
  );
}

function AnonymousSender(props: { selectedDeck: DeckType; setSelectedDeck: (deck: DeckType) => void; secret: string; setSecret: (value: string) => void; isRecording: boolean; startRecording: () => void; stopRecording: () => void; recordedUrl: string | null; playScrambled: () => void; audioError: string; submitWhisper: () => void }) {
  return (
    <section>
      <Pill>Anonymous Card Play</Pill>
      <h1 className="mt-5 text-4xl font-black leading-tight text-white">Choose a deck. Send a shadow.</h1>
      <p className="mt-3 leading-7 text-white/55">No registration. Your whisper enters the Diwan as a face-down card.</p>
      <div className="mt-6 grid gap-3">
        {(Object.keys(deckMeta) as DeckType[]).map((deck) => (
          <button key={deck} onClick={() => props.setSelectedDeck(deck)} className={cn('rounded-3xl border p-4 text-left transition active:scale-[.99]', props.selectedDeck === deck ? 'border-[#D4AF37]/55 bg-[#D4AF37]/10 shadow-[0_0_35px_rgba(212,175,55,.08)]' : 'border-white/10 bg-white/[.045]')}>
            <div className="flex items-center justify-between"><div><p className="font-black text-white">{deckMeta[deck].title}</p><p className="mt-1 text-sm text-white/45">{deckMeta[deck].ar}</p></div><div className={cn('h-10 w-10 rounded-2xl bg-gradient-to-br', deckMeta[deck].glow)} /></div>
          </button>
        ))}
      </div>
      <Panel className="mt-5">
        <p className="text-sm font-bold text-[#F3E5AB]">{deckMeta[props.selectedDeck].prompt}</p>
        <textarea value={props.secret} onChange={(event) => props.setSecret(event.target.value)} maxLength={220} placeholder="اكتب الهمسة هنا..." className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#D4AF37]/55" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button onClick={props.isRecording ? props.stopRecording : props.startRecording} className={cn('rounded-2xl py-4 text-sm font-black', props.isRecording ? 'bg-red-500 text-white' : 'border border-white/10 bg-white/[.06] text-white/70')}><Mic className="mx-auto mb-1 h-4 w-4" />{props.isRecording ? 'Stop' : 'Record Whisper'}</button>
          <button disabled={!props.recordedUrl} onClick={props.playScrambled} className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/8 py-4 text-sm font-black text-[#F3E5AB] disabled:opacity-35"><Play className="mx-auto mb-1 h-4 w-4" />Scramble Preview</button>
        </div>
        {props.audioError && <p className="mt-3 text-xs text-red-200">{props.audioError}</p>}
        <button onClick={props.submitWhisper} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 text-sm font-black uppercase tracking-[0.16em] text-black"><Send className="h-4 w-4" /> Send Shadow Card</button>
      </Panel>
    </section>
  );
}

function ShadowHearth({ cards, flipCard, unlockClue }: { cards: ShadowCard[]; flipCard: (id: number) => void; unlockClue: (id: number, clue: ClueKey) => void }) {
  return (
    <section>
      <Pill>The Shadow Hearth</Pill>
      <h1 className="mt-5 text-4xl font-black text-white">Your Diwan is waiting.</h1>
      <p className="mt-3 text-white/52">Tap a card to flip. Clues are safe, voluntary, or game-generated — never device tracking.</p>
      <div className="mt-6 grid grid-cols-1 gap-4">
        {cards.map((card) => <HearthCard key={card.id} card={card} flipCard={flipCard} unlockClue={unlockClue} />)}
      </div>
    </section>
  );
}

function HearthCard({ card, flipCard, unlockClue }: { card: ShadowCard; flipCard: (id: number) => void; unlockClue: (id: number, clue: ClueKey) => void }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[.045] p-4 backdrop-blur-xl">
      <button onClick={() => !card.flipped && flipCard(card.id)} className="w-full text-left [perspective:1000px]">
        <div className={cn('relative min-h-[230px] rounded-[1.5rem] transition duration-500 [transform-style:preserve-3d]', card.flipped && '[transform:rotateY(180deg)]')}>
          <div className="absolute inset-0 grid place-items-center rounded-[1.5rem] border border-[#D4AF37]/25 bg-gradient-to-b from-[#181818] to-[#080808] p-5 [backface-visibility:hidden]">
            <DiwanMark />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.26em] text-[#D4AF37]">{deckMeta[card.deck].title}</p>
            <p className="mt-2 text-sm text-white/35">Tap to flip</p>
          </div>
          <div className="absolute inset-0 rounded-[1.5rem] border border-[#D4AF37]/25 bg-gradient-to-b from-[#1c1a12] to-[#090909] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="flex items-center justify-between"><span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs font-black text-[#F3E5AB]">{deckMeta[card.deck].ar}</span>{card.voiceReady ? <AudioLines className="h-5 w-5 text-[#8BE7FF]" /> : <Eye className="h-5 w-5 text-white/35" />}</div>
            <p className="mt-6 text-lg font-semibold leading-8 text-white">{card.text}</p>
          </div>
        </div>
      </button>
      {card.flipped && <ClueSlots card={card} unlockClue={unlockClue} />}
    </div>
  );
}

function ClueSlots({ card, unlockClue }: { card: ShadowCard; unlockClue: (id: number, clue: ClueKey) => void }) {
  const entries: Array<[ClueKey, string]> = [['time', 'Time Trace'], ['aura', 'Deck Aura'], ['hint', 'Voluntary Hint']];
  return <div className="mt-4 grid gap-2">{entries.map(([key, label]) => <button key={key} onClick={() => !card.unlocked[key] && unlockClue(card.id, key)} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-left"><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.14em] text-white/35">{label}</span>{card.unlocked[key] ? <Unlock className="h-4 w-4 text-[#8BE7FF]" /> : <Lock className="h-4 w-4 text-[#D4AF37]" />}</div><p className={cn('mt-2 text-sm font-semibold text-white transition', !card.unlocked[key] && 'blur-sm select-none text-white/35')}>{card.unlocked[key] ? card.clues[key] : 'Reveal with 2 Insight Tokens'}</p></button>)}</div>;
}

function ClueShop({ tokens, buyTokens }: { tokens: number; buyTokens: () => void }) {
  return <section><Pill>Token Paywall</Pill><h1 className="mt-5 text-4xl font-black text-white">Insight Token Balance</h1><Panel className="mt-6 text-center"><WalletCards className="mx-auto h-10 w-10 text-[#D4AF37]" /><p className="mt-4 text-6xl font-black text-[#F3E5AB]">{tokens}</p><p className="mt-2 text-white/45">tokens available</p><button onClick={buyTokens} className="mt-6 w-full rounded-2xl bg-[#D4AF37] py-4 text-sm font-black uppercase tracking-[0.16em] text-black">Apple Pay / Mada Demo</button></Panel><div className="mt-4 grid gap-3"><ShopItem title="10 Insight Tokens" price="$2.99" /><ShopItem title="Golden Diwan Skin" price="$1.99" /><ShopItem title="Crown Card Priority" price="$4.99" /></div></section>;
}

function CheckoutModal({ tokens, buyTokens, close }: { tokens: number; buyTokens: () => void; close: () => void }) {
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-xl"><div className="w-full max-w-sm rounded-[2rem] border border-[#D4AF37]/25 bg-[#101010] p-5 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-xl font-black text-white">Unlock clue</h3><button onClick={close} className="rounded-full bg-white/8 p-2"><EyeOff className="h-4 w-4" /></button></div><p className="mt-3 text-sm leading-6 text-white/52">You need 2 Insight Tokens. Current balance: {tokens}. Add tokens with a Mada / Apple Pay styled checkout demo.</p><button onClick={buyTokens} className="mt-5 w-full rounded-2xl bg-[#D4AF37] py-4 text-sm font-black uppercase tracking-[0.16em] text-black">Pay and reveal</button></div></div>;
}

function BottomNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  const items: Array<[View, string, React.ReactNode]> = [['creator', 'Create', <Sparkles />], ['send', 'Send', <Send />], ['hearth', 'Cards', <Crown />], ['shop', 'Tokens', <Store />]];
  return <nav className="fixed bottom-5 left-1/2 z-40 grid w-[calc(100%-2rem)] max-w-md -translate-x-1/2 grid-cols-4 gap-1 rounded-[1.4rem] border border-white/10 bg-[#101010]/88 p-2 shadow-[0_18px_55px_rgba(0,0,0,.6)] backdrop-blur-2xl">{items.map(([key, label, icon]) => <button key={key} onClick={() => setView(key)} className={cn('flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-black uppercase tracking-[0.08em] transition', view === key ? 'bg-[#D4AF37] text-black' : 'text-white/38')}><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>{label}</button>)}</nav>;
}

function Pill({ children }: { children: React.ReactNode }) { return <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/8 px-3 py-1.5 text-[11px] font-black text-[#F3E5AB]"><Moon className="h-3.5 w-3.5" />{children}</div>; }
function Panel({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={cn('rounded-[2rem] border border-white/10 bg-white/[.055] p-5 shadow-[0_24px_70px_rgba(0,0,0,.35)] backdrop-blur-xl', className)}>{children}</div>; }
function Mini({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-center"><p className="text-2xl font-black text-[#F3E5AB]">{value}</p><p className="font-mono text-[9px] uppercase tracking-wider text-white/32">{label}</p></div>; }
function ShopItem({ title, price }: { title: string; price: string }) { return <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="font-bold text-white">{title}</span><span className="font-black text-[#F3E5AB]">{price}</span></div>; }
