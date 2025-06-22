import prisma from '@utils/prisma';
import pusher, { ChannelName, Event } from '@utils/pusher';
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSlug } from 'random-word-slugs';

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

  await pusher
    .trigger(ChannelName.Lobbies, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err);
    });

  res.status(201).json(lobby);
}
