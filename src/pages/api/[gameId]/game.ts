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

  const cookies = req.headers.cookie?.split('; ')
  const playerId = cookies?.find((cookie) => cookie.startsWith('playerId'))?.split('=')[1]

  // If a player is requesting game data, obscure other players' cards
  if (playerId && game.players.map((player) => player.id).includes(playerId))
    game.players.forEach((player) => {
      if (player.id !== playerId)
        player.hand = player.hand.map(() => '?;?')
    })

  // If a game is not in progress, remove cookie
  if (!game.currentPlayer) {
    res.setHeader('Set-Cookie', 'playerId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
  }

  return res.status(200).json(game)
}
