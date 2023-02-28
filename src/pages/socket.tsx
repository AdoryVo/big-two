import {
  Button, Container, Heading, Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

export default function Socket() {
  const [pusher, setPusher] = useState<Pusher|null>(null)
  const [gameId, setGameId] = useState('') // UUID string

  useEffect(() => {
    const storedGameId = localStorage.getItem('gameId')
    if (storedGameId) {
      joinGame(storedGameId)
    }

    return () => {
      if (!pusher) return

      pusher.disconnect()
    }
  }, [pusher]) // eslint-disable-line

  function getPusher() {
    if (!pusher) {
      const pusher = new Pusher('cbede7ce68bd1e60c158', { cluster: 'us3' })
      setPusher(pusher)
      return pusher
    }
    return pusher
  }

  function joinGame(gameId: string) {
    const pusher = getPusher()
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

  function handlePing() {
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
        <Button onClick={handlePing} colorScheme="purple" mb={4}>
          Ping server
        </Button>
      </Container>
    </>
  )
}
