/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Heart, RefreshCw, Zap, Sparkles, MapPin, Check, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { RadarMode, Radar } from '../types';
import { RADAR_MODES, GCC_CITIES } from '../data';

interface CreateRadarPageProps {
  onRadarCreated: (newRadar: Radar) => void;
  onNavigateHome: () => void;
}

export default function CreateRadarPage({ onRadarCreated, onNavigateHome }: CreateRadarPageProps) {
  // Wizard State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [selectedCity, setSelectedCity] = useState(GCC_CITIES[0]);
  const [selectedMode, setSelectedMode] = useState<RadarMode>('crush');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  
  // Track display modes list
  const activeModeDetails = RADAR_MODES.find(m => m.id === selectedMode) || RADAR_MODES[1];

  // Set default question & options when selectedMode transitions
  useEffect(() => {
    const modeConfig = RADAR_MODES.find(m => m.id === selectedMode);
    if (modeConfig) {
      setQuestion(modeConfig.defaultQuestion);
      setOptions([...modeConfig.defaultOptions]);
    }
  }, [selectedMode]);

  // Handle updates to options
  const handleUpdateOption = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !username) return;

    // Filter out blank options
    const finalOptions = options.filter(opt => opt.trim() !== '');
    if (finalOptions.length < 2) return;

    const formattedSlug = username.toLowerCase().replace(/[^a-z0-9._-]/g, '');

    const newRadar: Radar = {
      id: `radar-${Date.now()}`,
      displayName,
      slug: formattedSlug,
      city: selectedCity,
      mode: selectedMode,
      question: question.trim(),
      options: finalOptions,
      createdAt: new Date().toISOString()
    };

    onRadarCreated(newRadar);
  };

  // Icon mapping helper
  const getModeIcon = (iconName: string, colorClass: string) => {
    const props = { className: `w-5 h-5 text-amber-400` };
    switch (iconName) {
      case 'Radio': return <Radio {...props} />;
      case 'Heart': return <Heart {...props} className="w-5 h-5 text-pink-500" />;
      case 'RefreshCw': return <RefreshCw {...props} className="w-5 h-5 text-amber-500 animate-spin-slow" />;
      case 'Zap': return <Zap {...props} className="w-5 h-5 text-emerald-400" />;
      default: return <Radio {...props} />;
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-8 mx-auto pb-24">
      {/* Back button */}
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-2 mb-6 font-mono text-xs text-[#B6A8D6] hover:text-amber-400 transition-colors pointer-cursor"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO HOME</span>
      </button>

      {/* Decorative Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-[#FACC15]/10 border border-[#FACC15]/20 px-3 py-1 rounded-full mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
          <span className="font-mono text-[9px] text-[#FACC15] tracking-wider uppercase font-extrabold">
            Configure Social Intent • ضبط الطقس
          </span>
        </div>
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight font-sans">
          Initialize Your Radar Hook
        </h2>
        <p className="text-xs text-[#D6C7FF]/70 max-w-md mx-auto mt-2 leading-relaxed">
          Establish your frequency and questions. Reveal who crosses your path in GCC premium circles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Owner Details */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#7C3AED]/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2 mb-5">
            <span className="h-5 w-5 rounded-full bg-purple-500/15 text-[#A78BFA] flex items-center justify-center text-xs font-mono font-bold">1</span>
            Sovereign Identity Details
          </h3>

          <div className="space-y-4">
            {/* Display Name Input */}
            <div>
              <label className="block text-xs font-mono text-[#D6C7FF]/75 uppercase tracking-wider mb-2 font-bold flex justify-between">
                <span>Display Name / الاسم الظاهر</span>
                <span className="text-[#A78BFA] text-[10px]">What observers see</span>
              </label>
              <input
                id="radar-input-display-name"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Fatima Al-Saud, Lulwa M."
                className="w-full bg-[#130925] border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-[#B6A8D6]/40 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30 transition-all font-sans"
              />
            </div>

            {/* Username Slug Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#D6C7FF]/75 uppercase tracking-wider mb-2 font-bold flex justify-between">
                  <span>Radar Username / الرابط</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A78BFA]/50 select-none">
                    muraqib/
                  </span>
                  <input
                    id="radar-input-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="lulwa.m"
                    className="w-full bg-[#130925] border border-purple-500/20 rounded-xl pl-20 pr-4 py-3 text-sm text-slate-150 font-mono placeholder-[#B6A8D6]/30 focus:outline-none focus:border-purple-400 transition-all text-[#FACC15]"
                  />
                </div>
              </div>

              {/* City Selection Dropdown */}
              <div>
                <label className="block text-xs font-mono text-[#D6C7FF]/75 uppercase tracking-wider mb-2 font-bold">
                  <span>Detecting Location / المدينة</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A78BFA]">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <select
                    id="radar-select-city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#130925] border border-purple-500/20 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-purple-400 transition-all appearance-none cursor-pointer"
                  >
                    {GCC_CITIES.map(city => (
                      <option key={city} value={city} className="bg-[#1C1032] text-slate-100 py-2">
                        {city}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A78BFA]/60 text-xs font-semibold">▼</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Emotional Strategy Modes */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#EC4899]/5 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2 mb-5">
            <span className="h-5 w-5 rounded-full bg-pink-500/15 text-pink-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
            Select Emotional Mode / وضع الرادار
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RADAR_MODES.map((mode) => {
              const isSelected = selectedMode === mode.id;
              return (
                <div
                  id={`radar-mode-btn-${mode.id}`}
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as RadarMode)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-40 ${
                    isSelected
                      ? 'border-[#FACC15] bg-[#2C184B]/70 shadow-[0_0_12px_rgba(250,204,21,0.25)]'
                      : 'border-purple-500/15 bg-[#130925]/80 hover:border-purple-500/35 hover:bg-[#1E1134]/30'
                  }`}
                >
                  {/* Decorative background glow for selected card */}
                  {isSelected && (
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#FACC15]/5 rounded-full blur-xl pointer-events-none" />
                  )}

                  <div className="flex items-start justify-between">
                    <div className="p-2 h-9 w-9 rounded-lg bg-pink-950/40 border border-purple-500/25 flex items-center justify-center">
                      {getModeIcon(mode.icon, mode.color)}
                    </div>
                    {isSelected && (
                      <span className="h-5 w-5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 text-[#1C0F35] stroke-[4]" />
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h4 className="font-sans font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
                      {mode.name}
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded-xs font-bold">
                        {mode.arabicName}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#D6C7FF]/65 mt-1 leading-relaxed">
                      {mode.tagline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Provocative Prompts Options */}
        <div className="bg-[#1C1032]/95 border border-purple-500/15 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#34D399]/5 rounded-full blur-2xl pointer-events-none"></div>

          <h3 className="font-sans font-bold text-lg text-slate-100 flex items-center gap-2 mb-5">
            <span className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
            Design Your Intimacy Trap
          </h3>

          <div className="space-y-4">
            {/* The Question */}
            <div>
              <label className="block text-xs font-mono text-[#D6C7FF]/70 uppercase tracking-wider mb-2 font-bold">
                Radar Hook Question / السؤال والخطاف
              </label>
              <textarea
                id="radar-input-question"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Compose a highly curious question..."
                rows={2}
                className="w-full bg-[#130925] border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-slate-100 font-sans focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all font-semibold italic text-[#FACC15]"
              />
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-mono text-[#D6C7FF]/70 uppercase tracking-wider font-bold">
                  Multiple Choice Answers / الخيارات المطروحة
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={options.length >= 6}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#A78BFA] hover:text-amber-400 disabled:opacity-40 transition-colors pointer-cursor"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD OPTION ({options.length}/6)</span>
                </button>
              </div>

              {options.map((opt, index) => (
                <div key={index} className="flex gap-2.5 items-center">
                  <span className="font-mono text-xs text-amber-500/60 font-bold w-5">
                    0{index + 1}.
                  </span>
                  <input
                    id={`radar-input-option-${index}`}
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => handleUpdateOption(index, e.target.value)}
                    placeholder={`Answer option ${index + 1}...`}
                    className="flex-1 bg-[#130925] border border-purple-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-sans focus:outline-none focus:border-purple-400"
                  />
                  {options.length > 2 && (
                    <button
                      id={`radar-remove-option-${index}`}
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-pink-400/70 hover:text-rose-400 hover:bg-pink-950/20 rounded-lg transition-colors pointer-cursor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Royal Ritual Panel */}
        <div className="flex flex-col items-center pt-4">
          <button
            id="radar-submit-btn"
            type="submit"
            className="w-full relative px-10 py-4 text-center bg-gradient-to-r from-[#FACC15] via-[#EAB308] to-[#CA8A04] hover:brightness-110 text-brand-surface font-sans font-black text-base uppercase rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(250,204,21,0.25)] hover:shadow-[0_4px_35px_rgba(250,204,21,0.45)] cursor-pointer active:scale-98"
          >
            <span>Activate Radar Signal • إطلاق التردد ⚡</span>
          </button>
          
          <p className="text-[10px] font-mono text-[#D6C7FF]/40 mt-3 uppercase tracking-wider">
            Upon activation, an implicit encryption token is wired to your local browser storage.
          </p>
        </div>

      </form>
    </div>
  );
}
