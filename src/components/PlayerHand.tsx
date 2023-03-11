import {
  Box, Button, Grid, GridItem, Stack,
} from '@chakra-ui/react'
import { useState } from 'react'

import CardImage from './CardImage'

interface Props {
  hand: string[],
  children?: React.ReactNode,
  comboToPlay: Set<string>,
  cardSpacing: string,
  handleClick: (card: string) => void
}

export default function PlayerHand({
  hand, children, comboToPlay, cardSpacing, handleClick,
}: Props) {
  const [toggleGrid, setToggleGrid] = useState(false)

  return (
    <>
      <Stack direction="row" spacing={cardSpacing}>
        {hand.map((card, index) =>
          <Box key={index} onClick={() => handleClick(card)}>
            <CardImage
              card={card}
              selected={comboToPlay.has(card)}
            />
          </Box>
        )}
      </Stack>

      {children}

      <Button colorScheme="orange" my={3} onClick={() => setToggleGrid(!toggleGrid)}>
        Toggle hand grid view
      </Button>

      {toggleGrid &&
        <Grid templateColumns="repeat(7, 1fr)" gap={0}>
          {hand.map((card, index) =>
            <GridItem key={index}>
              <Box onClick={() => handleClick(card)}>
                <CardImage card={card} selected={comboToPlay.has(card)} style={{ transform: '' }} />
              </Box>
            </GridItem>
          )}
        </Grid>
      }
    </>
  )
}
