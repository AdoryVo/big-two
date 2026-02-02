enum Rules {
  // Suit ordering
  SUIT_ORDER_ALPHA = 1,
  SUIT_ORDER_BETA = 1 << 7,
  SUIT_ORDER_GAMMA = 1 << 6,

  // Straights
  STRAIGHTS_WRAP_AROUND = 1 << 1,
  STRAIGHTS_ALLOW_RUNS = 1 << 5, // straights can be any 3+ consecutive card combo

  // Flushes
  FLUSH_ALLOW = 1 << 2,

  // Other

  // allow five-card combo poker hands to be played on other poker hands
  POKER_HAND_COMBOS = 1 << 8,

  // disallow bombs (four of a kind) as a special combo
  NO_BOMBS = 1 << 9,

  // if you have the lowest card and start the game, you must play it in the first combo you play
  MUST_PLAY_LOWEST_CARD = 1 << 3,

  // if you pass, you can still play if your turn comes again
  CAN_PLAY_AFTER_PASS = 1 << 4,

  // default
  DEFAULT = SUIT_ORDER_ALPHA | STRAIGHTS_WRAP_AROUND | MUST_PLAY_LOWEST_CARD,
}

export const ALL_RULES = [
  Rules.SUIT_ORDER_ALPHA,
  Rules.SUIT_ORDER_BETA,
  Rules.SUIT_ORDER_GAMMA,
  Rules.STRAIGHTS_WRAP_AROUND,
  Rules.STRAIGHTS_ALLOW_RUNS,
  Rules.CAN_PLAY_AFTER_PASS,
  Rules.MUST_PLAY_LOWEST_CARD,
  Rules.FLUSH_ALLOW,
];

export function describe(rule: Rules) {
  switch (rule) {
    case Rules.SUIT_ORDER_ALPHA:
      return 'Suit order alpha (clubs < diamonds < hearts < spades)';
    case Rules.SUIT_ORDER_BETA:
      return 'Suit order beta [Tiến] (spades < clubs < diamonds < hearts)';
    case Rules.SUIT_ORDER_GAMMA:
      return 'Suit order gamma [Hong Kong] (diamonds < clubs < hearts < spades)';
    case Rules.STRAIGHTS_WRAP_AROUND:
      return 'Straights wrap around';
    case Rules.STRAIGHTS_ALLOW_RUNS:
      return 'Straights can be any 3+ consecutive cards [Tiến lên]';
    case Rules.CAN_PLAY_AFTER_PASS:
      return 'Can play after pass';
    case Rules.MUST_PLAY_LOWEST_CARD:
      return 'Must play lowest card on game start (ex: 3 of clubs)';
    case Rules.FLUSH_ALLOW:
      return 'Allow flushes';
    default:
      return '';
  }
}

export function rulesToArray(rules: number) {
  return ALL_RULES.filter((rule) => rules & rule);
}

export default Rules;
