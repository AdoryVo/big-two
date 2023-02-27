// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

// GET /api/socket
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO: Use Pusher instead: https://vercel.com/guides/deploying-pusher-channels-with-vercel

  if (res.socket.server.io) {
    console.log('Socket is already running')
  }
  else {
    console.log('Socket is initializing')

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log(socket.id)
    })
  }

  return res.status(200).end()
}
