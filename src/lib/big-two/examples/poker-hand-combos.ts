import Game from '@big-two/Game';
import Rules from '@big-two/Rules';
import { decks } from 'cards';

// TODO: Write unit tests for more thorough overall testing

const game = new Game(2, Rules.CANTONESE & ~Rules.MUST_PLAY_LOWEST_CARD);

game.players.forEach((player) => {
  player.hand = new decks.StandardDeck().remainingCards;
  player.hand.sort((c1, c2) => game.util.compare_cards(c1, c2));
});

// P1: Straight
game.play(['3;clubs', '4;clubs', '5;diamonds', '6;hearts', '7;spades']);

// P2: Flush
game.play(['3;clubs', '5;clubs', '8;clubs', '9;clubs', '10;clubs']);

// P1: Flush, should fail - cannot play flush with worse suit
game.play([
  '3;diamonds',
  '4;diamonds',
  '5;diamonds',
  '6;diamonds',
  '8;diamonds',
]);

// P1: Full House
game.play(['3;diamonds', '3;hearts', '6;clubs', '6;diamonds', '6;spades']);

// P2: Four of a Kind
game.play(['4;clubs', '4;diamonds', '4;hearts', '4;spades', '5;diamonds']);

// P1: Straight Flush
game.play(['8;hearts', '9;hearts', '10;hearts', 'J;hearts', 'Q;hearts']);

console.log(game.util.cards_to_strings(game.combo?.cards ?? []));
