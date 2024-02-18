import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
  secret: process.env.PUSHER_APP_SECRET || '',
  cluster: 'us3',
  useTLS: true,
});

export enum Event {
  Pong = 'pong',
  LobbyUpdate = 'lobby-update',
  Play = 'play',
  StartGame = 'start-game',
  EndGame = 'end-game',
}

export default pusher;
