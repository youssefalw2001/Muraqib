/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Shield, Trophy, Zap, Share2, Sparkles, ExternalLink, Crown, Volume2, Flame, Users, Calendar } from 'lucide-react';
import RadarSweep from './RadarSweep';
import { Locale, TRANSLATIONS } from '../locales';

interface LandingPageProps {
  onNavigate: (view: 'create' | 'dashboard' | 'boost') => void;
  mockSlug: string;
  locale: Locale;
}

export default function LandingPage({ onNavigate, mockSlug, locale }: LandingPageProps) {
  const t = TRANSLATIONS[locale];
  const isRtl = locale === 'ar';

  return (
    <div className="w-full flex flex-col items-center pb-24 px-4">
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden pt-12 pb-16 flex flex-col items-center text-center max-w-4xl">
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-5 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Premium badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-amber-300/10 to-transparent border border-amber-500/25 px-3.5 py-1.5 rounded-full mb-6 shadow-lg shadow-amber-500/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
          <span className="font-mono text-[9px] sm:text-[10px] text-amber-300 tracking-wider uppercase font-black">
            {t.brandSlogan}
          </span>
        </motion.div>

        {/* Big visual Game Logo representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative inline-block mb-3.5 select-none"
        >
          <div className="text-6xl sm:text-7xl drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">⚔️</div>
          <div className="absolute -top-3 -right-3 text-3xl animate-bounce">👑</div>
        </motion.div>

        {/* App headings */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-purple-400 leading-none uppercase"
        >
          {t.brandName}
        </motion.h1>

        <motion.span
          className="text-[11px] font-mono tracking-[0.4em] text-amber-500 font-black uppercase mt-3 block"
        >
          {t.tagline}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl sm:text-2xl font-light italic text-slate-200 mt-6 tracking-wide leading-relaxed"
        >
          {locale === 'ar' ? (
            <>
              هل تعتقد أنهم يعرفونك حقاً؟ <span className="font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 inline-block mt-1">تحدّ أصالتهم</span>
            </>
          ) : (
            <>
              Think they really know you? Let's check.<br />
              Winner gets a reward. Losers get <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 tracking-normal inline-block mt-1 sm:mt-0">CLOWN REVELRY CARDS</span>.
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm text-slate-350 max-w-lg mt-4.5 leading-relaxed text-balance"
        >
          {t.heroDesc}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-md justify-center z-10"
        >
          <button
            onClick={() => onNavigate('create')}
            className="w-full sm:w-auto relative px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-600 to-amber-700 hover:brightness-115 text-zinc-950 rounded-xl font-sans font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-amber-500/10 cursor-pointer flex items-center justify-center gap-2 active:scale-97 group"
          >
            <span>{t.launchBtn}</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-4 bg-purple-950/45 hover:bg-purple-900 border border-purple-500/25 text-slate-200 rounded-xl font-bold transition-all duration-300 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.monitorBtn}</span>
          </button>
        </motion.div>
      </div>

      {/* Mesmerizing Live Sweep Showcase */}
      <div className="w-full max-w-md px-4 flex flex-col items-center">
        <div className="relative p-6 bg-gradient-to-b from-[#140C24]/95 to-[#0F071D]/95 border border-purple-550/20 rounded-3xl shadow-2xl w-full flex flex-col items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
          
          <div className={`w-full flex items-center justify-between mb-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="flex items-center gap-1.5 font-mono text-[9px] text-amber-400 tracking-wider uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              {t.pulseActive}
            </span>
            <span className="font-mono text-[9px] text-purple-300 bg-purple-400/10 border border-purple-404/25 px-2 py-0.5 rounded">
              {t.clownRadiation}
            </span>
          </div>

          <RadarSweep activeCount={15} pulseSpeed="normal" />

          {/* Quick Info block */}
          <div className="w-full grid grid-cols-2 gap-3.5 mt-6 border-t border-purple-555/15 pt-5">
            <div className={`text-left bg-purple-950/20 p-3 rounded-xl border border-purple-505/10 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[9.5px] font-mono text-slate-400 uppercase block">{t.totalQuizzes}</span>
              <span className="text-xl font-black text-slate-100 font-mono">18,495</span>
              <span className="text-[8.5px] text-emerald-400 block mt-0.5 font-bold">{t.activeIn}</span>
            </div>
            <div className={`text-left bg-purple-950/20 p-3 rounded-xl border border-purple-505/10 ${isRtl ? 'text-right' : 'text-left'}`}>
              <span className="text-[9.5px] font-mono text-slate-400 uppercase block">{t.totalDares}</span>
              <span className="text-xl font-black text-amber-400 font-mono">4,912</span>
              <span className="text-[8.5px] text-purple-450 block mt-0.5 font-medium">{t.storyUploads}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step description lists */}
      <div className="w-full max-w-4xl px-4 mt-20 text-center">
        <h3 className="text-xs font-mono font-black tracking-[0.4em] text-amber-500 uppercase mb-3">{t.coreTitle}</h3>
        <h4 className="text-3xl sm:text-4xl font-sans font-black italic text-slate-150 tracking-tight leading-none uppercase">{t.coreSubtitle}</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 mb-12">
          {t.coreDesc}
        </p>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-[#140C24] to-[#0B0516] border border-purple-500/15 p-6 rounded-2xl relative shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[9px] font-mono font-extrabold text-amber-400 uppercase block mb-1">LEVEL 01</span>
            <h5 className="text-lg font-black text-slate-100 mb-1.5">{t.step1Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step1Desc}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-[#140C24] to-[#0B0516] border border-purple-500/15 p-6 rounded-2xl relative shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 flex items-center justify-center mb-4 border border-purple-500/25 text-purple-400">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-extrabold text-[#A78BFA] uppercase block mb-1">LEVEL 02</span>
            <h5 className="text-lg font-black text-slate-100 mb-1.5">{t.step2Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step2Desc}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-[#140C24] to-[#0B0516] border border-purple-500/15 p-6 rounded-2xl relative shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 text-yellow-400">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-[9px] font-mono font-extrabold text-amber-300 uppercase block mb-1">LEVEL 03</span>
            <h5 className="text-lg font-black text-slate-100 mb-1.5">{t.step3Title}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.step3Desc}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
