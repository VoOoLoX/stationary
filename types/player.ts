import type { Database } from './supabase';

export type Player = Database['public']['Tables']['players']['Row'];
