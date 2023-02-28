import {
  Box, Button, Container, Heading, Text
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { useCallback, useEffect, useState } from 'react'

import useGame from '../../lib/hooks/useGame'
import { usePusher } from '../../lib/hooks/usePusher'

export default function Game() {
  const router = useRouter()
  const pusher = usePusher()
  const { game, isLoading, error } = useGame(String(router.query.gameId))
  const [gameId, setGameId] = useState('') // UUID

  const joinGame = useCallback(joinGameCallback, [pusher])

  useEffect(() => {
    // Do not act until query is loaded
    if (!router.query.gameId) {
      return
    }

    joinGame(String(router.query.gameId))
  }, [router.query.gameId, joinGame])

  function joinGameCallback(gameId: string) {
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

    joinGame(gameId)
  }

  function handlePingGame() {
    fetch(`/api/${gameId}/ping`)
  }

  return (
    <>
      <NextSeo
        title="[person's] Turn | Big Two"
      />
      <Container p={5}>
        <Link href="/" passHref>
          <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
        </Link>

        <Heading mb={5}>Game Lobby</Heading>

        <Text mb={3}>Game id: {gameId || '❌'}</Text>
        <Button onClick={handleStartGame} colorScheme="green" mb={4} me={2}>
          Start Game
        </Button>
        <Button onClick={handlePingGame} colorScheme="purple" mb={4}>
          Ping game channel
        </Button>

        {/* Game Container */}
        {error && <p>Failed to load game data...</p>}
        {!isLoading &&
          <Box my={5} py={2}>
            {JSON.stringify(game)}
          </Box>
        }
      </Container>
    </>
  )
}
