import {
  Alert, AlertDescription, AlertTitle,
  Box,
  Button,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'

import CardImage from './CardImage'
import PlayerHand from './PlayerHand'

import { Action, type ActionData } from '@utils/actions'
import type { GameWithPlayers } from '@utils/prisma'

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

  // Whether we're spectating (either we're not in the game, or we are and we finished)
  const spectating = (!playerId || thisPlayer?.finishedRank) && game.settings.spectating

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
          <CardImage key={index} card={card} />
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
            {(game.currentPlayer && game.currentPlayer.id === thisPlayer.id) && remainingPlayers.length !== 1 &&
              <Alert
                backgroundColor="blackAlpha.800"
                variant="solid"
                position="fixed"
                bottom="2"
                zIndex={2}
                left="50%"
                transform="translate(-50%, 0)"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                width={{ base: '95%', md: 'auto' }}
                mx="auto"
                px={{ base: 0, md: 8 }}
              >
                <AlertTitle fontWeight="bold" me={0}>
                  <Heading size="md">Take your action!</Heading>
                </AlertTitle>
                <AlertDescription textAlign="center">
                  <Text mb={2}>
                    Select cards in your hand to play or pass!
                  </Text>
                  <Button onClick={handlePlay} colorScheme="green" me={2}>
                    Play a combo
                  </Button>
                  <Button onClick={() => handleAction(Action.Pass)} isDisabled={!game.combo.length} colorScheme="blue">
                    Pass
                  </Button>
                </AlertDescription>
              </Alert>
            }
          </PlayerHand>
        </Box>
      }

      {/* Spectator view - display if we're done (or not in the game) */}
      {Boolean(spectating) &&
        <Box my={5} py={2}>
          <Heading size="md">Spectating...</Heading>
          {game.players.map((player, index) => (
            <Box key={index} mb={5}>
              <Text size="sm" mb={1}>
                {player.name}&apos;s hand
                {!player.hand.length && ` is finished! ${RANK_EMOJIS[player.finishedRank]}`}
              </Text>
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
      }

      {/* Don't show slider if there's no cards in our hand (or others' hands, if we're spectating) to display */}
      {(thisPlayer?.hand?.length || spectating) &&
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
      }

      {/* Display end button for everyone once the game is over, even if they still have cards in hand */}
      {remainingPlayers.length === 1 &&
        <Box my={3}>
          <hr />
          <Heading size="lg" my={2}>
            🎉 The game has finished!
          </Heading>
          <Text mb={2}>
            Points have been awarded to players in the scoreboard!
            <br />
            Click the button below to finalize the game & return to the lobby.
          </Text>
          <Button onClick={() => handleAction(Action.End)} colorScheme="blue">
            Return to the lobby
          </Button>
        </Box>
      }
    </>
  )
}
