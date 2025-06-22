import prisma from '@utils/prisma';
import pusher, { Event } from '@utils/pusher';
import type { NextApiRequest, NextApiResponse } from 'next';

// PUT /api/[gameId]/settings
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);
  const data = req.body;

  const game = await prisma.game.update({
    where: { id },
    data: { settings: { update: data } },
  });

  if (!game) {
    res.status(404).end();
    return;
  }

  await pusher.trigger(id, Event.LobbyUpdate, null).catch((err) => {
    console.error(err);
  });

  res.status(204).end();
}
