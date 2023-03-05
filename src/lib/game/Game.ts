import { Card, decks } from 'cards'
import _ from 'lodash'

import { Combo } from './Combo'
import Player from './Player'
import type Rules from './Rules'
import Util from  './Util'

class Game {
  players: Player[]
  remaining_players!: number[]
  passed_players!: Set<number>
  last_playmaker!: number
  backup_next!: number
  deck: decks.Deck
  current_player!: number
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

      // TODO: possibly change this to something nontrivial
      this.passed_players = new Set<number>()

      // Populate remaining players
      this.remaining_players = []
      this.players.forEach((player, index) => {
        if (player.hand.length)
          this.remaining_players.push(index)
      })

      this.combo = this.util._construct_combo(this.util.strings_to_cards(combo))
      this.current_player = current_player ?? 0
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
    this.passed_players = new Set<number>()

    this.current_player = 0
    // find starting player - this is the player with the smallest card
    for (let i = 1; i < this.players.length; ++i) {
      // if the current player's smallest card is LARGER than player i's smallest card
      if (this.util.compare_cards(this.players[this.current_player].hand[0], this.players[i].hand[0]) > 0)
        this.current_player = i
    }

    this.lowest_card = this.players[this.current_player].hand[0]
  }

  // Starts a new round, clearing the board and allowing the next eligible player to start depending
  // on who has passed/played during the round.
  // To be called when everyone except for the last player to play a card has passed, or
  // the last player to play a card has run out of cards and EVERYONE still remaining has passed.
  // DO NOT call this function before anyone has played a card in a round.
  _start_new_round() {
    this.combo = null
    this.current_player = this.passed_players.size === this.remaining_players.length ?
      this.backup_next : this.last_playmaker
    this.passed_players.clear()
  }

  /* Returns boolean denoting whether the set of cards can be played on the current combo. */
  can_play(str_cards: string[]) {
    return this.util.can_play_on(this.util.strings_to_cards(str_cards), this.combo)
  }

  // Increments the current player, also removing them from the remaining players list if the remove
  // parameter is true. Starts a new round if it should.
  _increment_curr_player(remove: boolean) {
    let current_player_index = this.remaining_players.indexOf(this.current_player)

    // Increment once to set a valid value for this before (possibly) removing the current player.
    this.current_player = this.remaining_players[(current_player_index + 1) % this.remaining_players.length]

    // If we want to remove the current player, do so now; this is so that if removing this last player causes
    // a state where everyone has passed, we will be able to see that in the next check.
    if (remove) {
      this.remaining_players.splice(current_player_index, 1)
      current_player_index = this.remaining_players.indexOf(this.current_player)
    }

    // After we (possibly) remove the current player, we might be in a case where everyone has passed
    // except people that have no cards. In this case, we start a new round, which will result in
    // the backup next player being set as the starting player.
    if (this.passed_players.size === this.remaining_players.length) {
      this._start_new_round()
      return
    }

    while (this.passed_players.has(this.current_player))
      this.current_player = this.remaining_players[(++current_player_index) % this.remaining_players.length]

    // Otherwise, if not everyone remaining has passed, if we wrap around to the last playmaker we also know
    // to start another round, as this would mean that the only person who hasn't passed was the last person
    // to play a card.
    if (this.current_player === this.last_playmaker) {
      this._start_new_round()
    }

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
    // if (!this.util.can_play_on(cards, this.combo) || !this.players[this.current_player].has_cards(cards) ||
    //     this.remaining_players.length <= 1 || !this.util.lowest_card_check(cards, this.players[this.current_player], this.lowest_card))
    //   return -2

    console.log(`played ${cards} successfully`)

    this.players[this.current_player].remove_cards(cards)
    this.last_playmaker = this.current_player
    if (!this.players[this.current_player].hand.length) {
      // update player's score, and finished rank
      this.players[this.current_player].score += this.remaining_players.length - 1
      this.players[this.current_player].finished_rank = this.players.length - this.remaining_players.length + 1

      // remove finished player from list of remaining players before returning the finished player's id
      const finished_player = this.current_player
      this.combo = this.util._construct_combo(cards)

      const current_player_index = this.remaining_players.indexOf(this.current_player)
      // Doesn't matter if the next backup has passed already; it is still their turn if no one else plays
      this.backup_next = this.remaining_players[(current_player_index + 1) % this.remaining_players.length]

      this._increment_curr_player(true)
      return finished_player
    }

    this.combo = this.util._construct_combo(cards)
    this._increment_curr_player(false)
    return -1
  }

  pass() {
    if (!this.combo || this.remaining_players.length <= 1)
      return -2

    this.passed_players.add(this.current_player)
    this._increment_curr_player(false)
    return 0
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
