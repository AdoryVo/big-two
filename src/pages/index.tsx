import { describe, rulesToArray } from '@big-two/Rules';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  Spacer,
  Tag,
  Text,
  UnorderedList,
  useToast,
} from '@chakra-ui/react';
import CreateLobby from '@components/CreateLobby';
import Preferences from '@components/Preferences';
import Version from '@components/Version';
import gamePreview from '@public/assets/site-preview.png';
import useLobbies from '@utils/hooks/useLobbies';
import { usePusher } from '@utils/hooks/usePusher';
import { useStore } from '@utils/hooks/useStore';
import { ChannelName, Event } from '@utils/pusher';
import { getStyles } from '@utils/theme';
import Image from 'next/image';
import NextLink from 'next/link';
import { NextSeo, VideoGameJsonLd } from 'next-seo';
import { useEffect } from 'react';

function compareByNewest(lobby1: Date, lobby2: Date) {
  return new Date(lobby2).getTime() - new Date(lobby1).getTime();
}

export default function Home() {
  const { lobbies, isLoading, error, mutate } = useLobbies();
  const pusher = usePusher();
  const theme = useStore((state) => state.theme);
  const styles = getStyles(theme);
  const toast = useToast();

  useEffect(() => {
    useStore.persist.rehydrate();

    /*
    toast({
      render: () => (
        <HomeAnnouncement title="🎉 Thank you!" onClose={toast.closeAll}>
          <>
            We&apos;re surprised to see that many players have started playing big two on our site!
            As such, we would like to ensure a good player experience for everyone.
            <Text fontWeight="bold" mt={2}>
              If there is any feedback you have, we would love to hear your thoughts&nbsp;
              <Link as={NextLink} href="https://forms.gle/jPd276dcsLVPswBZ7" target="_blank" color="blue.600">
                here.
              </Link>
            </Text>
          </>
        </HomeAnnouncement>
      ),
      containerStyle: {
        margin: '1em',
        fontSize: ['sm', 'md'],
      },
      position: 'top-left',
      duration: 14000,
    })
    */
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe(ChannelName.Lobbies);
    channel.bind(Event.LobbyUpdate, () => void mutate());

    return () => {
      pusher.unsubscribe(ChannelName.Lobbies);
    };
  }, [pusher, mutate]);

  return (
    <Box {...styles.bg} minH="100vh">
      <NextSeo
        title="Big Two"
        description="Play multiplayer Big Two online with your friends in real-time with no account needed! Tiến lên and custom rules are also supported. 🎉 1000+ monthly players!"
        canonical="https://bigtwo.vercel.app/"
        openGraph={{
          images: [
            { url: 'https://bigtwo.vercel.app/assets/site-preview.png' },
          ],
        }}
        additionalLinkTags={[
          {
            rel: 'manifest',
            href: '/app.webmanifest',
          },
        ]}
      />
      <VideoGameJsonLd
        name="Big Two"
        languageName={['English']}
        description="Big two is a card game of Cantonese origin usually played with two to four players."
        playMode="MultiPlayer"
        applicationCategory="Game"
        url="https://bigtwo.vercel.app"
        platformName={['Web-based game']}
        keywords="cards, game, multiplayer"
        image="https://bigtwo.vercel.app/assets/site-preview.png"
      />
      <Version {...styles.text} />

      <Container maxW="5xl" textAlign="center" p={5}>
        <Heading {...styles.text} size="4xl" mb={5}>
          ♠️ Big Two
        </Heading>
        <CreateLobby closeToast={toast.closeAll} />
        <Preferences />
        <Box>
          <NextLink href={'/game/singleplayer'} passHref>
            <Button colorScheme="blue" onClick={() => toast.closeAll()}>
              <Text fontSize="sm" fontFamily="cursive" color="pink.100">
                🎉NEW🎉
              </Text>{' '}
              Singleplayer mode 🤖
            </Button>
          </NextLink>
        </Box>

        {/* Lobbies */}
        <Heading {...styles.text} size="lg" my={5}>
          🏠 Public Lobbies
          <Box fontSize="md">
            ⚠️ Idle lobbies that have not started a game in 48 hours will be
            deleted automatically.
          </Box>
        </Heading>
        <Box
          bg="rgba(0, 0, 0, 0.25)"
          h="2xl"
          overflowY="auto"
          border="1px solid lightgrey"
          rounded="md"
          p={4}
        >
          {error && (
            <Text as="b" color="red.500">
              An error occurred loading the lobbies...
            </Text>
          )}
          {isLoading && (
            <Text {...styles.text} as="b">
              ⏳ Loading...
            </Text>
          )}
          {!isLoading &&
            lobbies &&
            lobbies
              .sort((l1, l2) => compareByNewest(l1.startedAt, l2.startedAt))
              .map((lobby) => (
                <Card
                  key={lobby.id}
                  textAlign="start"
                  maxW="lg"
                  mx="auto"
                  mb={5}
                >
                  <CardHeader>
                    <Flex>
                      <Box>
                        <Text fontWeight="bold">
                          Lobby:{' '}
                          <Text as="span" color="crimson">
                            {lobby.id}
                          </Text>
                        </Text>
                        <Badge>
                          {lobby.currentPlayer
                            ? '⚔️ Game in progress'
                            : '🚶 Waiting for more players'}
                          &nbsp;({lobby.players.length}/
                          {lobby.settings.playerMax})
                        </Badge>
                      </Box>
                      <Spacer />
                      <Box>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          title="Lobby creation"
                          textAlign="right"
                        >
                          {new Date(lobby.createdAt).toLocaleString()}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="blue.500"
                          title="Latest lobby/game start"
                          textAlign="right"
                        >
                          {new Date(lobby.startedAt).toLocaleString()}
                        </Text>
                      </Box>
                    </Flex>
                  </CardHeader>
                  <CardBody py={0}>
                    Rules:
                    <UnorderedList mb={2}>
                      {rulesToArray(lobby.settings.rules).map((rule) => (
                        <ListItem key={rule}>{describe(rule)}</ListItem>
                      ))}
                    </UnorderedList>
                    <Tag colorScheme="cyan" me={2}>
                      {lobby.settings.playerMax} Player Lobby
                    </Tag>
                    {lobby.settings.spectating ? (
                      <Tag colorScheme="green" me={2}>
                        Spectating Enabled
                      </Tag>
                    ) : (
                      <Tag colorScheme="red" me={2}>
                        Spectating Disabled
                      </Tag>
                    )}
                    <Tag colorScheme="yellow" me={2}>
                      {lobby.settings.deckCount} Deck(s)
                    </Tag>
                  </CardBody>
                  <CardFooter>
                    <NextLink href={`/game/${lobby.id}`} passHref>
                      <Button
                        colorScheme="blue"
                        onClick={() => toast.closeAll()}
                      >
                        Join lobby
                      </Button>
                    </NextLink>
                  </CardFooter>
                </Card>
              ))}
        </Box>

        {!isLoading && !lobbies?.length && (
          <Text {...styles.text} as="b">
            No current public lobbies, create one!
          </Text>
        )}

        {/* Info */}
        <Heading {...styles.text} textAlign="center" size="lg" mt={8} mb={5}>
          🃏 What is Big Two?
        </Heading>
        <Card>
          <CardBody textAlign="start">
            <Box borderStart="3px solid" borderStartColor="green.200" ps={2}>
              <b>
                Big two (also known as deuces, capsa, pusoy dos, dai di and
                various other names) is a card game of Cantonese origin.
              </b>
              <br />
              ...
              <br />
              It is usually played with two to four players, the entire deck
              being dealt out in either case.
              <br />
              The objective of the game is to be the first to play off all of
              one&apos;s cards.
              <br />
              ...
              <br />
              Cards may be played as singles or in groups of two, three or five,
              in combinations which resemble poker hands.
              <br />
              <Link href="https://en.wikipedia.org/wiki/Big_two">
                <Text as="span" color="blue.500" fontWeight="bold">
                  — Wikipedia
                </Text>
              </Link>
            </Box>

            <Text mb={4}>
              ⭐ Furthermore, <b>Tiến lên (aka Thirteen)</b> is a popular
              variant that uses sequences in place of high poker hands.
            </Text>

            <Image
              src={gamePreview}
              alt="Site preview"
              style={{
                textAlign: 'center',
                width: '100%',
                height: 'auto',
              }}
            />

            <Heading
              size="md"
              textAlign="center"
              textDecoration="underline"
              mt={4}
              mb={1}
            >
              How to play
            </Heading>
            <UnorderedList>
              <ListItem>
                In the center of the board is the current card combo.
              </ListItem>
              <ListItem>
                When it is your turn, you must play a combo that matches & beats
                the current combo, or else pass.
                <UnorderedList>
                  <ListItem>
                    For example, if the current combo is a pair of 3&apos;s, the
                    current player must play a pair with cards higher than 3 or
                    else pass.
                  </ListItem>
                  <ListItem>
                    There is also a suit hierarchy used in some comparisons,
                    typically: clubs &lt; diamonds &lt; hearts &lt; spades
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                Combos include typical poker hands and two&apos;s are the
                highest value card (Big 2&apos;s!).
                <UnorderedList>
                  <ListItem>
                    You can overwrite any combo with a bomb, which is a four of
                    a kind. Bombs can also be bombed by higher ranks!
                  </ListItem>
                  <ListItem>
                    If a player plays a card and everyone after them passes, the
                    combo will reset to be blank on their turn.
                  </ListItem>
                  <ListItem>
                    If a combo is blank, the current player can play any card(s)
                    to start the combo.
                    <br />
                    Note: Traditionally, on the very first turn, the first
                    player starts the game by playing the lowest card (ex: 3 of
                    clubs).
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
        <Divider mt={8} />
        <Box textAlign="center" {...styles.text} pb={2}>
          Made with 💖 from San Diego
          <br />
          <Link href="https://forms.gle/jPd276dcsLVPswBZ7" target="_blank">
            📋 Feedback Form
          </Link>
          <br />
          <Link href="https://github.com/AdoryVo/big-two" target="_blank">
            🔗 Source Code
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
