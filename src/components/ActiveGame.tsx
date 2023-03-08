import {
  Box,
  Button,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
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

const RANK_EMOJIS = ['', '🥇', '🥈', '🥉']

export default function ActiveGame({ game, playerId, handleAction }: Props) {
  const [comboToPlay, setComboToPlay] = useState(new Set<string>())
  const [cardSpacing, setCardSpacing] = useState('-5.5em')

  const thisPlayer = game.players.find((player) => (playerId && player.id === playerId))
  const remainingPlayers = game.players.filter((player) => !player.finishedRank)
  // Check if last playmaker is in the remaining players
  const lastInGame = remainingPlayers.some((player) => player.index === game.lastPlaymaker)

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

  function handlePlay() {
    handleAction(Action.Play, { comboToPlay: Array.from(comboToPlay) })
    comboToPlay.clear()
    setComboToPlay(comboToPlay)
  }

  return (
    <>
      Current combo:
      <Stack direction="row" spacing={cardSpacing}>
        {game.combo.map((card, index) =>
          <Box key={index}>
            <CardImage card={card} />
          </Box>
        )}
        {!game.combo.length &&
          <CardImage card="" />
        }
      </Stack>

      {/* Player view: current hand */}
      {thisPlayer &&
        <Box my={5} py={2}>
          Player hands:
          {game.players.sort((a, b) => a.index - b.index).map((player, index) =>
            <Box key={index}>
              <Text
                fontWeight={(game.currentPlayer?.name === player.name) ? 'bold' : ''}
                color={(player.index === ((lastInGame) ? game.lastPlaymaker : game.backupNext)) ? 'blue.500' : ''}
                title={(player.index === ((lastInGame) ? game.lastPlaymaker : game.backupNext)) ? 'Round leader' : ''}
              >
                {player.name} {thisPlayer.name === player.name && '(You)'}: {player.hand.length} cards {RANK_EMOJIS[player.finishedRank]}
                {game.passedPlayers.includes(player.index) && '⏭️'}
              </Text>
              {player.name !== thisPlayer.name &&
                <Stack direction="row" spacing={cardSpacing}>
                  {player.hand.map((card, cardIndex) =>
                    <Box key={cardIndex}>
                      <CardImage card={card} />
                    </Box>
                  )}
                </Stack>
              }
            </Box>
          )}
          <br />

          Your hand ({thisPlayer.hand.length} cards):
          <br />
          <PlayerHand hand={thisPlayer.hand} comboToPlay={comboToPlay} cardSpacing={cardSpacing} handleClick={handleClick}>
            {/* Current turn: Display actions */}
            {(game.currentPlayer && game.currentPlayer.id === thisPlayer.id) &&
              <Box>
                <Heading size="md" my={4}>Take your action!</Heading>
                <Button onClick={handlePlay} colorScheme="green" me={2}>
                  Play a combo
                </Button>
                <Button onClick={() => handleAction(Action.Pass)} isDisabled={!game.combo.length} colorScheme="blue">
                  Pass
                </Button>
              </Box>
            }

            {remainingPlayers.length === 1 &&
              <Box my={3}>
                <Button onClick={() => handleAction(Action.End)} colorScheme="red">
                  End Game
                </Button>
              </Box>
            }
          </PlayerHand>
        </Box>
      }

      {/* Spectator view */}
      {!playerId && (
        <Box my={5} py={2}>
          <Heading size="md">Spectating...</Heading>
          {game.players.map((player, index) => (
            <Box key={index} mb={5}>
              <Heading size="sm" mb={1}>{player.name}&apos;s hand</Heading>
              <Stack key={index} direction="row" spacing={cardSpacing}>
                {player.hand.map((card, cardIndex) =>
                  <Box key={cardIndex} onClick={() => handleClick(card)}>
                    <CardImage
                      card={card}
                      selected={comboToPlay.has(card)}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      )}

      <Box maxW="50%">
        <Text>Card spread spacing</Text>
        <Slider
          aria-label="card-spread-spacing"
          min={5.4}
          max={6}
          step={0.05}
          defaultValue={5.7}
          isReversed={true}
          onChange={(val) => setCardSpacing(-1 * val + 'em')}>
          <SliderTrack bg="green.500">
            <SliderFilledTrack bg="green.100" />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </>
  )
}
