/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Heart, Trophy, Zap, Shield, Sparkles, 
  MapPin, Smartphone, Star, ShieldCheck, UserCheck, 
  Bell, Eye, ArrowRight, BookOpen, Database, Server,
  RefreshCw, Copy, Check, Trash2, ShieldAlert, Crown, Activity, Flame, HelpCircle, Languages
} from 'lucide-react';

import { BroQuiz, ChallengerAttempt, AppView, BroTheme } from './types';
import { INITIAL_QUIZ, INITIAL_CHALLENGERS, GCC_CITIES } from './data';
import { TRANSLATIONS, Locale } from './locales';

import LandingPage from './components/LandingPage';
import CreateRadarPage from './components/CreateRadarPage';
import PublicRadarPage from './components/PublicRadarPage';
import ViralVerdictPage from './components/ViralVerdictPage';
import DashboardPage from './components/DashboardPage';
import CrownCouncilPage from './components/CrownCouncilPage';
import BoostPage from './components/BoostPage';

import {
  isSupabaseConnected,
  dbFetchQuiz,
  dbUpsertQuiz,
  dbFetchChallengers,
  dbInsertChallenger,
  dbDeleteChallenger,
  SUPABASE_SQL_CREATION_SCHEMA
} from './lib/supabaseClient';

export default function App() {
  const [supabaseConnected] = useState(isSupabaseConnected());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSqlPanel, setShowSqlPanel] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Localization settings
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem('wafi_locale');
    return (saved as Locale) || 'ar'; // Default to pristine Arabic
  });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('wafi_locale', locale);
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  // Sync state with localstorage
  const [radar, setRadar] = useState<BroQuiz>(() => {
    const saved = localStorage.getItem('brocard_radar');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ;
  });

  const [observers, setObservers] = useState<ChallengerAttempt[]>(() => {
    const saved = localStorage.getItem('brocard_challengers');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGERS;
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    const saved = localStorage.getItem('brocard_active_view');
    return (saved as AppView) || 'landing';
  });

  const [lastSubmitted, setLastSubmitted] = useState<ChallengerAttempt | null>(() => {
    const saved = localStorage.getItem('brocard_last_submitted');
    return saved ? JSON.parse(saved) : null;
  });

  // Notifications state
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('brocard_radar', JSON.stringify(radar));
  }, [radar]);

  useEffect(() => {
    localStorage.setItem('brocard_challengers', JSON.stringify(observers));
  }, [observers]);

  useEffect(() => {
    localStorage.setItem('brocard_active_view', activeView);
  }, [activeView]);

  useEffect(() => {
    if (lastSubmitted) {
      localStorage.setItem('brocard_last_submitted', JSON.stringify(lastSubmitted));
    } else {
      localStorage.removeItem('brocard_last_submitted');
    }
  }, [lastSubmitted]);

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleRadarCreated = async (newRadar: BroQuiz) => {
    setRadar(newRadar);
    
    // Seed new attempts keyed to this quiz
    const updatedAttempts: ChallengerAttempt[] = [
      {
        id: `c-seeded-1-${Date.now()}`,
        quizId: newRadar.id,
        challengerName: 'Turki Al-Saeed',
        score: newRadar.questions.length,
        totalQuestions: newRadar.questions.length,
        failedOnQuestionText: null,
        failedLevel: 'none',
        dareAssigned: 'None',
        status: 'survived',
        city: 'Riyadh, KSA',
        timestamp: 'Just now',
        avatarSeed: 2,
        excuseMsg: 'Pristine 100%! Real brothers do not miss trivial details.',
        deviceType: 'iPhone 15'
      }
    ];

    setObservers(updatedAttempts);
    triggerNotification(`Active Bro Quiz under @${newRadar.slug} initialized!`);
    setActiveView('dashboard');
  };

  const handleSignalSubmitted = async (attempt: ChallengerAttempt) => {
    setObservers(prev => [attempt, ...prev]);
    setLastSubmitted(attempt);
    triggerNotification(`Battle result recorded for ${attempt.challengerName}!`);
    setActiveView('verdict');
  };

  const handleDeleteObserver = async (obsId: string) => {
    setObservers(prev => prev.filter(o => o.id !== obsId));
    triggerNotification("Challenger score cleared from scoreboard.");
  };

  const handleUnlockSuccessfully = (productName: string) => {
    triggerNotification(`Prestige Unlocked: ${productName} added dynamically!`);
  };

  const handleSimulateNewSignal = async () => {
    const randomNames = ['Bandar_H', 'Majeed_Riyadh', 'Saad.dxb', 'Faisal_Kuwaiti', 'Salem_Qat', 'Khalid_Jeddah'];
    const randomCities = ['Riyadh, KSA', 'Jeddah, KSA', 'Dubai, UAE', 'Kuwait City, KWT', 'Doha, QAT', 'Khobar, KSA'];
    const randomExcuses = [
      'Almost had it! The final question was tricky.',
      'I answered in 1.2 seconds, that should count as true bro!',
      'Unbelievable, you changed your late night spot since last week!',
      'This quiz was biased but the dare is funny, so I ACCEPT 🤡',
      'No way Maestro is better, Al Baik spicy always wins!'
    ];

    const failed = Math.random() > 0.35;
    const name = randomNames[Math.floor(Math.random() * randomNames.length)] + `_${Math.floor(Math.random() * 90) + 10}`;
    const city = randomCities[Math.floor(Math.random() * randomCities.length)];
    const excuse = Math.random() > 0.2 ? randomExcuses[Math.floor(Math.random() * randomExcuses.length)] : undefined;
    const score = failed ? Math.floor(Math.random() * (radar.questions.length - 1)) + 1 : radar.questions.length;
    
    let level: 'level1' | 'level2' | 'level3' | 'none' = 'none';
    let assignedDare = 'None';
    let status: 'survived' | 'wimped_out' | 'dare_accepted' | 'immunity_used' = 'survived';
    let failedQText: string | null = null;

    if (failed) {
      status = 'dare_accepted';
      const qIndex = Math.max(0, score - 1);
      failedQText = radar.questions[qIndex]?.text || 'Trivial logic check';
      
      if (score <= 1) {
        level = 'level1';
        assignedDare = radar.dareLevel1;
      } else if (score <= 3) {
        level = 'level2';
        assignedDare = radar.dareLevel2;
      } else {
        level = 'level3';
        assignedDare = radar.dareLevel3;
      }
    }

    const mockAttempt: ChallengerAttempt = {
      id: `c-mock-${Date.now()}`,
      quizId: radar.id,
      challengerName: name,
      score: score,
      totalQuestions: radar.questions.length,
      failedOnQuestionText: failedQText,
      failedLevel: level,
      dareAssigned: assignedDare,
      status: status,
      city: city,
      timestamp: 'Just now',
      avatarSeed: Math.floor(Math.random() * 10) + 1,
      excuseMsg: excuse,
      deviceType: 'iPhone 15 Pro (Safari)'
    };

    setObservers(prev => [mockAttempt, ...prev]);
    triggerNotification(`Simulated friend submission: ${name} scored ${score}/${radar.questions.length}!`);
  };

  const handleStartFreshDatabase = () => {
    setRadar(INITIAL_QUIZ);
    setObservers(INITIAL_CHALLENGERS);
    setLastSubmitted(null);
    localStorage.removeItem('brocard_last_submitted');
    triggerNotification("🧹 Sandbox telemetry has been cleanly restored!");
  };

  return (
    <div 
      dir={dir}
      className={`relative min-h-screen bg-[#0B0516] text-[#F8FAFC] flex flex-col items-center w-full max-w-full overflow-x-hidden pt-0 selection:bg-amber-500/30 selection:text-white ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}
    >
      
      {/* Absolute top simulation bar */}
      <div className="w-full bg-[#110A1F] border-b border-purple-500/10 py-2.5 px-4 z-40 text-xs text-slate-300 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center font-mono">
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Wafi Executive Console • <b>Wafi Dev Suite 2.0</b></span>
          <span className="border-r border-slate-700 h-3 mx-1 hidden sm:inline"></span>
          
          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/20">
            <Database className="w-3 h-3 text-amber-400" />
            {TRANSLATIONS[locale].sandboxMode}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={handleStartFreshDatabase}
            className="px-2.5 py-1 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/20 text-red-200 text-[10px] rounded transition-all flex items-center gap-1 cursor-pointer font-bold font-mono"
            title="Wipe database structure and seed clean startup session"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span>{TRANSLATIONS[locale].formatReset}</span>
          </button>

          <span className="hidden md:inline h-3 border-r border-slate-700"></span>

          <button
            onClick={() => setActiveView(activeView === 'observer' ? 'dashboard' : 'observer')}
            className="px-3 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-500/25 text-slate-100 font-black text-[10px] rounded-md transition-all flex items-center gap-1.5 uppercase cursor-pointer font-mono"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{TRANSLATIONS[locale].switchView}: {activeView === 'observer' ? 'Creator' : 'Challenger'}</span>
          </button>
        </div>
      </div>

      {/* Floating elegant Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 ${locale === 'ar' ? 'left-4' : 'right-4'} z-50 p-4 bg-gradient-to-r from-purple-950 to-[#110A1F] border-l-4 border-amber-500 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.65)] flex items-center gap-3 max-w-sm text-xs font-mono font-bold leading-normal text-slate-100`}
          >
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Header Bar */}
      <header className="w-full max-w-5xl px-4 py-6 border-b border-purple-500/10 flex justify-between items-center bg-[#0B0516]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveView('landing')}>
          <div className="h-10 w-10 rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center bg-purple-950/40">
            <span className="text-xl">👑</span>
          </div>
          <div className="text-left leading-none">
            <h1 className="font-sans font-black tracking-tight text-slate-100 text-sm sm:text-lg uppercase flex items-center gap-1.5">
              {TRANSLATIONS[locale].brandName}
              <span className="font-sans text-[8.5px] tracking-normal bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-sm">
                {locale === 'ar' ? 'تحدي الوفاء' : 'LOYALTY'}
              </span>
            </h1>
            <span className="text-[10px] font-mono font-bold text-purple-300 tracking-wide block mt-0.5">
              {TRANSLATIONS[locale].brandSubtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Elegant Arabic / English language picker */}
          <button
            onClick={() => setLocale(prev => prev === 'en' ? 'ar' : 'en')}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent hover:border-amber-400/40 border border-amber-500/25 text-amber-300 text-xs font-black rounded-lg transition-all cursor-pointer shadow-md"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{TRANSLATIONS[locale].toggleLocale}</span>
          </button>

          <span className="hidden md:inline-flex items-center gap-1.5 font-mono text-[9px] bg-purple-950/60 text-amber-300 border border-amber-505/20 py-1 px-3.5 rounded-full select-none shadow-sm">
            {TRANSLATIONS[locale].headerNode}
          </span>
        </div>
      </header>

      {/* Switchable Viewports */}
      <main className="w-full flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full pb-28 md:pb-36"
          >
            {activeView === 'landing' && (
              <LandingPage 
                onNavigate={(view) => setActiveView(view)} 
                mockSlug={radar.slug}
                locale={locale}
              />
            )}

            {activeView === 'create' && (
              <CreateRadarPage 
                onRadarCreated={handleRadarCreated} 
                onNavigateHome={() => setActiveView('landing')}
                locale={locale}
              />
            )}

            {activeView === 'observer' && (
              <PublicRadarPage 
                radar={radar} 
                onSignalSubmitted={handleSignalSubmitted}
                locale={locale}
              />
            )}

            {activeView === 'verdict' && (
              <ViralVerdictPage 
                radar={radar} 
                lastSubmittedObserver={lastSubmitted}
                onCreateMyOwnRadar={() => setActiveView('create')}
                locale={locale}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardPage 
                radar={radar} 
                observers={observers} 
                onDeleteObserver={handleDeleteObserver}
                onSimulateNewSignal={handleSimulateNewSignal}
                locale={locale}
              />
            )}

            {activeView === 'council' && (
              <CrownCouncilPage 
                observers={observers} 
                onNavigateToDashboard={() => setActiveView('dashboard')}
                locale={locale}
              />
            )}

            {activeView === 'boost' && (
              <BoostPage 
                onUnlockSuccessfully={handleUnlockSuccessfully}
                locale={locale}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      <nav id="bottom-navigation-tray" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#160B29]/90 backdrop-blur-lg border border-purple-500/25 p-2 rounded-2.5xl flex items-center gap-1 shadow-[0_12px_35px_rgba(0,0,0,0.7)] hover:border-amber-500/30 transition-all">
        {[
          { key: 'landing', label: TRANSLATIONS[locale].lobby, icon: Radio, desc: locale === 'ar' ? 'الميدان' : 'Lobby' },
          { key: 'dashboard', label: TRANSLATIONS[locale].telemetry, icon: Activity, desc: locale === 'ar' ? 'التحليلات' : 'Control' },
          { key: 'council', label: TRANSLATIONS[locale].leaderboard, icon: Crown, desc: locale === 'ar' ? 'المجلس' : 'Leaderboard' },
          { key: 'boost', label: TRANSLATIONS[locale].vault, icon: Sparkles, desc: locale === 'ar' ? 'الخزنة' : 'VIP Vault' }
        ].map((tab) => {
          const isSelected = activeView === tab.key || (tab.key === 'landing' && activeView === 'create');
          const IconComponent = tab.icon;
          return (
            <button
              id={`nav-btn-${tab.key}`}
              key={tab.key}
              onClick={() => setActiveView(tab.key as AppView)}
              className={`px-3.5 sm:px-5 py-2 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 min-w-[72px] sm:min-w-[96px] select-none ${
                isSelected 
                  ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-zinc-950 border border-amber-300 font-extrabold transform scale-102 shadow-lg shadow-amber-500/10' 
                  : 'text-purple-300/70 hover:text-slate-50 border border-transparent'
              }`}
            >
              <IconComponent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              <div className="flex flex-col items-center leading-none">
                <span className="text-[10px] sm:text-xs font-black tracking-tight">{tab.label}</span>
                <span className="text-[7.5px] opacity-75 font-mono tracking-wider">{tab.desc}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Aesthetic Footer */}
      <footer className="w-full py-16 border-t border-purple-500/5 bg-[#070311] mt-auto text-center text-xs text-slate-400 text-balance px-4 select-none">
        <p className="font-sans text-[10.5px] uppercase font-black text-amber-500 tracking-wider">
          <span className="font-sans font-black text-rose-500 text-xs mr-1">⚔️ {TRANSLATIONS[locale].brandName}</span> • {TRANSLATIONS[locale].brandSlogan}
        </p>
        <p className="mt-2.5 text-[11px] text-slate-400 leading-relaxed max-w-lg mx-auto">
          {TRANSLATIONS[locale].descFooter}
        </p>
        <p className="mt-4 text-[9px] font-mono text-slate-600">© 2026 {TRANSLATIONS[locale].brandName} Platform Inc. {TRANSLATIONS[locale].allRightsReserved}</p>
      </footer>

    </div>
  );
}
