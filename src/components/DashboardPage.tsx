/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Sparkles, EyeOff, Eye, MapPin, Smartphone, 
  Activity, TrendingUp, Heart, Share2, MessageSquare, 
  Check, Trash2, Filter, Zap, Globe, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Radar, Observer, ObserverStatus } from '../types';
import { GCC_CITIES } from '../data';

interface DashboardPageProps {
  radar: Radar;
  observers: Observer[];
  onDeleteObserver: (obsId: string) => void;
  onPromoteToCouncil: (obsId: string, newStatus: ObserverStatus) => void;
  onSimulateNewSignal: () => void;
}

export default function DashboardPage({ 
  radar, 
  observers, 
  onDeleteObserver, 
  onPromoteToCouncil, 
  onSimulateNewSignal 
}: DashboardPageProps) {
  
  // Local state for filter and copy status
  const [filterMode, setFilterMode] = useState<'all' | 'masked' | 'public'>('all');
  const [linkCopied, setLinkCopied] = useState(false);

  // Calculate high-fidelity stats
  const totalObs = observers.length;
  const maskedCount = observers.filter(o => o.isMasked).length;
  const publicCount = totalObs - maskedCount;
  
  // Calculate average interest score
  const avgInterest = totalObs > 0 
    ? Math.round(observers.reduce((sum, o) => sum + o.interestScore, 0) / totalObs) 
    : 0;

  // Calculate highest repeat visitor signal
  const maxRepeats = totalObs > 0 
    ? Math.max(...observers.map(o => o.repeatSignals)) 
    : 0;

  // Calculate breakdown of answer options selected
  const answerBreakdown = radar.options.map(opt => {
    const matchingCount = observers.filter(o => o.answer === opt).length;
    const percentage = totalObs > 0 ? Math.round((matchingCount / totalObs) * 100) : 0;
    return {
      option: opt,
      count: matchingCount,
      percentage
    };
  });

  // Filter observers list
  const filteredObservers = observers.filter(o => {
    if (filterMode === 'masked') return o.isMasked;
    if (filterMode === 'public') return !o.isMasked;
    return true;
  });

  // Handle Copy Radar Link
  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/r/${radar.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl px-4 py-8 mx-auto pb-24 text-left">
      
      {/* Dashboard Top sovereign header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full mb-2">
            <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="font-mono text-[9px] text-amber-300 tracking-wider font-extrabold uppercase">
              STUDIO SUITE ONLINE • Riyadh Gate
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            Intelligence Suite
          </h2>
          <p className="text-xs text-[#B6A8D6] mt-1 font-mono">
            Owner: <span className="text-[#FF75B5] font-semibold">{radar.displayName}</span> • Mode: <span className="text-amber-400 capitalize font-semibold">{radar.mode} Radar</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Simulate observer button */}
          <button
            id="db-simulate-btn"
            onClick={onSimulateNewSignal}
            className="flex-1 md:flex-none px-4.5 py-2.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-[#A78BFA] hover:text-slate-100 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 pointer-cursor"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>Mock New Signal 📡</span>
          </button>

          {/* Copy link button */}
          <button
            id="db-copy-link-btn"
            onClick={handleCopyLink}
            className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 uppercase pointer-cursor ${
              linkCopied 
                ? 'bg-[#34D399] text-[#120822] shadow-sm' 
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-brand-surface font-extrabold'
            }`}
          >
            {linkCopied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>LINK COPIED!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Radar Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Broadcast Target Notification alert */}
      <div className="bg-gradient-to-r from-purple-950/20 via-pink-950/15 to-transparent border border-purple-500/15 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-3">
          <div className="bg-[#FF75B5]/10 h-9 w-9 rounded-xl flex items-center justify-center border border-[#FF75B5]/25">
            <Globe className="w-4 h-4 text-[#FF75B5]" />
          </div>
          <div>
            <span className="text-[10px] text-[#B6A8D6]/60 font-mono block">LIVE BROADCAST INSTANCE</span>
            <span className="text-xs text-slate-200 font-bold font-mono">muraqib.com/r/{radar.slug}</span>
          </div>
        </div>
        <p className="text-[11px] text-[#A78BFA] max-w-sm text-left sm:text-right leading-normal">
          Share this link in your Snapchat and TikTok stories to trigger visitors instantly.
        </p>
      </div>

      {/* Bento Stats Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        {/* Stat 1: Total signals */}
        <div className="bg-[#1C1032]/90 border border-purple-500/15 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-2 right-2 flex gap-1 items-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-[#D6C7FF]/55 uppercase block">Captured Observers</span>
          <span className="text-3xl font-black text-slate-100 font-mono mt-1 block">{totalObs}</span>
          <span className="text-[9px] text-[#D6C7FF]/40 font-mono block mt-1.5 uppercase">Signals Active</span>
        </div>

        {/* Stat 2: Average Attraction Quotient */}
        <div className="bg-[#1C1032]/90 border border-purple-500/15 p-5 rounded-2xl relative">
          <div className="absolute top-3 right-3 text-[#FF75B5]">
            <Heart className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-[#D6C7FF]/55 uppercase block">Attraction Avg</span>
          <span className="text-3xl font-black text-[#FF75B5] font-mono mt-1 block">{avgInterest}%</span>
          <span className="text-[9px] text-pink-400/80 font-mono block mt-1.5 uppercase tracking-wide">Highly Confirmed</span>
        </div>

        {/* Stat 3: Hot Pings repeat visitors */}
        <div className="bg-[#1C1032]/90 border border-purple-500/15 p-5 rounded-2xl relative">
          <div className="absolute top-3 right-3 text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-[#D6C7FF]/55 uppercase block">Highest Pulse Visits</span>
          <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">{maxRepeats}</span>
          <span className="text-[9px] text-amber-500/80 font-mono block mt-1.5 uppercase">Repeat Visitor Spike</span>
        </div>

        {/* Stat 4: Spectral Indexing Ratio */}
        <div className="bg-[#1C1032]/90 border border-purple-500/15 p-5 rounded-2xl">
          <span className="text-[10px] font-mono text-[#D6C7FF]/55 uppercase block">Spectral Mask Ratio</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-[#A78BFA] font-mono">{maskedCount}</span>
            <span className="text-xs text-[#D6C7FF]/50 font-mono">/ {totalObs} masked</span>
          </div>
          <span className="text-[9px] text-[#A78BFA]/80 font-mono block mt-1.5 uppercase">Encrypted Sessions</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 parts width) - Observers Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1C1032]/90 border border-purple-500/15 rounded-2xl p-6 relative">
            
            {/* Header / Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2">
                  <span>Observer Signal Log</span>
                  <span className="text-xs bg-[#FF75B5]/15 border border-[#FF75B5]/20 text-[#FF75B5] px-2 py-0.5 rounded-sm font-mono font-bold">
                    LIVE FEED
                  </span>
                </h3>
                <p className="text-xs text-[#B6A8D6]/70 leading-none mt-1">
                  Inspect digital footprint metrics and reply notes.
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex items-center gap-1.5 bg-[#120822] p-1 rounded-lg border border-purple-500/10 self-stretch sm:self-auto justify-between">
                <button
                  id="log-all-filter"
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md cursor-pointer transition-all ${
                    filterMode === 'all' ? 'bg-purple-800 text-slate-100' : 'text-[#B6A8D6]/50'
                  }`}
                >
                  All
                </button>
                <button
                  id="log-masked-filter"
                  onClick={() => setFilterMode('masked')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                    filterMode === 'masked' ? 'bg-purple-800 text-pink-300' : 'text-[#B6A8D6]/50'
                  }`}
                >
                  Masked
                </button>
                <button
                  id="log-public-filter"
                  onClick={() => setFilterMode('public')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md cursor-pointer transition-all ${
                    filterMode === 'public' ? 'bg-purple-800 text-amber-300' : 'text-[#B6A8D6]/50'
                  }`}
                >
                  Public
                </button>
              </div>
            </div>

            {/* Simulated items List view */}
            {filteredObservers.length === 0 ? (
              <div className="bg-[#120822]/40 rounded-xl p-10 text-center border-2 border-dashed border-purple-500/10">
                <ShieldCheck className="w-8 h-8 text-purple-500/45 mx-auto mb-3" />
                <p className="font-mono text-xs text-[#B6A8D6]/70 uppercase tracking-widest font-bold">
                  No signals match filter
                </p>
                <p className="text-xs text-[#D6C7FF]/40 mt-1">
                  Broadcast your stories to collect observers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredObservers.map((obs) => {
                    const isCrown = obs.status === 'Crown King' || obs.status === 'Diamond Prince' || obs.status === 'Golden Guard';
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        id={`observer-panel-${obs.id}`}
                        key={obs.id}
                        className={`p-4 bg-[#130925]/90 border rounded-xl relative transition-all duration-300 ${
                          isCrown 
                            ? 'border-amber-500/35 bg-[#21123D]' 
                            : 'border-purple-500/10 hover:border-purple-500/25'
                        }`}
                      >
                        {/* Profile Info Row */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar representation block */}
                            <div className="relative">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border ${
                                obs.isMasked 
                                  ? 'bg-purple-950 border-pink-500/40 text-pink-400' 
                                  : 'bg-purple-900 border-amber-500/40 text-amber-400'
                              }`}>
                                {obs.isMasked ? '👤' : '👑'}
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-sans font-bold text-slate-100 text-sm">
                                  {obs.handle}
                                </h5>
                                {obs.isMasked && (
                                  <span className="flex items-center gap-0.5 text-[8px] font-mono bg-pink-500/15 border border-pink-500/25 text-pink-300 px-1.5 py-0.5 rounded-sm">
                                    <EyeOff className="w-2 h-2" /> MASKED
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#B6A8D6]/60 font-mono block leading-none mt-1">
                                Detected: {obs.activeAt} via <span className="text-purple-300">{obs.city}</span>
                              </span>
                            </div>
                          </div>

                          {/* Stat indicators (Visits / Score) */}
                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-amber-400 block">
                              {obs.repeatSignals} Hits
                            </span>
                            <span className="text-[9px] font-mono text-pink-400 block mt-0.5">
                              {obs.interestScore}% Quotient
                            </span>
                          </div>
                        </div>

                        {/* Interactive Options selected details */}
                        <div className="space-y-2.5 bg-brand-surface/40 p-3 rounded-lg border border-purple-500/5 mb-3 font-mono">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#B6A8D6]/60">Option Answer:</span>
                            <span className="text-slate-200 font-bold">{obs.answer}</span>
                          </div>
                          
                          {/* Footprint metrics */}
                          <div className="flex justify-between text-[11px] border-t border-purple-500/5 pt-1.5">
                            <span className="text-[#B6A8D6]/60">Footprint device:</span>
                            <span className="text-slate-350 flex items-center gap-1">
                              <Smartphone className="w-3 h-3 text-[#B6A8D6]/50" />
                              {obs.deviceType}
                            </span>
                          </div>

                          {obs.msg && (
                            <div className="mt-2 text-xs italic text-slate-200 pl-2.5 border-l-2 border-[#FF75B5]/40 leading-relaxed pt-1">
                              "{obs.msg}"
                            </div>
                          )}
                        </div>

                        {/* Manage buttons toolbar */}
                        <div className="flex justify-between items-center bg-[#1C1032]/40 px-2 py-1.5 rounded-lg border border-purple-500/5">
                          {/* Assign Ranks */}
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[8px] text-[#B6A8D6]/40 uppercase select-none mr-1">Rank:</span>
                            <button
                              id={`promote-king-${obs.id}`}
                              onClick={() => onPromoteToCouncil(obs.id, 'Crown King')}
                              className={`text-[8px] font-mono px-2 py-0.5 rounded-xs font-bold pointer-cursor ${
                                obs.status === 'Crown King' ? 'bg-[#FACC15] text-[#120822]' : 'bg-[#120822] text-[#B6A8D6]'
                              }`}
                            >
                              👑 KING
                            </button>
                            <button
                              id={`promote-prince-${obs.id}`}
                              onClick={() => onPromoteToCouncil(obs.id, 'Diamond Prince')}
                              className={`text-[8px] font-mono px-2 py-0.5 rounded-xs font-bold pointer-cursor ${
                                obs.status === 'Diamond Prince' ? 'bg-[#FF75B5] text-[#120822]' : 'bg-[#120822] text-[#B6A8D6]'
                              }`}
                            >
                              ♦ PRINCE
                            </button>
                            <button
                              id={`promote-guard-${obs.id}`}
                              onClick={() => onPromoteToCouncil(obs.id, 'Golden Guard')}
                              className={`text-[8px] font-mono px-2 py-0.5 rounded-xs font-bold pointer-cursor ${
                                obs.status === 'Golden Guard' ? 'bg-[#A78BFA] text-[#120822]' : 'bg-[#120822] text-[#B6A8D6]'
                              }`}
                            >
                              🛡 GUARD
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            id={`delete-obs-btn-${obs.id}`}
                            onClick={() => onDeleteObserver(obs.id)}
                            className="p-1 px-2 text-pink-500/60 hover:text-rose-400 hover:bg-rose-950/20 text-[9px] font-mono font-bold rounded-xs flex items-center gap-1 transition-colors pointer-cursor"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Purge</span>
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>

        {/* Right Column (1 part width) - Question options breakdown & link showcase */}
        <div className="space-y-6">
          
          {/* Bento Panel: Question Answers Breakdown */}
          <div className="bg-[#1C1032]/90 border border-purple-500/15 rounded-2xl p-6">
            <h3 className="font-sans font-bold text-slate-100 flex items-center gap-2 mb-1 text-sm">
              <Activity className="w-4 h-4 text-emerald-400" />
              Question Meter Breakdown
            </h3>
            <span className="font-mono text-[9px] text-[#B6A8D6]/60 uppercase block mb-5 leading-none">
              Most Selected Responses
            </span>

            <div className="space-y-4">
              {answerBreakdown.map((item, index) => (
                <div key={index} className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between items-baseline">
                    <span className="font-sans font-medium text-slate-205 line-clamp-1">
                      {item.option}
                    </span>
                    <span className="font-mono text-amber-400 font-bold whitespace-nowrap ml-1 text-[11px]">
                      {item.count} pings ({item.percentage}%)
                    </span>
                  </div>
                  {/* Styled Barometer Meter */}
                  <div className="w-full bg-[#120822] h-2 rounded-full overflow-hidden border border-purple-500/10">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Panel: The Crown Council Miniature Preview */}
          <div className="bg-gradient-to-b from-[#24143A] to-[#120822] border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />

            <h3 className="font-sans font-bold text-slate-100 flex items-center gap-2 text-sm mb-4">
              <Crown className="w-4 h-4 text-[#FACC15] animate-bounce" />
              Sovereign Council Status
            </h3>

            {/* List the top status positions */}
            <div className="space-y-3">
              {[
                { status: 'Crown King', tag: '👑 Throne Master', label: observers.find(o => o.status === 'Crown King')?.handle || 'Vacant Core', glow: 'text-amber-400' },
                { status: 'Diamond Prince', tag: '♦ Royal Heirs', label: observers.find(o => o.status === 'Diamond Prince')?.handle || 'Vacant Seed', glow: 'text-pink-400' },
                { status: 'Golden Guard', tag: '🛡 Defender Apex', label: observers.find(o => o.status === 'Golden Guard')?.handle || 'Vacant Sign', glow: 'text-amber-200' }
              ].map((pos, idx) => (
                <div key={idx} className="flex justify-between items-center p-2.5 bg-[#120822]/70 rounded-xl border border-purple-500/10 text-xs font-mono">
                  <div>
                    <span className="block text-[8px] text-[#B6A8D6]/50 uppercase">{pos.tag}</span>
                    <span className="font-bold text-slate-100 block mt-0.5 line-clamp-1">{pos.label}</span>
                  </div>
                  <span className={`${pos.glow} text-[10px] font-bold`}>
                    #0{idx+1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento Panel: Premium Boost benefits list */}
          <div className="bg-[#1C1032]/90 border border-purple-500/15 rounded-2xl p-6">
            <h3 className="font-sans font-bold text-slate-150 text-sm mb-1">
              Active Premium Inclusions
            </h3>
            <span className="text-[10px] text-[#B6A8D6]/60 block mb-4 uppercase font-mono">
              Sovereign Level Unlocks
            </span>
            
            <div className="space-y-3 font-mono text-[11px] text-slate-300">
              <div className="flex gap-2 items-center bg-[#130925] p-2 rounded-xl border border-purple-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Geographic Signal Filters: LOCKED</span>
              </div>
              <div className="flex gap-2 items-center bg-[#130925] p-2 rounded-xl border border-purple-500/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Phantom Invisibility Scanner: LOCKED</span>
              </div>
              <div className="flex gap-2 items-center bg-purple-950/20 p-2 rounded-xl border border-purple-500/15">
                <AlertCircle className="w-4 h-4 text-pink-500 animate-pulse" />
                <span>Royal Reveal Requests: 0 active</span>
              </div>
            </div>
            
            {/* Link to store */}
            <div className="pt-4 text-center">
              <span className="text-[10px] text-amber-500 block">Need deep observer identification codes?</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
