import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// GET /api/[gameId]/leave
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const cookies = req.headers.cookie?.split('; ')
  const playerId = cookies?.find((cookie) => cookie.startsWith('playerId'))?.split('=')[1]

  if (!playerId) {
    return res.status(404).end()
  }

  await prisma.player.delete({ where: { id: playerId } })

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  if (game) {
    // Obscure ID's from spectating players
    game.players.forEach((player) => {
      player.id = ''
    })
  }

  await pusher.trigger(id, Event.LobbyUpdate, game)
    .catch((err) => {
      console.error(err)
    })

  // Remove cookie
  res.setHeader('Set-Cookie', 'playerId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')

  return res.status(200).end()
}