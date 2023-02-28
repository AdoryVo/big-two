import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import pusher from '../../../lib/pusher'
import { games } from './game'
import { getHandObjects } from './game'

// GET /api/[gameId]/end
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const game = new Game(0)
  games[id] = game

  const data = { players: game.players.map(getHandObjects) }

  if (process.env.VERCEL) {
    await ky.patch('https://api.vercel.com/v1/edge-config/ecfg_pq909usfi5fkeaj0pkw9mtwwxw39/items',
      {
        json: {
          items: [
            { operation: 'update', key: id, value: data },
          ],
        },
        headers: { Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}` },
      })
  }

  await pusher.trigger(id, 'end-game', data)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
