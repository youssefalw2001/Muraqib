/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Radio, Shield, Heart, Trophy, Zap, Share2, Sparkles, ExternalLink } from 'lucide-react';
import RadarSweep from './RadarSweep';

interface LandingPageProps {
  onNavigate: (view: 'create' | 'dashboard' | 'boost') => void;
  mockSlug: string;
}

export default function LandingPage({ onNavigate, mockSlug }: LandingPageProps) {
  return (
    <div className="w-full flex flex-col items-center pb-24">
      {/* Hero Header Section */}
      <div className="relative w-full overflow-hidden pt-12 pb-16 px-4 flex flex-col items-center text-center">
        {/* Background ambient gold & violet glows */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-5 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-transparent border border-amber-500/30 px-3.5 py-1 rounded-full mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="font-mono text-[10px] text-amber-200 tracking-widest uppercase font-bold">
            GCC Premium Social Intelligence • المرْقَب
          </span>
        </motion.div>

        {/* Brand logo image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="w-28 h-28 rounded-2.5xl overflow-hidden mb-6 border-2 border-purple-500/30 shadow-[0_15px_40px_rgba(124,58,237,0.3)] relative animate-pulse-slow p-1 bg-gradient-to-tr from-purple-800 via-pink-600 to-amber-400"
        >
          <div className="w-full h-full bg-brand-bg rounded-2xl overflow-hidden flex items-center justify-center">
            <img 
              src="/src/assets/images/muraqib_logo_1779826875008.png" 
              alt="Muraqib Brand Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Main Brand Title & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight bg-gradient-to-b from-slate-100 via-slate-100 to-amber-200 bg-clip-text text-transparent leading-none drop-shadow-sm uppercase"
        >
          MURAQIB
        </motion.h1>
        
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[11px] font-mono tracking-[0.3em] text-amber-500/80 font-bold uppercase mt-1.5"
        >
          The Observer
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-xl sm:text-2xl font-semibold text-slate-300 mt-6 tracking-wide"
        >
          Create your Social Radar.<br className="sm:hidden" /> Find your <span className="text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-sm border border-amber-500/10">Crown Council</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-sm sm:text-base text-[#D6C7FF]/75 max-w-lg mt-4 font-sans leading-relaxed text-balance"
        >
          Post your private radar link on <span className="text-yellow-300 font-medium">Snapchat</span>, <span className="text-pink-400 font-medium">Instagram</span>, or <span className="text-purple-300 font-medium">TikTok</span>. Collect instant observer signals and track secret frequencies securely.
        </motion.p>

        {/* Pulsing Main CTA Trigger */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs sm:max-w-md justify-center z-10"
        >
          <button
            id="cta-start"
            onClick={() => onNavigate('create')}
            className="w-full sm:w-auto relative px-8 py-4 bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 text-slate-100 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.55)] border border-purple-400/30 font-sans tracking-wide active:scale-95 flex items-center justify-center gap-3 group"
          >
            <span>Create My Radar 🌟</span>
            <span className="text-xs bg-amber-400 text-purple-950 px-1.5 py-0.5 rounded-xs font-mono font-black group-hover:scale-105 transition-transform duration-300">إطلاق</span>
          </button>

          <button
            id="cta-demo"
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-4 bg-brand-surface/80 hover:bg-brand-elevated/90 text-slate-200 rounded-xl font-semibold transition-all duration-300 border border-purple-500/25 flex items-center justify-center gap-2 group hover:border-purple-400/50"
          >
            <span>Enter Studio Dashboard</span>
            <ExternalLink className="w-4 h-4 text-[#A78BFA] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Mesmerizing Radar Grid Section */}
      <div className="w-full max-w-lg px-4 flex flex-col items-center">
        <div id="radar-showcase" className="relative p-7 bg-gradient-to-b from-[#1C1032]/90 to-[#120822]/90 border border-purple-500/20 rounded-3xl shadow-2xl w-full flex flex-col items-center backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px]"></div>
          
          <div className="w-full flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-[#A78BFA] tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Pulse Active • Riyadh
            </span>
            <span className="font-mono text-[9px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-xs">
              MURAQIB SIG
            </span>
          </div>

          <RadarSweep activeCount={15} pulseSpeed="normal" />

          {/* Stat Overlay Box */}
          <div className="w-full grid grid-cols-2 gap-3.5 mt-6 border-t border-purple-500/10 pt-5">
            <div className="text-left bg-purple-950/20 p-3 rounded-xl border border-purple-500/10">
              <span className="text-[10px] font-mono text-[#D6C7FF]/60 uppercase block">Active Signal Rate</span>
              <span className="text-xl font-bold text-slate-100 font-mono">98.4%</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5 font-medium">9.1 GHz Peak</span>
            </div>
            <div className="text-left bg-purple-950/20 p-3 rounded-xl border border-purple-500/10">
              <span className="text-[10px] font-mono text-[#D6C7FF]/60 uppercase block">GCC Observers</span>
              <span className="text-xl font-bold text-amber-400 font-mono">42 Active</span>
              <span className="text-[9px] text-slate-300 block mt-0.5">Riyadh • Dubai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elite Section: How to Rule Your Circle */}
      <div className="w-full max-w-4xl px-4 mt-20 text-center">
        <h3 className="text-xs font-mono font-bold tracking-[0.4em] text-amber-500 uppercase mb-3">The Protocol</h3>
        <h4 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide">Establish Social Sovereign</h4>
        <p className="text-sm text-[#D6C7FF]/70 max-w-md mx-auto mt-2 mb-12">
          Unlock emotional frequencies with three ritual actions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-[#1E1134] to-[#140B23] border border-purple-500/15 p-6 rounded-2xl relative group hover:border-purple-500/35 transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#A78BFA] mb-4 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
              <Radio className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-mono font-extrabold text-amber-500/80 uppercase block mb-1">Ritual One</span>
            <h5 className="text-lg font-bold text-slate-100 mb-2">Configure Your Frequency</h5>
            <p className="text-xs text-[#D6C7FF]/70 leading-relaxed">
              Design a gorgeous personal portal. Choose your emotional mode and set provocative questions like <span className="text-[#FF75B5] font-medium">"Do I cross your mind?"</span> to trigger real responses.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-[#1E1134] to-[#140B23] border border-purple-500/15 p-6 rounded-2xl relative group hover:border-purple-500/35 transition-all duration-300 animate-pulse-slow">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/20 group-hover:bg-pink-500/20 transition-all duration-300">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-extrabold text-pink-400 uppercase block mb-1">Ritual Two</span>
            <h5 className="text-lg font-bold text-slate-100 mb-2">Broadcast on Stories</h5>
            <p className="text-xs text-[#D6C7FF]/70 leading-relaxed">
              Copy your luxurious, custom `/r/slug` link. Pin it securely to your Snapchat, Instagram or WhatsApp stories with a sticker to let observers enter quietly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-[#1E1134] to-[#140B23] border border-purple-500/15 p-6 rounded-2xl relative group hover:border-purple-500/35 transition-all duration-300">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#A78BFA] mb-4 border border-purple-500/20 group-hover:bg-purple-500/20 transition-all duration-300">
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            <span className="text-[10px] font-mono font-extrabold text-amber-500/80 uppercase block mb-1">Ritual Three</span>
            <h5 className="text-lg font-bold text-slate-100 mb-2">Anoint Your Crown Council</h5>
            <p className="text-xs text-[#D6C7FF]/70 leading-relaxed">
              Track repeat profiles, interest speeds, and secret replies. Crown your top three persistent admirers as your <span className="text-amber-400 font-medium">Crown King</span>, <span className="text-pink-400 font-medium">Diamond Prince</span>, and <span className="text-[#CBB26B] font-medium">Golden Guard</span>.
            </p>
          </div>
        </div>
      </div>

      {/* High-End Feature Spotlight */}
      <div className="w-full max-w-4xl px-4 mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-left">
          <span className="font-mono text-xs text-[#A78BFA] font-bold uppercase tracking-widest block mb-1 bg-purple-500/15 py-1 px-3.5 rounded-full inline-block border border-purple-500/20">
            SOVEREIGN METRIC SYSTEM
          </span>
          <h4 className="text-3xl font-bold text-slate-100 tracking-tight mt-3">The Luxury Council Showcase</h4>
          <p className="text-sm text-[#D6C7FF]/75 mt-4 leading-relaxed">
            Muraqib leverages advanced engagement tracking. Analyze observer curiosity scores based on visit counts, completion rate, geographic alignment (Riyadh, Dubai, Kuwait City), and reply intimacy.
          </p>
          <div className="mt-6 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center text-amber-400 text-xs font-bold">✓</div>
              <p className="text-xs text-slate-300"><span className="text-amber-400 font-semibold">Ghost Aura Masking</span>: Observers can enter either public or fully encrypted spectral mode (Aura Mask).</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-purple-500/10 border border-purple-500/35 flex items-center justify-center text-purple-400 text-xs font-bold">✓</div>
              <p className="text-xs text-slate-300"><span className="text-purple-300 font-semibold">Repeat Signalling</span>: See how many times they refreshed your link in deep hours.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 rounded-full bg-pink-500/10 border border-pink-500/35 flex items-center justify-center text-pink-400 text-xs font-bold">✓</div>
              <p className="text-xs text-slate-300"><span className="text-pink-400 font-semibold">The Sovereign Trio</span>: Assign luxury status ranks to make interactions incredibly playful.</p>
            </div>
          </div>
        </div>

        {/* Status card preview visual container */}
        <div className="relative p-1 bg-gradient-to-r from-amber-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl shadow-xl">
          <div className="bg-[#150B25]/95 rounded-[22px] p-6 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-[#EAB308] to-transparent opacity-10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400">Current Throne #1</span>
            </div>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 blur-xs"></div>
                <div className="relative h-12 w-12 rounded-full bg-[#2C194B] flex items-center justify-center border-2 border-[#150B25] font-black text-slate-100">
                  👑
                </div>
              </div>
              <div>
                <h5 className="font-sans font-bold text-slate-100 text-base flex items-center gap-1.5">
                  saud.al.thani
                  <span className="text-[10px] bg-amber-400/20 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-sm">Riyadh</span>
                </h5>
                <span className="text-xs text-[#D6C7FF]/60 block font-mono">Last alert: 5 mins ago</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs bg-purple-950/25 p-3 rounded-xl border border-purple-500/10 mb-4 font-mono">
              <div className="flex justify-between text-[#C4B5FD]">
                <span>Answered:</span>
                <span className="text-slate-100 font-bold">Every single day.</span>
              </div>
              <div className="flex justify-between text-[#C4B5FD]">
                <span>Pulse Visits:</span>
                <span className="text-amber-400 font-bold">42 Hits</span>
              </div>
              <div className="flex justify-between text-[#C4B5FD]">
                <span>Attraction Quotient:</span>
                <span className="text-pink-400 font-black">98% Match</span>
              </div>
            </div>

            <p className="text-xs italic text-[#D6C7FF]/70 border-l-2 border-amber-500/40 pl-3 leading-relaxed">
              "Since last Riyadh Season, you know this. Always keeping the radar active."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
