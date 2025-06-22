import prisma from '@utils/prisma';
import pusher, { Event } from '@utils/pusher';
import type { NextApiRequest, NextApiResponse } from 'next';

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

  await pusher.trigger(id, Event.LobbyUpdate, null).catch((err) => {
    console.error(err);
  });

  res.status(200).end();
}
