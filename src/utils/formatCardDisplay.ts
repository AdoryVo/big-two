const SUIT_SYMBOLS: Record<string, string> = {
  clubs: '♣',
  diamonds: '♦',
  hearts: '♥',
  spades: '♠',
};

/** Turns internal labels like `4;diamonds` into `4♦` for UI copy. */
export function formatCardForDisplay(card: string): string {
  const parts = card.split(';');
  if (parts.length < 2) return card;
  const [rank, suit] = parts;
  const sym = SUIT_SYMBOLS[suit.toLowerCase()];
  return sym ? `${rank}${sym}` : card;
}

export function formatComboForDisplay(cards: string[]): string {
  return cards.map(formatCardForDisplay).join(', ');
}
