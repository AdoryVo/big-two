import type { Card } from 'cards'
import { decks } from 'cards'

class Player {
  hand: Card[] | null

  constructor() {
    this.hand = null
  }

}

export default Player
