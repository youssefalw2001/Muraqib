/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface RadarSweepProps {
  activeCount?: number;
  pulseSpeed?: 'slow' | 'normal' | 'fast';
  showPoints?: boolean;
}

export default function RadarSweep({ activeCount = 12, pulseSpeed = 'normal', showPoints = true }: RadarSweepProps) {
  // Floating luxury dots simulating observers
  const points = [
    { x: '35%', y: '25%', size: 'h-2 w-2', label: 'saud.al', r: 90, delay: 0.2 },
    { x: '70%', y: '40%', size: 'h-1.5 w-1.5', label: 'dxb_99', r: 15, delay: 0.8 },
    { x: '25%', y: '65%', size: 'h-3 w-3', label: '👤 MASKED', r: 60, delay: 1.4 },
    { x: '55%', y: '75%', size: 'h-1 w-1', label: 'yasmin_q', r: 35, delay: 2.1 },
    { x: '80%', y: '20%', size: 'h-2 w-2', label: '👤 MASKED', r: 75, delay: 2.7 },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] mx-auto flex items-center justify-center p-4">
      {/* Outer Golden Luxury Rings */}
      <div className="absolute inset-0 rounded-full border border-purple-500/10 flex items-center justify-center">
        <div className="w-[85%] h-[85%] rounded-full border border-purple-400/20 flex items-center justify-center">
          <div className="w-[70%] h-[70%] rounded-full border border-amber-500/20 flex items-center justify-center">
            <div className="w-[50%] h-[50%] rounded-full border border-purple-500/30 flex items-center justify-center">
              <div className="w-[25%] h-[25%] rounded-full border border-amber-400/40 flex items-center justify-center bg-brand-surface/40">
                {/* Center Core Pulse */}
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Axis crosslines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-purple-500/10 hover:bg-purple-500/20 transition-all pointer-events-none"></div>
      <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-purple-500/10 hover:bg-purple-500/20 transition-all pointer-events-none"></div>
      
      {/* Decorative Arabic Compass Ticks */}
      <div className="absolute top-2 text-[9px] font-mono tracking-widest text-amber-500/60 font-semibold select-none">الرادار</div>
      <div className="absolute bottom-2 text-[9px] font-mono tracking-widest text-purple-400/60 select-none">MURAQIB</div>
      <div className="absolute left-2 text-[9px] font-mono text-purple-400/40 select-none">LIVE</div>
      <div className="absolute right-2 text-[9px] font-mono text-amber-400/40 select-none">99Hz</div>

      {/* Mesmerizing Radar Sweep Line - Continuous Rotation */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(234, 179, 8, 0.15) 0%, rgba(124, 58, 237, 0) 60%)',
          borderLeft: '1.5px solid rgba(234, 179, 8, 0.4)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: pulseSpeed === 'fast' ? 2.5 : pulseSpeed === 'slow' ? 6 : 4,
          ease: 'linear',
        }}
      />

      {/* Interactive Floating Pulse Points */}
      {showPoints && points.map((p, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{ top: p.y, left: p.x }}
        >
          {/* Pulsing Backlight */}
          <motion.span
            className={`absolute -inset-1 rounded-full ${p.label.includes('MASKED') ? 'bg-pink-500/30' : 'bg-amber-400/30'} blur-xs`}
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              delay: p.delay,
            }}
          />
          {/* Main Core Dot */}
          <div className={`${p.size} rounded-full ${p.label.includes('MASKED') ? 'bg-gradient-to-r from-pink-500 to-rose-400' : 'bg-gradient-to-r from-amber-400 to-yellow-300'} shadow-md`} />
          
          {/* Micro Mini Glow Label */}
          <span className="absolute left-3 -top-1 font-mono text-[8px] bg-brand-surface/90 border border-purple-500/20 text-purple-200 px-1 py-0.5 rounded-xs scale-90 whitespace-nowrap opacity-60">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  );
}
