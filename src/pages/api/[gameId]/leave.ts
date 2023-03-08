import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// PATCH /api/[gameId]/leave
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

  const playerId = req.cookies.playerId
  if (!playerId || !game) {
    return res.status(404).end()
  }

  await prisma.player.delete({ where: { id: playerId } })

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  // Remove cookie
  res.setHeader('Set-Cookie', 'playerId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

  return res.status(200).end()
}
