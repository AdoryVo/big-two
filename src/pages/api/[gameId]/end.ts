import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@utils/prisma';
import supabase, { Event } from '@utils/supabase';

// PATCH /api/[gameId]/end
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  await prisma.game.update({
    where: { id },
    data: {
      combo: { set: [] },
      lowestCard: null,
      currentPlayer: { disconnect: true },
      passedPlayers: { set: [] },
      lastPlaymaker: null,
      backupNext: null,
    },
  });

  const channel = supabase.channel(id);
  channel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    channel
      .send({
        type: 'broadcast',
        event: Event.LobbyUpdate,
      })
      .catch((err) => void console.error(err));
  });

  res.status(200).end();
}
