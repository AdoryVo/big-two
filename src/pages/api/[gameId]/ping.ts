import type { NextApiRequest, NextApiResponse } from 'next';

import supabase, { Event } from '@utils/supabase';

// GET /api/[gameId]/ping
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  const channel = supabase.channel(id)
  channel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    channel
      .send({
        type: 'broadcast',
        event: Event.Pong,
      })
      .catch((err) => void console.error(err));
  });

  res.status(200).end();
}
