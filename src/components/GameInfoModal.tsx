import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import type { GameWithPlayers } from '@utils/prisma';
import GameInfo from './GameInfo';

interface Props {
  game: GameWithPlayers;
}

export default function GameInfoModal({ game }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        backgroundColor="#FFD100"
        shadow="1px 1px black"
        position={{ md: 'fixed' }}
        top={{ md: '4.5em' }}
        right={{ md: '1em' }}
        onClick={onOpen}
      >
        Game Info
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Game Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GameInfo game={game} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
