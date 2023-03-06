import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// PATCH /api/[gameId]/end
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const updatedGame = await prisma.game.update({
    where: { id },
    data: {
      combo: { set: [] },
      lowestCard: null,
      players: { deleteMany: {} },
      currentPlayer: { disconnect: true },
      passedPlayers: { set: [] },
      lastPlaymaker: null,
      backupNext: null,
    },
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  await pusher.trigger(id, Event.EndGame, updatedGame)
    .catch((err) => {
      console.error(err)
    })

  // Remove cookie
  res.setHeader('Set-Cookie', 'playerId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

  return res.status(200).end()
}
