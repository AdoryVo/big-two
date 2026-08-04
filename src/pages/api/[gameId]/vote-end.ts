import prisma from '@utils/prisma';
import pusher, { Event } from '@utils/pusher';
import type { NextApiRequest, NextApiResponse } from 'next';

// PATCH /api/[gameId]/vote-end
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

  const playerId = req.cookies[game.id];
  const player = game.players.find((p) => p.id === playerId);

  if (!player) {
    res.status(401).end();
    return;
  }

  if (player.finishedRank !== 0) {
    res.status(422).end('Finished players cannot vote.');
    return;
  }

  if (game.earlyEndVotes.includes(player.index)) {
    res.status(422).end('Already voted.');
    return;
  }

  const updatedVotes = [...game.earlyEndVotes, player.index];
  const remainingPlayers = game.players.filter((p) => p.finishedRank === 0);
  const votesNeeded = Math.floor(remainingPlayers.length / 2) + 1;

  if (updatedVotes.length >= votesNeeded) {
    // Majority reached — assign scores and end the game
    const totalPlayers = game.players.length;
    const alreadyFinished = game.players.filter((p) => p.finishedRank !== 0);
    const unfinished = remainingPlayers.sort(
      (a, b) => a.hand.length - b.hand.length,
    );

    // Group players with the same hand size together and assign them the same rank.
    let nextRank = alreadyFinished.length + 1;
    let i = 0;
    while (i < unfinished.length) {
      const cardCount = unfinished[i].hand.length;
      const group = [];
      while (i < unfinished.length && unfinished[i].hand.length === cardCount) {
        group.push(unfinished[i]);
        i++;
      }
      const points = Math.max(0, totalPlayers - nextRank);
      for (const p of group) {
        await prisma.player.update({
          where: { id: p.id },
          data: {
            hand: [],
            finishedRank: nextRank,
            points: { increment: points },
          },
        });
      }
      nextRank += group.length;
    }

    // Reset game state (same as end.ts)
    await prisma.game.update({
      where: { id },
      data: {
        combo: { set: [] },
        lowestCard: null,
        currentPlayer: { disconnect: true },
        passedPlayers: { set: [] },
        earlyEndVotes: { set: [] },
        lastPlaymaker: null,
        backupNext: null,
      },
    });

    await pusher
      .trigger(id, Event.Play, '🏳️ Game ended early by vote!')
      .catch((err) => {
        console.error(err);
      });
  } else {
    // Majority not yet reached — save vote.
    // Use an atomic array append so simultaneous votes from different players
    // can't clobber each other (a read-modify-write `set` would lose one).
    await prisma.game.update({
      where: { id },
      data: {
        earlyEndVotes: { push: player.index },
      },
    });
  }

  await pusher.trigger(id, Event.LobbyUpdate, null).catch((err) => {
    console.error(err);
  });

  res.status(200).end();
}
