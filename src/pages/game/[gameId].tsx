import {
  Box, Button, Container, Heading, Input, Link as ChakraLink,
  ListItem, OrderedList,
  Text, useToast
} from '@chakra-ui/react'
import { Player } from '@prisma/client'
import ky from 'ky'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useEffect, useState } from 'react'

import useGame from '../../lib/hooks/useGame'
import { usePusher } from '../../lib/hooks/usePusher'
import { GameWithPlayers } from '../../lib/prisma'
import { Event } from '../../lib/pusher'

const enum Action {
  Ping = 'ping',
  Join = 'join',
  Start = 'start',
  End = 'end'
}

function BasePage({ children }: { children?: React.ReactNode }) {
  return (
    <Container p={5}>
      <Link href="/" passHref>
        <Button colorScheme="facebook" mb={4} me={2}>Home</Button>
      </Link>

      {children}
    </Container>
  )
}

export default function Game() {
  const pusher = usePusher()
  const toast = useToast()

  /** calling mutate tells the server to refetch the game state */
  const {
    game, isLoading, error, mutate,
  } = useGame()
  const [gameInProgress, setGameInProgress] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])

  const [name, setName] = useState('')
  const [playerId, setPlayerId] = useState('')

  useEffect(() => {
    if (isLoading || !game) {
      return
    }

    setGameInProgress(Boolean(game.currentPlayer))
    setPlayers(game.players)

    const storedPlayerId = localStorage.getItem('playerId')
    if (storedPlayerId) {
      if (!game.players.length) {
        localStorage.removeItem('playerId')
      } else {
        setPlayerId(storedPlayerId)
      }
    }

    const channel = pusher.subscribe(game.id)
    channel.unbind()
    channel.bind(Event.LobbyUpdate, (game: GameWithPlayers) => {
      mutate(game, { revalidate: false })
    })

    channel.bind(Event.StartGame, (game: GameWithPlayers) => {
      setGameInProgress(true)
      mutate(game, { revalidate: false })
    })

    channel.bind(Event.EndGame, (game: GameWithPlayers) => {
      setGameInProgress(false)
      setPlayers([])
      setPlayerId('')
      localStorage.removeItem('playerId')

      mutate(game, { revalidate: false })
    })

    channel.bind(Event.Pong, () => {
      toast({
        title: 'Pong!',
        status: 'success',
        duration: 1000,
        isClosable: true,
      })
    })
  }, [game, isLoading, pusher, mutate, toast])

  // Handles player actions by sending server requests
  function handleAction(action: Action) {
    if (!game) {
      return
    }

    const url = `/api/${game.id}/${action}`
    let options = {}

    switch (action) {
      case Action.Ping:
        ky.get(url)
        break
      case Action.Join:
        if (!name) {
          toast({
            title: 'Error',
            description: 'Please enter a valid name!',
            status: 'error',
          })
          return
        }
        options = { json: { name } }
        ky.post(url, options).json<GameWithPlayers>().then((game) => {
          const player = game.players.at(-1)
          if (player) {
            localStorage.setItem('playerId', player.id)
            setPlayerId(player.id)
          }
        })
        break
      case Action.Start:
      case Action.End:
        ky.patch(url)
        break
    }
  }

  function getPageTitle() {
    if (gameInProgress && game) {
      return `⚔️ ${game.players.length} players`
    } else {
      return '🧍 Waiting for players...'
    }
  }

  function copyGameLink() {
    navigator.clipboard.writeText(window.location.toString())
    toast({
      title: 'Lobby link copied!',
      status: 'success',
      duration: 1500,
      isClosable: true,
    })
  }

  if (isLoading || !game || error) {
    return <><NextSeo title="Lobby | Big Two" description="Join and play!" /><BasePage /></>
  }

  return (
    <>
      <NextSeo
        title={`${getPageTitle()} | Big Two`}
      />
      <BasePage>
        <Heading>Game Lobby</Heading>
        <Text mb={5}>
          <ChakraLink
            onClick={copyGameLink}
            _focus={{ fontStyle: 'italic' }}
            tabIndex={1}
            title="Copy lobby link"
            color="teal.500"
            fontWeight="bold"
          >
            Lobby ID: {game.id} 🔗
          </ChakraLink>
        </Text>

        {gameInProgress ? (
          <>
            {/* Player view: current hand */}
            {game.players.find((player) => player.id == playerId) &&
              <Box my={5} py={2}>
                {JSON.stringify(game.players.find((player) => player.id == playerId))}
              </Box>
            }

            {/* Spectator view */}
            {!playerId && (
              <Box my={5} py={2}>
                <Heading size="md">Spectating...</Heading>
                {game.players.map((player, index) => (
                  <Box key={index} mb={5}>
                    <Heading size="sm">Hand {index}</Heading>
                    {JSON.stringify(player)}
                  </Box>
                ))}
              </Box>
            )}

            <Button onClick={() => handleAction(Action.End)} colorScheme="red" mb={4} me={2}>
              End Game
            </Button>
          </>
        ) : (
          <>
            {/* Game Lobby Controls */}
            <Button
              onClick={() => handleAction(Action.Start)}
              isLoading={players.length < 2}
              loadingText="Need more players to start..."
              colorScheme="green"
              mb={4}
              me={2}
            >
              Start Game
            </Button>
            <Button onClick={() => handleAction(Action.Ping)} colorScheme="purple" mb={4}>
              Ping game channel
            </Button>

            {/* Current players list */}
            <Heading size="lg">Current players</Heading>
            {!players.length && 'No players currently, join in!'}

            <OrderedList mb={5}>
              {players.map((player, index) =>
                <ListItem key={index} fontWeight={player.id === playerId ? 'bold' : ''}>
                  {player.name}
                </ListItem>
              )}
            </OrderedList>

            {/* Join game prompt */}
            {!playerId && (
              <>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  maxLength={24}
                  w="50%"
                  me={2} />
                <br />
                <Button onClick={() => handleAction(Action.Join)} colorScheme="blue" mt={2}>
                  Join next game
                </Button>
              </>
            )}
          </>
        )}
      </BasePage>
    </>
  )
}
