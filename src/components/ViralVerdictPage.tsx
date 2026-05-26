/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Radio, Share2, Copy, Check, Star, MapPin, Skull, Download, Eye, ShieldAlert, Award } from 'lucide-react';
import { BroQuiz, ChallengerAttempt } from '../types';

interface ViralVerdictPageProps {
  radar: any; // BroQuiz
  lastSubmittedObserver: ChallengerAttempt | null;
  onCreateMyOwnRadar: () => void;
}

export default function ViralVerdictPage({ radar, lastSubmittedObserver, onCreateMyOwnRadar }: ViralVerdictPageProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [stickerColor, setStickerColor] = useState<'amber' | 'crimson' | 'emerald'>('amber');
  const cardNodeRef = useRef<HTMLDivElement>(null);

  const attempt = lastSubmittedObserver || {
    challengerName: 'Adnan Al-Mansoori',
    score: 3,
    totalQuestions: 6,
    failedOnQuestionText: 'What is my actual dream car?',
    failedLevel: 'level2',
    dareAssigned: 'Send a hilarious 15s voice note of you singing our childhood song 🎵',
    status: 'dare_accepted',
    city: 'Dubai',
    timestamp: 'Just now',
    avatarSeed: 4
  } as ChallengerAttempt;

  const handleLabel = attempt.challengerName;
  const isWinner = attempt.status === 'survived';
  
  // Custom status texts
  const statusLabels = {
    survived: '👑 CERTIFIED TRUE BRO',
    wimped_out: '🏃 CERTIFIED COWARD (Wimped)',
    dare_accepted: '🤡 DARE ACCEPTED (Clown Card Active)',
    immunity_used: '🛡️ SAVED BY IMMUNITY SHIELD'
  };

  const statusLabel = statusLabels[attempt.status as keyof typeof statusLabels] || statusLabels.dare_accepted;

  // Custom text for sharing to clipboard
  const verdictText = isWinner
    ? `I just scored 100% on @${radar.displayName}'s BroCard Quiz! 🏆\n` +
      `Unlocked Reward: ${radar.rewardWinner}\n` +
      `Prove you're a real friend! Battle here at BroCard.`
    : `Busted! I failed @${radar.displayName}'s BroCard loyalty check on level ${attempt.failedLevel}! 🤡\n` +
      `My Assigned Dare: ${attempt.dareAssigned}\n` +
      `Excuse: "${attempt.excuseMsg || 'No excuse, I am a fraud.'}"`;

  const handleCopyVerdict = () => {
    navigator.clipboard.writeText(verdictText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pure HTML5 Canvas rendering backup that works everywhere (even inside iframes)
  // Completely avoids index, html2canvas, and oklch parsing errors!
  const generateAndDownloadSticker = () => {
    setDownloading(true);
    
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background Draw with standard hex/RGB gradients
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        if (isWinner) {
          grad.addColorStop(0, '#022C22'); // Emerald
          grad.addColorStop(1, '#064E3B');
        } else {
          grad.addColorStop(0, '#310A21'); // Crimson/Onyx
          grad.addColorStop(1, '#0F040E');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 600, 600);

        // Frame Border Outline
        ctx.strokeStyle = isWinner ? '#34D399' : '#F43F5E';
        ctx.lineWidth = 14;
        ctx.strokeRect(15, 15, 570, 570);

        // Card Header Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BROCARD CHALLENGE VERDICT', 300, 70);

        ctx.fillStyle = isWinner ? '#34D399' : '#EF4444';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(statusLabel.toUpperCase(), 300, 105);

        // Large graphics seal
        ctx.font = '72px serif';
        ctx.fillText(isWinner ? '👑' : '🤡', 300, 200);

        // Challenger Details
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px font-sans';
        ctx.fillText(handleLabel, 300, 265);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '16px monospace';
        ctx.fillText(`Tested via ${attempt.city} Location Node • Score: ${attempt.score}/${attempt.totalQuestions}`, 300, 305);

        // Main info message block
        ctx.fillStyle = isWinner ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)';
        ctx.fillRect(50, 335, 500, 110);
        ctx.strokeStyle = isWinner ? '#10B981' : '#F43F5E';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 335, 500, 110);

        // Text inside the blocks
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold italic 13px sans-serif';
        
        if (isWinner) {
          ctx.fillText('🏆 UNLOCKED GRAND REWARD 🏆', 300, 365);
          ctx.font = 'bold 15px sans-serif';
          ctx.fillStyle = '#34D399';
          ctx.fillText(`"${radar.rewardWinner}"`, 300, 395);
        } else {
          ctx.fillText(`⚠️ CHECKPOINT STAKE: ${attempt.failedLevel.toUpperCase()} PENALTY ⚠️`, 300, 365);
          ctx.font = '14px sans-serif';
          ctx.fillStyle = '#FCA5A5';
          ctx.fillText(`"${attempt.dareAssigned}"`, 300, 395);
        }

        // Subtext Excuse
        ctx.fillStyle = '#CBD5E1';
        ctx.font = 'italic 13px sans-serif';
        ctx.fillText(`Excuse: "${attempt.excuseMsg || 'None provided. Absolute silence.'}"`, 300, 425);

        // Footer watermarks
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`BROCARD: BRO VS BRO BY ${radar.displayName.toUpperCase()}`, 300, 520);
        ctx.font = '9px monospace';
        ctx.fillText('SCAN OUT FAKE FRIENDS - HTTPS://BROCARD.AI', 300, 545);

        // Download Trigger
        const imageURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${handleLabel}_brocard_verdict_high_resolution.png`;
        link.href = imageURL;
        link.click();
      } catch (err) {
        console.error("Canvas export failed:", err);
      }
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-lg px-4 py-8 mx-auto pb-28 text-center scroll-smooth">
      {/* Background radial glow */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 ${isWinner ? 'bg-emerald-500/10' : 'bg-rose-500/10'} rounded-full blur-[80px] pointer-events-none`} />

      {/* SECURED TRANSMISSION BANNER */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full mb-6 ${isWinner ? 'bg-emerald-500/10 border border-emerald-500/35 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/35 text-rose-400'}`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
        <span className="font-mono text-[9px] tracking-widest uppercase font-black">
          {isWinner ? 'TRUE BRO CERTIFIED • إثبات الوفاء' : 'STORY ROAST LAUNCHED • تم حفظ العقوبة'}
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h2
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl sm:text-4xl font-display font-black italic text-slate-100 tracking-tight"
      >
        {isWinner ? "You're a True Brother!" : "You got SAVAGELY Roasted!"}
      </motion.h2>

      <p className="font-mono text-[10px] text-amber-400 tracking-widest mt-1 uppercase block">
        {isWinner ? 'لقد أكملت اختبار الوفاء بنجاح' : 'بطاقة الخجل طبعت بنجاح'}
      </p>

      {/* Outer block info */}
      <p className="text-xs text-slate-300 max-w-xs mx-auto mt-2.5 leading-relaxed">
        {isWinner 
          ? `Your pristine 100% metrics have been recorded in ${radar.displayName}'s high circle spotlight.`
          : `You failed on question level ${attempt.failedLevel}. Your clown card of shame has been logged in ${radar.displayName}'s records.`}
      </p>

      {/* THE SHAREABLE VERDICT STICKER CONTAINER */}
      {/* Hand-styled with direct solid HEX/RGB properties to avoid html2canvas OKLCH parsing issues! */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        ref={cardNodeRef}
        className="mt-8 p-6.5 rounded-3xl shadow-2xl relative text-left border-3"
        style={{
          background: isWinner 
            ? 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)' 
            : 'linear-gradient(135deg, #2E0B20 0%, #120511 100%)',
          borderColor: isWinner ? '#10B981' : '#F43F5E',
          boxShadow: isWinner 
            ? '0 10px 30px rgba(16,185,129,0.25)' 
            : '0 10px 30px rgba(244,63,94,0.25)',
          color: '#F8FAFC'
        }}
      >
        {/* Holographic sparkle */}
        <Star className="absolute top-4 right-4 w-4 h-4 text-yellow-300 opacity-60 animate-pulse" />

        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
            {isWinner ? 'BROMANCE ALL-STAR SEAL' : 'CLOWN CARD TRANSMISSION'}
          </span>
          <span className="font-mono text-[9px] text-zinc-950 bg-amber-400 px-2 py-0.5 rounded font-black">
            {isWinner ? 'CLASS S++' : 'CLASS FRAUD'}
          </span>
        </div>

        {/* Challenger display info */}
        <div className="flex items-center gap-3.5 mb-5.5">
          <div className={`h-11 w-11 rounded-full flex items-center justify-center text-zinc-950 shadow-md ${isWinner ? 'bg-emerald-400' : 'bg-rose-400'}`}>
            <span className="text-xl">{isWinner ? '👑' : '🤡'}</span>
          </div>
          <div>
            <h4 className="text-base font-black text-white font-mono leading-none">
              {handleLabel}
            </h4>
            <span className="text-[10px] text-slate-300 flex items-center gap-1 mt-1 font-mono">
              <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Logged from {attempt.city} Node</span>
            </span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="space-y-2.5 bg-black/60 p-4 rounded-xl border border-white/5 mb-4.5 text-xs font-mono">
          <div className="flex justify-between text-slate-300">
            <span>Overall Score:</span>
            <span className={`${isWinner ? 'text-emerald-400' : 'text-rose-400'} font-black`}>{attempt.score} / {attempt.totalQuestions} Correct</span>
          </div>
          
          <div className="flex justify-between text-slate-300 pt-1 border-t border-white/5">
            <span>Result Status:</span>
            <span className="text-yellow-300 font-bold">{statusLabel}</span>
          </div>

          <div className="flex flex-col gap-1 text-slate-350 pt-2 border-t border-white/5">
            <span className="text-[9px] text-[#A78BFA] font-bold block uppercase">
              {isWinner ? 'UNLOCKED PRIZE REWARD:' : 'CHECKPOINT ASSIGNED DARE:'}
            </span>
            <span className={`text-[11.5px] italic font-black font-sans leading-relaxed ${isWinner ? 'text-emerald-300' : 'text-rose-300'}`}>
              "{isWinner ? radar.rewardWinner : attempt.dareAssigned}"
            </span>
          </div>
        </div>

        {attempt.excuseMsg && (
          <p className="text-xs text-slate-300 bg-white/5 py-2 px-3 rounded-lg italic border-l-2 border-yellow-400 mb-4 leading-normal">
            " {attempt.excuseMsg} "
          </p>
        )}

        {/* Share buttons on Card */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyVerdict}
            className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-white"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>COPIED SAVED TEXT</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>COPY TEXT</span>
              </>
            )}
          </button>

          <button
            onClick={generateAndDownloadSticker}
            disabled={downloading}
            className={`flex-1 py-2.5 ${isWinner ? 'bg-emerald-400 text-zinc-950' : 'bg-rose-500 text-white'} rounded-xl text-[11px] font-mono font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer`}
          >
            {downloading ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>DOWNLOAD STICKER</span>
          </button>
        </div>
      </motion.div>

      {/* Playful warning block */}
      <div className="mt-8 p-4.5 bg-[#1C1032]/80 border border-purple-500/15 rounded-2xl flex items-center gap-3.5 text-left">
        <ShieldAlert className="w-9 h-9 text-rose-500 shrink-0" />
        <div>
          <span className="text-[9.5px] font-mono text-rose-400 font-extrabold uppercase">STORY STICKER WARNING</span>
          <p className="text-[11px] text-slate-300 leading-normal mt-0.5 font-sans">
            Make sure to download your high-res sticker and upload it directly to your Snapchat story context. Roast your friends immediately!
          </p>
        </div>
      </div>

      {/* Return to launch your own */}
      <div className="mt-8">
        <button
          onClick={onCreateMyOwnRadar}
          className="w-full relative py-4 bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#CA8A04] text-zinc-950 font-sans font-black text-sm uppercase rounded-xl transition-all duration-300 shadow-md hover:brightness-115 active:scale-98"
        >
          <span>Claim My Own BroCard Quiz Handle ⚔️</span>
        </button>
        <p className="text-[9.5px] font-mono text-[#D6C7FF]/40 mt-3 uppercase tracking-wider block">
          Setup custom questions & filter out fake friends today.
        </p>
      </div>

    </div>
  );
}
