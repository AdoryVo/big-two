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
import ky from 'ky';

import LobbyForm from './LobbyForm';

import type { GameWithPlayers } from '@utils/prisma';

interface Props {
  game: GameWithPlayers;
  handleSubmit?: (body: object) => void;
}

export default function EditLobby({ game, handleSubmit }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const gameInProgress = Boolean(game.currentPlayer);

  function submitThenClose(body: object) {
    if (handleSubmit) {
      handleSubmit(body);
      onClose();
    } else {
      ky.put(`/api/${game.id}/settings`, { json: body }).then(onClose);
    }
  }

  return (
    <>
      <Button
        colorScheme="gray"
        mt={4}
        isDisabled={gameInProgress}
        onClick={onOpen}
      >
        Edit rules
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Lobby</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LobbyForm submitForm={submitThenClose} game={game} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" type="submit" form="lobbyForm" me={2}>
              Submit
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
