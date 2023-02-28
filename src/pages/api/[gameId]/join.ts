import type { NextApiRequest, NextApiResponse } from 'next'

import pusher from '../../../lib/pusher'

export interface Player {
  id: number,
  name: string,
  cookie: string
}

// GET /api/[gameId]/join
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameId } = req.query
  const { name } = req.body

  const newPlayer = {
    id: 1,
    name,
    cookie: 'asdf',
  }

  await pusher.trigger(String(gameId), 'new-player', { player: newPlayer })
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
