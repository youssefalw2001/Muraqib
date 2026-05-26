/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, Radio, Sparkles, MapPin, Smartphone } from 'lucide-react';
import { Radar, Observer, ObserverStatus } from '../types';
import { GCC_CITIES } from '../data';

interface PublicRadarPageProps {
  radar: Radar;
  onSignalSubmitted: (newObserver: Partial<Observer>) => void;
}

export default function PublicRadarPage({ radar, onSignalSubmitted }: PublicRadarPageProps) {
  // Observer input state
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [handle, setHandle] = useState('');
  const [isMasked, setIsMasked] = useState(true);
  const [message, setMessage] = useState('');
  const [simulatedCity, setSimulatedCity] = useState(GCC_CITIES[2]); // Default Jumeirah/Dubai area
  const [isTransmitting, setIsTransmitting] = useState(false);

  // Generate a random aura name for masked observers
  const colorAuras = ['Plum Glow', 'Sunset Pink', 'Amber Fire', 'Gold Aura', 'Emerald Mist', 'Violet Phantom', 'Celestial Rose'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer) return;

    setIsTransmitting(true);

    // Simulate sending high-frequency signal delay
    setTimeout(() => {
      const observerHandle = isMasked 
        ? `Masked Observer (${colorAuras[Math.floor(Math.random() * colorAuras.length)]})` 
        : (handle.trim() || 'anonymous.gcc');

      // Calculate Interest Score based on inputs
      let baseInterest = 60 + Math.floor(Math.random() * 20); // 60-80 base
      if (selectedAnswer.toLowerCase().includes('day') || selectedAnswer.toLowerCase().includes('always') || selectedAnswer.toLowerCase().includes('charts')) {
        baseInterest += 15;
      }
      if (message.length > 20) {
        baseInterest += 5;
      }
      const finalScore = Math.min(100, baseInterest);

      const newObserver: Partial<Observer> = {
        radarId: radar.id,
        handle: observerHandle,
        isMasked,
        answer: selectedAnswer,
        msg: message.trim() || undefined,
        city: simulatedCity.split(' ')[0], // remove emoji
        interestScore: finalScore,
        repeatSignals: 1, // first sign
        deviceType: 'iPhone 15 Pro Max (Snapchat App)',
        status: isMasked ? 'Masked Observer' : 'Standard Observer' as ObserverStatus,
        avatarSeed: Math.floor(Math.random() * 10) + 1
      };

      onSignalSubmitted(newObserver);
      setIsTransmitting(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg px-4 py-8 mx-auto pb-24">
      {/* Target Radar Owner Profile Card */}
      <div className="bg-gradient-to-b from-[#1E1134] to-[#120822] border border-purple-500/20 rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-6 text-center">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-amber-500 to-pink-500" />
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#EC4899]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Live Radar Pulsing Badge */}
        <div className="inline-flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/20 px-3 py-1 rounded-full mb-4">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[9px] text-emerald-300 tracking-wider uppercase font-extrabold">
            RADAR CURRENTLY ACTIVE • رادار نشط
          </span>
        </div>

        {/* Fancy Halo Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 animate-spin-slow blur-xs" />
          <div className="relative w-full h-full rounded-full bg-[#1A0D2E] flex items-center justify-center border-2 border-[#120822]">
            <span className="text-3xl">✨</span>
          </div>
        </div>

        <h3 className="font-sans font-bold text-xl text-slate-100 uppercase">
          {radar.displayName}
        </h3>
        <p className="font-mono text-xs text-amber-400 mt-1">
          @muraqib/{radar.slug}
        </p>
        <span className="inline-block mt-2 font-sans text-xs bg-purple-950/60 text-[#D6C7FF]/80 px-3 py-0.5 rounded-full border border-purple-500/10">
          📍 Connected via {radar.city}
        </span>
      </div>

      {/* Main Signal Transmission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Multiple Choice Question */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl relative">
          <h4 className="text-[10px] font-mono tracking-widest text-[#B6A8D6] uppercase mb-1">
            Provocative Signal Request / السؤال الأساسي
          </h4>
          <h5 className="text-lg font-bold text-slate-100 italic font-sans mb-5 text-balance">
            "{radar.question}"
          </h5>

          <div className="space-y-3">
            {radar.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              return (
                <div
                  id={`observer-option-${idx}`}
                  key={idx}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`border rounded-xl p-3.5 cursor-pointer transition-all duration-200 text-sm flex items-center justify-between ${
                    isSelected
                      ? 'border-[#FACC15] bg-[#311C54] text-slate-100 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.15)]'
                      : 'border-purple-500/15 bg-[#130925]/70 text-[#D6C7FF] hover:border-purple-500/35 hover:bg-[#1C1032]/40'
                  }`}
                >
                  <span>{opt}</span>
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#FACC15] bg-[#FACC15]' : 'border-[#B6A8D6]/30'
                  }`}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-purple-950" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Privacy Configuration Mode (Masked/Public) */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl">
          <h4 className="text-[10px] font-mono tracking-widest text-[#B6A8D6] uppercase mb-4">
            Transmission Privacy / الخصوصية والأمان
          </h4>

          {/* Mask Toggle Tabs */}
          <div className="grid grid-cols-2 bg-[#130925] p-1 rounded-xl border border-purple-500/10 mb-4">
            <button
              id="observer-mode-masked-btn"
              type="button"
              onClick={() => setIsMasked(true)}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isMasked 
                  ? 'bg-purple-800 text-slate-100 shadow-sm border border-purple-600/30' 
                  : 'text-[#B6A8D6]/60 hover:text-slate-200'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5 text-pink-400" />
              <span>Masked Aura</span>
            </button>
            <button
              id="observer-mode-public-btn"
              type="button"
              onClick={() => setIsMasked(false)}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isMasked 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-[#1C0F35] shadow-xs' 
                  : 'text-[#B6A8D6]/60 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Handle</span>
            </button>
          </div>

          {isMasked ? (
            <div className="bg-pink-950/20 p-3.5 rounded-xl border border-pink-500/15 text-left mb-2">
              <span className="text-[10px] bg-pink-500/15 text-pink-300 font-mono font-bold px-2 py-0.5 rounded-sm inline-block mb-1">
                FULLY MASKED FREQUENCY ENCRYPTED
              </span>
              <p className="text-[11px] text-pink-200/80 leading-relaxed mt-1">
                Your direct social account handle remains protected. Muraqib will generate a custom masked moniker based on your signal aura. No passwords requested.
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-2 animate-fadeIn">
              <label className="block text-xs font-mono text-[#D6C7FF]/70 uppercase tracking-wider font-bold">
                Your Public Handle / حساب التواصل
              </label>
              <input
                id="observer-handle-input"
                type="text"
                required={!isMasked}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g. jassim.dxb, rasha_al"
                className="w-full bg-[#130925] border border-purple-500/20 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
              <span className="text-[10px] text-[#B6A8D6]/50 block">This will place you clearly in their Crown Council to seek high attention.</span>
            </div>
          )}
        </div>

        {/* Step 3: Optional Riddle Note Input */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl">
          <label className="block text-xs font-mono text-[#D6C7FF]/70 uppercase tracking-wider mb-2 font-bold flex justify-between">
            <span>Send Secret Note / رسالة سرية</span>
            <span className="text-[#B6A8D6]/40">Optional</span>
          </label>
          <textarea
            id="observer-msg-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose a cryptic warning, a clue, or a confession..."
            rows={2}
            maxLength={180}
            className="w-full bg-[#130925] border border-purple-500/20 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-[#B6A8D6]/40 focus:outline-none focus:border-purple-400 transition-all font-sans"
          />
          <div className="flex justify-between font-mono text-[9px] text-[#B6A8D6]/40 mt-1">
            <span>Maximum 180 characters</span>
            <span>{message.length}/180</span>
          </div>
        </div>

        {/* Simulated Telemetry / Environment Capture */}
        <div className="bg-[#130925] border border-purple-500/10 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-500" />
            <div className="text-left">
              <span className="block text-[10px] font-mono text-[#B6A8D6]/60 leading-none">Simulating Device Source</span>
              <span className="text-[11px] text-slate-200 font-bold block mt-1 font-mono">iPhone 15 Pro (Safari)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-500" />
            <div className="text-left w-full">
              <span className="block text-[10px] font-mono text-[#B6A8D6]/60 leading-none">Signal Target Node</span>
              <select
                id="observer-select-sim-city"
                value={simulatedCity}
                onChange={(e) => setSimulatedCity(e.target.value)}
                className="text-[11px] bg-transparent text-amber-400 font-bold border-none focus:outline-none p-0 cursor-pointer text-left block mt-0.5"
              >
                {GCC_CITIES.map(c => (
                  <option key={c} value={c} className="bg-[#130925] text-slate-200">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Transmission */}
        <div className="pt-2">
          <button
            id="observer-submit-btn"
            type="submit"
            disabled={!selectedAnswer || isTransmitting}
            className="w-full relative py-4 bg-gradient-to-r from-purple-800 to-pink-600 hover:from-purple-700 hover:to-pink-500 text-slate-100 font-sans font-bold text-sm uppercase rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.45)] cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-98 flex items-center justify-center gap-2.5"
          >
            {isTransmitting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-slate-100 border-t-transparent animate-spin inline-block" />
                <span>Transmitting High Frequency Signal...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Transmit Signal • إرسال الإشارة ⚡</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
