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
import type { Game } from '@prisma/client';
import ky from 'ky';
import { useRouter } from 'next/router';

import LobbyForm from './LobbyForm';

interface Props {
  closeToast?: () => void;
}

export default function CreateLobby({ closeToast }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  function onClick() {
    // Close toasts from home page if they are open
    if (closeToast) {
      closeToast();
    }

    onOpen();
  }

  function submitForm(body: object) {
    ky.post('/api/lobby', { json: body })
      .json<Game>()
      .then((lobby) => {
        router.push({
          pathname: '/game/[gameId]',
          query: { gameId: lobby.id },
        });
      });
  }

  return (
    <>
      <Button
        colorScheme="green"
        shadow="1px 1px black"
        mb={4}
        me={2}
        onClick={onClick}
      >
        Create lobby
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Lobby</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LobbyForm submitForm={submitForm} />
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
