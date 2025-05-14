import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@utils/prisma';
import supabase, { ChannelName, Event } from '@utils/supabase';

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

  const gameChannel = supabase.channel(id);
  gameChannel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    gameChannel
      .send({
        type: 'broadcast',
        event: Event.LobbyUpdate,
      })
      .catch((err) => void console.error(err));
  });

  const lobbyChannel = supabase.channel(ChannelName.Lobbies);
  lobbyChannel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    lobbyChannel
      .send({
        type: 'broadcast',
        event: Event.LobbyUpdate,
      })
      .catch((err) => void console.error(err));
  });

  res.status(204).end();
}
