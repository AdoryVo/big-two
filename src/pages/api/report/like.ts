import type { Report } from '@prisma/client'
import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../../lib/prisma'

// POST /api/report/like
// Required fields in body: isLiked, isDisliked
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report>
) {
  const { id, isLiked, isDisliked } = req.body

  let update: Prisma.IntFieldUpdateOperationsInput = { increment: 0 }
  if ('isLiked' in req.body) {
    if (isLiked) {
      update = { increment: 1 }
    }
    else {
      update = { decrement: 1 }
    }
  }

  let update2: Prisma.IntFieldUpdateOperationsInput  = { increment: 0 }
  if ('isDisliked' in req.body) {
    if (isDisliked) {
      update2 = { increment: 1 }
    } else {
      update2 = { decrement: 1 }
    }
  }

  prisma.report.update({
    where: { id },
    data: { likes: update, dislikes: update2 },
  }).then((report) => {
    console.log(report)
    res.status(200).json(report)
  }).catch((err) => {
    console.log(err)
  })
}
