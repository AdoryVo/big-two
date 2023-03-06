import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import Rules from '../../../lib/game/Rules'
import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// GET /api/[gameId]/pass
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

  if (!game || !game.currentPlayer) {
    return res.status(404).end()
  }

  // Double check that the request is from the current player
  const cookies = req.headers.cookie?.split('; ')
  const playerId = cookies?.find((cookie) => cookie.startsWith('playerId'))?.split('=')[1]
  if (playerId !== game.currentPlayer?.id) {
    return res.status(401).end()
  }

  const gameInstance = new Game(game.players.length, Rules.SUIT_ORDER_ALPHA, game)
  const result = gameInstance.pass()

  if (result === -2) {
    return res.status(402).end('Cannot pass right now!')
  }

  const updatedGame = await prisma.game.update({
    where: { id },
    data: {
      combo: gameInstance.util.cards_to_strings(gameInstance.combo?.cards || []),
      lowestCard: gameInstance.util.card_to_string(gameInstance.lowest_card),
      currentPlayer: { connect: { id: game.players[gameInstance.current_player].id } },
      passedPlayers: Array.from(gameInstance.passed_players),
      lastPlaymaker: gameInstance.last_playmaker,
      backupNext: gameInstance.backup_next,
    },
    include: { players: true, currentPlayer: true },
  })

  await pusher.trigger(id, Event.LobbyUpdate, updatedGame)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
