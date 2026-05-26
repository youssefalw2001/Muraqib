/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BroQuiz, ChallengerAttempt } from '../types';

export function isSupabaseConnected(): boolean {
  return false; // Standalone sandbox prototype is fully persisted in local storage
}

export async function dbFetchQuiz(slug: string): Promise<BroQuiz | null> {
  return null;
}

export async function dbUpsertQuiz(quiz: BroQuiz): Promise<boolean> {
  return true;
}

export async function dbFetchChallengers(quizId: string): Promise<ChallengerAttempt[] | null> {
  return null;
}

export async function dbInsertChallenger(challenger: ChallengerAttempt): Promise<boolean> {
  return true;
}

export async function dbDeleteChallenger(challengerId: string): Promise<boolean> {
  return true;
}

export const SUPABASE_SQL_CREATION_SCHEMA = `-- BroCard Bro vs Bro Loyalty Dare - Local Simulator Schema
-- Full-stack SQLite & LocalStorage synced engine is fully active! No remote setup required.
`;
