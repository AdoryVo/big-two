import type { Card } from 'cards'

import { Combo, Combo_Types } from './Combo'
import Rules from './Rules'

const SUIT_RANKING_ORDERS = { [Rules.SUIT_ORDER_ALPHA] : ['clubs', 'diamonds', 'hearts', 'spades'] }

class Util {
  rules: Rules

  constructor(rules: Rules) {
    this.rules = rules

  }

  _rank_val(card: Card) {
    const rank = card.rank.abbrn
    if ('3' <= rank && rank <= '9' || rank == '10')
      return Number(rank)
    else
      return {
        'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
      }[rank] ?? -1
  }

  _suit_val(card: Card) {
    const suit = card.suit.name
    if (this.rules & Rules.SUIT_ORDER_ALPHA)
      return SUIT_RANKING_ORDERS[Rules.SUIT_ORDER_ALPHA].indexOf(suit)
    return -1
  }

  _compare_cards(c1: Card, c2: Card) {
    const r1 = this._rank_val(c1)
    const r2 = this._rank_val(c2)

    if (r1 !== r2)
      return r1 < r2 ? -1 : 1

    const s1 = this._suit_val(c1)
    const s2 = this._suit_val(c2)

    if (s1 !== s2)
      return s1 < s2 ? -1 : 1

    return 0
  }

  /* Returns the count of consecutively equal ranks in the list of cards given, starting
   * from the specified index.
  */
  _count_cons_eq(cards: Card[], start = 0, use_suit = false) {
    let curr = start
    if (use_suit) {
      while (curr < cards.length && cards[curr].suit === cards[curr + 1].suit)
        ++curr
    }
    else {
      while (curr < cards.length && cards[curr].rank === cards[curr + 1].rank)
        ++curr
    }
    return curr - start + 1
  }

  _straight(cards: Card[]) {
    for (let i = 0; i < cards.length - 1; ++i) {
      if (this._rank_val(cards[i]) + 1 !== this._rank_val(cards[i+1]) &&
      !((this.rules & Rules.STRAIGHTS_WRAP_AROUND) && (this._rank_val(cards[i]) + 1) % 13 === this._rank_val(cards[i+1])))
        return null
    }
    return cards[cards.length - 1]
  }

  _full_house(cards: Card[]) {
    const first_run = this._count_cons_eq(cards)
    const second_run = this._count_cons_eq(cards, first_run)

    if (Math.min(first_run, second_run) !== 2 || Math.max(first_run, second_run) !== 3)
      return null

    // triples are first 3 cards
    if (first_run > second_run)
      return cards[2]

    // otherwise, triples are the next 3 cards
    return cards[cards.length - 1]
  }

  _flush(cards: Card[]) {
    return this._count_cons_eq(cards, 0, true) === 5 ? cards[cards.length - 1] : null
  }

  _bomb(cards: Card[]) {
    if (this._count_cons_eq(cards, 1) === 4)
      return cards[4]
    else if (this._count_cons_eq(cards, 0) === 4)
      return cards[3]

    return null
  }

  _construct_5_combo(cards: Card[]) {
    let value_card = null

    if (value_card = this._straight(cards))
      return new Combo(cards, Combo_Types.STRAIGHT, value_card)
    else if (value_card = this._full_house(cards))
      return new Combo(cards, Combo_Types.FULL_HOUSE, value_card)
    else if (value_card = this._bomb(cards))
      return new Combo(cards, Combo_Types.BOMB, value_card)
    else if ((this.rules & Rules.FLUSH_ALLOW) && (value_card = this._flush(cards)))
      return new Combo(cards, Combo_Types.FLUSH, value_card)

    return new Combo(cards, Combo_Types.INVALID, null)
  }

  _construct_combo(cards: Card[]) {
    cards.sort(this._compare_cards)

    switch (cards.length) {
      case 1:
        return new Combo(cards, Combo_Types.SINGLE, cards[0])
      case 2:
        return new Combo(cards, this._count_cons_eq(cards) === 2 ? Combo_Types.DOUBLE : Combo_Types.INVALID, cards[1])
      case 3:
        return new Combo(cards, this._count_cons_eq(cards) === 3 ? Combo_Types.TRIPLE : Combo_Types.INVALID, cards[2])
      case 4:
        return new Combo(cards, this._count_cons_eq(cards) === 4 ? Combo_Types.BOMB : Combo_Types.INVALID, cards[3])
      case 5:
        return this._construct_5_combo(cards)
      default:
        return new Combo(cards, Combo_Types.INVALID, null)
    }
  }

  // Whether it is legal to play the specified set of cards on top of the combo.
  // TODO: add 5-combo compatability logic + appopriate flag in Rules (e.g. can play full house on flush/straight)
  can_play_on(cards: Card[], combo: Combo) {
    const new_combo = this._construct_combo(cards)
    if (new_combo.type === Combo_Types.INVALID || (new_combo.type !== Combo_Types.BOMB && combo.type === Combo_Types.BOMB))
      return false
    else if (new_combo.type === Combo_Types.BOMB && combo.type !== Combo_Types.BOMB)
      return true

    return new_combo.type === combo.type && this._compare_cards(new_combo.value_card, combo.value_card) > 0
  }
}

export default Util
