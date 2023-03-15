enum Rules {
  // Suit ordering
  SUIT_ORDER_ALPHA = 1,

  // Straights
  STRAIGHTS_WRAP_AROUND = 1 << 1,

  // Flushes
  FLUSH_ALLOW = 1 << 2,

  // Other

  // if you have the lowest card and start the game, you must play it in the first combo you play
  MUST_PLAY_LOWEST_CARD = 1 << 3,

  // if you pass, you can still play if your turn comes again
  CAN_PLAY_AFTER_PASS = 1 << 4,

  // default
  DEFAULT = SUIT_ORDER_ALPHA | STRAIGHTS_WRAP_AROUND | MUST_PLAY_LOWEST_CARD,
}

export const ALL_RULES = [
  Rules.SUIT_ORDER_ALPHA,
  Rules.STRAIGHTS_WRAP_AROUND,
  Rules.CAN_PLAY_AFTER_PASS,
  Rules.MUST_PLAY_LOWEST_CARD,
  Rules.FLUSH_ALLOW,
]

export function describe(rule: Rules) {
  switch (rule) {
  case Rules.SUIT_ORDER_ALPHA:
    return 'Suit order alpha (clubs < diamonds < hearts < spades)'
  case Rules.STRAIGHTS_WRAP_AROUND:
    return 'Straights wrap around'
  case Rules.CAN_PLAY_AFTER_PASS:
    return 'Can play after pass'
  case Rules.MUST_PLAY_LOWEST_CARD:
    return 'Must play lowest card on game start (3 of clubs)'
  case Rules.FLUSH_ALLOW:
    return 'Allow flushes'
  default:
    return ''
  }
}

export function rulesToArray(rules: number) {
  return ALL_RULES.filter((rule) => rules & rule)
}

export default Rules
