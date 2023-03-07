import {
  Box,
  Button,
  Divider,
  Heading,
  Text
} from '@chakra-ui/react'
import { useState } from 'react'

import { GameWithPlayers } from '../lib/prisma'
import { Action, ActionData } from '../pages/game/[gameId]'
import CardImage from './CardImage'
import PlayerHand from './PlayerHand'

interface Props {
  game: GameWithPlayers,
  playerId: string,
  handleAction: (action: Action, data?: ActionData) => void
}

export default function ActiveGame({ game, playerId, handleAction }: Props) {
  const [comboToPlay, setComboToPlay] = useState(new Set<string>())

  const player = game.players.find((player) => (playerId && player.id === playerId))
  const passedPlayers = game.players.filter((_, index) => game.passedPlayers.includes(index))

  // use dummy flag to force rerenders, so we don't have to copy the comboToPlay set every time to trigger rerender
  const [dummy, setDummy] = useState(false)
  function forceUpdate() {
    setDummy(!dummy)
  }

  function handleClick(card: string) {
    if (comboToPlay.has(card)) {
      comboToPlay.delete(card)
    } else {
      comboToPlay.add(card)
    }

    setComboToPlay(comboToPlay)
    forceUpdate()
  }

  return (
    <>
      Current combo: {game.combo.join(' ')}
      <br />

      Turn order: {game.players.sort((a, b) => a.index - b.index).map((player) => player.name).join(', ')}
      <br />

      Passed players: {passedPlayers.map((player) => player.name).join(', ')}
      <br />

      Finished players: {game.players.filter((player) => player.finished).map((player) => player.name).join(', ')}
      <br />

      {/* Player view: current hand */}
      {player &&
        <Box my={5} py={2}>
          <Heading size="md" mb={2}>{game.currentPlayer?.name}&apos;s Turn</Heading>

          Player hands:
          {game.players.sort((a, b) => a.index - b.index).map((player, index) =>
            <Text key={index}>
              {player.name}: {player.hand.length} cards
            </Text>
          )}
          <br />

          Your hand ({player.hand.length} cards):
          <br />
          <PlayerHand hand={player.hand} handleClick={handleClick} comboToPlay={comboToPlay}>
            {/* Current turn: Display actions */}
            {game.currentPlayer?.id === player.id &&
              <Box>
                <Heading size="md" my={4}>Take your action!</Heading>
                <Button onClick={() => handleAction(Action.Play, { comboToPlay: Array.from(comboToPlay) })} colorScheme="green" me={2}>
                  Play a combo
                </Button>
                <Button onClick={() => handleAction(Action.Pass)} isDisabled={!game.combo.length} colorScheme="blue">
                  Pass
                </Button>
              </Box>
            }
          </PlayerHand>

          <Divider my={4} />

          <Button onClick={() => handleAction(Action.End)} colorScheme="red">
            End Game
          </Button>
        </Box>
      }

      {/* Spectator view */}
      {!playerId && (
        <Box my={5} py={2}>
          <Heading size="md">Spectating...</Heading>
          {game.players.map((player, index) => (
            <Box key={index} mb={5}>
              <Heading size="sm" mb={1}>{player.name}&apos;s hand</Heading>
              {player.hand.map((card, cardIndex) =>
                <CardImage key={cardIndex} card={card} />
              )}
            </Box>
          ))}
        </Box>
      )}
    </>
  )
}
