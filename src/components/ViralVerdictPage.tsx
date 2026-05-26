/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Radio, Share2, Copy, Check, Star } from 'lucide-react';
import { Radar, Observer } from '../types';

interface ViralVerdictPageProps {
  radar: Radar;
  lastSubmittedObserver: Partial<Observer> | null;
  onCreateMyOwnRadar: () => void;
}

export default function ViralVerdictPage({ radar, lastSubmittedObserver, onCreateMyOwnRadar }: ViralVerdictPageProps) {
  const [copied, setCopied] = React.useState(false);

  // Generate a random score if something gets skipped
  const handleLabel = lastSubmittedObserver?.handle || 'Mysterious Observer';
  const score = lastSubmittedObserver?.interestScore || 85;
  const answer = lastSubmittedObserver?.answer || 'Every single day.';
  const city = lastSubmittedObserver?.city || 'Jeddah';

  const verdictText = `🔮 I just entered @${radar.displayName}'s private Social Radar via Muraqib!\n` +
    `⚡ Integrity Signal: ${answer}\n` +
    `📈 Attraction Quotient: ${score}% Match\n` +
    `✨ Create your private Live Radar link at Muraqib and scan your circle!`;

  const handleCopyVerdict = () => {
    navigator.clipboard.writeText(verdictText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-lg px-4 py-8 mx-auto pb-24 text-center">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Verification Badge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-1.5 bg-[#34D399]/10 border border-[#34D399]/25 px-4 py-1.5 rounded-full mb-6"
      >
        <Check className="w-3.5 h-3.5 text-[#34D399] stroke-[3]" />
        <span className="font-mono text-[9px] text-[#34D399] tracking-widest uppercase font-black">
          TRANSMISSION SECURED • تم إرسال الإشارة
        </span>
      </motion.div>

      <motion.h2
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-slate-100 font-sans"
      >
        You Entered Their Radar.
      </motion.h2>
      
      <p className="font-mono text-xs text-amber-500 mt-1 uppercase tracking-widest">
        لقد اخترقت رادارهم بنجاح
      </p>

      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-xs text-[#D6C7FF]/70 max-w-xs mx-auto mt-3 leading-relaxed"
      >
        Your digital aura metrics have been logged securely in <span className="text-[#A78BFA] font-medium">{radar.displayName}</span>'s Studio Suite.
      </motion.p>

      {/* Custom Shareable Verdict Card Panel */}
      <motion.div
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        id="share-card"
        className="mt-8 p-6 bg-gradient-to-b from-[#24143A] to-[#120822] border border-purple-500/25 rounded-3xl shadow-2xl relative text-left overflow-hidden"
      >
        {/* Sparkly watermark */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/15 rounded-full blur-xl" />
        <Star className="absolute top-4 right-4 w-4 h-4 text-amber-400 opacity-45 animate-pulse" />

        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-mono tracking-widest text-[#B6A8D6]/60 uppercase">
            Observer Signal Summary
          </span>
          <span className="font-mono text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-xs border border-amber-500/20">
            CLASS S SIGNAL
          </span>
        </div>

        {/* Profile Info */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="relative h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-slate-100 text-sm shadow-md">
            📡
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 font-mono">
              {handleLabel}
            </h4>
            <span className="text-[10px] text-[#D6C7FF]/60 block leading-none mt-1">
              📍 Logged via {city} Node
            </span>
          </div>
        </div>

        {/* Dynamic Metric Rows */}
        <div className="space-y-2.5 bg-[#120822]/80 p-3.5 rounded-xl border border-purple-500/10 mb-4 text-xs font-mono">
          <div className="flex justify-between text-[#B6A8D6]">
            <span>Integrity Selection:</span>
            <span className="text-slate-100 font-bold">{answer}</span>
          </div>
          <div className="flex justify-between text-[#B6A8D6]">
            <span>Active Spot Pings:</span>
            <span className="text-[#34D399] font-bold">1 Node Pulse</span>
          </div>
          <div className="flex justify-between text-[#B6A8D6] pt-1.5 border-t border-purple-500/10">
            <span>Attraction Quotient:</span>
            <span className="text-amber-400 font-extrabold text-sm">{score}% Match</span>
          </div>
        </div>

        {/* Action Button to copy card code */}
        <button
          onClick={handleCopyVerdict}
          className="w-full py-2.5 bg-purple-950/45 hover:bg-purple-900/30 border border-purple-500/20 text-[#D6C7FF] hover:text-slate-100 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all pointer-cursor active:scale-97"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>COPIED CODE TO CLIPBOARD!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-500" />
              <span>COPY VERDICT SHARER CARD</span>
            </>
          )}
        </button>
      </motion.div>

      {/* Vital loop: 12 observers premium warning */}
      <div className="mt-8 p-5 bg-gradient-to-r from-purple-950/30 to-pink-950/20 border border-purple-500/15 rounded-2xl">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-xs text-[10px] text-amber-300 font-mono font-bold mb-2 uppercase">
          🚨 Critical Warning • تنبيه ملكي
        </span>
        <p className="text-xs text-slate-200 leading-relaxed max-w-sm mx-auto font-sans">
          Could there be <span className="text-amber-400 font-black">12 secret admirers</span> waiting to click your private radar stories? See who's visiting your links in the dark.
        </p>
      </div>

      {/* Redirection loop to Create */}
      <div className="mt-8">
        <button
          id="claim-radar-btn"
          onClick={onCreateMyOwnRadar}
          className="w-full relative py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1C0F35] font-sans font-black text-sm uppercase rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(250,204,21,0.2)] hover:shadow-[0_4px_35px_rgba(250,204,21,0.4)] cursor-pointer active:scale-98"
        >
          <span>Claim My Sovereign Radar Link 👑</span>
        </button>
        
        <p className="text-[10px] font-mono text-[#D6C7FF]/40 mt-3.5 uppercase tracking-wider">
          Establish your own Crown Council in Doha, Riyadh, and Kuwait City instantly.
        </p>
      </div>
    </div>
  );
}
