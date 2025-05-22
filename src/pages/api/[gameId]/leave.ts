import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@utils/prisma';
import supabase, { Event } from '@utils/supabase';

// PATCH /api/[gameId]/leave
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  const game = await prisma.game.findUnique({
    where: { id },
  });

  const playerId = req.cookies[game?.id ?? ''];
  if (!playerId || !game) {
    res.status(404).end();
    return;
  }

  await prisma.player.delete({ where: { id: playerId } });

  const channel = supabase.channel(id, {
    config: {
      broadcast: {
        self: true,
      },
    },
  });
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

  // Remove cookie
  res.setHeader(
    'Set-Cookie',
    `${game.id}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  );

  res.status(200).end();
}
