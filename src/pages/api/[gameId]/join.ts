import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@utils/prisma'
import pusher from '@utils/pusher'
import { Event } from '@utils/pusher'

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
    include: { players: true, currentPlayer: true },
  })

  if (!game) {
    res.status(404).end()
  }

  // Set cookie
  const player = game.players.at(-1)
  const playerId = player?.id
  res.setHeader('Set-Cookie', `playerId=${playerId}; Path=/`)

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  return res.status(201).json(playerId)
}
