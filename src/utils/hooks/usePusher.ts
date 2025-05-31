import Pusher from 'pusher-js';
import { useState } from 'react';

export function usePusher() {
  const [pusher, setPusher] = useState<Pusher | null>(null);

  if (!pusher) {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
      cluster: 'us3',
    });
    setPusher(pusher);
    return pusher;
  }

  return pusher;
}
