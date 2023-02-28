import type { Card } from 'cards'

import { Combo, Combo_Types } from './Combo'
import Rules from './Rules'

const SUIT_RANKING_ORDERS = { [Rules.SUIT_ORDER_ALPHA] : ['clubs', 'diamonds', 'hearts', 'spades'] }

class Util {
  rules: Rules

  constructor(rules: Rules) {
    this.rules = rules

  }

  _card_ranking_value(rank: string) {
    if ('3' <= rank && rank <= '10')
      return Number(rank)
    else
      return {
        'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
      }[rank] ?? -1
  }

  _suit_ranking_value(suit: string) {
    if (this.rules & Rules.SUIT_ORDER_ALPHA)
      return SUIT_RANKING_ORDERS[Rules.SUIT_ORDER_ALPHA].indexOf(suit)
    return -1
  }

  compare_cards(c1: Card, c2: Card) {
    const r1 = this._card_ranking_value(c1.rank.abbrn)
    const r2 = this._card_ranking_value(c2.rank.abbrn)

    if (r1 !== r2)
      return r1 < r2 ? -1 : 1

    const s1 = this._suit_ranking_value(c1.suit.name)
    const s2 = this._suit_ranking_value(c2.suit.name)

    if (s1 !== s2)
      return s1 < s2 ? -1 : 1

    return 0
  }

  _count_eq_ranks(cards: Card[], start: number) {
    const count = 0

  }

  _construct_combo(cards: Card[]) {
    return null
  }

  can_play_on(cards: Card[], combo: Combo) {
    return true
  }
}

export default Util
