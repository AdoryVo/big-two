import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSlug } from 'random-word-slugs';

import prisma from '@utils/prisma';
import supabase, { ChannelName, Event } from '@utils/supabase';

// POST /api/lobby
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = req.body;

  const lobby = await prisma.game.create({
    data: {
      id: generateSlug(),
      settings: { create: data },
    },
  });

  const channel = supabase.channel(ChannelName.Lobbies);
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

  res.status(201).json(lobby);
}
