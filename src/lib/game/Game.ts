import { decks } from 'cards'
import _ from 'lodash'

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

  constructor(playerCount: number, rules: Rules,
    // To initialize an existing game:
    deck?: string[], combo?: string[], hands?: string[][], current_player=0)
  {
    this.util = new Util(rules)

    if (deck && combo && hands) {
      this.deck = new decks.Deck({ cards: this.util.strings_to_cards(deck) })
      this.deck.shuffleAll()

      this.players = hands.map((hand) => new Player(this.util.strings_to_cards(hand)))
      // Populate remaining players
      this.remaining_players = []
      this.players.forEach((player, index) => {
        if (player.hand.length)
          this.remaining_players.push(index)
      })

      this.combo = this.util._construct_combo(this.util.strings_to_cards(combo))
      this.current_player = current_player
    } else {
      this.deck = new decks.StandardDeck()
      this.players = []
      for (let i = 0; i < playerCount; ++i) {
        this.players.push(new Player())
      }

      this._initialize_game()
    }
  }

  _initialize_game() {
    this.deck.shuffleAll()
    this.combo = null
    this.current_player = 0
    for (const player of this.players) {
      player.hand = this.deck.draw(Math.floor(this.deck.totalLength / this.players.length))
      player.hand.sort((a, b) => this.util.compare_cards(a, b))

      player.finished_rank = null
    }

    this.remaining_players = _.range(this.players.length)
  }

  /* Returns boolean denoting whether the set of cards can be played on the current combo. */
  can_play(str_cards: string[]) {
    return this.util.can_play_on(this.util.strings_to_cards(str_cards), this.combo)
  }

  /* Check that the current player is allowed to play the cards, then have the player play them, updating
   * the current turn, player hands, checking for victory, etc.
   * Unlike can_play, this method takes into account whose turn it is,
   * whether they have the cards, and whether the current board allows for that combo to be played.
   * can_play is designed for use by a client locally who knows that it is their turn and they have the cards,
   * and play is designed for use for the client to call to the server.
   * If this action results in a player clearing their cards, add the appropriate number to their score,
   * then return the player id of the player who has finished.
   * If the cards were played but it did not result in a victory, returns -1.
   * Otherwise, if the cards could not be played (probably due to client and server disagreeing on game state), return -2.
  */
  play(str_cards: string[]) {
    const cards = this.util.strings_to_cards(str_cards)
    if (!this.util.can_play_on(cards, this.combo) || !this.players[this.current_player].has_cards(cards) || this.remaining_players.length === 1)
      return -2

    this.players[this.current_player].remove_cards(cards)
    if (!cards.length) {
      this.players[this.current_player].score += this.remaining_players.length - 1
      this.players[this.current_player].finished_rank = this.players.length - this.remaining_players.length + 1
      const curr_player_index = this.remaining_players.indexOf(this.current_player)
      const finished_player = this.current_player
      this.current_player = this.remaining_players[(curr_player_index + 1) % this.remaining_players.length]
      this.remaining_players.splice(curr_player_index, 1)
      return finished_player
    }

    return -1
  }

  /* Resets the state of the game, issuing cards to players and picking the appropriate player to start. */
  reset() {
    this._initialize_game()
  }

  get remainingCards() {
    return this.util.cards_to_strings(this.deck.remainingCards)
  }
}

export default Game
