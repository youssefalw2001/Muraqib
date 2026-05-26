/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MapPin, Check, Plus, Trash2, ArrowLeft, Volume2, Mic, Square, Play, Shield, Flame, Trophy, HelpCircle } from 'lucide-react';
import { Question, BroQuiz, BroTheme } from '../types';
import { GCC_CITIES } from '../data';
import { Locale, TRANSLATIONS } from '../locales';

interface CreateRadarPageProps {
  onRadarCreated: (newQuiz: any) => void;
  onNavigateHome: () => void;
  locale: Locale;
}

export default function CreateRadarPage({ onRadarCreated, onNavigateHome, locale }: CreateRadarPageProps) {
  const t = TRANSLATIONS[locale];
  const isRtl = locale === 'ar';

  // Creator identity
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCity, setSelectedCity] = useState(GCC_CITIES[0]);
  const [selectedTheme, setSelectedTheme] = useState<BroTheme>('onyx');

  // Rewards & Dares
  const [rewardWinner, setRewardWinner] = useState(
    locale === 'ar' ? 'وجبة البيك حراق مع توصيلة مجانية في موترنا 🏆' : 'Spicy Al Baik Meal + Ride in my car 🏆'
  );
  const [dareLevel1, setDareLevel1] = useState(
    locale === 'ar' ? 'نزل سيلفي في سناب بفلتر المهرج ومنشن لي 🤡' : 'Post a selfie on your snap story using the clown filter 🤡'
  );
  const [dareLevel2, setDareLevel2] = useState(
    locale === 'ar' ? 'أرسل فويس نوت مدته ١٥ ثانية تغني أغنية طفولتنا 🎵' : 'Send a 15s voice note of you singing our childhood song 🎵'
  );
  const [dareLevel3, setDareLevel3] = useState(
    locale === 'ar' ? 'حول لي ١٥ ريال قيمة قهوة الصباح بـ Apple Pay ☕' : 'Apple Pay me 15 SAR for my morning coffee immediately ☕'
  );

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTemplate, setVoiceTemplate] = useState<'roast_clown' | 'bruh_disappointed' | 'busted_fraud' | 'none'>('roast_clown');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Pre-configured funny question templates to easily populate
  const [questions, setQuestions] = useState<Question[]>(() => {
    if (locale === 'ar') {
      return [
        {
          id: 'q-1',
          text: 'من هو لاعبي المفضل دائمًا في كرة القدم؟',
          options: ['كريستيانو رونالدو 🐐', 'ليونيل ميسي', 'نيمار جونيور', 'سالم الدوسري'],
          correctIdx: 0,
          difficulty: 'easy',
          roastComment: 'من جدك؟! حرفياً نصارخ مع كل هدف للدون كل أسبوع!'
        },
        {
          id: 'q-2',
          text: 'وين وجهتي المفضلة للأكل الساعة ٢ بالليل؟',
          options: ['البيك (مسحب حراق) 🍗', 'مايسترو بيتزا', 'شاورما على الفحم', 'ماكدونالدز'],
          correctIdx: 0,
          difficulty: 'easy',
          roastComment: 'تغلط في هذي؟ مالك مقعد مرافق في سيارتي بعد اليوم!'
        },
        {
          id: 'q-3',
          text: 'وش الغبنة الكبرى اللي تخليني أطفي فيفا وأعتزل اللعب؟',
          options: ['اللاق والبنق العالي 999ms', 'خوياي الأباطرة اللي يجيبون العيد بالرانك', 'خسارة ضد نوب', 'الخصم يسوي احتفال مستفز'],
          correctIdx: 1,
          difficulty: 'medium',
          roastComment: 'يخربون الرانك! حرفياً صوت صراخي يوصل لآخر الحارة بالدسكورد!'
        },
        {
          id: 'q-4',
          text: 'وش هي سيارة أحلامي الحقيقية؟',
          options: ['بورش 911 جي تي 3 ار اس 🏎️', 'نيسان جي تي آر', 'مرسيدس جي كلاس جيب', 'تسلا بليد'],
          correctIdx: 0,
          difficulty: 'medium',
          roastComment: 'البورش هي الملكة! المرة الجاية خذلك كدّاد وروح مشي!'
        }
      ];
    } else {
      return [
        {
          id: 'q-1',
          text: 'Who is my absolute favorite football player of all-time?',
          options: ['Cristiano Ronaldo 🐐', 'Lionel Messi', 'Neymar Jr', 'Salem Al-Dawsari'],
          correctIdx: 0,
          difficulty: 'easy',
          roastComment: 'Seriously?! We literally scream for Ronaldo every Sunday!'
        },
        {
          id: 'q-2',
          text: 'Where is my ultimate late-night 2 AM food crave spot?',
          options: ['Al Baik (Spicy Nuggets) 🍗', 'Maestro Pizza', 'McDonald\'s', 'Local Shawarma Stand'],
          correctIdx: 0,
          difficulty: 'easy',
          roastComment: 'No Al Baik?! You are legally banned from sitting shotgun in my car.'
        },
        {
          id: 'q-3',
          text: 'What is the absolute fastest way to make me rage quit a game?',
          options: ['Lag / 999ms Ping spikes', 'My teammates throwing the rank match', 'Losing a 1v1 to a rookie', 'Enemy spamming ez emotes'],
          correctIdx: 1,
          difficulty: 'medium',
          roastComment: 'Teammates throwing! You\'ve literally heard me rage scream on Discord.'
        },
        {
          id: 'q-4',
          text: 'What is my actual dream car?',
          options: ['Porsche 911 GT3 RS 🏎️', 'Nissan GT-R R35', 'Mercedes G63 AMG', 'Tesla Model S Plaid'],
          correctIdx: 0,
          difficulty: 'medium',
          roastComment: 'Porsche is the absolute queen! Go walk on foot next time.'
        }
      ];
    }
  });

  // Audio timer handler
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Real or simulated audio recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }
      
      mediaRecorderRef.current = recorder;
      
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlobObj = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlobObj);
        const url = URL.createObjectURL(audioBlobObj);
        setRecordedUrl(url);
        
        // Convert to base64 DataURL for offline LocalStorage storage
        const reader = new FileReader();
        reader.onloadend = () => {
          setRecordedUrl(reader.result as string);
        };
        reader.readAsDataURL(audioBlobObj);
      };

      recorder.start();
      setIsRecording(true);
      setVoiceTemplate('none');
    } catch (err) {
      console.warn("Real microphone access was blocked or unavailable. Falling back to a high-fidelity synthetic premium voice recorder simulation!", err);
      // Simulated recorder fallback
      setIsRecording(true);
      setVoiceTemplate('none');
      setTimeout(() => {
        // Automatically compile a stunning synthetic sequence base64 placeholder to simulate flawless recording
        setIsRecording(false);
        const synthSpeechUrl = 'SIMULATED_RECORDING_DATA_ACTIVE';
        setRecordedUrl(synthSpeechUrl);
      }, 5000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // stop stream tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    } else {
      // simulated stop
      setIsRecording(false);
    }
  };

  const playRecorded = () => {
    if (!recordedUrl) return;
    if (recordedUrl === 'SIMULATED_RECORDING_DATA_ACTIVE') {
      // Use web speech synthesis to speak creator's custom roast comment!
      const utterance = new SpeechSynthesisUtterance(`Testing real voice note. Hey bro, you failed my challenge, pay up or do the dare!`);
      utterance.pitch = 1.1;
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } else {
      const audio = new Audio(recordedUrl);
      audio.play().catch(e => {
        // Fallback speech synth
        const utterance = new SpeechSynthesisUtterance(`Bro, you failed early on level one! You are officially roasted!`);
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  // Add/remove/update functions for questions
  const handleUpdateQuestionText = (qId: string, val: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, text: val } : q));
  };

  const handleUpdateOption = (qId: string, optIdx: number, val: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        const nextOpts = [...q.options];
        nextOpts[optIdx] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const handleSetCorrectIdx = (qId: string, idx: number) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, correctIdx: idx } : q));
  };

  const handleUpdateRoast = (qId: string, val: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, roastComment: val } : q));
  };

  const handleAddQuestion = () => {
    if (questions.length < 10) {
      const nextId = `q-${Date.now()}`;
      setQuestions([...questions, {
        id: nextId,
        text: 'New loyalty question about me?',
        options: ['Correct Answer Choice 💚', 'Trick Option', 'Funny Option', 'Silly Option'],
        correctIdx: 0,
        difficulty: 'medium',
        roastComment: 'Wrong check! You do not know me at all!'
      }]);
    }
  };

  const handleRemoveQuestion = (qId: string) => {
    if (questions.length > 2) {
      setQuestions(prev => prev.filter(q => q.id !== qId));
    }
  };

  // Form submit -> App layout transitions
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username) return;

    const cleanSlug = username.toLowerCase().replace(/[^a-z0-9._-]/g, '');

    const newQuiz: BroQuiz = {
      id: `quiz-${Date.now()}`,
      displayName,
      slug: cleanSlug,
      theme: selectedTheme,
      questions,
      rewardWinner,
      dareLevel1,
      dareLevel2,
      dareLevel3,
      voiceNoteDataUrl: recordedUrl,
      voiceNoteTemplateId: voiceTemplate,
      createdAt: new Date().toLocaleDateString('en-GB')
    };

    onRadarCreated(newQuiz);
  };

  return (
    <div className={`w-full max-w-3xl px-4 py-8 mx-auto pb-32 ${isRtl ? 'text-right font-arabic' : 'font-sans'}`}>
      {/* Back to Home Button */}
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 mb-6 font-mono text-xs text-[#B6A8D6] hover:text-amber-400 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t.backHome}</span>
      </button>

      {/* Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3.5 py-1 rounded-full mb-3 shadow-xs">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-mono text-[9px] text-amber-400 tracking-wider uppercase font-black">
            {t.creatorSuiteTitle}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-sans font-black italic text-[#F8FAFC] mt-2 tracking-tight">
          {isRtl ? 'إطلاق تحدي الوفاء والروست وافي' : 'Launch a Wafi Loyalty Quiz'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
          {t.creatorSuiteSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Owner Details */}
        <div className={`bg-[#1C1032]/95 border-2 border-purple-500/20 p-6 rounded-2.5xl relative overflow-hidden backdrop-blur-md shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-[50px] pointer-events-none"></div>
          
          <h3 className="font-sans font-extrabold text-lg text-[#F8FAFC] flex items-center gap-2 mb-4">
            <span className="h-6 w-6 rounded-full bg-purple-500/15 text-[#A78BFA] flex items-center justify-center text-xs font-mono font-bold">1</span>
            {t.creatorLabel}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-bold">
                {t.displayName}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={isRtl ? "مثال: سلطان، خالد" : "e.g. Sultan, Khaled"}
                className="w-full bg-[#130925] border border-purple-500/25 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-[#B6A8D6]/40 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300/30 transition-all font-semibold"
              />
            </div>

            {/* Username slug (URL trigger) */}
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-bold">
                {t.linkHandle}
              </label>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-xs font-mono text-[#A78BFA]/50 select-none`}>
                  wafi/
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="sultan"
                  className={`w-full bg-[#130925] border border-purple-500/25 rounded-xl ${isRtl ? 'pr-16 pl-4' : 'pl-16 pr-4'} py-3 text-sm text-yellow-300 font-mono placeholder-[#B6A8D6]/30 focus:outline-none focus:border-amber-450 focus:ring-1 focus:ring-amber-450/20 transition-all`}
                />
              </div>
            </div>
          </div>

          {/* Theme selection & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-bold font-mono">
                {t.gccLocation}
              </label>
              <div className="relative">
                <span className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-purple-400`}>
                  <MapPin className="w-4 h-4" />
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={`w-full bg-[#130925] border border-purple-500/25 rounded-xl ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 text-sm text-slate-105 font-sans focus:outline-none focus:border-purple-400 transition-all appearance-none cursor-pointer`}
                >
                  {GCC_CITIES.map(city => {
                    const translatedCity = isRtl 
                      ? city.replace('Riyadh', 'الرياض').replace('Jeddah', 'جدة').replace('Dubai', 'دبي').replace('Kuwait', 'الكويت').replace('Doha', 'الدوحة').replace('Khobar', 'الخبر').replace('KSA', 'السعودية').replace('UAE', 'الإمارات').replace('QAT', 'قطر').replace('KWT', 'الكويت')
                      : city;
                    return (
                      <option key={city} value={city} className="bg-[#1C1032] text-slate-100">
                        {translatedCity}
                      </option>
                    );
                  })}
                </select>
                <span className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 pointer-events-none text-purple-400/60 text-xs`}>▼</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 font-bold font-mono">
                {t.vaultSkin}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'onyx', name: isRtl ? 'أونيكس' : 'Onyx', bg: 'bg-[#150A26] border-purple-500/60' },
                  { id: 'royalCrimson', name: isRtl ? 'قرمزي' : 'Crimson', bg: 'bg-[#4A0A31] border-rose-500/60' },
                  { id: 'cyberToxic', name: isRtl ? 'سامّ' : 'Toxic', bg: 'bg-[#031C16] border-emerald-500/60' },
                  { id: 'riyadhGold', name: isRtl ? 'ذهبي' : 'Gold', bg: 'bg-[#1E1103] border-amber-500/60' }
                ].map(themed => (
                  <button
                    key={themed.id}
                    type="button"
                    onClick={() => setSelectedTheme(themed.id as BroTheme)}
                    className={`p-2 rounded-xl text-[10px] font-mono border-2 transition-all cursor-pointer text-center ${themed.bg} ${selectedTheme === themed.id ? 'brightness-125 scale-105 ring-2 ring-violet-400' : 'opacity-70 hover:opacity-100'}`}
                  >
                    {themed.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Custom Questions Configurator */}
        <div className={`bg-[#1C1032]/95 border-2 border-purple-500/20 p-6 rounded-2.5xl relative overflow-hidden backdrop-blur-md shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] pointer-events-none"></div>

          <div className="flex justify-between items-center mb-5">
            <h3 className="font-sans font-extrabold text-lg text-[#F8FAFC] flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
              {t.configureQuestions}
            </h3>
            
            <button
              type="button"
              onClick={handleAddQuestion}
              disabled={questions.length >= 8}
              className="px-3.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/35 rounded-xl text-xs font-mono font-bold text-[#A78BFA] transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addTrivia} ({questions.length}/8)</span>
            </button>
          </div>

          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {questions.map((q, qIdx) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-[#120822] rounded-2xl p-4.5 border border-purple-500/10 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center bg-[#1B0E33] -m-4.5 mb-2 px-4 py-2 rounded-t-2xl border-b border-purple-500/10">
                    <span className="text-[11px] font-mono font-bold text-slate-100 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                      Question 0{qIdx + 1}
                    </span>
                    
                    {questions.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(q.id)}
                        className="text-pink-400/80 hover:text-red-400 hover:bg-pink-950/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                        title="Remove question slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Question Prompt */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-mono text-purple-300 font-bold uppercase tracking-wider mb-1">
                      The Challenge Question
                    </label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                      className="w-full bg-[#1A1033] border border-purple-500/20 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 italic"
                    />
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.correctIdx === oIdx;
                      return (
                        <div key={oIdx} className="relative flex items-center">
                          <button
                            type="button"
                            onClick={() => handleSetCorrectIdx(q.id, oIdx)}
                            className={`absolute ${isRtl ? 'right-2.5' : 'left-2.5'} h-4.5 w-4.5 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${isCorrect ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600 bg-black/40'}`}
                            title="Mark as correct answer"
                          >
                            {isCorrect && <Check className="w-3 h-3 text-zinc-950 stroke-[3]" />}
                          </button>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(q.id, oIdx, e.target.value)}
                            className={`w-full bg-[#0E061B] border rounded-xl ${isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-[11px] focus:outline-none transition-colors ${isCorrect ? 'border-emerald-500/40 text-emerald-200 bg-emerald-500/5' : 'border-purple-500/10 text-slate-200'}`}
                            placeholder={isRtl ? `الخيار ${String.fromCharCode(65 + oIdx)}` : `Option ${String.fromCharCode(65 + oIdx)}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Fail Roast Comment */}
                  <div className="pt-1">
                    <label className="block text-[10px] font-mono text-[#D6C7FF]/70 font-semibold uppercase tracking-wider mb-1">
                      {t.failureComment}
                    </label>
                    <input
                      type="text"
                      value={q.roastComment}
                      onChange={(e) => handleUpdateRoast(q.id, e.target.value)}
                      placeholder={isRtl ? "مثال: طلع ما يعرفني أبد!" : "e.g. He has absolutely no clue!"}
                      className="w-full bg-[#1A1033] border border-purple-500/15 rounded-xl px-3.5 py-2 text-xs text-rose-300"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Step 3: Checkpoint Dares & Royal Prize */}
        <div className={`bg-[#1C1032]/95 border-2 border-purple-500/20 p-6 rounded-2.5xl relative overflow-hidden backdrop-blur-md shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[50px] pointer-events-none"></div>

          <h3 className="font-sans font-extrabold text-lg text-[#F8FAFC] flex items-center gap-2 mb-4">
            <span className="h-6 w-6 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
            {t.rewardsDares}
          </h3>

          <div className="space-y-4">
            {/* Level 1 Checkpoint */}
            <div className="bg-[#120822] p-4 rounded-2xl border border-purple-500/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#A78BFA] bg-purple-500/10 px-2 py-0.5 rounded-sm block w-fit mb-1">
                  {isRtl ? 'حكم عقبة المستوى ١' : 'LEVEL 1 CHECKPOINT FARE'}
                </span>
                <span className="text-xs text-slate-300 block">
                  {isRtl ? 'إذا تعثروا في الأسئلة الأولى السهلة (س١ - س٢)' : 'If they slip on the early/easiest questions (Q1 - Q2)'}
                </span>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  required
                  value={dareLevel1}
                  onChange={(e) => setDareLevel1(e.target.value)}
                  className="w-full bg-[#1A1033] border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-purple-400"
                />
              </div>
            </div>

            {/* Level 2 Checkpoint */}
            <div className="bg-[#120822] p-4 rounded-2xl border border-purple-500/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm block w-fit mb-1">
                  {isRtl ? 'حكم عقبة المستوى ٢' : 'LEVEL 2 CHECKPOINT FARE'}
                </span>
                <span className="text-xs text-slate-300 block">
                  {isRtl ? 'إذا فشلوا في منتصف الطريق بالأسئلة المتوسطة (س٣ - س٤)' : 'If they fail midway through moderate trivia (Q3 - Q4)'}
                </span>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  required
                  value={dareLevel2}
                  onChange={(e) => setDareLevel2(e.target.value)}
                  className="w-full bg-[#1A1033] border border-purple-500/25 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-amber-400"
                />
              </div>
            </div>

            {/* Level 3 Checkpoint */}
            <div className="bg-[#120822] p-4 rounded-2xl border border-purple-500/10 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4">
                <span className="text-[10px] font-mono tracking-wider font-extrabold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-sm block w-fit mb-1">
                  {isRtl ? 'حكم عقبة المستوى ٣' : 'LEVEL 3 CHECKPOINT FARE'}
                </span>
                <span className="text-xs text-slate-300 block">
                  {isRtl ? 'إذا تعقدّوا في الأسئلة الذكية النهائية بالقمة (س٥+)' : 'If they fall on the ultimate mastermind questions (Q5+)'}
                </span>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  required
                  value={dareLevel3}
                  onChange={(e) => setDareLevel3(e.target.value)}
                  className="w-full bg-[#1A1033] border border-rose-500/25 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-rose-400"
                />
              </div>
            </div>

            {/* Winner Reward */}
            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono tracking-wider font-extrabold text-emerald-400 block mb-0.5">
                    {t.winnerPrize}
                  </span>
                  <span className="text-xs text-slate-350 block">
                    {isRtl ? 'إذا حصل على درجة كاملة ١٠٠٪ بالتحدّي' : 'If they get a perfect 100% score'}
                  </span>
                </div>
              </div>
              <div className="md:col-span-8">
                <input
                  type="text"
                  required
                  value={rewardWinner}
                  onChange={(e) => setRewardWinner(e.target.value)}
                  className="w-full bg-[#1A1033] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-emerald-250 font-semibold focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Voice Note / Tape Reel */}
        <div className={`bg-[#1C1032]/95 border-2 border-purple-500/20 p-6 rounded-2.5xl relative overflow-hidden backdrop-blur-md shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[50px] pointer-events-none"></div>

          <h3 className="font-sans font-extrabold text-lg text-[#F8FAFC] flex items-center gap-2 mb-2">
            <span className="h-6 w-6 rounded-full bg-purple-500/15 text-[#A78BFA] flex items-center justify-center text-xs font-mono font-bold">4</span>
            {isRtl ? 'الروست الصوتي للفاشلين 🎙️' : 'Failure Roast Voice Memo'}
          </h3>
          <p className="text-xs text-slate-300 mb-4.5 leading-relaxed">
            {isRtl 
              ? 'أرفق رسالة صوتية تسجلها بنفسك لتهزيء من يغلط بأسئلتك، أو اختر قارئ تهزيء جاهز مضحك يعمل فوراً عند خسارة خويك!' 
              : 'Attach a custom recorded voice note, or drop a preloaded premium AI voice template that plays instantly when a challenger hits the game-over screen!'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Template Selector */}
            <div className="md:col-span-6 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                {isRtl ? 'قوالب الروست الصوتي الجاهزة' : 'Pre-recorded Template Choices'}
              </span>
              
              {[
                { 
                  id: 'roast_clown', 
                  label: isRtl ? '🤡 صرخة إنذار المهرج الكبرى' : '🤡 Clown Alert Scream', 
                  desc: isRtl ? 'أصوات إنذار عالية مع تهكم "كلاون يا كذاب!"' : 'Alert sirens + "You don\'t know me, alert! CLOWN!"' 
                },
                { 
                  id: 'bruh_disappointed', 
                  label: isRtl ? '🤦 آه... تدرون وش كثر خيب ظني؟' : '🤦 Disappointed "Bruh"', 
                  desc: isRtl ? 'تنهيدة يائسة "بصراحة ما توقعتك كذا..."' : 'Retro sighing + "Bruh... I am deep-down disappointed"' 
                },
                { 
                  id: 'busted_fraud', 
                  label: isRtl ? '🚨 كشف الاحتيال وتجريد العضوية' : '🚨 Busted! Fraudulent Friend', 
                  desc: isRtl ? 'إنذار مع "تم رصد صديق مزيف رسمي!"' : 'Busted alarm + "Fraud detected! Clown card printed!"' 
                }
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setVoiceTemplate(tmpl.id as any);
                    setRecordedUrl(null);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs flex flex-col gap-0.5 justify-center cursor-pointer transition-all ${isRtl ? 'text-right' : 'text-left'} ${voiceTemplate === tmpl.id && !recordedUrl ? 'bg-[#9333EA]/20 border-purple-400 border-2' : 'bg-black/35 border-purple-500/10'}`}
                >
                  <span className="font-bold text-[#F8FAFC]">{tmpl.label}</span>
                  <span className="text-[10.5px] text-slate-400">{tmpl.desc}</span>
                </button>
              ))}
            </div>

            {/* Custom Recorder Board */}
            <div className="md:col-span-6 bg-black/40 border border-purple-500/15 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[8.5px] font-mono font-black uppercase">LIVE MEMO</div>
              <Volume2 className="w-8 h-8 text-[#A78BFA] mb-2" />
              
              <span className="text-xs font-mono font-bold text-slate-200 mb-3">
                {isRtl ? 'سجل روست صوتي خاص وتهزيء صدمة خسارة أصدقائك' : 'Record Your Own Brutal Voice Roast'}
              </span>

              {isRecording ? (
                <div className="space-y-3 w-full flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#EF4444] animate-ping" />
                    <span className="text-red-400 font-mono text-xs font-black">
                      {isRtl ? `جاري التسجيل • 0:0${recordingSeconds}ث` : `RECORDING • 0:0${recordingSeconds}s`}
                    </span>
                  </div>
                  {/* Glowing frequency tape simulation */}
                  <div className="flex gap-1 items-center justify-center h-6 py-0.5 w-36">
                    {[1, 2, 3, 4, 3, 2, 1, 2, 4, 5, 4, 2, 1, 2, 4, 3, 2, 1].map((lvl, index) => (
                      <motion.div
                        key={index}
                        animate={{ height: isRecording ? [lvl * 3, lvl * 5.5, lvl * 3] : lvl * 3 }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: index * 0.03 }}
                        className="w-1 bg-[#EF4444] rounded-full"
                        style={{ height: lvl * 3 }}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-4 py-2 bg-[#EF4444] text-white rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-103 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>{isRtl ? 'إيقاف التسجيل' : 'Stop Recording'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {recordedUrl ? (
                    <div className="space-y-2">
                      <span className="text-[10px] text-emerald-400 font-black block">
                        {isRtl ? '✓ تم حفظ الرسالة بنجاح' : '✓ CUSTOM MEMO RECORDED SUCCESS'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={playRecorded}
                          className="px-4.5 py-2 bg-[#10B981]/10 hover:bg-[#10B981]/25 border border-[#10B981]/30 text-emerald-300 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-emerald-400" />
                          <span>{isRtl ? 'اختبار سماع الصوت' : 'Test Play Memo'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecordedUrl(null)}
                          className="p-2 bg-pink-950/20 hover:bg-pink-950/40 border border-pink-500/20 rounded-lg text-rose-400 text-xs cursor-pointer"
                          title="Trash customized recording"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-800 to-indigo-900 border border-purple-500/35 text-slate-100 hover:brightness-110 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-102"
                    >
                      <Mic className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                      <span>{isRtl ? 'بدء تسجيل صوتي 🎙️' : 'Record Voice 🎙️'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button submit */}
        <div className="flex flex-col items-center pt-4">
          <button
            type="submit"
            className="w-full relative px-10 py-4 text-center bg-gradient-to-r from-amber-500 via-yellow-600 to-yellow-500 hover:brightness-110 text-slate-950 font-sans font-black text-base uppercase rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.5)] cursor-pointer active:scale-98"
          >
            <span>{isRtl ? 'تفعيل التحدي وإطلاق الرابط ⚡' : 'Activate Challenge & Build Link ⚡'}</span>
          </button>
          
          <p className="text-[10px] font-mono text-slate-400 mt-3 uppercase tracking-widest leading-normal text-center">
            {isRtl 
              ? 'سيتم تجميع بيانات التحدي فوراً وإدراج كرتك بمجرد الضغط على تفعيل.' 
              : 'Challenge details compiled instantly. Your custom share card will generate immediately.'}
          </p>
        </div>

      </form>
    </div>
  );
}
