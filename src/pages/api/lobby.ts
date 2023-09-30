import type { NextApiRequest, NextApiResponse } from 'next'
import { generateSlug } from 'random-word-slugs'

import prisma from '@utils/prisma'

// POST /api/lobby
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body

  const lobby = await prisma.game.create({ data: {
    id: generateSlug(),
    settings: { create: data },
  } })

  res.status(201).json(lobby)
}
