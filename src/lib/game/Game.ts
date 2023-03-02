import { Card, decks } from 'cards'

import { Combo } from './Combo'
import Player from './Player'
import type Rules from './Rules'
import Util from  './Util'

class Game {
  players: Player[]
  remaining_players!: number[]
  deck: decks.Deck
  current_player!: number
  combo!: Combo | null
  util: Util

  constructor(players: number, rules: Rules) {
    this.players = []
    for (let i = 0; i < players; ++i) {
      this.players.push(new Player())
    }

    this.deck = new decks.StandardDeck()
    this.util = new Util(rules)

    this._initialize_game()
  }

  _initialize_game() {
    this.deck.shuffleAll()
    this.combo = null
    this.current_player = 0
    for (const player of this.players) {
      player.hand = this.deck.draw(Math.floor(this.deck.totalLength / this.players.length))
      player.hand.sort((a, b) => this.util.compare_cards(a, b))
    }

    this.remaining_players = []
    for (let i = 0; i < this.players.length; ++i)
      this.remaining_players.push(i)
  }

  /* Returns boolean denoting whether the set of cards can be played on the current combo. */
  can_play(cstring: string) {
    return this.util.can_play_on(this.util.string_to_cards(cstring), this.combo)
  }

  /* Check that the current player is allowed to play the cards, then have the player play them, updating
   * the current turn, player hands, checking for victory, etc.
   * Unlike can_play, this method takes into account whose turn it is,
   * whether they have the cards, and whether the current board allows for that combo to be played.
   * can_play is designed for use by a client locally who knows that it is their turn and they have the cards,
   * and play is designed for use for the client to call to the server.
   * If this action results in a player clearing their cards, add the appropriate number to their score,
   * then return the player id of the player who has finished.
  */
  play(cstring: string) {
    const cards = this.util.string_to_cards(cstring)
    if (!this.util.can_play_on(cards, this.combo) || !this.players[this.current_player].has_cards(cards) || this.remaining_players.length === 1)
      return -1

    this.players[this.current_player].remove_cards(cards)
    if (!cards.length) {
      this.players[this.current_player].score += this.remaining_players.length - 1
      const curr_player_index = this.remaining_players.indexOf(this.current_player)
      const temp = this.current_player
      this.current_player = this.remaining_players[(curr_player_index + 1) % this.remaining_players.length]
      this.remaining_players.splice(curr_player_index, 1)
      return temp
    }

    return -1
  }

  /* Resets the state of the game, issuing cards to players and picking the appropriate player to start. */
  reset() {
    this._initialize_game()
  }
}

export default Game
