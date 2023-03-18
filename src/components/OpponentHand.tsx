import { Box, Stack } from '@chakra-ui/react'
import type { Player } from '@prisma/client'

import CardImage from './CardImage'

import type { GameWithPlayers } from '@utils/prisma'

const HAND_ROTATIONS = [
  '0', '90', '180', '270',
]

const HAND_STYLES = [
  {
    bottom: '-0.5em',
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
    right: '1em',
    transform: 'translate(0, -50%)',
  },
]

interface Props {
  game: GameWithPlayers
  position: number,
  player: Player,
  roundLeaderIndex: number | null
}

export default function OpponentHand({ game, position, player }: Props) {

  return (
    <Box>
      <Box
        position="fixed"
        {...HAND_STYLES[position]}
      >
        <Stack
          direction={position % 2 ? 'column' : 'row'}
          spacing={position % 2 ? '-5.8em' : '-3.2em'}
        >
          {player.hand.map((card, cardIndex) =>
            <Box key={cardIndex}>
              <CardImage card={card}
                style={{
                  width: '5em',
                  height: '7em',
                  transform: `rotate(${HAND_ROTATIONS[position]}deg)`,
                }}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
