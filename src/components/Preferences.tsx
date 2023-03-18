import {
  Box,
  Button,
  type ButtonProps,
  Divider, FormControl,
  FormLabel,
  Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { startCase } from 'lodash'
import { useEffect, useState } from 'react'

import CardImage from './CardImage'

import { useColorScheme } from '@utils/hooks/useTheme'
import {
  COLOR_SCHEME_STYLES, CardTheme, CardThemes, ColorScheme,
  ColorSchemes, getCardTheme,
  getColorScheme, setCardTheme, setColorScheme,
} from '@utils/theme'

interface Props {
  props?: ButtonProps,
  localColorScheme: string,
  handleChangeColor: (value: string) => void
}

export default function Preferences({ props, localColorScheme, handleChangeColor }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [localCardTheme, setLocalCardTheme] = useState<string>(CardTheme.Classic)

  useEffect(() => {
    setLocalCardTheme(getCardTheme())
  }, [])

  function handleChangeTheme(value: string) {
    setCardTheme(value)
    setLocalCardTheme(value)

    window.location.reload()
  }

  return (
    <>
      <Button colorScheme="purple" mb={4} {...props} onClick={onOpen}>
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

              <RadioGroup onChange={handleChangeTheme} value={localCardTheme}>
                <Stack direction="row">
                  {CardThemes.map((theme) =>
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

            <Divider my={5} />

            <FormControl>
              <FormLabel>Color Scheme</FormLabel>

              <RadioGroup onChange={handleChangeColor} value={localColorScheme}>
                <Stack direction="row">
                  {ColorSchemes.map((colorScheme) =>
                    <Box key={colorScheme} textAlign="center">
                      <Radio value={colorScheme}>
                        <Box {...COLOR_SCHEME_STYLES[colorScheme].bg} width={10} height={10} borderRadius={10} />
                      </Radio>
                      <Text ps={6}>
                        {startCase(colorScheme)}
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
