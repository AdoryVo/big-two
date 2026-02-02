import Game from '@big-two/Game';
import Rules from '@big-two/Rules';
import { decks } from 'cards';

const game = new Game(
  2,
  (Rules.DEFAULT & ~Rules.MUST_PLAY_LOWEST_CARD) | Rules.NO_BOMBS,
);

game.players.forEach((player) => {
  player.hand = new decks.StandardDeck().remainingCards;
  player.hand.sort((c1, c2) => game.util.compare_cards(c1, c2));
});

// P1: Start
game.play(['3;clubs']);

// P2: Bomb, should fail - cannot play with bombs disabled
game.play(['4;clubs', '4;diamonds', '4;hearts', '4;spades']);

console.log('With no bombs:');
console.log(game.util.cards_to_strings(game.combo?.cards ?? []));

// Disable "no bombs"
game.util.rules &= ~Rules.NO_BOMBS;

// P2: Bomb, should succeed with bombs enabled
game.play(['4;clubs', '4;diamonds', '4;hearts', '4;spades']);

console.log('With bombs:');
console.log(game.util.cards_to_strings(game.combo?.cards ?? []));
