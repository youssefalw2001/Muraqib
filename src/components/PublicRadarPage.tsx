/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Eye, Radio, Sparkles, MapPin, Smartphone, Trophy, Flame, Play, Volume2, ArrowRight, CornerDownRight, Frown, CheckCircle } from 'lucide-react';
import { BroQuiz, ChallengerAttempt, BroTheme } from '../types';
import { GCC_CITIES } from '../data';

interface PublicRadarPageProps {
  radar: any; // BroQuiz
  onSignalSubmitted: (newAttempt: ChallengerAttempt) => void;
}

export default function PublicRadarPage({ radar, onSignalSubmitted }: PublicRadarPageProps) {
  // Game states: 'lobby' | 'playing' | 'failed' | 'survived'
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'failed' | 'survived'>('lobby');
  
  // Challenger attributes
  const [challengerName, setChallengerName] = useState('');
  const [simulatedCity, setSimulatedCity] = useState(GCC_CITIES[0]);

  // Quiz progression
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerSuccess, setAnswerSuccess] = useState<boolean | null>(null);

  // Failure values
  const [failedQuestionText, setFailedQuestionText] = useState<string | null>(null);
  const [failedLevel, setFailedLevel] = useState<'level1' | 'level2' | 'level3' | 'none'>('none');
  const [assignedDare, setAssignedDare] = useState('');
  const [isTapePlaying, setIsTapePlaying] = useState(false);

  // Excuse message for final leaderboard
  const [excuseMsg, setExcuseMsg] = useState('');

  const questions = radar.questions || [];
  const currentQ = questions[currentQIdx];

  // Colors & Themes
  const themeStyles: Record<BroTheme, { mainBg: string; borderGlow: string; bgCard: string; accent: string; text: string }> = {
    onyx: {
      mainBg: 'from-[#120822] to-[#1C1032]',
      borderGlow: 'border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.15)]',
      bgCard: 'bg-[#150D2E]/95',
      accent: 'text-violet-400',
      text: 'text-slate-100'
    },
    royalCrimson: {
      mainBg: 'from-[#1F081C] to-[#400827]',
      borderGlow: 'border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
      bgCard: 'bg-[#2E091E]/95',
      accent: 'text-rose-400',
      text: 'text-slate-100'
    },
    cyberToxic: {
      mainBg: 'from-[#02100C] to-[#042416]',
      borderGlow: 'border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      bgCard: 'bg-[#031510]/95',
      accent: 'text-emerald-400',
      text: 'text-emerald-50',
    },
    riyadhGold: {
      mainBg: 'from-[#120D04] to-[#2B1B04]',
      borderGlow: 'border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      bgCard: 'bg-[#1D1205]/95',
      accent: 'text-amber-400',
      text: 'text-amber-50'
    }
  };

  const currentTheme = themeStyles[radar.theme as BroTheme] || themeStyles.onyx;

  // Audio/Speech Synthesis Trigger helper
  const handlePlayVoiceRoastMessage = () => {
    setIsTapePlaying(true);
    let spokenText = `Alert! Alert! Clown card printed. ${challengerName} failed completely!`;

    if (radar.voiceNoteDataUrl) {
      if (radar.voiceNoteDataUrl === 'SIMULATED_RECORDING_DATA_ACTIVE') {
        spokenText = `Hey bro! You absolutely failed my loyalty quiz on screen! You don't know me at all. Now accept the dare!`;
      } else {
        // Real base64 audio
        const audio = new Audio(radar.voiceNoteDataUrl);
        audio.play().catch(() => {
          // Speak fallback
          const utterance = new SpeechSynthesisUtterance(spokenText);
          window.speechSynthesis.speak(utterance);
        });
        setTimeout(() => setIsTapePlaying(false), 5000);
        return;
      }
    } else {
      // Use template
      if (radar.voiceNoteTemplateId === 'roast_clown') {
        spokenText = `Hahaha! Clown alert on screen! Bro, ${challengerName} just failed on question ${currentQIdx + 1}. You are officially a fake broker! Do the dare right now!`;
      } else if (radar.voiceNoteTemplateId === 'bruh_disappointed') {
        spokenText = `Bruuuuh! I am deep down disappointed in you, ${challengerName}. I thought you were my real brother, but you're just an observer of my stories! Cruel.`;
      } else if (radar.voiceNoteTemplateId === 'busted_fraud') {
        spokenText = `Busted! Fraud detected! ${challengerName} has triggered the ultimate checkpoint penalty. Go buy some immunity or start doing the dare. Sad behavior!`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.pitch = 0.95;
    utterance.rate = 1.05;
    utterance.onend = () => setIsTapePlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStartGame = () => {
    if (!challengerName.trim()) return;
    setGameState('playing');
    setCurrentQIdx(0);
    setScore(0);
    setSelectedOptIdx(null);
    setIsAnswering(false);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswering) return;
    setSelectedOptIdx(idx);
    setIsAnswering(true);

    const correct = idx === currentQ.correctIdx;
    setAnswerSuccess(correct);

    if (correct) {
      setScore(prev => prev + 1);
      // Play brief dynamic system synthesizer sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {}

      // Move forward automatically after short delay or wait for CTA click
      setTimeout(() => {
        if (currentQIdx + 1 < questions.length) {
          setCurrentQIdx(prev => prev + 1);
          setSelectedOptIdx(null);
          setIsAnswering(false);
          setAnswerSuccess(null);
        } else {
          setGameState('survived');
        }
      }, 1500);
    } else {
      // Failed! Determine checkpoint dare based on current progress
      setFailedQuestionText(currentQ.text);
      
      let level: 'level1' | 'level2' | 'level3' = 'level1';
      let dareText = radar.dareLevel1;

      if (currentQIdx >= 4) {
        level = 'level3';
        dareText = radar.dareLevel3;
      } else if (currentQIdx >= 2) {
        level = 'level2';
        dareText = radar.dareLevel2;
      }

      setFailedLevel(level);
      setAssignedDare(dareText);

      // Play robotic synth buzz sound
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(90, audioCtx.currentTime + 0.15); 
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {}

      setTimeout(() => {
        setGameState('failed');
        // Auto-fire the voice note to surprise them instantly for massive shock value!
        setTimeout(() => {
          handlePlayVoiceRoastMessage();
        }, 600);
      }, 1500);
    }
  };

  const handleFinishAttempt = (status: 'survived' | 'wimped_out' | 'dare_accepted' | 'immunity_used') => {
    const finalAttempt: ChallengerAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: radar.id,
      challengerName: challengerName.trim() || 'anonymous.mate',
      score,
      totalQuestions: questions.length,
      failedOnQuestionText: failedQuestionText,
      failedLevel,
      dareAssigned: status === 'survived' ? 'None - Certified Bro!' : assignedDare,
      status,
      city: simulatedCity.split(',')[0],
      timestamp: 'Just now',
      avatarSeed: Math.floor(Math.random() * 10) + 1,
      excuseMsg: excuseMsg.trim() || undefined,
      deviceType: 'iPhone 15 Pro'
    };

    onSignalSubmitted(finalAttempt);
  };

  return (
    <div className={`w-full max-w-xl px-4 py-8 mx-auto pb-32`}>
      
      {/* LOBBY VIEW */}
      {gameState === 'lobby' && (
        <div className={`rounded-3xl p-6 border-2 text-center text-slate-100 ${currentTheme.bgCard} ${currentTheme.borderGlow} animate-fadeIn`}>
          
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono text-[9px] text-rose-400 tracking-widest font-black uppercase">
              Loyalty Laser Firing • تحدي الفخ
            </span>
          </div>

          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 animate-spin-slow blur-xs`} />
            <div className="relative w-full h-full rounded-full bg-[#120822] flex items-center justify-center border-2 border-black text-rose-400">
              <Flame className="w-10 h-10 animate-bounce text-rose-400" />
            </div>
          </div>

          <h3 className="font-display font-black text-3xl uppercase tracking-tight text-slate-100">
            {radar.displayName}'s Challenge
          </h3>
          <p className="font-mono text-xs text-amber-400 mt-0.5">
            /brocard/{radar.slug}
          </p>

          {/* Connected City */}
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-purple-950/40 border border-purple-500/15 rounded-full text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-purple-250 font-semibold">{radar.displayName} resides in {radar.city}</span>
          </div>

          {/* Stakes description card */}
          <div className="bg-[#10071F]/90 p-4.5 rounded-2.5xl border border-purple-500/15 text-left my-6 space-y-3">
            <span className="text-[10px] font-mono text-amber-400 font-extrabold uppercase tracking-wide block">🎯 THE HIGH STAKES:</span>
            
            <div className="flex items-start gap-2 text-xs">
              <span className="text-emerald-400 font-bold">👑 SUCCESS PRIZE:</span>
              <p className="text-slate-200 font-semibold italic">"{radar.rewardWinner}"</p>
            </div>

            <div className="border-t border-purple-500/10 pt-2.5 space-y-1 text-slate-350 text-[11px] leading-relaxed">
              <p>⚠️ <span className="text-rose-400 font-bold">FAIL DARE WARNING</span>: Answer wrong once and you trigger checkpoints!</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Fail Q1-Q2: <span className="text-purple-300 font-medium">Lvl 1 Dare</span></li>
                <li>Fail Q3-Q4: <span className="text-amber-300 font-medium font-bold">Lvl 2 Dare</span></li>
                <li>Fail Q5+: <span className="text-rose-300 font-bold">Lvl 3 Dare</span></li>
              </ul>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase tracking-widest font-black mb-1.5">
                Challenger Nickname / اسمك المستعار
              </label>
              <input
                type="text"
                required
                value={challengerName}
                onChange={(e) => setChallengerName(e.target.value)}
                placeholder="e.g. Adnan.dxb, Turki_99"
                className="w-full bg-[#10071F] border border-purple-500/25 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-[#B6A8D6]/30 focus:outline-none focus:border-rose-400 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase tracking-widest font-black mb-1.5">
                Simulated Device Location
              </label>
              <select
                value={simulatedCity}
                onChange={(e) => setSimulatedCity(e.target.value)}
                className="w-full bg-[#10071F] border border-purple-500/25 rounded-xl pl-4 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-rose-400 transition-all"
              >
                {GCC_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartGame}
              disabled={!challengerName.trim()}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-slate-100 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-lg disabled:opacity-45 disabled:pointer-events-none active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Accept Battle ⚔️</span>
            </button>
          </div>
        </div>
      )}

      {/* PLAYING VIEW */}
      {gameState === 'playing' && (
        <div className={`rounded-3xl p-6 border-2 text-slate-100 relative overflow-hidden ${currentTheme.bgCard} ${currentTheme.borderGlow} animate-fadeIn text-left`}>
          
          {/* Header tracker */}
          <div className="flex justify-between items-center mb-5 border-b border-purple-500/10 pb-3">
            <span className="text-[10px] font-mono tracking-widest text-[#B6A8D6] font-extrabold uppercase">
              LOXY-PRO CHECK • LEVEL 0{currentQIdx + 1}
            </span>
            <div className="flex gap-1">
              {questions.map((_: any, idx: number) => (
                <div
                  key={idx}
                  className={`h-1.5 w-6 rounded-full transition-colors ${idx === currentQIdx ? 'bg-[#FACC15]' : idx < currentQIdx ? 'bg-[#10B981]' : 'bg-[#1C1032]'}`}
                />
              ))}
            </div>
          </div>

          {/* Difficulty indicator */}
          <div className="mb-4">
            <span className={`text-[9px] font-mono font-black uppercase px-2.5 py-1 rounded-sm ${currentQ.difficulty === 'easy' ? 'bg-[#10B981]/15 text-emerald-400 border border-emerald-500/25' : currentQ.difficulty === 'medium' ? 'bg-[#FACC15]/15 text-amber-400 border border-amber-500/25' : 'bg-[#EF4444]/15 text-rose-400 border border-rose-500/25'}`}>
              {currentQ.difficulty} difficulty • {currentQ.difficulty === 'easy' ? 'Easy Peasy' : currentQ.difficulty === 'medium' ? 'Trust Check' : 'Ultimate Master Check'}
            </span>
          </div>

          {/* Question Text */}
          <h4 className="text-xl sm:text-2xl font-display font-medium text-slate-100 italic mb-6 leading-normal">
            "{currentQ.text}"
          </h4>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedOptIdx === idx;
              let btnClass = 'border-purple-500/15 bg-black/35 text-slate-300 hover:border-purple-500/35 hover:bg-[#1E1134]/30';
              
              if (isSelected) {
                if (answerSuccess === true) {
                  btnClass = 'border-emerald-500 bg-emerald-950/40 text-emerald-250 font-bold';
                } else if (answerSuccess === false) {
                  btnClass = 'border-rose-500 bg-rose-950/40 text-rose-250 font-bold';
                } else {
                  btnClass = 'border-[#FACC15] bg-[#311C54] text-slate-100';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswering}
                  className={`w-full border rounded-2xl p-4 transition-all text-xs text-left font-sans flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-zinc-400 font-bold text-xs">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </span>
                  
                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${isSelected ? 'scale-105' : ''}`}>
                    {isSelected && (
                      <div className={`h-2 w-2 rounded-full ${answerSuccess === true ? 'bg-emerald-400' : answerSuccess === false ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive banner messages */}
          <AnimatePresence>
            {isAnswering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                {answerSuccess === true ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Correct answer! Proceeding to next level checkpoint...</span>
                  </div>
                ) : answerSuccess === false ? (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <Frown className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>BOOM! Wrong answer. Standby for roasting results...</span>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* FAILED / ROASTED DETAIL VIEW */}
      {gameState === 'failed' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#2E0B20] to-[#120511] border-2 border-rose-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center text-slate-100 animate-fadeIn scale-102">
            
            {/* Crown Shield alert stamp */}
            <div className="inline-flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 text-rose-400 px-3 py-1 rounded-full text-[9px] font-mono font-black uppercase mb-4.5">
              🛑 CRITICAL PENALTY ACTI • بطاقة شرف ضائعة
            </div>

            <h3 className="text-4xl font-display font-black tracking-tight text-rose-400 animate-pulse">
              GAME OVER
            </h3>
            <span className="font-mono text-xs text-rose-300 tracking-widest block uppercase mt-1">CANDIDATE REJECTED</span>

            {/* Simulated Tape Recorder visualizer */}
            <div className="bg-[#1D0818]/90 border border-rose-500/20 rounded-2.5xl p-4.5 my-6 relative overflow-hidden flex flex-col items-center">
              <div className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-mono">TAPE 01 // ROAST LEVEL {failedLevel.toUpperCase()}</div>
              
              {/* Cassette Tape reels */}
              <div className="relative w-40 h-24 bg-zinc-900 border-2 border-zinc-700 rounded-lg p-2 flex flex-col justify-between shadow-xl mb-3">
                <div className="bg-rose-600/20 text-center font-mono text-[9px] text-rose-200 py-0.5 border border-rose-500/20 rounded">
                  {radar.displayName}'s Savage Roast Rec.
                </div>
                
                {/* Reel holes */}
                <div className="flex justify-around items-center px-4.5 py-1">
                  <motion.div
                    animate={{ rotate: isTapePlaying ? 360 : 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="h-9 w-9 rounded-full bg-zinc-950 border-4 border-dashed border-rose-500/40"
                  />
                  <div className="h-4 w-12 bg-zinc-950 rounded flex items-center justify-center text-[7px] text-slate-400 font-mono">REEL</div>
                  <motion.div
                    animate={{ rotate: isTapePlaying ? 360 : 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="h-9 w-9 rounded-full bg-zinc-950 border-4 border-dashed border-rose-500/40"
                  />
                </div>
                
                <div className="bg-zinc-800 h-2 w-full rounded flex items-center justify-center">
                  <div className="w-1/2 h-0.5 bg-rose-400 animate-pulse" />
                </div>
              </div>

              {/* Tape speech button */}
              <button
                type="button"
                onClick={handlePlayVoiceRoastMessage}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold font-sans flex items-center justify-center gap-2 cursor-pointer transition-all ${isTapePlaying ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'}`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isTapePlaying ? 'Tape active/playing...' : 'Replay Voice Roast 🔊'}</span>
              </button>
            </div>

            {/* Display roast text comment */}
            <div className="bg-black/40 border border-purple-500/10 p-3.5 rounded-xl text-left text-xs mb-4.5 leading-relaxed">
              <span className="text-[10px] font-mono text-rose-400 uppercase font-black block mb-1">🔥 THE PERSONAL ROAST:</span>
              <p className="italic text-rose-200 font-medium">"{qIdx => questions[currentQIdx]?.roastComment || questions[currentQIdx - 1]?.roastComment || 'Wrong answer!'}"</p>
              <p className="text-[10px] text-slate-400 mt-2 block border-t border-purple-500/5 pt-1.5 flex items-center gap-1.5">
                <CornerDownRight className="w-3 h-3 text-[#A78BFA]" />
                <span>Failed on question: "{failedQuestionText}"</span>
              </p>
            </div>

            {/* Checkpoint Dare details */}
            <div className="bg-amber-500/5 border border-amber-500/25 p-4.5 rounded-2xl text-left relative overflow-hidden mb-6">
              <div className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[8.5px] font-mono font-bold uppercase">CHECKPOINT STAKE</div>
              
              <h5 className="text-[9px] font-mono text-amber-400 tracking-wider uppercase font-black mb-1">Must complete below dare:</h5>
              <div className="mt-2.5 text-xs text-amber-100 font-extrabold italic bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/15 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span>"{assignedDare}"</span>
              </div>
            </div>

            {/* excuse text-area msg */}
            <div className="text-left space-y-2 mb-6">
              <label className="block text-[10px] font-mono text-[#D6C7FF]/70 uppercase tracking-widest font-black">
                Type your defense excuse / عذرك الفني
              </label>
              <textarea
                value={excuseMsg}
                onChange={(e) => setExcuseMsg(e.target.value)}
                placeholder="e.g. Bro, I guessed wrong on purpose! Don't post this mock story haha..."
                rows={2}
                maxLength={100}
                className="w-full bg-black/60 border border-rose-500/15 rounded-xl px-4.5 py-2.5 text-xs text-slate-100 placeholder-[#B6A8D6]/30 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* Actions for failing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleFinishAttempt('dare_accepted')}
                className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all border border-rose-400/20"
              >
                🤡 Accept Dare & Submit
              </button>
              <button
                onClick={() => handleFinishAttempt('immunity_used')}
                className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all border border-blue-400/20 flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-blue-200 fill-blue-200" />
                <span>Use Immunity Card 🛡️</span>
              </button>
            </div>

            <button
              onClick={() => handleFinishAttempt('wimped_out')}
              className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-100 uppercase tracking-wide cursor-pointer transition-colors block mx-auto underline"
            >
              Wimp out and leave (Coward status) 🏃
            </button>
          </div>
        </div>
      )}

      {/* SURVIVED / WINNER PERFECT SCORE VIEW */}
      {gameState === 'survived' && (
        <div className="bg-gradient-to-b from-[#0A241F] to-[#04120F] border-2 border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center text-slate-100 animate-fadeIn">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-[9px] font-mono font-black uppercase mb-4.5">
            🏆 CERTIFIED TRUE BRO • الصديق التام
          </div>

          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/35">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>

          <h3 className="text-3xl font-display font-black tracking-tight text-emerald-400">
            PASSED WITH 100%!
          </h3>
          <span className="font-mono text-xs text-emerald-300 block tracking-widest mt-0.5 uppercase">STORY LEGEND STATUS</span>

          <div className="bg-[#051713]/90 border border-emerald-500/15 p-5 rounded-2.5xl my-6 text-left space-y-2.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-black block">🎁 UNLOCKED SULTAN REWARD:</span>
            <p className="font-sans text-sm font-extrabold text-slate-100 italic">
              "{radar.rewardWinner}"
            </p>
            <p className="text-[11px] text-emerald-200 block border-t border-emerald-500/10 pt-2 leading-relaxed">
              Congratulations! You are officially {radar.displayName}'s 100% loyal true brother! Leave a victorious remark to be featured on their leaderboard spotlight.
            </p>
          </div>

          {/* Excuse/Victory remark input */}
          <div className="text-left space-y-2 mb-6">
            <label className="block text-[10px] font-mono text-emerald-300 uppercase tracking-widest font-bold">
              Leave a victory remark / ملاحظة الفخر
            </label>
            <input
              type="text"
              value={excuseMsg}
              onChange={(e) => setExcuseMsg(e.target.value)}
              placeholder="e.g. Always had your back. Easiest test ever! EAT MY BAIL!"
              className="w-full bg-[#05100D] border border-emerald-500/20 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-emerald-300/20 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            onClick={() => handleFinishAttempt('survived')}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Lock Crown Council Spot 👑</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}

    </div>
  );
}
