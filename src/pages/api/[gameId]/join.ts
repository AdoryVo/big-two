import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// POST /api/[gameId]/join
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)
  const { name } = req.body

  const data = { name: String(name) }

  const game = await prisma.game.update({
    where: { id },
    data: { players: { create: data } },
    include: { players: true },
  })

  await pusher.trigger(id, Event.LobbyUpdate, game)
    .catch((err) => {
      console.error(err)
    })

  // Set cookie
  const player = game.players.at(-1)
  res.setHeader('Set-Cookie', `playerId=${player?.id}; Path=/`)

  return res.status(201).json(game)
}
