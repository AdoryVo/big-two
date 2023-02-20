import type { Report } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma'

// GET /api/reports
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report[]>
) {
  const reports = await prisma.report.findMany({ orderBy: { likes: 'desc' } })

  return res.status(200).json(reports)
}
