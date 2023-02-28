enum Rules {
  // Suit ordering
  SUIT_ORDER_ALPHA = 1,

  // Straights
  STRAIGHTS_WRAP_AROUND = 1 << 1,

  // Flushes
  FLUSH_ALLOW = 1 << 2,

  // Other
}

export default Rules
