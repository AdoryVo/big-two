import { Card, decks } from 'cards'
import _ from 'lodash'

import { Combo } from './Combo'
import Player from './Player'
import type Rules from './Rules'
import Util from  './Util'

class Game {
  players: Player[]
  remaining_players!: number[]
  deck: decks.Deck
  current_player_index!: number
  combo!: Combo | null
  util: Util
  lowest_card!: Card

  constructor(playerCount: number, rules: Rules,
    // To initialize an existing game:
    deck?: string[], combo?: string[], hands?: string[][], current_player?: number)
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
      this.current_player_index = current_player ?? 0
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
    for (const player of this.players) {
      player.hand = this.deck.draw(Math.floor(this.deck.totalLength / this.players.length))
      player.hand.sort((c1, c2) => this.util.compare_cards(c1, c2))

      player.finished_rank = null
    }

    this.remaining_players = _.range(this.players.length)

    this.current_player_index = 0
    // find starting player - this is the player with the smallest card
    for (let i = 1; i < this.players.length; ++i) {
      // if the current player's smallest card is LARGER than player i's smallest card
      if (this.util.compare_cards(this.players[this.current_player_index].hand[0], this.players[i].hand[0]) > 0)
        this.current_player_index = i
    }

    this.lowest_card = this.players[this.current_player_index].hand[0]
  }

  /* Returns boolean denoting whether the set of cards can be played on the current combo. */
  can_play(str_cards: string[]) {
    return this.util.can_play_on(this.util.strings_to_cards(str_cards), this.combo)
  }

  // Increments the current player, also removing them from the remaining players list if the remove
  // parameter is true.
  _increment_curr_player(remove: boolean) {
    const temp_index = this.current_player_index
    this.current_player_index = this.remaining_players[(this.current_player_index + 1) % this.remaining_players.length]
    if (remove)
      this.remaining_players.splice(temp_index, 1)
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
    if (!this.util.can_play_on(cards, this.combo) || !this.players[this.current_player].has_cards(cards) ||
        this.remaining_players.length === 1 || !this.util.lowest_card_check(cards, this.players[this.current_player], this.lowest_card))
      return -2

    console.log(`played ${cards} successfully`)

    this.players[this.current_player].remove_cards(cards)
    if (!cards.length) {
      // update player's score, and finished rank
      this.players[this.current_player].score += this.remaining_players.length - 1
      this.players[this.current_player].finished_rank = this.players.length - this.remaining_players.length + 1

      // remove finished player from list of remaining players before returning the finished player's id
      const finished_player = this.current_player
      this._increment_curr_player(true)
      return finished_player
    }

    this._increment_curr_player(false)
    return -1
  }

  /* Resets the state of the game, issuing cards to players and picking the appropriate player to start. */
  reset() {
    this._initialize_game()
  }

  get remainingCards() {
    return this.util.cards_to_strings(this.deck.remainingCards)
  }

  get current_player() {
    return this.remaining_players[this.current_player_index]
  }
}

export default Game
