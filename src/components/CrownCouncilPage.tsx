/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, Heart, Shield, Award, MapPin, Tablet } from 'lucide-react';
import { Observer } from '../types';

interface CrownCouncilPageProps {
  observers: Observer[];
  onNavigateToDashboard: () => void;
}

export default function CrownCouncilPage({ observers, onNavigateToDashboard }: CrownCouncilPageProps) {
  // Find crowned observers
  const king = observers.find(o => o.status === 'Crown King');
  const prince = observers.find(o => o.status === 'Diamond Prince');
  const guard = observers.find(o => o.status === 'Golden Guard');

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto pb-24 text-left">
      
      {/* Decorative Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 px-3.5 py-1 rounded-full mb-3 shadow-xs">
          <Crown className="w-4 h-4 text-[#FACC15] animate-pulse" />
          <span className="font-mono text-[9px] text-[#FACC15] tracking-wider uppercase font-extraboldShared">
            The Sovereign Throne • مجلس العرش
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight font-sans">
          The Crown Council
        </h2>
        <p className="text-xs text-[#B6A8D6] max-w-md mx-auto mt-2 leading-relaxed text-balance">
          These are your top three most active secret admirers, crowned according to absolute visitor frequency and emotional integrity scores.
        </p>
      </div>

      {/* Top 3 Sovereign Row Cards Stack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        
        {/* Tier 2: DIAMOND PRINCE */}
        <div className="order-2 md:order-1">
          <div className="text-center mb-2 font-mono text-[10px] text-pink-400 font-extrabold uppercase">
            Throne Seeker #02
          </div>
          
          <div className="bg-gradient-to-b from-[#25103E] to-[#120822] border-2 border-pink-500/20 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-pink-500/40 shadow-xl group">
            {/* Background Halo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:scale-110 transition-transform" />

            <div className="h-10 w-10 rounded-xl bg-pink-950/45 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
              <Award className="w-5 h-5" />
            </div>

            <span className="inline-flex items-center gap-1.5 bg-pink-500/15 border border-pink-500/35 px-2.5 py-0.5 rounded-full text-[9px] text-pink-300 font-mono font-bold uppercase mb-4">
              ♦ Diamond Prince
            </span>

            {prince ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-100 font-sans truncate">
                    {prince.handle}
                  </h4>
                  <span className="text-[10px] text-pink-300 font-mono flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-pink-400" /> Detected via {prince.city}
                  </span>
                </div>

                <div className="space-y-2 bg-[#120822]/80 p-3 rounded-xl border border-pink-500/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Pulse Visits:</span>
                    <span className="text-pink-400 font-bold">{prince.repeatSignals} Hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Attraction Match:</span>
                    <span className="text-slate-100 font-semibold">{prince.interestScore}%</span>
                  </div>
                </div>

                {prince.msg && (
                  <p className="text-xs italic text-[#D6C7FF]/70 border-l-2 border-pink-500/30 pl-2.5 leading-relaxed bg-[#1A0C2B]/35 py-1.5 rounded-r-lg">
                    "{prince.msg}"
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center bg-pink-950/15 rounded-xl border border-dashed border-pink-500/10">
                <p className="text-xs font-mono text-pink-400/65 uppercase tracking-wider">Throne Seed Vacant</p>
                <button 
                  onClick={onNavigateToDashboard}
                  className="mt-3 text-[10px] font-mono text-[#D6C7FF] underline hover:text-pink-400"
                >
                  Crown from Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 1: CROWN KING (Tallest/Center Card) */}
        <div className="order-1 md:order-2">
          <div className="text-center mb-2 font-mono text-xs text-amber-500 font-black uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FACC15] animate-pulse" />
            <span>Throne Master #01</span>
          </div>

          <div className="bg-gradient-to-b from-[#3E2810] via-[#21123D] to-[#120822] border-2 border-amber-500/45 rounded-3xl p-7 relative overflow-hidden transition-all duration-300 hover:border-amber-500/60 shadow-[0_10px_30px_rgba(250,204,21,0.15)] group md:-translate-y-2">
            
            {/* Crown Backdrop Ring */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="h-12 w-12 rounded-xl bg-amber-950/50 border border-amber-500/35 flex items-center justify-center text-amber-400 mb-6 relative animate-pulse-slow">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>

            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/50 px-3 py-1 rounded-full text-[10px] text-amber-300 font-mono font-black uppercase mb-5 tracking-widest shadow-sm">
              👑 Crown King
            </span>

            {king ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-black text-slate-100 font-sans tracking-wide truncate">
                    {king.handle}
                  </h4>
                  <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Detected via {king.city}
                  </span>
                </div>

                <div className="space-y-2.5 bg-[#120822]/90 p-4 rounded-xl border border-amber-500/15 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Total Sessions:</span>
                    <span className="text-amber-400 font-extrabold text-sm">{king.repeatSignals} Hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Admiration quotient:</span>
                    <span className="text-pink-400 font-black">{king.interestScore}% MATCH</span>
                  </div>
                </div>

                {king.msg && (
                  <p className="text-xs italic text-slate-150 border-l-2 border-amber-500/60 pl-3 leading-relaxed bg-[#2C184B]/30 py-2 rounded-r-lg">
                    "{king.msg}"
                  </p>
                )}
              </div>
            ) : (
              <div className="py-12 text-center bg-amber-950/15 rounded-xl border border-dashed border-amber-500/10">
                <p className="text-xs font-mono text-amber-400/65 uppercase tracking-wider">Crown Throne Vacant</p>
                <button 
                  onClick={onNavigateToDashboard}
                  className="mt-3 text-[10px] font-mono text-[#D6C7FF] underline hover:text-amber-400 font-semibold"
                >
                  Crown from Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tier 3: GOLDEN GUARD */}
        <div className="order-3">
          <div className="text-center mb-2 font-mono text-[10px] text-purple-300 font-extrabold uppercase">
            Throne Seeker #03
          </div>

          <div className="bg-gradient-to-b from-[#1C0F32] to-[#120822] border-2 border-purple-500/20 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:border-purple-500/40 shadow-xl group">
            {/* Background Halo */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:scale-110 transition-transform" />

            <div className="h-10 w-10 rounded-xl bg-purple-950/45 border border-purple-500/20 flex items-center justify-center text-[#A78BFA] mb-5">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>

            <span className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/35 px-2.5 py-0.5 rounded-full text-[9px] text-purple-300 font-mono font-bold uppercase mb-4">
              🛡 Golden Guard
            </span>

            {guard ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-100 font-sans truncate">
                    {guard.handle}
                  </h4>
                  <span className="text-[10px] text-purple-300 font-mono flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-purple-400" /> Detected via {guard.city}
                  </span>
                </div>

                <div className="space-y-2 bg-[#120822]/80 p-3 rounded-xl border border-purple-500/10 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Pulse Visits:</span>
                    <span className="text-[#CBB26B] font-bold">{guard.repeatSignals} Hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B6A8D6]/60">Attraction Match:</span>
                    <span className="text-slate-100 font-semibold">{guard.interestScore}%</span>
                  </div>
                </div>

                {guard.msg && (
                  <p className="text-xs italic text-[#D6C7FF]/70 border-l-2 border-purple-500/30 pl-2.5 leading-relaxed bg-[#160B2B]/35 py-1.5 rounded-r-lg">
                    "{guard.msg}"
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center bg-purple-950/15 rounded-xl border border-dashed border-purple-500/10">
                <p className="text-xs font-mono text-purple-300/65 uppercase tracking-wider">Throne Seed Vacant</p>
                <button 
                  onClick={onNavigateToDashboard}
                  className="mt-3 text-[10px] font-mono text-[#D6C7FF] underline hover:text-purple-400"
                >
                  Crown from Dashboard
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Elite Hierarchy Information */}
      <div className="mt-16 p-6 bg-gradient-to-[#1C1032] to-[#120822] border border-purple-500/15 rounded-3xl font-sans">
        <h4 className="font-bold text-slate-100 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          The GCC Noble Hierarchy Rules
        </h4>
        <p className="text-xs text-[#D6C7FF]/75 leading-relaxed mb-4">
          Observers entering your Social Radar are automatically assigned metrics according to interest frequency (story refresh speed) and compatibility matches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="bg-[#120822]/60 p-3.5 rounded-xl border border-purple-500/5 text-xs">
            <span className="font-bold text-amber-400 block mb-1">👑 Sovereign Right</span>
            <p className="text-[11px] text-[#B6A8D6]/80 leading-relaxed">
              As the radar owner, you possess the absolute ultimate crown power. You may override rankings at any time from your Dashboard to reward or demote users in your physical orbit.
            </p>
          </div>
          <div className="bg-[#120822]/60 p-3.5 rounded-xl border border-purple-500/5 text-xs">
            <span className="font-bold text-pink-400 block mb-1">🛡 Sealed Sanctity</span>
            <p className="text-[11px] text-[#B6A8D6]/80 leading-relaxed">
              Masked Observers assigned to premium thrones maintain active privacy. Seekers may request a "Royal Reveal Request" from the Boost store to prompt an encryption bypass query.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
