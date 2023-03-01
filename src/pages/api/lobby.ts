import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

// POST /api/lobby
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  prisma.game.create({ data: {} }).then((result) => {
    return res.status(201).json(result)
  }).catch((err) => {
    console.error(err)
    return res.status(500).end()
  })
}
