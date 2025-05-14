import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@utils/prisma';
import supabase, { Event } from '@utils/supabase';

// POST /api/[gameId]/join
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);
  const { name } = req.body;

  try {
    const data = { name: String(name) };
    const game = await prisma.game.update({
      where: { id },
      data: { players: { create: data } },
      include: { players: true },
    });

    if (!game) {
      res.status(404).end();
      return;
    }

    // Set cookie
    const player = game.players.find((player) => player.name === name);
    const playerId = player?.id;
    res.setHeader('Set-Cookie', `${game.id}=${playerId}; Path=/`);

    // Update lobby player list
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

    res.status(201).json(playerId);
  } catch (e) {
    res.status(422).end();
  }
}
