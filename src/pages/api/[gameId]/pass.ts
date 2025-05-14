import type { NextApiRequest, NextApiResponse } from 'next';

import Game from '@big-two/Game';
import prisma from '@utils/prisma';
import supabase, { Event } from '@utils/supabase';

// PATCH /api/[gameId]/pass
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      players: true,
      currentPlayer: true,
      settings: true,
    },
  });

  if (!game || !game.currentPlayer) {
    res.status(404).end();
    return;
  }

  // Double check that the request is from the current player
  const playerId = req.cookies[game.id];
  if (playerId !== game.currentPlayer.id) {
    res.status(401).end();
    return;
  }

  const gameInstance = new Game(game.players.length, game.settings.rules, game);
  const result = gameInstance.pass();

  if (result === -2) {
    res.status(422).end('Cannot pass right now!');
    return;
  }

  await prisma.game.update({
    where: { id },
    data: {
      combo: gameInstance.util.cards_to_strings(
        gameInstance.combo?.cards || [],
      ),
      lowestCard: gameInstance.util.card_to_string(gameInstance.lowest_card),
      currentPlayer: {
        connect: { id: game.players[gameInstance.current_player].id },
      },
      passedPlayers: Array.from(gameInstance.passed_players),
      lastPlaymaker: gameInstance.last_playmaker,
      backupNext: gameInstance.backup_next,
    },
    include: { players: true, currentPlayer: true },
  });

  const channel = supabase.channel(id);
  channel.subscribe((status) => {
    if (status !== 'SUBSCRIBED') {
      return null;
    }

    channel
      .send({
        type: 'broadcast',
        event: Event.LobbyUpdate,
      })
      .catch((err) => void console.error(err));

    channel
      .send({
        type: 'broadcast',
        event: Event.Play,
        payload: { message: `${game.currentPlayer?.name} passed!` },
      })
      .catch((err) => void console.error(err));
  });

  res.status(200).end();
}
