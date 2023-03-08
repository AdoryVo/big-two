import {
  Button,
  Checkbox, CheckboxGroup,
  FormControl, FormLabel,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { Game } from '@prisma/client'
import { useFormik } from 'formik'
import ky from 'ky'
import { sum } from 'lodash'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { ALL_RULES, describe } from '../lib/game/Rules'
import Rules from '../lib/game/Rules'

export default function CreateLobby() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [rules, setRules] = useState<number[]>([Rules.SUIT_ORDER_ALPHA, Rules.STRAIGHTS_WRAP_AROUND])

  const formik = useFormik({
    initialValues: {
      spectating: true,
      playerMax: 4,
    },
    onSubmit: (values) => {
      const body = {
        ...values,
        rules: sum(rules),
      }
      ky.post('api/lobby', { json: body }).json<Game>().then((lobby) => {
        router.push({ pathname: '/game/[gameId]', query: { gameId: lobby.id } })
      })
    },
  })

  return (
    <>
      <Button colorScheme="green" mb={4} me={2} onClick={onOpen}>
        Create Lobby
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Lobby</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="createLobbyForm" onSubmit={formik.handleSubmit}>
              <FormControl mb={3}>
                <FormLabel>Rules</FormLabel>
                <CheckboxGroup
                  onChange={(values) => setRules(values.map(Number))}
                  value={rules}
                  colorScheme="green"
                >
                  <VStack alignItems="start">
                    {ALL_RULES.map((rule) =>
                      <Checkbox key={rule} value={rule} isDisabled={rule === Rules.SUIT_ORDER_ALPHA}>
                        {describe(rule)}
                      </Checkbox>
                    )}
                  </VStack>
                </CheckboxGroup>
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Max players</FormLabel>
                <NumberInput
                  name="playerMax"
                  defaultValue={formik.values.playerMax}
                  onChange={(v) => formik.values.playerMax = parseInt(v)}
                  maxW={20}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Checkbox
                name="spectating"
                onChange={formik.handleChange}
                isChecked={formik.values.spectating}
              >
                Allow spectating
              </Checkbox>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              type="submit"
              form="createLobbyForm"
              me={2}>
              Submit
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
