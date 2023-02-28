import Pusher from 'pusher-js'
import { useState } from 'react'

export function usePusher() {
  const [pusher, setPusher] = useState<Pusher|null>(null)

  if (!pusher) {
    const pusher = new Pusher('cbede7ce68bd1e60c158', { cluster: 'us3' })
    setPusher(pusher)
    return pusher
  }

  return pusher
}
