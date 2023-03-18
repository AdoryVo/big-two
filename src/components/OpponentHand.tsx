import { Box, Stack, Text } from '@chakra-ui/react'
import { Player } from '@prisma/client'

import CardImage from './CardImage'

const HAND_ROTATIONS = [
  '0', '90', '180', '270',
]

const HAND_STYLES = [
  {
    bottom: '0em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    left: '1em',
    transform: 'translate(0, -50%)',
  },
  {
    top: '0em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    right: '-7em',
    transform: 'translate(0, -50%)',
  },
]

const INFO_STYLES = [
  {
    bottom: '6em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    left: '7em',
    transform: 'translate(0, -50%)',
  },
  {
    top: '6em',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  {
    top: '50%',
    right: '7em',
    transform: 'translate(0, -50%)',
  },
]

interface Props {
  position: number,
  player: Player
}

export default function OpponentHand({ position, player }: Props) {
  return (
    <Box>
      <Box
        position="fixed"
        {...HAND_STYLES[position]}
      >
        <Stack
          direction={position % 2 ? 'column' : 'row'}
          spacing={position % 2 ? '-4.5em' : '-2em'}
        >
          {player.hand.map((card, cardIndex) =>
            <Box key={cardIndex}>
              <CardImage card={card}
                style={{
                  width: '3em',
                  height: '5em',
                  transform: `rotate(${HAND_ROTATIONS[position]}deg)`,
                }}
              />
            </Box>
          )}
        </Stack>
      </Box>
      <Box
        position="fixed"
        {...INFO_STYLES[position]}
        textAlign="right"
        backgroundColor="blue.100"
        borderRadius="md"
        p={2}
      >
        <Text fontWeight="bold">
          👲 {player.name}
        </Text>
      </Box>
    </Box>
  )
}
