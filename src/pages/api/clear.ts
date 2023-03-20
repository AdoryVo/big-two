import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '@utils/prisma'

// PATCH /api/clear
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Remove old game id cookies
  const games = await prisma.game.findMany()
  for (const gameId in req.cookies) {
    // Do not delete admin secret cookies
    if (gameId === 'secret') {
      continue
    }

    // Remove cookie if no games exist with stored cookie ID
    if (!games.some((game) => game.id === gameId)) {
      res.setHeader('Set-Cookie', `${gameId}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`)
      return res.status(200).json(gameId)
    }
  }

  return res.status(200).json(null)
}
