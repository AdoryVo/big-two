import { Box, Button, Grid, GridItem, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { overlapStyles } from './ActiveGame';
import CardImage from './CardImage';

interface Props {
  hand: string[];
  children?: React.ReactNode;
  comboToPlay: Set<string>;
  cardSpacing: string;
  isTabletAndAbove: boolean;
  handleClick: (card: string) => void;
}

export default function PlayerHand({
  hand,
  children,
  comboToPlay,
  cardSpacing,
  isTabletAndAbove,
  handleClick,
}: Props) {
  const [toggleGrid, setToggleGrid] = useState(false);

  return (
    <>
      {isTabletAndAbove ? (
        <Box>
          {/* Fixed hand */}
          <Box
            position="fixed"
            bottom="-1.5em"
            left="50%"
            transform="translate(-50%, 0)"
            zIndex={2}
            width={{ base: '95%', md: 'auto' }}
          >
            <Stack direction="row">
              {hand.map((card, index) => (
                <Box
                  // biome-ignore lint/suspicious/noArrayIndexKey: Cards have no unique ID's
                  key={card + index}
                  onMouseDown={() => handleClick(card + index)}
                  {...overlapStyles(index, cardSpacing)}
                >
                  <CardImage
                    card={card}
                    selected={comboToPlay.has(card + index)}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      ) : (
        <Box>
          <Stack direction="row">
            {hand.map((card, index) => (
              <Box
                // biome-ignore lint/suspicious/noArrayIndexKey: Cards have no unique ID's
                key={card + index}
                onMouseDown={() => handleClick(card + index)}
                {...overlapStyles(index, cardSpacing)}
              >
                <CardImage
                  card={card}
                  selected={comboToPlay.has(card + index)}
                />
              </Box>
            ))}
          </Stack>

          <Button
            colorScheme="orange"
            my={3}
            onClick={() => setToggleGrid(!toggleGrid)}
          >
            Toggle hand grid view
          </Button>

          {toggleGrid && (
            <Grid templateColumns="repeat(7, 1fr)" gap={0.5}>
              {hand.map((card, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Cards have no unique ID's
                <GridItem key={card + index}>
                  <Box onMouseDown={() => handleClick(card + index)}>
                    <CardImage
                      card={card}
                      selected={comboToPlay.has(card + index)}
                      style={{ transform: '' }}
                    />
                  </Box>
                </GridItem>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {children}
    </>
  );
}
