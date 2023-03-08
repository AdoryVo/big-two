import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import Rules from '../../../lib/game/Rules'
import prisma from '../../../lib/prisma'
import { Event } from '../../../lib/pusher'
import pusher from '../../../lib/pusher'

// PATCH /api/[gameId]/start
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)

  const game = await prisma.game.findUnique({
    where: { id },
    include: { players: true, currentPlayer: true },
  })

  if (!game) {
    return res.status(404).end()
  }

  const gameInstance = new Game(game.players.length, Rules.DEFAULT)
  const lowestCard = gameInstance.util.card_to_string(gameInstance.lowest_card)
  const currentPlayer = game.players[gameInstance.current_player]

  // Store lowest card & current player
  await prisma.game.update({
    where: { id },
    data: {
      lowestCard: { set: lowestCard },
      currentPlayer: { connect: { id: currentPlayer?.id } },
    },
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  // Add hands to each player
  const rng = _.random(game.players.length - 1)
  for (let i = 0; i < game.players.length; i++) {
    const storedPlayer = game.players[i]
    const instancePlayer = gameInstance.players[i]

    await prisma.player.update({
      where: { id: storedPlayer.id },
      data: {
        index: (i + rng) % game.players.length,
        hand: gameInstance.util.cards_to_strings(instancePlayer.hand),
        finishedRank: 0,
      },
    })
  }

  await pusher.trigger(id, Event.LobbyUpdate, null)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
