/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BroTheme = 'onyx' | 'royalCrimson' | 'cyberToxic' | 'riyadhGold';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIdx: number;
  difficulty: 'easy' | 'medium' | 'hard';
  roastComment: string; // The funny message printed if they fail this specific question
}

export interface BroQuiz {
  id: string;
  displayName: string;
  slug: string;
  theme: BroTheme;
  questions: Question[];
  rewardWinner: string;      // What they win if they pass all questions (e.g., "A steak dinner on me!")
  dareLevel1: string;       // Small checkpoint fail (e.g., "Record a 10s video clucking like a chicken")
  dareLevel2: string;       // Medium checkpoint fail (e.g., "Send an embarrassing voice note to the main chat")
  dareLevel3: string;       // Critical checkpoint fail (e.g., "Send me $10 or Venmo a coffee right now")
  voiceNoteDataUrl: string | null;  // User recorded roast message bytes as base64/dataURL
  voiceNoteTemplateId: 'roast_clown' | 'bruh_disappointed' | 'busted_fraud' | 'none';
  createdAt: string;
}

export interface ChallengerAttempt {
  id: string;
  quizId: string;
  challengerName: string;
  score: number;
  totalQuestions: number;
  failedOnQuestionText: string | null;
  failedLevel: 'level1' | 'level2' | 'level3' | 'none';
  dareAssigned: string;
  status: 'survived' | 'wimped_out' | 'dare_accepted' | 'immunity_used';
  city: string;
  timestamp: string;
  avatarSeed: number;
  excuseMsg?: string;
  deviceType: string;
}

export interface BroShopItem {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  priceUSD: number;
  priceSAR: number;
  badge: string;
  glowColor: string;
  benefit: string;
  iconName: 'Crown' | 'Shield' | 'Flame' | 'Sparkles' | 'Volume2';
}

export type AppView = 'landing' | 'create' | 'observer' | 'verdict' | 'dashboard' | 'council' | 'boost';
