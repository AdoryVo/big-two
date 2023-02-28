import Pusher from 'pusher-js'
import { useState } from 'react'

export function usePusher() {
  const [pusher, setPusher] = useState<Pusher|null>(null)

  if (!pusher) {
    const pusher = new Pusher('e1b5c37560248e0a4fff', { cluster: 'us3' })
    setPusher(pusher)
    return pusher
  }

  return pusher
}
