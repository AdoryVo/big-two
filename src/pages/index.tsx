import { Button, Container, Heading } from '@chakra-ui/react'
import type { Game } from '@prisma/client'
import ky from 'ky'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

export default function Home() {
  const router = useRouter()

  function handleStartGame() {
    // Create a new game and then redirect them
    ky.post('api/lobby').json<Game>().then((game) => {
      router.push({ pathname: '/game/[gameId]', query: { gameId: game.id } })
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
          Create Lobby
        </Button>
      </Container>
    </>
  )
}
