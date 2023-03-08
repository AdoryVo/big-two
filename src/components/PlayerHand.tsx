import {
  Box, Button, Grid, GridItem, Stack
} from '@chakra-ui/react'
import { useState } from 'react'

import CardImage from './CardImage'

interface Props {
  hand: string[],
  children?: React.ReactNode,
  comboToPlay: Set<string>,
  handleClick: (card: string) => void
}

export default function PlayerHand({
  hand, children, comboToPlay, handleClick,
}: Props) {
  const [toggleGrid, setToggleGrid] = useState(false)

  return (
    <>
      <Stack direction="row" spacing="-5.5em">
        {hand.map((card, index) =>
          <Box key={index} onClick={() => handleClick(card)}>
            <CardImage
              card={card}
              border={comboToPlay.has(card) ? 'thin solid #68D391' : 'thin solid black'}
              value={comboToPlay.has(card) ? 'translate(0, -1em)' : ''}
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
                <CardImage card={card} border={comboToPlay.has(card) ? 'thin solid #68D391' : 'thin solid black'} />
              </Box>
            </GridItem>
          )}
        </Grid>
      }
    </>
  )
}
