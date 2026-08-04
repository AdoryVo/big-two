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
import type { Action, ActionData } from '@utils/actions';
import type { GameWithPlayers } from '@utils/prisma';
import GameInfo from './GameInfo';

interface Props {
  game: GameWithPlayers;
  handleAction?: (action: Action, data?: ActionData) => void;
  playerId?: string;
}

export default function GameInfoModal({ game, handleAction, playerId }: Props) {
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
            <GameInfo
              game={game}
              handleAction={handleAction}
              playerId={playerId}
            />
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
