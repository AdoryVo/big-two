import { Box, Stack } from '@chakra-ui/react';
import type { Player } from '@prisma/client';

import CardImage from './CardImage';

const HAND_ROTATIONS = ['0', '90', '180', '270'];

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
];

interface Props {
  position: number;
  player: Player;
  roundLeaderIndex: number | null;
}

export default function OpponentHand({ position, player }: Props) {
  const spacing = {
    marginInlineStart: position % 2 ? '0' : '-3.4em',
    marginTop: position % 2 ? '-6.7em' : '0',
  };

  return (
    <Box>
      <Box position="fixed" {...HAND_STYLES[position]}>
        <Stack direction={position % 2 ? 'column' : 'row'}>
          {player.hand.map((card, cardIndex) => (
            <Box key={card} {...(cardIndex === 0 ? {} : spacing)}>
              <CardImage
                card={card}
                style={{
                  width: '5em',
                  height: '7em',
                  transform: `rotate(${HAND_ROTATIONS[position]}deg)`,
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
