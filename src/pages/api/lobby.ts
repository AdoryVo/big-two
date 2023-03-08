import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

// POST /api/lobby
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body

  const lobby = await prisma.game.create({ data: { settings: { create: data } } })

  return res.status(201).json(lobby)
}
