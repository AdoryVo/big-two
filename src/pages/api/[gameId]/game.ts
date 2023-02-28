import { get } from '@vercel/edge-config'
import ky from 'ky'
import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import type Player from '../../../lib/game/Player'

interface GamesStore {
  [gameId: string]: Game
}

export const games: GamesStore = { }

export function getHandObjects(player: Player) {
  if (!player.hand) {
    return player
  }

  return player.hand?.map((card) => {
    return {
      rank: card.rank.abbrn,
      suit: card.suit.name,
    }
  })
}

// GET, POST /api/[gameId]/game
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  if (req.method === 'GET') { // GET: Get game
    let game: Game|undefined = games[id]

    // TODO: Temporary fix for early request
    if (id === 'undefined') {
      return res.status(200).json({})
    }

    if (process.env.VERCEL) {
      game = await get(id)
    }

    if (!game && process.env.NODE_ENV === 'development') {
      games[id] = new Game(0)
      return res.status(201).json(game)
    }
    if (!game) {
      return res.status(404).end()
    }

    const data = { players: game.players.map(getHandObjects) }

    return res.status(200).json(data)
  } else if (req.method === 'POST') { // POST: Create game
    // If game exists, do not override
    if (games[id]) {
      return res.status(404).end()
    }

    const game = new Game(0)
    games[id] = game

    if (process.env.VERCEL) {
      await ky.patch('https://api.vercel.com/v1/edge-config/ecfg_pq909usfi5fkeaj0pkw9mtwwxw39/items',
        {
          json: {
            items: [
              { operation: 'create', key: id, value: { players: game.players.map(getHandObjects) } },
            ],
          },
          headers: { Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}` },
        })
    }

    return res.status(200).end()
  }
}
