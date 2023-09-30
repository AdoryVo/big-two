import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@utils/prisma'

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
    res.status(404).end()
    return
  }

  // Authorization - obscuring player data
  if (game.currentPlayer) {
    game.currentPlayer.id = ''
  }

  const playerId = req.cookies[game.id]
  const player = game.players.find((player) => player.id === playerId)
  if (playerId && player && player.finishedRank === 0) {
    // If a remaining player is requesting game data, obscure other players' id's & cards
    game.players.forEach((player) => {
      if (player.id !== playerId) {
        player.id = ''
        player.hand = player.hand.map(() => '')
      }
    })
  } else {
    // Obscure ID's from spectating players
    game.players.forEach((player) => {
      // Do not obscure id if this player is the spectator
      if (playerId && player.id === playerId) {
        return
      }

      player.id = ''
    })

    if (!game.settings.spectating) {
      // Hide all cards if spectating is not allowed
      game.players.forEach((player) => {
        player.hand = player.hand.map(() => '')
      })
    }
  }

  res.status(200).json(game)
}
