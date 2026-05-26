/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Heart, Trophy, Zap, Shield, Sparkles, 
  MapPin, Smartphone, Star, ShieldCheck, UserCheck, 
  Bell, Eye, ArrowRight, BookOpen
} from 'lucide-react';

import { Radar, Observer, ObserverStatus, AppView } from './types';
import { INITIAL_RADAR, INITIAL_OBSERVERS, GCC_CITIES } from './data';

import LandingPage from './components/LandingPage';
import CreateRadarPage from './components/CreateRadarPage';
import PublicRadarPage from './components/PublicRadarPage';
import ViralVerdictPage from './components/ViralVerdictPage';
import DashboardPage from './components/DashboardPage';
import CrownCouncilPage from './components/CrownCouncilPage';
import BoostPage from './components/BoostPage';

export default function App() {
  // Sync states with localStorage for robust prototype experience
  const [radar, setRadar] = useState<Radar>(() => {
    const saved = localStorage.getItem('muraqib_radar');
    return saved ? JSON.parse(saved) : INITIAL_RADAR;
  });

  const [observers, setObservers] = useState<Observer[]>(() => {
    const saved = localStorage.getItem('muraqib_observers');
    return saved ? JSON.parse(saved) : INITIAL_OBSERVERS;
  });

  const [activeView, setActiveView] = useState<AppView>(() => {
    const saved = localStorage.getItem('muraqib_active_view');
    return (saved as AppView) || 'landing';
  });

  const [lastSubmitted, setLastSubmitted] = useState<Partial<Observer> | null>(() => {
    const saved = localStorage.getItem('muraqib_last_submitted');
    return saved ? JSON.parse(saved) : null;
  });

  // Global notification banner for actions (purchases/new signals)
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('muraqib_radar', JSON.stringify(radar));
  }, [radar]);

  useEffect(() => {
    localStorage.setItem('muraqib_observers', JSON.stringify(observers));
  }, [observers]);

  useEffect(() => {
    localStorage.setItem('muraqib_active_view', activeView);
  }, [activeView]);

  useEffect(() => {
    if (lastSubmitted) {
      localStorage.setItem('muraqib_last_submitted', JSON.stringify(lastSubmitted));
    } else {
      localStorage.removeItem('muraqib_last_submitted');
    }
  }, [lastSubmitted]);

  // Trigger temporary floating elegant notifications
  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Callback: User Configures a New Radar
  const handleRadarCreated = (newRadar: Radar) => {
    setRadar(newRadar);
    // Refresh with fresh initial observers matched specifically to the new question!
    const updatedObservers = INITIAL_OBSERVERS.map((obs, idx) => ({
      ...obs,
      radarId: newRadar.id,
      answer: newRadar.options[idx % newRadar.options.length]
    }));
    setObservers(updatedObservers);
    
    triggerNotification(`📡 Radar @muraqib/${newRadar.slug} activated successfully!`);
    setActiveView('dashboard'); // take them straight to see their dashboard
  };

  // Callback: Observer Submits Reply Note
  const handleSignalSubmitted = (newObsInput: Partial<Observer>) => {
    const freshObserver: Observer = {
      id: `obs-${Date.now()}`,
      radarId: radar.id,
      handle: newObsInput.handle || 'Secret Observer',
      isMasked: newObsInput.isMasked ?? true,
      answer: newObsInput.answer || 'No selection',
      msg: newObsInput.msg,
      city: newObsInput.city || 'Dubai',
      interestScore: newObsInput.interestScore || 75,
      repeatSignals: 1,
      activeAt: 'Just now',
      deviceType: newObsInput.deviceType || 'iPhone 15 Pro Max',
      status: (newObsInput.isMasked ? 'Masked Observer' : 'Standard Observer') as ObserverStatus,
      avatarSeed: newObsInput.avatarSeed || 1
    };

    setObservers(prev => [freshObserver, ...prev]);
    setLastSubmitted(freshObserver);
    triggerNotification(`📥 Captured active observer signal via ${freshObserver.city}`);
    setActiveView('verdict');
  };

  // Callback: Owner Deletes/Purges Observer from Dashboard
  const handleDeleteObserver = (obsId: string) => {
    setObservers(prev => prev.filter(o => o.id !== obsId));
    triggerNotification("🗑 Observer profile purged from signal data.");
  };

  // Callback: Owner Assigns Rank (King/Prince/Guard) from log
  const handlePromoteToCouncil = (obsId: string, newStatus: ObserverStatus) => {
    setObservers(prev => {
      return prev.map(o => {
        // Clear previous holder of the same status rank to avoid duplicate slots
        if (o.status === newStatus) {
          return { ...o, status: 'Elite Observer' as ObserverStatus };
        }
        // Apply status to target observer
        if (o.id === obsId) {
          return { ...o, status: newStatus };
        }
        return o;
      });
    });
    triggerNotification(`👑 Crown Council updated: assigned to ${newStatus}`);
  };

  // Action: Simulated Checkout Premium Unlock Success
  const handleUnlockSuccessfully = (productName: string) => {
    triggerNotification(`💎 Premium Active: ${productName} applied!`);
  };

  // Action: Trigger Simulated Random Observer Signal
  const handleSimulateNewSignal = () => {
    const randomHandles = ['saif.alghanim', 'dubaicourier', 'reem.dxb', 'faisal_sa', 'latifa_shj', 'kuwaiti.glow', 'hamad.qtr'];
    const randomCities = ['Riyadh', 'Jeddah', 'Dubai', 'Abu Dhabi', 'Kuwait City', 'Salmiya', 'Doha', 'Khobar'];
    const randomMessages = [
      "I was hoping you'd notice this link before it expires.",
      "Spotted your Snapchat story block.",
      "Just checking your frequency. High key caught me.",
      "Let's see if our interest match rate is high.",
      "Always observing in silence ✨"
    ];

    const isRandMasked = Math.random() > 0.4;
    const randHandle = isRandMasked 
      ? `Masked Observer (${['Golden Mist', 'Sunset Peach', 'Plum Nebula', 'Emerald Fire'][Math.floor(Math.random() * 4)]})`
      : randomHandles[Math.floor(Math.random() * randomHandles.length)];

    const chosenOption = radar.options[Math.floor(Math.random() * radar.options.length)];
    const chosenCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    const chosenMsg = Math.random() > 0.3 ? randomMessages[Math.floor(Math.random() * randomMessages.length)] : undefined;
    const randomScore = 65 + Math.floor(Math.random() * 35);
    const randomRepeats = Math.floor(Math.random() * 12) + 1;

    const mockObs: Observer = {
      id: `obs-${Date.now()}`,
      radarId: radar.id,
      handle: randHandle,
      isMasked: isRandMasked,
      answer: chosenOption,
      msg: chosenMsg,
      city: chosenCity,
      interestScore: randomScore,
      repeatSignals: randomRepeats,
      activeAt: '3 mins ago',
      deviceType: 'iPhone 15 Pro (Snapchat App)',
      status: (isRandMasked ? 'Masked Observer' : 'Standard Observer') as ObserverStatus,
      avatarSeed: Math.floor(Math.random() * 10) + 1
    };

    setObservers(prev => [mockObs, ...prev]);
    triggerNotification(`📡 [Simulation] Mock signal captured from ${chosenCity}!`);
  };

  // Switch View modes quickly from header (Observer Form vs. Dashboard)
  const toggleViewMode = () => {
    if (activeView === 'observer') {
      setActiveView('dashboard');
    } else {
      setActiveView('observer');
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg text-slate-100 flex flex-col items-center">
      
      {/* Absolute top simulation helper bar */}
      <div className="w-full bg-[#1A0C2B] border-b border-purple-500/15 py-2.5 px-4 z-40 text-xs text-slate-350 flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center bg-gradient-to-r from-purple-950/20 to-pink-950/20 font-mono">
        <span className="flex items-center gap-1.5 justify-center md:justify-start">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Simulation Workspace • <b>Muraqib Dev Mode</b></span>
        </span>
        
        {/* Toggle to enter observer screen */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          <span className="text-[10px] text-pink-300">Quick-Test the viral loop:</span>
          <button
            id="simulation-toggle-btn"
            onClick={toggleViewMode}
            className="px-3 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-600/35 text-slate-100 font-extrabold text-[10px] rounded-md transition-all flex items-center gap-1.5 uppercase pointer-cursor"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Switch to {activeView === 'observer' ? 'Owner Dashboard' : 'Observer view (/r/)'}</span>
          </button>
        </div>
      </div>

      {/* Elegant Banner Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 p-4 bg-gradient-to-r from-purple-900 to-[#120822] border-l-4 border-amber-500 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center gap-3 max-w-sm text-xs font-mono font-bold leading-normal text-slate-105"
          >
            <Bell className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Bar */}
      <header className="w-full max-w-5xl px-4 py-6 border-b border-purple-500/10 flex justify-between items-center bg-brand-bg/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5 cursor-pointer animate-fadeIn" onClick={() => setActiveView('landing')}>
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-purple-500/30 shadow-[0_0_15px_rgba(124,58,237,0.25)] flex items-center justify-center bg-purple-950/40">
            <img 
              src="/src/assets/images/muraqib_logo_1779826875008.png" 
              alt="Muraqib Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-left leading-none">
            <h1 className="font-sans font-black tracking-widest text-slate-100 text-sm uppercase flex items-center gap-1.5">
              MURAQIB
              <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded-sm">المرقب</span>
            </h1>
            <span className="text-[9px] font-mono font-bold text-[#A78BFA] tracking-wide block mt-0.5">THE OBSERVER • GCC INTEL</span>
          </div>
        </div>

        {/* Current status display tags */}
        <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] bg-purple-950/60 text-[#D6C7FF]/70 border border-purple-500/15 py-1 px-3.5 rounded-full select-none shadow-sm">
          📍 Riyadh Active Node
        </span>
      </header>

      {/* Main Container Viewport */}
      <main className="w-full flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {activeView === 'landing' && (
              <LandingPage 
                onNavigate={(view) => setActiveView(view)} 
                mockSlug={radar.slug}
              />
            )}

            {activeView === 'create' && (
              <CreateRadarPage 
                onRadarCreated={handleRadarCreated} 
                onNavigateHome={() => setActiveView('landing')}
              />
            )}

            {activeView === 'observer' && (
              <PublicRadarPage 
                radar={radar} 
                onSignalSubmitted={handleSignalSubmitted}
              />
            )}

            {activeView === 'verdict' && (
              <ViralVerdictPage 
                radar={radar} 
                lastSubmittedObserver={lastSubmitted}
                onCreateMyOwnRadar={() => setActiveView('create')}
              />
            )}

            {activeView === 'dashboard' && (
              <DashboardPage 
                radar={radar} 
                observers={observers} 
                onDeleteObserver={handleDeleteObserver}
                onPromoteToCouncil={handlePromoteToCouncil}
                onSimulateNewSignal={handleSimulateNewSignal}
              />
            )}

            {activeView === 'council' && (
              <CrownCouncilPage 
                observers={observers} 
                onNavigateToDashboard={() => setActiveView('dashboard')}
              />
            )}

            {activeView === 'boost' && (
              <BoostPage 
                onUnlockSuccessfully={handleUnlockSuccessfully}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Responsive Elegant Float Bottom Navigation Menu Trays */}
      <nav id="bottom-navigation-tray" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-brand-surface/75 backdrop-blur-lg border border-purple-500/25 p-2 rounded-2.5xl flex items-center gap-1 bg-gradient-to-[#1C1032]/80 to-[#120822]/80 shadow-[0_8px_30px_rgb(0,0,0,0.65)] hover:border-purple-400/40 transition-all">
        
        {/* Navigation buttons */}
        {[
          { key: 'landing', label: 'Radar Lobby', emoji: '📡', desc: 'Secure Entrance' },
          { key: 'dashboard', label: 'Intelligence', emoji: '📊', desc: 'Frequencies' },
          { key: 'council', label: 'Council', emoji: '👑', desc: 'Top Admirers' },
          { key: 'boost', label: 'Store Boost', emoji: '💎', desc: 'Premium Perks' }
        ].map((tab) => {
          const isSelected = activeView === tab.key || (tab.key === 'landing' && activeView === 'create');
          return (
            <button
              id={`nav-btn-${tab.key}`}
              key={tab.key}
              onClick={() => setActiveView(tab.key as AppView)}
              className={`px-3.5 sm:px-5 py-2 rounded-2xl font-sans transition-all duration-300 tracking-wide cursor-pointer flex flex-col items-center justify-center gap-1 min-w-[76px] sm:min-w-[100px] select-none ${
                isSelected 
                  ? 'bg-gradient-to-b from-purple-800/95 to-pink-700/95 text-slate-100 shadow-[0_4px_15px_rgba(167,139,250,0.25)] border border-purple-400/40 transform scale-102 font-bold font-sans' 
                  : 'text-[#B6A8D6]/70 hover:text-slate-50 hover:bg-[#221240]/60 border border-transparent font-medium font-sans'
              }`}
            >
              <div className={`text-lg sm:text-xl md:text-2xl transition-transform duration-300 ${isSelected ? 'scale-110 animate-pulse-slow filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'group-hover:scale-110'}`}>
                {tab.emoji}
              </div>
              <div className="flex flex-col items-center leading-none">
                <span className="font-extrabold text-[10px] sm:text-[11px] tracking-tight">{tab.label}</span>
                <span className="hidden xs:inline text-[8px] opacity-70 font-mono tracking-wider">{tab.desc}</span>
              </div>
            </button>
          );
        })}

      </nav>

      {/* Subtle brand Footer */}
      <footer className="w-full py-16 border-t border-purple-500/5 bg-[#0B0519] mt-auto font-sans text-center text-xs text-[#B6A8D6]/40 text-balance px-4 select-none">
        <div className="flex justify-center mb-4">
          <img 
            src="/src/assets/images/muraqib_logo_1779826875008.png" 
            alt="Muraqib Emblem" 
            className="w-10 h-10 object-cover rounded-lg opacity-40 hover:opacity-85 transition-opacity"
            referrerPolicy="no-referrer"
          />
        </div>
        <p className="tracking-widest font-mono text-[10px] uppercase font-semibold">MURAQIB • REGIONAL SOCIAL INTELLIGENCE</p>
        <p className="mt-2 text-[11px] leading-relaxed">
          Designed for elite curiosities, secret checking frequencies, and high attention in GCC circles.<br />
          Riyadh • Dubai • Kuwait City • Doha • Manama • Muscat.
        </p>
        <p className="mt-4 text-[9px] font-mono text-[#D6C7FF]/20">© 2026 Muraqib Platform Inc. Authorized Cryptography Active.</p>
      </footer>

    </div>
  );
}
