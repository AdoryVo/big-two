import {
  Button,
  Checkbox, CheckboxGroup,
  Grid, GridItem,
  ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader
} from '@chakra-ui/react'
import { Player } from '@prisma/client'
import { useState } from 'react'

import { Action, ActionData } from '../pages/game/[gameId]'
import CardImage from './CardImage'

interface Props {
  player: Player,
  onClose: () => void,
  handleAction: (action: Action, data?: ActionData) => void
}

export default function PlayComboModal({ player, onClose, handleAction }: Props) {
  const [comboToPlay, setComboToPlay] = useState<string[]>([])

  return (
    <ModalContent>
      <ModalHeader>Play a combo</ModalHeader>
      <ModalCloseButton />

      <ModalBody>
        <CheckboxGroup colorScheme="green" onChange={(combo) => setComboToPlay(combo.map(String))}>
          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            {player.hand.map((card, index) =>
              <GridItem key={index}>
                <Checkbox value={card}>
                  <CardImage card={card} />
                </Checkbox>
              </GridItem>
            )}
          </Grid>
        </CheckboxGroup>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="green" me={2} onClick={() => handleAction(Action.Play, { comboToPlay, onClose })}>
          Submit
        </Button>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}
