import {
  Box,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'

import { describe, rulesToArray } from '@big-two/Rules'
import CreateLobby from '@components/CreateLobby'
import Preferences from '@components/Preferences'
import useLobbies from '@utils/hooks/useLobbies'
import { useTheme } from '@utils/hooks/useTheme'
import { getStyles } from '@utils/theme'

export default function Home() {
  const { lobbies, isLoading, error } = useLobbies()
  const [theme, updateTheme] = useTheme()
  const styles = getStyles(theme)

  return (
    <Box {...styles.bg} minH="100vh">
      <NextSeo
        title="Big Two"
        description="Play big two online with your friends or in public lobbies!"
      />
      <Container p={5}>
        <Heading {...styles.text} mb={5}>♠️ Big Two</Heading>
        <CreateLobby />
        <Preferences
          theme={theme}
          updateTheme={updateTheme}
        />

        <Heading {...styles.text} size="lg" my={5}>🏠 Public Lobbies</Heading>
        {error && (
          <Text as="b" color="red.500">An error occurred loading the lobbies...</Text>
        )}
        {isLoading && (
          <Text {...styles.text} as="b">⌛ Loading...</Text>
        )}
        {!isLoading && lobbies && lobbies.map((lobby, index) =>
          <Card key={index} mb={5}>
            <CardHeader>
              <Text fontWeight="bold">Lobby: <Text as="span" color="crimson">{lobby.id}</Text></Text>
              {lobby.currentPlayer ? '⚔️ Game in progress' : '🚶 Waiting for more players'}
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
          <Text {...styles.text} as="b">No current public lobbies, create one!</Text>
        )}
      </Container>
    </Box>
  )
}
