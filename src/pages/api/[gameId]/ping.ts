import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// GET /api/[gameId]/ping
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  await pusher.trigger(id, Event.Pong, null)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
