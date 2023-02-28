import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import pusher from '../../../lib/pusher'
import { games } from './game'

// GET /api/[gameId]/end
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const game = new Game(0)
  games[id] = game

  await pusher.trigger(id, 'end-game', {})
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
