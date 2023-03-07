import type { NextApiRequest, NextApiResponse } from 'next'

import Game from '../../../lib/game/Game'
import Rules from '../../../lib/game/Rules'
import prisma from '../../../lib/prisma'
import pusher from '../../../lib/pusher'
import { Event } from '../../../lib/pusher'

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
    },
  })

  if (!game || !game.currentPlayer) {
    return res.status(404).end()
  }

  // Double check that the request is from the current player
  const cookies = req.headers.cookie?.split('; ')
  const playerId = cookies?.find((cookie) => cookie.startsWith('playerId'))?.split('=')[1]
  if (playerId !== game.currentPlayer.id) {
    return res.status(401).end()
  }

  const gameInstance = new Game(game.players.length, Rules.DEFAULT, game)
  const currentPlayerIndex = gameInstance.current_player
  const result = gameInstance.play(combo)

  if (result === -2) {
    return res.status(422).end('Invalid combination')
  }

  if (result === -1) {
    // Edit player's hand
    await prisma.player.update({
      where: { id: game.currentPlayer.id },
      data: { hand: gameInstance.util.cards_to_strings(gameInstance.players[currentPlayerIndex].hand) },
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

  // Authorization - obscuring player data
  const player = updatedGame.players.find((player) => player.id === playerId)
  if (playerId && player && player.finishedRank === 0) {
    // If a player is requesting game data, obscure other players' id's & cards
    updatedGame.players.forEach((player) => {
      if (player.id !== playerId) {
        player.id = ''
        player.hand = player.hand.map(() => '')
      }
    })
  } else if (!playerId) {
    // Obscure ID's from spectating players
    updatedGame.players.forEach((player) => {
      player.id = ''
    })
  }

  await pusher.trigger(id, Event.LobbyUpdate, updatedGame)
    .catch((err) => {
      console.error(err)
    })

  await pusher.trigger(id, Event.Play, `Played ${updatedGame.combo.join(', ')}!`)
    .catch((err) => {
      console.error(err)
    })

  return res.status(200).end()
}
