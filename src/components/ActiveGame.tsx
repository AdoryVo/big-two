import {
  Box,
  Button,
  Checkbox, CheckboxGroup,
  Grid, GridItem,
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import Image from 'next/image'
import { useState } from 'react'

import { GameWithPlayers } from '../lib/prisma'
import { Action, ActionData } from '../pages/game/[gameId]'

const BASE_CARD_IMAGE_URL = 'https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/'

const RANK_NAMES: { [abbrn: string]: string } = {
  'J': 'jack',
  'Q': 'queen',
  'K': 'king',
  'A': 'ace',
}

function cardToUrl(card: string) {
  const [rank, suit] = card.split(';')

  return BASE_CARD_IMAGE_URL + [RANK_NAMES[rank] || rank, suit].join('_of_') + '.png'
}

interface Props {
  game: GameWithPlayers,
  playerId: string,
  handleAction: (action: Action, data?: ActionData) => void
}

export default function ActiveGame({ game, playerId, handleAction }: Props) {
  // For playing a hand (modal)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [comboToPlay, setComboToPlay] = useState<string[]>([])

  const player = game.players.find((player) => player.id === playerId)
  const passedPlayers = game.players.filter((_, index) => game.passedPlayers.includes(index))

  return (
    <>
      {/* Player view: current hand */}
      {player &&
        <Box my={5} py={2}>
          <Heading size="md" mb={2}>{game.currentPlayer?.name}&apos;s Turn</Heading>

          Current combo: {game.combo.join(' ')}
          <br />

          Turn order: {game.players.sort((a, b) => a.index - b.index).map((player) => player.name).join(', ')}
          <br />

          Passed players: {passedPlayers.map((player) => player.name).join(', ')}
          <br />
          <br />

          Player hands:
          {game.players.sort((a, b) => a.index - b.index).map((player, index) =>
            <Text key={index}>
              {player.name}: {player.hand.length} cards
            </Text>
          )}
          <br />

          Your hand ({player.hand.length} cards):
          <br />
          {player.hand.map((card, index) =>
            <Image
              key={index}
              alt={card}
              src={cardToUrl(card)}
              style={{
                display: 'inline',
                width: '4em',
                height: 'auto',
                marginRight: '1em',
                border: 'medium double #68D391',
              }}
              width={50}
              height={100}
            />
          )}

          {/* Current turn: Display actions */}
          {game.currentPlayer?.id === player.id &&
            <Box>
              <Heading size="md" my={4}>Take your action!</Heading>
              <Button onClick={onOpen} colorScheme="green" me={2}>
                Play a combo
              </Button>
              <Button onClick={() => handleAction(Action.Pass)} isDisabled={!game.combo.length} colorScheme="blue">
                Pass
              </Button>
            </Box>
          }

          <Modal size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Play a combo</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <CheckboxGroup colorScheme="green" onChange={(combo) => setComboToPlay(combo.map(String))}>
                  <Grid templateColumns="repeat(5, 1fr)" gap={5}>
                    {player.hand.map((card, index) =>
                      <GridItem key={index}>
                        <Checkbox value={card}>
                          <Image
                            key={index}
                            alt={card}
                            src={cardToUrl(card)}
                            style={{
                              display: 'inline',
                              width: '4em',
                              height: 'auto',
                              marginRight: '1em',
                              border: 'medium double #68D391',
                            }}
                            width={50}
                            height={100}
                          />
                        </Checkbox>
                      </GridItem>
                    )}
                  </Grid>
                </CheckboxGroup>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" me={2} onClick={() => handleAction(Action.Play, { comboToPlay, onClose })}>
                  Submit
                </Button>
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
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

      <hr />

      <Box my={4}>
        Finished players: {game.players.filter((player) => player.finished).map((player) => player.name).join(', ')}
      </Box>

      <Button onClick={() => handleAction(Action.End)} colorScheme="red" me={2}>
        End Game
      </Button>
    </>
  )
}
