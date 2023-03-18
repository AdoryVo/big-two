import {
  Box,
  Button,
  FormControl, FormLabel,
  Heading,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Radio, RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { startCase } from 'lodash'
import { useEffect, useState } from 'react'

import CardImage from './CardImage'

import {
  Theme, Themes, getTheme, setTheme as setGlobalTheme,
} from '@utils/theme'


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
      <Button colorScheme="purple" mb={4} me={2} onClick={onOpen}>
        Preferences
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel fontWeight="bold">Theme</FormLabel>

              <RadioGroup onChange={handleChangeTheme} value={theme}>
                <Stack direction="row">
                  {Themes.map((theme) =>
                    <Box key={theme} textAlign="center">
                      <Radio value={theme}>
                        <CardImage card="3;clubs" theme={theme} style={{ width: '5em', height: '7em', marginRight: '0' }} />
                      </Radio>
                      <Text ps={6}>
                        {startCase(theme)}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </RadioGroup>
            </FormControl>
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
