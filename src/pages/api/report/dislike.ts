import type { Report } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

// POST /api/report/dislike
// Required fields in body: id, isDisliked
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report>
) {
  const { id, isDisliked } = req.body

  let update
  if (isDisliked) {
    update = { increment: 1 }
  } else {
    update = { decrement: 1 }
  }

  const report = await prisma.report.update({
    where: { id },
    data: { dislikes: update },
  })

  return res.status(200).json(report)
}
