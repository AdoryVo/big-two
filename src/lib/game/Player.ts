import { Card } from 'cards'

class Player {
  hand!: Card[] // the hand should be initiated from the Game, so it is ignored in the constructor
  score: number
  finished_rank: number | null

  constructor(hand?: Card[]) {
    if (hand) this.hand = hand
    this.score = 0
    this.finished_rank = null
  }

  _cards_eq(c1: Card, c2: Card) {
    return c1.rank.abbrn === c2.rank.abbrn && c1.suit.name === c2.suit.name
  }

  /* Returns whether the player has the specified cards. Assumes that
   * the player's hand and the cards passed are already sorted.
  */
  has_cards(cards: Card[]) {
    let i = 0
    for (const card of cards) {
      while (!this._cards_eq(this.hand[i], card)) {
        if (++i >= this.hand.length) {
          return false
        }
      }
    }
    return true
  }

  /* Removes the specified cards from the player's hand.
   * Assumes that the player's hand is sorted, the cards are sorted, AND
   * all cards to be removed are in fact in the player's hand.
  */
  remove_cards(cards: Card[]) {
    const new_cards = []
    let i = 0
    for (const card of cards) {
      while (i < this.hand.length && !this._cards_eq(card, this.hand[i]))
        new_cards.push(this.hand[i++])

      ++i
    }

    while (i < this.hand.length) {
      new_cards.push(this.hand[i++])
    }

    this.hand = new_cards
  }
}

export default Player
