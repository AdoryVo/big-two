import {
  Box,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Container,
  Heading
} from '@chakra-ui/react'
import type { Game } from '@prisma/client'
import ky from 'ky'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import useLobbies from '../lib/hooks/useLobbies'

export default function Home() {
  const router = useRouter()
  const { lobbies, isLoading, error } = useLobbies()

  function handleStartGame() {
    // Create a new game and then redirect them
    ky.post('api/lobby').json<Game>().then((game) => {
      router.push({ pathname: '/game/[gameId]', query: { gameId: game.id } })
    })
  }

  return (
    <Box background="green.100">
      <NextSeo
        title="Big Two"
        description="card game"
      />
      <Container p={5}>
        <Heading mb={5}>♠️ Big Two</Heading>
        <Button onClick={handleStartGame} colorScheme="green" mb={4} me={2}>
          Create Lobby
        </Button>

        <Heading size="lg" my={5}>🏠 Public Lobbies</Heading>
        {error && (
          <>An error occurred loading the lobbies...</>
        )}
        {!isLoading && lobbies && lobbies.map((lobby, index) =>
          <Card key={index} mb={5}>
            <CardHeader>
              <Heading size="md">Lobby {lobby.id.split('-')[0]}</Heading>
              {lobby.currentPlayer ? '⚔️ Game in progress' : '🧍 Waiting for more players'}
              &nbsp;|&nbsp;{lobby.players && lobby.players.length} current players
            </CardHeader>
            <CardBody>
              Rules: Classic
              <br />
              Spectating: On
            </CardBody>
            <CardFooter>
              <Link href={`/game/${lobby.id}`} passHref>
                <Button colorScheme="blue">Join lobby</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </Container>
    </Box>
  )
}
