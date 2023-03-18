import {
  Button,
  type ButtonProps,
  Divider,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table, TableContainer, Tbody, Td,
  Text,
  Th, Thead, Tr,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react'

import GameInfo from './GameInfo'

import type { GameWithPlayers } from '@utils/prisma'

interface Props {
  game: GameWithPlayers
  gameInProgress: boolean
}

export default function GameInfoModal({ game, gameInProgress }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button
        backgroundColor="#FFD100"
        onClick={onOpen}
        position={{ md: 'absolute' }}
        top={{ md: '4.5em' }}
        right={{ md: '1em' }}
      >
        Game Info
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GameInfo game={game} gameInProgress={gameInProgress} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
