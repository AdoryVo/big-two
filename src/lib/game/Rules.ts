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
  CAN_PLAY_AFTER_PASS = 1 << 4
}

export default Rules
