import {
  Box,
  Button, type ButtonProps,
  Divider,
  FormControl, FormLabel,
  Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  Radio, RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { startCase } from 'lodash'

import CardImage from './CardImage'

import { useStore } from '@utils/hooks/useStore'
import {
  COLOR_SCHEME_STYLES,
  THEME_OPTIONS,
} from '@utils/theme'

interface Props {
  props?: ButtonProps,
}

export default function Preferences({ props }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [theme, updateTheme] = useStore((state) => [state.theme, state.updateTheme])

  return (
    <>
      <Button colorScheme="purple" shadow="1px 1px black" mb={4} {...props} onClick={onOpen}>
        Preferences
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Theme</FormLabel>

              <RadioGroup onChange={(value) => updateTheme({ ...theme, cardTheme: value })} value={theme.cardTheme}>
                <Stack direction="row" gap={2}>
                  {THEME_OPTIONS.cardTheme.map((cardTheme) =>
                    <Box key={cardTheme} textAlign="center">
                      <Radio value={cardTheme}>
                        <CardImage card="3;clubs" theme={cardTheme} style={{ width: '5em', height: '7em', marginRight: '0' }} />
                      </Radio>
                      <Text ps={6}>
                        {startCase(cardTheme)}
                      </Text>
                    </Box>
                  )}
                </Stack>
              </RadioGroup>
            </FormControl>

            <Divider my={5} />

            <FormControl>
              <FormLabel>Color Scheme</FormLabel>

              <RadioGroup onChange={(value) => updateTheme({ ...theme, colorScheme: value })} value={theme.colorScheme}>
                <Stack direction="row" gap={2}>
                  {THEME_OPTIONS.colorScheme.slice(0, 4).map((colorScheme) =>
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
                <Stack direction="row" gap={2} mt={4}>
                  {THEME_OPTIONS.colorScheme.slice(4).map((colorScheme) =>
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
