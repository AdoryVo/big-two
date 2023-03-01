import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

// GET /api/[gameId]/game
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  if (!game) {
    return res.status(404).end()
  }

  return res.status(200).json(game)
}
