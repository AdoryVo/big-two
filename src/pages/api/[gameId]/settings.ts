import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// PUT /api/[gameId]/settings
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)
  const data = req.body

  const game = await prisma.game.update({
    where: { id },
    data: { settings: { update: data } },
  })

  if (!game) {
    res.status(404).end()
  }

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  return res.status(204).end()
}
