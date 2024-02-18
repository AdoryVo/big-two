import type { Card } from 'cards';

enum Combo_Types {
  SINGLE = 0,
  DOUBLE = 1,
  TRIPLE = 2,
  STRAIGHT = 3,
  FULL_HOUSE = 4,
  BOMB = 5,
  FLUSH = 6,
  INVALID = 7,
}

class Combo {
  readonly cards: Card[];
  readonly type: Combo_Types;
  readonly value_card: Card | null;

  constructor(cards: Card[], type: Combo_Types, value_card: Card | null) {
    this.cards = cards;
    this.type = type;
    this.value_card = value_card;
  }
}

export { Combo, Combo_Types };
