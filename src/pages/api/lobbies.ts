import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

// GET /api/lobbies
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const games = await prisma.game.findMany({
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  return res.status(200).json(games)
}
