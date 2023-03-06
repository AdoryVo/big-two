import {
  Box, Button,
  Checkbox, CheckboxGroup,   Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { useState } from 'react'

import { GameWithPlayers } from '../lib/prisma'
import { Action, ActionData } from '../pages/game/[gameId]'

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

          Turn order: {game.players.map((player) => player.name).join(', ')}
          <br />

          Passed players: {passedPlayers.map((player) => player.name).join(', ')}
          <br />
          <br />

          Your hand:
          <br />
          {player.hand.join(', ')}

          {/* Current turn: Display actions */}
          {game.currentPlayer?.id === player.id &&
            <Box>
              <Heading size="md" my={4}>Take your action!</Heading>
              <Button onClick={onOpen} colorScheme="green" me={2}>
                Play a combo
              </Button>
              <Button onClick={() => handleAction(Action.Pass)} colorScheme="blue">
                Pass
              </Button>
            </Box>
          }

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Play a combo</ModalHeader>
              <ModalCloseButton />

              <ModalBody>
                <CheckboxGroup colorScheme="green" onChange={(combo) => setComboToPlay(combo.map(String))}>
                  <VStack align="start">
                    {player.hand.map((card) =>
                      <Checkbox key={card} value={card}>{card}</Checkbox>
                    )}
                  </VStack>
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

      <Button onClick={() => handleAction(Action.End)} colorScheme="red" my={4} me={2}>
        End Game
      </Button>
    </>
  )
}
