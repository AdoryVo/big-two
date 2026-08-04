export enum Action {
  Ping = 'ping',
  Join = 'join',
  Leave = 'leave',
  Start = 'start',
  End = 'end',
  PlayAgain = 'playAgain',
  Pass = 'pass',
  Play = 'play',
  AddBot = 'addBot',
  RemoveBot = 'removeBot',
  VoteEnd = 'vote-end',
}

export interface ActionData {
  name?: string;
  comboToPlay?: string[];
  onClose?: () => void;
}
