import type { Card } from 'cards'
import { decks } from 'cards'

import Util from './Util'

enum Combo_Types {
  SINGLE,
  DOUBLE,
  TRIPLE,
  STRAIGHT,
  FULL_HOUSE,
  BOMB,
  FLUSH,
  INVALID
}

class Combo {
  readonly cards: Card[]
  readonly type: Combo_Types
  readonly value_card: Card | null

  constructor(cards: Card[], type: Combo_Types, value_card: Card | null) {
    this.cards = cards
    this.type = type
    this.value_card = value_card
  }
}

export { Combo, Combo_Types }
