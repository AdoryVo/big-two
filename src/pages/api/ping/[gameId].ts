import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

// GET /api/ping/[gameId]
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameId } = req.query
  await pusher.trigger(String(gameId), 'pong', { message: 'hello world' })
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
