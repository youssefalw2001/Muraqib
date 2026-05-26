/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, Heart, Shield, Award, MapPin, Tablet, Flame, Skull, Trophy, Frown, Users } from 'lucide-react';
import { ChallengerAttempt } from '../types';

interface CrownCouncilPageProps {
  observers: ChallengerAttempt[];
  onNavigateToDashboard: () => void;
}

export default function CrownCouncilPage({ observers, onNavigateToDashboard }: CrownCouncilPageProps) {
  // Filter true bros and roasted rookies
  const trueBros = observers.filter(o => o.status === 'survived');
  const roastedClowns = observers.filter(o => o.status === 'dare_accepted' || o.status === 'wimped_out' || o.status === 'immunity_used');

  return (
    <div className="w-full max-w-4xl px-4 py-8 mx-auto pb-32 text-left">
      
      {/* Dynamic Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-yellow-405/10 border border-yellow-400/20 px-3.5 py-1.5 rounded-full mb-3 shadow-md">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span className="font-mono text-[9px] text-yellow-300 tracking-wider uppercase font-black">
            The Royal Judgment Bench • ديوان المحكمة
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-black italic text-slate-100 tracking-tight">
          Bros vs Clowns Council
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
          The ultimate verification scoreboard. Behold who has proven absolute gold standard loyalty, and who got customized clown penalty cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: THE CROWN COUNCIL (HALL OF FAME) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-2xl">
            <Trophy className="w-5 h-5 text-emerald-400 animate-bounce" />
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-emerald-400 leading-none">THE COURT OF HONOR</span>
              <h3 className="text-base font-black text-white mt-0.5">True Bros Hall of Fame (👑)</h3>
            </div>
          </div>

          <div className="space-y-3">
            {trueBros.length === 0 ? (
              <div className="py-12 text-center bg-black/20 border-2 border-dashed border-emerald-500/10 rounded-2xl">
                <Users className="w-8 h-8 text-emerald-500/30 mx-auto mb-2" />
                <p className="font-mono text-xs text-slate-400 uppercase font-bold">No certified bros yet</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">None of your friends have passed with a stellar 100% score yet. This circle is brutal!</p>
              </div>
            ) : (
              trueBros.map((bro, idx) => (
                <div 
                  key={bro.id}
                  className="p-4 bg-gradient-to-r from-[#022c22] to-black/35 border-2 border-emerald-500/30 rounded-2xl shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-1.5 bg-yellow-450 text-zinc-950 font-mono font-black text-[9px] rounded-bl-lg">
                    RANK #0{idx + 1}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="font-sans font-black text-white text-sm">{bro.challengerName}</h4>
                      <span className="text-[10px] text-emerald-300 font-mono block mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 inline" /> Tested from {bro.city} Node
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 bg-black/60 p-2.5 rounded-xl border border-white/5 text-[11px] font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span>Total score:</span>
                      <span className="text-emerald-400 font-bold">{bro.score} / {bro.totalQuestions} hits</span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t border-white/5">
                      <span>Certified:</span>
                      <span className="text-yellow-300 font-extrabold uppercase">👑 IMMACULATE VOWS</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: THE PIT OF ROASTS (HALL OF SHAME) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/25 p-3 rounded-2xl">
            <Skull className="w-5 h-5 text-rose-450 animate-pulse" />
            <div>
              <span className="text-[9px] font-mono font-black uppercase text-rose-400 leading-none">THE COURT OF MEMES</span>
              <h3 className="text-base font-black text-white mt-0.5">Laid out Roasted Rookies (🤡)</h3>
            </div>
          </div>

          <div className="space-y-3">
            {roastedClowns.length === 0 ? (
              <div className="py-12 text-center bg-black/20 border-2 border-dashed border-rose-500/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-rose-500/25 mx-auto mb-2" />
                <p className="font-mono text-xs text-slate-400 uppercase font-bold">Pit is clean & safe</p>
                <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">No roasted brothers reported in jail. Either you have no friends or they are too chicken to play.</p>
              </div>
            ) : (
              roastedClowns.map((clown) => {
                const isWimp = clown.status === 'wimped_out';
                return (
                  <div 
                    key={clown.id}
                    className={`p-4 bg-gradient-to-r ${isWimp ? 'from-zinc-900 to-black/35 border-zinc-700/50' : 'from-[#2e0b20] to-black/35 border-rose-500/30'} border-2 rounded-2xl shadow-lg relative`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isWimp ? '🏃' : '🤡'}</span>
                      <div>
                        <h4 className="font-sans font-black text-white text-sm">{clown.challengerName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                          Failed question level: <span className="text-rose-400 font-bold uppercase">{clown.failedLevel}</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-3.5 bg-black/60 p-2.5 rounded-xl border border-white/5 text-[11.5px] text-slate-200">
                      <p className="font-sans leading-relaxed"><span className="text-rose-400 font-bold">STAKE:</span> "{clown.dareAssigned}"</p>
                      
                      {clown.excuseMsg && (
                        <p className="font-sans text-xs italic text-slate-400 border-l border-yellow-450 pl-2 mt-2 pt-1.5 border-t border-white/5">
                          Excuse: "{clown.excuseMsg}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Funny board footer tips */}
      <div className="mt-12 p-6.5 bg-gradient-to-b from-[#1C1032] to-[#120822] border border-purple-550/15 rounded-3xl">
         <h4 className="font-sans font-black text-sm text-yellow-300 mb-2">⚖️ Standard Verdict Disclaimer</h4>
         <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Judgment is passed and logged securely inside local storage nodes. True Bros gain elite priority when matching on chat, while failure cards are archived globally. Download shaming stickers to post publicly on social channels!
         </p>
      </div>

    </div>
  );
}
