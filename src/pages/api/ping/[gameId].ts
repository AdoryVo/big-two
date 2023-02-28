import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

// GET /api/ping/[gameId]
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameId } = req.query
  pusher.trigger(String(gameId), 'pong', { message: 'hello world' }).then((value) => {
    console.log(value)
  }).catch((err) => {
    console.error(err)
  })

  return res.status(200).end()
}
