export enum Action {
  Ping = 'ping',
  Join = 'join',
  Leave = 'leave',
  Start = 'start',
  End = 'end',
  Pass = 'pass',
  Play = 'play',
}

export interface ActionData {
  name?: string;
  comboToPlay?: string[];
  onClose?: () => void;
}
