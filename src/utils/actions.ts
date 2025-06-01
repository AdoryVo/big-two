export enum Action {
  Ping = 'ping',
  Join = 'join',
  Leave = 'leave',
  Start = 'start',
  End = 'end',
  Pass = 'pass',
  Play = 'play',
  AddBot = 'addBot',
  RemoveBot = 'removeBot',
}

export interface ActionData {
  name?: string;
  comboToPlay?: string[];
  onClose?: () => void;
}
