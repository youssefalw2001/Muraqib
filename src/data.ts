/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Radar, Observer, BoostProduct } from './types';

export const INITIAL_RADAR: Radar = {
  id: 'radar-1',
  displayName: 'Lulwa Al-Mansoori',
  slug: 'lulwa.m',
  city: 'Riyadh 🇸🇦',
  mode: 'crush',
  question: 'Do I cross your mind?',
  options: [
    'Every single day.',
    'When certain songs play.',
    'I check your stories first.',
    'Only when we cross paths.'
  ],
  createdAt: '2026-05-20T12:00:00Z'
};

export const INITIAL_OBSERVERS: Observer[] = [
  {
    id: 'obs-1',
    radarId: 'radar-1',
    handle: 'saud.al.thani',
    isMasked: false,
    answer: 'Every single day.',
    msg: 'Since last Riyadh Season, you know this. Always keeping the radar active.',
    city: 'Riyadh',
    interestScore: 98,
    repeatSignals: 42,
    activeAt: '5 mins ago',
    deviceType: 'iPhone 15 Pro Max (Snapchat App)',
    status: 'Crown King',
    avatarSeed: 1
  },
  {
    id: 'obs-2',
    radarId: 'radar-1',
    handle: 'Masked Observer (Plum Aura)',
    isMasked: true,
    answer: 'When certain songs play.',
    msg: 'That Arabic song you posted yesterday in your story... was it meant for me?',
    city: 'Dubai Marina',
    interestScore: 89,
    repeatSignals: 28,
    activeAt: '2 hrs ago',
    deviceType: 'iPhone 15 Pro (Safari Mobile)',
    status: 'Diamond Prince',
    avatarSeed: 5
  },
  {
    id: 'obs-3',
    radarId: 'radar-1',
    handle: 'nasser_dxb',
    isMasked: false,
    answer: 'I check your stories first.',
    msg: 'I entered the moment you posted your private radar handle.',
    city: 'Jumeirah',
    interestScore: 84,
    repeatSignals: 19,
    activeAt: '4 hrs ago',
    deviceType: 'iPhone 14 Pro (Instagram Browser)',
    status: 'Golden Guard',
    avatarSeed: 3
  },
  {
    id: 'obs-4',
    radarId: 'radar-1',
    handle: 'Masked Observer (Sunset Pink)',
    isMasked: true,
    answer: 'When certain songs play.',
    msg: 'I play your story playlists over and over. You inspire every tune.',
    city: 'Kuwait City',
    interestScore: 78,
    repeatSignals: 15,
    activeAt: '1 day ago',
    deviceType: 'iPhone 15 (Snapchat App)',
    status: 'Elite Observer',
    avatarSeed: 7
  },
  {
    id: 'obs-5',
    radarId: 'radar-1',
    handle: 'yasmin_qtr',
    isMasked: false,
    answer: 'Only when we cross paths.',
    msg: 'Saw your radar link shared on TikTok, had to drop a signal! ✨',
    city: 'Doha',
    interestScore: 61,
    repeatSignals: 5,
    activeAt: '2 days ago',
    deviceType: 'iPhone 13 Pro (Snapchat App)',
    status: 'Standard Observer',
    avatarSeed: 2
  },
  {
    id: 'obs-6',
    radarId: 'radar-1',
    handle: 'Masked Observer (Amber Fire)',
    isMasked: true,
    answer: 'Every single day.',
    msg: 'I keep this tab pinned in my mobile group. Hidden under the night sky.',
    city: 'Salmiya',
    interestScore: 94,
    repeatSignals: 37,
    activeAt: '12 mins ago',
    deviceType: 'iPhone 15 Pro Max (Snapchat App)',
    status: 'Elite Observer',
    avatarSeed: 9
  }
];

export const BOOST_PRODUCTS: BoostProduct[] = [
  {
    id: 'bp-crown',
    name: 'Crown Boost',
    arabicName: 'ترقية التاج الملكي',
    description: 'Pin yourself at the absolute throne of their Crown Council for 48 hours.',
    priceUSD: 14.99,
    priceSAR: 55,
    badge: 'LUXURY PRESTIGE',
    glowColor: 'from-[#FACC15] to-[#EAB308]',
    benefit: 'Crown Status Pin + Multiplied Pulse Frequency',
    iconName: 'Crown'
  },
  {
    id: 'bp-diamond',
    name: 'Diamond Glow',
    arabicName: 'الوهج الماسي',
    description: 'Drape your visitor profile in premium diamond particles and boost your score.',
    priceUSD: 8.99,
    priceSAR: 33,
    badge: 'POPULAR',
    glowColor: 'from-[#EC4899] to-[#8B5CF6]',
    benefit: 'Glow Avatar + Premium Interest Priority',
    iconName: 'Sparkles'
  },
  {
    id: 'bp-masked',
    name: 'Ghost Phantom Mode',
    arabicName: 'وضع الشبح الخفي',
    description: 'Browse all active Arabic Radars with complete spectral status. Pure mystique.',
    priceUSD: 9.99,
    priceSAR: 37,
    badge: 'SPECTRAL PRIVACY',
    glowColor: 'from-[#A78BFA] to-[#4C1D95]',
    benefit: 'Zero visitor traces + Custom encrypted signature',
    iconName: 'EyeOff'
  },
  {
    id: 'bp-reveal',
    name: 'Royal Reveal Request',
    arabicName: 'طلب الكشف الملكي',
    description: 'Send an elite anonymous riddle to unmask a specific Masked Observer.',
    priceUSD: 19.99,
    priceSAR: 75,
    badge: 'PREMIUM ENQUIRY',
    glowColor: 'from-[#EF4444] to-[#B91C1C]',
    benefit: 'Anonymous VIP Riddle + Encryption Bypass Offer',
    iconName: 'ShieldAlert'
  }
];

export const GCC_CITIES = [
  'Riyadh 🇸🇦',
  'Jeddah 🇸🇦',
  'Dubai 🇦🇪',
  'Abu Dhabi 🇦🇪',
  'Kuwait City 🇰🇼',
  'Salmiya 🇰🇼',
  'Doha 🇶🇦',
  'Manama 🇧🇭',
  'Muscat 🇴🇲',
  'Khobar 🇸🇦'
];

export const RADAR_MODES = [
  {
    id: 'general',
    name: 'General Radar',
    arabicName: 'الرادار العام',
    tagline: 'Monitor overall interest, curiosity, and secret stalkers.',
    icon: 'Radio',
    color: 'from-purple-500 to-indigo-600',
    defaultQuestion: 'What vibe do I give off?',
    defaultOptions: ['Confident & Classy', 'Mysterious & Elegant', 'Warm & Approachable', 'Intimidating but Beautiful']
  },
  {
    id: 'crush',
    name: 'Crush Radar',
    arabicName: 'رادار الإعجاب',
    tagline: 'Target romantic frequencies. Discover if your spark is mutual.',
    icon: 'Heart',
    color: 'from-pink-500 to-purple-600',
    defaultQuestion: 'Do I cross your mind?',
    defaultOptions: ['Every single day.', 'When certain songs play.', 'I check your stories first.', 'Only when we cross paths.']
  },
  {
    id: 'unfinished',
    name: 'Unfinished Business',
    arabicName: 'حسابات معلقة',
    tagline: 'For exes, silent stalkers, and conversations that cut off early.',
    icon: 'RefreshCw',
    color: 'from-amber-500 to-purple-700',
    defaultQuestion: 'Do you still have things left to say to me?',
    defaultOptions: ['More than you could imagine.', 'Yes, but it is better untold.', 'Only if you speak first.', 'I think about it sometimes.']
  },
  {
    id: 'signal_check',
    name: 'Signal Check',
    arabicName: 'فحص الإشارة',
    tagline: 'Fast, bold validation. Let observers test their real-time score.',
    icon: 'Zap',
    color: 'from-emerald-500 to-indigo-600',
    defaultQuestion: 'Rate your high-key curiosity level about me:',
    defaultOptions: ['Off the charts (100%)', 'Highly curious (80%)', 'Just watching stories (50%)', 'Just clicked out of randomness']
  }
];
