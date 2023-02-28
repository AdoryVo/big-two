import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

// GET /api/ping
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  pusher.trigger('all', 'pong', { message: 'hello world' }).then((value) => {
    console.log(value)
  }).catch((err) => {
    console.error(err)
  })

  return res.status(200).end()
}
