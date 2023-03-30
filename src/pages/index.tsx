import {
  Badge,
  Box,
  Button,
  Card, CardBody, CardFooter, CardHeader,
  Container,
  Divider,
  Heading,
  ListItem,
  Tag,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import gamePreview from '@public/assets/site-preview.png'
import Image from 'next/image'
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
        description="Play Big Two online with your friends or in public lobbies!"
        canonical="https://bigtwo.vercel.app/"
        openGraph={{
          images: [{ url: 'https://bigtwo.vercel.app/assets/site-preview.png' }],
        }}
      />
      <Container maxW="5xl" textAlign="center" p={5}>
        <Heading {...styles.text} size="4xl" mb={5}>♠️ Big Two</Heading>
        <CreateLobby />
        <Preferences
          theme={theme}
          updateTheme={updateTheme}
        />

        {/* Lobbies */}
        <Heading {...styles.text} size="lg" my={5}>🏠 Public Lobbies</Heading>
        {error && (
          <Text as="b" color="red.500">An error occurred loading the lobbies...</Text>
        )}
        {isLoading && (
          <Text {...styles.text} as="b">⏳ Loading...</Text>
        )}
        {!isLoading && lobbies && lobbies.map((lobby, index) =>
          <Card key={index} textAlign="start" maxW="lg" mx="auto" mb={5}>
            <CardHeader>
              <Text fontWeight="bold">Lobby: <Text as="span" color="crimson">{lobby.id}</Text></Text>
              <Badge>
                {lobby.currentPlayer ? '⚔️ Game in progress' : '🚶 Waiting for more players'}
                &nbsp;({lobby.players.length}/{lobby.settings.playerMax})
              </Badge>
              <br />
            </CardHeader>
            <CardBody py={0}>
              Rules:
              <UnorderedList mb={2}>
                {rulesToArray(lobby.settings.rules).map((rule) =>
                  <ListItem key={rule}>{describe(rule)}</ListItem>
                )}
              </UnorderedList>
              <Tag colorScheme="cyan" me={2}>{lobby.settings.playerMax} Player Lobby</Tag>
              {lobby.settings.spectating && <Tag colorScheme="green">Spectating Enabled</Tag>}
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

        {/* Info */}
        <Heading {...styles.text} textAlign="center" size="lg" mt={8} mb={5}>🃏 What is Big Two?</Heading>
        <Card>
          <CardBody textAlign="start">
            <Box borderStart="3px solid" borderStartColor="green.200" ps={2}>
              <b>Big two (also known as deuces, capsa, pusoy dos, dai di and various other names) is a card game of Cantonese origin.</b>
              <br />
              ...
              <br />
              It is usually played with two to four players, the entire deck being dealt out in either case.
              <br />
              The objective of the game is to be the first to play off all of one&apos;s cards.
              <br />
              <Link href="https://en.wikipedia.org/wiki/Big_two">
                <Text as="span" color="blue.500" fontWeight="bold">— Wikipedia</Text>
              </Link>
            </Box>
            <br />

            <Image
              src={gamePreview}
              alt="Site preview"
              style={{
                textAlign: 'center',
                width: '100%',
                height: 'auto',
              }}
            />

            <Heading size="md" textAlign="center" textDecoration="underline" mt={4} mb={1}>How to play</Heading>
            <UnorderedList>
              <ListItem>
                In the center of the board is the current card combo.
              </ListItem>
              <ListItem>
                When it is your turn, you must play a combo that matches & beats the current combo, or else pass.
                <UnorderedList>
                  <ListItem>
                    For example, if the current combo is a pair of 3&apos;s,
                    the current player must play a pair with cards higher than 3 or else pass.
                  </ListItem>
                  <ListItem>
                    There is also a suit hierarchy used in some comparisons: clubs &lt; diamonds &lt; hearts &lt; spades
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                Combos include typical poker hands and two&apos;s are the highest value card (Big 2&apos;s!).
                <UnorderedList>
                  <ListItem>
                    You can overwrite any combo with a bomb, which is a four of a kind. Bombs can also be bombed by higher ranks!
                  </ListItem>
                  <ListItem>
                    If a player plays a card and everyone after them passes, the combo will reset to be blank on their turn.
                  </ListItem>
                  <ListItem>
                    If a combo is blank, the current player can play any card to start the combo.
                    <br />
                    Note: Traditionally, on the very first turn, the first player must play the 3 of clubs.
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                You get more points by finishing your hand the fastest!
              </ListItem>
            </UnorderedList>
          </CardBody>
        </Card>

        {/* Footer */}
        <Divider mt={10} />
        <Box textAlign="center" {...styles.text} pb={2}>
          Made with 💖 from San Diego
          <br />
          <Link href="https://github.com/AdoryVo/big-two" target="_blank">
            <Text as="span">
              🔗 Source Code
            </Text>
          </Link>
        </Box>
      </Container>
    </Box>
  )
}
