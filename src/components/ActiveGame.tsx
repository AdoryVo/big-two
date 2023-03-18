import type { BoxProps } from '@chakra-ui/react'
import {
  Alert, AlertDescription, AlertTitle,
  Box,
  Button,
  Heading,
  Slider, SliderFilledTrack, SliderThumb, SliderTrack,
  Stack,
  Text,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react'
import { useState } from 'react'

import CardImage from './CardImage'
import OpponentHand from './OpponentHand'
import PlayerHand from './PlayerHand'

import Game from '@big-two/Game'
import { Action, type ActionData } from '@utils/actions'
import type { GameWithPlayers } from '@utils/prisma'

interface Props {
  game: GameWithPlayers,
  playerId: string,
  handleAction: (action: Action, data?: ActionData) => void
}

const RANK_EMOJIS = ['', '🥇', '🥈', '🥉']
const PLAYER_EMOJIS = [
  ['🐸', '🐊', '🦎', '🐍'],
  ['🐶', '😺', '🐟', '🦜'],
  ['🍔', '🌭', '🍕', '🍟'],
  ['💀', '🥶', '😂', '🗿'],
]

const INFO_STYLES = [
  {
    bottom: '8em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    left: '8em',
    transform: 'translate(0, -50%)',
  },
  {
    top: '8em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    right: '8em',
    transform: 'translate(0, -50%)',
  },
]

const fixedComboStyles: BoxProps = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'blackAlpha.100',
}

export default function ActiveGame({ game, playerId, handleAction }: Props) {
  const [isDesktop] = useMediaQuery('(min-width: 48em)')

  const [comboToPlay, setComboToPlay] = useState(new Set<string>())
  const [cardSpacing, setCardSpacing] = useState('-4.5em')

  const thisPlayer = game.players.find((player) => (playerId && player.id === playerId))
  const remainingPlayers = game.players.filter((player) => !player.finishedRank)
  // Check if last playmaker is in the remaining players
  const lastInGame = remainingPlayers.some((player) => player.index === game.lastPlaymaker)
  const roundLeaderIndex = ((lastInGame) ? game.lastPlaymaker : game.backupNext)

  // Whether we're spectating (either we're not in the game, or we are and we finished)
  const spectating = (!playerId || thisPlayer?.finishedRank) && game.settings.spectating

  /** Game instance to check whether a combo is playable. */
  const gameInstance = new Game(game.players.length, game.settings.rules, game)
  /** Set of emojis to be randomly chosen from for player icons. */
  const playerEmojis = PLAYER_EMOJIS[game.id.length % PLAYER_EMOJIS.length]

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

  /* Given index of a player, return the position it should be displayed in relative to the
   * user's player index - the user's player should always be displayed at the bottom, then the
   * rest of the players should be displayed in order, clockwise.
   * Directions: 0 = bottom, 1 = left, 2 = top, 3 = right.
  */
  function indexToPosition(index: number) {
    // for spectating
    if (!thisPlayer)
      return index
    else if (index >= thisPlayer.index)
      return index - thisPlayer.index
    else
      return index + game.players.length - thisPlayer.index
  }

  return (
    <>
      {isDesktop ? (
        <Box>
          <Text>
            Turn order goes clockwise!
          </Text>

          {/* Centered combo */}
          <Tooltip label="Current combo">
            <Box
              {...(remainingPlayers.length !== 1 && fixedComboStyles)}
              display="inline-block"
              zIndex={2}
              width="auto"
              borderRadius="lg"
              p={4}
            >
              <Stack direction="row" spacing={cardSpacing}>
                {game.combo.map((card, index) =>
                  <CardImage key={index} card={card} />
                )}
                {!game.combo.length &&
                  <CardImage card="" />
                }
              </Stack>
            </Box>
          </Tooltip>

          {/* game */}
          <Box>
            {game.players.sort((a, b) => a.index - b.index).map((player) =>
              <Box key={player.index}>
                {(spectating || player.index !== thisPlayer?.index) && (
                  <OpponentHand
                    game={game}
                    position={indexToPosition(player.index)}
                    player={player}
                    roundLeaderIndex={roundLeaderIndex}
                  />
                )}

                {/* Player Info */}
                <Tooltip
                  label={
                    <Text textAlign="center">
                      {playerEmojis[player.index]} {player.name} | {player.hand.length} cards | {player.points} points
                      <br />
                      {game.currentPlayer?.name === player.name && <p>Current turn</p>}
                      {player.index === roundLeaderIndex && <p>Round leader</p>}
                      {game.passedPlayers.includes(player.index) && 'Passed'}
                    </Text>
                  }
                >
                  <Box
                    position="fixed"
                    {...INFO_STYLES[indexToPosition(player.index)]}
                    textAlign="center"
                    backgroundColor={game.currentPlayer?.name === player.name ? 'green.400' : 'blue.50'}
                    borderRadius="md"
                    shadow="md"
                    _hover={{ cursor: 'default' }}
                    p={2}
                  >
                    <Text fontWeight="bold">
                      {playerEmojis[player.index]} {player.name}
                      <br />
                      {player.index === roundLeaderIndex && '🎩'}
                      {game.passedPlayers.includes(player.index) && '⏭️'}
                      {RANK_EMOJIS[player.finishedRank]}
                    </Text>
                  </Box>
                </Tooltip>
              </Box>
            )}

            {thisPlayer && (
              <Box>
                <PlayerHand
                  hand={thisPlayer.hand}
                  comboToPlay={comboToPlay}
                  cardSpacing={cardSpacing}
                  isDesktop={isDesktop}
                  handleClick={handleClick}
                >
                  {/* Current turn: Display actions */}
                  {(game.currentPlayer && game.currentPlayer.id === thisPlayer.id) && remainingPlayers.length !== 1 &&
                    <Alert
                      backgroundColor="blackAlpha.800"
                      variant="solid"
                      position="fixed"
                      bottom="8em"
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
                        <Button
                          onClick={handlePlay}
                          colorScheme="green"
                          isDisabled={!gameInstance.can_play(Array.from(comboToPlay))}
                          me={2}
                        >
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
            )}
          </Box>

          {/* Display end button for everyone once the game is over, even if they still have cards in hand */}
          {remainingPlayers.length === 1 &&
            <Box mt={3}>
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
        </Box>
      ) : (
        <Box>
          Current combo:
          <Stack direction="row" spacing={cardSpacing}>
            {game.combo.map((card, index) =>
              <CardImage key={index} card={card} />
            )}
            {!game.combo.length &&
              <CardImage card="" />
            }
          </Stack>

          {/* game */}
          <Box my={5} py={2}>
            Player hands:
            {game.players.sort((a, b) => a.index - b.index).map((player) =>
              <Box key={player.index}>
                <Text
                  fontWeight={(game.currentPlayer?.name === player.name) ? 'bold' : ''}
                  color={(player.index === roundLeaderIndex) ? 'blue.500' : ''}
                  title={(player.index === roundLeaderIndex) ? 'Round leader' : ''}
                >
                  {player.name} {thisPlayer?.name === player.name && '(You)'}: {player.hand.length} cards {RANK_EMOJIS[player.finishedRank]}
                  {game.passedPlayers.includes(player.index) && '⏭️'}
                </Text>
                {player.name !== thisPlayer?.name &&
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

            {thisPlayer && (
              <Box mt={4}>
                Your hand ({thisPlayer.hand.length} cards):
                <br />
                <PlayerHand hand={thisPlayer.hand} comboToPlay={comboToPlay} cardSpacing={cardSpacing} isDesktop={isDesktop} handleClick={handleClick}>
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
                        <Button
                          onClick={handlePlay}
                          colorScheme="green"
                          isDisabled={!gameInstance.can_play(Array.from(comboToPlay))}
                          me={2}
                        >
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
            )}
          </Box>

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
        </Box>
      )}
    </>
  )
}
