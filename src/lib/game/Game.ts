import { Card, decks } from 'cards'

import Player from './Player'

class Game {
  players: Player[]
  current_player: number
  deck : decks.Deck

  constructor(players: number) {
    this.players = []
    for (let i = 0; i < players; ++i) {
      this.players.push(new Player())
    }

    this.deck = new decks.StandardDeck()
    this.current_player = 0

    this._initialize_game()
  }

  _initialize_game() {
    this.deck.shuffleAll()
    for (const player of this.players) {
      player.hand = this.deck.draw(Math.floor(this.deck.totalLength / this.players.length))
    }
  }

  /* Returns boolean denoting whether the current player is allowed to play the specified list of cards,
   * taking into account whose turn it is, whether they have the cards, and whether the current board allows
   * for that combo to be played. */
  can_play(cards: Card[]) {
    return true
  }

  /* Check that the current player is allowed to play the cards, then have the player play them, updating
   * the current turn, player hands, checking for victory, etc.
   * If this action results in a player clearing their cards, add the appropriate number to their score,
   * then return the player id of the player who has finished.
  */
  play(cards: Card[]) {
    return null
  }

  /* Resets the state of the game, issuing cards to players and picking the appropriate player to start. */
  reset() {
    return null
  }
}

export default Game
