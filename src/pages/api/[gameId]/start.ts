import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import pusher from '../../../lib/pusher'
import { games } from './game'
import { getHandObjects } from './game'

// POST /api/[gameId]/start
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { players } = req.body
  const id = String(req.query.gameId)

  const game = new Game(players.length)
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

  await pusher.trigger(id, 'start-game', data)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
