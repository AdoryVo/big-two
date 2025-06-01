import type { ContainerProps } from '@chakra-ui/react';
import {
  Box,
  Container,
  Divider,
  Heading,
  Link as ChakraLink,
  Text,
  useToast,
} from '@chakra-ui/react';
import shuffle from 'lodash/shuffle';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';

import Game from '@big-two/Game';
import Rules from '@big-two/Rules';
import ActiveGame from '@components/ActiveGame';
import GameInfo from '@components/GameInfo';
import GameInfoModal from '@components/GameInfoModal';
import HomeButton from '@components/HomeButton';
import Preferences from '@components/Preferences';
import Version from '@components/Version';
import WaitingLobby from '@components/WaitingLobby';
import { Action, type ActionData } from '@utils/actions';
import useIsTabletAndAbove from '@utils/hooks/useIsTabletAndAbove';
import { useStore } from '@utils/hooks/useStore';
import { GameWithPlayers } from '@utils/prisma';
import { getStyles } from '@utils/theme';
import { generateSlug } from 'random-word-slugs';

export const SOLO_GAME_ID = 'singleplayer';

interface BaseProps {
  children?: React.ReactNode;
  props?: ContainerProps;
}

function BasePage({ children, props }: BaseProps) {
  return (
    <Container
      p={5}
      backgroundColor="white"
      borderRadius="lg"
      shadow="md"
      maxW={{ base: 'container.md', md: '50vw', lg: 'container.sm' }}
      {...props}
    >
      <HomeButton
        position={{ md: 'fixed' }}
        top={{ md: '1em' }}
        left={{ md: '1em' }}
      />
      <Preferences
        props={{
          position: { md: 'fixed' },
          top: { md: '1em' },
          right: { md: '1em' },
        }}
      />
      {children}
    </Container>
  );
}

function gameToGameWithPlayers(game?: Game | undefined): GameWithPlayers {
  const initial_game = game ? game : new Game(2, Rules.DEFAULT, undefined, 1);
  const currentPlayer = initial_game.players[initial_game.current_player];
  const result_game: GameWithPlayers = {
    id: SOLO_GAME_ID,
    settingsId: 'settings',
    settings: {
      id: 'settings',
      deckCount: 1,
      rules: initial_game.util.rules,
      public: false,
      spectating: true,
      playerMax: Number.POSITIVE_INFINITY,
    },
    combo: initial_game.util.cards_to_strings(initial_game.combo?.cards || []),
    lowestCard: initial_game.util.card_to_string(initial_game.lowest_card),
    players: [],
    currentPlayer: null,
    passedPlayers: Array.from(initial_game.passed_players),
    lastPlaymaker: initial_game.last_playmaker,
    backupNext: initial_game.backup_next,
    createdAt: new Date(),
  };

  return result_game;
}

export default function SingleplayerGame() {
  const isTabletAndAbove = useIsTabletAndAbove();
  const toast = useToast();

  // calling mutate tells the server to refetch the game state
  const [game, setGame] = useState(gameToGameWithPlayers());
  const [gameInProgress, setGameInProgress] = useState(false);
  const [playerId, setPlayerId] = useState('');

  const theme = useStore((state) => state.theme);
  const styles = getStyles(theme);

  function handleSingleplayerSubmit(newSettings: object) {
    const newGame = { ...game, settings: { ...game.settings, ...newSettings } };
    setGame(newGame);
  }

  // useEffect(() => {
  //   if (isLoading || !game) {
  //     return;
  //   }

  //   setGameInProgress(Boolean(game.currentPlayer));

  //   // If we are entering a lobby previously joined, set player id
  //   const storedPlayerId = localStorage.getItem(game.id);
  //   if (storedPlayerId) {
  //     setPlayerId(storedPlayerId);
  //   }

  //   const channel = pusher.subscribe(game.id);
  //   channel.bind(Event.LobbyUpdate, () => void mutate());

  //   channel.bind(Event.Play, (play: string) => {
  //     toast({
  //       title: 'Next turn!',
  //       description: play,
  //       status: 'info',
  //       position: 'top',
  //       duration: 1500,
  //       isClosable: true,
  //     });
  //   });

  //   channel.bind(Event.Pong, () => {
  //     toast({
  //       title: 'Pong!',
  //       status: 'success',
  //       duration: 1000,
  //       isClosable: true,
  //     });
  //   });

  //   return () => {
  //     channel.unbind();
  //   };
  // }, [game, isLoading, pusher, mutate, toast]);

  // Remove old game id cookies
  useEffect(() => {
    useStore.persist.rehydrate();

    // async function clear() {
    //   for (let i = 0; i < localStorage.length; i++) {
    //     const cleared = await ky.patch('/api/clear').json<string | null>();
    //     if (cleared) {
    //       localStorage.removeItem(cleared);
    //     }
    //   }
    // }

    // clear();
  }, []);

  // useEffect(() => {
  //   playBots();
  // }, [game]);

  function getAllSubsets(array: string[], length: number): string[][] {
    // return array.reduce(
    //   (subsets: string[][], value) => {
    //     const newSubsets = subsets.map((set) => [value, ...set]);
    //     const lengthFiltered = newSubsets.filter(
    //       (subset) => subset.length <= length,
    //     );
    //     return subsets.concat(lengthFiltered);
    //   },
    //   [[]],
    // );

    const result = new Set<string>();
    const subset: string[] = [];
    const v = array;
    function findSubsets(idx: number) {
      // If the current subset is not empty
      // insert it into the result
      if (subset.length > length) {
        return;
      }
      if (subset.length > 0) {
        result.add(subset.join(','));
      }

      // Iterate over every element in the array
      for (let j = idx; j < v.length; j++) {
        // Pick the element and move ahead
        subset.push(v[j]);
        findSubsets(j + 1);

        // Backtrack to drop the element
        subset.pop();
      }
    }
    findSubsets(0);

    return Array.from(result).map((item) => item.split(','));
  }

  function playBots(globalGame: GameWithPlayers) {
    const remainingPlayers = globalGame.players.filter(
      (player) => !player.finishedRank,
    );
    if (
      remainingPlayers.length > 1 &&
      globalGame.currentPlayer?.id.includes('bot')
    ) {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const currentPlayer = globalGame.currentPlayer;
      if (!currentPlayer) {
        return;
      }

      const gameInstance = new Game(
        globalGame.players.length,
        globalGame.settings.rules,
        globalGame,
      );
      let comboLength = globalGame.combo.length;
      if (currentPlayer.hand.includes(globalGame.lowestCard || '')) {
        comboLength = 1;
      } else if (!comboLength) {
        comboLength = 5;
      }
      const allPossibleCombos = shuffle(
        getAllSubsets(currentPlayer.hand, comboLength),
      );
      let comboToPlay: string[] = [];
      for (const combo of allPossibleCombos) {
        const result = gameInstance.play(combo);
        if (result !== -2) {
          comboToPlay = combo;
        }
      }
      console.log(`Bot playing ${comboToPlay}`);

      sleep(1000).then(() => {
        let botPlayResult = undefined;
        if (!globalGame.combo.length) {
          botPlayResult = playCombo(globalGame, comboToPlay);
        } else {
          // Flip a coin to play vs. pass
          const play = Math.random() > 0.5;

          botPlayResult =
            play && comboToPlay.length
              ? playCombo(globalGame, comboToPlay)
              : pass(globalGame);
        }

        console.log(botPlayResult);
        if (botPlayResult) playBots(botPlayResult);
      });
    }
  }

  function pass(game: GameWithPlayers) {
    console.debug('Attempting pass on game:');
    console.dir(game);
    if (!game.currentPlayer) {
      return;
    }
    const passingPlayerName = game.currentPlayer.name;
    const gameInstance = new Game(
      game.players.length,
      game.settings.rules,
      game,
    );
    const result = gameInstance.pass();
    if (result === -2) {
      toast({
        title: 'Invalid action',
        description: 'You cannot pass right now!',
        status: 'error',
        duration: 1000,
      });
      return;
    }

    const newGame = { ...game };
    newGame.combo = gameInstance.util.cards_to_strings(
      gameInstance.combo?.cards || [],
    );
    newGame.lowestCard = gameInstance.util.card_to_string(
      gameInstance.lowest_card,
    );
    newGame.currentPlayer = game.players[gameInstance.current_player];
    newGame.passedPlayers = Array.from(gameInstance.passed_players);
    newGame.lastPlaymaker = gameInstance.last_playmaker;
    newGame.backupNext = gameInstance.backup_next;
    setGame(newGame);

    toast({
      title: 'Next turn!',
      description: `${passingPlayerName} passed!`,
      status: 'info',
      position: 'top',
      duration: 1500,
      isClosable: true,
    });

    return newGame;
  }

  function playCombo(game: GameWithPlayers, combo: string[]) {
    console.debug('Attempting combo ${combo} on game:');
    console.dir(game);
    if (!game.currentPlayer) {
      return;
    }

    const gameInstance = new Game(
      game.players.length,
      game.settings.rules,
      game,
    );
    const currentPlayerIndex = gameInstance.current_player;
    const result = gameInstance.play(combo || []);
    let play_description = '';

    if (result === -2) {
      let errorMessage = 'Invalid with the current combo - try another combo!';
      if (game.currentPlayer.hand.includes(game.lowestCard ?? '')) {
        errorMessage = `You must play a combo with the lowest card (${game.lowestCard})!`;
      }
      toast({
        title: 'Invalid combination',
        description: errorMessage,
        status: 'error',
        position: 'top',
        duration: 2000,
      });
      return;
    }

    const newGame = { ...game };

    if (result === -1) {
      const playedPlayer = newGame.players[currentPlayerIndex];
      playedPlayer.hand = gameInstance.util.cards_to_strings(
        gameInstance.players[currentPlayerIndex].hand,
      );
      play_description = `${playedPlayer.name} played ${combo?.join(', ')}!`;
    } else {
      const instanceFinishedPlayer = gameInstance.players[result];
      const finishedPlayer = newGame.players[result];
      finishedPlayer.hand = [];
      finishedPlayer.finishedRank = instanceFinishedPlayer.finished_rank ?? 0;
      finishedPlayer.points += instanceFinishedPlayer.score;
      play_description = `🏅 ${
        finishedPlayer.name
      } finished their hand with ${combo?.join(', ')}!`;
    }

    newGame.combo = gameInstance.util.cards_to_strings(
      gameInstance.combo?.cards || [],
    );
    newGame.lowestCard = gameInstance.util.card_to_string(
      gameInstance.lowest_card,
    );
    newGame.currentPlayer = game.players[gameInstance.current_player];
    newGame.passedPlayers = Array.from(gameInstance.passed_players);
    newGame.lastPlaymaker = gameInstance.last_playmaker;
    newGame.backupNext = gameInstance.backup_next;
    setGame(newGame);

    toast({
      title: 'Next turn!',
      description: play_description,
      status: 'info',
      position: 'top',
      duration: 1500,
      isClosable: true,
    });

    return newGame;
  }

  // Handles player actions by sending server requests
  function handleAction(action: Action, data: ActionData = {}) {
    if (!game) {
      return;
    }

    switch (action) {
      case Action.AddBot: {
        const newGame = {
          ...game,
          players: [
            ...game.players,
            {
              id: `bot-${generateSlug()}`,
              index: -1,
              name: `🤖 ${generateSlug()}`,
              hand: [],
              finishedRank: 0,
              points: 0,
              games: 0,
              gameId: SOLO_GAME_ID,
              currentInId: SOLO_GAME_ID,
            },
          ],
        };
        setGame(newGame);
        break;
      }
      case Action.RemoveBot: {
        const firstBotIndex = game.players.findIndex((player) =>
          player.id.includes('bot'),
        );
        const newGame = {
          ...game,
          players: game.players.filter((_, index) => index !== firstBotIndex),
        };
        setGame(newGame);
        break;
      }
      case Action.Join: {
        const name = data.name;
        if (
          !name ||
          game.players.find(
            (player) => player.name.toLowerCase() === name.trim().toLowerCase(),
          )
        ) {
          toast({
            title: 'Error',
            description: 'Please enter a valid & unique name!',
            status: 'error',
            duration: 1000,
          });
          return;
        }
        const newGame = {
          ...game,
          players: [
            ...game.players,
            {
              id: 'user',
              index: -1,
              name: name,
              hand: [],
              finishedRank: 0,
              points: 0,
              games: 0,
              gameId: SOLO_GAME_ID,
              currentInId: SOLO_GAME_ID,
            },
          ],
        };
        setGame(newGame);
        localStorage.setItem(game.id, 'user');
        setPlayerId('user');
        //     });
        break;
      }
      case Action.Leave: {
        localStorage.removeItem(game.id);
        setPlayerId('');

        const newGame = {
          ...game,
          players: game.players.filter((player) => player.id !== 'user'),
        };
        setGame(newGame);
        //   ky.patch(url);
        break;
      }
      case Action.Play: {
        const combo = data.comboToPlay;
        const newGame = playCombo(game, combo || []);
        if (newGame) playBots(newGame);
        break;
      }
      case Action.Pass: {
        // ky.patch(url).catch(() => {
        //   toast({
        //     title: 'Invalid action',
        //     description: 'You cannot pass right now!',
        //     status: 'error',
        //     duration: 1000,
        //   });
        // });
        const newGame = pass(game);
        if (newGame) playBots(newGame);
        break;
      }
      case Action.Start: {
        const newGameInstance = new Game(
          game.players.length,
          game.settings.rules,
          undefined,
          game.settings.deckCount,
        );

        const newPlayers = [...game.players];
        const rng = Math.floor(Math.random() * game.players.length - 1);
        for (let i = 0; i < game.players.length; i++) {
          const storedPlayer = newPlayers[i];
          const instancePlayer = newGameInstance.players[i];

          storedPlayer.index = (i + rng) % game.players.length;
          storedPlayer.hand = newGameInstance.util.cards_to_strings(
            instancePlayer.hand,
          );
          storedPlayer.finishedRank = 0;
          storedPlayer.games += 1;
        }

        const newGame: GameWithPlayers = {
          ...game,
          lowestCard: newGameInstance.util.card_to_string(
            newGameInstance.lowest_card,
          ),
          currentPlayer: game.players[newGameInstance.current_player],
          players: newPlayers,
        };
        if (newGame.currentPlayer?.id.includes('bot')) playBots(newGame);
        else setGame(newGame);

        setGameInProgress(true);
        break;
      }
      case Action.End: {
        const newGame = { ...game };
        newGame.combo = [];
        newGame.lowestCard = null;
        newGame.currentPlayer = null;
        newGame.passedPlayers = [];
        newGame.lastPlaymaker = null;
        newGame.backupNext = null;
        setGame(newGame);
        setGameInProgress(false);
        // ky.patch(url);
        break;
      }
    }
  }

  function getPageTitle() {
    if (gameInProgress && game) {
      return `⚔️ ${game.players.length} players`;
    } else {
      return '🧍 Waiting for players...';
    }
  }

  function copyGameLink() {
    navigator.clipboard.writeText(window.location.toString());
    toast({
      title: 'Lobby link copied!',
      status: 'success',
      duration: 1500,
      isClosable: true,
    });
  }

  // if (isLoading || !game || error) {
  //   return (
  //     <Box {...styles.bg} minH="100vh" p={5}>
  //       <NextSeo title="Lobby | Big Two" description="Join and play!" />
  //       <Version {...styles.text} />
  //       <BasePage>
  //         <Heading textAlign="center">
  //           {error ? '💀 Game could not load!' : '⏳ Loading!'}
  //         </Heading>
  //       </BasePage>
  //     </Box>
  //   );
  // }

  return (
    <Box {...styles.bg} minH="100vh" p={5}>
      <NextSeo title={`${getPageTitle()} | Big Two`} />
      <Version {...styles.text} />
      <BasePage
        props={
          gameInProgress
            ? {
                width: { md: '25vw' },
                position: { md: 'absolute' },
                bottom: { md: '1em' },
                right: { md: '1em' },
              }
            : {}
        }
      >
        <Heading>Game Lobby</Heading>
        <Text mb={{ base: 5, md: 2 }}>
          <ChakraLink
            onClick={copyGameLink}
            tabIndex={0}
            title="Copy lobby link"
            color="teal.500"
            fontWeight="bold"
          >
            Lobby ID: Singleplayer mode!
          </ChakraLink>
          <br />
          Bots will be added to multiplayer lobbies soon once they get smarter!
        </Text>

        {gameInProgress ? (
          <ActiveGame
            game={game}
            playerId={playerId}
            handleAction={handleAction}
          />
        ) : (
          <WaitingLobby
            game={game}
            playerId={playerId}
            handleAction={handleAction}
          />
        )}

        {isTabletAndAbove && gameInProgress ? (
          <>
            <GameInfoModal game={game} />
          </>
        ) : (
          <>
            <Divider my={5} />
            <GameInfo
              game={game}
              handleSingleplayerSubmit={handleSingleplayerSubmit}
            />
          </>
        )}
      </BasePage>
    </Box>
  );
}
