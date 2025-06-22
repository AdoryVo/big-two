import prisma from '@utils/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

const TWO_DAYS_MINUTES = 60 * 24 * 2;

// GET, DELETE /api/lobbies
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const isCronJob =
    req.headers.authorization === `Bearer ${process.env.CRON_SECRET}`;

  if (req.method === 'GET' && !isCronJob) {
    const games = await prisma.game.findMany({
      where: { settings: { public: true } },
      include: {
        players: true,
        currentPlayer: true,
        settings: true,
      },
    });

    res.status(200).json(games);
    return;
  } else if (req.method === 'DELETE' || isCronJob) {
    const isAdmin = req.cookies.secret === process.env.ADMIN_SECRET;

    if (!isAdmin && !isCronJob) {
      res.status(401).end();
      return;
    }

    const minutes = isCronJob ? TWO_DAYS_MINUTES : Number(req.body.minutes);

    if (minutes < 0 || Number.isNaN(minutes)) {
      res.status(422).end();
      return;
    }

    const maxAge = minutes * 60 * 1000;
    const maxAgeTime = Date.now() - maxAge;

    const expiredGames = await prisma.game.findMany({
      where: { startedAt: { lt: new Date(maxAgeTime) } },
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
    return;
  }

  res.status(404).end();
}
