import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 1000,
    },
  },
});

export enum Event {
  Pong = 'pong',
  LobbyUpdate = 'lobby-update',
  Play = 'play',
  StartGame = 'start-game',
  EndGame = 'end-game',
}

export enum ChannelName {
  Lobbies = 'lobbies',
}

export default supabase;
