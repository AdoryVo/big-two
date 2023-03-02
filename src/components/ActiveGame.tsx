import {
  Box, Button,
  Heading
} from '@chakra-ui/react'

import { GameWithPlayers } from '../lib/prisma'
import { Action } from '../pages/game/[gameId]'

interface Props {
  game: GameWithPlayers,
  playerId: string,
  handleAction: (action: Action) => void
}

export default function ActiveGame({ game, playerId, handleAction }: Props) {
  return (
    <>
      {/* Player view: current hand */}
      {game.players.find((player) => player.id == playerId) &&
      <Box my={5} py={2}>
        {JSON.stringify(game.players.find((player) => player.id == playerId))}
      </Box>
      }

      {/* Spectator view */}
      {!playerId && (
        <Box my={5} py={2}>
          <Heading size="md">Spectating...</Heading>
          {game.players.map((player, index) => (
            <Box key={index} mb={5}>
              <Heading size="sm">Hand {index}</Heading>
              {JSON.stringify(player)}
            </Box>
          ))}
        </Box>
      )}

      <Button onClick={() => handleAction(Action.End)} colorScheme="red" mb={4} me={2}>
        End Game
      </Button>
    </>
  )
}
