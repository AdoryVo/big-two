import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '@big-two/Game'
import prisma from '@utils/prisma'
import pusher from '@utils/pusher'
import { Event } from '@utils/pusher'

// PUT /api/[gameId]/play
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = String(req.query.gameId)
  const { combo } = req.body

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      players: true,
      currentPlayer: true,
      settings: true,
    },
  })

  if (!game || !game.currentPlayer) {
    res.status(404).end()
    return
  }

  // Double check that the request is from the current player
  const playerId = req.cookies[game.id]
  if (playerId !== game.currentPlayer.id) {
    res.status(401).end()
    return
  }

  const gameInstance = new Game(game.players.length, game.settings.rules, game)
  const currentPlayerIndex = gameInstance.current_player
  const result = gameInstance.play(combo)

  if (result === -2) {
    res.status(422).end('Invalid combination')
    return
  }

  if (result === -1) {
    // Edit player's hand
    await prisma.player.update({
      where: { id: game.currentPlayer.id },
      data: { hand: gameInstance.util.cards_to_strings(gameInstance.players[currentPlayerIndex].hand) },
    })

    await pusher.trigger(id, Event.Play, `${game.currentPlayer.name} played ${combo.join(', ')}!`)
      .catch((err) => {
        console.error(err)
      })
  } else {
    // Player finished - mark them as finished!
    const finishedPlayer = gameInstance.players[result]

    await prisma.player.update({
      where: { id: game.players[result].id },
      data: {
        hand: [],
        finishedRank: finishedPlayer.finished_rank ?? 0,
        points: { increment: finishedPlayer.score },
      },
    })

    await pusher.trigger(id, Event.Play, `🏅 ${game.currentPlayer.name} finished their hand with ${combo.join(', ')}!`)
      .catch((err) => {
        console.error(err)
      })
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

  res.status(200).end()
}
