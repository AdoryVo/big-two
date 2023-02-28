import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

// GET /api/ping
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await pusher.trigger('all', 'pong', { message: 'hello world' })
    .catch((err) => {
      console.error(err)
    })
  console.log(response)

  return res.status(200).end()
}
