/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Sparkles, MapPin, Smartphone, Activity, TrendingUp, Heart, Share2, MessageSquare, 
  Check, Trash2, Filter, Zap, Globe, ShieldCheck, AlertCircle, Palette, Download, Copy, User, X, Camera, Lock, Play, Volume2, Flame, Trophy, Skull, Trash
} from 'lucide-react';
import { ChallengerAttempt, BroTheme } from '../types';

interface DashboardPageProps {
  radar: any; // BroQuiz
  observers: ChallengerAttempt[]; // ChallengerAttempt[]
  onDeleteObserver: (id: string) => void;
  onPromoteToCouncil?: (id: string, newStatus: any) => void;
  onSimulateNewSignal: () => void;
}

export default function DashboardPage({ 
  radar, 
  observers, 
  onDeleteObserver, 
  onSimulateNewSignal 
}: DashboardPageProps) {
  
  // Local state for filtering
  const [filterMode, setFilterMode] = useState<'all' | 'survived' | 'roasted' | 'cowards'>('all');
  const [linkCopied, setLinkCopied] = useState(false);
  const [storyTheme, setStoryTheme] = useState<BroTheme>('onyx');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [storyCopied, setStoryCopied] = useState(false);

  // Editable sticker helper in dashboard
  const [stickerHeadline, setStickerHeadline] = useState(radar.displayName ? `WHO KNOWS ME BEST? ⚔️` : "WHO IS A REAL BRO?");
  const [customPrizeGoal, setCustomPrizeGoal] = useState(radar.rewardWinner || "Free Al Baik dinner meal 🍗");

  const storyCardRef = useRef<HTMLDivElement>(null);

  // Status counters
  const totalAttempts = observers.length;
  const survivedCount = observers.filter(o => o.status === 'survived').length;
  const roastedCount = observers.filter(o => o.status === 'dare_accepted' || o.status === 'immunity_used').length;
  const cowardsCount = observers.filter(o => o.status === 'wimped_out').length;

  const avgScore = totalAttempts > 0 
    ? Math.round((observers.reduce((sum, o) => sum + o.score, 0) / (totalAttempts * (radar.questions?.length || 4))) * 100)
    : 0;

  // Render direct pure canvas image download to prevent any html2canvas OKLCH css parsing blocks entirely!
  const handleSpawnViralKit = () => {
    setIsGeneratingImg(true);

    // Auto copy share link
    const fullUrl = `${window.location.origin}/brocard/${radar.slug}`;
    try {
      navigator.clipboard.writeText(fullUrl);
      setStoryCopied(true);
      setTimeout(() => setStoryCopied(false), 2000);
    } catch (e) {}

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 700;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw standard gradients
          const grad = ctx.createLinearGradient(0, 0, 0, 700);
          if (storyTheme === 'riyadhGold') {
            grad.addColorStop(0, '#231505');
            grad.addColorStop(1, '#0c0702');
          } else if (storyTheme === 'royalCrimson') {
            grad.addColorStop(0, '#310A21');
            grad.addColorStop(1, '#0e030a');
          } else if (storyTheme === 'cyberToxic') {
            grad.addColorStop(0, '#042416');
            grad.addColorStop(1, '#010f09');
          } else {
            grad.addColorStop(0, '#130925');
            grad.addColorStop(1, '#06020c');
          }
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 500, 700);

          // Draw neon outer frame
          ctx.strokeStyle = 
            storyTheme === 'riyadhGold' ? '#FBBF24' :
            storyTheme === 'royalCrimson' ? '#F43F5E' :
            storyTheme === 'cyberToxic' ? '#10B981' : '#8B5CF6';
          ctx.lineWidth = 8;
          ctx.strokeRect(10, 10, 480, 680);

          // Header Text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`TESTING TRUE BROTHERS STATUS`, 250, 50);

          ctx.fillStyle = '#94A3B8';
          ctx.font = '12px monospace';
          ctx.fillText(`BY @${radar.displayName.toUpperCase()}`, 250, 75);

          // Draw beautiful sticker box center
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillRect(60, 160, 380, 260);
          ctx.strokeRect(60, 160, 380, 260);

          ctx.fillStyle = '#FF75B5';
          ctx.font = '900 12px monospace';
          ctx.fillText(stickerHeadline.toUpperCase(), 250, 205);

          ctx.fillStyle = '#F8FAFC';
          ctx.font = 'italic bold 18px sans-serif';
          // Draw first question
          const qText = radar.questions?.[0]?.text || "Who is my favorite footie player?";
          ctx.fillText(`"${qText.slice(0, 38)}..."`, 250, 255);

          ctx.fillStyle = '#FFBE1A';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(`👑 GRAND PRIZE: ${customPrizeGoal}`, 250, 325);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`ANSWER 4 LOYALTY TRIVIAS TO WIN`, 250, 375);

          // Draw Snapchat/IG Link sticker represent
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(250, 520, 25, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText("LINK 🔗", 250, 525);

          ctx.fillStyle = '#FBBF24';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(`brocard/r/${radar.slug}`, 250, 570);

          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.font = '10px monospace';
          ctx.fillText("PASTE LINK STICKER DYNAMICALLY OVER THIS CARD IN STORIES", 250, 630);

          setGeneratedImgUrl(canvas.toDataURL('image/png'));
          setShowShareModal(true);
        }
      } catch (e) {
        console.error(e);
      }
      setIsGeneratingImg(false);
    }, 800);
  };

  const handleDownloadBackup = () => {
    if (!generatedImgUrl) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = generatedImgUrl;
    downloadLink.download = `brocard_sticker_${storyTheme}_${radar.slug}.png`;
    downloadLink.click();
  };

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/brocard/${radar.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Speaks out the friend getting roasted!
  const triggerVoiceShameText = (challengerName: string, level: string, dareName: string) => {
    const utterance = new SpeechSynthesisUtterance(`Hear ye, hear ye! Announcement to the entire snap chat story list. ${challengerName} failed sultan's loyalty check, hitting the checkpoint ${level}! They must now complete this dare: ${dareName}. Clown status officially certified!`);
    utterance.pitch = 1.05;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const filteredChallengers = observers.filter(obs => {
    if (filterMode === 'survived') return obs.status === 'survived';
    if (filterMode === 'roasted') return obs.status === 'dare_accepted' || obs.status === 'immunity_used';
    if (filterMode === 'cowards') return obs.status === 'wimped_out';
    return true;
  });

  return (
    <div className="w-full max-w-5xl px-4 py-8 mx-auto pb-32 text-left">
      
      {/* Dashboard top header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="font-mono text-[9px] text-rose-400 tracking-wider font-extrabold uppercase">
              Loyalty Central Hub • مركز السيطرة
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold italic text-slate-100 tracking-tight">
            Creator Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-mono flex items-center gap-2">
            <span>Owner: <span className="text-[#FF75B5] font-semibold">{radar.displayName}</span></span>
            <span className="text-purple-500/40">•</span>
            <span>Link slug: <span className="text-yellow-300">/brocard/{radar.slug}</span></span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2.5 w-full md:w-auto">
          <button
            onClick={onSimulateNewSignal}
            className="flex-1 md:flex-none px-4.5 py-2.5 bg-purple-950/70 hover:bg-purple-900 border border-purple-500/30 text-emerald-400 font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 animate-bounce" />
            <span>Simulate Friend Play ⚔️</span>
          </button>

          <button
            onClick={handleCopyLink}
            className={`flex-1 md:flex-none px-4.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer ${
              linkCopied ? 'bg-emerald-500 text-zinc-950 shadow' : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950'
            }`}
          >
            {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{linkCopied ? 'COPIED!' : 'Copy Private URL'}</span>
          </button>
        </div>
      </div>

      {/* Live web URL alert */}
      <div className="bg-gradient-to-r from-purple-950/20 via-pink-950/15 to-transparent border border-purple-500/15 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-2.5">
          <div className="bg-rose-500/10 h-9 w-9 rounded-xl flex items-center justify-center border border-rose-500/20 shrink-0">
            <Globe className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono block">YOUR VIRAL BATTLE LINK:</span>
            <span className="text-xs text-yellow-300 font-bold font-mono">http://localhost:3000/brocard/{radar.slug}</span>
          </div>
        </div>
        <p className="text-[11px] text-[#A78BFA] max-w-sm text-left leading-normal font-sans">
          Post this link directly inside your Snapchat story links. When friends click, they enter your interactive loyalty challenge immediately!
        </p>
      </div>

      {/* VIRAL STORY STICKER CUSTOMIZER */}
      <div className="bg-[#1C1032]/95 border-2 border-purple-500/20 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF75B5]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8 justify-between items-stretch">
          
          {/* Form left */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#FF75B5]/10 border border-[#FF75B5]/25 px-2.5 py-0.5 rounded-full mb-3">
                <Palette className="w-3 h-3 text-[#FF75B5]" />
                <span className="font-mono text-[9px] text-[#FF75B5] tracking-tight hover:tracking-wide font-black uppercase">
                  Viral Story Sticker Kit • ملصقات ستوري
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-slate-100 leading-none">
                Snap/Insta Story Customizer
              </h3>
              <p className="text-xs text-slate-350 max-w-md mt-1 leading-relaxed">
                Render spectacular stylized backgrounds containing your custom game question. Simply upload the PNG to your Snapchat story context and snap the private URL link on top of it!
              </p>
            </div>

            {/* Custom inputs style */}
            <div className="space-y-3.5 bg-black/45 p-4 rounded-xl border border-purple-500/10">
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#A78BFA] font-bold">1. Edit Sticker Visual Texts</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[8.5px] font-mono uppercase text-slate-400 mb-1">Sticker Heading</label>
                  <input
                    type="text"
                    value={stickerHeadline}
                    onChange={(e) => setStickerHeadline(e.target.value)}
                    className="w-full bg-[#1A0D2E] border border-purple-500/20 text-xs text-slate-100 py-2 px-3 rounded-xl focus:border-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[8.5px] font-mono uppercase text-slate-400 mb-1">Target Reward Target</label>
                  <input
                    type="text"
                    value={customPrizeGoal}
                    onChange={(e) => setCustomPrizeGoal(e.target.value)}
                    className="w-full bg-[#1A0D2E] border border-purple-500/20 text-xs text-slate-100 py-2 px-3 rounded-xl focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Vibe selectors */}
            <div className="space-y-2.5">
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#A78BFA] font-bold">2. Select Story Theme Vibe</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'onyx', name: 'Onyx', bg: 'bg-[#150A26] border-purple-500/60' },
                  { id: 'royalCrimson', name: 'Crimson', bg: 'bg-[#4A0A31] border-rose-500/60' },
                  { id: 'cyberToxic', name: 'Toxic', bg: 'bg-[#031C16] border-emerald-500/60' },
                  { id: 'riyadhGold', name: 'Gold', bg: 'bg-[#1E1103] border-amber-500/60' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setStoryTheme(th.id as BroTheme)}
                    className={`py-2 text-[10px] font-mono border-2 transition-all cursor-pointer rounded-xl text-center ${th.bg} ${storyTheme === th.id ? 'brightness-125 scale-103 text-white ring-1 ring-violet-400' : 'opacity-70 text-slate-300'}`}
                  >
                    {th.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch PNG compile */}
            <button
              onClick={handleSpawnViralKit}
              disabled={isGeneratingImg}
              className="w-full py-4 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white hover:brightness-110 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {isGeneratingImg ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Compiling pristine canvas...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-amber-200" />
                  <span>Generate High-Res Story Sticker PNG</span>
                </>
              )}
            </button>
          </div>

          {/* Right Preview */}
          <div className="w-full lg:w-72 flex items-center justify-center">
            <div className="p-3.5 pb-4 bg-[#140C24] border-2 border-purple-500/20 rounded-[2rem] w-full max-w-[245px] text-center shadow-2xl relative select-none">
              <span className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[7.5px] font-mono text-slate-400 font-bold">PREVIEW INSTAGRAM TAPE</span>
              
              <div 
                className="w-full h-[280px] rounded-[1.5rem] p-4 flex flex-col justify-between overflow-hidden relative border"
                style={{
                  background:
                    storyTheme === 'onyx' ? 'linear-gradient(135deg, #120D20 0%, #000000 100%)' :
                    storyTheme === 'riyadhGold' ? 'linear-gradient(135deg, #1E1103 0%, #050309 100%)' :
                    storyTheme === 'royalCrimson' ? 'linear-gradient(135deg, #4A0A31 0%, #0F051C 100%)' :
                    'linear-gradient(135deg, #031C16 0%, #00020a 100%)',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}
              >
                <div className="text-left py-0.5">
                  <span className="text-[7.5px] font-mono text-[#A78BFA] font-black uppercase block leading-tight">True Bro Game API</span>
                  <span className="text-[6.5px] text-slate-400 block leading-none mt-1">@brocard/{radar.slug}</span>
                </div>

                <div 
                  className="p-3 rounded-2xl border text-left my-auto space-y-1 transform -rotate-1 relative"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <span className="text-[6.5px] font-mono text-rose-400 font-extrabold uppercase tracking-wide block">{stickerHeadline}</span>
                  <h4 className="text-[9.5px] font-display italic font-semibold text-slate-100 leading-snug">
                    "{radar.questions?.[0]?.text || 'Who works harder?'}"
                  </h4>
                  <div className="pt-2">
                    <span className="text-[8px] text-yellow-300 font-black leading-tight">🎁 PRIZE: {customPrizeGoal}</span>
                  </div>
                </div>

                {/* Simulated Link bubble */}
                <div className="bg-yellow-400 px-3 py-1 text-black text-[8px] font-sans font-black uppercase rounded-full w-fit mx-auto shadow-md">
                   LINK: brocard/{radar.slug} 🔗
                </div>
                
                <span className="text-[5.5px] font-mono text-slate-400 block">SWIPE UP TO ACCEPT THE BATTLE</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BENTO STAT MATRIX */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1C1032]/90 border border-purple-500/15 p-5 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-350 uppercase block">Total Attempts</span>
          <span className="text-3xl font-black text-slate-100 font-mono mt-1 block">{totalAttempts}</span>
          <span className="text-[9px] text-[#A78BFA] block font-mono mt-1 uppercase font-bold">Friends Engaged</span>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-2xl">
          <span className="text-[10px] font-mono text-emerald-305 uppercase block">True Brothers 🏆</span>
          <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">{survivedCount}</span>
          <span className="text-[9px] text-emerald-400 block font-mono mt-1 uppercase font-black">Passed 100%</span>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-2xl">
          <span className="text-[10px] font-mono text-rose-305 uppercase block">Roasted Victims 🤡</span>
          <span className="text-3xl font-black text-rose-400 font-mono mt-1 block">{roastedCount}</span>
          <span className="text-[9px] text-rose-400 block font-mono mt-1 uppercase font-black">Failed & Dared</span>
        </div>

        <div className="bg-[#120822] border border-purple-500/10 p-5 rounded-2xl">
          <span className="text-[10px] font-mono text-slate-350 uppercase block">Average Accuracy</span>
          <span className="text-3xl font-black text-yellow-300 font-mono mt-1 block">{avgScore}%</span>
          <span className="text-[9px] text-slate-400 block font-mono mt-1 uppercase">Closeness Rating</span>
        </div>
      </div>

      {/* LEADERBOARDS ROW BLOCK */}
      <div className="bg-[#1C1032]/90 border-2 border-purple-500/20 rounded-2xl p-6 relative">
        
        {/* Header / Filter Log Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-6.5 border-b border-purple-500/10 pb-4">
          <div>
            <h3 className="font-display font-black text-xl text-slate-150 flex items-center gap-2">
              <span>Friends Scoreboard Panel</span>
              <span className="text-xs bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded border border-rose-500/25 font-mono font-bold uppercase">
                BATTLE FEED ({filteredChallengers.length})
              </span>
            </h3>
            <p className="text-xs text-slate-350 mt-1">
              Inspect who failed, listen to recorded complaints, and manage custom dares.
            </p>
          </div>

          {/* Leaderboard filters */}
          <div className="flex bg-black/45 p-1 rounded-xl border border-purple-500/15 self-stretch sm:self-auto justify-between">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase rounded-lg cursor-pointer transition-all ${filterMode === 'all' ? 'bg-purple-800 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('survived')}
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-0.5 ${filterMode === 'survived' ? 'bg-purple-800 text-emerald-300' : 'text-slate-400'}`}
            >
              👑 Bros
            </button>
            <button
              onClick={() => setFilterMode('roasted')}
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase rounded-lg cursor-pointer transition-all flex items-center gap-0.5 ${filterMode === 'roasted' ? 'bg-purple-800 text-rose-300' : 'text-slate-400'}`}
            >
              🤡 Roasted
            </button>
            <button
              onClick={() => setFilterMode('cowards')}
              className={`px-3 py-1 text-[10px] font-mono font-black uppercase rounded-lg cursor-pointer transition-all ${filterMode === 'cowards' ? 'bg-purple-800 text-zinc-300' : 'text-slate-400'}`}
            >
              🏃 Cowards
            </button>
          </div>
        </div>

        {/* List items block */}
        {filteredChallengers.length === 0 ? (
          <div className="bg-[#120822]/40 rounded-2xl p-10 text-center border-2 border-dashed border-purple-500/10">
            <Skull className="w-8 h-8 text-rose-500/35 mx-auto mb-2" />
            <p className="font-mono text-xs text-slate-400 uppercase tracking-widest font-black">No candidates found matching filters</p>
            <p className="text-[11px] text-slate-500 mt-1">Share your link to Snapchat to kickstart your friends results database!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallengers.map((obs) => {
              const isWin = obs.status === 'survived';
              return (
                <div
                  key={obs.id}
                  className={`p-4 bg-black/30 border rounded-2xl hover:border-purple-500/30 transition-all ${isWin ? 'border-emerald-500/25 bg-emerald-950/5' : 'border-rose-500/15'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    {/* Character Info */}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{isWin ? '👑' : obs.status === 'wimped_out' ? '🏃' : '🤡'}</span>
                      <div>
                        <h4 className="font-sans font-black text-slate-100 text-sm flex items-center gap-2">
                          {obs.challengerName}
                          <span className={`text-[8.5px] font-mono font-black px-2 py-0.5 rounded uppercase border ${isWin ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : obs.status === 'wimped_out' ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-rose-500/10 border-rose-500/25 text-rose-400'}`}>
                            {obs.status === 'survived' ? '100% True Bro' : obs.status === 'wimped_out' ? 'Wimped Out' : 'Roasted Fraud'}
                          </span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block leading-normal mt-0.5">
                          Detected {obs.timestamp} via <span className="text-purple-300 font-bold">{obs.city}</span> • Device: {obs.deviceType}
                        </span>
                      </div>
                    </div>

                    {/* Quick performance indicators */}
                    <div className="text-left sm:text-right font-mono text-[11px] shrink-0">
                      <span className="text-[#A78BFA] block font-bold">Accuracy: {obs.score} / {obs.totalQuestions} Hits</span>
                      {obs.failedOnQuestionText && (
                        <span className="text-xs text-rose-300 block line-clamp-1 max-w-xs">Failed: "{obs.failedOnQuestionText}"</span>
                      )}
                    </div>
                  </div>

                  {/* Excuse Remarks and assigned dares */}
                  <div className="mt-4 bg-[#120822]/60 p-3 rounded-xl border border-purple-500/5 text-xs space-y-2">
                    {isWin ? (
                      <p className="text-emerald-300 leading-normal"><span className="text-emerald-400 font-bold">🏆 EARNED REWARD:</span> "{radar.rewardWinner}"</p>
                    ) : (
                      <p className="text-rose-300 leading-normal"><span className="text-rose-400 font-bold">🤡 PENALTY DARE:</span> "{obs.dareAssigned}"</p>
                    )}

                    {obs.excuseMsg && (
                      <div className="border-t border-purple-500/5 pt-1.5 text-slate-350 italic">
                        " {obs.excuseMsg} "
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="mt-3 flex gap-2 justify-end">
                    {!isWin && obs.status !== 'wimped_out' && (
                      <button
                        onClick={() => triggerVoiceShameText(obs.challengerName, obs.failedLevel, obs.status === 'survived' ? '' : obs.dareAssigned)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-400 text-[10.5px] font-mono rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        title="Generate public speech shaming results"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Public Shaming 🔊</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDeleteObserver(obs.id)}
                      className="p-1 px-2.5 bg-neutral-900 border border-zinc-700/40 text-rose-400 rounded-lg hover:bg-neutral-800 transition-all text-xs flex items-center justify-center gap-1 cursor-pointer"
                      title="Forgive Friend (Delete record)"
                    >
                      <Trash className="w-3.5 h-3.5 shrink-0" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* POPUP MODAL STICKER SHARE */}
      <AnimatePresence>
        {showShareModal && generatedImgUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0A0413]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#180B2B] border border-purple-500/25 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden my-8"
            >
              {/* Close Button header */}
              <div className="flex justify-between items-center mb-5 border-b border-purple-500/10 pb-3">
                <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-widest">STORY STICKER KIT</span>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-center">
                <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-500/15 text-left space-y-1 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Private URL Copied Success!</span>
                  </div>
                  <p className="text-[10px] text-[#B6A8D6]/80 leading-normal pl-6">
                    Paste this link dynamically using the **LINK** sticker inside your story.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block font-mono text-[9px] text-amber-400 uppercase tracking-widest font-black leading-none text-left">
                    📸 SAVE TO PHOTOS (TAP & HOLD)
                  </span>
                  
                  <div className="relative group bg-[#0A0413] p-1.5 rounded-2xl border border-purple-500/20 max-w-[210px] mx-auto overflow-hidden shadow-xl transform hover:scale-[1.01] transition-all">
                    <img 
                      src={generatedImgUrl} 
                      alt="Story Sticker Preview" 
                      className="w-full h-auto rounded-xl object-contain select-all cursor-pointer"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-2 bg-black/75 py-1 px-2 border-t border-purple-500/10 text-center pointer-events-none rounded-b-xl">
                      <span className="text-[8px] font-mono text-amber-400 flex items-center justify-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Tap & Hold to Save Card</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    onClick={handleDownloadBackup}
                    className="flex-1 py-2.5 px-4 bg-purple-900/40 hover:bg-purple-900 text-purple-300 font-sans border border-purple-500/20 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1.5 uppercase cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-purple-300" />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      const fullUrl = `${window.location.origin}/brocard/${radar.slug}`;
                      navigator.clipboard.writeText(fullUrl);
                      alert("Link Copied!");
                    }}
                    className="py-2.5 px-3 bg-neutral-950 border border-[#B6A8D6]/10 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-all cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
