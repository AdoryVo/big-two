import type { NextApiRequest, NextApiResponse } from 'next'

export interface TempGame {
  hand: string[]
}

interface TempGames {
  [gameId: string]: TempGame
}

const games: TempGames = { '0e7c8f40-1adc-4b82-9b18-74b09a326326': { hand: ['a5'] } }

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
      games[id] = { hand: ['a5'] }
      return res.status(201).json(game)
    }
    if (!game) {
      return res.status(404).end()
    }

    return res.status(200).json(game)
  } else if (req.method === 'POST') { // POST: Create game
    // If game exists, do not override
    if (games[id]) {
      return res.status(404).end()
    }

    games[id] = { hand: ['a5'] }

    return res.status(200).end()
  }
}
