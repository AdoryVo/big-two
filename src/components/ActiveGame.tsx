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
  const player = game.players.find((player) => player.id === playerId)
  const passedPlayers = game.players.filter((_, index) => game.passedPlayers.includes(index))

  return (
    <>
      {/* Player view: current hand */}
      {player &&
        <Box my={5} py={2}>
          <Heading size="md" mb={2}>{game.currentPlayer?.name}&apos;s Turn</Heading>

          Combo: {game.combo.join(' ')}
          <br />

          Passed Players: {passedPlayers.map((player) => player.name).join(', ')}
          <br />
          <br />

          Your hand:
          <br />
          {player.hand.join(', ')}

          {/* Current turn: Display actions */}
          {game.currentPlayer?.id === player.id &&
            <Box>
              <Heading size="md" my={4}>Take your action!</Heading>
              <Button onClick={() => handleAction(Action.Pass)} colorScheme="blue">
                Pass
              </Button>
            </Box>
          }
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
