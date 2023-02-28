import {
  Button, Container, Heading, Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import { usePusher } from '../lib/hooks/usePusher'

export default function Socket() {
  const pusher = usePusher()
  const [gameId, setGameId] = useState('') // UUID

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    if (storedGameId) {
      joinGame(storedGameId)
    }
  })

  function joinGame(gameId: string) {
    setGameId(gameId)

    const channel = pusher.subscribe(gameId)
    channel.bind('pong', (data: { message: string }) => {
      console.log(data)
    })

    channel.bind('end-game', () => {
      pusher.unsubscribe('game-id')
    })
  }

  function handleStartGame() {
    const gameId = self.crypto.randomUUID()
    localStorage.setItem('gameId', gameId)

    joinGame(gameId)
  }

  function handlePingGame() {
    fetch(`/api/ping/${gameId}`)
  }

  return (
    <>
      <NextSeo
        title="Socket Testing | Big Two"
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>

        <Heading mb={5}>Socket Testing</Heading>

        <Text mb={3}>Game id: {gameId || '❌'}</Text>
        <Button onClick={handleStartGame} colorScheme="green" mb={4} me={2}>
          Start Game
        </Button>
        <Button onClick={handlePingGame} colorScheme="purple" mb={4}>
          Ping game channel
        </Button>
      </Container>
    </>
  )
}
