import {
  Box,
  Button,
  Heading,
  Input,
  ListItem,
  OrderedList,
} from '@chakra-ui/react';
import { Action, type ActionData } from '@utils/actions';
import type { GameWithPlayers } from '@utils/prisma';
import { SOLO_GAME_ID } from 'pages/game/singleplayer';
import { useState } from 'react';

interface Props {
  game: GameWithPlayers;
  playerId: string;
  handleAction: (action: Action, data?: ActionData) => void;
}

export default function WaitingLobby({ game, playerId, handleAction }: Props) {
  const [name, setName] = useState('');

  return (
    <>
      {/* Game Lobby Controls */}
      <Button
        onClick={() => handleAction(Action.Start)}
        isLoading={game.players.length < 2}
        loadingText="Need more players to start..."
        colorScheme="green"
        mb={4}
        me={2}
      >
        Start game
      </Button>
      {game.id !== SOLO_GAME_ID && (
        <Button
          onClick={() => handleAction(Action.Ping)}
          colorScheme="purple"
          mb={4}
        >
          Ping game channel
        </Button>
      )}

      {/* Current players list */}
      <Heading size="lg">Current players</Heading>
      {!game.players.length && 'No players currently, join in!'}

      <OrderedList mb={5}>
        {game.players.map((player) => (
          <ListItem
            key={player.id}
            fontWeight={playerId && player.id === playerId ? 'bold' : ''}
          >
            {player.name}
          </ListItem>
        ))}
      </OrderedList>

      {/* Join game prompt */}
      {!playerId && game.players.length < game.settings.playerMax && (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            maxLength={24}
            w="50%"
            me={2}
          />
          <br />
          <Button
            onClick={() => handleAction(Action.Join, { name })}
            colorScheme="blue"
            mt={2}
          >
            Join next game
          </Button>
        </>
      )}

      {/* Add singleplayer bot button */}
      {game.id === SOLO_GAME_ID && (
        <Box mt={2}>
          <Button
            onClick={() => handleAction(Action.AddBot)}
            colorScheme="teal"
            mr={2}
          >
            🤖 Add bot player
          </Button>
          <Button
            onClick={() => handleAction(Action.RemoveBot)}
            colorScheme="orange"
          >
            🔨 Remove bot player
          </Button>
        </Box>
      )}

      {/* Leave game button */}
      {playerId && (
        <Button
          onClick={() => handleAction(Action.Leave)}
          colorScheme="pink"
          mt={2}
        >
          Sit out next game
        </Button>
      )}
    </>
  );
}
