/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RadarMode = 'general' | 'crush' | 'unfinished' | 'signal_check';

export interface Radar {
  id: string;
  displayName: string;
  slug: string;
  city: string;
  mode: RadarMode;
  question: string;
  options: string[];
  createdAt: string;
}

export type ObserverStatus = 'Crown King' | 'Diamond Prince' | 'Golden Guard' | 'Elite Observer' | 'Masked Observer' | 'Standard Observer';

export interface Observer {
  id: string;
  radarId: string;
  handle: string;
  isMasked: boolean;
  answer: string;
  msg?: string;
  city: string;
  interestScore: number; // 0-100 score of attraction/curiosity
  repeatSignals: number; // Visitor counter
  activeAt: string;
  deviceType: string;
  status: ObserverStatus;
  avatarSeed: number; // to generate consistent elegant avatar glow
}

export interface BoostProduct {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  priceUSD: number;
  priceSAR: number;
  badge: string;
  glowColor: string;
  benefit: string;
  iconName: 'Crown' | 'Sparkles' | 'EyeOff' | 'Flame' | 'ShieldAlert';
}

export type AppView = 'landing' | 'create' | 'observer' | 'verdict' | 'dashboard' | 'council' | 'boost';
