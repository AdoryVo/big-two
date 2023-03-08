import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

// GET, DELETE /api/lobbies
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const games = await prisma.game.findMany({
      where: { settings: { public: true } },
      include: {
        players: true,
        currentPlayer: true,
        settings: true,
      },
    })

    return res.status(200).json(games)
  } else if (req.method === 'DELETE') {
    if (req.cookies.secret !== process.env.ADMIN_SECRET) {
      return res.status(401).end()
    }

    const THREE_HOURS = 3 * 60 * 60 * 1000
    const threeHoursAgo = new Date().getTime() - THREE_HOURS

    const expiredGames = await prisma.game.findMany({ where: { createdAt: { lt: new Date(threeHoursAgo) } } })
    const expiredGameIds = expiredGames.map((game) => game.id)

    // Delete players in expired games
    await prisma.player.deleteMany({ where: { gameId: { in: expiredGameIds } } })

    // Delete expired games
    await prisma.game.deleteMany({ where: { id: { in: expiredGameIds } } })

    return res.status(204).end()
  }

  return res.status(404).end()
}
