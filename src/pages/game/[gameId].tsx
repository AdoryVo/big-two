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
import ky from 'ky';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';

import ActiveGame from '@components/ActiveGame';
import GameInfo from '@components/GameInfo';
import GameInfoModal from '@components/GameInfoModal';
import HomeButton from '@components/HomeButton';
import Preferences from '@components/Preferences';
import Version from '@components/Version';
import WaitingLobby from '@components/WaitingLobby';
import { Action, type ActionData } from '@utils/actions';
import useGame from '@utils/hooks/useGame';
import useIsTabletAndAbove from '@utils/hooks/useIsTabletAndAbove';
import { usePusher } from '@utils/hooks/usePusher';
import { useStore } from '@utils/hooks/useStore';
import { Event } from '@utils/pusher';
import { getStyles } from '@utils/theme';

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

export default function Game() {
  const isTabletAndAbove = useIsTabletAndAbove();
  const pusher = usePusher();
  const toast = useToast();

  // calling mutate tells the server to refetch the game state
  const { game, isLoading, error, mutate } = useGame();
  const [gameInProgress, setGameInProgress] = useState(false);
  const [playerId, setPlayerId] = useState('');

  const theme = useStore((state) => state.theme);
  const styles = getStyles(theme);

  useEffect(() => {
    if (isLoading || !game) {
      return;
    }

    setGameInProgress(Boolean(game.currentPlayer));

    // If we are entering a lobby previously joined, set player id
    const storedPlayerId = localStorage.getItem(game.id);
    if (storedPlayerId) {
      setPlayerId(storedPlayerId);
    }

    const channel = pusher.subscribe(game.id);
    channel.bind(Event.LobbyUpdate, () => {
      mutate();
    });

    channel.bind(Event.Play, (play: string) => {
      toast({
        title: 'Next turn!',
        description: play,
        status: 'info',
        position: 'top',
        duration: 1500,
        isClosable: true,
      });
    });

    channel.bind(Event.Pong, () => {
      toast({
        title: 'Pong!',
        status: 'success',
        duration: 1000,
        isClosable: true,
      });
    });

    return () => {
      channel.unbind();
    };
  }, [game, isLoading, pusher, mutate, toast]);

  // Remove old game id cookies
  useEffect(() => {
    useStore.persist.rehydrate();

    async function clear() {
      for (let i = 0; i < localStorage.length; i++) {
        const cleared = await ky.patch('/api/clear').json<string | null>();
        if (cleared) {
          localStorage.removeItem(cleared);
        }
      }
    }

    clear();
  }, []);

  // Handles player actions by sending server requests
  function handleAction(action: Action, data: ActionData = {}) {
    if (!game) {
      return;
    }

    const url = `/api/${game.id}/${action}`;

    switch (action) {
      case Action.Ping:
        ky.get(url);
        break;
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
        const joinBody = { json: { name: name.trim() } };
        ky.post(url, joinBody)
          .json<string>()
          .then((playerId) => {
            localStorage.setItem(game.id, playerId);
            setPlayerId(playerId);
            mutate();
          });
        break;
      }
      case Action.Leave:
        localStorage.removeItem(game.id);
        setPlayerId('');
        ky.patch(url);
        break;
      case Action.Play: {
        const playBody = { json: { combo: data.comboToPlay } };
        ky.put(url, playBody).catch(() => {
          toast({
            title: 'Invalid combination',
            description: 'Invalid with the current combo - try another combo!',
            status: 'error',
            position: 'top',
            duration: 2000,
          });
        });
        break;
      }
      case Action.Pass:
        ky.patch(url).catch(() => {
          toast({
            title: 'Invalid action',
            description: 'You cannot pass right now!',
            status: 'error',
            duration: 1000,
          });
        });
        break;
      case Action.Start:
      case Action.End:
        ky.patch(url);
        break;
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

  if (isLoading || !game || error) {
    return (
      <Box {...styles.bg} minH="100vh" p={5}>
        <NextSeo title="Lobby | Big Two" description="Join and play!" />
        <Version {...styles.text} />
        <BasePage>
          <Heading textAlign="center">
            {error ? '💀 Game could not load!' : '⏳ Loading!'}
          </Heading>
        </BasePage>
      </Box>
    );
  }

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
            Lobby ID: {game.id} 📋
          </ChakraLink>
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
            <GameInfo game={game} />
          </>
        )}
      </BasePage>
    </Box>
  );
}
