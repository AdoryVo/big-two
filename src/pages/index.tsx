import {
  Box,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Container,
  Heading,
  ListItem,
  UnorderedList
} from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import CreateLobby from '../components/CreateLobby'
import Preferences from '../components/Preferences'
import { describe, rulesToArray } from '../lib/game/Rules'
import useLobbies from '../lib/hooks/useLobbies'

export default function Home() {
  const { lobbies, isLoading, error } = useLobbies()

  return (
    <Box background="green.100" minH="100vh">
      <NextSeo
        title="Big Two"
        description="Play big two online with your friends or in public lobbies!"
      />
      <Container p={5}>
        <Heading mb={5}>♠️ Big Two</Heading>
        <CreateLobby />
        <Preferences />

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
              Max players: {lobby.settings.playerMax}
              <br />
              Spectating: {lobby.settings.spectating ? 'On' : 'Off'}
              <br />
              Rules:
              <br />
              <UnorderedList>
                {rulesToArray(lobby.settings.rules).map((rule) =>
                  <ListItem key={rule}>{describe(rule)}</ListItem>
                )}
              </UnorderedList>
            </CardBody>
            <CardFooter>
              <Link href={`/game/${lobby.id}`} passHref>
                <Button colorScheme="blue">Join lobby</Button>
              </Link>
            </CardFooter>
          </Card>
        )}
        {!isLoading && !lobbies?.length && (
          <Heading size="sm">0 current public lobbies, create one!</Heading>
        )}
      </Container>
    </Box>
  )
}
