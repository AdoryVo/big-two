import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

// PATCH /api/[gameId]/pass
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

  if (!game || !game.currentPlayer) {
    return res.status(404).end()
  }

  // Double check that the request is from the current player
  const playerId = req.cookies.playerId
  if (playerId !== game.currentPlayer.id) {
    return res.status(401).end()
  }

  const gameInstance = new Game(game.players.length, game.settings.rules, game)
  const result = gameInstance.pass()

  if (result === -2) {
    return res.status(422).end('Cannot pass right now!')
  }

  await prisma.game.update({
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

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  await pusher.trigger(id, Event.Play, 'Passed!')
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
