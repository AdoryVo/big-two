import type { NextApiRequest, NextApiResponse } from 'next';
import { generateSlug } from 'random-word-slugs';

import prisma from '@utils/prisma';

// GET /api/[gameId]/game
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

  if (!game) {
    res.status(404).end();
    return;
  }

  // Authorization - obscuring player data
  if (game.currentPlayer) {
    game.currentPlayer.id = '';
  }

  const playerId = req.cookies[game.id];
  const player = game.players.find((player) => player.id === playerId);
  if (game.currentPlayer !== null) {
    if (playerId && player && player.finishedRank === 0) {
      // If a remaining player is requesting game data, obscure other players' id's & cards
      for (const player of game.players) {
        if (player.id !== playerId) {
          player.id = `redacted-${generateSlug()}`;
          player.hand = player.hand.map(() => '');
        }
      }
    } else {
      // Obscure ID's from spectating players
      for (const player of game.players) {
        // Do not obscure id if this player is the spectator
        if (playerId && player.id === playerId) {
          continue;
        }

        player.id = `redacted-${generateSlug()}`;
      }

      if (!game.settings.spectating) {
        // Hide all cards if spectating is not allowed
        for (const player of game.players) {
          player.hand = player.hand.map(() => '');
        }
      }
    }
  }

  res.status(200).json(game);
}
