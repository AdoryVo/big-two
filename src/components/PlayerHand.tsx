import { Box, Button, Grid, GridItem, Stack } from '@chakra-ui/react';
import { handDealVariants } from '@utils/card-motion';
import { useHandDealIntro } from '@utils/hooks/useHandDealIntro';
import { motion } from 'framer-motion';
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
  /** Bumps when a new hand is dealt so entrance animations replay. Keys use slot index so duplicate card strings (multi-deck) stay unique. */
  dealStamp?: string;
  /** When true (e.g. tab refresh on same deal), skip deal stagger. */
  skipDealIntro?: boolean;
}

export default function PlayerHand({
  hand,
  children,
  comboToPlay,
  cardSpacing,
  isTabletAndAbove,
  handleClick,
  dealStamp = '',
  skipDealIntro = false,
}: Props) {
  const playDealIntro = useHandDealIntro(skipDealIntro, dealStamp, hand.length);
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
                <motion.div
                  key={`${dealStamp}::${index}::${card}`}
                  custom={index}
                  variants={handDealVariants}
                  initial={playDealIntro ? 'hidden' : false}
                  animate="show"
                  style={{
                    display: 'inline-block',
                    ...overlapStyles(index, cardSpacing),
                  }}
                >
                  <Box onMouseDown={() => handleClick(card + index)}>
                    <CardImage
                      card={card}
                      selected={comboToPlay.has(card + index)}
                    />
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </Box>
        </Box>
      ) : (
        <Box>
          <Stack direction="row">
            {hand.map((card, index) => (
              <motion.div
                key={`${dealStamp}::${index}::${card}`}
                custom={index}
                variants={handDealVariants}
                initial={playDealIntro ? 'hidden' : false}
                animate="show"
                style={{
                  display: 'inline-block',
                  ...overlapStyles(index, cardSpacing),
                }}
              >
                <Box onMouseDown={() => handleClick(card + index)}>
                  <CardImage
                    card={card}
                    selected={comboToPlay.has(card + index)}
                  />
                </Box>
              </motion.div>
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
                <GridItem key={`${dealStamp}::${index}::${card}`}>
                  <motion.div
                    custom={index}
                    variants={handDealVariants}
                    initial={playDealIntro ? 'hidden' : false}
                    animate="show"
                  >
                    <Box onMouseDown={() => handleClick(card + index)}>
                      <CardImage
                        card={card}
                        selected={comboToPlay.has(card + index)}
                        style={{ transform: '' }}
                      />
                    </Box>
                  </motion.div>
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
