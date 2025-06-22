import pusher, { Event } from '@utils/pusher';
import type { NextApiRequest, NextApiResponse } from 'next';

// GET /api/[gameId]/ping
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  await pusher.trigger(id, Event.Pong, null).catch((err) => {
    console.error(err);
  });

  res.status(200).end();
}
