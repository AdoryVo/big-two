import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

import Game from '@big-two/Game';
import prisma from '@utils/prisma';
import supabase, { Event } from '@utils/supabase';

// PATCH /api/[gameId]/start
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = String(req.query.gameId);

  const game = await prisma.game.findUnique({
    where: { id },
    include: { players: true, currentPlayer: true, settings: true },
  });

  if (!game) {
    res.status(404).end();
    return;
  }

  const gameInstance = new Game(
    game.players.length,
    game.settings.rules,
    undefined,
    game.settings.deckCount,
  );
  const lowestCard = gameInstance.util.card_to_string(gameInstance.lowest_card);
  const currentPlayer = game.players[gameInstance.current_player];

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
  });

  // Add hands to each player
  const rng = _.random(game.players.length - 1);
  for (let i = 0; i < game.players.length; i++) {
    const storedPlayer = game.players[i];
    const instancePlayer = gameInstance.players[i];

    await prisma.player.update({
      where: { id: storedPlayer.id },
      data: {
        index: (i + rng) % game.players.length,
        hand: gameInstance.util.cards_to_strings(instancePlayer.hand),
        finishedRank: 0,
        games: { increment: 1 },
      },
    });
  }

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
  });

  res.status(200).end();
}
