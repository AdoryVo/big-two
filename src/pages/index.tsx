import { Button, Container, Heading } from '@chakra-ui/react'
import ky from 'ky'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import Game from '../lib/game/Game'
import Rules from '../lib/game/Rules'

export default function Home() {
  const router = useRouter()

  function handleStartGame() {
    const gameId = self.crypto.randomUUID()

    // Create a new game and then redirect them
    ky.post(`api/${gameId}/game`).then(() => {
      router.push(`/game/${gameId}`)
    })
  }

  return (
    <>
      <NextSeo
        title="Big Two"
        description="card game"
      />
      <Container p={5}>
        <Heading mb={5}>♠️ Big Two</Heading>
        <Button onClick={handleStartGame} colorScheme="green" mb={4} me={2}>
          Start Game
        </Button>
      </Container>
    </>
  )
}
