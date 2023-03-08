import {
  Box,
  Button,
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Radio, RadioGroup,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import { startCase } from 'lodash'
import { useEffect, useState } from 'react'

import {
  getTheme, setTheme as setGlobalTheme, Theme, Themes
} from '../lib/theme'
import CardImage from './CardImage'

export default function Preferences() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [theme, setTheme] = useState<string>(Theme.Classic)

  useEffect(() => {
    setTheme(getTheme())
  }, [setTheme])

  function handleChangeTheme(value: string) {
    setGlobalTheme(value)
    setTheme(value)
  }

  return (
    <>
      <Button colorScheme="facebook" mb={4} me={2} onClick={onOpen}>
        Preferences
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading size="md">Theme</Heading>

            <RadioGroup onChange={handleChangeTheme} value={theme}>
              <Stack direction="row">
                {Themes.map((theme) =>
                  <Radio key={theme} value={theme}>
                    <Box textAlign="center" pt={5}>
                      <CardImage card="3;clubs" theme={theme} style={{ width: '5em', marginRight: '0' }} />
                      <br />
                      {startCase(theme)}
                    </Box>
                  </Radio>
                )}
              </Stack>
            </RadioGroup>
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
