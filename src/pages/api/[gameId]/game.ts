import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import type Player from '../../../lib/game/Player'

interface GamesStore {
  [gameId: string]: Game
}

export const games: GamesStore = { }

export function getHandObjects(player: Player) {
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
    const game = games[id]

    // TODO: Temporary fix for early request
    if (id === 'undefined') {
      return res.status(200).json({})
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

    games[id] = new Game(0)

    return res.status(200).end()
  }
}
