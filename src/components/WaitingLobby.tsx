import {
  Button, Heading, Input,
  ListItem, OrderedList,
} from '@chakra-ui/react'
import { useState } from 'react'

import { Action, type ActionData } from '@utils/actions'
import type { GameWithPlayers } from '@utils/prisma'

interface Props {
  game: GameWithPlayers,
  playerId: string,
  handleAction: (action: Action, data?: ActionData) => void
}

export default function WaitingLobby({ game, playerId, handleAction }: Props) {
  const [name, setName] = useState('')

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
        Start Game
      </Button>
      <Button onClick={() => handleAction(Action.Ping)} colorScheme="purple" mb={4}>
        Ping game channel
      </Button>

      {/* Current players list */}
      <Heading size="lg">Current players</Heading>
      {!game.players.length && 'No players currently, join in!'}

      <OrderedList mb={5}>
        {game.players.map((player, index) =>
          <ListItem key={index} fontWeight={(playerId && player.id === playerId) ? 'bold' : ''}>
            {player.name}
          </ListItem>
        )}
      </OrderedList>

      {/* Join game prompt */}
      {!playerId && (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            maxLength={24}
            w="50%"
            me={2} />
          <br />
          <Button onClick={() => handleAction(Action.Join, { name })} colorScheme="blue" mt={2}>
            Join next game
          </Button>
        </>
      )}

      {/* Leave game button */}
      {playerId && (
        <>
          <Button onClick={() => handleAction(Action.Leave)} colorScheme="pink" mt={2}>
            Sit out next game
          </Button>
        </>
      )}
    </>
  )
}
