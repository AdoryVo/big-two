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
  INVALID
}

class Combo {
  readonly cards: Card[]
  readonly type: Combo_Types

  constructor(cards: Card[], type: Combo_Types) {
    this.cards = cards
    this.type = type
  }
}

export { Combo, Combo_Types }
