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
    include: { players: true },
  })

  if (!game) {
    return res.status(404).end()
  }

  const gameInstance = new Game(game.players.length, Rules.SUIT_ORDER_ALPHA)
  const deck = gameInstance.remainingCards
  const currentPlayer = _.sample(game.players)

  // Add deck & current player
  await prisma.game.update({
    where: { id },
    data: {
      deck: { set: deck },
      currentPlayer: { connect: { id: currentPlayer?.id } },
    },
    include: {
      players: true,
      currentPlayer: true,
    },
  })

  // Add hands to each player
  for (let i = 0; i < game.players.length; i++) {
    const storedPlayer = game.players[i]
    const instancePlayer = gameInstance.players[i]

    await prisma.player.update({
      where: { id: storedPlayer.id },
      data: { hand: gameInstance.util.cards_to_strings(instancePlayer.hand) },
    })
  }

  const updatedGame = await prisma.game.findUnique({
    where: { id },
    include: { players: true, currentPlayer: true },
  })

  await pusher.trigger(id, Event.StartGame, updatedGame)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
