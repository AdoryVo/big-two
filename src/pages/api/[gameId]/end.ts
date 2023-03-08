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

  await prisma.game.update({
    where: { id },
    data: {
      combo: { set: [] },
      lowestCard: null,
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

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
