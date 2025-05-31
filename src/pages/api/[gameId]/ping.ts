import type { NextApiRequest, NextApiResponse } from 'next';

import pusher from '@utils/pusher';
import { Event } from '@utils/pusher';

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
