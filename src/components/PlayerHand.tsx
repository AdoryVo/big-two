import { Box, Button, Grid, GridItem, HStack, Stack } from '@chakra-ui/react';
import { useState } from 'react';

import { overlapStyles } from './ActiveGame';
import CardImage from './CardImage';

function DeselectAllButton({
  onDeselectAll,
  isDisabled,
}: {
  onDeselectAll: () => void;
  isDisabled: boolean;
}) {
  return (
    <Button
      size="sm"
      colorScheme="orange"
      variant="solid"
      fontWeight="bold"
      boxShadow="lg"
      borderRadius="full"
      isDisabled={isDisabled}
      _hover={{ boxShadow: 'xl', backgroundColor: 'orange.600' }}
      _disabled={{ opacity: 0.5, cursor: 'not-allowed', boxShadow: 'sm' }}
      transition="background-color 0.15s ease,box-shadow 0.15s ease, transform 0.15s ease"
      onClick={(e) => {
        e.preventDefault();
        onDeselectAll();
      }}
    >
      Deselect all
    </Button>
  );
}

interface Props {
  hand: string[];
  children?: React.ReactNode;
  comboToPlay: Set<string>;
  cardSpacing: string;
  isTabletAndAbove: boolean;
  handleClick: (card: string) => void;
  onDeselectAll?: () => void;
}

export default function PlayerHand({
  hand,
  children,
  comboToPlay,
  cardSpacing,
  isTabletAndAbove,
  handleClick,
  onDeselectAll,
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
            {onDeselectAll && (
              <HStack
                justify="flex-end"
                px={1}
                mb="1.75em"
                position="relative"
                zIndex={3}
              >
                <DeselectAllButton
                  onDeselectAll={onDeselectAll}
                  isDisabled={comboToPlay.size === 0}
                />
              </HStack>
            )}
            <Stack direction="row" position="relative" zIndex={1}>
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
          {onDeselectAll && (
            <Box mb="1.75em" position="relative" zIndex={2}>
              <DeselectAllButton
                onDeselectAll={onDeselectAll}
                isDisabled={comboToPlay.size === 0}
              />
            </Box>
          )}
          <Stack direction="row" position="relative" zIndex={1}>
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
