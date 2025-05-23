import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@utils/prisma';

// GET, DELETE /api/lobbies
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const games = await prisma.game.findMany({
      where: { settings: { public: true } },
      include: {
        players: true,
        currentPlayer: true,
        settings: true,
      },
    });

    res.status(200).json(games);
  } else if (req.method === 'DELETE') {
    if (req.cookies.secret !== process.env.ADMIN_SECRET) {
      res.status(401).end();
      return;
    }

    const minutes = Number(req.body.minutes);

    if (minutes < 0 || Number.isNaN(minutes)) {
      res.status(422).end();
      return;
    }

    const maxAge = minutes * 60 * 1000;
    const maxAgeTime = new Date().getTime() - maxAge;

    const expiredGames = await prisma.game.findMany({
      where: { createdAt: { lt: new Date(maxAgeTime) } },
    });
    const expiredGameIds = expiredGames.map((game) => game.id);
    const expiredSettings = expiredGames.map((game) => game.settingsId);

    // Delete players in expired games
    await prisma.player.deleteMany({
      where: { gameId: { in: expiredGameIds } },
    });

    // Delete expired games
    await prisma.game.deleteMany({ where: { id: { in: expiredGameIds } } });

    // Delete expired settings
    await prisma.settings.deleteMany({
      where: { id: { in: expiredSettings } },
    });

    res.status(204).end();
  }

  res.status(404).end();
}
