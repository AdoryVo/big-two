import type { Report } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

import prisma from '../../../lib/prisma'

// POST /api/report/like
// Required fields in body: id
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report>
) {
  const { id } = req.body

  const clientIp = requestIp.getClientIp(req)
  if (!clientIp) return res.status(403).end()

  let update
  const user = await prisma.user.findUnique({ where: { ipAddress: clientIp } })
  if (!user || !user.likes.includes(id)) {
    await prisma.user.upsert({
      where: { ipAddress: clientIp },
      update: { likes: { push: id } },
      create: {
        ipAddress: clientIp,
        likes: [id],
      },
    })

    update = { increment: 1 }
  } else {
    await prisma.user.update({
      where: { ipAddress: clientIp },
      data: { likes: user.likes.filter((report_id) => report_id !== id ) },
    })

    update = { decrement: 1 }
  }

  const report = await prisma.report.update({
    where: { id },
    data: { likes: update },
  })

  return res.status(200).json(report)
}
