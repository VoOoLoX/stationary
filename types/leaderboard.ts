import type { Database } from './supabase';

export type Leaderboard = Database['public']['Functions']['leaderboard']['Returns'];
