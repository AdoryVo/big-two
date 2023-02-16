// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { Report } from '@prisma/client'
import formidable from 'formidable'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'

import prisma from '../../../lib/prisma'
import { uploadFile } from '../../../lib/s3Client'

// POST /api/report
// Required fields in body: title, category, lat, lng
// Optional fields in body: description, image
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report>
) {
  const form = formidable({
    uploadDir: './public/',
    keepExtensions: true,
    filename: (_name: string, ext: string) => {return uuidv4() + ext},
  })

  form.parse(req, (err: Error, fields: object, files: object) => {
    if (err) {
      console.error(err)
      return
    }

    // Parse fields values
    fields = _.mapValues(fields, (item) => JSON.parse(item))

    // Parse image
    if (files.image) {
      const image = files.image
      uploadFile(image)
      fields.image = image.newFilename
    }

    prisma.report.create({ data: fields }).then((result) => {
      res.json(result)
    })
  })
}

export const config = { api: { bodyParser: false } }
