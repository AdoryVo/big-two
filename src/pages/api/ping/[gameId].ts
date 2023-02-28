import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

// GET /api/ping/[gameId]
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameId } = req.query
  pusher.trigger(String(gameId), 'pong', { message: 'hello world' })

  return res.status(200).end()
}
