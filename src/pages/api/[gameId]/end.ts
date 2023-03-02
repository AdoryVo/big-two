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
      deck: { set: [] },
      combo: { set: [] },
      players: { deleteMany: {} },
      currentPlayer: { disconnect: true },
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

  return res.status(200).end()
}