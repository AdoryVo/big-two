import { Card } from 'cards';
import { Rank } from 'cards/build/ranks';
import { Suit } from 'cards/build/suits';

import { Combo, Combo_Types } from './Combo';
import type Player from './Player';
import Rules from './Rules';

export const CARD_STRING_SEPARATOR = ';'; // "2;clubs"

export const SUIT_RANKING_ORDERS = {
  [Rules.SUIT_ORDER_ALPHA]: ['clubs', 'diamonds', 'hearts', 'spades'],
  [Rules.SUIT_ORDER_BETA]: ['spades', 'clubs', 'diamonds', 'hearts'],
  [Rules.SUIT_ORDER_GAMMA]: ['diamonds', 'clubs', 'hearts', 'spades'],
};

const RANK_ABBR_TO_NAME: { [key: string]: string } = {
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  '10': 'Ten',
  J: 'Jack',
  Q: 'Queen',
  K: 'King',
  A: 'Ace',
};

class Util {
  rules: Rules;

  constructor(rules: Rules) {
    this.rules = rules;
  }

  _rank_val(card: Card) {
    const rank = card.rank.abbrn;
    if (Number.parseInt(rank) > 2) return Number(rank);
    else
      return (
        {
          J: 11,
          Q: 12,
          K: 13,
          A: 14,
          '2': 15,
        }[rank] ?? -1
      );
  }

  _suit_val(card: Card) {
    const suit = card.suit.name;
    if (this.rules & Rules.SUIT_ORDER_BETA)
      return SUIT_RANKING_ORDERS[Rules.SUIT_ORDER_BETA].indexOf(suit);
    else if (this.rules & Rules.SUIT_ORDER_GAMMA)
      return SUIT_RANKING_ORDERS[Rules.SUIT_ORDER_GAMMA].indexOf(suit);
    // Default to suit order alpha.
    else return SUIT_RANKING_ORDERS[Rules.SUIT_ORDER_ALPHA].indexOf(suit);
  }

  compare_cards(c1: Card, c2: Card) {
    const r1 = this._rank_val(c1);
    const r2 = this._rank_val(c2);

    if (r1 !== r2) return r1 < r2 ? -1 : 1;

    const s1 = this._suit_val(c1);
    const s2 = this._suit_val(c2);

    if (s1 !== s2) return s1 < s2 ? -1 : 1;

    return 0;
  }

  /* Returns the count of consecutively equal cards (ranks if use_suit is specified, suits otherwise)
   * in the list of cards given, starting from the specified index.
   */
  _count_cons_eq(cards: Card[], start = 0, use_suit = false) {
    let curr = start;
    if (use_suit) {
      while (
        curr < cards.length - 1 &&
        cards[curr].suit.name === cards[curr + 1].suit.name
      )
        ++curr;
    } else {
      while (
        curr < cards.length - 1 &&
        cards[curr].rank.abbrn === cards[curr + 1].rank.abbrn
      )
        ++curr;
    }

    return curr - start + 1;
  }

  _straight(cards: Card[]) {
    let discont = null;
    for (let i = 0; i < cards.length - 1; ++i) {
      if (this._rank_val(cards[i]) + 1 !== this._rank_val(cards[i + 1])) {
        // if we have a straight wraparound, we will see a discontinuity of EXACTLY 9 in the list of sorted cards,
        // e.g. 3 4 K A 2, 3 4 5 A 2, 3 4 5 6 2
        if (
          this.rules & Rules.STRAIGHTS_WRAP_AROUND &&
          this._rank_val(cards[i]) + 9 === this._rank_val(cards[i + 1])
        )
          discont = cards[i];
        else return null;
      }
    }

    return discont ?? cards[cards.length - 1];
  }

  _full_house(cards: Card[]) {
    const first_run = this._count_cons_eq(cards);
    const second_run = this._count_cons_eq(cards, first_run);

    if (
      Math.min(first_run, second_run) !== 2 ||
      Math.max(first_run, second_run) !== 3
    )
      return null;

    // triples are first 3 cards
    if (first_run > second_run) return cards[2];

    // otherwise, triples are the next 3 cards
    return cards[cards.length - 1];
  }

  _flush(cards: Card[]) {
    return this._count_cons_eq(cards, 0, true) === 5
      ? cards[cards.length - 1]
      : null;
  }

  _bomb(cards: Card[]) {
    if (this._count_cons_eq(cards, 1) === 4) return cards[4];
    else if (this._count_cons_eq(cards, 0) === 4) return cards[3];

    return null;
  }

  _construct_5_combo(cards: Card[]) {
    let value_card = null;

    if ((value_card = this._straight(cards)))
      return new Combo(cards, Combo_Types.STRAIGHT, value_card);
    else if ((value_card = this._full_house(cards)))
      return new Combo(cards, Combo_Types.FULL_HOUSE, value_card);
    else if ((value_card = this._bomb(cards)))
      return new Combo(cards, Combo_Types.BOMB, value_card);
    else if (
      this.rules & Rules.FLUSH_ALLOW &&
      (value_card = this._flush(cards))
    )
      return new Combo(cards, Combo_Types.FLUSH, value_card);

    return new Combo(cards, Combo_Types.INVALID, null);
  }

  // If Rules.STRAIGHTS_ALLOW_RUNS, see if the combo is a valid straight
  _construct_loose_straight(cards: Card[]) {
    if (this.rules & Rules.STRAIGHTS_ALLOW_RUNS) {
      const value_card = this._straight(cards);
      return new Combo(
        cards,
        value_card ? Combo_Types.STRAIGHT : Combo_Types.INVALID,
        value_card,
      );
    }

    return new Combo(cards, Combo_Types.INVALID, null);
  }

  // constructs a combo from a list of SORTED cards.
  _construct_combo(cards: Card[]) {
    switch (cards.length) {
      case 1:
        return new Combo(cards, Combo_Types.SINGLE, cards[0]);
      case 2:
        return new Combo(
          cards,
          this._count_cons_eq(cards) === 2
            ? Combo_Types.DOUBLE
            : Combo_Types.INVALID,
          cards[1],
        );
      case 3:
        if (this._count_cons_eq(cards) === 3)
          return new Combo(cards, Combo_Types.TRIPLE, cards[2]);

        return this._construct_loose_straight(cards);
      case 4:
        if (this.rules & Rules.NO_BOMBS)
          return new Combo(cards, Combo_Types.INVALID, cards[3]);

        if (this._count_cons_eq(cards) === 4)
          return new Combo(cards, Combo_Types.BOMB, cards[3]);

        return this._construct_loose_straight(cards);
      case 5:
        return this._construct_5_combo(cards);
      default:
        return this._construct_loose_straight(cards);
    }
  }

  // Whether it is legal to play the specified set of cards on top of the combo.
  // TODO: add 5-combo compatability logic + appopriate flag in Rules (e.g. can play full house on flush/straight)
  can_play_on(cards: Card[], combo: Combo | null) {
    const new_combo = this._construct_combo(cards);
    if (!combo) return new_combo.type !== Combo_Types.INVALID;

    if (
      new_combo.type === Combo_Types.INVALID ||
      (new_combo.type !== Combo_Types.BOMB && combo.type === Combo_Types.BOMB)
    )
      return false;
    else if (
      !combo ||
      (new_combo.type === Combo_Types.BOMB && combo.type !== Combo_Types.BOMB)
    )
      return true;
    else if (
      new_combo.type === Combo_Types.STRAIGHT &&
      new_combo.cards.length !== combo.cards.length
    ) {
      // Disallow playing straight of different length on a straight
      return false;
    }

    if (new_combo.value_card && combo.value_card)
      return (
        new_combo.type === combo.type &&
        this.compare_cards(new_combo.value_card, combo.value_card) > 0
      );
  }

  /** Ex: 2 of clubs -> "2;clubs" */
  card_to_string(card: Card) {
    return card.rank.abbrn + CARD_STRING_SEPARATOR + card.suit.name;
  }

  cards_to_strings(cards: Card[]): string[] {
    return cards.map(this.card_to_string);
  }

  /**
   * Given a string array of cards ["rank_abbr;suit", "rank_abbr;suit", ... "rank_abbr;suit"],
   * return a SORTED Card array.
   * ---
   * Ex: ["2;clubs", "10;hearts", "a;spades"] = [2 of clubs, 10 of hearts, ace of spades]
   */
  strings_to_cards(str_cards: string[]) {
    const cards = [];

    for (const cstring of str_cards) {
      const [rank_abbr, suit_name] = cstring.split(CARD_STRING_SEPARATOR); // ex: "2;clubs" -> ["2", "clubs"]
      cards.push(
        new Card(
          new Suit(suit_name),
          new Rank(rank_abbr, RANK_ABBR_TO_NAME[rank_abbr]),
        ),
      );
    }

    // 'this' gets unbound in the scope of this.compare_cards without this arrow function,
    // so then this._rank_val cannot be called from this.compare_cards
    // this is because this.compare_cards is passed as a parameter and loses certain bound variables
    cards.sort((c1, c2) => this.compare_cards(c1, c2));
    return cards;
  }

  // Given a sorted list of cards to be played, a player, and the lowest card dealt in a game,
  // return whether the player is allowed to play the list of cards.
  // i.e. if the rules specify that you must play the lowest card when you start with it, check that
  // that if the player has the lowest card, it is also being played (exists in cards argument)
  lowest_card_check(cards: Card[], player: Player, lowest_card: Card) {
    if (
      this.rules & Rules.MUST_PLAY_LOWEST_CARD &&
      player.has_cards([lowest_card])
    ) {
      return !this.compare_cards(cards[0], lowest_card);
    }

    return true;
  }
}

export default Util;
