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
      settings: true,
    },
  })

  if (!game) {
    return res.status(404).end()
  }

  // Authorization - obscuring player data
  const playerId = req.cookies.playerId
  const player = game.players.find((player) => player.id === playerId)
  if (playerId && player && player.finishedRank === 0) {
    // If a remaining player is requesting game data, obscure other players' id's & cards
    game.players.forEach((player) => {
      if (player.id !== playerId) {
        player.id = ''
        player.hand = player.hand.map(() => '')
      }
    })
  } else if (!playerId) {
    // Obscure ID's from spectating players
    game.players.forEach((player) => {
      player.id = ''
    })
  }

  return res.status(200).json(game)
}
